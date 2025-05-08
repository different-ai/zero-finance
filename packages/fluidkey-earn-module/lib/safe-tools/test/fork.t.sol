// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "forge-std/Test.sol";
import "../src/SafeTestTools.sol";

bytes4 constant EIP1271_VALUE = 0x1626ba7e;

contract TestSafeTestTools is Test, SafeTestTools {
    using SafeTestLib for SafeInstance;

    function setUp() public {
        vm.createSelectFork(vm.envString("ETH_RPC_URL"));
    }

    function testCanAttachToSafe_viennaPod() public {
        address vienna_safe = 0x9A2755701dCE41cd124e59865fA0734d15200711;

        SafeInstance memory instance = _attachToSafe(vienna_safe);
        vm.deal(vienna_safe, 1 ether);

        instance.execTransaction(address(0xA11c3), 1 ether, "");

        assertEq(address(0xA11c3).balance, 1 ether);
    }

    function testCanAttachToSafe_frax() public {
        address frax_safe = 0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27;

        SafeInstance memory instance = _attachToSafe(frax_safe);

        instance.execTransaction(address(0xA11c3), 0.001 ether, "");

        assertEq(address(0xA11c3).balance, 0.001 ether);
    }
}
