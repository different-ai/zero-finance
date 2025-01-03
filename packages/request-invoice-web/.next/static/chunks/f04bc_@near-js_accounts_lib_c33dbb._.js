(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/f04bc_@near-js_accounts_lib_c33dbb._.js", {

"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/utils.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
"use strict";
var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.viewFunction = exports.viewState = exports.encodeJSContractArgs = exports.validateArgs = void 0;
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+types@0.2.1/node_modules/@near-js/types/lib/index.js [app-client] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+utils@0.2.2/node_modules/@near-js/utils/lib/index.js [app-client] (ecmascript)");
function parseJsonFromRawResponse(response) {
    return JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(response).toString());
}
function bytesJsonStringify(input) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(JSON.stringify(input));
}
function validateArgs(args) {
    const isUint8Array = args.byteLength !== undefined && args.byteLength === args.length;
    if (isUint8Array) {
        return;
    }
    if (Array.isArray(args) || typeof args !== 'object') {
        throw new types_1.PositionalArgsError();
    }
}
exports.validateArgs = validateArgs;
function encodeJSContractArgs(contractId, method, args) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(contractId),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
            0
        ]),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(method),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
            0
        ]),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(args)
    ]);
}
exports.encodeJSContractArgs = encodeJSContractArgs;
/**
 * Returns the state (key value pairs) of account's contract based on the key prefix.
 * Pass an empty string for prefix if you would like to return the entire state.
 * @see [https://docs.near.org/api/rpc/contracts#view-contract-state](https://docs.near.org/api/rpc/contracts#view-contract-state)
 *
 * @param connection connection to query state from
 * @param accountId account whose state is viewed
 * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
 * @param blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
 */ function viewState(connection, accountId, prefix, blockQuery = {
    finality: 'optimistic'
}) {
    return __awaiter(this, void 0, void 0, function*() {
        const { values } = yield connection.provider.query(Object.assign(Object.assign({
            request_type: 'view_state'
        }, blockQuery), {
            account_id: accountId,
            prefix_base64: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(prefix).toString('base64')
        }));
        return values.map(({ key, value })=>({
                key: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(key, 'base64'),
                value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(value, 'base64')
            }));
    });
}
exports.viewState = viewState;
/**
 * Invoke a contract view function using the RPC API.
 * @see [https://docs.near.org/api/rpc/contracts#call-a-contract-function](https://docs.near.org/api/rpc/contracts#call-a-contract-function)
 *
 * @param options Function call options.
 * @param options.contractId NEAR account where the contract is deployed
 * @param options.methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
 * @param options.args Any arguments to the view contract method, wrapped in JSON
 * @param options.parse Parse the result of the call. Receives a Buffer (bytes array) and converts it to any object. By default result will be treated as json.
 * @param options.stringify Convert input arguments into a bytes array. By default the input is treated as a JSON.
 * @param options.jsContract Is contract from JS SDK, automatically encodes args from JS SDK to binary.
 * @param options.blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
 * @returns {Promise<any>}
 */ function viewFunction(connection, { contractId, methodName, args = {}, parse = parseJsonFromRawResponse, stringify = bytesJsonStringify, jsContract = false, blockQuery = {
    finality: 'optimistic'
} }) {
    return __awaiter(this, void 0, void 0, function*() {
        let encodedArgs;
        validateArgs(args);
        if (jsContract) {
            encodedArgs = encodeJSContractArgs(contractId, methodName, Object.keys(args).length > 0 ? JSON.stringify(args) : '');
        } else {
            encodedArgs = stringify(args);
        }
        const result = yield connection.provider.query(Object.assign(Object.assign({
            request_type: 'call_function'
        }, blockQuery), {
            account_id: jsContract ? connection.jsvmAccountId : contractId,
            method_name: jsContract ? 'view_js_contract' : methodName,
            args_base64: encodedArgs.toString('base64')
        }));
        if (result.logs) {
            (0, utils_1.printTxOutcomeLogs)({
                contractId,
                logs: result.logs
            });
        }
        return result.result && result.result.length > 0 && parse(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(result.result));
    });
}
exports.viewFunction = viewFunction;
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/account.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
"use strict";
var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Account = void 0;
const crypto_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+crypto@1.2.4/node_modules/@near-js/crypto/lib/index.js [app-client] (ecmascript)");
const providers_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+providers@0.2.2/node_modules/@near-js/providers/lib/index.js [app-client] (ecmascript)");
const transactions_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+transactions@1.2.2/node_modules/@near-js/transactions/lib/index.js [app-client] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+types@0.2.1/node_modules/@near-js/types/lib/index.js [app-client] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+utils@0.2.2/node_modules/@near-js/utils/lib/index.js [app-client] (ecmascript)");
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/utils.js [app-client] (ecmascript)");
const { addKey, createAccount, deleteAccount, deleteKey, deployContract, fullAccessKey, functionCall, functionCallAccessKey, stake, transfer } = transactions_1.actionCreators;
// Default number of retries with different nonce before giving up on a transaction.
const TX_NONCE_RETRY_NUMBER = 12;
// Default wait until next retry in millis.
const TX_NONCE_RETRY_WAIT = 500;
// Exponential back off for waiting to retry.
const TX_NONCE_RETRY_WAIT_BACKOFF = 1.5;
/**
 * This class provides common account related RPC calls including signing transactions with a {@link "@near-js/crypto".key_pair.KeyPair | KeyPair}.
 */ class Account {
    constructor(connection, accountId){
        /** @hidden */ this.accessKeyByPublicKeyCache = {};
        this.connection = connection;
        this.accountId = accountId;
    }
    getConnection() {
        return this.connection;
    }
    /**
     * Returns basic NEAR account information via the `view_account` RPC query method
     * @see [https://docs.near.org/api/rpc/contracts#view-account](https://docs.near.org/api/rpc/contracts#view-account)
     */ state() {
        return __awaiter(this, void 0, void 0, function*() {
            return this.connection.provider.query({
                request_type: 'view_account',
                account_id: this.accountId,
                finality: 'optimistic'
            });
        });
    }
    /**
     * Create a signed transaction which can be broadcast to the network
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the transaction
     * @see {@link "@near-js/providers".json-rpc-provider.JsonRpcProvider.sendTransaction | JsonRpcProvider.sendTransaction}
     */ signTransaction(receiverId, actions) {
        return __awaiter(this, void 0, void 0, function*() {
            const accessKeyInfo = yield this.findAccessKey(receiverId, actions);
            if (!accessKeyInfo) {
                throw new types_1.TypedError(`Can not sign transactions for account ${this.accountId} on network ${this.connection.networkId}, no matching key pair exists for this account`, 'KeyNotFound');
            }
            const { accessKey } = accessKeyInfo;
            const block = yield this.connection.provider.block({
                finality: 'final'
            });
            const blockHash = block.header.hash;
            const nonce = accessKey.nonce + BigInt(1);
            return yield (0, transactions_1.signTransaction)(receiverId, nonce, actions, (0, utils_1.baseDecode)(blockHash), this.connection.signer, this.accountId, this.connection.networkId);
        });
    }
    /**
     * Sign a transaction to perform a list of actions and broadcast it using the RPC API.
     * @see {@link "@near-js/providers".json-rpc-provider.JsonRpcProvider | JsonRpcProvider }
     *
     * @param options The options for signing and sending the transaction.
     * @param options.receiverId The NEAR account ID of the transaction receiver.
     * @param options.actions The list of actions to be performed in the transaction.
     * @param options.returnError Whether to return an error if the transaction fails.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the transaction.
     */ signAndSendTransaction({ receiverId, actions, returnError }) {
        return __awaiter(this, void 0, void 0, function*() {
            let txHash, signedTx;
            // TODO: TX_NONCE (different constants for different uses of exponentialBackoff?)
            const result = yield (0, providers_1.exponentialBackoff)(TX_NONCE_RETRY_WAIT, TX_NONCE_RETRY_NUMBER, TX_NONCE_RETRY_WAIT_BACKOFF, ()=>__awaiter(this, void 0, void 0, function*() {
                    [txHash, signedTx] = yield this.signTransaction(receiverId, actions);
                    const publicKey = signedTx.transaction.publicKey;
                    try {
                        return yield this.connection.provider.sendTransaction(signedTx);
                    } catch (error) {
                        if (error.type === 'InvalidNonce') {
                            utils_1.Logger.warn(`Retrying transaction ${receiverId}:${(0, utils_1.baseEncode)(txHash)} with new nonce.`);
                            delete this.accessKeyByPublicKeyCache[publicKey.toString()];
                            return null;
                        }
                        if (error.type === 'Expired') {
                            utils_1.Logger.warn(`Retrying transaction ${receiverId}:${(0, utils_1.baseEncode)(txHash)} due to expired block hash`);
                            return null;
                        }
                        error.context = new types_1.ErrorContext((0, utils_1.baseEncode)(txHash));
                        throw error;
                    }
                }));
            if (!result) {
                // TODO: This should have different code actually, as means "transaction not submitted for sure"
                throw new types_1.TypedError('nonce retries exceeded for transaction. This usually means there are too many parallel requests with the same access key.', 'RetriesExceeded');
            }
            (0, utils_1.printTxOutcomeLogsAndFailures)({
                contractId: signedTx.transaction.receiverId,
                outcome: result
            });
            // Should be falsy if result.status.Failure is null
            if (!returnError && typeof result.status === 'object' && typeof result.status.Failure === 'object' && result.status.Failure !== null) {
                // if error data has error_message and error_type properties, we consider that node returned an error in the old format
                if (result.status.Failure.error_message && result.status.Failure.error_type) {
                    throw new types_1.TypedError(`Transaction ${result.transaction_outcome.id} failed. ${result.status.Failure.error_message}`, result.status.Failure.error_type);
                } else {
                    throw (0, utils_1.parseResultError)(result);
                }
            }
            // TODO: if Tx is Unknown or Started.
            return result;
        });
    }
    /**
     * Finds the {@link AccessKeyView} associated with the accounts {@link PublicKey} stored in the {@link "@near-js/keystores".keystore.KeyStore | Keystore}.
     *
     * @todo Find matching access key based on transaction (i.e. receiverId and actions)
     *
     * @param receiverId currently unused (see todo)
     * @param actions currently unused (see todo)
     * @returns `{ publicKey PublicKey; accessKey: AccessKeyView }`
     */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
    findAccessKey(receiverId, actions) {
        return __awaiter(this, void 0, void 0, function*() {
            // TODO: Find matching access key based on transaction (i.e. receiverId and actions)
            const publicKey = yield this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
            if (!publicKey) {
                throw new types_1.TypedError(`no matching key pair found in ${this.connection.signer}`, 'PublicKeyNotFound');
            }
            const cachedAccessKey = this.accessKeyByPublicKeyCache[publicKey.toString()];
            if (cachedAccessKey !== undefined) {
                return {
                    publicKey,
                    accessKey: cachedAccessKey
                };
            }
            try {
                const rawAccessKey = yield this.connection.provider.query({
                    request_type: 'view_access_key',
                    account_id: this.accountId,
                    public_key: publicKey.toString(),
                    finality: 'optimistic'
                });
                // store nonce as BigInt to preserve precision on big number
                const accessKey = Object.assign(Object.assign({}, rawAccessKey), {
                    nonce: BigInt(rawAccessKey.nonce || 0)
                });
                // this function can be called multiple times and retrieve the same access key
                // this checks to see if the access key was already retrieved and cached while
                // the above network call was in flight. To keep nonce values in line, we return
                // the cached access key.
                if (this.accessKeyByPublicKeyCache[publicKey.toString()]) {
                    return {
                        publicKey,
                        accessKey: this.accessKeyByPublicKeyCache[publicKey.toString()]
                    };
                }
                this.accessKeyByPublicKeyCache[publicKey.toString()] = accessKey;
                return {
                    publicKey,
                    accessKey
                };
            } catch (e) {
                if (e.type == 'AccessKeyDoesNotExist') {
                    return null;
                }
                throw e;
            }
        });
    }
    /**
     * Create a new account and deploy a contract to it
     *
     * @param contractId NEAR account where the contract is deployed
     * @param publicKey The public key to add to the created contract account
     * @param data The compiled contract code
     * @param amount of NEAR to transfer to the created contract account. Transfer enough to pay for storage https://docs.near.org/docs/concepts/storage-staking
     */ createAndDeployContract(contractId, publicKey, data, amount) {
        return __awaiter(this, void 0, void 0, function*() {
            const accessKey = fullAccessKey();
            yield this.signAndSendTransaction({
                receiverId: contractId,
                actions: [
                    createAccount(),
                    transfer(amount),
                    addKey(crypto_1.PublicKey.from(publicKey), accessKey),
                    deployContract(data)
                ]
            });
            const contractAccount = new Account(this.connection, contractId);
            return contractAccount;
        });
    }
    /**
     * @param receiverId NEAR account receiving Ⓝ
     * @param amount Amount to send in yoctoⓃ
     */ sendMoney(receiverId, amount) {
        return __awaiter(this, void 0, void 0, function*() {
            return this.signAndSendTransaction({
                receiverId,
                actions: [
                    transfer(amount)
                ]
            });
        });
    }
    /**
     * @param newAccountId NEAR account name to be created
     * @param publicKey A public key created from the masterAccount
     */ createAccount(newAccountId, publicKey, amount) {
        return __awaiter(this, void 0, void 0, function*() {
            const accessKey = fullAccessKey();
            return this.signAndSendTransaction({
                receiverId: newAccountId,
                actions: [
                    createAccount(),
                    transfer(amount),
                    addKey(crypto_1.PublicKey.from(publicKey), accessKey)
                ]
            });
        });
    }
    /**
     * @param beneficiaryId The NEAR account that will receive the remaining Ⓝ balance from the account being deleted
     */ deleteAccount(beneficiaryId) {
        return __awaiter(this, void 0, void 0, function*() {
            utils_1.Logger.log('Deleting an account does not automatically transfer NFTs and FTs to the beneficiary address. Ensure to transfer assets before deleting.');
            return this.signAndSendTransaction({
                receiverId: this.accountId,
                actions: [
                    deleteAccount(beneficiaryId)
                ]
            });
        });
    }
    /**
     * @param data The compiled contract code
     */ deployContract(data) {
        return __awaiter(this, void 0, void 0, function*() {
            return this.signAndSendTransaction({
                receiverId: this.accountId,
                actions: [
                    deployContract(data)
                ]
            });
        });
    }
    /** @hidden */ encodeJSContractArgs(contractId, method, args) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(contractId),
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
                0
            ]),
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(method),
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
                0
            ]),
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(args)
        ]);
    }
    /**
      * Execute a function call.
      * @param options The options for the function call.
      * @param options.contractId The NEAR account ID of the smart contract.
      * @param options.methodName The name of the method to be called on the smart contract.
      * @param options.args The arguments to be passed to the method.
      * @param options.gas The maximum amount of gas to be used for the function call.
      * @param options.attachedDeposit The amount of NEAR tokens to be attached to the function call.
      * @param options.walletMeta Metadata for wallet integration.
      * @param options.walletCallbackUrl The callback URL for wallet integration.
      * @param options.stringify A function to convert input arguments into bytes array
      * @param options.jsContract Whether the contract is from JS SDK, automatically encodes args from JS SDK to binary.
      * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the function call.
      */ functionCall({ contractId, methodName, args = {}, gas = utils_1.DEFAULT_FUNCTION_CALL_GAS, attachedDeposit, walletMeta, walletCallbackUrl, stringify, jsContract }) {
        return __awaiter(this, void 0, void 0, function*() {
            this.validateArgs(args);
            let functionCallArgs;
            if (jsContract) {
                const encodedArgs = this.encodeJSContractArgs(contractId, methodName, JSON.stringify(args));
                functionCallArgs = [
                    'call_js_contract',
                    encodedArgs,
                    gas,
                    attachedDeposit,
                    null,
                    true
                ];
            } else {
                const stringifyArg = stringify === undefined ? transactions_1.stringifyJsonOrBytes : stringify;
                functionCallArgs = [
                    methodName,
                    args,
                    gas,
                    attachedDeposit,
                    stringifyArg,
                    false
                ];
            }
            return this.signAndSendTransaction({
                receiverId: jsContract ? this.connection.jsvmAccountId : contractId,
                // eslint-disable-next-line prefer-spread
                actions: [
                    functionCall.apply(void 0, functionCallArgs)
                ],
                walletMeta,
                walletCallbackUrl
            });
        });
    }
    /**
     * @see [https://docs.near.org/concepts/basics/accounts/access-keys](https://docs.near.org/concepts/basics/accounts/access-keys)
     * @todo expand this API to support more options.
     * @param publicKey A public key to be associated with the contract
     * @param contractId NEAR account where the contract is deployed
     * @param methodNames The method names on the contract that should be allowed to be called. Pass null for no method names and '' or [] for any method names.
     * @param amount Payment in yoctoⓃ that is sent to the contract during this function call
     */ addKey(publicKey, contractId, methodNames, amount) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!methodNames) {
                methodNames = [];
            }
            if (!Array.isArray(methodNames)) {
                methodNames = [
                    methodNames
                ];
            }
            let accessKey;
            if (!contractId) {
                accessKey = fullAccessKey();
            } else {
                accessKey = functionCallAccessKey(contractId, methodNames, amount);
            }
            return this.signAndSendTransaction({
                receiverId: this.accountId,
                actions: [
                    addKey(crypto_1.PublicKey.from(publicKey), accessKey)
                ]
            });
        });
    }
    /**
     * @param publicKey The public key to be deleted
     * @returns {Promise<FinalExecutionOutcome>}
     */ deleteKey(publicKey) {
        return __awaiter(this, void 0, void 0, function*() {
            return this.signAndSendTransaction({
                receiverId: this.accountId,
                actions: [
                    deleteKey(crypto_1.PublicKey.from(publicKey))
                ]
            });
        });
    }
    /**
     * @see [https://near-nodes.io/validator/staking-and-delegation](https://near-nodes.io/validator/staking-and-delegation)
     *
     * @param publicKey The public key for the account that's staking
     * @param amount The account to stake in yoctoⓃ
     */ stake(publicKey, amount) {
        return __awaiter(this, void 0, void 0, function*() {
            return this.signAndSendTransaction({
                receiverId: this.accountId,
                actions: [
                    stake(amount, crypto_1.PublicKey.from(publicKey))
                ]
            });
        });
    }
    /**
     * Compose and sign a SignedDelegate action to be executed in a transaction on behalf of this Account instance
     *
     * @param options Options for the transaction.
     * @param options.actions Actions to be included in the meta transaction
     * @param options.blockHeightTtl Number of blocks past the current block height for which the SignedDelegate action may be included in a meta transaction
     * @param options.receiverId Receiver account of the meta transaction
     */ signedDelegate({ actions, blockHeightTtl, receiverId }) {
        return __awaiter(this, void 0, void 0, function*() {
            const { provider, signer } = this.connection;
            const { header } = yield provider.block({
                finality: 'final'
            });
            const { accessKey, publicKey } = yield this.findAccessKey(null, null);
            const delegateAction = (0, transactions_1.buildDelegateAction)({
                actions,
                maxBlockHeight: BigInt(header.height) + BigInt(blockHeightTtl),
                nonce: BigInt(accessKey.nonce) + BigInt(1),
                publicKey,
                receiverId,
                senderId: this.accountId
            });
            const { signedDelegateAction } = yield (0, transactions_1.signDelegateAction)({
                delegateAction,
                signer: {
                    sign: (message)=>__awaiter(this, void 0, void 0, function*() {
                            const { signature } = yield signer.signMessage(message, delegateAction.senderId, this.connection.networkId);
                            return signature;
                        })
                }
            });
            return signedDelegateAction;
        });
    }
    /** @hidden */ validateArgs(args) {
        const isUint8Array = args.byteLength !== undefined && args.byteLength === args.length;
        if (isUint8Array) {
            return;
        }
        if (Array.isArray(args) || typeof args !== 'object') {
            throw new types_1.PositionalArgsError();
        }
    }
    /**
     * Invoke a contract view function using the RPC API.
     * @see [https://docs.near.org/api/rpc/contracts#call-a-contract-function](https://docs.near.org/api/rpc/contracts#call-a-contract-function)
     *
     * @param options Function call options.
     * @param options.contractId NEAR account where the contract is deployed
     * @param options.methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
     * @param options.args Any arguments to the view contract method, wrapped in JSON
     * @param options.parse Parse the result of the call. Receives a Buffer (bytes array) and converts it to any object. By default result will be treated as json.
     * @param options.stringify Convert input arguments into a bytes array. By default the input is treated as a JSON.
     * @param options.jsContract Is contract from JS SDK, automatically encodes args from JS SDK to binary.
     * @param options.blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     * @returns {Promise<any>}
     */ viewFunction(options) {
        return __awaiter(this, void 0, void 0, function*() {
            return yield (0, utils_2.viewFunction)(this.connection, options);
        });
    }
    /**
     * Returns the state (key value pairs) of this account's contract based on the key prefix.
     * Pass an empty string for prefix if you would like to return the entire state.
     * @see [https://docs.near.org/api/rpc/contracts#view-contract-state](https://docs.near.org/api/rpc/contracts#view-contract-state)
     *
     * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
     * @param blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     */ viewState(prefix, blockQuery = {
        finality: 'optimistic'
    }) {
        return __awaiter(this, void 0, void 0, function*() {
            return yield (0, utils_2.viewState)(this.connection, this.accountId, prefix, blockQuery);
        });
    }
    /**
     * Get all access keys for the account
     * @see [https://docs.near.org/api/rpc/access-keys#view-access-key-list](https://docs.near.org/api/rpc/access-keys#view-access-key-list)
     */ getAccessKeys() {
        var _a;
        return __awaiter(this, void 0, void 0, function*() {
            const response = yield this.connection.provider.query({
                request_type: 'view_access_key_list',
                account_id: this.accountId,
                finality: 'optimistic'
            });
            // Replace raw nonce into a new BigInt
            return (_a = response === null || response === void 0 ? void 0 : response.keys) === null || _a === void 0 ? void 0 : _a.map((key)=>Object.assign(Object.assign({}, key), {
                    access_key: Object.assign(Object.assign({}, key.access_key), {
                        nonce: BigInt(key.access_key.nonce)
                    })
                }));
        });
    }
    /**
     * Returns a list of authorized apps
     * @todo update the response value to return all the different keys, not just app keys.
     */ getAccountDetails() {
        return __awaiter(this, void 0, void 0, function*() {
            // TODO: update the response value to return all the different keys, not just app keys.
            // Also if we need this function, or getAccessKeys is good enough.
            const accessKeys = yield this.getAccessKeys();
            const authorizedApps = accessKeys.filter((item)=>item.access_key.permission !== 'FullAccess').map((item)=>{
                const perm = item.access_key.permission;
                return {
                    contractId: perm.FunctionCall.receiver_id,
                    amount: perm.FunctionCall.allowance,
                    publicKey: item.public_key
                };
            });
            return {
                authorizedApps
            };
        });
    }
    /**
     * Returns calculated account balance
     */ getAccountBalance() {
        return __awaiter(this, void 0, void 0, function*() {
            const protocolConfig = yield this.connection.provider.experimental_protocolConfig({
                finality: 'final'
            });
            const state = yield this.state();
            const costPerByte = BigInt(protocolConfig.runtime_config.storage_amount_per_byte);
            const stateStaked = BigInt(state.storage_usage) * costPerByte;
            const staked = BigInt(state.locked);
            const totalBalance = BigInt(state.amount) + staked;
            const availableBalance = totalBalance - (staked > stateStaked ? staked : stateStaked);
            return {
                total: totalBalance.toString(),
                stateStaked: stateStaked.toString(),
                staked: staked.toString(),
                available: availableBalance.toString()
            };
        });
    }
    /**
     * Returns the NEAR tokens balance and validators of a given account that is delegated to the staking pools that are part of the validators set in the current epoch.
     *
     * NOTE: If the tokens are delegated to a staking pool that is currently on pause or does not have enough tokens to participate in validation, they won't be accounted for.
     * @returns {Promise<ActiveDelegatedStakeBalance>}
     */ getActiveDelegatedStakeBalance() {
        return __awaiter(this, void 0, void 0, function*() {
            const block = yield this.connection.provider.block({
                finality: 'final'
            });
            const blockHash = block.header.hash;
            const epochId = block.header.epoch_id;
            const { current_validators, next_validators, current_proposals } = yield this.connection.provider.validators(epochId);
            const pools = new Set();
            [
                ...current_validators,
                ...next_validators,
                ...current_proposals
            ].forEach((validator)=>pools.add(validator.account_id));
            const uniquePools = [
                ...pools
            ];
            const promises = uniquePools.map((validator)=>this.viewFunction({
                    contractId: validator,
                    methodName: 'get_account_total_balance',
                    args: {
                        account_id: this.accountId
                    },
                    blockQuery: {
                        blockId: blockHash
                    }
                }));
            const results = yield Promise.allSettled(promises);
            const hasTimeoutError = results.some((result)=>{
                if (result.status === 'rejected' && result.reason.type === 'TimeoutError') {
                    return true;
                }
                return false;
            });
            // When RPC is down and return timeout error, throw error
            if (hasTimeoutError) {
                throw new Error('Failed to get delegated stake balance');
            }
            const summary = results.reduce((result, state, index)=>{
                const validatorId = uniquePools[index];
                if (state.status === 'fulfilled') {
                    const currentBN = BigInt(state.value);
                    if (currentBN !== BigInt(0)) {
                        return Object.assign(Object.assign({}, result), {
                            stakedValidators: [
                                ...result.stakedValidators,
                                {
                                    validatorId,
                                    amount: currentBN.toString()
                                }
                            ],
                            total: result.total + currentBN
                        });
                    }
                }
                if (state.status === 'rejected') {
                    return Object.assign(Object.assign({}, result), {
                        failedValidators: [
                            ...result.failedValidators,
                            {
                                validatorId,
                                error: state.reason
                            }
                        ]
                    });
                }
                return result;
            }, {
                stakedValidators: [],
                failedValidators: [],
                total: BigInt(0)
            });
            return Object.assign(Object.assign({}, summary), {
                total: summary.total.toString()
            });
        });
    }
}
exports.Account = Account;
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/constants.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MULTISIG_CONFIRM_METHODS = exports.MULTISIG_CHANGE_METHODS = exports.MULTISIG_DEPOSIT = exports.MULTISIG_GAS = exports.MULTISIG_ALLOWANCE = exports.MULTISIG_STORAGE_KEY = void 0;
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+utils@0.2.2/node_modules/@near-js/utils/lib/index.js [app-client] (ecmascript)");
exports.MULTISIG_STORAGE_KEY = '__multisigRequest';
exports.MULTISIG_ALLOWANCE = BigInt((0, utils_1.parseNearAmount)('1'));
// TODO: Different gas value for different requests (can reduce gas usage dramatically)
exports.MULTISIG_GAS = BigInt('100000000000000');
exports.MULTISIG_DEPOSIT = BigInt('0');
exports.MULTISIG_CHANGE_METHODS = [
    'add_request',
    'add_request_and_confirm',
    'delete_request',
    'confirm'
];
exports.MULTISIG_CONFIRM_METHODS = [
    'confirm'
];
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/types.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MultisigStateStatus = exports.MultisigDeleteRequestRejectionError = void 0;
var MultisigDeleteRequestRejectionError;
(function(MultisigDeleteRequestRejectionError) {
    MultisigDeleteRequestRejectionError["CANNOT_DESERIALIZE_STATE"] = "Cannot deserialize the contract state";
    MultisigDeleteRequestRejectionError["MULTISIG_NOT_INITIALIZED"] = "Smart contract panicked: Multisig contract should be initialized before usage";
    MultisigDeleteRequestRejectionError["NO_SUCH_REQUEST"] = "Smart contract panicked: panicked at 'No such request: either wrong number or already confirmed'";
    MultisigDeleteRequestRejectionError["REQUEST_COOLDOWN_ERROR"] = "Request cannot be deleted immediately after creation.";
    MultisigDeleteRequestRejectionError["METHOD_NOT_FOUND"] = "Contract method is not found";
})(MultisigDeleteRequestRejectionError = exports.MultisigDeleteRequestRejectionError || (exports.MultisigDeleteRequestRejectionError = {}));
var MultisigStateStatus;
(function(MultisigStateStatus) {
    MultisigStateStatus[MultisigStateStatus["INVALID_STATE"] = 0] = "INVALID_STATE";
    MultisigStateStatus[MultisigStateStatus["STATE_NOT_INITIALIZED"] = 1] = "STATE_NOT_INITIALIZED";
    MultisigStateStatus[MultisigStateStatus["VALID_STATE"] = 2] = "VALID_STATE";
    MultisigStateStatus[MultisigStateStatus["UNKNOWN_STATE"] = 3] = "UNKNOWN_STATE";
})(MultisigStateStatus = exports.MultisigStateStatus || (exports.MultisigStateStatus = {}));
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/account_multisig.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
"use strict";
var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AccountMultisig = void 0;
const transactions_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+transactions@1.2.2/node_modules/@near-js/transactions/lib/index.js [app-client] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+utils@0.2.2/node_modules/@near-js/utils/lib/index.js [app-client] (ecmascript)");
const account_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/account.js [app-client] (ecmascript)");
const constants_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/constants.js [app-client] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/types.js [app-client] (ecmascript)");
const { deployContract, functionCall } = transactions_1.actionCreators;
var MultisigCodeStatus;
(function(MultisigCodeStatus) {
    MultisigCodeStatus[MultisigCodeStatus["INVALID_CODE"] = 0] = "INVALID_CODE";
    MultisigCodeStatus[MultisigCodeStatus["VALID_CODE"] = 1] = "VALID_CODE";
    MultisigCodeStatus[MultisigCodeStatus["UNKNOWN_CODE"] = 2] = "UNKNOWN_CODE";
})(MultisigCodeStatus || (MultisigCodeStatus = {}));
// in memory request cache for node w/o localStorage
const storageFallback = {
    [constants_1.MULTISIG_STORAGE_KEY]: null
};
class AccountMultisig extends account_1.Account {
    /**
     * Constructs an instance of the `AccountMultisig` class.
     * @param connection The NEAR connection object.
     * @param accountId The NEAR account ID.
     * @param options Additional options for the multisig account.
     * @param options.storage Storage to store data related to multisig operations.
     * @param options.onAddRequestResult Callback function to handle the result of adding a request.
     */ constructor(connection, accountId, options){
        super(connection, accountId);
        this.storage = options.storage;
        this.onAddRequestResult = options.onAddRequestResult;
    }
    /**
     * Sign and send a transaction with the multisig account as the sender.
     * @param receiverId - The NEAR account ID of the transaction receiver.
     * @param actions - The list of actions to be included in the transaction.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the transaction.
     */ signAndSendTransactionWithAccount(receiverId, actions) {
        const _super = Object.create(null, {
            signAndSendTransaction: {
                get: ()=>super.signAndSendTransaction
            }
        });
        return __awaiter(this, void 0, void 0, function*() {
            return _super.signAndSendTransaction.call(this, {
                receiverId,
                actions
            });
        });
    }
    /**
     * Sign and send a multisig transaction to add a request and confirm it.
     * @param options Options for the multisig transaction.
     * @param options.receiverId The NEAR account ID of the transaction receiver.
     * @param options.actions The list of actions to be included in the transaction.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the transaction.
     */ signAndSendTransaction({ receiverId, actions }) {
        const _super = Object.create(null, {
            signAndSendTransaction: {
                get: ()=>super.signAndSendTransaction
            }
        });
        return __awaiter(this, void 0, void 0, function*() {
            const { accountId } = this;
            const args = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(JSON.stringify({
                request: {
                    receiver_id: receiverId,
                    actions: convertActions(actions, accountId, receiverId)
                }
            }));
            let result;
            try {
                result = yield _super.signAndSendTransaction.call(this, {
                    receiverId: accountId,
                    actions: [
                        functionCall('add_request_and_confirm', args, constants_1.MULTISIG_GAS, constants_1.MULTISIG_DEPOSIT)
                    ]
                });
            } catch (e) {
                if (e.toString().includes('Account has too many active requests. Confirm or delete some')) {
                    yield this.deleteUnconfirmedRequests();
                    return yield this.signAndSendTransaction({
                        receiverId,
                        actions
                    });
                }
                throw e;
            }
            // TODO: Are following even needed? Seems like it throws on error already
            if (!result.status) {
                throw new Error('Request failed');
            }
            const status = Object.assign({}, result.status);
            if (!status.SuccessValue || typeof status.SuccessValue !== 'string') {
                throw new Error('Request failed');
            }
            this.setRequest({
                accountId,
                actions,
                requestId: parseInt(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(status.SuccessValue, 'base64').toString('ascii'), 10)
            });
            if (this.onAddRequestResult) {
                yield this.onAddRequestResult(result);
            }
            // NOTE there is no await on purpose to avoid blocking for 2fa
            this.deleteUnconfirmedRequests();
            return result;
        });
    }
    /**
     * This method submits a canary transaction that is expected to always fail in order to determine whether the contract currently has valid multisig state
     * and whether it is initialized. The canary transaction attempts to delete a request at index u32_max and will go through if a request exists at that index.
     * a u32_max + 1 and -1 value cannot be used for the canary due to expected u32 error thrown before deserialization attempt.
     * @param contractBytes The bytecode of the multisig contract.
     * @returns {Promise<{ codeStatus: MultisigCodeStatus; stateStatus: MultisigStateStatus }>} A promise that resolves to the status of the code and state.
     */ checkMultisigCodeAndStateStatus(contractBytes) {
        const _super = Object.create(null, {
            signAndSendTransaction: {
                get: ()=>super.signAndSendTransaction
            }
        });
        return __awaiter(this, void 0, void 0, function*() {
            const u32_max = 4294967295;
            const validCodeStatusIfNoDeploy = contractBytes ? MultisigCodeStatus.UNKNOWN_CODE : MultisigCodeStatus.VALID_CODE;
            try {
                if (contractBytes) {
                    yield _super.signAndSendTransaction.call(this, {
                        receiverId: this.accountId,
                        actions: [
                            deployContract(contractBytes),
                            functionCall('delete_request', {
                                request_id: u32_max
                            }, constants_1.MULTISIG_GAS, constants_1.MULTISIG_DEPOSIT)
                        ]
                    });
                } else {
                    yield this.deleteRequest(u32_max);
                }
                return {
                    codeStatus: MultisigCodeStatus.VALID_CODE,
                    stateStatus: types_1.MultisigStateStatus.VALID_STATE
                };
            } catch (e) {
                if (new RegExp(types_1.MultisigDeleteRequestRejectionError.CANNOT_DESERIALIZE_STATE).test(e && e.kind && e.kind.ExecutionError)) {
                    return {
                        codeStatus: validCodeStatusIfNoDeploy,
                        stateStatus: types_1.MultisigStateStatus.INVALID_STATE
                    };
                } else if (new RegExp(types_1.MultisigDeleteRequestRejectionError.MULTISIG_NOT_INITIALIZED).test(e && e.kind && e.kind.ExecutionError)) {
                    return {
                        codeStatus: validCodeStatusIfNoDeploy,
                        stateStatus: types_1.MultisigStateStatus.STATE_NOT_INITIALIZED
                    };
                } else if (new RegExp(types_1.MultisigDeleteRequestRejectionError.NO_SUCH_REQUEST).test(e && e.kind && e.kind.ExecutionError)) {
                    return {
                        codeStatus: validCodeStatusIfNoDeploy,
                        stateStatus: types_1.MultisigStateStatus.VALID_STATE
                    };
                } else if (new RegExp(types_1.MultisigDeleteRequestRejectionError.METHOD_NOT_FOUND).test(e && e.message)) {
                    // not reachable if transaction included a deploy
                    return {
                        codeStatus: MultisigCodeStatus.INVALID_CODE,
                        stateStatus: types_1.MultisigStateStatus.UNKNOWN_STATE
                    };
                }
                throw e;
            }
        });
    }
    /**
     * Delete a multisig request by its ID.
     * @param request_id The ID of the multisig request to be deleted.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the deletion.
     */ deleteRequest(request_id) {
        return super.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [
                functionCall('delete_request', {
                    request_id
                }, constants_1.MULTISIG_GAS, constants_1.MULTISIG_DEPOSIT)
            ]
        });
    }
    /**
     * Delete all multisig requests associated with the account.
     * @returns {Promise<void>} A promise that resolves when all requests are deleted.
     */ deleteAllRequests() {
        return __awaiter(this, void 0, void 0, function*() {
            const request_ids = yield this.getRequestIds();
            if (request_ids.length) {
                yield Promise.all(request_ids.map((id)=>this.deleteRequest(id)));
            }
        });
    }
    /**
     * Delete unconfirmed multisig requests associated with the account.
     * @returns {Promise<void>} A promise that resolves when unconfirmed requests are deleted.
     */ deleteUnconfirmedRequests() {
        const _super = Object.create(null, {
            signAndSendTransaction: {
                get: ()=>super.signAndSendTransaction
            }
        });
        return __awaiter(this, void 0, void 0, function*() {
            // TODO: Delete in batch, don't delete unexpired
            // TODO: Delete in batch, don't delete unexpired (can reduce gas usage dramatically)
            const request_ids = yield this.getRequestIds();
            const { requestId } = this.getRequest();
            for (const requestIdToDelete of request_ids){
                if (requestIdToDelete == requestId) {
                    continue;
                }
                try {
                    yield _super.signAndSendTransaction.call(this, {
                        receiverId: this.accountId,
                        actions: [
                            functionCall('delete_request', {
                                request_id: requestIdToDelete
                            }, constants_1.MULTISIG_GAS, constants_1.MULTISIG_DEPOSIT)
                        ]
                    });
                } catch (e) {
                    utils_1.Logger.warn('Attempt to delete an earlier request before 15 minutes failed. Will try again.');
                }
            }
        });
    }
    // helpers
    getRequestIds() {
        return __awaiter(this, void 0, void 0, function*() {
            // TODO: Read requests from state to allow filtering by expiration time
            // TODO: https://github.com/near/core-contracts/blob/305d1db4f4f2cf5ce4c1ef3479f7544957381f11/multisig/src/lib.rs#L84
            return this.viewFunction({
                contractId: this.accountId,
                methodName: 'list_request_ids'
            });
        });
    }
    getRequest() {
        if (this.storage) {
            return JSON.parse(this.storage.getItem(constants_1.MULTISIG_STORAGE_KEY) || '{}');
        }
        return storageFallback[constants_1.MULTISIG_STORAGE_KEY];
    }
    setRequest(data) {
        if (this.storage) {
            return this.storage.setItem(constants_1.MULTISIG_STORAGE_KEY, JSON.stringify(data));
        }
        storageFallback[constants_1.MULTISIG_STORAGE_KEY] = data;
    }
}
exports.AccountMultisig = AccountMultisig;
const convertPKForContract = (pk)=>pk.toString().replace('ed25519:', '');
const convertActions = (actions, accountId, receiverId)=>actions.map((a)=>{
        const type = a.enum;
        const { gas, publicKey, methodName, args, deposit, accessKey, code } = a[type];
        const action = {
            type: type[0].toUpperCase() + type.substr(1),
            gas: gas && gas.toString() || undefined,
            public_key: publicKey && convertPKForContract(publicKey) || undefined,
            method_name: methodName,
            args: args && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(args).toString('base64') || undefined,
            code: code && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(code).toString('base64') || undefined,
            amount: deposit && deposit.toString() || undefined,
            deposit: deposit && deposit.toString() || '0',
            permission: undefined
        };
        if (accessKey) {
            if (receiverId === accountId && accessKey.permission.enum !== 'fullAccess') {
                action.permission = {
                    receiver_id: accountId,
                    allowance: constants_1.MULTISIG_ALLOWANCE.toString(),
                    method_names: constants_1.MULTISIG_CHANGE_METHODS
                };
            }
            if (accessKey.permission.enum === 'functionCall') {
                const { receiverId: receiver_id, methodNames: method_names, allowance } = accessKey.permission.functionCall;
                action.permission = {
                    receiver_id,
                    allowance: allowance && allowance.toString() || undefined,
                    method_names
                };
            }
        }
        return action;
    });
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/account_2fa.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
"use strict";
var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Account2FA = void 0;
const crypto_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+crypto@1.2.4/node_modules/@near-js/crypto/lib/index.js [app-client] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+types@0.2.1/node_modules/@near-js/types/lib/index.js [app-client] (ecmascript)");
const providers_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+providers@0.2.2/node_modules/@near-js/providers/lib/index.js [app-client] (ecmascript)");
const transactions_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+transactions@1.2.2/node_modules/@near-js/transactions/lib/index.js [app-client] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+utils@0.2.2/node_modules/@near-js/utils/lib/index.js [app-client] (ecmascript)");
const account_multisig_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/account_multisig.js [app-client] (ecmascript)");
const constants_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/constants.js [app-client] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/types.js [app-client] (ecmascript)");
const { addKey, deleteKey, deployContract, fullAccessKey, functionCall, functionCallAccessKey } = transactions_1.actionCreators;
class Account2FA extends account_multisig_1.AccountMultisig {
    constructor(connection, accountId, options){
        super(connection, accountId, options);
        this.helperUrl = 'https://helper.testnet.near.org';
        this.helperUrl = options.helperUrl || this.helperUrl;
        this.storage = options.storage;
        this.sendCode = options.sendCode || this.sendCodeDefault;
        this.getCode = options.getCode || this.getCodeDefault;
        this.verifyCode = options.verifyCode || this.verifyCodeDefault;
        this.onConfirmResult = options.onConfirmResult;
    }
    /**
     * Sign a transaction to preform a list of actions and broadcast it using the RPC API.
     * @see {@link "@near-js/providers".json-rpc-provider.JsonRpcProvider.sendTransaction | JsonRpcProvider.sendTransaction}
     *
     * @param options Options for the transaction.
     * @param options.receiverId The NEAR account ID of the transaction receiver.
     * @param options.actions The list of actions to be included in the transaction.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the transaction.
     */ signAndSendTransaction({ receiverId, actions }) {
        const _super = Object.create(null, {
            signAndSendTransaction: {
                get: ()=>super.signAndSendTransaction
            }
        });
        return __awaiter(this, void 0, void 0, function*() {
            yield _super.signAndSendTransaction.call(this, {
                receiverId,
                actions
            });
            // TODO: Should following override onRequestResult in superclass instead of doing custom signAndSendTransaction?
            yield this.sendCode();
            const result = yield this.promptAndVerify();
            if (this.onConfirmResult) {
                yield this.onConfirmResult(result);
            }
            return result;
        });
    }
    // default helpers for CH deployments of multisig
    /**
     * Deploy a multisig contract with 2FA and handle the deployment process.
     * @param contractBytes - The bytecode of the multisig contract.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the deployment.
     */ deployMultisig(contractBytes) {
        const _super = Object.create(null, {
            signAndSendTransactionWithAccount: {
                get: ()=>super.signAndSendTransactionWithAccount
            }
        });
        return __awaiter(this, void 0, void 0, function*() {
            const { accountId } = this;
            const seedOrLedgerKey = (yield this.getRecoveryMethods()).data.filter(({ kind, publicKey })=>(kind === 'phrase' || kind === 'ledger') && publicKey !== null).map((rm)=>rm.publicKey);
            const fak2lak = (yield this.getAccessKeys()).filter(({ public_key, access_key: { permission } })=>permission === 'FullAccess' && !seedOrLedgerKey.includes(public_key)).map((ak)=>ak.public_key).map(toPK);
            const confirmOnlyKey = toPK((yield this.postSignedJson('/2fa/getAccessKey', {
                accountId
            })).publicKey);
            const newArgs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(JSON.stringify({
                'num_confirmations': 2
            }));
            const actions = [
                ...fak2lak.map((pk)=>deleteKey(pk)),
                ...fak2lak.map((pk)=>addKey(pk, functionCallAccessKey(accountId, constants_1.MULTISIG_CHANGE_METHODS, null))),
                addKey(confirmOnlyKey, functionCallAccessKey(accountId, constants_1.MULTISIG_CONFIRM_METHODS, null)),
                deployContract(contractBytes)
            ];
            const newFunctionCallActionBatch = actions.concat(functionCall('new', newArgs, constants_1.MULTISIG_GAS, constants_1.MULTISIG_DEPOSIT));
            utils_1.Logger.log('deploying multisig contract for', accountId);
            const { stateStatus: multisigStateStatus } = yield this.checkMultisigCodeAndStateStatus(contractBytes);
            switch(multisigStateStatus){
                case types_2.MultisigStateStatus.STATE_NOT_INITIALIZED:
                    return yield _super.signAndSendTransactionWithAccount.call(this, accountId, newFunctionCallActionBatch);
                case types_2.MultisigStateStatus.VALID_STATE:
                    return yield _super.signAndSendTransactionWithAccount.call(this, accountId, actions);
                case types_2.MultisigStateStatus.INVALID_STATE:
                    throw new types_1.TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account has existing state.`, 'ContractHasExistingState');
                default:
                    throw new types_1.TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account state could not be verified.`, 'ContractStateUnknown');
            }
        });
    }
    /**
     * Disable 2FA with the option to clean up contract state.
     * @param options Options for disabling 2FA.
     * @param options.contractBytes The bytecode of the contract to deploy.
     * @param options.cleanupContractBytes The bytecode of the cleanup contract (optional).
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the operation.
     */ disableWithFAK({ contractBytes, cleanupContractBytes }) {
        return __awaiter(this, void 0, void 0, function*() {
            let cleanupActions = [];
            if (cleanupContractBytes) {
                yield this.deleteAllRequests().catch((e)=>e);
                cleanupActions = yield this.get2faDisableCleanupActions(cleanupContractBytes);
            }
            const keyConversionActions = yield this.get2faDisableKeyConversionActions();
            const actions = [
                ...cleanupActions,
                ...keyConversionActions,
                deployContract(contractBytes)
            ];
            const accessKeyInfo = yield this.findAccessKey(this.accountId, actions);
            if (accessKeyInfo && accessKeyInfo.accessKey && accessKeyInfo.accessKey.permission !== 'FullAccess') {
                throw new types_1.TypedError('No full access key found in keystore. Unable to bypass multisig', 'NoFAKFound');
            }
            return this.signAndSendTransactionWithAccount(this.accountId, actions);
        });
    }
    /**
     * Retrieves cleanup actions for disabling 2FA.
     * @param cleanupContractBytes - The bytecode of the cleanup contract.
     * @returns {Promise<Action[]>} - A promise that resolves to an array of cleanup actions.
     */ get2faDisableCleanupActions(cleanupContractBytes) {
        return __awaiter(this, void 0, void 0, function*() {
            const currentAccountState = yield this.viewState('').catch((error)=>{
                const cause = error.cause && error.cause.name;
                if (cause == 'NO_CONTRACT_CODE') {
                    return [];
                }
                throw cause == 'TOO_LARGE_CONTRACT_STATE' ? new types_1.TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account has existing state.`, 'ContractHasExistingState') : error;
            });
            const currentAccountStateKeys = currentAccountState.map(({ key })=>key.toString('base64'));
            return currentAccountState.length ? [
                deployContract(cleanupContractBytes),
                functionCall('clean', {
                    keys: currentAccountStateKeys
                }, constants_1.MULTISIG_GAS, BigInt('0'))
            ] : [];
        });
    }
    /**
     * Retrieves key conversion actions for disabling 2FA.
     * @returns {Promise<Action[]>} - A promise that resolves to an array of key conversion actions.
     */ get2faDisableKeyConversionActions() {
        return __awaiter(this, void 0, void 0, function*() {
            const { accountId } = this;
            const accessKeys = yield this.getAccessKeys();
            const lak2fak = accessKeys.filter(({ access_key })=>access_key.permission !== 'FullAccess').filter(({ access_key })=>{
                const perm = access_key.permission.FunctionCall;
                return perm.receiver_id === accountId && perm.method_names.length === 4 && perm.method_names.includes('add_request_and_confirm');
            });
            const confirmOnlyKey = crypto_1.PublicKey.from((yield this.postSignedJson('/2fa/getAccessKey', {
                accountId
            })).publicKey);
            return [
                deleteKey(confirmOnlyKey),
                ...lak2fak.map(({ public_key })=>deleteKey(crypto_1.PublicKey.from(public_key))),
                ...lak2fak.map(({ public_key })=>addKey(crypto_1.PublicKey.from(public_key), fullAccessKey()))
            ];
        });
    }
    /**
     * This method converts LAKs back to FAKs, clears state and deploys an 'empty' contract (contractBytes param)
     * @param [contractBytes]{@link https://github.com/near/near-wallet/blob/master/packages/frontend/src/wasm/main.wasm?raw=true}
     * @param [cleanupContractBytes]{@link https://github.com/near/core-contracts/blob/master/state-manipulation/res/state_cleanup.wasm?raw=true}
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the operation.
     */ disable(contractBytes, cleanupContractBytes) {
        return __awaiter(this, void 0, void 0, function*() {
            const { stateStatus } = yield this.checkMultisigCodeAndStateStatus();
            if (stateStatus !== types_2.MultisigStateStatus.VALID_STATE && stateStatus !== types_2.MultisigStateStatus.STATE_NOT_INITIALIZED) {
                throw new types_1.TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account state could not be verified.`, 'ContractStateUnknown');
            }
            let deleteAllRequestsError;
            yield this.deleteAllRequests().catch((e)=>deleteAllRequestsError = e);
            const cleanupActions = yield this.get2faDisableCleanupActions(cleanupContractBytes).catch((e)=>{
                if (e.type === 'ContractHasExistingState') {
                    throw deleteAllRequestsError || e;
                }
                throw e;
            });
            const actions = [
                ...cleanupActions,
                ...yield this.get2faDisableKeyConversionActions(),
                deployContract(contractBytes)
            ];
            utils_1.Logger.log('disabling 2fa for', this.accountId);
            return yield this.signAndSendTransaction({
                receiverId: this.accountId,
                actions
            });
        });
    }
    /**
     * Default implementation for sending the 2FA code.
     * @returns {Promise<string>} - A promise that resolves to the request ID.
     */ sendCodeDefault() {
        return __awaiter(this, void 0, void 0, function*() {
            const { accountId } = this;
            const { requestId } = this.getRequest();
            const method = yield this.get2faMethod();
            yield this.postSignedJson('/2fa/send', {
                accountId,
                method,
                requestId
            });
            return requestId;
        });
    }
    getCodeDefault() {
        return __awaiter(this, void 0, void 0, function*() {
            throw new Error('There is no getCode callback provided. Please provide your own in AccountMultisig constructor options. It has a parameter method where method.kind is "email" or "phone".');
        });
    }
    /**
     * Prompts the user to enter and verify the 2FA code.
     * @returns {Promise<any>} - A promise that resolves to the verification result.
     */ promptAndVerify() {
        return __awaiter(this, void 0, void 0, function*() {
            const method = yield this.get2faMethod();
            const securityCode = yield this.getCode(method);
            try {
                const result = yield this.verifyCode(securityCode);
                // TODO: Parse error from result for real (like in normal account.signAndSendTransaction)
                return result;
            } catch (e) {
                utils_1.Logger.warn('Error validating security code:', e);
                if (e.toString().includes('invalid 2fa code provided') || e.toString().includes('2fa code not valid')) {
                    return yield this.promptAndVerify();
                }
                throw e;
            }
        });
    }
    /**
     * Verify the 2FA code using the default method.
     * @param securityCode - The security code to verify.
     * @returns {Promise<any>} A promise that resolves to the verification result.
     */ verifyCodeDefault(securityCode) {
        return __awaiter(this, void 0, void 0, function*() {
            const { accountId } = this;
            const request = this.getRequest();
            if (!request) {
                throw new Error('no request pending');
            }
            const { requestId } = request;
            return yield this.postSignedJson('/2fa/verify', {
                accountId,
                securityCode,
                requestId
            });
        });
    }
    /**
     * Retrieves recovery methods for the account.
     * @returns {Promise<{ accountId: string, data: any }>} - A promise that resolves to recovery methods data.
     */ getRecoveryMethods() {
        return __awaiter(this, void 0, void 0, function*() {
            const { accountId } = this;
            return {
                accountId,
                data: yield this.postSignedJson('/account/recoveryMethods', {
                    accountId
                })
            };
        });
    }
    /**
     * Gets the 2FA method (kind and detail).
     * @returns {Promise<{ kind: string, detail: string }>} A promise that resolves to the 2FA method.
     */ get2faMethod() {
        return __awaiter(this, void 0, void 0, function*() {
            let { data } = yield this.getRecoveryMethods();
            if (data && data.length) {
                data = data.find((m)=>m.kind.indexOf('2fa-') === 0);
            }
            if (!data) return null;
            const { kind, detail } = data;
            return {
                kind,
                detail
            };
        });
    }
    /**
    * Generates a signature for the latest finalized block.
    * @returns {Promise<{ blockNumber: string, blockNumberSignature: string }>} - A promise that resolves to the signature information.
    */ signatureFor() {
        return __awaiter(this, void 0, void 0, function*() {
            const { accountId } = this;
            const block = yield this.connection.provider.block({
                finality: 'final'
            });
            const blockNumber = block.header.height.toString();
            const signed = yield this.connection.signer.signMessage(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(blockNumber), accountId, this.connection.networkId);
            const blockNumberSignature = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(signed.signature).toString('base64');
            return {
                blockNumber,
                blockNumberSignature
            };
        });
    }
    /**
    * Sends a signed JSON request to a specified path.
    * @param path - The path for the request.
    * @param body - The request body.
    * @returns {Promise<any>} - A promise that resolves to the response from the helper.
    */ postSignedJson(path, body) {
        return __awaiter(this, void 0, void 0, function*() {
            return yield (0, providers_1.fetchJson)(this.helperUrl + path, JSON.stringify(Object.assign(Object.assign({}, body), (yield this.signatureFor()))));
        });
    }
}
exports.Account2FA = Account2FA;
// helpers
const toPK = (pk)=>crypto_1.PublicKey.from(pk);
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/account_creator.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UrlAccountCreator = exports.LocalAccountCreator = exports.AccountCreator = void 0;
const providers_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+providers@0.2.2/node_modules/@near-js/providers/lib/index.js [app-client] (ecmascript)");
/**
 * Account creator provides an interface for implementations to actually create accounts
 */ class AccountCreator {
}
exports.AccountCreator = AccountCreator;
class LocalAccountCreator extends AccountCreator {
    constructor(masterAccount, initialBalance){
        super();
        this.masterAccount = masterAccount;
        this.initialBalance = initialBalance;
    }
    /**
     * Creates an account using a masterAccount, meaning the new account is created from an existing account
     * @param newAccountId The name of the NEAR account to be created
     * @param publicKey The public key from the masterAccount used to create this account
     * @returns {Promise<void>}
     */ createAccount(newAccountId, publicKey) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.masterAccount.createAccount(newAccountId, publicKey, this.initialBalance);
        });
    }
}
exports.LocalAccountCreator = LocalAccountCreator;
class UrlAccountCreator extends AccountCreator {
    constructor(connection, helperUrl){
        super();
        this.connection = connection;
        this.helperUrl = helperUrl;
    }
    /**
     * Creates an account using a helperUrl
     * This is [hosted here](https://helper.nearprotocol.com) or set up locally with the [near-contract-helper](https://github.com/nearprotocol/near-contract-helper) repository
     * @param newAccountId The name of the NEAR account to be created
     * @param publicKey The public key from the masterAccount used to create this account
     * @returns {Promise<void>}
     */ createAccount(newAccountId, publicKey) {
        return __awaiter(this, void 0, void 0, function*() {
            yield (0, providers_1.fetchJson)(`${this.helperUrl}/account`, JSON.stringify({
                newAccountId,
                newAccountPublicKey: publicKey.toString()
            }));
        });
    }
}
exports.UrlAccountCreator = UrlAccountCreator;
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/connection.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Connection = void 0;
const signers_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+signers@0.1.4/node_modules/@near-js/signers/lib/index.js [app-client] (ecmascript)");
const providers_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+providers@0.2.2/node_modules/@near-js/providers/lib/index.js [app-client] (ecmascript)");
/**
 * @param config Contains connection info details
 * @returns {Provider}
 */ function getProvider(config) {
    switch(config.type){
        case undefined:
            return config;
        case 'JsonRpcProvider':
            return new providers_1.JsonRpcProvider(Object.assign({}, config.args));
        case 'FailoverRpcProvider':
            {
                const providers = ((config === null || config === void 0 ? void 0 : config.args) || []).map((arg)=>new providers_1.JsonRpcProvider(arg));
                return new providers_1.FailoverRpcProvider(providers);
            }
        default:
            throw new Error(`Unknown provider type ${config.type}`);
    }
}
/**
 * @param config Contains connection info details
 * @returns {Signer}
 */ function getSigner(config) {
    switch(config.type){
        case undefined:
            return config;
        case 'InMemorySigner':
            {
                return new signers_1.InMemorySigner(config.keyStore);
            }
        default:
            throw new Error(`Unknown signer type ${config.type}`);
    }
}
/**
 * Connects an account to a given network via a given provider
 */ class Connection {
    constructor(networkId, provider, signer, jsvmAccountId){
        this.networkId = networkId;
        this.provider = provider;
        this.signer = signer;
        this.jsvmAccountId = jsvmAccountId;
    }
    getConnection() {
        return this;
    }
    /**
     * @param config Contains connection info details
     */ static fromConfig(config) {
        const provider = getProvider(config.provider);
        const signer = getSigner(config.signer);
        return new Connection(config.networkId, provider, signer, config.jsvmAccountId);
    }
}
exports.Connection = Connection;
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/local-view-execution/storage.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Storage = void 0;
const lru_map_1 = __turbopack_require__("[project]/node_modules/.pnpm/lru_map@0.4.1/node_modules/lru_map/dist/lru.js [app-client] (ecmascript)");
class Storage {
    constructor(options = {
        max: Storage.MAX_ELEMENTS
    }){
        this.cache = new lru_map_1.LRUMap(options.max);
        this.blockHeights = new Map();
    }
    load(blockRef) {
        const noBlockId = !('blockId' in blockRef);
        if (noBlockId) return undefined;
        let blockId = blockRef.blockId;
        // block hash is passed, so get its corresponding block height
        if (blockId.toString().length == 44) {
            blockId = this.blockHeights.get(blockId.toString());
        }
        // get cached values for the given block height
        return this.cache.get(blockId);
    }
    save(blockHash, { blockHeight, blockTimestamp, contractCode, contractState }) {
        this.blockHeights.set(blockHash, blockHeight);
        this.cache.set(blockHeight, {
            blockHeight,
            blockTimestamp,
            contractCode,
            contractState
        });
    }
}
exports.Storage = Storage;
Storage.MAX_ELEMENTS = 100;
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/local-view-execution/runtime.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
"use strict";
var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = this && this.__rest || function(s, e) {
    var t = {};
    for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++){
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Runtime = void 0;
const crypto_1 = __turbopack_require__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/crypto-browserify/index.js [app-client] (ecmascript)");
const notImplemented = (name)=>()=>{
        throw new Error('method not implemented: ' + name);
    };
const prohibitedInView = (name)=>()=>{
        throw new Error('method not available for view calls: ' + name);
    };
class Runtime {
    constructor(_a){
        var { contractCode } = _a, context = __rest(_a, [
            "contractCode"
        ]);
        this.context = context;
        this.wasm = this.prepareWASM(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(contractCode, 'base64'));
        this.memory = new WebAssembly.Memory({
            initial: 1024,
            maximum: 2048
        });
        this.registers = {};
        this.logs = [];
        this.result = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([]);
    }
    readUTF16CStr(ptr) {
        const arr = [];
        const mem = new Uint16Array(this.memory.buffer);
        let key = Number(ptr) / 2;
        while(mem[key] != 0){
            arr.push(mem[key]);
            key++;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(Uint16Array.from(arr).buffer).toString('ucs2');
    }
    readUTF8CStr(len, ptr) {
        const arr = [];
        const mem = new Uint8Array(this.memory.buffer);
        let key = Number(ptr);
        for(let i = 0; i < len && mem[key] != 0; i++){
            arr.push(mem[key]);
            key++;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(arr).toString('utf8');
    }
    storageRead(keyLen, keyPtr) {
        const storageKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(new Uint8Array(this.memory.buffer, Number(keyPtr), Number(keyLen)));
        const stateVal = this.context.contractState.filter((obj)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].compare(obj.key, storageKey) === 0).map((obj)=>obj.value);
        if (stateVal.length === 0) return null;
        return stateVal.length > 1 ? stateVal : stateVal[0];
    }
    prepareWASM(input) {
        const parts = [];
        const magic = input.subarray(0, 4);
        if (magic.toString('utf8') !== '\0asm') {
            throw new Error('Invalid magic number');
        }
        const version = input.readUInt32LE(4);
        if (version != 1) {
            throw new Error('Invalid version: ' + version);
        }
        let offset = 8;
        parts.push(input.subarray(0, offset));
        function decodeLEB128() {
            let result = 0;
            let shift = 0;
            let byte;
            do {
                byte = input[offset++];
                result |= (byte & 0x7f) << shift;
                shift += 7;
            }while (byte & 0x80)
            return result;
        }
        function decodeLimits() {
            const flags = input[offset++];
            const hasMax = flags & 0x1;
            const initial = decodeLEB128();
            const max = hasMax ? decodeLEB128() : null;
            return {
                initial,
                max
            };
        }
        function decodeString() {
            const length = decodeLEB128();
            const result = input.subarray(offset, offset + length);
            offset += length;
            return result.toString('utf8');
        }
        function encodeLEB128(value) {
            const result = [];
            do {
                let byte = value & 0x7f;
                value >>= 7;
                if (value !== 0) {
                    byte |= 0x80;
                }
                result.push(byte);
            }while (value !== 0)
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(result);
        }
        function encodeString(value) {
            const result = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(value, 'utf8');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
                encodeLEB128(result.length),
                result
            ]);
        }
        do {
            const sectionStart = offset;
            const sectionId = input.readUInt8(offset);
            offset++;
            const sectionSize = decodeLEB128();
            const sectionEnd = offset + sectionSize;
            if (sectionId == 5) {
                // Memory section
                // Make sure it's empty and only imported memory is used
                parts.push(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
                    5,
                    1,
                    0
                ]));
            } else if (sectionId == 2) {
                // Import section
                const sectionParts = [];
                const numImports = decodeLEB128();
                for(let i = 0; i < numImports; i++){
                    const importStart = offset;
                    decodeString();
                    decodeString();
                    const kind = input.readUInt8(offset);
                    offset++;
                    let skipImport = false;
                    switch(kind){
                        case 0:
                            // Function import
                            decodeLEB128(); // index
                            break;
                        case 1:
                            // Table import
                            offset++; // type
                            decodeLimits();
                            break;
                        case 2:
                            // Memory import
                            decodeLimits();
                            // NOTE: existing memory import is removed (so no need to add it to sectionParts)
                            skipImport = true;
                            break;
                        case 3:
                            // Global import
                            offset++; // type
                            offset++; // mutability
                            break;
                        default:
                            throw new Error('Invalid import kind: ' + kind);
                    }
                    if (!skipImport) {
                        sectionParts.push(input.subarray(importStart, offset));
                    }
                }
                const importMemory = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
                    encodeString('env'),
                    encodeString('memory'),
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
                        2
                    ]),
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
                        0
                    ]),
                    encodeLEB128(1)
                ]);
                sectionParts.push(importMemory);
                const sectionData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
                    encodeLEB128(sectionParts.length),
                    ...sectionParts
                ]);
                parts.push(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
                        2
                    ]),
                    encodeLEB128(sectionData.length),
                    sectionData
                ]));
            } else if (sectionId == 7) {
                // Export section
                const sectionParts = [];
                const numExports = decodeLEB128();
                for(let i = 0; i < numExports; i++){
                    const exportStart = offset;
                    decodeString();
                    const kind = input.readUInt8(offset);
                    offset++;
                    decodeLEB128();
                    if (kind !== 2) {
                        // Pass through all exports except memory
                        sectionParts.push(input.subarray(exportStart, offset));
                    }
                }
                const sectionData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
                    encodeLEB128(sectionParts.length),
                    ...sectionParts
                ]);
                parts.push(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat([
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
                        7
                    ]),
                    encodeLEB128(sectionData.length),
                    sectionData
                ]));
            } else {
                parts.push(input.subarray(sectionStart, sectionEnd));
            }
            offset = sectionEnd;
        }while (offset < input.length)
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].concat(parts);
    }
    // Host functions
    getRegisterLength(registerId) {
        return BigInt(this.registers[registerId.toString()] ? this.registers[registerId.toString()].length : Number.MAX_SAFE_INTEGER);
    }
    readFromRegister(registerId, ptr) {
        const mem = new Uint8Array(this.memory.buffer);
        mem.set(this.registers[registerId.toString()] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([]), Number(ptr));
    }
    getCurrentAccountId(registerId) {
        this.registers[registerId.toString()] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(this.context.contractId);
    }
    inputMethodArgs(registerId) {
        this.registers[registerId.toString()] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(this.context.methodArgs);
    }
    getBlockHeight() {
        return BigInt(this.context.blockHeight);
    }
    getBlockTimestamp() {
        return BigInt(this.context.blockTimestamp);
    }
    sha256(valueLen, valuePtr, registerId) {
        const value = new Uint8Array(this.memory.buffer, Number(valuePtr), Number(valueLen));
        const hash = (0, crypto_1.createHash)('sha256');
        hash.update(value);
        this.registers[registerId.toString()] = hash.digest();
    }
    returnValue(valueLen, valuePtr) {
        this.result = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(new Uint8Array(this.memory.buffer, Number(valuePtr), Number(valueLen)));
    }
    panic(message) {
        throw new Error('panic: ' + message);
    }
    abort(msg_ptr, filename_ptr, line, col) {
        const msg = this.readUTF16CStr(msg_ptr);
        const filename = this.readUTF16CStr(filename_ptr);
        const message = `${msg} ${filename}:${line}:${col}`;
        if (!msg || !filename) {
            throw new Error('abort: ' + 'String encoding is bad UTF-16 sequence.');
        }
        throw new Error('abort: ' + message);
    }
    appendToLog(len, ptr) {
        this.logs.push(this.readUTF8CStr(len, ptr));
    }
    readStorage(key_len, key_ptr, register_id) {
        const result = this.storageRead(key_len, key_ptr);
        if (result == null) {
            return BigInt(0);
        }
        this.registers[register_id] = result;
        return BigInt(1);
    }
    hasStorageKey(key_len, key_ptr) {
        const result = this.storageRead(key_len, key_ptr);
        if (result == null) {
            return BigInt(0);
        }
        return BigInt(1);
    }
    getHostImports() {
        return {
            register_len: this.getRegisterLength.bind(this),
            read_register: this.readFromRegister.bind(this),
            current_account_id: this.getCurrentAccountId.bind(this),
            input: this.inputMethodArgs.bind(this),
            block_index: this.getBlockHeight.bind(this),
            block_timestamp: this.getBlockTimestamp.bind(this),
            sha256: this.sha256.bind(this),
            value_return: this.returnValue.bind(this),
            abort: this.abort.bind(this),
            log_utf8: this.appendToLog.bind(this),
            log_utf16: this.appendToLog.bind(this),
            storage_read: this.readStorage.bind(this),
            storage_has_key: this.hasStorageKey.bind(this),
            panic: ()=>this.panic('explicit guest panic'),
            panic_utf8: (len, ptr)=>this.panic(this.readUTF8CStr(len, ptr)),
            // Not implemented
            epoch_height: notImplemented('epoch_height'),
            storage_usage: notImplemented('storage_usage'),
            account_balance: notImplemented('account_balance'),
            account_locked_balance: notImplemented('account_locked_balance'),
            random_seed: notImplemented('random_seed'),
            ripemd160: notImplemented('ripemd160'),
            keccak256: notImplemented('keccak256'),
            keccak512: notImplemented('keccak512'),
            ecrecover: notImplemented('ecrecover'),
            validator_stake: notImplemented('validator_stake'),
            validator_total_stake: notImplemented('validator_total_stake'),
            // Prohibited
            write_register: prohibitedInView('write_register'),
            signer_account_id: prohibitedInView('signer_account_id'),
            signer_account_pk: prohibitedInView('signer_account_pk'),
            predecessor_account_id: prohibitedInView('predecessor_account_id'),
            attached_deposit: prohibitedInView('attached_deposit'),
            prepaid_gas: prohibitedInView('prepaid_gas'),
            used_gas: prohibitedInView('used_gas'),
            promise_create: prohibitedInView('promise_create'),
            promise_then: prohibitedInView('promise_then'),
            promise_and: prohibitedInView('promise_and'),
            promise_batch_create: prohibitedInView('promise_batch_create'),
            promise_batch_then: prohibitedInView('promise_batch_then'),
            promise_batch_action_create_account: prohibitedInView('promise_batch_action_create_account'),
            promise_batch_action_deploy_contract: prohibitedInView('promise_batch_action_deploy_contract'),
            promise_batch_action_function_call: prohibitedInView('promise_batch_action_function_call'),
            promise_batch_action_function_call_weight: prohibitedInView('promise_batch_action_function_call_weight'),
            promise_batch_action_transfer: prohibitedInView('promise_batch_action_transfer'),
            promise_batch_action_stake: prohibitedInView('promise_batch_action_stake'),
            promise_batch_action_add_key_with_full_access: prohibitedInView('promise_batch_action_add_key_with_full_access'),
            promise_batch_action_add_key_with_function_call: prohibitedInView('promise_batch_action_add_key_with_function_call'),
            promise_batch_action_delete_key: prohibitedInView('promise_batch_action_delete_key'),
            promise_batch_action_delete_account: prohibitedInView('promise_batch_action_delete_account'),
            promise_results_count: prohibitedInView('promise_results_count'),
            promise_result: prohibitedInView('promise_result'),
            promise_return: prohibitedInView('promise_return'),
            storage_write: prohibitedInView('storage_write'),
            storage_remove: prohibitedInView('storage_remove')
        };
    }
    execute(methodName) {
        return __awaiter(this, void 0, void 0, function*() {
            const module = yield WebAssembly.compile(this.wasm);
            const instance = yield WebAssembly.instantiate(module, {
                env: Object.assign(Object.assign({}, this.getHostImports()), {
                    memory: this.memory
                })
            });
            const callMethod = instance.exports[methodName];
            if (callMethod == undefined) {
                throw new Error(`Contract method '${methodName}' does not exists in contract ${this.context.contractId} for block id ${this.context.blockHeight}`);
            }
            callMethod();
            return {
                result: this.result,
                logs: this.logs
            };
        });
    }
}
exports.Runtime = Runtime;
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/local-view-execution/index.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
"use strict";
var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = this && this.__rest || function(s, e) {
    var t = {};
    for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++){
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LocalViewExecution = void 0;
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+utils@0.2.2/node_modules/@near-js/utils/lib/index.js [app-client] (ecmascript)");
const storage_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/local-view-execution/storage.js [app-client] (ecmascript)");
const runtime_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/local-view-execution/runtime.js [app-client] (ecmascript)");
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/utils.js [app-client] (ecmascript)");
class LocalViewExecution {
    constructor(connection){
        this.connection = connection.getConnection();
        this.storage = new storage_1.Storage();
    }
    fetchContractCode(contractId, blockQuery) {
        return __awaiter(this, void 0, void 0, function*() {
            const result = yield this.connection.provider.query(Object.assign({
                request_type: 'view_code',
                account_id: contractId
            }, blockQuery));
            return result.code_base64;
        });
    }
    fetchContractState(contractId, blockQuery) {
        return __awaiter(this, void 0, void 0, function*() {
            return (0, utils_2.viewState)(this.connection, contractId, '', blockQuery);
        });
    }
    fetch(contractId, blockQuery) {
        return __awaiter(this, void 0, void 0, function*() {
            const block = yield this.connection.provider.block(blockQuery);
            const blockHash = block.header.hash;
            const blockHeight = block.header.height;
            const blockTimestamp = block.header.timestamp;
            const contractCode = yield this.fetchContractCode(contractId, blockQuery);
            const contractState = yield this.fetchContractState(contractId, blockQuery);
            return {
                blockHash,
                blockHeight,
                blockTimestamp,
                contractCode,
                contractState
            };
        });
    }
    loadOrFetch(contractId, blockQuery) {
        return __awaiter(this, void 0, void 0, function*() {
            const stored = this.storage.load(blockQuery);
            if (stored) {
                return stored;
            }
            const _a = yield this.fetch(contractId, blockQuery), { blockHash } = _a, fetched = __rest(_a, [
                "blockHash"
            ]);
            this.storage.save(blockHash, fetched);
            return fetched;
        });
    }
    /**
     * Calls a view function on a contract, fetching the contract code and state if needed.
     * @param options Options for calling the view function.
     * @param options.contractId The contract account ID.
     * @param options.methodName The name of the view function to call.
     * @param options.args The arguments to pass to the view function.
     * @param options.blockQuery The block query options.
     * @returns {Promise<any>} - A promise that resolves to the result of the view function.
     */ viewFunction(_a) {
        var { contractId, methodName, args = {}, blockQuery = {
            finality: 'optimistic'
        } } = _a, ignored = __rest(_a, [
            "contractId",
            "methodName",
            "args",
            "blockQuery"
        ]);
        return __awaiter(this, void 0, void 0, function*() {
            const methodArgs = JSON.stringify(args);
            const { contractCode, contractState, blockHeight, blockTimestamp } = yield this.loadOrFetch(contractId, blockQuery);
            const runtime = new runtime_1.Runtime({
                contractId,
                contractCode,
                contractState,
                blockHeight,
                blockTimestamp,
                methodArgs
            });
            const { result, logs } = yield runtime.execute(methodName);
            if (logs) {
                (0, utils_1.printTxOutcomeLogs)({
                    contractId,
                    logs
                });
            }
            return JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(result).toString());
        });
    }
}
exports.LocalViewExecution = LocalViewExecution;
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/errors.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConflictingOptions = exports.ArgumentSchemaError = exports.UnknownArgumentError = exports.UnsupportedSerializationError = void 0;
class UnsupportedSerializationError extends Error {
    constructor(methodName, serializationType){
        super(`Contract method '${methodName}' is using an unsupported serialization type ${serializationType}`);
    }
}
exports.UnsupportedSerializationError = UnsupportedSerializationError;
class UnknownArgumentError extends Error {
    constructor(actualArgName, expectedArgNames){
        super(`Unrecognized argument '${actualArgName}', expected '${JSON.stringify(expectedArgNames)}'`);
    }
}
exports.UnknownArgumentError = UnknownArgumentError;
class ArgumentSchemaError extends Error {
    constructor(argName, errors){
        super(`Argument '${argName}' does not conform to the specified ABI schema: '${JSON.stringify(errors)}'`);
    }
}
exports.ArgumentSchemaError = ArgumentSchemaError;
class ConflictingOptions extends Error {
    constructor(){
        super('Conflicting contract method options have been passed. You can either specify ABI or a list of view/call methods.');
    }
}
exports.ConflictingOptions = ConflictingOptions;
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/contract.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = this && this.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Contract = void 0;
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+utils@0.2.2/node_modules/@near-js/utils/lib/index.js [app-client] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+types@0.2.1/node_modules/@near-js/types/lib/index.js [app-client] (ecmascript)");
const local_view_execution_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/local-view-execution/index.js [app-client] (ecmascript)");
const is_my_json_valid_1 = __importDefault(__turbopack_require__("[project]/node_modules/.pnpm/is-my-json-valid@2.20.6/node_modules/is-my-json-valid/index.js [app-client] (ecmascript)"));
const depd_1 = __importDefault(__turbopack_require__("[project]/node_modules/.pnpm/depd@2.0.0/node_modules/depd/lib/browser/index.js [app-client] (ecmascript)"));
const near_abi_1 = __turbopack_require__("[project]/node_modules/.pnpm/near-abi@0.1.1/node_modules/near-abi/lib/index.js [app-client] (ecmascript)");
const account_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/account.js [app-client] (ecmascript)");
const errors_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/errors.js [app-client] (ecmascript)");
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/utils.js [app-client] (ecmascript)");
// Makes `function.name` return given name
function nameFunction(name, body) {
    return ({
        [name] (...args) {
            return body(...args);
        }
    })[name];
}
function validateArguments(args, abiFunction, abiRoot) {
    var _a;
    if (!isObject(args)) return;
    if (abiFunction.params && abiFunction.params.serialization_type !== near_abi_1.AbiSerializationType.Json) {
        throw new errors_1.UnsupportedSerializationError(abiFunction.name, abiFunction.params.serialization_type);
    }
    if (abiFunction.result && abiFunction.result.serialization_type !== near_abi_1.AbiSerializationType.Json) {
        throw new errors_1.UnsupportedSerializationError(abiFunction.name, abiFunction.result.serialization_type);
    }
    const params = ((_a = abiFunction.params) === null || _a === void 0 ? void 0 : _a.args) || [];
    for (const p of params){
        const arg = args[p.name];
        const typeSchema = p.type_schema;
        typeSchema.definitions = abiRoot.body.root_schema.definitions;
        const validate = (0, is_my_json_valid_1.default)(typeSchema);
        const valid = validate(arg);
        if (!valid) {
            throw new errors_1.ArgumentSchemaError(p.name, validate.errors);
        }
    }
    // Check there are no extra unknown arguments passed
    for (const argName of Object.keys(args)){
        const param = params.find((p)=>p.name === argName);
        if (!param) {
            throw new errors_1.UnknownArgumentError(argName, params.map((p)=>p.name));
        }
    }
}
const isUint8Array = (x)=>x && x.byteLength !== undefined && x.byteLength === x.length;
const isObject = (x)=>Object.prototype.toString.call(x) === "[object Object]";
/**
 * Defines a smart contract on NEAR including the change (mutable) and view (non-mutable) methods
 *
 * @see [https://docs.near.org/tools/near-api-js/quick-reference#contract](https://docs.near.org/tools/near-api-js/quick-reference#contract)
 * @example
 * ```js
 * import { Contract } from 'near-api-js';
 *
 * async function contractExample() {
 *   const methodOptions = {
 *     viewMethods: ['getMessageByAccountId'],
 *     changeMethods: ['addMessage']
 *   };
 *   const contract = new Contract(
 *     wallet.account(),
 *     'contract-id.testnet',
 *     methodOptions
 *   );
 *
 *   // use a contract view method
 *   const messages = await contract.getMessages({
 *     accountId: 'example-account.testnet'
 *   });
 *
 *   // use a contract change method
 *   await contract.addMessage({
 *      meta: 'some info',
 *      callbackUrl: 'https://example.com/callback',
 *      args: { text: 'my message' },
 *      amount: 1
 *   })
 * }
 * ```
 */ class Contract {
    /**
     * @param account NEAR account to sign change method transactions
     * @param contractId NEAR account id where the contract is deployed
     * @param options NEAR smart contract methods that your application will use. These will be available as `contract.methodName`
     */ constructor(connection, contractId, options){
        this.connection = connection.getConnection();
        if (connection instanceof account_1.Account) {
            const deprecate = (0, depd_1.default)("new Contract(account, contractId, options)");
            deprecate("use `new Contract(connection, contractId, options)` instead");
            this.account = connection;
        }
        this.contractId = contractId;
        this.lve = new local_view_execution_1.LocalViewExecution(connection);
        const { viewMethods = [], changeMethods = [], abi: abiRoot, useLocalViewExecution } = options;
        let viewMethodsWithAbi = viewMethods.map((name)=>({
                name,
                abi: null
            }));
        let changeMethodsWithAbi = changeMethods.map((name)=>({
                name,
                abi: null
            }));
        if (abiRoot) {
            if (viewMethodsWithAbi.length > 0 || changeMethodsWithAbi.length > 0) {
                throw new errors_1.ConflictingOptions();
            }
            viewMethodsWithAbi = abiRoot.body.functions.filter((m)=>m.kind === near_abi_1.AbiFunctionKind.View).map((m)=>({
                    name: m.name,
                    abi: m
                }));
            changeMethodsWithAbi = abiRoot.body.functions.filter((methodAbi)=>methodAbi.kind === near_abi_1.AbiFunctionKind.Call).map((methodAbi)=>({
                    name: methodAbi.name,
                    abi: methodAbi
                }));
        }
        viewMethodsWithAbi.forEach(({ name, abi })=>{
            Object.defineProperty(this, name, {
                writable: false,
                enumerable: true,
                value: nameFunction(name, (args = {}, options = {}, ...ignored)=>__awaiter(this, void 0, void 0, function*() {
                        if (ignored.length || !(isObject(args) || isUint8Array(args)) || !isObject(options)) {
                            throw new types_1.PositionalArgsError();
                        }
                        if (abi) {
                            validateArguments(args, abi, abiRoot);
                        }
                        if (useLocalViewExecution) {
                            try {
                                return yield this.lve.viewFunction(Object.assign({
                                    contractId: this.contractId,
                                    methodName: name,
                                    args
                                }, options));
                            } catch (error) {
                                utils_1.Logger.warn(`Local view execution failed with: "${error.message}"`);
                                utils_1.Logger.warn(`Fallback to normal RPC call`);
                            }
                        }
                        if (this.account) {
                            return this.account.viewFunction(Object.assign({
                                contractId: this.contractId,
                                methodName: name,
                                args
                            }, options));
                        }
                        return (0, utils_2.viewFunction)(this.connection, Object.assign({
                            contractId: this.contractId,
                            methodName: name,
                            args
                        }, options));
                    }))
            });
        });
        changeMethodsWithAbi.forEach(({ name, abi })=>{
            Object.defineProperty(this, name, {
                writable: false,
                enumerable: true,
                value: nameFunction(name, (...args)=>__awaiter(this, void 0, void 0, function*() {
                        if (args.length && (args.length > 3 || !(isObject(args[0]) || isUint8Array(args[0])))) {
                            throw new types_1.PositionalArgsError();
                        }
                        if (args.length > 1 || !(args[0] && args[0].args)) {
                            const deprecate = (0, depd_1.default)("contract.methodName(args, gas, amount)");
                            deprecate("use `contract.methodName({ signerAccount, args, gas?, amount?, callbackUrl?, meta? })` instead");
                            args[0] = {
                                args: args[0],
                                gas: args[1],
                                amount: args[2]
                            };
                        }
                        if (abi) {
                            validateArguments(args[0].args, abi, abiRoot);
                        }
                        return this._changeMethod(Object.assign({
                            methodName: name
                        }, args[0]));
                    }))
            });
        });
    }
    _changeMethod({ signerAccount, args, methodName, gas, amount, meta, callbackUrl }) {
        return __awaiter(this, void 0, void 0, function*() {
            validateBNLike({
                gas,
                amount
            });
            const account = this.account || signerAccount;
            if (!account) throw new Error(`signerAccount must be specified`);
            const rawResult = yield account.functionCall({
                contractId: this.contractId,
                methodName,
                args,
                gas,
                attachedDeposit: amount,
                walletMeta: meta,
                walletCallbackUrl: callbackUrl
            });
            return (0, utils_1.getTransactionLastResult)(rawResult);
        });
    }
}
exports.Contract = Contract;
/**
 * Throws if an argument is not in BigInt format or otherwise invalid
 * @param argMap
 */ function validateBNLike(argMap) {
    const bnLike = "number, decimal string or BigInt";
    for (const argName of Object.keys(argMap)){
        const argValue = argMap[argName];
        if (argValue && typeof argValue !== "bigint" && isNaN(argValue)) {
            throw new types_1.ArgumentTypeError(argName, bnLike, argValue);
        }
    }
}
}}),
"[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/index.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MultisigStateStatus = exports.MultisigDeleteRequestRejectionError = exports.UnsupportedSerializationError = exports.UnknownArgumentError = exports.ConflictingOptions = exports.ArgumentSchemaError = exports.Contract = exports.MULTISIG_CONFIRM_METHODS = exports.MULTISIG_CHANGE_METHODS = exports.MULTISIG_DEPOSIT = exports.MULTISIG_GAS = exports.MULTISIG_ALLOWANCE = exports.MULTISIG_STORAGE_KEY = exports.Connection = exports.AccountMultisig = exports.UrlAccountCreator = exports.LocalAccountCreator = exports.AccountCreator = exports.Account2FA = exports.Account = void 0;
var account_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/account.js [app-client] (ecmascript)");
Object.defineProperty(exports, "Account", {
    enumerable: true,
    get: function() {
        return account_1.Account;
    }
});
var account_2fa_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/account_2fa.js [app-client] (ecmascript)");
Object.defineProperty(exports, "Account2FA", {
    enumerable: true,
    get: function() {
        return account_2fa_1.Account2FA;
    }
});
var account_creator_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/account_creator.js [app-client] (ecmascript)");
Object.defineProperty(exports, "AccountCreator", {
    enumerable: true,
    get: function() {
        return account_creator_1.AccountCreator;
    }
});
Object.defineProperty(exports, "LocalAccountCreator", {
    enumerable: true,
    get: function() {
        return account_creator_1.LocalAccountCreator;
    }
});
Object.defineProperty(exports, "UrlAccountCreator", {
    enumerable: true,
    get: function() {
        return account_creator_1.UrlAccountCreator;
    }
});
var account_multisig_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/account_multisig.js [app-client] (ecmascript)");
Object.defineProperty(exports, "AccountMultisig", {
    enumerable: true,
    get: function() {
        return account_multisig_1.AccountMultisig;
    }
});
var connection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/connection.js [app-client] (ecmascript)");
Object.defineProperty(exports, "Connection", {
    enumerable: true,
    get: function() {
        return connection_1.Connection;
    }
});
var constants_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/constants.js [app-client] (ecmascript)");
Object.defineProperty(exports, "MULTISIG_STORAGE_KEY", {
    enumerable: true,
    get: function() {
        return constants_1.MULTISIG_STORAGE_KEY;
    }
});
Object.defineProperty(exports, "MULTISIG_ALLOWANCE", {
    enumerable: true,
    get: function() {
        return constants_1.MULTISIG_ALLOWANCE;
    }
});
Object.defineProperty(exports, "MULTISIG_GAS", {
    enumerable: true,
    get: function() {
        return constants_1.MULTISIG_GAS;
    }
});
Object.defineProperty(exports, "MULTISIG_DEPOSIT", {
    enumerable: true,
    get: function() {
        return constants_1.MULTISIG_DEPOSIT;
    }
});
Object.defineProperty(exports, "MULTISIG_CHANGE_METHODS", {
    enumerable: true,
    get: function() {
        return constants_1.MULTISIG_CHANGE_METHODS;
    }
});
Object.defineProperty(exports, "MULTISIG_CONFIRM_METHODS", {
    enumerable: true,
    get: function() {
        return constants_1.MULTISIG_CONFIRM_METHODS;
    }
});
var contract_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/contract.js [app-client] (ecmascript)");
Object.defineProperty(exports, "Contract", {
    enumerable: true,
    get: function() {
        return contract_1.Contract;
    }
});
var errors_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/errors.js [app-client] (ecmascript)");
Object.defineProperty(exports, "ArgumentSchemaError", {
    enumerable: true,
    get: function() {
        return errors_1.ArgumentSchemaError;
    }
});
Object.defineProperty(exports, "ConflictingOptions", {
    enumerable: true,
    get: function() {
        return errors_1.ConflictingOptions;
    }
});
Object.defineProperty(exports, "UnknownArgumentError", {
    enumerable: true,
    get: function() {
        return errors_1.UnknownArgumentError;
    }
});
Object.defineProperty(exports, "UnsupportedSerializationError", {
    enumerable: true,
    get: function() {
        return errors_1.UnsupportedSerializationError;
    }
});
var types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@near-js+accounts@1.2.1/node_modules/@near-js/accounts/lib/types.js [app-client] (ecmascript)");
Object.defineProperty(exports, "MultisigDeleteRequestRejectionError", {
    enumerable: true,
    get: function() {
        return types_1.MultisigDeleteRequestRejectionError;
    }
});
Object.defineProperty(exports, "MultisigStateStatus", {
    enumerable: true,
    get: function() {
        return types_1.MultisigStateStatus;
    }
});
}}),
}]);

//# sourceMappingURL=f04bc_%40near-js_accounts_lib_c33dbb._.js.map