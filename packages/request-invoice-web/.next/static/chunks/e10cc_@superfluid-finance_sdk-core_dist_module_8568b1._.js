(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/e10cc_@superfluid-finance_sdk-core_dist_module_8568b1._.js", {

"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "SFError": (()=>SFError)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$serialize$2d$error$40$8$2e$1$2e$0$2f$node_modules$2f$serialize$2d$error$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/serialize-error@8.1.0/node_modules/serialize-error/index.js [app-client] (ecmascript)");
;
const errorTypeToTitleMap = new Map([
    [
        "FRAMEWORK_INITIALIZATION",
        "Framework Initialization"
    ],
    [
        "SUPERTOKEN_INITIALIZATION",
        "SuperToken Initialization"
    ],
    [
        "CREATE_SIGNER",
        "Create Signer"
    ],
    [
        "SUPERTOKEN_READ",
        "SuperToken Read"
    ],
    [
        "SUBGRAPH_ERROR",
        "Subgraph"
    ],
    [
        "CFAV1_READ",
        "ConstantFlowAgreementV1 Read"
    ],
    [
        "IDAV1_READ",
        "InstantDistributionAgreementV1 Read"
    ],
    [
        "INVALID_ADDRESS",
        "Invalid Address"
    ],
    [
        "INVALID_OBJECT",
        "Invalid Object"
    ],
    [
        "POPULATE_TRANSACTION",
        "Populate Transaction"
    ],
    [
        "EXECUTE_TRANSACTION",
        "Execute Transaction"
    ],
    [
        "SIGN_TRANSACTION",
        "Sign Transaction"
    ],
    [
        "UNSUPPORTED_OPERATION",
        "Unsupported Batch Call Operation"
    ],
    [
        "MISSING_TRANSACTION_PROPERTIES",
        "Missing Transaction Properties"
    ],
    [
        "BATCH_CALL_ERROR",
        "Batch Call"
    ],
    [
        "NETWORK_MISMATCH",
        "Network Mismatch"
    ],
    [
        "UNCLEAN_PERMISSIONS",
        "Unclean Permissions"
    ],
    [
        "NEGATIVE_FLOW_ALLOWANCE",
        "Negative Flow Rate Allowance"
    ]
]);
class SFError extends Error {
    constructor({ type, message, cause }){
        const fullMessage = `${errorTypeToTitleMap.get(type)} Error: ${message}${cause ? `
Caused by: ${JSON.stringify((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$serialize$2d$error$40$8$2e$1$2e$0$2f$node_modules$2f$serialize$2d$error$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serializeError"])(cause), null, 2)}` : ""}`;
        super(fullMessage, cause ? {
            cause: cause
        } : {});
        // Fallback back environments where `Error.cause` is now yet natively supported
        if (cause && !this.cause) {
            this.cause = cause;
        }
        this.type = type;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
    }
} //# sourceMappingURL=SFError.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Operation.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Operation)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
;
;
class Operation {
    constructor(txn, type){
        /**
         * Executes the operation via the provided signer.
         * @description Populates all fields of the transaction, signs it and sends it to the network.
         * @param signer The signer of the transacation
         * @returns {ethers.providers.TransactionResponse} A TransactionResponse object which can be awaited
         */ this.exec = async (signer)=>{
            try {
                const populatedTransaction = await this.getPopulatedTransactionRequest(signer);
                return await signer.sendTransaction(populatedTransaction);
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "EXECUTE_TRANSACTION",
                    message: "There was an error executing the transaction",
                    cause: err
                });
            }
        };
        /**
         * Get the populated transaction by awaiting `populateTransactionPromise`.
         * @description Note that we need to populate the txn with the signer.
         * @returns {Promise<TransactionRequest>}
         */ this.getPopulatedTransactionRequest = async (signer)=>{
            try {
                const prePopulated = await this.populateTransactionPromise;
                return await signer.populateTransaction(prePopulated);
            } catch (err) {
                /* istanbul ignore next */ throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "POPULATE_TRANSACTION",
                    message: "There was an error populating the transaction",
                    cause: err
                });
            }
        };
        /**
         * Signs the populated transaction via the provided signer (what you intend on sending to the network).
         * @param signer The signer of the transacation
         * @returns {Promise<string>} Fully serialized, signed transaction
         */ this.getSignedTransaction = async (signer)=>{
            try {
                const populatedTransaction = await this.getPopulatedTransactionRequest(signer);
                const signedTxn = await signer.signTransaction(populatedTransaction);
                return signedTxn;
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "SIGN_TRANSACTION",
                    message: "There was an error signing the transaction",
                    cause: err
                });
            }
        };
        /**
         * Gets the transaction hash of the transaction.
         * @description Calculates this by getting the keccak256 hash of the signedTxn.
         * @param signer The signer of the transacation
         * @returns {Promise<string>} The transaction hash of the transaction
         */ this.getTransactionHash = async (signer)=>{
            const signedTxn = await this.getSignedTransaction(signer);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].utils.keccak256(signedTxn);
        };
        this.populateTransactionPromise = txn;
        this.type = type;
    }
} //# sourceMappingURL=Operation.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/Superfluid.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"abi\":[{\"inputs\":[{\"internalType\":\"bool\",\"name\":\"nonUpgradable\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"appWhiteListingEnabled\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"agreementType\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"code\",\"type\":\"address\"}],\"name\":\"AgreementClassRegistered\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"agreementType\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"code\",\"type\":\"address\"}],\"name\":\"AgreementClassUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"}],\"name\":\"AppRegistered\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"uuid\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"codeAddress\",\"type\":\"address\"}],\"name\":\"CodeUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"contract ISuperfluidGovernance\",\"name\":\"oldGov\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"contract ISuperfluidGovernance\",\"name\":\"newGov\",\"type\":\"address\"}],\"name\":\"GovernanceReplaced\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"version\",\"type\":\"uint8\"}],\"name\":\"Initialized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"reason\",\"type\":\"uint256\"}],\"name\":\"Jail\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"contract ISuperTokenFactory\",\"name\":\"newFactory\",\"type\":\"address\"}],\"name\":\"SuperTokenFactoryUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"code\",\"type\":\"address\"}],\"name\":\"SuperTokenLogicUpdated\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"APP_WHITE_LISTING_ENABLED\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"CALLBACK_GAS_LIMIT\",\"outputs\":[{\"internalType\":\"uint64\",\"name\":\"\",\"type\":\"uint64\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"MAX_APP_LEVEL\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"NON_UPGRADABLE_DEPLOYMENT\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"castrate\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getCodeAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"codeAddress\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidGovernance\",\"name\":\"gov\",\"type\":\"address\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"proxiableUUID\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newAddress\",\"type\":\"address\"}],\"name\":\"updateCode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getNow\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getGovernance\",\"outputs\":[{\"internalType\":\"contract ISuperfluidGovernance\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidGovernance\",\"name\":\"newGov\",\"type\":\"address\"}],\"name\":\"replaceGovernance\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperAgreement\",\"name\":\"agreementClassLogic\",\"type\":\"address\"}],\"name\":\"registerAgreementClass\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperAgreement\",\"name\":\"agreementClassLogic\",\"type\":\"address\"}],\"name\":\"updateAgreementClass\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"agreementType\",\"type\":\"bytes32\"}],\"name\":\"isAgreementTypeListed\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"yes\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperAgreement\",\"name\":\"agreementClass\",\"type\":\"address\"}],\"name\":\"isAgreementClassListed\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"yes\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"agreementType\",\"type\":\"bytes32\"}],\"name\":\"getAgreementClass\",\"outputs\":[{\"internalType\":\"contract ISuperAgreement\",\"name\":\"agreementClass\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"bitmap\",\"type\":\"uint256\"}],\"name\":\"mapAgreementClasses\",\"outputs\":[{\"internalType\":\"contract ISuperAgreement[]\",\"name\":\"agreementClasses\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"bitmap\",\"type\":\"uint256\"},{\"internalType\":\"bytes32\",\"name\":\"agreementType\",\"type\":\"bytes32\"}],\"name\":\"addToAgreementClassesBitmap\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"newBitmap\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"bitmap\",\"type\":\"uint256\"},{\"internalType\":\"bytes32\",\"name\":\"agreementType\",\"type\":\"bytes32\"}],\"name\":\"removeFromAgreementClassesBitmap\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"newBitmap\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getSuperTokenFactory\",\"outputs\":[{\"internalType\":\"contract ISuperTokenFactory\",\"name\":\"factory\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getSuperTokenFactoryLogic\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"logic\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperTokenFactory\",\"name\":\"newFactory\",\"type\":\"address\"}],\"name\":\"updateSuperTokenFactory\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperToken\",\"name\":\"token\",\"type\":\"address\"}],\"name\":\"updateSuperTokenLogic\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"configWord\",\"type\":\"uint256\"}],\"name\":\"registerApp\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"configWord\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"registrationKey\",\"type\":\"string\"}],\"name\":\"registerAppWithKey\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"configWord\",\"type\":\"uint256\"}],\"name\":\"registerAppByFactory\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"}],\"name\":\"isApp\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperApp\",\"name\":\"appAddr\",\"type\":\"address\"}],\"name\":\"getAppLevel\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"}],\"name\":\"getAppManifest\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isSuperApp\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"isJailed\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"noopMask\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"}],\"name\":\"isAppJailed\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperApp\",\"name\":\"targetApp\",\"type\":\"address\"}],\"name\":\"allowCompositeApp\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"},{\"internalType\":\"contract ISuperApp\",\"name\":\"targetApp\",\"type\":\"address\"}],\"name\":\"isCompositeAppAllowed\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"callData\",\"type\":\"bytes\"},{\"internalType\":\"bool\",\"name\":\"isTermination\",\"type\":\"bool\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"callAppBeforeCallback\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"cbdata\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"callData\",\"type\":\"bytes\"},{\"internalType\":\"bool\",\"name\":\"isTermination\",\"type\":\"bool\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"callAppAfterCallback\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"},{\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"appAllowanceGranted\",\"type\":\"uint256\"},{\"internalType\":\"int256\",\"name\":\"appAllowanceUsed\",\"type\":\"int256\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"appAllowanceToken\",\"type\":\"address\"}],\"name\":\"appCallbackPush\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"appCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"},{\"internalType\":\"int256\",\"name\":\"appAllowanceUsedDelta\",\"type\":\"int256\"}],\"name\":\"appCallbackPop\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"},{\"internalType\":\"uint256\",\"name\":\"appAllowanceWantedMore\",\"type\":\"uint256\"},{\"internalType\":\"int256\",\"name\":\"appAllowanceUsedDelta\",\"type\":\"int256\"}],\"name\":\"ctxUseAllowance\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"},{\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"reason\",\"type\":\"uint256\"}],\"name\":\"jailApp\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperAgreement\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"callData\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"callAgreement\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"returnedData\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"callData\",\"type\":\"bytes\"}],\"name\":\"callAppAction\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"returnedData\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperAgreement\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"callData\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"callAgreementWithContext\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"returnedData\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperApp\",\"name\":\"app\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"callData\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"callAppActionWithContext\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"decodeCtx\",\"outputs\":[{\"components\":[{\"internalType\":\"uint8\",\"name\":\"appLevel\",\"type\":\"uint8\"},{\"internalType\":\"uint8\",\"name\":\"callType\",\"type\":\"uint8\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"msgSender\",\"type\":\"address\"},{\"internalType\":\"bytes4\",\"name\":\"agreementSelector\",\"type\":\"bytes4\"},{\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"},{\"internalType\":\"uint256\",\"name\":\"appAllowanceGranted\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"appAllowanceWanted\",\"type\":\"uint256\"},{\"internalType\":\"int256\",\"name\":\"appAllowanceUsed\",\"type\":\"int256\"},{\"internalType\":\"address\",\"name\":\"appAddress\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"appAllowanceToken\",\"type\":\"address\"}],\"internalType\":\"struct ISuperfluid.Context\",\"name\":\"context\",\"type\":\"tuple\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"isCtxValid\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint32\",\"name\":\"operationType\",\"type\":\"uint32\"},{\"internalType\":\"address\",\"name\":\"target\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"internalType\":\"struct ISuperfluid.Operation[]\",\"name\":\"operations\",\"type\":\"tuple[]\"}],\"name\":\"batchCall\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint32\",\"name\":\"operationType\",\"type\":\"uint32\"},{\"internalType\":\"address\",\"name\":\"target\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"internalType\":\"struct ISuperfluid.Operation[]\",\"name\":\"operations\",\"type\":\"tuple[]\"}],\"name\":\"forwardBatchCall\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"forwarder\",\"type\":\"address\"}],\"name\":\"isTrustedForwarder\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"versionRecipient\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"pure\",\"type\":\"function\"}]}"));}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/IConstantFlowAgreementV1.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"abi\":[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"flowOperator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"permissions\",\"type\":\"uint8\"},{\"indexed\":false,\"internalType\":\"int96\",\"name\":\"flowRateAllowance\",\"type\":\"int96\"}],\"name\":\"FlowOperatorUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"int96\",\"name\":\"flowRate\",\"type\":\"int96\"},{\"indexed\":false,\"internalType\":\"int256\",\"name\":\"totalSenderFlowRate\",\"type\":\"int256\"},{\"indexed\":false,\"internalType\":\"int256\",\"name\":\"totalReceiverFlowRate\",\"type\":\"int256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"FlowUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"flowOperator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"}],\"name\":\"FlowUpdatedExtension\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"time\",\"type\":\"uint256\"}],\"name\":\"realtimeBalanceOf\",\"outputs\":[{\"internalType\":\"int256\",\"name\":\"dynamicBalance\",\"type\":\"int256\"},{\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"owedDeposit\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"agreementType\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"}],\"name\":\"getMaximumFlowRateFromDeposit\",\"outputs\":[{\"internalType\":\"int96\",\"name\":\"flowRate\",\"type\":\"int96\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"int96\",\"name\":\"flowRate\",\"type\":\"int96\"}],\"name\":\"getDepositRequiredForFlowRate\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"isPatricianPeriodNow\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isCurrentlyPatricianPeriod\",\"type\":\"bool\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"isPatricianPeriod\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"flowOperator\",\"type\":\"address\"},{\"internalType\":\"uint8\",\"name\":\"permissions\",\"type\":\"uint8\"},{\"internalType\":\"int96\",\"name\":\"flowRateAllowance\",\"type\":\"int96\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"updateFlowOperatorPermissions\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"flowOperator\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"authorizeFlowOperatorWithFullControl\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"flowOperator\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"revokeFlowOperatorWithFullControl\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"flowOperator\",\"type\":\"address\"}],\"name\":\"getFlowOperatorData\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"flowOperatorId\",\"type\":\"bytes32\"},{\"internalType\":\"uint8\",\"name\":\"permissions\",\"type\":\"uint8\"},{\"internalType\":\"int96\",\"name\":\"flowRateAllowance\",\"type\":\"int96\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"flowOperatorId\",\"type\":\"bytes32\"}],\"name\":\"getFlowOperatorDataByID\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"permissions\",\"type\":\"uint8\"},{\"internalType\":\"int96\",\"name\":\"flowRateAllowance\",\"type\":\"int96\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"},{\"internalType\":\"int96\",\"name\":\"flowRate\",\"type\":\"int96\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"createFlow\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"},{\"internalType\":\"int96\",\"name\":\"flowRate\",\"type\":\"int96\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"createFlowByOperator\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"},{\"internalType\":\"int96\",\"name\":\"flowRate\",\"type\":\"int96\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"updateFlow\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"},{\"internalType\":\"int96\",\"name\":\"flowRate\",\"type\":\"int96\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"updateFlowByOperator\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"}],\"name\":\"getFlow\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"},{\"internalType\":\"int96\",\"name\":\"flowRate\",\"type\":\"int96\"},{\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"owedDeposit\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"agreementId\",\"type\":\"bytes32\"}],\"name\":\"getFlowByID\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"},{\"internalType\":\"int96\",\"name\":\"flowRate\",\"type\":\"int96\"},{\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"owedDeposit\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"getAccountFlowInfo\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"},{\"internalType\":\"int96\",\"name\":\"flowRate\",\"type\":\"int96\"},{\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"owedDeposit\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"getNetFlow\",\"outputs\":[{\"internalType\":\"int96\",\"name\":\"flowRate\",\"type\":\"int96\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"deleteFlow\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"deleteFlowByOperator\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]}"));}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/ERC20WithTokenInfo.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"abi\":[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]}"));}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/SuperfluidGovernanceII.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"abi\":[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"isKeySet\",\"type\":\"bool\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"liquidationPeriod\",\"type\":\"uint256\"}],\"name\":\"CFAv1LiquidationPeriodChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"uuid\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"codeAddress\",\"type\":\"address\"}],\"name\":\"CodeUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"key\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"isKeySet\",\"type\":\"bool\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"ConfigChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"version\",\"type\":\"uint8\"}],\"name\":\"Initialized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"isKeySet\",\"type\":\"bool\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"liquidationPeriod\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"patricianPeriod\",\"type\":\"uint256\"}],\"name\":\"PPPConfigurationChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"isKeySet\",\"type\":\"bool\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"rewardAddress\",\"type\":\"address\"}],\"name\":\"RewardAddressChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"isKeySet\",\"type\":\"bool\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"minimumDeposit\",\"type\":\"uint256\"}],\"name\":\"SuperTokenMinimumDepositChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"isKeySet\",\"type\":\"bool\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"forwarder\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"enabled\",\"type\":\"bool\"}],\"name\":\"TrustedForwarderChanged\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"factory\",\"type\":\"address\"}],\"name\":\"authorizeAppFactory\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperToken[]\",\"name\":\"tokens\",\"type\":\"address[]\"}],\"name\":\"batchUpdateSuperTokenLogic\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperToken[]\",\"name\":\"tokens\",\"type\":\"address[]\"},{\"internalType\":\"uint256[]\",\"name\":\"minimumDeposits\",\"type\":\"uint256[]\"}],\"name\":\"batchUpdateSuperTokenMinimumDeposit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"castrate\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"key\",\"type\":\"bytes32\"}],\"name\":\"clearConfig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"}],\"name\":\"clearPPPConfig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"}],\"name\":\"clearRewardAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperToken\",\"name\":\"superToken\",\"type\":\"address\"}],\"name\":\"clearSuperTokenMinimumDeposit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"forwarder\",\"type\":\"address\"}],\"name\":\"clearTrustedForwarder\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"forwarder\",\"type\":\"address\"}],\"name\":\"disableTrustedForwarder\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"forwarder\",\"type\":\"address\"}],\"name\":\"enableTrustedForwarder\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getCodeAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"codeAddress\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"key\",\"type\":\"bytes32\"}],\"name\":\"getConfigAsAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"value\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"key\",\"type\":\"bytes32\"}],\"name\":\"getConfigAsUint256\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"period\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"}],\"name\":\"getPPPConfig\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"liquidationPeriod\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"patricianPeriod\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"}],\"name\":\"getRewardAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"}],\"name\":\"getSuperTokenMinimumDeposit\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"factory\",\"type\":\"address\"}],\"name\":\"isAuthorizedAppFactory\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"forwarder\",\"type\":\"address\"}],\"name\":\"isTrustedForwarder\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"}],\"name\":\"registerAgreementClass\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"newGov\",\"type\":\"address\"}],\"name\":\"replaceGovernance\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"key\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"value\",\"type\":\"address\"}],\"name\":\"setConfig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"key\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"setConfig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"liquidationPeriod\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"patricianPeriod\",\"type\":\"uint256\"}],\"name\":\"setPPPConfig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"rewardAddress\",\"type\":\"address\"}],\"name\":\"setRewardAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"superToken\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"setSuperTokenMinimumDeposit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"factory\",\"type\":\"address\"}],\"name\":\"unauthorizeAppFactory\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"hostNewLogic\",\"type\":\"address\"},{\"internalType\":\"address[]\",\"name\":\"agreementClassNewLogics\",\"type\":\"address[]\"},{\"internalType\":\"address\",\"name\":\"superTokenFactoryNewLogic\",\"type\":\"address\"}],\"name\":\"updateContracts\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"proxiableUUID\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newAddress\",\"type\":\"address\"}],\"name\":\"updateCode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]}"));}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/IInstantDistributionAgreementV1.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"abi\":[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"IndexCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"IndexDistributionClaimed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"IndexSubscribed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint128\",\"name\":\"units\",\"type\":\"uint128\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"IndexUnitsUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"IndexUnsubscribed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"uint128\",\"name\":\"oldIndexValue\",\"type\":\"uint128\"},{\"indexed\":false,\"internalType\":\"uint128\",\"name\":\"newIndexValue\",\"type\":\"uint128\"},{\"indexed\":false,\"internalType\":\"uint128\",\"name\":\"totalUnitsPending\",\"type\":\"uint128\"},{\"indexed\":false,\"internalType\":\"uint128\",\"name\":\"totalUnitsApproved\",\"type\":\"uint128\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"IndexUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"SubscriptionApproved\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"SubscriptionDistributionClaimed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"SubscriptionRevoked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"indexed\":false,\"internalType\":\"uint128\",\"name\":\"units\",\"type\":\"uint128\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"SubscriptionUnitsUpdated\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"time\",\"type\":\"uint256\"}],\"name\":\"realtimeBalanceOf\",\"outputs\":[{\"internalType\":\"int256\",\"name\":\"dynamicBalance\",\"type\":\"int256\"},{\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"owedDeposit\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"agreementType\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"createIndex\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"}],\"name\":\"getIndex\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"exist\",\"type\":\"bool\"},{\"internalType\":\"uint128\",\"name\":\"indexValue\",\"type\":\"uint128\"},{\"internalType\":\"uint128\",\"name\":\"totalUnitsApproved\",\"type\":\"uint128\"},{\"internalType\":\"uint128\",\"name\":\"totalUnitsPending\",\"type\":\"uint128\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"calculateDistribution\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"actualAmount\",\"type\":\"uint256\"},{\"internalType\":\"uint128\",\"name\":\"newIndexValue\",\"type\":\"uint128\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"internalType\":\"uint128\",\"name\":\"indexValue\",\"type\":\"uint128\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"updateIndex\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"distribute\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"approveSubscription\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"revokeSubscription\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"internalType\":\"uint128\",\"name\":\"units\",\"type\":\"uint128\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"updateSubscription\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"}],\"name\":\"getSubscription\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"exist\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"},{\"internalType\":\"uint128\",\"name\":\"units\",\"type\":\"uint128\"},{\"internalType\":\"uint256\",\"name\":\"pendingDistribution\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"agreementId\",\"type\":\"bytes32\"}],\"name\":\"getSubscriptionByID\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"},{\"internalType\":\"uint128\",\"name\":\"units\",\"type\":\"uint128\"},{\"internalType\":\"uint256\",\"name\":\"pendingDistribution\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"}],\"name\":\"listSubscriptions\",\"outputs\":[{\"internalType\":\"address[]\",\"name\":\"publishers\",\"type\":\"address[]\"},{\"internalType\":\"uint32[]\",\"name\":\"indexIds\",\"type\":\"uint32[]\"},{\"internalType\":\"uint128[]\",\"name\":\"unitsList\",\"type\":\"uint128[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"deleteSubscription\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract ISuperfluidToken\",\"name\":\"token\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"publisher\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"indexId\",\"type\":\"uint32\"},{\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"ctx\",\"type\":\"bytes\"}],\"name\":\"claim\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"newCtx\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]}"));}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/ISETH.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"abi\":[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32[]\",\"name\":\"data\",\"type\":\"bytes32[]\"}],\"name\":\"AgreementCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"penaltyAccount\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"rewardAccount\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"rewardAmount\",\"type\":\"uint256\"}],\"name\":\"AgreementLiquidated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"liquidatorAccount\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"penaltyAccount\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"bondAccount\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"rewardAmount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"bailoutAmount\",\"type\":\"uint256\"}],\"name\":\"AgreementLiquidatedBy\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"liquidatorAccount\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"targetAccount\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"rewardAmountReceiver\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"rewardAmount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"int256\",\"name\":\"targetAccountBalanceDelta\",\"type\":\"int256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"liquidationTypeData\",\"type\":\"bytes\"}],\"name\":\"AgreementLiquidatedV2\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"slotId\",\"type\":\"uint256\"}],\"name\":\"AgreementStateUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"}],\"name\":\"AgreementTerminated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32[]\",\"name\":\"data\",\"type\":\"bytes32[]\"}],\"name\":\"AgreementUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"AuthorizedOperator\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"bailoutAccount\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"bailoutAmount\",\"type\":\"uint256\"}],\"name\":\"Bailout\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"Burned\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"Minted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"RevokedOperator\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"Sent\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"TokenDowngraded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"TokenUpgraded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"authorizeOperator\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"balance\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"burn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32[]\",\"name\":\"data\",\"type\":\"bytes32[]\"}],\"name\":\"createAgreement\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"subtractedValue\",\"type\":\"uint256\"}],\"name\":\"decreaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"defaultOperators\",\"outputs\":[{\"internalType\":\"address[]\",\"name\":\"\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"downgrade\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"wad\",\"type\":\"uint256\"}],\"name\":\"downgradeToETH\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"getAccountActiveAgreements\",\"outputs\":[{\"internalType\":\"contract ISuperAgreement[]\",\"name\":\"activeAgreements\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"dataLength\",\"type\":\"uint256\"}],\"name\":\"getAgreementData\",\"outputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"data\",\"type\":\"bytes32[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"slotId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"dataLength\",\"type\":\"uint256\"}],\"name\":\"getAgreementStateSlot\",\"outputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"slotData\",\"type\":\"bytes32[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getHost\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"host\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getUnderlyingToken\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"tokenAddr\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"granularity\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"addedValue\",\"type\":\"uint256\"}],\"name\":\"increaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract IERC20\",\"name\":\"underlyingToken\",\"type\":\"address\"},{\"internalType\":\"uint8\",\"name\":\"underlyingDecimals\",\"type\":\"uint8\"},{\"internalType\":\"string\",\"name\":\"n\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"s\",\"type\":\"string\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"isAccountCritical\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isCritical\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"isAccountCriticalNow\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isCritical\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"isAccountSolvent\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isSolvent\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"isAccountSolventNow\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isSolvent\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"isOperatorFor\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"bytes\",\"name\":\"liquidationTypeData\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"liquidatorAccount\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"useDefaultRewardAccount\",\"type\":\"bool\"},{\"internalType\":\"address\",\"name\":\"targetAccount\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"rewardAmount\",\"type\":\"uint256\"},{\"internalType\":\"int256\",\"name\":\"targetAccountBalanceDelta\",\"type\":\"int256\"}],\"name\":\"makeLiquidationPayoutsV2\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"operationApprove\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"operationDowngrade\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"operationTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"operationUpgrade\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"operatorBurn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"operatorSend\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"realtimeBalanceOf\",\"outputs\":[{\"internalType\":\"int256\",\"name\":\"availableBalance\",\"type\":\"int256\"},{\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"owedDeposit\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"realtimeBalanceOfNow\",\"outputs\":[{\"internalType\":\"int256\",\"name\":\"availableBalance\",\"type\":\"int256\"},{\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"owedDeposit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"revokeOperator\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"selfApproveFor\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"selfBurn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"selfMint\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"selfTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"send\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"int256\",\"name\":\"delta\",\"type\":\"int256\"}],\"name\":\"settleBalance\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"dataLength\",\"type\":\"uint256\"}],\"name\":\"terminateAgreement\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"}],\"name\":\"transferAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32[]\",\"name\":\"data\",\"type\":\"bytes32[]\"}],\"name\":\"updateAgreementData\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"slotId\",\"type\":\"uint256\"},{\"internalType\":\"bytes32[]\",\"name\":\"slotData\",\"type\":\"bytes32[]\"}],\"name\":\"updateAgreementStateSlot\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"upgrade\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"upgradeByETH\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"upgradeByETHTo\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"upgradeTo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]}"));}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/SuperToken.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"abi\":[{\"inputs\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"host\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32[]\",\"name\":\"data\",\"type\":\"bytes32[]\"}],\"name\":\"AgreementCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"penaltyAccount\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"rewardAccount\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"rewardAmount\",\"type\":\"uint256\"}],\"name\":\"AgreementLiquidated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"liquidatorAccount\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"penaltyAccount\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"bondAccount\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"rewardAmount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"bailoutAmount\",\"type\":\"uint256\"}],\"name\":\"AgreementLiquidatedBy\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"liquidatorAccount\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"targetAccount\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"rewardAmountReceiver\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"rewardAmount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"int256\",\"name\":\"targetAccountBalanceDelta\",\"type\":\"int256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"liquidationTypeData\",\"type\":\"bytes\"}],\"name\":\"AgreementLiquidatedV2\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"slotId\",\"type\":\"uint256\"}],\"name\":\"AgreementStateUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"}],\"name\":\"AgreementTerminated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32[]\",\"name\":\"data\",\"type\":\"bytes32[]\"}],\"name\":\"AgreementUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"AuthorizedOperator\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"bailoutAccount\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"bailoutAmount\",\"type\":\"uint256\"}],\"name\":\"Bailout\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"Burned\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"uuid\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"codeAddress\",\"type\":\"address\"}],\"name\":\"CodeUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"version\",\"type\":\"uint8\"}],\"name\":\"Initialized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"Minted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"RevokedOperator\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"Sent\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"TokenDowngraded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"TokenUpgraded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"castrate\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32[]\",\"name\":\"data\",\"type\":\"bytes32[]\"}],\"name\":\"createAgreement\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"getAccountActiveAgreements\",\"outputs\":[{\"internalType\":\"contract ISuperAgreement[]\",\"name\":\"\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"dataLength\",\"type\":\"uint256\"}],\"name\":\"getAgreementData\",\"outputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"data\",\"type\":\"bytes32[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"agreementClass\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"slotId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"dataLength\",\"type\":\"uint256\"}],\"name\":\"getAgreementStateSlot\",\"outputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"slotData\",\"type\":\"bytes32[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getCodeAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"codeAddress\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getHost\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"host\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"isAccountCritical\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isCritical\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"isAccountCriticalNow\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isCritical\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"isAccountSolvent\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isSolvent\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"isAccountSolventNow\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isSolvent\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"bytes\",\"name\":\"liquidationTypeData\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"liquidatorAccount\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"useDefaultRewardAccount\",\"type\":\"bool\"},{\"internalType\":\"address\",\"name\":\"targetAccount\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"rewardAmount\",\"type\":\"uint256\"},{\"internalType\":\"int256\",\"name\":\"targetAccountBalanceDelta\",\"type\":\"int256\"}],\"name\":\"makeLiquidationPayoutsV2\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"name\":\"realtimeBalanceOf\",\"outputs\":[{\"internalType\":\"int256\",\"name\":\"availableBalance\",\"type\":\"int256\"},{\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"owedDeposit\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"realtimeBalanceOfNow\",\"outputs\":[{\"internalType\":\"int256\",\"name\":\"availableBalance\",\"type\":\"int256\"},{\"internalType\":\"uint256\",\"name\":\"deposit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"owedDeposit\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"timestamp\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"int256\",\"name\":\"delta\",\"type\":\"int256\"}],\"name\":\"settleBalance\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"dataLength\",\"type\":\"uint256\"}],\"name\":\"terminateAgreement\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32[]\",\"name\":\"data\",\"type\":\"bytes32[]\"}],\"name\":\"updateAgreementData\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"slotId\",\"type\":\"uint256\"},{\"internalType\":\"bytes32[]\",\"name\":\"slotData\",\"type\":\"bytes32[]\"}],\"name\":\"updateAgreementStateSlot\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contract IERC20\",\"name\":\"underlyingToken\",\"type\":\"address\"},{\"internalType\":\"uint8\",\"name\":\"underlyingDecimals\",\"type\":\"uint8\"},{\"internalType\":\"string\",\"name\":\"n\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"s\",\"type\":\"string\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"proxiableUUID\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newAddress\",\"type\":\"address\"}],\"name\":\"updateCode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"balance\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"holder\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"addedValue\",\"type\":\"uint256\"}],\"name\":\"increaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"subtractedValue\",\"type\":\"uint256\"}],\"name\":\"decreaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"granularity\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"send\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"burn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"tokenHolder\",\"type\":\"address\"}],\"name\":\"isOperatorFor\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"authorizeOperator\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"revokeOperator\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"defaultOperators\",\"outputs\":[{\"internalType\":\"address[]\",\"name\":\"\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"operatorSend\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"operatorData\",\"type\":\"bytes\"}],\"name\":\"operatorBurn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"selfMint\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"userData\",\"type\":\"bytes\"}],\"name\":\"selfBurn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"selfApproveFor\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"holder\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"selfTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"}],\"name\":\"transferAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getUnderlyingToken\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"upgrade\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"upgradeTo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"downgrade\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"operationApprove\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"recipient\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"operationTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"operationUpgrade\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"operationDowngrade\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]}"));}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/IResolver.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"abi\":[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"target\",\"type\":\"address\"}],\"name\":\"Set\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"address\",\"name\":\"target\",\"type\":\"address\"}],\"name\":\"set\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"}],\"name\":\"get\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]}"));}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/SuperfluidLoader.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"abi\":[{\"inputs\":[{\"internalType\":\"contract IResolver\",\"name\":\"resolver\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"releaseVersion\",\"type\":\"string\"}],\"name\":\"loadFramework\",\"outputs\":[{\"components\":[{\"internalType\":\"contract ISuperfluid\",\"name\":\"superfluid\",\"type\":\"address\"},{\"internalType\":\"contract ISuperTokenFactory\",\"name\":\"superTokenFactory\",\"type\":\"address\"},{\"internalType\":\"contract ISuperAgreement\",\"name\":\"agreementCFAv1\",\"type\":\"address\"},{\"internalType\":\"contract ISuperAgreement\",\"name\":\"agreementIDAv1\",\"type\":\"address\"}],\"internalType\":\"struct SuperfluidLoader.Framework\",\"name\":\"result\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]}"));}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Host.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Host)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Operation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$Superfluid$2e$json__$28$json$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/Superfluid.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
;
;
;
class Host {
    constructor(hostAddress){
        /**
         * Creates an Operation of the `callAgreement` function on the host contract.
         * @param agreementAddress the agreement address (cfa or ida address)
         * @param callData the encoded callData for the function
         * @param userData any additional user data
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} an `Operation` class
         */ this.populateCallAgreementTxnAndReturnOperation = (agreementAddress, callData, userData, overrides)=>{
            const txn = this.contract.populateTransaction.callAgreement(agreementAddress, callData, userData || "0x", overrides || {});
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](txn, "SUPERFLUID_CALL_AGREEMENT");
        };
        this.contract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(hostAddress, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$Superfluid$2e$json__$28$json$29$__["default"].abi);
    }
} //# sourceMappingURL=Host.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/defaultSubgraphReleaseTag.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"value\":\"v1\"}"));}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/constants.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ARBITRUM_ONE": (()=>ARBITRUM_ONE),
    "ARBITRUM_ONE_CHAIN_ID": (()=>ARBITRUM_ONE_CHAIN_ID),
    "ARBITRUM_RINKEBY": (()=>ARBITRUM_RINKEBY),
    "ARBITRUM_RINKEBY_CHAIN_ID": (()=>ARBITRUM_RINKEBY_CHAIN_ID),
    "AUTHORIZE_FLOW_OPERATOR_CREATE": (()=>AUTHORIZE_FLOW_OPERATOR_CREATE),
    "AUTHORIZE_FLOW_OPERATOR_DELETE": (()=>AUTHORIZE_FLOW_OPERATOR_DELETE),
    "AUTHORIZE_FLOW_OPERATOR_UPDATE": (()=>AUTHORIZE_FLOW_OPERATOR_UPDATE),
    "AUTHORIZE_FULL_CONTROL": (()=>AUTHORIZE_FULL_CONTROL),
    "AVALANCHE_C": (()=>AVALANCHE_C),
    "AVALANCHE_C_CHAIN_ID": (()=>AVALANCHE_C_CHAIN_ID),
    "AVALANCHE_FUJI": (()=>AVALANCHE_FUJI),
    "AVALANCHE_FUJI_CHAIN_ID": (()=>AVALANCHE_FUJI_CHAIN_ID),
    "BASE_18": (()=>BASE_18),
    "BSC_MAINNET": (()=>BSC_MAINNET),
    "BSC_MAINNET_CHAIN_ID": (()=>BSC_MAINNET_CHAIN_ID),
    "DAYS_PER_MONTH": (()=>DAYS_PER_MONTH),
    "DAYS_PER_WEEK": (()=>DAYS_PER_WEEK),
    "DAY_IN_SECONDS": (()=>DAY_IN_SECONDS),
    "ETH_GOERLI": (()=>ETH_GOERLI),
    "ETH_GOERLI_CHAIN_ID": (()=>ETH_GOERLI_CHAIN_ID),
    "ETH_KOVAN": (()=>ETH_KOVAN),
    "ETH_KOVAN_CHAIN_ID": (()=>ETH_KOVAN_CHAIN_ID),
    "ETH_RINKEBY": (()=>ETH_RINKEBY),
    "ETH_RINKEBY_CHAIN_ID": (()=>ETH_RINKEBY_CHAIN_ID),
    "ETH_ROPSTEN": (()=>ETH_ROPSTEN),
    "ETH_ROPSTEN_CHAIN_ID": (()=>ETH_ROPSTEN_CHAIN_ID),
    "GNOSIS_CHAIN_ID": (()=>GNOSIS_CHAIN_ID),
    "HOURS_PER_DAY": (()=>HOURS_PER_DAY),
    "HOUR_IN_SECONDS": (()=>HOUR_IN_SECONDS),
    "MATIC_CHAIN_ID": (()=>MATIC_CHAIN_ID),
    "MINUTES_PER_HOUR": (()=>MINUTES_PER_HOUR),
    "MINUTE_IN_SECONDS": (()=>MINUTE_IN_SECONDS),
    "MONTHS_PER_YEAR": (()=>MONTHS_PER_YEAR),
    "MONTH_IN_SECONDS": (()=>MONTH_IN_SECONDS),
    "MUMBAI_CHAIN_ID": (()=>MUMBAI_CHAIN_ID),
    "OPTIMISM_KOVAN": (()=>OPTIMISM_KOVAN),
    "OPTIMISM_KOVAN_CHAIN_ID": (()=>OPTIMISM_KOVAN_CHAIN_ID),
    "OPTIMISM_MAINNET": (()=>OPTIMISM_MAINNET),
    "OPTIMISM_MAINNET_CHAIN_ID": (()=>OPTIMISM_MAINNET_CHAIN_ID),
    "POLYGON_MAINNET": (()=>POLYGON_MAINNET),
    "POLYGON_MUMBAI": (()=>POLYGON_MUMBAI),
    "WEEK_IN_SECONDS": (()=>WEEK_IN_SECONDS),
    "XDAI_MAINNET": (()=>XDAI_MAINNET),
    "YEAR_IN_SECONDS": (()=>YEAR_IN_SECONDS),
    "chainIdToResolverDataMap": (()=>chainIdToResolverDataMap),
    "chainIds": (()=>chainIds),
    "networkNameToChainIdMap": (()=>networkNameToChainIdMap)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$defaultSubgraphReleaseTag$2e$json__$28$json$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/defaultSubgraphReleaseTag.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/next@15.1.3_react-dom@19.0.0_react@19.0.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_MONTH = 30;
