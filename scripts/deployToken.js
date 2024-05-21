require('dotenv').config();

const { Wallet, Provider, utils } = require("zksync-web3");
const { ethers } = require("hardhat");

async function main() {
  // Load the private key from environment variables or replace with a hardcoded one
  const PRIVATE_KEY = process.env.PRIVATE_KEY || "your-private-key";

  // Create a Wallet
  const zkSyncProvider = new Provider("https://zksync2-testnet.zksync.dev");
  const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider);

  // Load and deploy the MyToken contract
  const MyToken = await ethers.getContractFactory("MyToken", wallet);
  const myToken = await MyToken.deploy();

  await myToken.deployed();
  console.log("MyToken deployed to:", myToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
