// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

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
