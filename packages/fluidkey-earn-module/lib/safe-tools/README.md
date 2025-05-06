# Gnosis Safe Tools for Foundry

`SafeTestTools` is a friendly wrapper for deploying safes, executing transactions, performing EIP1271 signatures, and enabling/disabling modules. It manages `Safe` deployments, private keys, and transaction signing so you can simply call `_setupSafe()` and ensure your code works with Safe's as well as EOAs.

## Before -> After

<img width="2578" alt="Before after" src="https://user-images.githubusercontent.com/33375223/211921017-b57ae2f3-0d33-4265-a87d-945a69a77ba6.png">

# Quick Start

## Pre-Deployed Safe (Spoof Safe Tx's in a Fork Test)

In a fork test, you can "attach" to a deployed safe and spoof transactions.

This is great for running `forge script` POCs, where you need to simulate transaction execution from a Safe

```solidity
import "safe-tools/SafeTestTools.sol";
import "forge-std/Test.sol";

contract Test is Test, SafeTestTools {
    using SafeTestLib for SafeInstance;

    setUp() public {
        vm.createSelectFork("RPC_HERE");

        address frax_safe = 0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27;
        SafeInstance memory instance = _attachToSafe(frax_safe);

        safeInstance.execTransaction({
            to: alice,
            value: 0.5 ether,
            data: ""
        }); // send .5 eth to alice

        assertEq(alice.balance, 0.5 ether); // passes ✅
    }
}
```

NOTE: Attached safes are stored with `instance.instanceType == InstanceType.Live`

## New Safe (Deploy a Safe w/ Default Signers via SafeProxyFactory)

```solidity
import "safe-tools/SafeTestTools.sol";
import "forge-std/Test.sol";

contract Test is Test, SafeTestTools {
    using SafeTestLib for SafeInstance;

    setUp() public {
        SafeInstance memory safeInstance = _setupSafe();
        address alice = address(0xA11c3);

        safeInstance.execTransaction({
            to: alice,
            value: 0.5 ether,
            data: ""
        }); // send .5 eth to alice

        assertEq(alice.balance, 0.5 ether); // passes ✅
    }
}
```

## Basic Setup

Use the `_setupSafe();` method to setup a `SafeInstance` with the default initialization parameters.

```solidity
SafeInstance memory safeInstance = _setupSafe();
```

### Default Parameters:

1. **Threshold**: `2/3`
2. **Signers**: The owners are the first 3 signers from the standard `test test test test test test test test test test test junk` derived accounts. These accounts are `vm.label`'d as `SAFETEST: Signer 0-2:` for Forge's call tracing functionality.
3. **Initial Balance**: `10000 ether`
4. **Salt Nonce**: `0xbff0e1d6be3df3bedf05c892f554fbea3c6ca2bb9d224bc3f3d3fbc3ec267d1c`

This will create a `SafeInstance` with the address of `0x584a697DC2b125117d232Fca046f6cDe5Edd0ba7`

