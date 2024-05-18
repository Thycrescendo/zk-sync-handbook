async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy();
    console.log("Token deployed to:", token.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  