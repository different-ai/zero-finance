(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/2cdc9_@ethersproject_providers_lib_esm_5d4c33._.js", {

"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "version": (()=>version)
});
const version = "providers/5.7.2"; //# sourceMappingURL=_version.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/formatter.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "Formatter": (()=>Formatter),
    "isCommunityResourcable": (()=>isCommunityResourcable),
    "isCommunityResource": (()=>isCommunityResource),
    "showThrottleMessage": (()=>showThrottleMessage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$transactions$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$transactions$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+transactions@5.7.0/node_modules/@ethersproject/transactions/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bignumber@5.7.0/node_modules/@ethersproject/bignumber/lib.esm/bignumber.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bytes@5.7.0/node_modules/@ethersproject/bytes/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$address$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$address$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+address@5.7.0/node_modules/@ethersproject/address/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$constants$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$constants$2f$lib$2e$esm$2f$addresses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+constants@5.7.0/node_modules/@ethersproject/constants/lib.esm/addresses.js [app-client] (ecmascript)");
"use strict";
;
;
;
;
;
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
class Formatter {
    constructor(){
        this.formats = this.getDefaultFormats();
    }
    getDefaultFormats() {
        const formats = {};
        const address = this.address.bind(this);
        const bigNumber = this.bigNumber.bind(this);
        const blockTag = this.blockTag.bind(this);
        const data = this.data.bind(this);
        const hash = this.hash.bind(this);
        const hex = this.hex.bind(this);
        const number = this.number.bind(this);
        const type = this.type.bind(this);
        const strictData = (v)=>{
            return this.data(v, true);
        };
        formats.transaction = {
            hash: hash,
            type: type,
            accessList: Formatter.allowNull(this.accessList.bind(this), null),
            blockHash: Formatter.allowNull(hash, null),
            blockNumber: Formatter.allowNull(number, null),
            transactionIndex: Formatter.allowNull(number, null),
            confirmations: Formatter.allowNull(number, null),
            from: address,
            // either (gasPrice) or (maxPriorityFeePerGas + maxFeePerGas)
            // must be set
            gasPrice: Formatter.allowNull(bigNumber),
            maxPriorityFeePerGas: Formatter.allowNull(bigNumber),
            maxFeePerGas: Formatter.allowNull(bigNumber),
            gasLimit: bigNumber,
            to: Formatter.allowNull(address, null),
            value: bigNumber,
            nonce: number,
            data: data,
            r: Formatter.allowNull(this.uint256),
            s: Formatter.allowNull(this.uint256),
            v: Formatter.allowNull(number),
            creates: Formatter.allowNull(address, null),
            raw: Formatter.allowNull(data)
        };
        formats.transactionRequest = {
            from: Formatter.allowNull(address),
            nonce: Formatter.allowNull(number),
            gasLimit: Formatter.allowNull(bigNumber),
            gasPrice: Formatter.allowNull(bigNumber),
            maxPriorityFeePerGas: Formatter.allowNull(bigNumber),
            maxFeePerGas: Formatter.allowNull(bigNumber),
            to: Formatter.allowNull(address),
            value: Formatter.allowNull(bigNumber),
            data: Formatter.allowNull(strictData),
            type: Formatter.allowNull(number),
            accessList: Formatter.allowNull(this.accessList.bind(this), null)
        };
        formats.receiptLog = {
            transactionIndex: number,
            blockNumber: number,
            transactionHash: hash,
            address: address,
            topics: Formatter.arrayOf(hash),
            data: data,
            logIndex: number,
            blockHash: hash
        };
        formats.receipt = {
            to: Formatter.allowNull(this.address, null),
            from: Formatter.allowNull(this.address, null),
            contractAddress: Formatter.allowNull(address, null),
            transactionIndex: number,
            // should be allowNull(hash), but broken-EIP-658 support is handled in receipt
            root: Formatter.allowNull(hex),
            gasUsed: bigNumber,
            logsBloom: Formatter.allowNull(data),
            blockHash: hash,
            transactionHash: hash,
            logs: Formatter.arrayOf(this.receiptLog.bind(this)),
            blockNumber: number,
            confirmations: Formatter.allowNull(number, null),
            cumulativeGasUsed: bigNumber,
            effectiveGasPrice: Formatter.allowNull(bigNumber),
            status: Formatter.allowNull(number),
            type: type
        };
        formats.block = {
            hash: Formatter.allowNull(hash),
            parentHash: hash,
            number: number,
            timestamp: number,
            nonce: Formatter.allowNull(hex),
            difficulty: this.difficulty.bind(this),
            gasLimit: bigNumber,
            gasUsed: bigNumber,
            miner: Formatter.allowNull(address),
            extraData: data,
            transactions: Formatter.allowNull(Formatter.arrayOf(hash)),
            baseFeePerGas: Formatter.allowNull(bigNumber)
        };
        formats.blockWithTransactions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"])(formats.block);
        formats.blockWithTransactions.transactions = Formatter.allowNull(Formatter.arrayOf(this.transactionResponse.bind(this)));
        formats.filter = {
            fromBlock: Formatter.allowNull(blockTag, undefined),
            toBlock: Formatter.allowNull(blockTag, undefined),
            blockHash: Formatter.allowNull(hash, undefined),
            address: Formatter.allowNull(address, undefined),
            topics: Formatter.allowNull(this.topics.bind(this), undefined)
        };
        formats.filterLog = {
            blockNumber: Formatter.allowNull(number),
            blockHash: Formatter.allowNull(hash),
            transactionIndex: number,
            removed: Formatter.allowNull(this.boolean.bind(this)),
            address: address,
            data: Formatter.allowFalsish(data, "0x"),
            topics: Formatter.arrayOf(hash),
            transactionHash: hash,
            logIndex: number
        };
        return formats;
    }
    accessList(accessList) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$transactions$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$transactions$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accessListify"])(accessList || []);
    }
    // Requires a BigNumberish that is within the IEEE754 safe integer range; returns a number
    // Strict! Used on input.
    number(number) {
        if (number === "0x") {
            return 0;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(number).toNumber();
    }
    type(number) {
        if (number === "0x" || number == null) {
            return 0;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(number).toNumber();
    }
    // Strict! Used on input.
    bigNumber(value) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(value);
    }
    // Requires a boolean, "true" or  "false"; returns a boolean
    boolean(value) {
        if (typeof value === "boolean") {
            return value;
        }
        if (typeof value === "string") {
            value = value.toLowerCase();
            if (value === "true") {
                return true;
            }
            if (value === "false") {
                return false;
            }
        }
        throw new Error("invalid boolean - " + value);
    }
    hex(value, strict) {
        if (typeof value === "string") {
            if (!strict && value.substring(0, 2) !== "0x") {
                value = "0x" + value;
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(value)) {
                return value.toLowerCase();
            }
        }
        return logger.throwArgumentError("invalid hash", "value", value);
    }
    data(value, strict) {
        const result = this.hex(value, strict);
        if (result.length % 2 !== 0) {
            throw new Error("invalid data; odd-length - " + value);
        }
        return result;
    }
    // Requires an address
    // Strict! Used on input.
    address(value) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$address$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$address$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAddress"])(value);
    }
    callAddress(value) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(value, 32)) {
            return null;
        }
        const address = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$address$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$address$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAddress"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])(value, 12));
        return address === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$constants$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$constants$2f$lib$2e$esm$2f$addresses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddressZero"] ? null : address;
    }
    contractAddress(value) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$address$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$address$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getContractAddress"])(value);
    }
    // Strict! Used on input.
    blockTag(blockTag) {
        if (blockTag == null) {
            return "latest";
        }
        if (blockTag === "earliest") {
            return "0x0";
        }
        switch(blockTag){
            case "earliest":
                return "0x0";
            case "latest":
            case "pending":
            case "safe":
            case "finalized":
                return blockTag;
        }
        if (typeof blockTag === "number" || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(blockTag)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexValue"])(blockTag);
        }
        throw new Error("invalid blockTag");
    }
    // Requires a hash, optionally requires 0x prefix; returns prefixed lowercase hash.
    hash(value, strict) {
        const result = this.hex(value, strict);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataLength"])(result) !== 32) {
            return logger.throwArgumentError("invalid hash", "value", value);
        }
        return result;
    }
    // Returns the difficulty as a number, or if too large (i.e. PoA network) null
    difficulty(value) {
        if (value == null) {
            return null;
        }
        const v = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(value);
        try {
            return v.toNumber();
        } catch (error) {}
        return null;
    }
    uint256(value) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(value)) {
            throw new Error("invalid uint256");
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexZeroPad"])(value, 32);
    }
    _block(value, format) {
        if (value.author != null && value.miner == null) {
            value.miner = value.author;
        }
        // The difficulty may need to come from _difficulty in recursed blocks
        const difficulty = value._difficulty != null ? value._difficulty : value.difficulty;
        const result = Formatter.check(format, value);
        result._difficulty = difficulty == null ? null : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(difficulty);
        return result;
    }
    block(value) {
        return this._block(value, this.formats.block);
    }
    blockWithTransactions(value) {
        return this._block(value, this.formats.blockWithTransactions);
    }
    // Strict! Used on input.
    transactionRequest(value) {
        return Formatter.check(this.formats.transactionRequest, value);
    }
    transactionResponse(transaction) {
        // Rename gas to gasLimit
        if (transaction.gas != null && transaction.gasLimit == null) {
            transaction.gasLimit = transaction.gas;
        }
        // Some clients (TestRPC) do strange things like return 0x0 for the
        // 0 address; correct this to be a real address
        if (transaction.to && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(transaction.to).isZero()) {
            transaction.to = "0x0000000000000000000000000000000000000000";
        }
        // Rename input to data
        if (transaction.input != null && transaction.data == null) {
            transaction.data = transaction.input;
        }
        // If to and creates are empty, populate the creates from the transaction
        if (transaction.to == null && transaction.creates == null) {
            transaction.creates = this.contractAddress(transaction);
        }
        if ((transaction.type === 1 || transaction.type === 2) && transaction.accessList == null) {
            transaction.accessList = [];
        }
        const result = Formatter.check(this.formats.transaction, transaction);
        if (transaction.chainId != null) {
            let chainId = transaction.chainId;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(chainId)) {
                chainId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(chainId).toNumber();
            }
            result.chainId = chainId;
        } else {
            let chainId = transaction.networkId;
            // geth-etc returns chainId
            if (chainId == null && result.v == null) {
                chainId = transaction.chainId;
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(chainId)) {
                chainId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(chainId).toNumber();
            }
            if (typeof chainId !== "number" && result.v != null) {
                chainId = (result.v - 35) / 2;
                if (chainId < 0) {
                    chainId = 0;
                }
                chainId = parseInt(chainId);
            }
            if (typeof chainId !== "number") {
                chainId = 0;
            }
            result.chainId = chainId;
        }
        // 0x0000... should actually be null
        if (result.blockHash && result.blockHash.replace(/0/g, "") === "x") {
            result.blockHash = null;
        }
        return result;
    }
    transaction(value) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$transactions$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$transactions$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parse"])(value);
    }
    receiptLog(value) {
        return Formatter.check(this.formats.receiptLog, value);
    }
    receipt(value) {
        const result = Formatter.check(this.formats.receipt, value);
        // RSK incorrectly implemented EIP-658, so we munge things a bit here for it
        if (result.root != null) {
            if (result.root.length <= 4) {
                // Could be 0x00, 0x0, 0x01 or 0x1
                const value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(result.root).toNumber();
                if (value === 0 || value === 1) {
                    // Make sure if both are specified, they match
                    if (result.status != null && result.status !== value) {
                        logger.throwArgumentError("alt-root-status/status mismatch", "value", {
                            root: result.root,
                            status: result.status
                        });
                    }
                    result.status = value;
                    delete result.root;
                } else {
                    logger.throwArgumentError("invalid alt-root-status", "value.root", result.root);
                }
            } else if (result.root.length !== 66) {
                // Must be a valid bytes32
                logger.throwArgumentError("invalid root hash", "value.root", result.root);
            }
        }
        if (result.status != null) {
            result.byzantium = true;
        }
        return result;
    }
    topics(value) {
        if (Array.isArray(value)) {
            return value.map((v)=>this.topics(v));
        } else if (value != null) {
            return this.hash(value, true);
        }
        return null;
    }
    filter(value) {
        return Formatter.check(this.formats.filter, value);
    }
    filterLog(value) {
        return Formatter.check(this.formats.filterLog, value);
    }
    static check(format, object) {
        const result = {};
        for(const key in format){
            try {
                const value = format[key](object[key]);
                if (value !== undefined) {
                    result[key] = value;
                }
            } catch (error) {
                error.checkKey = key;
                error.checkValue = object[key];
                throw error;
            }
        }
        return result;
    }
    // if value is null-ish, nullValue is returned
    static allowNull(format, nullValue) {
        return function(value) {
            if (value == null) {
                return nullValue;
            }
            return format(value);
        };
    }
    // If value is false-ish, replaceValue is returned
    static allowFalsish(format, replaceValue) {
        return function(value) {
            if (!value) {
                return replaceValue;
            }
            return format(value);
        };
    }
    // Requires an Array satisfying check
    static arrayOf(format) {
        return function(array) {
            if (!Array.isArray(array)) {
                throw new Error("not an array");
            }
            const result = [];
            array.forEach(function(value) {
                result.push(format(value));
            });
            return result;
        };
    }
}
function isCommunityResourcable(value) {
    return value && typeof value.isCommunityResource === "function";
}
function isCommunityResource(value) {
    return isCommunityResourcable(value) && value.isCommunityResource();
}
// Show the throttle message only once
let throttleMessage = false;
function showThrottleMessage() {
    if (throttleMessage) {
        return;
    }
    throttleMessage = true;
    console.log("========= NOTICE =========");
    console.log("Request-Rate Exceeded  (this message will not be repeated)");
    console.log("");
    console.log("The default API keys for each service are provided as a highly-throttled,");
    console.log("community resource for low-traffic projects and early prototyping.");
    console.log("");
    console.log("While your application will continue to function, we highly recommended");
    console.log("signing up for your own API keys to improve performance, increase your");
    console.log("request rate/limit and enable other perks, such as metrics and advanced APIs.");
    console.log("");
    console.log("For more details: https:/\/docs.ethers.io/api-keys/");
    console.log("==========================");
} //# sourceMappingURL=formatter.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/base-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "BaseProvider": (()=>BaseProvider),
    "Event": (()=>Event),
    "Resolver": (()=>Resolver)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bech32$40$1$2e$1$2e$4$2f$node_modules$2f$bech32$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/bech32@1.1.4/node_modules/bech32/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bignumber@5.7.0/node_modules/@ethersproject/bignumber/lib.esm/bignumber.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bytes@5.7.0/node_modules/@ethersproject/bytes/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$namehash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+hash@5.7.0/node_modules/@ethersproject/hash/lib.esm/namehash.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$constants$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$constants$2f$lib$2e$esm$2f$hashes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+constants@5.7.0/node_modules/@ethersproject/constants/lib.esm/hashes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+web@5.7.1/node_modules/@ethersproject/web/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$basex$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$basex$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+basex@5.7.0/node_modules/@ethersproject/basex/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$base64$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$base64$2f$lib$2e$esm$2f$base64$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+base64@5.7.0/node_modules/@ethersproject/base64/lib.esm/base64.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$strings$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$strings$2f$lib$2e$esm$2f$utf8$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+strings@5.7.0/node_modules/@ethersproject/strings/lib.esm/utf8.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/formatter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$networks$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$networks$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+networks@5.7.1/node_modules/@ethersproject/networks/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abstract$2d$provider$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abstract$2d$provider$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abstract-provider@5.7.0/node_modules/@ethersproject/abstract-provider/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$sha2$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$sha2$2f$lib$2e$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+sha2@5.7.0/node_modules/@ethersproject/sha2/lib.esm/sha2.js [app-client] (ecmascript)");
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
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
;
const MAX_CCIP_REDIRECTS = 10;
//////////////////////////////
// Event Serializeing
function checkTopic(topic) {
    if (topic == null) {
        return "null";
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataLength"])(topic) !== 32) {
        logger.throwArgumentError("invalid topic", "topic", topic);
    }
    return topic.toLowerCase();
}
function serializeTopics(topics) {
    // Remove trailing null AND-topics; they are redundant
    topics = topics.slice();
    while(topics.length > 0 && topics[topics.length - 1] == null){
        topics.pop();
    }
    return topics.map((topic)=>{
        if (Array.isArray(topic)) {
            // Only track unique OR-topics
            const unique = {};
            topic.forEach((topic)=>{
                unique[checkTopic(topic)] = true;
            });
            // The order of OR-topics does not matter
            const sorted = Object.keys(unique);
            sorted.sort();
            return sorted.join("|");
        } else {
            return checkTopic(topic);
        }
    }).join("&");
}
function deserializeTopics(data) {
    if (data === "") {
        return [];
    }
    return data.split(/&/g).map((topic)=>{
        if (topic === "") {
            return [];
        }
        const comps = topic.split("|").map((topic)=>{
            return topic === "null" ? null : topic;
        });
        return comps.length === 1 ? comps[0] : comps;
    });
}
function getEventTag(eventName) {
    if (typeof eventName === "string") {
        eventName = eventName.toLowerCase();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataLength"])(eventName) === 32) {
            return "tx:" + eventName;
        }
        if (eventName.indexOf(":") === -1) {
            return eventName;
        }
    } else if (Array.isArray(eventName)) {
        return "filter:*:" + serializeTopics(eventName);
    } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abstract$2d$provider$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abstract$2d$provider$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ForkEvent"].isForkEvent(eventName)) {
        logger.warn("not implemented");
        throw new Error("not implemented");
    } else if (eventName && typeof eventName === "object") {
        return "filter:" + (eventName.address || "*") + ":" + serializeTopics(eventName.topics || []);
    }
    throw new Error("invalid event - " + eventName);
}
//////////////////////////////
// Helper Object
function getTime() {
    return new Date().getTime();
}
function stall(duration) {
    return new Promise((resolve)=>{
        setTimeout(resolve, duration);
    });
}
//////////////////////////////
// Provider Object
/**
 *  EventType
 *   - "block"
 *   - "poll"
 *   - "didPoll"
 *   - "pending"
 *   - "error"
 *   - "network"
 *   - filter
 *   - topics array
 *   - transaction hash
 */ const PollableEvents = [
    "block",
    "network",
    "pending",
    "poll"
];
class Event {
    constructor(tag, listener, once){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "tag", tag);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "listener", listener);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "once", once);
        this._lastBlockNumber = -2;
        this._inflight = false;
    }
    get event() {
        switch(this.type){
            case "tx":
                return this.hash;
            case "filter":
                return this.filter;
        }
        return this.tag;
    }
    get type() {
        return this.tag.split(":")[0];
    }
    get hash() {
        const comps = this.tag.split(":");
        if (comps[0] !== "tx") {
            return null;
        }
        return comps[1];
    }
    get filter() {
        const comps = this.tag.split(":");
        if (comps[0] !== "filter") {
            return null;
        }
        const address = comps[1];
        const topics = deserializeTopics(comps[2]);
        const filter = {};
        if (topics.length > 0) {
            filter.topics = topics;
        }
        if (address && address !== "*") {
            filter.address = address;
        }
        return filter;
    }
    pollable() {
        return this.tag.indexOf(":") >= 0 || PollableEvents.indexOf(this.tag) >= 0;
    }
}
;
// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const coinInfos = {
    "0": {
        symbol: "btc",
        p2pkh: 0x00,
        p2sh: 0x05,
        prefix: "bc"
    },
    "2": {
        symbol: "ltc",
        p2pkh: 0x30,
        p2sh: 0x32,
        prefix: "ltc"
    },
    "3": {
        symbol: "doge",
        p2pkh: 0x1e,
        p2sh: 0x16
    },
    "60": {
        symbol: "eth",
        ilk: "eth"
    },
    "61": {
        symbol: "etc",
        ilk: "eth"
    },
    "700": {
        symbol: "xdai",
        ilk: "eth"
    }
};
function bytes32ify(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexZeroPad"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(value).toHexString(), 32);
}
// Compute the Base58Check encoded data (checksum is first 4 bytes of sha256d)
function base58Encode(data) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$basex$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$basex$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Base58"].encode((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concat"])([
        data,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$sha2$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$sha2$2f$lib$2e$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$sha2$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$sha2$2f$lib$2e$esm$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"])(data)), 0, 4)
    ]));
}
const matcherIpfs = new RegExp("^(ipfs):/\/(.*)$", "i");
const matchers = [
    new RegExp("^(https):/\/(.*)$", "i"),
    new RegExp("^(data):(.*)$", "i"),
    matcherIpfs,
    new RegExp("^eip155:[0-9]+/(erc[0-9]+):(.*)$", "i")
];
function _parseString(result, start) {
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$strings$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$strings$2f$lib$2e$esm$2f$utf8$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toUtf8String"])(_parseBytes(result, start));
    } catch (error) {}
    return null;
}
function _parseBytes(result, start) {
    if (result === "0x") {
        return null;
    }
    const offset = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])(result, start, start + 32)).toNumber();
    const length = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])(result, offset, offset + 32)).toNumber();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])(result, offset + 32, offset + 32 + length);
}
// Trim off the ipfs:// prefix and return the default gateway URL
function getIpfsLink(link) {
    if (link.match(/^ipfs:\/\/ipfs\//i)) {
        link = link.substring(12);
    } else if (link.match(/^ipfs:\/\//i)) {
        link = link.substring(7);
    } else {
        logger.throwArgumentError("unsupported IPFS format", "link", link);
    }
    return `https:/\/gateway.ipfs.io/ipfs/${link}`;
}
function numPad(value) {
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayify"])(value);
    if (result.length > 32) {
        throw new Error("internal; should not happen");
    }
    const padded = new Uint8Array(32);
    padded.set(result, 32 - result.length);
    return padded;
}
function bytesPad(value) {
    if (value.length % 32 === 0) {
        return value;
    }
    const result = new Uint8Array(Math.ceil(value.length / 32) * 32);
    result.set(value);
    return result;
}
// ABI Encodes a series of (bytes, bytes, ...)
function encodeBytes(datas) {
    const result = [];
    let byteCount = 0;
    // Add place-holders for pointers as we add items
    for(let i = 0; i < datas.length; i++){
        result.push(null);
        byteCount += 32;
    }
    for(let i = 0; i < datas.length; i++){
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayify"])(datas[i]);
        // Update the bytes offset
        result[i] = numPad(byteCount);
        // The length and padded value of data
        result.push(numPad(data.length));
        result.push(bytesPad(data));
        byteCount += 32 + Math.ceil(data.length / 32) * 32;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexConcat"])(result);
}
class Resolver {
    // The resolvedAddress is only for creating a ReverseLookup resolver
    constructor(provider, address, name, resolvedAddress){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "provider", provider);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "name", name);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "address", provider.formatter.address(address));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_resolvedAddress", resolvedAddress);
    }
    supportsWildcard() {
        if (!this._supportsEip2544) {
            // supportsInterface(bytes4 = selector("resolve(bytes,bytes)"))
            this._supportsEip2544 = this.provider.call({
                to: this.address,
                data: "0x01ffc9a79061b92300000000000000000000000000000000000000000000000000000000"
            }).then((result)=>{
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(result).eq(1);
            }).catch((error)=>{
                if (error.code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION) {
                    return false;
                }
                // Rethrow the error: link is down, etc. Let future attempts retry.
                this._supportsEip2544 = null;
                throw error;
            });
        }
        return this._supportsEip2544;
    }
    _fetch(selector, parameters) {
        return __awaiter(this, void 0, void 0, function*() {
            // e.g. keccak256("addr(bytes32,uint256)")
            const tx = {
                to: this.address,
                ccipReadEnabled: true,
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexConcat"])([
                    selector,
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$namehash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["namehash"])(this.name),
                    parameters || "0x"
                ])
            };
            // Wildcard support; use EIP-2544 to resolve the request
            let parseBytes = false;
            if (yield this.supportsWildcard()) {
                parseBytes = true;
                // selector("resolve(bytes,bytes)")
                tx.data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexConcat"])([
                    "0x9061b923",
                    encodeBytes([
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$namehash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dnsEncode"])(this.name),
                        tx.data
                    ])
                ]);
            }
            try {
                let result = yield this.provider.call(tx);
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayify"])(result).length % 32 === 4) {
                    logger.throwError("resolver threw error", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION, {
                        transaction: tx,
                        data: result
                    });
                }
                if (parseBytes) {
                    result = _parseBytes(result, 0);
                }
                return result;
            } catch (error) {
                if (error.code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION) {
                    return null;
                }
                throw error;
            }
        });
    }
    _fetchBytes(selector, parameters) {
        return __awaiter(this, void 0, void 0, function*() {
            const result = yield this._fetch(selector, parameters);
            if (result != null) {
                return _parseBytes(result, 0);
            }
            return null;
        });
    }
    _getAddress(coinType, hexBytes) {
        const coinInfo = coinInfos[String(coinType)];
        if (coinInfo == null) {
            logger.throwError(`unsupported coin type: ${coinType}`, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                operation: `getAddress(${coinType})`
            });
        }
        if (coinInfo.ilk === "eth") {
            return this.provider.formatter.address(hexBytes);
        }
        const bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayify"])(hexBytes);
        // P2PKH: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
        if (coinInfo.p2pkh != null) {
            const p2pkh = hexBytes.match(/^0x76a9([0-9a-f][0-9a-f])([0-9a-f]*)88ac$/);
            if (p2pkh) {
                const length = parseInt(p2pkh[1], 16);
                if (p2pkh[2].length === length * 2 && length >= 1 && length <= 75) {
                    return base58Encode((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concat"])([
                        [
                            coinInfo.p2pkh
                        ],
                        "0x" + p2pkh[2]
                    ]));
                }
            }
        }
        // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
        if (coinInfo.p2sh != null) {
            const p2sh = hexBytes.match(/^0xa9([0-9a-f][0-9a-f])([0-9a-f]*)87$/);
            if (p2sh) {
                const length = parseInt(p2sh[1], 16);
                if (p2sh[2].length === length * 2 && length >= 1 && length <= 75) {
                    return base58Encode((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concat"])([
                        [
                            coinInfo.p2sh
                        ],
                        "0x" + p2sh[2]
                    ]));
                }
            }
        }
        // Bech32
        if (coinInfo.prefix != null) {
            const length = bytes[1];
            // https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki#witness-program
            let version = bytes[0];
            if (version === 0x00) {
                if (length !== 20 && length !== 32) {
                    version = -1;
                }
            } else {
                version = -1;
            }
            if (version >= 0 && bytes.length === 2 + length && length >= 1 && length <= 75) {
                const words = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bech32$40$1$2e$1$2e$4$2f$node_modules$2f$bech32$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].toWords(bytes.slice(2));
                words.unshift(version);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bech32$40$1$2e$1$2e$4$2f$node_modules$2f$bech32$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].encode(coinInfo.prefix, words);
            }
        }
        return null;
    }
    getAddress(coinType) {
        return __awaiter(this, void 0, void 0, function*() {
            if (coinType == null) {
                coinType = 60;
            }
            // If Ethereum, use the standard `addr(bytes32)`
            if (coinType === 60) {
                try {
                    // keccak256("addr(bytes32)")
                    const result = yield this._fetch("0x3b3b57de");
                    // No address
                    if (result === "0x" || result === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$constants$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$constants$2f$lib$2e$esm$2f$hashes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HashZero"]) {
                        return null;
                    }
                    return this.provider.formatter.callAddress(result);
                } catch (error) {
                    if (error.code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION) {
                        return null;
                    }
                    throw error;
                }
            }
            // keccak256("addr(bytes32,uint256")
            const hexBytes = yield this._fetchBytes("0xf1cb7e06", bytes32ify(coinType));
            // No address
            if (hexBytes == null || hexBytes === "0x") {
                return null;
            }
            // Compute the address
            const address = this._getAddress(coinType, hexBytes);
            if (address == null) {
                logger.throwError(`invalid or unsupported coin data`, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                    operation: `getAddress(${coinType})`,
                    coinType: coinType,
                    data: hexBytes
                });
            }
            return address;
        });
    }
    getAvatar() {
        return __awaiter(this, void 0, void 0, function*() {
            const linkage = [
                {
                    type: "name",
                    content: this.name
                }
            ];
            try {
                // test data for ricmoo.eth
                //const avatar = "eip155:1/erc721:0x265385c7f4132228A0d54EB1A9e7460b91c0cC68/29233";
                const avatar = yield this.getText("avatar");
                if (avatar == null) {
                    return null;
                }
                for(let i = 0; i < matchers.length; i++){
                    const match = avatar.match(matchers[i]);
                    if (match == null) {
                        continue;
                    }
                    const scheme = match[1].toLowerCase();
                    switch(scheme){
                        case "https":
                            linkage.push({
                                type: "url",
                                content: avatar
                            });
                            return {
                                linkage,
                                url: avatar
                            };
                        case "data":
                            linkage.push({
                                type: "data",
                                content: avatar
                            });
                            return {
                                linkage,
                                url: avatar
                            };
                        case "ipfs":
                            linkage.push({
                                type: "ipfs",
                                content: avatar
                            });
                            return {
                                linkage,
                                url: getIpfsLink(avatar)
                            };
                        case "erc721":
                        case "erc1155":
                            {
                                // Depending on the ERC type, use tokenURI(uint256) or url(uint256)
                                const selector = scheme === "erc721" ? "0xc87b56dd" : "0x0e89341c";
                                linkage.push({
                                    type: scheme,
                                    content: avatar
                                });
                                // The owner of this name
                                const owner = this._resolvedAddress || (yield this.getAddress());
                                const comps = (match[2] || "").split("/");
                                if (comps.length !== 2) {
                                    return null;
                                }
                                const addr = yield this.provider.formatter.address(comps[0]);
                                const tokenId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexZeroPad"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(comps[1]).toHexString(), 32);
                                // Check that this account owns the token
                                if (scheme === "erc721") {
                                    // ownerOf(uint256 tokenId)
                                    const tokenOwner = this.provider.formatter.callAddress((yield this.provider.call({
                                        to: addr,
                                        data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexConcat"])([
                                            "0x6352211e",
                                            tokenId
                                        ])
                                    })));
                                    if (owner !== tokenOwner) {
                                        return null;
                                    }
                                    linkage.push({
                                        type: "owner",
                                        content: tokenOwner
                                    });
                                } else if (scheme === "erc1155") {
                                    // balanceOf(address owner, uint256 tokenId)
                                    const balance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from((yield this.provider.call({
                                        to: addr,
                                        data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexConcat"])([
                                            "0x00fdd58e",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexZeroPad"])(owner, 32),
                                            tokenId
                                        ])
                                    })));
                                    if (balance.isZero()) {
                                        return null;
                                    }
                                    linkage.push({
                                        type: "balance",
                                        content: balance.toString()
                                    });
                                }
                                // Call the token contract for the metadata URL
                                const tx = {
                                    to: this.provider.formatter.address(comps[0]),
                                    data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexConcat"])([
                                        selector,
                                        tokenId
                                    ])
                                };
                                let metadataUrl = _parseString((yield this.provider.call(tx)), 0);
                                if (metadataUrl == null) {
                                    return null;
                                }
                                linkage.push({
                                    type: "metadata-url-base",
                                    content: metadataUrl
                                });
                                // ERC-1155 allows a generic {id} in the URL
                                if (scheme === "erc1155") {
                                    metadataUrl = metadataUrl.replace("{id}", tokenId.substring(2));
                                    linkage.push({
                                        type: "metadata-url-expanded",
                                        content: metadataUrl
                                    });
                                }
                                // Transform IPFS metadata links
                                if (metadataUrl.match(/^ipfs:/i)) {
                                    metadataUrl = getIpfsLink(metadataUrl);
                                }
                                linkage.push({
                                    type: "metadata-url",
                                    content: metadataUrl
                                });
                                // Get the token metadata
                                const metadata = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(metadataUrl);
                                if (!metadata) {
                                    return null;
                                }
                                linkage.push({
                                    type: "metadata",
                                    content: JSON.stringify(metadata)
                                });
                                // Pull the image URL out
                                let imageUrl = metadata.image;
                                if (typeof imageUrl !== "string") {
                                    return null;
                                }
                                if (imageUrl.match(/^(https:\/\/|data:)/i)) {
                                // Allow
                                } else {
                                    // Transform IPFS link to gateway
                                    const ipfs = imageUrl.match(matcherIpfs);
                                    if (ipfs == null) {
                                        return null;
                                    }
                                    linkage.push({
                                        type: "url-ipfs",
                                        content: imageUrl
                                    });
                                    imageUrl = getIpfsLink(imageUrl);
                                }
                                linkage.push({
                                    type: "url",
                                    content: imageUrl
                                });
                                return {
                                    linkage,
                                    url: imageUrl
                                };
                            }
                    }
                }
            } catch (error) {}
            return null;
        });
    }
    getContentHash() {
        return __awaiter(this, void 0, void 0, function*() {
            // keccak256("contenthash()")
            const hexBytes = yield this._fetchBytes("0xbc1c58d1");
            // No contenthash
            if (hexBytes == null || hexBytes === "0x") {
                return null;
            }
            // IPFS (CID: 1, Type: DAG-PB)
            const ipfs = hexBytes.match(/^0xe3010170(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/);
            if (ipfs) {
                const length = parseInt(ipfs[3], 16);
                if (ipfs[4].length === length * 2) {
                    return "ipfs:/\/" + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$basex$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$basex$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Base58"].encode("0x" + ipfs[1]);
                }
            }
            // IPNS (CID: 1, Type: libp2p-key)
            const ipns = hexBytes.match(/^0xe5010172(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/);
            if (ipns) {
                const length = parseInt(ipns[3], 16);
                if (ipns[4].length === length * 2) {
                    return "ipns:/\/" + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$basex$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$basex$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Base58"].encode("0x" + ipns[1]);
                }
            }
            // Swarm (CID: 1, Type: swarm-manifest; hash/length hard-coded to keccak256/32)
            const swarm = hexBytes.match(/^0xe40101fa011b20([0-9a-f]*)$/);
            if (swarm) {
                if (swarm[1].length === 32 * 2) {
                    return "bzz:/\/" + swarm[1];
                }
            }
            const skynet = hexBytes.match(/^0x90b2c605([0-9a-f]*)$/);
            if (skynet) {
                if (skynet[1].length === 34 * 2) {
                    // URL Safe base64; https://datatracker.ietf.org/doc/html/rfc4648#section-5
                    const urlSafe = {
                        "=": "",
                        "+": "-",
                        "/": "_"
                    };
                    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$base64$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$base64$2f$lib$2e$esm$2f$base64$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encode"])("0x" + skynet[1]).replace(/[=+\/]/g, (a)=>urlSafe[a]);
                    return "sia:/\/" + hash;
                }
            }
            return logger.throwError(`invalid or unsupported content hash data`, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                operation: "getContentHash()",
                data: hexBytes
            });
        });
    }
    getText(key) {
        return __awaiter(this, void 0, void 0, function*() {
            // The key encoded as parameter to fetchBytes
            let keyBytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$strings$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$strings$2f$lib$2e$esm$2f$utf8$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toUtf8Bytes"])(key);
            // The nodehash consumes the first slot, so the string pointer targets
            // offset 64, with the length at offset 64 and data starting at offset 96
            keyBytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concat"])([
                bytes32ify(64),
                bytes32ify(keyBytes.length),
                keyBytes
            ]);
            // Pad to word-size (32 bytes)
            if (keyBytes.length % 32 !== 0) {
                keyBytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concat"])([
                    keyBytes,
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexZeroPad"])("0x", 32 - key.length % 32)
                ]);
            }
            const hexBytes = yield this._fetchBytes("0x59d1d43c", (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexlify"])(keyBytes));
            if (hexBytes == null || hexBytes === "0x") {
                return null;
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$strings$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$strings$2f$lib$2e$esm$2f$utf8$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toUtf8String"])(hexBytes);
        });
    }
}
let defaultFormatter = null;
let nextPollId = 1;
class BaseProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abstract$2d$provider$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abstract$2d$provider$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"] {
    /**
     *  ready
     *
     *  A Promise<Network> that resolves only once the provider is ready.
     *
     *  Sub-classes that call the super with a network without a chainId
     *  MUST set this. Standard named networks have a known chainId.
     *
     */ constructor(network){
        super();
        // Events being listened to
        this._events = [];
        this._emitted = {
            block: -2
        };
        this.disableCcipRead = false;
        this.formatter = new.target.getFormatter();
        // If network is any, this Provider allows the underlying
        // network to change dynamically, and we auto-detect the
        // current network
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "anyNetwork", network === "any");
        if (this.anyNetwork) {
            network = this.detectNetwork();
        }
        if (network instanceof Promise) {
            this._networkPromise = network;
            // Squash any "unhandled promise" errors; that do not need to be handled
            network.catch((error)=>{});
            // Trigger initial network setting (async)
            this._ready().catch((error)=>{});
        } else {
            const knownNetwork = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatic"])(new.target, "getNetwork")(network);
            if (knownNetwork) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_network", knownNetwork);
                this.emit("network", knownNetwork, null);
            } else {
                logger.throwArgumentError("invalid network", "network", network);
            }
        }
        this._maxInternalBlockNumber = -1024;
        this._lastBlockNumber = -2;
        this._maxFilterBlockRange = 10;
        this._pollingInterval = 4000;
        this._fastQueryDate = 0;
    }
    _ready() {
        return __awaiter(this, void 0, void 0, function*() {
            if (this._network == null) {
                let network = null;
                if (this._networkPromise) {
                    try {
                        network = yield this._networkPromise;
                    } catch (error) {}
                }
                // Try the Provider's network detection (this MUST throw if it cannot)
                if (network == null) {
                    network = yield this.detectNetwork();
                }
                // This should never happen; every Provider sub-class should have
                // suggested a network by here (or have thrown).
                if (!network) {
                    logger.throwError("no network detected", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNKNOWN_ERROR, {});
                }
                // Possible this call stacked so do not call defineReadOnly again
                if (this._network == null) {
                    if (this.anyNetwork) {
                        this._network = network;
                    } else {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_network", network);
                    }
                    this.emit("network", network, null);
                }
            }
            return this._network;
        });
    }
    // This will always return the most recently established network.
    // For "any", this can change (a "network" event is emitted before
    // any change is reflected); otherwise this cannot change
    get ready() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["poll"])(()=>{
            return this._ready().then((network)=>{
                return network;
            }, (error)=>{
                // If the network isn't running yet, we will wait
                if (error.code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NETWORK_ERROR && error.event === "noNetwork") {
                    return undefined;
                }
                throw error;
            });
        });
    }
    // @TODO: Remove this and just create a singleton formatter
    static getFormatter() {
        if (defaultFormatter == null) {
            defaultFormatter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Formatter"]();
        }
        return defaultFormatter;
    }
    // @TODO: Remove this and just use getNetwork
    static getNetwork(network) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$networks$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$networks$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNetwork"])(network == null ? "homestead" : network);
    }
    ccipReadFetch(tx, calldata, urls) {
        return __awaiter(this, void 0, void 0, function*() {
            if (this.disableCcipRead || urls.length === 0) {
                return null;
            }
            const sender = tx.to.toLowerCase();
            const data = calldata.toLowerCase();
            const errorMessages = [];
            for(let i = 0; i < urls.length; i++){
                const url = urls[i];
                // URL expansion
                const href = url.replace("{sender}", sender).replace("{data}", data);
                // If no {data} is present, use POST; otherwise GET
                const json = url.indexOf("{data}") >= 0 ? null : JSON.stringify({
                    data,
                    sender
                });
                const result = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])({
                    url: href,
                    errorPassThrough: true
                }, json, (value, response)=>{
                    value.status = response.statusCode;
                    return value;
                });
                if (result.data) {
                    return result.data;
                }
                const errorMessage = result.message || "unknown error";
                // 4xx indicates the result is not present; stop
                if (result.status >= 400 && result.status < 500) {
                    return logger.throwError(`response not found during CCIP fetch: ${errorMessage}`, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR, {
                        url,
                        errorMessage
                    });
                }
                // 5xx indicates server issue; try the next url
                errorMessages.push(errorMessage);
            }
            return logger.throwError(`error encountered during CCIP fetch: ${errorMessages.map((m)=>JSON.stringify(m)).join(", ")}`, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR, {
                urls,
                errorMessages
            });
        });
    }
    // Fetches the blockNumber, but will reuse any result that is less
    // than maxAge old or has been requested since the last request
    _getInternalBlockNumber(maxAge) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this._ready();
            // Allowing stale data up to maxAge old
            if (maxAge > 0) {
                // While there are pending internal block requests...
                while(this._internalBlockNumber){
                    // ..."remember" which fetch we started with
                    const internalBlockNumber = this._internalBlockNumber;
                    try {
                        // Check the result is not too stale
                        const result = yield internalBlockNumber;
                        if (getTime() - result.respTime <= maxAge) {
                            return result.blockNumber;
                        }
                        break;
                    } catch (error) {
                        // The fetch rejected; if we are the first to get the
                        // rejection, drop through so we replace it with a new
                        // fetch; all others blocked will then get that fetch
                        // which won't match the one they "remembered" and loop
                        if (this._internalBlockNumber === internalBlockNumber) {
                            break;
                        }
                    }
                }
            }
            const reqTime = getTime();
            const checkInternalBlockNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])({
                blockNumber: this.perform("getBlockNumber", {}),
                networkError: this.getNetwork().then((network)=>null, (error)=>error)
            }).then(({ blockNumber, networkError })=>{
                if (networkError) {
                    // Unremember this bad internal block number
                    if (this._internalBlockNumber === checkInternalBlockNumber) {
                        this._internalBlockNumber = null;
                    }
                    throw networkError;
                }
                const respTime = getTime();
                blockNumber = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(blockNumber).toNumber();
                if (blockNumber < this._maxInternalBlockNumber) {
                    blockNumber = this._maxInternalBlockNumber;
                }
                this._maxInternalBlockNumber = blockNumber;
                this._setFastBlockNumber(blockNumber); // @TODO: Still need this?
                return {
                    blockNumber,
                    reqTime,
                    respTime
                };
            });
            this._internalBlockNumber = checkInternalBlockNumber;
            // Swallow unhandled exceptions; if needed they are handled else where
            checkInternalBlockNumber.catch((error)=>{
                // Don't null the dead (rejected) fetch, if it has already been updated
                if (this._internalBlockNumber === checkInternalBlockNumber) {
                    this._internalBlockNumber = null;
                }
            });
            return (yield checkInternalBlockNumber).blockNumber;
        });
    }
    poll() {
        return __awaiter(this, void 0, void 0, function*() {
            const pollId = nextPollId++;
            // Track all running promises, so we can trigger a post-poll once they are complete
            const runners = [];
            let blockNumber = null;
            try {
                blockNumber = yield this._getInternalBlockNumber(100 + this.pollingInterval / 2);
            } catch (error) {
                this.emit("error", error);
                return;
            }
            this._setFastBlockNumber(blockNumber);
            // Emit a poll event after we have the latest (fast) block number
            this.emit("poll", pollId, blockNumber);
            // If the block has not changed, meh.
            if (blockNumber === this._lastBlockNumber) {
                this.emit("didPoll", pollId);
                return;
            }
            // First polling cycle, trigger a "block" events
            if (this._emitted.block === -2) {
                this._emitted.block = blockNumber - 1;
            }
            if (Math.abs(this._emitted.block - blockNumber) > 1000) {
                logger.warn(`network block skew detected; skipping block events (emitted=${this._emitted.block} blockNumber${blockNumber})`);
                this.emit("error", logger.makeError("network block skew detected", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NETWORK_ERROR, {
                    blockNumber: blockNumber,
                    event: "blockSkew",
                    previousBlockNumber: this._emitted.block
                }));
                this.emit("block", blockNumber);
            } else {
                // Notify all listener for each block that has passed
                for(let i = this._emitted.block + 1; i <= blockNumber; i++){
                    this.emit("block", i);
                }
            }
            // The emitted block was updated, check for obsolete events
            if (this._emitted.block !== blockNumber) {
                this._emitted.block = blockNumber;
                Object.keys(this._emitted).forEach((key)=>{
                    // The block event does not expire
                    if (key === "block") {
                        return;
                    }
                    // The block we were at when we emitted this event
                    const eventBlockNumber = this._emitted[key];
                    // We cannot garbage collect pending transactions or blocks here
                    // They should be garbage collected by the Provider when setting
                    // "pending" events
                    if (eventBlockNumber === "pending") {
                        return;
                    }
                    // Evict any transaction hashes or block hashes over 12 blocks
                    // old, since they should not return null anyways
                    if (blockNumber - eventBlockNumber > 12) {
                        delete this._emitted[key];
                    }
                });
            }
            // First polling cycle
            if (this._lastBlockNumber === -2) {
                this._lastBlockNumber = blockNumber - 1;
            }
            // Find all transaction hashes we are waiting on
            this._events.forEach((event)=>{
                switch(event.type){
                    case "tx":
                        {
                            const hash = event.hash;
                            let runner = this.getTransactionReceipt(hash).then((receipt)=>{
                                if (!receipt || receipt.blockNumber == null) {
                                    return null;
                                }
                                this._emitted["t:" + hash] = receipt.blockNumber;
                                this.emit(hash, receipt);
                                return null;
                            }).catch((error)=>{
                                this.emit("error", error);
                            });
                            runners.push(runner);
                            break;
                        }
                    case "filter":
                        {
                            // We only allow a single getLogs to be in-flight at a time
                            if (!event._inflight) {
                                event._inflight = true;
                                // This is the first filter for this event, so we want to
                                // restrict events to events that happened no earlier than now
                                if (event._lastBlockNumber === -2) {
                                    event._lastBlockNumber = blockNumber - 1;
                                }
                                // Filter from the last *known* event; due to load-balancing
                                // and some nodes returning updated block numbers before
                                // indexing events, a logs result with 0 entries cannot be
                                // trusted and we must retry a range which includes it again
                                const filter = event.filter;
                                filter.fromBlock = event._lastBlockNumber + 1;
                                filter.toBlock = blockNumber;
                                // Prevent fitler ranges from growing too wild, since it is quite
                                // likely there just haven't been any events to move the lastBlockNumber.
                                const minFromBlock = filter.toBlock - this._maxFilterBlockRange;
                                if (minFromBlock > filter.fromBlock) {
                                    filter.fromBlock = minFromBlock;
                                }
                                if (filter.fromBlock < 0) {
                                    filter.fromBlock = 0;
                                }
                                const runner = this.getLogs(filter).then((logs)=>{
                                    // Allow the next getLogs
                                    event._inflight = false;
                                    if (logs.length === 0) {
                                        return;
                                    }
                                    logs.forEach((log)=>{
                                        // Only when we get an event for a given block number
                                        // can we trust the events are indexed
                                        if (log.blockNumber > event._lastBlockNumber) {
                                            event._lastBlockNumber = log.blockNumber;
                                        }
                                        // Make sure we stall requests to fetch blocks and txs
                                        this._emitted["b:" + log.blockHash] = log.blockNumber;
                                        this._emitted["t:" + log.transactionHash] = log.blockNumber;
                                        this.emit(filter, log);
                                    });
                                }).catch((error)=>{
                                    this.emit("error", error);
                                    // Allow another getLogs (the range was not updated)
                                    event._inflight = false;
                                });
                                runners.push(runner);
                            }
                            break;
                        }
                }
            });
            this._lastBlockNumber = blockNumber;
            // Once all events for this loop have been processed, emit "didPoll"
            Promise.all(runners).then(()=>{
                this.emit("didPoll", pollId);
            }).catch((error)=>{
                this.emit("error", error);
            });
            return;
        });
    }
    // Deprecated; do not use this
    resetEventsBlock(blockNumber) {
        this._lastBlockNumber = blockNumber - 1;
        if (this.polling) {
            this.poll();
        }
    }
    get network() {
        return this._network;
    }
    // This method should query the network if the underlying network
    // can change, such as when connected to a JSON-RPC backend
    detectNetwork() {
        return __awaiter(this, void 0, void 0, function*() {
            return logger.throwError("provider does not support network detection", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                operation: "provider.detectNetwork"
            });
        });
    }
    getNetwork() {
        return __awaiter(this, void 0, void 0, function*() {
            const network = yield this._ready();
            // Make sure we are still connected to the same network; this is
            // only an external call for backends which can have the underlying
            // network change spontaneously
            const currentNetwork = yield this.detectNetwork();
            if (network.chainId !== currentNetwork.chainId) {
                // We are allowing network changes, things can get complex fast;
                // make sure you know what you are doing if you use "any"
                if (this.anyNetwork) {
                    this._network = currentNetwork;
                    // Reset all internal block number guards and caches
                    this._lastBlockNumber = -2;
                    this._fastBlockNumber = null;
                    this._fastBlockNumberPromise = null;
                    this._fastQueryDate = 0;
                    this._emitted.block = -2;
                    this._maxInternalBlockNumber = -1024;
                    this._internalBlockNumber = null;
                    // The "network" event MUST happen before this method resolves
                    // so any events have a chance to unregister, so we stall an
                    // additional event loop before returning from /this/ call
                    this.emit("network", currentNetwork, network);
                    yield stall(0);
                    return this._network;
                }
                const error = logger.makeError("underlying network changed", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NETWORK_ERROR, {
                    event: "changed",
                    network: network,
                    detectedNetwork: currentNetwork
                });
                this.emit("error", error);
                throw error;
            }
            return network;
        });
    }
    get blockNumber() {
        this._getInternalBlockNumber(100 + this.pollingInterval / 2).then((blockNumber)=>{
            this._setFastBlockNumber(blockNumber);
        }, (error)=>{});
        return this._fastBlockNumber != null ? this._fastBlockNumber : -1;
    }
    get polling() {
        return this._poller != null;
    }
    set polling(value) {
        if (value && !this._poller) {
            this._poller = setInterval(()=>{
                this.poll();
            }, this.pollingInterval);
            if (!this._bootstrapPoll) {
                this._bootstrapPoll = setTimeout(()=>{
                    this.poll();
                    // We block additional polls until the polling interval
                    // is done, to prevent overwhelming the poll function
                    this._bootstrapPoll = setTimeout(()=>{
                        // If polling was disabled, something may require a poke
                        // since starting the bootstrap poll and it was disabled
                        if (!this._poller) {
                            this.poll();
                        }
                        // Clear out the bootstrap so we can do another
                        this._bootstrapPoll = null;
                    }, this.pollingInterval);
                }, 0);
            }
        } else if (!value && this._poller) {
            clearInterval(this._poller);
            this._poller = null;
        }
    }
    get pollingInterval() {
        return this._pollingInterval;
    }
    set pollingInterval(value) {
        if (typeof value !== "number" || value <= 0 || parseInt(String(value)) != value) {
            throw new Error("invalid polling interval");
        }
        this._pollingInterval = value;
        if (this._poller) {
            clearInterval(this._poller);
            this._poller = setInterval(()=>{
                this.poll();
            }, this._pollingInterval);
        }
    }
    _getFastBlockNumber() {
        const now = getTime();
        // Stale block number, request a newer value
        if (now - this._fastQueryDate > 2 * this._pollingInterval) {
            this._fastQueryDate = now;
            this._fastBlockNumberPromise = this.getBlockNumber().then((blockNumber)=>{
                if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
                    this._fastBlockNumber = blockNumber;
                }
                return this._fastBlockNumber;
            });
        }
        return this._fastBlockNumberPromise;
    }
    _setFastBlockNumber(blockNumber) {
        // Older block, maybe a stale request
        if (this._fastBlockNumber != null && blockNumber < this._fastBlockNumber) {
            return;
        }
        // Update the time we updated the blocknumber
        this._fastQueryDate = getTime();
        // Newer block number, use  it
        if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
            this._fastBlockNumber = blockNumber;
            this._fastBlockNumberPromise = Promise.resolve(blockNumber);
        }
    }
    waitForTransaction(transactionHash, confirmations, timeout) {
        return __awaiter(this, void 0, void 0, function*() {
            return this._waitForTransaction(transactionHash, confirmations == null ? 1 : confirmations, timeout || 0, null);
        });
    }
    _waitForTransaction(transactionHash, confirmations, timeout, replaceable) {
        return __awaiter(this, void 0, void 0, function*() {
            const receipt = yield this.getTransactionReceipt(transactionHash);
            // Receipt is already good
            if ((receipt ? receipt.confirmations : 0) >= confirmations) {
                return receipt;
            }
            // Poll until the receipt is good...
            return new Promise((resolve, reject)=>{
                const cancelFuncs = [];
                let done = false;
                const alreadyDone = function() {
                    if (done) {
                        return true;
                    }
                    done = true;
                    cancelFuncs.forEach((func)=>{
                        func();
                    });
                    return false;
                };
                const minedHandler = (receipt)=>{
                    if (receipt.confirmations < confirmations) {
                        return;
                    }
                    if (alreadyDone()) {
                        return;
                    }
                    resolve(receipt);
                };
                this.on(transactionHash, minedHandler);
                cancelFuncs.push(()=>{
                    this.removeListener(transactionHash, minedHandler);
                });
                if (replaceable) {
                    let lastBlockNumber = replaceable.startBlock;
                    let scannedBlock = null;
                    const replaceHandler = (blockNumber)=>__awaiter(this, void 0, void 0, function*() {
                            if (done) {
                                return;
                            }
                            // Wait 1 second; this is only used in the case of a fault, so
                            // we will trade off a little bit of latency for more consistent
                            // results and fewer JSON-RPC calls
                            yield stall(1000);
                            this.getTransactionCount(replaceable.from).then((nonce)=>__awaiter(this, void 0, void 0, function*() {
                                    if (done) {
                                        return;
                                    }
                                    if (nonce <= replaceable.nonce) {
                                        lastBlockNumber = blockNumber;
                                    } else {
                                        // First check if the transaction was mined
                                        {
                                            const mined = yield this.getTransaction(transactionHash);
                                            if (mined && mined.blockNumber != null) {
                                                return;
                                            }
                                        }
                                        // First time scanning. We start a little earlier for some
                                        // wiggle room here to handle the eventually consistent nature
                                        // of blockchain (e.g. the getTransactionCount was for a
                                        // different block)
                                        if (scannedBlock == null) {
                                            scannedBlock = lastBlockNumber - 3;
                                            if (scannedBlock < replaceable.startBlock) {
                                                scannedBlock = replaceable.startBlock;
                                            }
                                        }
                                        while(scannedBlock <= blockNumber){
                                            if (done) {
                                                return;
                                            }
                                            const block = yield this.getBlockWithTransactions(scannedBlock);
                                            for(let ti = 0; ti < block.transactions.length; ti++){
                                                const tx = block.transactions[ti];
                                                // Successfully mined!
                                                if (tx.hash === transactionHash) {
                                                    return;
                                                }
                                                // Matches our transaction from and nonce; its a replacement
                                                if (tx.from === replaceable.from && tx.nonce === replaceable.nonce) {
                                                    if (done) {
                                                        return;
                                                    }
                                                    // Get the receipt of the replacement
                                                    const receipt = yield this.waitForTransaction(tx.hash, confirmations);
                                                    // Already resolved or rejected (prolly a timeout)
                                                    if (alreadyDone()) {
                                                        return;
                                                    }
                                                    // The reason we were replaced
                                                    let reason = "replaced";
                                                    if (tx.data === replaceable.data && tx.to === replaceable.to && tx.value.eq(replaceable.value)) {
                                                        reason = "repriced";
                                                    } else if (tx.data === "0x" && tx.from === tx.to && tx.value.isZero()) {
                                                        reason = "cancelled";
                                                    }
                                                    // Explain why we were replaced
                                                    reject(logger.makeError("transaction was replaced", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.TRANSACTION_REPLACED, {
                                                        cancelled: reason === "replaced" || reason === "cancelled",
                                                        reason,
                                                        replacement: this._wrapTransaction(tx),
                                                        hash: transactionHash,
                                                        receipt
                                                    }));
                                                    return;
                                                }
                                            }
                                            scannedBlock++;
                                        }
                                    }
                                    if (done) {
                                        return;
                                    }
                                    this.once("block", replaceHandler);
                                }), (error)=>{
                                if (done) {
                                    return;
                                }
                                this.once("block", replaceHandler);
                            });
                        });
                    if (done) {
                        return;
                    }
                    this.once("block", replaceHandler);
                    cancelFuncs.push(()=>{
                        this.removeListener("block", replaceHandler);
                    });
                }
                if (typeof timeout === "number" && timeout > 0) {
                    const timer = setTimeout(()=>{
                        if (alreadyDone()) {
                            return;
                        }
                        reject(logger.makeError("timeout exceeded", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.TIMEOUT, {
                            timeout: timeout
                        }));
                    }, timeout);
                    if (timer.unref) {
                        timer.unref();
                    }
                    cancelFuncs.push(()=>{
                        clearTimeout(timer);
                    });
                }
            });
        });
    }
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function*() {
            return this._getInternalBlockNumber(0);
        });
    }
    getGasPrice() {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            const result = yield this.perform("getGasPrice", {});
            try {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(result);
            } catch (error) {
                return logger.throwError("bad result from backend", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR, {
                    method: "getGasPrice",
                    result,
                    error
                });
            }
        });
    }
    getBalance(addressOrName, blockTag) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            const params = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag)
            });
            const result = yield this.perform("getBalance", params);
            try {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(result);
            } catch (error) {
                return logger.throwError("bad result from backend", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR, {
                    method: "getBalance",
                    params,
                    result,
                    error
                });
            }
        });
    }
    getTransactionCount(addressOrName, blockTag) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            const params = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag)
            });
            const result = yield this.perform("getTransactionCount", params);
            try {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(result).toNumber();
            } catch (error) {
                return logger.throwError("bad result from backend", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR, {
                    method: "getTransactionCount",
                    params,
                    result,
                    error
                });
            }
        });
    }
    getCode(addressOrName, blockTag) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            const params = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag)
            });
            const result = yield this.perform("getCode", params);
            try {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexlify"])(result);
            } catch (error) {
                return logger.throwError("bad result from backend", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR, {
                    method: "getCode",
                    params,
                    result,
                    error
                });
            }
        });
    }
    getStorageAt(addressOrName, position, blockTag) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            const params = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag),
                position: Promise.resolve(position).then((p)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexValue"])(p))
            });
            const result = yield this.perform("getStorageAt", params);
            try {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexlify"])(result);
            } catch (error) {
                return logger.throwError("bad result from backend", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR, {
                    method: "getStorageAt",
                    params,
                    result,
                    error
                });
            }
        });
    }
    // This should be called by any subclass wrapping a TransactionResponse
    _wrapTransaction(tx, hash, startBlock) {
        if (hash != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataLength"])(hash) !== 32) {
            throw new Error("invalid response - sendTransaction");
        }
        const result = tx;
        // Check the hash we expect is the same as the hash the server reported
        if (hash != null && tx.hash !== hash) {
            logger.throwError("Transaction hash mismatch from Provider.sendTransaction.", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNKNOWN_ERROR, {
                expectedHash: tx.hash,
                returnedHash: hash
            });
        }
        result.wait = (confirms, timeout)=>__awaiter(this, void 0, void 0, function*() {
                if (confirms == null) {
                    confirms = 1;
                }
                if (timeout == null) {
                    timeout = 0;
                }
                // Get the details to detect replacement
                let replacement = undefined;
                if (confirms !== 0 && startBlock != null) {
                    replacement = {
                        data: tx.data,
                        from: tx.from,
                        nonce: tx.nonce,
                        to: tx.to,
                        value: tx.value,
                        startBlock
                    };
                }
                const receipt = yield this._waitForTransaction(tx.hash, confirms, timeout, replacement);
                if (receipt == null && confirms === 0) {
                    return null;
                }
                // No longer pending, allow the polling loop to garbage collect this
                this._emitted["t:" + tx.hash] = receipt.blockNumber;
                if (receipt.status === 0) {
                    logger.throwError("transaction failed", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION, {
                        transactionHash: tx.hash,
                        transaction: tx,
                        receipt: receipt
                    });
                }
                return receipt;
            });
        return result;
    }
    sendTransaction(signedTransaction) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            const hexTx = yield Promise.resolve(signedTransaction).then((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexlify"])(t));
            const tx = this.formatter.transaction(signedTransaction);
            if (tx.confirmations == null) {
                tx.confirmations = 0;
            }
            const blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
            try {
                const hash = yield this.perform("sendTransaction", {
                    signedTransaction: hexTx
                });
                return this._wrapTransaction(tx, hash, blockNumber);
            } catch (error) {
                error.transaction = tx;
                error.transactionHash = tx.hash;
                throw error;
            }
        });
    }
    _getTransactionRequest(transaction) {
        return __awaiter(this, void 0, void 0, function*() {
            const values = yield transaction;
            const tx = {};
            [
                "from",
                "to"
            ].forEach((key)=>{
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v)=>v ? this._getAddress(v) : null);
            });
            [
                "gasLimit",
                "gasPrice",
                "maxFeePerGas",
                "maxPriorityFeePerGas",
                "value"
            ].forEach((key)=>{
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v)=>v ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(v) : null);
            });
            [
                "type"
            ].forEach((key)=>{
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v)=>v != null ? v : null);
            });
            if (values.accessList) {
                tx.accessList = this.formatter.accessList(values.accessList);
            }
            [
                "data"
            ].forEach((key)=>{
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v)=>v ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexlify"])(v) : null);
            });
            return this.formatter.transactionRequest((yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])(tx)));
        });
    }
    _getFilter(filter) {
        return __awaiter(this, void 0, void 0, function*() {
            filter = yield filter;
            const result = {};
            if (filter.address != null) {
                result.address = this._getAddress(filter.address);
            }
            [
                "blockHash",
                "topics"
            ].forEach((key)=>{
                if (filter[key] == null) {
                    return;
                }
                result[key] = filter[key];
            });
            [
                "fromBlock",
                "toBlock"
            ].forEach((key)=>{
                if (filter[key] == null) {
                    return;
                }
                result[key] = this._getBlockTag(filter[key]);
            });
            return this.formatter.filter((yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])(result)));
        });
    }
    _call(transaction, blockTag, attempt) {
        return __awaiter(this, void 0, void 0, function*() {
            if (attempt >= MAX_CCIP_REDIRECTS) {
                logger.throwError("CCIP read exceeded maximum redirections", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR, {
                    redirects: attempt,
                    transaction
                });
            }
            const txSender = transaction.to;
            const result = yield this.perform("call", {
                transaction,
                blockTag
            });
            // CCIP Read request via OffchainLookup(address,string[],bytes,bytes4,bytes)
            if (attempt >= 0 && blockTag === "latest" && txSender != null && result.substring(0, 10) === "0x556f1830" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataLength"])(result) % 32 === 4) {
                try {
                    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])(result, 4);
                    // Check the sender of the OffchainLookup matches the transaction
                    const sender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])(data, 0, 32);
                    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(sender).eq(txSender)) {
                        logger.throwError("CCIP Read sender did not match", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION, {
                            name: "OffchainLookup",
                            signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                            transaction,
                            data: result
                        });
                    }
                    // Read the URLs from the response
                    const urls = [];
                    const urlsOffset = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])(data, 32, 64)).toNumber();
                    const urlsLength = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])(data, urlsOffset, urlsOffset + 32)).toNumber();
                    const urlsData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])(data, urlsOffset + 32);
                    for(let u = 0; u < urlsLength; u++){
                        const url = _parseString(urlsData, u * 32);
                        if (url == null) {
                            logger.throwError("CCIP Read contained corrupt URL string", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION, {
                                name: "OffchainLookup",
                                signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                                transaction,
                                data: result
                            });
                        }
                        urls.push(url);
                    }
                    // Get the CCIP calldata to forward
                    const calldata = _parseBytes(data, 64);
                    // Get the callbackSelector (bytes4)
                    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])(data, 100, 128)).isZero()) {
                        logger.throwError("CCIP Read callback selector included junk", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION, {
                            name: "OffchainLookup",
                            signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                            transaction,
                            data: result
                        });
                    }
                    const callbackSelector = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexDataSlice"])(data, 96, 100);
                    // Get the extra data to send back to the contract as context
                    const extraData = _parseBytes(data, 128);
                    const ccipResult = yield this.ccipReadFetch(transaction, calldata, urls);
                    if (ccipResult == null) {
                        logger.throwError("CCIP Read disabled or provided no URLs", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION, {
                            name: "OffchainLookup",
                            signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                            transaction,
                            data: result
                        });
                    }
                    const tx = {
                        to: txSender,
                        data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexConcat"])([
                            callbackSelector,
                            encodeBytes([
                                ccipResult,
                                extraData
                            ])
                        ])
                    };
                    return this._call(tx, blockTag, attempt + 1);
                } catch (error) {
                    if (error.code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR) {
                        throw error;
                    }
                }
            }
            try {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexlify"])(result);
            } catch (error) {
                return logger.throwError("bad result from backend", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR, {
                    method: "call",
                    params: {
                        transaction,
                        blockTag
                    },
                    result,
                    error
                });
            }
        });
    }
    call(transaction, blockTag) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            const resolved = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])({
                transaction: this._getTransactionRequest(transaction),
                blockTag: this._getBlockTag(blockTag),
                ccipReadEnabled: Promise.resolve(transaction.ccipReadEnabled)
            });
            return this._call(resolved.transaction, resolved.blockTag, resolved.ccipReadEnabled ? 0 : -1);
        });
    }
    estimateGas(transaction) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            const params = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])({
                transaction: this._getTransactionRequest(transaction)
            });
            const result = yield this.perform("estimateGas", params);
            try {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(result);
            } catch (error) {
                return logger.throwError("bad result from backend", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR, {
                    method: "estimateGas",
                    params,
                    result,
                    error
                });
            }
        });
    }
    _getAddress(addressOrName) {
        return __awaiter(this, void 0, void 0, function*() {
            addressOrName = yield addressOrName;
            if (typeof addressOrName !== "string") {
                logger.throwArgumentError("invalid address or ENS name", "name", addressOrName);
            }
            const address = yield this.resolveName(addressOrName);
            if (address == null) {
                logger.throwError("ENS name not configured", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                    operation: `resolveName(${JSON.stringify(addressOrName)})`
                });
            }
            return address;
        });
    }
    _getBlock(blockHashOrBlockTag, includeTransactions) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            blockHashOrBlockTag = yield blockHashOrBlockTag;
            // If blockTag is a number (not "latest", etc), this is the block number
            let blockNumber = -128;
            const params = {
                includeTransactions: !!includeTransactions
            };
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(blockHashOrBlockTag, 32)) {
                params.blockHash = blockHashOrBlockTag;
            } else {
                try {
                    params.blockTag = yield this._getBlockTag(blockHashOrBlockTag);
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(params.blockTag)) {
                        blockNumber = parseInt(params.blockTag.substring(2), 16);
                    }
                } catch (error) {
                    logger.throwArgumentError("invalid block hash or block tag", "blockHashOrBlockTag", blockHashOrBlockTag);
                }
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["poll"])(()=>__awaiter(this, void 0, void 0, function*() {
                    const block = yield this.perform("getBlock", params);
                    // Block was not found
                    if (block == null) {
                        // For blockhashes, if we didn't say it existed, that blockhash may
                        // not exist. If we did see it though, perhaps from a log, we know
                        // it exists, and this node is just not caught up yet.
                        if (params.blockHash != null) {
                            if (this._emitted["b:" + params.blockHash] == null) {
                                return null;
                            }
                        }
                        // For block tags, if we are asking for a future block, we return null
                        if (params.blockTag != null) {
                            if (blockNumber > this._emitted.block) {
                                return null;
                            }
                        }
                        // Retry on the next block
                        return undefined;
                    }
                    // Add transactions
                    if (includeTransactions) {
                        let blockNumber = null;
                        for(let i = 0; i < block.transactions.length; i++){
                            const tx = block.transactions[i];
                            if (tx.blockNumber == null) {
                                tx.confirmations = 0;
                            } else if (tx.confirmations == null) {
                                if (blockNumber == null) {
                                    blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
                                }
                                // Add the confirmations using the fast block number (pessimistic)
                                let confirmations = blockNumber - tx.blockNumber + 1;
                                if (confirmations <= 0) {
                                    confirmations = 1;
                                }
                                tx.confirmations = confirmations;
                            }
                        }
                        const blockWithTxs = this.formatter.blockWithTransactions(block);
                        blockWithTxs.transactions = blockWithTxs.transactions.map((tx)=>this._wrapTransaction(tx));
                        return blockWithTxs;
                    }
                    return this.formatter.block(block);
                }), {
                oncePoll: this
            });
        });
    }
    getBlock(blockHashOrBlockTag) {
        return this._getBlock(blockHashOrBlockTag, false);
    }
    getBlockWithTransactions(blockHashOrBlockTag) {
        return this._getBlock(blockHashOrBlockTag, true);
    }
    getTransaction(transactionHash) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            transactionHash = yield transactionHash;
            const params = {
                transactionHash: this.formatter.hash(transactionHash, true)
            };
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["poll"])(()=>__awaiter(this, void 0, void 0, function*() {
                    const result = yield this.perform("getTransaction", params);
                    if (result == null) {
                        if (this._emitted["t:" + transactionHash] == null) {
                            return null;
                        }
                        return undefined;
                    }
                    const tx = this.formatter.transactionResponse(result);
                    if (tx.blockNumber == null) {
                        tx.confirmations = 0;
                    } else if (tx.confirmations == null) {
                        const blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
                        // Add the confirmations using the fast block number (pessimistic)
                        let confirmations = blockNumber - tx.blockNumber + 1;
                        if (confirmations <= 0) {
                            confirmations = 1;
                        }
                        tx.confirmations = confirmations;
                    }
                    return this._wrapTransaction(tx);
                }), {
                oncePoll: this
            });
        });
    }
    getTransactionReceipt(transactionHash) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            transactionHash = yield transactionHash;
            const params = {
                transactionHash: this.formatter.hash(transactionHash, true)
            };
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["poll"])(()=>__awaiter(this, void 0, void 0, function*() {
                    const result = yield this.perform("getTransactionReceipt", params);
                    if (result == null) {
                        if (this._emitted["t:" + transactionHash] == null) {
                            return null;
                        }
                        return undefined;
                    }
                    // "geth-etc" returns receipts before they are ready
                    if (result.blockHash == null) {
                        return undefined;
                    }
                    const receipt = this.formatter.receipt(result);
                    if (receipt.blockNumber == null) {
                        receipt.confirmations = 0;
                    } else if (receipt.confirmations == null) {
                        const blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
                        // Add the confirmations using the fast block number (pessimistic)
                        let confirmations = blockNumber - receipt.blockNumber + 1;
                        if (confirmations <= 0) {
                            confirmations = 1;
                        }
                        receipt.confirmations = confirmations;
                    }
                    return receipt;
                }), {
                oncePoll: this
            });
        });
    }
    getLogs(filter) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            const params = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])({
                filter: this._getFilter(filter)
            });
            const logs = yield this.perform("getLogs", params);
            logs.forEach((log)=>{
                if (log.removed == null) {
                    log.removed = false;
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Formatter"].arrayOf(this.formatter.filterLog.bind(this.formatter))(logs);
        });
    }
    getEtherPrice() {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.getNetwork();
            return this.perform("getEtherPrice", {});
        });
    }
    _getBlockTag(blockTag) {
        return __awaiter(this, void 0, void 0, function*() {
            blockTag = yield blockTag;
            if (typeof blockTag === "number" && blockTag < 0) {
                if (blockTag % 1) {
                    logger.throwArgumentError("invalid BlockTag", "blockTag", blockTag);
                }
                let blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
                blockNumber += blockTag;
                if (blockNumber < 0) {
                    blockNumber = 0;
                }
                return this.formatter.blockTag(blockNumber);
            }
            return this.formatter.blockTag(blockTag);
        });
    }
    getResolver(name) {
        return __awaiter(this, void 0, void 0, function*() {
            let currentName = name;
            while(true){
                if (currentName === "" || currentName === ".") {
                    return null;
                }
                // Optimization since the eth node cannot change and does
                // not have a wildcard resolver
                if (name !== "eth" && currentName === "eth") {
                    return null;
                }
                // Check the current node for a resolver
                const addr = yield this._getResolver(currentName, "getResolver");
                // Found a resolver!
                if (addr != null) {
                    const resolver = new Resolver(this, addr, name);
                    // Legacy resolver found, using EIP-2544 so it isn't safe to use
                    if (currentName !== name && !(yield resolver.supportsWildcard())) {
                        return null;
                    }
                    return resolver;
                }
                // Get the parent node
                currentName = currentName.split(".").slice(1).join(".");
            }
        });
    }
    _getResolver(name, operation) {
        return __awaiter(this, void 0, void 0, function*() {
            if (operation == null) {
                operation = "ENS";
            }
            const network = yield this.getNetwork();
            // No ENS...
            if (!network.ensAddress) {
                logger.throwError("network does not support ENS", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                    operation,
                    network: network.name
                });
            }
            try {
                // keccak256("resolver(bytes32)")
                const addrData = yield this.call({
                    to: network.ensAddress,
                    data: "0x0178b8bf" + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$namehash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["namehash"])(name).substring(2)
                });
                return this.formatter.callAddress(addrData);
            } catch (error) {
            // ENS registry cannot throw errors on resolver(bytes32)
            }
            return null;
        });
    }
    resolveName(name) {
        return __awaiter(this, void 0, void 0, function*() {
            name = yield name;
            // If it is already an address, nothing to resolve
            try {
                return Promise.resolve(this.formatter.address(name));
            } catch (error) {
                // If is is a hexstring, the address is bad (See #694)
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(name)) {
                    throw error;
                }
            }
            if (typeof name !== "string") {
                logger.throwArgumentError("invalid ENS name", "name", name);
            }
            // Get the addr from the resolver
            const resolver = yield this.getResolver(name);
            if (!resolver) {
                return null;
            }
            return yield resolver.getAddress();
        });
    }
    lookupAddress(address) {
        return __awaiter(this, void 0, void 0, function*() {
            address = yield address;
            address = this.formatter.address(address);
            const node = address.substring(2).toLowerCase() + ".addr.reverse";
            const resolverAddr = yield this._getResolver(node, "lookupAddress");
            if (resolverAddr == null) {
                return null;
            }
            // keccak("name(bytes32)")
            const name = _parseString((yield this.call({
                to: resolverAddr,
                data: "0x691f3431" + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$namehash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["namehash"])(node).substring(2)
            })), 0);
            const addr = yield this.resolveName(name);
            if (addr != address) {
                return null;
            }
            return name;
        });
    }
    getAvatar(nameOrAddress) {
        return __awaiter(this, void 0, void 0, function*() {
            let resolver = null;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(nameOrAddress)) {
                // Address; reverse lookup
                const address = this.formatter.address(nameOrAddress);
                const node = address.substring(2).toLowerCase() + ".addr.reverse";
                const resolverAddress = yield this._getResolver(node, "getAvatar");
                if (!resolverAddress) {
                    return null;
                }
                // Try resolving the avatar against the addr.reverse resolver
                resolver = new Resolver(this, resolverAddress, node);
                try {
                    const avatar = yield resolver.getAvatar();
                    if (avatar) {
                        return avatar.url;
                    }
                } catch (error) {
                    if (error.code !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION) {
                        throw error;
                    }
                }
                // Try getting the name and performing forward lookup; allowing wildcards
                try {
                    // keccak("name(bytes32)")
                    const name = _parseString((yield this.call({
                        to: resolverAddress,
                        data: "0x691f3431" + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$namehash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["namehash"])(node).substring(2)
                    })), 0);
                    resolver = yield this.getResolver(name);
                } catch (error) {
                    if (error.code !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION) {
                        throw error;
                    }
                    return null;
                }
            } else {
                // ENS name; forward lookup with wildcard
                resolver = yield this.getResolver(nameOrAddress);
                if (!resolver) {
                    return null;
                }
            }
            const avatar = yield resolver.getAvatar();
            if (avatar == null) {
                return null;
            }
            return avatar.url;
        });
    }
    perform(method, params) {
        return logger.throwError(method + " not implemented", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NOT_IMPLEMENTED, {
            operation: method
        });
    }
    _startEvent(event) {
        this.polling = this._events.filter((e)=>e.pollable()).length > 0;
    }
    _stopEvent(event) {
        this.polling = this._events.filter((e)=>e.pollable()).length > 0;
    }
    _addEventListener(eventName, listener, once) {
        const event = new Event(getEventTag(eventName), listener, once);
        this._events.push(event);
        this._startEvent(event);
        return this;
    }
    on(eventName, listener) {
        return this._addEventListener(eventName, listener, false);
    }
    once(eventName, listener) {
        return this._addEventListener(eventName, listener, true);
    }
    emit(eventName, ...args) {
        let result = false;
        let stopped = [];
        let eventTag = getEventTag(eventName);
        this._events = this._events.filter((event)=>{
            if (event.tag !== eventTag) {
                return true;
            }
            setTimeout(()=>{
                event.listener.apply(this, args);
            }, 0);
            result = true;
            if (event.once) {
                stopped.push(event);
                return false;
            }
            return true;
        });
        stopped.forEach((event)=>{
            this._stopEvent(event);
        });
        return result;
    }
    listenerCount(eventName) {
        if (!eventName) {
            return this._events.length;
        }
        let eventTag = getEventTag(eventName);
        return this._events.filter((event)=>{
            return event.tag === eventTag;
        }).length;
    }
    listeners(eventName) {
        if (eventName == null) {
            return this._events.map((event)=>event.listener);
        }
        let eventTag = getEventTag(eventName);
        return this._events.filter((event)=>event.tag === eventTag).map((event)=>event.listener);
    }
    off(eventName, listener) {
        if (listener == null) {
            return this.removeAllListeners(eventName);
        }
        const stopped = [];
        let found = false;
        let eventTag = getEventTag(eventName);
        this._events = this._events.filter((event)=>{
            if (event.tag !== eventTag || event.listener != listener) {
                return true;
            }
            if (found) {
                return true;
            }
            found = true;
            stopped.push(event);
            return false;
        });
        stopped.forEach((event)=>{
            this._stopEvent(event);
        });
        return this;
    }
    removeAllListeners(eventName) {
        let stopped = [];
        if (eventName == null) {
            stopped = this._events;
            this._events = [];
        } else {
            const eventTag = getEventTag(eventName);
            this._events = this._events.filter((event)=>{
                if (event.tag !== eventTag) {
                    return true;
                }
                stopped.push(event);
                return false;
            });
        }
        stopped.forEach((event)=>{
            this._stopEvent(event);
        });
        return this;
    }
} //# sourceMappingURL=base-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "JsonRpcProvider": (()=>JsonRpcProvider),
    "JsonRpcSigner": (()=>JsonRpcSigner)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+web@5.7.1/node_modules/@ethersproject/web/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$strings$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$strings$2f$lib$2e$esm$2f$utf8$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+strings@5.7.0/node_modules/@ethersproject/strings/lib.esm/utf8.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bytes@5.7.0/node_modules/@ethersproject/bytes/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$typed$2d$data$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__TypedDataEncoder__as__$5f$TypedDataEncoder$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+hash@5.7.0/node_modules/@ethersproject/hash/lib.esm/typed-data.js [app-client] (ecmascript) <export TypedDataEncoder as _TypedDataEncoder>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abstract$2d$signer$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abstract$2d$signer$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abstract-signer@5.7.0/node_modules/@ethersproject/abstract-signer/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bignumber@5.7.0/node_modules/@ethersproject/bignumber/lib.esm/bignumber.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$transactions$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$transactions$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+transactions@5.7.0/node_modules/@ethersproject/transactions/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$base$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/base-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
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
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
;
const errorGas = [
    "call",
    "estimateGas"
];
function spelunk(value, requireData) {
    if (value == null) {
        return null;
    }
    // These *are* the droids we're looking for.
    if (typeof value.message === "string" && value.message.match("reverted")) {
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(value.data) ? value.data : null;
        if (!requireData || data) {
            return {
                message: value.message,
                data
            };
        }
    }
    // Spelunk further...
    if (typeof value === "object") {
        for(const key in value){
            const result = spelunk(value[key], requireData);
            if (result) {
                return result;
            }
        }
        return null;
    }
    // Might be a JSON string we can further descend...
    if (typeof value === "string") {
        try {
            return spelunk(JSON.parse(value), requireData);
        } catch (error) {}
    }
    return null;
}
function checkError(method, error, params) {
    const transaction = params.transaction || params.signedTransaction;
    // Undo the "convenience" some nodes are attempting to prevent backwards
    // incompatibility; maybe for v6 consider forwarding reverts as errors
    if (method === "call") {
        const result = spelunk(error, true);
        if (result) {
            return result.data;
        }
        // Nothing descriptive..
        logger.throwError("missing revert data in call exception; Transaction reverted without a reason string", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION, {
            data: "0x",
            transaction,
            error
        });
    }
    if (method === "estimateGas") {
        // Try to find something, with a preference on SERVER_ERROR body
        let result = spelunk(error.body, false);
        if (result == null) {
            result = spelunk(error, false);
        }
        // Found "reverted", this is a CALL_EXCEPTION
        if (result) {
            logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNPREDICTABLE_GAS_LIMIT, {
                reason: result.message,
                method,
                transaction,
                error
            });
        }
    }
    // @TODO: Should we spelunk for message too?
    let message = error.message;
    if (error.code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR && error.error && typeof error.error.message === "string") {
        message = error.error.message;
    } else if (typeof error.body === "string") {
        message = error.body;
    } else if (typeof error.responseText === "string") {
        message = error.responseText;
    }
    message = (message || "").toLowerCase();
    // "insufficient funds for gas * price + value + cost(data)"
    if (message.match(/insufficient funds|base fee exceeds gas limit|InsufficientFunds/i)) {
        logger.throwError("insufficient funds for intrinsic transaction cost", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.INSUFFICIENT_FUNDS, {
            error,
            method,
            transaction
        });
    }
    // "nonce too low"
    if (message.match(/nonce (is )?too low/i)) {
        logger.throwError("nonce has already been used", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NONCE_EXPIRED, {
            error,
            method,
            transaction
        });
    }
    // "replacement transaction underpriced"
    if (message.match(/replacement transaction underpriced|transaction gas price.*too low/i)) {
        logger.throwError("replacement fee too low", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.REPLACEMENT_UNDERPRICED, {
            error,
            method,
            transaction
        });
    }
    // "replacement transaction underpriced"
    if (message.match(/only replay-protected/i)) {
        logger.throwError("legacy pre-eip-155 transactions not supported", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
            error,
            method,
            transaction
        });
    }
    if (errorGas.indexOf(method) >= 0 && message.match(/gas required exceeds allowance|always failing transaction|execution reverted|revert/)) {
        logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNPREDICTABLE_GAS_LIMIT, {
            error,
            method,
            transaction
        });
    }
    throw error;
}
function timer(timeout) {
    return new Promise(function(resolve) {
        setTimeout(resolve, timeout);
    });
}
function getResult(payload) {
    if (payload.error) {
        // @TODO: not any
        const error = new Error(payload.error.message);
        error.code = payload.error.code;
        error.data = payload.error.data;
        throw error;
    }
    return payload.result;
}
function getLowerCase(value) {
    if (value) {
        return value.toLowerCase();
    }
    return value;
}
const _constructorGuard = {};
class JsonRpcSigner extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abstract$2d$signer$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abstract$2d$signer$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Signer"] {
    constructor(constructorGuard, provider, addressOrIndex){
        super();
        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not call the JsonRpcSigner constructor directly; use provider.getSigner");
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "provider", provider);
        if (addressOrIndex == null) {
            addressOrIndex = 0;
        }
        if (typeof addressOrIndex === "string") {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_address", this.provider.formatter.address(addressOrIndex));
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_index", null);
        } else if (typeof addressOrIndex === "number") {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_index", addressOrIndex);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_address", null);
        } else {
            logger.throwArgumentError("invalid address or index", "addressOrIndex", addressOrIndex);
        }
    }
    connect(provider) {
        return logger.throwError("cannot alter JSON-RPC Signer connection", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
            operation: "connect"
        });
    }
    connectUnchecked() {
        return new UncheckedJsonRpcSigner(_constructorGuard, this.provider, this._address || this._index);
    }
    getAddress() {
        if (this._address) {
            return Promise.resolve(this._address);
        }
        return this.provider.send("eth_accounts", []).then((accounts)=>{
            if (accounts.length <= this._index) {
                logger.throwError("unknown account #" + this._index, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                    operation: "getAddress"
                });
            }
            return this.provider.formatter.address(accounts[this._index]);
        });
    }
    sendUncheckedTransaction(transaction) {
        transaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"])(transaction);
        const fromAddress = this.getAddress().then((address)=>{
            if (address) {
                address = address.toLowerCase();
            }
            return address;
        });
        // The JSON-RPC for eth_sendTransaction uses 90000 gas; if the user
        // wishes to use this, it is easy to specify explicitly, otherwise
        // we look it up for them.
        if (transaction.gasLimit == null) {
            const estimate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"])(transaction);
            estimate.from = fromAddress;
            transaction.gasLimit = this.provider.estimateGas(estimate);
        }
        if (transaction.to != null) {
            transaction.to = Promise.resolve(transaction.to).then((to)=>__awaiter(this, void 0, void 0, function*() {
                    if (to == null) {
                        return null;
                    }
                    const address = yield this.provider.resolveName(to);
                    if (address == null) {
                        logger.throwArgumentError("provided ENS name resolves to null", "tx.to", to);
                    }
                    return address;
                }));
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])({
            tx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveProperties"])(transaction),
            sender: fromAddress
        }).then(({ tx, sender })=>{
            if (tx.from != null) {
                if (tx.from.toLowerCase() !== sender) {
                    logger.throwArgumentError("from address mismatch", "transaction", transaction);
                }
            } else {
                tx.from = sender;
            }
            const hexTx = this.provider.constructor.hexlifyTransaction(tx, {
                from: true
            });
            return this.provider.send("eth_sendTransaction", [
                hexTx
            ]).then((hash)=>{
                return hash;
            }, (error)=>{
                if (typeof error.message === "string" && error.message.match(/user denied/i)) {
                    logger.throwError("user rejected transaction", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.ACTION_REJECTED, {
                        action: "sendTransaction",
                        transaction: tx
                    });
                }
                return checkError("sendTransaction", error, hexTx);
            });
        });
    }
    signTransaction(transaction) {
        return logger.throwError("signing transactions is unsupported", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
            operation: "signTransaction"
        });
    }
    sendTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function*() {
            // This cannot be mined any earlier than any recent block
            const blockNumber = yield this.provider._getInternalBlockNumber(100 + 2 * this.provider.pollingInterval);
            // Send the transaction
            const hash = yield this.sendUncheckedTransaction(transaction);
            try {
                // Unfortunately, JSON-RPC only provides and opaque transaction hash
                // for a response, and we need the actual transaction, so we poll
                // for it; it should show up very quickly
                return yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["poll"])(()=>__awaiter(this, void 0, void 0, function*() {
                        const tx = yield this.provider.getTransaction(hash);
                        if (tx === null) {
                            return undefined;
                        }
                        return this.provider._wrapTransaction(tx, hash, blockNumber);
                    }), {
                    oncePoll: this.provider
                });
            } catch (error) {
                error.transactionHash = hash;
                throw error;
            }
        });
    }
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function*() {
            const data = typeof message === "string" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$strings$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$strings$2f$lib$2e$esm$2f$utf8$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toUtf8Bytes"])(message) : message;
            const address = yield this.getAddress();
            try {
                return yield this.provider.send("personal_sign", [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexlify"])(data),
                    address.toLowerCase()
                ]);
            } catch (error) {
                if (typeof error.message === "string" && error.message.match(/user denied/i)) {
                    logger.throwError("user rejected signing", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.ACTION_REJECTED, {
                        action: "signMessage",
                        from: address,
                        messageData: message
                    });
                }
                throw error;
            }
        });
    }
    _legacySignMessage(message) {
        return __awaiter(this, void 0, void 0, function*() {
            const data = typeof message === "string" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$strings$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$strings$2f$lib$2e$esm$2f$utf8$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toUtf8Bytes"])(message) : message;
            const address = yield this.getAddress();
            try {
                // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
                return yield this.provider.send("eth_sign", [
                    address.toLowerCase(),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexlify"])(data)
                ]);
            } catch (error) {
                if (typeof error.message === "string" && error.message.match(/user denied/i)) {
                    logger.throwError("user rejected signing", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.ACTION_REJECTED, {
                        action: "_legacySignMessage",
                        from: address,
                        messageData: message
                    });
                }
                throw error;
            }
        });
    }
    _signTypedData(domain, types, value) {
        return __awaiter(this, void 0, void 0, function*() {
            // Populate any ENS names (in-place)
            const populated = yield __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$typed$2d$data$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__TypedDataEncoder__as__$5f$TypedDataEncoder$3e$__["_TypedDataEncoder"].resolveNames(domain, types, value, (name)=>{
                return this.provider.resolveName(name);
            });
            const address = yield this.getAddress();
            try {
                return yield this.provider.send("eth_signTypedData_v4", [
                    address.toLowerCase(),
                    JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$hash$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$hash$2f$lib$2e$esm$2f$typed$2d$data$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__TypedDataEncoder__as__$5f$TypedDataEncoder$3e$__["_TypedDataEncoder"].getPayload(populated.domain, types, populated.value))
                ]);
            } catch (error) {
                if (typeof error.message === "string" && error.message.match(/user denied/i)) {
                    logger.throwError("user rejected signing", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.ACTION_REJECTED, {
                        action: "_signTypedData",
                        from: address,
                        messageData: {
                            domain: populated.domain,
                            types,
                            value: populated.value
                        }
                    });
                }
                throw error;
            }
        });
    }
    unlock(password) {
        return __awaiter(this, void 0, void 0, function*() {
            const provider = this.provider;
            const address = yield this.getAddress();
            return provider.send("personal_unlockAccount", [
                address.toLowerCase(),
                password,
                null
            ]);
        });
    }
}
class UncheckedJsonRpcSigner extends JsonRpcSigner {
    sendTransaction(transaction) {
        return this.sendUncheckedTransaction(transaction).then((hash)=>{
            return {
                hash: hash,
                nonce: null,
                gasLimit: null,
                gasPrice: null,
                data: null,
                value: null,
                chainId: null,
                confirmations: 0,
                from: null,
                wait: (confirmations)=>{
                    return this.provider.waitForTransaction(hash, confirmations);
                }
            };
        });
    }
}
const allowedTransactionKeys = {
    chainId: true,
    data: true,
    gasLimit: true,
    gasPrice: true,
    nonce: true,
    to: true,
    value: true,
    type: true,
    accessList: true,
    maxFeePerGas: true,
    maxPriorityFeePerGas: true
};
class JsonRpcProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$base$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseProvider"] {
    constructor(url, network){
        let networkOrReady = network;
        // The network is unknown, query the JSON-RPC for it
        if (networkOrReady == null) {
            networkOrReady = new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    this.detectNetwork().then((network)=>{
                        resolve(network);
                    }, (error)=>{
                        reject(error);
                    });
                }, 0);
            });
        }
        super(networkOrReady);
        // Default URL
        if (!url) {
            url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatic"])(this.constructor, "defaultUrl")();
        }
        if (typeof url === "string") {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "connection", Object.freeze({
                url: url
            }));
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "connection", Object.freeze((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"])(url)));
        }
        this._nextId = 42;
    }
    get _cache() {
        if (this._eventLoopCache == null) {
            this._eventLoopCache = {};
        }
        return this._eventLoopCache;
    }
    static defaultUrl() {
        return "http:/\/localhost:8545";
    }
    detectNetwork() {
        if (!this._cache["detectNetwork"]) {
            this._cache["detectNetwork"] = this._uncachedDetectNetwork();
            // Clear this cache at the beginning of the next event loop
            setTimeout(()=>{
                this._cache["detectNetwork"] = null;
            }, 0);
        }
        return this._cache["detectNetwork"];
    }
    _uncachedDetectNetwork() {
        return __awaiter(this, void 0, void 0, function*() {
            yield timer(0);
            let chainId = null;
            try {
                chainId = yield this.send("eth_chainId", []);
            } catch (error) {
                try {
                    chainId = yield this.send("net_version", []);
                } catch (error) {}
            }
            if (chainId != null) {
                const getNetwork = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatic"])(this.constructor, "getNetwork");
                try {
                    return getNetwork(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(chainId).toNumber());
                } catch (error) {
                    return logger.throwError("could not detect network", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NETWORK_ERROR, {
                        chainId: chainId,
                        event: "invalidNetwork",
                        serverError: error
                    });
                }
            }
            return logger.throwError("could not detect network", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NETWORK_ERROR, {
                event: "noNetwork"
            });
        });
    }
    getSigner(addressOrIndex) {
        return new JsonRpcSigner(_constructorGuard, this, addressOrIndex);
    }
    getUncheckedSigner(addressOrIndex) {
        return this.getSigner(addressOrIndex).connectUnchecked();
    }
    listAccounts() {
        return this.send("eth_accounts", []).then((accounts)=>{
            return accounts.map((a)=>this.formatter.address(a));
        });
    }
    send(method, params) {
        const request = {
            method: method,
            params: params,
            id: this._nextId++,
            jsonrpc: "2.0"
        };
        this.emit("debug", {
            action: "request",
            request: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deepCopy"])(request),
            provider: this
        });
        // We can expand this in the future to any call, but for now these
        // are the biggest wins and do not require any serializing parameters.
        const cache = [
            "eth_chainId",
            "eth_blockNumber"
        ].indexOf(method) >= 0;
        if (cache && this._cache[method]) {
            return this._cache[method];
        }
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(this.connection, JSON.stringify(request), getResult).then((result)=>{
            this.emit("debug", {
                action: "response",
                request: request,
                response: result,
                provider: this
            });
            return result;
        }, (error)=>{
            this.emit("debug", {
                action: "response",
                error: error,
                request: request,
                provider: this
            });
            throw error;
        });
        // Cache the fetch, but clear it on the next event loop
        if (cache) {
            this._cache[method] = result;
            setTimeout(()=>{
                this._cache[method] = null;
            }, 0);
        }
        return result;
    }
    prepareRequest(method, params) {
        switch(method){
            case "getBlockNumber":
                return [
                    "eth_blockNumber",
                    []
                ];
            case "getGasPrice":
                return [
                    "eth_gasPrice",
                    []
                ];
            case "getBalance":
                return [
                    "eth_getBalance",
                    [
                        getLowerCase(params.address),
                        params.blockTag
                    ]
                ];
            case "getTransactionCount":
                return [
                    "eth_getTransactionCount",
                    [
                        getLowerCase(params.address),
                        params.blockTag
                    ]
                ];
            case "getCode":
                return [
                    "eth_getCode",
                    [
                        getLowerCase(params.address),
                        params.blockTag
                    ]
                ];
            case "getStorageAt":
                return [
                    "eth_getStorageAt",
                    [
                        getLowerCase(params.address),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexZeroPad"])(params.position, 32),
                        params.blockTag
                    ]
                ];
            case "sendTransaction":
                return [
                    "eth_sendRawTransaction",
                    [
                        params.signedTransaction
                    ]
                ];
            case "getBlock":
                if (params.blockTag) {
                    return [
                        "eth_getBlockByNumber",
                        [
                            params.blockTag,
                            !!params.includeTransactions
                        ]
                    ];
                } else if (params.blockHash) {
                    return [
                        "eth_getBlockByHash",
                        [
                            params.blockHash,
                            !!params.includeTransactions
                        ]
                    ];
                }
                return null;
            case "getTransaction":
                return [
                    "eth_getTransactionByHash",
                    [
                        params.transactionHash
                    ]
                ];
            case "getTransactionReceipt":
                return [
                    "eth_getTransactionReceipt",
                    [
                        params.transactionHash
                    ]
                ];
            case "call":
                {
                    const hexlifyTransaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatic"])(this.constructor, "hexlifyTransaction");
                    return [
                        "eth_call",
                        [
                            hexlifyTransaction(params.transaction, {
                                from: true
                            }),
                            params.blockTag
                        ]
                    ];
                }
            case "estimateGas":
                {
                    const hexlifyTransaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatic"])(this.constructor, "hexlifyTransaction");
                    return [
                        "eth_estimateGas",
                        [
                            hexlifyTransaction(params.transaction, {
                                from: true
                            })
                        ]
                    ];
                }
            case "getLogs":
                if (params.filter && params.filter.address != null) {
                    params.filter.address = getLowerCase(params.filter.address);
                }
                return [
                    "eth_getLogs",
                    [
                        params.filter
                    ]
                ];
            default:
                break;
        }
        return null;
    }
    perform(method, params) {
        return __awaiter(this, void 0, void 0, function*() {
            // Legacy networks do not like the type field being passed along (which
            // is fair), so we delete type if it is 0 and a non-EIP-1559 network
            if (method === "call" || method === "estimateGas") {
                const tx = params.transaction;
                if (tx && tx.type != null && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(tx.type).isZero()) {
                    // If there are no EIP-1559 properties, it might be non-EIP-1559
                    if (tx.maxFeePerGas == null && tx.maxPriorityFeePerGas == null) {
                        const feeData = yield this.getFeeData();
                        if (feeData.maxFeePerGas == null && feeData.maxPriorityFeePerGas == null) {
                            // Network doesn't know about EIP-1559 (and hence type)
                            params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"])(params);
                            params.transaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"])(tx);
                            delete params.transaction.type;
                        }
                    }
                }
            }
            const args = this.prepareRequest(method, params);
            if (args == null) {
                logger.throwError(method + " not implemented", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NOT_IMPLEMENTED, {
                    operation: method
                });
            }
            try {
                return yield this.send(args[0], args[1]);
            } catch (error) {
                return checkError(method, error, params);
            }
        });
    }
    _startEvent(event) {
        if (event.tag === "pending") {
            this._startPending();
        }
        super._startEvent(event);
    }
    _startPending() {
        if (this._pendingFilter != null) {
            return;
        }
        const self = this;
        const pendingFilter = this.send("eth_newPendingTransactionFilter", []);
        this._pendingFilter = pendingFilter;
        pendingFilter.then(function(filterId) {
            function poll() {
                self.send("eth_getFilterChanges", [
                    filterId
                ]).then(function(hashes) {
                    if (self._pendingFilter != pendingFilter) {
                        return null;
                    }
                    let seq = Promise.resolve();
                    hashes.forEach(function(hash) {
                        // @TODO: This should be garbage collected at some point... How? When?
                        self._emitted["t:" + hash.toLowerCase()] = "pending";
                        seq = seq.then(function() {
                            return self.getTransaction(hash).then(function(tx) {
                                self.emit("pending", tx);
                                return null;
                            });
                        });
                    });
                    return seq.then(function() {
                        return timer(1000);
                    });
                }).then(function() {
                    if (self._pendingFilter != pendingFilter) {
                        self.send("eth_uninstallFilter", [
                            filterId
                        ]);
                        return;
                    }
                    setTimeout(function() {
                        poll();
                    }, 0);
                    return null;
                }).catch((error)=>{});
            }
            poll();
            return filterId;
        }).catch((error)=>{});
    }
    _stopEvent(event) {
        if (event.tag === "pending" && this.listenerCount("pending") === 0) {
            this._pendingFilter = null;
        }
        super._stopEvent(event);
    }
    // Convert an ethers.js transaction into a JSON-RPC transaction
    //  - gasLimit => gas
    //  - All values hexlified
    //  - All numeric values zero-striped
    //  - All addresses are lowercased
    // NOTE: This allows a TransactionRequest, but all values should be resolved
    //       before this is called
    // @TODO: This will likely be removed in future versions and prepareRequest
    //        will be the preferred method for this.
    static hexlifyTransaction(transaction, allowExtra) {
        // Check only allowed properties are given
        const allowed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"])(allowedTransactionKeys);
        if (allowExtra) {
            for(const key in allowExtra){
                if (allowExtra[key]) {
                    allowed[key] = true;
                }
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkProperties"])(transaction, allowed);
        const result = {};
        // JSON-RPC now requires numeric values to be "quantity" values
        [
            "chainId",
            "gasLimit",
            "gasPrice",
            "type",
            "maxFeePerGas",
            "maxPriorityFeePerGas",
            "nonce",
            "value"
        ].forEach(function(key) {
            if (transaction[key] == null) {
                return;
            }
            const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexValue"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(transaction[key]));
            if (key === "gasLimit") {
                key = "gas";
            }
            result[key] = value;
        });
        [
            "from",
            "to",
            "data"
        ].forEach(function(key) {
            if (transaction[key] == null) {
                return;
            }
            result[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexlify"])(transaction[key]);
        });
        if (transaction.accessList) {
            result["accessList"] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$transactions$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$transactions$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accessListify"])(transaction.accessList);
        }
        return result;
    }
} //# sourceMappingURL=json-rpc-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/ws.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "WebSocket": (()=>WS)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
"use strict";
;
;
let WS = null;
try {
    WS = WebSocket;
    if (WS == null) {
        throw new Error("inject please");
    }
} catch (error) {
    const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
    WS = function() {
        logger.throwError("WebSockets not supported in this environment", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
            operation: "new WebSocket()"
        });
    };
}
;
 //# sourceMappingURL=ws.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/websocket-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "WebSocketProvider": (()=>WebSocketProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$ws$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/ws.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bignumber@5.7.0/node_modules/@ethersproject/bignumber/lib.esm/bignumber.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js [app-client] (ecmascript)");
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
;
;
;
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
/**
 *  Notes:
 *
 *  This provider differs a bit from the polling providers. One main
 *  difference is how it handles consistency. The polling providers
 *  will stall responses to ensure a consistent state, while this
 *  WebSocket provider assumes the connected backend will manage this.
 *
 *  For example, if a polling provider emits an event which indicates
 *  the event occurred in blockhash XXX, a call to fetch that block by
 *  its hash XXX, if not present will retry until it is present. This
 *  can occur when querying a pool of nodes that are mildly out of sync
 *  with each other.
 */ let NextId = 1;
class WebSocketProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JsonRpcProvider"] {
    constructor(url, network){
        // This will be added in the future; please open an issue to expedite
        if (network === "any") {
            logger.throwError("WebSocketProvider does not support 'any' network yet", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                operation: "network:any"
            });
        }
        if (typeof url === "string") {
            super(url, network);
        } else {
            super("_websocket", network);
        }
        this._pollingInterval = -1;
        this._wsReady = false;
        if (typeof url === "string") {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_websocket", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$ws$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebSocket"](this.connection.url));
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_websocket", url);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_requests", {});
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_subs", {});
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_subIds", {});
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_detectNetwork", super.detectNetwork());
        // Stall sending requests until the socket is open...
        this.websocket.onopen = ()=>{
            this._wsReady = true;
            Object.keys(this._requests).forEach((id)=>{
                this.websocket.send(this._requests[id].payload);
            });
        };
        this.websocket.onmessage = (messageEvent)=>{
            const data = messageEvent.data;
            const result = JSON.parse(data);
            if (result.id != null) {
                const id = String(result.id);
                const request = this._requests[id];
                delete this._requests[id];
                if (result.result !== undefined) {
                    request.callback(null, result.result);
                    this.emit("debug", {
                        action: "response",
                        request: JSON.parse(request.payload),
                        response: result.result,
                        provider: this
                    });
                } else {
                    let error = null;
                    if (result.error) {
                        error = new Error(result.error.message || "unknown error");
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(error, "code", result.error.code || null);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(error, "response", data);
                    } else {
                        error = new Error("unknown error");
                    }
                    request.callback(error, undefined);
                    this.emit("debug", {
                        action: "response",
                        error: error,
                        request: JSON.parse(request.payload),
                        provider: this
                    });
                }
            } else if (result.method === "eth_subscription") {
                // Subscription...
                const sub = this._subs[result.params.subscription];
                if (sub) {
                    //this.emit.apply(this,                  );
                    sub.processFunc(result.params.result);
                }
            } else {
                console.warn("this should not happen");
            }
        };
        // This Provider does not actually poll, but we want to trigger
        // poll events for things that depend on them (like stalling for
        // block and transaction lookups)
        const fauxPoll = setInterval(()=>{
            this.emit("poll");
        }, 1000);
        if (fauxPoll.unref) {
            fauxPoll.unref();
        }
    }
    // Cannot narrow the type of _websocket, as that is not backwards compatible
    // so we add a getter and let the WebSocket be a public API.
    get websocket() {
        return this._websocket;
    }
    detectNetwork() {
        return this._detectNetwork;
    }
    get pollingInterval() {
        return 0;
    }
    resetEventsBlock(blockNumber) {
        logger.throwError("cannot reset events block on WebSocketProvider", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
            operation: "resetEventBlock"
        });
    }
    set pollingInterval(value) {
        logger.throwError("cannot set polling interval on WebSocketProvider", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
            operation: "setPollingInterval"
        });
    }
    poll() {
        return __awaiter(this, void 0, void 0, function*() {
            return null;
        });
    }
    set polling(value) {
        if (!value) {
            return;
        }
        logger.throwError("cannot set polling on WebSocketProvider", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
            operation: "setPolling"
        });
    }
    send(method, params) {
        const rid = NextId++;
        return new Promise((resolve, reject)=>{
            function callback(error, result) {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            }
            const payload = JSON.stringify({
                method: method,
                params: params,
                id: rid,
                jsonrpc: "2.0"
            });
            this.emit("debug", {
                action: "request",
                request: JSON.parse(payload),
                provider: this
            });
            this._requests[String(rid)] = {
                callback,
                payload
            };
            if (this._wsReady) {
                this.websocket.send(payload);
            }
        });
    }
    static defaultUrl() {
        return "ws:/\/localhost:8546";
    }
    _subscribe(tag, param, processFunc) {
        return __awaiter(this, void 0, void 0, function*() {
            let subIdPromise = this._subIds[tag];
            if (subIdPromise == null) {
                subIdPromise = Promise.all(param).then((param)=>{
                    return this.send("eth_subscribe", param);
                });
                this._subIds[tag] = subIdPromise;
            }
            const subId = yield subIdPromise;
            this._subs[subId] = {
                tag,
                processFunc
            };
        });
    }
    _startEvent(event) {
        switch(event.type){
            case "block":
                this._subscribe("block", [
                    "newHeads"
                ], (result)=>{
                    const blockNumber = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].from(result.number).toNumber();
                    this._emitted.block = blockNumber;
                    this.emit("block", blockNumber);
                });
                break;
            case "pending":
                this._subscribe("pending", [
                    "newPendingTransactions"
                ], (result)=>{
                    this.emit("pending", result);
                });
                break;
            case "filter":
                this._subscribe(event.tag, [
                    "logs",
                    this._getFilter(event.filter)
                ], (result)=>{
                    if (result.removed == null) {
                        result.removed = false;
                    }
                    this.emit(event.filter, this.formatter.filterLog(result));
                });
                break;
            case "tx":
                {
                    const emitReceipt = (event)=>{
                        const hash = event.hash;
                        this.getTransactionReceipt(hash).then((receipt)=>{
                            if (!receipt) {
                                return;
                            }
                            this.emit(hash, receipt);
                        });
                    };
                    // In case it is already mined
                    emitReceipt(event);
                    // To keep things simple, we start up a single newHeads subscription
                    // to keep an eye out for transactions we are watching for.
                    // Starting a subscription for an event (i.e. "tx") that is already
                    // running is (basically) a nop.
                    this._subscribe("tx", [
                        "newHeads"
                    ], (result)=>{
                        this._events.filter((e)=>e.type === "tx").forEach(emitReceipt);
                    });
                    break;
                }
            // Nothing is needed
            case "debug":
            case "poll":
            case "willPoll":
            case "didPoll":
            case "error":
                break;
            default:
                console.log("unhandled:", event);
                break;
        }
    }
    _stopEvent(event) {
        let tag = event.tag;
        if (event.type === "tx") {
            // There are remaining transaction event listeners
            if (this._events.filter((e)=>e.type === "tx").length) {
                return;
            }
            tag = "tx";
        } else if (this.listenerCount(event.event)) {
            // There are remaining event listeners
            return;
        }
        const subId = this._subIds[tag];
        if (!subId) {
            return;
        }
        delete this._subIds[tag];
        subId.then((subId)=>{
            if (!this._subs[subId]) {
                return;
            }
            delete this._subs[subId];
            this.send("eth_unsubscribe", [
                subId
            ]);
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function*() {
            // Wait until we have connected before trying to disconnect
            if (this.websocket.readyState === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$ws$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebSocket"].CONNECTING) {
                yield new Promise((resolve)=>{
                    this.websocket.onopen = function() {
                        resolve(true);
                    };
                    this.websocket.onerror = function() {
                        resolve(false);
                    };
                });
            }
            // Hangup
            // See: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
            this.websocket.close(1000);
        });
    }
} //# sourceMappingURL=websocket-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/fallback-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "FallbackProvider": (()=>FallbackProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abstract$2d$provider$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abstract$2d$provider$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abstract-provider@5.7.0/node_modules/@ethersproject/abstract-provider/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/formatter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$random$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$random$2f$lib$2e$esm$2f$shuffle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+random@5.7.0/node_modules/@ethersproject/random/lib.esm/shuffle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$base$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/base-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bignumber@5.7.0/node_modules/@ethersproject/bignumber/lib.esm/bignumber.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+web@5.7.1/node_modules/@ethersproject/web/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bytes@5.7.0/node_modules/@ethersproject/bytes/lib.esm/index.js [app-client] (ecmascript)");
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
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
function now() {
    return new Date().getTime();
}
// Returns to network as long as all agree, or null if any is null.
// Throws an error if any two networks do not match.
function checkNetworks(networks) {
    let result = null;
    for(let i = 0; i < networks.length; i++){
        const network = networks[i];
        // Null! We do not know our network; bail.
        if (network == null) {
            return null;
        }
        if (result) {
            // Make sure the network matches the previous networks
            if (!(result.name === network.name && result.chainId === network.chainId && (result.ensAddress === network.ensAddress || result.ensAddress == null && network.ensAddress == null))) {
                logger.throwArgumentError("provider mismatch", "networks", networks);
            }
        } else {
            result = network;
        }
    }
    return result;
}
function median(values, maxDelta) {
    values = values.slice().sort();
    const middle = Math.floor(values.length / 2);
    // Odd length; take the middle
    if (values.length % 2) {
        return values[middle];
    }
    // Even length; take the average of the two middle
    const a = values[middle - 1], b = values[middle];
    if (maxDelta != null && Math.abs(a - b) > maxDelta) {
        return null;
    }
    return (a + b) / 2;
}
function serialize(value) {
    if (value === null) {
        return "null";
    } else if (typeof value === "number" || typeof value === "boolean") {
        return JSON.stringify(value);
    } else if (typeof value === "string") {
        return value;
    } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bignumber$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bignumber$2f$lib$2e$esm$2f$bignumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BigNumber"].isBigNumber(value)) {
        return value.toString();
    } else if (Array.isArray(value)) {
        return JSON.stringify(value.map((i)=>serialize(i)));
    } else if (typeof value === "object") {
        const keys = Object.keys(value);
        keys.sort();
        return "{" + keys.map((key)=>{
            let v = value[key];
            if (typeof v === "function") {
                v = "[function]";
            } else {
                v = serialize(v);
            }
            return JSON.stringify(key) + ":" + v;
        }).join(",") + "}";
    }
    throw new Error("unknown value type: " + typeof value);
}
// Next request ID to use for emitting debug info
let nextRid = 1;
;
function stall(duration) {
    let cancel = null;
    let timer = null;
    let promise = new Promise((resolve)=>{
        cancel = function() {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            resolve();
        };
        timer = setTimeout(cancel, duration);
    });
    const wait = (func)=>{
        promise = promise.then(func);
        return promise;
    };
    function getPromise() {
        return promise;
    }
    return {
        cancel,
        getPromise,
        wait
    };
}
const ForwardErrors = [
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.INSUFFICIENT_FUNDS,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NONCE_EXPIRED,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.REPLACEMENT_UNDERPRICED,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNPREDICTABLE_GAS_LIMIT
];
const ForwardProperties = [
    "address",
    "args",
    "errorArgs",
    "errorSignature",
    "method",
    "transaction"
];
;
function exposeDebugConfig(config, now) {
    const result = {
        weight: config.weight
    };
    Object.defineProperty(result, "provider", {
        get: ()=>config.provider
    });
    if (config.start) {
        result.start = config.start;
    }
    if (now) {
        result.duration = now - config.start;
    }
    if (config.done) {
        if (config.error) {
            result.error = config.error;
        } else {
            result.result = config.result || null;
        }
    }
    return result;
}
function normalizedTally(normalize, quorum) {
    return function(configs) {
        // Count the votes for each result
        const tally = {};
        configs.forEach((c)=>{
            const value = normalize(c.result);
            if (!tally[value]) {
                tally[value] = {
                    count: 0,
                    result: c.result
                };
            }
            tally[value].count++;
        });
        // Check for a quorum on any given result
        const keys = Object.keys(tally);
        for(let i = 0; i < keys.length; i++){
            const check = tally[keys[i]];
            if (check.count >= quorum) {
                return check.result;
            }
        }
        // No quroum
        return undefined;
    };
}
function getProcessFunc(provider, method, params) {
    let normalize = serialize;
    switch(method){
        case "getBlockNumber":
            // Return the median value, unless there is (median + 1) is also
            // present, in which case that is probably true and the median
            // is going to be stale soon. In the event of a malicious node,
            // the lie will be true soon enough.
            return function(configs) {
                const values = configs.map((c)=>c.result);
                // Get the median block number
                let blockNumber = median(configs.map((c)=>c.result), 2);
                if (blockNumber == null) {
                    return undefined;
                }
                blockNumber = Math.ceil(blockNumber);
                // If the next block height is present, its prolly safe to use
                if (values.indexOf(blockNumber + 1) >= 0) {
                    blockNumber++;
                }
                // Don't ever roll back the blockNumber
                if (blockNumber >= provider._highestBlockNumber) {
                    provider._highestBlockNumber = blockNumber;
                }
                return provider._highestBlockNumber;
            };
        case "getGasPrice":
            // Return the middle (round index up) value, similar to median
            // but do not average even entries and choose the higher.
            // Malicious actors must compromise 50% of the nodes to lie.
            return function(configs) {
                const values = configs.map((c)=>c.result);
                values.sort();
                return values[Math.floor(values.length / 2)];
            };
        case "getEtherPrice":
            // Returns the median price. Malicious actors must compromise at
            // least 50% of the nodes to lie (in a meaningful way).
            return function(configs) {
                return median(configs.map((c)=>c.result));
            };
        // No additional normalizing required; serialize is enough
        case "getBalance":
        case "getTransactionCount":
        case "getCode":
        case "getStorageAt":
        case "call":
        case "estimateGas":
        case "getLogs":
            break;
        // We drop the confirmations from transactions as it is approximate
        case "getTransaction":
        case "getTransactionReceipt":
            normalize = function(tx) {
                if (tx == null) {
                    return null;
                }
                tx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"])(tx);
                tx.confirmations = -1;
                return serialize(tx);
            };
            break;
        // We drop the confirmations from transactions as it is approximate
        case "getBlock":
            // We drop the confirmations from transactions as it is approximate
            if (params.includeTransactions) {
                normalize = function(block) {
                    if (block == null) {
                        return null;
                    }
                    block = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"])(block);
                    block.transactions = block.transactions.map((tx)=>{
                        tx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"])(tx);
                        tx.confirmations = -1;
                        return tx;
                    });
                    return serialize(block);
                };
            } else {
                normalize = function(block) {
                    if (block == null) {
                        return null;
                    }
                    return serialize(block);
                };
            }
            break;
        default:
            throw new Error("unknown method: " + method);
    }
    // Return the result if and only if the expected quorum is
    // satisfied and agreed upon for the final result.
    return normalizedTally(normalize, provider.quorum);
}
// If we are doing a blockTag query, we need to make sure the backend is
// caught up to the FallbackProvider, before sending a request to it.
function waitForSync(config, blockNumber) {
    return __awaiter(this, void 0, void 0, function*() {
        const provider = config.provider;
        if (provider.blockNumber != null && provider.blockNumber >= blockNumber || blockNumber === -1) {
            return provider;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["poll"])(()=>{
            return new Promise((resolve, reject)=>{
                setTimeout(function() {
                    // We are synced
                    if (provider.blockNumber >= blockNumber) {
                        return resolve(provider);
                    }
                    // We're done; just quit
                    if (config.cancelled) {
                        return resolve(null);
                    }
                    // Try again, next block
                    return resolve(undefined);
                }, 0);
            });
        }, {
            oncePoll: provider
        });
    });
}
function getRunner(config, currentBlockNumber, method, params) {
    return __awaiter(this, void 0, void 0, function*() {
        let provider = config.provider;
        switch(method){
            case "getBlockNumber":
            case "getGasPrice":
                return provider[method]();
            case "getEtherPrice":
                if (provider.getEtherPrice) {
                    return provider.getEtherPrice();
                }
                break;
            case "getBalance":
            case "getTransactionCount":
            case "getCode":
                if (params.blockTag && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(params.blockTag)) {
                    provider = yield waitForSync(config, currentBlockNumber);
                }
                return provider[method](params.address, params.blockTag || "latest");
            case "getStorageAt":
                if (params.blockTag && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(params.blockTag)) {
                    provider = yield waitForSync(config, currentBlockNumber);
                }
                return provider.getStorageAt(params.address, params.position, params.blockTag || "latest");
            case "getBlock":
                if (params.blockTag && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(params.blockTag)) {
                    provider = yield waitForSync(config, currentBlockNumber);
                }
                return provider[params.includeTransactions ? "getBlockWithTransactions" : "getBlock"](params.blockTag || params.blockHash);
            case "call":
            case "estimateGas":
                if (params.blockTag && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(params.blockTag)) {
                    provider = yield waitForSync(config, currentBlockNumber);
                }
                if (method === "call" && params.blockTag) {
                    return provider[method](params.transaction, params.blockTag);
                }
                return provider[method](params.transaction);
            case "getTransaction":
            case "getTransactionReceipt":
                return provider[method](params.transactionHash);
            case "getLogs":
                {
                    let filter = params.filter;
                    if (filter.fromBlock && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(filter.fromBlock) || filter.toBlock && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(filter.toBlock)) {
                        provider = yield waitForSync(config, currentBlockNumber);
                    }
                    return provider.getLogs(filter);
                }
        }
        return logger.throwError("unknown method error", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNKNOWN_ERROR, {
            method: method,
            params: params
        });
    });
}
class FallbackProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$base$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseProvider"] {
    constructor(providers, quorum){
        if (providers.length === 0) {
            logger.throwArgumentError("missing providers", "providers", providers);
        }
        const providerConfigs = providers.map((configOrProvider, index)=>{
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abstract$2d$provider$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abstract$2d$provider$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"].isProvider(configOrProvider)) {
                const stallTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCommunityResource"])(configOrProvider) ? 2000 : 750;
                const priority = 1;
                return Object.freeze({
                    provider: configOrProvider,
                    weight: 1,
                    stallTimeout,
                    priority
                });
            }
            const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"])(configOrProvider);
            if (config.priority == null) {
                config.priority = 1;
            }
            if (config.stallTimeout == null) {
                config.stallTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCommunityResource"])(configOrProvider) ? 2000 : 750;
            }
            if (config.weight == null) {
                config.weight = 1;
            }
            const weight = config.weight;
            if (weight % 1 || weight > 512 || weight < 1) {
                logger.throwArgumentError("invalid weight; must be integer in [1, 512]", `providers[${index}].weight`, weight);
            }
            return Object.freeze(config);
        });
        const total = providerConfigs.reduce((accum, c)=>accum + c.weight, 0);
        if (quorum == null) {
            quorum = total / 2;
        } else if (quorum > total) {
            logger.throwArgumentError("quorum will always fail; larger than total weight", "quorum", quorum);
        }
        // Are all providers' networks are known
        let networkOrReady = checkNetworks(providerConfigs.map((c)=>c.provider.network));
        // Not all networks are known; we must stall
        if (networkOrReady == null) {
            networkOrReady = new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    this.detectNetwork().then(resolve, reject);
                }, 0);
            });
        }
        super(networkOrReady);
        // Preserve a copy, so we do not get mutated
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "providerConfigs", Object.freeze(providerConfigs));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "quorum", quorum);
        this._highestBlockNumber = -1;
    }
    detectNetwork() {
        return __awaiter(this, void 0, void 0, function*() {
            const networks = yield Promise.all(this.providerConfigs.map((c)=>c.provider.getNetwork()));
            return checkNetworks(networks);
        });
    }
    perform(method, params) {
        return __awaiter(this, void 0, void 0, function*() {
            // Sending transactions is special; always broadcast it to all backends
            if (method === "sendTransaction") {
                const results = yield Promise.all(this.providerConfigs.map((c)=>{
                    return c.provider.sendTransaction(params.signedTransaction).then((result)=>{
                        return result.hash;
                    }, (error)=>{
                        return error;
                    });
                }));
                // Any success is good enough (other errors are likely "already seen" errors
                for(let i = 0; i < results.length; i++){
                    const result = results[i];
                    if (typeof result === "string") {
                        return result;
                    }
                }
                // They were all an error; pick the first error
                throw results[0];
            }
            // We need to make sure we are in sync with our backends, so we need
            // to know this before we can make a lot of calls
            if (this._highestBlockNumber === -1 && method !== "getBlockNumber") {
                yield this.getBlockNumber();
            }
            const processFunc = getProcessFunc(this, method, params);
            // Shuffle the providers and then sort them by their priority; we
            // shallowCopy them since we will store the result in them too
            const configs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$random$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$random$2f$lib$2e$esm$2f$shuffle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shuffled"])(this.providerConfigs.map(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shallowCopy"]));
            configs.sort((a, b)=>a.priority - b.priority);
            const currentBlockNumber = this._highestBlockNumber;
            let i = 0;
            let first = true;
            while(true){
                const t0 = now();
                // Compute the inflight weight (exclude anything past)
                let inflightWeight = configs.filter((c)=>c.runner && t0 - c.start < c.stallTimeout).reduce((accum, c)=>accum + c.weight, 0);
                // Start running enough to meet quorum
                while(inflightWeight < this.quorum && i < configs.length){
                    const config = configs[i++];
                    const rid = nextRid++;
                    config.start = now();
                    config.staller = stall(config.stallTimeout);
                    config.staller.wait(()=>{
                        config.staller = null;
                    });
                    config.runner = getRunner(config, currentBlockNumber, method, params).then((result)=>{
                        config.done = true;
                        config.result = result;
                        if (this.listenerCount("debug")) {
                            this.emit("debug", {
                                action: "request",
                                rid: rid,
                                backend: exposeDebugConfig(config, now()),
                                request: {
                                    method: method,
                                    params: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deepCopy"])(params)
                                },
                                provider: this
                            });
                        }
                    }, (error)=>{
                        config.done = true;
                        config.error = error;
                        if (this.listenerCount("debug")) {
                            this.emit("debug", {
                                action: "request",
                                rid: rid,
                                backend: exposeDebugConfig(config, now()),
                                request: {
                                    method: method,
                                    params: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deepCopy"])(params)
                                },
                                provider: this
                            });
                        }
                    });
                    if (this.listenerCount("debug")) {
                        this.emit("debug", {
                            action: "request",
                            rid: rid,
                            backend: exposeDebugConfig(config, null),
                            request: {
                                method: method,
                                params: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deepCopy"])(params)
                            },
                            provider: this
                        });
                    }
                    inflightWeight += config.weight;
                }
                // Wait for anything meaningful to finish or stall out
                const waiting = [];
                configs.forEach((c)=>{
                    if (c.done || !c.runner) {
                        return;
                    }
                    waiting.push(c.runner);
                    if (c.staller) {
                        waiting.push(c.staller.getPromise());
                    }
                });
                if (waiting.length) {
                    yield Promise.race(waiting);
                }
                // Check the quorum and process the results; the process function
                // may additionally decide the quorum is not met
                const results = configs.filter((c)=>c.done && c.error == null);
                if (results.length >= this.quorum) {
                    const result = processFunc(results);
                    if (result !== undefined) {
                        // Shut down any stallers
                        configs.forEach((c)=>{
                            if (c.staller) {
                                c.staller.cancel();
                            }
                            c.cancelled = true;
                        });
                        return result;
                    }
                    if (!first) {
                        yield stall(100).getPromise();
                    }
                    first = false;
                }
                // No result, check for errors that should be forwarded
                const errors = configs.reduce((accum, c)=>{
                    if (!c.done || c.error == null) {
                        return accum;
                    }
                    const code = c.error.code;
                    if (ForwardErrors.indexOf(code) >= 0) {
                        if (!accum[code]) {
                            accum[code] = {
                                error: c.error,
                                weight: 0
                            };
                        }
                        accum[code].weight += c.weight;
                    }
                    return accum;
                }, {});
                Object.keys(errors).forEach((errorCode)=>{
                    const tally = errors[errorCode];
                    if (tally.weight < this.quorum) {
                        return;
                    }
                    // Shut down any stallers
                    configs.forEach((c)=>{
                        if (c.staller) {
                            c.staller.cancel();
                        }
                        c.cancelled = true;
                    });
                    const e = tally.error;
                    const props = {};
                    ForwardProperties.forEach((name)=>{
                        if (e[name] == null) {
                            return;
                        }
                        props[name] = e[name];
                    });
                    logger.throwError(e.reason || e.message, errorCode, props);
                });
                // All configs have run to completion; we will never get more data
                if (configs.filter((c)=>!c.done).length === 0) {
                    break;
                }
            }
            // Shut down any stallers; shouldn't be any
            configs.forEach((c)=>{
                if (c.staller) {
                    c.staller.cancel();
                }
                c.cancelled = true;
            });
            return logger.throwError("failed to meet quorum", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR, {
                method: method,
                params: params,
                //results: configs.map((c) => c.result),
                //errors: configs.map((c) => c.error),
                results: configs.map((c)=>exposeDebugConfig(c)),
                provider: this
            });
        });
    }
} //# sourceMappingURL=fallback-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/url-json-rpc-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "StaticJsonRpcProvider": (()=>StaticJsonRpcProvider),
    "UrlJsonRpcProvider": (()=>UrlJsonRpcProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js [app-client] (ecmascript)");
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
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
;
class StaticJsonRpcProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JsonRpcProvider"] {
    detectNetwork() {
        const _super = Object.create(null, {
            detectNetwork: {
                get: ()=>super.detectNetwork
            }
        });
        return __awaiter(this, void 0, void 0, function*() {
            let network = this.network;
            if (network == null) {
                network = yield _super.detectNetwork.call(this);
                if (!network) {
                    logger.throwError("no network detected", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNKNOWN_ERROR, {});
                }
                // If still not set, set it
                if (this._network == null) {
                    // A static network does not support "any"
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "_network", network);
                    this.emit("network", network, null);
                }
            }
            return network;
        });
    }
}
class UrlJsonRpcProvider extends StaticJsonRpcProvider {
    constructor(network, apiKey){
        logger.checkAbstract(new.target, UrlJsonRpcProvider);
        // Normalize the Network and API Key
        network = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatic"])(new.target, "getNetwork")(network);
        apiKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatic"])(new.target, "getApiKey")(apiKey);
        const connection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatic"])(new.target, "getUrl")(network, apiKey);
        super(connection, network);
        if (typeof apiKey === "string") {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "apiKey", apiKey);
        } else if (apiKey != null) {
            Object.keys(apiKey).forEach((key)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, key, apiKey[key]);
            });
        }
    }
    _startPending() {
        logger.warn("WARNING: API provider does not support pending filters");
    }
    isCommunityResource() {
        return false;
    }
    getSigner(address) {
        return logger.throwError("API provider does not support signing", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
            operation: "getSigner"
        });
    }
    listAccounts() {
        return Promise.resolve([]);
    }
    // Return a defaultApiKey if null, otherwise validate the API key
    static getApiKey(apiKey) {
        return apiKey;
    }
    // Returns the url or connection for the given network and API key. The
    // API key will have been sanitized by the getApiKey first, so any validation
    // or transformations can be done there.
    static getUrl(network, apiKey) {
        return logger.throwError("not implemented; sub-classes must override getUrl", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NOT_IMPLEMENTED, {
            operation: "getUrl"
        });
    }
} //# sourceMappingURL=url-json-rpc-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/alchemy-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AlchemyProvider": (()=>AlchemyProvider),
    "AlchemyWebSocketProvider": (()=>AlchemyWebSocketProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$websocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/websocket-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/formatter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/url-json-rpc-provider.js [app-client] (ecmascript)");
"use strict";
;
;
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
;
// This key was provided to ethers.js by Alchemy to be used by the
// default provider, but it is recommended that for your own
// production environments, that you acquire your own API key at:
//   https://dashboard.alchemyapi.io
const defaultApiKey = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";
class AlchemyWebSocketProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$websocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebSocketProvider"] {
    constructor(network, apiKey){
        const provider = new AlchemyProvider(network, apiKey);
        const url = provider.connection.url.replace(/^http/i, "ws").replace(".alchemyapi.", ".ws.alchemyapi.");
        super(url, provider.network);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "apiKey", provider.apiKey);
    }
    isCommunityResource() {
        return this.apiKey === defaultApiKey;
    }
}
class AlchemyProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UrlJsonRpcProvider"] {
    static getWebSocketProvider(network, apiKey) {
        return new AlchemyWebSocketProvider(network, apiKey);
    }
    static getApiKey(apiKey) {
        if (apiKey == null) {
            return defaultApiKey;
        }
        if (apiKey && typeof apiKey !== "string") {
            logger.throwArgumentError("invalid apiKey", "apiKey", apiKey);
        }
        return apiKey;
    }
    static getUrl(network, apiKey) {
        let host = null;
        switch(network.name){
            case "homestead":
                host = "eth-mainnet.alchemyapi.io/v2/";
                break;
            case "goerli":
                host = "eth-goerli.g.alchemy.com/v2/";
                break;
            case "matic":
                host = "polygon-mainnet.g.alchemy.com/v2/";
                break;
            case "maticmum":
                host = "polygon-mumbai.g.alchemy.com/v2/";
                break;
            case "arbitrum":
                host = "arb-mainnet.g.alchemy.com/v2/";
                break;
            case "arbitrum-goerli":
                host = "arb-goerli.g.alchemy.com/v2/";
                break;
            case "optimism":
                host = "opt-mainnet.g.alchemy.com/v2/";
                break;
            case "optimism-goerli":
                host = "opt-goerli.g.alchemy.com/v2/";
                break;
            default:
                logger.throwArgumentError("unsupported network", "network", arguments[0]);
        }
        return {
            allowGzip: true,
            url: "https:/" + "/" + host + apiKey,
            throttleCallback: (attempt, url)=>{
                if (apiKey === defaultApiKey) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["showThrottleMessage"])();
                }
                return Promise.resolve(true);
            }
        };
    }
    isCommunityResource() {
        return this.apiKey === defaultApiKey;
    }
} //# sourceMappingURL=alchemy-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/ankr-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AnkrProvider": (()=>AnkrProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/formatter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/url-json-rpc-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
;
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
const defaultApiKey = "9f7d929b018cdffb338517efa06f58359e86ff1ffd350bc889738523659e7972";
function getHost(name) {
    switch(name){
        case "homestead":
            return "rpc.ankr.com/eth/";
        case "ropsten":
            return "rpc.ankr.com/eth_ropsten/";
        case "rinkeby":
            return "rpc.ankr.com/eth_rinkeby/";
        case "goerli":
            return "rpc.ankr.com/eth_goerli/";
        case "matic":
            return "rpc.ankr.com/polygon/";
        case "arbitrum":
            return "rpc.ankr.com/arbitrum/";
    }
    return logger.throwArgumentError("unsupported network", "name", name);
}
class AnkrProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UrlJsonRpcProvider"] {
    isCommunityResource() {
        return this.apiKey === defaultApiKey;
    }
    static getApiKey(apiKey) {
        if (apiKey == null) {
            return defaultApiKey;
        }
        return apiKey;
    }
    static getUrl(network, apiKey) {
        if (apiKey == null) {
            apiKey = defaultApiKey;
        }
        const connection = {
            allowGzip: true,
            url: "https:/\/" + getHost(network.name) + apiKey,
            throttleCallback: (attempt, url)=>{
                if (apiKey.apiKey === defaultApiKey) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["showThrottleMessage"])();
                }
                return Promise.resolve(true);
            }
        };
        if (apiKey.projectSecret != null) {
            connection.user = "";
            connection.password = apiKey.projectSecret;
        }
        return connection;
    }
} //# sourceMappingURL=ankr-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/cloudflare-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "CloudflareProvider": (()=>CloudflareProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/url-json-rpc-provider.js [app-client] (ecmascript)");
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
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
class CloudflareProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UrlJsonRpcProvider"] {
    static getApiKey(apiKey) {
        if (apiKey != null) {
            logger.throwArgumentError("apiKey not supported for cloudflare", "apiKey", apiKey);
        }
        return null;
    }
    static getUrl(network, apiKey) {
        let host = null;
        switch(network.name){
            case "homestead":
                host = "https://cloudflare-eth.com/";
                break;
            default:
                logger.throwArgumentError("unsupported network", "network", arguments[0]);
        }
        return host;
    }
    perform(method, params) {
        const _super = Object.create(null, {
            perform: {
                get: ()=>super.perform
            }
        });
        return __awaiter(this, void 0, void 0, function*() {
            // The Cloudflare provider does not support eth_blockNumber,
            // so we get the latest block and pull it from that
            if (method === "getBlockNumber") {
                const block = yield _super.perform.call(this, "getBlock", {
                    blockTag: "latest"
                });
                return block.number;
            }
            return _super.perform.call(this, method, params);
        });
    }
} //# sourceMappingURL=cloudflare-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/etherscan-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "EtherscanProvider": (()=>EtherscanProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/formatter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+web@5.7.1/node_modules/@ethersproject/web/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$base$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/base-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+bytes@5.7.0/node_modules/@ethersproject/bytes/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$transactions$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$transactions$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+transactions@5.7.0/node_modules/@ethersproject/transactions/lib.esm/index.js [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
;
// The transaction has already been sanitized by the calls in Provider
function getTransactionPostData(transaction) {
    const result = {};
    for(let key in transaction){
        if (transaction[key] == null) {
            continue;
        }
        let value = transaction[key];
        if (key === "type" && value === 0) {
            continue;
        }
        // Quantity-types require no leading zero, unless 0
        if (({
            type: true,
            gasLimit: true,
            gasPrice: true,
            maxFeePerGs: true,
            maxPriorityFeePerGas: true,
            nonce: true,
            value: true
        })[key]) {
            value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexValue"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexlify"])(value));
        } else if (key === "accessList") {
            value = "[" + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$transactions$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$transactions$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accessListify"])(value).map((set)=>{
                return `{address:"${set.address}",storageKeys:["${set.storageKeys.join('","')}"]}`;
            }).join(",") + "]";
        } else {
            value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexlify"])(value);
        }
        result[key] = value;
    }
    return result;
}
function getResult(result) {
    // getLogs, getHistory have weird success responses
    if (result.status == 0 && (result.message === "No records found" || result.message === "No transactions found")) {
        return result.result;
    }
    if (result.status != 1 || typeof result.message !== "string" || !result.message.match(/^OK/)) {
        const error = new Error("invalid response");
        error.result = JSON.stringify(result);
        if ((result.result || "").toLowerCase().indexOf("rate limit") >= 0) {
            error.throttleRetry = true;
        }
        throw error;
    }
    return result.result;
}
function getJsonResult(result) {
    // This response indicates we are being throttled
    if (result && result.status == 0 && result.message == "NOTOK" && (result.result || "").toLowerCase().indexOf("rate limit") >= 0) {
        const error = new Error("throttled response");
        error.result = JSON.stringify(result);
        error.throttleRetry = true;
        throw error;
    }
    if (result.jsonrpc != "2.0") {
        // @TODO: not any
        const error = new Error("invalid response");
        error.result = JSON.stringify(result);
        throw error;
    }
    if (result.error) {
        // @TODO: not any
        const error = new Error(result.error.message || "unknown error");
        if (result.error.code) {
            error.code = result.error.code;
        }
        if (result.error.data) {
            error.data = result.error.data;
        }
        throw error;
    }
    return result.result;
}
// The blockTag was normalized as a string by the Provider pre-perform operations
function checkLogTag(blockTag) {
    if (blockTag === "pending") {
        throw new Error("pending not supported");
    }
    if (blockTag === "latest") {
        return blockTag;
    }
    return parseInt(blockTag.substring(2), 16);
}
function checkError(method, error, transaction) {
    // Undo the "convenience" some nodes are attempting to prevent backwards
    // incompatibility; maybe for v6 consider forwarding reverts as errors
    if (method === "call" && error.code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR) {
        const e = error.error;
        // Etherscan keeps changing their string
        if (e && (e.message.match(/reverted/i) || e.message.match(/VM execution error/i))) {
            // Etherscan prefixes the data like "Reverted 0x1234"
            let data = e.data;
            if (data) {
                data = "0x" + data.replace(/^.*0x/i, "");
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$bytes$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$bytes$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHexString"])(data)) {
                return data;
            }
            logger.throwError("missing revert data in call exception", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.CALL_EXCEPTION, {
                error,
                data: "0x"
            });
        }
    }
    // Get the message from any nested error structure
    let message = error.message;
    if (error.code === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.SERVER_ERROR) {
        if (error.error && typeof error.error.message === "string") {
            message = error.error.message;
        } else if (typeof error.body === "string") {
            message = error.body;
        } else if (typeof error.responseText === "string") {
            message = error.responseText;
        }
    }
    message = (message || "").toLowerCase();
    // "Insufficient funds. The account you tried to send transaction from does not have enough funds. Required 21464000000000 and got: 0"
    if (message.match(/insufficient funds/)) {
        logger.throwError("insufficient funds for intrinsic transaction cost", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.INSUFFICIENT_FUNDS, {
            error,
            method,
            transaction
        });
    }
    // "Transaction with the same hash was already imported."
    if (message.match(/same hash was already imported|transaction nonce is too low|nonce too low/)) {
        logger.throwError("nonce has already been used", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NONCE_EXPIRED, {
            error,
            method,
            transaction
        });
    }
    // "Transaction gas price is too low. There is another transaction with same nonce in the queue. Try increasing the gas price or incrementing the nonce."
    if (message.match(/another transaction with same nonce/)) {
        logger.throwError("replacement fee too low", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.REPLACEMENT_UNDERPRICED, {
            error,
            method,
            transaction
        });
    }
    if (message.match(/execution failed due to an exception|execution reverted/)) {
        logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNPREDICTABLE_GAS_LIMIT, {
            error,
            method,
            transaction
        });
    }
    throw error;
}
class EtherscanProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$base$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseProvider"] {
    constructor(network, apiKey){
        super(network);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "baseUrl", this.getBaseUrl());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "apiKey", apiKey || null);
    }
    getBaseUrl() {
        switch(this.network ? this.network.name : "invalid"){
            case "homestead":
                return "https:/\/api.etherscan.io";
            case "goerli":
                return "https:/\/api-goerli.etherscan.io";
            case "sepolia":
                return "https:/\/api-sepolia.etherscan.io";
            case "matic":
                return "https:/\/api.polygonscan.com";
            case "maticmum":
                return "https:/\/api-testnet.polygonscan.com";
            case "arbitrum":
                return "https:/\/api.arbiscan.io";
            case "arbitrum-goerli":
                return "https:/\/api-goerli.arbiscan.io";
            case "optimism":
                return "https:/\/api-optimistic.etherscan.io";
            case "optimism-goerli":
                return "https:/\/api-goerli-optimistic.etherscan.io";
            default:
        }
        return logger.throwArgumentError("unsupported network", "network", this.network.name);
    }
    getUrl(module, params) {
        const query = Object.keys(params).reduce((accum, key)=>{
            const value = params[key];
            if (value != null) {
                accum += `&${key}=${value}`;
            }
            return accum;
        }, "");
        const apiKey = this.apiKey ? `&apikey=${this.apiKey}` : "";
        return `${this.baseUrl}/api?module=${module}${query}${apiKey}`;
    }
    getPostUrl() {
        return `${this.baseUrl}/api`;
    }
    getPostData(module, params) {
        params.module = module;
        params.apikey = this.apiKey;
        return params;
    }
    fetch(module, params, post) {
        return __awaiter(this, void 0, void 0, function*() {
            const url = post ? this.getPostUrl() : this.getUrl(module, params);
            const payload = post ? this.getPostData(module, params) : null;
            const procFunc = module === "proxy" ? getJsonResult : getResult;
            this.emit("debug", {
                action: "request",
                request: url,
                provider: this
            });
            const connection = {
                url: url,
                throttleSlotInterval: 1000,
                throttleCallback: (attempt, url)=>{
                    if (this.isCommunityResource()) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["showThrottleMessage"])();
                    }
                    return Promise.resolve(true);
                }
            };
            let payloadStr = null;
            if (payload) {
                connection.headers = {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                };
                payloadStr = Object.keys(payload).map((key)=>{
                    return `${key}=${payload[key]}`;
                }).join("&");
            }
            const result = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(connection, payloadStr, procFunc || getJsonResult);
            this.emit("debug", {
                action: "response",
                request: url,
                response: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deepCopy"])(result),
                provider: this
            });
            return result;
        });
    }
    detectNetwork() {
        return __awaiter(this, void 0, void 0, function*() {
            return this.network;
        });
    }
    perform(method, params) {
        const _super = Object.create(null, {
            perform: {
                get: ()=>super.perform
            }
        });
        return __awaiter(this, void 0, void 0, function*() {
            switch(method){
                case "getBlockNumber":
                    return this.fetch("proxy", {
                        action: "eth_blockNumber"
                    });
                case "getGasPrice":
                    return this.fetch("proxy", {
                        action: "eth_gasPrice"
                    });
                case "getBalance":
                    // Returns base-10 result
                    return this.fetch("account", {
                        action: "balance",
                        address: params.address,
                        tag: params.blockTag
                    });
                case "getTransactionCount":
                    return this.fetch("proxy", {
                        action: "eth_getTransactionCount",
                        address: params.address,
                        tag: params.blockTag
                    });
                case "getCode":
                    return this.fetch("proxy", {
                        action: "eth_getCode",
                        address: params.address,
                        tag: params.blockTag
                    });
                case "getStorageAt":
                    return this.fetch("proxy", {
                        action: "eth_getStorageAt",
                        address: params.address,
                        position: params.position,
                        tag: params.blockTag
                    });
                case "sendTransaction":
                    return this.fetch("proxy", {
                        action: "eth_sendRawTransaction",
                        hex: params.signedTransaction
                    }, true).catch((error)=>{
                        return checkError("sendTransaction", error, params.signedTransaction);
                    });
                case "getBlock":
                    if (params.blockTag) {
                        return this.fetch("proxy", {
                            action: "eth_getBlockByNumber",
                            tag: params.blockTag,
                            boolean: params.includeTransactions ? "true" : "false"
                        });
                    }
                    throw new Error("getBlock by blockHash not implemented");
                case "getTransaction":
                    return this.fetch("proxy", {
                        action: "eth_getTransactionByHash",
                        txhash: params.transactionHash
                    });
                case "getTransactionReceipt":
                    return this.fetch("proxy", {
                        action: "eth_getTransactionReceipt",
                        txhash: params.transactionHash
                    });
                case "call":
                    {
                        if (params.blockTag !== "latest") {
                            throw new Error("EtherscanProvider does not support blockTag for call");
                        }
                        const postData = getTransactionPostData(params.transaction);
                        postData.module = "proxy";
                        postData.action = "eth_call";
                        try {
                            return yield this.fetch("proxy", postData, true);
                        } catch (error) {
                            return checkError("call", error, params.transaction);
                        }
                    }
                case "estimateGas":
                    {
                        const postData = getTransactionPostData(params.transaction);
                        postData.module = "proxy";
                        postData.action = "eth_estimateGas";
                        try {
                            return yield this.fetch("proxy", postData, true);
                        } catch (error) {
                            return checkError("estimateGas", error, params.transaction);
                        }
                    }
                case "getLogs":
                    {
                        const args = {
                            action: "getLogs"
                        };
                        if (params.filter.fromBlock) {
                            args.fromBlock = checkLogTag(params.filter.fromBlock);
                        }
                        if (params.filter.toBlock) {
                            args.toBlock = checkLogTag(params.filter.toBlock);
                        }
                        if (params.filter.address) {
                            args.address = params.filter.address;
                        }
                        // @TODO: We can handle slightly more complicated logs using the logs API
                        if (params.filter.topics && params.filter.topics.length > 0) {
                            if (params.filter.topics.length > 1) {
                                logger.throwError("unsupported topic count", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                                    topics: params.filter.topics
                                });
                            }
                            if (params.filter.topics.length === 1) {
                                const topic0 = params.filter.topics[0];
                                if (typeof topic0 !== "string" || topic0.length !== 66) {
                                    logger.throwError("unsupported topic format", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                                        topic0: topic0
                                    });
                                }
                                args.topic0 = topic0;
                            }
                        }
                        const logs = yield this.fetch("logs", args);
                        // Cache txHash => blockHash
                        let blocks = {};
                        // Add any missing blockHash to the logs
                        for(let i = 0; i < logs.length; i++){
                            const log = logs[i];
                            if (log.blockHash != null) {
                                continue;
                            }
                            if (blocks[log.blockNumber] == null) {
                                const block = yield this.getBlock(log.blockNumber);
                                if (block) {
                                    blocks[log.blockNumber] = block.hash;
                                }
                            }
                            log.blockHash = blocks[log.blockNumber];
                        }
                        return logs;
                    }
                case "getEtherPrice":
                    if (this.network.name !== "homestead") {
                        return 0.0;
                    }
                    return parseFloat((yield this.fetch("stats", {
                        action: "ethprice"
                    })).ethusd);
                default:
                    break;
            }
            return _super.perform.call(this, method, params);
        });
    }
    // Note: The `page` page parameter only allows pagination within the
    //       10,000 window available without a page and offset parameter
    //       Error: Result window is too large, PageNo x Offset size must
    //              be less than or equal to 10000
    getHistory(addressOrName, startBlock, endBlock) {
        return __awaiter(this, void 0, void 0, function*() {
            const params = {
                action: "txlist",
                address: yield this.resolveName(addressOrName),
                startblock: startBlock == null ? 0 : startBlock,
                endblock: endBlock == null ? 99999999 : endBlock,
                sort: "asc"
            };
            const result = yield this.fetch("account", params);
            return result.map((tx)=>{
                [
                    "contractAddress",
                    "to"
                ].forEach(function(key) {
                    if (tx[key] == "") {
                        delete tx[key];
                    }
                });
                if (tx.creates == null && tx.contractAddress != null) {
                    tx.creates = tx.contractAddress;
                }
                const item = this.formatter.transactionResponse(tx);
                if (tx.timeStamp) {
                    item.timestamp = parseInt(tx.timeStamp);
                }
                return item;
            });
        });
    }
    isCommunityResource() {
        return this.apiKey == null;
    }
} //# sourceMappingURL=etherscan-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/infura-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "InfuraProvider": (()=>InfuraProvider),
    "InfuraWebSocketProvider": (()=>InfuraWebSocketProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$websocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/websocket-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/formatter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/url-json-rpc-provider.js [app-client] (ecmascript)");
"use strict";
;
;
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
;
const defaultProjectId = "84842078b09946638c03157f83405213";
class InfuraWebSocketProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$websocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebSocketProvider"] {
    constructor(network, apiKey){
        const provider = new InfuraProvider(network, apiKey);
        const connection = provider.connection;
        if (connection.password) {
            logger.throwError("INFURA WebSocket project secrets unsupported", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.UNSUPPORTED_OPERATION, {
                operation: "InfuraProvider.getWebSocketProvider()"
            });
        }
        const url = connection.url.replace(/^http/i, "ws").replace("/v3/", "/ws/v3/");
        super(url, network);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "apiKey", provider.projectId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "projectId", provider.projectId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "projectSecret", provider.projectSecret);
    }
    isCommunityResource() {
        return this.projectId === defaultProjectId;
    }
}
class InfuraProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UrlJsonRpcProvider"] {
    static getWebSocketProvider(network, apiKey) {
        return new InfuraWebSocketProvider(network, apiKey);
    }
    static getApiKey(apiKey) {
        const apiKeyObj = {
            apiKey: defaultProjectId,
            projectId: defaultProjectId,
            projectSecret: null
        };
        if (apiKey == null) {
            return apiKeyObj;
        }
        if (typeof apiKey === "string") {
            apiKeyObj.projectId = apiKey;
        } else if (apiKey.projectSecret != null) {
            logger.assertArgument(typeof apiKey.projectId === "string", "projectSecret requires a projectId", "projectId", apiKey.projectId);
            logger.assertArgument(typeof apiKey.projectSecret === "string", "invalid projectSecret", "projectSecret", "[REDACTED]");
            apiKeyObj.projectId = apiKey.projectId;
            apiKeyObj.projectSecret = apiKey.projectSecret;
        } else if (apiKey.projectId) {
            apiKeyObj.projectId = apiKey.projectId;
        }
        apiKeyObj.apiKey = apiKeyObj.projectId;
        return apiKeyObj;
    }
    static getUrl(network, apiKey) {
        let host = null;
        switch(network ? network.name : "unknown"){
            case "homestead":
                host = "mainnet.infura.io";
                break;
            case "goerli":
                host = "goerli.infura.io";
                break;
            case "sepolia":
                host = "sepolia.infura.io";
                break;
            case "matic":
                host = "polygon-mainnet.infura.io";
                break;
            case "maticmum":
                host = "polygon-mumbai.infura.io";
                break;
            case "optimism":
                host = "optimism-mainnet.infura.io";
                break;
            case "optimism-goerli":
                host = "optimism-goerli.infura.io";
                break;
            case "arbitrum":
                host = "arbitrum-mainnet.infura.io";
                break;
            case "arbitrum-goerli":
                host = "arbitrum-goerli.infura.io";
                break;
            default:
                logger.throwError("unsupported network", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.INVALID_ARGUMENT, {
                    argument: "network",
                    value: network
                });
        }
        const connection = {
            allowGzip: true,
            url: "https:/" + "/" + host + "/v3/" + apiKey.projectId,
            throttleCallback: (attempt, url)=>{
                if (apiKey.projectId === defaultProjectId) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["showThrottleMessage"])();
                }
                return Promise.resolve(true);
            }
        };
        if (apiKey.projectSecret != null) {
            connection.user = "";
            connection.password = apiKey.projectSecret;
        }
        return connection;
    }
    isCommunityResource() {
        return this.projectId === defaultProjectId;
    }
} //# sourceMappingURL=infura-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/nodesmith-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/* istanbul ignore file */ __turbopack_esm__({
    "NodesmithProvider": (()=>NodesmithProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/url-json-rpc-provider.js [app-client] (ecmascript)");
"use strict";
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
// Special API key provided by Nodesmith for ethers.js
const defaultApiKey = "ETHERS_JS_SHARED";
class NodesmithProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UrlJsonRpcProvider"] {
    static getApiKey(apiKey) {
        if (apiKey && typeof apiKey !== "string") {
            logger.throwArgumentError("invalid apiKey", "apiKey", apiKey);
        }
        return apiKey || defaultApiKey;
    }
    static getUrl(network, apiKey) {
        logger.warn("NodeSmith will be discontinued on 2019-12-20; please migrate to another platform.");
        let host = null;
        switch(network.name){
            case "homestead":
                host = "https://ethereum.api.nodesmith.io/v1/mainnet/jsonrpc";
                break;
            case "ropsten":
                host = "https://ethereum.api.nodesmith.io/v1/ropsten/jsonrpc";
                break;
            case "rinkeby":
                host = "https://ethereum.api.nodesmith.io/v1/rinkeby/jsonrpc";
                break;
            case "goerli":
                host = "https://ethereum.api.nodesmith.io/v1/goerli/jsonrpc";
                break;
            case "kovan":
                host = "https://ethereum.api.nodesmith.io/v1/kovan/jsonrpc";
                break;
            default:
                logger.throwArgumentError("unsupported network", "network", arguments[0]);
        }
        return host + "?apiKey=" + apiKey;
    }
} //# sourceMappingURL=nodesmith-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/pocket-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "PocketProvider": (()=>PocketProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/url-json-rpc-provider.js [app-client] (ecmascript)");
"use strict";
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
;
const defaultApplicationId = "62e1ad51b37b8e00394bda3b";
class PocketProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UrlJsonRpcProvider"] {
    static getApiKey(apiKey) {
        const apiKeyObj = {
            applicationId: null,
            loadBalancer: true,
            applicationSecretKey: null
        };
        // Parse applicationId and applicationSecretKey
        if (apiKey == null) {
            apiKeyObj.applicationId = defaultApplicationId;
        } else if (typeof apiKey === "string") {
            apiKeyObj.applicationId = apiKey;
        } else if (apiKey.applicationSecretKey != null) {
            apiKeyObj.applicationId = apiKey.applicationId;
            apiKeyObj.applicationSecretKey = apiKey.applicationSecretKey;
        } else if (apiKey.applicationId) {
            apiKeyObj.applicationId = apiKey.applicationId;
        } else {
            logger.throwArgumentError("unsupported PocketProvider apiKey", "apiKey", apiKey);
        }
        return apiKeyObj;
    }
    static getUrl(network, apiKey) {
        let host = null;
        switch(network ? network.name : "unknown"){
            case "goerli":
                host = "eth-goerli.gateway.pokt.network";
                break;
            case "homestead":
                host = "eth-mainnet.gateway.pokt.network";
                break;
            case "kovan":
                host = "poa-kovan.gateway.pokt.network";
                break;
            case "matic":
                host = "poly-mainnet.gateway.pokt.network";
                break;
            case "maticmum":
                host = "polygon-mumbai-rpc.gateway.pokt.network";
                break;
            case "rinkeby":
                host = "eth-rinkeby.gateway.pokt.network";
                break;
            case "ropsten":
                host = "eth-ropsten.gateway.pokt.network";
                break;
            default:
                logger.throwError("unsupported network", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.INVALID_ARGUMENT, {
                    argument: "network",
                    value: network
                });
        }
        const url = `https:/\/${host}/v1/lb/${apiKey.applicationId}`;
        const connection = {
            headers: {},
            url
        };
        if (apiKey.applicationSecretKey != null) {
            connection.user = "";
            connection.password = apiKey.applicationSecretKey;
        }
        return connection;
    }
    isCommunityResource() {
        return this.applicationId === defaultApplicationId;
    }
} //# sourceMappingURL=pocket-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/web3-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "Web3Provider": (()=>Web3Provider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
"use strict";
;
;
;
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
;
let _nextId = 1;
function buildWeb3LegacyFetcher(provider, sendFunc) {
    const fetcher = "Web3LegacyFetcher";
    return function(method, params) {
        const request = {
            method: method,
            params: params,
            id: _nextId++,
            jsonrpc: "2.0"
        };
        return new Promise((resolve, reject)=>{
            this.emit("debug", {
                action: "request",
                fetcher,
                request: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deepCopy"])(request),
                provider: this
            });
            sendFunc(request, (error, response)=>{
                if (error) {
                    this.emit("debug", {
                        action: "response",
                        fetcher,
                        error,
                        request,
                        provider: this
                    });
                    return reject(error);
                }
                this.emit("debug", {
                    action: "response",
                    fetcher,
                    request,
                    response,
                    provider: this
                });
                if (response.error) {
                    const error = new Error(response.error.message);
                    error.code = response.error.code;
                    error.data = response.error.data;
                    return reject(error);
                }
                resolve(response.result);
            });
        });
    };
}
function buildEip1193Fetcher(provider) {
    return function(method, params) {
        if (params == null) {
            params = [];
        }
        const request = {
            method,
            params
        };
        this.emit("debug", {
            action: "request",
            fetcher: "Eip1193Fetcher",
            request: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deepCopy"])(request),
            provider: this
        });
        return provider.request(request).then((response)=>{
            this.emit("debug", {
                action: "response",
                fetcher: "Eip1193Fetcher",
                request,
                response,
                provider: this
            });
            return response;
        }, (error)=>{
            this.emit("debug", {
                action: "response",
                fetcher: "Eip1193Fetcher",
                request,
                error,
                provider: this
            });
            throw error;
        });
    };
}
class Web3Provider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JsonRpcProvider"] {
    constructor(provider, network){
        if (provider == null) {
            logger.throwArgumentError("missing provider", "provider", provider);
        }
        let path = null;
        let jsonRpcFetchFunc = null;
        let subprovider = null;
        if (typeof provider === "function") {
            path = "unknown:";
            jsonRpcFetchFunc = provider;
        } else {
            path = provider.host || provider.path || "";
            if (!path && provider.isMetaMask) {
                path = "metamask";
            }
            subprovider = provider;
            if (provider.request) {
                if (path === "") {
                    path = "eip-1193:";
                }
                jsonRpcFetchFunc = buildEip1193Fetcher(provider);
            } else if (provider.sendAsync) {
                jsonRpcFetchFunc = buildWeb3LegacyFetcher(provider, provider.sendAsync.bind(provider));
            } else if (provider.send) {
                jsonRpcFetchFunc = buildWeb3LegacyFetcher(provider, provider.send.bind(provider));
            } else {
                logger.throwArgumentError("unsupported provider", "provider", provider);
            }
            if (!path) {
                path = "unknown:";
            }
        }
        super(path, network);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "jsonRpcFetchFunc", jsonRpcFetchFunc);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defineReadOnly"])(this, "provider", subprovider);
    }
    send(method, params) {
        return this.jsonRpcFetchFunc(method, params);
    }
} //# sourceMappingURL=web3-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/ipc-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "IpcProvider": (()=>IpcProvider)
});
"use strict";
const IpcProvider = null;
;
 //# sourceMappingURL=ipc-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/index.js [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "getDefaultProvider": (()=>getDefaultProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+logger@5.7.0/node_modules/@ethersproject/logger/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/_version.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$websocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/websocket-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$networks$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$networks$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+networks@5.7.1/node_modules/@ethersproject/networks/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$fallback$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/fallback-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$alchemy$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/alchemy-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$ankr$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/ankr-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$cloudflare$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/cloudflare-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$etherscan$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/etherscan-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$infura$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/infura-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$nodesmith$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/nodesmith-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$pocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/pocket-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$web3$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/web3-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$ipc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/ipc-provider.js [app-client] (ecmascript)");
