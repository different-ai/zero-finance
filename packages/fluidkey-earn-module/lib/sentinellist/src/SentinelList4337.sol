// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Sentinel address
address constant SENTINEL = address(0x1);
// Zero address
address constant ZERO_ADDRESS = address(0x0);

/**
 * @title SentinelListLib
 * @dev Library for managing a linked list of addresses that is compliant with the ERC-4337
 * validation rules
 * @author Rhinestone
 */
library SentinelList4337Lib {
    // Struct to hold the linked list
    // This linked list has the account address as the inner key so it is ERC-4337 compliant
    struct SentinelList {
        mapping(address key => mapping(address account => address entry)) entries;
    }

    error LinkedList_AlreadyInitialized();
    error LinkedList_InvalidPage();
    error LinkedList_InvalidEntry(address entry);
    error LinkedList_EntryAlreadyInList(address entry);

    /**
     * Initialize the linked list
     *
     * @param self The linked list
     * @param account The account to initialize the linked list for
     */
    function init(SentinelList storage self, address account) internal {
        if (alreadyInitialized(self, account)) revert LinkedList_AlreadyInitialized();
        self.entries[SENTINEL][account] = SENTINEL;
    }

    /**
     * Check if the linked list is already initialized
     *
     * @param self The linked list
     * @param account The account to check if the linked list is initialized for
     *
     * @return bool True if the linked list is already initialized
     */
    function alreadyInitialized(
        SentinelList storage self,
        address account
    )
        internal
        view
        returns (bool)
    {
        return self.entries[SENTINEL][account] != ZERO_ADDRESS;
    }

    /**
     * Get the next entry in the linked list
     *
     * @param self The linked list
     * @param account The account to get the next entry for
     * @param entry The current entry
     *
     * @return address The next entry
     */
    function getNext(
        SentinelList storage self,
        address account,
        address entry
    )
        internal
        view
        returns (address)
    {
        if (entry == ZERO_ADDRESS) {
            revert LinkedList_InvalidEntry(entry);
        }
        return self.entries[entry][account];
    }

    /**
     * Push a new entry to the linked list
     *
     * @param self The linked list
     * @param account The account to push the new entry for
     * @param newEntry The new entry
     */
    function push(SentinelList storage self, address account, address newEntry) internal {
        if (newEntry == ZERO_ADDRESS || newEntry == SENTINEL) {
            revert LinkedList_InvalidEntry(newEntry);
        }
        if (self.entries[newEntry][account] != ZERO_ADDRESS) {
            revert LinkedList_EntryAlreadyInList(newEntry);
        }
        self.entries[newEntry][account] = self.entries[SENTINEL][account];
        self.entries[SENTINEL][account] = newEntry;
    }

    /**
     * Safe push a new entry to the linked list
     * @dev This ensures that the linked list is initialized and initializes it if it is not
     *
     * @param self The linked list
     * @param account The account to push the new entry for
     * @param newEntry The new entry
     */
    function safePush(SentinelList storage self, address account, address newEntry) internal {
        if (!alreadyInitialized(self, account)) {
            init({ self: self, account: account });
        }
        push({ self: self, account: account, newEntry: newEntry });
    }

    /**
     * Pop an entry from the linked list
     *
     * @param self The linked list
     * @param account The account to pop the entry for
     * @param prevEntry The entry before the entry to pop
     * @param popEntry The entry to pop
     */
    function pop(
        SentinelList storage self,
        address account,
        address prevEntry,
        address popEntry
    )
        internal
    {
        if (popEntry == ZERO_ADDRESS || popEntry == SENTINEL) {
            revert LinkedList_InvalidEntry(prevEntry);
        }
        if (self.entries[prevEntry][account] != popEntry) {
            revert LinkedList_InvalidEntry(popEntry);
        }
        self.entries[prevEntry][account] = self.entries[popEntry][account];
        self.entries[popEntry][account] = ZERO_ADDRESS;
    }

    /**
     * Pop all entries from the linked list
     *
     * @param self The linked list
     * @param account The account to pop all entries for
     */
    function popAll(SentinelList storage self, address account) internal {
        address next = self.entries[SENTINEL][account];
        while (next != ZERO_ADDRESS) {
            address current = next;
            next = self.entries[next][account];
            self.entries[current][account] = ZERO_ADDRESS;
        }
    }

    /**
     * Check if the linked list contains an entry
     *
     * @param self The linked list
     * @param account The account to check if the entry is in the linked list for
     * @param entry The entry to check for
     *
     * @return bool True if the linked list contains the entry
     */
    function contains(
        SentinelList storage self,
        address account,
        address entry
    )
        internal
        view
        returns (bool)
    {
        return SENTINEL != entry && self.entries[entry][account] != ZERO_ADDRESS;
    }

    /**
     * Get all entries in the linked list
     *
     * @param self The linked list
     * @param account The account to get the entries for
     * @param start The start entry
     * @param pageSize The page size
     *
     * @return array All entries in the linked list
     * @return next The next entry
     */
    function getEntriesPaginated(
        SentinelList storage self,
        address account,
        address start,
        uint256 pageSize
    )
        internal
        view
        returns (address[] memory array, address next)
    {
        if (start != SENTINEL && !contains(self, account, start)) {
            revert LinkedList_InvalidEntry(start);
        }
        if (pageSize == 0) revert LinkedList_InvalidPage();
        // Init array with max page size
        array = new address[](pageSize);

        // Populate return array
        uint256 entryCount = 0;
        next = self.entries[start][account];
        while (next != ZERO_ADDRESS && next != SENTINEL && entryCount < pageSize) {
            array[entryCount] = next;
            next = self.entries[next][account];
            entryCount++;
        }

        /**
         * Because of the argument validation, we can assume that the loop will always iterate over
         * the valid entry list values
         *       and the `next` variable will either be an enabled entry or a sentinel address
         * (signalling the end).
         *
         *       If we haven't reached the end inside the loop, we need to set the next pointer to
         * the last element of the entry array
         *       because the `next` variable (which is a entry by itself) acting as a pointer to the
         * start of the next page is neither
         *       incSENTINELrent page, nor will it be included in the next one if you pass it as a
         * start.
         */
        if (next != SENTINEL && entryCount > 0) {
            next = array[entryCount - 1];
        }
        // Set correct size of returned array
        // solhint-disable-next-line no-inline-assembly
        /// @solidity memory-safe-assembly
        assembly {
            mstore(array, entryCount)
        }
    }
}
