// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "forge-std/Test.sol";
import "safe-contracts/Safe.sol";
import "safe-contracts/proxies/SafeProxyFactory.sol";
import "safe-contracts/libraries/SignMessageLib.sol";
import "./CompatibilityFallbackHandler_1_4_1.sol";
import "./Utils.sol";

// collapsed interface that includes comapatibilityfallback handler calls
abstract contract DeployedSafe is Safe, CompatibilityFallbackHandler {}

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

enum InstanceType {
    Live,
    Test
}

struct SafeInstance {
    InstanceType instanceType;
    uint256 instanceId;
    uint256[] ownerPKs;
    address[] owners;
    uint256 threshold;
    DeployedSafe safe;
}

library SafeTestLib {
    function _execTxWithLocalPKs(
        SafeInstance memory instance,
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address refundReceiver,
        bytes memory signatures
    ) internal returns (bool) {
        if (instance.owners.length == 0) {
            revert("SAFETEST: Instance not initialized. Call _setupSafe() to initialize a test safe");
        }

        bytes32 safeTxHash;
        {
            uint256 _nonce = instance.safe.nonce();
            safeTxHash = instance.safe.getTransactionHash({
                to: to,
                value: value,
                data: data,
                operation: operation,
                safeTxGas: safeTxGas,
                baseGas: baseGas,
                gasPrice: gasPrice,
                gasToken: gasToken,
                refundReceiver: refundReceiver,
                _nonce: _nonce
            });
        }

        if (signatures.length == 0) {
            for (uint256 i; i < instance.ownerPKs.length; ++i) {
                uint256 pk = instance.ownerPKs[i];
                (uint8 v, bytes32 r, bytes32 s) = Vm(VM_ADDR).sign(pk, safeTxHash);
                if (isSmartContractPK(pk)) {
                    v = 0;
                    address addr = decodeSmartContractWalletAsAddress(pk);
                    assembly {
                        r := addr
                    }
                    console.logBytes32(r);
                }
                signatures = bytes.concat(signatures, abi.encodePacked(r, s, v));
            }
        }

        return instance.safe.execTransaction({
            to: to,
            value: value,
            data: data,
            operation: operation,
            safeTxGas: safeTxGas,
            baseGas: baseGas,
            gasPrice: gasPrice,
            gasToken: gasToken,
            refundReceiver: payable(refundReceiver),
            signatures: signatures
        });
    }

    function _spoofSigWithStorageOverride(
        SafeInstance memory instance,
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address refundReceiver,
        /**
         * signature (is ignored)
         */
        bytes memory
    ) internal returns (bool) {
        Vm(VM_ADDR).store(
            address(instance.safe),
            bytes32(uint256(0x04)), // threshold slot
            bytes32(uint256(1))
        );
        address owner0 = instance.owners[0];

        // init a new 65-byte long array
        bytes memory sig = new bytes(65);

        assembly ("memory-safe") {
            // store the left-padded address after the array's 32 byte pointer
            mstore(add(sig, 0x20), owner0)
            // store 1 as the v byte to signify an "approved hash"
            mstore(add(sig, 0x41), 1)
        }

        Vm(VM_ADDR).prank(owner0);
        return instance.safe.execTransaction(
            to,
            value,
            data,
            operation,
            safeTxGas,
            baseGas,
            gasPrice,
            gasToken,
            payable(refundReceiver),
            abi.encodePacked(bytes32(uint256(uint160(owner0))), bytes1(0x00), bytes32(uint256(0x01)))
        );
    }

    function execTransaction(
        SafeInstance memory instance,
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address refundReceiver,
        bytes memory signatures
    ) internal returns (bool) {
        if (instance.instanceType == InstanceType.Test) {
            return _execTxWithLocalPKs(
                instance, to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, signatures
            );
        } else {
            return _spoofSigWithStorageOverride(
                instance, to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, signatures
            );
        }
    }

    function execTransaction(
        SafeInstance memory instance,
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    ) internal returns (bool) {
        return execTransaction(instance, to, value, data, operation, 0, 0, 0, address(0), address(0), "");
    }

    /// @dev performs a noraml "call"
    function execTransaction(SafeInstance memory instance, address to, uint256 value, bytes memory data)
        internal
        returns (bool)
    {
        return execTransaction(instance, to, value, data, Enum.Operation.Call, 0, 0, 0, address(0), address(0), "");
    }

    function enableModule(SafeInstance memory instance, address module) public {
        execTransaction(
            instance,
            address(instance.safe),
            0,
            abi.encodeWithSelector(ModuleManager.enableModule.selector, module),
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            address(0),
            ""
        );
    }

    function disableModule(SafeInstance memory instance, address module) public {
        (address[] memory modules,) = instance.safe.getModulesPaginated(SENTINEL_MODULES, 1000);
        address prevModule = SENTINEL_MODULES;
        bool moduleFound;
        for (uint256 i; i < modules.length; i++) {
            if (modules[i] == module) {
                moduleFound = true;
                break;
            }
            prevModule = modules[i];
        }
        if (!moduleFound) {
            revert("SAFETESTTOOLS: cannot disable module that is not enabled");
        }

        execTransaction(
            instance,
            address(instance.safe),
            0,
            abi.encodeWithSelector(ModuleManager.disableModule.selector, prevModule, module),
            Enum.Operation.Call,
            0,
            0,
            0,
            address(0),
            address(0),
            ""
        );
    }

    function EIP1271Sign(SafeInstance memory instance, bytes memory data) internal {
        address signMessageLib = address(new SignMessageLib());
        execTransaction({
            instance: instance,
            to: signMessageLib,
            value: 0,
            data: abi.encodeWithSelector(SignMessageLib.signMessage.selector, data),
            operation: Enum.Operation.DelegateCall,
            safeTxGas: 0,
            baseGas: 0,
            gasPrice: 0,
            gasToken: address(0),
            refundReceiver: payable(address(0)),
            signatures: ""
        });
    }

    function EIP1271Sign(SafeInstance memory instance, bytes32 digest) public {
        EIP1271Sign(instance, abi.encodePacked(digest));
    }

    function signTransaction(
        SafeInstance memory instance,
        uint256 pk,
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address refundReceiver
    ) public view returns (uint8 v, bytes32 r, bytes32 s) {
        bytes32 txDataHash;
        {
            uint256 _nonce = instance.safe.nonce();
            txDataHash = instance.safe.getTransactionHash({
                to: to,
                value: value,
                data: data,
                operation: operation,
                safeTxGas: safeTxGas,
                baseGas: baseGas,
                gasPrice: gasPrice,
                gasToken: gasToken,
                refundReceiver: refundReceiver,
                _nonce: _nonce
            });
        }

        (v, r, s) = Vm(VM_ADDR).sign(pk, txDataHash);
    }

    function incrementNonce(SafeInstance memory instance) public returns (uint256) {
        execTransaction(instance, address(0), 0, "", Enum.Operation.Call, 0, 0, 0, address(0), address(0), "");
        return instance.safe.nonce();
    }
}

