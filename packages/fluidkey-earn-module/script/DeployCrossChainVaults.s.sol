// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {CrossChainVaultReceiver} from "../src/CrossChainVaultReceiver.sol";
import {CrossChainVaultManager} from "../src/CrossChainVaultManager.sol";

/**
 * @title DeployCrossChainVaults
 * @notice Deployment script for cross-chain vault contracts
 * @dev Usage:
 * 
 * Deploy Receiver on Arbitrum:
 * forge script script/DeployCrossChainVaults.s.sol:DeployCrossChainVaults \
 *   --sig "deployReceiver()" \
 *   --rpc-url $ARBITRUM_RPC_URL \
 *   --broadcast \
 *   --verify
 * 
 * Deploy Manager on Base:
 * forge script script/DeployCrossChainVaults.s.sol:DeployCrossChainVaults \
 *   --sig "deployManager()" \
 *   --rpc-url $BASE_RPC_URL \
 *   --broadcast \
 *   --verify
 */
contract DeployCrossChainVaults is Script {
    // Across SpokePool addresses
    address constant ACROSS_SPOKE_POOL_BASE = 0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64;
    address constant ACROSS_SPOKE_POOL_ARBITRUM = 0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A;
    
    // Morpho vault to whitelist
    address constant MORPHO_GAUNTLET_USDC_CORE_ARBITRUM = 
        0x7e97fa6893871A2751B5fE961978DCCb2c201E65;
    
    // Chain IDs
    uint256 constant BASE_CHAIN_ID = 8453;
    uint256 constant ARBITRUM_CHAIN_ID = 42161;
    
    /**
     * @notice Deploy CrossChainVaultReceiver on Arbitrum
     */
    function deployReceiver() public {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address owner = vm.addr(deployerPrivateKey);
        
        console2.log("Deploying CrossChainVaultReceiver on Arbitrum...");
        console2.log("Owner:", owner);
        console2.log("Across SpokePool:", ACROSS_SPOKE_POOL_ARBITRUM);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy receiver
        CrossChainVaultReceiver receiver = new CrossChainVaultReceiver(
            ACROSS_SPOKE_POOL_ARBITRUM,
            owner
        );
        
        console2.log("CrossChainVaultReceiver deployed at:", address(receiver));
        
        // Whitelist Morpho vault
        receiver.setVaultAllowed(MORPHO_GAUNTLET_USDC_CORE_ARBITRUM, true);
        console2.log("Whitelisted vault:", MORPHO_GAUNTLET_USDC_CORE_ARBITRUM);
        
        vm.stopBroadcast();
        
        // Print deployment info
        console2.log("\n=== DEPLOYMENT COMPLETE ===");
        console2.log("Save these values to .env:");
        console2.log("CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM=%s", address(receiver));
    }
    
    /**
     * @notice Deploy CrossChainVaultManager on Base
     */
    function deployManager() public {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address owner = vm.addr(deployerPrivateKey);
        
        console2.log("Deploying CrossChainVaultManager on Base...");
        console2.log("Owner:", owner);
        console2.log("Across SpokePool:", ACROSS_SPOKE_POOL_BASE);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy manager
        CrossChainVaultManager manager = new CrossChainVaultManager(
            ACROSS_SPOKE_POOL_BASE,
            owner
        );
        
        console2.log("CrossChainVaultManager deployed at:", address(manager));
        
        // If receiver address is set in env, configure it
        address receiverAddress = vm.envOr("CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM", address(0));
        if (receiverAddress != address(0)) {
            manager.setChainReceiver(ARBITRUM_CHAIN_ID, receiverAddress);
            console2.log("Configured receiver for Arbitrum:", receiverAddress);
        } else {
            console2.log("WARNING: CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM not set");
            console2.log("Run this after deploying receiver:");
            console2.log(
                "cast send %s 'setChainReceiver(uint256,address)' 42161 <RECEIVER_ADDRESS>",
                address(manager)
            );
        }
        
        vm.stopBroadcast();
        
        // Print deployment info
        console2.log("\n=== DEPLOYMENT COMPLETE ===");
        console2.log("Save these values to .env:");
        console2.log("CROSS_CHAIN_VAULT_MANAGER_BASE=%s", address(manager));
    }
    
    /**
     * @notice Deploy both contracts (for testing)
     * @dev Deploys receiver first, then manager with receiver configured
     */
    function deployBoth() public {
        console2.log("This will deploy to BOTH chains.");
        console2.log("Make sure you have RPC URLs and keys for both Base and Arbitrum.\n");
        
        // Deploy receiver first
        deployReceiver();
        
        console2.log("\nNow switch to Base network and run deployManager()");
    }
}
