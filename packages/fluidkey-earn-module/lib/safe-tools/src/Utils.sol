// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "forge-std/Test.sol";
import "solady/utils/LibSort.sol";

address constant VM_ADDR = 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D;
bytes12 constant ADDR_MASK = 0xffffffffffffffffffffffff;

function getAddr(uint256 pk) pure returns (address) {
    return Vm(VM_ADDR).addr(pk);
}

function encodeSmartContractWalletAsPK(address addr) pure returns (uint256 encodedPK) {
    assembly {
        let addr_b32 := addr
        encodedPK := or(addr, ADDR_MASK)
    }
}

function decodeSmartContractWalletAsAddress(uint256 pk) pure returns (address decodedAddr) {
    assembly {
        let addr := shl(96, pk)
        decodedAddr := shr(96, addr)
    }
}

function isSmartContractPK(uint256 pk) pure returns (bool isEncoded) {
    assembly {
        isEncoded := eq(shr(160, pk), shr(160, ADDR_MASK))
    }
}

library Sort {
    function sort(address[] memory arr) public pure returns (address[] memory) {
        LibSort.sort(arr);
        return arr;
    }
}

function sortPKsByComputedAddress(uint256[] memory _pks) pure returns (uint256[] memory) {
    uint256[] memory sortedPKs = new uint256[](_pks.length);

    address[] memory addresses = new address[](_pks.length);
    bytes32[2][] memory accounts = new bytes32[2][](_pks.length);

    for (uint256 i; i < _pks.length; i++) {
        address signer = getAddr(_pks[i]);
        addresses[i] = signer;
        accounts[i][0] = bytes32(abi.encode(signer));
        accounts[i][1] = bytes32(_pks[i]);
    }

    addresses = Sort.sort(addresses);

    uint256 found;
    for (uint256 j; j < addresses.length; j++) {
        address signer = addresses[j];
        uint256 pk;
        for (uint256 k; k < accounts.length; k++) {
            if (address(uint160(uint256(accounts[k][0]))) == signer) {
                pk = uint256(accounts[k][1]);
                found++;
            }
        }

        sortedPKs[j] = pk;
    }

    if (found < _pks.length) {
        revert("SAFETESTTOOLS: issue with private key sorting, please open a ticket on github");
    }
    return sortedPKs;
}
