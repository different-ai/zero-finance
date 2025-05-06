// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "forge-std/Test.sol";
import "../src/SafeTestTools.sol";

bytes4 constant EIP1271_VALUE = 0x1626ba7e;

contract TestSafeTestTools is Test, SafeTestTools {
    using SafeTestLib for SafeInstance;

    address alice = address(0xA11c3);
    address bob = address(0xb0b);
    address carol = address(0xc4401);

    function testAutoInitAndTransfer() public {
        SafeInstance memory safeInstance = _setupSafe();
        safeInstance.execTransaction(alice, 0.5 ether, "");
        assertEq(alice.balance, 0.5 ether);
    }

    function testEnableModule() public {
        SafeInstance memory safeInstance = _setupSafe();
        safeInstance.enableModule(address(this));
        assertTrue(safeInstance.safe.isModuleEnabled(address(this)));
    }

    function testDisableModule() public {
        SafeInstance memory safeInstance = _setupSafe();

        safeInstance.enableModule(alice);
        safeInstance.enableModule(bob);
        safeInstance.enableModule(carol);
        safeInstance.enableModule(address(this));

        safeInstance.disableModule(address(bob));
        safeInstance.disableModule(address(alice));
        safeInstance.disableModule(address(carol));
        safeInstance.disableModule(address(this));

        assertFalse(safeInstance.safe.isModuleEnabled(bob));
        assertFalse(safeInstance.safe.isModuleEnabled(alice));
        assertFalse(safeInstance.safe.isModuleEnabled(carol));
        assertFalse(safeInstance.safe.isModuleEnabled(address(this)));
    }

    function testEIP1271Sign() public {
        SafeInstance memory safeInstance = _setupSafe();

        bytes32 secretDigest = keccak256(bytes("SHHHHH"));
        safeInstance.EIP1271Sign(secretDigest);

        assertTrue(safeInstance.safe.isValidSignature(secretDigest, "") == EIP1271_VALUE);
    }

    function testSignTransaction() public {
        uint256[] memory ownerPKs = new uint256[](1);
        ownerPKs[0] = 12345;
        SafeInstance memory instance = _setupSafe({ownerPKs: ownerPKs, threshold: 1, initialBalance: 1 ether});
        (uint8 v, bytes32 r, bytes32 s) = instance.signTransaction(
            ownerPKs[0], alice, 0.5 ether, "", Enum.Operation.Call, 0, 0, 0, address(0), address(0)
        );
        bytes memory signature = abi.encodePacked(r, s, v);
        instance.safe.execTransaction(
            alice, 0.5 ether, "", Enum.Operation.Call, 0, 0, 0, address(0), payable(address(0)), signature
        );
        assertEq(alice.balance, 0.5 ether);
    }

    function testIncrementNonce() public {
        SafeInstance memory instance = _setupSafe();
        uint256 nonceBefore = instance.safe.nonce();
        instance.incrementNonce();
        assertEq(instance.safe.nonce(), nonceBefore + 1);
    }

    function testSaltNonceAutoIncrements() public {
        SafeInstance memory instance = _setupSafe();
        instance = _setupSafe();
        instance = _setupSafe();
    }

    function testCanAttachToSafe() public {
        vm.createSelectFork(vm.envString("ETH_RPC_URL"));

        address vienna_safe = 0x9A2755701dCE41cd124e59865fA0734d15200711;
        SafeInstance memory instance = _attachToSafe(vienna_safe);
        vm.deal(vienna_safe, 1 ether);

        instance.execTransaction(address(0xA11c3), 1 ether, "");

        assertEq(address(0xA11c3).balance, 1 ether);
    }
}
