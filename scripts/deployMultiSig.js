require('dotenv').config();


const { Wallet, Provider, utils } = require("zksync-web3");
const { ethers } = require("hardhat");

async function main() {
  // Load the private key from environment variables or replace with a hardcoded one
  const PRIVATE_KEY = process.env.PRIVATE_KEY || "your-private-key";

  // Create a Wallet
  const zkSyncProvider = new Provider("https://zksync2-testnet.zksync.dev");
  const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider);

  // Load and deploy the MultiSigWallet contract
  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet", wallet);

  const owners = ["0xYourAddress1", "0xYourAddress2"]; // Replace with actual addresses
  const required = 2;

  const multiSigWallet = await MultiSigWallet.deploy(owners, required);

  await multiSigWallet.deployed();
  console.log("MultiSigWallet deployed to:", multiSigWallet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
