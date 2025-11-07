// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {MinimalCrossChainVault} from "../src/MinimalCrossChainVault.sol";

/**
 * @title DeployMinimal
 * @notice Deploy the minimal cross-chain vault helper
 * 
 * Usage:
 * forge script script/DeployMinimal.s.sol:DeployMinimal \
 *   --rpc-url https://arb1.arbitrum.io/rpc \
 *   --broadcast \
 *   --verify
 */
contract DeployMinimal is Script {
    address constant ACROSS_SPOKE_POOL_ARBITRUM = 0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A;
    address constant MORPHO_VAULT_ARBITRUM = 0x7e97fa6893871A2751B5fE961978DCCb2c201E65;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        console2.log("Deploying MinimalCrossChainVault on Arbitrum...");
        console2.log("Across SpokePool:", ACROSS_SPOKE_POOL_ARBITRUM);
        console2.log("Morpho Vault:", MORPHO_VAULT_ARBITRUM);
        
        vm.startBroadcast(deployerPrivateKey);
        
        MinimalCrossChainVault vault = new MinimalCrossChainVault(
            ACROSS_SPOKE_POOL_ARBITRUM,
            MORPHO_VAULT_ARBITRUM
        );
        
        vm.stopBroadcast();
        
        console2.log("\n=== DEPLOYMENT COMPLETE ===");
        console2.log("MinimalCrossChainVault:", address(vault));
        console2.log("\nAdd to .env:");
        console2.log("NEXT_PUBLIC_MINIMAL_VAULT_ARBITRUM=%s", address(vault));
    }
}