"use strict";
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
const logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$_version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]);
////////////////////////
// Helper Functions
function getDefaultProvider(network, options) {
    if (network == null) {
        network = "homestead";
    }
    // If passed a URL, figure out the right type of provider based on the scheme
    if (typeof network === "string") {
        // @TODO: Add support for IpcProvider; maybe if it ends in ".ipc"?
        // Handle http and ws (and their secure variants)
        const match = network.match(/^(ws|http)s?:/i);
        if (match) {
            switch(match[1].toLowerCase()){
                case "http":
                case "https":
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JsonRpcProvider"](network);
                case "ws":
                case "wss":
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$websocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebSocketProvider"](network);
                default:
                    logger.throwArgumentError("unsupported URL scheme", "network", network);
            }
        }
    }
    const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$networks$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$networks$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNetwork"])(network);
    if (!n || !n._defaultProvider) {
        logger.throwError("unsupported getDefaultProvider network", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$logger$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$logger$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logger"].errors.NETWORK_ERROR, {
            operation: "getDefaultProvider",
            network: network
        });
    }
    return n._defaultProvider({
        FallbackProvider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$fallback$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FallbackProvider"],
        AlchemyProvider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$alchemy$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlchemyProvider"],
        AnkrProvider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$ankr$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnkrProvider"],
        CloudflareProvider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$cloudflare$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CloudflareProvider"],
        EtherscanProvider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$etherscan$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EtherscanProvider"],
        InfuraProvider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$infura$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfuraProvider"],
        JsonRpcProvider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JsonRpcProvider"],
        NodesmithProvider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$nodesmith$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodesmithProvider"],
        PocketProvider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$pocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PocketProvider"],
        Web3Provider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$web3$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Web3Provider"],
        IpcProvider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$ipc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IpcProvider"]
    }, options);
}
;
 //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/index.js [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/index.js [app-client] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/json-rpc-batch-provider.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "JsonRpcBatchProvider": (()=>JsonRpcBatchProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+properties@5.7.0/node_modules/@ethersproject/properties/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+web@5.7.1/node_modules/@ethersproject/web/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js [app-client] (ecmascript)");