const DAYS_PER_WEEK = 7;
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const MINUTE_IN_SECONDS = 60;
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * MINUTES_PER_HOUR;
const DAY_IN_SECONDS = HOUR_IN_SECONDS * HOURS_PER_DAY;
const WEEK_IN_SECONDS = DAY_IN_SECONDS * DAYS_PER_WEEK;
const MONTH_IN_SECONDS = DAY_IN_SECONDS * DAYS_PER_MONTH;
const YEAR_IN_SECONDS = MONTH_IN_SECONDS * MONTHS_PER_YEAR; // NOTE: Is 360 days (misses 5-6 days)
const BASE_18 = 1e18;
const ETH_ROPSTEN = "eth-ropsten";
const ETH_RINKEBY = "eth-rinkeby";
const ETH_GOERLI = "eth-goerli";
const ETH_KOVAN = "eth-kovan";
const POLYGON_MAINNET = "polygon-mainnet";
const POLYGON_MUMBAI = "polygon-mumbai";
const XDAI_MAINNET = "xdai-mainnet";
const OPTIMISM_MAINNET = "optimism-mainnet";
const OPTIMISM_KOVAN = "optimism-kovan";
const ARBITRUM_ONE = "arbitrum-one";
const ARBITRUM_RINKEBY = "arbitrum-rinkeby";
const AVALANCHE_C = "avalanche-c";
const AVALANCHE_FUJI = "avalanche-fuji";
const BSC_MAINNET = "bsc-mainnet";
const ETH_ROPSTEN_CHAIN_ID = 3;
const ETH_RINKEBY_CHAIN_ID = 4;
const ETH_GOERLI_CHAIN_ID = 5;
const ETH_KOVAN_CHAIN_ID = 42;
const GNOSIS_CHAIN_ID = 100;
const MATIC_CHAIN_ID = 137;
const MUMBAI_CHAIN_ID = 80001;
const OPTIMISM_MAINNET_CHAIN_ID = 10;
const OPTIMISM_KOVAN_CHAIN_ID = 69;
const ARBITRUM_ONE_CHAIN_ID = 42161;
const ARBITRUM_RINKEBY_CHAIN_ID = 421611;
const AVALANCHE_FUJI_CHAIN_ID = 43113;
const AVALANCHE_C_CHAIN_ID = 43114;
const BSC_MAINNET_CHAIN_ID = 56;
const chainIds = [
    ETH_ROPSTEN_CHAIN_ID,
    ETH_RINKEBY_CHAIN_ID,
    ETH_GOERLI_CHAIN_ID,
    ETH_KOVAN_CHAIN_ID,
    MATIC_CHAIN_ID,
    MUMBAI_CHAIN_ID,
    GNOSIS_CHAIN_ID,
    OPTIMISM_MAINNET_CHAIN_ID,
    OPTIMISM_KOVAN_CHAIN_ID,
    ARBITRUM_ONE_CHAIN_ID,
    ARBITRUM_RINKEBY_CHAIN_ID,
    AVALANCHE_FUJI_CHAIN_ID,
    AVALANCHE_C_CHAIN_ID,
    BSC_MAINNET_CHAIN_ID
];
const AUTHORIZE_FLOW_OPERATOR_CREATE = 1 << 0;
const AUTHORIZE_FLOW_OPERATOR_UPDATE = 1 << 1;
const AUTHORIZE_FLOW_OPERATOR_DELETE = 1 << 2;
const AUTHORIZE_FULL_CONTROL = AUTHORIZE_FLOW_OPERATOR_CREATE | AUTHORIZE_FLOW_OPERATOR_UPDATE | AUTHORIZE_FLOW_OPERATOR_DELETE;
const subgraphReleaseTag = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$1$2e$3_react$2d$dom$40$19$2e$0$2e$0_react$40$19$2e$0$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.SUBGRAPH_RELEASE_TAG || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$defaultSubgraphReleaseTag$2e$json__$28$json$29$__["default"].value;
const baseUrl = `https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-${subgraphReleaseTag}`;
const chainIdToResolverDataMap = new Map([
    [
        ETH_ROPSTEN_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-ropsten`,
            networkName: ETH_ROPSTEN,
            resolverAddress: "0x3b44e06D96BcA9412CBc23F80F41B9e30933571a",
            nativeTokenSymbol: "ETH"
        }
    ],
    [
        ETH_RINKEBY_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-rinkeby`,
            networkName: ETH_RINKEBY,
            resolverAddress: "0x659635Fab0A0cef1293f7eb3c7934542B6A6B31A",
            nativeTokenSymbol: "ETH"
        }
    ],
    [
        ETH_GOERLI_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-goerli`,
            networkName: ETH_GOERLI,
            resolverAddress: "0x3710AB3fDE2B61736B8BB0CE845D6c61F667a78E",
            nativeTokenSymbol: "ETH"
        }
    ],
    [
        OPTIMISM_MAINNET_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-optimism-mainnet`,
            networkName: OPTIMISM_MAINNET,
            resolverAddress: "0x743B5f46BC86caF41bE4956d9275721E0531B186",
            nativeTokenSymbol: "ETH"
        }
    ],
    [
        ETH_KOVAN_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-kovan`,
            networkName: ETH_KOVAN,
            resolverAddress: "0x851d3dd9dc97c1df1DA73467449B3893fc76D85B",
            nativeTokenSymbol: "ETH"
        }
    ],
    [
        OPTIMISM_KOVAN_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-optimism-kovan`,
            networkName: OPTIMISM_KOVAN,
            resolverAddress: "0x218B65780615Ff134f9Ad810CB98839534D3C0D6",
            nativeTokenSymbol: "ETH"
        }
    ],
    [
        GNOSIS_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-xdai`,
            networkName: XDAI_MAINNET,
            resolverAddress: "0xD2009765189164b495c110D61e4D301729079911",
            nativeTokenSymbol: "xDAI"
        }
    ],
    [
        MATIC_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-matic`,
            networkName: POLYGON_MAINNET,
            resolverAddress: "0xE0cc76334405EE8b39213E620587d815967af39C",
            nativeTokenSymbol: "MATIC"
        }
    ],
    [
        ARBITRUM_ONE_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-arbitrum-one`,
            networkName: ARBITRUM_ONE,
            resolverAddress: "0x609b9d9d6Ee9C3200745A79B9d3398DBd63d509F",
            nativeTokenSymbol: "ETH"
        }
    ],
    [
        AVALANCHE_FUJI_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-avalanche-fuji`,
            networkName: AVALANCHE_FUJI,
            resolverAddress: "0x141920741bC45b962B59c833cd849bA617F7ef38",
            nativeTokenSymbol: "AVAX"
        }
    ],
    [
        AVALANCHE_C_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-avalanche-c`,
            networkName: AVALANCHE_C,
            resolverAddress: "0x24a3F04F70B7f07B9673EadD3e146391BcfEa5c1",
            nativeTokenSymbol: "AVAX"
        }
    ],
    [
        BSC_MAINNET_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-bsc-mainnet`,
            networkName: BSC_MAINNET,
            resolverAddress: "0x69604aA4e9e8BF44A73C680997205Edb03A92E41",
            nativeTokenSymbol: "BNB"
        }
    ],
    [
        MUMBAI_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-mumbai`,
            networkName: POLYGON_MUMBAI,
            resolverAddress: "0x8C54C83FbDe3C59e59dd6E324531FB93d4F504d3",
            nativeTokenSymbol: "MATIC"
        }
    ],
    [
        ARBITRUM_RINKEBY_CHAIN_ID,
        {
            subgraphAPIEndpoint: `${baseUrl}-arbitrum-rinkeby`,
            networkName: ARBITRUM_RINKEBY,
            resolverAddress: "0xa2C0C70A1E922f5f060ec20EE3aF002C163b4567",
            nativeTokenSymbol: "ETH"
        }
    ]
]);
const networkNameToChainIdMap = new Map([
    [
        ETH_ROPSTEN,
        ETH_ROPSTEN_CHAIN_ID
    ],
    [
        ETH_RINKEBY,
        ETH_RINKEBY_CHAIN_ID
    ],
    [
        ETH_GOERLI,
        ETH_GOERLI_CHAIN_ID
    ],
    [
        ETH_KOVAN,
        ETH_KOVAN_CHAIN_ID
    ],
    [
        XDAI_MAINNET,
        GNOSIS_CHAIN_ID
    ],
    [
        POLYGON_MAINNET,
        MATIC_CHAIN_ID
    ],
    [
        POLYGON_MUMBAI,
        MUMBAI_CHAIN_ID
    ],
    [
        OPTIMISM_KOVAN,
        OPTIMISM_KOVAN_CHAIN_ID
    ],
    [
        OPTIMISM_MAINNET,
        OPTIMISM_MAINNET_CHAIN_ID
    ],
    [
        ARBITRUM_ONE,
        ARBITRUM_ONE_CHAIN_ID
    ],
    [
        ARBITRUM_RINKEBY,
        ARBITRUM_RINKEBY_CHAIN_ID
    ],
    [
        AVALANCHE_C,
        AVALANCHE_C_CHAIN_ID
    ],
    [
        AVALANCHE_FUJI,
        AVALANCHE_FUJI_CHAIN_ID
    ],
    [
        BSC_MAINNET,
        BSC_MAINNET_CHAIN_ID
    ]
]); //# sourceMappingURL=constants.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "calculateAvailableBalance": (()=>calculateAvailableBalance),
    "flowedAmountSinceUpdatedAt": (()=>flowedAmountSinceUpdatedAt),
    "getFlowAmountByPerSecondFlowRate": (()=>getFlowAmountByPerSecondFlowRate),
    "getFlowOperatorId": (()=>getFlowOperatorId),
    "getPerSecondFlowRateByDay": (()=>getPerSecondFlowRateByDay),
    "getPerSecondFlowRateByMonth": (()=>getPerSecondFlowRateByMonth),
    "getPerSecondFlowRateByWeek": (()=>getPerSecondFlowRateByWeek),
    "getPerSecondFlowRateByYear": (()=>getPerSecondFlowRateByYear),
    "getSanitizedTimestamp": (()=>getSanitizedTimestamp),
    "getStringCurrentTimeInSeconds": (()=>getStringCurrentTimeInSeconds),
    "getTransactionDescription": (()=>getTransactionDescription),
    "isEthersProvider": (()=>isEthersProvider),
    "isInjectedEthers": (()=>isInjectedEthers),
    "isInjectedWeb3": (()=>isInjectedWeb3),
    "isNullOrEmpty": (()=>isNullOrEmpty),
    "isPermissionsClean": (()=>isPermissionsClean),
    "normalizeAddress": (()=>normalizeAddress),
    "removeSigHashFromCallData": (()=>removeSigHashFromCallData),
    "subscriptionTotalAmountClaimableSinceUpdatedAt": (()=>subscriptionTotalAmountClaimableSinceUpdatedAt),
    "subscriptionTotalAmountDistributedSinceUpdated": (()=>subscriptionTotalAmountDistributedSinceUpdated),
    "subscriptionTotalAmountReceivedSinceUpdated": (()=>subscriptionTotalAmountReceivedSinceUpdated),
    "toBN": (()=>toBN),
    "typeGuard": (()=>typeGuard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
;
;
;
const EMPTY = "0x";
const normalizeAddress = (address)=>{
    if (!address) return "";
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].utils.isAddress(address) === false) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
            type: "INVALID_ADDRESS",
            message: "The address you have entered is not a valid ethereum address"
        });
    }
    return address.toLowerCase();
};
const isPermissionsClean = (permissions)=>{
    return (permissions & ~(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHORIZE_FLOW_OPERATOR_CREATE"] | __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHORIZE_FLOW_OPERATOR_UPDATE"] | __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHORIZE_FLOW_OPERATOR_DELETE"])) === 0;
};
const isNullOrEmpty = (str)=>{
    return str == null || str === "";
};
function toBN(num) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].BigNumber.from(num);
}
const removeSigHashFromCallData = (callData)=>EMPTY.concat(callData.slice(10));
const getTransactionDescription = (fragments, data, value)=>{
    const iface = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].utils.Interface(fragments);
    const txnDescription = iface.parseTransaction({
        data,
        value
    });
    return txnDescription;
};
const getPerSecondFlowRateByYear = (amountPerYear)=>{
    return Math.round(Number(amountPerYear) / __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YEAR_IN_SECONDS"] * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_18"]).toString();
};
const getPerSecondFlowRateByMonth = (amountPerMonth)=>{
    return Math.round(Number(amountPerMonth) / __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTH_IN_SECONDS"] * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_18"]).toString();
};
const getPerSecondFlowRateByWeek = (amountPerWeek)=>{
    return Math.round(Number(amountPerWeek) / __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WEEK_IN_SECONDS"] * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_18"]).toString();
};
const getPerSecondFlowRateByDay = (amountPerDay)=>{
    return Math.round(Number(amountPerDay) / __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAY_IN_SECONDS"] * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_18"]).toString();
};
const getFlowAmountByPerSecondFlowRate = (perSecondFlowRate)=>{
    const decimalFlowRate = Number(perSecondFlowRate) / __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_18"];
    return {
        daily: Math.round(decimalFlowRate * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAY_IN_SECONDS"]).toString(),
        weekly: Math.round(decimalFlowRate * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WEEK_IN_SECONDS"]).toString(),
        monthly: Math.round(decimalFlowRate * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTH_IN_SECONDS"]).toString(),
        yearly: Math.round(decimalFlowRate * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YEAR_IN_SECONDS"]).toString()
    };
};
const flowedAmountSinceUpdatedAt = ({ netFlowRate, currentTimestamp, updatedAtTimestamp })=>{
    return toBN(currentTimestamp).sub(toBN(updatedAtTimestamp)).mul(toBN(netFlowRate));
};
const subscriptionTotalAmountDistributedSinceUpdated = (indexSubscriptions)=>{
    return indexSubscriptions.reduce((x, y)=>toBN(x).add(toBN(y.index.indexValue).sub(toBN(y.indexValueUntilUpdatedAt))).mul(toBN(y.units)), toBN(0));
};
const subscriptionTotalAmountReceivedSinceUpdated = (indexSubscriptions)=>{
    return indexSubscriptions.filter((x)=>x.approved).reduce((x, y)=>toBN(x).add(toBN(y.index.indexValue).sub(toBN(y.indexValueUntilUpdatedAt))).mul(toBN(y.units)), toBN(0));
};
const subscriptionTotalAmountClaimableSinceUpdatedAt = (indexSubscriptions)=>{
    return subscriptionTotalAmountDistributedSinceUpdated(indexSubscriptions).sub(subscriptionTotalAmountReceivedSinceUpdated(indexSubscriptions));
};
const getStringCurrentTimeInSeconds = ()=>Math.floor(new Date().getTime() / 1000);
const getSanitizedTimestamp = (timestamp)=>new Date(Number(timestamp.toString()) * 1000);
const calculateAvailableBalance = ({ currentBalance, netFlowRate, currentTimestamp, updatedAtTimestamp, indexSubscriptions })=>{
    return toBN(currentBalance).add(flowedAmountSinceUpdatedAt({
        netFlowRate,
        currentTimestamp,
        updatedAtTimestamp
    })).add(subscriptionTotalAmountReceivedSinceUpdated(indexSubscriptions));
};
const isEthersProvider = (provider)=>!!provider.getNetwork;
const isInjectedWeb3 = (provider)=>!!provider.currentProvider;
const isInjectedEthers = (provider)=>!!provider.provider;
const typeGuard = (obj)=>obj;
const getFlowOperatorId = (sender, flowOperator)=>{
    const encoder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].utils.defaultAbiCoder;
    const encodedData = encoder.encode([
        "string",
        "address",
        "address"
    ], [
        "flowOperator",
        sender,
        flowOperator
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].utils.keccak256(encodedData);
}; //# sourceMappingURL=utils.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/BatchCall.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>BatchCall)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Host.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$Superfluid$2e$json__$28$json$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/Superfluid.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
;
;
;
;
;
const operationTypeStringToTypeMap = new Map([
    [
        "ERC20_APPROVE",
        1
    ],
    [
        "ERC20_TRANSFER_FROM",
        2
    ],
    [
        "SUPERTOKEN_UPGRADE",
        101
    ],
    [
        "SUPERTOKEN_DOWNGRADE",
        102
    ],
    [
        "SUPERFLUID_CALL_AGREEMENT",
        201
    ],
    [
        "CALL_APP_ACTION",
        202
    ]
]);
class BatchCall {
    constructor(options){
        /**
         * Gets the call agreement function arguments.
         * @param callData callData of the function
         * @returns {ethers.utils.Result} call agreement function arguments
         */ this.getCallAgreementFunctionArgs = (callData)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTransactionDescription"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$Superfluid$2e$json__$28$json$29$__["default"].abi, callData).args;
        /**
         * Given an `Operation` object, gets the `OperationStruct` object.
         * @param operation an `Operation` object
         * @param index the index of the `Operation` in the batchCall
         * @returns {Promise<OperationStruct>} OperationStruct object for batchCall
         */ this.getOperationStruct = async (operation, index)=>{
            const operationType = operationTypeStringToTypeMap.get(operation.type);
            const populatedTransaction = await operation.populateTransactionPromise;
            if (!operationType) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "UNSUPPORTED_OPERATION",
                    message: "The operation at index " + index + " is unsupported."
                });
            }
            /* istanbul ignore next */ if (!populatedTransaction.to || !populatedTransaction.data) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "MISSING_TRANSACTION_PROPERTIES",
                    message: "The transaction is missing the to or data property."
                });
            }
            // Handles the Superfluid Call Agreement
            // The only operation which has a target that is not the
            // same as the to property of the transaction.
            if (operation.type === "SUPERFLUID_CALL_AGREEMENT") {
                const encoder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].utils.defaultAbiCoder;
                const functionArgs = this.getCallAgreementFunctionArgs(populatedTransaction.data);
                const data = encoder.encode([
                    "bytes",
                    "bytes"
                ], [
                    functionArgs["callData"],
                    functionArgs["userData"]
                ]);
                return {
                    operationType,
                    target: functionArgs["agreementClass"],
                    data
                };
            }
            // Handles other cases which are not call agreeement operation
            return {
                operationType,
                target: populatedTransaction.to,
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeSigHashFromCallData"])(populatedTransaction.data)
            };
        };
        /**
         * Executes a batch call given the operations on this class.
         * @param signer the signer of the transaction
         * @returns {Promise<ethers.ContractTransaction>} ContractTransaction object
         */ this.exec = async (signer)=>{
            try {
                const operationStructArray = await Promise.all(this.getOperationStructArrayPromises);
                return await this.host.contract.connect(signer).batchCall(operationStructArray);
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "BATCH_CALL_ERROR",
                    message: "There was an error executing your batch call:",
                    cause: err
                });
            }
        };
        /* istanbul ignore next */ // TODO: user signs the transaction they'd like to execute and gives
        // this data to the trusted forwarder to sign
        /**
         * Executes a forward batch call given the operations on this class.
         * @param signer the signer of the transaction
         * @returns {Promise<ethers.ContractTransaction>} ContractTransaction object
         */ this.execForward = async (signer)=>{
            try {
                const operationStructArray = await Promise.all(this.getOperationStructArrayPromises);
                return await this.host.contract.connect(signer).forwardBatchCall(operationStructArray);
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "BATCH_CALL_ERROR",
                    message: "There was an error executing your batch call:",
                    cause: err
                });
            }
        };
        this.options = options;
        this.host = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](options.hostAddress);
    }
    /**
     * Gets an array of `OperationStruct` objects to be passed to batchCall.
     * @returns {Promise<OperationStruct>[]} array of operation struct promises
     */ get getOperationStructArrayPromises() {
        return this.options.operations.map((x, i)=>this.getOperationStruct(x, i));
    }
} //# sourceMappingURL=BatchCall.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ConstantFlowAgreementV1.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>ConstantFlowAgreementV1)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Host.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$IConstantFlowAgreementV1$2e$json__$28$json$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/IConstantFlowAgreementV1.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
;
;
;
;
;
const cfaInterface = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].utils.Interface(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$IConstantFlowAgreementV1$2e$json__$28$json$29$__["default"].abi);
class ConstantFlowAgreementV1 {
    constructor(options){
        /** ### CFA Read Functions ### */ /**
         * Get the details of a flow.
         * @param superToken the superToken of the agreement
         * @param sender the sender of the flow
         * @param receiver the receiver of the flow
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3FlowInfo>} Web3 Flow info object
         */ this.getFlow = async (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedSender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.sender);
            const normalizedReceiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.receiver);
            try {
                const flowData = await this.contract.connect(params.providerOrSigner).getFlow(normalizedToken, normalizedSender, normalizedReceiver);
                return this._sanitizeFlowInfo(flowData);
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "CFAV1_READ",
                    message: "There was an error getting the flow",
                    cause: err
                });
            }
        };
        /**
         * Get the flow info of an account (net flow).
         * @param superToken the superToken of the agreement
         * @param account the account we're querying
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3FlowInfo>} Web3 Flow info object
         */ this.getAccountFlowInfo = async (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.account);
            try {
                const flowData = await this.contract.connect(params.providerOrSigner).getAccountFlowInfo(normalizedToken, normalizedAccount);
                return this._sanitizeFlowInfo(flowData);
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "CFAV1_READ",
                    message: "There was an error getting the account flow information",
                    cause: err
                });
            }
        };
        /**
         * Get the net flow of an account.
         * @param superToken the superToken of the agreement
         * @param account the account we're querying
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<string>} Web3 Flow info object
         */ this.getNetFlow = async (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.account);
            try {
                return (await this.contract.connect(params.providerOrSigner).getNetFlow(normalizedToken, normalizedAccount)).toString();
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "CFAV1_READ",
                    message: "There was an error getting net flow",
                    cause: err
                });
            }
        };
        /**
         * Get flow operator data.
         * @param superToken the superToken of the agreement
         * @param sender the sender
         * @param flowOperator the flowOperator
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3FlowOperatorData>} Web3 Flow info object
         */ this.getFlowOperatorData = async (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedSender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.sender);
            const normalizedFlowOperator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.flowOperator);
            try {
                const flowOperatorData = await this.contract.connect(params.providerOrSigner).getFlowOperatorData(normalizedToken, normalizedSender, normalizedFlowOperator);
                return this._sanitizeFlowOperatorData(flowOperatorData);
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "CFAV1_READ",
                    message: "There was an error getting flow operator data",
                    cause: err
                });
            }
        };
        /**
         * Get flow operator data using the flowOperatorId.
         * @param superToken the superToken of the agreement
         * @param flowOperatorId The keccak256 hash of encoded string "flowOperator", sender and flowOperator
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3FlowOperatorData>} Web3 Flow info object
         */ this.getFlowOperatorDataByID = async (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            try {
                const flowOperatorData = await this.contract.connect(params.providerOrSigner).getFlowOperatorDataByID(normalizedToken, params.flowOperatorId);
                return this._sanitizeFlowOperatorData({
                    ...flowOperatorData,
                    flowOperatorId: params.flowOperatorId
                });
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "CFAV1_READ",
                    message: "There was an error getting flow operator data",
                    cause: err
                });
            }
        };
        /** ### CFA Write Functions ### */ /**
         * Create a flow.
         * @param flowRate The specified flow rate.
         * @param receiver The receiver of the flow.
         * @param superToken The token to be flowed.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.createFlow = (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedReceiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.receiver);
            const callData = cfaInterface.encodeFunctionData("createFlow", [
                normalizedToken,
                normalizedReceiver,
                params.flowRate,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.cfaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Update a flow.
         * @param flowRate The specified flow rate.
         * @param receiver The receiver of the flow.
         * @param superToken The token to be flowed.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.updateFlow = (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedReceiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.receiver);
            const callData = cfaInterface.encodeFunctionData("updateFlow", [
                normalizedToken,
                normalizedReceiver,
                params.flowRate,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.cfaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Delete a flow.
         * @param superToken The token to be flowed.
         * @param sender The sender of the flow.
         * @param receiver The receiver of the flow.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.deleteFlow = (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedSender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.sender);
            const normalizedReceiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.receiver);
            const callData = cfaInterface.encodeFunctionData("deleteFlow", [
                normalizedToken,
                normalizedSender,
                normalizedReceiver,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.cfaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Create a flow as an operator
         * @param flowRate The specified flow rate.
         * @param sender The sender of the flow.
         * @param receiver The receiver of the flow.
         * @param superToken The token to be flowed.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.createFlowByOperator = (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedReceiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.receiver);
            const normalizedSender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.sender);
            const callData = cfaInterface.encodeFunctionData("createFlowByOperator", [
                normalizedToken,
                normalizedSender,
                normalizedReceiver,
                params.flowRate,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.cfaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Update a flow as an operator.
         * @param flowRate The specified flow rate.
         * @param sender The sender of the flow.
         * @param receiver The receiver of the flow.
         * @param superToken The token to be flowed.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.updateFlowByOperator = (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedSender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.sender);
            const normalizedReceiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.receiver);
            const callData = cfaInterface.encodeFunctionData("updateFlowByOperator", [
                normalizedToken,
                normalizedSender,
                normalizedReceiver,
                params.flowRate,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.cfaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Delete a flow as an operator.
         * @param sender The sender of the flow.
         * @param receiver The receiver of the flow.
         * @param superToken The token to be flowed.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.deleteFlowByOperator = (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedSender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.sender);
            const normalizedReceiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.receiver);
            const callData = cfaInterface.encodeFunctionData("deleteFlowByOperator", [
                normalizedToken,
                normalizedSender,
                normalizedReceiver,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.cfaV1Address, callData, params.userData, params.overrides);
        };
        /** ### Private Functions ### */ /**
         * Sanitizes flow info, converting BigNumber to string.
         * @param timestamp last updated timestamp of flow
         * @param flowRate the current flow rate
         * @param deposit the deposit amount
         * @param owedDeposit any owed depsit
         * @returns {IWeb3FlowInfo} sanitized web3 flow info
         */ this._sanitizeFlowInfo = (params)=>{
            return {
                timestamp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSanitizedTimestamp"])(params.timestamp),
                flowRate: params.flowRate.toString(),
                deposit: params.deposit.toString(),
                owedDeposit: params.owedDeposit.toString()
            };
        };
        /**
         * Sanitizes flow operator data, converting BigNumber to string.
         * @param flowOperatorId The keccak256 hash of encoded string "flowOperator", sender and flowOperator
         * @param permissions the permissions
         * @param flowRateAllowance the flow rate allowance granted to the flow operator
         * @returns {IWeb3FlowOperatorData} sanitized web3 flow info
         */ this._sanitizeFlowOperatorData = (params)=>{
            return {
                flowOperatorId: params.flowOperatorId,
                permissions: params.permissions.toString(),
                flowRateAllowance: params.flowRateAllowance.toString()
            };
        };
        this.options = options;
        this.host = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](options.config.hostAddress);
        this.contract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(this.options.config.cfaV1Address, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$IConstantFlowAgreementV1$2e$json__$28$json$29$__["default"].abi);
    }
    /** ### CFA ACL Write Functions (byOperator) ### */ /**
     * Update permissions for a flow operator as a sender.
     * @param superToken The token to be flowed.
     * @param flowOperator The permission grantee address
     * @param permission The permissions to set.
     * @param flowRateAllowance The flowRateAllowance granted to the flow operator.
     * @param userData Extra user data provided.
     * @param overrides ethers overrides object for more control over the transaction sent.
     * @returns {Operation} An instance of Operation which can be executed or batched.
     */ updateFlowOperatorPermissions(params) {
        const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
        const normalizedFlowOperator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.flowOperator);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPermissionsClean"])(params.permissions)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                type: "UNCLEAN_PERMISSIONS",
                message: "The desired permissions are unclean"
            });
        }
        if (Number(params.flowRateAllowance) < 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                type: "NEGATIVE_FLOW_ALLOWANCE",
                message: "No negative flow allowance allowed"
            });
        }
        const callData = cfaInterface.encodeFunctionData("updateFlowOperatorPermissions", [
            normalizedToken,
            normalizedFlowOperator,
            params.permissions,
            params.flowRateAllowance,
            "0x"
        ]);
        return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.cfaV1Address, callData, params.userData, params.overrides);
    }
    /**
     * Give flow operator full control - max flow rate and create/update/delete permissions.
     * @param superToken The token to be flowed.
     * @param flowOperator The permission grantee address
     * @param userData Extra user data provided.
     * @param overrides ethers overrides object for more control over the transaction sent.
     */ authorizeFlowOperatorWithFullControl(params) {
        const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
        const normalizedFlowOperator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.flowOperator);
        const callData = cfaInterface.encodeFunctionData("authorizeFlowOperatorWithFullControl", [
            normalizedToken,
            normalizedFlowOperator,
            "0x"
        ]);
        return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.cfaV1Address, callData, params.userData, params.overrides);
    }
    /**
     * Revoke flow operator control - set flow rate to 0 with no permissions.
     * @param superToken The token to be flowed.
     * @param flowOperator The permission grantee address
     * @param userData Extra user data provided.
     * @param overrides ethers overrides object for more control over the transaction sent.
     */ revokeFlowOperatorWithFullControl(params) {
        const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
        const normalizedFlowOperator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.flowOperator);
        const callData = cfaInterface.encodeFunctionData("revokeFlowOperatorWithFullControl", [
            normalizedToken,
            normalizedFlowOperator,
            "0x"
        ]);
        return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.cfaV1Address, callData, params.userData, params.overrides);
    }
} //# sourceMappingURL=ConstantFlowAgreementV1.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ERC20Token.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>ERC20Token)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Operation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$ERC20WithTokenInfo$2e$json__$28$json$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/ERC20WithTokenInfo.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
;
;
;
;
;
class ERC20Token {
    constructor(address){
        /** ### ERC20 Token Contract Read Functions ### */ /**
         * Returns the allowance the `owner` has granted the `spender`.
         * @param owner the owner who has allotted the allowance
         * @param spender the spender who has received the allowance
         * @param providerOrSigner a provider or signer for executing a web3 call
         * @returns {Promise<string>} the allowance amount
         */ this.allowance = async ({ owner, spender, providerOrSigner })=>{
            const normalizedOwner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(owner);
            const normalizedSpender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(spender);
            try {
                const allowance = await this.contract.connect(providerOrSigner).allowance(normalizedOwner, normalizedSpender);
                return allowance.toString();
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "SUPERTOKEN_READ",
                    message: "There was an error getting allowance",
                    cause: err
                });
            }
        };
        /**
         * Returns the ERC20 balanceOf the `account`, this can't be negative and will just display 0.
         * @param account the account you would like to query
         * @param providerOrSigner a provider or signer for executing a web3 call
         * @returns {Promise<string>} the token balance of `account`
         */ this.balanceOf = async ({ account, providerOrSigner })=>{
            try {
                const normalizedAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(account);
                const balanceOf = await this.contract.connect(providerOrSigner).balanceOf(normalizedAccount);
                return balanceOf.toString();
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "SUPERTOKEN_READ",
                    message: "There was an error getting balanceOf",
                    cause: err
                });
            }
        };
        /**
         * Returns the token name
         * @param providerOrSigner a provider or signer for executing a web3 call
         * @returns {string} the token name
         */ this.name = async ({ providerOrSigner })=>{
            try {
                const name = await this.contract.connect(providerOrSigner).name();
                return name;
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "SUPERTOKEN_READ",
                    message: "There was an error getting name",
                    cause: err
                });
            }
        };
        /**
         * Returns the token symbol
         * @param providerOrSigner a provider or signer for executing a web3 call
         * @returns {string} the token symbol
         */ this.symbol = async ({ providerOrSigner })=>{
            try {
                const symbol = await this.contract.connect(providerOrSigner).symbol();
                return symbol;
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "SUPERTOKEN_READ",
                    message: "There was an error getting symbol",
                    cause: err
                });
            }
        };
        /**
         * Returns the total supply of the token.
         * @param providerOrSigner a provider or signer for executing a web3 call
         * @returns {Promise<string>} the total supply of the token
         */ this.totalSupply = async ({ providerOrSigner })=>{
            try {
                const totalSupply = await this.contract.connect(providerOrSigner).totalSupply();
                return totalSupply.toString();
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "SUPERTOKEN_READ",
                    message: "There was an error getting totalSupply",
                    cause: err
                });
            }
        };
        /** ### ERC20 Token Contract Write Functions ### */ /**
         * Approve `receiver` to spend `amount` tokens.
         * @param receiver The receiver approved.
         * @param amount The amount approved.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.approve = (params)=>{
            const normalizedReceiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.receiver);
            const txn = this.contract.populateTransaction.approve(normalizedReceiver, params.amount, params.overrides || {});
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](txn, "ERC20_APPROVE");
        };
        /**
         * Transfer `receiver` `amount` tokens.
         * @param receiver The receiver of the transfer.
         * @param amount The amount to be transferred.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.transfer = (params)=>{
            const normalizedReceiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.receiver);
            const txn = this.contract.populateTransaction.transfer(normalizedReceiver, params.amount, params.overrides || {});
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](txn, "UNSUPPORTED");
        };
        /**
         * Transfer from `sender` to `receiver` `amount` tokens.
         * @param sender The sender of the transfer.
         * @param receiver The receiver of the transfer.
         * @param amount The amount to be transferred.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.transferFrom = (params)=>{
            const normalizedSender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.sender);
            const normalizedReceiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.receiver);
            const txn = this.contract.populateTransaction.transferFrom(normalizedSender, normalizedReceiver, params.amount, params.overrides || {});
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](txn, "ERC20_TRANSFER_FROM");
        };
        this.address = address;
        this.contract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(this.address, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$ERC20WithTokenInfo$2e$json__$28$json$29$__["default"].abi);
    }
} //# sourceMappingURL=ERC20Token.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Governance.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Governance)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$SuperfluidGovernanceII$2e$json__$28$json$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/SuperfluidGovernanceII.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
;
;
class Governance {
    constructor(govAddress, hostAddress){
        /**
         * Returns the 3Ps config for the specified token (or default) - the liquidation period and patrician period
         * @see https://docs.superfluid.finance/superfluid/sentinels/liquidations-and-toga
         * @param providerOrSigner a provider or signer for executing a web3 call
         * @param token specified governance parameter token
         * @returns {Object} liquidationPeriod and patricianPeriod as strings
         */ this.getPPPConfig = async ({ providerOrSigner, token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].constants.AddressZero })=>{
            const { liquidationPeriod, patricianPeriod } = await this.contract.connect(providerOrSigner).getPPPConfig(this.hostAddress, token);
            return {
                liquidationPeriod: liquidationPeriod.toString(),
                patricianPeriod: patricianPeriod.toString()
            };
        };
        /**
         * Returns the reward address for the specified token (or default)
         * @param providerOrSigner a provider or signer for executing a web3 call
         * @param token specified governance parameter token
         * @returns {string} the reward address
         */ this.getRewardAddress = async ({ providerOrSigner, token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].constants.AddressZero })=>{
            return await this.contract.connect(providerOrSigner).getRewardAddress(this.hostAddress, token);
        };
        /**
         * Returns the minimum deposit for the specified token (or default)
         * @param providerOrSigner a provider or signer for executing a web3 call
         * @param token specified governance parameter token
         * @returns {string} minimum deposit
         */ this.getMinimumDeposit = async ({ providerOrSigner, token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].constants.AddressZero })=>{
            const superTokenMinimumDeposit = await this.contract.connect(providerOrSigner).getSuperTokenMinimumDeposit(this.hostAddress, token);
            return superTokenMinimumDeposit.toString();
        };
        /**
         * Returns the relevant governance parameters
         * @param providerOrSigner a provider or signer for executing a web3 call
         * @param token specified governance parameter token
         * @returns {Object} liquidationPeriod, patricianPeriod, rewardAddress and minimumDeposit
         */ this.getGovernanceParameters = async ({ providerOrSigner, token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].constants.AddressZero })=>{
            const pppPromise = this.getPPPConfig({
                providerOrSigner,
                token
            });
            const rewardPromose = this.getRewardAddress({
                providerOrSigner,
                token
            });
            const minimumDepositPromise = this.getMinimumDeposit({
                providerOrSigner,
                token
            });
            const data = await Promise.all([
                pppPromise,
                rewardPromose,
                minimumDepositPromise
            ]);
            return {
                liquidationPeriod: data[0].liquidationPeriod,
                patricianPeriod: data[0].patricianPeriod,
                rewardAddress: data[1],
                minimumDeposit: data[2]
            };
        };
        this.contract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(govAddress, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$SuperfluidGovernanceII$2e$json__$28$json$29$__["default"].abi);
        this.hostAddress = hostAddress;
    }
} //# sourceMappingURL=Governance.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/InstantDistributionAgreementV1.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>InstantDistributionAgreementV1)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Host.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$IInstantDistributionAgreementV1$2e$json__$28$json$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/IInstantDistributionAgreementV1.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
;
;
;
;
;
const idaInterface = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].utils.Interface(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$IInstantDistributionAgreementV1$2e$json__$28$json$29$__["default"].abi);
class InstantDistributionAgreementV1 {
    constructor(options){
        /** ### IDA Read Functions ### */ /**
         * Get the details of a `Subscription`.
         * @param superToken the superToken of the agreement
         * @param publisher the address of the publisher of the index
         * @param indexId the index id
         * @param subscriber the subscriber's address
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3Subscription>} Web3 Subscription object
         */ this.getSubscription = async (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedPublisher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.publisher);
            const normalizedSubscriber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.subscriber);
            try {
                const subscription = await this.contract.connect(params.providerOrSigner).getSubscription(normalizedToken, normalizedPublisher, params.indexId, normalizedSubscriber);
                return {
                    exist: subscription.exist,
                    approved: subscription.approved,
                    units: subscription.units.toString(),
                    pendingDistribution: subscription.pendingDistribution.toString()
                };
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "IDAV1_READ",
                    message: "There was an error getting the subscription",
                    cause: err
                });
            }
        };
        /**
         * Get the details of an `Index`.
         * @param superToken the superToken of the agreement
         * @param publisher the address of the publisher of the index
         * @param indexId the index id
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3Index>} Web3 Index object
         */ this.getIndex = async (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedPublisher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.publisher);
            try {
                const index = await this.contract.connect(params.providerOrSigner).getIndex(normalizedToken, normalizedPublisher, params.indexId);
                return {
                    exist: index.exist,
                    indexValue: index.indexValue.toString(),
                    totalUnitsApproved: index.totalUnitsApproved.toString(),
                    totalUnitsPending: index.totalUnitsPending.toString()
                };
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "IDAV1_READ",
                    message: "There was an error getting the index",
                    cause: err
                });
            }
        };
        /** ### IDA Write Functions ### */ /**
         * Creates an IDA Index.
         * @param indexId The id of the index.
         * @param superToken The address of the `index` superToken.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.createIndex = (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const callData = idaInterface.encodeFunctionData("createIndex", [
                normalizedToken,
                params.indexId,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.idaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Distributes `amount` of `superToken` to an index
         * @param indexId The id of the index.
         * @param amount The amount of `superToken` to be distributed.
         * @param superToken The superToken to be distributed.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.distribute = (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const callData = idaInterface.encodeFunctionData("distribute", [
                normalizedToken,
                params.indexId,
                params.amount,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.idaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Updates the `indexValue` of an index.
         * @description NOTE: It has the same effect as `distribute`, but is closer to the low level data structure of the index.
         * @param indexId The id of the index.
         * @param indexValue The new indexValue.
         * @param superToken The superToken to be distributed.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.updateIndexValue = (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const callData = idaInterface.encodeFunctionData("updateIndex", [
                normalizedToken,
                params.indexId,
                params.indexValue,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.idaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Updates the `units` allocated to a Subscription.
         * @param indexId The id of the index.
         * @param superToken The superToken of the index.
         * @param subscriber The subscriber address whose units you want to update.
         * @param units The amount of units you want to update to.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.updateSubscriptionUnits = (params)=>{
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedSubscriber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.subscriber);
            const callData = idaInterface.encodeFunctionData("updateSubscription", [
                normalizedToken,
                params.indexId,
                normalizedSubscriber,
                params.units,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.idaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Approves a Subscription, so the Subscriber won't need to claim tokens when the Publisher distributes.
         * @param indexId The id of the index.
         * @param superToken The superToken of the index.
         * @param publisher The publisher of the index you want to approve.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.approveSubscription = (params)=>{
            const normalizedPublisher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.publisher);
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const callData = idaInterface.encodeFunctionData("approveSubscription", [
                normalizedToken,
                normalizedPublisher,
                params.indexId,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.idaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Revokes a Subscription, so the Subscriber will need to claim tokens when the Publisher distributres.
         * @param indexId The id of the index.
         * @param superToken The superToken of the index.
         * @param subscriber The subscriber address whose subscription you want to revoke.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.revokeSubscription = (params)=>{
            const normalizedPublisher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.publisher);
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const callData = idaInterface.encodeFunctionData("revokeSubscription", [
                normalizedToken,
                normalizedPublisher,
                params.indexId,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.idaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Deletes a Subscription by setting the `units` allocated to the Subscriber to 0.
         * @param indexId The id of the index.
         * @param superToken The superToken of the index.
         * @param subscriber The subscriber address whose subscription you want to delete.
         * @param publisher The publisher address of the index you are targetting.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.deleteSubscription = (params)=>{
            const normalizedPublisher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.publisher);
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedSubscriber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.subscriber);
            const callData = idaInterface.encodeFunctionData("deleteSubscription", [
                normalizedToken,
                normalizedPublisher,
                params.indexId,
                normalizedSubscriber,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.idaV1Address, callData, params.userData, params.overrides);
        };
        /**
         * Claims any pending tokens allocated to the Subscription (unapproved).
         * @param indexId The id of the index.
         * @param superToken The superToken of the index.
         * @param subscriber The subscriber address whose subscription you want to delete.
         * @param publisher The publisher address of the index you are targetting.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.claim = (params)=>{
            const normalizedPublisher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.publisher);
            const normalizedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.superToken);
            const normalizedSubscriber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.subscriber);
            const callData = idaInterface.encodeFunctionData("claim", [
                normalizedToken,
                normalizedPublisher,
                params.indexId,
                normalizedSubscriber,
                "0x"
            ]);
            return this.host.populateCallAgreementTxnAndReturnOperation(this.options.config.idaV1Address, callData, params.userData, params.overrides);
        };
        this.options = options;
        this.host = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](options.config.hostAddress);
        this.contract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(this.options.config.idaV1Address, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$IInstantDistributionAgreementV1$2e$json__$28$json$29$__["default"].abi);
    }
} //# sourceMappingURL=InstantDistributionAgreementV1.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ajvValidations.generated.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "validateAccountTokenSnapshotRequest": (()=>validateAccountTokenSnapshotRequest),
    "validateEventRequest": (()=>validateEventRequest),
    "validateIndexRequest": (()=>validateIndexRequest),
    "validateIndexSubscriptionRequest": (()=>validateIndexSubscriptionRequest),
    "validateStreamRequest": (()=>validateStreamRequest),
    "validateSuperTokenRequest": (()=>validateSuperTokenRequest)
});
"use strict";
const validateSuperTokenRequest = validate10;
const schema11 = {
    "$id": "validateSuperTokenRequest",
    "type": "object",
    "additionalProperties": false,
    "properties": {
        "isListed": {
            "type": "boolean",
            "nullable": true
        }
    }
};
function validate10(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
    ;
    let vErrors = null;
    let errors = 0;
    if ("TURBOPACK compile-time truthy", 1) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
            const _errs1 = errors;
            for(const key0 in data){
                if (!(key0 === "isListed")) {
                    validate10.errors = [
                        {
                            instancePath,
                            schemaPath: "#/additionalProperties",
                            keyword: "additionalProperties",
                            params: {
                                additionalProperty: key0
                            },
                            message: "must NOT have additional properties"
                        }
                    ];
                    return false;
                    "TURBOPACK unreachable";
                }
            }
            if ("TURBOPACK compile-time truthy", 1) {
                if (data.isListed !== undefined) {
                    let data0 = data.isListed;
                    if (typeof data0 !== "boolean" && data0 !== null) {
                        validate10.errors = [
                            {
                                instancePath: instancePath + "/isListed",
                                schemaPath: "#/properties/isListed/type",
                                keyword: "type",
                                params: {
                                    type: "boolean"
                                },
                                message: "must be boolean"
                            }
                        ];
                        return false;
                    }
                }
            }
        } else {
            validate10.errors = [
                {
                    instancePath,
                    schemaPath: "#/type",
                    keyword: "type",
                    params: {
                        type: "object"
                    },
                    message: "must be object"
                }
            ];
            return false;
        }
    }
    validate10.errors = vErrors;
    return errors === 0;
}
const validateEventRequest = validate11;
const schema12 = {
    "$id": "validateEventRequest",
    "type": "object",
    "additionalProperties": false,
    "properties": {
        "account": {
            "type": "string",
            "format": "addressOrEmpty",
            "nullable": true
        },
        "timestamp_gt": {
            "type": "number",
            "nullable": true
        }
    }
};
const formats0 = /(^(0x)?[0-9a-fA-F]{40}$)?/;
function validate11(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
    ;
    let vErrors = null;
    let errors = 0;
    if ("TURBOPACK compile-time truthy", 1) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
            const _errs1 = errors;
            for(const key0 in data){
                if (!(key0 === "account" || key0 === "timestamp_gt")) {
                    validate11.errors = [
                        {
                            instancePath,
                            schemaPath: "#/additionalProperties",
                            keyword: "additionalProperties",
                            params: {
                                additionalProperty: key0
                            },
                            message: "must NOT have additional properties"
                        }
                    ];
                    return false;
                    "TURBOPACK unreachable";
                }
            }
            if ("TURBOPACK compile-time truthy", 1) {
                if (data.account !== undefined) {
                    let data0 = data.account;
                    const _errs2 = errors;
                    if (typeof data0 !== "string" && data0 !== null) {
                        validate11.errors = [
                            {
                                instancePath: instancePath + "/account",
                                schemaPath: "#/properties/account/type",
                                keyword: "type",
                                params: {
                                    type: "string"
                                },
                                message: "must be string"
                            }
                        ];
                        return false;
                    }
                    if ("TURBOPACK compile-time truthy", 1) {
                        if ("TURBOPACK compile-time truthy", 1) {
                            if (typeof data0 === "string") {
                                if (!formats0.test(data0)) {
                                    validate11.errors = [
                                        {
                                            instancePath: instancePath + "/account",
                                            schemaPath: "#/properties/account/format",
                                            keyword: "format",
                                            params: {
                                                format: "addressOrEmpty"
                                            },
                                            message: "must match format \"" + "addressOrEmpty" + "\""
                                        }
                                    ];
                                    return false;
                                }
                            }
                        }
                    }
                    var valid0 = _errs2 === errors;
                } else {
                    var valid0 = true;
                }
                if ("TURBOPACK compile-time truthy", 1) {
                    if (data.timestamp_gt !== undefined) {
                        let data1 = data.timestamp_gt;
                        const _errs5 = errors;
                        if (!(typeof data1 == "number" && isFinite(data1)) && data1 !== null) {
                            validate11.errors = [
                                {
                                    instancePath: instancePath + "/timestamp_gt",
                                    schemaPath: "#/properties/timestamp_gt/type",
                                    keyword: "type",
                                    params: {
                                        type: "number"
                                    },
                                    message: "must be number"
                                }
                            ];
                            return false;
                        }
                        var valid0 = _errs5 === errors;
                    } else {
                        var valid0 = true;
                    }
                }
            }
        } else {
            validate11.errors = [
                {
                    instancePath,
                    schemaPath: "#/type",
                    keyword: "type",
                    params: {
                        type: "object"
                    },
                    message: "must be object"
                }
            ];
            return false;
        }
    }
    validate11.errors = vErrors;
    return errors === 0;
}
const validateIndexRequest = validate12;
const schema13 = {
    "$id": "validateIndexRequest",
    "type": "object",
    "additionalProperties": false,
    "properties": {
        "indexId": {
            "type": "string",
            "format": "stringInteger",
            "nullable": true
        },
        "publisher": {
            "type": "string",
            "format": "addressOrEmpty",
            "nullable": true
        },
        "token": {
            "type": "string",
            "format": "addressOrEmpty",
            "nullable": true
        }
    }
};
const formats2 = /\d+/;
function validate12(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
    ;
    let vErrors = null;
    let errors = 0;
    if ("TURBOPACK compile-time truthy", 1) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
            const _errs1 = errors;
            for(const key0 in data){
                if (!(key0 === "indexId" || key0 === "publisher" || key0 === "token")) {
                    validate12.errors = [
                        {
                            instancePath,
                            schemaPath: "#/additionalProperties",
                            keyword: "additionalProperties",
                            params: {
                                additionalProperty: key0
                            },
                            message: "must NOT have additional properties"
                        }
                    ];
                    return false;
                    "TURBOPACK unreachable";
                }
            }
            if ("TURBOPACK compile-time truthy", 1) {
                if (data.indexId !== undefined) {
                    let data0 = data.indexId;
                    const _errs2 = errors;
                    if (typeof data0 !== "string" && data0 !== null) {
                        validate12.errors = [
                            {
                                instancePath: instancePath + "/indexId",
                                schemaPath: "#/properties/indexId/type",
                                keyword: "type",
                                params: {
                                    type: "string"
                                },
                                message: "must be string"
                            }
                        ];
                        return false;
                    }
                    if ("TURBOPACK compile-time truthy", 1) {
                        if ("TURBOPACK compile-time truthy", 1) {
                            if (typeof data0 === "string") {
                                if (!formats2.test(data0)) {
                                    validate12.errors = [
                                        {
                                            instancePath: instancePath + "/indexId",
                                            schemaPath: "#/properties/indexId/format",
                                            keyword: "format",
                                            params: {
                                                format: "stringInteger"
                                            },
                                            message: "must match format \"" + "stringInteger" + "\""
                                        }
                                    ];
                                    return false;
                                }
                            }
                        }
                    }
                    var valid0 = _errs2 === errors;
                } else {
                    var valid0 = true;
                }
                if ("TURBOPACK compile-time truthy", 1) {
                    if (data.publisher !== undefined) {
                        let data1 = data.publisher;
                        const _errs5 = errors;
                        if (typeof data1 !== "string" && data1 !== null) {
                            validate12.errors = [
                                {
                                    instancePath: instancePath + "/publisher",
                                    schemaPath: "#/properties/publisher/type",
                                    keyword: "type",
                                    params: {
                                        type: "string"
                                    },
                                    message: "must be string"
                                }
                            ];
                            return false;
                        }
                        if ("TURBOPACK compile-time truthy", 1) {
                            if ("TURBOPACK compile-time truthy", 1) {
                                if (typeof data1 === "string") {
                                    if (!formats0.test(data1)) {
                                        validate12.errors = [
                                            {
                                                instancePath: instancePath + "/publisher",
                                                schemaPath: "#/properties/publisher/format",
                                                keyword: "format",
                                                params: {
                                                    format: "addressOrEmpty"
                                                },
                                                message: "must match format \"" + "addressOrEmpty" + "\""
                                            }
                                        ];
                                        return false;
                                    }
                                }
                            }
                        }
                        var valid0 = _errs5 === errors;
                    } else {
                        var valid0 = true;
                    }
                    if ("TURBOPACK compile-time truthy", 1) {
                        if (data.token !== undefined) {
                            let data2 = data.token;
                            const _errs8 = errors;
                            if (typeof data2 !== "string" && data2 !== null) {
                                validate12.errors = [
                                    {
                                        instancePath: instancePath + "/token",
                                        schemaPath: "#/properties/token/type",
                                        keyword: "type",
                                        params: {
                                            type: "string"
                                        },
                                        message: "must be string"
                                    }
                                ];
                                return false;
                            }
                            if ("TURBOPACK compile-time truthy", 1) {
                                if ("TURBOPACK compile-time truthy", 1) {
                                    if (typeof data2 === "string") {
                                        if (!formats0.test(data2)) {
                                            validate12.errors = [
                                                {
                                                    instancePath: instancePath + "/token",
                                                    schemaPath: "#/properties/token/format",
                                                    keyword: "format",
                                                    params: {
                                                        format: "addressOrEmpty"
                                                    },
                                                    message: "must match format \"" + "addressOrEmpty" + "\""
                                                }
                                            ];
                                            return false;
                                        }
                                    }
                                }
                            }
                            var valid0 = _errs8 === errors;
                        } else {
                            var valid0 = true;
                        }
                    }
                }
            }
        } else {
            validate12.errors = [
                {
                    instancePath,
                    schemaPath: "#/type",
                    keyword: "type",
                    params: {
                        type: "object"
                    },
                    message: "must be object"
                }
            ];
            return false;
        }
    }
    validate12.errors = vErrors;
    return errors === 0;
}
const validateAccountTokenSnapshotRequest = validate13;
const schema14 = {
    "$id": "validateAccountTokenSnapshotRequest",
    "type": "object",
    "additionalProperties": false,
    "properties": {
        "account": {
            "type": "string",
            "format": "addressOrEmpty",
            "nullable": true
        },
        "token": {
            "type": "string",
            "format": "addressOrEmpty",
            "nullable": true
        }
    }
};
function validate13(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
    ;
    let vErrors = null;
    let errors = 0;
    if ("TURBOPACK compile-time truthy", 1) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
            const _errs1 = errors;
            for(const key0 in data){
                if (!(key0 === "account" || key0 === "token")) {
                    validate13.errors = [
                        {
                            instancePath,
                            schemaPath: "#/additionalProperties",
                            keyword: "additionalProperties",
                            params: {
                                additionalProperty: key0
                            },
                            message: "must NOT have additional properties"
                        }
                    ];
                    return false;
                    "TURBOPACK unreachable";
                }
            }
            if ("TURBOPACK compile-time truthy", 1) {
                if (data.account !== undefined) {
                    let data0 = data.account;
                    const _errs2 = errors;
                    if (typeof data0 !== "string" && data0 !== null) {
                        validate13.errors = [
                            {
                                instancePath: instancePath + "/account",
                                schemaPath: "#/properties/account/type",
                                keyword: "type",
                                params: {
                                    type: "string"
                                },
                                message: "must be string"
                            }
                        ];
                        return false;
                    }
                    if ("TURBOPACK compile-time truthy", 1) {
                        if ("TURBOPACK compile-time truthy", 1) {
                            if (typeof data0 === "string") {
                                if (!formats0.test(data0)) {
                                    validate13.errors = [
                                        {
                                            instancePath: instancePath + "/account",
                                            schemaPath: "#/properties/account/format",
                                            keyword: "format",
                                            params: {
                                                format: "addressOrEmpty"
                                            },
                                            message: "must match format \"" + "addressOrEmpty" + "\""
                                        }
                                    ];
                                    return false;
                                }
                            }
                        }
                    }
                    var valid0 = _errs2 === errors;
                } else {
                    var valid0 = true;
                }
                if ("TURBOPACK compile-time truthy", 1) {
                    if (data.token !== undefined) {
                        let data1 = data.token;
                        const _errs5 = errors;
                        if (typeof data1 !== "string" && data1 !== null) {
                            validate13.errors = [
                                {
                                    instancePath: instancePath + "/token",
                                    schemaPath: "#/properties/token/type",
                                    keyword: "type",
                                    params: {
                                        type: "string"
                                    },
                                    message: "must be string"
                                }
                            ];
                            return false;
                        }
                        if ("TURBOPACK compile-time truthy", 1) {
                            if ("TURBOPACK compile-time truthy", 1) {
                                if (typeof data1 === "string") {
                                    if (!formats0.test(data1)) {
                                        validate13.errors = [
                                            {
                                                instancePath: instancePath + "/token",
                                                schemaPath: "#/properties/token/format",
                                                keyword: "format",
                                                params: {
                                                    format: "addressOrEmpty"
                                                },
                                                message: "must match format \"" + "addressOrEmpty" + "\""
                                            }
                                        ];
                                        return false;
                                    }
                                }
                            }
                        }
                        var valid0 = _errs5 === errors;
                    } else {
                        var valid0 = true;
                    }
                }
            }
        } else {
            validate13.errors = [
                {
                    instancePath,
                    schemaPath: "#/type",
                    keyword: "type",
                    params: {
                        type: "object"
                    },
                    message: "must be object"
                }
            ];
            return false;
        }
    }
    validate13.errors = vErrors;
    return errors === 0;
}
const validateIndexSubscriptionRequest = validate14;
const schema15 = {
    "$id": "validateIndexSubscriptionRequest",
    "type": "object",
    "additionalProperties": false,
    "properties": {
        "subscriber": {
            "type": "string",
            "format": "stringInteger",
            "nullable": true
        },
        "approved": {
            "type": "boolean",
            "nullable": true
        }
    }
};
function validate14(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
    ;
    let vErrors = null;
    let errors = 0;
    if ("TURBOPACK compile-time truthy", 1) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
            const _errs1 = errors;
            for(const key0 in data){
                if (!(key0 === "subscriber" || key0 === "approved")) {
                    validate14.errors = [
                        {
                            instancePath,
                            schemaPath: "#/additionalProperties",
                            keyword: "additionalProperties",
                            params: {
                                additionalProperty: key0
                            },
                            message: "must NOT have additional properties"
                        }
                    ];
                    return false;
                    "TURBOPACK unreachable";
                }
            }
            if ("TURBOPACK compile-time truthy", 1) {
                if (data.subscriber !== undefined) {
                    let data0 = data.subscriber;
                    const _errs2 = errors;
                    if (typeof data0 !== "string" && data0 !== null) {
                        validate14.errors = [
                            {
                                instancePath: instancePath + "/subscriber",
                                schemaPath: "#/properties/subscriber/type",
                                keyword: "type",
                                params: {
                                    type: "string"
                                },
                                message: "must be string"
                            }
                        ];
                        return false;
                    }
                    if ("TURBOPACK compile-time truthy", 1) {
                        if ("TURBOPACK compile-time truthy", 1) {
                            if (typeof data0 === "string") {
                                if (!formats2.test(data0)) {
                                    validate14.errors = [
                                        {
                                            instancePath: instancePath + "/subscriber",
                                            schemaPath: "#/properties/subscriber/format",
                                            keyword: "format",
                                            params: {
                                                format: "stringInteger"
                                            },
                                            message: "must match format \"" + "stringInteger" + "\""
                                        }
                                    ];
                                    return false;
                                }
                            }
                        }
                    }
                    var valid0 = _errs2 === errors;
                } else {
                    var valid0 = true;
                }
                if ("TURBOPACK compile-time truthy", 1) {
                    if (data.approved !== undefined) {
                        let data1 = data.approved;
                        const _errs5 = errors;
                        if (typeof data1 !== "boolean" && data1 !== null) {
                            validate14.errors = [
                                {
                                    instancePath: instancePath + "/approved",
                                    schemaPath: "#/properties/approved/type",
                                    keyword: "type",
                                    params: {
                                        type: "boolean"
                                    },
                                    message: "must be boolean"
                                }
                            ];
                            return false;
                        }
                        var valid0 = _errs5 === errors;
                    } else {
                        var valid0 = true;
                    }
                }
            }
        } else {
            validate14.errors = [
                {
                    instancePath,
                    schemaPath: "#/type",
                    keyword: "type",
                    params: {
                        type: "object"
                    },
                    message: "must be object"
                }
            ];
            return false;
        }
    }
    validate14.errors = vErrors;
    return errors === 0;
}
const validateStreamRequest = validate15;
const schema16 = {
    "$id": "validateStreamRequest",
    "type": "object",
    "additionalProperties": false,
    "properties": {
        "sender": {
            "type": "string",
            "format": "addressOrEmpty",
            "nullable": true
        },
        "receiver": {
            "type": "string",
            "format": "addressOrEmpty",
            "nullable": true
        },
        "token": {
            "type": "string",
            "format": "addressOrEmpty",
            "nullable": true
        }
    }
};
function validate15(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
    ;
    let vErrors = null;
    let errors = 0;
    if ("TURBOPACK compile-time truthy", 1) {
        if (data && typeof data == "object" && !Array.isArray(data)) {
            const _errs1 = errors;
            for(const key0 in data){
                if (!(key0 === "sender" || key0 === "receiver" || key0 === "token")) {
                    validate15.errors = [
                        {
                            instancePath,
                            schemaPath: "#/additionalProperties",
                            keyword: "additionalProperties",
                            params: {
                                additionalProperty: key0
                            },
                            message: "must NOT have additional properties"
                        }
                    ];
                    return false;
                    "TURBOPACK unreachable";
                }
            }
            if ("TURBOPACK compile-time truthy", 1) {
                if (data.sender !== undefined) {
                    let data0 = data.sender;
                    const _errs2 = errors;
                    if (typeof data0 !== "string" && data0 !== null) {
                        validate15.errors = [
                            {
                                instancePath: instancePath + "/sender",
                                schemaPath: "#/properties/sender/type",
                                keyword: "type",
                                params: {
                                    type: "string"
                                },
                                message: "must be string"
                            }
                        ];
                        return false;
                    }
                    if ("TURBOPACK compile-time truthy", 1) {
                        if ("TURBOPACK compile-time truthy", 1) {
                            if (typeof data0 === "string") {
                                if (!formats0.test(data0)) {
                                    validate15.errors = [
                                        {
                                            instancePath: instancePath + "/sender",
                                            schemaPath: "#/properties/sender/format",
                                            keyword: "format",
                                            params: {
                                                format: "addressOrEmpty"
                                            },
                                            message: "must match format \"" + "addressOrEmpty" + "\""
                                        }
                                    ];
                                    return false;
                                }
                            }
                        }
                    }
                    var valid0 = _errs2 === errors;
                } else {
                    var valid0 = true;
                }
                if ("TURBOPACK compile-time truthy", 1) {
                    if (data.receiver !== undefined) {
                        let data1 = data.receiver;
                        const _errs5 = errors;
                        if (typeof data1 !== "string" && data1 !== null) {
                            validate15.errors = [
                                {
                                    instancePath: instancePath + "/receiver",
                                    schemaPath: "#/properties/receiver/type",
                                    keyword: "type",
                                    params: {
                                        type: "string"
                                    },
                                    message: "must be string"
                                }
                            ];
                            return false;
                        }
                        if ("TURBOPACK compile-time truthy", 1) {
                            if ("TURBOPACK compile-time truthy", 1) {
                                if (typeof data1 === "string") {
                                    if (!formats0.test(data1)) {
                                        validate15.errors = [
                                            {
                                                instancePath: instancePath + "/receiver",
                                                schemaPath: "#/properties/receiver/format",
                                                keyword: "format",
                                                params: {
                                                    format: "addressOrEmpty"
                                                },
                                                message: "must match format \"" + "addressOrEmpty" + "\""
                                            }
                                        ];
                                        return false;
                                    }
                                }
                            }
                        }
                        var valid0 = _errs5 === errors;
                    } else {
                        var valid0 = true;
                    }
                    if ("TURBOPACK compile-time truthy", 1) {
                        if (data.token !== undefined) {
                            let data2 = data.token;
                            const _errs8 = errors;
                            if (typeof data2 !== "string" && data2 !== null) {
                                validate15.errors = [
                                    {
                                        instancePath: instancePath + "/token",
                                        schemaPath: "#/properties/token/type",
                                        keyword: "type",
                                        params: {
                                            type: "string"
                                        },
                                        message: "must be string"
                                    }
                                ];
                                return false;
                            }
                            if ("TURBOPACK compile-time truthy", 1) {
                                if ("TURBOPACK compile-time truthy", 1) {
                                    if (typeof data2 === "string") {
                                        if (!formats0.test(data2)) {
                                            validate15.errors = [
                                                {
                                                    instancePath: instancePath + "/token",
                                                    schemaPath: "#/properties/token/format",
                                                    keyword: "format",
                                                    params: {
                                                        format: "addressOrEmpty"
                                                    },
                                                    message: "must match format \"" + "addressOrEmpty" + "\""
                                                }
                                            ];
                                            return false;
                                        }
                                    }
                                }
                            }
                            var valid0 = _errs8 === errors;
                        } else {
                            var valid0 = true;
                        }
                    }
                }
            }
        } else {
            validate15.errors = [
                {
                    instancePath,
                    schemaPath: "#/type",
                    keyword: "type",
                    params: {
                        type: "object"
                    },
                    message: "must be object"
                }
            ];
            return false;
        }
    }
    validate15.errors = vErrors;
    return errors === 0;
} //# sourceMappingURL=ajvValidations.generated.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/events.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "FlowUpdateType": (()=>FlowUpdateType)
});
var FlowUpdateType;
(function(FlowUpdateType) {
    FlowUpdateType[FlowUpdateType["Create"] = 0] = "Create";
    FlowUpdateType[FlowUpdateType["Update"] = 1] = "Update";
    FlowUpdateType[FlowUpdateType["Terminate"] = 2] = "Terminate";
})(FlowUpdateType || (FlowUpdateType = {})); //# sourceMappingURL=events.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/mapGetAllEventsQueryEvents.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "mapGetAllEventsQueryEvents": (()=>mapGetAllEventsQueryEvents)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/events.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)");
;
;
const mapGetAllEventsQueryEvents = (queryEvents)=>{
    return queryEvents.map((x)=>{
        switch(x.__typename){
            case "AppRegisteredEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "AppRegistered",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    app: x.app
                });
            case "AgreementClassRegisteredEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "AgreementClassRegistered",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    agreementType: x.agreementType,
                    code: x.code
                });
            case "AgreementClassUpdatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "AgreementClassUpdated",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    agreementType: x.agreementType,
                    code: x.code
                });
            case "AgreementLiquidatedByEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "AgreementLiquidatedBy",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    agreementClass: x.agreementClass,
                    agreementId: x.agreementId,
                    bailoutAmount: x.bailoutAmount,
                    bondAccount: x.bondAccount,
                    liquidatorAccount: x.liquidatorAccount,
                    penaltyAccount: x.penaltyAccount,
                    rewardAmount: x.rewardAmount,
                    token: x.token
                });
            case "AgreementLiquidatedV2Event":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "AgreementLiquidatedV2",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    liquidatorAccount: x.liquidatorAccount,
                    agreementClass: x.agreementClass,
                    agreementId: x.agreementId,
                    targetAccount: x.targetAccount,
                    rewardAmountReceiver: x.rewardAmountReceiver,
                    rewardAmount: x.rewardAmount,
                    targetAccountBalanceDelta: x.targetAccountBalanceDelta,
                    version: x.version,
                    liquidationType: x.liquidationType,
                    // TO BE DEPRECATED in v2 endpoint - use rewardAmountReceiver instead
                    rewardAccount: x.rewardAccount
                });
            case "BurnedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "Burned",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    amount: x.amount,
                    data: x.data,
                    from: x.from,
                    operator: x.operator,
                    token: x.token,
                    operatorData: x.operatorData
                });
            case "CFAv1LiquidationPeriodChangedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "CFAv1LiquidationPeriodChanged",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    host: x.host,
                    governanceAddress: x.governanceAddress,
                    isKeySet: x.isKeySet,
                    liquidationPeriod: Number(x.liquidationPeriod),
                    superToken: x.superToken
                });
            case "ConfigChangedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "ConfigChanged",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    host: x.host,
                    governanceAddress: x.governanceAddress,
                    isKeySet: x.isKeySet,
                    key: x.key,
                    superToken: x.superToken,
                    value: x.value
                });
            case "CustomSuperTokenCreatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "CustomSuperTokenCreated",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token
                });
            case "FlowUpdatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "FlowUpdated",
                    type: mapNumberToFlowUpdateType(x.type),
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    flowRate: x.flowRate,
                    receiver: x.receiver,
                    sender: x.sender,
                    flowOperator: x.flowOperator,
                    deposit: x.deposit
                });
            case "FlowOperatorUpdatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "FlowOperatorUpdated",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    sender: x.sender,
                    permissions: x.permissions,
                    flowRateAllowance: x.flowRateAllowance
                });
            case "GovernanceReplacedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "GovernanceReplaced",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    oldGovernance: x.oldGovernance,
                    newGovernance: x.newGovernance
                });
            case "IndexCreatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "IndexCreated",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    indexId: x.indexId,
                    publisher: x.publisher,
                    userData: x.userData
                });
            case "IndexDistributionClaimedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "IndexDistributionClaimed",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    amount: x.amount,
                    indexId: x.indexId,
                    publisher: x.publisher,
                    subscriber: x.subscriber
                });
            case "IndexSubscribedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "IndexSubscribed",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    indexId: x.indexId,
                    publisher: x.publisher,
                    subscriber: x.subscriber
                });
            case "IndexUnitsUpdatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "IndexUnitsUpdated",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    indexId: x.indexId,
                    publisher: x.publisher,
                    subscriber: x.subscriber,
                    units: x.units,
                    oldUnits: x.oldUnits,
                    userData: x.userData
                });
            case "IndexUnsubscribedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "IndexUnsubscribed",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    indexId: x.indexId,
                    publisher: x.publisher,
                    subscriber: x.subscriber,
                    userData: x.userData
                });
            case "IndexUpdatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "IndexUpdated",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    indexId: x.indexId,
                    newIndexValue: x.newIndexValue,
                    oldIndexValue: x.oldIndexValue,
                    publisher: x.publisher,
                    totalUnitsApproved: x.totalUnitsApproved,
                    totalUnitsPending: x.totalUnitsPending,
                    userData: x.userData
                });
            case "JailEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "Jail",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    app: x.app,
                    reason: x.reason
                });
            case "MintedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "Minted",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    operator: x.operator,
                    to: x.to,
                    amount: x.amount,
                    data: x.data,
                    token: x.token,
                    operatorData: x.operatorData
                });
            case "RewardAddressChangedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "RewardAddressChanged",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    host: x.host,
                    governanceAddress: x.governanceAddress,
                    superToken: x.superToken,
                    isKeySet: x.isKeySet,
                    rewardAddress: x.rewardAddress
                });
            case "RoleAdminChangedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "RoleAdminChanged",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    role: x.role,
                    previousAdminRole: x.previousAdminRole,
                    newAdminRole: x.newAdminRole
                });
            case "RoleGrantedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "RoleGranted",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    role: x.role,
                    account: x.account,
                    sender: x.sender
                });
            case "RoleRevokedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "RoleRevoked",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    role: x.role,
                    account: x.account,
                    sender: x.sender
                });
            case "SetEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "Set",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    hashedName: x.hashedName,
                    targetAddress: x.target,
                    resolverEntry: x.resolverEntry.id
                });
            case "SentEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "Sent",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    operator: x.operator,
                    to: x.to,
                    amount: x.amount,
                    data: x.data,
                    token: x.token,
                    operatorData: x.operatorData
                });
            case "SubscriptionApprovedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "SubscriptionApproved",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    subscriber: x.subscriber,
                    publisher: x.publisher,
                    indexId: x.indexId,
                    userData: x.userData,
                    subscription: x.subscription.id
                });
            case "SubscriptionDistributionClaimedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "SubscriptionDistributionClaimed",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    subscriber: x.subscriber,
                    publisher: x.publisher,
                    indexId: x.indexId,
                    amount: x.amount,
                    subscription: x.subscription.id
                });
            case "SubscriptionRevokedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "SubscriptionRevoked",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    subscriber: x.subscriber,
                    publisher: x.publisher,
                    indexId: x.indexId,
                    userData: x.userData,
                    subscription: x.subscription.id
                });
            case "SubscriptionUnitsUpdatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "SubscriptionUnitsUpdated",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    subscriber: x.subscriber,
                    publisher: x.publisher,
                    indexId: x.indexId,
                    units: x.units,
                    userData: x.userData,
                    subscription: x.subscription.id
                });
            case "SuperTokenCreatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "SuperTokenCreated",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token
                });
            case "SuperTokenFactoryUpdatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "SuperTokenFactoryUpdated",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    newFactory: x.newFactory
                });
            case "SuperTokenLogicCreatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "SuperTokenLogicCreated",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    tokenLogic: x.tokenLogic
                });
            case "SuperTokenLogicUpdatedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "SuperTokenLogicUpdated",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    token: x.token,
                    code: x.code
                });
            case "PPPConfigurationChangedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "PPPConfigurationChanged",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    host: x.host,
                    governanceAddress: x.governanceAddress,
                    superToken: x.superToken,
                    isKeySet: x.isKeySet,
                    liquidationPeriod: x.liquidationPeriod,
                    patricianPeriod: x.patricianPeriod
                });
            case "TokenDowngradedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "TokenDowngraded",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    amount: x.amount,
                    token: x.token,
                    account: x.account.id
                });
            case "TokenUpgradedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "TokenUpgraded",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    amount: x.amount,
                    token: x.token,
                    account: x.account.id
                });
            case "TransferEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "Transfer",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    from: x.from.id,
                    to: x.to.id,
                    token: x.token,
                    value: x.value
                });
            case "TrustedForwarderChangedEvent":
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "TrustedForwarderChanged",
                    id: x.id,
                    blockNumber: Number(x.blockNumber),
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: Number(x.order),
                    timestamp: Number(x.timestamp),
                    logIndex: Number(x.logIndex),
                    host: x.host,
                    governanceAddress: x.governanceAddress,
                    superToken: x.superToken,
                    isKeySet: x.isKeySet,
                    forwarder: x.forwarder,
                    enabled: x.enabled
                });
            default:
                console.warn("An unknown event was detected which couldn't be mapped. Please update to the latest version of @superfluid-finance/sdk-core.");
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    name: "_Unknown",
                    id: x.id,
                    blockNumber: x.blockNumber,
                    transactionHash: x.transactionHash,
                    gasPrice: x.gasPrice,
                    order: x.order,
                    timestamp: x.timestamp,
                    logIndex: x.logIndex
                });
        }
    });
};
const mapNumberToFlowUpdateType = (type)=>{
    if (type === 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.FlowUpdateType.Create;
    } else if (type === 1) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.FlowUpdateType.Update;
    } else if (type === 2) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.FlowUpdateType.Terminate;
    } else {
        throw Error(`Mapping error: unknown flow update type ([${type}]).`);
    }
}; //# sourceMappingURL=mapGetAllEventsQueryEvents.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/pagination.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Factory function to create a {@link PagedResult}.
 * @param dataPlusOne Subgraph queries are executed with one extra result to get which is over the {@link Paging} `take` amount.
 * @param paging
 */ __turbopack_esm__({
    "createLastIdPaging": (()=>createLastIdPaging),
    "createPageNumberPaging": (()=>createPageNumberPaging),
    "createPagedResult": (()=>createPagedResult),
    "createSkipPaging": (()=>createSkipPaging),
    "isAllPaging": (()=>isAllPaging),
    "isLastIdPaging": (()=>isLastIdPaging),
    "isPageNumberPaging": (()=>isPageNumberPaging),
    "isSkipPaging": (()=>isSkipPaging),
    "nextLastIdPaging": (()=>nextLastIdPaging),
    "nextPageNumberPaging": (()=>nextPageNumberPaging),
    "nextSkipPaging": (()=>nextSkipPaging),
    "takePlusOne": (()=>takePlusOne)
});
const createPagedResult = (dataPlusOne, paging)=>{
    var _a;
    const hasNextPage = dataPlusOne.length > paging.take;
    const data = dataPlusOne.slice(0, paging.take);
    const lastId = (_a = data.slice(-1)[0]) === null || _a === void 0 ? void 0 : _a.id;
    return {
        paging: {
            skip: paging.skip,
            take: paging.take
        },
        nextPaging: hasNextPage ? isSkipPaging(paging) ? nextSkipPaging(paging) : isLastIdPaging(paging) ? nextLastIdPaging(paging, lastId) : isPageNumberPaging(paging) ? nextPageNumberPaging(paging) : undefined : undefined,
        data: data,
        items: data
    };
};
function isSkipPaging(paging) {
    return (paging === null || paging === void 0 ? void 0 : paging.skip) !== undefined;
}
function isPageNumberPaging(paging) {
    return (paging === null || paging === void 0 ? void 0 : paging.pageNumber) !== undefined;
}
function isLastIdPaging(paging) {
    return (paging === null || paging === void 0 ? void 0 : paging.lastId) !== undefined;
}
function isAllPaging(paging) {
    return paging !== undefined && paging.skip === undefined && paging.lastId === undefined && paging.take === Infinity;
}
const createSkipPaging = ({ skip = 0, take = 100 } = {})=>({
        skip: skip,
        take: take
    });
const createPageNumberPaging = ({ pageNumber = 1, take = 100 } = {})=>({
        take: take,
        pageNumber: pageNumber
    });
const createLastIdPaging = ({ lastId = "", take = 100 } = {})=>({
        take: take,
        lastId: lastId
    });
const nextSkipPaging = (paging)=>({
        skip: paging.skip + paging.take,
        take: paging.take
    });
const nextPageNumberPaging = (paging)=>({
        pageNumber: paging.pageNumber + 1,
        take: paging.take
    });
const nextLastIdPaging = (paging, nextLastId)=>({
        take: paging.take,
        lastId: nextLastId
    });
const takePlusOne = (paging)=>{
    return paging.take + 1;
}; //# sourceMappingURL=pagination.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Query.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Query),
    "listAllResults": (()=>listAllResults)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ajvValidations$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ajvValidations.generated.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/mapGetAllEventsQueryEvents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/pagination.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$SubgraphClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/SubgraphClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getAccountTokenSnapshots$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getAccountTokenSnapshots.generated.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getAllEvents$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getAllEvents.generated.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getIndexSubscriptions$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getIndexSubscriptions.generated.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getIndexes$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getIndexes.generated.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getStreams$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getStreams.generated.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getTokens$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/queries/getTokens.generated.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
class Query {
    constructor(options){
        this.listAllSuperTokens = async (filter, paging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSkipPaging"])(), ordering = {
            orderBy: "createdAtBlockNumber",
            orderDirection: "desc"
        })=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ajvValidations$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateSuperTokenRequest"])(filter);
            const response = await this.subgraphClient.request(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getTokens$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetTokensDocument"], {
                where: {
                    isListed: filter.isListed,
                    isSuperToken: true,
                    id_gt: paging.lastId
                },
                orderBy: ordering === null || ordering === void 0 ? void 0 : ordering.orderBy,
                orderDirection: ordering === null || ordering === void 0 ? void 0 : ordering.orderDirection,
                first: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takePlusOne"])(paging),
                skip: paging.skip
            });
            const mappedResult = response.result.map((x)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    ...x,
                    createdAtTimestamp: Number(x.createdAtTimestamp),
                    createdAtBlockNumber: Number(x.createdAtBlockNumber)
                }));
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPagedResult"])(mappedResult, paging);
        };
        this.listIndexes = async (filter, paging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSkipPaging"])(), ordering = {
            orderBy: "createdAtBlockNumber",
            orderDirection: "desc"
        })=>{
            var _a, _b;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ajvValidations$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateIndexRequest"])(filter);
            const response = await this.subgraphClient.request(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getIndexes$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetIndexesDocument"], {
                where: {
                    indexId: filter.indexId,
                    publisher: (_a = filter.publisher) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                    token: (_b = filter.token) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
                    id_gt: paging.lastId
                },
                orderBy: ordering === null || ordering === void 0 ? void 0 : ordering.orderBy,
                orderDirection: ordering === null || ordering === void 0 ? void 0 : ordering.orderDirection,
                first: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takePlusOne"])(paging),
                skip: paging.skip
            });
            const mappedResult = response.result.map((x)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    ...x,
                    publisher: x.publisher.id,
                    createdAtTimestamp: Number(x.createdAtTimestamp),
                    createdAtBlockNumber: Number(x.createdAtBlockNumber),
                    updatedAtTimestamp: Number(x.updatedAtTimestamp),
                    updatedAtBlockNumber: Number(x.updatedAtBlockNumber),
                    token: {
                        ...x.token,
                        createdAtTimestamp: Number(x.token.createdAtTimestamp),
                        createdAtBlockNumber: Number(x.token.createdAtBlockNumber)
                    }
                }));
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPagedResult"])(mappedResult, paging);
        };
        this.listIndexSubscriptions = async (filter, paging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSkipPaging"])(), ordering = {
            orderBy: "createdAtBlockNumber",
            orderDirection: "desc"
        })=>{
            var _a;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ajvValidations$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateIndexSubscriptionRequest"])(filter);
            const response = await this.subgraphClient.request(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getIndexSubscriptions$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetIndexSubscriptionsDocument"], {
                where: {
                    subscriber: (_a = filter.subscriber) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                    approved: filter.approved,
                    id_gt: paging.lastId
                },
                orderBy: ordering === null || ordering === void 0 ? void 0 : ordering.orderBy,
                orderDirection: ordering === null || ordering === void 0 ? void 0 : ordering.orderDirection,
                first: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takePlusOne"])(paging),
                skip: paging.skip
            });
            const mappedResult = response.result.map((x)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    ...x,
                    subscriber: x.subscriber.id,
                    createdAtTimestamp: Number(x.createdAtTimestamp),
                    createdAtBlockNumber: Number(x.createdAtBlockNumber),
                    updatedAtTimestamp: Number(x.updatedAtTimestamp),
                    updatedAtBlockNumber: Number(x.updatedAtBlockNumber),
                    index: {
                        ...x.index,
                        token: {
                            ...x.index.token,
                            createdAtTimestamp: Number(x.index.token.createdAtTimestamp),
                            createdAtBlockNumber: Number(x.index.token.createdAtBlockNumber)
                        }
                    }
                }));
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPagedResult"])(mappedResult, paging);
        };
        this.listStreams = async (filter, paging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSkipPaging"])(), ordering = {
            orderBy: "createdAtBlockNumber",
            orderDirection: "desc"
        })=>{
            var _a, _b, _c;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ajvValidations$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateStreamRequest"])(filter);
            const response = await this.subgraphClient.request(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getStreams$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetStreamsDocument"], {
                where: {
                    sender: (_a = filter.sender) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                    receiver: (_b = filter.receiver) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
                    token: (_c = filter.token) === null || _c === void 0 ? void 0 : _c.toLowerCase(),
                    id_gt: paging.lastId
                },
                orderBy: ordering === null || ordering === void 0 ? void 0 : ordering.orderBy,
                orderDirection: ordering === null || ordering === void 0 ? void 0 : ordering.orderDirection,
                first: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takePlusOne"])(paging),
                skip: paging.skip
            });
            const mappedResult = response.result.map((x)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    ...x,
                    sender: x.sender.id,
                    receiver: x.receiver.id,
                    createdAtTimestamp: Number(x.createdAtTimestamp),
                    createdAtBlockNumber: Number(x.createdAtBlockNumber),
                    updatedAtTimestamp: Number(x.updatedAtTimestamp),
                    updatedAtBlockNumber: Number(x.updatedAtBlockNumber),
                    token: {
                        ...x.token,
                        createdAtTimestamp: Number(x.token.createdAtTimestamp),
                        createdAtBlockNumber: Number(x.token.createdAtBlockNumber)
                    },
                    flowUpdatedEvents: x.flowUpdatedEvents.map((y)=>({
                            ...y,
                            blockNumber: Number(y.blockNumber),
                            timestamp: Number(y.timestamp)
                        }))
                }));
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPagedResult"])(mappedResult, paging);
        };
        this.listUserInteractedSuperTokens = async (filter, paging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSkipPaging"])(), ordering = {
            orderBy: "updatedAtBlockNumber",
            orderDirection: "desc"
        })=>{
            var _a, _b;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ajvValidations$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateAccountTokenSnapshotRequest"])(filter);
            const response = await this.subgraphClient.request(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getAccountTokenSnapshots$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetAccountTokenSnapshotsDocument"], {
                where: {
                    account: (_a = filter.account) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                    token: (_b = filter.token) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
                    id_gt: paging.lastId
                },
                orderBy: ordering === null || ordering === void 0 ? void 0 : ordering.orderBy,
                orderDirection: ordering === null || ordering === void 0 ? void 0 : ordering.orderDirection,
                first: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takePlusOne"])(paging),
                skip: paging.skip
            });
            const mappedResult = response.result.map((x)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])({
                    ...x,
                    account: x.account.id,
                    updatedAtTimestamp: Number(x.updatedAtTimestamp),
                    updatedAtBlockNumber: Number(x.updatedAtBlockNumber),
                    token: {
                        ...x.token,
                        createdAtTimestamp: Number(x.token.createdAtTimestamp),
                        createdAtBlockNumber: Number(x.token.createdAtBlockNumber)
                    }
                }));
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPagedResult"])(mappedResult, paging);
        };
        this.listEvents = async (filter, paging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSkipPaging"])(), ordering = {
            orderBy: "blockNumber",
            orderDirection: "desc"
        })=>{
            var _a, _b;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ajvValidations$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateEventRequest"])(filter);
            const response = await this.subgraphClient.request(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$queries$2f$getAllEvents$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetAllEventsDocument"], {
                orderBy: ordering === null || ordering === void 0 ? void 0 : ordering.orderBy,
                orderDirection: ordering === null || ordering === void 0 ? void 0 : ordering.orderDirection,
                where: {
                    addresses_contains: filter.account ? [
                        (_a = filter.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()
                    ] : undefined,
                    timestamp_gt: (_b = filter.timestamp_gt) === null || _b === void 0 ? void 0 : _b.toString(),
                    id_gt: paging.lastId
                },
                first: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takePlusOne"])(paging),
                skip: paging.skip
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPagedResult"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$mapGetAllEventsQueryEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapGetAllEventsQueryEvents"])(response.events), paging);
        };
        this.options = options;
        this.subgraphClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$SubgraphClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubgraphClient"](this.options.customSubgraphQueriesEndpoint);
    }
    // TODO(KK): error callback?
    // TODO(KK): retries?
    // TODO(KK): tests
    on(callback, ms, account, timeout) {
        if (ms < 1000) throw Error("Let's not go crazy with the queries...");
        // Account for the fact that Subgraph has lag and will insert events with the timestamp of the event from blockchain.
        const clockSkew = 25000;
        // Convert millisecond-based time to second-based time (which Subgraph uses).
        let eventQueryTimestamp = Math.floor((new Date().getTime() - clockSkew) / 1000);
        let isUnsubscribed = false;
        const unsubscribe = ()=>{
            isUnsubscribed = true;
        };
        const pollingStep = async ()=>{
            if (isUnsubscribed) {
                return;
            }
            const allEvents = await listAllResults((paging)=>this.listEvents({
                    account: account,
                    timestamp_gt: eventQueryTimestamp
                }, paging, {
                    orderBy: "timestamp",
                    orderDirection: "asc"
                }));
            // Filter next events by last timestamp of an event.
            // NOTE: Make sure to order events by timestamp in ascending order.
            const lastEvent = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].last(allEvents);
            if (lastEvent) {
                callback(allEvents, unsubscribe);
                // Next event polling is done for events that have a timestamp later than the current latest event.
                eventQueryTimestamp = lastEvent.timestamp;
            }
            // This solution sets the interval based on last query returning, opposed to not taking request-response cycles into account at all.
            // This solution is more friendly to the Subgraph & more effective resource-wise with slow internet.
            return setTimeout(()=>{
                // Fire and forget
                pollingStep();
            }, ms);
        };
        if (timeout) {
            setTimeout(()=>{
                unsubscribe();
            }, timeout);
        }
        // Fire and forget
        pollingStep();
        return unsubscribe;
    }
}
const listAllResults = async (pagedQuery)=>{
    const listAllRecursively = async (paging)=>{
        const pagedResult = await pagedQuery(paging);
        if (!pagedResult.nextPaging) return pagedResult.data;
        const nextResults = await listAllRecursively(pagedResult.nextPaging);
        return pagedResult.data.concat(nextResults);
    };
    return listAllRecursively((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLastIdPaging"])({
        take: 999
    }));
}; //# sourceMappingURL=Query.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/frameworkHelpers.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "getNetworkName": (()=>getNetworkName),
    "getSubgraphQueriesEndpoint": (()=>getSubgraphQueriesEndpoint),
    "validateFrameworkConstructorOptions": (()=>validateFrameworkConstructorOptions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)");
;
;
;
const validateFrameworkConstructorOptions = (options)=>{
    if (!options.chainId) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
            type: "FRAMEWORK_INITIALIZATION",
            message: "You must input chainId."
        });
    }
    if (!options.provider) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
            type: "FRAMEWORK_INITIALIZATION",
            message: "You must pass in a provider, an injected web3.js or ethers.js instance when initializing the framework."
        });
    }
    // if the user inputs a chainId that isn't part of the resolver
    // that is, an unsupported network/chain
    if (options.chainId != null && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chainIds"].includes(options.chainId)) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNullOrEmpty"])(options.resolverAddress)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                type: "FRAMEWORK_INITIALIZATION",
                message: "You must input your own resolver address if you use an unsupported network."
            });
        }
    }
};
const getSubgraphQueriesEndpoint = (options)=>{
    const resolverData = options.chainId ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chainIdToResolverDataMap"].get(options.chainId) : null;
    if (resolverData) {
        return resolverData.subgraphAPIEndpoint;
    }
    return ""; // return empty string
};
const getNetworkName = (options)=>{
    var _a;
    return (options.chainId ? (_a = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chainIdToResolverDataMap"].get(options.chainId)) === null || _a === void 0 ? void 0 : _a.networkName : undefined) || "custom";
}; //# sourceMappingURL=frameworkHelpers.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SuperToken.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "NativeAssetSuperToken": (()=>NativeAssetSuperToken),
    "PureSuperToken": (()=>PureSuperToken),
    "WrapperSuperToken": (()=>WrapperSuperToken),
    "default": (()=>SuperToken)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ConstantFlowAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ConstantFlowAgreementV1.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ERC20Token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ERC20Token.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Governance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Governance.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$InstantDistributionAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/InstantDistributionAgreementV1.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Operation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$ISETH$2e$json__$28$json$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/ISETH.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$SuperToken$2e$json__$28$json$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/SuperToken.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$frameworkHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/frameworkHelpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
var _a;
;
;
;
;
;
;
;
;
;
;
;
;
class SuperToken extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ERC20Token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] {
    constructor(options, settings){
        // initialize ERC20 token functions here
        super(settings.address);
        /** ### SuperToken Contract Read Functions ### */ /**
         * Returns the real time balance of `address`.
         * @param account the target address
         * @param timestamp the timestamp you'd like to see the data
         * @param providerOrSigner a provider or signer for executing a web3 call
         * @returns {Promise<IWeb3RealTimeBalanceOf>} real time balance of data
         */ this.realtimeBalanceOf = async ({ providerOrSigner, account, timestamp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStringCurrentTimeInSeconds"])() })=>{
            const normalizedAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(account);
            try {
                const realtimeBalanceOf = await this.contract.connect(providerOrSigner).realtimeBalanceOf(normalizedAccount, timestamp);
                return {
                    availableBalance: realtimeBalanceOf.availableBalance.toString(),
                    deposit: realtimeBalanceOf.deposit.toString(),
                    owedDeposit: realtimeBalanceOf.owedDeposit.toString(),
                    timestamp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSanitizedTimestamp"])(timestamp)
                };
            } catch (err) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "SUPERTOKEN_READ",
                    message: "There was an error getting realtimeBalanceOf",
                    cause: err
                });
            }
        };
        /** ### CFA Read Functions ### */ /**
         * Get the details of a flow.
         * @param sender the sender of the flow
         * @param receiver the receiver of the flow
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3FlowInfo>} Web3 Flow info object
         */ this.getFlow = async (params)=>{
            return await this.cfaV1.getFlow({
                superToken: this.settings.address,
                sender: params.sender,
                receiver: params.receiver,
                providerOrSigner: params.providerOrSigner
            });
        };
        /**
         * Get the flow info of an account (net flow).
         * @param account the account we're querying
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3FlowInfo>} Web3 Flow info object
         */ this.getAccountFlowInfo = async (params)=>{
            return await this.cfaV1.getAccountFlowInfo({
                superToken: this.settings.address,
                account: params.account,
                providerOrSigner: params.providerOrSigner
            });
        };
        /**
         * Get the net flow of an account.
         * @param account the account we're querying
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<string>} Web3 Flow info object
         */ this.getNetFlow = async (params)=>{
            return await this.cfaV1.getNetFlow({
                superToken: this.settings.address,
                account: params.account,
                providerOrSigner: params.providerOrSigner
            });
        };
        /**
         * Get flow operator data.
         * @param sender the sender
         * @param flowOperator the flowOperator
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3FlowOperatorData>} Web3 Flow info object
         */ this.getFlowOperatorData = async (params)=>{
            const normalizedSender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.sender);
            const normalizedFlowOperator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"])(params.flowOperator);
            return await this.cfaV1.getFlowOperatorData({
                superToken: this.settings.address,
                sender: normalizedSender,
                flowOperator: normalizedFlowOperator,
                providerOrSigner: params.providerOrSigner
            });
        };
        /**
         * Get flow operator data using the flowOperatorId.
         * @param flowOperatorId The keccak256 hash of encoded string "flowOperator", sender and flowOperator
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3FlowOperatorData>} Web3 Flow info object
         */ this.getFlowOperatorDataByID = async (params)=>{
            return await this.cfaV1.getFlowOperatorDataByID({
                superToken: this.settings.address,
                flowOperatorId: params.flowOperatorId,
                providerOrSigner: params.providerOrSigner
            });
        };
        /** ### CFA Write Functions ### */ /**
         * Create a flow of the token of this class.
         * @param receiver The receiver of the flow.
         * @param flowRate The specified flow rate.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.createFlow = (params)=>{
            return this.cfaV1.createFlow({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Update a flow of the token of this class.
         * @param receiver The receiver of the flow.
         * @param flowRate The specified flow rate.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.updateFlow = (params)=>{
            return this.cfaV1.updateFlow({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Delete a flow of the token of this class.
         * @param sender The sender of the flow.
         * @param receiver The receiver of the flow.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.deleteFlow = (params)=>{
            return this.cfaV1.deleteFlow({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Create a flow as an operator
         * @param flowRate The specified flow rate.
         * @param sender The sender of the flow.
         * @param receiver The receiver of the flow.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.createFlowByOperator = (params)=>{
            return this.cfaV1.createFlowByOperator({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Update a flow as an operator.
         * @param flowRate The specified flow rate.
         * @param sender The sender of the flow.
         * @param receiver The receiver of the flow.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.updateFlowByOperator = (params)=>{
            return this.cfaV1.updateFlowByOperator({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Delete a flow as an operator.
         * @param sender The sender of the flow.
         * @param receiver The receiver of the flow.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.deleteFlowByOperator = (params)=>{
            return this.cfaV1.deleteFlowByOperator({
                superToken: this.settings.address,
                ...params
            });
        };
        /** ### IDA Read Functions ### */ /**
         * Get the details of a `Subscription`.
         * @param publisher the address of the publisher of the index
         * @param indexId the index id
         * @param subscriber the subscriber's address
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3Subscription>} Web3 Subscription object
         */ this.getSubscription = async (params)=>{
            return await this.idaV1.getSubscription({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Get the details of an `Index`.
         * @param publisher the address of the publisher of the index
         * @param indexId the index id
         * @param providerOrSigner a provider or signer object
         * @returns {Promise<IWeb3Index>} Web3 Index object
         */ this.getIndex = async (params)=>{
            return await this.idaV1.getIndex({
                superToken: this.settings.address,
                ...params
            });
        };
        /** ### IDA Write Functions ### */ /**
         * Creates an IDA Index.
         * @param indexId The id of the index.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.createIndex = (params)=>{
            return this.idaV1.createIndex({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Distributes `amount` of token to an index
         * @param indexId The id of the index.
         * @param amount The amount of tokens to be distributed.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.distribute = (params)=>{
            return this.idaV1.distribute({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Updates the `IndexValue` field of an index.
         * @param indexId The id of the index.
         * @param indexValue The new indexValue.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         *
         * NOTE: It has the same effect as `distribute`, but is closer to the low level data structure of the index.
         */ this.updateIndexValue = (params)=>{
            return this.idaV1.updateIndexValue({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Updates the `units` allocated to a Subscription.
         * @param indexId The id of the index.
         * @param subscriber The subscriber address whose units you want to update.
         * @param units The amount of units you want to update to.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.updateSubscriptionUnits = (params)=>{
            return this.idaV1.updateSubscriptionUnits({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Approves a Subscription, so the Subscriber won't need to claim tokens when the Publisher distributes.
         * @param indexId The id of the index.
         * @param publisher The publisher address whose subscription you want to approve.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.approveSubscription = (params)=>{
            return this.idaV1.approveSubscription({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Revokes a Subscription, so the Subscriber will need to claim tokens when the Publisher distributes.
         * @param indexId The id of the index.
         * @param publisher The index publisher address you want to revoke for the subscriber.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.revokeSubscription = (params)=>{
            return this.idaV1.revokeSubscription({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Deletes a Subscription by setting the `units` allocated to the Subscriber to 0.
         * @param indexId The id of the index.
         * @param subscriber The subscriber address whose subscription you want to delete.
         * @param publisher The publisher address of the index you are targeting.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.deleteSubscription = (params)=>{
            return this.idaV1.deleteSubscription({
                superToken: this.settings.address,
                ...params
            });
        };
        /**
         * Claims any pending tokens allocated to the Subscription (unapproved).
         * @param indexId The id of the index.
         * @param subscriber The subscriber address who you are claiming for.
         * @param publisher The publisher address of the index you are targeting.
         * @param userData Extra user data provided.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.claim = (params)=>{
            return this.idaV1.claim({
                superToken: this.settings.address,
                ...params
            });
        };
        /** ### Governance Read Functions ### */ this.getGovernanceParameters = async (providerOrSigner)=>{
            return this.governance.getGovernanceParameters({
                providerOrSigner,
                token: this.settings.address
            });
        };
        this.options = options;
        this.settings = settings;
        this.cfaV1 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ConstantFlowAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
            config: this.settings.config
        });
        this.idaV1 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$InstantDistributionAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
            config: this.settings.config
        });
        this.governance = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Governance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](this.settings.config.governanceAddress, this.settings.config.hostAddress);
        this.contract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(this.settings.address, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$SuperToken$2e$json__$28$json$29$__["default"].abi);
    }
    /** ### CFA ACL Write Functions (byOperator) ### */ /**
     * Update permissions for a flow operator as a sender.
     * @param sender The sender of the flow.
     * @param flowOperator The permission grantee address
     * @param permission The permissions to set.
     * @param flowRateAllowance The flowRateAllowance granted to the flow operator.
     * @param userData Extra user data provided.
     * @param overrides ethers overrides object for more control over the transaction sent.
     * @returns {Operation} An instance of Operation which can be executed or batched.
     */ updateFlowOperatorPermissions(params) {
        return this.cfaV1.updateFlowOperatorPermissions({
            superToken: this.settings.address,
            ...params
        });
    }
    /**
     * Give flow operator full control - max flow rate and create/update/delete permissions.
     * @param sender The sender of the flow.
     * @param flowOperator The permission grantee address
     * @param userData Extra user data provided.
     * @param overrides ethers overrides object for more control over the transaction sent.
     */ authorizeFlowOperatorWithFullControl(params) {
        return this.cfaV1.authorizeFlowOperatorWithFullControl({
            superToken: this.settings.address,
            ...params
        });
    }
    /**
     * Revoke flow operator control - set flow rate to 0 with no permissions.
     * @param sender The sender of the flow.
     * @param flowOperator The permission grantee address
     * @param userData Extra user data provided.
     * @param overrides ethers overrides object for more control over the transaction sent.
     */ revokeFlowOperatorWithFullControl(params) {
        return this.cfaV1.revokeFlowOperatorWithFullControl({
            superToken: this.settings.address,
            ...params
        });
    }
}
_a = SuperToken;
SuperToken.create = async (options)=>{
    if (!options.chainId && !options.networkName) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
            type: "SUPERTOKEN_INITIALIZATION",
            message: "You must input chainId or networkName."
        });
    }
    const networkName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$frameworkHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNetworkName"])(options);
    const chainId = options.chainId || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["networkNameToChainIdMap"].get(networkName);
    try {
        const superToken = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(options.address, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$SuperToken$2e$json__$28$json$29$__["default"].abi);
        const underlyingTokenAddress = await superToken.connect(options.provider).getUnderlyingToken();
        const settings = {
            address: options.address,
            config: options.config,
            chainId,
            networkName
        };
        const tokenSymbol = await superToken.connect(options.provider).symbol();
        const resolverData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chainIdToResolverDataMap"].get(chainId) || {
            subgraphAPIEndpoint: "",
            resolverAddress: "",
            networkName: "",
            nativeTokenSymbol: ""
        };
        const nativeTokenSymbol = resolverData.nativeTokenSymbol || "ETH";
        const nativeSuperTokenSymbol = nativeTokenSymbol + "x";
        if (nativeSuperTokenSymbol === tokenSymbol) {
            return new NativeAssetSuperToken(options, settings, nativeTokenSymbol);
        }
        if (underlyingTokenAddress !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].constants.AddressZero) {
            return new WrapperSuperToken(options, {
                ...settings,
                underlyingTokenAddress
            });
        }
        return new PureSuperToken(options, settings);
    } catch (err) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
            type: "SUPERTOKEN_INITIALIZATION",
            message: "There was an error initializing the SuperToken",
            cause: err
        });
    }
};
class WrapperSuperToken extends SuperToken {
    constructor(options, settings){
        super(options, settings);
        /** ### WrapperSuperToken Contract Write Functions ### */ /**
         * Downgrade `amount` SuperToken's.
         * @param amount The amount to be downgraded.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.downgrade = ({ amount, overrides })=>{
            const txn = this.contract.populateTransaction.downgrade(amount, overrides || {});
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](txn, "SUPERTOKEN_DOWNGRADE");
        };
        /**
         * Upgrade `amount` SuperToken's.
         * @param amount The amount to be upgraded.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed or batched.
         */ this.upgrade = ({ amount, overrides })=>{
            const txn = this.contract.populateTransaction.upgrade(amount, overrides || {});
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](txn, "SUPERTOKEN_UPGRADE");
        };
        /**
         * Upgrade `amount` of an ERC20 token to its SuperToken to `to` address.
         * @param amount The amount to be upgraded.
         * @param to The destination of the upgraded native asset super tokens.
         * @param data Bytes operatorData
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed.
         */ this.upgradeTo = ({ amount, to, data = "0x", overrides })=>{
            const txn = this.contract.populateTransaction.upgradeTo(to, amount, data, {
                ...overrides
            });
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](txn, "UNSUPPORTED");
        };
        this.underlyingToken = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ERC20Token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](settings.underlyingTokenAddress);
    }
}
class PureSuperToken extends SuperToken {
    constructor(options, settings){
        super(options, settings);
    }
}
class NativeAssetSuperToken extends SuperToken {
    constructor(options, settings, nativeTokenSymbol){
        super(options, settings);
        /**
         * Upgrade `amount` of a network's native asset to its SuperToken.
         * @param amount The amount to be upgraded.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed.
         */ this.upgrade = ({ amount, overrides })=>{
            const txn = this.nativeAssetContract.populateTransaction.upgradeByETH({
                ...overrides,
                value: amount
            });
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](txn, "UNSUPPORTED");
        };
        /**
         * Upgrade `amount` of a network's native asset to its SuperToken to `to` address.
         * @param amount The amount to be upgraded.
         * @param to The destination of the upgraded native asset super tokens.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed.
         */ this.upgradeTo = ({ amount, to, overrides })=>{
            const txn = this.nativeAssetContract.populateTransaction.upgradeByETHTo(to, {
                ...overrides,
                value: amount
            });
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](txn, "UNSUPPORTED");
        };
        /**
         * Downgrade `amount` of a native asset super token to the underlying native asset.
         * @param amount The amount to be upgraded.
         * @param overrides ethers overrides object for more control over the transaction sent.
         * @returns {Operation} An instance of Operation which can be executed.
         */ this.downgrade = ({ amount, overrides })=>{
            const txn = this.nativeAssetContract.populateTransaction.downgradeToETH(amount, {
                ...overrides
            });
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](txn, "UNSUPPORTED");
        };
        this.nativeTokenSymbol = nativeTokenSymbol;
    }
    get nativeAssetContract() {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(this.settings.address, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$ISETH$2e$json__$28$json$29$__["default"].abi);
    }
} //# sourceMappingURL=SuperToken.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Framework.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>Framework)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$BatchCall$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/BatchCall.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ConstantFlowAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ConstantFlowAgreementV1.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Governance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Governance.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Host.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$InstantDistributionAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/InstantDistributionAgreementV1.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Operation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Query$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Query.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SuperToken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SuperToken.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$IResolver$2e$json__$28$json$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/IResolver.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$SuperfluidLoader$2e$json__$28$json$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/abi/SuperfluidLoader.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$frameworkHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/frameworkHelpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
var _a;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
class Framework {
    constructor(options, settings){
        /**
         * Create a signer which can be used to sign transactions.
         * @param options.web3Provider a Web3Provider object (e.g. client side - metamask, web3modal)
         * @param options.provider an ethers Provider object (e.g. via Hardhat ethers)
         * @param options.privateKey a test account private key
         * @param options.signer a signer object (e.g. ethers.Wallet instance)
         * @returns `ethers.Signer` object
         */ this.createSigner = (options)=>{
            if (!options.privateKey && !options.provider && !options.signer && !options.web3Provider) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "CREATE_SIGNER",
                    message: "You must pass in a private key, provider or signer."
                });
            }
            /* istanbul ignore else  */ if (options.privateKey) {
                if (!options.provider) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                        type: "CREATE_SIGNER",
                        message: "You must pass in a provider with your private key."
                    });
                }
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Wallet(options.privateKey, options.provider);
            } else if (options.signer) {
                return options.signer;
            } else if (options.web3Provider) {
                return options.web3Provider.getSigner();
            }
            /* istanbul ignore next */ throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                type: "CREATE_SIGNER",
                message: "Something went wrong, this should never occur."
            });
        };
        /**
         * Create a `BatchCall` class from the `Framework`.
         * @param operations the list of operations to execute
         * @returns `BatchCall` class
         */ this.batchCall = (operations)=>{
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$BatchCall$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
                operations,
                hostAddress: this.settings.config.hostAddress
            });
        };
        /**
         * Create an `Operation` class from the `Framework`.
         * @param txn the populated transaction to execute
         * @param type the operation type
         * @returns `Operation` class
         */ this.operation = (txn, type)=>{
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](txn, type);
        };
        /**
         * Loads `NativeAssetSuperToken` class from the `Framework`. Will throw if token is not NativeAssetSuperToken.
         * @param tokenAddressOrSymbol
         * @returns `NativeAssetSuperToken` class
         */ this.loadNativeAssetSuperToken = async (tokenAddressOrSymbol)=>{
            const superToken = await this.loadSuperToken(tokenAddressOrSymbol);
            // The NativeAssetSuperToken class should have the nativeTokenSymbol property
            const isNativeAssetSuperToken = !!superToken.nativeTokenSymbol;
            if (!isNativeAssetSuperToken) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "SUPERTOKEN_INITIALIZATION",
                    message: "The token is not a native asset supertoken."
                });
            }
            return superToken;
        };
        /**
         * Loads `PureSuperToken` class from the `Framework`. Will throw if token is not PureSuperToken.
         * @param tokenAddressOrSymbol
         * @returns `PureSuperToken` class
         */ this.loadPureSuperToken = async (tokenAddressOrSymbol)=>{
            const superToken = await this.loadSuperToken(tokenAddressOrSymbol);
            // The PureSuperToken class should not have the downgrade (and upgrade) function
            // we can just check if downgrade doesn't exist
            const isPureSuperToken = !!superToken.downgrade === false;
            if (!isPureSuperToken) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "SUPERTOKEN_INITIALIZATION",
                    message: "The token is not a pure supertoken."
                });
            }
            return superToken;
        };
        /**
         * Loads `WrapperSuperToken` class from the `Framework`. Will throw if token is not WrapperSuperToken.
         * @param tokenAddressOrSymbol
         * @returns `WrapperSuperToken` class
         */ this.loadWrapperSuperToken = async (tokenAddressOrSymbol)=>{
            const superToken = await this.loadSuperToken(tokenAddressOrSymbol);
            // The WrapperSuperToken class should have the underlyingToken property
            const isWrapperSuperToken = !!superToken.underlyingToken;
            if (!isWrapperSuperToken) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                    type: "SUPERTOKEN_INITIALIZATION",
                    message: "The token is not a wrapper supertoken."
                });
            }
            return superToken;
        };
        /**
         * Loads `SuperToken` class from the `Framework`. Use this when you're unsure of the token type.
         * @param tokenAddressOrSymbol the `SuperToken` address or symbol (if symbol, it must be on the resolver)
         * @returns `SuperToken` class
         */ this.loadSuperToken = async (tokenAddressOrSymbol)=>{
            const address = await this._tryGetTokenAddress(tokenAddressOrSymbol);
            return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SuperToken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
                ...this.settings,
                address
            });
        };
        /**
         * Try to get the token address given an address (returns if valid) or the token symbol via the resolver.
         * @param tokenAddressOrSymbol
         * @returns token address
         */ this._tryGetTokenAddress = async (tokenAddressOrSymbol)=>{
            const isInputValidAddress = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].utils.isAddress(tokenAddressOrSymbol);
            if (isInputValidAddress) {
                return tokenAddressOrSymbol;
            } else {
                try {
                    const superTokenKey = "supertokens." + this.settings.protocolReleaseVersion + "." + tokenAddressOrSymbol;
                    const resolver = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(this.settings.config.resolverAddress, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$IResolver$2e$json__$28$json$29$__["default"].abi, this.settings.provider);
                    return await resolver.get(superTokenKey);
                } catch (err) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
                        type: "SUPERTOKEN_INITIALIZATION",
                        message: "There was an error with loading the SuperToken with symbol: " + tokenAddressOrSymbol + " with the resolver.",
                        cause: err
                    });
                }
            }
        };
        this.userInputOptions = options;
        this.settings = settings;
        this.cfaV1 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ConstantFlowAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
            config: this.settings.config
        });
        this.governance = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Governance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](this.settings.config.governanceAddress, this.settings.config.hostAddress);
        this.host = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](this.settings.config.hostAddress);
        this.idaV1 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$InstantDistributionAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
            config: this.settings.config
        });
        this.query = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Query$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](this.settings);
        const resolver = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(this.settings.config.resolverAddress, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$IResolver$2e$json__$28$json$29$__["default"].abi);
        this.contracts = {
            cfaV1: this.cfaV1.contract,
            governance: this.governance.contract,
            host: this.host.contract,
            idaV1: this.idaV1.contract,
            resolver
        };
    }
}
_a = Framework;
/**
 * Creates the Framework object based on user provided `options`.
 * @param options.chainId the chainId of your desired network (e.g. 137 = matic)
 * @param options.customSubgraphQueriesEndpoint your custom subgraph endpoint
 * @param options.resolverAddress a custom resolver address (advanced use for testing)
 * @param options.protocolReleaseVersion a custom release version (advanced use for testing)
 * @param options.provider a provider object (injected web3, injected ethers, ethers provider) necessary for initializing the framework
 * @returns `Framework` class
 */ Framework.create = async (options)=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$frameworkHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateFrameworkConstructorOptions"])({
        ...options,
        protocolReleaseVersion: options.protocolReleaseVersion || "v1"
    });
    const networkName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$frameworkHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNetworkName"])(options);
    const chainId = options.chainId || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["networkNameToChainIdMap"].get(networkName);
    const releaseVersion = options.protocolReleaseVersion || "v1";
    const customSubgraphQueriesEndpoint = options.customSubgraphQueriesEndpoint || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$frameworkHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSubgraphQueriesEndpoint"])(options);
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEthersProvider"])(options.provider) ? options.provider : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInjectedWeb3"])(options.provider) ? // ethers.providers.Web3Provider doesn't like
    // the type passed.
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].providers.Web3Provider(options.provider.currentProvider) : options.provider.provider;
    const network = await provider.getNetwork();
    if (network.chainId !== chainId && chainId != null) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
            type: "NETWORK_MISMATCH",
            message: "Your provider network chainId is: " + network.chainId + " whereas your desired chainId is: " + chainId
        });
    }
    try {
        const resolverData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chainIdToResolverDataMap"].get(chainId) || {
            subgraphAPIEndpoint: "",
            resolverAddress: "",
            networkName: "",
            nativeTokenSymbol: ""
        };
        const resolverAddress = options.resolverAddress ? options.resolverAddress : resolverData.resolverAddress;
        const resolver = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(resolverAddress, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$IResolver$2e$json__$28$json$29$__["default"].abi, provider);
        const superfluidLoaderAddress = await resolver.get("SuperfluidLoader-v1");
        const superfluidLoader = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ethers$40$5$2e$7$2e$2$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(superfluidLoaderAddress, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$abi$2f$SuperfluidLoader$2e$json__$28$json$29$__["default"].abi, provider);
        const framework = await superfluidLoader.loadFramework(releaseVersion);
        const governanceAddress = await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](framework.superfluid).contract.connect(provider).getGovernance();
        const settings = {
            chainId,
            customSubgraphQueriesEndpoint,
            protocolReleaseVersion: options.protocolReleaseVersion || "v1",
            provider,
            networkName,
            config: {
                resolverAddress,
                hostAddress: framework.superfluid,
                cfaV1Address: framework.agreementCFAv1,
                idaV1Address: framework.agreementIDAv1,
                governanceAddress
            }
        };
        return new Framework(options, settings);
    } catch (err) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]({
            type: "FRAMEWORK_INITIALIZATION",
            message: "There was an error initializing the framework",
            cause: err
        });
    }
}; //# sourceMappingURL=Framework.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/interfaces.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({});
;
 //# sourceMappingURL=interfaces.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ordering.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({});
;
 //# sourceMappingURL=ordering.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/types.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({});
;
 //# sourceMappingURL=types.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/index.js [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({});
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
 //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/index.js [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$schema$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/schema.generated.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$BatchCall$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/BatchCall.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ConstantFlowAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ConstantFlowAgreementV1.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ERC20Token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ERC20Token.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Framework$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Framework.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Governance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Governance.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Host.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$InstantDistributionAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/InstantDistributionAgreementV1.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Operation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Query$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Query.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SuperToken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SuperToken.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$interfaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/interfaces.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/pagination.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ordering$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ordering.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/events.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/types.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$account$2f$account$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/account/account.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$accountTokenSnapshot$2f$accountTokenSnapshot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/accountTokenSnapshot/accountTokenSnapshot.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$accountTokenSnapshotLog$2f$accountTokenSnapshotLog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/accountTokenSnapshotLog/accountTokenSnapshotLog.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$index$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/index/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$indexSubscription$2f$indexSubscription$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/indexSubscription/indexSubscription.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$stream$2f$stream$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/stream/stream.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$streamPeriod$2f$streamPeriod$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/streamPeriod/streamPeriod.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$token$2f$token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/token/token.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$tokenStatistic$2f$tokenStatistic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/tokenStatistic/tokenStatistic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$tokenStatisticLog$2f$tokenStatisticLog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/tokenStatisticLog/tokenStatisticLog.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/events.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$flowUpdatedEvent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/flowUpdatedEvent.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$indexUpdatedEvent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/indexUpdatedEvent.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$subscriptionUnitsUpdatedEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/subscriptionUnitsUpdatedEvents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$transferEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/transferEvents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$meta$2f$meta$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/meta/meta.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$mappedSubgraphTypes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/mappedSubgraphTypes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/index.js [app-client] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/index.js [app-client] (ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ARBITRUM_ONE": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ARBITRUM_ONE"]),
    "ARBITRUM_ONE_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ARBITRUM_ONE_CHAIN_ID"]),
    "ARBITRUM_RINKEBY": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ARBITRUM_RINKEBY"]),
    "ARBITRUM_RINKEBY_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ARBITRUM_RINKEBY_CHAIN_ID"]),
    "AUTHORIZE_FLOW_OPERATOR_CREATE": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHORIZE_FLOW_OPERATOR_CREATE"]),
    "AUTHORIZE_FLOW_OPERATOR_DELETE": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHORIZE_FLOW_OPERATOR_DELETE"]),
    "AUTHORIZE_FLOW_OPERATOR_UPDATE": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHORIZE_FLOW_OPERATOR_UPDATE"]),
    "AUTHORIZE_FULL_CONTROL": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHORIZE_FULL_CONTROL"]),
    "AVALANCHE_C": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AVALANCHE_C"]),
    "AVALANCHE_C_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AVALANCHE_C_CHAIN_ID"]),
    "AVALANCHE_FUJI": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AVALANCHE_FUJI"]),
    "AVALANCHE_FUJI_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AVALANCHE_FUJI_CHAIN_ID"]),
    "AccountQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$account$2f$account$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccountQueryHandler"]),
    "AccountTokenSnapshotLogQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$accountTokenSnapshotLog$2f$accountTokenSnapshotLog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccountTokenSnapshotLogQueryHandler"]),
    "AccountTokenSnapshotQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$accountTokenSnapshot$2f$accountTokenSnapshot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccountTokenSnapshotQueryHandler"]),
    "BASE_18": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_18"]),
    "BSC_MAINNET": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BSC_MAINNET"]),
    "BSC_MAINNET_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BSC_MAINNET_CHAIN_ID"]),
    "BatchCall": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$BatchCall$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]),
    "ConstantFlowAgreementV1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ConstantFlowAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]),
    "DAYS_PER_MONTH": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_PER_MONTH"]),
    "DAYS_PER_WEEK": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_PER_WEEK"]),
    "DAY_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAY_IN_SECONDS"]),
    "ERC20Token": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ERC20Token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]),
    "ETH_GOERLI": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_GOERLI"]),
    "ETH_GOERLI_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_GOERLI_CHAIN_ID"]),
    "ETH_KOVAN": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_KOVAN"]),
    "ETH_KOVAN_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_KOVAN_CHAIN_ID"]),
    "ETH_RINKEBY": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_RINKEBY"]),
    "ETH_RINKEBY_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_RINKEBY_CHAIN_ID"]),
    "ETH_ROPSTEN": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_ROPSTEN"]),
    "ETH_ROPSTEN_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_ROPSTEN_CHAIN_ID"]),
    "EventQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventQueryHandler"]),
    "FlowUpdateType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlowUpdateType"]),
    "FlowUpdatedEventQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$flowUpdatedEvent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlowUpdatedEventQueryHandler"]),
    "Framework": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Framework$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]),
    "GNOSIS_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GNOSIS_CHAIN_ID"]),
    "Governance": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Governance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]),
    "HOURS_PER_DAY": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HOURS_PER_DAY"]),
    "HOUR_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HOUR_IN_SECONDS"]),
    "Host": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]),
    "IndexQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$index$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexQueryHandler"]),
    "IndexSubscriptionQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$indexSubscription$2f$indexSubscription$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexSubscriptionQueryHandler"]),
    "IndexUpdatedEventQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$indexUpdatedEvent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndexUpdatedEventQueryHandler"]),
    "InstantDistributionAgreementV1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$InstantDistributionAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]),
    "MATIC_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MATIC_CHAIN_ID"]),
    "MINUTES_PER_HOUR": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MINUTES_PER_HOUR"]),
    "MINUTE_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MINUTE_IN_SECONDS"]),
    "MONTHS_PER_YEAR": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTHS_PER_YEAR"]),
    "MONTH_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTH_IN_SECONDS"]),
    "MUMBAI_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MUMBAI_CHAIN_ID"]),
    "MetaQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$meta$2f$meta$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetaQueryHandler"]),
    "NativeAssetSuperToken": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SuperToken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NativeAssetSuperToken"]),
    "OPTIMISM_KOVAN": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OPTIMISM_KOVAN"]),
    "OPTIMISM_KOVAN_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OPTIMISM_KOVAN_CHAIN_ID"]),
    "OPTIMISM_MAINNET": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OPTIMISM_MAINNET"]),
    "OPTIMISM_MAINNET_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OPTIMISM_MAINNET_CHAIN_ID"]),
    "Operation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]),
    "POLYGON_MAINNET": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["POLYGON_MAINNET"]),
    "POLYGON_MUMBAI": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["POLYGON_MUMBAI"]),
    "PureSuperToken": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SuperToken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PureSuperToken"]),
    "Query": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Query$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]),
    "SFError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SFError"]),
    "StreamPeriodQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$streamPeriod$2f$streamPeriod$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StreamPeriodQueryHandler"]),
    "StreamQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$stream$2f$stream$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StreamQueryHandler"]),
    "SubgraphQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubgraphQueryHandler"]),
    "SubscriptionUnitsUpdatedEventQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$subscriptionUnitsUpdatedEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubscriptionUnitsUpdatedEventQueryHandler"]),
    "SuperToken": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SuperToken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]),
    "TokenQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$token$2f$token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenQueryHandler"]),
    "TokenStatisticLogQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$tokenStatisticLog$2f$tokenStatisticLog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenStatisticLogQueryHandler"]),
    "TokenStatisticQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$tokenStatistic$2f$tokenStatistic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TokenStatisticQueryHandler"]),
    "TransferEventQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$transferEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransferEventQueryHandler"]),
    "WEEK_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WEEK_IN_SECONDS"]),
    "WrapperSuperToken": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SuperToken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WrapperSuperToken"]),
    "XDAI_MAINNET": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XDAI_MAINNET"]),
    "YEAR_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YEAR_IN_SECONDS"]),
    "calculateAvailableBalance": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateAvailableBalance"]),
    "chainIdToResolverDataMap": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chainIdToResolverDataMap"]),
    "chainIds": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chainIds"]),
    "createLastIdPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLastIdPaging"]),
    "createPageNumberPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPageNumberPaging"]),
    "createPagedResult": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPagedResult"]),
    "createSkipPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSkipPaging"]),
    "flowedAmountSinceUpdatedAt": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flowedAmountSinceUpdatedAt"]),
    "getFlowAmountByPerSecondFlowRate": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFlowAmountByPerSecondFlowRate"]),
    "getFlowOperatorId": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFlowOperatorId"]),
    "getPerSecondFlowRateByDay": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPerSecondFlowRateByDay"]),
    "getPerSecondFlowRateByMonth": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPerSecondFlowRateByMonth"]),
    "getPerSecondFlowRateByWeek": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPerSecondFlowRateByWeek"]),
    "getPerSecondFlowRateByYear": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPerSecondFlowRateByYear"]),
    "getSanitizedTimestamp": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSanitizedTimestamp"]),
    "getStringCurrentTimeInSeconds": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStringCurrentTimeInSeconds"]),
    "getTransactionDescription": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTransactionDescription"]),
    "isAllPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAllPaging"]),
    "isEthersProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEthersProvider"]),
    "isInjectedEthers": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInjectedEthers"]),
    "isInjectedWeb3": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInjectedWeb3"]),
    "isLastIdPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLastIdPaging"]),
    "isNullOrEmpty": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNullOrEmpty"]),
    "isPageNumberPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPageNumberPaging"]),
    "isPermissionsClean": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPermissionsClean"]),
    "isSkipPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSkipPaging"]),
    "networkNameToChainIdMap": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["networkNameToChainIdMap"]),
    "nextLastIdPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nextLastIdPaging"]),
    "nextPageNumberPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nextPageNumberPaging"]),
    "nextSkipPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nextSkipPaging"]),
    "normalizeAddress": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeAddress"]),
    "removeSigHashFromCallData": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeSigHashFromCallData"]),
    "subscriptionTotalAmountClaimableSinceUpdatedAt": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscriptionTotalAmountClaimableSinceUpdatedAt"]),
    "subscriptionTotalAmountDistributedSinceUpdated": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscriptionTotalAmountDistributedSinceUpdated"]),
    "subscriptionTotalAmountReceivedSinceUpdated": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscriptionTotalAmountReceivedSinceUpdated"]),
    "takePlusOne": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takePlusOne"]),
    "toBN": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBN"]),
    "typeGuard": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeGuard"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$BatchCall$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/BatchCall.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ConstantFlowAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ConstantFlowAgreementV1.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ERC20Token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ERC20Token.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Framework$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Framework.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Governance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Governance.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Host$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Host.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$InstantDistributionAgreementV1$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/InstantDistributionAgreementV1.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SuperToken$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SuperToken.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Operation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Operation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$Query$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/Query.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$schema$2e$generated$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/schema.generated.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$interfaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/interfaces.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$pagination$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/pagination.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$ordering$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/ordering.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/events.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/types.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$account$2f$account$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/account/account.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$accountTokenSnapshot$2f$accountTokenSnapshot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/accountTokenSnapshot/accountTokenSnapshot.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$accountTokenSnapshotLog$2f$accountTokenSnapshotLog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/accountTokenSnapshotLog/accountTokenSnapshotLog.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$index$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/index/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$indexSubscription$2f$indexSubscription$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/indexSubscription/indexSubscription.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$stream$2f$stream$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/stream/stream.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$streamPeriod$2f$streamPeriod$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/streamPeriod/streamPeriod.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$token$2f$token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/token/token.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$tokenStatistic$2f$tokenStatistic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/tokenStatistic/tokenStatistic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$entities$2f$tokenStatisticLog$2f$tokenStatisticLog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/entities/tokenStatisticLog/tokenStatisticLog.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$events$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/events.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$flowUpdatedEvent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/flowUpdatedEvent.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$indexUpdatedEvent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/indexUpdatedEvent.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$subscriptionUnitsUpdatedEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/subscriptionUnitsUpdatedEvents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$events$2f$transferEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/events/transferEvents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$meta$2f$meta$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/meta/meta.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$mappedSubgraphTypes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/mappedSubgraphTypes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$SFError$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/SFError.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$subgraph$2f$subgraphQueryHandler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/subgraph/subgraphQueryHandler.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/index.js [app-client] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/index.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "ARBITRUM_ONE": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ARBITRUM_ONE"]),
    "ARBITRUM_ONE_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ARBITRUM_ONE_CHAIN_ID"]),
    "ARBITRUM_RINKEBY": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ARBITRUM_RINKEBY"]),
    "ARBITRUM_RINKEBY_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ARBITRUM_RINKEBY_CHAIN_ID"]),
    "AUTHORIZE_FLOW_OPERATOR_CREATE": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AUTHORIZE_FLOW_OPERATOR_CREATE"]),
    "AUTHORIZE_FLOW_OPERATOR_DELETE": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AUTHORIZE_FLOW_OPERATOR_DELETE"]),
    "AUTHORIZE_FLOW_OPERATOR_UPDATE": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AUTHORIZE_FLOW_OPERATOR_UPDATE"]),
    "AUTHORIZE_FULL_CONTROL": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AUTHORIZE_FULL_CONTROL"]),
    "AVALANCHE_C": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AVALANCHE_C"]),
    "AVALANCHE_C_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AVALANCHE_C_CHAIN_ID"]),
    "AVALANCHE_FUJI": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AVALANCHE_FUJI"]),
    "AVALANCHE_FUJI_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AVALANCHE_FUJI_CHAIN_ID"]),
    "AccountQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AccountQueryHandler"]),
    "AccountTokenSnapshotLogQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AccountTokenSnapshotLogQueryHandler"]),
    "AccountTokenSnapshotQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AccountTokenSnapshotQueryHandler"]),
    "BASE_18": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["BASE_18"]),
    "BSC_MAINNET": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["BSC_MAINNET"]),
    "BSC_MAINNET_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["BSC_MAINNET_CHAIN_ID"]),
    "BatchCall": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["BatchCall"]),
    "ConstantFlowAgreementV1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ConstantFlowAgreementV1"]),
    "DAYS_PER_MONTH": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["DAYS_PER_MONTH"]),
    "DAYS_PER_WEEK": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["DAYS_PER_WEEK"]),
    "DAY_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["DAY_IN_SECONDS"]),
    "ERC20Token": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ERC20Token"]),
    "ETH_GOERLI": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ETH_GOERLI"]),
    "ETH_GOERLI_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ETH_GOERLI_CHAIN_ID"]),
    "ETH_KOVAN": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ETH_KOVAN"]),
    "ETH_KOVAN_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ETH_KOVAN_CHAIN_ID"]),
    "ETH_RINKEBY": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ETH_RINKEBY"]),
    "ETH_RINKEBY_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ETH_RINKEBY_CHAIN_ID"]),
    "ETH_ROPSTEN": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ETH_ROPSTEN"]),
    "ETH_ROPSTEN_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["ETH_ROPSTEN_CHAIN_ID"]),
    "EventQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["EventQueryHandler"]),
    "FlowUpdateType": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["FlowUpdateType"]),
    "FlowUpdatedEventQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["FlowUpdatedEventQueryHandler"]),
    "Framework": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Framework"]),
    "GNOSIS_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["GNOSIS_CHAIN_ID"]),
    "Governance": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Governance"]),
    "HOURS_PER_DAY": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["HOURS_PER_DAY"]),
    "HOUR_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["HOUR_IN_SECONDS"]),
    "Host": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Host"]),
    "IndexQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["IndexQueryHandler"]),
    "IndexSubscriptionQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["IndexSubscriptionQueryHandler"]),
    "IndexUpdatedEventQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["IndexUpdatedEventQueryHandler"]),
    "InstantDistributionAgreementV1": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["InstantDistributionAgreementV1"]),
    "MATIC_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["MATIC_CHAIN_ID"]),
    "MINUTES_PER_HOUR": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["MINUTES_PER_HOUR"]),
    "MINUTE_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["MINUTE_IN_SECONDS"]),
    "MONTHS_PER_YEAR": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["MONTHS_PER_YEAR"]),
    "MONTH_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["MONTH_IN_SECONDS"]),
    "MUMBAI_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["MUMBAI_CHAIN_ID"]),
    "MetaQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["MetaQueryHandler"]),
    "NativeAssetSuperToken": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["NativeAssetSuperToken"]),
    "OPTIMISM_KOVAN": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["OPTIMISM_KOVAN"]),
    "OPTIMISM_KOVAN_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["OPTIMISM_KOVAN_CHAIN_ID"]),
    "OPTIMISM_MAINNET": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["OPTIMISM_MAINNET"]),
    "OPTIMISM_MAINNET_CHAIN_ID": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["OPTIMISM_MAINNET_CHAIN_ID"]),
    "Operation": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Operation"]),
    "POLYGON_MAINNET": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["POLYGON_MAINNET"]),
    "POLYGON_MUMBAI": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["POLYGON_MUMBAI"]),
    "PureSuperToken": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["PureSuperToken"]),
    "Query": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Query"]),
    "SFError": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["SFError"]),
    "StreamPeriodQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["StreamPeriodQueryHandler"]),
    "StreamQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["StreamQueryHandler"]),
    "SubgraphQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["SubgraphQueryHandler"]),
    "SubscriptionUnitsUpdatedEventQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["SubscriptionUnitsUpdatedEventQueryHandler"]),
    "SuperToken": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["SuperToken"]),
    "TokenQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["TokenQueryHandler"]),
    "TokenStatisticLogQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["TokenStatisticLogQueryHandler"]),
    "TokenStatisticQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["TokenStatisticQueryHandler"]),
    "TransferEventQueryHandler": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["TransferEventQueryHandler"]),
    "WEEK_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["WEEK_IN_SECONDS"]),
    "WrapperSuperToken": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["WrapperSuperToken"]),
    "XDAI_MAINNET": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["XDAI_MAINNET"]),
    "YEAR_IN_SECONDS": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["YEAR_IN_SECONDS"]),
    "calculateAvailableBalance": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["calculateAvailableBalance"]),
    "chainIdToResolverDataMap": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["chainIdToResolverDataMap"]),
    "chainIds": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["chainIds"]),
    "createLastIdPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["createLastIdPaging"]),
    "createPageNumberPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["createPageNumberPaging"]),
    "createPagedResult": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["createPagedResult"]),
    "createSkipPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["createSkipPaging"]),
    "flowedAmountSinceUpdatedAt": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["flowedAmountSinceUpdatedAt"]),
    "getFlowAmountByPerSecondFlowRate": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getFlowAmountByPerSecondFlowRate"]),
    "getFlowOperatorId": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getFlowOperatorId"]),
    "getPerSecondFlowRateByDay": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getPerSecondFlowRateByDay"]),
    "getPerSecondFlowRateByMonth": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getPerSecondFlowRateByMonth"]),
    "getPerSecondFlowRateByWeek": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getPerSecondFlowRateByWeek"]),
    "getPerSecondFlowRateByYear": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getPerSecondFlowRateByYear"]),
    "getSanitizedTimestamp": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getSanitizedTimestamp"]),
    "getStringCurrentTimeInSeconds": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getStringCurrentTimeInSeconds"]),
    "getTransactionDescription": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getTransactionDescription"]),
    "isAllPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isAllPaging"]),
    "isEthersProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isEthersProvider"]),
    "isInjectedEthers": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isInjectedEthers"]),
    "isInjectedWeb3": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isInjectedWeb3"]),
    "isLastIdPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isLastIdPaging"]),
    "isNullOrEmpty": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isNullOrEmpty"]),
    "isPageNumberPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isPageNumberPaging"]),
    "isPermissionsClean": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isPermissionsClean"]),
    "isSkipPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isSkipPaging"]),
    "networkNameToChainIdMap": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["networkNameToChainIdMap"]),
    "nextLastIdPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["nextLastIdPaging"]),
    "nextPageNumberPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["nextPageNumberPaging"]),
    "nextSkipPaging": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["nextSkipPaging"]),
    "normalizeAddress": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["normalizeAddress"]),
    "removeSigHashFromCallData": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["removeSigHashFromCallData"]),
    "subscriptionTotalAmountClaimableSinceUpdatedAt": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["subscriptionTotalAmountClaimableSinceUpdatedAt"]),
    "subscriptionTotalAmountDistributedSinceUpdated": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["subscriptionTotalAmountDistributedSinceUpdated"]),
    "subscriptionTotalAmountReceivedSinceUpdated": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["subscriptionTotalAmountReceivedSinceUpdated"]),
    "takePlusOne": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["takePlusOne"]),
    "toBN": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["toBN"]),
    "typeGuard": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["typeGuard"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$superfluid$2d$finance$2b$sdk$2d$core$40$0$2e$5$2e$0_ethers$40$5$2e$7$2e$2_graphql$40$16$2e$8$2e$1_typescript$40$5$2e$6$2e$3$2f$node_modules$2f40$superfluid$2d$finance$2f$sdk$2d$core$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/index.js [app-client] (ecmascript) <exports>");
}}),
}]);

//# sourceMappingURL=e10cc_%40superfluid-finance_sdk-core_dist_module_8568b1._.js.map