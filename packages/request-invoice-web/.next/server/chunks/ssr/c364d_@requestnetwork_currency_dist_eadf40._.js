module.exports = {

"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/native.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nativeCurrencies = void 0;
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
exports.nativeCurrencies = {
    [types_1.RequestLogicTypes.CURRENCY.ETH]: [
        {
            symbol: 'ETH-private',
            decimals: 18,
            name: 'Ether',
            network: 'private'
        },
        {
            symbol: 'ETH',
            decimals: 18,
            name: 'Ether',
            network: 'mainnet'
        },
        {
            symbol: 'ETH-rinkeby',
            decimals: 18,
            name: 'Rinkeby Ether',
            network: 'rinkeby'
        },
        {
            symbol: 'ETH-goerli',
            decimals: 18,
            name: 'Goerli Ether',
            network: 'goerli'
        },
        {
            symbol: 'MATIC',
            decimals: 18,
            name: 'Matic',
            network: 'matic'
        },
        {
            symbol: 'xDAI',
            decimals: 18,
            name: 'xDAI',
            network: 'xdai'
        },
        {
            symbol: 'POA',
            decimals: 18,
            name: 'POA Sokol Ether',
            network: 'sokol'
        },
        {
            symbol: 'FUSE',
            decimals: 18,
            name: 'FUSE',
            network: 'fuse'
        },
        {
            symbol: 'CELO',
            decimals: 18,
            name: 'CELO',
            network: 'celo'
        },
        {
            symbol: 'FTM',
            decimals: 18,
            name: 'Fantom',
            network: 'fantom'
        },
        {
            symbol: 'BNB',
            decimals: 18,
            name: 'BNB',
            network: 'bsc'
        },
        {
            symbol: 'NEAR',
            decimals: 24,
            name: 'Near',
            network: 'aurora'
        },
        {
            symbol: 'NEAR-testnet',
            decimals: 24,
            name: 'Near Testnet',
            network: 'aurora-testnet'
        },
        {
            symbol: 'NEAR-testnet',
            decimals: 24,
            name: 'Test Near',
            network: 'near-testnet'
        },
        {
            symbol: 'ARETH',
            decimals: 18,
            name: 'Arbitrum Testnet',
            network: 'arbitrum-rinkeby'
        },
        {
            symbol: 'AETH',
            decimals: 18,
            name: 'Arbitrum Ether',
            network: 'arbitrum-one'
        },
        {
            symbol: 'AVAX',
            decimals: 18,
            name: 'AVAX',
            network: 'avalanche'
        },
        {
            symbol: 'ETH-optimism',
            decimals: 18,
            name: 'Optimism Ether',
            network: 'optimism'
        },
        {
            symbol: 'GLMR',
            decimals: 18,
            name: 'Glimmer',
            network: 'moonbeam'
        },
        {
            symbol: 'TOMB',
            decimals: 18,
            name: 'Tomb',
            network: 'tombchain'
        },
        {
            symbol: 'MNT',
            decimals: 18,
            name: 'Mantle',
            network: 'mantle'
        },
        {
            symbol: 'MNT-testnet',
            decimals: 18,
            name: 'Mantle Testnet',
            network: 'mantle-testnet'
        },
        {
            symbol: 'CORE',
            decimals: 18,
            name: 'Core',
            network: 'core'
        },
        {
            symbol: 'ETH-sepolia',
            decimals: 18,
            name: 'Sepolia Ether',
            network: 'sepolia'
        },
        {
            symbol: 'ETH-zksync',
            decimals: 18,
            name: 'Ether',
            network: 'zksyncera'
        },
        {
            symbol: 'ETH-zksync-testnet',
            decimals: 18,
            name: 'Ether',
            network: 'zksynceratestnet'
        },
        {
            symbol: 'ETH-base',
            decimals: 18,
            name: 'Base Ether',
            network: 'base'
        }
    ],
    [types_1.RequestLogicTypes.CURRENCY.BTC]: [
        {
            symbol: 'BTC',
            decimals: 8,
            name: 'Bitcoin',
            network: 'mainnet'
        },
        {
            symbol: 'BTC-testnet',
            decimals: 8,
            name: 'Test Bitcoin',
            network: 'testnet'
        }
    ]
}; //# sourceMappingURL=native.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/ChainsAbstract.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChainsAbstract = void 0;
const native_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/native.js [app-rsc] (ecmascript)");
class ChainsAbstract {
    constructor(chains, currencyType){
        /**
         * @returns true if both chains have the same ID or same name
         */ this.isSameChain = (chain1, chain2)=>{
            return chain1 === chain2 || this.getChainId(chain1) === this.getChainId(chain2);
        };
        /**
         * @returns true if both chains have the same ID or same name
         */ this.isSameChainFromString = (chain1, chain2)=>{
            try {
                this.assertChainSupported(chain1);
                this.assertChainSupported(chain2);
            } catch (_a) {
                return false;
            }
            return this.isSameChain(chain1, chain2);
        };
        this.chains = chains;
        this.chainNames = Object.keys(chains);
        this.addNativeCurrenciesToChains(currencyType);
    }
    /**
     * Adds the native currency to the list of currencies supported by each chain
     */ addNativeCurrenciesToChains(currencyType) {
        this.chainNames.forEach((chainName)=>{
            const nativeCurrency = native_1.nativeCurrencies[currencyType].find((currency)=>currency.network === chainName);
            if (nativeCurrency) {
                const chainCurrencies = this.chains[chainName].currencies || {};
                chainCurrencies.native = nativeCurrency;
                this.chains[chainName].currencies = chainCurrencies;
            }
        });
    }
    /**
     * Check if chainName lives amongst the list of supported chains by this chain type.
     * Throws in the case it's not supported.
     */ assertChainSupported(chainName) {
        if (!this.isChainSupported(chainName)) throw new Error(`Unsupported chain ${chainName}`);
    }
    /**
     * Check if chainName lives amongst the list of supported chains by this chain type.
     */ isChainSupported(chainName) {
        return !!chainName && this.chainNames.includes(chainName);
    }
    /**
     * Retrieve the corresponding chain ID from Request Network's internal chain name representation
     */ getChainId(chainName) {
        return this.chains[chainName].chainId;
    }
    /**
     * Retrieve Request Network's internal chain name representation from the corresponding chain ID
     */ getChainName(chainId) {
        return this.chainNames.find((chainName)=>this.chains[chainName].chainId === chainId);
    }
    /**
     * Returns true is the chain is a testnet chain
     */ isTestnet(chainName) {
        return Boolean(this.chains[chainName].testnet);
    }
}
exports.ChainsAbstract = ChainsAbstract; //# sourceMappingURL=ChainsAbstract.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/btc/data/mainnet.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f'; //# sourceMappingURL=mainnet.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/btc/data/testnet.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testnet = exports.chainId = void 0;
exports.chainId = '000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943';
exports.testnet = true; //# sourceMappingURL=testnet.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/btc/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chains = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const MainnetDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/btc/data/mainnet.js [app-rsc] (ecmascript)"));
const TestnetDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/btc/data/testnet.js [app-rsc] (ecmascript)"));
exports.chains = {
    mainnet: MainnetDefinition,
    testnet: TestnetDefinition
}; //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/btc/BtcChains.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const ChainsAbstract_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/ChainsAbstract.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const index_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/btc/index.js [app-rsc] (ecmascript)");
class BtcChains extends ChainsAbstract_1.ChainsAbstract {
}
exports.default = new BtcChains(index_1.chains, types_1.RequestLogicTypes.CURRENCY.BTC); //# sourceMappingURL=BtcChains.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/alfajores.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 44787; //# sourceMappingURL=alfajores.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/arbitrum-one.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 42161; //# sourceMappingURL=arbitrum-one.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/arbitrum-rinkeby.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testnet = exports.chainId = void 0;
exports.chainId = 421611;
exports.testnet = true; //# sourceMappingURL=arbitrum-rinkeby.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/avalanche.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedAvalancheERC20 = void 0;
// List of the supported bsc network tokens
exports.supportedAvalancheERC20 = {
    '0x9fB1d52596c44603198fB0aee434fac3a679f702': {
        name: 'Jarvis Synthetic Euro',
        symbol: 'jEUR',
        decimals: 18
    },
    '0xc7198437980c041c805A1EDcbA50c1Ce5db95118': {
        name: 'Tether USD',
        symbol: 'USDTe',
        decimals: 6
    },
    '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664': {
        name: 'USD Coin',
        symbol: 'USDCe',
        decimals: 6
    },
    '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70': {
        name: 'Dai Stablecoin',
        symbol: 'DAIe',
        decimals: 18
    },
    '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E': {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6
    },
    '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7': {
        name: 'TetherToken',
        symbol: 'USDT',
        decimals: 6
    }
}; //# sourceMappingURL=avalanche.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/avalanche.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.chainId = void 0;
const avalanche_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/avalanche.js [app-rsc] (ecmascript)");
exports.chainId = 43114;
exports.currencies = Object.assign({}, avalanche_1.supportedAvalancheERC20); //# sourceMappingURL=avalanche.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/bsc.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedBSCERC20 = void 0;
// List of the supported bsc network tokens
exports.supportedBSCERC20 = {
    '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3': {
        name: 'Binance-Peg Dai Token',
        symbol: 'DAI',
        decimals: 18
    },
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56': {
        name: 'Binance-Peg BUSD Token',
        symbol: 'BUSD',
        decimals: 18
    }
}; //# sourceMappingURL=bsc.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/bsc.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.chainId = void 0;
const bsc_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/bsc.js [app-rsc] (ecmascript)");
exports.chainId = 56;
exports.currencies = Object.assign({}, bsc_1.supportedBSCERC20); //# sourceMappingURL=bsc.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/bsctest.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedBSCTestERC20 = void 0;
// List of the supported bsctest network tokens
exports.supportedBSCTestERC20 = {
    '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867': {
        name: 'DAI Token',
        symbol: 'DAI',
        decimals: 18
    }
}; //# sourceMappingURL=bsctest.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/bsctest.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.chainId = void 0;
const bsctest_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/bsctest.js [app-rsc] (ecmascript)");
exports.chainId = 97;
exports.currencies = Object.assign({}, bsctest_1.supportedBSCTestERC20); //# sourceMappingURL=bsctest.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/celo.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedCeloERC20 = void 0;
// List of the supported celo network tokens
exports.supportedCeloERC20 = {
    // https://explorer.celo.org/address/0x765de816845861e75a25fca122bb6898b8b1282a/read_contract
    '0x765DE816845861e75A25fCA122bb6898B8B1282a': {
        // FIXME: should be cUSD, need to work on the retrocompatibility
        symbol: 'cUSD',
        decimals: 18,
        name: 'Celo Dollar'
    },
    // https://explorer.celo.org/address/0x471EcE3750Da237f93B8E339c536989b8978a438/read_contract
    '0x471EcE3750Da237f93B8E339c536989b8978a438': {
        symbol: 'cGLD',
        decimals: 18,
        name: 'Celo Gold'
    },
    // https://explorer.celo.org/address/0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73/read_contract
    '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73': {
        symbol: 'cEUR',
        decimals: 18,
        name: 'Celo Euro'
    }
}; //# sourceMappingURL=celo.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/celo.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.chainId = void 0;
const celo_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/celo.js [app-rsc] (ecmascript)");
exports.chainId = 42220;
exports.currencies = Object.assign({}, celo_1.supportedCeloERC20); //# sourceMappingURL=celo.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/core.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 1116; //# sourceMappingURL=core.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/fantom.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedFantomERC20 = void 0;
exports.supportedFantomERC20 = {
    '0xD3b71117E6C1558c1553305b44988cd944e97300': {
        name: 'YEL Token',
        symbol: 'YEL',
        decimals: 18
    }
}; //# sourceMappingURL=fantom.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/fantom.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.chainId = void 0;
const fantom_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/fantom.js [app-rsc] (ecmascript)");
exports.chainId = 250;
exports.currencies = Object.assign({}, fantom_1.supportedFantomERC20); //# sourceMappingURL=fantom.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/fuse.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 122; //# sourceMappingURL=fuse.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/goerli.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedGoerliERC20 = void 0;
// List of the supported goerli ERC20 tokens
exports.supportedGoerliERC20 = {
    // Faucet Token on goerli network.
    '0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc': {
        decimals: 18,
        name: 'FaucetToken',
        symbol: 'FAU'
    }
}; //# sourceMappingURL=goerli.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/goerli.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.testnet = exports.chainId = void 0;
const goerli_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/goerli.js [app-rsc] (ecmascript)");
exports.chainId = 5;
exports.testnet = true;
exports.currencies = Object.assign({}, goerli_1.supportedGoerliERC20); //# sourceMappingURL=goerli.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/mainnet.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedMainnetERC20 = exports.extraERC20Tokens = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const metamaskContractMap = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@metamask+contract-metadata@1.31.0/node_modules/@metamask/contract-metadata/index.js [app-rsc] (ecmascript)"));
exports.extraERC20Tokens = {
    // INDA
    '0x433d86336dB759855A66cCAbe4338313a8A7fc77': {
        name: 'Indacoin',
        symbol: 'INDA',
        decimals: 2
    },
    // MPH
    '0x8888801aF4d980682e47f1A9036e589479e835C5': {
        name: '88mph.app',
        symbol: 'MPH',
        decimals: 18
    },
    // OCEAN
    '0x967da4048cD07aB37855c090aAF366e4ce1b9F48': {
        name: 'Ocean Token',
        symbol: 'OCEAN',
        decimals: 18
    },
    // ANKR
    '0x8290333ceF9e6D528dD5618Fb97a76f268f3EDD4': {
        name: 'Ankr Network',
        symbol: 'ANKR',
        decimals: 18
    },
    // XSGD
    '0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96': {
        name: 'XSGD',
        symbol: 'XSGD',
        decimals: 6
    },
    // OLY
    '0x6595b8fD9C920C81500dCa94e53Cdc712513Fb1f': {
        name: 'Olyseum',
        symbol: 'OLY',
        decimals: 18
    },
    // AKRO
    '0x8Ab7404063Ec4DBcfd4598215992DC3F8EC853d7': {
        name: 'Akropolis',
        symbol: 'AKRO',
        decimals: 18
    },
    // RLY
    '0xf1f955016EcbCd7321c7266BccFB96c68ea5E49b': {
        name: 'Rally',
        symbol: 'RLY',
        decimals: 18
    },
    '0x7815bDa662050D84718B988735218CFfd32f75ea': {
        name: 'YEL Token',
        symbol: 'YEL',
        decimals: 18
    }
};
// Merge metamask contracts list with our own
exports.supportedMainnetERC20 = Object.assign(Object.assign({}, Object.entries(metamaskContractMap).filter(([, val])=>val.erc20).reduce((prev, [key, val])=>Object.assign(Object.assign({}, prev), {
        [key]: {
            name: val.name,
            symbol: val.symbol,
            decimals: val.decimals
        }
    }), {})), exports.extraERC20Tokens); //# sourceMappingURL=mainnet.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/mainnet.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.chainId = void 0;
