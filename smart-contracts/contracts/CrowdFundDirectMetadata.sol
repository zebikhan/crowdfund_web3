// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title CrowdFundDirectMetadata
/// @notice Campaigns with metadata hash, native or ERC20 contributions, immediate forwarding
contract CrowdFundDirectMetadata is ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public campaignCount;

    enum ContributionType { MATIC, ERC20 }

    struct Campaign {
        uint256 id;
        address payable owner;
        string metadataCid;      
        uint256 goal;            
        uint256 totalRaisedNative;
        mapping(address => uint256) totalRaisedERC20;
        uint256 deadline;
        bool active;
        ContributionType contributionType;
        address acceptedToken;   // ERC20 token if ERC20
    }

    mapping(uint256 => Campaign) private campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributionsNative;
    mapping(uint256 => mapping(address => mapping(address => uint256))) public contributionsERC20;
    mapping(uint256 => mapping(address => bool)) private _hasContributed;
    mapping(uint256 => uint256) public contributorCount;

    // ------------------------------
    // Events
    // ------------------------------
    event CampaignCreated(
        uint256 indexed id,
        address indexed owner,
        uint256 goal,
        uint256 deadline,
        ContributionType ctype,
        address token
    );
    event ContributedNative(uint256 indexed id, address indexed from, uint256 amount);
    event ContributedERC20(uint256 indexed id, address indexed from, address indexed token, uint256 amount);
    event ForwardedNative(uint256 indexed id, address indexed to, uint256 amount);
    event ForwardedERC20(uint256 indexed id, address indexed to, address indexed token, uint256 amount);
    event CampaignClosed(uint256 indexed id);

    // ------------------------------
    // Create a campaign
    // ------------------------------
    function createCampaign(
        string calldata _metadataCid,
        uint256 _goal,
        uint256 _durationSeconds,
        ContributionType _ctype,
        address _erc20Token
    ) external returns (uint256) {
        require(bytes(_metadataCid).length > 0, "Metadata required");
        require(_goal > 0, "Goal must be > 0");
        require(_durationSeconds >= 1 hours, "Min duration 1 hour");
        if (_ctype == ContributionType.ERC20) require(_erc20Token != address(0), "ERC20 token required");

        campaignCount++;
        uint256 id = campaignCount;

        Campaign storage c = campaigns[id];
        c.id = id;
        c.owner = payable(msg.sender);
        c.metadataCid = _metadataCid;
        c.goal = _goal;
        c.deadline = block.timestamp + _durationSeconds;
        c.active = true;
        c.contributionType = _ctype;
        if (_ctype == ContributionType.ERC20) c.acceptedToken = _erc20Token;

        emit CampaignCreated(id, msg.sender, _goal, c.deadline, _ctype, c.acceptedToken);
        return id;
    }

    // ------------------------------
    // Close campaign
    // ------------------------------
    function closeCampaign(uint256 _id) external {
        Campaign storage c = campaigns[_id];
        require(c.id != 0, "Not found");
        require(msg.sender == c.owner, "Only owner");
        require(c.active, "Already closed");
        c.active = false;
        emit CampaignClosed(_id);
    }

    // ------------------------------
    // Contribute Native (MATIC)
    // ------------------------------
    function contributeNative(uint256 _id) external payable nonReentrant {
        Campaign storage c = campaigns[_id];
        require(c.id != 0, "Not found");
        require(c.active, "Not active");
        require(c.contributionType == ContributionType.MATIC, "Native not allowed");
        require(block.timestamp < c.deadline, "Ended");
        require(msg.value > 0, "Zero");
        // require(msg.sender != c.owner, "Owner cannot contribute");

        if (!_hasContributed[_id][msg.sender]) {
            _hasContributed[_id][msg.sender] = true;
            contributorCount[_id]++;
        }

        contributionsNative[_id][msg.sender] += msg.value;
        c.totalRaisedNative += msg.value;

        (bool sent, ) = c.owner.call{value: msg.value}("");
        require(sent, "Forward failed");

        emit ForwardedNative(_id, c.owner, msg.value);
        emit ContributedNative(_id, msg.sender, msg.value);
    }

    // ------------------------------
    // Contribute ERC20
    // ------------------------------
    function contributeERC20(uint256 _id, uint256 _amount) external nonReentrant {
        Campaign storage c = campaigns[_id];
        require(c.id != 0, "Not found");
        require(c.active, "Not active");
        require(c.contributionType == ContributionType.ERC20, "ERC20 not allowed");
        require(block.timestamp < c.deadline, "Ended");
        require(_amount > 0, "Zero");
        require(msg.sender != c.owner, "Owner cannot contribute");

        if (!_hasContributed[_id][msg.sender]) {
            _hasContributed[_id][msg.sender] = true;
            contributorCount[_id]++;
        }

        IERC20(c.acceptedToken).safeTransferFrom(msg.sender, c.owner, _amount);
        contributionsERC20[_id][c.acceptedToken][msg.sender] += _amount;
        c.totalRaisedERC20[c.acceptedToken] += _amount;

        emit ForwardedERC20(_id, c.owner, c.acceptedToken, _amount);
        emit ContributedERC20(_id, msg.sender, c.acceptedToken, _amount);
    }

    // ------------------------------
    // Views
    // ------------------------------
    function getCampaign(uint256 _id)
        external
        view
        returns (
            uint256 id,
            address owner,
            string memory metadataCid,
            uint256 goal,
            uint256 totalRaisedNative,
            uint256 deadline,
            bool active,
            ContributionType contributionType,
            address acceptedToken,
            uint256 contributors
        )
    {
        Campaign storage c = campaigns[_id];
        require(c.id != 0, "Not found");
        return (
            c.id,
            c.owner,
            c.metadataCid,
            c.goal,
            c.totalRaisedNative,
            c.deadline,
            c.active,
            c.contributionType,
            c.acceptedToken,
            contributorCount[_id]
        );
    }

    function contributionNativeOf(uint256 _id, address _user) external view returns (uint256) {
        return contributionsNative[_id][_user];
    }

    function contributionERC20Of(uint256 _id, address _user) external view returns (uint256) {
        Campaign storage c = campaigns[_id];
        return contributionsERC20[_id][c.acceptedToken][_user];
    }

    function totalRaisedERC20Of(uint256 _id) external view returns (uint256) {
        Campaign storage c = campaigns[_id];
        return c.totalRaisedERC20[c.acceptedToken];
    }

    // ------------------------------
    // Safety
    // ------------------------------
    receive() external payable { revert("Use contributeNative()"); }
    fallback() external payable { revert("Use contributeNative()"); }
}
