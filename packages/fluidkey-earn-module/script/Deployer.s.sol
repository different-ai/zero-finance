// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { FluidkeyEarnModule } from "../src/FluidkeyEarnModule.sol";
import { CREATE3Factory } from "../src/create-3-proxy/CREATE3Factory.sol";

contract DeploymentScript is Script {
    function run(
        address authorizedRelayer,
        address wrappedNative,
        address owner,
        bytes32 salt
    ) public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Get the FluidkeyEarnModule bytecode without constructor arguments
        bytes memory moduleCreationCode = type(FluidkeyEarnModule).creationCode;
        
        // Calculate the bytecode hash that needs to match ALLOWED_BYTECODE_HASH in CREATE3Factory
        bytes32 bytecodeHash = keccak256(moduleCreationCode);
        console.log("FluidkeyEarnModule bytecode hash:");
        console.logBytes32(bytecodeHash);

        // Try to deploy CREATE3Factory, catch if already deployed
        CREATE3Factory factory;
        try new CREATE3Factory{salt: salt}(bytecodeHash) returns (CREATE3Factory newFactory) {
            factory = newFactory;
            console.log("CREATE3Factory deployed at:", address(factory));
        } catch {
            // Calculate the address where CREATE3Factory should be
            bytes memory factoryCreationCode = abi.encodePacked(
                type(CREATE3Factory).creationCode,
                abi.encode(bytecodeHash)
            );
            // Use the canonical CREATE2 factory (0age's factory) that's deployed on most EVM chains and used by default from Foundry
            address factoryAddress = vm.computeCreate2Address(
                salt,
                keccak256(factoryCreationCode),
                0x4e59b44847b379578588920cA78FbF26c0B4956C
            );
            factory = CREATE3Factory(factoryAddress);
            console.log("Found existing CREATE3Factory at:", address(factory));
        }

        // Prepare the full creation code for FluidkeyEarnModule with constructor arguments
        bytes memory fullModuleCreationCode = abi.encodePacked(
            moduleCreationCode,
            abi.encode(authorizedRelayer, wrappedNative, owner)
        );

        // Prepare the calldata for deploying FluidkeyEarnModule via CREATE3Factory
        bytes memory deployCalldata = abi.encodeWithSelector(
            CREATE3Factory.deploy.selector,
            salt,
            fullModuleCreationCode
        );

        console.log("\nDeployment Information:");
        console.log("- CREATE3Factory Address:", address(factory));
        console.log("- Authorized Relayer:", authorizedRelayer);
        console.log("- Wrapped Native:", wrappedNative);
        console.log("- OWner:", owner);
        console.log("- Salt:", uint256(salt));
        console.log("\nCalldata for deploying FluidkeyEarnModule via CREATE3Factory:");
        console.logBytes(deployCalldata);
    }
}