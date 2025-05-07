// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "forge-std/console.sol"; // For logging
import "../src/FluidkeyEarnModule.sol";

contract DeployAutoEarn is Script {
    /* ---------- constants (Base mainnet) ---------- */
    // IMPORTANT: Ensure RELAYER is the correct address you intend to use.
    // This is a placeholder and should be replaced with your actual relayer's EOA or contract address.
    address constant RELAYER = 0x1111111111111111111111111111111111111111;   // ← REPLACE THIS with your relayer address
    address constant WETH    = 0x4200000000000000000000000000000000000006;   // WETH on Base
    address constant USDC    = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;   // USDC on Base
    // This VAULT address is for Morpho USDC-Seamless on Base. Double-check if this is the intended vault.
    address constant VAULT   = 0x616a4E1db48e22028f6bbf20444Cd3b8e3273738;   // Morpho Seamless-USDC on Base
    uint256 constant CHAIN_ID = 8453;                                       // Base chainId

    function run() external {
        uint256 deployerPk = vm.envUint("DEPLOYER_PK");
        require(deployerPk != 0, "DEPLOYER_PK not set in .env file");

        vm.startBroadcast(deployerPk);

        /* 1. deploy the shared module */
        // The owner of the module will be the deployer address.
        // This owner is the only one who can call setConfig by default (assuming onlyOwner modifier).
        FluidkeyEarnModule module = new FluidkeyEarnModule(
            RELAYER,
            WETH,
            vm.addr(deployerPk) // owner == deployer
        );
        console.log("FluidkeyEarnModule deployed to:", address(module));
        console.log("  - Relayer:", RELAYER);
        console.log("  - WETH:", WETH);
        console.log("  - Owner:", vm.addr(deployerPk));


        /* 2. register the single (USDC → vault) config */
        // Assuming FluidkeyEarnModule has a struct `ConfigInput` and a function `setConfig(ConfigInput[] calldata)`
        FluidkeyEarnModule.ConfigInput[] memory cfg = new FluidkeyEarnModule.ConfigInput[](1);

        cfg[0] = FluidkeyEarnModule.ConfigInput({
            chainId: CHAIN_ID,
            inputToken: USDC,
            vaultAddress: VAULT
        });

        // Call setConfig on the newly deployed module
        // Make sure the `setConfig` function exists in FluidkeyEarnModule.sol
        // and that vm.addr(deployerPk) (the owner) is authorized to call it.
        module.setConfig(cfg);

        console.log("Configuration set on FluidkeyEarnModule:");
        console.log("  - Chain ID:", CHAIN_ID);
        console.log("  - Input Token (USDC):", USDC);
        console.log("  - Vault Address:", VAULT);

        vm.stopBroadcast();
    }
}