const mainnet_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/mainnet.js [app-rsc] (ecmascript)");
exports.chainId = 1;
exports.currencies = Object.assign({}, mainnet_1.supportedMainnetERC20); //# sourceMappingURL=mainnet.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/mantle.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 5000; //# sourceMappingURL=mantle.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/mantle-testnet.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testnet = exports.chainId = void 0;
exports.chainId = 5001;
exports.testnet = true; //# sourceMappingURL=mantle-testnet.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/matic.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedMaticERC20 = void 0;
// List of the supported matic network tokens
exports.supportedMaticERC20 = {
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': {
        name: '(PoS) Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18
    },
    '0x282d8efCe846A88B159800bd4130ad77443Fa1A1': {
        name: 'Ocean Token (PoS)',
        symbol: 'mOCEAN',
        decimals: 18
    },
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': {
        name: 'USD Coin (PoS)',
        symbol: 'USDC',
        decimals: 6
    },
    '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': {
        name: '(PoS) Tether USD',
        symbol: 'USDT',
        decimals: 6
    },
    '0xD3b71117E6C1558c1553305b44988cd944e97300': {
        name: 'YEL Token',
        symbol: 'YEL',
        decimals: 18
    }
}; //# sourceMappingURL=matic.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/matic.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.chainId = void 0;
const matic_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/matic.js [app-rsc] (ecmascript)");
exports.chainId = 137;
exports.currencies = Object.assign({}, matic_1.supportedMaticERC20); //# sourceMappingURL=matic.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/moonbeam.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedMoonbeamERC20 = void 0;
// List of the supported bsc network tokens
exports.supportedMoonbeamERC20 = {
    '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b': {
        name: 'USDC Multichain',
        symbol: 'USDC-multichain',
        decimals: 6
    },
    '0x931715FEE2d06333043d11F658C8CE934aC61D0c': {
        name: 'USDC Wormhole',
        symbol: 'USDC-wormhole',
        decimals: 6
    }
}; //# sourceMappingURL=moonbeam.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/moonbeam.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.chainId = void 0;
const moonbeam_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/moonbeam.js [app-rsc] (ecmascript)");
exports.chainId = 1284;
exports.currencies = Object.assign({}, moonbeam_1.supportedMoonbeamERC20); //# sourceMappingURL=moonbeam.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/mumbai.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testnet = exports.chainId = void 0;
exports.chainId = 80001;
exports.testnet = true; //# sourceMappingURL=mumbai.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/optimism.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedOptimismERC20 = void 0;
// List of the supported bsc network tokens
exports.supportedOptimismERC20 = {
    '0x7F5c764cBc14f9669B88837ca1490cCa17c31607': {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6
    },
    '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58': {
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6
    },
    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1': {
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18
    }
}; //# sourceMappingURL=optimism.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/optimism.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.chainId = void 0;
const optimism_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/optimism.js [app-rsc] (ecmascript)");
exports.chainId = 10;
exports.currencies = Object.assign({}, optimism_1.supportedOptimismERC20); //# sourceMappingURL=optimism.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/private.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 0; //# sourceMappingURL=private.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/rinkeby.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedRinkebyERC20 = void 0;
// List of the supported rinkeby ERC20 tokens
exports.supportedRinkebyERC20 = {
    // Request Central Bank token, used for testing on rinkeby.
    '0x995d6A8C21F24be1Dd04E105DD0d83758343E258': {
        decimals: 18,
        name: 'Central Bank Token',
        symbol: 'CTBK'
    },
    // Faucet Token on rinkeby network. Easy to use on tests.
    '0xFab46E002BbF0b4509813474841E0716E6730136': {
        decimals: 18,
        name: 'Faucet Token',
        symbol: 'FAU'
    }
}; //# sourceMappingURL=rinkeby.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc777/chains/rinkeby.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedRinkebyERC777 = void 0;
// List of the supported rinkeby ERC777 tokens
exports.supportedRinkebyERC777 = {
    // Faucet Token on rinkeby network. Easy to use on tests.
    '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90': {
        decimals: 18,
        name: 'Super fDAI Fake Token',
        symbol: 'fDAIx'
    }
}; //# sourceMappingURL=rinkeby.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/rinkeby.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.testnet = exports.chainId = void 0;
const rinkeby_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/rinkeby.js [app-rsc] (ecmascript)");
const rinkeby_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc777/chains/rinkeby.js [app-rsc] (ecmascript)");
exports.chainId = 4;
exports.testnet = true;
exports.currencies = Object.assign(Object.assign({}, rinkeby_1.supportedRinkebyERC20), rinkeby_2.supportedRinkebyERC777); //# sourceMappingURL=rinkeby.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/ronin.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 2020; //# sourceMappingURL=ronin.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/sokol.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 77; //# sourceMappingURL=sokol.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/tombchain.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 6969; //# sourceMappingURL=tombchain.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/xdai.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedXDAIERC20 = void 0;
// List of the supported bsc network tokens
exports.supportedXDAIERC20 = {
    '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83': {
        name: 'USDC token on xDai',
        symbol: 'USDC',
        decimals: 6
    }
}; //# sourceMappingURL=xdai.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/xdai.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.chainId = void 0;
const xdai_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/xdai.js [app-rsc] (ecmascript)");
exports.chainId = 100;
exports.currencies = Object.assign({}, xdai_1.supportedXDAIERC20); //# sourceMappingURL=xdai.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/sepolia.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedSepoliaERC20 = void 0;
// List of the supported sepolia  ERC20 tokens
exports.supportedSepoliaERC20 = {
    // Faucet Token on sepolia  network.
    '0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C': {
        decimals: 18,
        name: 'FaucetToken',
        symbol: 'FAU'
    },
    '0xF046b3CA5ae2879c6bAcC4D42fAF363eE8379F78': {
        decimals: 6,
        name: 'FakeUSDT',
        symbol: 'fUSDT'
    },
    '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238': {
        decimals: 6,
        name: 'FakeUSDC',
        symbol: 'fUSDC'
    }
}; //# sourceMappingURL=sepolia.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/sepolia.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.testnet = exports.chainId = void 0;
const sepolia_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/sepolia.js [app-rsc] (ecmascript)");
exports.chainId = 11155111;
exports.testnet = true;
exports.currencies = Object.assign({}, sepolia_1.supportedSepoliaERC20); //# sourceMappingURL=sepolia.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/zksync-era-testnet.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testnet = exports.chainId = void 0;
exports.chainId = 280;
exports.testnet = true; //# sourceMappingURL=zksync-era-testnet.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/zksync-era.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 324; //# sourceMappingURL=zksync-era.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/base.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedBaseERC20 = void 0;
// List of the supported base network tokens
exports.supportedBaseERC20 = {
    '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb': {
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18
    },
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6
    }
}; //# sourceMappingURL=base.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/base.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currencies = exports.chainId = void 0;
const base_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/base.js [app-rsc] (ecmascript)");
exports.chainId = 8453;
exports.currencies = Object.assign({}, base_1.supportedBaseERC20); //# sourceMappingURL=base.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chains = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const AlfajoresDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/alfajores.js [app-rsc] (ecmascript)"));
const ArbitrumOneDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/arbitrum-one.js [app-rsc] (ecmascript)"));
const ArbitrumRinkebyDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/arbitrum-rinkeby.js [app-rsc] (ecmascript)"));
const AvalancheDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/avalanche.js [app-rsc] (ecmascript)"));
const BscDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/bsc.js [app-rsc] (ecmascript)"));
const BscTestDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/bsctest.js [app-rsc] (ecmascript)"));
const CeloDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/celo.js [app-rsc] (ecmascript)"));
const CoreDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/core.js [app-rsc] (ecmascript)"));
const FantomDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/fantom.js [app-rsc] (ecmascript)"));
const FuseDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/fuse.js [app-rsc] (ecmascript)"));
const GoerliDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/goerli.js [app-rsc] (ecmascript)"));
const MainnetDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/mainnet.js [app-rsc] (ecmascript)"));
const MantleDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/mantle.js [app-rsc] (ecmascript)"));
const MantleTestnetDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/mantle-testnet.js [app-rsc] (ecmascript)"));
const MaticDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/matic.js [app-rsc] (ecmascript)"));
const MoonbeamDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/moonbeam.js [app-rsc] (ecmascript)"));
const MumbaiDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/mumbai.js [app-rsc] (ecmascript)"));
const OptimismDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/optimism.js [app-rsc] (ecmascript)"));
const PrivateDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/private.js [app-rsc] (ecmascript)"));
const RinkebyDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/rinkeby.js [app-rsc] (ecmascript)"));
const RoninDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/ronin.js [app-rsc] (ecmascript)"));
const SokolDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/sokol.js [app-rsc] (ecmascript)"));
const TombchainDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/tombchain.js [app-rsc] (ecmascript)"));
const XDaiDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/xdai.js [app-rsc] (ecmascript)"));
const SepoliaDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/sepolia.js [app-rsc] (ecmascript)"));
const ZkSyncEraTestnetDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/zksync-era-testnet.js [app-rsc] (ecmascript)"));
const ZkSyncEraDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/zksync-era.js [app-rsc] (ecmascript)"));
const BaseDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/data/base.js [app-rsc] (ecmascript)"));
exports.chains = {
    alfajores: AlfajoresDefinition,
    'arbitrum-one': ArbitrumOneDefinition,
    'arbitrum-rinkeby': ArbitrumRinkebyDefinition,
    avalanche: AvalancheDefinition,
    bsc: BscDefinition,
    bsctest: BscTestDefinition,
    celo: CeloDefinition,
    core: CoreDefinition,
    fantom: FantomDefinition,
    fuse: FuseDefinition,
    goerli: GoerliDefinition,
    mainnet: MainnetDefinition,
    mantle: MantleDefinition,
    'mantle-testnet': MantleTestnetDefinition,
    matic: MaticDefinition,
    moonbeam: MoonbeamDefinition,
    mumbai: MumbaiDefinition,
    optimism: OptimismDefinition,
    private: PrivateDefinition,
    rinkeby: RinkebyDefinition,
    ronin: RoninDefinition,
    sokol: SokolDefinition,
    tombchain: TombchainDefinition,
    xdai: XDaiDefinition,
    sepolia: SepoliaDefinition,
    zksynceratestnet: ZkSyncEraTestnetDefinition,
    zksyncera: ZkSyncEraDefinition,
    base: BaseDefinition
}; //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/EvmChains.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const ChainsAbstract_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/ChainsAbstract.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const index_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/index.js [app-rsc] (ecmascript)");
class EvmChains extends ChainsAbstract_1.ChainsAbstract {
}
exports.default = new EvmChains(index_1.chains, types_1.RequestLogicTypes.CURRENCY.ETH); //# sourceMappingURL=EvmChains.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/near/data/near.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 'mainnet'; //# sourceMappingURL=near.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/near/data/near-testnet.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testnet = exports.chainId = void 0;
exports.chainId = 'testnet';
exports.testnet = true; //# sourceMappingURL=near-testnet.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/near/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chains = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const NearDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/near/data/near.js [app-rsc] (ecmascript)"));
const NearTestnetDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/near/data/near-testnet.js [app-rsc] (ecmascript)"));
exports.chains = {
    aurora: NearDefinition,
    'aurora-testnet': NearTestnetDefinition,
    near: NearDefinition,
    'near-testnet': NearTestnetDefinition
}; //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/near/NearChains.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const ChainsAbstract_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/ChainsAbstract.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const index_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/near/index.js [app-rsc] (ecmascript)");
class NearChains extends ChainsAbstract_1.ChainsAbstract {
}
exports.default = new NearChains(index_1.chains, types_1.RequestLogicTypes.CURRENCY.ETH); //# sourceMappingURL=NearChains.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/declarative/data/tron.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 'tron'; //# sourceMappingURL=tron.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/declarative/data/solana.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainId = void 0;
exports.chainId = 'solana'; //# sourceMappingURL=solana.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/declarative/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chains = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const TronDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/declarative/data/tron.js [app-rsc] (ecmascript)"));
const SolanaDefinition = tslib_1.__importStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/declarative/data/solana.js [app-rsc] (ecmascript)"));
exports.chains = {
    tron: TronDefinition,
    solana: SolanaDefinition
}; //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/declarative/DeclarativeChains.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const ChainsAbstract_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/ChainsAbstract.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const index_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/declarative/index.js [app-rsc] (ecmascript)");
class DeclarativeChains extends ChainsAbstract_1.ChainsAbstract {
}
exports.default = new DeclarativeChains(index_1.chains, types_1.RequestLogicTypes.CURRENCY.ETH); //# sourceMappingURL=DeclarativeChains.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/utils.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isSameChain = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const BtcChains_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/btc/BtcChains.js [app-rsc] (ecmascript)"));
const EvmChains_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/EvmChains.js [app-rsc] (ecmascript)"));
const NearChains_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/near/NearChains.js [app-rsc] (ecmascript)"));
// Returns true if both chains are equal or aliases
const isSameChain = (chain1, chain2)=>{
    return chain1 === chain2 || !![
        EvmChains_1.default,
        NearChains_1.default,
        BtcChains_1.default
    ].find((chainSystem)=>{
        return chainSystem.isSameChainFromString(chain1, chain2);
    });
};
exports.isSameChain = isSameChain; //# sourceMappingURL=utils.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isSameChain = exports.DeclarativeChains = exports.NearChains = exports.EvmChains = exports.BtcChains = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const BtcChains_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/btc/BtcChains.js [app-rsc] (ecmascript)"));
exports.BtcChains = BtcChains_1.default;
const EvmChains_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/evm/EvmChains.js [app-rsc] (ecmascript)"));
exports.EvmChains = EvmChains_1.default;
const NearChains_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/near/NearChains.js [app-rsc] (ecmascript)"));
exports.NearChains = NearChains_1.default;
const DeclarativeChains_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/declarative/DeclarativeChains.js [app-rsc] (ecmascript)"));
exports.DeclarativeChains = DeclarativeChains_1.default;
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/utils.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "isSameChain", {
    enumerable: true,
    get: function() {
        return utils_1.isSameChain;
    }
}); //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedNetworks = void 0;
const avalanche_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/avalanche.js [app-rsc] (ecmascript)");
const bsc_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/bsc.js [app-rsc] (ecmascript)");
const bsctest_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/bsctest.js [app-rsc] (ecmascript)");
const celo_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/celo.js [app-rsc] (ecmascript)");
const fantom_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/fantom.js [app-rsc] (ecmascript)");
const goerli_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/goerli.js [app-rsc] (ecmascript)");
const mainnet_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/mainnet.js [app-rsc] (ecmascript)");
const matic_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/matic.js [app-rsc] (ecmascript)");
const moonbeam_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/moonbeam.js [app-rsc] (ecmascript)");
const optimism_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/optimism.js [app-rsc] (ecmascript)");
const rinkeby_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/rinkeby.js [app-rsc] (ecmascript)");
const xdai_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/xdai.js [app-rsc] (ecmascript)");
const sepolia_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/sepolia.js [app-rsc] (ecmascript)");
exports.supportedNetworks = {
    celo: celo_1.supportedCeloERC20,
    // FIXME: Rinkeby is deprecated
    rinkeby: rinkeby_1.supportedRinkebyERC20,
    goerli: goerli_1.supportedGoerliERC20,
    mainnet: mainnet_1.supportedMainnetERC20,
    matic: matic_1.supportedMaticERC20,
    fantom: fantom_1.supportedFantomERC20,
    bsctest: bsctest_1.supportedBSCTestERC20,
    bsc: bsc_1.supportedBSCERC20,
    xdai: xdai_1.supportedXDAIERC20,
    avalanche: avalanche_1.supportedAvalancheERC20,
    optimism: optimism_1.supportedOptimismERC20,
    moonbeam: moonbeam_1.supportedMoonbeamERC20,
    sepolia: sepolia_1.supportedSepoliaERC20
}; //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getSupportedERC20Tokens = void 0;
const chains_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/chains/index.js [app-rsc] (ecmascript)");
/**
 * Returns a list of supported ERC20 tokens
 *
 * @returns List of supported ERC20 tokens
 */ function getSupportedERC20Tokens() {
    return Object.entries(chains_1.supportedNetworks).reduce((acc, [networkName, supportedCurrencies])=>{
        return [
            ...acc,
            ...Object.entries(supportedCurrencies).map(([address, token])=>({
                    address,
                    network: networkName,
                    decimals: token.decimals,
                    symbol: token.symbol,
                    id: token.id
                }))
        ];
    }, []);
}
exports.getSupportedERC20Tokens = getSupportedERC20Tokens; //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc777/chains/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportedNetworks = void 0;
const rinkeby_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc777/chains/rinkeby.js [app-rsc] (ecmascript)");
exports.supportedNetworks = {
    rinkeby: rinkeby_1.supportedRinkebyERC777
}; //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc777/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getSupportedERC777Tokens = void 0;
const chains_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc777/chains/index.js [app-rsc] (ecmascript)");
/**
 * Returns a list of supported ERC777 tokens
 *
 * @returns List of supported ERC777 tokens
 */ function getSupportedERC777Tokens() {
    return Object.entries(chains_1.supportedNetworks).reduce((acc, [networkName, supportedCurrencies])=>{
        return [
            ...acc,
            ...Object.entries(supportedCurrencies).map(([address, token])=>({
                    address,
                    network: networkName,
                    decimals: token.decimals,
                    symbol: token.symbol
                }))
        ];
    }, []);
}
exports.getSupportedERC777Tokens = getSupportedERC777Tokens; //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/private.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"0x38cf23c52bb4b13f051aec09580a2de845a7fa35\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":{\"0x38cf23c52bb4b13f051aec09580a2de845a7fa35\":1,\"0x17b4158805772ced11225e77339f90beb5aae968\":1,\"0xa65ded58a0afee8241e788c5115ca53ef3925fd2\":1},\"0x17b4158805772ced11225e77339f90beb5aae968\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xa65ded58a0afee8241e788c5115ca53ef3925fd2\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1,\"0x8acee021a27779d8e98b9650722676b850b25e11\":1},\"0x8acee021a27779d8e98b9650722676b850b25e11\":{\"0xa65ded58a0afee8241e788c5115ca53ef3925fd2\":1}}"));}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/mainnet.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"0x4f99f266506be1475e943b2f097827011bfa4e93\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":{\"0x4f99f266506be1475e943b2f097827011bfa4e93\":1,\"0xfa6faefc053e6c8e393a73dcc12b09fcde019d25\":1,\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1,\"0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c\":1,\"0x8290333cef9e6d528dd5618fb97a76f268f3edd4\":1,\"0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9\":1,\"0xce80759e72fe1d3c07be79ffecc76a7a9b46c641\":1,\"0xfac26e3fd40adcdc6652f705d983b4830c00716c\":1,\"0xdac17f958d2ee523a2206206994597c13d831ec7\":1,\"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\":1,\"0x013f29832cd6525c4c6df81c2aae8032a1ff2db2\":1,\"0x17b4158805772ced11225e77339f90beb5aae968\":1,\"0x6b175474e89094c44da98b954eedeac495271d0f\":1,\"0x3845badade8e6dff049820680d1f14bd3903a5d0\":1,\"0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7\":1,\"0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202\":1,\"0x8f8221afbb33998d8584a2b05749ba73c37a938a\":1,\"0xe6c09adc89ff4467cea20bc7760e3e59e7c0671d\":1,\"0x0d8775f648430679a709e98d2b0cb6250d2887ef\":1,\"0x956f47f50a910163d8bf957cf5846d573e7f87ca\":1,\"0xf68fb12aa78e5c2b3eebd71441a990cd5757055c\":1,\"0x0bbb60891a1688271573e5ea4cba84f18cbc0f2d\":1,\"0xb50731ca2fd80afe3910a4800225d4845cad266f\":1,\"0xab6ce0b86d905929340c640e8bcba8751feea10e\":1,\"0xbc396689893d065f41bc2c6ecbee5e0085233447\":1,\"0x6b3595068778dd592e39a122f4f5a5cf09c90fe2\":1,\"0xb7a41bb9ad3cdc5db0e35c12e78106fa3f21693d\":1,\"0x00a8b738e453ffd858a7edf03bccfe20412f0eb0\":1,\"0x1a4b46696b2bb4794eb3d4c26f1c55f9170fa4c5\":1,\"0xd46ba6d942050d489dbd938a2c909a5d5039a161\":1,\"0x77fba179c79de5b7653f68b5039af940ada60ce0\":1,\"0x4fabb145d64652a948d72533023f6e7a623c7c53\":1,\"0x853d955acef822db058eb8505911ed77f175b99e\":1,\"0x056fd409e1d7a124bd7017459dfea2f387b6d5cd\":1,\"0xe28b3b32b6c345a34ff64674606124dd5aceca30\":1,\"0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0\":1,\"0x0000000000085d4780b73119b644ae5ecd22b376\":1,\"0x8e870d67f660d95d5be530380d0ec0bd388289e1\":1,\"0x6ea6803339cfeadd84b5b62820c548f53ff7d8e9\":1},\"0xfa6faefc053e6c8e393a73dcc12b09fcde019d25\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1,\"0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c\":1,\"0xa117000000f279d81a1d3cc75430faa017fa5a2e\":1,\"0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9\":1,\"0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2\":1,\"0x4e15361fd6b4bb609fa63c81a2be19d873717870\":1,\"0xdac17f958d2ee523a2206206994597c13d831ec7\":1,\"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\":1,\"0x6b175474e89094c44da98b954eedeac495271d0f\":1,\"0xc944e90c64b2c07662a292be6244bdf05cda44a7\":1,\"0x967da4048cd07ab37855c090aaf366e4ce1b9f48\":1,\"0x0f5d2fb29fb7d3cfee444a200298f468908cc942\":1,\"0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202\":1,\"0x8f693ca8d21b157107184d29d398a8d082b38b76\":1,\"0xbb0e17ef65f82ab018d8edd776e8dd940327b28b\":1,\"0xde30da39c46104798bb5aa3fe8b9e0e1f348163f\":1,\"0x0d8775f648430679a709e98d2b0cb6250d2887ef\":1,\"0xb8c77482e45f1f44de1745f52c74426c631bdd52\":1,\"0x6810e776880c02933d47db1b9fc05908e5386b96\":1,\"0xbc396689893d065f41bc2c6ecbee5e0085233447\":1,\"0x607f4c5bb672230e8672085532f7e901544a7375\":1,\"0x6b3595068778dd592e39a122f4f5a5cf09c90fe2\":1,\"0x4fabb145d64652a948d72533023f6e7a623c7c53\":1,\"0x853d955acef822db058eb8505911ed77f175b99e\":1,\"0x056fd409e1d7a124bd7017459dfea2f387b6d5cd\":1,\"0x0000000000085d4780b73119b644ae5ecd22b376\":1},\"0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1,\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0xa117000000f279d81a1d3cc75430faa017fa5a2e\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0x8290333cef9e6d528dd5618fb97a76f268f3edd4\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1,\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0xce80759e72fe1d3c07be79ffecc76a7a9b46c641\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xfac26e3fd40adcdc6652f705d983b4830c00716c\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x4e15361fd6b4bb609fa63c81a2be19d873717870\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0xdac17f958d2ee523a2206206994597c13d831ec7\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1,\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1,\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0x013f29832cd6525c4c6df81c2aae8032a1ff2db2\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x17b4158805772ced11225e77339f90beb5aae968\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x6b175474e89094c44da98b954eedeac495271d0f\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1,\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xc944e90c64b2c07662a292be6244bdf05cda44a7\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0x967da4048cd07ab37855c090aaf366e4ce1b9f48\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0x3845badade8e6dff049820680d1f14bd3903a5d0\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x0f5d2fb29fb7d3cfee444a200298f468908cc942\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1,\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x8f8221afbb33998d8584a2b05749ba73c37a938a\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xe6c09adc89ff4467cea20bc7760e3e59e7c0671d\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x8f693ca8d21b157107184d29d398a8d082b38b76\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0xbb0e17ef65f82ab018d8edd776e8dd940327b28b\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0xde30da39c46104798bb5aa3fe8b9e0e1f348163f\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0x0d8775f648430679a709e98d2b0cb6250d2887ef\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1,\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x956f47f50a910163d8bf957cf5846d573e7f87ca\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xf68fb12aa78e5c2b3eebd71441a990cd5757055c\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x0bbb60891a1688271573e5ea4cba84f18cbc0f2d\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xb8c77482e45f1f44de1745f52c74426c631bdd52\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0xb50731ca2fd80afe3910a4800225d4845cad266f\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x6810e776880c02933d47db1b9fc05908e5386b96\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0xab6ce0b86d905929340c640e8bcba8751feea10e\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xbc396689893d065f41bc2c6ecbee5e0085233447\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1,\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x607f4c5bb672230e8672085532f7e901544a7375\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0x6b3595068778dd592e39a122f4f5a5cf09c90fe2\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1,\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xb7a41bb9ad3cdc5db0e35c12e78106fa3f21693d\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x00a8b738e453ffd858a7edf03bccfe20412f0eb0\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x1a4b46696b2bb4794eb3d4c26f1c55f9170fa4c5\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xd46ba6d942050d489dbd938a2c909a5d5039a161\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x77fba179c79de5b7653f68b5039af940ada60ce0\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x4fabb145d64652a948d72533023f6e7a623c7c53\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1,\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x853d955acef822db058eb8505911ed77f175b99e\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1,\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x056fd409e1d7a124bd7017459dfea2f387b6d5cd\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1,\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xe28b3b32b6c345a34ff64674606124dd5aceca30\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x0000000000085d4780b73119b644ae5ecd22b376\":{\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1,\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x8e870d67f660d95d5be530380d0ec0bd388289e1\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x6ea6803339cfeadd84b5b62820c548f53ff7d8e9\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1}}"));}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/goerli.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"0xba62bcfcaafc6622853cca2be6ac7d845bc0f2dc\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x39e19aa5b69466dfdc313c7cda37cb2a599015cd\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":{\"0xba62bcfcaafc6622853cca2be6ac7d845bc0f2dc\":1,\"0x39e19aa5b69466dfdc313c7cda37cb2a599015cd\":1}}"));}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/sepolia.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"0x370de27fdb7d1ff1e1baa7d11c5820a324cf623c\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xf046b3ca5ae2879c6bacc4d42faf363ee8379f78\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x1c7d4b196cb0c7b01d743fbc6116a902379c7238\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":{\"0x370de27fdb7d1ff1e1baa7d11c5820a324cf623c\":1,\"0xf046b3ca5ae2879c6bacc4d42faf363ee8379f78\":1,\"0x1c7d4b196cb0c7b01d743fbc6116a902379c7238\":1}}"));}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/rinkeby.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"0xfab46e002bbf0b4509813474841e0716e6730136\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":{\"0xfab46e002bbf0b4509813474841e0716e6730136\":1,\"0x17b4158805772ced11225e77339f90beb5aae968\":1,\"0x013f29832cd6525c4c6df81c2aae8032a1ff2db2\":1,\"0x2ae72ebc9eb4738b1e1e1cc4ec878ee2c4f5b923\":1},\"0x17b4158805772ced11225e77339f90beb5aae968\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x013f29832cd6525c4c6df81c2aae8032a1ff2db2\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x2ae72ebc9eb4738b1e1e1cc4ec878ee2c4f5b923\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1}}"));}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/matic.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"0xc2132d05d31c914a87c6611c10748aeb04b58e8f\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1,\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":{\"0xc2132d05d31c914a87c6611c10748aeb04b58e8f\":1,\"0x2791bca1f2de4661ed88a30c99a7a9449aa84174\":1,\"0x8f3cf7ad23cd3cadbd9735aff958023239c6a063\":1,\"0xfa6faefc053e6c8e393a73dcc12b09fcde019d25\":1,\"0xce80759e72fe1d3c07be79ffecc76a7a9b46c641\":1,\"0x013f29832cd6525c4c6df81c2aae8032a1ff2db2\":1,\"0x17b4158805772ced11225e77339f90beb5aae968\":1,\"0x4f99f266506be1475e943b2f097827011bfa4e93\":1,\"0xfac26e3fd40adcdc6652f705d983b4830c00716c\":1,\"0x831753dd7087cac61ab5644b308642cc1c33dc13\":1},\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":{\"0xc2132d05d31c914a87c6611c10748aeb04b58e8f\":1,\"0x2791bca1f2de4661ed88a30c99a7a9449aa84174\":1,\"0x8f3cf7ad23cd3cadbd9735aff958023239c6a063\":1,\"0x831753dd7087cac61ab5644b308642cc1c33dc13\":1},\"0x2791bca1f2de4661ed88a30c99a7a9449aa84174\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1,\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0x8f3cf7ad23cd3cadbd9735aff958023239c6a063\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1,\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1},\"0xfa6faefc053e6c8e393a73dcc12b09fcde019d25\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xce80759e72fe1d3c07be79ffecc76a7a9b46c641\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x013f29832cd6525c4c6df81c2aae8032a1ff2db2\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x17b4158805772ced11225e77339f90beb5aae968\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x4f99f266506be1475e943b2f097827011bfa4e93\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xfac26e3fd40adcdc6652f705d983b4830c00716c\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x831753dd7087cac61ab5644b308642cc1c33dc13\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1,\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1}}"));}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/fantom.json (json)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
__turbopack_export_value__(JSON.parse("{\"0xfac26e3fd40adcdc6652f705d983b4830c00716c\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":{\"0xfac26e3fd40adcdc6652f705d983b4830c00716c\":1,\"0x10bf4137b0558c33c2dc9f71c3bb81c2865fa2fb\":1,\"0x04068da6c83afcfa0e13ba15a6696662335d5b75\":1,\"0x940f41f0ec9ba1a34cf001cc03347ac092f5f6b5\":1,\"0xae75a438b2e0cb8bb01ec1e1e376de11d44477cc\":1,\"0x56ee926bd8c72b2d5fa1af4d9e4cbb515a1e3adc\":1,\"0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8\":1,\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":1,\"0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e\":1,\"0x657a1861c15a3ded9af0b6799a195a249ebdcbc6\":1,\"0x27f26f00e1605903645bbabc0a73e35027dccd45\":1,\"0x03049758a18d1589388d7a74fb71c3fcce11d286\":1,\"0x6a07a792ab2965c72a5b8088d3a069a7ac3a993b\":1,\"0x658b0c7613e890ee50b8c4bc6a3f41ef411208ad\":1,\"0xe1146b9ac456fcbb60644c36fd3f868a9072fc6e\":1},\"0x10bf4137b0558c33c2dc9f71c3bb81c2865fa2fb\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x04068da6c83afcfa0e13ba15a6696662335d5b75\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x940f41f0ec9ba1a34cf001cc03347ac092f5f6b5\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xae75a438b2e0cb8bb01ec1e1e376de11d44477cc\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x56ee926bd8c72b2d5fa1af4d9e4cbb515a1e3adc\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xf5af88e117747e87fc5929f2ff87221b1447652e\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x657a1861c15a3ded9af0b6799a195a249ebdcbc6\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x27f26f00e1605903645bbabc0a73e35027dccd45\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x03049758a18d1589388d7a74fb71c3fcce11d286\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x6a07a792ab2965c72a5b8088d3a069a7ac3a993b\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0x658b0c7613e890ee50b8c4bc6a3f41ef411208ad\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1},\"0xe1146b9ac456fcbb60644c36fd3f868a9072fc6e\":{\"0x775eb53d00dd0acd3ec1696472105d579b9b386b\":1}}"));}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/conversion-aggregators.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPath = exports.conversionSupportedNetworks = exports.defaultConversionPairs = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const node_dijkstra_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/node-dijkstra@2.5.0/node_modules/node-dijkstra/libs/Graph.js [app-rsc] (ecmascript)"));
const private_json_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/private.json (json)"));
const mainnet_json_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/mainnet.json (json)"));
const goerli_json_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/goerli.json (json)"));
const sepolia_json_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/sepolia.json (json)"));
const rinkeby_json_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/rinkeby.json (json)"));
const matic_json_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/matic.json (json)"));
const fantom_json_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/aggregators/fantom.json (json)"));
// Pairs supported by Chainlink (can be generated from requestNetwork/toolbox/src/chainlinkConversionPathTools.ts)
const chainlinkCurrencyPairs = {
    private: private_json_1.default,
    goerli: goerli_json_1.default,
    rinkeby: rinkeby_json_1.default,
    mainnet: mainnet_json_1.default,
    matic: matic_json_1.default,
    fantom: fantom_json_1.default,
    sepolia: sepolia_json_1.default
};
// FIXME: This fix enables to get these networks registered in conversionSupportedNetworks.
// Could be improved by removing the supported network check from the protocol
const noConversionNetworks = {
    'arbitrum-rinkeby': {},
    'arbitrum-one': {},
    xdai: {},
    avalanche: {},
    bsc: {},
    optimism: {},
    moonbeam: {},
    // FIXME: Near should get conversion again with Pyth. See './aggregators/near-testnet.json' and './aggregators/near.json';
    aurora: {},
    'aurora-testnet': {},
    base: {},
    celo: {}
};
/**
 * Conversion paths per network used by default if no other path given to the Currency Manager.
 * Must be updated every time an aggregator is added to one network.
 */ exports.defaultConversionPairs = Object.assign(Object.assign({}, chainlinkCurrencyPairs), noConversionNetworks);