(See [Custom Setup](#custom-setup) for more setup options)

## The Safe Instance Struct:

```solidity
struct SafeInstance {
    InstanceType instanceType, // either InstanceType.Test | InstanceType.Live
    uint256 instanceId;
    uint256[] ownerPKs;
    address[] owners;
    uint256 threshold;
    DeployedSafe safe;
}
```

A safe instance stores:

1. `instanceId`: a unique id
2. `ownerPKs`: an array of owner private keys (**NOTE! these PKs will be sorted by computed address for signing purposes**)
3. `owners`: an array of owner addresses (**sorted to match the private keys**)
4. `threshold`: the signing threshold of the safe
5. `safe`: the address of the deployed safe wrapped in a custom interface `DeployedSafe` that includes all:
   - `GnosisSafe.sol` methods
   - `CompatibilityFallbackHandler.sol` methods (for EIP1271 signature validation, messaging hashing, token callbacks, etc)

## `SafeInstance` Methods

Wrap the `SafeInstance` with `SafeTestLib` methods to add access wrappers for signing methods for common Safe methods.

```solidity
using SafeTestLib for SafeInstance;
```

### API

```solidity
// EXEC FUNCTION VARIATIONS
function execTransaction(
    address to,
    uint256 value,
    bytes data
) public returns (bool);

function execTransaction(
    address to,
    uint256 value,
    bytes data,
    Enum.Operation operation
) public returns (bool);

function execTransaction(
    address to,
    uint256 value,
    bytes data,
    Enum.Operation operation,
    uint256 safeTxGas,
    uint256 baseGas,
    uint256 gasPrice,
    address gasToken,
    address refundReceiver,
    bytes memory signatures
) public returns (bool);

// MODULE FUNCTIONS

function enableModule(address module);

function disableModule(address module);

// MISC

function EIP1271Sign(bytes data);

function EIP1271Sign(bytes32 digest);

function incrementNonce() public returns (uint256 newNonce);

function signTransaction(
    uint256 privateKey,
    address to,
    uint256 value,
    bytes memory data,
    Enum.Operation operation,
    uint256 safeTxGas,
    uint256 baseGas,
    uint256 gasPrice,
    address gasToken,
    address refundReceiver
) public view returns (uint8 v, bytes32 r, bytes32 s)

```

# Custom Setup

## Setup options:

Then there are a few overrides of `_setupSafe()` at your disposal for custom Safe setup:

```solidity
// pass an array of uint256 private keys
function _setupSafe(
    uint256[] memory ownerPKs,
    uint256 threshold
) public returns (SafeInstance memory);

// you could also specify the initial balance of the Safe
function _setupSafe(
    uint256[] memory ownerPKs,
    uint256 threshold,
    uint256 initialBalance
) public returns (SafeInstance memory);

// or if you need to fully tweak the Safe setup parameters, you can pass an `AdvancedSafeInitParams` struct
function _setupSafe(
    uint256[] memory ownerPKs,
    uint256 threshold,
    uint256 initialBalance,
    AdvancedSafeInitParams memory advancedParams
) public returns (SafeInstance memory)
```

### `AdvancedSafeInitParams`

Passing the `AdvancedSafeInitParams` struct allows you to _fully_ customize the Safe setup call parameters. The struct is defined as follows:

```solidity
struct AdvancedSafeInitParams {
    bool includeFallbackHandler;
    uint256 saltNonce;
    address setupModulesCall_to;
    bytes setupModulesCall_data;
    uint256 refundAmount;
    address refundToken;
    address payable refundReceiver;
    bytes initData;
}
```

| Param                    | Type              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `includeFallbackHandler` | `bool`            | Whether or not to include the [`CompatibilityFallbackHandler`](https://github.com/safe-global/safe-contracts/blob/v1.3.0/contracts/handler/CompatibilityFallbackHandler.sol) contract in the Safe setup. The `fallbackHandler` receives calls to the Safe with unrecognized signatures. This contains EIP1271 signature validation, allows the Safe to receive EIP712, 1155, and 777 tokens, and includes fallbacks for previous Safe versions.                                                                                                                                                                                       |
| `saltNonce`              | `uint256`         | The salt nonce to use when deploying the Safe. Passing `saltNonce > 0` will call `createProxyWithNonce()` method on the SafeFactory. `createProxy()` will be called otherwise.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `setupModulesCall_to`    | `address`         | An address that receives a `delegateCall` with `setupModulesCall_data` as part of the [`setupModules()`](https://github.com/safe-global/safe-contracts/blob/v1.3.0/contracts/base/ModuleManager.sol#LL20C1-L26C6) call during Safe setup. This is useful for setting up modules during initialization.                                                                                                                                                                                                                                                                                                                                |
| `setupModulesCall_data`  | `bytes`           | The `delegateCall` data for the `setupModulesCall_to` call. See above.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `refundAmount`           | `uint256`         | The amount of `refundToken` to send to `refundReceiver` after Safe setup.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `refundToken`            | `address`         | The address of the token to refund. **NOTE:** `address(0)` indicates native token. If `refundAmount > 0`, a deployment refund will initiate.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `refundReceiver`         | `address payable` | The address to receive the `refundAmount` of `refundToken`. **NOTE:** `address(0)` indicates `tx.origin` and will doesn't make senes for Foundry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `initData`               | `bytes`           | When creating a safe from Safe UI, the `data` param in the Factory call includes the `setup()` transaction. A setup transaction is just the `abi.encoded` call to `setup` on the Safe contract after the factory deploys the SafeProxy ([see how I do this behind the scenes](https://github.com/colinnielsen/safe-tools/blob/main/src/SafeTestTools.sol#L327-L337)). If you wish to implement a custom Safe `setup()` call, you can override `advancedInitParams.initData` with your own bytes string. **NOTE:** overriding the `initData` will override the following above params by default `setupModulesCall_to`, `setupModulesCall_data`, `includeFallbackHandler`, `refundToken`, `refundAmount`, `refundReceiver` |

## License

License
MIT © Colin Nielsen
