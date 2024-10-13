const hre = require("hardhat");

async function main() {
  const EventPlatform = await hre.ethers.getContractFactory(
    "DecentralizedEventPlatform"
  );
  const eventPlatform = await EventPlatform.deploy();

  await eventPlatform.deployed();

  console.log("DecentralizedEventPlatform deployed to:", eventPlatform.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });