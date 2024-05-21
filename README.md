# zkSync Development Handbook

## Overview

zkSync offers the manageability, expandability, and robustness of Ethereum, allowing developers to build scalable, efficient, and secure applications regardless of their level of expertise. This handbook will help you become a proficient zkSync developer by covering zkSync technology, providing practical lessons, and delving into advanced technical topics.

### Why zkSync?

zkSync is a Layer 2 solution that leverages zero-knowledge rollups to provide faster transaction times and lower fees while maintaining Ethereum's security. By processing transactions off-chain and combining them into a single proof for on-chain verification, zkSync reduces gas fees and congestion, making Ethereum more accessible and efficient.

## Getting Started with zkSync

### Configuring our Development Environment

1. **Install Node.js**: Ensure Node.js is installed. Download it from [Node.js](https://nodejs.org/) if it's not already installed.

2. **Install Hardhat**: Install Hardhat globally as your Ethereum development environment:

   ```bash
   npm install --global hardhat
   ```

3. **Create a New zkSync Project**: Set up a new Hardhat project directory:

   ```bash
   mkdir my-zksync-project
   cd my-zksync-project
   npx hardhat
   ```

### Connecting to zkSync

Add zkSync support to your project by installing the necessary dependencies:

```bash
npm install @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy
```

Configure `hardhat.config.js`:

```javascript
require("@matterlabs/hardhat-zksync");
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-chai-matchers");

module.exports = {
  zkSyncDeploy: {
    zkSyncNetwork: "https://zksync2-testnet.zksync.dev",
    ethNetwork: "https://eth-rinkeby.alchemyapi.io/v2/your-api-key",  // Replace with your Alchemy API key for Rinkeby
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

```

## Building Your First zkSync Smart Contract

### Creating a Simple ERC-20 Token

1. **Create Contract**: In the `contracts` directory, create `MyToken.sol`:

   ```solidity

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}

   ```

2. **Deploy Contract**: Create a deployment script in the `scripts` directory, `deployMultiSig.js`:

   ```javascript
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


   ```

3. **Deploy on zkSync Testnet**:

   ```bash
   npx hardhat run scripts/deployToken.js --network zkSyncTestnet
   ```

## Advanced zkSync Topics

### zkSync Account Abstraction

zkSync supports account abstraction, allowing for flexible and user-friendly account management. Unlike Ethereum’s traditional accounts, zkSync accounts can include custom logic for signing transactions, enabling features like social recovery and multi-signature wallets.

**Example: Multi-Signature Wallet**

1. **MultiSig Contract**:

   ```solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.0;

   contract MultiSigWallet {
       address[] public owners;
       uint public required;
       mapping(address => bool) public isOwner;

       struct Transaction {
           address to;
           uint value;
           bool executed;
       }

       Transaction[] public transactions;

       constructor(address[] memory _owners, uint _required) {
           require(_owners.length > 0, "Owners required");
           require(_required > 0 && _required <= _owners.length, "Invalid required number of owners");

           for (uint i = 0; i < _owners.length; i++) {
               require(_owners[i] != address(0), "Invalid owner");
               isOwner[_owners[i]] = true;
           }

           owners = _owners;
           required = _required;
       }

       function submitTransaction(address _to, uint _value) public {
           require(isOwner[msg.sender], "Not owner");
           transactions.push(Transaction({
               to: _to,
               value: _value,
               executed: false
           }));
       }

       function confirmTransaction(uint _txIndex) public {
           require(isOwner[msg.sender], "Not owner");
           require(!transactions[_txIndex].executed, "Transaction already executed");

           uint count = 0;
           for (uint i = 0; i < owners.length; i++) {
               if (transactions[_txIndex].to != address(0)) {
                   count += 1;
               }
           }

           if (count >= required) {
               transactions[_txIndex].executed = true;
               (bool success, ) = transactions[_txIndex].to.call{value: transactions[_txIndex].value}("");
               require(success, "Transaction failed");
           }
       }
   }
   ```

2. **Deploy and Interact**: Deploy this multi-signature wallet and use it to manage funds in zkSync. This contract showcases the flexibility of zkSync’s account abstraction feature.

### zkSync and L1 ↔ L2 Messaging

zkSync supports excellent communication between Layer 1 and Layer 2, allowing developers to pass data from Ethereum to zkSync and from zkSync to Ethereum, enabling complex interactions between smart contracts across layers.

**Example: Cross-Layer Oracle**

1. **L1 Oracle Contract**:

   ```solidity
 
pragma solidity ^0.8.18;

contract L1Oracle {
    event DataSentToL2(bytes data);

    function sendDataToL2(bytes calldata data) external {
        emit DataSentToL2(data);
    }
}

   ```

2. **L2 Listener Contract**:

   ```solidity

pragma solidity ^0.8.18;

import "@matterlabs/zksync-contracts/l2/contracts/ZkSyncReceiver.sol";

contract L2Listener is ZkSyncReceiver {
    event DataReceived(bytes data);

    function onZkSyncMessage(bytes memory data) external override {
        emit DataReceived(data);
    }
}

   ```

Deploy the L1 Oracle and L2 Listener, and use them to pass data from Ethereum to zkSync, demonstrating the powerful interoperability zkSync offers.


### `.gitignore` File

Ensure you include a `.gitignore` file to ignore unnecessary files and folders:

```gitignore
# Node.js dependencies
node_modules/

# Hardhat build artifacts
artifacts/
cache/
coverage/

# Hardhat config files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS-specific files
.DS_Store
Thumbs.db

# IDE-specific files
.vscode/
.idea/
*.iml
```

### README.md

Create a `README.md` file to document your project:

```markdown
# zkSync Development Handbook


### Conclusion

zkSync is not just a robust and expandable solution; it's a gateway to a more excellent and accessible Ethereum. By providing a seamless developer experience, large security, and innovative features, zkSync empowers builders to create the next generation of decentralized applications.

Dive into zkSync, explore its capabilities, and build the future of blockchain with unprecedented scalability and efficiency. Happy building! 🚀

For further reading, check out the [zkSync documentation](https://zksync.io/) and join the zkSync [developer community](https://discord.gg/zksync).