contract SafeTestTools {
    using SafeTestLib for SafeInstance;

    Safe internal singleton = new Safe();
    SafeProxyFactory internal proxyFactory = new SafeProxyFactory();
    CompatibilityFallbackHandler internal handler = new CompatibilityFallbackHandler();

    SafeInstance[] internal instances;

    /// takes in private keys, stores computed address?

    /// @dev can be called to reinitialize the singleton, proxyFactory and handler. Useful for forking.
    function _initializeSafeTools() internal {
        singleton = new Safe();
        proxyFactory = new SafeProxyFactory();
        handler = new CompatibilityFallbackHandler();
    }

    function _attachToSafe(address _safe) public returns (SafeInstance memory) {
        DeployedSafe safe = DeployedSafe(payable(_safe));

        uint256[] memory ownerPKs = new uint256[](0);

        address[] memory owners = safe.getOwners();

        if (owners.length == 0) {
            revert("SAFETESTTOOLS: attempted to attach to non-existent safe!");
        }

        SafeInstance memory instance0 = SafeInstance({
            instanceType: InstanceType.Live,
            instanceId: instances.length,
            ownerPKs: ownerPKs,
            owners: owners,
            threshold: safe.getThreshold(),
            safe: safe
        });

        instances.push(instance0);

        return instance0;
    }

    function _setupSafe(
        uint256[] memory ownerPKs,
        uint256 threshold,
        uint256 initialBalance,
        AdvancedSafeInitParams memory advancedParams
    ) public returns (SafeInstance memory) {
        uint256[] memory sortedPKs = sortPKsByComputedAddress(ownerPKs);
        address[] memory owners = new address[](sortedPKs.length);

        for (uint256 i; i < sortedPKs.length; i++) {
            if (isSmartContractPK(sortedPKs[i])) {
                owners[i] = decodeSmartContractWalletAsAddress(sortedPKs[i]);
            } else {
                owners[i] = getAddr(sortedPKs[i]);
            }
        }
        // store the initialization parameters

        bytes memory initData = advancedParams.initData.length > 0
            ? advancedParams.initData
            : abi.encodeWithSelector(
                Safe.setup.selector,
                owners,
                threshold,
                advancedParams.setupModulesCall_to,
                advancedParams.setupModulesCall_data,
                advancedParams.includeFallbackHandler ? address(handler) : address(0),
                advancedParams.refundToken,
                advancedParams.refundAmount,
                advancedParams.refundReceiver
            );

        DeployedSafe safe0 = DeployedSafe(
            payable(
                proxyFactory.createProxyWithNonce(
                    address(singleton),
                    initData,
                    advancedParams.saltNonce == 0
                        ? uint256(keccak256(abi.encode("SAFE_TEST_TOOLS", instances.length)))
                        : advancedParams.saltNonce
                )
            )
        );

        SafeInstance memory instance0 = SafeInstance({
            instanceType: InstanceType.Test,
            instanceId: instances.length,
            ownerPKs: sortedPKs,
            owners: owners,
            threshold: threshold,
            safe: safe0
        });
        instances.push(instance0);

        Vm(VM_ADDR).deal(address(safe0), initialBalance);

        return instance0;
    }

    function _setupSafe(uint256[] memory ownerPKs, uint256 threshold, uint256 initialBalance)
        public
        returns (SafeInstance memory)
    {
        return _setupSafe(
            ownerPKs,
            threshold,
            initialBalance,
            AdvancedSafeInitParams({
                includeFallbackHandler: true,
                initData: "",
                saltNonce: 0,
                setupModulesCall_to: address(0),
                setupModulesCall_data: "",
                refundAmount: 0,
                refundToken: address(0),
                refundReceiver: payable(address(0))
            })
        );
    }

    function _setupSafe(uint256[] memory ownerPKs, uint256 threshold) public returns (SafeInstance memory) {
        return _setupSafe(
            ownerPKs,
            threshold,
            10000 ether,
            AdvancedSafeInitParams({
                includeFallbackHandler: true,
                initData: "",
                saltNonce: 0,
                setupModulesCall_to: address(0),
                setupModulesCall_data: "",
                refundAmount: 0,
                refundToken: address(0),
                refundReceiver: payable(address(0))
            })
        );
    }

    function _setupSafe() public returns (SafeInstance memory) {
        string[3] memory users;
        users[0] = "SAFETEST: Signer 0";
        users[1] = "SAFETEST: Signer 1";
        users[2] = "SAFETEST: Signer 2";

        uint256[] memory defaultPKs = new uint256[](3);
        defaultPKs[0] = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        defaultPKs[1] = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;
        defaultPKs[2] = 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a;

        for (uint256 i; i < 3; i++) {
            Vm(VM_ADDR).label(getAddr(defaultPKs[i]), users[i]);
        }

        return _setupSafe(
            defaultPKs,
            2,
            10000 ether,
            AdvancedSafeInitParams({
                includeFallbackHandler: true,
                initData: "",
                saltNonce: 0,
                setupModulesCall_to: address(0),
                setupModulesCall_data: "",
                refundAmount: 0,
                refundToken: address(0),
                refundReceiver: payable(address(0))
            })
        );
    }

    function getSafe() public view returns (SafeInstance memory) {
        if (instances.length == 0) {
            revert("SAFETESTTOOLS: Test Safe has not been deployed, use _setupSafe() calling safe()");
        }
        return instances[0];
    }

    function getSafe(address _safe) public view returns (SafeInstance memory) {
        for (uint256 i; i < instances.length; ++i) {
            if (address(instances[i].safe) == _safe) return instances[i];
        }
        revert("SAFETESTTOOLS: Safe instance not found");
    }
}
