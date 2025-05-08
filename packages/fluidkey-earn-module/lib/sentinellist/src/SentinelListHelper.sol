// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { SentinelListLib } from "./SentinelList.sol";

/**
 * @title SentinelListHelper
 * @dev Helper functions for managing a linked list of addresses in Foundry tests
 * @author Rhinestone
 */
library SentinelListHelper {
    using SentinelListLib for SentinelListLib.SentinelList;

    /**
     * Finds the previous entry in the linked list
     *
     * @param array The linked list
     * @param entry The entry to find the previous entry for
     *
     * @return prev The previous entry
     */
    function findPrevious(
        address[] memory array,
        address entry
    )
        internal
        pure
        returns (address prev)
    {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == entry) {
                if (i == 0) {
                    return address(0x1);
                } else {
                    return array[i - 1];
                }
            }
        }
    }
}
