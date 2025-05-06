# SentinelList

**A library for linked lists in Solidity**

The library comes with linked lists in different flavors:

- SentinelList: A linked list for addresses
- SentinelList4337: An ERC-4337 compliant linked list for addresses
- SentinelListBytes32: A linked list for bytes32

## Using the library

In a contract, you can use the `SentinelList` library to store a linked list of addresses:

```solidity
contract Example {
    using SentinelListLib for SentinelListLib.SentinelList;

    // Declare a variable to store the data
    // Note: this can also be in a mapping or other data structure
    SentinelListLib.SentinelList list;

    function set(address newAddress) external {
        // Store the data
        list.push(newAddress);
    }

    function get(uint256 size) external view returns (address[] memory addressArray) {
        // Retrieve the data
        (addressArray,) = list.getEntriesPaginated(SENTINEL, size);
    }
}
```

### Available functions

#### SentinelListLib

- `init(SentinelList storage self)`: Initialize the list (required before using the list and will revert if the list is already initialized)
- `alreadyInitialized(SentinelList storage self)`: Check if the list is already initialized
- `getNext(SentinelList storage self, address entry)`: Get the next entry in the list
- `push(SentinelList storage self, address newEntry)`: Add a new entry to the list
- `pop(SentinelList storage self, address prevEntry, address popEntry)`: Remove an entry from the list
- `popAll(SentinelList storage self)`: Remove all entries from the list
- `contains(SentinelList storage self, address entry)`: Check if an entry is in the list
- `getEntriesPaginated(SentinelList storage self, address start, uint256 size)`: Get a paginated list of entries from `start` with a maximum of `size` entries

#### SentinelList4337Lib

- `init(SentinelList storage self, address account)`: Initialize the list (required before using the list and will revert if the list is already initialized)
- `alreadyInitialized(SentinelList storage self, address account)`: Check if the list is already initialized
- `getNext(SentinelList storage self, address account, address entry)`: Get the next entry in the list
- `push(SentinelList storage self, address account, address newEntry)`: Add a new entry to the list
- `pop(SentinelList storage self, address account, address prevEntry, address popEntry)`: Remove an entry from the list
- `popAll(SentinelList storage self, address account)`: Remove all entries from the list
- `contains(SentinelList storage self, address account, address entry)`: Check if an entry is in the list
- `getEntriesPaginated(SentinelList storage self, address account, address start, uint256 size)`: Get a paginated list of entries from `start` with a maximum of `size` entries

#### LinkedBytes32Lib

- `init(LinkedBytes32 storage self)`: Initialize the list (required before using the list and will revert if the list is already initialized)
- `alreadyInitialized(LinkedBytes32 storage self)`: Check if the list is already initialized
- `getNext(LinkedBytes32 storage self, bytes32 entry)`: Get the next entry in the list
- `push(LinkedBytes32 storage self, bytes32 newEntry)`: Add a new entry to the list
- `pop(LinkedBytes32 storage self, bytes32 prevEntry, bytes32 popEntry)`: Remove an entry from the list
- `popAll(LinkedBytes32 storage self)`: Remove all entries from the list
- `contains(LinkedBytes32 storage self, bytes32 entry)`: Check if an entry is in the list
- `getEntriesPaginated(LinkedBytes32 storage self, bytes32 start, uint256 size)`: Get a paginated list of entries from `start` with a maximum of `size` entries

## Using this repo

To install the dependencies, run:

```bash
forge install
```

To build the project, run:

```bash
forge build
```

To run the tests, run:

```bash
forge test
```

## Contributing

For feature or change requests, feel free to open a PR, start a discussion or get in touch with us.

## Credits

- [Safe](https://github.com/safe-global/safe-smart-account) and [Richard](https://github.com/rmeissner): For the initial implementation in the Safe Smart Account
