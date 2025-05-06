// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import { Test } from "forge-std/Test.sol";
import { FluidkeyEarnModule } from "../src/FluidkeyEarnModule.sol";
import { SafeModuleSetup } from "../src/SafeModuleSetup.sol";
import { MultiSend } from "../lib/safe-tools/lib/safe-contracts/contracts/libraries/MultiSend.sol";
import { SafeProxyFactory } from
    "../lib/safe-tools/lib/safe-contracts/contracts/proxies/SafeProxyFactory.sol";
import { Safe } from "../lib/safe-tools/lib/safe-contracts/contracts/Safe.sol";
import { IERC20 } from "forge-std/interfaces/IERC20.sol";
import { IERC4626 } from "forge-std/interfaces/IERC4626.sol";
import { FluidkeyEarnModule as FM } from "../src/FluidkeyEarnModule.sol"; 
// Just an alias to shorten references
import { console } from "forge-std/console.sol";

/**
 * @dev This test suite has been adapted to match the updated FluidkeyEarnModule contract,
 *      which uses configHash-based configuration. The `onInstall` now only accepts a
 *      single uint256 representing the configHash, and config sets are created/updated
 *      solely by the module owner using `setConfig`.
 */
contract FluidkeyEarnModuleTest is Test {
    // Contracts
    FluidkeyEarnModule internal module;
    SafeModuleSetup internal safeModuleSetup;
    MultiSend internal multiSend;
    SafeProxyFactory internal safeProxyFactory;

    // Known ERC20 addresses (Base chain placeholders)
    IERC20 public USDC = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);
    IERC20 public WETH = IERC20(0x4200000000000000000000000000000000000006);
    address public ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    // Sample ERC4626 vaults (on Base)
    IERC4626 public RE7_USDC_ERC4626 = IERC4626(0x12AFDeFb2237a5963e7BAb3e2D46ad0eee70406e);
    IERC4626 public GAUNTLET_WETH_ERC4626 = IERC4626(0x6b13c060F13Af1fdB319F52315BbbF3fb1D88844);
    
    // For demonstration
    // Another example vault if needed in tests
    IERC4626 public STEAKHOUSE_USDC_ERC4626 = IERC4626(0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183);

    // The private key and derived address used as an authorized relayer
    uint256 constant RELAYER_PRIVATE_KEY =
        0x35383d0f6ff2fa6b3f8de5425f4d6227b20d1a7a02bff9b00e9458db39e07e28;
    address internal authorizedRelayer;

    // Owner addresses
    address internal moduleOwner;
    address internal owner; // We use it as the Safe's initial owner

    // Deployed Safe address
    address internal safe;

    // For chain forking
    uint256 internal baseFork;

    // Data used to set up the Safe with multisend
    bytes internal moduleInitData;
    bytes internal moduleSettingData;

    function setUp() public {
        // Create a fork on Base
        string memory DEPLOYMENT_RPC = vm.envString("RPC_URL_BASE");
        baseFork = vm.createSelectFork(DEPLOYMENT_RPC);
        vm.selectFork(baseFork);

        // Create test addresses
        owner = makeAddr("bob");          // Safe's owner
        moduleOwner = makeAddr("moduleDeployer");
        authorizedRelayer = vm.addr(RELAYER_PRIVATE_KEY);

        // Deploy the module from `moduleOwner`
        vm.startPrank(moduleOwner);
        module = new FluidkeyEarnModule(authorizedRelayer, address(WETH), moduleOwner);
        vm.stopPrank();

        // Pre-deployed system addresses used for Safe setup on Base
        safeModuleSetup = SafeModuleSetup(0x2dd68b007B46fBe91B9A7c3EDa5A7a1063cB5b47);
        multiSend = MultiSend(0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526);
        safeProxyFactory = SafeProxyFactory(0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67);

        // ---------------------------------------------------------------------
        // 1) As moduleOwner, define our config inputs and set them on the module
        // ---------------------------------------------------------------------
        vm.startPrank(moduleOwner);

        // We create an array of 2 config entries, for chainId=8453 (Base) just as example
        // You can adjust the chainId to match your actual chain if needed.
        FM.ConfigInput[] memory newConfigs = new FM.ConfigInput[](2);
        newConfigs[0] = FM.ConfigInput({
            token: address(USDC),
            vault: address(RE7_USDC_ERC4626),
            chainId: 8453
        });
        newConfigs[1] = FM.ConfigInput({
            token: ETH,
            vault: address(GAUNTLET_WETH_ERC4626),
            chainId: 8453
        });

        // Set the config on the module (owner-only)
        module.setConfig(newConfigs);

        // Compute the configHash we just created
        uint256 configHash = uint256(keccak256(abi.encode(newConfigs)));

        vm.stopPrank();

        // ---------------------------------------------------
        // 2) Prepare the multisend data to install the module
        // ---------------------------------------------------
        // We'll enable the module on the new Safe,
        // then call onInstall with the configHash (via multiSend).

        // enableModules => pass in array with our newly deployed module
        address[] memory modules = new address[](1);
        modules[0] = address(module);
        moduleInitData = abi.encodeWithSelector(safeModuleSetup.enableModules.selector, modules);
        uint256 moduleInitDataLength = moduleInitData.length;

        // The second call is `module.onInstall(abi.encode(configHash))`
        moduleSettingData = abi.encodeWithSelector(
            module.onInstall.selector,
            abi.encode(configHash)
        );
        uint256 moduleSettingDataLength = moduleSettingData.length;

        // multiSend data
        bytes memory multisendData = abi.encodePacked(
            uint8(1),                       // operation = 1 (delegatecall)
            address(safeModuleSetup),
            uint256(0),
            moduleInitDataLength,
            moduleInitData,
            uint8(0),                       // operation = 0 (call)
            address(module),
            uint256(0),
            moduleSettingDataLength,
            moduleSettingData
        );
        multisendData = abi.encodeWithSelector(multiSend.multiSend.selector, multisendData);

        // We set up the Safe with 1 owner: `owner`
        address[] memory ownerAddresses = new address[](1);
        ownerAddresses[0] = owner;

        // Data for setting up the Safe
        bytes memory initData = abi.encodeWithSelector(
            Safe.setup.selector,
            ownerAddresses,        // _owners
            1,                     // _threshold
            address(multiSend),    // to (used in fallback)
            multisendData,         // data
            address(0),           // fallbackHandler
            address(0),           // paymentToken
            0,                     // payment
            payable(address(0))    // paymentReceiver
        );

        // Deploy the Safe proxy
        safe = payable(
            safeProxyFactory.createProxyWithNonce(
                address(0x29fcB43b46531BcA003ddC8FCB67FFE91900C762), // Singleton GnosisSafeL2
                initData,
                100
            )
        );
    }

    // ----------------------------------------------------------
    //               TESTS ADAPTED FOR NEW CONTRACT
    // ----------------------------------------------------------

    function test_Deployment() public view {
        bool isInitialized = module.isInitialized(safe);
        assertEq(isInitialized, true, "Module is not initialized on Safe");
    }

    function test_AutoEarnWithRelayerErc20() public {
        // Give the Safe some USDC
        deal(address(USDC), safe, 100_000_000);

        // As an authorized relayer, call autoEarn
        vm.startPrank(authorizedRelayer);
        module.autoEarn(address(USDC), 100_000_000, safe);
        vm.stopPrank();

        // Check that the Safe's USDC balance is now 0
        uint256 balance = USDC.balanceOf(safe);
        assertEq(balance, 0, "USDC balance not zero after autoEarn");

        // Check that we got vault shares in RE7_USDC_ERC4626
        uint256 balanceOfVault = RE7_USDC_ERC4626.balanceOf(safe);
        assertGt(balanceOfVault, 0, "Vault share balance is 0");
    }

    function test_AutoEarnWithRelayerEth() public {
        // Give the Safe some ETH
        deal(safe, 1 ether);

        vm.startPrank(authorizedRelayer);
        module.autoEarn(ETH, 1 ether, safe);
        vm.stopPrank();

        uint256 balance = address(safe).balance;
        assertEq(balance, 0, "ETH balance not zero after autoEarn");

        uint256 balanceOfVault = GAUNTLET_WETH_ERC4626.balanceOf(safe);
        assertGt(balanceOfVault, 0, "Vault share balance is 0");
    }

    function test_AutoEarnWithoutRelayer() public {
        // Attempt to call autoEarn from an unauthorized address
        deal(address(USDC), safe, 100_000_000);
        address unauthorizedRelayer = makeAddr("unauthorizedRelayer");
        vm.startPrank(unauthorizedRelayer);

        vm.expectRevert(
            abi.encodeWithSelector(FluidkeyEarnModule.NotAuthorized.selector, unauthorizedRelayer)
        );
        module.autoEarn(address(USDC), 100_000_000, safe);
    }

    function test_AddRemoveRelayer() public {
        address newRelayer = makeAddr("newRelayer");

        // Add a new relayer from an existing relayer
        vm.startPrank(authorizedRelayer);
        module.addAuthorizedRelayer(newRelayer);
        vm.stopPrank();

        // Now remove the old relayer from the new relayer
        vm.startPrank(newRelayer);
        module.removeAuthorizedRelayer(authorizedRelayer);
        vm.stopPrank();

        // The old relayer is no longer authorized
        vm.startPrank(authorizedRelayer);
        vm.expectRevert(
            abi.encodeWithSelector(FluidkeyEarnModule.NotAuthorized.selector, authorizedRelayer)
        );
        module.addAuthorizedRelayer(authorizedRelayer);
        vm.stopPrank();

        // Attempt to remove self should revert
        vm.startPrank(newRelayer);
        vm.expectRevert(FluidkeyEarnModule.CannotRemoveSelf.selector);
        module.removeAuthorizedRelayer(newRelayer);
    }

    function test_AutoEarnWithModuleOwnerAsRelayer() public {
        // The module owner also has permission to call autoEarn
        deal(address(USDC), safe, 100_000_000);

        vm.startPrank(moduleOwner);
        module.autoEarn(address(USDC), 100_000_000, safe);
        vm.stopPrank();

        uint256 balance = USDC.balanceOf(safe);
        assertEq(balance, 0, "Safe still has USDC balance");
        uint256 balanceOfVault = RE7_USDC_ERC4626.balanceOf(safe);
        assertGt(balanceOfVault, 0, "Vault share balance is 0");
    }

    function test_AutoEarnWithValidSignature() public {
        // Give the Safe some USDC
        deal(address(USDC), safe, 100_000_000);

        // Sign the message with the authorized relayer's key
        uint256 nonce = 1234;
        bytes32 hash = keccak256(
            abi.encodePacked(uint256(block.chainid), address(USDC), uint256(100_000_000), safe, nonce)
        );
        bytes32 ethHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(RELAYER_PRIVATE_KEY, ethHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // Execute autoEarn with a valid signature
        vm.prank(makeAddr("anyone"));
        module.autoEarn(address(USDC), 100_000_000, safe, nonce, signature);

        // Verify the funds got deposited
        assertEq(USDC.balanceOf(safe), 0, "Safe USDC balance not zero");
        assertGt(RE7_USDC_ERC4626.balanceOf(safe), 0, "Vault share balance is 0");
    }

    function test_AutoEarnWithInvalidSignature() public {
        deal(address(USDC), safe, 50_000_000);

        // Sign with a different private key (unauthorized)
        uint256 nonce = 1234;
        bytes32 hash = keccak256(
            abi.encodePacked(uint256(block.chainid), address(USDC), uint256(50_000_000), safe, nonce)
        );
        bytes32 ethHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));

        uint256 UNAUTHORIZED_PRIVATE_KEY =
            0x491fa4c92337d0a76cb0323e71e88ec4073e0fd9770ec97e9a6196a39e4a7d01;
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(UNAUTHORIZED_PRIVATE_KEY, ethHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // Expect revert because the recovered address won't be an authorized relayer
        vm.prank(makeAddr("anyone"));
        vm.expectRevert(
            abi.encodeWithSelector(
                FluidkeyEarnModule.NotAuthorized.selector,
                vm.addr(UNAUTHORIZED_PRIVATE_KEY)
            )
        );
        module.autoEarn(address(USDC), 50_000_000, safe, nonce, signature);
    }

    function test_AutoEarnReplaySignature() public {
        // Give the Safe some USDC
        deal(address(USDC), safe, 100_000_000);

        // Create a valid signature from the authorized relayer
        uint256 nonce = 1234;
        bytes32 hash = keccak256(
            abi.encodePacked(uint256(block.chainid), address(USDC), uint256(10_000_000), safe, nonce)
        );
        bytes32 ethHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(RELAYER_PRIVATE_KEY, ethHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // First call succeeds
        vm.prank(makeAddr("anyone"));
        module.autoEarn(address(USDC), 10_000_000, safe, nonce, signature);

        // Second call with the same signature should revert
        vm.prank(makeAddr("anyone"));
        vm.expectRevert(FluidkeyEarnModule.SignatureAlreadyUsed.selector);
        module.autoEarn(address(USDC), 10_000_000, safe, nonce, signature);
    }

    function test_CannotRemoveModuleOwnerFromRelayers() public {
        // The moduleOwner is effectively also an authorized relayer
        vm.startPrank(moduleOwner);
        vm.expectRevert(FluidkeyEarnModule.CannotRemoveSelf.selector);
        module.removeAuthorizedRelayer(moduleOwner);
    }

    function test_ModuleOwnerCanAddRelayer() public {
        address newRelayer = makeAddr("newRelayer");
        vm.startPrank(moduleOwner);
        module.addAuthorizedRelayer(newRelayer);
        vm.stopPrank();

        bool isRelayer = module.authorizedRelayers(newRelayer);
        assertTrue(isRelayer, "Module owner could not add a new relayer");
    }

    function test_AddModuleOwnerAsRelayerWorks() public {
        vm.startPrank(moduleOwner);
        // Adding the owner again is no-op but should succeed
        module.addAuthorizedRelayer(moduleOwner);

        // Just verify we can still operate
        bool isRelayer = module.authorizedRelayers(moduleOwner);
        assertTrue(isRelayer);

        deal(address(USDC), safe, 100_000_000);
        module.autoEarn(address(USDC), 100_000_000, safe);
        vm.stopPrank();

        uint256 balanceOfVault = RE7_USDC_ERC4626.balanceOf(safe);
        assertGt(balanceOfVault, 0, "Vault share balance after deposit is 0");
    }

    function test_OnUninstall() public {
        // onUninstall sets accountConfig[safe] = 0
        vm.prank(safe);
        module.onUninstall();

        // Now getAllConfigs(safe) should return empty
        FluidkeyEarnModule.ConfigWithToken[] memory cfg = module.getAllConfigs(safe);
        assertEq(cfg.length, 0, "Config not cleared on uninstall");

        // If we try to autoEarn now, it should revert (module not initialized)
        deal(safe, 1 ether);
        vm.prank(authorizedRelayer);
        vm.expectRevert(
            abi.encodeWithSelector(FluidkeyEarnModule.ModuleNotInitialized.selector, safe)
        );
        module.autoEarn(ETH, 1 ether, safe);
    }

    function test_ChangeConfigHash() public {
       // The Safe is already initialized with some configHash in setUp
       uint256 oldHash = module.accountConfig(safe);
       assertTrue(oldHash != 0, "Initial configHash not set");

       // Let’s assume the moduleOwner created another config off-chain, then found its hash
       uint256 newHash = uint256(keccak256(abi.encodePacked("NEW_CONFIG")));

       // The Safe itself calls changeConfigHash
       vm.startPrank(safe);
       module.changeConfigHash(newHash);
       vm.stopPrank();

       // Verify the change
       uint256 updatedHash = module.accountConfig(safe);
       assertEq(updatedHash, newHash, "ConfigHash did not update correctly");
   }
}
