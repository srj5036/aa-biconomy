// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Deployer {
    address public deployedAddress;

    event ContractDepoyled(address contractAddress, address sender);

    function deploy(bytes memory bytecode) public {
        address newContract;
        // This assembly code will deploy a new contract with the provided bytecode
        assembly {
            newContract := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        require(newContract != address(0), "Failed to deploy contract");
        deployedAddress = newContract;

        emit ContractDepoyled(newContract, msg.sender);
    }
}
