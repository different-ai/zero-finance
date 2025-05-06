// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import {CREATE3} from "./lib/CREATE3.sol";
import {ICREATE3Factory} from "./ICREATE3Factory.sol";

/// @title Factory for deploying contracts to deterministic addresses via CREATE3
/// @author zefram.eth
/// @notice Enables deploying contracts using CREATE3. Each deployer (msg.sender) has
/// its own namespace for deployed addresses.
contract CREATE3Factory is ICREATE3Factory {
    // Store bytecode hash as immutable
    bytes32 public immutable ALLOWED_BYTECODE_HASH;

    /// @notice Constructor to set the allowed bytecode hash
    /// @param allowedBytecodeHash The hash of the contract bytecode that's allowed to be deployed
    constructor(bytes32 allowedBytecodeHash) {
        ALLOWED_BYTECODE_HASH = allowedBytecodeHash;
    }

    /// @inheritdoc	ICREATE3Factory
    function deploy(bytes32 salt, bytes memory creationCode)
        external
        payable
        override
        returns (address deployed)
    {
        // Validate the contract bytecode
        uint256 codeLength = creationCode.length;
        require(codeLength > 32, "Creation code too short");

        // Verify the bytecode hash matches the allowed hash
        bytes32 codeHash;
        assembly {
            // Hash only the part of creationCode without the constructor parameters
            // add(creationCode, 0x20) skips the length prefix of the bytes array
            // sub(codeLength, 96) is the length of code without constructor args (x3 uint256)
            codeHash := keccak256(add(creationCode, 0x20), sub(codeLength, 96))
        }
        require(codeHash == ALLOWED_BYTECODE_HASH, "Invalid contract bytecode");
        
        // hash salt with the deployer address to give each deployer its own namespace
        salt = keccak256(abi.encodePacked(msg.sender, salt));
        return CREATE3.deploy(salt, creationCode, msg.value);
    }

    /// @inheritdoc	ICREATE3Factory
    function getDeployed(address deployer, bytes32 salt)
        external
        view
        override
        returns (address deployed)
    {
        // hash salt with the deployer address to give each deployer its own namespace
        salt = keccak256(abi.encodePacked(deployer, salt));
        return CREATE3.getDeployed(salt);
    }
}
