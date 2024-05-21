require("@matterlabs/hardhat-zksync");
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-chai-matchers");

module.exports = {
  zkSyncDeploy: {
    zkSyncNetwork: "https://zksync2-testnet.zksync.dev",
    ethNetwork: "https://eth-rinkeby.alchemyapi.io/v2/your-api-key", // Replace with your Alchemy API key for Rinkeby
  },
  networks: {
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "rinkeby",
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.18",
  },
};
