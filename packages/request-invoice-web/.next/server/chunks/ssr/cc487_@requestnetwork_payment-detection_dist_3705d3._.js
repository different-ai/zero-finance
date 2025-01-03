module.exports = {

"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-providers/blockchain-info.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BlockchainInfoProvider = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
// Maximum number of api requests to retry when an error is encountered (ECONNRESET, EPIPE, ENOTFOUND)
const BLOCKCHAININFO_REQUEST_MAX_RETRY = 3;
// Delay between retries in ms
const BLOCKCHAININFO_REQUEST_RETRY_DELAY = 100;
// Number of transactions per page
const TXS_PER_PAGE = 50;
/**
 * The Bitcoin Info retriever give access to the bitcoin blockchain through the api of blockchain.info
 */ class BlockchainInfoProvider {
    /**
     * Gets BTC address info using blockchain.info public API
     *
     * @param bitcoinNetworkId The Bitcoin network ID: 0 (mainnet) or 3 (testnet)
     * @param address BTC address to check
     * @param eventName Indicates if it is an address for payment or refund
     * @returns Object containing address info
     */ getAddressBalanceWithEvents(bitcoinNetworkId, address, eventName) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const blockchainInfoUrl = this.getBlockchainInfoUrl(bitcoinNetworkId);
            const queryUrl = `${blockchainInfoUrl}/rawaddr/${address}?cors=true`;
            try {
                const res = yield (0, utils_1.retry)(fetch, {
                    maxRetries: BLOCKCHAININFO_REQUEST_MAX_RETRY,
                    retryDelay: BLOCKCHAININFO_REQUEST_RETRY_DELAY
                })(queryUrl);
                // eslint-disable-next-line no-magic-numbers
                if (res.status >= 400) {
                    throw new Error(`Error ${res.status}. Bad response from server ${queryUrl}`);
                }
                const addressInfo = yield res.json();
                // count the number of extra pages to retrieve
                const numberOfExtraPages = Math.floor(addressInfo.n_tx / (TXS_PER_PAGE + 1));
                // get all the transactions from the whole pagination
                for(let i = 1; i <= numberOfExtraPages; i++){
                    const resExtraPage = yield (0, utils_1.retry)(()=>tslib_1.__awaiter(this, void 0, void 0, function*() {
                            return fetch(`${blockchainInfoUrl}/rawaddr/${address}?cors=true&offset=${i * TXS_PER_PAGE}`);
                        }), {
                        maxRetries: BLOCKCHAININFO_REQUEST_MAX_RETRY,
                        retryDelay: BLOCKCHAININFO_REQUEST_RETRY_DELAY
                    })();
                    // eslint-disable-next-line no-magic-numbers
                    if (resExtraPage.status >= 400) {
                        throw new Error(`Error ${resExtraPage.status}. Bad response from server ${blockchainInfoUrl}`);
                    }
                    const extraPageAddressInfo = yield resExtraPage.json();
                    // gather all the transactions retrieved
                    addressInfo.txs = addressInfo.txs.concat(extraPageAddressInfo.txs);
                }
                return this.parse(addressInfo, eventName);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.warn(err.message || err);
                return {
                    balance: '-1',
                    events: []
                };
            }
        });
    }
    /**
     * Parses the address information from the data of blockchain.info
     *
     * @param addressInfo Data of blockchain.info
     * @param eventName Indicates if it is an address for payment or refund
     * @returns Balance with events
     */ parse(addressInfo, eventName) {
        const address = addressInfo.address;
        const balance = ethers_1.BigNumber.from(addressInfo.total_received).toString();
        const events = addressInfo.txs// exclude the transactions coming from the same address
        .filter((tx)=>{
            const selfInputs = tx.inputs.filter((input)=>input.prev_out.addr === addressInfo.address);
            return selfInputs.length === 0;
        }).reduce((allOutput, tx)=>{
            return [
                ...allOutput,
                ...tx.out.map((output)=>({
                        blockHeight: tx.block_height,
                        output,
                        timestamp: tx.time,
                        txHash: tx.hash
                    }))
            ];
        }, []).filter((output)=>output.output.addr === address).map((output)=>({
                amount: output.output.value.toString(),
                name: eventName,
                parameters: {
                    block: output.blockHeight,
                    txHash: output.txHash
                },
                timestamp: output.timestamp
            }));
        return {
            balance,
            events
        };
    }
    /**
     * Gets the BlockchainInfo url to fetch according to the networkId
     *
     * @param bitcoinNetworkId the Bitcoin network ID: 0 (mainnet) or 3 (testnet)
     * @returns The blockchain info URL
     */ getBlockchainInfoUrl(bitcoinNetworkId) {
        if (bitcoinNetworkId === 0) {
            return 'https://blockchain.info';
        }
        if (bitcoinNetworkId === 3) {
            return 'https://testnet.blockchain.info';
        }
        throw new Error(`Invalid network 0 (mainnet) or 3 (testnet) was expected but ${bitcoinNetworkId} was given`);
    }
}
exports.BlockchainInfoProvider = BlockchainInfoProvider; //# sourceMappingURL=blockchain-info.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-providers/blockcypher-com.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BlockcypherComProvider = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
// Maximum number of api requests to retry when an error is encountered (ECONNRESET, EPIPE, ENOTFOUND)
const BLOCKCYPHER_REQUEST_MAX_RETRY = 3;
// Delay between retries in ms
const BLOCKCYPHER_REQUEST_RETRY_DELAY = 100;
/**
 * The Bitcoin Info retriever give access to the bitcoin blockchain through the api of blockcypher.com
 */ class BlockcypherComProvider {
    /**
     * Gets BTC address info using blockcypher.com public API
     *
     * @param bitcoinNetworkId The Bitcoin network ID: 0 (mainnet) or 3 (testnet)
     * @param address BTC address to check
     * @param eventName Indicates if it is an address for payment or refund
     * @returns Object containing address info
     */ getAddressBalanceWithEvents(bitcoinNetworkId, address, eventName) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const baseUrl = this.getBaseUrl(bitcoinNetworkId);
            const queryUrl = `${baseUrl}/addrs/${address}`;
            try {
                const res = yield (0, utils_1.retry)(fetch, {
                    maxRetries: BLOCKCYPHER_REQUEST_MAX_RETRY,
                    retryDelay: BLOCKCYPHER_REQUEST_RETRY_DELAY
                })(queryUrl);
                // eslint-disable-next-line no-magic-numbers
                if (res.status >= 400) {
                    throw new Error(`Error ${res.status}. Bad response from server ${queryUrl}`);
                }
                const addressInfo = yield res.json();
                return this.parse(addressInfo, eventName);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.warn(err.message || err);
                return {
                    balance: '-1',
                    events: []
                };
            }
        });
    }
    /**
     * Parses the address information from the data of blockcypher.com
     *
     * @param addressInfo Data of blockchain.info
     * @param eventName Indicates if it is an address for payment or refund
     * @returns Balance with events
     */ parse(addressInfo, eventName) {
        const balance = ethers_1.BigNumber.from(addressInfo.total_received).toString();
        // Retrieves all the transaction hash of the transactions having as input the current address
        const inputTxHashes = addressInfo.txrefs.filter((tx)=>tx.tx_output_n === -1).map((tx)=>tx.tx_hash);
        const events = addressInfo.txrefs// keep only the transaction with this address as output
        .filter((tx)=>tx.tx_input_n === -1)// exclude the transactions coming from the same address
        .filter((tx)=>!inputTxHashes.includes(tx.tx_hash)).map((tx)=>({
                amount: tx.value.toString(),
                name: eventName,
                parameters: {
                    block: tx.block_height,
                    txHash: tx.tx_hash
                }
            }));
        return {
            balance,
            events
        };
    }
    /**
     * Gets the base url to fetch according to the networkId
     *
     * @param bitcoinNetworkId the Bitcoin network ID: 0 (mainnet) or 3 (testnet)
     * @returns The blockchain info URL
     */ getBaseUrl(bitcoinNetworkId) {
        if (bitcoinNetworkId === 0) {
            return 'https://api.blockcypher.com/v1/btc/main/';
        }
        if (bitcoinNetworkId === 3) {
            return 'https://api.blockcypher.com/v1/btc/test3';
        }
        throw new Error(`Invalid network 0 (mainnet) or 3 (testnet) was expected but ${bitcoinNetworkId} was given`);
    }
}
exports.BlockcypherComProvider = BlockcypherComProvider; //# sourceMappingURL=blockcypher-com.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-providers/blockstream-info.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BlockStreamInfoProvider = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
// Maximum number of api requests to retry when an error is encountered (ECONNRESET, EPIPE, ENOTFOUND)
const BLOCKSTREAMINFO_REQUEST_MAX_RETRY = 3;
// Delay between retries in ms
const BLOCKSTREAMINFO_REQUEST_RETRY_DELAY = 100;
// Number of transactions per page
const TXS_PER_PAGE = 25;
/**
 * The Bitcoin Info retriever give access to the bitcoin blockchain through the api of blockstream.info
 */ class BlockStreamInfoProvider {
    /**
     * Gets BTC address info using blockstream.info public API
     *
     * @param bitcoinNetworkId The Bitcoin network ID: 0 (mainnet) or 3 (testnet)
     * @param address BTC address to check
     * @param eventName Indicates if it is an address for payment or refund
     * @returns Object containing address info
     */ getAddressBalanceWithEvents(bitcoinNetworkId, address, eventName) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const baseUrl = this.getBaseUrl(bitcoinNetworkId);
            const queryUrl = `${baseUrl}/address/${address}/txs`;
            try {
                const res = yield (0, utils_1.retry)(fetch, {
                    maxRetries: BLOCKSTREAMINFO_REQUEST_MAX_RETRY,
                    retryDelay: BLOCKSTREAMINFO_REQUEST_RETRY_DELAY
                })(queryUrl);
                // eslint-disable-next-line no-magic-numbers
                if (res.status >= 400) {
                    throw new Error(`Error ${res.status}. Bad response from server ${queryUrl}`);
                }
                let txs = yield res.json();
                let checkForMoreTransactions = txs.length === TXS_PER_PAGE;
                // if there are 'TXS_PER_PAGE' transactions, need to check the pagination
                while(checkForMoreTransactions){
                    const lastTxHash = txs[txs.length - 1].txid;
                    const resExtraPage = yield (0, utils_1.retry)(()=>tslib_1.__awaiter(this, void 0, void 0, function*() {
                            return fetch(`${baseUrl}/address/${address}/txs/chain/${lastTxHash}`);
                        }), {
                        maxRetries: BLOCKSTREAMINFO_REQUEST_MAX_RETRY,
                        retryDelay: BLOCKSTREAMINFO_REQUEST_RETRY_DELAY
                    })();
                    // eslint-disable-next-line no-magic-numbers
                    if (resExtraPage.status >= 400) {
                        throw new Error(`Error ${resExtraPage.status}. Bad response from server ${baseUrl}/${address}`);
                    }
                    const extraTxs = yield resExtraPage.json();
                    checkForMoreTransactions = extraTxs.length === TXS_PER_PAGE;
                    // gather all the transactions retrieved
                    txs = txs.concat(extraTxs);
                }
                return this.parse({
                    address,
                    txs
                }, eventName);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.warn(err.message || err);
                return {
                    balance: '-1',
                    events: []
                };
            }
        });
    }
    /**
     * Parses the address information from the data of blockstream.info
     *
     * @param addressInfo Data from blockstream.info
     * @param eventName Indicates if it is an address for payment or refund
     * @returns Balance with events
     */ parse(addressInfo, eventName) {
        const events = addressInfo.txs// exclude the transactions coming from the same address
        .filter((tx)=>{
            const autoVin = tx.vin.filter((input)=>input.prevout.scriptpubkey_address === addressInfo.address);
            return autoVin.length === 0;
        }).reduce((allOutput, tx)=>{
            return [
                ...allOutput,
                ...tx.vout.map((output)=>({
                        blockHeight: tx.status.block_height,
                        output,
                        timestamp: tx.status.block_time,
                        txHash: tx.txid
                    }))
            ];
        }, []).filter((output)=>output.output.scriptpubkey_address === addressInfo.address).map((output)=>({
                amount: output.output.value.toString(),
                name: eventName,
                parameters: {
                    block: output.blockHeight,
                    txHash: output.txHash
                },
                timestamp: output.timestamp
            }));
        const balance = events.reduce((balanceAccumulator, event)=>{
            return balanceAccumulator.add(ethers_1.BigNumber.from(event.amount));
        }, ethers_1.BigNumber.from('0')).toString();
        return {
            balance,
            events
        };
    }
    /**
     * Gets the base url to fetch according to the networkId
     *
     * @param bitcoinNetworkId the Bitcoin network ID: 0 (mainnet) or 3 (testnet)
     * @returns The blockchain info URL
     */ getBaseUrl(bitcoinNetworkId) {
        if (bitcoinNetworkId === 0) {
            return 'https://blockstream.info/api/';
        }
        if (bitcoinNetworkId === 3) {
            return 'https://blockstream.info/testnet/api/';
        }
        throw new Error(`Invalid network 0 (mainnet) or 3 (testnet) was expected but ${bitcoinNetworkId} was given`);
    }
}
exports.BlockStreamInfoProvider = BlockStreamInfoProvider; //# sourceMappingURL=blockstream-info.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-providers/chain-so.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChainSoProvider = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const converterBTC = __turbopack_require__("[project]/node_modules/.pnpm/satoshi-bitcoin@1.0.4/node_modules/satoshi-bitcoin/index.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
// Maximum number of api requests to retry when an error is encountered (ECONNRESET, EPIPE, ENOTFOUND)
const CHAINSO_REQUEST_MAX_RETRY = 3;
// Delay between retries in ms
const CHAINSO_REQUEST_RETRY_DELAY = 100;
/**
 * The Bitcoin Info retriever give access to the bitcoin blockchain through the api of chain.so
 */ class ChainSoProvider {
    /**
     * Gets BTC address info using chain.so public API
     *
     * @param bitcoinNetworkId The Bitcoin network ID: 0 (mainnet) or 3 (testnet)
     * @param address BTC address to check
     * @param eventName Indicates if it is an address for payment or refund
     * @returns Object containing address info
     */ getAddressBalanceWithEvents(bitcoinNetworkId, address, eventName) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const baseUrl = this.getBaseUrl(bitcoinNetworkId);
            const queryUrl = `${baseUrl}${address}`;
            try {
                const res = yield (0, utils_1.retry)(fetch, {
                    maxRetries: CHAINSO_REQUEST_MAX_RETRY,
                    retryDelay: CHAINSO_REQUEST_RETRY_DELAY
                })(queryUrl);
                // eslint-disable-next-line no-magic-numbers
                if (res.status >= 400) {
                    throw new Error(`Error ${res.status}. Bad response from server ${queryUrl}`);
                }
                const data = yield res.json();
                if (data.status === 'fail') {
                    throw new Error(`Error bad response from ${baseUrl}: ${data.message}`);
                }
                return this.parse(data, eventName);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.warn(err.message || err);
                return {
                    balance: '-1',
                    events: []
                };
            }
        });
    }
    /**
     * Parses the address information from the data of chain.so
     *
     * @param addressInfo Data of chain.so
     * @param eventName Indicates if it is an address for payment or refund
     * @returns Balance with events
     */ parse(addressInfo, eventName) {
        const events = addressInfo.data.txs// keep only the transaction with value incoming to the address
        .filter((tx)=>tx.incoming !== undefined)// delete transactions that are from this address
        .filter((tx)=>tx.outgoing === undefined).map((tx)=>({
                amount: converterBTC.toSatoshi(tx.incoming.value).toString(),
                name: eventName,
                parameters: {
                    block: tx.block_no,
                    txHash: tx.txid
                },
                timestamp: tx.time
            }));
        // Compute the balance making the sum of all the transactions amount
        const balance = events.reduce((balanceAccumulator, event)=>{
            return balanceAccumulator.add(ethers_1.BigNumber.from(event.amount));
        }, ethers_1.BigNumber.from('0')).toString();
        return {
            balance,
            events
        };
    }
    /**
     * Gets the base url to fetch according to the networkId
     *
     * @param bitcoinNetworkId the Bitcoin network ID: 0 (mainnet) or 3 (testnet)
     * @returns The chain.so info URL
     */ getBaseUrl(bitcoinNetworkId) {
        if (bitcoinNetworkId === 0) {
            return 'https://chain.so/api/v2/address/BTC/';
        }
        if (bitcoinNetworkId === 3) {
            return 'https://chain.so/api/v2/address/BTCTEST/';
        }
        throw new Error(`Invalid network 0 (mainnet) or 3 (testnet) was expected but ${bitcoinNetworkId} was given`);
    }
}
exports.ChainSoProvider = ChainSoProvider; //# sourceMappingURL=chain-so.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-providers/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChainSoProvider = exports.BlockStreamInfoProvider = exports.BlockcypherComProvider = exports.BlockchainInfoProvider = void 0;
var blockchain_info_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-providers/blockchain-info.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "BlockchainInfoProvider", {
    enumerable: true,
    get: function() {
        return blockchain_info_1.BlockchainInfoProvider;
    }
});
var blockcypher_com_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-providers/blockcypher-com.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "BlockcypherComProvider", {
    enumerable: true,
    get: function() {
        return blockcypher_com_1.BlockcypherComProvider;
    }
});
var blockstream_info_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-providers/blockstream-info.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "BlockStreamInfoProvider", {
    enumerable: true,
    get: function() {
        return blockstream_info_1.BlockStreamInfoProvider;
    }
});
var chain_so_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-providers/chain-so.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "ChainSoProvider", {
    enumerable: true,
    get: function() {
        return chain_so_1.ChainSoProvider;
    }
}); //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-bitcoin-detection-provider.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DefaultBitcoinDetectionProvider = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const default_providers_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-providers/index.js [app-rsc] (ecmascript)");
/**
 * The default Bitcoin detection provider give access to the bitcoin blockchain through several external API's
 */ class DefaultBitcoinDetectionProvider {
    /**
     * Creates an instance of DefaultBitcoinDetectionProvider
     */ constructor(){
        this.providers = [
            new default_providers_1.BlockchainInfoProvider(),
            new default_providers_1.BlockStreamInfoProvider(),
            new default_providers_1.ChainSoProvider(),
            new default_providers_1.BlockcypherComProvider()
        ];
    }
    /**
     * Gets BTC address balance with events
     *
     * @param bitcoinNetworkId The Bitcoin network ID: 0 (mainnet) or 3 (testnet)
     * @param address BTC address to check
     * @param eventName Indicates if it is an address for payment or refund
     * @returns Object containing address info
     */ getAddressBalanceWithEvents(bitcoinNetworkId, address, eventName) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (this.providers.length < 2) {
                throw new Error('At least two bitcoin providers are needed');
            }
            let providerUsedIndex = 0;
            let infoFromProviders = [];
            // The two first calls to the providers
            infoFromProviders = yield Promise.all([
                this.providers[providerUsedIndex++].getAddressBalanceWithEvents(bitcoinNetworkId, address, eventName),
                this.providers[providerUsedIndex++].getAddressBalanceWithEvents(bitcoinNetworkId, address, eventName)
            ]);
            let mostCommon = this.getMostCommonBalance(infoFromProviders);
            // while there are not two identical balances, we try to get the information from another provider
            while((!mostCommon || mostCommon.count < 2) && providerUsedIndex < this.providers.length){
                infoFromProviders.push((yield this.providers[providerUsedIndex++].getAddressBalanceWithEvents(bitcoinNetworkId, address, eventName)));
                mostCommon = this.getMostCommonBalance(infoFromProviders);
            }
            // If there are two identical balances we return it
            if (mostCommon && mostCommon.count >= 2) {
                return mostCommon.value;
            }
            throw new Error('Error getting the balance from the bitcoin providers');
        });
    }
    /**
     * Get the balance and events the most common in an array
     *
     * @param array array to count
     * @returns Object containing IBalanceWithEvents and the count
     */ getMostCommonBalance(array) {
        // Reduce the array to an object indexed by balance with the count
        const duplicatesWithCount = array.filter((info)=>info.balance !== '-1').reduce((accumulator, elem)=>{
            if (elem.balance !== null) {
                if (!accumulator[elem.balance]) {
                    accumulator[elem.balance] = {
                        count: 0,
                        value: elem
                    };
                }
                accumulator[elem.balance].count++;
            }
            return accumulator;
        }, {});
        // Sort the array by the count
        const sortedArray = Object.values(duplicatesWithCount).sort((a, b)=>b.count - a.count);
        // Get the first element
        return sortedArray[0];
    }
}
exports.DefaultBitcoinDetectionProvider = DefaultBitcoinDetectionProvider; //# sourceMappingURL=default-bitcoin-detection-provider.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/balance-error.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getBalanceErrorObject = exports.ExtensionMissingRequiredValue = exports.VersionNotSupported = exports.NetworkNotSupported = exports.BalanceError = void 0;
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
class BalanceError extends Error {
    constructor(message, code){
        super(message);
        this.code = code;
    }
}
exports.BalanceError = BalanceError;
/* eslint-disable max-classes-per-file */ /** Exception when network not supported */ class NetworkNotSupported extends BalanceError {
    constructor(msg){
        super(msg, types_1.PaymentTypes.BALANCE_ERROR_CODE.NETWORK_NOT_SUPPORTED);
    }
}
exports.NetworkNotSupported = NetworkNotSupported;
/** Exception when version not supported */ class VersionNotSupported extends BalanceError {
    constructor(msg){
        super(msg, types_1.PaymentTypes.BALANCE_ERROR_CODE.VERSION_NOT_SUPPORTED);
    }
}
exports.VersionNotSupported = VersionNotSupported;
class ExtensionMissingRequiredValue extends BalanceError {
    constructor(extension, name){
        super(`${extension} misses required value ${name}`, types_1.PaymentTypes.BALANCE_ERROR_CODE.UNKNOWN);
    }
}
exports.ExtensionMissingRequiredValue = ExtensionMissingRequiredValue;
/**
 * Creates the object IBalanceWithEvents from the error code and error message
 *
 * @param message error message
 * @param code error code
 * @returns The object IBalanceWithEvents to return
 */ function getBalanceErrorObject(error) {
    const code = error && error instanceof BalanceError ? error.code : undefined;
    return {
        balance: null,
        error: {
            code: code || types_1.PaymentTypes.BALANCE_ERROR_CODE.UNKNOWN,
            message: error === null || error === void 0 ? void 0 : error.message
        },
        events: []
    };
}
exports.getBalanceErrorObject = getBalanceErrorObject; //# sourceMappingURL=balance-error.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/payment-detector-base.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PaymentDetectorBase = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const balance_error_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/balance-error.js [app-rsc] (ecmascript)");
class PaymentDetectorBase {
    constructor(paymentNetworkId, extension){
        this.paymentNetworkId = paymentNetworkId;
        this.extension = extension;
    }
    /**
     * Gets the balance and the payment/refund events
     *
     * @param request the request to check
     * @returns the balance and the payment/refund events
     */ getBalance(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            try {
                const allNetworkEvents = yield this.getEvents(request);
                const rawPaymentEvents = allNetworkEvents.paymentEvents;
                const events = this.sortEvents(rawPaymentEvents);
                const balance = this.computeBalance(events).toString();
                const escrowEvents = this.sortEscrowEvents(allNetworkEvents.escrowEvents || []);
                return {
                    balance,
                    events,
                    escrowEvents
                };
            } catch (error) {
                return (0, balance_error_1.getBalanceErrorObject)(error);
            }
        });
    }
    getPaymentExtension(request) {
        const extension = request.extensions[this.paymentNetworkId];
        if (!extension) {
            throw new balance_error_1.BalanceError(`The request does not have the extension: ${this.paymentNetworkId}`, types_1.PaymentTypes.BALANCE_ERROR_CODE.WRONG_EXTENSION);
        }
        return extension;
    }
    computeBalance(events) {
        return events.reduce((sum, curr)=>curr.name === types_1.PaymentTypes.EVENTS_NAMES.PAYMENT ? sum.add(curr.amount) : curr.name === types_1.PaymentTypes.EVENTS_NAMES.REFUND ? sum.sub(curr.amount) : sum, ethers_1.BigNumber.from(0));
    }
    sortEvents(events) {
        return events.sort((a, b)=>(a.timestamp || 0) - (b.timestamp || 0));
    }
    sortEscrowEvents(events) {
        return events.sort((a, b)=>(a.timestamp || 0) - (b.timestamp || 0));
    }
    checkRequiredParameter(value, name) {
        if (!value) {
            throw new balance_error_1.ExtensionMissingRequiredValue(this.paymentNetworkId, name);
        }
    }
}
exports.PaymentDetectorBase = PaymentDetectorBase; //# sourceMappingURL=payment-detector-base.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/address-based.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BtcAddressBasedDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const default_bitcoin_detection_provider_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-bitcoin-detection-provider.js [app-rsc] (ecmascript)");
const payment_detector_base_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/payment-detector-base.js [app-rsc] (ecmascript)");
/**
 * Handle payment networks with BTC based address extension
 */ class BtcAddressBasedDetector extends payment_detector_base_1.PaymentDetectorBase {
    /**
     * @param extension The advanced logic payment network extensions
     */ constructor(networkId, paymentNetworkId, extension, bitcoinDetectionProvider = new default_bitcoin_detection_provider_1.DefaultBitcoinDetectionProvider()){
        super(paymentNetworkId, extension);
        this.networkId = networkId;
        this.bitcoinDetectionProvider = bitcoinDetectionProvider;
    }
    /**
     * Creates the extensions data for the creation of this extension
     *
     * @param paymentNetworkCreationParameters Parameters to create the extension
     * @returns The extensionData object
     */ createExtensionsDataForCreation(paymentNetworkCreationParameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            return this.extension.createCreationAction({
                paymentAddress: paymentNetworkCreationParameters.paymentAddress,
                refundAddress: paymentNetworkCreationParameters.refundAddress
            });
        });
    }
    /**
     * Creates the extensions data to add payment address
     *
     * @param Parameters to add payment information
     * @returns The extensionData object
     */ createExtensionsDataForAddPaymentInformation(parameters) {
        return this.extension.createAddPaymentAddressAction({
            paymentAddress: parameters.paymentAddress
        });
    }
    /**
     * Creates the extensions data to add refund address
     *
     * @param Parameters to add refund information
     * @returns The extensionData object
     */ createExtensionsDataForAddRefundInformation(parameters) {
        return this.extension.createAddRefundAddressAction({
            refundAddress: parameters.refundAddress
        });
    }
    /**
     * Extracts the balance and events of an address
     *
     * @private
     * @param address Address to check
     * @param eventName Indicate if it is an address for payment or refund
     * @returns The balance
     */ getEvents(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const { paymentAddress, refundAddress } = this.getPaymentExtension(request).values;
            this.checkRequiredParameter(paymentAddress, 'paymentAddress');
            const [payments, refunds] = yield Promise.all([
                (yield this.bitcoinDetectionProvider.getAddressBalanceWithEvents(this.networkId, paymentAddress, types_1.PaymentTypes.EVENTS_NAMES.PAYMENT)),
                refundAddress ? yield this.bitcoinDetectionProvider.getAddressBalanceWithEvents(this.networkId, refundAddress, types_1.PaymentTypes.EVENTS_NAMES.REFUND) : {
                    events: []
                }
            ]);
            const paymentEvents = [
                ...payments.events,
                ...refunds.events
            ];
            return {
                paymentEvents
            };
        });
    }
}
exports.BtcAddressBasedDetector = BtcAddressBasedDetector; //# sourceMappingURL=address-based.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/mainnet-address-based.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BtcMainnetAddressBasedDetector = void 0;
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const address_based_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/address-based.js [app-rsc] (ecmascript)");
const MAINNET_BITCOIN_NETWORK_ID = 0;
/**
 * Handle payment networks with mainnet BTC based address extension
 *
 * @class PaymentNetworkBTCAddressBased
 */ class BtcMainnetAddressBasedDetector extends address_based_1.BtcAddressBasedDetector {
    /**
     * @param advancedLogic Instance of Advanced Logic layer, to get the extension
     */ constructor({ advancedLogic, bitcoinDetectionProvider }){
        super(MAINNET_BITCOIN_NETWORK_ID, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.BITCOIN_ADDRESS_BASED, advancedLogic.extensions.addressBasedBtc, bitcoinDetectionProvider);
    }
}
exports.BtcMainnetAddressBasedDetector = BtcMainnetAddressBasedDetector; //# sourceMappingURL=mainnet-address-based.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/testnet-address-based.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BtcTestnetAddressBasedDetector = void 0;
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const address_based_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/address-based.js [app-rsc] (ecmascript)");
const TESTNET_BITCOIN_NETWORK_ID = 3;
/**
 * Handle payment networks with testnet BTC based address extension
 *
 * @class PaymentNetworkBTCAddressBased
 */ class BtcTestnetAddressBasedDetector extends address_based_1.BtcAddressBasedDetector {
    /**
     * @param advancedLogic Instance of Advanced Logic layer, to get the extension
     */ constructor({ advancedLogic, bitcoinDetectionProvider }){
        super(TESTNET_BITCOIN_NETWORK_ID, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.TESTNET_BITCOIN_ADDRESS_BASED, advancedLogic.extensions.addressBasedTestnetBtc, bitcoinDetectionProvider);
    }
}
exports.BtcTestnetAddressBasedDetector = BtcTestnetAddressBasedDetector; //# sourceMappingURL=testnet-address-based.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Providers = exports.DefaultBitcoinDetectionProvider = exports.BtcTestnetAddressBasedDetector = exports.BtcMainnetAddressBasedDetector = void 0;
var mainnet_address_based_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/mainnet-address-based.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "BtcMainnetAddressBasedDetector", {
    enumerable: true,
    get: function() {
        return mainnet_address_based_1.BtcMainnetAddressBasedDetector;
    }
});
var testnet_address_based_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/testnet-address-based.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "BtcTestnetAddressBasedDetector", {
    enumerable: true,
    get: function() {
        return testnet_address_based_1.BtcTestnetAddressBasedDetector;
    }
});
var default_bitcoin_detection_provider_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-bitcoin-detection-provider.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "DefaultBitcoinDetectionProvider", {
    enumerable: true,
    get: function() {
        return default_bitcoin_detection_provider_1.DefaultBitcoinDetectionProvider;
    }
});
const Providers = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/default-providers/index.js [app-rsc] (ecmascript)");
exports.Providers = Providers; //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/declarative.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DeclarativePaymentDetector = exports.DeclarativePaymentDetectorBase = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const payment_detector_base_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/payment-detector-base.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
/**
 * Handles payment detection for a declarative request, or derived.
 */ class DeclarativePaymentDetectorBase extends payment_detector_base_1.PaymentDetectorBase {
    constructor(_paymentNetworkId, extension){
        super(_paymentNetworkId, extension);
    }
    /**
     * Creates the extensions data for the creation of this extension
     *
     * @param any paymentNetworkCreationParameters
     * @param paymentNetworkCreationParameters Parameters to create the extension
     * @returns The extensionData object
     */ createExtensionsDataForCreation(paymentNetworkCreationParameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            return this.extension.createCreationAction({
                paymentInfo: paymentNetworkCreationParameters.paymentInfo,
                refundInfo: paymentNetworkCreationParameters.refundInfo,
                salt: paymentNetworkCreationParameters.salt
            });
        });
    }
    /**
     * Creates the extensions data to add payment info
     *
     * @param Parameters to add payment information
     * @returns The extensionData object
     */ createExtensionsDataForAddPaymentInformation(parameters) {
        return this.extension.createAddPaymentInstructionAction({
            paymentInfo: parameters.paymentInfo
        });
    }
    /**
     * Creates the extensions data to add refund info
     *
     * @param Parameters to add refund information
     * @returns The extensionData object
     */ createExtensionsDataForAddRefundInformation(parameters) {
        return this.extension.createAddRefundInstructionAction({
            refundInfo: parameters.refundInfo
        });
    }
    /**
     * Creates the extensions data to declare a payment is sent
     *
     * @param Parameters to declare sent payment
     * @returns The extensionData object
     */ createExtensionsDataForDeclareSentPayment(parameters) {
        return this.extension.createDeclareSentPaymentAction({
            amount: parameters.amount,
            note: parameters.note,
            txHash: parameters.txHash,
            network: parameters.network
        });
    }
    /**
     * Creates the extensions data to declare a refund is sent
     *
     * @param Parameters to declare sent refund
     * @returns The extensionData object
     */ createExtensionsDataForDeclareSentRefund(parameters) {
        return this.extension.createDeclareSentRefundAction({
            amount: parameters.amount,
            note: parameters.note,
            txHash: parameters.txHash,
            network: parameters.network
        });
    }
    /**
     * Creates the extensions data to declare a payment is received
     *
     * @param Parameters to declare received payment
     * @returns The extensionData object
     */ createExtensionsDataForDeclareReceivedPayment(parameters) {
        return this.extension.createDeclareReceivedPaymentAction({
            amount: parameters.amount,
            note: parameters.note,
            txHash: parameters.txHash,
            network: parameters.network
        });
    }
    /**
     * Creates the extensions data to declare a refund is received
     *
     * @param Parameters to declare received refund
     * @returns The extensionData object
     */ createExtensionsDataForDeclareReceivedRefund(parameters) {
        return this.extension.createDeclareReceivedRefundAction({
            amount: parameters.amount,
            note: parameters.note,
            txHash: parameters.txHash,
            network: parameters.network
        });
    }
    /**
     * Creates the extensions data to declare a delegate
     *
     * @param Parameters to declare declare a delegate
     * @returns The extensionData object
     */ createExtensionsDataForAddDelegate(parameters) {
        return this.extension.createAddDelegateAction({
            delegate: parameters.delegate
        });
    }
    /**
     * The balance of a request using declarative payment network is the sum of declared received payments
     * subtracted by the sum of the declared received refund
     */ getDeclarativeEvents(request) {
        var _a;
        const events = (_a = this.getPaymentExtension(request).events) !== null && _a !== void 0 ? _a : [];
        // For each extension data related to the declarative payment network,
        // Received payment increase the balance and received refund decrease the balance
        return events.map((data)=>{
            const { amount, txHash, network, note } = data.parameters;
            const nameMap = {
                [types_1.ExtensionTypes.PnAnyDeclarative.ACTION.DECLARE_RECEIVED_PAYMENT]: types_1.PaymentTypes.EVENTS_NAMES.PAYMENT,
                [types_1.ExtensionTypes.PnAnyDeclarative.ACTION.DECLARE_RECEIVED_REFUND]: types_1.PaymentTypes.EVENTS_NAMES.REFUND
            };
            const name = nameMap[data.name];
            if (name) {
                return {
                    amount,
                    name,
                    parameters: {
                        txHash,
                        network,
                        note,
                        from: data.from
                    },
                    timestamp: data.timestamp
                };
            }
            return null;
        }).filter(utils_1.notNull);
    }
}
exports.DeclarativePaymentDetectorBase = DeclarativePaymentDetectorBase;
/**
 * Handles payment detection for a declarative request
 */ class DeclarativePaymentDetector extends DeclarativePaymentDetectorBase {
    constructor({ advancedLogic }){
        super(types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE, advancedLogic.extensions.declarative);
    }
    getEvents(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            return {
                paymentEvents: this.getDeclarativeEvents(request)
            };
        });
    }
}
exports.DeclarativePaymentDetector = DeclarativePaymentDetector; //# sourceMappingURL=declarative.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/payment-reference-calculator.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.calculate = void 0;
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
/**
 * Compute the payment reference
 *
 * @param requestId The requestId
 * @param salt The salt for the request
 * @param address Payment or refund address
 */ function calculate(requestId, salt, address) {
    if (!requestId || !salt || !address) {
        throw new Error('RequestId, salt and address are mandatory to calculate the payment reference');
    }
    // "The value is the last 8 bytes of a salted hash of the requestId: `last8Bytes(hash(requestId + salt + address))`"
    /* eslint-disable no-magic-numbers */ return (0, utils_1.keccak256Hash)((requestId + salt + address).toLowerCase()).slice(-16);
}
exports.calculate = calculate; //# sourceMappingURL=payment-reference-calculator.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.transformNonNull = exports.formatAddress = exports.hashReference = exports.getPaymentReferencesForMetaPnRequest = exports.flattenRequestByPnId = exports.getPaymentReference = exports.getPaymentNetworkExtension = exports.calculateEscrowState = exports.makeGetDeploymentInformation = exports.unpadAmountFromChainlink = exports.padAmountForChainlink = exports.parseLogArgs = void 0;
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib/utils.js [app-rsc] (ecmascript)");
const balance_error_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/balance-error.js [app-rsc] (ecmascript)");
const PaymentReferenceCalculator = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/payment-reference-calculator.js [app-rsc] (ecmascript)");
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
/**
 * Converts the Log's args from array to an object with keys being the name of the arguments
 */ const parseLogArgs = ({ args, eventFragment })=>{
    return args.reduce((prev, current, i)=>{
        prev[eventFragment.inputs[i].name] = current;
        return prev;
    }, {});
};
exports.parseLogArgs = parseLogArgs;
/**
 * Pads an amount to match Chainlink's own currency decimals (eg. for fiat amounts).
 */ const padAmountForChainlink = (amount, currency)=>{
    // eslint-disable-next-line no-magic-numbers
    return ethers_1.BigNumber.from(amount).mul(Math.pow(10, getChainlinkPaddingSize(currency)));
};
exports.padAmountForChainlink = padAmountForChainlink;
const unpadAmountFromChainlink = (amount, currency)=>{
    // eslint-disable-next-line no-magic-numbers
    return ethers_1.BigNumber.from(amount).div(Math.pow(10, getChainlinkPaddingSize(currency)));
};
exports.unpadAmountFromChainlink = unpadAmountFromChainlink;
const getChainlinkPaddingSize = ({ type, decimals })=>{
    switch(type){
        case types_1.RequestLogicTypes.CURRENCY.ISO4217:
            {
                const chainlinkFiatDecimal = 8;
                return Math.max(chainlinkFiatDecimal - decimals, 0);
            }
        case types_1.RequestLogicTypes.CURRENCY.ETH:
        case types_1.RequestLogicTypes.CURRENCY.ERC20:
            {
                return 0;
            }
        default:
            throw new Error('Unsupported request currency for conversion with Chainlink. The request currency has to be fiat, ETH or ERC20.');
    }
};
/*
 * Returns the method to get deployment information for the underlying smart contract (based on a payment network version)
 * for given artifact and version mapping.
 */ const makeGetDeploymentInformation = (artifact, map, allowUndefined)=>{
    return (network, paymentNetworkVersion)=>{
        const contractVersion = map[paymentNetworkVersion];
        if (!contractVersion) {
            throw new balance_error_1.VersionNotSupported(`No contract matches payment network version: ${paymentNetworkVersion}.`);
        }
        const info = artifact.getOptionalDeploymentInformation(network, contractVersion);
        if (!info) {
            if (!allowUndefined) {
                if (artifact.getOptionalDeploymentInformation(network)) {
                    throw new balance_error_1.VersionNotSupported(`Payment network version not supported: ${paymentNetworkVersion}`);
                }
                throw new balance_error_1.NetworkNotSupported(`Network not supported for this payment network: ${network}`);
            }
            return null;
        }
        return Object.assign(Object.assign({}, info), {
            contractVersion
        });
    };
};
exports.makeGetDeploymentInformation = makeGetDeploymentInformation;
/**
 * Returns escrow status based on array of escrow events
 * @param escrowEvents Balance of the request being updated
 * @returns
 */ const calculateEscrowState = (escrowEvents)=>{
    var _a;
    if (escrowEvents.length === 0) {
        return null;
    }
    const latestEscrowEvent = escrowEvents[escrowEvents.length - 1];
    switch((_a = latestEscrowEvent.parameters) === null || _a === void 0 ? void 0 : _a.eventName){
        case types_1.PaymentTypes.ESCROW_EVENTS_NAMES.FREEZE_ESCROW:
            return types_1.PaymentTypes.ESCROW_STATE.IN_FROZEN;
        case types_1.PaymentTypes.ESCROW_EVENTS_NAMES.INITIATE_EMERGENCY_CLAIM:
            return types_1.PaymentTypes.ESCROW_STATE.IN_EMERGENCY;
        case types_1.PaymentTypes.ESCROW_EVENTS_NAMES.PAID_ESCROW:
        case types_1.PaymentTypes.ESCROW_EVENTS_NAMES.REVERT_EMERGENCY_CLAIM:
            return types_1.PaymentTypes.ESCROW_STATE.PAID_ESCROW;
        case types_1.PaymentTypes.ESCROW_EVENTS_NAMES.PAID_ISSUER:
            return types_1.PaymentTypes.ESCROW_STATE.PAID_ISSUER;
    }
    return null;
};
exports.calculateEscrowState = calculateEscrowState;
/**
 * Return the payment network extension of a Request.
 */ function getPaymentNetworkExtension(request) {
    return Object.values(request.extensions).find((x)=>x.type === types_1.ExtensionTypes.TYPE.PAYMENT_NETWORK);
}
exports.getPaymentNetworkExtension = getPaymentNetworkExtension;
/** Gets the payment info based on parameters, for payment reference calculation */ const getInfo = ({ paymentAddress, paymentInfo, refundAddress, refundInfo }, event)=>{
    if (event === types_1.PaymentTypes.EVENTS_NAMES.REFUND) {
        return refundAddress || JSON.stringify(refundInfo);
    }
    return paymentAddress || JSON.stringify(paymentInfo);
};
/** Gets a payment (or refund) reference for any type of Request */ function getPaymentReference(request, event = types_1.PaymentTypes.EVENTS_NAMES.PAYMENT) {
    const extension = getPaymentNetworkExtension(request);
    if (!extension) {
        throw new Error('no payment network found');
    }
    const requestId = request.requestId;
    const salt = extension.values.salt;
    if (!salt) return;
    const info = getInfo(extension.values, event);
    if (!info) return;
    return PaymentReferenceCalculator.calculate(requestId, salt, info);
}
exports.getPaymentReference = getPaymentReference;
/**
 * Format a request we wish to build a payment for.
 * If the request does not use the meta-pn, it returns it as is.
 * Otherwise, returns the request formatted with the pn of interest
 */ function flattenRequestByPnId({ request, pnIdentifier }) {
    const pn = getPaymentNetworkExtension(request);
    if (!(pn === null || pn === void 0 ? void 0 : pn.id) || pn.id !== types_1.ExtensionTypes.PAYMENT_NETWORK_ID.META) return request;
    if (!pnIdentifier) throw new Error('Missing pn identifier');
    const extensionOfInterest = pn.values[pnIdentifier];
    if (!extensionOfInterest) throw new Error('Invalid pn identifier');
    const formattedRequest = Object.assign(Object.assign({}, (0, utils_2.deepCopy)(request)), {
        extensions: {
            [extensionOfInterest.id]: extensionOfInterest
        }
    });
    return formattedRequest;
}
exports.flattenRequestByPnId = flattenRequestByPnId;
/** Gets all payment references associated to a request using meta-pn  */ const getPaymentReferencesForMetaPnRequest = (request)=>{
    var _a;
    if (!((_a = request === null || request === void 0 ? void 0 : request.extensions) === null || _a === void 0 ? void 0 : _a[types_1.ExtensionTypes.PAYMENT_NETWORK_ID.META])) throw new Error('This request does not have a meta-pn extension');
    const pnKeys = Object.keys(request.extensions[types_1.ExtensionTypes.PAYMENT_NETWORK_ID.META].values);
    const pnIdentifiers = pnKeys.filter((key)=>request.extensions[types_1.ExtensionTypes.PAYMENT_NETWORK_ID.META].values[key].type === types_1.ExtensionTypes.TYPE.PAYMENT_NETWORK);
    return pnIdentifiers.map((pnIdentifier)=>getPaymentReference(flattenRequestByPnId({
            request,
            pnIdentifier
        })));
};
exports.getPaymentReferencesForMetaPnRequest = getPaymentReferencesForMetaPnRequest;
/**
 * Returns the hash of a payment reference.
 * @see getPaymentReference
 */ const hashReference = (paymentReference)=>{
    return (0, utils_1.keccak256)(`0x${paymentReference}`);
};
exports.hashReference = hashReference;
/**
 * For EVMs: alias to ethers.utils.getAddress that adds the key to error message, and supports nullish values.
 * For other chains: applies lower-case to the address.
 */ const formatAddress = (address, key, allowsUndefined = false)=>{
    if (!address && allowsUndefined) return undefined;
    if (address && (0, currency_1.isValidNearAddress)(address)) {
        return address === null || address === void 0 ? void 0 : address.toLowerCase();
    }
    try {
        return (0, utils_1.getAddress)(address || '');
    } catch (e) {
        ethers_1.logger.throwError('invalid address', ethers_1.errors.INVALID_ARGUMENT, {
            argument: 'address',
            value: address,
            key
        });
    }
};
exports.formatAddress = formatAddress;
/** applies a transformation if val[key] is not null */ const transformNonNull = (val, key, transform = (val)=>val)=>({
        [key]: val[key] !== undefined && val[key] !== null ? transform(val[key], key) : undefined
    });
exports.transformNonNull = transformNonNull; //# sourceMappingURL=utils.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/proxy-info-retriever.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
// The ERC20 proxy smart contract ABI fragment containing TransferWithReference event
const erc20proxyContractAbiFragment = [
    'event TransferWithReference(address tokenAddress,address to,uint256 amount,bytes indexed paymentReference)',
    'event TransferWithReferenceAndFee(address tokenAddress, address to,uint256 amount,bytes indexed paymentReference,uint256 feeAmount,address feeAddress)'
];
/**
 * Retrieves a list of payment events from a payment reference, a destination address, a token address and a proxy contract
 */ class ProxyERC20InfoRetriever {
    /**
     * @param paymentReference The reference to identify the payment
     * @param proxyContractAddress The address of the proxy contract
     * @param proxyCreationBlockNumber The block that created the proxy contract
     * @param tokenContractAddress The address of the ERC20 contract
     * @param toAddress Address of the balance we want to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param network The Ethereum network to use
     */ constructor(paymentReference, proxyContractAddress, proxyCreationBlockNumber, tokenContractAddress, toAddress, eventName, network){
        this.paymentReference = paymentReference;
        this.proxyContractAddress = proxyContractAddress;
        this.proxyCreationBlockNumber = proxyCreationBlockNumber;
        this.tokenContractAddress = tokenContractAddress;
        this.toAddress = toAddress;
        this.eventName = eventName;
        this.network = network;
        // Creates a local or default provider
        this.provider = (0, utils_2.getDefaultProvider)(this.network);
        // Set up the ERC20 proxy contract interface
        this.contractProxy = new ethers_1.ethers.Contract(this.proxyContractAddress, erc20proxyContractAbiFragment, this.provider);
    }
    /**
     * Retrieves transfer events for the current contract, address and network.
     * @param isTransferable Whether or not the request is expected to be paid
     * through a receivable proxy contract
     */ getTransferEvents(isTransferable = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            // Create a filter to find all the Transfer logs for the toAddress
            const filter = this.contractProxy.filters.TransferWithReference(null, null, null, '0x' + this.paymentReference);
            filter.fromBlock = this.proxyCreationBlockNumber;
            filter.toBlock = 'latest';
            // Get the proxy contract event logs
            const proxyLogs = yield this.provider.getLogs(filter);
            // Create a filter to find all the Fee Transfer logs with the payment reference
            const feeFilter = this.contractProxy.filters.TransferWithReferenceAndFee(null, null, null, '0x' + this.paymentReference, null, null);
            feeFilter.fromBlock = this.proxyCreationBlockNumber;
            feeFilter.toBlock = 'latest';
            // Get the fee proxy contract event logs
            const feeProxyLogs = yield this.provider.getLogs(feeFilter);
            // Merge both events
            const logs = [
                ...proxyLogs,
                ...feeProxyLogs
            ];
            // Parses, filters and creates the events from the logs with the payment reference
            const eventPromises = logs// Parses the logs
            .map((log)=>{
                const parsedLog = this.contractProxy.interface.parseLog(log);
                return {
                    parsedLog: (0, utils_1.parseLogArgs)(parsedLog),
                    blockNumber: log.blockNumber,
                    transactionHash: log.transactionHash
                };
            })// Keeps only the log with the right token and the right destination address
            .filter(({ parsedLog })=>parsedLog.tokenAddress.toLowerCase() === this.tokenContractAddress.toLowerCase() && (isTransferable || parsedLog.to.toLowerCase() === this.toAddress.toLowerCase()))// Creates the balance events
            .map(({ parsedLog, blockNumber, transactionHash })=>tslib_1.__awaiter(this, void 0, void 0, function*() {
                    var _a;
                    return {
                        amount: parsedLog.amount.toString(),
                        name: this.eventName,
                        parameters: {
                            block: blockNumber,
                            feeAddress: parsedLog.feeAddress || undefined,
                            feeAmount: ((_a = parsedLog.feeAmount) === null || _a === void 0 ? void 0 : _a.toString()) || undefined,
                            to: parsedLog.to,
                            txHash: transactionHash
                        },
                        timestamp: (yield this.provider.getBlock(blockNumber || 0)).timestamp
                    };
                }));
            return Promise.all(eventPromises);
        });
    }
}
exports.default = ProxyERC20InfoRetriever; //# sourceMappingURL=proxy-info-retriever.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/currency.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadCurrencyFromContract = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib/utils.js [app-rsc] (ecmascript)");
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
const loadCurrencyFromContract = (currency)=>tslib_1.__awaiter(void 0, void 0, void 0, function*() {
        try {
            const { network, value } = currency;
            if (!network || !(0, utils_1.isAddress)(value)) {
                return null;
            }
            currency_1.EvmChains.assertChainSupported(network);
            const contract = types_2.ERC20__factory.connect(value, (0, utils_2.getDefaultProvider)(network));
            const decimals = yield contract.decimals();
            if (!decimals) {
                return null;
            }
            const symbol = yield contract.symbol();
            if (!symbol) {
                return null;
            }
            const definition = {
                address: value,
                decimals,
                symbol,
                network: network,
                type: types_1.RequestLogicTypes.CURRENCY.ERC20
            };
            return Object.assign(Object.assign({}, definition), {
                id: currency_1.CurrencyManager.currencyId(definition),
                hash: (0, currency_1.getCurrencyHash)(currency_1.CurrencyManager.toStorageCurrency(definition)),
                meta: null
            });
        } catch (e) {
            return null;
        }
    });
exports.loadCurrencyFromContract = loadCurrencyFromContract; //# sourceMappingURL=currency.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/reference-based-detector.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReferenceBasedDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const PaymentReferenceCalculator = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/payment-reference-calculator.js [app-rsc] (ecmascript)");
const declarative_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/declarative.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
/**
 * Abstract class to extend to get the payment balance of reference based requests
 */ class ReferenceBasedDetector extends declarative_1.DeclarativePaymentDetectorBase {
    /**
     * @param paymentNetworkId Example : ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA
     * @param extension The advanced logic payment network extension, reference based
     * @param currencyManager The currency manager
     */ constructor(paymentNetworkId, extension, currencyManager){
        super(paymentNetworkId, extension);
        this.currencyManager = currencyManager;
        if (!types_1.TypesUtils.isPaymentNetworkId(paymentNetworkId)) {
            throw new Error(`Cannot detect payment for extension type '${paymentNetworkId}', it is not a payment network ID.`);
        }
    }
    /**
     * Creates the extensions data for the creation of this extension.
     * Will set a salt if none is already given
     *
     * @param paymentNetworkCreationParameters Parameters to create the extension
     * @returns The extensionData object
     */ createExtensionsDataForCreation(paymentNetworkCreationParameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            // If no salt is given, generate one
            paymentNetworkCreationParameters.salt = paymentNetworkCreationParameters.salt || (yield (0, utils_1.generate8randomBytes)());
            return this.extension.createCreationAction(Object.assign({
                paymentAddress: paymentNetworkCreationParameters.paymentAddress,
                refundAddress: paymentNetworkCreationParameters.refundAddress
            }, paymentNetworkCreationParameters));
        });
    }
    /**
     * Creates the extensions data to add payment address
     *
     * @param parameters to add payment address
     * @returns The extensionData object
     */ createExtensionsDataForAddPaymentAddress(parameters) {
        return this.extension.createAddPaymentAddressAction({
            paymentAddress: parameters.paymentAddress
        });
    }
    /**
     * Creates the extensions data to add refund address
     *
     * @param Parameters to add refund address
     * @returns The extensionData object
     */ createExtensionsDataForAddRefundAddress(parameters) {
        return this.extension.createAddRefundAddressAction({
            refundAddress: parameters.refundAddress
        });
    }
    getEvents(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const paymentExtension = this.getPaymentExtension(request);
            const paymentChain = this.getPaymentChain(request);
            this.checkRequiredParameter(paymentExtension.values.salt, 'salt');
            this.checkRequiredParameter(paymentExtension.values.paymentAddress, 'paymentAddress');
            const [paymentAndEscrowEvents, refundAndEscrowEvents] = yield Promise.all([
                this.extractEvents(types_1.PaymentTypes.EVENTS_NAMES.PAYMENT, paymentExtension.values.paymentAddress, this.getPaymentReference(request), request.currency, paymentChain, paymentExtension),
                this.extractEvents(types_1.PaymentTypes.EVENTS_NAMES.REFUND, paymentExtension.values.refundAddress, request.requestId, request.currency, paymentChain, paymentExtension)
            ]);
            const paymentEvents = paymentAndEscrowEvents.paymentEvents;
            const escrowEvents = paymentAndEscrowEvents.escrowEvents;
            const refundEvents = refundAndEscrowEvents.paymentEvents;
            const declaredEvents = this.getDeclarativeEvents(request);
            const allPaymentEvents = [
                ...declaredEvents,
                ...paymentEvents,
                ...refundEvents
            ];
            return {
                paymentEvents: allPaymentEvents,
                escrowEvents: escrowEvents
            };
        });
    }
    /**
     * Get the network of the payment
     * @returns The network of payment
     */ getPaymentChain(request) {
        const network = request.currency.network;
        if (!network) {
            throw Error(`request.currency.network must be defined for ${this.paymentNetworkId}`);
        }
        return network;
    }
    getPaymentReference(request) {
        const { paymentAddress, salt } = this.getPaymentExtension(request).values;
        this.checkRequiredParameter(paymentAddress, 'paymentAddress');
        this.checkRequiredParameter(salt, 'salt');
        return PaymentReferenceCalculator.calculate(request.requestId, salt, paymentAddress);
    }
}
exports.ReferenceBasedDetector = ReferenceBasedDetector; //# sourceMappingURL=reference-based-detector.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/fee-reference-based-detector.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FeeReferenceBasedDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const reference_based_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/reference-based-detector.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
/**
 * Abstract class to extend to get the payment balance of reference based requests
 */ class FeeReferenceBasedDetector extends reference_based_detector_1.ReferenceBasedDetector {
    /**
     * @param paymentNetworkId Example : ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA
     * @param extension The advanced logic payment network extension, reference based
     */ constructor(paymentNetworkId, extension, currencyManager){
        super(paymentNetworkId, extension, currencyManager);
    }
    /**
     * Creates the extensions data for the creation of this extension.
     * Will set a salt if none is already given
     *
     * @param paymentNetworkCreationParameters Parameters to create the extension
     * @returns The extensionData object
     */ createExtensionsDataForCreation(paymentNetworkCreationParameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            // If no salt is given, generate one
            paymentNetworkCreationParameters.salt = paymentNetworkCreationParameters.salt || (yield (0, utils_1.generate8randomBytes)());
            return this.extension.createCreationAction(Object.assign({
                feeAddress: paymentNetworkCreationParameters.feeAddress,
                feeAmount: paymentNetworkCreationParameters.feeAmount,
                paymentAddress: paymentNetworkCreationParameters.paymentAddress,
                refundAddress: paymentNetworkCreationParameters.refundAddress
            }, paymentNetworkCreationParameters));
        });
    }
    /**
     * Creates the extensions data to add fee address and amount
     *
     * @param Parameters to add refund information
     * @returns The extensionData object
     */ createExtensionsDataForAddFeeInformation(parameters) {
        return this.extension.createAddFeeAction({
            feeAddress: parameters.feeAddress,
            feeAmount: parameters.feeAmount
        });
    }
    getBalance(request) {
        const _super = Object.create(null, {
            getBalance: {
                get: ()=>super.getBalance
            }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const balance = yield _super.getBalance.call(this, request);
            if (balance.error) {
                return balance;
            }
            // FIXME: should be at the same level as balance
            const values = this.getPaymentExtension(request).values;
            values.feeBalance = yield this.getFeeBalance(request, balance);
            return balance;
        });
    }
    getFeeBalance(request, balance) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const { feeAddress } = this.getPaymentExtension(request).values;
            this.checkRequiredParameter(feeAddress, 'feeAddress');
            const feeBalance = this.computeFeeBalance(balance.events, feeAddress).toString();
            return {
                events: balance.events,
                balance: feeBalance
            };
        });
    }
    // Sum fee that are directed to the right fee address
    computeFeeBalance(feeEvents, feeAddress) {
        return feeEvents.reduce((sum, curr)=>{
            var _a;
            return curr.parameters && 'feeAmount' in curr.parameters && curr.parameters.feeAmount && (!((_a = curr.parameters) === null || _a === void 0 ? void 0 : _a.feeAddress) || curr.parameters.feeAddress === feeAddress) ? sum.add(curr.parameters.feeAmount) : sum;
        }, ethers_1.BigNumber.from(0));
    }
}
exports.FeeReferenceBasedDetector = FeeReferenceBasedDetector; //# sourceMappingURL=fee-reference-based-detector.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/generated/graphql.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GetSyncedBlock = exports.GetPaymentsAndEscrowStateForReceivables = exports.GetAnyToNativePayments = exports.GetAnyToFungiblePayments = exports.GetPaymentsAndEscrowState = exports.GetLastSyncedBlock = exports.EscrowEventResult = exports.PaymentEventResult = exports.getSdk = exports.GetSyncedBlockDocument = exports.GetPaymentsAndEscrowStateForReceivablesDocument = exports.GetAnyToNativePaymentsDocument = exports.GetAnyToFungiblePaymentsDocument = exports.GetPaymentsAndEscrowStateDocument = exports.GetLastSyncedBlockDocument = exports.EscrowEventResultFragmentDoc = exports.PaymentEventResultFragmentDoc = exports._SubgraphErrorPolicy_ = exports.SingleRequestProxyType = exports.SingleRequestProxyDeployment_OrderBy = exports.Payment_OrderBy = exports.OrderDirection = exports.EventName = exports.Escrow_OrderBy = exports.EscrowState = exports.EscrowEvent_OrderBy = exports.Aggregation_Interval = void 0;
const graphql_tag_1 = __turbopack_require__("[project]/node_modules/.pnpm/graphql-tag@2.12.6_graphql@16.8.1/node_modules/graphql-tag/lib/index.js [app-rsc] (ecmascript)");
var Aggregation_Interval;
(function(Aggregation_Interval) {
    Aggregation_Interval["Day"] = "day";
    Aggregation_Interval["Hour"] = "hour";
})(Aggregation_Interval || (exports.Aggregation_Interval = Aggregation_Interval = {}));
var EscrowEvent_OrderBy;
(function(EscrowEvent_OrderBy) {
    EscrowEvent_OrderBy["Block"] = "block";
    EscrowEvent_OrderBy["ContractAddress"] = "contractAddress";
    EscrowEvent_OrderBy["Escrow"] = "escrow";
    EscrowEvent_OrderBy["EscrowAmount"] = "escrow__amount";
    EscrowEvent_OrderBy["EscrowContractAddress"] = "escrow__contractAddress";
    EscrowEvent_OrderBy["EscrowCreationBlock"] = "escrow__creationBlock";
    EscrowEvent_OrderBy["EscrowCreationTimestamp"] = "escrow__creationTimestamp";
    EscrowEvent_OrderBy["EscrowEscrowState"] = "escrow__escrowState";
    EscrowEvent_OrderBy["EscrowFeeAddress"] = "escrow__feeAddress";
    EscrowEvent_OrderBy["EscrowFeeAmount"] = "escrow__feeAmount";
    EscrowEvent_OrderBy["EscrowFrom"] = "escrow__from";
    EscrowEvent_OrderBy["EscrowId"] = "escrow__id";
    EscrowEvent_OrderBy["EscrowPaymentProxyAddress"] = "escrow__paymentProxyAddress";
    EscrowEvent_OrderBy["EscrowReference"] = "escrow__reference";
    EscrowEvent_OrderBy["EscrowTo"] = "escrow__to";
    EscrowEvent_OrderBy["EscrowTokenAddress"] = "escrow__tokenAddress";
    EscrowEvent_OrderBy["EventName"] = "eventName";
    EscrowEvent_OrderBy["From"] = "from";
    EscrowEvent_OrderBy["GasPrice"] = "gasPrice";
    EscrowEvent_OrderBy["GasUsed"] = "gasUsed";
    EscrowEvent_OrderBy["Id"] = "id";
    EscrowEvent_OrderBy["Reference"] = "reference";
    EscrowEvent_OrderBy["Timestamp"] = "timestamp";
    EscrowEvent_OrderBy["TxHash"] = "txHash";
})(EscrowEvent_OrderBy || (exports.EscrowEvent_OrderBy = EscrowEvent_OrderBy = {}));
var EscrowState;
(function(EscrowState) {
    EscrowState["Emergency"] = "emergency";
    EscrowState["Frozen"] = "frozen";
    EscrowState["PaidEscrow"] = "paidEscrow";
    EscrowState["PaidIssuer"] = "paidIssuer";
})(EscrowState || (exports.EscrowState = EscrowState = {}));
var Escrow_OrderBy;
(function(Escrow_OrderBy) {
    Escrow_OrderBy["Amount"] = "amount";
    Escrow_OrderBy["ContractAddress"] = "contractAddress";
    Escrow_OrderBy["CreationBlock"] = "creationBlock";
    Escrow_OrderBy["CreationTimestamp"] = "creationTimestamp";
    Escrow_OrderBy["EscrowState"] = "escrowState";
    Escrow_OrderBy["Events"] = "events";
    Escrow_OrderBy["FeeAddress"] = "feeAddress";
    Escrow_OrderBy["FeeAmount"] = "feeAmount";
    Escrow_OrderBy["From"] = "from";
    Escrow_OrderBy["Id"] = "id";
    Escrow_OrderBy["PaymentProxyAddress"] = "paymentProxyAddress";
    Escrow_OrderBy["Reference"] = "reference";
    Escrow_OrderBy["To"] = "to";
    Escrow_OrderBy["TokenAddress"] = "tokenAddress";
})(Escrow_OrderBy || (exports.Escrow_OrderBy = Escrow_OrderBy = {}));
var EventName;
(function(EventName) {
    EventName["FreezeEscrow"] = "freezeEscrow";
    EventName["InitiateEmergencyClaim"] = "initiateEmergencyClaim";
    EventName["PaidEscrow"] = "paidEscrow";
    EventName["PaidIssuer"] = "paidIssuer";
    EventName["RevertEmergencyClaim"] = "revertEmergencyClaim";
})(EventName || (exports.EventName = EventName = {}));
/** Defines the order direction, either ascending or descending */ var OrderDirection;
(function(OrderDirection) {
    OrderDirection["Asc"] = "asc";
    OrderDirection["Desc"] = "desc";
})(OrderDirection || (exports.OrderDirection = OrderDirection = {}));
var Payment_OrderBy;
(function(Payment_OrderBy) {
    Payment_OrderBy["Amount"] = "amount";
    Payment_OrderBy["AmountInCrypto"] = "amountInCrypto";
    Payment_OrderBy["Block"] = "block";
    Payment_OrderBy["ContractAddress"] = "contractAddress";
    Payment_OrderBy["Currency"] = "currency";
    Payment_OrderBy["FeeAddress"] = "feeAddress";
    Payment_OrderBy["FeeAmount"] = "feeAmount";
    Payment_OrderBy["FeeAmountInCrypto"] = "feeAmountInCrypto";
    Payment_OrderBy["From"] = "from";
    Payment_OrderBy["GasPrice"] = "gasPrice";
    Payment_OrderBy["GasUsed"] = "gasUsed";
    Payment_OrderBy["Id"] = "id";
    Payment_OrderBy["MaxRateTimespan"] = "maxRateTimespan";
    Payment_OrderBy["Reference"] = "reference";
    Payment_OrderBy["Timestamp"] = "timestamp";
    Payment_OrderBy["To"] = "to";
    Payment_OrderBy["TokenAddress"] = "tokenAddress";
    Payment_OrderBy["TxHash"] = "txHash";
})(Payment_OrderBy || (exports.Payment_OrderBy = Payment_OrderBy = {}));
var SingleRequestProxyDeployment_OrderBy;
(function(SingleRequestProxyDeployment_OrderBy) {
    SingleRequestProxyDeployment_OrderBy["Block"] = "block";
    SingleRequestProxyDeployment_OrderBy["FeeAddress"] = "feeAddress";
    SingleRequestProxyDeployment_OrderBy["FeeAmount"] = "feeAmount";
    SingleRequestProxyDeployment_OrderBy["FeeProxyUsed"] = "feeProxyUsed";
    SingleRequestProxyDeployment_OrderBy["Id"] = "id";
    SingleRequestProxyDeployment_OrderBy["Payee"] = "payee";
    SingleRequestProxyDeployment_OrderBy["PaymentReference"] = "paymentReference";
    SingleRequestProxyDeployment_OrderBy["ProxyAddress"] = "proxyAddress";
    SingleRequestProxyDeployment_OrderBy["ProxyType"] = "proxyType";
    SingleRequestProxyDeployment_OrderBy["Timestamp"] = "timestamp";
    SingleRequestProxyDeployment_OrderBy["TokenAddress"] = "tokenAddress";
    SingleRequestProxyDeployment_OrderBy["TxHash"] = "txHash";
})(SingleRequestProxyDeployment_OrderBy || (exports.SingleRequestProxyDeployment_OrderBy = SingleRequestProxyDeployment_OrderBy = {}));
var SingleRequestProxyType;
(function(SingleRequestProxyType) {
    SingleRequestProxyType["Erc20"] = "ERC20";
    SingleRequestProxyType["Ethereum"] = "Ethereum";
})(SingleRequestProxyType || (exports.SingleRequestProxyType = SingleRequestProxyType = {}));
var _SubgraphErrorPolicy_;
(function(_SubgraphErrorPolicy_) {
    /** Data will be returned even if the subgraph has indexing errors */ _SubgraphErrorPolicy_["Allow"] = "allow";
    /** If the subgraph has indexing errors, data will be omitted. The default. */ _SubgraphErrorPolicy_["Deny"] = "deny";
})(_SubgraphErrorPolicy_ || (exports._SubgraphErrorPolicy_ = _SubgraphErrorPolicy_ = {}));
exports.PaymentEventResultFragmentDoc = (0, graphql_tag_1.default)`
    fragment PaymentEventResult on Payment {
  amount
  block
  txHash
  feeAmount
  feeAddress
  from
  gasUsed
  gasPrice
  timestamp
  contractAddress
  to
  tokenAddress
  currency
  amountInCrypto
  feeAmountInCrypto
  maxRateTimespan
}
    `;
exports.EscrowEventResultFragmentDoc = (0, graphql_tag_1.default)`
    fragment EscrowEventResult on EscrowEvent {
  txHash
  eventName
  from
  timestamp
  block
  gasUsed
  gasPrice
}
    `;
exports.GetLastSyncedBlockDocument = (0, graphql_tag_1.default)`
    query GetLastSyncedBlock {
  _meta {
    block {
      number
      hash
    }
  }
}
    `;
exports.GetPaymentsAndEscrowStateDocument = (0, graphql_tag_1.default)`
    query GetPaymentsAndEscrowState($blockFilter: Block_height, $reference: Bytes!, $to: Bytes!, $tokenAddress: Bytes, $contractAddress: Bytes!) {
  payments(
    block: $blockFilter
    where: {reference: $reference, to: $to, contractAddress: $contractAddress, currency: null, tokenAddress: $tokenAddress}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...PaymentEventResult
  }
  escrowEvents(
    block: $blockFilter
    where: {reference: $reference}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...EscrowEventResult
  }
}
    ${exports.PaymentEventResultFragmentDoc}
${exports.EscrowEventResultFragmentDoc}`;
exports.GetAnyToFungiblePaymentsDocument = (0, graphql_tag_1.default)`
    query GetAnyToFungiblePayments($blockFilter: Block_height, $reference: Bytes!, $to: Bytes!, $currency: Bytes!, $acceptedTokens: [Bytes!], $contractAddress: Bytes!) {
  payments(
    block: $blockFilter
    where: {reference: $reference, to: $to, currency: $currency, tokenAddress_in: $acceptedTokens, contractAddress: $contractAddress}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...PaymentEventResult
  }
}
    ${exports.PaymentEventResultFragmentDoc}`;
exports.GetAnyToNativePaymentsDocument = (0, graphql_tag_1.default)`
    query GetAnyToNativePayments($blockFilter: Block_height, $reference: Bytes!, $to: Bytes!, $currency: Bytes!, $contractAddress: Bytes!) {
  payments(
    block: $blockFilter
    where: {reference: $reference, to: $to, currency: $currency, contractAddress: $contractAddress, tokenAddress: null}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...PaymentEventResult
  }
}
    ${exports.PaymentEventResultFragmentDoc}`;
exports.GetPaymentsAndEscrowStateForReceivablesDocument = (0, graphql_tag_1.default)`
    query GetPaymentsAndEscrowStateForReceivables($blockFilter: Block_height, $reference: Bytes!, $tokenAddress: Bytes!, $contractAddress: Bytes!) {
  payments(
    block: $blockFilter
    where: {reference: $reference, tokenAddress: $tokenAddress, contractAddress: $contractAddress}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...PaymentEventResult
  }
  escrowEvents(
    block: $blockFilter
    where: {reference: $reference}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...EscrowEventResult
  }
}
    ${exports.PaymentEventResultFragmentDoc}
${exports.EscrowEventResultFragmentDoc}`;
exports.GetSyncedBlockDocument = (0, graphql_tag_1.default)`
    query GetSyncedBlock($blockHash: Bytes!) {
  _meta(block: {hash: $blockHash}) {
    block {
      number
      hash
    }
  }
}
    `;
const defaultWrapper = (action, _operationName, _operationType)=>action();
function getSdk(client, withWrapper = defaultWrapper) {
    return {
        GetLastSyncedBlock (variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders)=>client.request(exports.GetLastSyncedBlockDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'GetLastSyncedBlock', 'query');
        },
        GetPaymentsAndEscrowState (variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders)=>client.request(exports.GetPaymentsAndEscrowStateDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'GetPaymentsAndEscrowState', 'query');
        },
        GetAnyToFungiblePayments (variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders)=>client.request(exports.GetAnyToFungiblePaymentsDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'GetAnyToFungiblePayments', 'query');
        },
        GetAnyToNativePayments (variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders)=>client.request(exports.GetAnyToNativePaymentsDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'GetAnyToNativePayments', 'query');
        },
        GetPaymentsAndEscrowStateForReceivables (variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders)=>client.request(exports.GetPaymentsAndEscrowStateForReceivablesDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'GetPaymentsAndEscrowStateForReceivables', 'query');
        },
        GetSyncedBlock (variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders)=>client.request(exports.GetSyncedBlockDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'GetSyncedBlock', 'query');
        }
    };
}
exports.getSdk = getSdk;
exports.PaymentEventResult = (0, graphql_tag_1.default)`
    fragment PaymentEventResult on Payment {
  amount
  block
  txHash
  feeAmount
  feeAddress
  from
  gasUsed
  gasPrice
  timestamp
  contractAddress
  to
  tokenAddress
  currency
  amountInCrypto
  feeAmountInCrypto
  maxRateTimespan
}
    `;
exports.EscrowEventResult = (0, graphql_tag_1.default)`
    fragment EscrowEventResult on EscrowEvent {
  txHash
  eventName
  from
  timestamp
  block
  gasUsed
  gasPrice
}
    `;
exports.GetLastSyncedBlock = (0, graphql_tag_1.default)`
    query GetLastSyncedBlock {
  _meta {
    block {
      number
      hash
    }
  }
}
    `;
exports.GetPaymentsAndEscrowState = (0, graphql_tag_1.default)`
    query GetPaymentsAndEscrowState($blockFilter: Block_height, $reference: Bytes!, $to: Bytes!, $tokenAddress: Bytes, $contractAddress: Bytes!) {
  payments(
    block: $blockFilter
    where: {reference: $reference, to: $to, contractAddress: $contractAddress, currency: null, tokenAddress: $tokenAddress}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...PaymentEventResult
  }
  escrowEvents(
    block: $blockFilter
    where: {reference: $reference}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...EscrowEventResult
  }
}
    ${exports.PaymentEventResult}
${exports.EscrowEventResult}`;
exports.GetAnyToFungiblePayments = (0, graphql_tag_1.default)`
    query GetAnyToFungiblePayments($blockFilter: Block_height, $reference: Bytes!, $to: Bytes!, $currency: Bytes!, $acceptedTokens: [Bytes!], $contractAddress: Bytes!) {
  payments(
    block: $blockFilter
    where: {reference: $reference, to: $to, currency: $currency, tokenAddress_in: $acceptedTokens, contractAddress: $contractAddress}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...PaymentEventResult
  }
}
    ${exports.PaymentEventResult}`;
exports.GetAnyToNativePayments = (0, graphql_tag_1.default)`
    query GetAnyToNativePayments($blockFilter: Block_height, $reference: Bytes!, $to: Bytes!, $currency: Bytes!, $contractAddress: Bytes!) {
  payments(
    block: $blockFilter
    where: {reference: $reference, to: $to, currency: $currency, contractAddress: $contractAddress, tokenAddress: null}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...PaymentEventResult
  }
}
    ${exports.PaymentEventResult}`;
exports.GetPaymentsAndEscrowStateForReceivables = (0, graphql_tag_1.default)`
    query GetPaymentsAndEscrowStateForReceivables($blockFilter: Block_height, $reference: Bytes!, $tokenAddress: Bytes!, $contractAddress: Bytes!) {
  payments(
    block: $blockFilter
    where: {reference: $reference, tokenAddress: $tokenAddress, contractAddress: $contractAddress}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...PaymentEventResult
  }
  escrowEvents(
    block: $blockFilter
    where: {reference: $reference}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...EscrowEventResult
  }
}
    ${exports.PaymentEventResult}
${exports.EscrowEventResult}`;
exports.GetSyncedBlock = (0, graphql_tag_1.default)`
    query GetSyncedBlock($blockHash: Bytes!) {
  _meta(block: {hash: $blockHash}) {
    block {
      number
      hash
    }
  }
}
    `; //# sourceMappingURL=graphql.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/generated/graphql-near.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GetNearPayments = exports.GetFungibleTokenPayments = exports.GetAnyToNativePayments = exports.NearPaymentEventResult = exports.getSdk = exports.GetNearPaymentsDocument = exports.GetFungibleTokenPaymentsDocument = exports.GetAnyToNativePaymentsDocument = exports.NearPaymentEventResultFragmentDoc = exports._SubgraphErrorPolicy_ = exports.Payment_OrderBy = exports.OrderDirection = exports.EventName = exports.Escrow_OrderBy = exports.EscrowState = exports.EscrowEvent_OrderBy = exports.Aggregation_Interval = void 0;
const graphql_tag_1 = __turbopack_require__("[project]/node_modules/.pnpm/graphql-tag@2.12.6_graphql@16.8.1/node_modules/graphql-tag/lib/index.js [app-rsc] (ecmascript)");
var Aggregation_Interval;
(function(Aggregation_Interval) {
    Aggregation_Interval["Day"] = "day";
    Aggregation_Interval["Hour"] = "hour";
})(Aggregation_Interval || (exports.Aggregation_Interval = Aggregation_Interval = {}));
var EscrowEvent_OrderBy;
(function(EscrowEvent_OrderBy) {
    EscrowEvent_OrderBy["Block"] = "block";
    EscrowEvent_OrderBy["ContractAddress"] = "contractAddress";
    EscrowEvent_OrderBy["Escrow"] = "escrow";
    EscrowEvent_OrderBy["EscrowAmount"] = "escrow__amount";
    EscrowEvent_OrderBy["EscrowContractAddress"] = "escrow__contractAddress";
    EscrowEvent_OrderBy["EscrowCreationBlock"] = "escrow__creationBlock";
    EscrowEvent_OrderBy["EscrowCreationTimestamp"] = "escrow__creationTimestamp";
    EscrowEvent_OrderBy["EscrowEscrowState"] = "escrow__escrowState";
    EscrowEvent_OrderBy["EscrowFeeAddress"] = "escrow__feeAddress";
    EscrowEvent_OrderBy["EscrowFeeAmount"] = "escrow__feeAmount";
    EscrowEvent_OrderBy["EscrowFrom"] = "escrow__from";
    EscrowEvent_OrderBy["EscrowId"] = "escrow__id";
    EscrowEvent_OrderBy["EscrowPaymentProxyAddress"] = "escrow__paymentProxyAddress";
    EscrowEvent_OrderBy["EscrowReference"] = "escrow__reference";
    EscrowEvent_OrderBy["EscrowTo"] = "escrow__to";
    EscrowEvent_OrderBy["EscrowTokenAddress"] = "escrow__tokenAddress";
    EscrowEvent_OrderBy["EventName"] = "eventName";
    EscrowEvent_OrderBy["From"] = "from";
    EscrowEvent_OrderBy["GasPrice"] = "gasPrice";
    EscrowEvent_OrderBy["GasUsed"] = "gasUsed";
    EscrowEvent_OrderBy["Id"] = "id";
    EscrowEvent_OrderBy["Reference"] = "reference";
    EscrowEvent_OrderBy["Timestamp"] = "timestamp";
    EscrowEvent_OrderBy["TxHash"] = "txHash";
})(EscrowEvent_OrderBy || (exports.EscrowEvent_OrderBy = EscrowEvent_OrderBy = {}));
var EscrowState;
(function(EscrowState) {
    EscrowState["Emergency"] = "emergency";
    EscrowState["Frozen"] = "frozen";
    EscrowState["PaidEscrow"] = "paidEscrow";
    EscrowState["PaidIssuer"] = "paidIssuer";
})(EscrowState || (exports.EscrowState = EscrowState = {}));
var Escrow_OrderBy;
(function(Escrow_OrderBy) {
    Escrow_OrderBy["Amount"] = "amount";
    Escrow_OrderBy["ContractAddress"] = "contractAddress";
    Escrow_OrderBy["CreationBlock"] = "creationBlock";
    Escrow_OrderBy["CreationTimestamp"] = "creationTimestamp";
    Escrow_OrderBy["EscrowState"] = "escrowState";
    Escrow_OrderBy["Events"] = "events";
    Escrow_OrderBy["FeeAddress"] = "feeAddress";
    Escrow_OrderBy["FeeAmount"] = "feeAmount";
    Escrow_OrderBy["From"] = "from";
    Escrow_OrderBy["Id"] = "id";
    Escrow_OrderBy["PaymentProxyAddress"] = "paymentProxyAddress";
    Escrow_OrderBy["Reference"] = "reference";
    Escrow_OrderBy["To"] = "to";
    Escrow_OrderBy["TokenAddress"] = "tokenAddress";
})(Escrow_OrderBy || (exports.Escrow_OrderBy = Escrow_OrderBy = {}));
var EventName;
(function(EventName) {
    EventName["FreezeEscrow"] = "freezeEscrow";
    EventName["InitiateEmergencyClaim"] = "initiateEmergencyClaim";
    EventName["PaidEscrow"] = "paidEscrow";
    EventName["PaidIssuer"] = "paidIssuer";
    EventName["RevertEmergencyClaim"] = "revertEmergencyClaim";
})(EventName || (exports.EventName = EventName = {}));
/** Defines the order direction, either ascending or descending */ var OrderDirection;
(function(OrderDirection) {
    OrderDirection["Asc"] = "asc";
    OrderDirection["Desc"] = "desc";
})(OrderDirection || (exports.OrderDirection = OrderDirection = {}));
var Payment_OrderBy;
(function(Payment_OrderBy) {
    Payment_OrderBy["Amount"] = "amount";
    Payment_OrderBy["AmountInCrypto"] = "amountInCrypto";
    Payment_OrderBy["Block"] = "block";
    Payment_OrderBy["ContractAddress"] = "contractAddress";
    Payment_OrderBy["Currency"] = "currency";
    Payment_OrderBy["FeeAddress"] = "feeAddress";
    Payment_OrderBy["FeeAmount"] = "feeAmount";
    Payment_OrderBy["FeeAmountInCrypto"] = "feeAmountInCrypto";
    Payment_OrderBy["From"] = "from";
    Payment_OrderBy["GasPrice"] = "gasPrice";
    Payment_OrderBy["GasUsed"] = "gasUsed";
    Payment_OrderBy["Id"] = "id";
    Payment_OrderBy["MaxRateTimespan"] = "maxRateTimespan";
    Payment_OrderBy["ReceiptId"] = "receiptId";
    Payment_OrderBy["Reference"] = "reference";
    Payment_OrderBy["Timestamp"] = "timestamp";
    Payment_OrderBy["To"] = "to";
    Payment_OrderBy["TokenAddress"] = "tokenAddress";
    Payment_OrderBy["TxHash"] = "txHash";
})(Payment_OrderBy || (exports.Payment_OrderBy = Payment_OrderBy = {}));
var _SubgraphErrorPolicy_;
(function(_SubgraphErrorPolicy_) {
    /** Data will be returned even if the subgraph has indexing errors */ _SubgraphErrorPolicy_["Allow"] = "allow";
    /** If the subgraph has indexing errors, data will be omitted. The default. */ _SubgraphErrorPolicy_["Deny"] = "deny";
})(_SubgraphErrorPolicy_ || (exports._SubgraphErrorPolicy_ = _SubgraphErrorPolicy_ = {}));
exports.NearPaymentEventResultFragmentDoc = (0, graphql_tag_1.default)`
    fragment NearPaymentEventResult on Payment {
  amount
  block
  receiptId
  txHash
  feeAmount
  feeAddress
  from
  gasUsed
  gasPrice
  timestamp
  contractAddress
  to
  tokenAddress
  currency
  amountInCrypto
  feeAmountInCrypto
  maxRateTimespan
}
    `;
exports.GetAnyToNativePaymentsDocument = (0, graphql_tag_1.default)`
    query GetAnyToNativePayments($reference: String!, $to: String!, $currency: String!, $maxRateTimespan: Int!, $contractAddress: String!) {
  payments(
    where: {reference: $reference, to: $to, currency: $currency, maxRateTimespan_gte: $maxRateTimespan, contractAddress: $contractAddress, tokenAddress: null}
    orderBy: timestamp
    orderDirection: asc
  ) {
    amount
    block
    receiptId
    feeAmount
    feeAddress
    from
    timestamp
    currency
    gasPrice
    gasUsed
    maxRateTimespan
    amountInCrypto
    feeAmountInCrypto
  }
}
    `;
exports.GetFungibleTokenPaymentsDocument = (0, graphql_tag_1.default)`
    query GetFungibleTokenPayments($reference: String!, $to: String!, $contractAddress: String!, $tokenAddress: String!) {
  payments(
    where: {reference: $reference, to: $to, tokenAddress: $tokenAddress, contractAddress: $contractAddress, currency: $tokenAddress}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...NearPaymentEventResult
  }
}
    ${exports.NearPaymentEventResultFragmentDoc}`;
exports.GetNearPaymentsDocument = (0, graphql_tag_1.default)`
    query GetNearPayments($reference: String!, $to: String!, $contractAddress: String!) {
  payments(
    where: {reference: $reference, to: $to, contractAddress: $contractAddress, tokenAddress: null}
    orderBy: timestamp
    orderDirection: asc
  ) {
    amount
    currency
    block
    receiptId
    feeAmount
    feeAddress
    from
    timestamp
    gasPrice
    gasUsed
  }
}
    `;
const defaultWrapper = (action, _operationName, _operationType)=>action();
function getSdk(client, withWrapper = defaultWrapper) {
    return {
        GetAnyToNativePayments (variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders)=>client.request(exports.GetAnyToNativePaymentsDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'GetAnyToNativePayments', 'query');
        },
        GetFungibleTokenPayments (variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders)=>client.request(exports.GetFungibleTokenPaymentsDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'GetFungibleTokenPayments', 'query');
        },
        GetNearPayments (variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders)=>client.request(exports.GetNearPaymentsDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'GetNearPayments', 'query');
        }
    };
}
exports.getSdk = getSdk;
exports.NearPaymentEventResult = (0, graphql_tag_1.default)`
    fragment NearPaymentEventResult on Payment {
  amount
  block
  receiptId
  txHash
  feeAmount
  feeAddress
  from
  gasUsed
  gasPrice
  timestamp
  contractAddress
  to
  tokenAddress
  currency
  amountInCrypto
  feeAmountInCrypto
  maxRateTimespan
}
    `;
exports.GetAnyToNativePayments = (0, graphql_tag_1.default)`
    query GetAnyToNativePayments($reference: String!, $to: String!, $currency: String!, $maxRateTimespan: Int!, $contractAddress: String!) {
  payments(
    where: {reference: $reference, to: $to, currency: $currency, maxRateTimespan_gte: $maxRateTimespan, contractAddress: $contractAddress, tokenAddress: null}
    orderBy: timestamp
    orderDirection: asc
  ) {
    amount
    block
    receiptId
    feeAmount
    feeAddress
    from
    timestamp
    currency
    gasPrice
    gasUsed
    maxRateTimespan
    amountInCrypto
    feeAmountInCrypto
  }
}
    `;
exports.GetFungibleTokenPayments = (0, graphql_tag_1.default)`
    query GetFungibleTokenPayments($reference: String!, $to: String!, $contractAddress: String!, $tokenAddress: String!) {
  payments(
    where: {reference: $reference, to: $to, tokenAddress: $tokenAddress, contractAddress: $contractAddress, currency: $tokenAddress}
    orderBy: timestamp
    orderDirection: asc
  ) {
    ...NearPaymentEventResult
  }
}
    ${exports.NearPaymentEventResult}`;
exports.GetNearPayments = (0, graphql_tag_1.default)`
    query GetNearPayments($reference: String!, $to: String!, $contractAddress: String!) {
  payments(
    where: {reference: $reference, to: $to, contractAddress: $contractAddress, tokenAddress: null}
    orderBy: timestamp
    orderDirection: asc
  ) {
    amount
    currency
    block
    receiptId
    feeAmount
    feeAddress
    from
    timestamp
    gasPrice
    gasUsed
  }
}
    `; //# sourceMappingURL=graphql-near.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/client.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultGetTheGraphClient = exports.getTheGraphNearClient = exports.getTheGraphEvmClient = exports.getTheGraphClient = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-rsc] (ecmascript)");
const graphql_request_1 = __turbopack_require__("[project]/node_modules/.pnpm/graphql-request@6.1.0_graphql@16.8.1/node_modules/graphql-request/build/cjs/index.js [app-rsc] (ecmascript)");
const graphql_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/generated/graphql.js [app-rsc] (ecmascript)");
const graphql_near_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/generated/graphql-near.js [app-rsc] (ecmascript)");
const THE_GRAPH_STUDIO_URL = 'https://api.studio.thegraph.com/query/67444/request-payments-$NETWORK/version/latest';
const THE_GRAPH_ALCHEMY_URL = 'https://subgraph.satsuma-prod.com/e2e4905ab7c8/request-network--434873/request-payments-$NETWORK/api';
const THE_GRAPH_URL_MANTLE_TESTNET = 'https://graph.testnet.mantle.xyz/subgraphs/name/requestnetwork/request-payments-mantle-testnet';
const THE_GRAPH_URL_MANTLE = 'https://subgraph-api.mantle.xyz/api/public/555176e7-c1f4-49f9-9180-f2f03538b039/subgraphs/requestnetwork/request-payments-mantle/v0.1.0/gn';
const THE_GRAPH_URL_CORE = 'https://thegraph.coredao.org/subgraphs/name/requestnetwork/request-payments-core';
/** Splits the input options into "client options" to pass to the SDK, and "query options" to use in queries */ const extractClientOptions = (url, options)=>{
    const optionsObject = options !== null && options !== void 0 ? options : {};
    // build query options
    const queryOptions = {};
    const { minIndexedBlock } = optionsObject, clientOptions = tslib_1.__rest(optionsObject, [
        "minIndexedBlock"
    ]);
    if (minIndexedBlock) {
        queryOptions.blockFilter = {
            number_gte: minIndexedBlock
        };
    } else if (url.match(/^https:\/\/gateway-\w+\.network\.thegraph\.com\//)) {
        // the decentralized network doesn't support "undefined"
        queryOptions.blockFilter = {
            number_gte: 0
        };
    }
    // build client options
    return [
        clientOptions,
        queryOptions
    ];
};
const getTheGraphClient = (network, url, options)=>currency_1.NearChains.isChainSupported(network) ? (0, exports.getTheGraphNearClient)(url, options) : (0, exports.getTheGraphEvmClient)(url, options);
exports.getTheGraphClient = getTheGraphClient;
const getTheGraphEvmClient = (url, options)=>{
    const [clientOptions, queryOptions] = extractClientOptions(url, options);
    const sdk = (0, graphql_1.getSdk)(new graphql_request_1.GraphQLClient(url, clientOptions));
    sdk.options = queryOptions;
    return sdk;
};
exports.getTheGraphEvmClient = getTheGraphEvmClient;
const getTheGraphNearClient = (url, options)=>{
    const [clientOptions, queryOptions] = extractClientOptions(url, options);
    const sdk = (0, graphql_near_1.getSdk)(new graphql_request_1.GraphQLClient(url, clientOptions));
    sdk.options = queryOptions;
    return sdk;
};
exports.getTheGraphNearClient = getTheGraphNearClient;
const defaultGetTheGraphClient = (network, options)=>{
    return network === 'private' ? undefined : currency_1.NearChains.isChainSupported(network) ? (0, exports.getTheGraphNearClient)(`${THE_GRAPH_STUDIO_URL.replace('$NETWORK', network.replace('aurora', 'near'))}`, options) : network === 'mantle' ? (0, exports.getTheGraphEvmClient)(THE_GRAPH_URL_MANTLE, options) : network === 'mantle-testnet' ? (0, exports.getTheGraphEvmClient)(THE_GRAPH_URL_MANTLE_TESTNET, options) : network === 'core' ? (0, exports.getTheGraphEvmClient)(THE_GRAPH_URL_CORE, options) : network === 'mainnet' || network === 'sepolia' || network === 'matic' || network === 'bsc' || network === 'optimism' || network === 'arbitrum-one' || network === 'base' || network === 'zksyncera' || network === 'avalanche' || network === 'fantom' ? (0, exports.getTheGraphEvmClient)(`${THE_GRAPH_ALCHEMY_URL.replace('$NETWORK', network)}`, options) : (0, exports.getTheGraphEvmClient)(`${THE_GRAPH_STUDIO_URL.replace('$NETWORK', network)}`, options);
};
exports.defaultGetTheGraphClient = defaultGetTheGraphClient; //# sourceMappingURL=client.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/info-retriever.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TheGraphInfoRetriever = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
/**
 * TheGraph info retriever for payments without conversion on EVMs
 */ class TheGraphInfoRetriever {
    constructor(client, currencyManager){
        this.client = client;
        this.currencyManager = currencyManager;
    }
    getTransferEvents(params) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (params.acceptedTokens && params.acceptedTokens.length > 1) {
                throw new Error('TheGraphInfoRetriever only supports no or 1 acceptedToken.');
            }
            const { payments, escrowEvents } = yield this.client.GetPaymentsAndEscrowState({
                blockFilter: (_a = this.client.options) === null || _a === void 0 ? void 0 : _a.blockFilter,
                reference: ethers_1.utils.keccak256(`0x${params.paymentReference}`),
                to: params.toAddress.toLowerCase(),
                tokenAddress: params.acceptedTokens ? params.acceptedTokens[0].toLowerCase() : null,
                contractAddress: params.contractAddress.toLowerCase()
            });
            return {
                paymentEvents: payments.map((payment)=>this.mapPaymentEvents(payment, params)),
                escrowEvents: escrowEvents.map((escrow)=>this.mapEscrowEvents(escrow, params))
            };
        });
    }
    // FIXME: this method should probably have the same filter as `getTransferEvents`.
    getReceivableEvents(params) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (params.acceptedTokens && params.acceptedTokens.length > 1) {
                throw new Error('TheGraphInfoRetriever only supports no or 1 acceptedToken.');
            }
            const { payments, escrowEvents } = yield this.client.GetPaymentsAndEscrowStateForReceivables({
                blockFilter: (_a = this.client.options) === null || _a === void 0 ? void 0 : _a.blockFilter,
                reference: ethers_1.utils.keccak256(`0x${params.paymentReference}`),
                tokenAddress: params.acceptedTokens ? params.acceptedTokens[0].toLowerCase() : null,
                contractAddress: params.contractAddress.toLowerCase()
            });
            return {
                paymentEvents: payments.map((payment)=>this.mapPaymentEvents(payment, params)),
                escrowEvents: escrowEvents.map((escrow)=>this.mapEscrowEvents(escrow, params))
            };
        });
    }
    mapPaymentEvents(payment, params) {
        let amount = payment.amount;
        let feeAmount = payment.feeAmount;
        if (payment.currency) {
            // account for the possibility the searched currency is of type ISO4217 and has no network
            const ccy = this.currencyManager.fromHash(payment.currency, params.paymentChain) || this.currencyManager.fromHash(payment.currency);
            if (!ccy) {
                throw new Error(`Currency with hash ${payment.currency} is unknown`);
            }
            amount = (0, utils_1.unpadAmountFromChainlink)(amount, ccy).toString();
            feeAmount = (0, utils_1.unpadAmountFromChainlink)(feeAmount, ccy).toString();
        }
        return {
            amount,
            name: params.eventName,
            timestamp: payment.timestamp,
            parameters: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
                feeAmount,
                block: payment.block,
                to: (0, utils_1.formatAddress)(payment.to, 'to')
            }, (0, utils_1.transformNonNull)(payment, 'txHash', String)), (0, utils_1.transformNonNull)(payment, 'gasUsed', String)), (0, utils_1.transformNonNull)(payment, 'gasPrice', String)), (0, utils_1.transformNonNull)(payment, 'amountInCrypto', String)), (0, utils_1.transformNonNull)(payment, 'feeAmountInCrypto', String)), (0, utils_1.transformNonNull)(payment, 'maxRateTimespan', String)), (0, utils_1.transformNonNull)(payment, 'from', utils_1.formatAddress)), (0, utils_1.transformNonNull)(payment, 'feeAddress', utils_1.formatAddress)), (0, utils_1.transformNonNull)(payment, 'tokenAddress', utils_1.formatAddress))
        };
    }
    mapEscrowEvents(escrow, params) {
        return {
            name: types_1.PaymentTypes.EVENTS_NAMES.ESCROW,
            timestamp: escrow.timestamp,
            parameters: {
                to: params.toAddress,
                from: escrow.from,
                txHash: escrow.txHash,
                block: escrow.block,
                eventName: escrow.eventName,
                gasUsed: escrow.gasUsed,
                gasPrice: escrow.gasPrice
            }
        };
    }
}
exports.TheGraphInfoRetriever = TheGraphInfoRetriever; //# sourceMappingURL=info-retriever.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/client.js [app-rsc] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/info-retriever.js [app-rsc] (ecmascript)"), exports); //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/retrievers/near-info-retriever.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NearInfoRetriever = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
/**
 * Gets a list of transfer events for a set of Near payment details
 * TheGraph-based etriever for ERC20 Fee Proxy and Native token payments.
 */ class NearInfoRetriever {
    /**
     * @param paymentReference The reference to identify the payment
     * @param toAddress Address to check
     * @param eventName Indicate if it is an address for payment or refund
     *
     */ constructor(client){
        this.client = client;
    }
    getTransferEvents(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const { paymentReference, toAddress, contractAddress, acceptedTokens } = params;
            if (acceptedTokens && acceptedTokens.length > 1) throw new Error(`NearInfoRetriever does not support multiple accepted tokens.`);
            const payments = (acceptedTokens === null || acceptedTokens === void 0 ? void 0 : acceptedTokens.length) === 1 ? yield this.client.GetFungibleTokenPayments({
                reference: paymentReference,
                to: toAddress,
                contractAddress,
                tokenAddress: acceptedTokens[0]
            }) : yield this.client.GetNearPayments({
                reference: paymentReference,
                to: toAddress,
                contractAddress
            });
            return {
                paymentEvents: payments.payments.map((p)=>this.mapPaymentEvent(p, params))
            };
        });
    }
    mapPaymentEvent(payment, params) {
        var _a;
        return {
            amount: payment.amount,
            name: params.eventName,
            timestamp: Number(payment.timestamp),
            parameters: {
                feeAmount: payment.feeAmount,
                receiptId: payment.receiptId,
                block: payment.block,
                to: params.toAddress,
                from: payment.from,
                feeAddress: (_a = payment.feeAddress) !== null && _a !== void 0 ? _a : undefined,
                tokenAddress: params.acceptedTokens ? params.acceptedTokens[0] : undefined
            }
        };
    }
}
exports.NearInfoRetriever = NearInfoRetriever; //# sourceMappingURL=near-info-retriever.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/native-token-detector.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NativeTokenPaymentDetector = void 0;
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const reference_based_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/reference-based-detector.js [app-rsc] (ecmascript)");
/**
 * Handle payment detection for native token payment
 */ class NativeTokenPaymentDetector extends reference_based_detector_1.ReferenceBasedDetector {
    constructor({ network, advancedLogic, currencyManager, getSubgraphClient }){
        const extensionId = types_1.ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN;
        const extension = advancedLogic.getNativeTokenExtensionForNetwork(network);
        if (!extension) {
            throw new Error(`the ${extensionId} extension is not supported for the network ${network}`);
        }
        super(extensionId, extension, currencyManager);
        this.getSubgraphClient = getSubgraphClient;
        this.network = network;
    }
}
exports.NativeTokenPaymentDetector = NativeTokenPaymentDetector; //# sourceMappingURL=native-token-detector.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/near-detector.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NearNativeTokenPaymentDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const near_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/retrievers/near-info-retriever.js [app-rsc] (ecmascript)");
const native_token_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/native-token-detector.js [app-rsc] (ecmascript)");
const balance_error_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/balance-error.js [app-rsc] (ecmascript)");
// the versions 0.1.0 and 0.2.0 have the same contracts
const CONTRACT_ADDRESS_MAP = {
    ['0.1.0']: '0.1.0',
    ['0.2.0']: '0.2.0'
};
/**
 * Handle payment detection for NEAR native token payment
 */ class NearNativeTokenPaymentDetector extends native_token_detector_1.NativeTokenPaymentDetector {
    constructor(args){
        super(args);
    }
    /**
     * Extracts the events for an address and a payment reference
     *
     * @param address Address to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param paymentReference The reference to identify the payment
     * @param paymentNetwork the payment network state
     * @returns The balance with events
     */ extractEvents(eventName, address, paymentReference, _requestCurrency, paymentChain, paymentNetwork) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (!address) {
                return {
                    paymentEvents: []
                };
            }
            const subgraphClient = this.getSubgraphClient(paymentChain);
            if (!subgraphClient) {
                throw new Error(`Could not find graphInfoRetriever for chain ${paymentChain} in payment detector`);
            }
            const infoRetriever = new near_info_retriever_1.NearInfoRetriever(subgraphClient);
            const { paymentEvents } = yield infoRetriever.getTransferEvents({
                paymentReference,
                toAddress: address,
                contractAddress: NearNativeTokenPaymentDetector.getContractName(paymentChain, paymentNetwork.version),
                eventName,
                paymentChain
            });
            return {
                paymentEvents
            };
        });
    }
}
exports.NearNativeTokenPaymentDetector = NearNativeTokenPaymentDetector;
NearNativeTokenPaymentDetector.getContractName = (chainName, paymentNetworkVersion = '0.2.0')=>{
    var _a;
    const version = NearNativeTokenPaymentDetector.getVersionOrThrow(paymentNetworkVersion);
    const versionMap = {
        aurora: {
            '0.1.0': 'requestnetwork.near',
            '0.2.0': 'requestnetwork.near'
        },
        near: {
            '0.1.0': 'requestnetwork.near',
            '0.2.0': 'requestnetwork.near'
        },
        'aurora-testnet': {
            '0.1.0': 'dev-1626339335241-5544297',
            '0.2.0': 'dev-1631521265288-35171138540673'
        },
        'near-testnet': {
            '0.1.0': 'dev-1626339335241-5544297',
            '0.2.0': 'dev-1631521265288-35171138540673'
        }
    };
    if ((_a = versionMap[chainName]) === null || _a === void 0 ? void 0 : _a[version]) {
        return versionMap[chainName][version];
    }
    throw new balance_error_1.NetworkNotSupported(`Unconfigured near-detector chain '${chainName}' and version '${version}'`);
};
NearNativeTokenPaymentDetector.getVersionOrThrow = (paymentNetworkVersion)=>{
    if (!CONTRACT_ADDRESS_MAP[paymentNetworkVersion]) {
        throw Error(`Near payment detection not implemented for version ${paymentNetworkVersion}`);
    }
    return CONTRACT_ADDRESS_MAP[paymentNetworkVersion];
}; //# sourceMappingURL=near-detector.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/retrievers/near-conversion-info-retriever.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NearConversionInfoRetriever = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const near_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/retrievers/near-info-retriever.js [app-rsc] (ecmascript)");
/**
 * Gets a list of transfer events for a set of Near payment details
 */ class NearConversionInfoRetriever extends near_info_retriever_1.NearInfoRetriever {
    /**
     * @param paymentReference The reference to identify the payment
     * @param toAddress Address to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param network The id of network we want to check
     */ constructor(client){
        super(client);
        this.client = client;
    }
    getTransferEvents(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const { requestCurrency, paymentReference, toAddress, contractAddress, eventName, maxRateTimespan } = params;
            const payments = yield this.client.GetAnyToNativePayments({
                reference: paymentReference,
                to: toAddress,
                currency: requestCurrency.symbol,
                maxRateTimespan: maxRateTimespan !== null && maxRateTimespan !== void 0 ? maxRateTimespan : 0,
                contractAddress: contractAddress
            });
            return {
                paymentEvents: payments.payments.map((p)=>{
                    var _a;
                    return {
                        amount: p.amount,
                        name: eventName,
                        parameters: {
                            block: p.block,
                            feeAddress: p.feeAddress || undefined,
                            feeAmount: p.feeAmount,
                            feeAmountInCrypto: p.feeAmountInCrypto || undefined,
                            amountInCrypto: p.amountInCrypto,
                            to: toAddress,
                            maxRateTimespan: (_a = p.maxRateTimespan) === null || _a === void 0 ? void 0 : _a.toString(),
                            from: p.from,
                            gasUsed: p.gasUsed,
                            gasPrice: p.gasPrice,
                            receiptId: p.receiptId,
                            currency: p.currency
                        },
                        timestamp: Number(p.timestamp)
                    };
                })
            };
        });
    }
}
exports.NearConversionInfoRetriever = NearConversionInfoRetriever; //# sourceMappingURL=near-conversion-info-retriever.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any-to-any-detector.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnyToAnyDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const fee_reference_based_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/fee-reference-based-detector.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
/**
 * Abstract class to extend to get the payment balance of conversion requests
 */ class AnyToAnyDetector extends fee_reference_based_detector_1.FeeReferenceBasedDetector {
    /**
     * @param extension The advanced logic payment network extension, with conversion
     */ constructor(paymentNetworkId, extension, currencyManager){
        super(paymentNetworkId, extension, currencyManager);
    }
    /**
     * Creates the extensions data for the creation of this extension.
     * Will set a salt if none is already given
     *
     * @param paymentNetworkCreationParameters Parameters to create the extension
     * @returns The extensionData object
     */ createExtensionsDataForCreation(paymentNetworkCreationParameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            // If no salt is given, generate one
            paymentNetworkCreationParameters.salt = paymentNetworkCreationParameters.salt || (yield (0, utils_1.generate8randomBytes)());
            return this.extension.createCreationAction(paymentNetworkCreationParameters);
        });
    }
}
exports.AnyToAnyDetector = AnyToAnyDetector; //# sourceMappingURL=any-to-any-detector.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any-to-native-detector.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnyToNativeDetector = void 0;
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const any_to_any_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any-to-any-detector.js [app-rsc] (ecmascript)");
/**
 * Handle payment detection for native token payment with conversion
 */ class AnyToNativeDetector extends any_to_any_detector_1.AnyToAnyDetector {
    constructor({ network, advancedLogic, currencyManager }){
        const extensionId = types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_NATIVE_TOKEN;
        const extension = advancedLogic.getAnyToNativeTokenExtensionForNetwork(network);
        if (!extension) {
            throw new Error(`the ${extensionId} extension is not supported for the network ${network}`);
        }
        super(extensionId, extension, currencyManager);
    }
}
exports.AnyToNativeDetector = AnyToNativeDetector; //# sourceMappingURL=any-to-native-detector.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/near-conversion-detector.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NearConversionNativeTokenPaymentDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-rsc] (ecmascript)");
const near_conversion_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/retrievers/near-conversion-info-retriever.js [app-rsc] (ecmascript)");
const any_to_native_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any-to-native-detector.js [app-rsc] (ecmascript)");
const balance_error_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/balance-error.js [app-rsc] (ecmascript)");
// the versions 0.1.0 and 0.2.0 have the same contracts
const CONTRACT_ADDRESS_MAP = {
    ['0.1.0']: '0.1.0'
};
/**
 * Handle payment detection for NEAR native token payment with conversion
 */ class NearConversionNativeTokenPaymentDetector extends any_to_native_detector_1.AnyToNativeDetector {
    constructor(args){
        super(args);
        this.getSubgraphClient = args.getSubgraphClient;
    }
    /**
     * Extracts the events for an address and a payment reference
     *
     * @param toAddress Address to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param requestCurrency The request currency
     * @param paymentReference The reference to identify the payment
     * @param paymentNetwork the payment network state
     * @returns The balance with events
     */ extractEvents(eventName, toAddress, paymentReference, requestCurrency, paymentChain, paymentNetwork) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (!toAddress) {
                return {
                    paymentEvents: []
                };
            }
            const currency = this.currencyManager.fromStorageCurrency(requestCurrency);
            if (!currency) {
                throw new currency_1.UnsupportedCurrencyError(requestCurrency.value);
            }
            const subgraphClient = this.getSubgraphClient(paymentChain);
            if (!subgraphClient) {
                throw new Error(`Error getting subgraph client for ${paymentChain}`);
            }
            const infoRetriever = new near_conversion_info_retriever_1.NearConversionInfoRetriever(subgraphClient);
            const transferEvents = yield infoRetriever.getTransferEvents({
                requestCurrency: currency,
                paymentReference,
                toAddress,
                contractAddress: NearConversionNativeTokenPaymentDetector.getContractName(paymentChain, paymentNetwork.version),
                eventName,
                paymentChain,
                maxRateTimespan: paymentNetwork.values.maxRateTimespan
            });
            return transferEvents;
        });
    }
    getPaymentChain(request) {
        const network = this.getPaymentExtension(request).values.network;
        if (!network) {
            throw Error(`request.extensions[${this.paymentNetworkId}].values.network must be defined`);
        }
        currency_1.NearChains.assertChainSupported(network);
        return network;
    }
}
exports.NearConversionNativeTokenPaymentDetector = NearConversionNativeTokenPaymentDetector;
NearConversionNativeTokenPaymentDetector.getContractName = (chainName, paymentNetworkVersion = '0.1.0')=>{
    var _a;
    const version = NearConversionNativeTokenPaymentDetector.getVersionOrThrow(paymentNetworkVersion);
    const versionMap = {
        aurora: {
            '0.1.0': 'native.conversion.reqnetwork.near'
        },
        near: {
            '0.1.0': 'native.conversion.reqnetwork.near'
        },
        'aurora-testnet': {
            '0.1.0': 'native.conversion.reqnetwork.testnet'
        },
        'near-testnet': {
            '0.1.0': 'native.conversion.reqnetwork.testnet'
        }
    };
    if ((_a = versionMap[chainName]) === null || _a === void 0 ? void 0 : _a[version]) {
        return versionMap[chainName][version];
    }
    throw new balance_error_1.NetworkNotSupported(`Unconfigured near-conversion-detector chain '${chainName}' and version '${version}'`);
};
NearConversionNativeTokenPaymentDetector.getVersionOrThrow = (paymentNetworkVersion)=>{
    if (!CONTRACT_ADDRESS_MAP[paymentNetworkVersion]) {
        throw Error(`Near payment detection not implemented for version ${paymentNetworkVersion}`);
    }
    return CONTRACT_ADDRESS_MAP[paymentNetworkVersion];
}; //# sourceMappingURL=near-conversion-detector.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NearInfoRetriever = exports.NearConversionInfoRetriever = exports.NearConversionNativeTokenPaymentDetector = exports.NearNativeTokenPaymentDetector = void 0;
var near_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/near-detector.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "NearNativeTokenPaymentDetector", {
    enumerable: true,
    get: function() {
        return near_detector_1.NearNativeTokenPaymentDetector;
    }
});
var near_conversion_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/near-conversion-detector.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "NearConversionNativeTokenPaymentDetector", {
    enumerable: true,
    get: function() {
        return near_conversion_detector_1.NearConversionNativeTokenPaymentDetector;
    }
});
var near_conversion_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/retrievers/near-conversion-info-retriever.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "NearConversionInfoRetriever", {
    enumerable: true,
    get: function() {
        return near_conversion_info_retriever_1.NearConversionInfoRetriever;
    }
});
var near_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/retrievers/near-info-retriever.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "NearInfoRetriever", {
    enumerable: true,
    get: function() {
        return near_info_retriever_1.NearInfoRetriever;
    }
}); //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/fee-proxy-contract.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ERC20FeeProxyPaymentDetector = exports.ERC20FeeProxyPaymentDetectorBase = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-rsc] (ecmascript)");
const proxy_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/proxy-info-retriever.js [app-rsc] (ecmascript)");
const currency_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/currency.js [app-rsc] (ecmascript)");
const fee_reference_based_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/fee-reference-based-detector.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const thegraph_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/index.js [app-rsc] (ecmascript)");
const near_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/index.js [app-rsc] (ecmascript)");
const balance_error_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/balance-error.js [app-rsc] (ecmascript)");
const PROXY_CONTRACT_ADDRESS_MAP = {
    ['0.1.0']: '0.1.0',
    ['0.2.0']: '0.2.0',
    ['NEAR-0.1.0']: 'near'
};
/**
 * Handle payment networks with ERC20 fee proxy contract extension, or derived
 */ class ERC20FeeProxyPaymentDetectorBase extends fee_reference_based_detector_1.FeeReferenceBasedDetector {
    /**
     * @param extension The advanced logic payment network extensions
     */ constructor(paymentNetworkId, extension, currencyManager){
        super(paymentNetworkId, extension, currencyManager);
    }
    getCurrency(storageCurrency) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const currency = this.currencyManager.fromStorageCurrency(storageCurrency);
            if (currency) {
                return currency;
            }
            if (storageCurrency.type !== types_1.RequestLogicTypes.CURRENCY.ERC20) {
                throw new Error(`Currency ${storageCurrency.value} not known`);
            }
            const contractCurrency = yield (0, currency_2.loadCurrencyFromContract)(storageCurrency);
            if (!contractCurrency) {
                throw new Error(`Cannot retrieve currency for contrat ${storageCurrency.value} (${storageCurrency.network})`);
            }
            return contractCurrency;
        });
    }
}
exports.ERC20FeeProxyPaymentDetectorBase = ERC20FeeProxyPaymentDetectorBase;
/*
 * Returns deployment information for the underlying smart contract for a given payment network version
 */ ERC20FeeProxyPaymentDetectorBase.getDeploymentInformation = (0, utils_1.makeGetDeploymentInformation)(smart_contracts_1.erc20FeeProxyArtifact, PROXY_CONTRACT_ADDRESS_MAP);
/**
 * Handle payment networks with ERC20 fee proxy contract extension on EVM (default) or Near chains
 */ class ERC20FeeProxyPaymentDetector extends ERC20FeeProxyPaymentDetectorBase {
    constructor({ advancedLogic, currencyManager, getSubgraphClient, network }){
        var _a;
        super(types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT, (_a = advancedLogic.getFeeProxyContractErc20ForNetwork(network)) !== null && _a !== void 0 ? _a : advancedLogic.extensions.feeProxyContractErc20, currencyManager);
        this.getSubgraphClient = getSubgraphClient;
        this.network = network;
    }
    /**
     * Extracts the payment events of a request
     */ extractEvents(eventName, toAddress, paymentReference, requestCurrency, paymentChain, paymentNetwork) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (this.network && !(0, currency_1.isSameChain)(paymentChain, this.network)) {
                throw new balance_error_1.NetworkNotSupported(`Unsupported network '${paymentChain}' for payment detector instanciated with '${this.network}'`);
            }
            if (!toAddress) {
                return Promise.resolve({
                    paymentEvents: []
                });
            }
            const { address: proxyContractAddress, creationBlockNumber: proxyCreationBlockNumber } = ERC20FeeProxyPaymentDetector.getDeploymentInformation(paymentChain, paymentNetwork.version);
            const subgraphClient = this.getSubgraphClient(paymentChain);
            if (subgraphClient) {
                const graphInfoRetriever = this.getTheGraphInfoRetriever(paymentChain, subgraphClient);
                return graphInfoRetriever.getTransferEvents({
                    eventName,
                    paymentReference,
                    toAddress,
                    contractAddress: proxyContractAddress,
                    paymentChain,
                    acceptedTokens: [
                        requestCurrency.value
                    ]
                });
            } else {
                if (!currency_1.EvmChains.isChainSupported(paymentChain)) {
                    throw new Error(`Could not get a TheGraph-based info retriever for chain ${paymentChain} and RPC-based info retrievers are only compatible with EVM chains.`);
                }
                const proxyInfoRetriever = new proxy_info_retriever_1.default(paymentReference, proxyContractAddress, proxyCreationBlockNumber, requestCurrency.value, toAddress, eventName, paymentChain);
                const paymentEvents = yield proxyInfoRetriever.getTransferEvents();
                return {
                    paymentEvents
                };
            }
        });
    }
    getTheGraphInfoRetriever(paymentChain, subgraphClient) {
        const graphInfoRetriever = currency_1.EvmChains.isChainSupported(paymentChain) ? new thegraph_1.TheGraphInfoRetriever(subgraphClient, this.currencyManager) : currency_1.NearChains.isChainSupported(paymentChain) && this.network ? new near_1.NearInfoRetriever(subgraphClient) : undefined;
        if (!graphInfoRetriever) {
            throw new Error(`Could not find graphInfoRetriever for chain ${paymentChain} in payment detector`);
        }
        return graphInfoRetriever;
    }
}
exports.ERC20FeeProxyPaymentDetector = ERC20FeeProxyPaymentDetector; //# sourceMappingURL=fee-proxy-contract.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/retrievers/any-to-any-proxy.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConversionInfoRetriever = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
/**
 * Retrieves a list of payment events from a payment reference, a destination address, a token address and a proxy contract
 */ class ConversionInfoRetriever {
    /**
     * @param requestCurrency The request currency
     * @param paymentReference The reference to identify the payment
     * @param conversionProxyContractAddress The address of the conversion proxy contract
     * @param conversionProxyCreationBlockNumber The block that created the conversion proxy contract
     * @param toAddress Address of the balance we want to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param network The Ethereum network to use
     */ constructor(requestCurrency, paymentReference, conversionProxyContractAddress, conversionProxyCreationBlockNumber, conversionProxyContractAbiFragment, toAddress, eventName, network, acceptedTokens, maxRateTimespan = 0){
        this.requestCurrency = requestCurrency;
        this.paymentReference = paymentReference;
        this.conversionProxyContractAddress = conversionProxyContractAddress;
        this.conversionProxyCreationBlockNumber = conversionProxyCreationBlockNumber;
        this.conversionProxyContractAbiFragment = conversionProxyContractAbiFragment;
        this.toAddress = toAddress;
        this.eventName = eventName;
        this.network = network;
        this.acceptedTokens = acceptedTokens;
        this.maxRateTimespan = maxRateTimespan;
        // Creates a local or default provider
        this.provider = (0, utils_2.getDefaultProvider)(this.network);
        // Setup the conversion proxy contract interface
        this.contractConversionProxy = new ethers_1.ethers.Contract(this.conversionProxyContractAddress, this.conversionProxyContractAbiFragment, this.provider);
        this.acceptedTokens = acceptedTokens === null || acceptedTokens === void 0 ? void 0 : acceptedTokens.map((token)=>token.toLowerCase());
    }
    /**
     * Retrieves transfer events from the payment proxy and conversion proxy.
     * Logs from both proxies are matched by transaction hash, as both proxies should
     * be called in one transaction.
     *
     * The conversion proxy's logs are used to compute the amounts in request currency (typically fiat).
     * The payment proxy's logs are used the same way as for a pn-fee-proxy request.
     */ getTransferEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            // Create a filter to find all the Fee Transfer logs with the payment reference
            const conversionFilter = this.contractConversionProxy.filters.TransferWithConversionAndReference(null, null, '0x' + this.paymentReference, null, null);
            conversionFilter.fromBlock = this.conversionProxyCreationBlockNumber;
            conversionFilter.toBlock = 'latest';
            // Get the conversion contract event logs
            const conversionLogs = yield this.provider.getLogs(conversionFilter);
            // Create a filter to find all the Fee Transfer logs with the payment reference
            const feeFilter = this.getFeeFilter();
            // Get the fee proxy contract event logs
            const feeProxyLogs = yield this.provider.getLogs(feeFilter);
            // Parses, filters and creates the events from the logs with the payment reference
            const eventPromises = conversionLogs// Parses the logs
            .map((log)=>{
                const parsedConversionLog = this.contractConversionProxy.interface.parseLog(log);
                const proxyLog = feeProxyLogs.find((l)=>l.transactionHash === log.transactionHash);
                if (!proxyLog) {
                    throw new Error('proxy log not found');
                }
                const parsedProxyLog = this.contractConversionProxy.interface.parseLog(proxyLog);
                return {
                    transactionHash: log.transactionHash,
                    blockNumber: log.blockNumber,
                    conversionLog: (0, utils_1.parseLogArgs)(parsedConversionLog),
                    proxyLog: (0, utils_1.parseLogArgs)(parsedProxyLog)
                };
            })// Keeps only the log with the right token and the right destination address
            // With ethers v5, the criteria below can be added to the conversionFilter (PROT-1234)
            .filter(({ conversionLog, proxyLog })=>// filter the token allowed
                (!this.acceptedTokens || !proxyLog.tokenAddress || this.acceptedTokens.includes(proxyLog.tokenAddress.toLowerCase())) && // check the rate timespan
                this.maxRateTimespan >= conversionLog.maxRateTimespan.toNumber() && // check the requestCurrency
                this.requestCurrency.hash.toLowerCase() === conversionLog.currency.toLowerCase() && // check to address
                proxyLog.to.toLowerCase() === this.toAddress.toLowerCase())// Creates the balance events
            .map(({ conversionLog, proxyLog, blockNumber, transactionHash })=>tslib_1.__awaiter(this, void 0, void 0, function*() {
                    const requestCurrency = this.requestCurrency;
                    const amount = (0, utils_1.unpadAmountFromChainlink)(conversionLog.amount, requestCurrency).toString();
                    const feeAmount = (0, utils_1.unpadAmountFromChainlink)(conversionLog.feeAmount, requestCurrency).toString();
                    return {
                        amount,
                        name: this.eventName,
                        parameters: {
                            block: blockNumber,
                            feeAddress: proxyLog.feeAddress || undefined,
                            feeAmount,
                            feeAmountInCrypto: proxyLog.feeAmount.toString() || undefined,
                            amountInCrypto: proxyLog.amount.toString(),
                            tokenAddress: proxyLog.tokenAddress,
                            to: this.toAddress,
                            txHash: transactionHash,
                            maxRateTimespan: conversionLog.maxRateTimespan.toString()
                        },
                        timestamp: (yield this.provider.getBlock(blockNumber || 0)).timestamp
                    };
                }));
            return Promise.all(eventPromises);
        });
    }
}
exports.ConversionInfoRetriever = ConversionInfoRetriever; //# sourceMappingURL=any-to-any-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/retrievers/any-to-erc20-proxy.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnyToErc20InfoRetriever = void 0;
const any_to_any_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/retrievers/any-to-any-proxy.js [app-rsc] (ecmascript)");
/**
 * Retrieves a list of payment events from a payment reference, a destination address and a proxy contract
 */ class AnyToErc20InfoRetriever extends any_to_any_proxy_1.ConversionInfoRetriever {
    getFeeFilter() {
        // Create a filter to find all the Fee Transfer logs with the payment reference
        const feeFilter = this.contractConversionProxy.filters.TransferWithReferenceAndFee(null, null, null, '0x' + this.paymentReference);
        feeFilter.fromBlock = this.conversionProxyCreationBlockNumber;
        feeFilter.toBlock = 'latest';
        return feeFilter;
    }
}
exports.AnyToErc20InfoRetriever = AnyToErc20InfoRetriever; //# sourceMappingURL=any-to-erc20-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/conversion-info-retriever.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TheGraphConversionInfoRetriever = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/info-retriever.js [app-rsc] (ecmascript)");
/**
 * TheGraph info retriever for conversion payments on EVMs, with no escrow support
 */ class TheGraphConversionInfoRetriever extends info_retriever_1.TheGraphInfoRetriever {
    constructor(client, currencyManager){
        super(client, currencyManager);
        this.client = client;
        this.currencyManager = currencyManager;
    }
    getTransferEvents(params) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const { payments } = params.acceptedTokens ? yield this.client.GetAnyToFungiblePayments({
                blockFilter: (_a = this.client.options) === null || _a === void 0 ? void 0 : _a.blockFilter,
                reference: ethers_1.utils.keccak256(`0x${params.paymentReference}`),
                to: params.toAddress.toLowerCase(),
                currency: params.requestCurrency.hash.toLowerCase(),
                acceptedTokens: params.acceptedTokens.map((t)=>t.toLowerCase()),
                contractAddress: params.contractAddress.toLowerCase()
            }) : yield this.client.GetAnyToNativePayments({
                blockFilter: (_b = this.client.options) === null || _b === void 0 ? void 0 : _b.blockFilter,
                reference: ethers_1.utils.keccak256(`0x${params.paymentReference}`),
                to: params.toAddress.toLowerCase(),
                currency: params.requestCurrency.hash.toLowerCase(),
                contractAddress: params.contractAddress.toLowerCase()
            });
            return {
                paymentEvents: payments.filter((payment)=>this.filterPaymentEvents(payment, params)).map((payment)=>this.mapPaymentEvents(payment, params)),
                escrowEvents: []
            };
        });
    }
    filterPaymentEvents(payment, params) {
        // FIXME: move maxRateTimespan filter to TheGraph when they support the OR operator
        return !(payment.maxRateTimespan !== undefined && payment.maxRateTimespan !== null && params.maxRateTimespan !== undefined && payment.maxRateTimespan < params.maxRateTimespan);
    }
}
exports.TheGraphConversionInfoRetriever = TheGraphConversionInfoRetriever; //# sourceMappingURL=conversion-info-retriever.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/any-to-erc20-proxy.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnyToERC20PaymentDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const fee_proxy_contract_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/fee-proxy-contract.js [app-rsc] (ecmascript)");
const any_to_erc20_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/retrievers/any-to-erc20-proxy.js [app-rsc] (ecmascript)");
const conversion_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/conversion-info-retriever.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-rsc] (ecmascript)");
const PROXY_CONTRACT_ADDRESS_MAP = {
    ['0.1.0']: '0.1.0'
};
/**
 * Handle payment networks with conversion proxy contract extension
 */ class AnyToERC20PaymentDetector extends fee_proxy_contract_1.ERC20FeeProxyPaymentDetectorBase {
    /**
     * @param extension The advanced logic payment network extensions
     */ constructor({ advancedLogic, currencyManager, getSubgraphClient }){
        super(types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY, advancedLogic.extensions.anyToErc20Proxy, currencyManager);
        this.getSubgraphClient = getSubgraphClient;
    }
    /**
     * Creates the extensions data for the creation of this extension.
     * Will set a salt if none is already given
     *
     * @param paymentNetworkCreationParameters Parameters to create the extension
     * @returns The extensionData object
     */ createExtensionsDataForCreation(paymentNetworkCreationParameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            // If no salt is given, generate one
            const salt = paymentNetworkCreationParameters.salt || (yield (0, utils_2.generate8randomBytes)());
            return this.extension.createCreationAction({
                feeAddress: paymentNetworkCreationParameters.feeAddress,
                feeAmount: paymentNetworkCreationParameters.feeAmount,
                paymentAddress: paymentNetworkCreationParameters.paymentAddress,
                refundAddress: paymentNetworkCreationParameters.refundAddress,
                network: paymentNetworkCreationParameters.network,
                acceptedTokens: paymentNetworkCreationParameters.acceptedTokens,
                maxRateTimespan: paymentNetworkCreationParameters.maxRateTimespan,
                salt
            });
        });
    }
    /**
     * Extracts the balance and events of a request
     *
     * @private
     * @param request Address to check
     * @param salt Payment reference salt
     * @param toAddress Payee address
     * @param eventName Indicate if it is an address for payment or refund
     * @param paymentNetwork Payment network state
     * @returns The balance and events
     */ extractEvents(eventName, toAddress, paymentReference, requestCurrency, paymentChain, paymentNetwork) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (!toAddress) {
                return {
                    paymentEvents: []
                };
            }
            const { acceptedTokens, maxRateTimespan = 0 } = paymentNetwork.values;
            const { address: conversionProxyContractAddress, creationBlockNumber: conversionProxyCreationBlockNumber } = AnyToERC20PaymentDetector.getDeploymentInformation(paymentChain, paymentNetwork.version);
            const conversionProxyAbi = smart_contracts_1.erc20ConversionProxy.getContractAbi(paymentNetwork.version);
            const currency = yield this.getCurrency(requestCurrency);
            const subgraphClient = this.getSubgraphClient(paymentChain);
            if (subgraphClient) {
                const infoRetriever = new conversion_info_retriever_1.TheGraphConversionInfoRetriever(subgraphClient, this.currencyManager);
                return yield infoRetriever.getTransferEvents({
                    paymentReference,
                    contractAddress: conversionProxyContractAddress,
                    toAddress,
                    eventName,
                    paymentChain,
                    acceptedTokens,
                    maxRateTimespan,
                    requestCurrency: currency
                });
            }
            const infoRetriever = new any_to_erc20_proxy_1.AnyToErc20InfoRetriever(currency, paymentReference, conversionProxyContractAddress, conversionProxyCreationBlockNumber, conversionProxyAbi, toAddress, eventName, paymentChain, acceptedTokens, maxRateTimespan);
            const paymentEvents = yield infoRetriever.getTransferEvents();
            return {
                paymentEvents
            };
        });
    }
    getPaymentChain(request) {
        const network = this.getPaymentExtension(request).values.network;
        if (!network) {
            throw Error(`request.extensions[${this.paymentNetworkId}].values.network must be defined`);
        }
        currency_1.EvmChains.assertChainSupported(network);
        return network;
    }
}
exports.AnyToERC20PaymentDetector = AnyToERC20PaymentDetector;
AnyToERC20PaymentDetector.getDeploymentInformation = (0, utils_1.makeGetDeploymentInformation)(smart_contracts_1.erc20ConversionProxy, PROXY_CONTRACT_ADDRESS_MAP); //# sourceMappingURL=any-to-erc20-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/retrievers/any-to-eth-proxy.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnyToEthInfoRetriever = void 0;
const any_to_any_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/retrievers/any-to-any-proxy.js [app-rsc] (ecmascript)");
/**
 * Retrieves a list of payment events from a payment reference, a destination address and a proxy contract
 */ class AnyToEthInfoRetriever extends any_to_any_proxy_1.ConversionInfoRetriever {
    getFeeFilter() {
        // Create a filter to find all the Fee Transfer logs with the payment reference
        const feeFilter = this.contractConversionProxy.filters.TransferWithReferenceAndFee(null, null, '0x' + this.paymentReference);
        feeFilter.fromBlock = this.conversionProxyCreationBlockNumber;
        feeFilter.toBlock = 'latest';
        return feeFilter;
    }
}
exports.AnyToEthInfoRetriever = AnyToEthInfoRetriever; //# sourceMappingURL=any-to-eth-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/any-to-eth-proxy.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnyToEthFeeProxyPaymentDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const SmartContracts = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-rsc] (ecmascript)");
const any_to_eth_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/retrievers/any-to-eth-proxy.js [app-rsc] (ecmascript)");
const any_to_any_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any-to-any-detector.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const conversion_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/conversion-info-retriever.js [app-rsc] (ecmascript)");
const PROXY_CONTRACT_ADDRESS_MAP = {
    ['0.1.0']: '0.1.0',
    ['0.2.0']: '0.2.0'
};
/**
 * Handle payment networks with ETH input data extension
 */ class AnyToEthFeeProxyPaymentDetector extends any_to_any_detector_1.AnyToAnyDetector {
    /**
     * @param extension The advanced logic payment network extensions
     */ constructor({ advancedLogic, currencyManager, getSubgraphClient }){
        super(types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY, advancedLogic.extensions.anyToEthProxy, currencyManager);
        this.getSubgraphClient = getSubgraphClient;
    }
    /**
     * Extracts payment events of an address matching an address and a payment reference
     *
     * @param toAddress Address to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param requestCurrency The request currency
     * @param paymentReference The reference to identify the payment
     * @param paymentNetwork the payment network
     * @returns The balance
     */ extractEvents(eventName, toAddress, paymentReference, requestCurrency, paymentChain, paymentNetwork) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (!toAddress) {
                return {
                    paymentEvents: []
                };
            }
            const contractInfo = AnyToEthFeeProxyPaymentDetector.getDeploymentInformation(paymentChain, paymentNetwork.version);
            const currency = this.currencyManager.fromStorageCurrency(requestCurrency);
            if (!currency) {
                throw new currency_1.UnsupportedCurrencyError(requestCurrency.value);
            }
            const subgraphClient = this.getSubgraphClient(paymentChain);
            if (subgraphClient) {
                const infoRetriever = new conversion_info_retriever_1.TheGraphConversionInfoRetriever(subgraphClient, this.currencyManager);
                return yield infoRetriever.getTransferEvents({
                    paymentReference,
                    contractAddress: contractInfo.address,
                    toAddress,
                    eventName,
                    paymentChain,
                    maxRateTimespan: (_a = paymentNetwork.values) === null || _a === void 0 ? void 0 : _a.maxRateTimespan,
                    requestCurrency: currency
                });
            }
            const abi = SmartContracts.ethConversionArtifact.getContractAbi(contractInfo.contractVersion);
            const infoRetriever = new any_to_eth_proxy_1.AnyToEthInfoRetriever(currency, paymentReference, contractInfo.address, contractInfo.creationBlockNumber, abi, toAddress, eventName, paymentChain, undefined, (_b = paymentNetwork.values) === null || _b === void 0 ? void 0 : _b.maxRateTimespan);
            const paymentEvents = yield infoRetriever.getTransferEvents();
            return {
                paymentEvents
            };
        });
    }
    /**
     * Get the network of the payment
     *
     * @param requestCurrency The request currency
     * @param paymentNetwork the payment network
     * @returns The network of payment
     */ getPaymentChain(request) {
        const network = this.getPaymentExtension(request).values.network;
        if (!network) {
            throw Error(`request.extensions[${this.paymentNetworkId}].values.network must be defined`);
        }
        currency_1.EvmChains.assertChainSupported(network);
        return network;
    }
}
exports.AnyToEthFeeProxyPaymentDetector = AnyToEthFeeProxyPaymentDetector;
/*
 * Returns deployment information for the underlying smart contract for a given payment network version
 */ AnyToEthFeeProxyPaymentDetector.getDeploymentInformation = (0, utils_1.makeGetDeploymentInformation)(SmartContracts.ethConversionArtifact, PROXY_CONTRACT_ADDRESS_MAP); //# sourceMappingURL=any-to-eth-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnyToEthFeeProxyPaymentDetector = exports.AnyToERC20PaymentDetector = void 0;
var any_to_erc20_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/any-to-erc20-proxy.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "AnyToERC20PaymentDetector", {
    enumerable: true,
    get: function() {
        return any_to_erc20_proxy_1.AnyToERC20PaymentDetector;
    }
});
var any_to_eth_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/any-to-eth-proxy.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "AnyToEthFeeProxyPaymentDetector", {
    enumerable: true,
    get: function() {
        return any_to_eth_proxy_1.AnyToEthFeeProxyPaymentDetector;
    }
}); //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/meta-payment-detector.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MetaDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
const any_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/index.js [app-rsc] (ecmascript)");
const declarative_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/declarative.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const supportedPns = [
    types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE,
    types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY,
    types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY
];
const detectorMap = {
    [types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE]: declarative_1.DeclarativePaymentDetector,
    [types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY]: any_1.AnyToERC20PaymentDetector,
    [types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY]: any_1.AnyToEthFeeProxyPaymentDetector
};
const advancedLogicMap = {
    [types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE]: 'declarative',
    [types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY]: 'anyToErc20Proxy',
    [types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY]: 'anyToEthProxy'
};
/**
 * Detect payment for the meta payment network.
 * Recursively detects payments on each sub payment network.
 * For each sub payment network we check for payments with the paymentReference associated to the sub payment network.
 */ class MetaDetector extends declarative_1.DeclarativePaymentDetectorBase {
    constructor({ advancedLogic, currencyManager, options }){
        super(types_1.ExtensionTypes.PAYMENT_NETWORK_ID.META, advancedLogic.extensions.metaPn);
        this.options = options || {};
        this.currencyManager = currencyManager;
        this.advancedLogic = advancedLogic;
    }
    /**
     * Creates the extensions data for the creation of this extension.
     *
     * @param paymentNetworkCreationParameters Parameters to create the extension
     * @returns The extensionData object
     */ createExtensionsDataForCreation(paymentNetworkCreationParameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            // Do the same for each sub-extension
            for (const [key, value] of Object.entries(paymentNetworkCreationParameters)){
                if (supportedPns.includes(key)) {
                    const detectorClass = detectorMap[key];
                    const extensionKey = advancedLogicMap[key];
                    const extension = this.advancedLogic.extensions[extensionKey];
                    if (!detectorClass || !extension) {
                        throw new Error(`The payment network id: ${key} is not supported for meta-pn detection`);
                    }
                    const detector = new detectorClass(Object.assign({
                        advancedLogic: this.advancedLogic,
                        paymentNetworkId: key,
                        extension,
                        currencyManager: this.currencyManager
                    }, this.options));
                    for(let index = 0; index < value.length; index++){
                        paymentNetworkCreationParameters[key][index] = (yield detector.createExtensionsDataForCreation(value[index])).parameters;
                    }
                }
            }
            return this.extension.createCreationAction(Object.assign({}, paymentNetworkCreationParameters));
        });
    }
    /**
     * Creates the extensions data to apply an action on a sub pn
     *
     * @param Parameters to apply an action on a sub pn
     * @returns The extensionData object
     */ createExtensionsDataForApplyActionOnPn(parameters) {
        return this.extension.createApplyActionToPn({
            pnIdentifier: parameters.pnIdentifier,
            action: parameters.action,
            parameters: parameters.parameters
        });
    }
    /**
     * To retrieve all events, iterate over the sub payment networks and aggregate their balances
     */ getEvents(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const paymentExtension = this.getPaymentExtension(request);
            const events = [];
            const feeBalances = [];
            for (const value of Object.values(paymentExtension.values)){
                if (!!value && value.type === types_1.ExtensionTypes.TYPE.PAYMENT_NETWORK && supportedPns.includes(value.id)) {
                    const detectorClass = detectorMap[value.id];
                    const extensionKey = advancedLogicMap[value.id];
                    const extension = this.advancedLogic.extensions[extensionKey];
                    if (!detectorClass || !extension) {
                        throw new Error(`The payment network id: ${value.id} is not supported for meta-pn detection`);
                    }
                    const detector = new detectorClass(Object.assign({
                        advancedLogic: this.advancedLogic,
                        paymentNetworkId: value.id,
                        extension,
                        currencyManager: this.currencyManager
                    }, this.options));
                    const partialRequest = (0, utils_1.deepCopy)(request);
                    partialRequest.extensions = {
                        [value.id]: value
                    };
                    partialRequest.extensionsData = [
                        value
                    ];
                    events.push((yield detector.getBalance(partialRequest)));
                    const feeBalance = partialRequest.extensions[value.id].values.feeBalance;
                    if (feeBalance) {
                        feeBalances.push(feeBalance);
                    }
                }
            }
            const declaredEvents = this.getDeclarativeEvents(request);
            const allPaymentEvents = [
                ...declaredEvents,
                ...events.map((event)=>event.events).flat()
            ];
            // FIXME: should be at the same level as balance
            const values = this.getPaymentExtension(request).values;
            values.feeBalance = {
                events: feeBalances.map((event)=>event.events).flat(),
                balance: feeBalances.reduce((sum, curr)=>sum.add(curr.balance || '0'), ethers_1.BigNumber.from(0)).toString()
            };
            return {
                paymentEvents: allPaymentEvents
            };
        });
    }
}
exports.MetaDetector = MetaDetector; //# sourceMappingURL=meta-payment-detector.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/address-based-info-retriever.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
// The ERC20 smart contract ABI fragment containing decimals property and Transfer event
const erc20BalanceOfAbiFragment = [
    // decimals property
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                name: '',
                type: 'uint8'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    // Transfer events
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'from',
                type: 'address'
            },
            {
                indexed: true,
                name: 'to',
                type: 'address'
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'Transfer',
        type: 'event'
    }
];
/**
 * Retrieves a list of transfer events for an address
 */ class ERC20InfoRetriever {
    /**
     * @param tokenContractAddress The address of the ERC20 contract
     * @param toAddress Address of the balance we want to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param network The Ethereum network to use
     */ constructor(tokenContractAddress, toAddress, eventName, network){
        this.tokenContractAddress = tokenContractAddress;
        this.toAddress = toAddress;
        this.eventName = eventName;
        this.network = network;
    }
    /**
     * Retrieves transfer events for the current contract, address and network.
     */ getTransferEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            // Creates a local or default provider
            const provider = (0, utils_1.getDefaultProvider)(this.network);
            // Set up the ERC20 contract interface
            const contract = new ethers_1.ethers.Contract(this.tokenContractAddress, erc20BalanceOfAbiFragment, provider);
            // Create a filter to find all the Transfer logs for the toAddress
            console.warn('It is not recommended to use the ERC20InfoRetriever to retrieve ' + 'all Transfer events from block "0" to block "latest", ' + 'as this operation is not supported by most RPC providers');
            const filter = contract.filters.Transfer(null, this.toAddress);
            filter.fromBlock = 0;
            filter.toBlock = 'latest';
            // Get the event logs
            const logs = yield provider.getLogs(filter);
            // Clean up the Transfer logs data
            const eventPromises = logs.map((log)=>tslib_1.__awaiter(this, void 0, void 0, function*() {
                    if (!log.blockNumber) {
                        throw new Error('Block number not found');
                    }
                    const block = yield provider.getBlock(log.blockNumber);
                    const parsedLog = contract.interface.parseLog(log);
                    return {
                        amount: parsedLog.args.value.toString(),
                        name: this.eventName,
                        parameters: {
                            block: block.number,
                            from: parsedLog.args.from,
                            to: parsedLog.args.to,
                            txHash: log.transactionHash
                        },
                        timestamp: block.timestamp
                    };
                }));
            return Promise.all(eventPromises);
        });
    }
}
exports.default = ERC20InfoRetriever; //# sourceMappingURL=address-based-info-retriever.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/address-based.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ERC20AddressBasedPaymentDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const address_based_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/address-based-info-retriever.js [app-rsc] (ecmascript)");
const payment_detector_base_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/payment-detector-base.js [app-rsc] (ecmascript)");
/**
 * Handle payment networks with ERC20 based address extension
 */ class ERC20AddressBasedPaymentDetector extends payment_detector_base_1.PaymentDetectorBase {
    /**
     * @param extension The advanced logic payment network extensions
     */ constructor({ advancedLogic }){
        super(types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_ADDRESS_BASED, advancedLogic.extensions.addressBasedErc20);
    }
    /**
     * Creates the extensions data for the creation of this extension
     *
     * @param paymentNetworkCreationParameters Parameters to create the extension
     * @returns The extensionData object
     */ createExtensionsDataForCreation(paymentNetworkCreationParameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            return this.extension.createCreationAction({
                paymentAddress: paymentNetworkCreationParameters.paymentAddress,
                refundAddress: paymentNetworkCreationParameters.refundAddress
            });
        });
    }
    /**
     * Creates the extensions data to add payment address
     *
     * @param parameters to add payment information
     * @returns The extensionData object
     */ createExtensionsDataForAddPaymentInformation(parameters) {
        return this.extension.createAddPaymentAddressAction({
            paymentAddress: parameters.paymentAddress
        });
    }
    /**
     * Creates the extensions data to add refund address
     *
     * @param Parameters to add refund information
     * @returns The extensionData object
     */ createExtensionsDataForAddRefundInformation(parameters) {
        return this.extension.createAddRefundAddressAction({
            refundAddress: parameters.refundAddress
        });
    }
    /**
     * Gets the balance and the payment/refund events
     *
     * @param request the request to check
     * @returns the balance and the payment/refund events
     */ getEvents(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (!request.currency.network) {
                request.currency.network = 'mainnet';
            }
            const { paymentAddress, refundAddress } = this.getPaymentExtension(request).values;
            this.checkRequiredParameter(paymentAddress, 'paymentAddress');
            const paymentEvents = yield this.extractTransferEvents(paymentAddress, types_1.PaymentTypes.EVENTS_NAMES.PAYMENT, request.currency.network, request.currency.value);
            const refundEvents = yield this.extractTransferEvents(refundAddress, types_1.PaymentTypes.EVENTS_NAMES.REFUND, request.currency.network, request.currency.value);
            const allPaymentEvents = [
                ...paymentEvents,
                ...refundEvents
            ];
            return {
                paymentEvents: allPaymentEvents
            };
        });
    }
    /**
     * Extracts the balance and events of an address
     *
     * @private
     * @param address Address to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param network The id of network we want to check
     * @param tokenContractAddress the address of the token contract
     * @returns The balance
     */ extractTransferEvents(address, eventName, network, tokenContractAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (!address) {
                return [];
            }
            const infoRetriever = new address_based_info_retriever_1.default(tokenContractAddress, address, eventName, network);
            return infoRetriever.getTransferEvents();
        });
    }
}
exports.ERC20AddressBasedPaymentDetector = ERC20AddressBasedPaymentDetector; //# sourceMappingURL=address-based.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/proxy-contract.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ERC20ProxyPaymentDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-rsc] (ecmascript)");
const proxy_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/proxy-info-retriever.js [app-rsc] (ecmascript)");
const thegraph_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const reference_based_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/reference-based-detector.js [app-rsc] (ecmascript)");
const PROXY_CONTRACT_ADDRESS_MAP = {
    ['0.1.0']: '0.1.0'
};
/**
 * Handle payment networks with ERC20 proxy contract extension
 */ class ERC20ProxyPaymentDetector extends reference_based_detector_1.ReferenceBasedDetector {
    /**
     * @param extension The advanced logic payment network extensions
     */ constructor({ advancedLogic, currencyManager, getSubgraphClient }){
        super(types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT, advancedLogic.extensions.proxyContractErc20, currencyManager);
        this.getSubgraphClient = getSubgraphClient;
    }
    /**
     * Extracts the balance and events of an address
     *
     * @private
     * @param address Address to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param network The id of network we want to check
     * @param tokenContractAddress the address of the token contract
     * @returns The balance and events
     */ extractEvents(eventName, toAddress, paymentReference, requestCurrency, paymentChain, paymentNetwork) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (!toAddress) {
                return {
                    paymentEvents: []
                };
            }
            const { address: proxyContractAddress, creationBlockNumber: proxyCreationBlockNumber } = ERC20ProxyPaymentDetector.getDeploymentInformation(paymentChain, paymentNetwork.version);
            const subgraphClient = this.getSubgraphClient(paymentChain);
            if (subgraphClient) {
                const graphInfoRetriever = new thegraph_1.TheGraphInfoRetriever(subgraphClient, this.currencyManager);
                return graphInfoRetriever.getTransferEvents({
                    paymentReference,
                    toAddress,
                    eventName,
                    contractAddress: proxyContractAddress,
                    paymentChain
                });
            } else {
                const proxyInfoRetriever = new proxy_info_retriever_1.default(paymentReference, proxyContractAddress, proxyCreationBlockNumber, requestCurrency.value, toAddress, eventName, paymentChain);
                const paymentEvents = yield proxyInfoRetriever.getTransferEvents();
                return {
                    paymentEvents
                };
            }
        });
    }
}
exports.ERC20ProxyPaymentDetector = ERC20ProxyPaymentDetector;
/*
 * Returns deployment information for the underlying smart contract for a given payment network version
 */ ERC20ProxyPaymentDetector.getDeploymentInformation = (0, utils_1.makeGetDeploymentInformation)(smart_contracts_1.erc20ProxyArtifact, PROXY_CONTRACT_ADDRESS_MAP); //# sourceMappingURL=proxy-contract.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/transferable-receivable.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ERC20TransferableReceivablePaymentDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const thegraph_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/index.js [app-rsc] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const fee_reference_based_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/fee-reference-based-detector.js [app-rsc] (ecmascript)");
const proxy_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/proxy-info-retriever.js [app-rsc] (ecmascript)");
const ERC20_TRANSFERABLE_RECEIVABLE_CONTRACT_ADDRESS_MAP = {
    ['0.1.0']: '0.1.0',
    ['0.2.0']: '0.2.0'
};
/**
 * Handle payment networks with ERC20 transferable receivable contract extension
 */ class ERC20TransferableReceivablePaymentDetector extends fee_reference_based_detector_1.FeeReferenceBasedDetector {
    /**
     * @param extension The advanced logic payment network extensions
     */ constructor({ advancedLogic, currencyManager, getSubgraphClient }){
        super(types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE, advancedLogic.extensions.erc20TransferableReceivable, currencyManager);
        this.getSubgraphClient = getSubgraphClient;
    }
    /**
     * Extracts the balance and events of an address
     *
     * @private
     * @param address Address to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param network The id of network we want to check
     * @param tokenContractAddress the address of the token contract
     * @returns The balance and events
     */ extractEvents(eventName, toAddress, paymentReference, requestCurrency, paymentChain, paymentNetwork) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            // To satisfy typescript
            toAddress;
            if (!paymentReference) {
                return {
                    paymentEvents: []
                };
            }
            const { address: receivableContractAddress, creationBlockNumber: receivableCreationBlockNumber } = ERC20TransferableReceivablePaymentDetector.getDeploymentInformation(paymentChain, paymentNetwork.version);
            const subgraphClient = this.getSubgraphClient(paymentChain);
            if (subgraphClient) {
                const graphInfoRetriever = new thegraph_1.TheGraphInfoRetriever(subgraphClient, this.currencyManager);
                return graphInfoRetriever.getReceivableEvents({
                    paymentReference,
                    toAddress: '',
                    contractAddress: receivableContractAddress,
                    paymentChain,
                    eventName,
                    acceptedTokens: [
                        requestCurrency.value
                    ]
                });
            } else {
                const transferableReceivableInfoRetriever = new proxy_info_retriever_1.default(paymentReference, receivableContractAddress, receivableCreationBlockNumber, requestCurrency.value, '', eventName, paymentChain);
                const paymentEvents = yield transferableReceivableInfoRetriever.getTransferEvents(true);
                return {
                    paymentEvents
                };
            }
        });
    }
}
exports.ERC20TransferableReceivablePaymentDetector = ERC20TransferableReceivablePaymentDetector;
/*
 * Returns deployment information for the underlying smart contract for a given payment network version
 */ ERC20TransferableReceivablePaymentDetector.getDeploymentInformation = (0, utils_1.makeGetDeploymentInformation)(smart_contracts_1.erc20TransferableReceivableArtifact, ERC20_TRANSFERABLE_RECEIVABLE_CONTRACT_ADDRESS_MAP); //# sourceMappingURL=transferable-receivable.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ERC20TransferableReceivablePaymentDetector = exports.ERC20ProxyPaymentDetector = exports.ERC20FeeProxyPaymentDetector = exports.ERC20AddressBasedPaymentDetector = void 0;
var address_based_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/address-based.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "ERC20AddressBasedPaymentDetector", {
    enumerable: true,
    get: function() {
        return address_based_1.ERC20AddressBasedPaymentDetector;
    }
});
var fee_proxy_contract_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/fee-proxy-contract.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "ERC20FeeProxyPaymentDetector", {
    enumerable: true,
    get: function() {
        return fee_proxy_contract_1.ERC20FeeProxyPaymentDetector;
    }
});
var proxy_contract_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/proxy-contract.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "ERC20ProxyPaymentDetector", {
    enumerable: true,
    get: function() {
        return proxy_contract_1.ERC20ProxyPaymentDetector;
    }
});
var transferable_receivable_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/transferable-receivable.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "ERC20TransferableReceivablePaymentDetector", {
    enumerable: true,
    get: function() {
        return transferable_receivable_1.ERC20TransferableReceivablePaymentDetector;
    }
}); //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/generated/graphql-superfluid.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SfMeta_OrderBy = exports.RoleRevokedEvent_OrderBy = exports.RoleGrantedEvent_OrderBy = exports.RoleAdminChangedEvent_OrderBy = exports.RewardAddressChangedEvent_OrderBy = exports.ResolverEntry_OrderBy = exports.Pool_OrderBy = exports.PoolMember_OrderBy = exports.PoolDistributor_OrderBy = exports.PoolCreatedEvent_OrderBy = exports.PoolConnectionUpdatedEvent_OrderBy = exports.PppConfigurationChangedEvent_OrderBy = exports.OrderDirection = exports.NewPicEvent_OrderBy = exports.MintedEvent_OrderBy = exports.MemberUnitsUpdatedEvent_OrderBy = exports.JailEvent_OrderBy = exports.InstantDistributionUpdatedEvent_OrderBy = exports.Index_OrderBy = exports.IndexUpdatedEvent_OrderBy = exports.IndexUnsubscribedEvent_OrderBy = exports.IndexUnitsUpdatedEvent_OrderBy = exports.IndexSubscription_OrderBy = exports.IndexSubscribedEvent_OrderBy = exports.IndexDistributionClaimedEvent_OrderBy = exports.IndexCreatedEvent_OrderBy = exports.GovernanceReplacedEvent_OrderBy = exports.FlowUpdatedEvent_OrderBy = exports.FlowOperator_OrderBy = exports.FlowOperatorUpdatedEvent_OrderBy = exports.FlowDistributionUpdatedEvent_OrderBy = exports.ExitRateChangedEvent_OrderBy = exports.Event_OrderBy = exports.DistributionClaimedEvent_OrderBy = exports.CustomSuperTokenCreatedEvent_OrderBy = exports.ConfigChangedEvent_OrderBy = exports.CfAv1LiquidationPeriodChangedEvent_OrderBy = exports.BurnedEvent_OrderBy = exports.BufferAdjustedEvent_OrderBy = exports.BondIncreasedEvent_OrderBy = exports.ApprovalEvent_OrderBy = exports.AppRegisteredEvent_OrderBy = exports.AgreementLiquidatedV2Event_OrderBy = exports.AgreementLiquidatedByEvent_OrderBy = exports.AgreementClassUpdatedEvent_OrderBy = exports.AgreementClassRegisteredEvent_OrderBy = exports.Aggregation_Interval = exports.Account_OrderBy = exports.AccountTokenSnapshot_OrderBy = exports.AccountTokenSnapshotLog_OrderBy = void 0;
exports.GetSuperFluidEvents = exports.PaymentFragment = exports.EventFragment = exports.getSdk = exports.GetSuperFluidEventsDocument = exports.PaymentFragmentFragmentDoc = exports.EventFragmentFragmentDoc = exports._SubgraphErrorPolicy_ = exports.TrustedForwarderChangedEvent_OrderBy = exports.TransferEvent_OrderBy = exports.Token_OrderBy = exports.TokenUpgradedEvent_OrderBy = exports.TokenStatistic_OrderBy = exports.TokenStatisticLog_OrderBy = exports.TokenGovernanceConfig_OrderBy = exports.TokenDowngradedEvent_OrderBy = exports.SuperTokenMinimumDepositChangedEvent_OrderBy = exports.SuperTokenLogicUpdatedEvent_OrderBy = exports.SuperTokenLogicCreatedEvent_OrderBy = exports.SuperTokenFactoryUpdatedEvent_OrderBy = exports.SuperTokenCreatedEvent_OrderBy = exports.SubscriptionUnitsUpdatedEvent_OrderBy = exports.SubscriptionRevokedEvent_OrderBy = exports.SubscriptionDistributionClaimedEvent_OrderBy = exports.SubscriptionApprovedEvent_OrderBy = exports.Stream_OrderBy = exports.StreamRevision_OrderBy = exports.StreamPeriod_OrderBy = exports.SetEvent_OrderBy = exports.SentEvent_OrderBy = void 0;
const graphql_tag_1 = __turbopack_require__("[project]/node_modules/.pnpm/graphql-tag@2.12.6_graphql@16.8.1/node_modules/graphql-tag/lib/index.js [app-rsc] (ecmascript)");
var AccountTokenSnapshotLog_OrderBy;
(function(AccountTokenSnapshotLog_OrderBy) {
    AccountTokenSnapshotLog_OrderBy["Account"] = "account";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot"] = "accountTokenSnapshot";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__activeCFAOutgoingStreamCount"] = "accountTokenSnapshot__activeCFAOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__activeGDAOutgoingStreamCount"] = "accountTokenSnapshot__activeGDAOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__activeIncomingStreamCount"] = "accountTokenSnapshot__activeIncomingStreamCount";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__activeOutgoingStreamCount"] = "accountTokenSnapshot__activeOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__adminOfPoolCount"] = "accountTokenSnapshot__adminOfPoolCount";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__balanceLastUpdatedFromRpcBlocknumber"] = "accountTokenSnapshot__balanceLastUpdatedFromRpcBlocknumber";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__balanceUntilUpdatedAt"] = "accountTokenSnapshot__balanceUntilUpdatedAt";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__createdAtBlockNumber"] = "accountTokenSnapshot__createdAtBlockNumber";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__createdAtTimestamp"] = "accountTokenSnapshot__createdAtTimestamp";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__id"] = "accountTokenSnapshot__id";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__inactiveCFAOutgoingStreamCount"] = "accountTokenSnapshot__inactiveCFAOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__inactiveGDAOutgoingStreamCount"] = "accountTokenSnapshot__inactiveGDAOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__inactiveIncomingStreamCount"] = "accountTokenSnapshot__inactiveIncomingStreamCount";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__inactiveOutgoingStreamCount"] = "accountTokenSnapshot__inactiveOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__isLiquidationEstimateOptimistic"] = "accountTokenSnapshot__isLiquidationEstimateOptimistic";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__maybeCriticalAtTimestamp"] = "accountTokenSnapshot__maybeCriticalAtTimestamp";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalAmountStreamedInUntilUpdatedAt"] = "accountTokenSnapshot__totalAmountStreamedInUntilUpdatedAt";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalAmountStreamedOutUntilUpdatedAt"] = "accountTokenSnapshot__totalAmountStreamedOutUntilUpdatedAt";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalAmountStreamedUntilUpdatedAt"] = "accountTokenSnapshot__totalAmountStreamedUntilUpdatedAt";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalAmountTransferredUntilUpdatedAt"] = "accountTokenSnapshot__totalAmountTransferredUntilUpdatedAt";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalApprovedSubscriptions"] = "accountTokenSnapshot__totalApprovedSubscriptions";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalCFAAmountStreamedOutUntilUpdatedAt"] = "accountTokenSnapshot__totalCFAAmountStreamedOutUntilUpdatedAt";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalCFAAmountStreamedUntilUpdatedAt"] = "accountTokenSnapshot__totalCFAAmountStreamedUntilUpdatedAt";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalCFADeposit"] = "accountTokenSnapshot__totalCFADeposit";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalCFANetFlowRate"] = "accountTokenSnapshot__totalCFANetFlowRate";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalCFANumberOfActiveStreams"] = "accountTokenSnapshot__totalCFANumberOfActiveStreams";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalCFANumberOfClosedStreams"] = "accountTokenSnapshot__totalCFANumberOfClosedStreams";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalCFAOutflowRate"] = "accountTokenSnapshot__totalCFAOutflowRate";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalConnectedMemberships"] = "accountTokenSnapshot__totalConnectedMemberships";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalDeposit"] = "accountTokenSnapshot__totalDeposit";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalGDADeposit"] = "accountTokenSnapshot__totalGDADeposit";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalGDANumberOfActiveStreams"] = "accountTokenSnapshot__totalGDANumberOfActiveStreams";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalGDANumberOfClosedStreams"] = "accountTokenSnapshot__totalGDANumberOfClosedStreams";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalGDAOutflowRate"] = "accountTokenSnapshot__totalGDAOutflowRate";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalInflowRate"] = "accountTokenSnapshot__totalInflowRate";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalMembershipsWithUnits"] = "accountTokenSnapshot__totalMembershipsWithUnits";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalNetFlowRate"] = "accountTokenSnapshot__totalNetFlowRate";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalNumberOfActiveStreams"] = "accountTokenSnapshot__totalNumberOfActiveStreams";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalNumberOfClosedStreams"] = "accountTokenSnapshot__totalNumberOfClosedStreams";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalOutflowRate"] = "accountTokenSnapshot__totalOutflowRate";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__totalSubscriptionsWithUnits"] = "accountTokenSnapshot__totalSubscriptionsWithUnits";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__updatedAtBlockNumber"] = "accountTokenSnapshot__updatedAtBlockNumber";
    AccountTokenSnapshotLog_OrderBy["AccountTokenSnapshot__updatedAtTimestamp"] = "accountTokenSnapshot__updatedAtTimestamp";
    AccountTokenSnapshotLog_OrderBy["Account__createdAtBlockNumber"] = "account__createdAtBlockNumber";
    AccountTokenSnapshotLog_OrderBy["Account__createdAtTimestamp"] = "account__createdAtTimestamp";
    AccountTokenSnapshotLog_OrderBy["Account__id"] = "account__id";
    AccountTokenSnapshotLog_OrderBy["Account__isSuperApp"] = "account__isSuperApp";
    AccountTokenSnapshotLog_OrderBy["Account__updatedAtBlockNumber"] = "account__updatedAtBlockNumber";
    AccountTokenSnapshotLog_OrderBy["Account__updatedAtTimestamp"] = "account__updatedAtTimestamp";
    AccountTokenSnapshotLog_OrderBy["ActiveCFAOutgoingStreamCount"] = "activeCFAOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["ActiveGDAOutgoingStreamCount"] = "activeGDAOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["ActiveIncomingStreamCount"] = "activeIncomingStreamCount";
    AccountTokenSnapshotLog_OrderBy["ActiveOutgoingStreamCount"] = "activeOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["Balance"] = "balance";
    AccountTokenSnapshotLog_OrderBy["BlockNumber"] = "blockNumber";
    AccountTokenSnapshotLog_OrderBy["Id"] = "id";
    AccountTokenSnapshotLog_OrderBy["InactiveCFAOutgoingStreamCount"] = "inactiveCFAOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["InactiveGDAOutgoingStreamCount"] = "inactiveGDAOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["InactiveIncomingStreamCount"] = "inactiveIncomingStreamCount";
    AccountTokenSnapshotLog_OrderBy["InactiveOutgoingStreamCount"] = "inactiveOutgoingStreamCount";
    AccountTokenSnapshotLog_OrderBy["LogIndex"] = "logIndex";
    AccountTokenSnapshotLog_OrderBy["MaybeCriticalAtTimestamp"] = "maybeCriticalAtTimestamp";
    AccountTokenSnapshotLog_OrderBy["Order"] = "order";
    AccountTokenSnapshotLog_OrderBy["Timestamp"] = "timestamp";
    AccountTokenSnapshotLog_OrderBy["Token"] = "token";
    AccountTokenSnapshotLog_OrderBy["Token__createdAtBlockNumber"] = "token__createdAtBlockNumber";
    AccountTokenSnapshotLog_OrderBy["Token__createdAtTimestamp"] = "token__createdAtTimestamp";
    AccountTokenSnapshotLog_OrderBy["Token__decimals"] = "token__decimals";
    AccountTokenSnapshotLog_OrderBy["Token__id"] = "token__id";
    AccountTokenSnapshotLog_OrderBy["Token__isListed"] = "token__isListed";
    AccountTokenSnapshotLog_OrderBy["Token__isNativeAssetSuperToken"] = "token__isNativeAssetSuperToken";
    AccountTokenSnapshotLog_OrderBy["Token__isSuperToken"] = "token__isSuperToken";
    AccountTokenSnapshotLog_OrderBy["Token__name"] = "token__name";
    AccountTokenSnapshotLog_OrderBy["Token__symbol"] = "token__symbol";
    AccountTokenSnapshotLog_OrderBy["Token__underlyingAddress"] = "token__underlyingAddress";
    AccountTokenSnapshotLog_OrderBy["TotalAmountStreamed"] = "totalAmountStreamed";
    AccountTokenSnapshotLog_OrderBy["TotalAmountStreamedIn"] = "totalAmountStreamedIn";
    AccountTokenSnapshotLog_OrderBy["TotalAmountStreamedOut"] = "totalAmountStreamedOut";
    AccountTokenSnapshotLog_OrderBy["TotalAmountTransferred"] = "totalAmountTransferred";
    AccountTokenSnapshotLog_OrderBy["TotalApprovedSubscriptions"] = "totalApprovedSubscriptions";
    AccountTokenSnapshotLog_OrderBy["TotalCFAAmountStreamed"] = "totalCFAAmountStreamed";
    AccountTokenSnapshotLog_OrderBy["TotalCFAAmountStreamedOut"] = "totalCFAAmountStreamedOut";
    AccountTokenSnapshotLog_OrderBy["TotalCFADeposit"] = "totalCFADeposit";
    AccountTokenSnapshotLog_OrderBy["TotalCFANetFlowRate"] = "totalCFANetFlowRate";
    AccountTokenSnapshotLog_OrderBy["TotalCFANumberOfActiveStreams"] = "totalCFANumberOfActiveStreams";
    AccountTokenSnapshotLog_OrderBy["TotalCFANumberOfClosedStreams"] = "totalCFANumberOfClosedStreams";
    AccountTokenSnapshotLog_OrderBy["TotalCFAOutflowRate"] = "totalCFAOutflowRate";
    AccountTokenSnapshotLog_OrderBy["TotalConnectedMemberships"] = "totalConnectedMemberships";
    AccountTokenSnapshotLog_OrderBy["TotalDeposit"] = "totalDeposit";
    AccountTokenSnapshotLog_OrderBy["TotalGDADeposit"] = "totalGDADeposit";
    AccountTokenSnapshotLog_OrderBy["TotalGDANumberOfActiveStreams"] = "totalGDANumberOfActiveStreams";
    AccountTokenSnapshotLog_OrderBy["TotalGDANumberOfClosedStreams"] = "totalGDANumberOfClosedStreams";
    AccountTokenSnapshotLog_OrderBy["TotalGDAOutflowRate"] = "totalGDAOutflowRate";
    AccountTokenSnapshotLog_OrderBy["TotalInflowRate"] = "totalInflowRate";
    AccountTokenSnapshotLog_OrderBy["TotalMembershipsWithUnits"] = "totalMembershipsWithUnits";
    AccountTokenSnapshotLog_OrderBy["TotalNetFlowRate"] = "totalNetFlowRate";
    AccountTokenSnapshotLog_OrderBy["TotalNumberOfActiveStreams"] = "totalNumberOfActiveStreams";
    AccountTokenSnapshotLog_OrderBy["TotalNumberOfClosedStreams"] = "totalNumberOfClosedStreams";
    AccountTokenSnapshotLog_OrderBy["TotalOutflowRate"] = "totalOutflowRate";
    AccountTokenSnapshotLog_OrderBy["TotalSubscriptionsWithUnits"] = "totalSubscriptionsWithUnits";
    AccountTokenSnapshotLog_OrderBy["TransactionHash"] = "transactionHash";
    AccountTokenSnapshotLog_OrderBy["TriggeredByEventName"] = "triggeredByEventName";
})(AccountTokenSnapshotLog_OrderBy || (exports.AccountTokenSnapshotLog_OrderBy = AccountTokenSnapshotLog_OrderBy = {}));
var AccountTokenSnapshot_OrderBy;
(function(AccountTokenSnapshot_OrderBy) {
    AccountTokenSnapshot_OrderBy["Account"] = "account";
    AccountTokenSnapshot_OrderBy["AccountTokenSnapshotLogs"] = "accountTokenSnapshotLogs";
    AccountTokenSnapshot_OrderBy["Account__createdAtBlockNumber"] = "account__createdAtBlockNumber";
    AccountTokenSnapshot_OrderBy["Account__createdAtTimestamp"] = "account__createdAtTimestamp";
    AccountTokenSnapshot_OrderBy["Account__id"] = "account__id";
    AccountTokenSnapshot_OrderBy["Account__isSuperApp"] = "account__isSuperApp";
    AccountTokenSnapshot_OrderBy["Account__updatedAtBlockNumber"] = "account__updatedAtBlockNumber";
    AccountTokenSnapshot_OrderBy["Account__updatedAtTimestamp"] = "account__updatedAtTimestamp";
    AccountTokenSnapshot_OrderBy["ActiveCFAOutgoingStreamCount"] = "activeCFAOutgoingStreamCount";
    AccountTokenSnapshot_OrderBy["ActiveGDAOutgoingStreamCount"] = "activeGDAOutgoingStreamCount";
    AccountTokenSnapshot_OrderBy["ActiveIncomingStreamCount"] = "activeIncomingStreamCount";
    AccountTokenSnapshot_OrderBy["ActiveOutgoingStreamCount"] = "activeOutgoingStreamCount";
    AccountTokenSnapshot_OrderBy["AdminOfPoolCount"] = "adminOfPoolCount";
    AccountTokenSnapshot_OrderBy["BalanceLastUpdatedFromRpcBlocknumber"] = "balanceLastUpdatedFromRpcBlocknumber";
    AccountTokenSnapshot_OrderBy["BalanceUntilUpdatedAt"] = "balanceUntilUpdatedAt";
    AccountTokenSnapshot_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    AccountTokenSnapshot_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    AccountTokenSnapshot_OrderBy["FlowOperators"] = "flowOperators";
    AccountTokenSnapshot_OrderBy["Id"] = "id";
    AccountTokenSnapshot_OrderBy["InactiveCFAOutgoingStreamCount"] = "inactiveCFAOutgoingStreamCount";
    AccountTokenSnapshot_OrderBy["InactiveGDAOutgoingStreamCount"] = "inactiveGDAOutgoingStreamCount";
    AccountTokenSnapshot_OrderBy["InactiveIncomingStreamCount"] = "inactiveIncomingStreamCount";
    AccountTokenSnapshot_OrderBy["InactiveOutgoingStreamCount"] = "inactiveOutgoingStreamCount";
    AccountTokenSnapshot_OrderBy["IsLiquidationEstimateOptimistic"] = "isLiquidationEstimateOptimistic";
    AccountTokenSnapshot_OrderBy["MaybeCriticalAtTimestamp"] = "maybeCriticalAtTimestamp";
    AccountTokenSnapshot_OrderBy["Token"] = "token";
    AccountTokenSnapshot_OrderBy["Token__createdAtBlockNumber"] = "token__createdAtBlockNumber";
    AccountTokenSnapshot_OrderBy["Token__createdAtTimestamp"] = "token__createdAtTimestamp";
    AccountTokenSnapshot_OrderBy["Token__decimals"] = "token__decimals";
    AccountTokenSnapshot_OrderBy["Token__id"] = "token__id";
    AccountTokenSnapshot_OrderBy["Token__isListed"] = "token__isListed";
    AccountTokenSnapshot_OrderBy["Token__isNativeAssetSuperToken"] = "token__isNativeAssetSuperToken";
    AccountTokenSnapshot_OrderBy["Token__isSuperToken"] = "token__isSuperToken";
    AccountTokenSnapshot_OrderBy["Token__name"] = "token__name";
    AccountTokenSnapshot_OrderBy["Token__symbol"] = "token__symbol";
    AccountTokenSnapshot_OrderBy["Token__underlyingAddress"] = "token__underlyingAddress";
    AccountTokenSnapshot_OrderBy["TotalAmountStreamedInUntilUpdatedAt"] = "totalAmountStreamedInUntilUpdatedAt";
    AccountTokenSnapshot_OrderBy["TotalAmountStreamedOutUntilUpdatedAt"] = "totalAmountStreamedOutUntilUpdatedAt";
    AccountTokenSnapshot_OrderBy["TotalAmountStreamedUntilUpdatedAt"] = "totalAmountStreamedUntilUpdatedAt";
    AccountTokenSnapshot_OrderBy["TotalAmountTransferredUntilUpdatedAt"] = "totalAmountTransferredUntilUpdatedAt";
    AccountTokenSnapshot_OrderBy["TotalApprovedSubscriptions"] = "totalApprovedSubscriptions";
    AccountTokenSnapshot_OrderBy["TotalCFAAmountStreamedOutUntilUpdatedAt"] = "totalCFAAmountStreamedOutUntilUpdatedAt";
    AccountTokenSnapshot_OrderBy["TotalCFAAmountStreamedUntilUpdatedAt"] = "totalCFAAmountStreamedUntilUpdatedAt";
    AccountTokenSnapshot_OrderBy["TotalCFADeposit"] = "totalCFADeposit";
    AccountTokenSnapshot_OrderBy["TotalCFANetFlowRate"] = "totalCFANetFlowRate";
    AccountTokenSnapshot_OrderBy["TotalCFANumberOfActiveStreams"] = "totalCFANumberOfActiveStreams";
    AccountTokenSnapshot_OrderBy["TotalCFANumberOfClosedStreams"] = "totalCFANumberOfClosedStreams";
    AccountTokenSnapshot_OrderBy["TotalCFAOutflowRate"] = "totalCFAOutflowRate";
    AccountTokenSnapshot_OrderBy["TotalConnectedMemberships"] = "totalConnectedMemberships";
    AccountTokenSnapshot_OrderBy["TotalDeposit"] = "totalDeposit";
    AccountTokenSnapshot_OrderBy["TotalGDADeposit"] = "totalGDADeposit";
    AccountTokenSnapshot_OrderBy["TotalGDANumberOfActiveStreams"] = "totalGDANumberOfActiveStreams";
    AccountTokenSnapshot_OrderBy["TotalGDANumberOfClosedStreams"] = "totalGDANumberOfClosedStreams";
    AccountTokenSnapshot_OrderBy["TotalGDAOutflowRate"] = "totalGDAOutflowRate";
    AccountTokenSnapshot_OrderBy["TotalInflowRate"] = "totalInflowRate";
    AccountTokenSnapshot_OrderBy["TotalMembershipsWithUnits"] = "totalMembershipsWithUnits";
    AccountTokenSnapshot_OrderBy["TotalNetFlowRate"] = "totalNetFlowRate";
    AccountTokenSnapshot_OrderBy["TotalNumberOfActiveStreams"] = "totalNumberOfActiveStreams";
    AccountTokenSnapshot_OrderBy["TotalNumberOfClosedStreams"] = "totalNumberOfClosedStreams";
    AccountTokenSnapshot_OrderBy["TotalOutflowRate"] = "totalOutflowRate";
    AccountTokenSnapshot_OrderBy["TotalSubscriptionsWithUnits"] = "totalSubscriptionsWithUnits";
    AccountTokenSnapshot_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    AccountTokenSnapshot_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
})(AccountTokenSnapshot_OrderBy || (exports.AccountTokenSnapshot_OrderBy = AccountTokenSnapshot_OrderBy = {}));
var Account_OrderBy;
(function(Account_OrderBy) {
    Account_OrderBy["AccountTokenSnapshots"] = "accountTokenSnapshots";
    Account_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    Account_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    Account_OrderBy["Id"] = "id";
    Account_OrderBy["Inflows"] = "inflows";
    Account_OrderBy["IsSuperApp"] = "isSuperApp";
    Account_OrderBy["Outflows"] = "outflows";
    Account_OrderBy["PoolMemberships"] = "poolMemberships";
    Account_OrderBy["Pools"] = "pools";
    Account_OrderBy["PublishedIndexes"] = "publishedIndexes";
    Account_OrderBy["ReceivedTransferEvents"] = "receivedTransferEvents";
    Account_OrderBy["SentTransferEvents"] = "sentTransferEvents";
    Account_OrderBy["Subscriptions"] = "subscriptions";
    Account_OrderBy["TokenDowngradedEvents"] = "tokenDowngradedEvents";
    Account_OrderBy["TokenUpgradedEvents"] = "tokenUpgradedEvents";
    Account_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    Account_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
})(Account_OrderBy || (exports.Account_OrderBy = Account_OrderBy = {}));
var Aggregation_Interval;
(function(Aggregation_Interval) {
    Aggregation_Interval["Day"] = "day";
    Aggregation_Interval["Hour"] = "hour";
})(Aggregation_Interval || (exports.Aggregation_Interval = Aggregation_Interval = {}));
var AgreementClassRegisteredEvent_OrderBy;
(function(AgreementClassRegisteredEvent_OrderBy) {
    AgreementClassRegisteredEvent_OrderBy["Addresses"] = "addresses";
    AgreementClassRegisteredEvent_OrderBy["AgreementType"] = "agreementType";
    AgreementClassRegisteredEvent_OrderBy["BlockNumber"] = "blockNumber";
    AgreementClassRegisteredEvent_OrderBy["Code"] = "code";
    AgreementClassRegisteredEvent_OrderBy["GasPrice"] = "gasPrice";
    AgreementClassRegisteredEvent_OrderBy["GasUsed"] = "gasUsed";
    AgreementClassRegisteredEvent_OrderBy["Id"] = "id";
    AgreementClassRegisteredEvent_OrderBy["LogIndex"] = "logIndex";
    AgreementClassRegisteredEvent_OrderBy["Name"] = "name";
    AgreementClassRegisteredEvent_OrderBy["Order"] = "order";
    AgreementClassRegisteredEvent_OrderBy["Timestamp"] = "timestamp";
    AgreementClassRegisteredEvent_OrderBy["TransactionHash"] = "transactionHash";
})(AgreementClassRegisteredEvent_OrderBy || (exports.AgreementClassRegisteredEvent_OrderBy = AgreementClassRegisteredEvent_OrderBy = {}));
var AgreementClassUpdatedEvent_OrderBy;
(function(AgreementClassUpdatedEvent_OrderBy) {
    AgreementClassUpdatedEvent_OrderBy["Addresses"] = "addresses";
    AgreementClassUpdatedEvent_OrderBy["AgreementType"] = "agreementType";
    AgreementClassUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    AgreementClassUpdatedEvent_OrderBy["Code"] = "code";
    AgreementClassUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    AgreementClassUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    AgreementClassUpdatedEvent_OrderBy["Id"] = "id";
    AgreementClassUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    AgreementClassUpdatedEvent_OrderBy["Name"] = "name";
    AgreementClassUpdatedEvent_OrderBy["Order"] = "order";
    AgreementClassUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    AgreementClassUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(AgreementClassUpdatedEvent_OrderBy || (exports.AgreementClassUpdatedEvent_OrderBy = AgreementClassUpdatedEvent_OrderBy = {}));
var AgreementLiquidatedByEvent_OrderBy;
(function(AgreementLiquidatedByEvent_OrderBy) {
    AgreementLiquidatedByEvent_OrderBy["Addresses"] = "addresses";
    AgreementLiquidatedByEvent_OrderBy["AgreementClass"] = "agreementClass";
    AgreementLiquidatedByEvent_OrderBy["AgreementId"] = "agreementId";
    AgreementLiquidatedByEvent_OrderBy["BailoutAmount"] = "bailoutAmount";
    AgreementLiquidatedByEvent_OrderBy["BlockNumber"] = "blockNumber";
    AgreementLiquidatedByEvent_OrderBy["BondAccount"] = "bondAccount";
    AgreementLiquidatedByEvent_OrderBy["Deposit"] = "deposit";
    AgreementLiquidatedByEvent_OrderBy["FlowRateAtLiquidation"] = "flowRateAtLiquidation";
    AgreementLiquidatedByEvent_OrderBy["GasPrice"] = "gasPrice";
    AgreementLiquidatedByEvent_OrderBy["GasUsed"] = "gasUsed";
    AgreementLiquidatedByEvent_OrderBy["Id"] = "id";
    AgreementLiquidatedByEvent_OrderBy["LiquidatorAccount"] = "liquidatorAccount";
    AgreementLiquidatedByEvent_OrderBy["LogIndex"] = "logIndex";
    AgreementLiquidatedByEvent_OrderBy["Name"] = "name";
    AgreementLiquidatedByEvent_OrderBy["Order"] = "order";
    AgreementLiquidatedByEvent_OrderBy["PenaltyAccount"] = "penaltyAccount";
    AgreementLiquidatedByEvent_OrderBy["RewardAmount"] = "rewardAmount";
    AgreementLiquidatedByEvent_OrderBy["Timestamp"] = "timestamp";
    AgreementLiquidatedByEvent_OrderBy["Token"] = "token";
    AgreementLiquidatedByEvent_OrderBy["TransactionHash"] = "transactionHash";
})(AgreementLiquidatedByEvent_OrderBy || (exports.AgreementLiquidatedByEvent_OrderBy = AgreementLiquidatedByEvent_OrderBy = {}));
var AgreementLiquidatedV2Event_OrderBy;
(function(AgreementLiquidatedV2Event_OrderBy) {
    AgreementLiquidatedV2Event_OrderBy["Addresses"] = "addresses";
    AgreementLiquidatedV2Event_OrderBy["AgreementClass"] = "agreementClass";
    AgreementLiquidatedV2Event_OrderBy["AgreementId"] = "agreementId";
    AgreementLiquidatedV2Event_OrderBy["BlockNumber"] = "blockNumber";
    AgreementLiquidatedV2Event_OrderBy["Deposit"] = "deposit";
    AgreementLiquidatedV2Event_OrderBy["FlowRateAtLiquidation"] = "flowRateAtLiquidation";
    AgreementLiquidatedV2Event_OrderBy["GasPrice"] = "gasPrice";
    AgreementLiquidatedV2Event_OrderBy["GasUsed"] = "gasUsed";
    AgreementLiquidatedV2Event_OrderBy["Id"] = "id";
    AgreementLiquidatedV2Event_OrderBy["LiquidationType"] = "liquidationType";
    AgreementLiquidatedV2Event_OrderBy["LiquidatorAccount"] = "liquidatorAccount";
    AgreementLiquidatedV2Event_OrderBy["LogIndex"] = "logIndex";
    AgreementLiquidatedV2Event_OrderBy["Name"] = "name";
    AgreementLiquidatedV2Event_OrderBy["Order"] = "order";
    AgreementLiquidatedV2Event_OrderBy["RewardAccount"] = "rewardAccount";
    AgreementLiquidatedV2Event_OrderBy["RewardAmount"] = "rewardAmount";
    AgreementLiquidatedV2Event_OrderBy["RewardAmountReceiver"] = "rewardAmountReceiver";
    AgreementLiquidatedV2Event_OrderBy["TargetAccount"] = "targetAccount";
    AgreementLiquidatedV2Event_OrderBy["TargetAccountBalanceDelta"] = "targetAccountBalanceDelta";
    AgreementLiquidatedV2Event_OrderBy["Timestamp"] = "timestamp";
    AgreementLiquidatedV2Event_OrderBy["Token"] = "token";
    AgreementLiquidatedV2Event_OrderBy["TransactionHash"] = "transactionHash";
    AgreementLiquidatedV2Event_OrderBy["Version"] = "version";
})(AgreementLiquidatedV2Event_OrderBy || (exports.AgreementLiquidatedV2Event_OrderBy = AgreementLiquidatedV2Event_OrderBy = {}));
var AppRegisteredEvent_OrderBy;
(function(AppRegisteredEvent_OrderBy) {
    AppRegisteredEvent_OrderBy["Addresses"] = "addresses";
    AppRegisteredEvent_OrderBy["App"] = "app";
    AppRegisteredEvent_OrderBy["BlockNumber"] = "blockNumber";
    AppRegisteredEvent_OrderBy["GasPrice"] = "gasPrice";
    AppRegisteredEvent_OrderBy["GasUsed"] = "gasUsed";
    AppRegisteredEvent_OrderBy["Id"] = "id";
    AppRegisteredEvent_OrderBy["LogIndex"] = "logIndex";
    AppRegisteredEvent_OrderBy["Name"] = "name";
    AppRegisteredEvent_OrderBy["Order"] = "order";
    AppRegisteredEvent_OrderBy["Timestamp"] = "timestamp";
    AppRegisteredEvent_OrderBy["TransactionHash"] = "transactionHash";
})(AppRegisteredEvent_OrderBy || (exports.AppRegisteredEvent_OrderBy = AppRegisteredEvent_OrderBy = {}));
var ApprovalEvent_OrderBy;
(function(ApprovalEvent_OrderBy) {
    ApprovalEvent_OrderBy["Addresses"] = "addresses";
    ApprovalEvent_OrderBy["Amount"] = "amount";
    ApprovalEvent_OrderBy["BlockNumber"] = "blockNumber";
    ApprovalEvent_OrderBy["GasPrice"] = "gasPrice";
    ApprovalEvent_OrderBy["GasUsed"] = "gasUsed";
    ApprovalEvent_OrderBy["Id"] = "id";
    ApprovalEvent_OrderBy["LogIndex"] = "logIndex";
    ApprovalEvent_OrderBy["Name"] = "name";
    ApprovalEvent_OrderBy["Order"] = "order";
    ApprovalEvent_OrderBy["Owner"] = "owner";
    ApprovalEvent_OrderBy["Owner__createdAtBlockNumber"] = "owner__createdAtBlockNumber";
    ApprovalEvent_OrderBy["Owner__createdAtTimestamp"] = "owner__createdAtTimestamp";
    ApprovalEvent_OrderBy["Owner__id"] = "owner__id";
    ApprovalEvent_OrderBy["Owner__isSuperApp"] = "owner__isSuperApp";
    ApprovalEvent_OrderBy["Owner__updatedAtBlockNumber"] = "owner__updatedAtBlockNumber";
    ApprovalEvent_OrderBy["Owner__updatedAtTimestamp"] = "owner__updatedAtTimestamp";
    ApprovalEvent_OrderBy["Timestamp"] = "timestamp";
    ApprovalEvent_OrderBy["To"] = "to";
    ApprovalEvent_OrderBy["To__createdAtBlockNumber"] = "to__createdAtBlockNumber";
    ApprovalEvent_OrderBy["To__createdAtTimestamp"] = "to__createdAtTimestamp";
    ApprovalEvent_OrderBy["To__id"] = "to__id";
    ApprovalEvent_OrderBy["To__isSuperApp"] = "to__isSuperApp";
    ApprovalEvent_OrderBy["To__updatedAtBlockNumber"] = "to__updatedAtBlockNumber";
    ApprovalEvent_OrderBy["To__updatedAtTimestamp"] = "to__updatedAtTimestamp";
    ApprovalEvent_OrderBy["TransactionHash"] = "transactionHash";
})(ApprovalEvent_OrderBy || (exports.ApprovalEvent_OrderBy = ApprovalEvent_OrderBy = {}));
var BondIncreasedEvent_OrderBy;
(function(BondIncreasedEvent_OrderBy) {
    BondIncreasedEvent_OrderBy["AdditionalBond"] = "additionalBond";
    BondIncreasedEvent_OrderBy["Addresses"] = "addresses";
    BondIncreasedEvent_OrderBy["BlockNumber"] = "blockNumber";
    BondIncreasedEvent_OrderBy["GasPrice"] = "gasPrice";
    BondIncreasedEvent_OrderBy["GasUsed"] = "gasUsed";
    BondIncreasedEvent_OrderBy["Id"] = "id";
    BondIncreasedEvent_OrderBy["LogIndex"] = "logIndex";
    BondIncreasedEvent_OrderBy["Name"] = "name";
    BondIncreasedEvent_OrderBy["Order"] = "order";
    BondIncreasedEvent_OrderBy["Timestamp"] = "timestamp";
    BondIncreasedEvent_OrderBy["Token"] = "token";
    BondIncreasedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(BondIncreasedEvent_OrderBy || (exports.BondIncreasedEvent_OrderBy = BondIncreasedEvent_OrderBy = {}));
var BufferAdjustedEvent_OrderBy;
(function(BufferAdjustedEvent_OrderBy) {
    BufferAdjustedEvent_OrderBy["Addresses"] = "addresses";
    BufferAdjustedEvent_OrderBy["BlockNumber"] = "blockNumber";
    BufferAdjustedEvent_OrderBy["BufferDelta"] = "bufferDelta";
    BufferAdjustedEvent_OrderBy["GasPrice"] = "gasPrice";
    BufferAdjustedEvent_OrderBy["GasUsed"] = "gasUsed";
    BufferAdjustedEvent_OrderBy["Id"] = "id";
    BufferAdjustedEvent_OrderBy["LogIndex"] = "logIndex";
    BufferAdjustedEvent_OrderBy["Name"] = "name";
    BufferAdjustedEvent_OrderBy["NewBufferAmount"] = "newBufferAmount";
    BufferAdjustedEvent_OrderBy["Order"] = "order";
    BufferAdjustedEvent_OrderBy["Pool"] = "pool";
    BufferAdjustedEvent_OrderBy["PoolDistributor"] = "poolDistributor";
    BufferAdjustedEvent_OrderBy["PoolDistributor__createdAtBlockNumber"] = "poolDistributor__createdAtBlockNumber";
    BufferAdjustedEvent_OrderBy["PoolDistributor__createdAtTimestamp"] = "poolDistributor__createdAtTimestamp";
    BufferAdjustedEvent_OrderBy["PoolDistributor__flowRate"] = "poolDistributor__flowRate";
    BufferAdjustedEvent_OrderBy["PoolDistributor__id"] = "poolDistributor__id";
    BufferAdjustedEvent_OrderBy["PoolDistributor__totalAmountDistributedUntilUpdatedAt"] = "poolDistributor__totalAmountDistributedUntilUpdatedAt";
    BufferAdjustedEvent_OrderBy["PoolDistributor__totalAmountFlowedDistributedUntilUpdatedAt"] = "poolDistributor__totalAmountFlowedDistributedUntilUpdatedAt";
    BufferAdjustedEvent_OrderBy["PoolDistributor__totalAmountInstantlyDistributedUntilUpdatedAt"] = "poolDistributor__totalAmountInstantlyDistributedUntilUpdatedAt";
    BufferAdjustedEvent_OrderBy["PoolDistributor__totalBuffer"] = "poolDistributor__totalBuffer";
    BufferAdjustedEvent_OrderBy["PoolDistributor__updatedAtBlockNumber"] = "poolDistributor__updatedAtBlockNumber";
    BufferAdjustedEvent_OrderBy["PoolDistributor__updatedAtTimestamp"] = "poolDistributor__updatedAtTimestamp";
    BufferAdjustedEvent_OrderBy["Pool__adjustmentFlowRate"] = "pool__adjustmentFlowRate";
    BufferAdjustedEvent_OrderBy["Pool__createdAtBlockNumber"] = "pool__createdAtBlockNumber";
    BufferAdjustedEvent_OrderBy["Pool__createdAtTimestamp"] = "pool__createdAtTimestamp";
    BufferAdjustedEvent_OrderBy["Pool__flowRate"] = "pool__flowRate";
    BufferAdjustedEvent_OrderBy["Pool__id"] = "pool__id";
    BufferAdjustedEvent_OrderBy["Pool__perUnitFlowRate"] = "pool__perUnitFlowRate";
    BufferAdjustedEvent_OrderBy["Pool__perUnitSettledValue"] = "pool__perUnitSettledValue";
    BufferAdjustedEvent_OrderBy["Pool__totalAmountDistributedUntilUpdatedAt"] = "pool__totalAmountDistributedUntilUpdatedAt";
    BufferAdjustedEvent_OrderBy["Pool__totalAmountFlowedDistributedUntilUpdatedAt"] = "pool__totalAmountFlowedDistributedUntilUpdatedAt";
    BufferAdjustedEvent_OrderBy["Pool__totalAmountInstantlyDistributedUntilUpdatedAt"] = "pool__totalAmountInstantlyDistributedUntilUpdatedAt";
    BufferAdjustedEvent_OrderBy["Pool__totalBuffer"] = "pool__totalBuffer";
    BufferAdjustedEvent_OrderBy["Pool__totalConnectedMembers"] = "pool__totalConnectedMembers";
    BufferAdjustedEvent_OrderBy["Pool__totalConnectedUnits"] = "pool__totalConnectedUnits";
    BufferAdjustedEvent_OrderBy["Pool__totalDisconnectedMembers"] = "pool__totalDisconnectedMembers";
    BufferAdjustedEvent_OrderBy["Pool__totalDisconnectedUnits"] = "pool__totalDisconnectedUnits";
    BufferAdjustedEvent_OrderBy["Pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt"] = "pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt";
    BufferAdjustedEvent_OrderBy["Pool__totalMembers"] = "pool__totalMembers";
    BufferAdjustedEvent_OrderBy["Pool__totalUnits"] = "pool__totalUnits";
    BufferAdjustedEvent_OrderBy["Pool__updatedAtBlockNumber"] = "pool__updatedAtBlockNumber";
    BufferAdjustedEvent_OrderBy["Pool__updatedAtTimestamp"] = "pool__updatedAtTimestamp";
    BufferAdjustedEvent_OrderBy["Timestamp"] = "timestamp";
    BufferAdjustedEvent_OrderBy["Token"] = "token";
    BufferAdjustedEvent_OrderBy["TotalBufferAmount"] = "totalBufferAmount";
    BufferAdjustedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(BufferAdjustedEvent_OrderBy || (exports.BufferAdjustedEvent_OrderBy = BufferAdjustedEvent_OrderBy = {}));
var BurnedEvent_OrderBy;
(function(BurnedEvent_OrderBy) {
    BurnedEvent_OrderBy["Addresses"] = "addresses";
    BurnedEvent_OrderBy["Amount"] = "amount";
    BurnedEvent_OrderBy["BlockNumber"] = "blockNumber";
    BurnedEvent_OrderBy["Data"] = "data";
    BurnedEvent_OrderBy["From"] = "from";
    BurnedEvent_OrderBy["GasPrice"] = "gasPrice";
    BurnedEvent_OrderBy["GasUsed"] = "gasUsed";
    BurnedEvent_OrderBy["Id"] = "id";
    BurnedEvent_OrderBy["LogIndex"] = "logIndex";
    BurnedEvent_OrderBy["Name"] = "name";
    BurnedEvent_OrderBy["Operator"] = "operator";
    BurnedEvent_OrderBy["OperatorData"] = "operatorData";
    BurnedEvent_OrderBy["Order"] = "order";
    BurnedEvent_OrderBy["Timestamp"] = "timestamp";
    BurnedEvent_OrderBy["Token"] = "token";
    BurnedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(BurnedEvent_OrderBy || (exports.BurnedEvent_OrderBy = BurnedEvent_OrderBy = {}));
var CfAv1LiquidationPeriodChangedEvent_OrderBy;
(function(CfAv1LiquidationPeriodChangedEvent_OrderBy) {
    CfAv1LiquidationPeriodChangedEvent_OrderBy["Addresses"] = "addresses";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["BlockNumber"] = "blockNumber";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["GasPrice"] = "gasPrice";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["GasUsed"] = "gasUsed";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["GovernanceAddress"] = "governanceAddress";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["Host"] = "host";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["Id"] = "id";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["IsKeySet"] = "isKeySet";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["LiquidationPeriod"] = "liquidationPeriod";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["LogIndex"] = "logIndex";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["Name"] = "name";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["Order"] = "order";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["SuperToken"] = "superToken";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["Timestamp"] = "timestamp";
    CfAv1LiquidationPeriodChangedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(CfAv1LiquidationPeriodChangedEvent_OrderBy || (exports.CfAv1LiquidationPeriodChangedEvent_OrderBy = CfAv1LiquidationPeriodChangedEvent_OrderBy = {}));
var ConfigChangedEvent_OrderBy;
(function(ConfigChangedEvent_OrderBy) {
    ConfigChangedEvent_OrderBy["Addresses"] = "addresses";
    ConfigChangedEvent_OrderBy["BlockNumber"] = "blockNumber";
    ConfigChangedEvent_OrderBy["GasPrice"] = "gasPrice";
    ConfigChangedEvent_OrderBy["GasUsed"] = "gasUsed";
    ConfigChangedEvent_OrderBy["GovernanceAddress"] = "governanceAddress";
    ConfigChangedEvent_OrderBy["Host"] = "host";
    ConfigChangedEvent_OrderBy["Id"] = "id";
    ConfigChangedEvent_OrderBy["IsKeySet"] = "isKeySet";
    ConfigChangedEvent_OrderBy["Key"] = "key";
    ConfigChangedEvent_OrderBy["LogIndex"] = "logIndex";
    ConfigChangedEvent_OrderBy["Name"] = "name";
    ConfigChangedEvent_OrderBy["Order"] = "order";
    ConfigChangedEvent_OrderBy["SuperToken"] = "superToken";
    ConfigChangedEvent_OrderBy["Timestamp"] = "timestamp";
    ConfigChangedEvent_OrderBy["TransactionHash"] = "transactionHash";
    ConfigChangedEvent_OrderBy["Value"] = "value";
})(ConfigChangedEvent_OrderBy || (exports.ConfigChangedEvent_OrderBy = ConfigChangedEvent_OrderBy = {}));
var CustomSuperTokenCreatedEvent_OrderBy;
(function(CustomSuperTokenCreatedEvent_OrderBy) {
    CustomSuperTokenCreatedEvent_OrderBy["Addresses"] = "addresses";
    CustomSuperTokenCreatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    CustomSuperTokenCreatedEvent_OrderBy["GasPrice"] = "gasPrice";
    CustomSuperTokenCreatedEvent_OrderBy["GasUsed"] = "gasUsed";
    CustomSuperTokenCreatedEvent_OrderBy["Id"] = "id";
    CustomSuperTokenCreatedEvent_OrderBy["LogIndex"] = "logIndex";
    CustomSuperTokenCreatedEvent_OrderBy["Name"] = "name";
    CustomSuperTokenCreatedEvent_OrderBy["Order"] = "order";
    CustomSuperTokenCreatedEvent_OrderBy["Timestamp"] = "timestamp";
    CustomSuperTokenCreatedEvent_OrderBy["Token"] = "token";
    CustomSuperTokenCreatedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(CustomSuperTokenCreatedEvent_OrderBy || (exports.CustomSuperTokenCreatedEvent_OrderBy = CustomSuperTokenCreatedEvent_OrderBy = {}));
var DistributionClaimedEvent_OrderBy;
(function(DistributionClaimedEvent_OrderBy) {
    DistributionClaimedEvent_OrderBy["Addresses"] = "addresses";
    DistributionClaimedEvent_OrderBy["BlockNumber"] = "blockNumber";
    DistributionClaimedEvent_OrderBy["ClaimedAmount"] = "claimedAmount";
    DistributionClaimedEvent_OrderBy["GasPrice"] = "gasPrice";
    DistributionClaimedEvent_OrderBy["GasUsed"] = "gasUsed";
    DistributionClaimedEvent_OrderBy["Id"] = "id";
    DistributionClaimedEvent_OrderBy["LogIndex"] = "logIndex";
    DistributionClaimedEvent_OrderBy["Name"] = "name";
    DistributionClaimedEvent_OrderBy["Order"] = "order";
    DistributionClaimedEvent_OrderBy["Pool"] = "pool";
    DistributionClaimedEvent_OrderBy["PoolMember"] = "poolMember";
    DistributionClaimedEvent_OrderBy["PoolMember__createdAtBlockNumber"] = "poolMember__createdAtBlockNumber";
    DistributionClaimedEvent_OrderBy["PoolMember__createdAtTimestamp"] = "poolMember__createdAtTimestamp";
    DistributionClaimedEvent_OrderBy["PoolMember__id"] = "poolMember__id";
    DistributionClaimedEvent_OrderBy["PoolMember__isConnected"] = "poolMember__isConnected";
    DistributionClaimedEvent_OrderBy["PoolMember__poolTotalAmountDistributedUntilUpdatedAt"] = "poolMember__poolTotalAmountDistributedUntilUpdatedAt";
    DistributionClaimedEvent_OrderBy["PoolMember__syncedPerUnitFlowRate"] = "poolMember__syncedPerUnitFlowRate";
    DistributionClaimedEvent_OrderBy["PoolMember__syncedPerUnitSettledValue"] = "poolMember__syncedPerUnitSettledValue";
    DistributionClaimedEvent_OrderBy["PoolMember__totalAmountClaimed"] = "poolMember__totalAmountClaimed";
    DistributionClaimedEvent_OrderBy["PoolMember__totalAmountReceivedUntilUpdatedAt"] = "poolMember__totalAmountReceivedUntilUpdatedAt";
    DistributionClaimedEvent_OrderBy["PoolMember__units"] = "poolMember__units";
    DistributionClaimedEvent_OrderBy["PoolMember__updatedAtBlockNumber"] = "poolMember__updatedAtBlockNumber";
    DistributionClaimedEvent_OrderBy["PoolMember__updatedAtTimestamp"] = "poolMember__updatedAtTimestamp";
    DistributionClaimedEvent_OrderBy["Pool__adjustmentFlowRate"] = "pool__adjustmentFlowRate";
    DistributionClaimedEvent_OrderBy["Pool__createdAtBlockNumber"] = "pool__createdAtBlockNumber";
    DistributionClaimedEvent_OrderBy["Pool__createdAtTimestamp"] = "pool__createdAtTimestamp";
    DistributionClaimedEvent_OrderBy["Pool__flowRate"] = "pool__flowRate";
    DistributionClaimedEvent_OrderBy["Pool__id"] = "pool__id";
    DistributionClaimedEvent_OrderBy["Pool__perUnitFlowRate"] = "pool__perUnitFlowRate";
    DistributionClaimedEvent_OrderBy["Pool__perUnitSettledValue"] = "pool__perUnitSettledValue";
    DistributionClaimedEvent_OrderBy["Pool__totalAmountDistributedUntilUpdatedAt"] = "pool__totalAmountDistributedUntilUpdatedAt";
    DistributionClaimedEvent_OrderBy["Pool__totalAmountFlowedDistributedUntilUpdatedAt"] = "pool__totalAmountFlowedDistributedUntilUpdatedAt";
    DistributionClaimedEvent_OrderBy["Pool__totalAmountInstantlyDistributedUntilUpdatedAt"] = "pool__totalAmountInstantlyDistributedUntilUpdatedAt";
    DistributionClaimedEvent_OrderBy["Pool__totalBuffer"] = "pool__totalBuffer";
    DistributionClaimedEvent_OrderBy["Pool__totalConnectedMembers"] = "pool__totalConnectedMembers";
    DistributionClaimedEvent_OrderBy["Pool__totalConnectedUnits"] = "pool__totalConnectedUnits";
    DistributionClaimedEvent_OrderBy["Pool__totalDisconnectedMembers"] = "pool__totalDisconnectedMembers";
    DistributionClaimedEvent_OrderBy["Pool__totalDisconnectedUnits"] = "pool__totalDisconnectedUnits";
    DistributionClaimedEvent_OrderBy["Pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt"] = "pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt";
    DistributionClaimedEvent_OrderBy["Pool__totalMembers"] = "pool__totalMembers";
    DistributionClaimedEvent_OrderBy["Pool__totalUnits"] = "pool__totalUnits";
    DistributionClaimedEvent_OrderBy["Pool__updatedAtBlockNumber"] = "pool__updatedAtBlockNumber";
    DistributionClaimedEvent_OrderBy["Pool__updatedAtTimestamp"] = "pool__updatedAtTimestamp";
    DistributionClaimedEvent_OrderBy["Timestamp"] = "timestamp";
    DistributionClaimedEvent_OrderBy["Token"] = "token";
    DistributionClaimedEvent_OrderBy["TotalClaimed"] = "totalClaimed";
    DistributionClaimedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(DistributionClaimedEvent_OrderBy || (exports.DistributionClaimedEvent_OrderBy = DistributionClaimedEvent_OrderBy = {}));
var Event_OrderBy;
(function(Event_OrderBy) {
    Event_OrderBy["Addresses"] = "addresses";
    Event_OrderBy["BlockNumber"] = "blockNumber";
    Event_OrderBy["GasPrice"] = "gasPrice";
    Event_OrderBy["GasUsed"] = "gasUsed";
    Event_OrderBy["Id"] = "id";
    Event_OrderBy["LogIndex"] = "logIndex";
    Event_OrderBy["Name"] = "name";
    Event_OrderBy["Order"] = "order";
    Event_OrderBy["Timestamp"] = "timestamp";
    Event_OrderBy["TransactionHash"] = "transactionHash";
})(Event_OrderBy || (exports.Event_OrderBy = Event_OrderBy = {}));
var ExitRateChangedEvent_OrderBy;
(function(ExitRateChangedEvent_OrderBy) {
    ExitRateChangedEvent_OrderBy["Addresses"] = "addresses";
    ExitRateChangedEvent_OrderBy["BlockNumber"] = "blockNumber";
    ExitRateChangedEvent_OrderBy["ExitRate"] = "exitRate";
    ExitRateChangedEvent_OrderBy["GasPrice"] = "gasPrice";
    ExitRateChangedEvent_OrderBy["GasUsed"] = "gasUsed";
    ExitRateChangedEvent_OrderBy["Id"] = "id";
    ExitRateChangedEvent_OrderBy["LogIndex"] = "logIndex";
    ExitRateChangedEvent_OrderBy["Name"] = "name";
    ExitRateChangedEvent_OrderBy["Order"] = "order";
    ExitRateChangedEvent_OrderBy["Timestamp"] = "timestamp";
    ExitRateChangedEvent_OrderBy["Token"] = "token";
    ExitRateChangedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(ExitRateChangedEvent_OrderBy || (exports.ExitRateChangedEvent_OrderBy = ExitRateChangedEvent_OrderBy = {}));
var FlowDistributionUpdatedEvent_OrderBy;
(function(FlowDistributionUpdatedEvent_OrderBy) {
    FlowDistributionUpdatedEvent_OrderBy["Addresses"] = "addresses";
    FlowDistributionUpdatedEvent_OrderBy["AdjustmentFlowRate"] = "adjustmentFlowRate";
    FlowDistributionUpdatedEvent_OrderBy["AdjustmentFlowRecipient"] = "adjustmentFlowRecipient";
    FlowDistributionUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    FlowDistributionUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    FlowDistributionUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    FlowDistributionUpdatedEvent_OrderBy["Id"] = "id";
    FlowDistributionUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    FlowDistributionUpdatedEvent_OrderBy["Name"] = "name";
    FlowDistributionUpdatedEvent_OrderBy["NewDistributorToPoolFlowRate"] = "newDistributorToPoolFlowRate";
    FlowDistributionUpdatedEvent_OrderBy["NewTotalDistributionFlowRate"] = "newTotalDistributionFlowRate";
    FlowDistributionUpdatedEvent_OrderBy["OldFlowRate"] = "oldFlowRate";
    FlowDistributionUpdatedEvent_OrderBy["Operator"] = "operator";
    FlowDistributionUpdatedEvent_OrderBy["Order"] = "order";
    FlowDistributionUpdatedEvent_OrderBy["Pool"] = "pool";
    FlowDistributionUpdatedEvent_OrderBy["PoolDistributor"] = "poolDistributor";
    FlowDistributionUpdatedEvent_OrderBy["PoolDistributor__createdAtBlockNumber"] = "poolDistributor__createdAtBlockNumber";
    FlowDistributionUpdatedEvent_OrderBy["PoolDistributor__createdAtTimestamp"] = "poolDistributor__createdAtTimestamp";
    FlowDistributionUpdatedEvent_OrderBy["PoolDistributor__flowRate"] = "poolDistributor__flowRate";
    FlowDistributionUpdatedEvent_OrderBy["PoolDistributor__id"] = "poolDistributor__id";
    FlowDistributionUpdatedEvent_OrderBy["PoolDistributor__totalAmountDistributedUntilUpdatedAt"] = "poolDistributor__totalAmountDistributedUntilUpdatedAt";
    FlowDistributionUpdatedEvent_OrderBy["PoolDistributor__totalAmountFlowedDistributedUntilUpdatedAt"] = "poolDistributor__totalAmountFlowedDistributedUntilUpdatedAt";
    FlowDistributionUpdatedEvent_OrderBy["PoolDistributor__totalAmountInstantlyDistributedUntilUpdatedAt"] = "poolDistributor__totalAmountInstantlyDistributedUntilUpdatedAt";
    FlowDistributionUpdatedEvent_OrderBy["PoolDistributor__totalBuffer"] = "poolDistributor__totalBuffer";
    FlowDistributionUpdatedEvent_OrderBy["PoolDistributor__updatedAtBlockNumber"] = "poolDistributor__updatedAtBlockNumber";
    FlowDistributionUpdatedEvent_OrderBy["PoolDistributor__updatedAtTimestamp"] = "poolDistributor__updatedAtTimestamp";
    FlowDistributionUpdatedEvent_OrderBy["Pool__adjustmentFlowRate"] = "pool__adjustmentFlowRate";
    FlowDistributionUpdatedEvent_OrderBy["Pool__createdAtBlockNumber"] = "pool__createdAtBlockNumber";
    FlowDistributionUpdatedEvent_OrderBy["Pool__createdAtTimestamp"] = "pool__createdAtTimestamp";
    FlowDistributionUpdatedEvent_OrderBy["Pool__flowRate"] = "pool__flowRate";
    FlowDistributionUpdatedEvent_OrderBy["Pool__id"] = "pool__id";
    FlowDistributionUpdatedEvent_OrderBy["Pool__perUnitFlowRate"] = "pool__perUnitFlowRate";
    FlowDistributionUpdatedEvent_OrderBy["Pool__perUnitSettledValue"] = "pool__perUnitSettledValue";
    FlowDistributionUpdatedEvent_OrderBy["Pool__totalAmountDistributedUntilUpdatedAt"] = "pool__totalAmountDistributedUntilUpdatedAt";
    FlowDistributionUpdatedEvent_OrderBy["Pool__totalAmountFlowedDistributedUntilUpdatedAt"] = "pool__totalAmountFlowedDistributedUntilUpdatedAt";
    FlowDistributionUpdatedEvent_OrderBy["Pool__totalAmountInstantlyDistributedUntilUpdatedAt"] = "pool__totalAmountInstantlyDistributedUntilUpdatedAt";
    FlowDistributionUpdatedEvent_OrderBy["Pool__totalBuffer"] = "pool__totalBuffer";
    FlowDistributionUpdatedEvent_OrderBy["Pool__totalConnectedMembers"] = "pool__totalConnectedMembers";
    FlowDistributionUpdatedEvent_OrderBy["Pool__totalConnectedUnits"] = "pool__totalConnectedUnits";
    FlowDistributionUpdatedEvent_OrderBy["Pool__totalDisconnectedMembers"] = "pool__totalDisconnectedMembers";
    FlowDistributionUpdatedEvent_OrderBy["Pool__totalDisconnectedUnits"] = "pool__totalDisconnectedUnits";
    FlowDistributionUpdatedEvent_OrderBy["Pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt"] = "pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt";
    FlowDistributionUpdatedEvent_OrderBy["Pool__totalMembers"] = "pool__totalMembers";
    FlowDistributionUpdatedEvent_OrderBy["Pool__totalUnits"] = "pool__totalUnits";
    FlowDistributionUpdatedEvent_OrderBy["Pool__updatedAtBlockNumber"] = "pool__updatedAtBlockNumber";
    FlowDistributionUpdatedEvent_OrderBy["Pool__updatedAtTimestamp"] = "pool__updatedAtTimestamp";
    FlowDistributionUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    FlowDistributionUpdatedEvent_OrderBy["Token"] = "token";
    FlowDistributionUpdatedEvent_OrderBy["TotalUnits"] = "totalUnits";
    FlowDistributionUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
    FlowDistributionUpdatedEvent_OrderBy["UserData"] = "userData";
})(FlowDistributionUpdatedEvent_OrderBy || (exports.FlowDistributionUpdatedEvent_OrderBy = FlowDistributionUpdatedEvent_OrderBy = {}));
var FlowOperatorUpdatedEvent_OrderBy;
(function(FlowOperatorUpdatedEvent_OrderBy) {
    FlowOperatorUpdatedEvent_OrderBy["Addresses"] = "addresses";
    FlowOperatorUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    FlowOperatorUpdatedEvent_OrderBy["FlowOperator"] = "flowOperator";
    FlowOperatorUpdatedEvent_OrderBy["FlowOperator__allowance"] = "flowOperator__allowance";
    FlowOperatorUpdatedEvent_OrderBy["FlowOperator__createdAtBlockNumber"] = "flowOperator__createdAtBlockNumber";
    FlowOperatorUpdatedEvent_OrderBy["FlowOperator__createdAtTimestamp"] = "flowOperator__createdAtTimestamp";
    FlowOperatorUpdatedEvent_OrderBy["FlowOperator__flowOperator"] = "flowOperator__flowOperator";
    FlowOperatorUpdatedEvent_OrderBy["FlowOperator__flowRateAllowanceGranted"] = "flowOperator__flowRateAllowanceGranted";
    FlowOperatorUpdatedEvent_OrderBy["FlowOperator__flowRateAllowanceRemaining"] = "flowOperator__flowRateAllowanceRemaining";
    FlowOperatorUpdatedEvent_OrderBy["FlowOperator__id"] = "flowOperator__id";
    FlowOperatorUpdatedEvent_OrderBy["FlowOperator__permissions"] = "flowOperator__permissions";
    FlowOperatorUpdatedEvent_OrderBy["FlowOperator__updatedAtBlockNumber"] = "flowOperator__updatedAtBlockNumber";
    FlowOperatorUpdatedEvent_OrderBy["FlowOperator__updatedAtTimestamp"] = "flowOperator__updatedAtTimestamp";
    FlowOperatorUpdatedEvent_OrderBy["FlowRateAllowance"] = "flowRateAllowance";
    FlowOperatorUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    FlowOperatorUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    FlowOperatorUpdatedEvent_OrderBy["Id"] = "id";
    FlowOperatorUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    FlowOperatorUpdatedEvent_OrderBy["Name"] = "name";
    FlowOperatorUpdatedEvent_OrderBy["Order"] = "order";
    FlowOperatorUpdatedEvent_OrderBy["Permissions"] = "permissions";
    FlowOperatorUpdatedEvent_OrderBy["Sender"] = "sender";
    FlowOperatorUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    FlowOperatorUpdatedEvent_OrderBy["Token"] = "token";
    FlowOperatorUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(FlowOperatorUpdatedEvent_OrderBy || (exports.FlowOperatorUpdatedEvent_OrderBy = FlowOperatorUpdatedEvent_OrderBy = {}));
var FlowOperator_OrderBy;
(function(FlowOperator_OrderBy) {
    FlowOperator_OrderBy["AccountTokenSnapshot"] = "accountTokenSnapshot";
    FlowOperator_OrderBy["AccountTokenSnapshot__activeCFAOutgoingStreamCount"] = "accountTokenSnapshot__activeCFAOutgoingStreamCount";
    FlowOperator_OrderBy["AccountTokenSnapshot__activeGDAOutgoingStreamCount"] = "accountTokenSnapshot__activeGDAOutgoingStreamCount";
    FlowOperator_OrderBy["AccountTokenSnapshot__activeIncomingStreamCount"] = "accountTokenSnapshot__activeIncomingStreamCount";
    FlowOperator_OrderBy["AccountTokenSnapshot__activeOutgoingStreamCount"] = "accountTokenSnapshot__activeOutgoingStreamCount";
    FlowOperator_OrderBy["AccountTokenSnapshot__adminOfPoolCount"] = "accountTokenSnapshot__adminOfPoolCount";
    FlowOperator_OrderBy["AccountTokenSnapshot__balanceLastUpdatedFromRpcBlocknumber"] = "accountTokenSnapshot__balanceLastUpdatedFromRpcBlocknumber";
    FlowOperator_OrderBy["AccountTokenSnapshot__balanceUntilUpdatedAt"] = "accountTokenSnapshot__balanceUntilUpdatedAt";
    FlowOperator_OrderBy["AccountTokenSnapshot__createdAtBlockNumber"] = "accountTokenSnapshot__createdAtBlockNumber";
    FlowOperator_OrderBy["AccountTokenSnapshot__createdAtTimestamp"] = "accountTokenSnapshot__createdAtTimestamp";
    FlowOperator_OrderBy["AccountTokenSnapshot__id"] = "accountTokenSnapshot__id";
    FlowOperator_OrderBy["AccountTokenSnapshot__inactiveCFAOutgoingStreamCount"] = "accountTokenSnapshot__inactiveCFAOutgoingStreamCount";
    FlowOperator_OrderBy["AccountTokenSnapshot__inactiveGDAOutgoingStreamCount"] = "accountTokenSnapshot__inactiveGDAOutgoingStreamCount";
    FlowOperator_OrderBy["AccountTokenSnapshot__inactiveIncomingStreamCount"] = "accountTokenSnapshot__inactiveIncomingStreamCount";
    FlowOperator_OrderBy["AccountTokenSnapshot__inactiveOutgoingStreamCount"] = "accountTokenSnapshot__inactiveOutgoingStreamCount";
    FlowOperator_OrderBy["AccountTokenSnapshot__isLiquidationEstimateOptimistic"] = "accountTokenSnapshot__isLiquidationEstimateOptimistic";
    FlowOperator_OrderBy["AccountTokenSnapshot__maybeCriticalAtTimestamp"] = "accountTokenSnapshot__maybeCriticalAtTimestamp";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalAmountStreamedInUntilUpdatedAt"] = "accountTokenSnapshot__totalAmountStreamedInUntilUpdatedAt";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalAmountStreamedOutUntilUpdatedAt"] = "accountTokenSnapshot__totalAmountStreamedOutUntilUpdatedAt";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalAmountStreamedUntilUpdatedAt"] = "accountTokenSnapshot__totalAmountStreamedUntilUpdatedAt";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalAmountTransferredUntilUpdatedAt"] = "accountTokenSnapshot__totalAmountTransferredUntilUpdatedAt";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalApprovedSubscriptions"] = "accountTokenSnapshot__totalApprovedSubscriptions";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalCFAAmountStreamedOutUntilUpdatedAt"] = "accountTokenSnapshot__totalCFAAmountStreamedOutUntilUpdatedAt";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalCFAAmountStreamedUntilUpdatedAt"] = "accountTokenSnapshot__totalCFAAmountStreamedUntilUpdatedAt";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalCFADeposit"] = "accountTokenSnapshot__totalCFADeposit";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalCFANetFlowRate"] = "accountTokenSnapshot__totalCFANetFlowRate";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalCFANumberOfActiveStreams"] = "accountTokenSnapshot__totalCFANumberOfActiveStreams";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalCFANumberOfClosedStreams"] = "accountTokenSnapshot__totalCFANumberOfClosedStreams";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalCFAOutflowRate"] = "accountTokenSnapshot__totalCFAOutflowRate";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalConnectedMemberships"] = "accountTokenSnapshot__totalConnectedMemberships";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalDeposit"] = "accountTokenSnapshot__totalDeposit";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalGDADeposit"] = "accountTokenSnapshot__totalGDADeposit";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalGDANumberOfActiveStreams"] = "accountTokenSnapshot__totalGDANumberOfActiveStreams";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalGDANumberOfClosedStreams"] = "accountTokenSnapshot__totalGDANumberOfClosedStreams";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalGDAOutflowRate"] = "accountTokenSnapshot__totalGDAOutflowRate";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalInflowRate"] = "accountTokenSnapshot__totalInflowRate";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalMembershipsWithUnits"] = "accountTokenSnapshot__totalMembershipsWithUnits";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalNetFlowRate"] = "accountTokenSnapshot__totalNetFlowRate";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalNumberOfActiveStreams"] = "accountTokenSnapshot__totalNumberOfActiveStreams";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalNumberOfClosedStreams"] = "accountTokenSnapshot__totalNumberOfClosedStreams";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalOutflowRate"] = "accountTokenSnapshot__totalOutflowRate";
    FlowOperator_OrderBy["AccountTokenSnapshot__totalSubscriptionsWithUnits"] = "accountTokenSnapshot__totalSubscriptionsWithUnits";
    FlowOperator_OrderBy["AccountTokenSnapshot__updatedAtBlockNumber"] = "accountTokenSnapshot__updatedAtBlockNumber";
    FlowOperator_OrderBy["AccountTokenSnapshot__updatedAtTimestamp"] = "accountTokenSnapshot__updatedAtTimestamp";
    FlowOperator_OrderBy["Allowance"] = "allowance";
    FlowOperator_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    FlowOperator_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    FlowOperator_OrderBy["FlowOperator"] = "flowOperator";
    FlowOperator_OrderBy["FlowOperatorUpdatedEvents"] = "flowOperatorUpdatedEvents";
    FlowOperator_OrderBy["FlowRateAllowanceGranted"] = "flowRateAllowanceGranted";
    FlowOperator_OrderBy["FlowRateAllowanceRemaining"] = "flowRateAllowanceRemaining";
    FlowOperator_OrderBy["Id"] = "id";
    FlowOperator_OrderBy["Permissions"] = "permissions";
    FlowOperator_OrderBy["Sender"] = "sender";
    FlowOperator_OrderBy["Sender__createdAtBlockNumber"] = "sender__createdAtBlockNumber";
    FlowOperator_OrderBy["Sender__createdAtTimestamp"] = "sender__createdAtTimestamp";
    FlowOperator_OrderBy["Sender__id"] = "sender__id";
    FlowOperator_OrderBy["Sender__isSuperApp"] = "sender__isSuperApp";
    FlowOperator_OrderBy["Sender__updatedAtBlockNumber"] = "sender__updatedAtBlockNumber";
    FlowOperator_OrderBy["Sender__updatedAtTimestamp"] = "sender__updatedAtTimestamp";
    FlowOperator_OrderBy["Token"] = "token";
    FlowOperator_OrderBy["Token__createdAtBlockNumber"] = "token__createdAtBlockNumber";
    FlowOperator_OrderBy["Token__createdAtTimestamp"] = "token__createdAtTimestamp";
    FlowOperator_OrderBy["Token__decimals"] = "token__decimals";
    FlowOperator_OrderBy["Token__id"] = "token__id";
    FlowOperator_OrderBy["Token__isListed"] = "token__isListed";
    FlowOperator_OrderBy["Token__isNativeAssetSuperToken"] = "token__isNativeAssetSuperToken";
    FlowOperator_OrderBy["Token__isSuperToken"] = "token__isSuperToken";
    FlowOperator_OrderBy["Token__name"] = "token__name";
    FlowOperator_OrderBy["Token__symbol"] = "token__symbol";
    FlowOperator_OrderBy["Token__underlyingAddress"] = "token__underlyingAddress";
    FlowOperator_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    FlowOperator_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
})(FlowOperator_OrderBy || (exports.FlowOperator_OrderBy = FlowOperator_OrderBy = {}));
var FlowUpdatedEvent_OrderBy;
(function(FlowUpdatedEvent_OrderBy) {
    FlowUpdatedEvent_OrderBy["Addresses"] = "addresses";
    FlowUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    FlowUpdatedEvent_OrderBy["Deposit"] = "deposit";
    FlowUpdatedEvent_OrderBy["FlowOperator"] = "flowOperator";
    FlowUpdatedEvent_OrderBy["FlowRate"] = "flowRate";
    FlowUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    FlowUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    FlowUpdatedEvent_OrderBy["Id"] = "id";
    FlowUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    FlowUpdatedEvent_OrderBy["Name"] = "name";
    FlowUpdatedEvent_OrderBy["OldFlowRate"] = "oldFlowRate";
    FlowUpdatedEvent_OrderBy["Order"] = "order";
    FlowUpdatedEvent_OrderBy["Receiver"] = "receiver";
    FlowUpdatedEvent_OrderBy["Sender"] = "sender";
    FlowUpdatedEvent_OrderBy["Stream"] = "stream";
    FlowUpdatedEvent_OrderBy["Stream__createdAtBlockNumber"] = "stream__createdAtBlockNumber";
    FlowUpdatedEvent_OrderBy["Stream__createdAtTimestamp"] = "stream__createdAtTimestamp";
    FlowUpdatedEvent_OrderBy["Stream__currentFlowRate"] = "stream__currentFlowRate";
    FlowUpdatedEvent_OrderBy["Stream__deposit"] = "stream__deposit";
    FlowUpdatedEvent_OrderBy["Stream__id"] = "stream__id";
    FlowUpdatedEvent_OrderBy["Stream__streamedUntilUpdatedAt"] = "stream__streamedUntilUpdatedAt";
    FlowUpdatedEvent_OrderBy["Stream__updatedAtBlockNumber"] = "stream__updatedAtBlockNumber";
    FlowUpdatedEvent_OrderBy["Stream__updatedAtTimestamp"] = "stream__updatedAtTimestamp";
    FlowUpdatedEvent_OrderBy["Stream__userData"] = "stream__userData";
    FlowUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    FlowUpdatedEvent_OrderBy["Token"] = "token";
    FlowUpdatedEvent_OrderBy["TotalAmountStreamedUntilTimestamp"] = "totalAmountStreamedUntilTimestamp";
    FlowUpdatedEvent_OrderBy["TotalReceiverFlowRate"] = "totalReceiverFlowRate";
    FlowUpdatedEvent_OrderBy["TotalSenderFlowRate"] = "totalSenderFlowRate";
    FlowUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
    FlowUpdatedEvent_OrderBy["Type"] = "type";
    FlowUpdatedEvent_OrderBy["UserData"] = "userData";
})(FlowUpdatedEvent_OrderBy || (exports.FlowUpdatedEvent_OrderBy = FlowUpdatedEvent_OrderBy = {}));
var GovernanceReplacedEvent_OrderBy;
(function(GovernanceReplacedEvent_OrderBy) {
    GovernanceReplacedEvent_OrderBy["Addresses"] = "addresses";
    GovernanceReplacedEvent_OrderBy["BlockNumber"] = "blockNumber";
    GovernanceReplacedEvent_OrderBy["GasPrice"] = "gasPrice";
    GovernanceReplacedEvent_OrderBy["GasUsed"] = "gasUsed";
    GovernanceReplacedEvent_OrderBy["Id"] = "id";
    GovernanceReplacedEvent_OrderBy["LogIndex"] = "logIndex";
    GovernanceReplacedEvent_OrderBy["Name"] = "name";
    GovernanceReplacedEvent_OrderBy["NewGovernance"] = "newGovernance";
    GovernanceReplacedEvent_OrderBy["OldGovernance"] = "oldGovernance";
    GovernanceReplacedEvent_OrderBy["Order"] = "order";
    GovernanceReplacedEvent_OrderBy["Timestamp"] = "timestamp";
    GovernanceReplacedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(GovernanceReplacedEvent_OrderBy || (exports.GovernanceReplacedEvent_OrderBy = GovernanceReplacedEvent_OrderBy = {}));
var IndexCreatedEvent_OrderBy;
(function(IndexCreatedEvent_OrderBy) {
    IndexCreatedEvent_OrderBy["Addresses"] = "addresses";
    IndexCreatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    IndexCreatedEvent_OrderBy["GasPrice"] = "gasPrice";
    IndexCreatedEvent_OrderBy["GasUsed"] = "gasUsed";
    IndexCreatedEvent_OrderBy["Id"] = "id";
    IndexCreatedEvent_OrderBy["Index"] = "index";
    IndexCreatedEvent_OrderBy["IndexId"] = "indexId";
    IndexCreatedEvent_OrderBy["Index__createdAtBlockNumber"] = "index__createdAtBlockNumber";
    IndexCreatedEvent_OrderBy["Index__createdAtTimestamp"] = "index__createdAtTimestamp";
    IndexCreatedEvent_OrderBy["Index__id"] = "index__id";
    IndexCreatedEvent_OrderBy["Index__indexId"] = "index__indexId";
    IndexCreatedEvent_OrderBy["Index__indexValue"] = "index__indexValue";
    IndexCreatedEvent_OrderBy["Index__totalAmountDistributedUntilUpdatedAt"] = "index__totalAmountDistributedUntilUpdatedAt";
    IndexCreatedEvent_OrderBy["Index__totalSubscriptionsWithUnits"] = "index__totalSubscriptionsWithUnits";
    IndexCreatedEvent_OrderBy["Index__totalUnits"] = "index__totalUnits";
    IndexCreatedEvent_OrderBy["Index__totalUnitsApproved"] = "index__totalUnitsApproved";
    IndexCreatedEvent_OrderBy["Index__totalUnitsPending"] = "index__totalUnitsPending";
    IndexCreatedEvent_OrderBy["Index__updatedAtBlockNumber"] = "index__updatedAtBlockNumber";
    IndexCreatedEvent_OrderBy["Index__updatedAtTimestamp"] = "index__updatedAtTimestamp";
    IndexCreatedEvent_OrderBy["LogIndex"] = "logIndex";
    IndexCreatedEvent_OrderBy["Name"] = "name";
    IndexCreatedEvent_OrderBy["Order"] = "order";
    IndexCreatedEvent_OrderBy["Publisher"] = "publisher";
    IndexCreatedEvent_OrderBy["Timestamp"] = "timestamp";
    IndexCreatedEvent_OrderBy["Token"] = "token";
    IndexCreatedEvent_OrderBy["TransactionHash"] = "transactionHash";
    IndexCreatedEvent_OrderBy["UserData"] = "userData";
})(IndexCreatedEvent_OrderBy || (exports.IndexCreatedEvent_OrderBy = IndexCreatedEvent_OrderBy = {}));
var IndexDistributionClaimedEvent_OrderBy;
(function(IndexDistributionClaimedEvent_OrderBy) {
    IndexDistributionClaimedEvent_OrderBy["Addresses"] = "addresses";
    IndexDistributionClaimedEvent_OrderBy["Amount"] = "amount";
    IndexDistributionClaimedEvent_OrderBy["BlockNumber"] = "blockNumber";
    IndexDistributionClaimedEvent_OrderBy["GasPrice"] = "gasPrice";
    IndexDistributionClaimedEvent_OrderBy["GasUsed"] = "gasUsed";
    IndexDistributionClaimedEvent_OrderBy["Id"] = "id";
    IndexDistributionClaimedEvent_OrderBy["Index"] = "index";
    IndexDistributionClaimedEvent_OrderBy["IndexId"] = "indexId";
    IndexDistributionClaimedEvent_OrderBy["Index__createdAtBlockNumber"] = "index__createdAtBlockNumber";
    IndexDistributionClaimedEvent_OrderBy["Index__createdAtTimestamp"] = "index__createdAtTimestamp";
    IndexDistributionClaimedEvent_OrderBy["Index__id"] = "index__id";
    IndexDistributionClaimedEvent_OrderBy["Index__indexId"] = "index__indexId";
    IndexDistributionClaimedEvent_OrderBy["Index__indexValue"] = "index__indexValue";
    IndexDistributionClaimedEvent_OrderBy["Index__totalAmountDistributedUntilUpdatedAt"] = "index__totalAmountDistributedUntilUpdatedAt";
    IndexDistributionClaimedEvent_OrderBy["Index__totalSubscriptionsWithUnits"] = "index__totalSubscriptionsWithUnits";
    IndexDistributionClaimedEvent_OrderBy["Index__totalUnits"] = "index__totalUnits";
    IndexDistributionClaimedEvent_OrderBy["Index__totalUnitsApproved"] = "index__totalUnitsApproved";
    IndexDistributionClaimedEvent_OrderBy["Index__totalUnitsPending"] = "index__totalUnitsPending";
    IndexDistributionClaimedEvent_OrderBy["Index__updatedAtBlockNumber"] = "index__updatedAtBlockNumber";
    IndexDistributionClaimedEvent_OrderBy["Index__updatedAtTimestamp"] = "index__updatedAtTimestamp";
    IndexDistributionClaimedEvent_OrderBy["LogIndex"] = "logIndex";
    IndexDistributionClaimedEvent_OrderBy["Name"] = "name";
    IndexDistributionClaimedEvent_OrderBy["Order"] = "order";
    IndexDistributionClaimedEvent_OrderBy["Publisher"] = "publisher";
    IndexDistributionClaimedEvent_OrderBy["Subscriber"] = "subscriber";
    IndexDistributionClaimedEvent_OrderBy["Timestamp"] = "timestamp";
    IndexDistributionClaimedEvent_OrderBy["Token"] = "token";
    IndexDistributionClaimedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(IndexDistributionClaimedEvent_OrderBy || (exports.IndexDistributionClaimedEvent_OrderBy = IndexDistributionClaimedEvent_OrderBy = {}));
var IndexSubscribedEvent_OrderBy;
(function(IndexSubscribedEvent_OrderBy) {
    IndexSubscribedEvent_OrderBy["Addresses"] = "addresses";
    IndexSubscribedEvent_OrderBy["BlockNumber"] = "blockNumber";
    IndexSubscribedEvent_OrderBy["GasPrice"] = "gasPrice";
    IndexSubscribedEvent_OrderBy["GasUsed"] = "gasUsed";
    IndexSubscribedEvent_OrderBy["Id"] = "id";
    IndexSubscribedEvent_OrderBy["Index"] = "index";
    IndexSubscribedEvent_OrderBy["IndexId"] = "indexId";
    IndexSubscribedEvent_OrderBy["Index__createdAtBlockNumber"] = "index__createdAtBlockNumber";
    IndexSubscribedEvent_OrderBy["Index__createdAtTimestamp"] = "index__createdAtTimestamp";
    IndexSubscribedEvent_OrderBy["Index__id"] = "index__id";
    IndexSubscribedEvent_OrderBy["Index__indexId"] = "index__indexId";
    IndexSubscribedEvent_OrderBy["Index__indexValue"] = "index__indexValue";
    IndexSubscribedEvent_OrderBy["Index__totalAmountDistributedUntilUpdatedAt"] = "index__totalAmountDistributedUntilUpdatedAt";
    IndexSubscribedEvent_OrderBy["Index__totalSubscriptionsWithUnits"] = "index__totalSubscriptionsWithUnits";
    IndexSubscribedEvent_OrderBy["Index__totalUnits"] = "index__totalUnits";
    IndexSubscribedEvent_OrderBy["Index__totalUnitsApproved"] = "index__totalUnitsApproved";
    IndexSubscribedEvent_OrderBy["Index__totalUnitsPending"] = "index__totalUnitsPending";
    IndexSubscribedEvent_OrderBy["Index__updatedAtBlockNumber"] = "index__updatedAtBlockNumber";
    IndexSubscribedEvent_OrderBy["Index__updatedAtTimestamp"] = "index__updatedAtTimestamp";
    IndexSubscribedEvent_OrderBy["LogIndex"] = "logIndex";
    IndexSubscribedEvent_OrderBy["Name"] = "name";
    IndexSubscribedEvent_OrderBy["Order"] = "order";
    IndexSubscribedEvent_OrderBy["Publisher"] = "publisher";
    IndexSubscribedEvent_OrderBy["Subscriber"] = "subscriber";
    IndexSubscribedEvent_OrderBy["Timestamp"] = "timestamp";
    IndexSubscribedEvent_OrderBy["Token"] = "token";
    IndexSubscribedEvent_OrderBy["TransactionHash"] = "transactionHash";
    IndexSubscribedEvent_OrderBy["UserData"] = "userData";
})(IndexSubscribedEvent_OrderBy || (exports.IndexSubscribedEvent_OrderBy = IndexSubscribedEvent_OrderBy = {}));
var IndexSubscription_OrderBy;
(function(IndexSubscription_OrderBy) {
    IndexSubscription_OrderBy["Approved"] = "approved";
    IndexSubscription_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    IndexSubscription_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    IndexSubscription_OrderBy["Id"] = "id";
    IndexSubscription_OrderBy["Index"] = "index";
    IndexSubscription_OrderBy["IndexValueUntilUpdatedAt"] = "indexValueUntilUpdatedAt";
    IndexSubscription_OrderBy["Index__createdAtBlockNumber"] = "index__createdAtBlockNumber";
    IndexSubscription_OrderBy["Index__createdAtTimestamp"] = "index__createdAtTimestamp";
    IndexSubscription_OrderBy["Index__id"] = "index__id";
    IndexSubscription_OrderBy["Index__indexId"] = "index__indexId";
    IndexSubscription_OrderBy["Index__indexValue"] = "index__indexValue";
    IndexSubscription_OrderBy["Index__totalAmountDistributedUntilUpdatedAt"] = "index__totalAmountDistributedUntilUpdatedAt";
    IndexSubscription_OrderBy["Index__totalSubscriptionsWithUnits"] = "index__totalSubscriptionsWithUnits";
    IndexSubscription_OrderBy["Index__totalUnits"] = "index__totalUnits";
    IndexSubscription_OrderBy["Index__totalUnitsApproved"] = "index__totalUnitsApproved";
    IndexSubscription_OrderBy["Index__totalUnitsPending"] = "index__totalUnitsPending";
    IndexSubscription_OrderBy["Index__updatedAtBlockNumber"] = "index__updatedAtBlockNumber";
    IndexSubscription_OrderBy["Index__updatedAtTimestamp"] = "index__updatedAtTimestamp";
    IndexSubscription_OrderBy["Subscriber"] = "subscriber";
    IndexSubscription_OrderBy["Subscriber__createdAtBlockNumber"] = "subscriber__createdAtBlockNumber";
    IndexSubscription_OrderBy["Subscriber__createdAtTimestamp"] = "subscriber__createdAtTimestamp";
    IndexSubscription_OrderBy["Subscriber__id"] = "subscriber__id";
    IndexSubscription_OrderBy["Subscriber__isSuperApp"] = "subscriber__isSuperApp";
    IndexSubscription_OrderBy["Subscriber__updatedAtBlockNumber"] = "subscriber__updatedAtBlockNumber";
    IndexSubscription_OrderBy["Subscriber__updatedAtTimestamp"] = "subscriber__updatedAtTimestamp";
    IndexSubscription_OrderBy["SubscriptionApprovedEvents"] = "subscriptionApprovedEvents";
    IndexSubscription_OrderBy["SubscriptionDistributionClaimedEvents"] = "subscriptionDistributionClaimedEvents";
    IndexSubscription_OrderBy["SubscriptionRevokedEvents"] = "subscriptionRevokedEvents";
    IndexSubscription_OrderBy["SubscriptionUnitsUpdatedEvents"] = "subscriptionUnitsUpdatedEvents";
    IndexSubscription_OrderBy["TotalAmountReceivedUntilUpdatedAt"] = "totalAmountReceivedUntilUpdatedAt";
    IndexSubscription_OrderBy["Units"] = "units";
    IndexSubscription_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    IndexSubscription_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
})(IndexSubscription_OrderBy || (exports.IndexSubscription_OrderBy = IndexSubscription_OrderBy = {}));
var IndexUnitsUpdatedEvent_OrderBy;
(function(IndexUnitsUpdatedEvent_OrderBy) {
    IndexUnitsUpdatedEvent_OrderBy["Addresses"] = "addresses";
    IndexUnitsUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    IndexUnitsUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    IndexUnitsUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    IndexUnitsUpdatedEvent_OrderBy["Id"] = "id";
    IndexUnitsUpdatedEvent_OrderBy["Index"] = "index";
    IndexUnitsUpdatedEvent_OrderBy["IndexId"] = "indexId";
    IndexUnitsUpdatedEvent_OrderBy["Index__createdAtBlockNumber"] = "index__createdAtBlockNumber";
    IndexUnitsUpdatedEvent_OrderBy["Index__createdAtTimestamp"] = "index__createdAtTimestamp";
    IndexUnitsUpdatedEvent_OrderBy["Index__id"] = "index__id";
    IndexUnitsUpdatedEvent_OrderBy["Index__indexId"] = "index__indexId";
    IndexUnitsUpdatedEvent_OrderBy["Index__indexValue"] = "index__indexValue";
    IndexUnitsUpdatedEvent_OrderBy["Index__totalAmountDistributedUntilUpdatedAt"] = "index__totalAmountDistributedUntilUpdatedAt";
    IndexUnitsUpdatedEvent_OrderBy["Index__totalSubscriptionsWithUnits"] = "index__totalSubscriptionsWithUnits";
    IndexUnitsUpdatedEvent_OrderBy["Index__totalUnits"] = "index__totalUnits";
    IndexUnitsUpdatedEvent_OrderBy["Index__totalUnitsApproved"] = "index__totalUnitsApproved";
    IndexUnitsUpdatedEvent_OrderBy["Index__totalUnitsPending"] = "index__totalUnitsPending";
    IndexUnitsUpdatedEvent_OrderBy["Index__updatedAtBlockNumber"] = "index__updatedAtBlockNumber";
    IndexUnitsUpdatedEvent_OrderBy["Index__updatedAtTimestamp"] = "index__updatedAtTimestamp";
    IndexUnitsUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    IndexUnitsUpdatedEvent_OrderBy["Name"] = "name";
    IndexUnitsUpdatedEvent_OrderBy["OldUnits"] = "oldUnits";
    IndexUnitsUpdatedEvent_OrderBy["Order"] = "order";
    IndexUnitsUpdatedEvent_OrderBy["Publisher"] = "publisher";
    IndexUnitsUpdatedEvent_OrderBy["Subscriber"] = "subscriber";
    IndexUnitsUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    IndexUnitsUpdatedEvent_OrderBy["Token"] = "token";
    IndexUnitsUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
    IndexUnitsUpdatedEvent_OrderBy["Units"] = "units";
    IndexUnitsUpdatedEvent_OrderBy["UserData"] = "userData";
})(IndexUnitsUpdatedEvent_OrderBy || (exports.IndexUnitsUpdatedEvent_OrderBy = IndexUnitsUpdatedEvent_OrderBy = {}));
var IndexUnsubscribedEvent_OrderBy;
(function(IndexUnsubscribedEvent_OrderBy) {
    IndexUnsubscribedEvent_OrderBy["Addresses"] = "addresses";
    IndexUnsubscribedEvent_OrderBy["BlockNumber"] = "blockNumber";
    IndexUnsubscribedEvent_OrderBy["GasPrice"] = "gasPrice";
    IndexUnsubscribedEvent_OrderBy["GasUsed"] = "gasUsed";
    IndexUnsubscribedEvent_OrderBy["Id"] = "id";
    IndexUnsubscribedEvent_OrderBy["Index"] = "index";
    IndexUnsubscribedEvent_OrderBy["IndexId"] = "indexId";
    IndexUnsubscribedEvent_OrderBy["Index__createdAtBlockNumber"] = "index__createdAtBlockNumber";
    IndexUnsubscribedEvent_OrderBy["Index__createdAtTimestamp"] = "index__createdAtTimestamp";
    IndexUnsubscribedEvent_OrderBy["Index__id"] = "index__id";
    IndexUnsubscribedEvent_OrderBy["Index__indexId"] = "index__indexId";
    IndexUnsubscribedEvent_OrderBy["Index__indexValue"] = "index__indexValue";
    IndexUnsubscribedEvent_OrderBy["Index__totalAmountDistributedUntilUpdatedAt"] = "index__totalAmountDistributedUntilUpdatedAt";
    IndexUnsubscribedEvent_OrderBy["Index__totalSubscriptionsWithUnits"] = "index__totalSubscriptionsWithUnits";
    IndexUnsubscribedEvent_OrderBy["Index__totalUnits"] = "index__totalUnits";
    IndexUnsubscribedEvent_OrderBy["Index__totalUnitsApproved"] = "index__totalUnitsApproved";
    IndexUnsubscribedEvent_OrderBy["Index__totalUnitsPending"] = "index__totalUnitsPending";
    IndexUnsubscribedEvent_OrderBy["Index__updatedAtBlockNumber"] = "index__updatedAtBlockNumber";
    IndexUnsubscribedEvent_OrderBy["Index__updatedAtTimestamp"] = "index__updatedAtTimestamp";
    IndexUnsubscribedEvent_OrderBy["LogIndex"] = "logIndex";
    IndexUnsubscribedEvent_OrderBy["Name"] = "name";
    IndexUnsubscribedEvent_OrderBy["Order"] = "order";
    IndexUnsubscribedEvent_OrderBy["Publisher"] = "publisher";
    IndexUnsubscribedEvent_OrderBy["Subscriber"] = "subscriber";
    IndexUnsubscribedEvent_OrderBy["Timestamp"] = "timestamp";
    IndexUnsubscribedEvent_OrderBy["Token"] = "token";
    IndexUnsubscribedEvent_OrderBy["TransactionHash"] = "transactionHash";
    IndexUnsubscribedEvent_OrderBy["UserData"] = "userData";
})(IndexUnsubscribedEvent_OrderBy || (exports.IndexUnsubscribedEvent_OrderBy = IndexUnsubscribedEvent_OrderBy = {}));
var IndexUpdatedEvent_OrderBy;
(function(IndexUpdatedEvent_OrderBy) {
    IndexUpdatedEvent_OrderBy["Addresses"] = "addresses";
    IndexUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    IndexUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    IndexUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    IndexUpdatedEvent_OrderBy["Id"] = "id";
    IndexUpdatedEvent_OrderBy["Index"] = "index";
    IndexUpdatedEvent_OrderBy["IndexId"] = "indexId";
    IndexUpdatedEvent_OrderBy["Index__createdAtBlockNumber"] = "index__createdAtBlockNumber";
    IndexUpdatedEvent_OrderBy["Index__createdAtTimestamp"] = "index__createdAtTimestamp";
    IndexUpdatedEvent_OrderBy["Index__id"] = "index__id";
    IndexUpdatedEvent_OrderBy["Index__indexId"] = "index__indexId";
    IndexUpdatedEvent_OrderBy["Index__indexValue"] = "index__indexValue";
    IndexUpdatedEvent_OrderBy["Index__totalAmountDistributedUntilUpdatedAt"] = "index__totalAmountDistributedUntilUpdatedAt";
    IndexUpdatedEvent_OrderBy["Index__totalSubscriptionsWithUnits"] = "index__totalSubscriptionsWithUnits";
    IndexUpdatedEvent_OrderBy["Index__totalUnits"] = "index__totalUnits";
    IndexUpdatedEvent_OrderBy["Index__totalUnitsApproved"] = "index__totalUnitsApproved";
    IndexUpdatedEvent_OrderBy["Index__totalUnitsPending"] = "index__totalUnitsPending";
    IndexUpdatedEvent_OrderBy["Index__updatedAtBlockNumber"] = "index__updatedAtBlockNumber";
    IndexUpdatedEvent_OrderBy["Index__updatedAtTimestamp"] = "index__updatedAtTimestamp";
    IndexUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    IndexUpdatedEvent_OrderBy["Name"] = "name";
    IndexUpdatedEvent_OrderBy["NewIndexValue"] = "newIndexValue";
    IndexUpdatedEvent_OrderBy["OldIndexValue"] = "oldIndexValue";
    IndexUpdatedEvent_OrderBy["Order"] = "order";
    IndexUpdatedEvent_OrderBy["Publisher"] = "publisher";
    IndexUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    IndexUpdatedEvent_OrderBy["Token"] = "token";
    IndexUpdatedEvent_OrderBy["TotalUnitsApproved"] = "totalUnitsApproved";
    IndexUpdatedEvent_OrderBy["TotalUnitsPending"] = "totalUnitsPending";
    IndexUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
    IndexUpdatedEvent_OrderBy["UserData"] = "userData";
})(IndexUpdatedEvent_OrderBy || (exports.IndexUpdatedEvent_OrderBy = IndexUpdatedEvent_OrderBy = {}));
var Index_OrderBy;
(function(Index_OrderBy) {
    Index_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    Index_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    Index_OrderBy["Id"] = "id";
    Index_OrderBy["IndexCreatedEvent"] = "indexCreatedEvent";
    Index_OrderBy["IndexCreatedEvent__blockNumber"] = "indexCreatedEvent__blockNumber";
    Index_OrderBy["IndexCreatedEvent__gasPrice"] = "indexCreatedEvent__gasPrice";
    Index_OrderBy["IndexCreatedEvent__gasUsed"] = "indexCreatedEvent__gasUsed";
    Index_OrderBy["IndexCreatedEvent__id"] = "indexCreatedEvent__id";
    Index_OrderBy["IndexCreatedEvent__indexId"] = "indexCreatedEvent__indexId";
    Index_OrderBy["IndexCreatedEvent__logIndex"] = "indexCreatedEvent__logIndex";
    Index_OrderBy["IndexCreatedEvent__name"] = "indexCreatedEvent__name";
    Index_OrderBy["IndexCreatedEvent__order"] = "indexCreatedEvent__order";
    Index_OrderBy["IndexCreatedEvent__publisher"] = "indexCreatedEvent__publisher";
    Index_OrderBy["IndexCreatedEvent__timestamp"] = "indexCreatedEvent__timestamp";
    Index_OrderBy["IndexCreatedEvent__token"] = "indexCreatedEvent__token";
    Index_OrderBy["IndexCreatedEvent__transactionHash"] = "indexCreatedEvent__transactionHash";
    Index_OrderBy["IndexCreatedEvent__userData"] = "indexCreatedEvent__userData";
    Index_OrderBy["IndexDistributionClaimedEvents"] = "indexDistributionClaimedEvents";
    Index_OrderBy["IndexId"] = "indexId";
    Index_OrderBy["IndexSubscribedEvents"] = "indexSubscribedEvents";
    Index_OrderBy["IndexUnitsUpdatedEvents"] = "indexUnitsUpdatedEvents";
    Index_OrderBy["IndexUnsubscribedEvents"] = "indexUnsubscribedEvents";
    Index_OrderBy["IndexUpdatedEvents"] = "indexUpdatedEvents";
    Index_OrderBy["IndexValue"] = "indexValue";
    Index_OrderBy["Publisher"] = "publisher";
    Index_OrderBy["Publisher__createdAtBlockNumber"] = "publisher__createdAtBlockNumber";
    Index_OrderBy["Publisher__createdAtTimestamp"] = "publisher__createdAtTimestamp";
    Index_OrderBy["Publisher__id"] = "publisher__id";
    Index_OrderBy["Publisher__isSuperApp"] = "publisher__isSuperApp";
    Index_OrderBy["Publisher__updatedAtBlockNumber"] = "publisher__updatedAtBlockNumber";
    Index_OrderBy["Publisher__updatedAtTimestamp"] = "publisher__updatedAtTimestamp";
    Index_OrderBy["Subscriptions"] = "subscriptions";
    Index_OrderBy["Token"] = "token";
    Index_OrderBy["Token__createdAtBlockNumber"] = "token__createdAtBlockNumber";
    Index_OrderBy["Token__createdAtTimestamp"] = "token__createdAtTimestamp";
    Index_OrderBy["Token__decimals"] = "token__decimals";
    Index_OrderBy["Token__id"] = "token__id";
    Index_OrderBy["Token__isListed"] = "token__isListed";
    Index_OrderBy["Token__isNativeAssetSuperToken"] = "token__isNativeAssetSuperToken";
    Index_OrderBy["Token__isSuperToken"] = "token__isSuperToken";
    Index_OrderBy["Token__name"] = "token__name";
    Index_OrderBy["Token__symbol"] = "token__symbol";
    Index_OrderBy["Token__underlyingAddress"] = "token__underlyingAddress";
    Index_OrderBy["TotalAmountDistributedUntilUpdatedAt"] = "totalAmountDistributedUntilUpdatedAt";
    Index_OrderBy["TotalSubscriptionsWithUnits"] = "totalSubscriptionsWithUnits";
    Index_OrderBy["TotalUnits"] = "totalUnits";
    Index_OrderBy["TotalUnitsApproved"] = "totalUnitsApproved";
    Index_OrderBy["TotalUnitsPending"] = "totalUnitsPending";
    Index_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    Index_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
})(Index_OrderBy || (exports.Index_OrderBy = Index_OrderBy = {}));
var InstantDistributionUpdatedEvent_OrderBy;
(function(InstantDistributionUpdatedEvent_OrderBy) {
    InstantDistributionUpdatedEvent_OrderBy["ActualAmount"] = "actualAmount";
    InstantDistributionUpdatedEvent_OrderBy["Addresses"] = "addresses";
    InstantDistributionUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    InstantDistributionUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    InstantDistributionUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    InstantDistributionUpdatedEvent_OrderBy["Id"] = "id";
    InstantDistributionUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    InstantDistributionUpdatedEvent_OrderBy["Name"] = "name";
    InstantDistributionUpdatedEvent_OrderBy["Operator"] = "operator";
    InstantDistributionUpdatedEvent_OrderBy["Order"] = "order";
    InstantDistributionUpdatedEvent_OrderBy["Pool"] = "pool";
    InstantDistributionUpdatedEvent_OrderBy["PoolDistributor"] = "poolDistributor";
    InstantDistributionUpdatedEvent_OrderBy["PoolDistributor__createdAtBlockNumber"] = "poolDistributor__createdAtBlockNumber";
    InstantDistributionUpdatedEvent_OrderBy["PoolDistributor__createdAtTimestamp"] = "poolDistributor__createdAtTimestamp";
    InstantDistributionUpdatedEvent_OrderBy["PoolDistributor__flowRate"] = "poolDistributor__flowRate";
    InstantDistributionUpdatedEvent_OrderBy["PoolDistributor__id"] = "poolDistributor__id";
    InstantDistributionUpdatedEvent_OrderBy["PoolDistributor__totalAmountDistributedUntilUpdatedAt"] = "poolDistributor__totalAmountDistributedUntilUpdatedAt";
    InstantDistributionUpdatedEvent_OrderBy["PoolDistributor__totalAmountFlowedDistributedUntilUpdatedAt"] = "poolDistributor__totalAmountFlowedDistributedUntilUpdatedAt";
    InstantDistributionUpdatedEvent_OrderBy["PoolDistributor__totalAmountInstantlyDistributedUntilUpdatedAt"] = "poolDistributor__totalAmountInstantlyDistributedUntilUpdatedAt";
    InstantDistributionUpdatedEvent_OrderBy["PoolDistributor__totalBuffer"] = "poolDistributor__totalBuffer";
    InstantDistributionUpdatedEvent_OrderBy["PoolDistributor__updatedAtBlockNumber"] = "poolDistributor__updatedAtBlockNumber";
    InstantDistributionUpdatedEvent_OrderBy["PoolDistributor__updatedAtTimestamp"] = "poolDistributor__updatedAtTimestamp";
    InstantDistributionUpdatedEvent_OrderBy["Pool__adjustmentFlowRate"] = "pool__adjustmentFlowRate";
    InstantDistributionUpdatedEvent_OrderBy["Pool__createdAtBlockNumber"] = "pool__createdAtBlockNumber";
    InstantDistributionUpdatedEvent_OrderBy["Pool__createdAtTimestamp"] = "pool__createdAtTimestamp";
    InstantDistributionUpdatedEvent_OrderBy["Pool__flowRate"] = "pool__flowRate";
    InstantDistributionUpdatedEvent_OrderBy["Pool__id"] = "pool__id";
    InstantDistributionUpdatedEvent_OrderBy["Pool__perUnitFlowRate"] = "pool__perUnitFlowRate";
    InstantDistributionUpdatedEvent_OrderBy["Pool__perUnitSettledValue"] = "pool__perUnitSettledValue";
    InstantDistributionUpdatedEvent_OrderBy["Pool__totalAmountDistributedUntilUpdatedAt"] = "pool__totalAmountDistributedUntilUpdatedAt";
    InstantDistributionUpdatedEvent_OrderBy["Pool__totalAmountFlowedDistributedUntilUpdatedAt"] = "pool__totalAmountFlowedDistributedUntilUpdatedAt";
    InstantDistributionUpdatedEvent_OrderBy["Pool__totalAmountInstantlyDistributedUntilUpdatedAt"] = "pool__totalAmountInstantlyDistributedUntilUpdatedAt";
    InstantDistributionUpdatedEvent_OrderBy["Pool__totalBuffer"] = "pool__totalBuffer";
    InstantDistributionUpdatedEvent_OrderBy["Pool__totalConnectedMembers"] = "pool__totalConnectedMembers";
    InstantDistributionUpdatedEvent_OrderBy["Pool__totalConnectedUnits"] = "pool__totalConnectedUnits";
    InstantDistributionUpdatedEvent_OrderBy["Pool__totalDisconnectedMembers"] = "pool__totalDisconnectedMembers";
    InstantDistributionUpdatedEvent_OrderBy["Pool__totalDisconnectedUnits"] = "pool__totalDisconnectedUnits";
    InstantDistributionUpdatedEvent_OrderBy["Pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt"] = "pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt";
    InstantDistributionUpdatedEvent_OrderBy["Pool__totalMembers"] = "pool__totalMembers";
    InstantDistributionUpdatedEvent_OrderBy["Pool__totalUnits"] = "pool__totalUnits";
    InstantDistributionUpdatedEvent_OrderBy["Pool__updatedAtBlockNumber"] = "pool__updatedAtBlockNumber";
    InstantDistributionUpdatedEvent_OrderBy["Pool__updatedAtTimestamp"] = "pool__updatedAtTimestamp";
    InstantDistributionUpdatedEvent_OrderBy["RequestedAmount"] = "requestedAmount";
    InstantDistributionUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    InstantDistributionUpdatedEvent_OrderBy["Token"] = "token";
    InstantDistributionUpdatedEvent_OrderBy["TotalUnits"] = "totalUnits";
    InstantDistributionUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
    InstantDistributionUpdatedEvent_OrderBy["UserData"] = "userData";
})(InstantDistributionUpdatedEvent_OrderBy || (exports.InstantDistributionUpdatedEvent_OrderBy = InstantDistributionUpdatedEvent_OrderBy = {}));
var JailEvent_OrderBy;
(function(JailEvent_OrderBy) {
    JailEvent_OrderBy["Addresses"] = "addresses";
    JailEvent_OrderBy["App"] = "app";
    JailEvent_OrderBy["BlockNumber"] = "blockNumber";
    JailEvent_OrderBy["GasPrice"] = "gasPrice";
    JailEvent_OrderBy["GasUsed"] = "gasUsed";
    JailEvent_OrderBy["Id"] = "id";
    JailEvent_OrderBy["LogIndex"] = "logIndex";
    JailEvent_OrderBy["Name"] = "name";
    JailEvent_OrderBy["Order"] = "order";
    JailEvent_OrderBy["Reason"] = "reason";
    JailEvent_OrderBy["Timestamp"] = "timestamp";
    JailEvent_OrderBy["TransactionHash"] = "transactionHash";
})(JailEvent_OrderBy || (exports.JailEvent_OrderBy = JailEvent_OrderBy = {}));
var MemberUnitsUpdatedEvent_OrderBy;
(function(MemberUnitsUpdatedEvent_OrderBy) {
    MemberUnitsUpdatedEvent_OrderBy["Addresses"] = "addresses";
    MemberUnitsUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    MemberUnitsUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    MemberUnitsUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    MemberUnitsUpdatedEvent_OrderBy["Id"] = "id";
    MemberUnitsUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    MemberUnitsUpdatedEvent_OrderBy["Name"] = "name";
    MemberUnitsUpdatedEvent_OrderBy["OldUnits"] = "oldUnits";
    MemberUnitsUpdatedEvent_OrderBy["Order"] = "order";
    MemberUnitsUpdatedEvent_OrderBy["Pool"] = "pool";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember"] = "poolMember";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__createdAtBlockNumber"] = "poolMember__createdAtBlockNumber";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__createdAtTimestamp"] = "poolMember__createdAtTimestamp";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__id"] = "poolMember__id";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__isConnected"] = "poolMember__isConnected";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__poolTotalAmountDistributedUntilUpdatedAt"] = "poolMember__poolTotalAmountDistributedUntilUpdatedAt";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__syncedPerUnitFlowRate"] = "poolMember__syncedPerUnitFlowRate";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__syncedPerUnitSettledValue"] = "poolMember__syncedPerUnitSettledValue";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__totalAmountClaimed"] = "poolMember__totalAmountClaimed";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__totalAmountReceivedUntilUpdatedAt"] = "poolMember__totalAmountReceivedUntilUpdatedAt";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__units"] = "poolMember__units";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__updatedAtBlockNumber"] = "poolMember__updatedAtBlockNumber";
    MemberUnitsUpdatedEvent_OrderBy["PoolMember__updatedAtTimestamp"] = "poolMember__updatedAtTimestamp";
    MemberUnitsUpdatedEvent_OrderBy["Pool__adjustmentFlowRate"] = "pool__adjustmentFlowRate";
    MemberUnitsUpdatedEvent_OrderBy["Pool__createdAtBlockNumber"] = "pool__createdAtBlockNumber";
    MemberUnitsUpdatedEvent_OrderBy["Pool__createdAtTimestamp"] = "pool__createdAtTimestamp";
    MemberUnitsUpdatedEvent_OrderBy["Pool__flowRate"] = "pool__flowRate";
    MemberUnitsUpdatedEvent_OrderBy["Pool__id"] = "pool__id";
    MemberUnitsUpdatedEvent_OrderBy["Pool__perUnitFlowRate"] = "pool__perUnitFlowRate";
    MemberUnitsUpdatedEvent_OrderBy["Pool__perUnitSettledValue"] = "pool__perUnitSettledValue";
    MemberUnitsUpdatedEvent_OrderBy["Pool__totalAmountDistributedUntilUpdatedAt"] = "pool__totalAmountDistributedUntilUpdatedAt";
    MemberUnitsUpdatedEvent_OrderBy["Pool__totalAmountFlowedDistributedUntilUpdatedAt"] = "pool__totalAmountFlowedDistributedUntilUpdatedAt";
    MemberUnitsUpdatedEvent_OrderBy["Pool__totalAmountInstantlyDistributedUntilUpdatedAt"] = "pool__totalAmountInstantlyDistributedUntilUpdatedAt";
    MemberUnitsUpdatedEvent_OrderBy["Pool__totalBuffer"] = "pool__totalBuffer";
    MemberUnitsUpdatedEvent_OrderBy["Pool__totalConnectedMembers"] = "pool__totalConnectedMembers";
    MemberUnitsUpdatedEvent_OrderBy["Pool__totalConnectedUnits"] = "pool__totalConnectedUnits";
    MemberUnitsUpdatedEvent_OrderBy["Pool__totalDisconnectedMembers"] = "pool__totalDisconnectedMembers";
    MemberUnitsUpdatedEvent_OrderBy["Pool__totalDisconnectedUnits"] = "pool__totalDisconnectedUnits";
    MemberUnitsUpdatedEvent_OrderBy["Pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt"] = "pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt";
    MemberUnitsUpdatedEvent_OrderBy["Pool__totalMembers"] = "pool__totalMembers";
    MemberUnitsUpdatedEvent_OrderBy["Pool__totalUnits"] = "pool__totalUnits";
    MemberUnitsUpdatedEvent_OrderBy["Pool__updatedAtBlockNumber"] = "pool__updatedAtBlockNumber";
    MemberUnitsUpdatedEvent_OrderBy["Pool__updatedAtTimestamp"] = "pool__updatedAtTimestamp";
    MemberUnitsUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    MemberUnitsUpdatedEvent_OrderBy["Token"] = "token";
    MemberUnitsUpdatedEvent_OrderBy["TotalUnits"] = "totalUnits";
    MemberUnitsUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
    MemberUnitsUpdatedEvent_OrderBy["Units"] = "units";
})(MemberUnitsUpdatedEvent_OrderBy || (exports.MemberUnitsUpdatedEvent_OrderBy = MemberUnitsUpdatedEvent_OrderBy = {}));
var MintedEvent_OrderBy;
(function(MintedEvent_OrderBy) {
    MintedEvent_OrderBy["Addresses"] = "addresses";
    MintedEvent_OrderBy["Amount"] = "amount";
    MintedEvent_OrderBy["BlockNumber"] = "blockNumber";
    MintedEvent_OrderBy["Data"] = "data";
    MintedEvent_OrderBy["GasPrice"] = "gasPrice";
    MintedEvent_OrderBy["GasUsed"] = "gasUsed";
    MintedEvent_OrderBy["Id"] = "id";
    MintedEvent_OrderBy["LogIndex"] = "logIndex";
    MintedEvent_OrderBy["Name"] = "name";
    MintedEvent_OrderBy["Operator"] = "operator";
    MintedEvent_OrderBy["OperatorData"] = "operatorData";
    MintedEvent_OrderBy["Order"] = "order";
    MintedEvent_OrderBy["Timestamp"] = "timestamp";
    MintedEvent_OrderBy["To"] = "to";
    MintedEvent_OrderBy["Token"] = "token";
    MintedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(MintedEvent_OrderBy || (exports.MintedEvent_OrderBy = MintedEvent_OrderBy = {}));
var NewPicEvent_OrderBy;
(function(NewPicEvent_OrderBy) {
    NewPicEvent_OrderBy["Addresses"] = "addresses";
    NewPicEvent_OrderBy["BlockNumber"] = "blockNumber";
    NewPicEvent_OrderBy["Bond"] = "bond";
    NewPicEvent_OrderBy["ExitRate"] = "exitRate";
    NewPicEvent_OrderBy["GasPrice"] = "gasPrice";
    NewPicEvent_OrderBy["GasUsed"] = "gasUsed";
    NewPicEvent_OrderBy["Id"] = "id";
    NewPicEvent_OrderBy["LogIndex"] = "logIndex";
    NewPicEvent_OrderBy["Name"] = "name";
    NewPicEvent_OrderBy["Order"] = "order";
    NewPicEvent_OrderBy["Pic"] = "pic";
    NewPicEvent_OrderBy["Timestamp"] = "timestamp";
    NewPicEvent_OrderBy["Token"] = "token";
    NewPicEvent_OrderBy["TransactionHash"] = "transactionHash";
})(NewPicEvent_OrderBy || (exports.NewPicEvent_OrderBy = NewPicEvent_OrderBy = {}));
/** Defines the order direction, either ascending or descending */ var OrderDirection;
(function(OrderDirection) {
    OrderDirection["Asc"] = "asc";
    OrderDirection["Desc"] = "desc";
})(OrderDirection || (exports.OrderDirection = OrderDirection = {}));
var PppConfigurationChangedEvent_OrderBy;
(function(PppConfigurationChangedEvent_OrderBy) {
    PppConfigurationChangedEvent_OrderBy["Addresses"] = "addresses";
    PppConfigurationChangedEvent_OrderBy["BlockNumber"] = "blockNumber";
    PppConfigurationChangedEvent_OrderBy["GasPrice"] = "gasPrice";
    PppConfigurationChangedEvent_OrderBy["GasUsed"] = "gasUsed";
    PppConfigurationChangedEvent_OrderBy["GovernanceAddress"] = "governanceAddress";
    PppConfigurationChangedEvent_OrderBy["Host"] = "host";
    PppConfigurationChangedEvent_OrderBy["Id"] = "id";
    PppConfigurationChangedEvent_OrderBy["IsKeySet"] = "isKeySet";
    PppConfigurationChangedEvent_OrderBy["LiquidationPeriod"] = "liquidationPeriod";
    PppConfigurationChangedEvent_OrderBy["LogIndex"] = "logIndex";
    PppConfigurationChangedEvent_OrderBy["Name"] = "name";
    PppConfigurationChangedEvent_OrderBy["Order"] = "order";
    PppConfigurationChangedEvent_OrderBy["PatricianPeriod"] = "patricianPeriod";
    PppConfigurationChangedEvent_OrderBy["SuperToken"] = "superToken";
    PppConfigurationChangedEvent_OrderBy["Timestamp"] = "timestamp";
    PppConfigurationChangedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(PppConfigurationChangedEvent_OrderBy || (exports.PppConfigurationChangedEvent_OrderBy = PppConfigurationChangedEvent_OrderBy = {}));
var PoolConnectionUpdatedEvent_OrderBy;
(function(PoolConnectionUpdatedEvent_OrderBy) {
    PoolConnectionUpdatedEvent_OrderBy["Addresses"] = "addresses";
    PoolConnectionUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    PoolConnectionUpdatedEvent_OrderBy["Connected"] = "connected";
    PoolConnectionUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    PoolConnectionUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    PoolConnectionUpdatedEvent_OrderBy["Id"] = "id";
    PoolConnectionUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    PoolConnectionUpdatedEvent_OrderBy["Name"] = "name";
    PoolConnectionUpdatedEvent_OrderBy["Order"] = "order";
    PoolConnectionUpdatedEvent_OrderBy["Pool"] = "pool";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember"] = "poolMember";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__createdAtBlockNumber"] = "poolMember__createdAtBlockNumber";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__createdAtTimestamp"] = "poolMember__createdAtTimestamp";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__id"] = "poolMember__id";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__isConnected"] = "poolMember__isConnected";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__poolTotalAmountDistributedUntilUpdatedAt"] = "poolMember__poolTotalAmountDistributedUntilUpdatedAt";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__syncedPerUnitFlowRate"] = "poolMember__syncedPerUnitFlowRate";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__syncedPerUnitSettledValue"] = "poolMember__syncedPerUnitSettledValue";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__totalAmountClaimed"] = "poolMember__totalAmountClaimed";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__totalAmountReceivedUntilUpdatedAt"] = "poolMember__totalAmountReceivedUntilUpdatedAt";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__units"] = "poolMember__units";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__updatedAtBlockNumber"] = "poolMember__updatedAtBlockNumber";
    PoolConnectionUpdatedEvent_OrderBy["PoolMember__updatedAtTimestamp"] = "poolMember__updatedAtTimestamp";
    PoolConnectionUpdatedEvent_OrderBy["Pool__adjustmentFlowRate"] = "pool__adjustmentFlowRate";
    PoolConnectionUpdatedEvent_OrderBy["Pool__createdAtBlockNumber"] = "pool__createdAtBlockNumber";
    PoolConnectionUpdatedEvent_OrderBy["Pool__createdAtTimestamp"] = "pool__createdAtTimestamp";
    PoolConnectionUpdatedEvent_OrderBy["Pool__flowRate"] = "pool__flowRate";
    PoolConnectionUpdatedEvent_OrderBy["Pool__id"] = "pool__id";
    PoolConnectionUpdatedEvent_OrderBy["Pool__perUnitFlowRate"] = "pool__perUnitFlowRate";
    PoolConnectionUpdatedEvent_OrderBy["Pool__perUnitSettledValue"] = "pool__perUnitSettledValue";
    PoolConnectionUpdatedEvent_OrderBy["Pool__totalAmountDistributedUntilUpdatedAt"] = "pool__totalAmountDistributedUntilUpdatedAt";
    PoolConnectionUpdatedEvent_OrderBy["Pool__totalAmountFlowedDistributedUntilUpdatedAt"] = "pool__totalAmountFlowedDistributedUntilUpdatedAt";
    PoolConnectionUpdatedEvent_OrderBy["Pool__totalAmountInstantlyDistributedUntilUpdatedAt"] = "pool__totalAmountInstantlyDistributedUntilUpdatedAt";
    PoolConnectionUpdatedEvent_OrderBy["Pool__totalBuffer"] = "pool__totalBuffer";
    PoolConnectionUpdatedEvent_OrderBy["Pool__totalConnectedMembers"] = "pool__totalConnectedMembers";
    PoolConnectionUpdatedEvent_OrderBy["Pool__totalConnectedUnits"] = "pool__totalConnectedUnits";
    PoolConnectionUpdatedEvent_OrderBy["Pool__totalDisconnectedMembers"] = "pool__totalDisconnectedMembers";
    PoolConnectionUpdatedEvent_OrderBy["Pool__totalDisconnectedUnits"] = "pool__totalDisconnectedUnits";
    PoolConnectionUpdatedEvent_OrderBy["Pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt"] = "pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt";
    PoolConnectionUpdatedEvent_OrderBy["Pool__totalMembers"] = "pool__totalMembers";
    PoolConnectionUpdatedEvent_OrderBy["Pool__totalUnits"] = "pool__totalUnits";
    PoolConnectionUpdatedEvent_OrderBy["Pool__updatedAtBlockNumber"] = "pool__updatedAtBlockNumber";
    PoolConnectionUpdatedEvent_OrderBy["Pool__updatedAtTimestamp"] = "pool__updatedAtTimestamp";
    PoolConnectionUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    PoolConnectionUpdatedEvent_OrderBy["Token"] = "token";
    PoolConnectionUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
    PoolConnectionUpdatedEvent_OrderBy["UserData"] = "userData";
})(PoolConnectionUpdatedEvent_OrderBy || (exports.PoolConnectionUpdatedEvent_OrderBy = PoolConnectionUpdatedEvent_OrderBy = {}));
var PoolCreatedEvent_OrderBy;
(function(PoolCreatedEvent_OrderBy) {
    PoolCreatedEvent_OrderBy["Addresses"] = "addresses";
    PoolCreatedEvent_OrderBy["Admin"] = "admin";
    PoolCreatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    PoolCreatedEvent_OrderBy["Caller"] = "caller";
    PoolCreatedEvent_OrderBy["GasPrice"] = "gasPrice";
    PoolCreatedEvent_OrderBy["GasUsed"] = "gasUsed";
    PoolCreatedEvent_OrderBy["Id"] = "id";
    PoolCreatedEvent_OrderBy["LogIndex"] = "logIndex";
    PoolCreatedEvent_OrderBy["Name"] = "name";
    PoolCreatedEvent_OrderBy["Order"] = "order";
    PoolCreatedEvent_OrderBy["Pool"] = "pool";
    PoolCreatedEvent_OrderBy["Pool__adjustmentFlowRate"] = "pool__adjustmentFlowRate";
    PoolCreatedEvent_OrderBy["Pool__createdAtBlockNumber"] = "pool__createdAtBlockNumber";
    PoolCreatedEvent_OrderBy["Pool__createdAtTimestamp"] = "pool__createdAtTimestamp";
    PoolCreatedEvent_OrderBy["Pool__flowRate"] = "pool__flowRate";
    PoolCreatedEvent_OrderBy["Pool__id"] = "pool__id";
    PoolCreatedEvent_OrderBy["Pool__perUnitFlowRate"] = "pool__perUnitFlowRate";
    PoolCreatedEvent_OrderBy["Pool__perUnitSettledValue"] = "pool__perUnitSettledValue";
    PoolCreatedEvent_OrderBy["Pool__totalAmountDistributedUntilUpdatedAt"] = "pool__totalAmountDistributedUntilUpdatedAt";
    PoolCreatedEvent_OrderBy["Pool__totalAmountFlowedDistributedUntilUpdatedAt"] = "pool__totalAmountFlowedDistributedUntilUpdatedAt";
    PoolCreatedEvent_OrderBy["Pool__totalAmountInstantlyDistributedUntilUpdatedAt"] = "pool__totalAmountInstantlyDistributedUntilUpdatedAt";
    PoolCreatedEvent_OrderBy["Pool__totalBuffer"] = "pool__totalBuffer";
    PoolCreatedEvent_OrderBy["Pool__totalConnectedMembers"] = "pool__totalConnectedMembers";
    PoolCreatedEvent_OrderBy["Pool__totalConnectedUnits"] = "pool__totalConnectedUnits";
    PoolCreatedEvent_OrderBy["Pool__totalDisconnectedMembers"] = "pool__totalDisconnectedMembers";
    PoolCreatedEvent_OrderBy["Pool__totalDisconnectedUnits"] = "pool__totalDisconnectedUnits";
    PoolCreatedEvent_OrderBy["Pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt"] = "pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt";
    PoolCreatedEvent_OrderBy["Pool__totalMembers"] = "pool__totalMembers";
    PoolCreatedEvent_OrderBy["Pool__totalUnits"] = "pool__totalUnits";
    PoolCreatedEvent_OrderBy["Pool__updatedAtBlockNumber"] = "pool__updatedAtBlockNumber";
    PoolCreatedEvent_OrderBy["Pool__updatedAtTimestamp"] = "pool__updatedAtTimestamp";
    PoolCreatedEvent_OrderBy["Timestamp"] = "timestamp";
    PoolCreatedEvent_OrderBy["Token"] = "token";
    PoolCreatedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(PoolCreatedEvent_OrderBy || (exports.PoolCreatedEvent_OrderBy = PoolCreatedEvent_OrderBy = {}));
var PoolDistributor_OrderBy;
(function(PoolDistributor_OrderBy) {
    PoolDistributor_OrderBy["Account"] = "account";
    PoolDistributor_OrderBy["Account__createdAtBlockNumber"] = "account__createdAtBlockNumber";
    PoolDistributor_OrderBy["Account__createdAtTimestamp"] = "account__createdAtTimestamp";
    PoolDistributor_OrderBy["Account__id"] = "account__id";
    PoolDistributor_OrderBy["Account__isSuperApp"] = "account__isSuperApp";
    PoolDistributor_OrderBy["Account__updatedAtBlockNumber"] = "account__updatedAtBlockNumber";
    PoolDistributor_OrderBy["Account__updatedAtTimestamp"] = "account__updatedAtTimestamp";
    PoolDistributor_OrderBy["BufferAdjustedEvents"] = "bufferAdjustedEvents";
    PoolDistributor_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    PoolDistributor_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    PoolDistributor_OrderBy["FlowDistributionUpdatedEvents"] = "flowDistributionUpdatedEvents";
    PoolDistributor_OrderBy["FlowRate"] = "flowRate";
    PoolDistributor_OrderBy["Id"] = "id";
    PoolDistributor_OrderBy["InstantDistributionUpdatedEvents"] = "instantDistributionUpdatedEvents";
    PoolDistributor_OrderBy["Pool"] = "pool";
    PoolDistributor_OrderBy["Pool__adjustmentFlowRate"] = "pool__adjustmentFlowRate";
    PoolDistributor_OrderBy["Pool__createdAtBlockNumber"] = "pool__createdAtBlockNumber";
    PoolDistributor_OrderBy["Pool__createdAtTimestamp"] = "pool__createdAtTimestamp";
    PoolDistributor_OrderBy["Pool__flowRate"] = "pool__flowRate";
    PoolDistributor_OrderBy["Pool__id"] = "pool__id";
    PoolDistributor_OrderBy["Pool__perUnitFlowRate"] = "pool__perUnitFlowRate";
    PoolDistributor_OrderBy["Pool__perUnitSettledValue"] = "pool__perUnitSettledValue";
    PoolDistributor_OrderBy["Pool__totalAmountDistributedUntilUpdatedAt"] = "pool__totalAmountDistributedUntilUpdatedAt";
    PoolDistributor_OrderBy["Pool__totalAmountFlowedDistributedUntilUpdatedAt"] = "pool__totalAmountFlowedDistributedUntilUpdatedAt";
    PoolDistributor_OrderBy["Pool__totalAmountInstantlyDistributedUntilUpdatedAt"] = "pool__totalAmountInstantlyDistributedUntilUpdatedAt";
    PoolDistributor_OrderBy["Pool__totalBuffer"] = "pool__totalBuffer";
    PoolDistributor_OrderBy["Pool__totalConnectedMembers"] = "pool__totalConnectedMembers";
    PoolDistributor_OrderBy["Pool__totalConnectedUnits"] = "pool__totalConnectedUnits";
    PoolDistributor_OrderBy["Pool__totalDisconnectedMembers"] = "pool__totalDisconnectedMembers";
    PoolDistributor_OrderBy["Pool__totalDisconnectedUnits"] = "pool__totalDisconnectedUnits";
    PoolDistributor_OrderBy["Pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt"] = "pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt";
    PoolDistributor_OrderBy["Pool__totalMembers"] = "pool__totalMembers";
    PoolDistributor_OrderBy["Pool__totalUnits"] = "pool__totalUnits";
    PoolDistributor_OrderBy["Pool__updatedAtBlockNumber"] = "pool__updatedAtBlockNumber";
    PoolDistributor_OrderBy["Pool__updatedAtTimestamp"] = "pool__updatedAtTimestamp";
    PoolDistributor_OrderBy["TotalAmountDistributedUntilUpdatedAt"] = "totalAmountDistributedUntilUpdatedAt";
    PoolDistributor_OrderBy["TotalAmountFlowedDistributedUntilUpdatedAt"] = "totalAmountFlowedDistributedUntilUpdatedAt";
    PoolDistributor_OrderBy["TotalAmountInstantlyDistributedUntilUpdatedAt"] = "totalAmountInstantlyDistributedUntilUpdatedAt";
    PoolDistributor_OrderBy["TotalBuffer"] = "totalBuffer";
    PoolDistributor_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    PoolDistributor_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
})(PoolDistributor_OrderBy || (exports.PoolDistributor_OrderBy = PoolDistributor_OrderBy = {}));
var PoolMember_OrderBy;
(function(PoolMember_OrderBy) {
    PoolMember_OrderBy["Account"] = "account";
    PoolMember_OrderBy["Account__createdAtBlockNumber"] = "account__createdAtBlockNumber";
    PoolMember_OrderBy["Account__createdAtTimestamp"] = "account__createdAtTimestamp";
    PoolMember_OrderBy["Account__id"] = "account__id";
    PoolMember_OrderBy["Account__isSuperApp"] = "account__isSuperApp";
    PoolMember_OrderBy["Account__updatedAtBlockNumber"] = "account__updatedAtBlockNumber";
    PoolMember_OrderBy["Account__updatedAtTimestamp"] = "account__updatedAtTimestamp";
    PoolMember_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    PoolMember_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    PoolMember_OrderBy["DistributionClaimedEvents"] = "distributionClaimedEvents";
    PoolMember_OrderBy["Id"] = "id";
    PoolMember_OrderBy["IsConnected"] = "isConnected";
    PoolMember_OrderBy["MemberUnitsUpdatedEvents"] = "memberUnitsUpdatedEvents";
    PoolMember_OrderBy["Pool"] = "pool";
    PoolMember_OrderBy["PoolConnectionUpdatedEvents"] = "poolConnectionUpdatedEvents";
    PoolMember_OrderBy["PoolTotalAmountDistributedUntilUpdatedAt"] = "poolTotalAmountDistributedUntilUpdatedAt";
    PoolMember_OrderBy["Pool__adjustmentFlowRate"] = "pool__adjustmentFlowRate";
    PoolMember_OrderBy["Pool__createdAtBlockNumber"] = "pool__createdAtBlockNumber";
    PoolMember_OrderBy["Pool__createdAtTimestamp"] = "pool__createdAtTimestamp";
    PoolMember_OrderBy["Pool__flowRate"] = "pool__flowRate";
    PoolMember_OrderBy["Pool__id"] = "pool__id";
    PoolMember_OrderBy["Pool__perUnitFlowRate"] = "pool__perUnitFlowRate";
    PoolMember_OrderBy["Pool__perUnitSettledValue"] = "pool__perUnitSettledValue";
    PoolMember_OrderBy["Pool__totalAmountDistributedUntilUpdatedAt"] = "pool__totalAmountDistributedUntilUpdatedAt";
    PoolMember_OrderBy["Pool__totalAmountFlowedDistributedUntilUpdatedAt"] = "pool__totalAmountFlowedDistributedUntilUpdatedAt";
    PoolMember_OrderBy["Pool__totalAmountInstantlyDistributedUntilUpdatedAt"] = "pool__totalAmountInstantlyDistributedUntilUpdatedAt";
    PoolMember_OrderBy["Pool__totalBuffer"] = "pool__totalBuffer";
    PoolMember_OrderBy["Pool__totalConnectedMembers"] = "pool__totalConnectedMembers";
    PoolMember_OrderBy["Pool__totalConnectedUnits"] = "pool__totalConnectedUnits";
    PoolMember_OrderBy["Pool__totalDisconnectedMembers"] = "pool__totalDisconnectedMembers";
    PoolMember_OrderBy["Pool__totalDisconnectedUnits"] = "pool__totalDisconnectedUnits";
    PoolMember_OrderBy["Pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt"] = "pool__totalFlowAdjustmentAmountDistributedUntilUpdatedAt";
    PoolMember_OrderBy["Pool__totalMembers"] = "pool__totalMembers";
    PoolMember_OrderBy["Pool__totalUnits"] = "pool__totalUnits";
    PoolMember_OrderBy["Pool__updatedAtBlockNumber"] = "pool__updatedAtBlockNumber";
    PoolMember_OrderBy["Pool__updatedAtTimestamp"] = "pool__updatedAtTimestamp";
    PoolMember_OrderBy["SyncedPerUnitFlowRate"] = "syncedPerUnitFlowRate";
    PoolMember_OrderBy["SyncedPerUnitSettledValue"] = "syncedPerUnitSettledValue";
    PoolMember_OrderBy["TotalAmountClaimed"] = "totalAmountClaimed";
    PoolMember_OrderBy["TotalAmountReceivedUntilUpdatedAt"] = "totalAmountReceivedUntilUpdatedAt";
    PoolMember_OrderBy["Units"] = "units";
    PoolMember_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    PoolMember_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
})(PoolMember_OrderBy || (exports.PoolMember_OrderBy = PoolMember_OrderBy = {}));
var Pool_OrderBy;
(function(Pool_OrderBy) {
    Pool_OrderBy["AdjustmentFlowRate"] = "adjustmentFlowRate";
    Pool_OrderBy["Admin"] = "admin";
    Pool_OrderBy["Admin__createdAtBlockNumber"] = "admin__createdAtBlockNumber";
    Pool_OrderBy["Admin__createdAtTimestamp"] = "admin__createdAtTimestamp";
    Pool_OrderBy["Admin__id"] = "admin__id";
    Pool_OrderBy["Admin__isSuperApp"] = "admin__isSuperApp";
    Pool_OrderBy["Admin__updatedAtBlockNumber"] = "admin__updatedAtBlockNumber";
    Pool_OrderBy["Admin__updatedAtTimestamp"] = "admin__updatedAtTimestamp";
    Pool_OrderBy["BufferAdjustedEvents"] = "bufferAdjustedEvents";
    Pool_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    Pool_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    Pool_OrderBy["DistributionClaimedEvents"] = "distributionClaimedEvents";
    Pool_OrderBy["FlowDistributionUpdatedEvents"] = "flowDistributionUpdatedEvents";
    Pool_OrderBy["FlowRate"] = "flowRate";
    Pool_OrderBy["Id"] = "id";
    Pool_OrderBy["InstantDistributionUpdatedEvents"] = "instantDistributionUpdatedEvents";
    Pool_OrderBy["MemberUnitsUpdatedEvents"] = "memberUnitsUpdatedEvents";
    Pool_OrderBy["PerUnitFlowRate"] = "perUnitFlowRate";
    Pool_OrderBy["PerUnitSettledValue"] = "perUnitSettledValue";
    Pool_OrderBy["PoolConnectionUpdatedEvents"] = "poolConnectionUpdatedEvents";
    Pool_OrderBy["PoolCreatedEvent"] = "poolCreatedEvent";
    Pool_OrderBy["PoolCreatedEvent__admin"] = "poolCreatedEvent__admin";
    Pool_OrderBy["PoolCreatedEvent__blockNumber"] = "poolCreatedEvent__blockNumber";
    Pool_OrderBy["PoolCreatedEvent__caller"] = "poolCreatedEvent__caller";
    Pool_OrderBy["PoolCreatedEvent__gasPrice"] = "poolCreatedEvent__gasPrice";
    Pool_OrderBy["PoolCreatedEvent__gasUsed"] = "poolCreatedEvent__gasUsed";
    Pool_OrderBy["PoolCreatedEvent__id"] = "poolCreatedEvent__id";
    Pool_OrderBy["PoolCreatedEvent__logIndex"] = "poolCreatedEvent__logIndex";
    Pool_OrderBy["PoolCreatedEvent__name"] = "poolCreatedEvent__name";
    Pool_OrderBy["PoolCreatedEvent__order"] = "poolCreatedEvent__order";
    Pool_OrderBy["PoolCreatedEvent__timestamp"] = "poolCreatedEvent__timestamp";
    Pool_OrderBy["PoolCreatedEvent__token"] = "poolCreatedEvent__token";
    Pool_OrderBy["PoolCreatedEvent__transactionHash"] = "poolCreatedEvent__transactionHash";
    Pool_OrderBy["PoolDistributors"] = "poolDistributors";
    Pool_OrderBy["PoolMembers"] = "poolMembers";
    Pool_OrderBy["Token"] = "token";
    Pool_OrderBy["Token__createdAtBlockNumber"] = "token__createdAtBlockNumber";
    Pool_OrderBy["Token__createdAtTimestamp"] = "token__createdAtTimestamp";
    Pool_OrderBy["Token__decimals"] = "token__decimals";
    Pool_OrderBy["Token__id"] = "token__id";
    Pool_OrderBy["Token__isListed"] = "token__isListed";
    Pool_OrderBy["Token__isNativeAssetSuperToken"] = "token__isNativeAssetSuperToken";
    Pool_OrderBy["Token__isSuperToken"] = "token__isSuperToken";
    Pool_OrderBy["Token__name"] = "token__name";
    Pool_OrderBy["Token__symbol"] = "token__symbol";
    Pool_OrderBy["Token__underlyingAddress"] = "token__underlyingAddress";
    Pool_OrderBy["TotalAmountDistributedUntilUpdatedAt"] = "totalAmountDistributedUntilUpdatedAt";
    Pool_OrderBy["TotalAmountFlowedDistributedUntilUpdatedAt"] = "totalAmountFlowedDistributedUntilUpdatedAt";
    Pool_OrderBy["TotalAmountInstantlyDistributedUntilUpdatedAt"] = "totalAmountInstantlyDistributedUntilUpdatedAt";
    Pool_OrderBy["TotalBuffer"] = "totalBuffer";
    Pool_OrderBy["TotalConnectedMembers"] = "totalConnectedMembers";
    Pool_OrderBy["TotalConnectedUnits"] = "totalConnectedUnits";
    Pool_OrderBy["TotalDisconnectedMembers"] = "totalDisconnectedMembers";
    Pool_OrderBy["TotalDisconnectedUnits"] = "totalDisconnectedUnits";
    Pool_OrderBy["TotalFlowAdjustmentAmountDistributedUntilUpdatedAt"] = "totalFlowAdjustmentAmountDistributedUntilUpdatedAt";
    Pool_OrderBy["TotalMembers"] = "totalMembers";
    Pool_OrderBy["TotalUnits"] = "totalUnits";
    Pool_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    Pool_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
})(Pool_OrderBy || (exports.Pool_OrderBy = Pool_OrderBy = {}));
var ResolverEntry_OrderBy;
(function(ResolverEntry_OrderBy) {
    ResolverEntry_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    ResolverEntry_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    ResolverEntry_OrderBy["Id"] = "id";
    ResolverEntry_OrderBy["IsListed"] = "isListed";
    ResolverEntry_OrderBy["IsToken"] = "isToken";
    ResolverEntry_OrderBy["SetEvents"] = "setEvents";
    ResolverEntry_OrderBy["TargetAddress"] = "targetAddress";
    ResolverEntry_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    ResolverEntry_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
})(ResolverEntry_OrderBy || (exports.ResolverEntry_OrderBy = ResolverEntry_OrderBy = {}));
var RewardAddressChangedEvent_OrderBy;
(function(RewardAddressChangedEvent_OrderBy) {
    RewardAddressChangedEvent_OrderBy["Addresses"] = "addresses";
    RewardAddressChangedEvent_OrderBy["BlockNumber"] = "blockNumber";
    RewardAddressChangedEvent_OrderBy["GasPrice"] = "gasPrice";
    RewardAddressChangedEvent_OrderBy["GasUsed"] = "gasUsed";
    RewardAddressChangedEvent_OrderBy["GovernanceAddress"] = "governanceAddress";
    RewardAddressChangedEvent_OrderBy["Host"] = "host";
    RewardAddressChangedEvent_OrderBy["Id"] = "id";
    RewardAddressChangedEvent_OrderBy["IsKeySet"] = "isKeySet";
    RewardAddressChangedEvent_OrderBy["LogIndex"] = "logIndex";
    RewardAddressChangedEvent_OrderBy["Name"] = "name";
    RewardAddressChangedEvent_OrderBy["Order"] = "order";
    RewardAddressChangedEvent_OrderBy["RewardAddress"] = "rewardAddress";
    RewardAddressChangedEvent_OrderBy["SuperToken"] = "superToken";
    RewardAddressChangedEvent_OrderBy["Timestamp"] = "timestamp";
    RewardAddressChangedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(RewardAddressChangedEvent_OrderBy || (exports.RewardAddressChangedEvent_OrderBy = RewardAddressChangedEvent_OrderBy = {}));
var RoleAdminChangedEvent_OrderBy;
(function(RoleAdminChangedEvent_OrderBy) {
    RoleAdminChangedEvent_OrderBy["Addresses"] = "addresses";
    RoleAdminChangedEvent_OrderBy["BlockNumber"] = "blockNumber";
    RoleAdminChangedEvent_OrderBy["GasPrice"] = "gasPrice";
    RoleAdminChangedEvent_OrderBy["GasUsed"] = "gasUsed";
    RoleAdminChangedEvent_OrderBy["Id"] = "id";
    RoleAdminChangedEvent_OrderBy["LogIndex"] = "logIndex";
    RoleAdminChangedEvent_OrderBy["Name"] = "name";
    RoleAdminChangedEvent_OrderBy["NewAdminRole"] = "newAdminRole";
    RoleAdminChangedEvent_OrderBy["Order"] = "order";
    RoleAdminChangedEvent_OrderBy["PreviousAdminRole"] = "previousAdminRole";
    RoleAdminChangedEvent_OrderBy["Role"] = "role";
    RoleAdminChangedEvent_OrderBy["Timestamp"] = "timestamp";
    RoleAdminChangedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(RoleAdminChangedEvent_OrderBy || (exports.RoleAdminChangedEvent_OrderBy = RoleAdminChangedEvent_OrderBy = {}));
var RoleGrantedEvent_OrderBy;
(function(RoleGrantedEvent_OrderBy) {
    RoleGrantedEvent_OrderBy["Account"] = "account";
    RoleGrantedEvent_OrderBy["Addresses"] = "addresses";
    RoleGrantedEvent_OrderBy["BlockNumber"] = "blockNumber";
    RoleGrantedEvent_OrderBy["GasPrice"] = "gasPrice";
    RoleGrantedEvent_OrderBy["GasUsed"] = "gasUsed";
    RoleGrantedEvent_OrderBy["Id"] = "id";
    RoleGrantedEvent_OrderBy["LogIndex"] = "logIndex";
    RoleGrantedEvent_OrderBy["Name"] = "name";
    RoleGrantedEvent_OrderBy["Order"] = "order";
    RoleGrantedEvent_OrderBy["Role"] = "role";
    RoleGrantedEvent_OrderBy["Sender"] = "sender";
    RoleGrantedEvent_OrderBy["Timestamp"] = "timestamp";
    RoleGrantedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(RoleGrantedEvent_OrderBy || (exports.RoleGrantedEvent_OrderBy = RoleGrantedEvent_OrderBy = {}));
var RoleRevokedEvent_OrderBy;
(function(RoleRevokedEvent_OrderBy) {
    RoleRevokedEvent_OrderBy["Account"] = "account";
    RoleRevokedEvent_OrderBy["Addresses"] = "addresses";
    RoleRevokedEvent_OrderBy["BlockNumber"] = "blockNumber";
    RoleRevokedEvent_OrderBy["GasPrice"] = "gasPrice";
    RoleRevokedEvent_OrderBy["GasUsed"] = "gasUsed";
    RoleRevokedEvent_OrderBy["Id"] = "id";
    RoleRevokedEvent_OrderBy["LogIndex"] = "logIndex";
    RoleRevokedEvent_OrderBy["Name"] = "name";
    RoleRevokedEvent_OrderBy["Order"] = "order";
    RoleRevokedEvent_OrderBy["Role"] = "role";
    RoleRevokedEvent_OrderBy["Sender"] = "sender";
    RoleRevokedEvent_OrderBy["Timestamp"] = "timestamp";
    RoleRevokedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(RoleRevokedEvent_OrderBy || (exports.RoleRevokedEvent_OrderBy = RoleRevokedEvent_OrderBy = {}));
var SfMeta_OrderBy;
(function(SfMeta_OrderBy) {
    SfMeta_OrderBy["BlockNumber"] = "blockNumber";
    SfMeta_OrderBy["Branch"] = "branch";
    SfMeta_OrderBy["Configuration"] = "configuration";
    SfMeta_OrderBy["Id"] = "id";
    SfMeta_OrderBy["PackageVersion"] = "packageVersion";
    SfMeta_OrderBy["Timestamp"] = "timestamp";
})(SfMeta_OrderBy || (exports.SfMeta_OrderBy = SfMeta_OrderBy = {}));
var SentEvent_OrderBy;
(function(SentEvent_OrderBy) {
    SentEvent_OrderBy["Addresses"] = "addresses";
    SentEvent_OrderBy["Amount"] = "amount";
    SentEvent_OrderBy["BlockNumber"] = "blockNumber";
    SentEvent_OrderBy["Data"] = "data";
    SentEvent_OrderBy["From"] = "from";
    SentEvent_OrderBy["GasPrice"] = "gasPrice";
    SentEvent_OrderBy["GasUsed"] = "gasUsed";
    SentEvent_OrderBy["Id"] = "id";
    SentEvent_OrderBy["LogIndex"] = "logIndex";
    SentEvent_OrderBy["Name"] = "name";
    SentEvent_OrderBy["Operator"] = "operator";
    SentEvent_OrderBy["OperatorData"] = "operatorData";
    SentEvent_OrderBy["Order"] = "order";
    SentEvent_OrderBy["Timestamp"] = "timestamp";
    SentEvent_OrderBy["To"] = "to";
    SentEvent_OrderBy["Token"] = "token";
    SentEvent_OrderBy["TransactionHash"] = "transactionHash";
})(SentEvent_OrderBy || (exports.SentEvent_OrderBy = SentEvent_OrderBy = {}));
var SetEvent_OrderBy;
(function(SetEvent_OrderBy) {
    SetEvent_OrderBy["Addresses"] = "addresses";
    SetEvent_OrderBy["BlockNumber"] = "blockNumber";
    SetEvent_OrderBy["GasPrice"] = "gasPrice";
    SetEvent_OrderBy["GasUsed"] = "gasUsed";
    SetEvent_OrderBy["HashedName"] = "hashedName";
    SetEvent_OrderBy["Id"] = "id";
    SetEvent_OrderBy["LogIndex"] = "logIndex";
    SetEvent_OrderBy["Name"] = "name";
    SetEvent_OrderBy["Order"] = "order";
    SetEvent_OrderBy["ResolverEntry"] = "resolverEntry";
    SetEvent_OrderBy["ResolverEntry__createdAtBlockNumber"] = "resolverEntry__createdAtBlockNumber";
    SetEvent_OrderBy["ResolverEntry__createdAtTimestamp"] = "resolverEntry__createdAtTimestamp";
    SetEvent_OrderBy["ResolverEntry__id"] = "resolverEntry__id";
    SetEvent_OrderBy["ResolverEntry__isListed"] = "resolverEntry__isListed";
    SetEvent_OrderBy["ResolverEntry__isToken"] = "resolverEntry__isToken";
    SetEvent_OrderBy["ResolverEntry__targetAddress"] = "resolverEntry__targetAddress";
    SetEvent_OrderBy["ResolverEntry__updatedAtBlockNumber"] = "resolverEntry__updatedAtBlockNumber";
    SetEvent_OrderBy["ResolverEntry__updatedAtTimestamp"] = "resolverEntry__updatedAtTimestamp";
    SetEvent_OrderBy["Target"] = "target";
    SetEvent_OrderBy["Timestamp"] = "timestamp";
    SetEvent_OrderBy["TransactionHash"] = "transactionHash";
})(SetEvent_OrderBy || (exports.SetEvent_OrderBy = SetEvent_OrderBy = {}));
var StreamPeriod_OrderBy;
(function(StreamPeriod_OrderBy) {
    StreamPeriod_OrderBy["Deposit"] = "deposit";
    StreamPeriod_OrderBy["FlowRate"] = "flowRate";
    StreamPeriod_OrderBy["Id"] = "id";
    StreamPeriod_OrderBy["Receiver"] = "receiver";
    StreamPeriod_OrderBy["Receiver__createdAtBlockNumber"] = "receiver__createdAtBlockNumber";
    StreamPeriod_OrderBy["Receiver__createdAtTimestamp"] = "receiver__createdAtTimestamp";
    StreamPeriod_OrderBy["Receiver__id"] = "receiver__id";
    StreamPeriod_OrderBy["Receiver__isSuperApp"] = "receiver__isSuperApp";
    StreamPeriod_OrderBy["Receiver__updatedAtBlockNumber"] = "receiver__updatedAtBlockNumber";
    StreamPeriod_OrderBy["Receiver__updatedAtTimestamp"] = "receiver__updatedAtTimestamp";
    StreamPeriod_OrderBy["Sender"] = "sender";
    StreamPeriod_OrderBy["Sender__createdAtBlockNumber"] = "sender__createdAtBlockNumber";
    StreamPeriod_OrderBy["Sender__createdAtTimestamp"] = "sender__createdAtTimestamp";
    StreamPeriod_OrderBy["Sender__id"] = "sender__id";
    StreamPeriod_OrderBy["Sender__isSuperApp"] = "sender__isSuperApp";
    StreamPeriod_OrderBy["Sender__updatedAtBlockNumber"] = "sender__updatedAtBlockNumber";
    StreamPeriod_OrderBy["Sender__updatedAtTimestamp"] = "sender__updatedAtTimestamp";
    StreamPeriod_OrderBy["StartedAtBlockNumber"] = "startedAtBlockNumber";
    StreamPeriod_OrderBy["StartedAtEvent"] = "startedAtEvent";
    StreamPeriod_OrderBy["StartedAtEvent__blockNumber"] = "startedAtEvent__blockNumber";
    StreamPeriod_OrderBy["StartedAtEvent__deposit"] = "startedAtEvent__deposit";
    StreamPeriod_OrderBy["StartedAtEvent__flowOperator"] = "startedAtEvent__flowOperator";
    StreamPeriod_OrderBy["StartedAtEvent__flowRate"] = "startedAtEvent__flowRate";
    StreamPeriod_OrderBy["StartedAtEvent__gasPrice"] = "startedAtEvent__gasPrice";
    StreamPeriod_OrderBy["StartedAtEvent__gasUsed"] = "startedAtEvent__gasUsed";
    StreamPeriod_OrderBy["StartedAtEvent__id"] = "startedAtEvent__id";
    StreamPeriod_OrderBy["StartedAtEvent__logIndex"] = "startedAtEvent__logIndex";
    StreamPeriod_OrderBy["StartedAtEvent__name"] = "startedAtEvent__name";
    StreamPeriod_OrderBy["StartedAtEvent__oldFlowRate"] = "startedAtEvent__oldFlowRate";
    StreamPeriod_OrderBy["StartedAtEvent__order"] = "startedAtEvent__order";
    StreamPeriod_OrderBy["StartedAtEvent__receiver"] = "startedAtEvent__receiver";
    StreamPeriod_OrderBy["StartedAtEvent__sender"] = "startedAtEvent__sender";
    StreamPeriod_OrderBy["StartedAtEvent__timestamp"] = "startedAtEvent__timestamp";
    StreamPeriod_OrderBy["StartedAtEvent__token"] = "startedAtEvent__token";
    StreamPeriod_OrderBy["StartedAtEvent__totalAmountStreamedUntilTimestamp"] = "startedAtEvent__totalAmountStreamedUntilTimestamp";
    StreamPeriod_OrderBy["StartedAtEvent__totalReceiverFlowRate"] = "startedAtEvent__totalReceiverFlowRate";
    StreamPeriod_OrderBy["StartedAtEvent__totalSenderFlowRate"] = "startedAtEvent__totalSenderFlowRate";
    StreamPeriod_OrderBy["StartedAtEvent__transactionHash"] = "startedAtEvent__transactionHash";
    StreamPeriod_OrderBy["StartedAtEvent__type"] = "startedAtEvent__type";
    StreamPeriod_OrderBy["StartedAtEvent__userData"] = "startedAtEvent__userData";
    StreamPeriod_OrderBy["StartedAtTimestamp"] = "startedAtTimestamp";
    StreamPeriod_OrderBy["StoppedAtBlockNumber"] = "stoppedAtBlockNumber";
    StreamPeriod_OrderBy["StoppedAtEvent"] = "stoppedAtEvent";
    StreamPeriod_OrderBy["StoppedAtEvent__blockNumber"] = "stoppedAtEvent__blockNumber";
    StreamPeriod_OrderBy["StoppedAtEvent__deposit"] = "stoppedAtEvent__deposit";
    StreamPeriod_OrderBy["StoppedAtEvent__flowOperator"] = "stoppedAtEvent__flowOperator";
    StreamPeriod_OrderBy["StoppedAtEvent__flowRate"] = "stoppedAtEvent__flowRate";
    StreamPeriod_OrderBy["StoppedAtEvent__gasPrice"] = "stoppedAtEvent__gasPrice";
    StreamPeriod_OrderBy["StoppedAtEvent__gasUsed"] = "stoppedAtEvent__gasUsed";
    StreamPeriod_OrderBy["StoppedAtEvent__id"] = "stoppedAtEvent__id";
    StreamPeriod_OrderBy["StoppedAtEvent__logIndex"] = "stoppedAtEvent__logIndex";
    StreamPeriod_OrderBy["StoppedAtEvent__name"] = "stoppedAtEvent__name";
    StreamPeriod_OrderBy["StoppedAtEvent__oldFlowRate"] = "stoppedAtEvent__oldFlowRate";
    StreamPeriod_OrderBy["StoppedAtEvent__order"] = "stoppedAtEvent__order";
    StreamPeriod_OrderBy["StoppedAtEvent__receiver"] = "stoppedAtEvent__receiver";
    StreamPeriod_OrderBy["StoppedAtEvent__sender"] = "stoppedAtEvent__sender";
    StreamPeriod_OrderBy["StoppedAtEvent__timestamp"] = "stoppedAtEvent__timestamp";
    StreamPeriod_OrderBy["StoppedAtEvent__token"] = "stoppedAtEvent__token";
    StreamPeriod_OrderBy["StoppedAtEvent__totalAmountStreamedUntilTimestamp"] = "stoppedAtEvent__totalAmountStreamedUntilTimestamp";
    StreamPeriod_OrderBy["StoppedAtEvent__totalReceiverFlowRate"] = "stoppedAtEvent__totalReceiverFlowRate";
    StreamPeriod_OrderBy["StoppedAtEvent__totalSenderFlowRate"] = "stoppedAtEvent__totalSenderFlowRate";
    StreamPeriod_OrderBy["StoppedAtEvent__transactionHash"] = "stoppedAtEvent__transactionHash";
    StreamPeriod_OrderBy["StoppedAtEvent__type"] = "stoppedAtEvent__type";
    StreamPeriod_OrderBy["StoppedAtEvent__userData"] = "stoppedAtEvent__userData";
    StreamPeriod_OrderBy["StoppedAtTimestamp"] = "stoppedAtTimestamp";
    StreamPeriod_OrderBy["Stream"] = "stream";
    StreamPeriod_OrderBy["Stream__createdAtBlockNumber"] = "stream__createdAtBlockNumber";
    StreamPeriod_OrderBy["Stream__createdAtTimestamp"] = "stream__createdAtTimestamp";
    StreamPeriod_OrderBy["Stream__currentFlowRate"] = "stream__currentFlowRate";
    StreamPeriod_OrderBy["Stream__deposit"] = "stream__deposit";
    StreamPeriod_OrderBy["Stream__id"] = "stream__id";
    StreamPeriod_OrderBy["Stream__streamedUntilUpdatedAt"] = "stream__streamedUntilUpdatedAt";
    StreamPeriod_OrderBy["Stream__updatedAtBlockNumber"] = "stream__updatedAtBlockNumber";
    StreamPeriod_OrderBy["Stream__updatedAtTimestamp"] = "stream__updatedAtTimestamp";
    StreamPeriod_OrderBy["Stream__userData"] = "stream__userData";
    StreamPeriod_OrderBy["Token"] = "token";
    StreamPeriod_OrderBy["Token__createdAtBlockNumber"] = "token__createdAtBlockNumber";
    StreamPeriod_OrderBy["Token__createdAtTimestamp"] = "token__createdAtTimestamp";
    StreamPeriod_OrderBy["Token__decimals"] = "token__decimals";
    StreamPeriod_OrderBy["Token__id"] = "token__id";
    StreamPeriod_OrderBy["Token__isListed"] = "token__isListed";
    StreamPeriod_OrderBy["Token__isNativeAssetSuperToken"] = "token__isNativeAssetSuperToken";
    StreamPeriod_OrderBy["Token__isSuperToken"] = "token__isSuperToken";
    StreamPeriod_OrderBy["Token__name"] = "token__name";
    StreamPeriod_OrderBy["Token__symbol"] = "token__symbol";
    StreamPeriod_OrderBy["Token__underlyingAddress"] = "token__underlyingAddress";
    StreamPeriod_OrderBy["TotalAmountStreamed"] = "totalAmountStreamed";
})(StreamPeriod_OrderBy || (exports.StreamPeriod_OrderBy = StreamPeriod_OrderBy = {}));
var StreamRevision_OrderBy;
(function(StreamRevision_OrderBy) {
    StreamRevision_OrderBy["Id"] = "id";
    StreamRevision_OrderBy["MostRecentStream"] = "mostRecentStream";
    StreamRevision_OrderBy["MostRecentStream__createdAtBlockNumber"] = "mostRecentStream__createdAtBlockNumber";
    StreamRevision_OrderBy["MostRecentStream__createdAtTimestamp"] = "mostRecentStream__createdAtTimestamp";
    StreamRevision_OrderBy["MostRecentStream__currentFlowRate"] = "mostRecentStream__currentFlowRate";
    StreamRevision_OrderBy["MostRecentStream__deposit"] = "mostRecentStream__deposit";
    StreamRevision_OrderBy["MostRecentStream__id"] = "mostRecentStream__id";
    StreamRevision_OrderBy["MostRecentStream__streamedUntilUpdatedAt"] = "mostRecentStream__streamedUntilUpdatedAt";
    StreamRevision_OrderBy["MostRecentStream__updatedAtBlockNumber"] = "mostRecentStream__updatedAtBlockNumber";
    StreamRevision_OrderBy["MostRecentStream__updatedAtTimestamp"] = "mostRecentStream__updatedAtTimestamp";
    StreamRevision_OrderBy["MostRecentStream__userData"] = "mostRecentStream__userData";
    StreamRevision_OrderBy["PeriodRevisionIndex"] = "periodRevisionIndex";
    StreamRevision_OrderBy["RevisionIndex"] = "revisionIndex";
})(StreamRevision_OrderBy || (exports.StreamRevision_OrderBy = StreamRevision_OrderBy = {}));
var Stream_OrderBy;
(function(Stream_OrderBy) {
    Stream_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    Stream_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    Stream_OrderBy["CurrentFlowRate"] = "currentFlowRate";
    Stream_OrderBy["Deposit"] = "deposit";
    Stream_OrderBy["FlowUpdatedEvents"] = "flowUpdatedEvents";
    Stream_OrderBy["Id"] = "id";
    Stream_OrderBy["Receiver"] = "receiver";
    Stream_OrderBy["Receiver__createdAtBlockNumber"] = "receiver__createdAtBlockNumber";
    Stream_OrderBy["Receiver__createdAtTimestamp"] = "receiver__createdAtTimestamp";
    Stream_OrderBy["Receiver__id"] = "receiver__id";
    Stream_OrderBy["Receiver__isSuperApp"] = "receiver__isSuperApp";
    Stream_OrderBy["Receiver__updatedAtBlockNumber"] = "receiver__updatedAtBlockNumber";
    Stream_OrderBy["Receiver__updatedAtTimestamp"] = "receiver__updatedAtTimestamp";
    Stream_OrderBy["Sender"] = "sender";
    Stream_OrderBy["Sender__createdAtBlockNumber"] = "sender__createdAtBlockNumber";
    Stream_OrderBy["Sender__createdAtTimestamp"] = "sender__createdAtTimestamp";
    Stream_OrderBy["Sender__id"] = "sender__id";
    Stream_OrderBy["Sender__isSuperApp"] = "sender__isSuperApp";
    Stream_OrderBy["Sender__updatedAtBlockNumber"] = "sender__updatedAtBlockNumber";
    Stream_OrderBy["Sender__updatedAtTimestamp"] = "sender__updatedAtTimestamp";
    Stream_OrderBy["StreamPeriods"] = "streamPeriods";
    Stream_OrderBy["StreamedUntilUpdatedAt"] = "streamedUntilUpdatedAt";
    Stream_OrderBy["Token"] = "token";
    Stream_OrderBy["Token__createdAtBlockNumber"] = "token__createdAtBlockNumber";
    Stream_OrderBy["Token__createdAtTimestamp"] = "token__createdAtTimestamp";
    Stream_OrderBy["Token__decimals"] = "token__decimals";
    Stream_OrderBy["Token__id"] = "token__id";
    Stream_OrderBy["Token__isListed"] = "token__isListed";
    Stream_OrderBy["Token__isNativeAssetSuperToken"] = "token__isNativeAssetSuperToken";
    Stream_OrderBy["Token__isSuperToken"] = "token__isSuperToken";
    Stream_OrderBy["Token__name"] = "token__name";
    Stream_OrderBy["Token__symbol"] = "token__symbol";
    Stream_OrderBy["Token__underlyingAddress"] = "token__underlyingAddress";
    Stream_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    Stream_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
    Stream_OrderBy["UserData"] = "userData";
})(Stream_OrderBy || (exports.Stream_OrderBy = Stream_OrderBy = {}));
var SubscriptionApprovedEvent_OrderBy;
(function(SubscriptionApprovedEvent_OrderBy) {
    SubscriptionApprovedEvent_OrderBy["Addresses"] = "addresses";
    SubscriptionApprovedEvent_OrderBy["BlockNumber"] = "blockNumber";
    SubscriptionApprovedEvent_OrderBy["GasPrice"] = "gasPrice";
    SubscriptionApprovedEvent_OrderBy["GasUsed"] = "gasUsed";
    SubscriptionApprovedEvent_OrderBy["Id"] = "id";
    SubscriptionApprovedEvent_OrderBy["IndexId"] = "indexId";
    SubscriptionApprovedEvent_OrderBy["LogIndex"] = "logIndex";
    SubscriptionApprovedEvent_OrderBy["Name"] = "name";
    SubscriptionApprovedEvent_OrderBy["Order"] = "order";
    SubscriptionApprovedEvent_OrderBy["Publisher"] = "publisher";
    SubscriptionApprovedEvent_OrderBy["Subscriber"] = "subscriber";
    SubscriptionApprovedEvent_OrderBy["Subscription"] = "subscription";
    SubscriptionApprovedEvent_OrderBy["Subscription__approved"] = "subscription__approved";
    SubscriptionApprovedEvent_OrderBy["Subscription__createdAtBlockNumber"] = "subscription__createdAtBlockNumber";
    SubscriptionApprovedEvent_OrderBy["Subscription__createdAtTimestamp"] = "subscription__createdAtTimestamp";
    SubscriptionApprovedEvent_OrderBy["Subscription__id"] = "subscription__id";
    SubscriptionApprovedEvent_OrderBy["Subscription__indexValueUntilUpdatedAt"] = "subscription__indexValueUntilUpdatedAt";
    SubscriptionApprovedEvent_OrderBy["Subscription__totalAmountReceivedUntilUpdatedAt"] = "subscription__totalAmountReceivedUntilUpdatedAt";
    SubscriptionApprovedEvent_OrderBy["Subscription__units"] = "subscription__units";
    SubscriptionApprovedEvent_OrderBy["Subscription__updatedAtBlockNumber"] = "subscription__updatedAtBlockNumber";
    SubscriptionApprovedEvent_OrderBy["Subscription__updatedAtTimestamp"] = "subscription__updatedAtTimestamp";
    SubscriptionApprovedEvent_OrderBy["Timestamp"] = "timestamp";
    SubscriptionApprovedEvent_OrderBy["Token"] = "token";
    SubscriptionApprovedEvent_OrderBy["TransactionHash"] = "transactionHash";
    SubscriptionApprovedEvent_OrderBy["UserData"] = "userData";
})(SubscriptionApprovedEvent_OrderBy || (exports.SubscriptionApprovedEvent_OrderBy = SubscriptionApprovedEvent_OrderBy = {}));
var SubscriptionDistributionClaimedEvent_OrderBy;
(function(SubscriptionDistributionClaimedEvent_OrderBy) {
    SubscriptionDistributionClaimedEvent_OrderBy["Addresses"] = "addresses";
    SubscriptionDistributionClaimedEvent_OrderBy["Amount"] = "amount";
    SubscriptionDistributionClaimedEvent_OrderBy["BlockNumber"] = "blockNumber";
    SubscriptionDistributionClaimedEvent_OrderBy["GasPrice"] = "gasPrice";
    SubscriptionDistributionClaimedEvent_OrderBy["GasUsed"] = "gasUsed";
    SubscriptionDistributionClaimedEvent_OrderBy["Id"] = "id";
    SubscriptionDistributionClaimedEvent_OrderBy["IndexId"] = "indexId";
    SubscriptionDistributionClaimedEvent_OrderBy["LogIndex"] = "logIndex";
    SubscriptionDistributionClaimedEvent_OrderBy["Name"] = "name";
    SubscriptionDistributionClaimedEvent_OrderBy["Order"] = "order";
    SubscriptionDistributionClaimedEvent_OrderBy["Publisher"] = "publisher";
    SubscriptionDistributionClaimedEvent_OrderBy["Subscriber"] = "subscriber";
    SubscriptionDistributionClaimedEvent_OrderBy["Subscription"] = "subscription";
    SubscriptionDistributionClaimedEvent_OrderBy["Subscription__approved"] = "subscription__approved";
    SubscriptionDistributionClaimedEvent_OrderBy["Subscription__createdAtBlockNumber"] = "subscription__createdAtBlockNumber";
    SubscriptionDistributionClaimedEvent_OrderBy["Subscription__createdAtTimestamp"] = "subscription__createdAtTimestamp";
    SubscriptionDistributionClaimedEvent_OrderBy["Subscription__id"] = "subscription__id";
    SubscriptionDistributionClaimedEvent_OrderBy["Subscription__indexValueUntilUpdatedAt"] = "subscription__indexValueUntilUpdatedAt";
    SubscriptionDistributionClaimedEvent_OrderBy["Subscription__totalAmountReceivedUntilUpdatedAt"] = "subscription__totalAmountReceivedUntilUpdatedAt";
    SubscriptionDistributionClaimedEvent_OrderBy["Subscription__units"] = "subscription__units";
    SubscriptionDistributionClaimedEvent_OrderBy["Subscription__updatedAtBlockNumber"] = "subscription__updatedAtBlockNumber";
    SubscriptionDistributionClaimedEvent_OrderBy["Subscription__updatedAtTimestamp"] = "subscription__updatedAtTimestamp";
    SubscriptionDistributionClaimedEvent_OrderBy["Timestamp"] = "timestamp";
    SubscriptionDistributionClaimedEvent_OrderBy["Token"] = "token";
    SubscriptionDistributionClaimedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(SubscriptionDistributionClaimedEvent_OrderBy || (exports.SubscriptionDistributionClaimedEvent_OrderBy = SubscriptionDistributionClaimedEvent_OrderBy = {}));
var SubscriptionRevokedEvent_OrderBy;
(function(SubscriptionRevokedEvent_OrderBy) {
    SubscriptionRevokedEvent_OrderBy["Addresses"] = "addresses";
    SubscriptionRevokedEvent_OrderBy["BlockNumber"] = "blockNumber";
    SubscriptionRevokedEvent_OrderBy["GasPrice"] = "gasPrice";
    SubscriptionRevokedEvent_OrderBy["GasUsed"] = "gasUsed";
    SubscriptionRevokedEvent_OrderBy["Id"] = "id";
    SubscriptionRevokedEvent_OrderBy["IndexId"] = "indexId";
    SubscriptionRevokedEvent_OrderBy["LogIndex"] = "logIndex";
    SubscriptionRevokedEvent_OrderBy["Name"] = "name";
    SubscriptionRevokedEvent_OrderBy["Order"] = "order";
    SubscriptionRevokedEvent_OrderBy["Publisher"] = "publisher";
    SubscriptionRevokedEvent_OrderBy["Subscriber"] = "subscriber";
    SubscriptionRevokedEvent_OrderBy["Subscription"] = "subscription";
    SubscriptionRevokedEvent_OrderBy["Subscription__approved"] = "subscription__approved";
    SubscriptionRevokedEvent_OrderBy["Subscription__createdAtBlockNumber"] = "subscription__createdAtBlockNumber";
    SubscriptionRevokedEvent_OrderBy["Subscription__createdAtTimestamp"] = "subscription__createdAtTimestamp";
    SubscriptionRevokedEvent_OrderBy["Subscription__id"] = "subscription__id";
    SubscriptionRevokedEvent_OrderBy["Subscription__indexValueUntilUpdatedAt"] = "subscription__indexValueUntilUpdatedAt";
    SubscriptionRevokedEvent_OrderBy["Subscription__totalAmountReceivedUntilUpdatedAt"] = "subscription__totalAmountReceivedUntilUpdatedAt";
    SubscriptionRevokedEvent_OrderBy["Subscription__units"] = "subscription__units";
    SubscriptionRevokedEvent_OrderBy["Subscription__updatedAtBlockNumber"] = "subscription__updatedAtBlockNumber";
    SubscriptionRevokedEvent_OrderBy["Subscription__updatedAtTimestamp"] = "subscription__updatedAtTimestamp";
    SubscriptionRevokedEvent_OrderBy["Timestamp"] = "timestamp";
    SubscriptionRevokedEvent_OrderBy["Token"] = "token";
    SubscriptionRevokedEvent_OrderBy["TransactionHash"] = "transactionHash";
    SubscriptionRevokedEvent_OrderBy["UserData"] = "userData";
})(SubscriptionRevokedEvent_OrderBy || (exports.SubscriptionRevokedEvent_OrderBy = SubscriptionRevokedEvent_OrderBy = {}));
var SubscriptionUnitsUpdatedEvent_OrderBy;
(function(SubscriptionUnitsUpdatedEvent_OrderBy) {
    SubscriptionUnitsUpdatedEvent_OrderBy["Addresses"] = "addresses";
    SubscriptionUnitsUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    SubscriptionUnitsUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    SubscriptionUnitsUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    SubscriptionUnitsUpdatedEvent_OrderBy["Id"] = "id";
    SubscriptionUnitsUpdatedEvent_OrderBy["IndexId"] = "indexId";
    SubscriptionUnitsUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    SubscriptionUnitsUpdatedEvent_OrderBy["Name"] = "name";
    SubscriptionUnitsUpdatedEvent_OrderBy["OldUnits"] = "oldUnits";
    SubscriptionUnitsUpdatedEvent_OrderBy["Order"] = "order";
    SubscriptionUnitsUpdatedEvent_OrderBy["Publisher"] = "publisher";
    SubscriptionUnitsUpdatedEvent_OrderBy["Subscriber"] = "subscriber";
    SubscriptionUnitsUpdatedEvent_OrderBy["Subscription"] = "subscription";
    SubscriptionUnitsUpdatedEvent_OrderBy["Subscription__approved"] = "subscription__approved";
    SubscriptionUnitsUpdatedEvent_OrderBy["Subscription__createdAtBlockNumber"] = "subscription__createdAtBlockNumber";
    SubscriptionUnitsUpdatedEvent_OrderBy["Subscription__createdAtTimestamp"] = "subscription__createdAtTimestamp";
    SubscriptionUnitsUpdatedEvent_OrderBy["Subscription__id"] = "subscription__id";
    SubscriptionUnitsUpdatedEvent_OrderBy["Subscription__indexValueUntilUpdatedAt"] = "subscription__indexValueUntilUpdatedAt";
    SubscriptionUnitsUpdatedEvent_OrderBy["Subscription__totalAmountReceivedUntilUpdatedAt"] = "subscription__totalAmountReceivedUntilUpdatedAt";
    SubscriptionUnitsUpdatedEvent_OrderBy["Subscription__units"] = "subscription__units";
    SubscriptionUnitsUpdatedEvent_OrderBy["Subscription__updatedAtBlockNumber"] = "subscription__updatedAtBlockNumber";
    SubscriptionUnitsUpdatedEvent_OrderBy["Subscription__updatedAtTimestamp"] = "subscription__updatedAtTimestamp";
    SubscriptionUnitsUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    SubscriptionUnitsUpdatedEvent_OrderBy["Token"] = "token";
    SubscriptionUnitsUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
    SubscriptionUnitsUpdatedEvent_OrderBy["Units"] = "units";
    SubscriptionUnitsUpdatedEvent_OrderBy["UserData"] = "userData";
})(SubscriptionUnitsUpdatedEvent_OrderBy || (exports.SubscriptionUnitsUpdatedEvent_OrderBy = SubscriptionUnitsUpdatedEvent_OrderBy = {}));
var SuperTokenCreatedEvent_OrderBy;
(function(SuperTokenCreatedEvent_OrderBy) {
    SuperTokenCreatedEvent_OrderBy["Addresses"] = "addresses";
    SuperTokenCreatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    SuperTokenCreatedEvent_OrderBy["GasPrice"] = "gasPrice";
    SuperTokenCreatedEvent_OrderBy["GasUsed"] = "gasUsed";
    SuperTokenCreatedEvent_OrderBy["Id"] = "id";
    SuperTokenCreatedEvent_OrderBy["LogIndex"] = "logIndex";
    SuperTokenCreatedEvent_OrderBy["Name"] = "name";
    SuperTokenCreatedEvent_OrderBy["Order"] = "order";
    SuperTokenCreatedEvent_OrderBy["Timestamp"] = "timestamp";
    SuperTokenCreatedEvent_OrderBy["Token"] = "token";
    SuperTokenCreatedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(SuperTokenCreatedEvent_OrderBy || (exports.SuperTokenCreatedEvent_OrderBy = SuperTokenCreatedEvent_OrderBy = {}));
var SuperTokenFactoryUpdatedEvent_OrderBy;
(function(SuperTokenFactoryUpdatedEvent_OrderBy) {
    SuperTokenFactoryUpdatedEvent_OrderBy["Addresses"] = "addresses";
    SuperTokenFactoryUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    SuperTokenFactoryUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    SuperTokenFactoryUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    SuperTokenFactoryUpdatedEvent_OrderBy["Id"] = "id";
    SuperTokenFactoryUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    SuperTokenFactoryUpdatedEvent_OrderBy["Name"] = "name";
    SuperTokenFactoryUpdatedEvent_OrderBy["NewFactory"] = "newFactory";
    SuperTokenFactoryUpdatedEvent_OrderBy["Order"] = "order";
    SuperTokenFactoryUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    SuperTokenFactoryUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(SuperTokenFactoryUpdatedEvent_OrderBy || (exports.SuperTokenFactoryUpdatedEvent_OrderBy = SuperTokenFactoryUpdatedEvent_OrderBy = {}));
var SuperTokenLogicCreatedEvent_OrderBy;
(function(SuperTokenLogicCreatedEvent_OrderBy) {
    SuperTokenLogicCreatedEvent_OrderBy["Addresses"] = "addresses";
    SuperTokenLogicCreatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    SuperTokenLogicCreatedEvent_OrderBy["GasPrice"] = "gasPrice";
    SuperTokenLogicCreatedEvent_OrderBy["GasUsed"] = "gasUsed";
    SuperTokenLogicCreatedEvent_OrderBy["Id"] = "id";
    SuperTokenLogicCreatedEvent_OrderBy["LogIndex"] = "logIndex";
    SuperTokenLogicCreatedEvent_OrderBy["Name"] = "name";
    SuperTokenLogicCreatedEvent_OrderBy["Order"] = "order";
    SuperTokenLogicCreatedEvent_OrderBy["Timestamp"] = "timestamp";
    SuperTokenLogicCreatedEvent_OrderBy["TokenLogic"] = "tokenLogic";
    SuperTokenLogicCreatedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(SuperTokenLogicCreatedEvent_OrderBy || (exports.SuperTokenLogicCreatedEvent_OrderBy = SuperTokenLogicCreatedEvent_OrderBy = {}));
var SuperTokenLogicUpdatedEvent_OrderBy;
(function(SuperTokenLogicUpdatedEvent_OrderBy) {
    SuperTokenLogicUpdatedEvent_OrderBy["Addresses"] = "addresses";
    SuperTokenLogicUpdatedEvent_OrderBy["BlockNumber"] = "blockNumber";
    SuperTokenLogicUpdatedEvent_OrderBy["Code"] = "code";
    SuperTokenLogicUpdatedEvent_OrderBy["GasPrice"] = "gasPrice";
    SuperTokenLogicUpdatedEvent_OrderBy["GasUsed"] = "gasUsed";
    SuperTokenLogicUpdatedEvent_OrderBy["Id"] = "id";
    SuperTokenLogicUpdatedEvent_OrderBy["LogIndex"] = "logIndex";
    SuperTokenLogicUpdatedEvent_OrderBy["Name"] = "name";
    SuperTokenLogicUpdatedEvent_OrderBy["Order"] = "order";
    SuperTokenLogicUpdatedEvent_OrderBy["Timestamp"] = "timestamp";
    SuperTokenLogicUpdatedEvent_OrderBy["Token"] = "token";
    SuperTokenLogicUpdatedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(SuperTokenLogicUpdatedEvent_OrderBy || (exports.SuperTokenLogicUpdatedEvent_OrderBy = SuperTokenLogicUpdatedEvent_OrderBy = {}));
var SuperTokenMinimumDepositChangedEvent_OrderBy;
(function(SuperTokenMinimumDepositChangedEvent_OrderBy) {
    SuperTokenMinimumDepositChangedEvent_OrderBy["Addresses"] = "addresses";
    SuperTokenMinimumDepositChangedEvent_OrderBy["BlockNumber"] = "blockNumber";
    SuperTokenMinimumDepositChangedEvent_OrderBy["GasPrice"] = "gasPrice";
    SuperTokenMinimumDepositChangedEvent_OrderBy["GasUsed"] = "gasUsed";
    SuperTokenMinimumDepositChangedEvent_OrderBy["GovernanceAddress"] = "governanceAddress";
    SuperTokenMinimumDepositChangedEvent_OrderBy["Host"] = "host";
    SuperTokenMinimumDepositChangedEvent_OrderBy["Id"] = "id";
    SuperTokenMinimumDepositChangedEvent_OrderBy["IsKeySet"] = "isKeySet";
    SuperTokenMinimumDepositChangedEvent_OrderBy["LogIndex"] = "logIndex";
    SuperTokenMinimumDepositChangedEvent_OrderBy["MinimumDeposit"] = "minimumDeposit";
    SuperTokenMinimumDepositChangedEvent_OrderBy["Name"] = "name";
    SuperTokenMinimumDepositChangedEvent_OrderBy["Order"] = "order";
    SuperTokenMinimumDepositChangedEvent_OrderBy["SuperToken"] = "superToken";
    SuperTokenMinimumDepositChangedEvent_OrderBy["Timestamp"] = "timestamp";
    SuperTokenMinimumDepositChangedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(SuperTokenMinimumDepositChangedEvent_OrderBy || (exports.SuperTokenMinimumDepositChangedEvent_OrderBy = SuperTokenMinimumDepositChangedEvent_OrderBy = {}));
var TokenDowngradedEvent_OrderBy;
(function(TokenDowngradedEvent_OrderBy) {
    TokenDowngradedEvent_OrderBy["Account"] = "account";
    TokenDowngradedEvent_OrderBy["Account__createdAtBlockNumber"] = "account__createdAtBlockNumber";
    TokenDowngradedEvent_OrderBy["Account__createdAtTimestamp"] = "account__createdAtTimestamp";
    TokenDowngradedEvent_OrderBy["Account__id"] = "account__id";
    TokenDowngradedEvent_OrderBy["Account__isSuperApp"] = "account__isSuperApp";
    TokenDowngradedEvent_OrderBy["Account__updatedAtBlockNumber"] = "account__updatedAtBlockNumber";
    TokenDowngradedEvent_OrderBy["Account__updatedAtTimestamp"] = "account__updatedAtTimestamp";
    TokenDowngradedEvent_OrderBy["Addresses"] = "addresses";
    TokenDowngradedEvent_OrderBy["Amount"] = "amount";
    TokenDowngradedEvent_OrderBy["BlockNumber"] = "blockNumber";
    TokenDowngradedEvent_OrderBy["GasPrice"] = "gasPrice";
    TokenDowngradedEvent_OrderBy["GasUsed"] = "gasUsed";
    TokenDowngradedEvent_OrderBy["Id"] = "id";
    TokenDowngradedEvent_OrderBy["LogIndex"] = "logIndex";
    TokenDowngradedEvent_OrderBy["Name"] = "name";
    TokenDowngradedEvent_OrderBy["Order"] = "order";
    TokenDowngradedEvent_OrderBy["Timestamp"] = "timestamp";
    TokenDowngradedEvent_OrderBy["Token"] = "token";
    TokenDowngradedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(TokenDowngradedEvent_OrderBy || (exports.TokenDowngradedEvent_OrderBy = TokenDowngradedEvent_OrderBy = {}));
var TokenGovernanceConfig_OrderBy;
(function(TokenGovernanceConfig_OrderBy) {
    TokenGovernanceConfig_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    TokenGovernanceConfig_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    TokenGovernanceConfig_OrderBy["Id"] = "id";
    TokenGovernanceConfig_OrderBy["IsDefault"] = "isDefault";
    TokenGovernanceConfig_OrderBy["LiquidationPeriod"] = "liquidationPeriod";
    TokenGovernanceConfig_OrderBy["MinimumDeposit"] = "minimumDeposit";
    TokenGovernanceConfig_OrderBy["PatricianPeriod"] = "patricianPeriod";
    TokenGovernanceConfig_OrderBy["RewardAddress"] = "rewardAddress";
    TokenGovernanceConfig_OrderBy["Token"] = "token";
    TokenGovernanceConfig_OrderBy["Token__createdAtBlockNumber"] = "token__createdAtBlockNumber";
    TokenGovernanceConfig_OrderBy["Token__createdAtTimestamp"] = "token__createdAtTimestamp";
    TokenGovernanceConfig_OrderBy["Token__decimals"] = "token__decimals";
    TokenGovernanceConfig_OrderBy["Token__id"] = "token__id";
    TokenGovernanceConfig_OrderBy["Token__isListed"] = "token__isListed";
    TokenGovernanceConfig_OrderBy["Token__isNativeAssetSuperToken"] = "token__isNativeAssetSuperToken";
    TokenGovernanceConfig_OrderBy["Token__isSuperToken"] = "token__isSuperToken";
    TokenGovernanceConfig_OrderBy["Token__name"] = "token__name";
    TokenGovernanceConfig_OrderBy["Token__symbol"] = "token__symbol";
    TokenGovernanceConfig_OrderBy["Token__underlyingAddress"] = "token__underlyingAddress";
    TokenGovernanceConfig_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    TokenGovernanceConfig_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
})(TokenGovernanceConfig_OrderBy || (exports.TokenGovernanceConfig_OrderBy = TokenGovernanceConfig_OrderBy = {}));
var TokenStatisticLog_OrderBy;
(function(TokenStatisticLog_OrderBy) {
    TokenStatisticLog_OrderBy["BlockNumber"] = "blockNumber";
    TokenStatisticLog_OrderBy["Id"] = "id";
    TokenStatisticLog_OrderBy["LogIndex"] = "logIndex";
    TokenStatisticLog_OrderBy["Order"] = "order";
    TokenStatisticLog_OrderBy["Timestamp"] = "timestamp";
    TokenStatisticLog_OrderBy["Token"] = "token";
    TokenStatisticLog_OrderBy["TokenStatistic"] = "tokenStatistic";
    TokenStatisticLog_OrderBy["TokenStatistic__id"] = "tokenStatistic__id";
    TokenStatisticLog_OrderBy["TokenStatistic__totalAmountDistributedUntilUpdatedAt"] = "tokenStatistic__totalAmountDistributedUntilUpdatedAt";
    TokenStatisticLog_OrderBy["TokenStatistic__totalAmountStreamedUntilUpdatedAt"] = "tokenStatistic__totalAmountStreamedUntilUpdatedAt";
    TokenStatisticLog_OrderBy["TokenStatistic__totalAmountTransferredUntilUpdatedAt"] = "tokenStatistic__totalAmountTransferredUntilUpdatedAt";
    TokenStatisticLog_OrderBy["TokenStatistic__totalApprovedSubscriptions"] = "tokenStatistic__totalApprovedSubscriptions";
    TokenStatisticLog_OrderBy["TokenStatistic__totalCFAAmountStreamedUntilUpdatedAt"] = "tokenStatistic__totalCFAAmountStreamedUntilUpdatedAt";
    TokenStatisticLog_OrderBy["TokenStatistic__totalCFADeposit"] = "tokenStatistic__totalCFADeposit";
    TokenStatisticLog_OrderBy["TokenStatistic__totalCFANumberOfActiveStreams"] = "tokenStatistic__totalCFANumberOfActiveStreams";
    TokenStatisticLog_OrderBy["TokenStatistic__totalCFANumberOfClosedStreams"] = "tokenStatistic__totalCFANumberOfClosedStreams";
    TokenStatisticLog_OrderBy["TokenStatistic__totalCFAOutflowRate"] = "tokenStatistic__totalCFAOutflowRate";
    TokenStatisticLog_OrderBy["TokenStatistic__totalConnectedMemberships"] = "tokenStatistic__totalConnectedMemberships";
    TokenStatisticLog_OrderBy["TokenStatistic__totalDeposit"] = "tokenStatistic__totalDeposit";
    TokenStatisticLog_OrderBy["TokenStatistic__totalGDADeposit"] = "tokenStatistic__totalGDADeposit";
    TokenStatisticLog_OrderBy["TokenStatistic__totalGDANumberOfActiveStreams"] = "tokenStatistic__totalGDANumberOfActiveStreams";
    TokenStatisticLog_OrderBy["TokenStatistic__totalGDANumberOfClosedStreams"] = "tokenStatistic__totalGDANumberOfClosedStreams";
    TokenStatisticLog_OrderBy["TokenStatistic__totalGDAOutflowRate"] = "tokenStatistic__totalGDAOutflowRate";
    TokenStatisticLog_OrderBy["TokenStatistic__totalMembershipsWithUnits"] = "tokenStatistic__totalMembershipsWithUnits";
    TokenStatisticLog_OrderBy["TokenStatistic__totalNumberOfAccounts"] = "tokenStatistic__totalNumberOfAccounts";
    TokenStatisticLog_OrderBy["TokenStatistic__totalNumberOfActiveIndexes"] = "tokenStatistic__totalNumberOfActiveIndexes";
    TokenStatisticLog_OrderBy["TokenStatistic__totalNumberOfActivePools"] = "tokenStatistic__totalNumberOfActivePools";
    TokenStatisticLog_OrderBy["TokenStatistic__totalNumberOfActiveStreams"] = "tokenStatistic__totalNumberOfActiveStreams";
    TokenStatisticLog_OrderBy["TokenStatistic__totalNumberOfClosedStreams"] = "tokenStatistic__totalNumberOfClosedStreams";
    TokenStatisticLog_OrderBy["TokenStatistic__totalNumberOfHolders"] = "tokenStatistic__totalNumberOfHolders";
    TokenStatisticLog_OrderBy["TokenStatistic__totalNumberOfIndexes"] = "tokenStatistic__totalNumberOfIndexes";
    TokenStatisticLog_OrderBy["TokenStatistic__totalNumberOfPools"] = "tokenStatistic__totalNumberOfPools";
    TokenStatisticLog_OrderBy["TokenStatistic__totalOutflowRate"] = "tokenStatistic__totalOutflowRate";
    TokenStatisticLog_OrderBy["TokenStatistic__totalSubscriptionsWithUnits"] = "tokenStatistic__totalSubscriptionsWithUnits";
    TokenStatisticLog_OrderBy["TokenStatistic__totalSupply"] = "tokenStatistic__totalSupply";
    TokenStatisticLog_OrderBy["TokenStatistic__updatedAtBlockNumber"] = "tokenStatistic__updatedAtBlockNumber";
    TokenStatisticLog_OrderBy["TokenStatistic__updatedAtTimestamp"] = "tokenStatistic__updatedAtTimestamp";
    TokenStatisticLog_OrderBy["Token__createdAtBlockNumber"] = "token__createdAtBlockNumber";
    TokenStatisticLog_OrderBy["Token__createdAtTimestamp"] = "token__createdAtTimestamp";
    TokenStatisticLog_OrderBy["Token__decimals"] = "token__decimals";
    TokenStatisticLog_OrderBy["Token__id"] = "token__id";
    TokenStatisticLog_OrderBy["Token__isListed"] = "token__isListed";
    TokenStatisticLog_OrderBy["Token__isNativeAssetSuperToken"] = "token__isNativeAssetSuperToken";
    TokenStatisticLog_OrderBy["Token__isSuperToken"] = "token__isSuperToken";
    TokenStatisticLog_OrderBy["Token__name"] = "token__name";
    TokenStatisticLog_OrderBy["Token__symbol"] = "token__symbol";
    TokenStatisticLog_OrderBy["Token__underlyingAddress"] = "token__underlyingAddress";
    TokenStatisticLog_OrderBy["TotalAmountDistributed"] = "totalAmountDistributed";
    TokenStatisticLog_OrderBy["TotalAmountStreamed"] = "totalAmountStreamed";
    TokenStatisticLog_OrderBy["TotalAmountTransferred"] = "totalAmountTransferred";
    TokenStatisticLog_OrderBy["TotalApprovedSubscriptions"] = "totalApprovedSubscriptions";
    TokenStatisticLog_OrderBy["TotalCFAAmountStreamed"] = "totalCFAAmountStreamed";
    TokenStatisticLog_OrderBy["TotalCFADeposit"] = "totalCFADeposit";
    TokenStatisticLog_OrderBy["TotalCFANumberOfActiveStreams"] = "totalCFANumberOfActiveStreams";
    TokenStatisticLog_OrderBy["TotalCFANumberOfClosedStreams"] = "totalCFANumberOfClosedStreams";
    TokenStatisticLog_OrderBy["TotalCFAOutflowRate"] = "totalCFAOutflowRate";
    TokenStatisticLog_OrderBy["TotalConnectedMemberships"] = "totalConnectedMemberships";
    TokenStatisticLog_OrderBy["TotalDeposit"] = "totalDeposit";
    TokenStatisticLog_OrderBy["TotalGDADeposit"] = "totalGDADeposit";
    TokenStatisticLog_OrderBy["TotalGDANumberOfActiveStreams"] = "totalGDANumberOfActiveStreams";
    TokenStatisticLog_OrderBy["TotalGDANumberOfClosedStreams"] = "totalGDANumberOfClosedStreams";
    TokenStatisticLog_OrderBy["TotalGDAOutflowRate"] = "totalGDAOutflowRate";
    TokenStatisticLog_OrderBy["TotalMembershipsWithUnits"] = "totalMembershipsWithUnits";
    TokenStatisticLog_OrderBy["TotalNumberOfAccounts"] = "totalNumberOfAccounts";
    TokenStatisticLog_OrderBy["TotalNumberOfActiveIndexes"] = "totalNumberOfActiveIndexes";
    TokenStatisticLog_OrderBy["TotalNumberOfActivePools"] = "totalNumberOfActivePools";
    TokenStatisticLog_OrderBy["TotalNumberOfActiveStreams"] = "totalNumberOfActiveStreams";
    TokenStatisticLog_OrderBy["TotalNumberOfClosedStreams"] = "totalNumberOfClosedStreams";
    TokenStatisticLog_OrderBy["TotalNumberOfHolders"] = "totalNumberOfHolders";
    TokenStatisticLog_OrderBy["TotalNumberOfIndexes"] = "totalNumberOfIndexes";
    TokenStatisticLog_OrderBy["TotalNumberOfPools"] = "totalNumberOfPools";
    TokenStatisticLog_OrderBy["TotalOutflowRate"] = "totalOutflowRate";
    TokenStatisticLog_OrderBy["TotalSubscriptionsWithUnits"] = "totalSubscriptionsWithUnits";
    TokenStatisticLog_OrderBy["TotalSupply"] = "totalSupply";
    TokenStatisticLog_OrderBy["TransactionHash"] = "transactionHash";
    TokenStatisticLog_OrderBy["TriggeredByEventName"] = "triggeredByEventName";
})(TokenStatisticLog_OrderBy || (exports.TokenStatisticLog_OrderBy = TokenStatisticLog_OrderBy = {}));
var TokenStatistic_OrderBy;
(function(TokenStatistic_OrderBy) {
    TokenStatistic_OrderBy["Id"] = "id";
    TokenStatistic_OrderBy["Token"] = "token";
    TokenStatistic_OrderBy["TokenStatisticLogs"] = "tokenStatisticLogs";
    TokenStatistic_OrderBy["Token__createdAtBlockNumber"] = "token__createdAtBlockNumber";
    TokenStatistic_OrderBy["Token__createdAtTimestamp"] = "token__createdAtTimestamp";
    TokenStatistic_OrderBy["Token__decimals"] = "token__decimals";
    TokenStatistic_OrderBy["Token__id"] = "token__id";
    TokenStatistic_OrderBy["Token__isListed"] = "token__isListed";
    TokenStatistic_OrderBy["Token__isNativeAssetSuperToken"] = "token__isNativeAssetSuperToken";
    TokenStatistic_OrderBy["Token__isSuperToken"] = "token__isSuperToken";
    TokenStatistic_OrderBy["Token__name"] = "token__name";
    TokenStatistic_OrderBy["Token__symbol"] = "token__symbol";
    TokenStatistic_OrderBy["Token__underlyingAddress"] = "token__underlyingAddress";
    TokenStatistic_OrderBy["TotalAmountDistributedUntilUpdatedAt"] = "totalAmountDistributedUntilUpdatedAt";
    TokenStatistic_OrderBy["TotalAmountStreamedUntilUpdatedAt"] = "totalAmountStreamedUntilUpdatedAt";
    TokenStatistic_OrderBy["TotalAmountTransferredUntilUpdatedAt"] = "totalAmountTransferredUntilUpdatedAt";
    TokenStatistic_OrderBy["TotalApprovedSubscriptions"] = "totalApprovedSubscriptions";
    TokenStatistic_OrderBy["TotalCFAAmountStreamedUntilUpdatedAt"] = "totalCFAAmountStreamedUntilUpdatedAt";
    TokenStatistic_OrderBy["TotalCFADeposit"] = "totalCFADeposit";
    TokenStatistic_OrderBy["TotalCFANumberOfActiveStreams"] = "totalCFANumberOfActiveStreams";
    TokenStatistic_OrderBy["TotalCFANumberOfClosedStreams"] = "totalCFANumberOfClosedStreams";
    TokenStatistic_OrderBy["TotalCFAOutflowRate"] = "totalCFAOutflowRate";
    TokenStatistic_OrderBy["TotalConnectedMemberships"] = "totalConnectedMemberships";
    TokenStatistic_OrderBy["TotalDeposit"] = "totalDeposit";
    TokenStatistic_OrderBy["TotalGDADeposit"] = "totalGDADeposit";
    TokenStatistic_OrderBy["TotalGDANumberOfActiveStreams"] = "totalGDANumberOfActiveStreams";
    TokenStatistic_OrderBy["TotalGDANumberOfClosedStreams"] = "totalGDANumberOfClosedStreams";
    TokenStatistic_OrderBy["TotalGDAOutflowRate"] = "totalGDAOutflowRate";
    TokenStatistic_OrderBy["TotalMembershipsWithUnits"] = "totalMembershipsWithUnits";
    TokenStatistic_OrderBy["TotalNumberOfAccounts"] = "totalNumberOfAccounts";
    TokenStatistic_OrderBy["TotalNumberOfActiveIndexes"] = "totalNumberOfActiveIndexes";
    TokenStatistic_OrderBy["TotalNumberOfActivePools"] = "totalNumberOfActivePools";
    TokenStatistic_OrderBy["TotalNumberOfActiveStreams"] = "totalNumberOfActiveStreams";
    TokenStatistic_OrderBy["TotalNumberOfClosedStreams"] = "totalNumberOfClosedStreams";
    TokenStatistic_OrderBy["TotalNumberOfHolders"] = "totalNumberOfHolders";
    TokenStatistic_OrderBy["TotalNumberOfIndexes"] = "totalNumberOfIndexes";
    TokenStatistic_OrderBy["TotalNumberOfPools"] = "totalNumberOfPools";
    TokenStatistic_OrderBy["TotalOutflowRate"] = "totalOutflowRate";
    TokenStatistic_OrderBy["TotalSubscriptionsWithUnits"] = "totalSubscriptionsWithUnits";
    TokenStatistic_OrderBy["TotalSupply"] = "totalSupply";
    TokenStatistic_OrderBy["UpdatedAtBlockNumber"] = "updatedAtBlockNumber";
    TokenStatistic_OrderBy["UpdatedAtTimestamp"] = "updatedAtTimestamp";
})(TokenStatistic_OrderBy || (exports.TokenStatistic_OrderBy = TokenStatistic_OrderBy = {}));
var TokenUpgradedEvent_OrderBy;
(function(TokenUpgradedEvent_OrderBy) {
    TokenUpgradedEvent_OrderBy["Account"] = "account";
    TokenUpgradedEvent_OrderBy["Account__createdAtBlockNumber"] = "account__createdAtBlockNumber";
    TokenUpgradedEvent_OrderBy["Account__createdAtTimestamp"] = "account__createdAtTimestamp";
    TokenUpgradedEvent_OrderBy["Account__id"] = "account__id";
    TokenUpgradedEvent_OrderBy["Account__isSuperApp"] = "account__isSuperApp";
    TokenUpgradedEvent_OrderBy["Account__updatedAtBlockNumber"] = "account__updatedAtBlockNumber";
    TokenUpgradedEvent_OrderBy["Account__updatedAtTimestamp"] = "account__updatedAtTimestamp";
    TokenUpgradedEvent_OrderBy["Addresses"] = "addresses";
    TokenUpgradedEvent_OrderBy["Amount"] = "amount";
    TokenUpgradedEvent_OrderBy["BlockNumber"] = "blockNumber";
    TokenUpgradedEvent_OrderBy["GasPrice"] = "gasPrice";
    TokenUpgradedEvent_OrderBy["GasUsed"] = "gasUsed";
    TokenUpgradedEvent_OrderBy["Id"] = "id";
    TokenUpgradedEvent_OrderBy["LogIndex"] = "logIndex";
    TokenUpgradedEvent_OrderBy["Name"] = "name";
    TokenUpgradedEvent_OrderBy["Order"] = "order";
    TokenUpgradedEvent_OrderBy["Timestamp"] = "timestamp";
    TokenUpgradedEvent_OrderBy["Token"] = "token";
    TokenUpgradedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(TokenUpgradedEvent_OrderBy || (exports.TokenUpgradedEvent_OrderBy = TokenUpgradedEvent_OrderBy = {}));
var Token_OrderBy;
(function(Token_OrderBy) {
    Token_OrderBy["CreatedAtBlockNumber"] = "createdAtBlockNumber";
    Token_OrderBy["CreatedAtTimestamp"] = "createdAtTimestamp";
    Token_OrderBy["Decimals"] = "decimals";
    Token_OrderBy["GovernanceConfig"] = "governanceConfig";
    Token_OrderBy["GovernanceConfig__createdAtBlockNumber"] = "governanceConfig__createdAtBlockNumber";
    Token_OrderBy["GovernanceConfig__createdAtTimestamp"] = "governanceConfig__createdAtTimestamp";
    Token_OrderBy["GovernanceConfig__id"] = "governanceConfig__id";
    Token_OrderBy["GovernanceConfig__isDefault"] = "governanceConfig__isDefault";
    Token_OrderBy["GovernanceConfig__liquidationPeriod"] = "governanceConfig__liquidationPeriod";
    Token_OrderBy["GovernanceConfig__minimumDeposit"] = "governanceConfig__minimumDeposit";
    Token_OrderBy["GovernanceConfig__patricianPeriod"] = "governanceConfig__patricianPeriod";
    Token_OrderBy["GovernanceConfig__rewardAddress"] = "governanceConfig__rewardAddress";
    Token_OrderBy["GovernanceConfig__updatedAtBlockNumber"] = "governanceConfig__updatedAtBlockNumber";
    Token_OrderBy["GovernanceConfig__updatedAtTimestamp"] = "governanceConfig__updatedAtTimestamp";
    Token_OrderBy["Id"] = "id";
    Token_OrderBy["IsListed"] = "isListed";
    Token_OrderBy["IsNativeAssetSuperToken"] = "isNativeAssetSuperToken";
    Token_OrderBy["IsSuperToken"] = "isSuperToken";
    Token_OrderBy["Name"] = "name";
    Token_OrderBy["Symbol"] = "symbol";
    Token_OrderBy["UnderlyingAddress"] = "underlyingAddress";
    Token_OrderBy["UnderlyingToken"] = "underlyingToken";
    Token_OrderBy["UnderlyingToken__createdAtBlockNumber"] = "underlyingToken__createdAtBlockNumber";
    Token_OrderBy["UnderlyingToken__createdAtTimestamp"] = "underlyingToken__createdAtTimestamp";
    Token_OrderBy["UnderlyingToken__decimals"] = "underlyingToken__decimals";
    Token_OrderBy["UnderlyingToken__id"] = "underlyingToken__id";
    Token_OrderBy["UnderlyingToken__isListed"] = "underlyingToken__isListed";
    Token_OrderBy["UnderlyingToken__isNativeAssetSuperToken"] = "underlyingToken__isNativeAssetSuperToken";
    Token_OrderBy["UnderlyingToken__isSuperToken"] = "underlyingToken__isSuperToken";
    Token_OrderBy["UnderlyingToken__name"] = "underlyingToken__name";
    Token_OrderBy["UnderlyingToken__symbol"] = "underlyingToken__symbol";
    Token_OrderBy["UnderlyingToken__underlyingAddress"] = "underlyingToken__underlyingAddress";
})(Token_OrderBy || (exports.Token_OrderBy = Token_OrderBy = {}));
var TransferEvent_OrderBy;
(function(TransferEvent_OrderBy) {
    TransferEvent_OrderBy["Addresses"] = "addresses";
    TransferEvent_OrderBy["BlockNumber"] = "blockNumber";
    TransferEvent_OrderBy["From"] = "from";
    TransferEvent_OrderBy["From__createdAtBlockNumber"] = "from__createdAtBlockNumber";
    TransferEvent_OrderBy["From__createdAtTimestamp"] = "from__createdAtTimestamp";
    TransferEvent_OrderBy["From__id"] = "from__id";
    TransferEvent_OrderBy["From__isSuperApp"] = "from__isSuperApp";
    TransferEvent_OrderBy["From__updatedAtBlockNumber"] = "from__updatedAtBlockNumber";
    TransferEvent_OrderBy["From__updatedAtTimestamp"] = "from__updatedAtTimestamp";
    TransferEvent_OrderBy["GasPrice"] = "gasPrice";
    TransferEvent_OrderBy["GasUsed"] = "gasUsed";
    TransferEvent_OrderBy["Id"] = "id";
    TransferEvent_OrderBy["LogIndex"] = "logIndex";
    TransferEvent_OrderBy["Name"] = "name";
    TransferEvent_OrderBy["Order"] = "order";
    TransferEvent_OrderBy["Timestamp"] = "timestamp";
    TransferEvent_OrderBy["To"] = "to";
    TransferEvent_OrderBy["To__createdAtBlockNumber"] = "to__createdAtBlockNumber";
    TransferEvent_OrderBy["To__createdAtTimestamp"] = "to__createdAtTimestamp";
    TransferEvent_OrderBy["To__id"] = "to__id";
    TransferEvent_OrderBy["To__isSuperApp"] = "to__isSuperApp";
    TransferEvent_OrderBy["To__updatedAtBlockNumber"] = "to__updatedAtBlockNumber";
    TransferEvent_OrderBy["To__updatedAtTimestamp"] = "to__updatedAtTimestamp";
    TransferEvent_OrderBy["Token"] = "token";
    TransferEvent_OrderBy["TransactionHash"] = "transactionHash";
    TransferEvent_OrderBy["Value"] = "value";
})(TransferEvent_OrderBy || (exports.TransferEvent_OrderBy = TransferEvent_OrderBy = {}));
var TrustedForwarderChangedEvent_OrderBy;
(function(TrustedForwarderChangedEvent_OrderBy) {
    TrustedForwarderChangedEvent_OrderBy["Addresses"] = "addresses";
    TrustedForwarderChangedEvent_OrderBy["BlockNumber"] = "blockNumber";
    TrustedForwarderChangedEvent_OrderBy["Enabled"] = "enabled";
    TrustedForwarderChangedEvent_OrderBy["Forwarder"] = "forwarder";
    TrustedForwarderChangedEvent_OrderBy["GasPrice"] = "gasPrice";
    TrustedForwarderChangedEvent_OrderBy["GasUsed"] = "gasUsed";
    TrustedForwarderChangedEvent_OrderBy["GovernanceAddress"] = "governanceAddress";
    TrustedForwarderChangedEvent_OrderBy["Host"] = "host";
    TrustedForwarderChangedEvent_OrderBy["Id"] = "id";
    TrustedForwarderChangedEvent_OrderBy["IsKeySet"] = "isKeySet";
    TrustedForwarderChangedEvent_OrderBy["LogIndex"] = "logIndex";
    TrustedForwarderChangedEvent_OrderBy["Name"] = "name";
    TrustedForwarderChangedEvent_OrderBy["Order"] = "order";
    TrustedForwarderChangedEvent_OrderBy["SuperToken"] = "superToken";
    TrustedForwarderChangedEvent_OrderBy["Timestamp"] = "timestamp";
    TrustedForwarderChangedEvent_OrderBy["TransactionHash"] = "transactionHash";
})(TrustedForwarderChangedEvent_OrderBy || (exports.TrustedForwarderChangedEvent_OrderBy = TrustedForwarderChangedEvent_OrderBy = {}));
var _SubgraphErrorPolicy_;
(function(_SubgraphErrorPolicy_) {
    /** Data will be returned even if the subgraph has indexing errors */ _SubgraphErrorPolicy_["Allow"] = "allow";
    /** If the subgraph has indexing errors, data will be omitted. The default. */ _SubgraphErrorPolicy_["Deny"] = "deny";
})(_SubgraphErrorPolicy_ || (exports._SubgraphErrorPolicy_ = _SubgraphErrorPolicy_ = {}));
exports.EventFragmentFragmentDoc = (0, graphql_tag_1.default)`
    fragment EventFragment on FlowUpdatedEvent {
  transactionHash
  blockNumber
  timestamp
  sender
  flowRate
  oldFlowRate
  type
}
    `;
exports.PaymentFragmentFragmentDoc = (0, graphql_tag_1.default)`
    fragment PaymentFragment on SentEvent {
  transactionHash
  blockNumber
  timestamp
  from
  amount
}
    `;
exports.GetSuperFluidEventsDocument = (0, graphql_tag_1.default)`
    query GetSuperFluidEvents($tokenAddress: Bytes!, $to: Bytes!, $reference: Bytes!) {
  untagged: flowUpdatedEvents(
    orderBy: timestamp
    where: {flowRate: "0", userData: "0x", type: 2, token: $tokenAddress, receiver: $to}
  ) {
    ...EventFragment
  }
  flow: flowUpdatedEvents(
    orderBy: timestamp
    where: {userData: $reference, token: $tokenAddress, receiver: $to}
  ) {
    ...EventFragment
  }
  payment: sentEvents(
    orderBy: timestamp
    where: {data: $reference, token: $tokenAddress, to: $to}
  ) {
    ...PaymentFragment
  }
}
    ${exports.EventFragmentFragmentDoc}
${exports.PaymentFragmentFragmentDoc}`;
const defaultWrapper = (action, _operationName, _operationType)=>action();
function getSdk(client, withWrapper = defaultWrapper) {
    return {
        GetSuperFluidEvents (variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders)=>client.request(exports.GetSuperFluidEventsDocument, variables, Object.assign(Object.assign({}, requestHeaders), wrappedRequestHeaders)), 'GetSuperFluidEvents', 'query');
        }
    };
}
exports.getSdk = getSdk;
exports.EventFragment = (0, graphql_tag_1.default)`
    fragment EventFragment on FlowUpdatedEvent {
  transactionHash
  blockNumber
  timestamp
  sender
  flowRate
  oldFlowRate
  type
}
    `;
exports.PaymentFragment = (0, graphql_tag_1.default)`
    fragment PaymentFragment on SentEvent {
  transactionHash
  blockNumber
  timestamp
  from
  amount
}
    `;
exports.GetSuperFluidEvents = (0, graphql_tag_1.default)`
    query GetSuperFluidEvents($tokenAddress: Bytes!, $to: Bytes!, $reference: Bytes!) {
  untagged: flowUpdatedEvents(
    orderBy: timestamp
    where: {flowRate: "0", userData: "0x", type: 2, token: $tokenAddress, receiver: $to}
  ) {
    ...EventFragment
  }
  flow: flowUpdatedEvents(
    orderBy: timestamp
    where: {userData: $reference, token: $tokenAddress, receiver: $to}
  ) {
    ...EventFragment
  }
  payment: sentEvents(
    orderBy: timestamp
    where: {data: $reference, token: $tokenAddress, to: $to}
  ) {
    ...PaymentFragment
  }
}
    ${exports.EventFragment}
${exports.PaymentFragment}`; //# sourceMappingURL=graphql-superfluid.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/superfluid.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildTheGraphSuperfluidUrl = exports.getTheGraphSuperfluidClient = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const graphql_request_1 = __turbopack_require__("[project]/node_modules/.pnpm/graphql-request@6.1.0_graphql@16.8.1/node_modules/graphql-request/build/cjs/index.js [app-rsc] (ecmascript)");
const graphql_superfluid_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/generated/graphql-superfluid.js [app-rsc] (ecmascript)");
const BASE_URL = `https://subgraph-endpoints.superfluid.dev`;
const NETWORK_TO_URL = {
    'arbitrum-one': 'arbitrum-one',
    avalanche: 'avalanche-c',
    base: 'base-mainnet',
    bsc: 'bsc-mainnet',
    celo: 'celo-mainnet',
    mainnet: 'eth-mainnet',
    matic: 'polygon-mainnet',
    optimism: 'optimism-mainnet',
    sepolia: 'eth-sepolia',
    xdai: 'xdai-mainnet'
};
const getTheGraphSuperfluidClient = (network, options)=>{
    const _a = options !== null && options !== void 0 ? options : {}, { baseUrl: _baseUrl } = _a, clientOptions = tslib_1.__rest(_a, [
        "baseUrl"
    ]);
    const url = (0, exports.buildTheGraphSuperfluidUrl)(_baseUrl, network);
    return (0, graphql_superfluid_1.getSdk)(new graphql_request_1.GraphQLClient(url, clientOptions));
};
exports.getTheGraphSuperfluidClient = getTheGraphSuperfluidClient;
const buildTheGraphSuperfluidUrl = (baseUrl, network)=>{
    // Note: it is also possible to use the IPFS hash of the subgraph
    //  eg. /subgraphs/id/QmcCaSkefrmhe4xQj6Y6BBbHiFkbrn6UGDEBUWER7nt399
    //  which is a better security but would require an update of the
    //  library each time the subgraph is updated, which isn't ideal
    //  for early testing.
    return network === 'private' ? 'http://localhost:8000/subgraphs/name/superfluid-finance/protocol-v1-goerli' : `${baseUrl || BASE_URL}/${NETWORK_TO_URL[network]}/protocol-v1`;
};
exports.buildTheGraphSuperfluidUrl = buildTheGraphSuperfluidUrl; //# sourceMappingURL=superfluid.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc777/superfluid-retriever.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SuperFluidInfoRetriever = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const superfluid_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/superfluid.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
class SuperFluidInfoRetriever {
    /**
     * @param paymentReference The reference to identify the payment
     * @param tokenContractAddress The address of the ERC777 contract
     * @param toAddress Address of the balance we want to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param network The Ethereum network to use
     * @param options Extra options to GraphQL client
     */ constructor(paymentReference, tokenContractAddress, toAddress, eventName, network, options){
        this.paymentReference = paymentReference;
        this.tokenContractAddress = tokenContractAddress;
        this.toAddress = toAddress;
        this.eventName = eventName;
        this.network = network;
        this.options = options;
        this.client = (0, superfluid_1.getTheGraphSuperfluidClient)(this.network, this.options);
    }
    getGraphVariables() {
        return {
            reference: `0xbeefac${this.paymentReference}`,
            to: this.toAddress,
            tokenAddress: this.tokenContractAddress
        };
    }
    /**
     * Chronological sorting of events having payment reference and closing events without payment reference
     * @returns List of streaming events
     */ getStreamingEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const variables = this.getGraphVariables();
            const { flow, untagged } = yield this.client.GetSuperFluidEvents(variables);
            return flow.concat(untagged).sort((a, b)=>a.timestamp - b.timestamp);
        });
    }
    /**
     * Chronological sorting of one off payment events having payment reference
     * @returns List of one off payment events
     */ getOneOffPaymentEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const variables = this.getGraphVariables();
            const { payment } = yield this.client.GetSuperFluidEvents(variables);
            return payment.sort((a, b)=>a.timestamp - b.timestamp);
        });
    }
    /**
     * First MVP version which convert :
     * stream events queried from SuperFluid subgraph
     * into payment events with the parameters expected by extractEvents function
     * to compute balance from amounts in ERC20 style transactions
     */ getTransferEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const streamEvents = yield this.getStreamingEvents();
            const oneOffPaymentEvents = yield this.getOneOffPaymentEvents();
            const paymentEvents = [];
            const TYPE_BEGIN = 0;
            // const TYPE_UPDATE = 1;
            const TYPE_END = 2;
            const StreamEventMap = {
                0: types_1.PaymentTypes.STREAM_EVENT_NAMES.START_STREAM,
                1: types_1.PaymentTypes.STREAM_EVENT_NAMES.UPDATE_STREAM,
                2: types_1.PaymentTypes.STREAM_EVENT_NAMES.END_STREAM
            };
            const getEventName = (flowEvent)=>{
                if (flowEvent.type) {
                    return StreamEventMap[flowEvent.type];
                }
            };
            if (streamEvents.length >= 1) {
                // if last event is ongoing stream then create end of stream to help compute balance
                const lastEventOngoing = streamEvents[streamEvents.length - 1].flowRate > 0;
                if (lastEventOngoing) {
                    streamEvents.push({
                        oldFlowRate: streamEvents[streamEvents.length - 1].flowRate,
                        flowRate: 0,
                        timestamp: (0, utils_1.getCurrentTimestampInSecond)(),
                        blockNumber: parseInt(streamEvents[streamEvents.length - 1].blockNumber.toString()),
                        transactionHash: streamEvents[streamEvents.length - 1].transactionHash
                    });
                }
                for(let index = 1; index < streamEvents.length; index++){
                    // we have to manage update of flowrate to pay different payment references with the same token
                    // but we do not manage in the MVP updating flowrate of ongoing payment
                    // so we should care only about pairs of begin or update event (type 0 or 1) followed by end or update event (type 2 or 1)
                    // for each update of static flowrate between these 2 chronological sorted events:
                    // amount paid is the difference of flowrates at the start multiplied by the difference of time
                    if (streamEvents[index - 1].type === TYPE_END || streamEvents[index].type === TYPE_BEGIN) {
                        continue;
                    }
                    const diffFlowRate = streamEvents[index - 1].flowRate - streamEvents[index - 1].oldFlowRate;
                    if (diffFlowRate < 0) {
                        continue;
                    }
                    const period = ethers_1.BigNumber.from(streamEvents[index].timestamp).sub(streamEvents[index - 1].timestamp);
                    const amount = ethers_1.BigNumber.from(diffFlowRate).mul(period);
                    paymentEvents.push({
                        amount: amount.toString(),
                        name: this.eventName,
                        parameters: {
                            to: this.toAddress,
                            block: parseInt(streamEvents[index].blockNumber.toString()),
                            txHash: streamEvents[index].transactionHash,
                            streamEventName: getEventName(streamEvents[index])
                        },
                        timestamp: streamEvents[index].timestamp
                    });
                }
                if (paymentEvents.length > 0) {
                    const newLastParameters = paymentEvents[paymentEvents.length - 1].parameters;
                    if (lastEventOngoing && newLastParameters) {
                        newLastParameters.streamEventName = types_1.PaymentTypes.STREAM_EVENT_NAMES.START_STREAM;
                        paymentEvents[paymentEvents.length - 1].parameters = newLastParameters;
                    }
                }
            }
            // Transform the one off payment events into ERC777PaymentNetworkEvent
            const oneOffPaymentEventsUpdated = oneOffPaymentEvents.map((event)=>{
                return {
                    amount: event.amount.toString(),
                    name: this.eventName,
                    parameters: {
                        to: this.toAddress,
                        block: parseInt(event.blockNumber.toString()),
                        txHash: event.transactionHash,
                        // This is always the case:
                        //  - If no previous payment event we can consider it an an END_STREAM event
                        //  - If last payment event is END_STREAM this one is as well
                        //  - If last payment event is START_STREAM, the last payment event after sorting will be of type START_STREAM,
                        //    so we can consider this one as END_STREAM
                        streamEventName: types_1.PaymentTypes.STREAM_EVENT_NAMES.END_STREAM
                    },
                    timestamp: event.timestamp
                };
            });
            // Insert the transformed one off payment events into the payments events, sort them and update their streamEventName parameter
            return paymentEvents.concat(oneOffPaymentEventsUpdated).sort((a, b)=>{
                if (!a.timestamp || !b.timestamp) return 0;
                return a.timestamp - b.timestamp;
            });
        });
    }
}
exports.SuperFluidInfoRetriever = SuperFluidInfoRetriever; //# sourceMappingURL=superfluid-retriever.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc777/superfluid-detector.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SuperFluidPaymentDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const superfluid_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc777/superfluid-retriever.js [app-rsc] (ecmascript)");
const reference_based_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/reference-based-detector.js [app-rsc] (ecmascript)");
const PaymentReferenceCalculator = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/payment-reference-calculator.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
/**
 * Handle payment networks with ERC777 Superfluid streaming extension
 */ class SuperFluidPaymentDetector extends reference_based_detector_1.ReferenceBasedDetector {
    /**
     * @param extension The advanced logic payment network extensions
     */ constructor({ advancedLogic, currencyManager }){
        super(types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM, advancedLogic.extensions.erc777Stream, currencyManager);
    }
    isSubsequentRequest(request) {
        return !!request.extensions[this.paymentNetworkId].values.originalRequestId;
    }
    /**
     * This returns the specific values we store for the ERC777 extensions.
     * @param request The request we are processing
     */ getSubsequentValues(request) {
        return request.extensions[this.paymentNetworkId].values;
    }
    /**
     * With streaming requests we have a custom balance computation.
     * It is possible to have only one streaming event, start stream,
     * but have 10 requests being created each month for the same stream.
     * For the original request, the first one, the balance computation is easy because we don't care about previous expected balance.
     * For subsequent requests we must take into consideration how many requests were before this one and then attribute the rest of the balance to this one.
     * At this point we are not detecting overpayment because in case of overpayment we are considering that another request should have been created in the series.
     * @param request The request we are calculating balance for
     * @returns Balance object with balance value and payment/refund events
     */ getBalance(request) {
        const _super = Object.create(null, {
            getBalance: {
                get: ()=>super.getBalance
            }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const totalBalance = yield _super.getBalance.call(this, request);
            if (totalBalance.error) {
                return totalBalance;
            }
            if (totalBalance.balance) {
                const zeroBN = ethers_1.BigNumber.from(0);
                const recurrenceNumber = this.getSubsequentValues(request).recurrenceNumber || 0;
                // This request's balance is the total streamed amount, less all previous requests balance.
                const remainingBalance = ethers_1.BigNumber.from(totalBalance.balance).sub(ethers_1.BigNumber.from(request.expectedAmount).mul(ethers_1.BigNumber.from(recurrenceNumber)));
                // Balance is stricty between 0 and expectedAmount
                const expectedAmount = ethers_1.BigNumber.from(request.expectedAmount);
                const requestBalance = remainingBalance.lt(0) ? zeroBN : remainingBalance.gt(expectedAmount) ? expectedAmount : remainingBalance;
                totalBalance.balance = requestBalance.toString();
            }
            return totalBalance;
        });
    }
    /**
     * Extracts payment events of an address matching an address and a payment reference
     *
     * @param eventName Indicate if it is an address for payment or refund
     * @param address Address to check
     * @param paymentReference The reference to identify the payment
     * @param requestCurrency The request currency
     * @param paymentChain the payment network
     * @returns List of payment events
     */ extractEvents(eventName, address, paymentReference, requestCurrency, paymentChain) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (!address) {
                return {
                    paymentEvents: []
                };
            }
            const infoRetriever = new superfluid_retriever_1.SuperFluidInfoRetriever(paymentReference, requestCurrency.value, address, eventName, paymentChain);
            const paymentEvents = yield infoRetriever.getTransferEvents();
            return {
                paymentEvents
            };
        });
    }
    /**
     * In the case of the first, original request that starts the streaming,
     * we calculate the payment reference from its own data: requestId, salt, paymentAddress.
     * In the case of subsequent requests we need to have the same payment reference from the original request,
     * so we need to use the original requests requestId, which we have stored in
     * extension values as originalRequestId, the salt and paymentAddress are the same.
     * @param request The request we need payment reference for
     * @returns The payment reference
     */ getPaymentReference(request) {
        const { paymentAddress, salt } = this.getPaymentExtension(request).values;
        this.checkRequiredParameter(paymentAddress, 'paymentAddress');
        this.checkRequiredParameter(salt, 'salt');
        const requestId = this.isSubsequentRequest(request) ? this.getSubsequentValues(request).originalRequestId : request.requestId;
        return PaymentReferenceCalculator.calculate(requestId, salt, paymentAddress);
    }
}
exports.SuperFluidPaymentDetector = SuperFluidPaymentDetector; //# sourceMappingURL=superfluid-detector.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/multichainExplorerApiProvider.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MultichainExplorerApiProvider = void 0;
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const networks = {
    sokol: {
        chainId: 77,
        name: 'sokol'
    },
    fuse: {
        chainId: 122,
        name: 'fuse'
    },
    celo: {
        chainId: 42220,
        name: 'celo'
    },
    fantom: {
        chainId: 250,
        name: 'fantom'
    },
    'arbitrum-rinkeby': {
        chainId: 421611,
        name: 'arbitrum-rinkeby'
    },
    'arbitrum-one': {
        chainId: 42161,
        name: 'arbitrum-one'
    },
    avalanche: {
        chainId: 43114,
        name: 'avalanche'
    },
    bsc: {
        chainId: 56,
        name: 'bsc'
    },
    optimism: {
        chainId: 10,
        name: 'optimism'
    },
    moonbeam: {
        chainId: 1284,
        name: 'moonbeam'
    },
    tombchain: {
        chainId: 6969,
        name: 'tombchain'
    },
    mantle: {
        chainId: 5000,
        name: 'mantle'
    },
    'mantle-testnet': {
        chainId: 5001,
        name: 'mantle-testnet'
    },
    core: {
        chainId: 1116,
        name: 'core'
    },
    zksynceratestnet: {
        chainId: 280,
        name: 'zksynceratestnet'
    },
    zksyncera: {
        chainId: 324,
        name: 'zksyncera'
    }
};
/**
 * A provider that supports multiple APIs, like Etherscan and Blockscout
 */ class MultichainExplorerApiProvider extends ethers_1.ethers.providers.EtherscanProvider {
    constructor(network, apiKey){
        if (typeof network === 'string' && networks[network]) {
            network = networks[network];
        }
        if (!apiKey && (network === 'mainnet' || network === 'rinkeby')) {
            apiKey = 'TCVQQU5V39TAS1V6HF61P9K7IJZVEHH1D9';
        }
        super(network, apiKey);
    }
    getBaseUrl() {
        switch(this.network.name){
            case 'sokol':
            case 'xdai':
                return 'https://api.gnosisscan.io';
            case 'fuse':
                return 'https://explorer.fuse.io';
            case 'celo':
                return 'https://api.celoscan.io';
            case 'matic':
                return 'https://api.polygonscan.com';
            case 'fantom':
                return 'https://api.ftmscan.com';
            case 'bsctest':
                return 'https://api-testnet.bscscan.com/';
            case 'bsc':
                return 'https://api.bscscan.com/';
            // Near
            case 'aurora':
                return 'https://explorer.mainnet.near.org';
            case 'aurora-testnet':
            case 'near-testnet':
                return 'https://explorer.testnet.near.org';
            case 'arbitrum-rinkeby':
                return 'https://testnet.arbiscan.io/';
            case 'arbitrum-one':
                return 'https://api.arbiscan.io';
            case 'avalanche':
                return 'https://api.snowtrace.io';
            case 'mantle':
                return 'https://explorer.mantle.xyz/api';
            case 'mantle-testnet':
                return 'https://explorer.testnet.mantle.xyz/api';
            case 'core':
                return 'https://openapi.coredao.org/';
            case 'zksynceratestnet':
                return 'https://goerli.explorer.zksync.io/';
            case 'zksyncera':
                return 'https://explorer.zksync.io/';
            default:
                return super.getBaseUrl();
        }
    }
}
exports.MultichainExplorerApiProvider = MultichainExplorerApiProvider; //# sourceMappingURL=multichainExplorerApiProvider.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/info-retriever.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EthInputDataInfoRetriever = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const multichainExplorerApiProvider_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/multichainExplorerApiProvider.js [app-rsc] (ecmascript)");
/**
 * Gets a list of transfer events for an address and payment reference
 */ class EthInputDataInfoRetriever {
    /**
     * @param toAddress Address to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param network The id of network we want to check
     * @param paymentReference The reference to identify the payment
     * @param explorerApiKey The explorer (etherscan...) API key
     */ constructor(toAddress, eventName, network, paymentReference, explorerApiKey){
        this.toAddress = toAddress;
        this.eventName = eventName;
        this.network = network;
        this.paymentReference = paymentReference;
        this.explorerApiKey = explorerApiKey;
    }
    getTransferEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (this.network === 'private') {
                throw new Error('ETH input data info-retriever works with etherscan and cannot work on a local network');
            }
            const provider = new multichainExplorerApiProvider_1.MultichainExplorerApiProvider(this.network, this.explorerApiKey);
            const history = yield provider.getHistory(this.toAddress);
            const events = history// remove potential duplicates (eg. if sender and receiver are the same)
            .filter((transaction, index)=>history.findIndex((x)=>x.hash === transaction.hash) === index)// keep only when address is the destination
            .filter((transaction)=>transaction.to && transaction.to.toLowerCase() === this.toAddress.toLowerCase())// keep only if data contains the payment reference
            .filter((transaction)=>transaction.data.toLowerCase() === '0x' + this.paymentReference.toLowerCase()).map((transaction)=>({
                    amount: transaction.value.toString(),
                    name: this.eventName,
                    parameters: {
                        block: transaction.blockNumber,
                        confirmations: transaction.confirmations,
                        txHash: transaction.hash
                    },
                    timestamp: transaction.timestamp
                }));
            return events;
        });
    }
}
exports.EthInputDataInfoRetriever = EthInputDataInfoRetriever; //# sourceMappingURL=info-retriever.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/proxy-info-retriever.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EthProxyInfoRetriever = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
// The Ethereum proxy smart contract ABI fragment containing TransferWithReference event
const ethProxyContractAbiFragment = [
    'event TransferWithReference(address to,uint256 amount,bytes indexed paymentReference)',
    'event TransferWithReferenceAndFee(address to,uint256 amount,bytes indexed paymentReference,uint256 feeAmount,address feeAddress)'
];
/**
 * Retrieves a list of payment events from a payment reference, a destination address, a token address and a proxy contract
 */ class EthProxyInfoRetriever {
    /**
     * @param paymentReference The reference to identify the payment
     * @param proxyContractAddress The address of the proxy contract
     * @param proxyCreationBlockNumber The block that created the proxy contract
     * @param toAddress Address of the balance we want to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param network The Ethereum network to use
     */ constructor(paymentReference, proxyContractAddress, proxyCreationBlockNumber, toAddress, eventName, network){
        this.paymentReference = paymentReference;
        this.proxyContractAddress = proxyContractAddress;
        this.proxyCreationBlockNumber = proxyCreationBlockNumber;
        this.toAddress = toAddress;
        this.eventName = eventName;
        this.network = network;
        // Creates a local or default provider
        this.provider = (0, utils_2.getDefaultProvider)(this.network);
        // Set up the Ethereum proxy contract interface
        this.contractProxy = new ethers_1.ethers.Contract(this.proxyContractAddress, ethProxyContractAbiFragment, this.provider);
    }
    /**
     * Retrieves transfer events for the current contract, address and network.
     */ getTransferEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            // Create a filter to find all the Transfer logs for the toAddress
            const filter = this.contractProxy.filters.TransferWithReference(null, null, '0x' + this.paymentReference);
            filter.fromBlock = this.proxyCreationBlockNumber;
            filter.toBlock = 'latest';
            // Get the event logs
            const proxyLogs = yield this.provider.getLogs(filter);
            // Create a filter to find all the Fee Transfer logs with the payment reference
            const feeFilter = this.contractProxy.filters.TransferWithReferenceAndFee(null, null, '0x' + this.paymentReference, null, null);
            feeFilter.fromBlock = this.proxyCreationBlockNumber;
            feeFilter.toBlock = 'latest';
            // Get the fee proxy contract event logs
            const feeProxyLogs = yield this.provider.getLogs(feeFilter);
            // Merge both events
            const logs = [
                ...proxyLogs,
                ...feeProxyLogs
            ];
            // Parses, filters and creates the events from the logs of the proxy contract
            const eventPromises = logs// Parses the logs
            .map((log)=>{
                const parsedLog = this.contractProxy.interface.parseLog(log);
                return {
                    parsedLog: (0, utils_1.parseLogArgs)(parsedLog),
                    blockNumber: log.blockNumber,
                    transactionHash: log.transactionHash
                };
            })// Keeps only the log with the right token and the right destination address
            .filter(({ parsedLog })=>parsedLog.to.toLowerCase() === this.toAddress.toLowerCase())// Creates the balance events
            .map(({ parsedLog, blockNumber, transactionHash })=>tslib_1.__awaiter(this, void 0, void 0, function*() {
                    var _a;
                    return {
                        amount: parsedLog.amount.toString(),
                        name: this.eventName,
                        parameters: {
                            block: blockNumber,
                            txHash: transactionHash,
                            to: this.toAddress,
                            feeAddress: parsedLog.feeAddress,
                            feeAmount: ((_a = parsedLog.feeAmount) === null || _a === void 0 ? void 0 : _a.toString()) || undefined
                        },
                        timestamp: (yield this.provider.getBlock(blockNumber || 0)).timestamp
                    };
                }));
            return yield Promise.all(eventPromises);
        });
    }
}
exports.EthProxyInfoRetriever = EthProxyInfoRetriever; //# sourceMappingURL=proxy-info-retriever.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/input-data.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EthInputDataPaymentDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const SmartContracts = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/info-retriever.js [app-rsc] (ecmascript)");
const proxy_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/proxy-info-retriever.js [app-rsc] (ecmascript)");
const reference_based_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/reference-based-detector.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const thegraph_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/index.js [app-rsc] (ecmascript)");
// the versions 0.1.0 and 0.2.0 have the same contracts
const PROXY_CONTRACT_ADDRESS_MAP = {
    ['0.1.0']: '0.1.0',
    ['0.2.0']: '0.1.0',
    ['0.3.0']: '0.3.0'
};
/**
 * Handle payment networks with ETH input data extension
 */ class EthInputDataPaymentDetector extends reference_based_detector_1.ReferenceBasedDetector {
    /**
     * @param extension The advanced logic payment network extensions
     */ constructor({ advancedLogic, currencyManager, explorerApiKeys, getSubgraphClient }){
        super(types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA, advancedLogic.extensions.ethereumInputData, currencyManager);
        this.explorerApiKeys = explorerApiKeys || {};
        this.getSubgraphClient = getSubgraphClient;
    }
    /**
     * Extracts payment events of an address matching an address and a payment reference
     *
     * @param toAddress Address to check
     * @param eventName Indicate if it is an address for payment or refund
     * @param requestCurrency The request currency
     * @param paymentReference The reference to identify the payment
     * @param paymentNetwork the payment network
     * @returns The balance
     */ extractEvents(eventName, toAddress, paymentReference, _requestCurrency, paymentChain, paymentNetwork) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (!toAddress) {
                return {
                    paymentEvents: []
                };
            }
            const infoRetriever = new info_retriever_1.EthInputDataInfoRetriever(toAddress, eventName, paymentChain, paymentReference, this.explorerApiKeys[paymentChain]);
            const events = yield infoRetriever.getTransferEvents();
            const proxyContractArtifact = EthInputDataPaymentDetector.getDeploymentInformation(paymentChain, paymentNetwork.version);
            let allEvents;
            let escrowEvents = [];
            if (proxyContractArtifact) {
                const subgraphClient = this.getSubgraphClient(paymentChain);
                if (subgraphClient) {
                    const graphInfoRetriever = new thegraph_1.TheGraphInfoRetriever(subgraphClient, this.currencyManager);
                    allEvents = yield graphInfoRetriever.getTransferEvents({
                        paymentReference,
                        contractAddress: proxyContractArtifact.address,
                        toAddress,
                        eventName,
                        paymentChain
                    });
                } else {
                    const ethInfoRetriever = new proxy_info_retriever_1.EthProxyInfoRetriever(paymentReference, proxyContractArtifact.address, proxyContractArtifact.creationBlockNumber, toAddress, eventName, paymentChain);
                    const paymentEvents = yield ethInfoRetriever.getTransferEvents();
                    allEvents = {
                        paymentEvents
                    };
                }
                events.push(...allEvents.paymentEvents);
                escrowEvents = allEvents.escrowEvents;
            }
            return {
                paymentEvents: events,
                escrowEvents: escrowEvents
            };
        });
    }
}
exports.EthInputDataPaymentDetector = EthInputDataPaymentDetector;
/*
 * Returns deployment information for the underlying smart contract for a given payment network version
 */ EthInputDataPaymentDetector.getDeploymentInformation = (0, utils_1.makeGetDeploymentInformation)(SmartContracts.ethereumProxyArtifact, PROXY_CONTRACT_ADDRESS_MAP, true); //# sourceMappingURL=input-data.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/fee-proxy-detector.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EthFeeProxyPaymentDetector = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const SmartContracts = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const proxy_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/proxy-info-retriever.js [app-rsc] (ecmascript)");
const fee_reference_based_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/fee-reference-based-detector.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const thegraph_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/index.js [app-rsc] (ecmascript)");
const PROXY_CONTRACT_ADDRESS_MAP = {
    ['0.1.0']: '0.1.0',
    ['0.2.0']: '0.2.0'
};
/**
 * Handle payment networks with ETH fee proxy extension
 */ class EthFeeProxyPaymentDetector extends fee_reference_based_detector_1.FeeReferenceBasedDetector {
    /**
     * @param extension The advanced logic payment network extensions
     */ constructor({ advancedLogic, currencyManager, getSubgraphClient }){
        super(types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT, advancedLogic.extensions.feeProxyContractEth, currencyManager);
        this.getSubgraphClient = getSubgraphClient;
    }
    /**
     * Extracts payment events of an address matching an address and a payment reference
     *
     * @param eventName Indicate if it is an address for payment or refund
     * @param toAddress Address to check
     * @param paymentReference The reference to identify the payment
     * @param _requestCurrency The request currency
     * @param paymentChain the name of the payment (block)chain
     * @param paymentNetwork the payment network
     * @returns The balance
     */ extractEvents(eventName, toAddress, paymentReference, _requestCurrency, paymentChain, paymentNetwork) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (!toAddress) {
                return {
                    paymentEvents: []
                };
            }
            const proxyContractArtifact = EthFeeProxyPaymentDetector.getDeploymentInformation(paymentChain, paymentNetwork.version);
            const subgraphClient = this.getSubgraphClient(paymentChain);
            if (subgraphClient) {
                const graphInfoRetriever = new thegraph_1.TheGraphInfoRetriever(subgraphClient, this.currencyManager);
                return graphInfoRetriever.getTransferEvents({
                    paymentReference,
                    contractAddress: proxyContractArtifact.address,
                    toAddress,
                    eventName,
                    paymentChain
                });
            } else {
                const proxyInfoRetriever = new proxy_info_retriever_1.EthProxyInfoRetriever(paymentReference, proxyContractArtifact.address, proxyContractArtifact.creationBlockNumber, toAddress, eventName, paymentChain);
                const paymentEvents = yield proxyInfoRetriever.getTransferEvents();
                return {
                    paymentEvents
                };
            }
        });
    }
}
exports.EthFeeProxyPaymentDetector = EthFeeProxyPaymentDetector;
/*
 * Returns deployment information for the underlying smart contract for a given payment network version
 */ EthFeeProxyPaymentDetector.getDeploymentInformation = (0, utils_1.makeGetDeploymentInformation)(SmartContracts.ethereumFeeProxyArtifact, PROXY_CONTRACT_ADDRESS_MAP); //# sourceMappingURL=fee-proxy-detector.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EthFeeProxyPaymentDetector = exports.EthInputDataPaymentDetector = void 0;
var input_data_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/input-data.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "EthInputDataPaymentDetector", {
    enumerable: true,
    get: function() {
        return input_data_1.EthInputDataPaymentDetector;
    }
});
var fee_proxy_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/fee-proxy-detector.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "EthFeeProxyPaymentDetector", {
    enumerable: true,
    get: function() {
        return fee_proxy_detector_1.EthFeeProxyPaymentDetector;
    }
}); //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/payment-network-factory.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PaymentNetworkFactory = void 0;
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const btc_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/index.js [app-rsc] (ecmascript)");
const declarative_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/declarative.js [app-rsc] (ecmascript)");
const meta_payment_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/meta-payment-detector.js [app-rsc] (ecmascript)");
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/index.js [app-rsc] (ecmascript)");
const superfluid_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc777/superfluid-detector.js [app-rsc] (ecmascript)");
const eth_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/index.js [app-rsc] (ecmascript)");
const any_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/index.js [app-rsc] (ecmascript)");
const near_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const thegraph_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/index.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const PN_ID = types_1.ExtensionTypes.PAYMENT_NETWORK_ID;
/** Register the payment network by currency and type */ const supportedPaymentNetwork = {
    BTC: {
        mainnet: {
            [PN_ID.BITCOIN_ADDRESS_BASED]: btc_1.BtcMainnetAddressBasedDetector
        },
        testnet: {
            [PN_ID.TESTNET_BITCOIN_ADDRESS_BASED]: btc_1.BtcTestnetAddressBasedDetector
        }
    },
    ERC777: {
        '*': {
            [PN_ID.ERC777_STREAM]: superfluid_detector_1.SuperFluidPaymentDetector
        }
    },
    ERC20: {
        aurora: {
            [PN_ID.ERC20_FEE_PROXY_CONTRACT]: erc20_1.ERC20FeeProxyPaymentDetector
        },
        'aurora-testnet': {
            [PN_ID.ERC20_FEE_PROXY_CONTRACT]: erc20_1.ERC20FeeProxyPaymentDetector
        },
        'near-testnet': {
            [PN_ID.ERC20_FEE_PROXY_CONTRACT]: erc20_1.ERC20FeeProxyPaymentDetector
        },
        '*': {
            [PN_ID.ERC20_ADDRESS_BASED]: erc20_1.ERC20AddressBasedPaymentDetector,
            [PN_ID.ERC20_PROXY_CONTRACT]: erc20_1.ERC20ProxyPaymentDetector,
            [PN_ID.ERC20_FEE_PROXY_CONTRACT]: erc20_1.ERC20FeeProxyPaymentDetector,
            [PN_ID.ERC20_TRANSFERABLE_RECEIVABLE]: erc20_1.ERC20TransferableReceivablePaymentDetector
        }
    },
    ETH: {
        aurora: {
            [PN_ID.NATIVE_TOKEN]: near_1.NearNativeTokenPaymentDetector
        },
        'aurora-testnet': {
            [PN_ID.NATIVE_TOKEN]: near_1.NearNativeTokenPaymentDetector
        },
        'near-testnet': {
            [PN_ID.NATIVE_TOKEN]: near_1.NearNativeTokenPaymentDetector
        },
        '*': {
            [PN_ID.ETH_INPUT_DATA]: eth_1.EthInputDataPaymentDetector,
            [PN_ID.ETH_FEE_PROXY_CONTRACT]: eth_1.EthFeeProxyPaymentDetector
        }
    }
};
const anyCurrencyPaymentNetwork = {
    [PN_ID.ANY_TO_ERC20_PROXY]: any_1.AnyToERC20PaymentDetector,
    [PN_ID.ANY_DECLARATIVE]: declarative_1.DeclarativePaymentDetector,
    [PN_ID.ANY_TO_ETH_PROXY]: any_1.AnyToEthFeeProxyPaymentDetector,
    [PN_ID.ANY_TO_NATIVE_TOKEN]: near_1.NearConversionNativeTokenPaymentDetector,
    [PN_ID.META]: meta_payment_detector_1.MetaDetector
};
/** Factory to create the payment network according to the currency and payment network type */ class PaymentNetworkFactory {
    /**
     *
     * @param advancedLogic the advanced-logic layer in charge of the extensions
     * @param currencyManager the currency manager handling supported currencies
     * @param options the payment network options
     */ constructor(advancedLogic, currencyManager, options){
        this.advancedLogic = advancedLogic;
        this.currencyManager = currencyManager;
        this.options = this.buildOptions(options || {});
    }
    buildOptions(options) {
        const defaultOptions = {
            getSubgraphClient: thegraph_1.defaultGetTheGraphClient,
            explorerApiKeys: {},
            getRpcProvider: ethers_1.getDefaultProvider
        };
        return Object.assign(Object.assign({}, defaultOptions), options);
    }
    /**
     * Creates a payment network interpretor according to payment network creation parameters
     * It throws if the payment network given is not supported by this library
     *
     * @param paymentNetworkId the ID of the payment network to instantiate
     * @param currencyType the currency type of the request
     * @param paymentChain Different from request.currency.network for on-chain conversion payment networks (any-to-something)
     * @returns the module to handle the payment network
     */ createPaymentNetwork(paymentNetworkId, currencyType, paymentChain, paymentNetworkVersion) {
        var _a, _b;
        const network = paymentChain !== null && paymentChain !== void 0 ? paymentChain : 'mainnet';
        const currencyPaymentMap = ((_a = supportedPaymentNetwork[currencyType]) === null || _a === void 0 ? void 0 : _a[network]) || ((_b = supportedPaymentNetwork[currencyType]) === null || _b === void 0 ? void 0 : _b['*']) || {};
        const paymentNetworkMap = Object.assign(Object.assign({}, currencyPaymentMap), anyCurrencyPaymentNetwork);
        const detectorClass = paymentNetworkMap[paymentNetworkId];
        if (!detectorClass) {
            throw new Error(`the payment network id: ${paymentNetworkId} is not supported for the currency: ${currencyType} on network ${network}`);
        }
        const detector = new detectorClass(Object.assign({
            network,
            advancedLogic: this.advancedLogic,
            currencyManager: this.currencyManager,
            options: this.options
        }, this.options));
        if (detector.extension && 'getDeploymentInformation' in detectorClass) {
            // this throws when the contract isn't deployed and was mandatory for payment detection
            detectorClass.getDeploymentInformation(network, paymentNetworkVersion || detector.extension.currentVersion);
        }
        return detector;
    }
    /**
     * Gets the module to the payment network of a request
     * It throws if the payment network found is not supported by this library
     *
     * @param request the request
     * @returns the module to handle the payment network or null if no payment network found
     */ getPaymentNetworkFromRequest(request) {
        var _a, _b;
        const pn = (0, utils_1.getPaymentNetworkExtension)(request);
        if (!pn) {
            return null;
        }
        const detectionChain = (_b = (_a = pn.values) === null || _a === void 0 ? void 0 : _a.network) !== null && _b !== void 0 ? _b : request.currency.network;
        const { id, version } = pn;
        return this.createPaymentNetwork(id, request.currency.type, detectionChain, version);
    }
}
exports.PaymentNetworkFactory = PaymentNetworkFactory; //# sourceMappingURL=payment-network-factory.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/escrow-info-retriever.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EscrowERC20InfoRetriever = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
const ESCROW_CONTRACT_ADDRESS_MAP = {
    ['0.1.0']: '0.1.0',
    ['0.2.0']: '0.1.0'
};
/**
 * Retrieves a list of payment events from an escrow contract.
 */ class EscrowERC20InfoRetriever {
    /**
     * @param paymentReference The reference to identify the payment.
     * @param escrowContractAddress The address of the escrow contract.
     * @param escrowCreationBlockNumber The block that created the escrow contract.
     * @param tokenContractAddress The address of the ERC20 contract
     * @param toAddress Address of the balance we want to check
     * @param eventName Indicate if it is an address for payment or escrow
     * @param network The Ethereum network to use.
     */ constructor(paymentReference, escrowContractAddress, escrowCreationBlockNumber, tokenContractAddress, toAddress, network, eventName){
        this.paymentReference = paymentReference;
        this.escrowContractAddress = escrowContractAddress;
        this.escrowCreationBlockNumber = escrowCreationBlockNumber;
        this.tokenContractAddress = tokenContractAddress;
        this.toAddress = toAddress;
        this.network = network;
        this.eventName = eventName;
        // Creates a local or default provider.
        this.provider = (0, utils_2.getDefaultProvider)(this.network);
        // Set up the ERC20 escrow contract interface.
        this.contractEscrow = new ethers_1.ethers.Contract(this.escrowContractAddress, smart_contracts_1.erc20EscrowToPayArtifact.getContractAbi(), this.provider);
    }
    /**
     * Retrieves events for the current contract, address and network.
     */ getAllContractEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const freezeEvents = yield this.getContractEventsForEventName(types_1.PaymentTypes.ESCROW_EVENTS_NAMES.FREEZE_ESCROW);
            const initEmergencyEvents = yield this.getContractEventsForEventName(types_1.PaymentTypes.ESCROW_EVENTS_NAMES.INITIATE_EMERGENCY_CLAIM);
            const revertEmergencyEvents = yield this.getContractEventsForEventName(types_1.PaymentTypes.ESCROW_EVENTS_NAMES.REVERT_EMERGENCY_CLAIM);
            return [
                ...freezeEvents,
                ...initEmergencyEvents,
                ...revertEmergencyEvents
            ];
        });
    }
    getContractEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            if (!this.eventName) {
                throw new Error('Missing event name in EscrowInfoRetriever for getContractEvents()');
            }
            return this.getContractEventsForEventName(this.eventName);
        });
    }
    /**
     * Retrieves events for the current contract, address and network.
     */ getContractEventsForEventName(eventName) {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            const filter = eventName === types_1.PaymentTypes.ESCROW_EVENTS_NAMES.FREEZE_ESCROW ? this.contractEscrow.filters.RequestFrozen('0x' + this.paymentReference) : eventName === types_1.PaymentTypes.ESCROW_EVENTS_NAMES.INITIATE_EMERGENCY_CLAIM ? this.contractEscrow.filters.InitiatedEmergencyClaim('0x' + this.paymentReference) : eventName === types_1.PaymentTypes.ESCROW_EVENTS_NAMES.REVERT_EMERGENCY_CLAIM ? this.contractEscrow.filters.RevertedEmergencyClaim('0x' + this.paymentReference) : eventName === types_1.PaymentTypes.ESCROW_EVENTS_NAMES.PAID_ESCROW ? this.contractEscrow.filters.TransferWithReferenceAndFee(null, // TODO: be sure null is a good idea
            null, null, '0x' + this.paymentReference, null, null) : undefined;
            if (!filter) {
                throw new Error('Wrong eventName for Escrow event retriever');
            }
            filter.fromBlock = this.escrowCreationBlockNumber;
            filter.toBlock = 'latest';
            const logs = yield this.provider.getLogs(filter);
            // Parses, filters and creates the events from the logs with the payment reference.
            const eventPromises = logs// Parses the logs
            .map((log)=>{
                const parsedLog = this.contractEscrow.interface.parseLog(log);
                return Object.assign(Object.assign({}, log), {
                    parsedLog: (0, utils_1.parseLogArgs)(parsedLog)
                });
            })// Keeps only the log with the right token and the right destination address
            .filter(({ parsedLog })=>{
                if (parsedLog.tokenAddress) {
                    return parsedLog.tokenAddress.toLowerCase() === this.tokenContractAddress.toLowerCase() && parsedLog.to.toLowerCase() === this.toAddress.toLowerCase();
                } else {
                    return true;
                }
            })// Creates the escrow events.
            .map(({ parsedLog, blockNumber, transactionHash })=>tslib_1.__awaiter(this, void 0, void 0, function*() {
                    var _a, _b;
                    return {
                        // TODO fix me
                        amount: ((_a = parsedLog.amount) === null || _a === void 0 ? void 0 : _a.toString()) || undefined,
                        name: eventName,
                        parameters: {
                            block: blockNumber,
                            paymentReference: parsedLog.paymentReference,
                            feeAddress: parsedLog.feeAddress || undefined,
                            feeAmount: ((_b = parsedLog.feeAmount) === null || _b === void 0 ? void 0 : _b.toString()) || undefined,
                            to: this.toAddress || undefined,
                            txHash: transactionHash
                        },
                        timestamp: (yield this.provider.getBlock(blockNumber || 0)).timestamp
                    };
                }));
            return Promise.all(eventPromises);
        });
    }
    /**
     * Retrieves current escrow data from requestMapping in the Escrow smart contract
     */ getEscrowRequestMapping() {
        return tslib_1.__awaiter(this, void 0, void 0, function*() {
            return this.contractEscrow.requestMapping(`0x${this.paymentReference}`);
        });
    }
}
exports.EscrowERC20InfoRetriever = EscrowERC20InfoRetriever;
EscrowERC20InfoRetriever.getEscrowDeploymentInformation = (0, utils_1.makeGetDeploymentInformation)(smart_contracts_1.erc20EscrowToPayArtifact, ESCROW_CONTRACT_ADDRESS_MAP); //# sourceMappingURL=escrow-info-retriever.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.formatAddress = exports.hashReference = exports.getPaymentReferencesForMetaPnRequest = exports.getPaymentReference = exports.getPaymentNetworkExtension = exports.flattenRequestByPnId = exports.calculateEscrowState = exports.unpadAmountFromChainlink = exports.padAmountForChainlink = exports.parseLogArgs = exports.getTheGraphNearClient = exports.getTheGraphEvmClient = exports.getTheGraphClient = exports.getDefaultProvider = exports.initPaymentDetectionApiKeys = exports.setProviderFactory = exports.MetaDetector = exports.SuperFluidInfoRetriever = exports.EscrowERC20InfoRetriever = exports.NearConversionNativeTokenPaymentDetector = exports.NearNativeTokenPaymentDetector = exports.SuperFluidPaymentDetector = exports.FeeReferenceBasedDetector = exports.AnyToEthFeeProxyPaymentDetector = exports.AnyToERC20PaymentDetector = exports.EthFeeProxyPaymentDetector = exports.EthInputDataPaymentDetector = exports.ERC20TransferableReceivablePaymentDetector = exports.Erc20PaymentNetwork = exports.DeclarativePaymentDetector = exports.BtcPaymentNetwork = exports.PaymentReferenceCalculator = exports.PaymentNetworkFactory = void 0;
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "getDefaultProvider", {
    enumerable: true,
    get: function() {
        return utils_1.getDefaultProvider;
    }
});
Object.defineProperty(exports, "initPaymentDetectionApiKeys", {
    enumerable: true,
    get: function() {
        return utils_1.initPaymentDetectionApiKeys;
    }
});
Object.defineProperty(exports, "setProviderFactory", {
    enumerable: true,
    get: function() {
        return utils_1.setProviderFactory;
    }
});
const payment_network_factory_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/payment-network-factory.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "PaymentNetworkFactory", {
    enumerable: true,
    get: function() {
        return payment_network_factory_1.PaymentNetworkFactory;
    }
});
const PaymentReferenceCalculator = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/payment-reference-calculator.js [app-rsc] (ecmascript)");
exports.PaymentReferenceCalculator = PaymentReferenceCalculator;
const BtcPaymentNetwork = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/btc/index.js [app-rsc] (ecmascript)");
exports.BtcPaymentNetwork = BtcPaymentNetwork;
const declarative_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/declarative.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "DeclarativePaymentDetector", {
    enumerable: true,
    get: function() {
        return declarative_1.DeclarativePaymentDetector;
    }
});
const Erc20PaymentNetwork = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/index.js [app-rsc] (ecmascript)");
exports.Erc20PaymentNetwork = Erc20PaymentNetwork;
const any_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/any/index.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "AnyToERC20PaymentDetector", {
    enumerable: true,
    get: function() {
        return any_1.AnyToERC20PaymentDetector;
    }
});
Object.defineProperty(exports, "AnyToEthFeeProxyPaymentDetector", {
    enumerable: true,
    get: function() {
        return any_1.AnyToEthFeeProxyPaymentDetector;
    }
});
const eth_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/eth/index.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "EthFeeProxyPaymentDetector", {
    enumerable: true,
    get: function() {
        return eth_1.EthFeeProxyPaymentDetector;
    }
});
Object.defineProperty(exports, "EthInputDataPaymentDetector", {
    enumerable: true,
    get: function() {
        return eth_1.EthInputDataPaymentDetector;
    }
});
const thegraph_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/thegraph/index.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "getTheGraphClient", {
    enumerable: true,
    get: function() {
        return thegraph_1.getTheGraphClient;
    }
});
Object.defineProperty(exports, "getTheGraphEvmClient", {
    enumerable: true,
    get: function() {
        return thegraph_1.getTheGraphEvmClient;
    }
});
Object.defineProperty(exports, "getTheGraphNearClient", {
    enumerable: true,
    get: function() {
        return thegraph_1.getTheGraphNearClient;
    }
});
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/utils.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "calculateEscrowState", {
    enumerable: true,
    get: function() {
        return utils_2.calculateEscrowState;
    }
});
Object.defineProperty(exports, "formatAddress", {
    enumerable: true,
    get: function() {
        return utils_2.formatAddress;
    }
});
Object.defineProperty(exports, "getPaymentNetworkExtension", {
    enumerable: true,
    get: function() {
        return utils_2.getPaymentNetworkExtension;
    }
});
Object.defineProperty(exports, "getPaymentReference", {
    enumerable: true,
    get: function() {
        return utils_2.getPaymentReference;
    }
});
Object.defineProperty(exports, "getPaymentReferencesForMetaPnRequest", {
    enumerable: true,
    get: function() {
        return utils_2.getPaymentReferencesForMetaPnRequest;
    }
});
Object.defineProperty(exports, "flattenRequestByPnId", {
    enumerable: true,
    get: function() {
        return utils_2.flattenRequestByPnId;
    }
});
Object.defineProperty(exports, "hashReference", {
    enumerable: true,
    get: function() {
        return utils_2.hashReference;
    }
});
Object.defineProperty(exports, "padAmountForChainlink", {
    enumerable: true,
    get: function() {
        return utils_2.padAmountForChainlink;
    }
});
Object.defineProperty(exports, "parseLogArgs", {
    enumerable: true,
    get: function() {
        return utils_2.parseLogArgs;
    }
});
Object.defineProperty(exports, "unpadAmountFromChainlink", {
    enumerable: true,
    get: function() {
        return utils_2.unpadAmountFromChainlink;
    }
});
const near_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/near/index.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "NearConversionNativeTokenPaymentDetector", {
    enumerable: true,
    get: function() {
        return near_1.NearConversionNativeTokenPaymentDetector;
    }
});
Object.defineProperty(exports, "NearNativeTokenPaymentDetector", {
    enumerable: true,
    get: function() {
        return near_1.NearNativeTokenPaymentDetector;
    }
});
const fee_reference_based_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/fee-reference-based-detector.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "FeeReferenceBasedDetector", {
    enumerable: true,
    get: function() {
        return fee_reference_based_detector_1.FeeReferenceBasedDetector;
    }
});
const superfluid_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc777/superfluid-detector.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "SuperFluidPaymentDetector", {
    enumerable: true,
    get: function() {
        return superfluid_detector_1.SuperFluidPaymentDetector;
    }
});
const escrow_info_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/escrow-info-retriever.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "EscrowERC20InfoRetriever", {
    enumerable: true,
    get: function() {
        return escrow_info_retriever_1.EscrowERC20InfoRetriever;
    }
});
const superfluid_retriever_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc777/superfluid-retriever.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "SuperFluidInfoRetriever", {
    enumerable: true,
    get: function() {
        return superfluid_retriever_1.SuperFluidInfoRetriever;
    }
});
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/erc20/index.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "ERC20TransferableReceivablePaymentDetector", {
    enumerable: true,
    get: function() {
        return erc20_1.ERC20TransferableReceivablePaymentDetector;
    }
});
const meta_payment_detector_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/meta-payment-detector.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "MetaDetector", {
    enumerable: true,
    get: function() {
        return meta_payment_detector_1.MetaDetector;
    }
}); //# sourceMappingURL=index.js.map
}}),

};

//# sourceMappingURL=cc487_%40requestnetwork_payment-detection_dist_3705d3._.js.map