exports.conversionSupportedNetworks = Object.keys(exports.defaultConversionPairs);
/**
 * Gets the on-chain conversion path between two currencies.
 * The path is used to value currencyFrom against currencyTo.
 *
 * @param currencyFrom currency from
 * @param currencyTo currency to
 * @param network ethereum network (default: 'mainnet')
 *
 * @returns conversion path
 */ function getPath(currencyFrom, currencyTo, network = 'mainnet', pairs = exports.defaultConversionPairs) {
    if (!pairs[network]) {
        throw Error(`network ${network} not supported`);
    }
    // load the Graph
    const route = new node_dijkstra_1.default(pairs[network]);
    // Get the path
    return route.path(currencyFrom.hash.toLowerCase(), currencyTo.hash.toLowerCase());
}
exports.getPath = getPath; //# sourceMappingURL=conversion-aggregators.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/getHash.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getHash = void 0;
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+utils@0.49.0/node_modules/@requestnetwork/utils/dist/index.js [app-rsc] (ecmascript)");
const getHash = (curr)=>{
    return curr.type === types_1.RequestLogicTypes.CURRENCY.ERC20 || curr.type === types_1.RequestLogicTypes.CURRENCY.ERC777 ? curr.value : (0, utils_1.last20bytesOfNormalizedKeccak256Hash)({
        type: curr.type,
        value: curr.value
    });
};
exports.getHash = getHash; //# sourceMappingURL=getHash.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/iso4217.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
/*
    Follows ISO 4217, https://www.iso.org/iso-4217-currency-codes.html
    See https://www.currency-iso.org/dam/downloads/lists/list_one.xml
    Data last updated 2018-08-29
*/ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = [
    {
        code: 'AED',
        number: '784',
        digits: 2,
        currency: 'UAE Dirham',
        countries: [
            'United Arab Emirates (The)'
        ]
    },
    {
        code: 'AFN',
        number: '971',
        digits: 2,
        currency: 'Afghani',
        countries: [
            'Afghanistan'
        ]
    },
    {
        code: 'ALL',
        number: '008',
        digits: 2,
        currency: 'Lek',
        countries: [
            'Albania'
        ]
    },
    {
        code: 'AMD',
        number: '051',
        digits: 2,
        currency: 'Armenian Dram',
        countries: [
            'Armenia'
        ]
    },
    {
        code: 'ANG',
        number: '532',
        digits: 2,
        currency: 'Netherlands Antillean Guilder',
        countries: [
            'Curaçao',
            'Sint Maarten (Dutch Part)'
        ]
    },
    {
        code: 'AOA',
        number: '973',
        digits: 2,
        currency: 'Kwanza',
        countries: [
            'Angola'
        ]
    },
    {
        code: 'ARS',
        number: '032',
        digits: 2,
        currency: 'Argentine Peso',
        countries: [
            'Argentina'
        ]
    },
    {
        code: 'AUD',
        number: '036',
        digits: 2,
        currency: 'Australian Dollar',
        countries: [
            'Australia',
            'Christmas Island',
            'Cocos (Keeling) Islands (The)',
            'Heard Island and Mcdonald Islands',
            'Kiribati',
            'Nauru',
            'Norfolk Island',
            'Tuvalu'
        ]
    },
    {
        code: 'AWG',
        number: '533',
        digits: 2,
        currency: 'Aruban Florin',
        countries: [
            'Aruba'
        ]
    },
    {
        code: 'AZN',
        number: '944',
        digits: 2,
        currency: 'Azerbaijan Manat',
        countries: [
            'Azerbaijan'
        ]
    },
    {
        code: 'BAM',
        number: '977',
        digits: 2,
        currency: 'Convertible Mark',
        countries: [
            'Bosnia and Herzegovina'
        ]
    },
    {
        code: 'BBD',
        number: '052',
        digits: 2,
        currency: 'Barbados Dollar',
        countries: [
            'Barbados'
        ]
    },
    {
        code: 'BDT',
        number: '050',
        digits: 2,
        currency: 'Taka',
        countries: [
            'Bangladesh'
        ]
    },
    {
        code: 'BGN',
        number: '975',
        digits: 2,
        currency: 'Bulgarian Lev',
        countries: [
            'Bulgaria'
        ]
    },
    {
        code: 'BHD',
        number: '048',
        digits: 3,
        currency: 'Bahraini Dinar',
        countries: [
            'Bahrain'
        ]
    },
    {
        code: 'BIF',
        number: '108',
        digits: 0,
        currency: 'Burundi Franc',
        countries: [
            'Burundi'
        ]
    },
    {
        code: 'BMD',
        number: '060',
        digits: 2,
        currency: 'Bermudian Dollar',
        countries: [
            'Bermuda'
        ]
    },
    {
        code: 'BND',
        number: '096',
        digits: 2,
        currency: 'Brunei Dollar',
        countries: [
            'Brunei Darussalam'
        ]
    },
    {
        code: 'BOB',
        number: '068',
        digits: 2,
        currency: 'Boliviano',
        countries: [
            'Bolivia (Plurinational State Of)'
        ]
    },
    {
        code: 'BOV',
        number: '984',
        digits: 2,
        currency: 'Mvdol',
        countries: [
            'Bolivia (Plurinational State Of)'
        ]
    },
    {
        code: 'BRL',
        number: '986',
        digits: 2,
        currency: 'Brazilian Real',
        countries: [
            'Brazil'
        ]
    },
    {
        code: 'BSD',
        number: '044',
        digits: 2,
        currency: 'Bahamian Dollar',
        countries: [
            'Bahamas (The)'
        ]
    },
    {
        code: 'BTN',
        number: '064',
        digits: 2,
        currency: 'Ngultrum',
        countries: [
            'Bhutan'
        ]
    },
    {
        code: 'BWP',
        number: '072',
        digits: 2,
        currency: 'Pula',
        countries: [
            'Botswana'
        ]
    },
    {
        code: 'BYN',
        number: '933',
        digits: 2,
        currency: 'Belarusian Ruble',
        countries: [
            'Belarus'
        ]
    },
    {
        code: 'BZD',
        number: '084',
        digits: 2,
        currency: 'Belize Dollar',
        countries: [
            'Belize'
        ]
    },
    {
        code: 'CAD',
        number: '124',
        digits: 2,
        currency: 'Canadian Dollar',
        countries: [
            'Canada'
        ]
    },
    {
        code: 'CDF',
        number: '976',
        digits: 2,
        currency: 'Congolese Franc',
        countries: [
            'Congo (The Democratic Republic of The)'
        ]
    },
    {
        code: 'CHE',
        number: '947',
        digits: 2,
        currency: 'WIR Euro',
        countries: [
            'Switzerland'
        ]
    },
    {
        code: 'CHF',
        number: '756',
        digits: 2,
        currency: 'Swiss Franc',
        countries: [
            'Liechtenstein',
            'Switzerland'
        ]
    },
    {
        code: 'CHW',
        number: '948',
        digits: 2,
        currency: 'WIR Franc',
        countries: [
            'Switzerland'
        ]
    },
    {
        code: 'CLF',
        number: '990',
        digits: 4,
        currency: 'Unidad de Fomento',
        countries: [
            'Chile'
        ]
    },
    {
        code: 'CLP',
        number: '152',
        digits: 0,
        currency: 'Chilean Peso',
        countries: [
            'Chile'
        ]
    },
    {
        code: 'CNY',
        number: '156',
        digits: 2,
        currency: 'Yuan Renminbi',
        countries: [
            'China'
        ]
    },
    {
        code: 'COP',
        number: '170',
        digits: 2,
        currency: 'Colombian Peso',
        countries: [
            'Colombia'
        ]
    },
    {
        code: 'COU',
        number: '970',
        digits: 2,
        currency: 'Unidad de Valor Real',
        countries: [
            'Colombia'
        ]
    },
    {
        code: 'CRC',
        number: '188',
        digits: 2,
        currency: 'Costa Rican Colon',
        countries: [
            'Costa Rica'
        ]
    },
    {
        code: 'CUC',
        number: '931',
        digits: 2,
        currency: 'Peso Convertible',
        countries: [
            'Cuba'
        ]
    },
    {
        code: 'CUP',
        number: '192',
        digits: 2,
        currency: 'Cuban Peso',
        countries: [
            'Cuba'
        ]
    },
    {
        code: 'CVE',
        number: '132',
        digits: 2,
        currency: 'Cabo Verde Escudo',
        countries: [
            'Cabo Verde'
        ]
    },
    {
        code: 'CZK',
        number: '203',
        digits: 2,
        currency: 'Czech Koruna',
        countries: [
            'Czechia'
        ]
    },
    {
        code: 'DJF',
        number: '262',
        digits: 0,
        currency: 'Djibouti Franc',
        countries: [
            'Djibouti'
        ]
    },
    {
        code: 'DKK',
        number: '208',
        digits: 2,
        currency: 'Danish Krone',
        countries: [
            'Denmark',
            'Faroe Islands (The)',
            'Greenland'
        ]
    },
    {
        code: 'DOP',
        number: '214',
        digits: 2,
        currency: 'Dominican Peso',
        countries: [
            'Dominican Republic (The)'
        ]
    },
    {
        code: 'DZD',
        number: '012',
        digits: 2,
        currency: 'Algerian Dinar',
        countries: [
            'Algeria'
        ]
    },
    {
        code: 'EGP',
        number: '818',
        digits: 2,
        currency: 'Egyptian Pound',
        countries: [
            'Egypt'
        ]
    },
    {
        code: 'ERN',
        number: '232',
        digits: 2,
        currency: 'Nakfa',
        countries: [
            'Eritrea'
        ]
    },
    {
        code: 'ETB',
        number: '230',
        digits: 2,
        currency: 'Ethiopian Birr',
        countries: [
            'Ethiopia'
        ]
    },
    {
        code: 'EUR',
        number: '978',
        digits: 2,
        currency: 'Euro',
        countries: [
            'Åland Islands',
            'Andorra',
            'Austria',
            'Belgium',
            'Cyprus',
            'Estonia',
            'European Union',
            'Finland',
            'France',
            'French Guiana',
            'French Southern Territories (The)',
            'Germany',
            'Greece',
            'Guadeloupe',
            'Holy See (The)',
            'Ireland',
            'Italy',
            'Latvia',
            'Lithuania',
            'Luxembourg',
            'Malta',
            'Martinique',
            'Mayotte',
            'Monaco',
            'Montenegro',
            'Netherlands (The)',
            'Portugal',
            'Réunion',
            'Saint Barthélemy',
            'Saint Martin (French Part)',
            'Saint Pierre and Miquelon',
            'San Marino',
            'Slovakia',
            'Slovenia',
            'Spain'
        ]
    },
    {
        code: 'FJD',
        number: '242',
        digits: 2,
        currency: 'Fiji Dollar',
        countries: [
            'Fiji'
        ]
    },
    {
        code: 'FKP',
        number: '238',
        digits: 2,
        currency: 'Falkland Islands Pound',
        countries: [
            'Falkland Islands (The) [Malvinas]'
        ]
    },
    {
        code: 'GBP',
        number: '826',
        digits: 2,
        currency: 'Pound Sterling',
        countries: [
            'Guernsey',
            'Isle of Man',
            'Jersey',
            'United Kingdom of Great Britain and Northern Ireland (The)'
        ]
    },
    {
        code: 'GEL',
        number: '981',
        digits: 2,
        currency: 'Lari',
        countries: [
            'Georgia'
        ]
    },
    {
        code: 'GHS',
        number: '936',
        digits: 2,
        currency: 'Ghana Cedi',
        countries: [
            'Ghana'
        ]
    },
    {
        code: 'GIP',
        number: '292',
        digits: 2,
        currency: 'Gibraltar Pound',
        countries: [
            'Gibraltar'
        ]
    },
    {
        code: 'GMD',
        number: '270',
        digits: 2,
        currency: 'Dalasi',
        countries: [
            'Gambia (The)'
        ]
    },
    {
        code: 'GNF',
        number: '324',
        digits: 0,
        currency: 'Guinean Franc',
        countries: [
            'Guinea'
        ]
    },
    {
        code: 'GTQ',
        number: '320',
        digits: 2,
        currency: 'Quetzal',
        countries: [
            'Guatemala'
        ]
    },
    {
        code: 'GYD',
        number: '328',
        digits: 2,
        currency: 'Guyana Dollar',
        countries: [
            'Guyana'
        ]
    },
    {
        code: 'HKD',
        number: '344',
        digits: 2,
        currency: 'Hong Kong Dollar',
        countries: [
            'Hong Kong'
        ]
    },
    {
        code: 'HNL',
        number: '340',
        digits: 2,
        currency: 'Lempira',
        countries: [
            'Honduras'
        ]
    },
    {
        code: 'HRK',
        number: '191',
        digits: 2,
        currency: 'Kuna',
        countries: [
            'Croatia'
        ]
    },
    {
        code: 'HTG',
        number: '332',
        digits: 2,
        currency: 'Gourde',
        countries: [
            'Haiti'
        ]
    },
    {
        code: 'HUF',
        number: '348',
        digits: 2,
        currency: 'Forint',
        countries: [
            'Hungary'
        ]
    },
    {
        code: 'IDR',
        number: '360',
        digits: 2,
        currency: 'Rupiah',
        countries: [
            'Indonesia'
        ]
    },
    {
        code: 'ILS',
        number: '376',
        digits: 2,
        currency: 'New Israeli Sheqel',
        countries: [
            'Israel'
        ]
    },
    {
        code: 'INR',
        number: '356',
        digits: 2,
        currency: 'Indian Rupee',
        countries: [
            'Bhutan',
            'India'
        ]
    },
    {
        code: 'IQD',
        number: '368',
        digits: 3,
        currency: 'Iraqi Dinar',
        countries: [
            'Iraq'
        ]
    },
    {
        code: 'IRR',
        number: '364',
        digits: 2,
        currency: 'Iranian Rial',
        countries: [
            'Iran (Islamic Republic Of)'
        ]
    },
    {
        code: 'ISK',
        number: '352',
        digits: 0,
        currency: 'Iceland Krona',
        countries: [
            'Iceland'
        ]
    },
    {
        code: 'JMD',
        number: '388',
        digits: 2,
        currency: 'Jamaican Dollar',
        countries: [
            'Jamaica'
        ]
    },
    {
        code: 'JOD',
        number: '400',
        digits: 3,
        currency: 'Jordanian Dinar',
        countries: [
            'Jordan'
        ]
    },
    {
        code: 'JPY',
        number: '392',
        digits: 0,
        currency: 'Yen',
        countries: [
            'Japan'
        ]
    },
    {
        code: 'KES',
        number: '404',
        digits: 2,
        currency: 'Kenyan Shilling',
        countries: [
            'Kenya'
        ]
    },
    {
        code: 'KGS',
        number: '417',
        digits: 2,
        currency: 'Som',
        countries: [
            'Kyrgyzstan'
        ]
    },
    {
        code: 'KHR',
        number: '116',
        digits: 2,
        currency: 'Riel',
        countries: [
            'Cambodia'
        ]
    },
    {
        code: 'KMF',
        number: '174',
        digits: 0,
        currency: 'Comorian Franc ',
        countries: [
            'Comoros (The)'
        ]
    },
    {
        code: 'KPW',
        number: '408',
        digits: 2,
        currency: 'North Korean Won',
        countries: [
            'Korea (The Democratic People’s Republic Of)'
        ]
    },
    {
        code: 'KRW',
        number: '410',
        digits: 0,
        currency: 'Won',
        countries: [
            'Korea (The Republic Of)'
        ]
    },
    {
        code: 'KWD',
        number: '414',
        digits: 3,
        currency: 'Kuwaiti Dinar',
        countries: [
            'Kuwait'
        ]
    },
    {
        code: 'KYD',
        number: '136',
        digits: 2,
        currency: 'Cayman Islands Dollar',
        countries: [
            'Cayman Islands (The)'
        ]
    },
    {
        code: 'KZT',
        number: '398',
        digits: 2,
        currency: 'Tenge',
        countries: [
            'Kazakhstan'
        ]
    },
    {
        code: 'LAK',
        number: '418',
        digits: 2,
        currency: 'Lao Kip',
        countries: [
            'Lao People’s Democratic Republic (The)'
        ]
    },
    {
        code: 'LBP',
        number: '422',
        digits: 2,
        currency: 'Lebanese Pound',
        countries: [
            'Lebanon'
        ]
    },
    {
        code: 'LKR',
        number: '144',
        digits: 2,
        currency: 'Sri Lanka Rupee',
        countries: [
            'Sri Lanka'
        ]
    },
    {
        code: 'LRD',
        number: '430',
        digits: 2,
        currency: 'Liberian Dollar',
        countries: [
            'Liberia'
        ]
    },
    {
        code: 'LSL',
        number: '426',
        digits: 2,
        currency: 'Loti',
        countries: [
            'Lesotho'
        ]
    },
    {
        code: 'LYD',
        number: '434',
        digits: 3,
        currency: 'Libyan Dinar',
        countries: [
            'Libya'
        ]
    },
    {
        code: 'MAD',
        number: '504',
        digits: 2,
        currency: 'Moroccan Dirham',
        countries: [
            'Morocco',
            'Western Sahara'
        ]
    },
    {
        code: 'MDL',
        number: '498',
        digits: 2,
        currency: 'Moldovan Leu',
        countries: [
            'Moldova (The Republic Of)'
        ]
    },
    {
        code: 'MGA',
        number: '969',
        digits: 2,
        currency: 'Malagasy Ariary',
        countries: [
            'Madagascar'
        ]
    },
    {
        code: 'MKD',
        number: '807',
        digits: 2,
        currency: 'Denar',
        countries: [
            'Macedonia (The Former Yugoslav Republic Of)'
        ]
    },
    {
        code: 'MMK',
        number: '104',
        digits: 2,
        currency: 'Kyat',
        countries: [
            'Myanmar'
        ]
    },
    {
        code: 'MNT',
        number: '496',
        digits: 2,
        currency: 'Tugrik',
        countries: [
            'Mongolia'
        ]
    },
    {
        code: 'MOP',
        number: '446',
        digits: 2,
        currency: 'Pataca',
        countries: [
            'Macao'
        ]
    },
    {
        code: 'MRU',
        number: '929',
        digits: 2,
        currency: 'Ouguiya',
        countries: [
            'Mauritania'
        ]
    },
    {
        code: 'MUR',
        number: '480',
        digits: 2,
        currency: 'Mauritius Rupee',
        countries: [
            'Mauritius'
        ]
    },
    {
        code: 'MVR',
        number: '462',
        digits: 2,
        currency: 'Rufiyaa',
        countries: [
            'Maldives'
        ]
    },
    {
        code: 'MWK',
        number: '454',
        digits: 2,
        currency: 'Malawi Kwacha',
        countries: [
            'Malawi'
        ]
    },
    {
        code: 'MXN',
        number: '484',
        digits: 2,
        currency: 'Mexican Peso',
        countries: [
            'Mexico'
        ]
    },
    {
        code: 'MXV',
        number: '979',
        digits: 2,
        currency: 'Mexican Unidad de Inversion (UDI)',
        countries: [
            'Mexico'
        ]
    },
    {
        code: 'MYR',
        number: '458',
        digits: 2,
        currency: 'Malaysian Ringgit',
        countries: [
            'Malaysia'
        ]
    },
    {
        code: 'MZN',
        number: '943',
        digits: 2,
        currency: 'Mozambique Metical',
        countries: [
            'Mozambique'
        ]
    },
    {
        code: 'NAD',
        number: '516',
        digits: 2,
        currency: 'Namibia Dollar',
        countries: [
            'Namibia'
        ]
    },
    {
        code: 'NGN',
        number: '566',
        digits: 2,
        currency: 'Naira',
        countries: [
            'Nigeria'
        ]
    },
    {
        code: 'NIO',
        number: '558',
        digits: 2,
        currency: 'Cordoba Oro',
        countries: [
            'Nicaragua'
        ]
    },
    {
        code: 'NOK',
        number: '578',
        digits: 2,
        currency: 'Norwegian Krone',
        countries: [
            'Bouvet Island',
            'Norway',
            'Svalbard and Jan Mayen'
        ]
    },
    {
        code: 'NPR',
        number: '524',
        digits: 2,
        currency: 'Nepalese Rupee',
        countries: [
            'Nepal'
        ]
    },
    {
        code: 'NZD',
        number: '554',
        digits: 2,
        currency: 'New Zealand Dollar',
        countries: [
            'Cook Islands (The)',
            'New Zealand',
            'Niue',
            'Pitcairn',
            'Tokelau'
        ]
    },
    {
        code: 'OMR',
        number: '512',
        digits: 3,
        currency: 'Rial Omani',
        countries: [
            'Oman'
        ]
    },
    {
        code: 'PAB',
        number: '590',
        digits: 2,
        currency: 'Balboa',
        countries: [
            'Panama'
        ]
    },
    {
        code: 'PEN',
        number: '604',
        digits: 2,
        currency: 'Sol',
        countries: [
            'Peru'
        ]
    },
    {
        code: 'PGK',
        number: '598',
        digits: 2,
        currency: 'Kina',
        countries: [
            'Papua New Guinea'
        ]
    },
    {
        code: 'PHP',
        number: '608',
        digits: 2,
        currency: 'Philippine Peso',
        countries: [
            'Philippines (The)'
        ]
    },
    {
        code: 'PKR',
        number: '586',
        digits: 2,
        currency: 'Pakistan Rupee',
        countries: [
            'Pakistan'
        ]
    },
    {
        code: 'PLN',
        number: '985',
        digits: 2,
        currency: 'Zloty',
        countries: [
            'Poland'
        ]
    },
    {
        code: 'PYG',
        number: '600',
        digits: 0,
        currency: 'Guarani',
        countries: [
            'Paraguay'
        ]
    },
    {
        code: 'QAR',
        number: '634',
        digits: 2,
        currency: 'Qatari Rial',
        countries: [
            'Qatar'
        ]
    },
    {
        code: 'RON',
        number: '946',
        digits: 2,
        currency: 'Romanian Leu',
        countries: [
            'Romania'
        ]
    },
    {
        code: 'RSD',
        number: '941',
        digits: 2,
        currency: 'Serbian Dinar',
        countries: [
            'Serbia'
        ]
    },
    {
        code: 'RUB',
        number: '643',
        digits: 2,
        currency: 'Russian Ruble',
        countries: [
            'Russian Federation (The)'
        ]
    },
    {
        code: 'RWF',
        number: '646',
        digits: 0,
        currency: 'Rwanda Franc',
        countries: [
            'Rwanda'
        ]
    },
    {
        code: 'SAR',
        number: '682',
        digits: 2,
        currency: 'Saudi Riyal',
        countries: [
            'Saudi Arabia'
        ]
    },
    {
        code: 'SBD',
        number: '090',
        digits: 2,
        currency: 'Solomon Islands Dollar',
        countries: [
            'Solomon Islands'
        ]
    },
    {
        code: 'SCR',
        number: '690',
        digits: 2,
        currency: 'Seychelles Rupee',
        countries: [
            'Seychelles'
        ]
    },
    {
        code: 'SDG',
        number: '938',
        digits: 2,
        currency: 'Sudanese Pound',
        countries: [
            'Sudan (The)'
        ]
    },
    {
        code: 'SEK',
        number: '752',
        digits: 2,
        currency: 'Swedish Krona',
        countries: [
            'Sweden'
        ]
    },
    {
        code: 'SGD',
        number: '702',
        digits: 2,
        currency: 'Singapore Dollar',
        countries: [
            'Singapore'
        ]
    },
    {
        code: 'SHP',
        number: '654',
        digits: 2,
        currency: 'Saint Helena Pound',
        countries: [
            'Saint Helena, Ascension and Tristan Da Cunha'
        ]
    },
    {
        code: 'SLL',
        number: '694',
        digits: 2,
        currency: 'Leone',
        countries: [
            'Sierra Leone'
        ]
    },
    {
        code: 'SOS',
        number: '706',
        digits: 2,
        currency: 'Somali Shilling',
        countries: [
            'Somalia'
        ]
    },
    {
        code: 'SRD',
        number: '968',
        digits: 2,
        currency: 'Surinam Dollar',
        countries: [
            'Suriname'
        ]
    },
    {
        code: 'SSP',
        number: '728',
        digits: 2,
        currency: 'South Sudanese Pound',
        countries: [
            'South Sudan'
        ]
    },
    {
        code: 'STN',
        number: '930',
        digits: 2,
        currency: 'Dobra',
        countries: [
            'Sao Tome and Principe'
        ]
    },
    {
        code: 'SVC',
        number: '222',
        digits: 2,
        currency: 'El Salvador Colon',
        countries: [
            'El Salvador'
        ]
    },
    {
        code: 'SYP',
        number: '760',
        digits: 2,
        currency: 'Syrian Pound',
        countries: [
            'Syrian Arab Republic'
        ]
    },
    {
        code: 'SZL',
        number: '748',
        digits: 2,
        currency: 'Lilangeni',
        countries: [
            'Eswatini'
        ]
    },
    {
        code: 'THB',
        number: '764',
        digits: 2,
        currency: 'Baht',
        countries: [
            'Thailand'
        ]
    },
    {
        code: 'TJS',
        number: '972',
        digits: 2,
        currency: 'Somoni',
        countries: [
            'Tajikistan'
        ]
    },
    {
        code: 'TMT',
        number: '934',
        digits: 2,
        currency: 'Turkmenistan New Manat',
        countries: [
            'Turkmenistan'
        ]
    },
    {
        code: 'TND',
        number: '788',
        digits: 3,
        currency: 'Tunisian Dinar',
        countries: [
            'Tunisia'
        ]
    },
    {
        code: 'TOP',
        number: '776',
        digits: 2,
        currency: 'Pa’anga',
        countries: [
            'Tonga'
        ]
    },
    {
        code: 'TRY',
        number: '949',
        digits: 2,
        currency: 'Turkish Lira',
        countries: [
            'Turkey'
        ]
    },
    {
        code: 'TTD',
        number: '780',
        digits: 2,
        currency: 'Trinidad and Tobago Dollar',
        countries: [
            'Trinidad and Tobago'
        ]
    },
    {
        code: 'TWD',
        number: '901',
        digits: 2,
        currency: 'New Taiwan Dollar',
        countries: [
            'Taiwan (Province of China)'
        ]
    },
    {
        code: 'TZS',
        number: '834',
        digits: 2,
        currency: 'Tanzanian Shilling',
        countries: [
            'Tanzania, United Republic Of'
        ]
    },
    {
        code: 'UAH',
        number: '980',
        digits: 2,
        currency: 'Hryvnia',
        countries: [
            'Ukraine'
        ]
    },
    {
        code: 'UGX',
        number: '800',
        digits: 0,
        currency: 'Uganda Shilling',
        countries: [
            'Uganda'
        ]
    },
    {
        code: 'USD',
        number: '840',
        digits: 2,
        currency: 'US Dollar',
        countries: [
            'American Samoa',
            'Bonaire, Sint Eustatius and Saba',
            'British Indian Ocean Territory (The)',
            'Ecuador',
            'El Salvador',
            'Guam',
            'Haiti',
            'Marshall Islands (The)',
            'Micronesia (Federated States Of)',
            'Northern Mariana Islands (The)',
            'Palau',
            'Panama',
            'Puerto Rico',
            'Timor-Leste',
            'Turks and Caicos Islands (The)',
            'United States Minor Outlying Islands (The)',
            'United States of America (The)',
            'Virgin Islands (British)',
            'Virgin Islands (U.S.)'
        ]
    },
    {
        code: 'USN',
        number: '997',
        digits: 2,
        currency: 'US Dollar (Next day)',
        countries: [
            'United States of America (The)'
        ]
    },
    {
        code: 'UYI',
        number: '940',
        digits: 0,
        currency: 'Uruguay Peso en Unidades Indexadas (UI)',
        countries: [
            'Uruguay'
        ]
    },
    {
        code: 'UYU',
        number: '858',
        digits: 2,
        currency: 'Peso Uruguayo',
        countries: [
            'Uruguay'
        ]
    },
    {
        code: 'UYW',
        number: '927',
        digits: 4,
        currency: 'Unidad Previsional',
        countries: [
            'Uruguay'
        ]
    },
    {
        code: 'UZS',
        number: '860',
        digits: 2,
        currency: 'Uzbekistan Sum',
        countries: [
            'Uzbekistan'
        ]
    },
    {
        code: 'VES',
        number: '928',
        digits: 2,
        currency: 'Bolívar Soberano',
        countries: [
            'Venezuela (Bolivarian Republic Of)'
        ]
    },
    {
        code: 'VND',
        number: '704',
        digits: 0,
        currency: 'Dong',
        countries: [
            'Viet Nam'
        ]
    },
    {
        code: 'VUV',
        number: '548',
        digits: 0,
        currency: 'Vatu',
        countries: [
            'Vanuatu'
        ]
    },
    {
        code: 'WST',
        number: '882',
        digits: 2,
        currency: 'Tala',
        countries: [
            'Samoa'
        ]
    },
    {
        code: 'XAF',
        number: '950',
        digits: 0,
        currency: 'CFA Franc BEAC',
        countries: [
            'Cameroon',
            'Central African Republic (The)',
            'Chad',
            'Congo (The)',
            'Equatorial Guinea',
            'Gabon'
        ]
    },
    {
        code: 'XAG',
        number: '961',
        digits: 0,
        currency: 'Silver',
        countries: [
            'Zz11_silver'
        ]
    },
    {
        code: 'XAU',
        number: '959',
        digits: 0,
        currency: 'Gold',
        countries: [
            'Zz08_gold'
        ]
    },
    {
        code: 'XBA',
        number: '955',
        digits: 0,
        currency: 'Bond Markets Unit European Composite Unit (EURCO)',
        countries: [
            'Zz01_bond Markets Unit European_eurco'
        ]
    },
    {
        code: 'XBB',
        number: '956',
        digits: 0,
        currency: 'Bond Markets Unit European Monetary Unit (E.M.U.-6)',
        countries: [
            'Zz02_bond Markets Unit European_emu-6'
        ]
    },
    {
        code: 'XBC',
        number: '957',
        digits: 0,
        currency: 'Bond Markets Unit European Unit of Account 9 (E.U.A.-9)',
        countries: [
            'Zz03_bond Markets Unit European_eua-9'
        ]
    },
    {
        code: 'XBD',
        number: '958',
        digits: 0,
        currency: 'Bond Markets Unit European Unit of Account 17 (E.U.A.-17)',
        countries: [
            'Zz04_bond Markets Unit European_eua-17'
        ]
    },
    {
        code: 'XCD',
        number: '951',
        digits: 2,
        currency: 'East Caribbean Dollar',
        countries: [
            'Anguilla',
            'Antigua and Barbuda',
            'Dominica',
            'Grenada',
            'Montserrat',
            'Saint Kitts and Nevis',
            'Saint Lucia',
            'Saint Vincent and the Grenadines'
        ]
    },
    {
        code: 'XDR',
        number: '960',
        digits: 0,
        currency: 'SDR (Special Drawing Right)',
        countries: [
            'International Monetary Fund (Imf) '
        ]
    },
    {
        code: 'XOF',
        number: '952',
        digits: 0,
        currency: 'CFA Franc BCEAO',
        countries: [
            'Benin',
            'Burkina Faso',
            "Côte d'Ivoire",
            'Guinea-Bissau',
            'Mali',
            'Niger (The)',
            'Senegal',
            'Togo'
        ]
    },
    {
        code: 'XPD',
        number: '964',
        digits: 0,
        currency: 'Palladium',
        countries: [
            'Zz09_palladium'
        ]
    },
    {
        code: 'XPF',
        number: '953',
        digits: 0,
        currency: 'CFP Franc',
        countries: [
            'French Polynesia',
            'New Caledonia',
            'Wallis and Futuna'
        ]
    },
    {
        code: 'XPT',
        number: '962',
        digits: 0,
        currency: 'Platinum',
        countries: [
            'Zz10_platinum'
        ]
    },
    {
        code: 'XSU',
        number: '994',
        digits: 0,
        currency: 'Sucre',
        countries: [
            "Sistema Unitario De Compensacion Regional De Pagos 'Sucre'"
        ]
    },
    {
        code: 'XTS',
        number: '963',
        digits: 0,
        currency: 'Codes specifically reserved for testing purposes',
        countries: [
            'Zz06_testing_code'
        ]
    },
    {
        code: 'XUA',
        number: '965',
        digits: 0,
        currency: 'ADB Unit of Account',
        countries: [
            'Member Countries of the African Development Bank Group'
        ]
    },
    {
        code: 'XXX',
        number: '999',
        digits: 0,
        currency: 'The codes assigned for transactions where no currency is involved',
        countries: [
            'Zz07_no_currency'
        ]
    },
    {
        code: 'YER',
        number: '886',
        digits: 2,
        currency: 'Yemeni Rial',
        countries: [
            'Yemen'
        ]
    },
    {
        code: 'ZAR',
        number: '710',
        digits: 2,
        currency: 'Rand',
        countries: [
            'Lesotho',
            'Namibia',
            'South Africa'
        ]
    },
    {
        code: 'ZMW',
        number: '967',
        digits: 2,
        currency: 'Zambian Kwacha',
        countries: [
            'Zambia'
        ]
    },
    {
        code: 'ZWL',
        number: '932',
        digits: 2,
        currency: 'Zimbabwe Dollar',
        countries: [
            'Zimbabwe'
        ]
    }
]; //# sourceMappingURL=iso4217.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/currency-utils.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isERC777Currency = exports.isERC20Currency = exports.isISO4217Currency = exports.isNativeCurrency = exports.isValidNearAddress = void 0;
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
/**
 * Checks if a Near address is valid according to a currency network.
 * Returns true if the currency network is not given and the address is correct for any network.
 */ const isValidNearAddress = (address, network)=>{
    if (!network) {
        return (0, exports.isValidNearAddress)(address, 'near') || (0, exports.isValidNearAddress)(address, 'near-testnet');
    }
    // see link bellow for NEAR address specification
    // https://nomicon.io/DataStructures/Account.html
    if (address.length < 2 || address.length > 64) {
        return false;
    }
    if (!address.match(/^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/)) {
        return false;
    }
    // Return true when account format is in hexadecimal format
    if (address.match(/[a-fA-F0-9]{64}$/)) {
        return true;
    }
    // see link bellow for details about top level accounts on mainnet and testnet
    // https://docs.near.org/docs/videos/accounts-keys
    switch(network){
        case 'aurora':
        case 'near':
            return !!address.match(/\.(?:near|tg)$/);
        case 'aurora-testnet':
        case 'near-testnet':
            return !!address.match(/\.testnet$/);
        default:
            throw new Error(`Cannot validate NEAR address for network ${network}`);
    }
};
exports.isValidNearAddress = isValidNearAddress;
/**
 * Type guards
 * Enable filtering per currency type
 */ const isNativeCurrency = (currency)=>{
    return currency.type === types_1.RequestLogicTypes.CURRENCY.BTC || currency.type === types_1.RequestLogicTypes.CURRENCY.ETH;
};
exports.isNativeCurrency = isNativeCurrency;
const isISO4217Currency = (currency)=>{
    return currency.type === types_1.RequestLogicTypes.CURRENCY.ISO4217;
};
exports.isISO4217Currency = isISO4217Currency;
const isERC20Currency = (currency)=>{
    return currency.type === types_1.RequestLogicTypes.CURRENCY.ERC20;
};
exports.isERC20Currency = isERC20Currency;
const isERC777Currency = (currency)=>{
    return currency.type === types_1.RequestLogicTypes.CURRENCY.ERC777;
};
exports.isERC777Currency = isERC777Currency; //# sourceMappingURL=currency-utils.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/currencyManager.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CurrencyManager = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-rsc] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-rsc] (ecmascript)");
const multicoin_address_validator_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/multicoin-address-validator@0.5.15/node_modules/multicoin-address-validator/src/wallet_address_validator.js [app-rsc] (ecmascript)"));
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/index.js [app-rsc] (ecmascript)");
const erc777_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc777/index.js [app-rsc] (ecmascript)");
const getHash_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/getHash.js [app-rsc] (ecmascript)");
const iso4217_1 = tslib_1.__importDefault(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/iso4217.js [app-rsc] (ecmascript)"));
const native_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/native.js [app-rsc] (ecmascript)");
const conversion_aggregators_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/conversion-aggregators.js [app-rsc] (ecmascript)");
const currency_utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/currency-utils.js [app-rsc] (ecmascript)");
const chains_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/index.js [app-rsc] (ecmascript)");
const { BTC, ERC20, ERC777, ETH, ISO4217 } = types_1.RequestLogicTypes.CURRENCY;
/**
 * Handles a list of currencies and provide features to retrieve them, as well as convert to/from storage format
 */ class CurrencyManager {
    /**
     *
     * @param inputCurrencies The list of currencies known by the Manager.
     * @param legacyTokens A mapping of legacy currency name or network name, in the format { "chainName": {"TOKEN": ["NEW_TOKEN","NEW_CHAIN"]}}
     * @param conversionPairs A mapping of possible conversions by network (network => currencyFrom => currencyTo => cost)
     */ constructor(inputCurrencies, legacyTokens, conversionPairs){
        this.knownCurrencies = [];
        for (const input of inputCurrencies){
            const currency = CurrencyManager.fromInput(input);
            if (this.knownCurrencies.some((x)=>x.id === currency.id)) {
                throw new Error(`Duplicate found: ${currency.id}`);
            }
            this.knownCurrencies.push(currency);
        }
        this.knownCurrenciesById = new Map(this.knownCurrencies.map((knownCurrency)=>[
                knownCurrency.id,
                knownCurrency
            ]));
        this.legacyTokens = legacyTokens || CurrencyManager.getDefaultLegacyTokens();
        this.conversionPairs = conversionPairs || CurrencyManager.getDefaultConversionPairs();
    }
    /**
     * Gets a supported currency from a symbol, symbol-network, currency definition id or address.
     *
     * @param currencyIdentifier e.g. 'DAI', 'FAU', 'FAU-rinkeby', 'ETH-rinkeby-rinkeby' or '0xFab46E002BbF0b4509813474841E0716E6730136'
     * @param network e.g. rinkeby, mainnet
     * @deprecated Use fromSymbol, fromAddress, fromId or fromHash to avoid ambiguity
     */ from(currencyIdentifier, network) {
        if (!currencyIdentifier) {
            return;
        }
        if (ethers_1.utils.isAddress(currencyIdentifier)) {
            return this.fromAddress(currencyIdentifier, network);
        }
        if (network && currencyIdentifier.indexOf(network) === -1) {
            currencyIdentifier = CurrencyManager.currencyId({
                symbol: currencyIdentifier,
                network
            });
        }
        const currencyFromId = this.fromId(currencyIdentifier);
        if (currencyFromId) return currencyFromId;
        const parts = currencyIdentifier.split('-');
        const currencyFromSymbol = this.fromSymbol(parts[0], network || parts[1]) || // try without splitting the symbol to support currencies like ETH-rinkeby
        this.fromSymbol(currencyIdentifier, network);
        return currencyFromSymbol;
    }
    /**
     * Gets a supported currency from its CurrencyTypes.CurrencyDefinition id
     */ fromId(id) {
        return this.knownCurrenciesById.get(id);
    }
    /**
     * Gets a supported currency from its address and network.
     * If more than one currency are found, undefined is returned
     */ fromAddress(address, network) {
        address = ethers_1.utils.getAddress(address);
        const matches = this.knownCurrencies.filter((x)=>(x.type === ERC20 || x.type === ERC777) && x.address === address && (!network || x.network === network));
        if (matches.length > 1) {
            const networks = matches.map((x)=>x.network).join(', ');
            console.warn(`${address} has several matches on ${networks}. To avoid errors, specify a network.`);
            return undefined;
        }
        return matches[0];
    }
    /**
     * Gets a supported currency from its symbol and network.
     */ fromSymbol(symbol, network) {
        var _a;
        symbol = symbol === null || symbol === void 0 ? void 0 : symbol.toUpperCase();
        network = network === null || network === void 0 ? void 0 : network.toLowerCase();
        const legacy = network ? (_a = this.legacyTokens[network]) === null || _a === void 0 ? void 0 : _a[symbol] : undefined;
        if (legacy) {
            [symbol, network] = legacy;
        }
        return this.knownCurrencies.find((x)=>x.symbol.toUpperCase() === symbol && (x.type === ISO4217 && !network || 'network' in x && x.network === network || !network));
    }
    fromHash(hash, network) {
        return this.knownCurrencies.find((x)=>x.hash.toLowerCase() === hash.toLowerCase() && (x.type === ISO4217 && !network || 'network' in x && x.network === network || !network));
    }
    /**
     * Retrieves a currency given its storage format (ICurrency)
     */ fromStorageCurrency(currency) {
        if (!currency) {
            return;
        }
        if (!currency.type) {
            throw new Error('Invalid format');
        }
        const networkOrDefault = currency.network || 'mainnet';
        return this.knownCurrencies.find((x)=>x.type === currency.type && ((x.type === ERC20 || x.type === ERC777) && currency.value === x.address && x.network === networkOrDefault || (x.type === ETH || x.type === BTC) && x.network === networkOrDefault || x.symbol === currency.value && !currency.network));
    }
    /**
     * Retrieves a Native currency for a type and network
     */ getNativeCurrency(type, network) {
        return this.knownCurrencies.find((x)=>x.type === type && x.network === network);
    }
    getConversionPath(from, to, network) {
        try {
            return (0, conversion_aggregators_1.getPath)(from, to, network, this.conversionPairs);
        } catch (e) {
            return null;
        }
    }
    supportsConversion(currency, network) {
        var _a;
        return !!((_a = this.conversionPairs[network]) === null || _a === void 0 ? void 0 : _a[currency.hash.toLowerCase()]);
    }
    /**
     * Adds computed parameters to a CurrencyTypes.CurrencyInput
     */ static fromInput(_a) {
        var { id, hash, meta } = _a, input = tslib_1.__rest(_a, [
            "id",
            "hash",
            "meta"
        ]);
        if ('address' in input) {
            if (input.address.startsWith('0x') && input.address.length === 42) {
                input.address = ethers_1.utils.getAddress(input.address);
            }
        }
        return Object.assign({
            id: id || CurrencyManager.currencyId(input),
            hash: hash || (0, getHash_1.getHash)(CurrencyManager.toStorageCurrency(input)),
            meta: meta
        }, input);
    }
    /**
     * Utility function to compute the unique identifier
     */ static currencyId(currency) {
        return 'network' in currency ? `${currency.symbol}-${currency.network}` : currency.symbol;
    }
    /**
     * Converts a currency to the storage format (ICurrency)
     */ static toStorageCurrency(currency) {
        return {
            type: currency.type,
            value: currency.type === ERC20 || currency.type === ERC777 ? currency.address : currency.symbol,
            network: currency.type === ISO4217 ? undefined : currency.network
        };
    }
    /**
     * Validates an address for a given currency.
     * Throws if the currency is an ISO4217 currency.
     */ validateAddress(address, currency) {
        if (currency.type === types_1.RequestLogicTypes.CURRENCY.ISO4217) {
            throw new Error(`Could not validate an address for an ISO4217 currency`);
        }
        switch(currency.type){
            case types_1.RequestLogicTypes.CURRENCY.ETH:
            case types_1.RequestLogicTypes.CURRENCY.ERC20:
            case types_1.RequestLogicTypes.CURRENCY.ERC777:
                if (chains_1.NearChains.isChainSupported(currency.network)) {
                    return (0, currency_utils_1.isValidNearAddress)(address, currency.network);
                } else if (currency.network === 'tron' || currency.network === 'solana') {
                    return multicoin_address_validator_1.default.validate(address, currency.network);
                }
                return multicoin_address_validator_1.default.validate(address, 'ETH');
            case types_1.RequestLogicTypes.CURRENCY.BTC:
                return multicoin_address_validator_1.default.validate(address, 'BTC', currency.network === 'testnet' ? 'testnet' : 'prod');
            default:
                throw new Error(`Could not validate an address for an unknown currency type`);
        }
    }
    /**
     * Validate the correctness of a Storage Currency
     */ validateCurrency(currency) {
        if (currency.type === types_1.RequestLogicTypes.CURRENCY.ISO4217 || currency.type === types_1.RequestLogicTypes.CURRENCY.ETH || currency.type === types_1.RequestLogicTypes.CURRENCY.BTC) return true;
        return this.validateAddress(currency.value, currency);
    }
    /**
     * Returns the list of currencies supported by Request out of the box
     * Contains:
     * - ISO currencies
     * - ERC20 currencies from Metamask/contract-metadata + some additional tokens
     * - ERC777 SuperTokens managed by SuperFluid
     * - ETH, & some EVM-compatible chains native tokens
     * - NEAR, YEL, ZIL, BTC
     * - ETH-rinkeby, FAU-rinkeby, CTBK-rinkeby
     */ static getDefaultList() {
        const isoCurrencies = iso4217_1.default.map((cc)=>({
                decimals: cc.digits,
                name: cc.currency,
                symbol: cc.code,
                type: ISO4217
            }));
        const eth = native_1.nativeCurrencies.ETH.map((x)=>Object.assign(Object.assign({}, x), {
                type: ETH
            }));
        const btc = native_1.nativeCurrencies.BTC.map((x)=>Object.assign(Object.assign({}, x), {
                type: BTC
            }));
        const erc20Tokens = (0, erc20_1.getSupportedERC20Tokens)();
        const erc20Currencies = erc20Tokens.map((x)=>Object.assign(Object.assign({}, x), {
                type: ERC20
            }));
        const erc777Tokens = (0, erc777_1.getSupportedERC777Tokens)();
        const erc777Currencies = erc777Tokens.map((x)=>Object.assign(Object.assign({}, x), {
                type: ERC777
            }));
        return isoCurrencies.concat(erc20Currencies).concat(erc777Currencies).concat(eth).concat(btc).map(CurrencyManager.fromInput);
    }
    /**
     * Returns the default list of legacy names (for symbol or network)
     */ static getDefaultLegacyTokens() {
        return {
            near: {
                NEAR: [
                    'NEAR',
                    'aurora'
                ]
            }
        };
    }
    static getDefaultConversionPairs() {
        return conversion_aggregators_1.defaultConversionPairs;
    }
    /**
     * Returns a default instance of CurrencyManager based on default lists
     */ static getDefault() {
        if (this.defaultInstance) return this.defaultInstance;
        this.defaultInstance = new CurrencyManager(CurrencyManager.getDefaultList(), CurrencyManager.getDefaultLegacyTokens());
        return this.defaultInstance;
    }
}
exports.CurrencyManager = CurrencyManager; //# sourceMappingURL=currencyManager.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/errors.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UnsupportedCurrencyError = void 0;
const getSymbolAndNetwork = (symbolWithNetwork)=>{
    if (typeof symbolWithNetwork === 'string') {
        const [symbol, network] = symbolWithNetwork.split('-');
        return {
            symbol,
            network
        };
    }
    const { value: symbol, network } = symbolWithNetwork;
    return {
        symbol,
        network
    };
};
class UnsupportedCurrencyError extends Error {
    constructor(symbolWithNetwork){
        const { symbol, network } = getSymbolAndNetwork(symbolWithNetwork);
        super(`The currency '${symbol}'${network ? ` on ${network}` : ''} is unknown or not supported.`);
        this.symbol = symbol;
        this.network = network;
    }
}
exports.UnsupportedCurrencyError = UnsupportedCurrencyError; //# sourceMappingURL=errors.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-rsc] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CurrencyManager = exports.getCurrencyHash = exports.conversionSupportedNetworks = exports.getSupportedERC777Tokens = exports.getSupportedERC20Tokens = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-rsc] (ecmascript)");
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/chains/index.js [app-rsc] (ecmascript)"), exports);
var erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc20/index.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "getSupportedERC20Tokens", {
    enumerable: true,
    get: function() {
        return erc20_1.getSupportedERC20Tokens;
    }
});
var erc777_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/erc777/index.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "getSupportedERC777Tokens", {
    enumerable: true,
    get: function() {
        return erc777_1.getSupportedERC777Tokens;
    }
});
var conversion_aggregators_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/conversion-aggregators.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "conversionSupportedNetworks", {
    enumerable: true,
    get: function() {
        return conversion_aggregators_1.conversionSupportedNetworks;
    }
});
var getHash_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/getHash.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "getCurrencyHash", {
    enumerable: true,
    get: function() {
        return getHash_1.getHash;
    }
});
var currencyManager_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/currencyManager.js [app-rsc] (ecmascript)");
Object.defineProperty(exports, "CurrencyManager", {
    enumerable: true,
    get: function() {
        return currencyManager_1.CurrencyManager;
    }
});
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/errors.js [app-rsc] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/currency-utils.js [app-rsc] (ecmascript)"), exports); //# sourceMappingURL=index.js.map
}}),

};

//# sourceMappingURL=c364d_%40requestnetwork_currency_dist_eadf40._.js.map