;
;
;
class JsonRpcBatchProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JsonRpcProvider"] {
    send(method, params) {
        const request = {
            method: method,
            params: params,
            id: this._nextId++,
            jsonrpc: "2.0"
        };
        if (this._pendingBatch == null) {
            this._pendingBatch = [];
        }
        const inflightRequest = {
            request,
            resolve: null,
            reject: null
        };
        const promise = new Promise((resolve, reject)=>{
            inflightRequest.resolve = resolve;
            inflightRequest.reject = reject;
        });
        this._pendingBatch.push(inflightRequest);
        if (!this._pendingBatchAggregator) {
            // Schedule batch for next event loop + short duration
            this._pendingBatchAggregator = setTimeout(()=>{
                // Get teh current batch and clear it, so new requests
                // go into the next batch
                const batch = this._pendingBatch;
                this._pendingBatch = null;
                this._pendingBatchAggregator = null;
                // Get the request as an array of requests
                const request = batch.map((inflight)=>inflight.request);
                this.emit("debug", {
                    action: "requestBatch",
                    request: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$properties$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$properties$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deepCopy"])(request),
                    provider: this
                });
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$web$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$web$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(this.connection, JSON.stringify(request)).then((result)=>{
                    this.emit("debug", {
                        action: "response",
                        request: request,
                        response: result,
                        provider: this
                    });
                    // For each result, feed it to the correct Promise, depending
                    // on whether it was a success or error
                    batch.forEach((inflightRequest, index)=>{
                        const payload = result[index];
                        if (payload.error) {
                            const error = new Error(payload.error.message);
                            error.code = payload.error.code;
                            error.data = payload.error.data;
                            inflightRequest.reject(error);
                        } else {
                            inflightRequest.resolve(payload.result);
                        }
                    });
                }, (error)=>{
                    this.emit("debug", {
                        action: "response",
                        error: error,
                        request: request,
                        provider: this
                    });
                    batch.forEach((inflightRequest)=>{
                        inflightRequest.reject(error);
                    });
                });
            }, 10);
        }
        return promise;
    }
} //# sourceMappingURL=json-rpc-batch-provider.js.map
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/index.js [app-client] (ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AlchemyProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$alchemy$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlchemyProvider"]),
    "AlchemyWebSocketProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$alchemy$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlchemyWebSocketProvider"]),
    "AnkrProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$ankr$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnkrProvider"]),
    "BaseProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$base$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseProvider"]),
    "CloudflareProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$cloudflare$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CloudflareProvider"]),
    "EtherscanProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$etherscan$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EtherscanProvider"]),
    "FallbackProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$fallback$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FallbackProvider"]),
    "Formatter": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Formatter"]),
    "InfuraProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$infura$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfuraProvider"]),
    "InfuraWebSocketProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$infura$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfuraWebSocketProvider"]),
    "IpcProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$ipc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IpcProvider"]),
    "JsonRpcBatchProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$batch$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JsonRpcBatchProvider"]),
    "JsonRpcProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JsonRpcProvider"]),
    "JsonRpcSigner": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JsonRpcSigner"]),
    "NodesmithProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$nodesmith$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodesmithProvider"]),
    "PocketProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$pocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PocketProvider"]),
    "Provider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abstract$2d$provider$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abstract$2d$provider$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"]),
    "Resolver": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$base$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Resolver"]),
    "StaticJsonRpcProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StaticJsonRpcProvider"]),
    "UrlJsonRpcProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UrlJsonRpcProvider"]),
    "Web3Provider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$web3$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Web3Provider"]),
    "WebSocketProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$websocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebSocketProvider"]),
    "getDefaultProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultProvider"]),
    "getNetwork": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$networks$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$networks$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNetwork"]),
    "isCommunityResourcable": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCommunityResourcable"]),
    "isCommunityResource": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCommunityResource"]),
    "showThrottleMessage": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["showThrottleMessage"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$alchemy$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/alchemy-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$ankr$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/ankr-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$base$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/base-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$cloudflare$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/cloudflare-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$etherscan$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/etherscan-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$fallback$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/fallback-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/formatter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$infura$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/infura-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$ipc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/ipc-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$batch$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/json-rpc-batch-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$nodesmith$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/nodesmith-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$pocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/pocket-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$abstract$2d$provider$40$5$2e$7$2e$0$2f$node_modules$2f40$ethersproject$2f$abstract$2d$provider$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+abstract-provider@5.7.0/node_modules/@ethersproject/abstract-provider/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$url$2d$json$2d$rpc$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/url-json-rpc-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$web3$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/web3-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$websocket$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/websocket-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$networks$40$5$2e$7$2e$1$2f$node_modules$2f40$ethersproject$2f$networks$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+networks@5.7.1/node_modules/@ethersproject/networks/lib.esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/index.js [app-client] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/index.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "AlchemyProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AlchemyProvider"]),
    "AlchemyWebSocketProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AlchemyWebSocketProvider"]),
    "AnkrProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["AnkrProvider"]),
    "BaseProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["BaseProvider"]),
    "CloudflareProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["CloudflareProvider"]),
    "EtherscanProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["EtherscanProvider"]),
    "FallbackProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["FallbackProvider"]),
    "Formatter": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Formatter"]),
    "InfuraProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["InfuraProvider"]),
    "InfuraWebSocketProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["InfuraWebSocketProvider"]),
    "IpcProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["IpcProvider"]),
    "JsonRpcBatchProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["JsonRpcBatchProvider"]),
    "JsonRpcProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["JsonRpcProvider"]),
    "JsonRpcSigner": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["JsonRpcSigner"]),
    "NodesmithProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["NodesmithProvider"]),
    "PocketProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["PocketProvider"]),
    "Provider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Provider"]),
    "Resolver": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Resolver"]),
    "StaticJsonRpcProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["StaticJsonRpcProvider"]),
    "UrlJsonRpcProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["UrlJsonRpcProvider"]),
    "Web3Provider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["Web3Provider"]),
    "WebSocketProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["WebSocketProvider"]),
    "getDefaultProvider": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getDefaultProvider"]),
    "getNetwork": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["getNetwork"]),
    "isCommunityResourcable": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isCommunityResourcable"]),
    "isCommunityResource": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isCommunityResource"]),
    "showThrottleMessage": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__["showThrottleMessage"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$exports$3e$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/index.js [app-client] (ecmascript) <exports>");
}}),
"[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/index.js [app-client] (ecmascript) <export * as providers>": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_esm__({
    "providers": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ethersproject$2b$providers$40$5$2e$7$2e$2$2f$node_modules$2f40$ethersproject$2f$providers$2f$lib$2e$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/.pnpm/@ethersproject+providers@5.7.2/node_modules/@ethersproject/providers/lib.esm/index.js [app-client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=2cdc9_%40ethersproject_providers_lib_esm_5d4c33._.js.map