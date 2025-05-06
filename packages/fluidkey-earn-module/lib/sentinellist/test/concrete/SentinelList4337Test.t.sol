// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";
import { SentinelList4337Lib, SENTINEL, ZERO_ADDRESS } from "src/SentinelList4337.sol";
import { SentinelListHelper } from "src/SentinelListHelper.sol";

contract SentinelList4337Test is Test {
    using SentinelList4337Lib for SentinelList4337Lib.SentinelList;

    /*//////////////////////////////////////////////////////////////////////////
                                    VARIABLES
    //////////////////////////////////////////////////////////////////////////*/

    SentinelList4337Lib.SentinelList list;
    SentinelList4337Lib.SentinelList newList;
    address account;

    /*//////////////////////////////////////////////////////////////////////////
                                      SETUP
    //////////////////////////////////////////////////////////////////////////*/

    function setUp() public {
        account = makeAddr("account");

        // only the first list is initialized
        list.init(account);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                      UTILS
    //////////////////////////////////////////////////////////////////////////*/

    function addMany(uint256 amount) public {
        for (uint256 i = 1; i <= amount; i++) {
            address addr = makeAddr(vm.toString(i));
            list.push(account, addr);
        }

        for (uint256 i = 1; i <= amount; i++) {
            address addr = makeAddr(vm.toString(i));
            assertTrue(list.contains(account, addr));
        }
    }

    /*//////////////////////////////////////////////////////////////////////////
                                      TESTS
    //////////////////////////////////////////////////////////////////////////*/

    function test_InitRevertWhen_AlreadyInitialized() external {
        // it should revert
        vm.expectRevert();
        list.init(account);
    }

    function test_InitWhenNotInitialized() external {
        // it should set sentinel to sentinel
        address next = list.getNext(account, SENTINEL);
        assertEq(next, SENTINEL);
    }

    function test_AlreadyInitializedWhenSentinelDoesNotPointTo0() external {
        // it should return true
        bool isInitialized = list.alreadyInitialized(account);
        assertTrue(isInitialized);
    }

    function test_AlreadyInitializedWhenSentinelPointsTo0() external {
        // it should return false
        bool isInitialized = newList.alreadyInitialized(account);
        assertFalse(isInitialized);
    }

    function test_GetNextRevertWhen_EntryIsZero() external {
        // it should revert
        vm.expectRevert();
        list.getNext(account, ZERO_ADDRESS);
    }

    function test_GetNextWhenEntryIsNotZero() external {
        // it should return the next entry
        address newEntry = makeAddr("newEntry");
        list.push(account, address(newEntry));

        address next = list.getNext(account, SENTINEL);
        assertEq(next, newEntry);
    }

    function test_PushRevertWhen_EntryIsZero() external {
        // it should revert
        vm.expectRevert();
        list.push(account, ZERO_ADDRESS);
    }

    function test_PushRevertWhen_EntryIsSentinel() external {
        // it should revert
        vm.expectRevert();
        list.push(account, SENTINEL);
    }

    function test_PushRevertWhen_EntryIsAlreadyAdded() external whenEntryIsNotSentinel {
        // it should revert
        address newEntry = makeAddr("newEntry");
        list.push(account, address(newEntry));

        address next = list.getNext(account, SENTINEL);
        assertEq(next, newEntry);

        vm.expectRevert();
        list.push(account, address(newEntry));
    }

    function test_PushWhenEntryIsNotAdded() external whenEntryIsNotSentinel {
        // it should add the entry to the list
        address newEntry = makeAddr("newEntry");
        list.push(account, address(newEntry));
    }

    function test_SafePushWhenListIsNotInitialized() external {
        // it should initialize list
        address newEntry = makeAddr("newEntry");
        newList.safePush(account, newEntry);

        assertTrue(newList.alreadyInitialized(account));
    }

    function test_SafePushRevertWhen_EntryIsZero() external whenListIsInitialized {
        // it should revert
        vm.expectRevert();
        newList.safePush(account, ZERO_ADDRESS);
    }

    function test_SafePushRevertWhen_EntryIsSentinel() external whenListIsInitialized {
        // it should revert
        vm.expectRevert();
        newList.safePush(account, SENTINEL);
    }

    function test_SafePushRevertWhen_EntryIsAlreadyAdded()
        external
        whenListIsInitialized
        whenEntryIsNotSentinel
    {
        // it should revert
        address newEntry = makeAddr("newEntry");
        newList.safePush(account, address(newEntry));

        address next = newList.getNext(account, SENTINEL);
        assertEq(next, newEntry);

        vm.expectRevert();
        newList.safePush(account, address(newEntry));
    }

    function test_SafePushWhenEntryIsNotAdded()
        external
        whenListIsInitialized
        whenEntryIsNotSentinel
    {
        // it should add the entry to the list
        address newEntry = makeAddr("newEntry");
        newList.safePush(account, address(newEntry));
    }

    function test_PopRevertWhen_EntryIsZero() external {
        // it should revert
        vm.expectRevert();
        list.pop(account, SENTINEL, ZERO_ADDRESS);
    }

    function test_PopRevertWhen_EntryIsSentinel() external {
        // it should revert
        vm.expectRevert();
        list.pop(account, SENTINEL, SENTINEL);
    }

    function test_PopRevertWhen_PrevEntryDoesNotPointToEntry() external whenEntryIsNotSentinel {
        // it should revert
        address newEntry = makeAddr("newEntry");

        vm.expectRevert();
        list.pop(account, SENTINEL, address(newEntry));
    }

    function test_PopWhenPrevEntryPointsToEntry() external whenEntryIsNotSentinel {
        // it should remove the entry from the list
        address newEntry = makeAddr("newEntry");
        list.push(account, address(newEntry));

        address next = list.getNext(account, SENTINEL);
        assertEq(next, newEntry);

        list.pop(account, SENTINEL, address(newEntry));

        next = list.getNext(account, SENTINEL);
        assertEq(next, SENTINEL);
    }

    function test_PopAllShouldRemoveAllEntries() external {
        // it should remove all entries
        uint256 amount = 8;
        addMany(amount);
        list.popAll(account);

        for (uint256 i = 1; i <= amount; i++) {
            assertFalse(list.contains(account, makeAddr(vm.toString(i))));
        }
    }

    function test_PopAllShouldSetSentinelToZero() external {
        // it should set sentinel to zero
        uint256 amount = 8;
        addMany(amount);
        list.popAll(account);

        address next = list.getNext(account, SENTINEL);
        assertEq(next, ZERO_ADDRESS);
    }

    function test_ContainsWhenEntryIsSentinel() external {
        // it should return false
        bool contains = list.contains(account, SENTINEL);
        assertFalse(contains);
    }

    function test_ContainsWhenEntryIsZero() external whenEntryIsNotSentinel {
        // it should return false
        bool contains = list.contains(account, ZERO_ADDRESS);
        assertFalse(contains);
    }

    function test_ContainsWhenEntryIsNotZero() external whenEntryIsNotSentinel {
        // it should return true
        address newEntry = makeAddr("newEntry");
        list.push(account, address(newEntry));

        bool contains = list.contains(account, address(newEntry));
        assertTrue(contains);
    }

    function test_GetEntriesPaginatedRevertWhen_EntryIsNotContainedOrSentinel() external {
        // it should revert
        vm.expectRevert();
        list.getEntriesPaginated(account, ZERO_ADDRESS, 1);
    }

    function test_GetEntriesPaginatedRevertWhen_PageSizeIsZero()
        external
        whenEntryIsContainedOrSentinel
    {
        // it should revert
        vm.expectRevert();
        list.getEntriesPaginated(account, SENTINEL, 0);
    }

    function test_GetEntriesPaginatedWhenPageSizeIsNotZero()
        external
        whenEntryIsContainedOrSentinel
    {
        // it should return all entries until page size
        // it should return the next entry
        uint256 amount = 8;
        addMany(amount);

        (address[] memory array, address next) = list.getEntriesPaginated(account, SENTINEL, 4);
        assertEq(array.length, 4);
        assertEq(next, makeAddr("5"));
    }

    /*//////////////////////////////////////////////////////////////////////////
                                    MODIFIERS
    //////////////////////////////////////////////////////////////////////////*/

    modifier whenEntryIsNotSentinel() {
        _;
    }

    modifier whenEntryIsContainedOrSentinel() {
        _;
    }

    modifier whenListIsInitialized() {
        _;
    }
}
