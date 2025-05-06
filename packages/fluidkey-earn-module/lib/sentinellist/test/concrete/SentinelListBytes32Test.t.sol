// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";
import { LinkedBytes32Lib, SENTINEL, ZERO } from "src/SentinelListBytes32.sol";
import { SentinelListHelper } from "src/SentinelListHelper.sol";

contract SentinelListBytes32Test is Test {
    using LinkedBytes32Lib for LinkedBytes32Lib.LinkedBytes32;

    /*//////////////////////////////////////////////////////////////////////////
                                    VARIABLES
    //////////////////////////////////////////////////////////////////////////*/

    LinkedBytes32Lib.LinkedBytes32 list;
    LinkedBytes32Lib.LinkedBytes32 newList;

    /*//////////////////////////////////////////////////////////////////////////
                                      SETUP
    //////////////////////////////////////////////////////////////////////////*/

    function setUp() public {
        // only the first list is initialized
        list.init();
    }

    /*//////////////////////////////////////////////////////////////////////////
                                      UTILS
    //////////////////////////////////////////////////////////////////////////*/

    function addMany(uint256 amount) public {
        for (uint256 i = 1; i <= amount; i++) {
            bytes32 addr = keccak256(bytes(vm.toString(i)));
            list.push(addr);
        }

        for (uint256 i = 1; i <= amount; i++) {
            bytes32 addr = keccak256(bytes(vm.toString(i)));
            assertTrue(list.contains(addr));
        }
    }

    /*//////////////////////////////////////////////////////////////////////////
                                      TESTS
    //////////////////////////////////////////////////////////////////////////*/

    function test_InitRevertWhen_AlreadyInitialized() external {
        // it should revert
        vm.expectRevert();
        list.init();
    }

    function test_InitWhenNotInitialized() external {
        // it should set sentinel to sentinel
        bytes32 next = list.getNext(SENTINEL);
        assertEq(next, SENTINEL);
    }

    function test_AlreadyInitializedWhenSentinelDoesNotPointTo0() external {
        // it should return true
        bool isInitialized = list.alreadyInitialized();
        assertTrue(isInitialized);
    }

    function test_AlreadyInitializedWhenSentinelPointsTo0() external {
        // it should return false
        bool isInitialized = newList.alreadyInitialized();
        assertFalse(isInitialized);
    }

    function test_GetNextRevertWhen_EntryIsZero() external {
        // it should revert
        vm.expectRevert();
        list.getNext(ZERO);
    }

    function test_GetNextWhenEntryIsNotZero() external {
        // it should return the next entry
        bytes32 newEntry = keccak256("newEntry");
        list.push(bytes32(newEntry));

        bytes32 next = list.getNext(SENTINEL);
        assertEq(next, newEntry);
    }

    function test_PushRevertWhen_EntryIsZero() external {
        // it should revert
        vm.expectRevert();
        list.push(ZERO);
    }

    function test_PushRevertWhen_EntryIsSentinel() external {
        // it should revert
        vm.expectRevert();
        list.push(SENTINEL);
    }

    function test_PushRevertWhen_EntryIsAlreadyAdded() external whenEntryIsNotSentinel {
        // it should revert
        bytes32 newEntry = keccak256("newEntry");
        list.push(bytes32(newEntry));

        bytes32 next = list.getNext(SENTINEL);
        assertEq(next, newEntry);

        vm.expectRevert();
        list.push(bytes32(newEntry));
    }

    function test_PushWhenEntryIsNotAdded() external whenEntryIsNotSentinel {
        // it should add the entry to the list
        bytes32 newEntry = keccak256("newEntry");
        list.push(bytes32(newEntry));
    }

    function test_SafePushWhenListIsNotInitialized() external {
        // it should initialize list
        bytes32 newEntry = keccak256("newEntry");
        newList.safePush(newEntry);

        assertTrue(newList.alreadyInitialized());
    }

    function test_SafePushRevertWhen_EntryIsZero() external whenListIsInitialized {
        // it should revert
        vm.expectRevert();
        newList.safePush(ZERO);
    }

    function test_SafePushRevertWhen_EntryIsSentinel() external whenListIsInitialized {
        // it should revert
        vm.expectRevert();
        newList.safePush(SENTINEL);
    }

    function test_SafePushRevertWhen_EntryIsAlreadyAdded()
        external
        whenListIsInitialized
        whenEntryIsNotSentinel
    {
        // it should revert
        bytes32 newEntry = keccak256("newEntry");
        newList.safePush(newEntry);

        bytes32 next = newList.getNext(SENTINEL);
        assertEq(next, newEntry);

        vm.expectRevert();
        newList.safePush(newEntry);
    }

    function test_SafePushWhenEntryIsNotAdded()
        external
        whenListIsInitialized
        whenEntryIsNotSentinel
    {
        // it should add the entry to the list
        bytes32 newEntry = keccak256("newEntry");
        newList.safePush(newEntry);
    }

    function test_PopRevertWhen_EntryIsZero() external {
        // it should revert
        vm.expectRevert();
        list.pop(SENTINEL, ZERO);
    }

    function test_PopRevertWhen_EntryIsSentinel() external {
        // it should revert
        vm.expectRevert();
        list.pop(SENTINEL, SENTINEL);
    }

    function test_PopRevertWhen_PrevEntryDoesNotPointToEntry() external whenEntryIsNotSentinel {
        // it should revert
        bytes32 newEntry = keccak256("newEntry");

        vm.expectRevert();
        list.pop(SENTINEL, bytes32(newEntry));
    }

    function test_PopWhenPrevEntryPointsToEntry() external whenEntryIsNotSentinel {
        // it should remove the entry from the list
        bytes32 newEntry = keccak256("newEntry");
        list.push(bytes32(newEntry));

        bytes32 next = list.getNext(SENTINEL);
        assertEq(next, newEntry);

        list.pop(SENTINEL, bytes32(newEntry));

        next = list.getNext(SENTINEL);
        assertEq(next, SENTINEL);
    }

    function test_PopAllShouldRemoveAllEntries() external {
        // it should remove all entries
        uint256 amount = 8;
        addMany(amount);
        list.popAll();

        for (uint256 i = 1; i <= amount; i++) {
            assertFalse(list.contains(keccak256(bytes(vm.toString(i)))));
        }
    }

    function test_PopAllShouldSetSentinelToZero() external {
        // it should set sentinel to zero
        uint256 amount = 8;
        addMany(amount);
        list.popAll();

        bytes32 next = list.getNext(SENTINEL);
        assertEq(next, ZERO);
    }

    function test_ContainsWhenEntryIsSentinel() external {
        // it should return false
        bool contains = list.contains(SENTINEL);
        assertFalse(contains);
    }

    function test_ContainsWhenEntryIsZero() external whenEntryIsNotSentinel {
        // it should return false
        bool contains = list.contains(ZERO);
        assertFalse(contains);
    }

    function test_ContainsWhenEntryIsNotZero() external whenEntryIsNotSentinel {
        // it should return true
        bytes32 newEntry = keccak256("newEntry");
        list.push(bytes32(newEntry));

        bool contains = list.contains(bytes32(newEntry));
        assertTrue(contains);
    }

    function test_GetEntriesPaginatedRevertWhen_EntryIsNotContainedOrSentinel() external {
        // it should revert
        vm.expectRevert();
        list.getEntriesPaginated(ZERO, 1);
    }

    function test_GetEntriesPaginatedRevertWhen_PageSizeIsZero()
        external
        whenEntryIsContainedOrSentinel
    {
        // it should revert
        vm.expectRevert();
        list.getEntriesPaginated(SENTINEL, 0);
    }

    function test_GetEntriesPaginatedWhenPageSizeIsNotZero()
        external
        whenEntryIsContainedOrSentinel
    {
        // it should return all entries until page size
        // it should return the next entry
        uint256 amount = 8;
        addMany(amount);

        (bytes32[] memory array, bytes32 next) = list.getEntriesPaginated(SENTINEL, 4);
        assertEq(array.length, 4);
        assertEq(next, keccak256("5"));
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
