// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {FluidkeyEarnModule} from "../src/FluidkeyEarnModule.sol";
import {FluidkeyBaseConfig} from "./FluidkeyBaseConfig.sol";

contract ConfigSetterScript is Script {
    function run() public {
        // Get the full array of configs
        FluidkeyEarnModule.ConfigInput[] memory configs = FluidkeyBaseConfig.getAllConfigs();

        // Calculate configHash
        bytes32 rawHash = keccak256(abi.encode(configs));

        // Encode the calldata for setConfig
        bytes memory callData = abi.encodeWithSelector(
            FluidkeyEarnModule.setConfig.selector,
            configs
        );

        // Print info
        console.log("Number of configurations:", configs.length);
        console.log("configHash (hex):");
        console.logBytes32(rawHash);

        console.log("\nCalldata for setConfig:");
        console.logBytes(callData);
    }
}
