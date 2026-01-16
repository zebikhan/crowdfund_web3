// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// contract CrowdFundDirect is ReentrancyGuard {
//     uint256 public campaignCount;

//     struct Campaign {
//         uint256 id;
//         address payable owner;
//         string title;
//         string descriptionCid;
//         uint256 goal;
//         uint256 totalRaised;
//         uint256 deadline;
//         bool active;
//     }

//     mapping(uint256 => Campaign) public campaigns;
//     mapping(uint256 => mapping(address => uint256)) public contributions;
//     mapping(uint256 => uint256) public contributorCount;
//     mapping(uint256 => mapping(address => bool)) private _hasContributed;

//     event CampaignCreated(uint256 indexed id, address indexed owner, uint256 goal, uint256 deadline);
//     event Contributed(uint256 indexed id, address indexed from, uint256 amount);
//     event Forwarded(uint256 indexed id, address indexed to, uint256 amount);
//     event CampaignClosed(uint256 indexed id);

//     function createCampaign(string calldata _title, string calldata _descriptionCid, uint256 _goalWei, uint256 _durationSeconds) external returns (uint256) {
//         require(bytes(_title).length > 0, "Title required");
//         require(_goalWei > 0, "Goal > 0");
//         require(_durationSeconds >= 1 hours, "Duration min 1 hour");

//         campaignCount++;
//         uint256 id = campaignCount;

//         campaigns[id] = Campaign({
//             id: id,
//             owner: payable(msg.sender),
//             title: _title,
//             descriptionCid: _descriptionCid,
//             goal: _goalWei,
//             totalRaised: 0,
//             deadline: block.timestamp + _durationSeconds,
//             active: true
//         });

//         emit CampaignCreated(id, msg.sender, _goalWei, campaigns[id].deadline);
//         return id;
//     }

//     function contribute(uint256 _id) external payable nonReentrant {
//         Campaign storage c = campaigns[_id];
//         require(c.id != 0, "Campaign not found");
//         require(c.active, "Campaign not active");
//         require(block.timestamp < c.deadline, "Campaign ended");
//         require(msg.value > 0, "Zero contribution");

//         if (!_hasContributed[_id][msg.sender]) {
//             _hasContributed[_id][msg.sender] = true;
//             contributorCount[_id] += 1;
//         }
//         contributions[_id][msg.sender] += msg.value;
//         c.totalRaised += msg.value;

//         (bool sent, ) = c.owner.call{value: msg.value}("");
//         require(sent, "Forward failed");

//         emit Forwarded(_id, c.owner, msg.value);
//         emit Contributed(_id, msg.sender, msg.value);
//     }

//     function closeCampaign(uint256 _id) external {
//         Campaign storage c = campaigns[_id];
//         require(c.id != 0, "Campaign not found");
//         require(msg.sender == c.owner, "Only owner");
//         require(c.active, "Already closed");
//         c.active = false;
//         emit CampaignClosed(_id);
//     }

//     function getCampaign(
//         uint256 _id
//     )
//         external
//         view
//         returns (
//             uint256 id,
//             address owner,
//             string memory title,
//             string memory descriptionCid,
//             uint256 goal,
//             uint256 totalRaised,
//             uint256 deadline,
//             bool active,
//             uint256 contributors
//         )
//     {
//         Campaign storage c = campaigns[_id];
//         require(c.id != 0, "Campaign not found");
//         return (
//             c.id,
//             c.owner,
//             c.title,
//             c.descriptionCid,
//             c.goal,
//             c.totalRaised,
//             c.deadline,
//             c.active,
//             contributorCount[_id]
//         );
//     }

//     function contributionOf(
//         uint256 _id,
//         address _user
//     ) external view returns (uint256) {
//         return contributions[_id][_user];
//     }
// }
