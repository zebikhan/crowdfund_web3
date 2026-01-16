const hre = require("hardhat");

async function main() {
  const CrowdFund = await hre.ethers.getContractFactory("contracts/CrowdFundDirectMetadata.sol:CrowdFundDirectMetadata");

  // deploy contract
  const crowd = await CrowdFund.deploy();

  // ✅ v6 me `.deployed()` nahi hota, balki waitForDeployment() hota hai
  await crowd.waitForDeployment();

  console.log("CrowdFund deployed to:", await crowd.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
