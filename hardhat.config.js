require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-deploy");

module.exports = {
  zksync: {
    version: "beta",
    compilerType: "zksolc",
    compilerVersion: "1.2.0",
    settings: {},
  },
  networks: {
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "rinkeby",
      zksync: true,
    },
  },
  solidity: "0.8.24",
};
