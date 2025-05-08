// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/FluidkeyEarnModule.sol";

contract BootstrapAutoEarn is Script {
    function run() external {
        /* --- 0. load dot-env --- */
        uint256 deployerPk = vm.envUint("DEPLOYER_PK");      // hot key with 0.02 ETH on Base
        address relayer    = vm.envAddress("RELAYER_ADDR");  // same EOA you'll watch from
        address weth       = 0x4200000000000000000000000000000000000006; // canonical WETH on Base

        /* --- 1. USDC → Morpho vault mapping --- */
        uint256 chainId = 8453;  // Base mainnet
        address usdc    = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
        address vault   = 0x616a4E1db48e22028f6bbf20444Cd3b8e3273738; // Seamless USDC vault

        /* --- 2. broadcast --- */
        vm.startBroadcast(deployerPk);

        // deploy the shared module (owner = deployer)
        FluidkeyEarnModule mod = new FluidkeyEarnModule(relayer, weth, msg.sender);

        // build config array (single entry)
        FluidkeyEarnModule.ConfigInput[] memory cfg = new FluidkeyEarnModule.ConfigInput[](1);
        cfg[0] = FluidkeyEarnModule.ConfigInput({
            chainId: chainId,
            token:   usdc,
            vault:   vault
        });

        // store config in module
        mod.setConfig(cfg);

        // compute hash so front-end can reference it
        uint256 configHash = uint256(keccak256(abi.encode(cfg)));

        vm.stopBroadcast();

        console2.log("AUTO_EARN_MODULE  ", address(mod));
        console2.log("CONFIG_HASH       ", configHash);
    }
}