module.exports = {

"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-transferable-receivable.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encodePayErc20TransferableReceivableRequest = exports.prepareErc20TransferableReceivablePaymentTransaction = exports.payErc20TransferableReceivableRequest = exports.encodeMintErc20TransferableReceivableRequest = exports.prepareMintErc20TransferableReceivableTransaction = exports.mintErc20TransferableReceivable = exports.hasReceivableForRequest = exports.getReceivableTokenIdForRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
// The ERC20 receivable smart contract ABI fragment
const erc20TransferableReceivableContractAbiFragment = [
    'function receivableTokenIdMapping(bytes32) public view returns (uint256)'
];
/**
 * Gets the receivableTokenId from a ERC20TransferableReceivable contract given
 * a paymentReference and paymentAddress of the request
 * @param request
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 */ function getReceivableTokenIdForRequest(request, signerOrProvider) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        // Setup the ERC20 proxy contract interface
        const contract = new ethers_1.ethers.Contract((0, utils_1.getProxyAddress)(request, payment_detection_1.ERC20TransferableReceivablePaymentDetector.getDeploymentInformation), erc20TransferableReceivableContractAbiFragment, signerOrProvider);
        const { paymentReference, paymentAddress } = (0, utils_1.getRequestPaymentValues)(request);
        return yield contract.receivableTokenIdMapping(ethers_1.ethers.utils.solidityKeccak256([
            'address',
            'bytes'
        ], [
            paymentAddress,
            `0x${paymentReference}`
        ]));
    });
}
exports.getReceivableTokenIdForRequest = getReceivableTokenIdForRequest;
/**
 * Helper method to determine whether a request has a receivable minted yet
 *
 * @param request
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 */ function hasReceivableForRequest(request, signerOrProvider) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const receivableTokenId = yield getReceivableTokenIdForRequest(request, signerOrProvider);
        return !receivableTokenId.isZero();
    });
}
exports.hasReceivableForRequest = hasReceivableForRequest;
/**
 * Processes a transaction to mint an ERC20TransferableReceivable.
 * @param request
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function mintErc20TransferableReceivable(request, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const { data, to, value } = prepareMintErc20TransferableReceivableTransaction(request);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.mintErc20TransferableReceivable = mintErc20TransferableReceivable;
/**
 * Encodes the call to mint a request through an ERC20TransferableReceivable contract, can be used with a Multisig contract.
 * @param request request to pay
 */ function prepareMintErc20TransferableReceivableTransaction(request) {
    (0, utils_1.validateERC20TransferableReceivable)(request);
    return {
        data: encodeMintErc20TransferableReceivableRequest(request),
        to: (0, utils_1.getProxyAddress)(request, payment_detection_1.Erc20PaymentNetwork.ERC20TransferableReceivablePaymentDetector.getDeploymentInformation),
        value: 0
    };
}
exports.prepareMintErc20TransferableReceivableTransaction = prepareMintErc20TransferableReceivableTransaction;
/**
 * Encodes call to mint a request through an ERC20TransferableReceivable contract, can be used with a Multisig contract.
 * @param request request to pay
 */ function encodeMintErc20TransferableReceivableRequest(request) {
    (0, utils_1.validateERC20TransferableReceivable)(request);
    const tokenAddress = request.currencyInfo.value;
    const { paymentReference, paymentAddress } = (0, utils_1.getRequestPaymentValues)(request);
    const amount = (0, utils_1.getAmountToPay)(request);
    const receivableContract = types_1.ERC20TransferableReceivable__factory.createInterface();
    return receivableContract.encodeFunctionData('mint', [
        paymentAddress,
        `0x${paymentReference}`,
        amount,
        tokenAddress
    ]);
}
exports.encodeMintErc20TransferableReceivableRequest = encodeMintErc20TransferableReceivableRequest;
/**
 * Processes a transaction to pay an ERC20 receivable Request.
 * @param request
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmount optionally, the fee amount to pay. Defaults to the fee amount of the request.
 * @param overrides optionally, override default transaction values, like gas.
 */ function payErc20TransferableReceivableRequest(request, signerOrProvider = (0, utils_1.getProvider)(), amount, feeAmount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        yield (0, utils_1.validatePayERC20TransferableReceivable)(request, signerOrProvider, amount, feeAmount);
        const { data, to, value } = yield prepareErc20TransferableReceivablePaymentTransaction(request, signerOrProvider, amount, feeAmount);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.payErc20TransferableReceivableRequest = payErc20TransferableReceivableRequest;
/**
 * Encodes the call to pay a request through the ERC20 receivable contract, can be used with a Multisig contract.
 * @param request request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmountOverride optionally, the fee amount to pay. Defaults to the fee amount of the request.
 */ function prepareErc20TransferableReceivablePaymentTransaction(request, signerOrProvider, amount, feeAmountOverride) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        return {
            data: yield encodePayErc20TransferableReceivableRequest(request, signerOrProvider, amount, feeAmountOverride),
            to: (0, utils_1.getProxyAddress)(request, payment_detection_1.Erc20PaymentNetwork.ERC20TransferableReceivablePaymentDetector.getDeploymentInformation),
            value: 0
        };
    });
}
exports.prepareErc20TransferableReceivablePaymentTransaction = prepareErc20TransferableReceivablePaymentTransaction;
/**
 * Encodes the call to pay a request through the ERC20 receivable contract, can be used with a Multisig contract.
 * @param request request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmountOverride optionally, the fee amount to pay. Defaults to the fee amount of the request.
 */ function encodePayErc20TransferableReceivableRequest(request, signerOrProvider, amount, feeAmountOverride) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
        const { paymentReference, feeAddress, feeAmount } = (0, utils_1.getRequestPaymentValues)(request);
        const feeToPay = ethers_1.BigNumber.from(feeAmountOverride || feeAmount || 0);
        const receivableContract = types_1.ERC20TransferableReceivable__factory.createInterface();
        // get tokenId from request
        const receivableTokenId = yield getReceivableTokenIdForRequest(request, signerOrProvider);
        return receivableContract.encodeFunctionData('payOwner', [
            receivableTokenId,
            amountToPay,
            `0x${paymentReference}`,
            feeToPay,
            feeAddress || ethers_1.constants.AddressZero
        ]);
    });
}
exports.encodePayErc20TransferableReceivableRequest = encodePayErc20TransferableReceivableRequest; //# sourceMappingURL=erc20-transferable-receivable.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.revokeErc20Approval = exports.comparePnTypeAndVersion = exports.getAmountToPay = exports.validateERC20TransferableReceivable = exports.validatePayERC20TransferableReceivable = exports.validateConversionFeeProxyRequest = exports.validateErc20FeeProxyRequest = exports.validateRequest = exports.getProxyAddress = exports.getPnAndNetwork = exports.getProxyNetwork = exports.getPaymentExtensionVersion = exports.getRequestPaymentValues = exports.getSigner = exports.getNetworkProvider = exports.getProvider = exports.UnsupportedCurrencyNetwork = exports.MAX_ALLOWANCE = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const payment_detection_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const erc20_transferable_receivable_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-transferable-receivable.js [app-ssr] (ecmascript)");
/** @constant MAX_ALLOWANCE set to the max uint256 value */ exports.MAX_ALLOWANCE = ethers_1.BigNumber.from(2).pow(256).sub(1);
/**
 * Thrown when the library does not support a payment blockchain network.
 */ class UnsupportedCurrencyNetwork extends Error {
    constructor(networkName){
        super(`Currency network ${networkName} is not supported`);
        this.networkName = networkName;
    }
}
exports.UnsupportedCurrencyNetwork = UnsupportedCurrencyNetwork;
/**
 * Utility to get the default window.ethereum provider, or throws an error.
 */ function getProvider() {
    if (typeof window !== 'undefined' && 'ethereum' in window) {
        return new ethers_1.ethers.providers.Web3Provider(window.ethereum);
    }
    throw new Error('ethereum not found, you must pass your own web3 provider');
}
exports.getProvider = getProvider;
/**
 * Utility to get a network provider, depending on the request's currency network.
 * Will throw an error if the network isn't mainnet, rinkeby, or goerli
 */ function getNetworkProvider(request) {
    return (0, payment_detection_1.getDefaultProvider)(request.currencyInfo.network);
}
exports.getNetworkProvider = getNetworkProvider;
/**
 * Utility to return a signer from a provider.
 * @param signerOrProvider the provider, or signer. If Signer, it will simply be returned directly
 * @param address optionally, the address to retrieve the signer for.
 */ function getSigner(signerOrProvider, address) {
    if (!signerOrProvider) {
        signerOrProvider = getProvider();
    }
    if (ethers_1.Signer.isSigner(signerOrProvider)) {
        return signerOrProvider;
    }
    if (ethers_1.providers.Web3Provider.isProvider(signerOrProvider) && signerOrProvider.getSigner) {
        return signerOrProvider.getSigner(address);
    }
    throw new Error('cannot get signer');
}
exports.getSigner = getSigner;
/**
 * Utility to access payment-related information from a request.
 * All data is taken from the request's payment extension, except the network that may be retrieved from the request's currency if needed.
 */ function getRequestPaymentValues(request) {
    var _a;
    const extension = (0, payment_detection_2.getPaymentNetworkExtension)(request);
    if (!extension) {
        throw new Error('no payment network found');
    }
    return Object.assign(Object.assign({}, extension.values), {
        paymentReference: (0, payment_detection_1.getPaymentReference)(request),
        network: (_a = extension.values.network) !== null && _a !== void 0 ? _a : request.currencyInfo.network,
        version: extension.version
    });
}
exports.getRequestPaymentValues = getRequestPaymentValues;
function getPaymentExtensionVersion(request) {
    const extension = (0, payment_detection_2.getPaymentNetworkExtension)(request);
    if (!extension) {
        throw new Error('no payment network found');
    }
    return extension.version;
}
exports.getPaymentExtensionVersion = getPaymentExtensionVersion;
/**
 * @param pn It contains the payment network extension
 * @param currency It contains the currency information
 */ const getProxyNetwork = (pn, currency)=>{
    if (pn.values.network) {
        return pn.values.network;
    }
    if (currency.network) {
        return currency.network;
    }
    throw new Error('Payment currency must have a network');
};
exports.getProxyNetwork = getProxyNetwork;
/**
 * @param request The request to pay
 * @return An object that contains the payment network extension and the currency information
 */ function getPnAndNetwork(request) {
    const pn = (0, payment_detection_2.getPaymentNetworkExtension)(request);
    if (!pn) {
        throw new Error('PaymentNetwork not found');
    }
    return {
        paymentNetwork: pn,
        network: (0, exports.getProxyNetwork)(pn, request.currencyInfo)
    };
}
exports.getPnAndNetwork = getPnAndNetwork;
/**
 * @param request The request to pay
 * @param getDeploymentInformation The function to get the proxy address
 * @param version The version has to be set to get batch conversion proxy
 */ const getProxyAddress = (request, getDeploymentInformation, version)=>{
    const { paymentNetwork, network } = getPnAndNetwork(request);
    currency_1.EvmChains.assertChainSupported(network);
    const deploymentInfo = getDeploymentInformation(network, version || paymentNetwork.version);
    if (!deploymentInfo) {
        throw new Error(`No deployment found for network ${network}, version ${version || paymentNetwork.version}`);
    }
    return deploymentInfo.address;
};
exports.getProxyAddress = getProxyAddress;
const { ERC777_STREAM, ERC20_PROXY_CONTRACT, ETH_INPUT_DATA, ETH_FEE_PROXY_CONTRACT, ERC20_FEE_PROXY_CONTRACT, ANY_TO_ERC20_PROXY, NATIVE_TOKEN, ERC20_TRANSFERABLE_RECEIVABLE } = types_1.ExtensionTypes.PAYMENT_NETWORK_ID;
const currenciesMap = {
    [ERC777_STREAM]: types_1.RequestLogicTypes.CURRENCY.ERC777,
    [ERC20_PROXY_CONTRACT]: types_1.RequestLogicTypes.CURRENCY.ERC20,
    [ERC20_FEE_PROXY_CONTRACT]: types_1.RequestLogicTypes.CURRENCY.ERC20,
    [ETH_INPUT_DATA]: types_1.RequestLogicTypes.CURRENCY.ETH,
    [ETH_FEE_PROXY_CONTRACT]: types_1.RequestLogicTypes.CURRENCY.ETH,
    [NATIVE_TOKEN]: types_1.RequestLogicTypes.CURRENCY.ETH,
    [ERC20_TRANSFERABLE_RECEIVABLE]: types_1.RequestLogicTypes.CURRENCY.ERC20
};
/**
 * Utility to validate a request currency and payment details against a paymentNetwork.
 */ function validateRequest(request, paymentNetworkId) {
    var _a, _b;
    const { feeAmount, feeAddress, expectedFlowRate, expectedStartDate } = getRequestPaymentValues(request);
    let extension = request.extensions[paymentNetworkId];
    // FIXME: updating the extension: not needed anymore when ETH_INPUT_DATA gets deprecated
    if (paymentNetworkId === types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT && !extension) {
        extension = request.extensions[types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA];
    }
    // Compatibility of the request currency type with the payment network
    const expectedCurrencyType = currenciesMap[paymentNetworkId];
    const validCurrencyType = [
        types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY,
        types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_NATIVE_TOKEN,
        types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY
    ].includes(paymentNetworkId) ? true : expectedCurrencyType && request.currencyInfo.type === expectedCurrencyType && request.currencyInfo.network;
    // ERC20 based payment networks are only valid if the request currency has a value
    const validCurrencyValue = ![
        ERC20_PROXY_CONTRACT,
        ERC20_FEE_PROXY_CONTRACT,
        ERC777_STREAM,
        ERC20_TRANSFERABLE_RECEIVABLE
    ].includes(paymentNetworkId) || request.currencyInfo.value;
    // Payment network with fees should have both or none of fee address and fee amount
    const validFeeParams = paymentNetworkId !== ANY_TO_ERC20_PROXY && paymentNetworkId !== ERC20_FEE_PROXY_CONTRACT || !!feeAddress === !!feeAmount;
    if (!validFeeParams) {
        throw new Error('Both fee address and fee amount have to be declared, or both left empty');
    }
    // Payment network with stream should have both or none of stream flow rate and stream start date
    const validStreamParams = paymentNetworkId !== ERC777_STREAM || !!expectedFlowRate && !!expectedStartDate;
    if (!validStreamParams) {
        throw new Error('Both stream flow rate and stream start date have to be declared, or both left empty');
    }
    if (!validCurrencyType || !validCurrencyValue || !((_a = extension === null || extension === void 0 ? void 0 : extension.values) === null || _a === void 0 ? void 0 : _a.salt) || !((_b = extension === null || extension === void 0 ? void 0 : extension.values) === null || _b === void 0 ? void 0 : _b.paymentAddress)) {
        throw new Error(`request cannot be processed, or is not an ${paymentNetworkId} request`);
    }
}
exports.validateRequest = validateRequest;
/**
 * Validates the amount and fee parameters for an ERC20 Fee Proxy based request.
 * @param request to validate
 * @param amount optionally, the custom amount to pay
 * @param feeAmountOverride optionally, the custom fee amount
 * @param paymentNetwork defaults to ERC20 Fee Proxy contract
 */ function validateErc20FeeProxyRequest(request, amount, feeAmountOverride, paymentNetwork = types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT) {
    validateRequest(request, paymentNetwork);
    const { feeAmount } = getRequestPaymentValues(request);
    const amountToPay = getAmountToPay(request, amount);
    const feeToPay = ethers_1.BigNumber.from(feeAmountOverride || feeAmount || 0);
    if (amountToPay.isZero() && feeToPay.isZero()) {
        throw new Error('Request payment amount and fee are 0');
    }
}
exports.validateErc20FeeProxyRequest = validateErc20FeeProxyRequest;
/**
 * Validates the parameters for an ERC20 Fee Proxy payment.
 * @param request to validate
 * @param tokenAddress token address to pay with
 * @param amount optionally, the custom amount to pay
 * @param feeAmountOverride optionally, the custom fee amount
 */ function validateConversionFeeProxyRequest(request, path, amount, feeAmountOverride) {
    validateErc20FeeProxyRequest(request, amount, feeAmountOverride, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY);
    const { acceptedTokens } = getRequestPaymentValues(request);
    const requestCurrencyHash = path[0];
    if (requestCurrencyHash.toLowerCase() !== (0, currency_1.getCurrencyHash)(request.currencyInfo).toLowerCase()) {
        throw new Error(`The first entry of the path does not match the request currency`);
    }
    const tokenAddress = path[path.length - 1];
    if (acceptedTokens && !(acceptedTokens === null || acceptedTokens === void 0 ? void 0 : acceptedTokens.map((t)=>t.toLowerCase()).includes(tokenAddress.toLowerCase()))) {
        throw new Error(`The token ${tokenAddress} is not accepted to pay this request`);
    }
}
exports.validateConversionFeeProxyRequest = validateConversionFeeProxyRequest;
/**
 * Validates the parameters for an ERC20 Transferable Receivable payment, esp. that token exists
 * @param request to validate
 * @param amount optionally, the custom amount to pay
 * @param feeAmountOverride optionally, the custom fee amount
 * @param signerOrProvider
 */ function validatePayERC20TransferableReceivable(request, signerOrProvider, amount, feeAmountOverride) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const receivableTokenId = yield (0, erc20_transferable_receivable_1.getReceivableTokenIdForRequest)(request, signerOrProvider);
        if (receivableTokenId.isZero()) {
            throw new Error('The receivable for this request has not been minted yet. Please check with the payee.');
        }
        validateERC20TransferableReceivable(request, amount, feeAmountOverride);
    });
}
exports.validatePayERC20TransferableReceivable = validatePayERC20TransferableReceivable;
/**
 * Validates the parameters for an ERC20 Transferable Receivable Payment or Mint.
 * @param request to validate
 * @param amount optionally, the custom amount to pay
 * @param feeAmountOverride optionally, the custom fee amount
 */ function validateERC20TransferableReceivable(request, amount, feeAmountOverride) {
    validateErc20FeeProxyRequest(request, amount, feeAmountOverride, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE);
    // Validate that there exists a payee
    if (request.payee == null) {
        throw new Error(`Expected a payee for this request`);
    }
}
exports.validateERC20TransferableReceivable = validateERC20TransferableReceivable;
/**
 * It returns the amount left to pay in the request, unless an amount is specified.
 *
 * @param request the request to pay.
 * @param amount optionally override the returned amount to pay, in request currency.
 * @returns the amount to pay, in request currency.
 */ function getAmountToPay(request, amount) {
    var _a;
    const amountToPay = amount ? ethers_1.BigNumber.from(amount) : ethers_1.BigNumber.from(request.expectedAmount).sub(((_a = request.balance) === null || _a === void 0 ? void 0 : _a.balance) || 0);
    if (amountToPay.lt(0)) {
        throw new Error('cannot pay a negative amount');
    }
    if (amountToPay.isZero()) {
        throw new Error('cannot pay a null amount');
    }
    return amountToPay;
}
exports.getAmountToPay = getAmountToPay;
/**
 * Compare 2 payment networks type and version in request's extension
 * and throw an exception if they are different
 * @param pn The payment network extension
 * @param request The request to pay
 */ function comparePnTypeAndVersion(pn, request) {
    const extension = (0, payment_detection_2.getPaymentNetworkExtension)(request);
    if (!extension) {
        throw new Error('no payment network found');
    }
    if (!((pn === null || pn === void 0 ? void 0 : pn.type) === extension.type && (pn === null || pn === void 0 ? void 0 : pn.version) === extension.version)) {
        throw new Error(`Every payment network type and version must be identical`);
    }
}
exports.comparePnTypeAndVersion = comparePnTypeAndVersion;
/**
 * Revoke ERC20 approval of a token for a given `spenderAddress`
 */ function revokeErc20Approval(spenderAddress, paymentTokenAddress, signerOrProvider = getProvider()) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const erc20interface = types_2.ERC20__factory.connect(paymentTokenAddress, signerOrProvider).interface;
        const encodedTx = erc20interface.encodeFunctionData('approve', [
            spenderAddress,
            ethers_1.BigNumber.from(0)
        ]);
        const preparedTx = {
            data: encodedTx,
            to: paymentTokenAddress,
            value: 0
        };
        const signer = getSigner(signerOrProvider);
        const tx = yield signer.sendTransaction(preparedTx);
        return tx;
    });
}
exports.revokeErc20Approval = revokeErc20Approval; //# sourceMappingURL=utils.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/btc-address-based.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getBtcPaymentUrl = void 0;
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
/**
 * Returns the BIP21 payment URL based on the Request's value
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 */ function getBtcPaymentUrl(request, amount) {
    const pn = (0, payment_detection_1.getPaymentNetworkExtension)(request);
    const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
    return `bitcoin:${pn === null || pn === void 0 ? void 0 : pn.values.paymentAddress}?amount=${ethers_1.ethers.utils.formatUnits(amountToPay, 8)}`;
}
exports.getBtcPaymentUrl = getBtcPaymentUrl; //# sourceMappingURL=btc-address-based.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-fee-proxy.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.prepareErc20FeeProxyPaymentTransaction = exports._getErc20FeeProxyPaymentUrl = exports.encodePayErc20FeeRequest = exports.payErc20FeeProxyRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
/**
 * Processes a transaction to pay an ERC20 Request with fees.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmount optionally, the fee amount to pay. Defaults to the fee amount.
 * @param overrides optionally, override default transaction values, like gas.
 */ function payErc20FeeProxyRequest(request, signerOrProvider = (0, utils_1.getProvider)(), amount, feeAmount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const { data, to, value } = prepareErc20FeeProxyPaymentTransaction(request, amount, feeAmount);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.payErc20FeeProxyRequest = payErc20FeeProxyRequest;
/**
 * Encodes the call to pay a request through the ERC20 fee proxy contract, can be used with a Multisig contract.
 * @param request request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmountOverride optionally, the fee amount to pay. Defaults to the fee amount of the request.
 */ function encodePayErc20FeeRequest(request, amount, feeAmountOverride) {
    (0, utils_1.validateErc20FeeProxyRequest)(request, amount, feeAmountOverride);
    const tokenAddress = request.currencyInfo.value;
    const { paymentReference, paymentAddress, feeAddress, feeAmount } = (0, utils_1.getRequestPaymentValues)(request);
    const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
    const feeToPay = ethers_1.BigNumber.from(feeAmountOverride || feeAmount || 0);
    const proxyContract = types_1.ERC20FeeProxy__factory.createInterface();
    return proxyContract.encodeFunctionData('transferFromWithReferenceAndFee', [
        tokenAddress,
        paymentAddress,
        amountToPay,
        `0x${paymentReference}`,
        feeToPay,
        feeAddress || ethers_1.constants.AddressZero
    ]);
}
exports.encodePayErc20FeeRequest = encodePayErc20FeeRequest;
/**
 * Return the EIP-681 format URL with the transaction to pay an ERC20
 * Warning: this EIP isn't widely used, be sure to test compatibility yourself.
 *
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmountOverride optionally, the fee amount to pay. Defaults to the fee amount of the request.
 */ function _getErc20FeeProxyPaymentUrl(request, amount, feeAmountOverride) {
    (0, utils_1.validateRequest)(request, types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT);
    const { paymentReference, paymentAddress, feeAddress, feeAmount, version, network } = (0, utils_1.getRequestPaymentValues)(request);
    currency_1.EvmChains.assertChainSupported(network);
    const contractAddress = smart_contracts_1.erc20FeeProxyArtifact.getAddress(network, version);
    const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
    const feeToPay = feeAmountOverride || ethers_1.BigNumber.from(feeAmount || 0);
    const parameters = `transferFromWithReferenceAndFee?address=${request.currencyInfo.value}&address=${paymentAddress}&uint256=${amountToPay}&bytes=${paymentReference}&uint256=${feeToPay}&address=${feeAddress}`;
    return `ethereum:${contractAddress}/${parameters}`;
}
exports._getErc20FeeProxyPaymentUrl = _getErc20FeeProxyPaymentUrl;
/**
 * Prepare the transaction to pay a request through the ERC20 fee proxy contract, can be used with a Multisig contract.
 * @param request request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmountOverride optionally, the fee amount to pay. Defaults to the fee amount of the request.
 */ function prepareErc20FeeProxyPaymentTransaction(request, amount, feeAmountOverride) {
    (0, utils_1.validateErc20FeeProxyRequest)(request, amount, feeAmountOverride);
    const { network } = request.currencyInfo;
    currency_1.EvmChains.assertChainSupported(network);
    const encodedTx = encodePayErc20FeeRequest(request, amount, feeAmountOverride);
    const pn = (0, payment_detection_1.getPaymentNetworkExtension)(request);
    const proxyAddress = smart_contracts_1.erc20FeeProxyArtifact.getAddress(network, pn === null || pn === void 0 ? void 0 : pn.version);
    return {
        data: encodedTx,
        to: proxyAddress,
        value: 0
    };
}
exports.prepareErc20FeeProxyPaymentTransaction = prepareErc20FeeProxyPaymentTransaction; //# sourceMappingURL=erc20-fee-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-erc20-fee-proxy.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encodeSwapToPayErc20FeeRequest = exports.prepareSwapToPayErc20FeeRequest = exports.swapErc20FeeProxyRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
/**
 * Processes a transaction to swap tokens and pay an ERC20 Request through a proxy with fees.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param swapSettings settings for the swap: swap path, max amount to swap, deadline
 * @param options to override amount, feeAmount and transaction parameters
 */ function swapErc20FeeProxyRequest(request, signerOrProvider = (0, utils_1.getProvider)(), swapSettings, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const preparedTx = prepareSwapToPayErc20FeeRequest(request, signerOrProvider, swapSettings, options);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(preparedTx);
        return tx;
    });
}
exports.swapErc20FeeProxyRequest = swapErc20FeeProxyRequest;
/**
 * Prepare a transaction to swap tokens and pay an ERC20 Request through a proxy with fees.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param swapSettings settings for the swap: swap path, max amount to swap, deadline
 * @param options to override amount, feeAmount and transaction parameters
 */ function prepareSwapToPayErc20FeeRequest(request, signerOrProvider = (0, utils_1.getProvider)(), swapSettings, options) {
    const { network } = request.currencyInfo;
    currency_1.EvmChains.assertChainSupported(network);
    const encodedTx = encodeSwapToPayErc20FeeRequest(request, signerOrProvider, swapSettings, options);
    const proxyAddress = smart_contracts_1.erc20SwapToPayArtifact.getAddress(network);
    return Object.assign({
        data: encodedTx,
        to: proxyAddress,
        value: 0
    }, options === null || options === void 0 ? void 0 : options.overrides);
}
exports.prepareSwapToPayErc20FeeRequest = prepareSwapToPayErc20FeeRequest;
/**
 * Encodes the call to pay a request through the ERC20 fee proxy contract, can be used with a Multisig contract.
 * @param request request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum
 * @param swapSettings settings for the swap
 * @param options to override amount, feeAmount and transaction parameters
 */ function encodeSwapToPayErc20FeeRequest(request, signerOrProvider = (0, utils_1.getProvider)(), swapSettings, options) {
    const { paymentReference, paymentAddress, feeAddress, feeAmount, network } = (0, utils_1.getRequestPaymentValues)(request);
    currency_1.EvmChains.assertChainSupported(network);
    (0, utils_1.validateErc20FeeProxyRequest)(request, options === null || options === void 0 ? void 0 : options.amount, options === null || options === void 0 ? void 0 : options.feeAmount);
    const signer = (0, utils_1.getSigner)(signerOrProvider);
    const tokenAddress = request.currencyInfo.value;
    const amountToPay = (0, utils_1.getAmountToPay)(request, options === null || options === void 0 ? void 0 : options.amount);
    const feeToPay = ethers_1.BigNumber.from((options === null || options === void 0 ? void 0 : options.feeAmount) || feeAmount || 0);
    if (swapSettings.path[swapSettings.path.length - 1].toLowerCase() !== tokenAddress.toLowerCase()) {
        throw new Error('Last item of the path should be the request currency');
    }
    // eslint-disable-next-line no-magic-numbers
    if (Date.now() > swapSettings.deadline * 1000) {
        throw new Error('A swap with a past deadline will fail, the transaction will not be pushed');
    }
    if (!request.currencyInfo.network) {
        throw new Error('Request currency network is missing');
    }
    const feeProxyAddress = (0, utils_1.getProxyAddress)(request, payment_detection_1.Erc20PaymentNetwork.ERC20FeeProxyPaymentDetector.getDeploymentInformation);
    const swapToPayAddress = smart_contracts_1.erc20FeeProxyArtifact.getAddress(network);
    const swapToPayContract = types_1.ERC20SwapToPay__factory.connect(swapToPayAddress, signer);
    return swapToPayContract.interface.encodeFunctionData('swapTransferWithReference', [
        feeProxyAddress,
        paymentAddress,
        amountToPay,
        swapSettings.maxInputAmount,
        swapSettings.path,
        `0x${paymentReference}`,
        feeToPay,
        feeAddress || ethers_1.constants.AddressZero,
        // eslint-disable-next-line no-magic-numbers
        Math.round(swapSettings.deadline / 1000)
    ]);
}
exports.encodeSwapToPayErc20FeeRequest = encodeSwapToPayErc20FeeRequest; //# sourceMappingURL=swap-erc20-fee-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-proxy.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.prepareErc20ProxyPaymentTransaction = exports._getErc20ProxyPaymentUrl = exports.encodePayErc20Request = exports.payErc20ProxyRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
/**
 * Processes a transaction to pay an ERC20 Request.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param overrides optionally, override default transaction values, like gas.
 */ function payErc20ProxyRequest(request, signerOrProvider = (0, utils_1.getProvider)(), amount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const { data, to, value } = prepareErc20ProxyPaymentTransaction(request, amount);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.payErc20ProxyRequest = payErc20ProxyRequest;
/**
 * Encodes the call to pay a request through the ERC20 proxy contract, can be used with a Multisig contract.
 * @param request request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 */ function encodePayErc20Request(request, amount) {
    (0, utils_1.validateRequest)(request, types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT);
    const tokenAddress = request.currencyInfo.value;
    const { paymentReference, paymentAddress } = (0, utils_1.getRequestPaymentValues)(request);
    const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
    const proxyContract = types_1.ERC20Proxy__factory.createInterface();
    return proxyContract.encodeFunctionData('transferFromWithReference', [
        tokenAddress,
        paymentAddress,
        amountToPay,
        `0x${paymentReference}`
    ]);
}
exports.encodePayErc20Request = encodePayErc20Request;
/**
 * Return the EIP-681 format URL with the transaction to pay an ERC20
 * Warning: this EIP isn't widely used, be sure to test compatibility yourself.
 *
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 */ function _getErc20ProxyPaymentUrl(request, amount) {
    (0, utils_1.validateRequest)(request, types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT);
    const { paymentAddress, paymentReference } = (0, utils_1.getRequestPaymentValues)(request);
    const contractAddress = (0, utils_1.getProxyAddress)(request, payment_detection_1.Erc20PaymentNetwork.ERC20ProxyPaymentDetector.getDeploymentInformation);
    const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
    const parameters = `transferFromWithReference?address=${request.currencyInfo.value}&address=${paymentAddress}&uint256=${amountToPay}&bytes=${paymentReference}`;
    return `ethereum:${contractAddress}/${parameters}`;
}
exports._getErc20ProxyPaymentUrl = _getErc20ProxyPaymentUrl;
/**
 * Encodes the call to pay a request through the ERC20 proxy contract, can be used with a Multisig contract.
 * @param request request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 */ function prepareErc20ProxyPaymentTransaction(request, amount) {
    (0, utils_1.validateRequest)(request, types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT);
    return {
        data: encodePayErc20Request(request, amount),
        to: (0, utils_1.getProxyAddress)(request, payment_detection_1.Erc20PaymentNetwork.ERC20ProxyPaymentDetector.getDeploymentInformation),
        value: 0
    };
}
exports.prepareErc20ProxyPaymentTransaction = prepareErc20ProxyPaymentTransaction; //# sourceMappingURL=erc20-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._getErc20PaymentUrl = exports.getAnyErc20Balance = exports.getErc20Balance = exports.encodeApproveAnyErc20 = exports.encodeApproveErc20 = exports.prepareApproveErc20 = exports.approveErc20 = exports.approveErc20IfNeeded = exports.checkErc20Allowance = exports.getErc20Allowance = exports.hasErc20Approval = exports.payErc20Request = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const erc20_fee_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-fee-proxy.js [app-ssr] (ecmascript)");
const swap_erc20_fee_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-erc20-fee-proxy.js [app-ssr] (ecmascript)");
const erc20_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-proxy.js [app-ssr] (ecmascript)");
const erc20_transferable_receivable_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-transferable-receivable.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
/**
 * Processes a transaction to pay an ERC20 Request.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmount optionally, the fee amount to pay. Only applicable to ERC20 Fee Payment network. Defaults to the fee amount.
 * @param overrides optionally, override default transaction values, like gas.
 * @param swapSettings optionally, the settings to swap a maximum amount of currency, through a swap path, before a deadline, to pay
 */ function payErc20Request(request, signerOrProvider, amount, feeAmount, overrides, swapSettings) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const id = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
        if (swapSettings && id !== types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT) {
            throw new Error(`ExtensionType: ${id} is not supported by swapToPay contract`);
        }
        if (id === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT) {
            return (0, erc20_proxy_1.payErc20ProxyRequest)(request, signerOrProvider, amount, overrides);
        }
        if (id === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE) {
            return (0, erc20_transferable_receivable_1.payErc20TransferableReceivableRequest)(request, signerOrProvider, amount, feeAmount, overrides);
        }
        if (id === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT) {
            if (swapSettings) {
                return (0, swap_erc20_fee_proxy_1.swapErc20FeeProxyRequest)(request, signerOrProvider, swapSettings, {
                    amount,
                    feeAmount,
                    overrides
                });
            } else {
                return (0, erc20_fee_proxy_1.payErc20FeeProxyRequest)(request, signerOrProvider, amount, feeAmount, overrides);
            }
        }
        throw new Error('Not a supported ERC20 proxy payment network request');
    });
}
exports.payErc20Request = payErc20Request;
/**
 * Checks if the proxy has the necessary allowance from a given account to pay a given request with ERC20
 * @param request request to pay
 * @param account account that will be used to pay the request
 * @param provider the web3 provider. Defaults to Etherscan.
 */ function hasErc20Approval(request, account, signerOrProvider = (0, utils_1.getNetworkProvider)(request)) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        return checkErc20Allowance(account, getProxyAddress(request), signerOrProvider, request.currencyInfo.value, request.expectedAmount);
    });
}
exports.hasErc20Approval = hasErc20Approval;
/**
 * Retrieves the allowance given by an ERC20 token owner to a spender.
 * @param ownerAddress address of the owner
 * @param spenderAddress address of the spender
 * @param signerOprovider the web3 provider
 * @param tokenAddress Address of the ERC20 token
 */ function getErc20Allowance(ownerAddress, spenderAddress, signerOrProvider, tokenAddress) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const erc20Contract = types_1.ERC20__factory.connect(tokenAddress, signerOrProvider);
        return yield erc20Contract.allowance(ownerAddress, spenderAddress);
    });
}
exports.getErc20Allowance = getErc20Allowance;
/**
 * Checks if a spender has enough allowance from an ERC20 token owner to pay an amount.
 * @param ownerAddress address of the owner
 * @param spenderAddress address of the spender
 * @param signerOrProvider the web3 provider.
 * @param tokenAddress Address of the ERC20 currency
 * @param amount The amount to check the allowance for
 */ function checkErc20Allowance(ownerAddress, spenderAddress, signerOrProvider, tokenAddress, amount) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const allowance = yield getErc20Allowance(ownerAddress, spenderAddress, signerOrProvider, tokenAddress);
        return allowance.gte(amount);
    });
}
exports.checkErc20Allowance = checkErc20Allowance;
/**
 * Processes the approval transaction of the targeted ERC20.
 * @param request request to pay
 * @param provider the web3 provider. Defaults to Etherscan.
 * @param overrides optionally, override default transaction values, like gas.
 */ function approveErc20IfNeeded(request, account, signerOrProvider = (0, utils_1.getNetworkProvider)(request), overrides, amount = utils_1.MAX_ALLOWANCE) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!(yield hasErc20Approval(request, account, signerOrProvider))) {
            return approveErc20(request, (0, utils_1.getSigner)(signerOrProvider), overrides, amount);
        }
    });
}
exports.approveErc20IfNeeded = approveErc20IfNeeded;
/**
 * Processes the transaction to approve the proxy to spend signer's tokens to pay
 * the request in its payment currency. Can be used with a Multisig contract.
 * @param request request to pay
 * @param provider the web3 provider. Defaults to Etherscan.
 * @param overrides optionally, override default transaction values, like gas.
 */ function approveErc20(request, signerOrProvider = (0, utils_1.getProvider)(), overrides, amount = utils_1.MAX_ALLOWANCE) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const preparedTx = prepareApproveErc20(request, signerOrProvider, overrides, amount);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(preparedTx);
        return tx;
    });
}
exports.approveErc20 = approveErc20;
/**
 * Prepare the transaction to approve the proxy to spend signer's tokens to pay
 * the request in its payment currency. Can be used with a Multisig contract.
 * @param request request to pay
 * @param provider the web3 provider. Defaults to Etherscan.
 * @param overrides optionally, override default transaction values, like gas.
 */ function prepareApproveErc20(request, signerOrProvider = (0, utils_1.getProvider)(), overrides, amount = utils_1.MAX_ALLOWANCE) {
    const encodedTx = encodeApproveErc20(request, signerOrProvider, amount);
    const tokenAddress = request.currencyInfo.value;
    return Object.assign({
        data: encodedTx,
        to: tokenAddress,
        value: 0
    }, overrides);
}
exports.prepareApproveErc20 = prepareApproveErc20;
/**
 * Encodes the transaction to approve the proxy to spend signer's tokens to pay
 * the request in its payment currency. Can be used with a Multisig contract.
 * @param request the request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 */ function encodeApproveErc20(request, signerOrProvider = (0, utils_1.getProvider)(), amount = utils_1.MAX_ALLOWANCE) {
    var _a;
    const paymentNetworkId = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
    if (!paymentNetworkId) {
        throw new Error('No payment network Id');
    }
    (0, utils_1.validateRequest)(request, paymentNetworkId);
    return encodeApproveAnyErc20(request.currencyInfo.value, getProxyAddress(request), (0, utils_1.getSigner)(signerOrProvider), amount);
}
exports.encodeApproveErc20 = encodeApproveErc20;
/**
 * Encodes the approval call to approve any erc20 token to be spent, with no limit.
 * @param tokenAddress the ERC20 token address to approve
 * @param spenderAddress the address granted the approval
 * @param signerOrProvider the signer who owns ERC20 tokens
 * @param amount default to max allowance
 */ function encodeApproveAnyErc20(tokenAddress, spenderAddress, signerOrProvider = (0, utils_1.getProvider)(), amount = utils_1.MAX_ALLOWANCE) {
    if (amount.gt(utils_1.MAX_ALLOWANCE)) {
        throw new Error('Invalid amount');
    }
    const erc20interface = types_1.ERC20__factory.connect(tokenAddress, signerOrProvider).interface;
    return erc20interface.encodeFunctionData('approve', [
        spenderAddress,
        amount
    ]);
}
exports.encodeApproveAnyErc20 = encodeApproveAnyErc20;
/**
 * Gets ERC20 balance of an address, based on the request currency information
 * @param request the request that contains currency information
 * @param address the address to check
 * @param provider the web3 provider. Defaults to Etherscan
 */ function getErc20Balance(request, address, provider = (0, utils_1.getNetworkProvider)(request)) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        return getAnyErc20Balance(request.currencyInfo.value, address, provider);
    });
}
exports.getErc20Balance = getErc20Balance;
/**
 * Gets any ERC20 balance of an address
 * @param anyErc20Address the currency address
 * @param address the address to check
 * @param provider the web3 provider. Defaults to Etherscan
 */ function getAnyErc20Balance(anyErc20Address, address, provider) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const erc20Contract = types_1.ERC20__factory.connect(anyErc20Address, provider);
        return erc20Contract.balanceOf(address);
    });
}
exports.getAnyErc20Balance = getAnyErc20Balance;
/**
 * Return the EIP-681 format URL with the transaction to pay an ERC20
 * Warning: this EIP isn't widely used, be sure to test compatibility yourself.
 *
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 */ function _getErc20PaymentUrl(request, amount) {
    var _a;
    const id = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
    if (id === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT) {
        return (0, erc20_proxy_1._getErc20ProxyPaymentUrl)(request, amount);
    }
    if (id === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT) {
        return (0, erc20_fee_proxy_1._getErc20FeeProxyPaymentUrl)(request, amount);
    }
    throw new Error('Not a supported ERC20 proxy payment network request');
}
exports._getErc20PaymentUrl = _getErc20PaymentUrl;
/**
 * Get the request payment network proxy address
 * @returns the payment network proxy address
 */ function getProxyAddress(request) {
    const pn = (0, payment_detection_1.getPaymentNetworkExtension)(request);
    const id = pn === null || pn === void 0 ? void 0 : pn.id;
    if (id === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_ADDRESS_BASED) {
        throw new Error(`ERC20 address based payment network doesn't need approval`);
    }
    if (id === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT) {
        return (0, utils_1.getProxyAddress)(request, payment_detection_1.Erc20PaymentNetwork.ERC20ProxyPaymentDetector.getDeploymentInformation);
    }
    if (id === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT) {
        return (0, utils_1.getProxyAddress)(request, payment_detection_1.Erc20PaymentNetwork.ERC20FeeProxyPaymentDetector.getDeploymentInformation);
    }
    if (id === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE) {
        return (0, utils_1.getProxyAddress)(request, payment_detection_1.Erc20PaymentNetwork.ERC20TransferableReceivablePaymentDetector.getDeploymentInformation);
    }
    throw new Error(`Unsupported payment network: ${id}`);
} //# sourceMappingURL=erc20.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc777-stream.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeErc777OneOffPayment = exports.prepareErc777OneOffPayment = exports.encodeErc777OneOffPayment = exports.getErc777BalanceAt = exports.prepareErc777StreamPaymentTransaction = exports.encodePayErc777StreamRequest = exports.getSuperFluidFramework = exports.closeErc777StreamRequest = exports.prepareCloseStreamTransaction = exports.encodeCloseStreamRequest = exports.payErc777StreamRequest = exports.USERDATA_PREFIX = exports.RESOLVER_ADDRESS = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const sdk_core_1 = __turbopack_require__("[project]/node_modules/.pnpm/@superfluid-finance+sdk-core@0.5.0_ethers@5.7.2_graphql@16.8.1_typescript@5.6.3/node_modules/@superfluid-finance/sdk-core/dist/module/index.js [app-ssr] (ecmascript)");
const erc777Artefact = __turbopack_require__("[project]/node_modules/.pnpm/@openzeppelin+contracts@4.9.6/node_modules/@openzeppelin/contracts/build/contracts/IERC777.json (json)");
exports.RESOLVER_ADDRESS = '0x913bbCFea2f347a24cfCA441d483E7CBAc8De3Db';
// Superfluid payments of requests use the generic field `userData` to index payments.
// Since it's a multi-purpose field, payments will use a fix-prefix heading the payment reference,
// in order to speed up the indexing and payment detection.
exports.USERDATA_PREFIX = '0xbeefac';
/**
 * Processes a transaction to pay an ERC777 stream Request.
 * @param request the request to pay
 * @param signer the Web3 signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function payErc777StreamRequest(request, signer, overrides) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const { data, to, value } = yield prepareErc777StreamPaymentTransaction(request, (_a = signer.provider) !== null && _a !== void 0 ? _a : (0, utils_1.getProvider)());
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.payErc777StreamRequest = payErc777StreamRequest;
/**
 * Get from SuperFluid framework the operation to stop paying a request.
 * @param sender the address who created the stream
 * @param sf the SuperFluid framework to use
 * @param request the request to pay
 * @param overrides optionally, override default transaction values, like gas.
 */ function getStopStreamOp(sender, sf, request, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const superToken = yield sf.loadSuperToken(request.currencyInfo.value);
        const { paymentReference, paymentAddress } = (0, utils_1.getRequestPaymentValues)(request);
        return sf.cfaV1.deleteFlow({
            superToken: superToken.address,
            sender,
            receiver: paymentAddress,
            userData: `${exports.USERDATA_PREFIX}${paymentReference}`,
            overrides: overrides
        });
    });
}
/**
 * Encodes the call to close a SuperFluid stream.
 * @param request the request to pay
 * @param sf the SuperFluid framework to use
 */ function encodeCloseStreamRequest(sender, request, sf) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const closeStreamOp = yield getStopStreamOp(sender, sf, request);
        // FIXME: according to specs PR https://github.com/RequestNetwork/requestNetwork/pull/688
        // in file packages/advanced-logic/specs/payment-network-erc777-stream-0.1.0.md
        // Below are the SF actions to add in the BatchCall :
        // - use expectedEndDate to compute offset between stop of invoicing and stop of streaming
        // - stop fee streaming
        const batchCall = sf.batchCall([
            closeStreamOp
        ]);
        const operationStructArray = yield Promise.all(batchCall.getOperationStructArrayPromises);
        return batchCall.host.contract.interface.encodeFunctionData('batchCall', [
            operationStructArray
        ]);
    });
}
exports.encodeCloseStreamRequest = encodeCloseStreamRequest;
/**
 * Prepare the transaction to close a SuperFluid stream.
 * @param request the request to pay
 * @param provider the Web3 provider. Defaults to window.ethereum.
 */ function prepareCloseStreamTransaction(sender, request, provider) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const id = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
        if (id !== types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM) {
            throw new Error('Not a supported ERC777 payment network request');
        }
        (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM);
        const sf = yield getSuperFluidFramework(request, provider);
        const encodedTx = yield encodeCloseStreamRequest(sender, request, sf);
        return {
            data: encodedTx,
            to: sf.host.contract.address,
            value: 0
        };
    });
}
exports.prepareCloseStreamTransaction = prepareCloseStreamTransaction;
/**
 * Processes a transaction to close an ERC777 stream paying a Request.
 * @param request the request to pay
 * @param signer the Web3 signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function closeErc777StreamRequest(request, signer, overrides) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const { data, to, value } = yield prepareCloseStreamTransaction((yield signer.getAddress()), request, (_a = signer.provider) !== null && _a !== void 0 ? _a : (0, utils_1.getProvider)());
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.closeErc777StreamRequest = closeErc777StreamRequest;
/**
 * Get the superfluid framework based on a request
 * @param request the request to pay
 * @param provider the Web3 provider. Defaults to window.ethereum.
 */ function getSuperFluidFramework(request, provider) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const isNetworkPrivate = request.currencyInfo.network === 'private';
        const chainId = (yield provider.getNetwork()).chainId;
        return yield sdk_core_1.Framework.create({
            chainId,
            provider: provider,
            resolverAddress: isNetworkPrivate ? exports.RESOLVER_ADDRESS : undefined,
            protocolReleaseVersion: isNetworkPrivate ? 'test' : undefined
        });
    });
}
exports.getSuperFluidFramework = getSuperFluidFramework;
/**
 * Get from SuperFluid framework the operation to start paying a request.
 * @param sf the SuperFluid framework to use
 * @param request the request to pay
 */ function getStartStreamOp(sf, request) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const superToken = yield sf.loadSuperToken(request.currencyInfo.value);
        const { paymentReference, paymentAddress, expectedFlowRate } = (0, utils_1.getRequestPaymentValues)(request);
        return sf.cfaV1.createFlow({
            flowRate: expectedFlowRate !== null && expectedFlowRate !== void 0 ? expectedFlowRate : '0',
            receiver: paymentAddress,
            superToken: superToken.address,
            userData: `${exports.USERDATA_PREFIX}${paymentReference}`
        });
    });
}
/**
 * Encodes the call to pay a request through the ERC777 SuperFluid stream contract.
 * @param request the request to pay
 * @param sf the SuperFluid framework to use
 */ function encodePayErc777StreamRequest(request, sf) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        // FIXME: according to specs PR https://github.com/RequestNetwork/requestNetwork/pull/688
        // in file packages/advanced-logic/specs/payment-network-erc777-stream-0.1.0.md
        // Below are the SF actions to add in the BatchCall:
        // - use expectedStartDate to compute offset between start of invoicing and start of streaming
        // - start fee streaming
        const streamPayOp = yield getStartStreamOp(sf, request);
        const batchCall = sf.batchCall([
            streamPayOp
        ]);
        const operationStructArray = yield Promise.all(batchCall.getOperationStructArrayPromises);
        return batchCall.host.contract.interface.encodeFunctionData('batchCall', [
            operationStructArray
        ]);
    });
}
exports.encodePayErc777StreamRequest = encodePayErc777StreamRequest;
/**
 * Prepare the transaction to pay a request through the ERC777 SuperFluid stream contract.
 * @param request the request to pay
 * @param provider the Web3 provider. Defaults to window.ethereum.
 */ function prepareErc777StreamPaymentTransaction(request, provider) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM);
        const sf = yield getSuperFluidFramework(request, provider);
        const encodedTx = yield encodePayErc777StreamRequest(request, sf);
        return {
            data: encodedTx,
            to: sf.host.contract.address,
            value: 0
        };
    });
}
exports.prepareErc777StreamPaymentTransaction = prepareErc777StreamPaymentTransaction;
/**
 * Gets the future ERC777 balance of an address, based on the request currency information
 * @param request the request that contains currency information
 * @param address the address to check
 * @param timestamp the time to calculate the balance at
 * @param provider the web3 provider. Defaults to Etherscan
 */ function getErc777BalanceAt(request, address, timestamp, provider = (0, utils_1.getNetworkProvider)(request)) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const id = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
        if (id !== types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM) {
            throw new Error('Not a supported ERC777 payment network request');
        }
        (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM);
        const sf = yield getSuperFluidFramework(request, provider);
        const superToken = yield sf.loadSuperToken(request.currencyInfo.value);
        const realtimeBalance = yield superToken.realtimeBalanceOf({
            providerOrSigner: provider,
            account: address,
            timestamp
        });
        return realtimeBalance.availableBalance;
    });
}
exports.getErc777BalanceAt = getErc777BalanceAt;
/**
 * Encode the transaction data for a one off payment of ERC777 Tokens
 * @param request to encode the payment for
 * @param amount the amount to be sent
 * @returns the encoded transaction data
 */ const encodeErc777OneOffPayment = (request, amount)=>{
    var _a;
    const id = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
    if (id !== types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM) {
        throw new Error('Not a supported ERC777 payment network request');
    }
    (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM);
    const { paymentReference, paymentAddress } = (0, utils_1.getRequestPaymentValues)(request);
    const erc777 = ethers_1.ethers.ContractFactory.getInterface(erc777Artefact.abi);
    return erc777.encodeFunctionData('send', [
        paymentAddress,
        amount,
        `${exports.USERDATA_PREFIX}${paymentReference}`
    ]);
};
exports.encodeErc777OneOffPayment = encodeErc777OneOffPayment;
/**
 * Prepare the transaction for a one payment for the user to sign
 * @param request to prepare the transaction for
 * @param amount the amount to be sent
 * @returns the prepared transaction
 */ const prepareErc777OneOffPayment = (request, amount)=>{
    return {
        data: (0, exports.encodeErc777OneOffPayment)(request, amount),
        to: request.currencyInfo.value,
        value: 0
    };
};
exports.prepareErc777OneOffPayment = prepareErc777OneOffPayment;
/**
 * Make an ERC777 payment
 * @param request associated to the payment
 * @param amount the amount to be sent
 * @param signer the transaction signer
 * @returns the transaction result
 */ const makeErc777OneOffPayment = (request, amount, signer, overrides)=>tslib_1.__awaiter(void 0, void 0, void 0, function*() {
        const preparedTx = (0, exports.prepareErc777OneOffPayment)(request, amount);
        return signer.sendTransaction(Object.assign(Object.assign({}, preparedTx), overrides));
    });
exports.makeErc777OneOffPayment = makeErc777OneOffPayment; //# sourceMappingURL=erc777-stream.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-input-data.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._getEthPaymentUrl = exports.prepareEthInputDataRequest = exports.payEthInputDataRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
/**
 * processes the transaction to pay an ETH request.
 * @param request the request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param overrides optionally, override default transaction values, like gas.
 */ function payEthInputDataRequest(request, signerOrProvider = (0, utils_1.getProvider)(), amount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const preparedTx = prepareEthInputDataRequest(request, amount, overrides);
        const tx = yield signer.sendTransaction(preparedTx);
        return tx;
    });
}
exports.payEthInputDataRequest = payEthInputDataRequest;
/**
 * processes the transaction to pay an ETH request.
 * @param request the request to pay
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param overrides optionally, override default transaction values, like gas.
 */ function prepareEthInputDataRequest(request, amount, overrides) {
    (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA);
    const { paymentReference, paymentAddress } = (0, utils_1.getRequestPaymentValues)(request);
    const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
    return Object.assign({
        data: `0x${paymentReference}`,
        to: paymentAddress,
        value: amountToPay
    }, overrides);
}
exports.prepareEthInputDataRequest = prepareEthInputDataRequest;
/**
 * processes the transaction to pay an ETH request.
 * @param request the request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 */ function _getEthPaymentUrl(request, amount) {
    const { paymentAddress, paymentReference } = (0, utils_1.getRequestPaymentValues)(request);
    const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
    // eslint-disable-next-line no-console
    return `ethereum:${paymentAddress}?value=${amountToPay}&data=${paymentReference}`;
}
exports._getEthPaymentUrl = _getEthPaymentUrl; //# sourceMappingURL=eth-input-data.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-fee-proxy.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateEthFeeProxyRequest = exports.prepareEthFeeProxyPaymentTransaction = exports.encodePayEthFeeProxyRequest = exports.payEthFeeProxyRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
/**
 * Processes a transaction to pay an ETH Request with fees.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmount optionally, the fee amount to pay. Defaults to the fee amount.
 * @param overrides optionally, override default transaction values, like gas.
 */ function payEthFeeProxyRequest(request, signerOrProvider = (0, utils_1.getProvider)(), amount, feeAmount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const { data, to, value } = prepareEthFeeProxyPaymentTransaction(request, amount, feeAmount);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.payEthFeeProxyRequest = payEthFeeProxyRequest;
/**
 * Encodes the call to pay a request through the ETH fee proxy contract, can be used with a Multisig contract.
 * @param request request to pay
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmountOverride optionally, the fee amount to pay. Defaults to the fee amount of the request.
 */ function encodePayEthFeeProxyRequest(request, amount, feeAmountOverride) {
    validateEthFeeProxyRequest(request, amount, feeAmountOverride);
    const { paymentReference, paymentAddress, feeAddress, feeAmount } = (0, utils_1.getRequestPaymentValues)(request);
    const feeToPay = ethers_1.BigNumber.from(feeAmountOverride || feeAmount || 0);
    const proxyContract = types_2.EthereumFeeProxy__factory.createInterface();
    return proxyContract.encodeFunctionData('transferWithReferenceAndFee', [
        paymentAddress,
        `0x${paymentReference}`,
        feeToPay,
        feeAddress || ethers_1.constants.AddressZero
    ]);
}
exports.encodePayEthFeeProxyRequest = encodePayEthFeeProxyRequest;
/**
 * Prepate the transaction to pay a request through the ETH fee proxy contract, can be used with a Multisig contract.
 * @param request request to pay
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmountOverride optionally, the fee amount to pay. Defaults to the fee amount of the request.
 */ function prepareEthFeeProxyPaymentTransaction(request, amount, feeAmountOverride) {
    validateEthFeeProxyRequest(request, amount, feeAmountOverride);
    const { feeAmount } = (0, utils_1.getRequestPaymentValues)(request);
    const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
    const feeToPay = feeAmountOverride || ethers_1.BigNumber.from(feeAmount || 0);
    const encodedTx = encodePayEthFeeProxyRequest(request, amount, feeAmountOverride);
    const proxyAddress = (0, utils_1.getProxyAddress)(request, payment_detection_1.EthFeeProxyPaymentDetector.getDeploymentInformation);
    return {
        data: encodedTx,
        to: proxyAddress,
        value: amountToPay.add(feeToPay)
    };
}
exports.prepareEthFeeProxyPaymentTransaction = prepareEthFeeProxyPaymentTransaction;
/**
 * Validates the amount and fee parameters for an Eth Fee Proxy based request.
 * @param request to validate
 * @param feeAmountOverride optionally, the custom fee amount
 * @param paymentNetwork defaults to ETH Fee Proxy contract
 */ function validateEthFeeProxyRequest(request, amount, feeAmountOverride, paymentNetwork = types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT) {
    (0, utils_1.validateRequest)(request, paymentNetwork);
    const { feeAmount } = (0, utils_1.getRequestPaymentValues)(request);
    const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
    const feeToPay = ethers_1.BigNumber.from(feeAmountOverride || feeAmount || 0);
    if (amountToPay.isZero() && feeToPay.isZero()) {
        throw new Error('Request payment amount and fee are 0');
    }
}
exports.validateEthFeeProxyRequest = validateEthFeeProxyRequest; //# sourceMappingURL=eth-fee-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/utils/validation.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validatePaymentReference = void 0;
/** Validates the presence of the payment reference for payment. */ function validatePaymentReference(paymentReference) {
    if (!paymentReference) {
        throw new Error('Cannot pay without a paymentReference');
    }
}
exports.validatePaymentReference = validatePaymentReference; //# sourceMappingURL=validation.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/any-to-erc20-proxy.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.prepareAnyToErc20ProxyPaymentTransaction = exports.getConversionPathForErc20Request = exports.encodePayAnyToErc20ProxyRequest = exports.payAnyToErc20ProxyRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const payment_detection_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const validation_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/utils/validation.js [app-ssr] (ecmascript)");
/**
 * Processes a transaction to pay a request with an ERC20 currency that is different from the request currency (eg. fiat).
 * The payment is made by the ERC20 Conversion fee proxy contract.
 * @param request The request to pay
 * @param signerOrProvider The Web3 provider, or signer. Defaults to window.ethereum.
 * @param paymentSettings The payment settings
 * @param amount Optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmount Optionally, the fee amount to pay. Defaults to the fee amount.
 * @param overrides Optionally, override default transaction values, like gas.
 */ function payAnyToErc20ProxyRequest(request, signerOrProvider = (0, utils_1.getProvider)(), paymentSettings, amount, feeAmount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const { data, to, value } = prepareAnyToErc20ProxyPaymentTransaction(request, paymentSettings, amount, feeAmount);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.payAnyToErc20ProxyRequest = payAnyToErc20ProxyRequest;
/**
 * Encodes the call to pay a request with an ERC20 currency that is different from the request currency (eg. fiat).
 * The payment is made by the ERC20 Conversion fee proxy contract.
 * @param request The request to pay
 * @param paymentSettings The payment settings
 * @param amount Optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmountOverride Optionally, the fee amount to pay. Defaults to the fee amount of the request.
 */ function encodePayAnyToErc20ProxyRequest(request, paymentSettings, amount, feeAmountOverride) {
    const { path, paymentReference, paymentAddress, feeAddress, maxRateTimespan, amountToPay, feeToPay } = prepareAnyToErc20Arguments(request, paymentSettings, amount, feeAmountOverride);
    const proxyContract = types_1.Erc20ConversionProxy__factory.createInterface();
    return proxyContract.encodeFunctionData('transferFromWithReferenceAndFee', [
        paymentAddress,
        amountToPay,
        path,
        `0x${paymentReference}`,
        feeToPay,
        feeAddress || ethers_1.constants.AddressZero,
        ethers_1.BigNumber.from(paymentSettings.maxToSpend),
        maxRateTimespan || 0
    ]);
}
exports.encodePayAnyToErc20ProxyRequest = encodePayAnyToErc20ProxyRequest;
/**
 * It checks paymentSettings values, it get request's path and requestCurrency
 * @param request The request to pay
 * @param paymentSettings The payment settings
 * @param amount Optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmountOverride Optionally, the fee amount to pay. Defaults to the fee amount of the request.
 */ function getConversionPathForErc20Request(request, paymentSettings) {
    if (!paymentSettings.currency) {
        throw new Error('currency must be provided in the paymentSettings');
    }
    if (!paymentSettings.currency.network) {
        throw new Error('Cannot pay with a currency missing a network');
    }
    const currencyManager = paymentSettings.currencyManager || currency_1.CurrencyManager.getDefault();
    const requestCurrency = currencyManager.fromStorageCurrency(request.currencyInfo);
    if (!requestCurrency) {
        throw new currency_1.UnsupportedCurrencyError(request.currencyInfo);
    }
    const paymentCurrency = currencyManager.fromStorageCurrency(paymentSettings.currency);
    if (!paymentCurrency) {
        throw new currency_1.UnsupportedCurrencyError(paymentSettings.currency);
    }
    if (paymentCurrency.type !== types_2.RequestLogicTypes.CURRENCY.ERC20) {
        throw new Error(`Payment currency must be an ERC20`);
    }
    // Compute the path automatically
    const path = currencyManager.getConversionPath(requestCurrency, paymentCurrency, paymentCurrency.network);
    if (!path) {
        throw new Error(`Impossible to find a conversion path between from ${requestCurrency.symbol} (${requestCurrency.hash}) to ${paymentCurrency.symbol} (${paymentCurrency.hash})`);
    }
    return {
        path,
        requestCurrency
    };
}
exports.getConversionPathForErc20Request = getConversionPathForErc20Request;
/**
 * Prepares all necessaries arguments required to encode an any-to-erc20 request
 * @param request The request to pay
 * @param paymentSettings The payment settings
 * @param amount Optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmountOverride Optionally, the fee amount to pay. Defaults to the fee amount of the request.
 */ function prepareAnyToErc20Arguments(request, paymentSettings, amount, feeAmountOverride) {
    const { path, requestCurrency } = getConversionPathForErc20Request(request, paymentSettings);
    (0, utils_1.validateConversionFeeProxyRequest)(request, path, amount, feeAmountOverride);
    const { paymentReference, paymentAddress, feeAddress, feeAmount, maxRateTimespan } = (0, utils_1.getRequestPaymentValues)(request);
    (0, validation_1.validatePaymentReference)(paymentReference);
    const amountToPay = (0, payment_detection_2.padAmountForChainlink)((0, utils_1.getAmountToPay)(request, amount), requestCurrency);
    const feeToPay = (0, payment_detection_2.padAmountForChainlink)(feeAmountOverride || feeAmount || 0, requestCurrency);
    return {
        path,
        paymentReference,
        paymentAddress,
        feeAddress,
        maxRateTimespan,
        amountToPay,
        feeToPay
    };
}
function prepareAnyToErc20ProxyPaymentTransaction(request, paymentSettings, amount, feeAmount) {
    if (!paymentSettings.currency) {
        throw new Error('currency must be provided in the paymentSettings');
    }
    if (!paymentSettings.currency.network) {
        throw new Error('Cannot pay with a currency missing a network');
    }
    const encodedTx = encodePayAnyToErc20ProxyRequest(request, paymentSettings, amount, feeAmount);
    const proxyAddress = (0, utils_1.getProxyAddress)(request, payment_detection_1.AnyToERC20PaymentDetector.getDeploymentInformation);
    return {
        data: encodedTx,
        to: proxyAddress,
        value: 0
    };
}
exports.prepareAnyToErc20ProxyPaymentTransaction = prepareAnyToErc20ProxyPaymentTransaction; //# sourceMappingURL=any-to-erc20-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/any-to-eth-proxy.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getConversionPathForEthRequest = exports.prepareAnyToEthProxyPaymentTransaction = exports.encodePayAnyToEthProxyRequest = exports.payAnyToEthProxyRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const payment_detection_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const utils_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
/**
 * Processes a transaction to pay a request with a native token when the request is denominated in another currency
 * The payment is made by the ETH fee proxy contract.
 * @param request the request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param paymentSettings payment settings
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmount optionally, the fee amount to pay. Defaults to the fee amount.
 * @param overrides optionally, override default transaction values, like gas.
 */ function payAnyToEthProxyRequest(request, signerOrProvider = (0, utils_1.getProvider)(), paymentSettings, amount, feeAmount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const { data, to, value } = prepareAnyToEthProxyPaymentTransaction(request, paymentSettings, amount, feeAmount);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.payAnyToEthProxyRequest = payAnyToEthProxyRequest;
/**
 * Encodes the call to pay a request with a native token when the request currency is different. The payment is made by the ETH fee proxy contract.
 * @param request request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param paymentSettings payment settings
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param feeAmountOverride optionally, the fee amount to pay. Defaults to the fee amount of the request.
 */ function encodePayAnyToEthProxyRequest(request, paymentSettings, amount, feeAmountOverride) {
    const { path, requestCurrency } = getConversionPathForEthRequest(request, paymentSettings);
    const { paymentReference, paymentAddress, feeAddress, feeAmount, maxRateTimespan } = (0, utils_1.getRequestPaymentValues)(request);
    const amountToPay = (0, payment_detection_2.padAmountForChainlink)((0, utils_1.getAmountToPay)(request, amount), requestCurrency);
    const feeToPay = (0, payment_detection_2.padAmountForChainlink)(feeAmountOverride || feeAmount || 0, requestCurrency);
    const proxyContract = types_1.EthConversionProxy__factory.createInterface();
    return proxyContract.encodeFunctionData('transferWithReferenceAndFee', [
        paymentAddress,
        amountToPay,
        path,
        `0x${paymentReference}`,
        feeToPay,
        feeAddress || ethers_1.constants.AddressZero,
        maxRateTimespan || 0
    ]);
}
exports.encodePayAnyToEthProxyRequest = encodePayAnyToEthProxyRequest;
function prepareAnyToEthProxyPaymentTransaction(request, paymentSettings, amount, feeAmount) {
    if (!paymentSettings.maxToSpend) {
        throw Error('paymentSettings.maxToSpend is required');
    }
    const encodedTx = encodePayAnyToEthProxyRequest(request, paymentSettings, amount, feeAmount);
    const proxyAddress = (0, utils_2.getProxyAddress)(request, payment_detection_1.AnyToEthFeeProxyPaymentDetector.getDeploymentInformation);
    return {
        data: encodedTx,
        to: proxyAddress,
        value: ethers_1.BigNumber.from(paymentSettings.maxToSpend)
    };
}
exports.prepareAnyToEthProxyPaymentTransaction = prepareAnyToEthProxyPaymentTransaction;
function getConversionPathForEthRequest(request, paymentSettings) {
    const currencyManager = paymentSettings.currencyManager || currency_1.CurrencyManager.getDefault();
    if (!request.currencyInfo) {
        throw new Error(`currency not specified`);
    }
    const requestCurrency = currencyManager.fromStorageCurrency(request.currencyInfo);
    if (!requestCurrency) {
        throw new currency_1.UnsupportedCurrencyError(request.currencyInfo);
    }
    const { network } = (0, utils_1.getRequestPaymentValues)(request);
    if (!network) {
        throw new Error(`missing network`);
    }
    const paymentCurrency = currencyManager.getNativeCurrency(types_2.RequestLogicTypes.CURRENCY.ETH, network);
    if (!paymentCurrency) {
        throw new currency_1.UnsupportedCurrencyError({
            value: 'ETH',
            network
        });
    }
    // Compute the path automatically
    const path = currencyManager.getConversionPath(requestCurrency, paymentCurrency, network);
    if (!path) {
        throw new Error(`Impossible to find a conversion path between from ${requestCurrency.symbol} (${requestCurrency.hash}) to ${paymentCurrency.symbol} (${paymentCurrency.hash})`);
    }
    return {
        path,
        requestCurrency
    };
}
exports.getConversionPathForEthRequest = getConversionPathForEthRequest; //# sourceMappingURL=any-to-eth-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils-near.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isReceiverReady = exports.storageDeposit = exports.processNearFungiblePayment = exports.processNearPaymentWithConversion = exports.processNearPayment = exports.isNearAccountSolvent = exports.isValidNearAddress = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const near_api_js_1 = __turbopack_require__("[project]/node_modules/.pnpm/near-api-js@4.0.2/node_modules/near-api-js/lib/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-ssr] (ecmascript)");
const isValidNearAddress = (nearNetwork, address)=>tslib_1.__awaiter(void 0, void 0, void 0, function*() {
        try {
            yield nearNetwork.connection.provider.query(`account/${address}`, '');
            return true;
        } catch (e) {
            return false;
        }
    });
exports.isValidNearAddress = isValidNearAddress;
const isNearAccountSolvent = (amount, nearWalletConnection, token)=>{
    if (!token || token.type === types_1.RequestLogicTypes.CURRENCY.ETH) {
        return nearWalletConnection.account().state().then((state)=>{
            var _a;
            const balance = ethers_1.BigNumber.from((_a = state === null || state === void 0 ? void 0 : state.amount) !== null && _a !== void 0 ? _a : '0');
            return balance.gte(amount);
        });
    }
    if (token.type === types_1.RequestLogicTypes.CURRENCY.ERC20) {
        const fungibleContract = new near_api_js_1.Contract(nearWalletConnection.account(), token.value, {
            changeMethods: [],
            viewMethods: [
                'ft_balance_of'
            ],
            useLocalViewExecution: true
        });
        return fungibleContract.ft_balance_of({
            account_id: nearWalletConnection.account().accountId
        }).then((balance)=>ethers_1.BigNumber.from(balance).gte(amount));
    }
    throw new Error(`isNearAccountSolvent not implemented for ${token.type}`);
};
exports.isNearAccountSolvent = isNearAccountSolvent;
const GAS_LIMIT_IN_TGAS = 50;
const GAS_LIMIT = ethers_1.ethers.utils.parseUnits(GAS_LIMIT_IN_TGAS.toString(), 12);
const GAS_LIMIT_NATIVE = GAS_LIMIT.toString();
const GAS_LIMIT_CONVERSION_TO_NATIVE = GAS_LIMIT.mul(2).toString(); // 200 TGas
const GAS_LIMIT_FUNGIBLE_PROXY = GAS_LIMIT.mul(4).toString(); // 400 TGas
const processNearPayment = (walletConnection, network, amount, to, paymentReference, version = '0.2.0', callback = undefined)=>tslib_1.__awaiter(void 0, void 0, void 0, function*() {
        if (version !== '0.2.0') {
            if (version === '0.1.0') {
                throw new Error('Native Token payments on Near with extension v0.1.0 are not supported anymore');
            }
            throw new Error('Native Token payments on Near only support v0.2.0 extensions');
        }
        if (!(yield (0, exports.isValidNearAddress)(walletConnection._near, to))) {
            throw new Error(`Invalid NEAR payment address: ${to}`);
        }
        try {
            const contract = new near_api_js_1.Contract(walletConnection.account(), payment_detection_1.NearNativeTokenPaymentDetector.getContractName(network, version), {
                changeMethods: [
                    'transfer_with_reference'
                ],
                viewMethods: [],
                useLocalViewExecution: true
            });
            yield contract.transfer_with_reference(Object.assign({
                args: {
                    to,
                    payment_reference: paymentReference
                },
                gas: GAS_LIMIT_NATIVE,
                amount: amount.toString()
            }, callback));
            return;
        } catch (e) {
            throw new Error(`Could not pay Near request. Got ${e.message}`);
        }
    });
exports.processNearPayment = processNearPayment;
/**
 * Processes a payment in Near native token, with conversion.
 *
 * @param amount is defined with 2 decimals, denominated in `currency`
 * @param currency is a currency ticker (e.g. "ETH" or "USD")
 * @param maxRateTimespan accepts any kind rate's age if '0'
 */ const processNearPaymentWithConversion = (walletConnection, network, amount, to, paymentReference, currency, feeAddress, feeAmount, maxToSpend, maxRateTimespan = '0', version = '0.1.0', callback = undefined)=>tslib_1.__awaiter(void 0, void 0, void 0, function*() {
        throw new Error('Payments with on-chain conversions are currently disabled on Near.');
        if (version !== '0.1.0') {
            throw new Error('Native Token with conversion payments on Near only support v0.1.0 extensions');
        }
        if (!(yield (0, exports.isValidNearAddress)(walletConnection._near, to))) {
            throw new Error(`Invalid NEAR payment address: ${to}`);
        }
        if (!(yield (0, exports.isValidNearAddress)(walletConnection._near, feeAddress))) {
            throw new Error(`Invalid NEAR fee address: ${feeAddress}`);
        }
        try {
            const contract = new near_api_js_1.Contract(walletConnection.account(), payment_detection_1.NearConversionNativeTokenPaymentDetector.getContractName(network, version), {
                changeMethods: [
                    'transfer_with_reference'
                ],
                viewMethods: [],
                useLocalViewExecution: true
            });
            yield contract.transfer_with_reference(Object.assign({
                args: {
                    payment_reference: paymentReference,
                    to,
                    amount,
                    currency,
                    fee_address: feeAddress,
                    fee_amount: feeAmount,
                    max_rate_timespan: maxRateTimespan
                },
                gas: GAS_LIMIT_CONVERSION_TO_NATIVE,
                amount: maxToSpend.toString()
            }, callback));
            return;
        } catch (e) {
            throw new Error(`Could not pay Near request. Got ${e.message}`);
        }
    });
exports.processNearPaymentWithConversion = processNearPaymentWithConversion;
const processNearFungiblePayment = (walletConnection, network, amount, to, paymentReference, currencyAddress, feeAddress, feeAmount, callback = undefined)=>tslib_1.__awaiter(void 0, void 0, void 0, function*() {
        const fungibleContract = new near_api_js_1.Contract(walletConnection.account(), currencyAddress, {
            changeMethods: [
                'ft_transfer_call'
            ],
            viewMethods: [],
            useLocalViewExecution: true
        });
        const proxyAddress = smart_contracts_1.erc20FeeProxyArtifact.getAddress(network, 'near');
        yield fungibleContract.ft_transfer_call(Object.assign({
            args: {
                receiver_id: proxyAddress,
                amount: ethers_1.BigNumber.from(amount).add(feeAmount).toString(),
                msg: JSON.stringify({
                    fee_address: feeAddress,
                    fee_amount: feeAmount,
                    payment_reference: paymentReference,
                    to
                })
            },
            gas: GAS_LIMIT_FUNGIBLE_PROXY,
            amount: '1'.toString()
        }, callback));
    });
exports.processNearFungiblePayment = processNearFungiblePayment;
// min. 0.00125 Ⓝ
const MIN_STORAGE_FOR_FUNGIBLE = '1250000000000000000000';
/**
 * Stores the minimum deposit amount on the `paymentAddress` account for `tokenAddress`.
 * This does not check the existing deposit, if any, and should be called if `isReceiverReady` is false.
 * @param walletConnection
 * @param tokenAddress
 * @param paymentAddress
 */ const storageDeposit = (walletConnection, tokenAddress, paymentAddress)=>tslib_1.__awaiter(void 0, void 0, void 0, function*() {
        const fungibleContract = new near_api_js_1.Contract(walletConnection.account(), tokenAddress, {
            changeMethods: [
                'storage_deposit'
            ],
            viewMethods: [],
            useLocalViewExecution: true
        });
        yield fungibleContract.storage_deposit({
            args: {
                account_id: paymentAddress
            },
            value: MIN_STORAGE_FOR_FUNGIBLE
        });
    });
exports.storageDeposit = storageDeposit;
/**
 * This checks that the `paymentAddress` has enough storage on the `tokenAddress` to receive tokens.
 *
 * It returns false if trying to send tokens to the `paymentAddress` would result in:
 *
 * - 'Smart contract panicked: The account account.identifier.near is not registered'
 *
 */ const isReceiverReady = (walletConnection, tokenAddress, paymentAddress)=>tslib_1.__awaiter(void 0, void 0, void 0, function*() {
        const fungibleContract = new near_api_js_1.Contract(walletConnection.account(), tokenAddress, {
            changeMethods: [],
            viewMethods: [
                'storage_balance_of'
            ],
            useLocalViewExecution: true
        });
        const storage = yield fungibleContract.storage_balance_of({
            account_id: paymentAddress
        });
        return !!storage && ethers_1.BigNumber.from(storage === null || storage === void 0 ? void 0 : storage.total).gte(MIN_STORAGE_FOR_FUNGIBLE);
    });
exports.isReceiverReady = isReceiverReady; //# sourceMappingURL=utils-near.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/conversion-erc20.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.prepareApproveErc20ForProxyConversion = exports.approveErc20ForProxyConversion = exports.hasErc20ApprovalForProxyConversion = exports.approveErc20ForProxyConversionIfNeeded = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)");
/**
 * Processes the approval transaction of a given payment ERC20 to be spent by the conversion proxy,
 * if the current approval is missing or not sufficient.
 * @param request request to pay, used to know the network
 * @param ownerAddress address of the payer
 * @param paymentTokenAddress ERC20 currency used to pay
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param minAmount ensures the approved amount is sufficient to pay this amount
 * @param overrides optionally, override default transaction values, like gas.
 */ function approveErc20ForProxyConversionIfNeeded(request, ownerAddress, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), minAmount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!(yield hasErc20ApprovalForProxyConversion(request, ownerAddress, paymentTokenAddress, signerOrProvider, minAmount))) {
            return approveErc20ForProxyConversion(request, paymentTokenAddress, signerOrProvider, overrides);
        }
    });
}
exports.approveErc20ForProxyConversionIfNeeded = approveErc20ForProxyConversionIfNeeded;
/**
 * Verify if a given payment ERC20 can be spent by the conversion proxy,
 * @param request request to pay, used to know the network
 * @param ownerAddress address of the payer
 * @param paymentTokenAddress ERC20 currency used to pay
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param minAmount ensures the approved amount is sufficient to pay this amount
 */ function hasErc20ApprovalForProxyConversion(request, ownerAddress, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), minAmount) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const proxyAddress = (0, utils_1.getProxyAddress)(request, payment_detection_1.AnyToERC20PaymentDetector.getDeploymentInformation);
        return (0, erc20_1.checkErc20Allowance)(ownerAddress, proxyAddress, signerOrProvider, paymentTokenAddress, minAmount);
    });
}
exports.hasErc20ApprovalForProxyConversion = hasErc20ApprovalForProxyConversion;
/**
 * Processes the approval transaction of the payment ERC20 to be spent by the conversion proxy,
 * during the fee proxy delegate call.
 * @param request request to pay, used to know the network
 * @param paymentTokenAddress picked currency to pay
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param overrides optionally, override default transaction values, like gas.
 */ function approveErc20ForProxyConversion(request, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const preparedTx = prepareApproveErc20ForProxyConversion(request, paymentTokenAddress, signerOrProvider, overrides);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(preparedTx);
        return tx;
    });
}
exports.approveErc20ForProxyConversion = approveErc20ForProxyConversion;
/**
 * Prepare the approval transaction of the payment ERC20 to be spent by the conversion proxy,
 * during the fee proxy delegate call.
 * @param request request to pay, used to know the network
 * @param paymentTokenAddress picked currency to pay
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param overrides optionally, override default transaction values, like gas.
 */ function prepareApproveErc20ForProxyConversion(request, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), overrides, amount) {
    const proxyAddress = (0, utils_1.getProxyAddress)(request, payment_detection_1.AnyToERC20PaymentDetector.getDeploymentInformation);
    const encodedTx = (0, erc20_1.encodeApproveAnyErc20)(paymentTokenAddress, proxyAddress, signerOrProvider, amount);
    return Object.assign({
        data: encodedTx,
        to: paymentTokenAddress,
        value: 0
    }, overrides);
}
exports.prepareApproveErc20ForProxyConversion = prepareApproveErc20ForProxyConversion; //# sourceMappingURL=conversion-erc20.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-erc20.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.prepareApprovalErc20ForSwapToPay = exports.approveErc20ForSwapToPay = exports.hasApprovalErc20ForSwapToPay = exports.approveErc20ForSwapToPayIfNeeded = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
/**
 * Processes the approval transaction of a given payment ERC20 to be spent by the swap router,
 * if the current approval is missing or not sufficient.
 * @param request request to pay, used to know the network
 * @param ownerAddress address of the payer
 * @param paymentCurrency ERC20 currency used for the swap
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param minAmount ensures the approved amount is sufficient to pay this amount
 * @param overrides optionally, override default transaction values, like gas.
 */ function approveErc20ForSwapToPayIfNeeded(request, ownerAddress, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), minAmount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!(yield hasApprovalErc20ForSwapToPay(request, ownerAddress, paymentTokenAddress, signerOrProvider, minAmount))) {
            return approveErc20ForSwapToPay(request, paymentTokenAddress, signerOrProvider, overrides);
        }
    });
}
exports.approveErc20ForSwapToPayIfNeeded = approveErc20ForSwapToPayIfNeeded;
/**
 * Verify if a given payment ERC20 can be spent by the swap router,
 * @param request request to pay, used to know the network
 * @param ownerAddress address of the payer
 * @param paymentCurrency ERC20 currency used for the swap
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param minAmount ensures the approved amount is sufficient to pay this amount
 */ function hasApprovalErc20ForSwapToPay(request, ownerAddress, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), minAmount) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const { network } = request.currencyInfo;
        if (!network) {
            throw new Error('Request currency network is missing');
        }
        currency_1.EvmChains.assertChainSupported(network);
        return (0, erc20_1.checkErc20Allowance)(ownerAddress, smart_contracts_1.erc20SwapToPayArtifact.getAddress(network), signerOrProvider, paymentTokenAddress, minAmount);
    });
}
exports.hasApprovalErc20ForSwapToPay = hasApprovalErc20ForSwapToPay;
/**
 * Processes the approval transaction of the payment ERC20 to be spent by the swap router.
 * @param request request to pay, used to know the network
 * @param paymentTokenAddress picked currency for the swap to pay
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param overrides optionally, override default transaction values, like gas.
 */ function approveErc20ForSwapToPay(request, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const preparedTx = prepareApprovalErc20ForSwapToPay(request, paymentTokenAddress, signerOrProvider, overrides);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(preparedTx);
        return tx;
    });
}
exports.approveErc20ForSwapToPay = approveErc20ForSwapToPay;
/**
 * Prepare the transaction for allowing the swap router to spend ERC20 payment tokens.
 * @param request request to pay, used to know the network
 * @param paymentTokenAddress picked currency for the swap to pay
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param overrides optionally, override default transaction values, like gas.
 */ function prepareApprovalErc20ForSwapToPay(request, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), overrides, amount) {
    const { network } = request.currencyInfo;
    currency_1.EvmChains.assertChainSupported(network);
    const encodedTx = (0, erc20_1.encodeApproveAnyErc20)(paymentTokenAddress, smart_contracts_1.erc20SwapToPayArtifact.getAddress(network), signerOrProvider, amount);
    return Object.assign({
        data: encodedTx,
        to: paymentTokenAddress,
        value: 0
    }, overrides);
}
exports.prepareApprovalErc20ForSwapToPay = prepareApprovalErc20ForSwapToPay; //# sourceMappingURL=swap-erc20.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-conversion-erc20.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.prepareApprovalErc20ForSwapWithConversionToPay = exports.approveErc20ForSwapWithConversionToPay = exports.hasErc20ApprovalForSwapWithConversion = exports.approveErc20ForSwapWithConversionIfNeeded = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)");
/**
 * Processes the approval transaction of a given payment ERC20 to be spent by the swap router,
 * if the current approval is missing or not sufficient.
 * @param request request to pay, used to know the network
 * @param ownerAddress address of the payer
 * @param paymentTokenAddress ERC20 currency used for the swap
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param minAmount ensures the approved amount is sufficient to pay this amount
 * @param overrides optionally, override default transaction values, like gas.
 */ function approveErc20ForSwapWithConversionIfNeeded(request, ownerAddress, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), minAmount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!(yield hasErc20ApprovalForSwapWithConversion(request, ownerAddress, paymentTokenAddress, signerOrProvider, minAmount))) {
            return approveErc20ForSwapWithConversionToPay(request, paymentTokenAddress, signerOrProvider, overrides);
        }
    });
}
exports.approveErc20ForSwapWithConversionIfNeeded = approveErc20ForSwapWithConversionIfNeeded;
/**
 * Verify if a given payment ERC20 to be spent by the swap router
 * @param request request to pay, used to know the network
 * @param ownerAddress address of the payer
 * @param paymentTokenAddress ERC20 currency used for the swap
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param minAmount ensures the approved amount is sufficient to pay this amount
 * @param overrides optionally, override default transaction values, like gas.
 */ function hasErc20ApprovalForSwapWithConversion(request, ownerAddress, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), minAmount) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!request.extensions[types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY]) {
            throw new Error(`The request must have the payment network any-to-erc20-proxy`);
        }
        const network = request.extensions[types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY].values.network;
        return yield (0, erc20_1.checkErc20Allowance)(ownerAddress, smart_contracts_1.erc20SwapConversionArtifact.getAddress(network), signerOrProvider, paymentTokenAddress, minAmount);
    });
}
exports.hasErc20ApprovalForSwapWithConversion = hasErc20ApprovalForSwapWithConversion;
/**
 * Processes the approval transaction of the payment ERC20 to be spent by the swap router.
 * @param request request to pay, used to know the network
 * @param paymentTokenAddress picked currency for the swap to pay
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param overrides optionally, override default transaction values, like gas.
 */ function approveErc20ForSwapWithConversionToPay(request, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const network = request.extensions[types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY].values.network;
        if (!network) {
            throw new Error(`Payment network currency must have a network`);
        }
        const preparedTx = prepareApprovalErc20ForSwapWithConversionToPay(request, paymentTokenAddress, signerOrProvider, overrides);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(preparedTx);
        return tx;
    });
}
exports.approveErc20ForSwapWithConversionToPay = approveErc20ForSwapWithConversionToPay;
/**
 * Prepare the approval transaction of the payment ERC20 to be spent by the swap router.
 * @param request request to pay, used to know the network
 * @param paymentTokenAddress picked currency for the swap to pay
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param overrides optionally, override default transaction values, like gas.
 */ function prepareApprovalErc20ForSwapWithConversionToPay(request, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), overrides, amount) {
    const network = request.extensions[types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY].values.network;
    if (!network) {
        throw new Error(`Payment network currency must have a network`);
    }
    const encodedTx = (0, erc20_1.encodeApproveAnyErc20)(paymentTokenAddress, smart_contracts_1.erc20SwapConversionArtifact.getAddress(network), signerOrProvider, amount);
    return Object.assign({
        data: encodedTx,
        to: paymentTokenAddress,
        value: 0
    }, overrides);
}
exports.prepareApprovalErc20ForSwapWithConversionToPay = prepareApprovalErc20ForSwapWithConversionToPay; //# sourceMappingURL=swap-conversion-erc20.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/encoder-approval.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isRequestErc20ApprovalWithSwapNeeded = exports.isRequestErc20ApprovalWithoutSwapNeeded = exports.isRequestErc20ApprovalNeeded = exports.encodeRequestErc20ApprovalWithSwap = exports.encodeRequestErc20ApprovalWithoutSwap = exports.encodeRequestErc20ApprovalWithSwapIfNeeded = exports.encodeRequestErc20ApprovalWithoutSwapIfNeeded = exports.encodeRequestErc20Approval = exports.encodeRequestErc20ApprovalIfNeeded = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const conversion_erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/conversion-erc20.js [app-ssr] (ecmascript)");
const swap_erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-erc20.js [app-ssr] (ecmascript)");
const swap_conversion_erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-conversion-erc20.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
/**
 * For a given request and user, encode an approval transaction if it is needed.
 * @param request the request
 * @param provider generic provider
 * @param from the user who will pay the request
 * @param options specific to the request payment (conversion, swapping, ...)
 */ function encodeRequestErc20ApprovalIfNeeded(request, provider, from, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const formattedRequest = (0, payment_detection_1.flattenRequestByPnId)({
            request,
            pnIdentifier: options === null || options === void 0 ? void 0 : options.pnIdentifier
        });
        if (options && options.swap) {
            return encodeRequestErc20ApprovalWithSwapIfNeeded(formattedRequest, provider, from, options);
        } else {
            return encodeRequestErc20ApprovalWithoutSwapIfNeeded(formattedRequest, provider, from, options);
        }
    });
}
exports.encodeRequestErc20ApprovalIfNeeded = encodeRequestErc20ApprovalIfNeeded;
/**
 * For a given request, encode an approval transaction.
 * @param request the request
 * @param provider generic provider
 * @param options specific to the request payment (conversion, ...)
 */ function encodeRequestErc20Approval(request, provider, options) {
    const formattedRequest = (0, payment_detection_1.flattenRequestByPnId)({
        request,
        pnIdentifier: options === null || options === void 0 ? void 0 : options.pnIdentifier
    });
    if (options && options.swap) {
        return encodeRequestErc20ApprovalWithSwap(formattedRequest, provider, options);
    } else {
        return encodeRequestErc20ApprovalWithoutSwap(formattedRequest, provider, options);
    }
}
exports.encodeRequestErc20Approval = encodeRequestErc20Approval;
/**
 * For a given request and user, encode an approval transaction if it is needed when swap is not used.
 * @param request the request
 * @param provider generic provider
 * @param from user who will pay the request
 * @param options specific to the request payment (conversion, swapping, ...)
 */ function encodeRequestErc20ApprovalWithoutSwapIfNeeded(request, provider, from, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (yield isRequestErc20ApprovalWithoutSwapNeeded(request, provider, from, options)) {
            return encodeRequestErc20ApprovalWithoutSwap(request, provider, options);
        }
    });
}
exports.encodeRequestErc20ApprovalWithoutSwapIfNeeded = encodeRequestErc20ApprovalWithoutSwapIfNeeded;
/**
 * For a given request and user, encode an approval transaction if it is needed when swap is used.
 * @param request the request
 * @param provider generic provider
 * @param from user who will pay the request
 * @param options specific to the request payment (conversion, swapping, ...)
 */ function encodeRequestErc20ApprovalWithSwapIfNeeded(request, provider, from, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!options || !options.swap) {
            throw new Error('No swap options');
        }
        if (yield isRequestErc20ApprovalWithSwapNeeded(request, provider, from, options)) {
            return encodeRequestErc20ApprovalWithSwap(request, provider, options);
        }
    });
}
exports.encodeRequestErc20ApprovalWithSwapIfNeeded = encodeRequestErc20ApprovalWithSwapIfNeeded;
/**
 * For a given request, encode an approval transaction when swap is not used.
 * @param request the request
 * @param provider generic provider
 * @param options specific to the request payment (conversion, ...)
 */ function encodeRequestErc20ApprovalWithoutSwap(request, provider, options) {
    var _a, _b, _c, _d;
    const paymentNetwork = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
    const overrides = options === null || options === void 0 ? void 0 : options.overrides;
    switch(paymentNetwork){
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT:
            return (0, erc20_1.prepareApproveErc20)(request, provider, overrides, (_b = options === null || options === void 0 ? void 0 : options.approval) === null || _b === void 0 ? void 0 : _b.amount);
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT:
            return (0, erc20_1.prepareApproveErc20)(request, provider, overrides, (_c = options === null || options === void 0 ? void 0 : options.approval) === null || _c === void 0 ? void 0 : _c.amount);
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY:
            {
                if (!options || !options.conversion || !options.conversion.currency || options.conversion.currency.type !== types_1.RequestLogicTypes.CURRENCY.ERC20) {
                    throw new Error('Conversion settings missing');
                }
                return (0, conversion_erc20_1.prepareApproveErc20ForProxyConversion)(request, options.conversion.currency.value, provider, overrides, (_d = options === null || options === void 0 ? void 0 : options.approval) === null || _d === void 0 ? void 0 : _d.amount);
            }
    }
}
exports.encodeRequestErc20ApprovalWithoutSwap = encodeRequestErc20ApprovalWithoutSwap;
/**
 * For a given request, encode an approval transaction when swap is used.
 * @param request the request
 * @param provider generic provider
 * @param options specific to the request payment (conversion, swapping, ...)
 */ function encodeRequestErc20ApprovalWithSwap(request, provider, options) {
    var _a, _b, _c;
    const paymentNetwork = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
    const overrides = (options === null || options === void 0 ? void 0 : options.overrides) ? options.overrides : undefined;
    switch(paymentNetwork){
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT:
            if (options && options.swap) {
                return (0, swap_erc20_1.prepareApprovalErc20ForSwapToPay)(request, options.swap.path[0], provider, overrides, (_b = options.approval) === null || _b === void 0 ? void 0 : _b.amount);
            } else {
                throw new Error('No swap options');
            }
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY:
            {
                if (!options || !options.conversion || !options.conversion.currency || options.conversion.currency.type !== types_1.RequestLogicTypes.CURRENCY.ERC20) {
                    throw new Error('Conversion settings missing');
                }
                if (options.swap) {
                    return (0, swap_conversion_erc20_1.prepareApprovalErc20ForSwapWithConversionToPay)(request, options.swap.path[0], provider, overrides, (_c = options.approval) === null || _c === void 0 ? void 0 : _c.amount);
                } else {
                    throw new Error('No swap options');
                }
            }
        default:
            return;
    }
}
exports.encodeRequestErc20ApprovalWithSwap = encodeRequestErc20ApprovalWithSwap;
/**
 * Check if for a given request and user, an approval transaction is needed.
 * @param request the request
 * @param provider generic provider
 * @param from user who will make the payment
 * @param options specific to the request payment (conversion, ...)
 */ function isRequestErc20ApprovalNeeded(request, provider, from, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (options && options.swap) {
            return isRequestErc20ApprovalWithSwapNeeded(request, provider, from, options);
        }
        return isRequestErc20ApprovalWithoutSwapNeeded(request, provider, from, options);
    });
}
exports.isRequestErc20ApprovalNeeded = isRequestErc20ApprovalNeeded;
/**
 * Check if for a given request and user, an approval transaction is needed when swap is not used.
 * @param request the request
 * @param provider generic provider
 * @param from user who will make the payment
 * @param options specific to the request payment (conversion, ...)
 */ function isRequestErc20ApprovalWithoutSwapNeeded(request, provider, from, options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const paymentNetwork = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
        switch(paymentNetwork){
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT:
                if (!(yield (0, erc20_1.hasErc20Approval)(request, from))) {
                    return true;
                }
                break;
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT:
                if (!(yield (0, erc20_1.hasErc20Approval)(request, from))) {
                    return true;
                }
                break;
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY:
                {
                    if (!options || !options.conversion || !options.conversion.currency || options.conversion.currency.type !== types_1.RequestLogicTypes.CURRENCY.ERC20) {
                        throw new Error('Conversion settings missing');
                    }
                    const amount = options.conversion.maxToSpend ? options.conversion.maxToSpend : ethers_1.BigNumber.from(0);
                    if (!(yield (0, conversion_erc20_1.hasErc20ApprovalForProxyConversion)(request, from, options.conversion.currency.value, provider, amount))) {
                        return true;
                    }
                    break;
                }
        }
        return false;
    });
}
exports.isRequestErc20ApprovalWithoutSwapNeeded = isRequestErc20ApprovalWithoutSwapNeeded;
/**
 * Check if for a given request and user, an approval transaction is needed when swap is used.
 * @param request the request
 * @param provider generic provider
 * @param from user who will make the payment
 * @param options specific to the request payment (conversion, swapping, ...)
 */ function isRequestErc20ApprovalWithSwapNeeded(request, provider, from, options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const paymentNetwork = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
        switch(paymentNetwork){
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT:
                if (options && options.swap) {
                    if (!(yield (0, swap_erc20_1.hasApprovalErc20ForSwapToPay)(request, from, options.swap.path[0], provider, options.swap.maxInputAmount))) {
                        return true;
                    }
                } else {
                    throw new Error('No swap options');
                }
                break;
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY:
                {
                    if (!options || !options.conversion || !options.conversion.currency || options.conversion.currency.type !== types_1.RequestLogicTypes.CURRENCY.ERC20) {
                        throw new Error('Conversion settings missing');
                    }
                    if (options.swap) {
                        const amount = options.swap.maxInputAmount ? options.swap.maxInputAmount : ethers_1.BigNumber.from(0);
                        if (!(yield (0, swap_conversion_erc20_1.hasErc20ApprovalForSwapWithConversion)(request, from, options.swap.path[0], provider, amount))) {
                            return true;
                        }
                    } else {
                        throw new Error('No swap options');
                    }
                    break;
                }
        }
        return false;
    });
}
exports.isRequestErc20ApprovalWithSwapNeeded = isRequestErc20ApprovalWithSwapNeeded; //# sourceMappingURL=encoder-approval.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-any-to-erc20.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encodeSwapToPayAnyToErc20Request = exports.prepareSwapToPayAnyToErc20Request = exports.swapToPayAnyToErc20Request = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
/**
 * Processes a transaction to swap tokens and pay an ERC20 Request through a proxy with fees.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param options to override amount, feeAmount and transaction parameters
 */ function swapToPayAnyToErc20Request(request, signerOrProvider = (0, utils_1.getProvider)(), options) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const preparedTx = prepareSwapToPayAnyToErc20Request(request, signerOrProvider, options);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(preparedTx);
        return tx;
    });
}
exports.swapToPayAnyToErc20Request = swapToPayAnyToErc20Request;
/**
 * Processes a transaction to swap tokens and pay an ERC20 Request through a proxy with fees.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param options to override amount, feeAmount and transaction parameters
 */ function prepareSwapToPayAnyToErc20Request(request, signerOrProvider = (0, utils_1.getProvider)(), options) {
    if (!request.extensions[types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY]) {
        throw new Error(`The request must have the payment network any-to-erc20-proxy`);
    }
    const network = request.extensions[types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY].values.network;
    if (!network) {
        throw new Error(`Payment network currency must have a network`);
    }
    const encodedTx = encodeSwapToPayAnyToErc20Request(request, signerOrProvider, options);
    const proxyAddress = smart_contracts_1.erc20SwapConversionArtifact.getAddress(network);
    return Object.assign({
        data: encodedTx,
        to: proxyAddress,
        value: 0
    }, options === null || options === void 0 ? void 0 : options.overrides);
}
exports.prepareSwapToPayAnyToErc20Request = prepareSwapToPayAnyToErc20Request;
/**
 * Encodes the call to pay a request through the ERC20 fee proxy contract, can be used with a Multisig contract.
 * @param request request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum
 * @param options to override amount, feeAmount and transaction parameters
 */ function encodeSwapToPayAnyToErc20Request(request, signerOrProvider = (0, utils_1.getProvider)(), options) {
    var _a, _b;
    const conversionSettings = options.conversion;
    const swapSettings = options.swap;
    if (!conversionSettings) {
        throw new Error(`Conversion Settings are required`);
    }
    if (!swapSettings) {
        throw new Error(`Swap Settings are required`);
    }
    const currencyManager = conversionSettings.currencyManager || currency_1.CurrencyManager.getDefault();
    const network = conversionSettings.currency.network;
    if (!network) {
        throw new Error(`Currency in conversion settings must have a network`);
    }
    currency_1.EvmChains.assertChainSupported(network);
    const requestCurrency = currencyManager.fromStorageCurrency(request.currencyInfo);
    if (!requestCurrency) {
        throw new currency_1.UnsupportedCurrencyError(request.currencyInfo);
    }
    const paymentCurrency = currencyManager.fromStorageCurrency(conversionSettings.currency);
    if (!paymentCurrency) {
        throw new currency_1.UnsupportedCurrencyError(conversionSettings.currency);
    }
    /** On Chain conversion preparation */ // check if conversion currency is accepted
    if (!request.extensions[types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY].values.acceptedTokens.includes(conversionSettings.currency.value)) {
        throw new Error(`The conversion currency is not an accepted token`);
    }
    // Compute the path automatically
    const path = currencyManager.getConversionPath(requestCurrency, paymentCurrency, network);
    if (!path) {
        throw new Error(`Impossible to find a conversion path between from ${requestCurrency.symbol} (${requestCurrency.hash}) to ${paymentCurrency.symbol} (${paymentCurrency.hash})`);
    }
    (0, utils_1.validateConversionFeeProxyRequest)(request, path);
    const signer = (0, utils_1.getSigner)(signerOrProvider);
    const paymentNetworkTokenAddress = conversionSettings.currency.value;
    const { paymentReference, paymentAddress, feeAddress, feeAmount } = (0, utils_1.getRequestPaymentValues)(request);
    const chainlinkDecimal = 8;
    const decimals = (_a = currencyManager.fromStorageCurrency(request.currencyInfo)) === null || _a === void 0 ? void 0 : _a.decimals;
    if (!decimals) {
        throw new Error(`Could not find currency decimals for  ${request.currencyInfo.value}`);
    }
    const decimalPadding = Math.max(chainlinkDecimal - decimals, 0);
    const amountToPay = (0, utils_1.getAmountToPay)(request, options === null || options === void 0 ? void 0 : options.amount).mul(Math.pow(10, decimalPadding));
    const feeToPay = ethers_1.BigNumber.from((options === null || options === void 0 ? void 0 : options.feeAmount) || feeAmount || 0).mul(Math.pow(10, decimalPadding));
    if (swapSettings.path[swapSettings.path.length - 1].toLowerCase() !== paymentNetworkTokenAddress.toLowerCase()) {
        throw new Error('Last item of the path should be the payment currency');
    }
    // eslint-disable-next-line no-magic-numbers
    if (Date.now() > swapSettings.deadline * 1000) {
        throw new Error('A swap with a past deadline will fail, the transaction will not be pushed');
    }
    const conversionProxyAddress = (0, utils_1.getProxyAddress)(request, payment_detection_1.AnyToERC20PaymentDetector.getDeploymentInformation);
    const contractAddress = smart_contracts_1.erc20SwapConversionArtifact.getAddress(network);
    const swapToPayContract = types_1.ERC20SwapToConversion__factory.connect(contractAddress, signer);
    return swapToPayContract.interface.encodeFunctionData('swapTransferWithReference', [
        conversionProxyAddress,
        paymentAddress,
        amountToPay,
        swapSettings.maxInputAmount,
        swapSettings.path,
        path,
        `0x${paymentReference}`,
        feeToPay,
        feeAddress || ethers_1.constants.AddressZero,
        Math.round(swapSettings.deadline / 1000),
        (_b = conversionSettings.maxRateAge) !== null && _b !== void 0 ? _b : 0
    ]);
}
exports.encodeSwapToPayAnyToErc20Request = encodeSwapToPayAnyToErc20Request; //# sourceMappingURL=swap-any-to-erc20.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-proxy.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.prepareEthProxyPaymentTransaction = exports.encodePayEthProxyRequest = exports.payEthProxyRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
/**
 * Processes a transaction to pay an ETH Request with the proxy contract.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param overrides optionally, override default transaction values, like gas.
 */ function payEthProxyRequest(request, signerOrProvider = (0, utils_1.getProvider)(), amount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const { data, to, value } = prepareEthProxyPaymentTransaction(request, amount);
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.payEthProxyRequest = payEthProxyRequest;
/**
 * Encodes the call to pay a request through the ETH proxy contract, can be used with a Multisig contract.
 * @param request request to pay
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 */ function encodePayEthProxyRequest(request) {
    (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA);
    const { paymentReference, paymentAddress } = (0, utils_1.getRequestPaymentValues)(request);
    const proxyContract = types_2.EthereumProxy__factory.createInterface();
    return proxyContract.encodeFunctionData('transferWithReference', [
        paymentAddress,
        `0x${paymentReference}`
    ]);
}
exports.encodePayEthProxyRequest = encodePayEthProxyRequest;
function prepareEthProxyPaymentTransaction(request, amount) {
    (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA);
    const encodedTx = encodePayEthProxyRequest(request);
    const proxyAddress = (0, utils_1.getProxyAddress)(request, (network, version)=>payment_detection_1.EthInputDataPaymentDetector.getDeploymentInformation(network, version));
    const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
    return {
        data: encodedTx,
        to: proxyAddress,
        value: amountToPay
    };
}
exports.prepareEthProxyPaymentTransaction = prepareEthProxyPaymentTransaction; //# sourceMappingURL=eth-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/encoder-payment.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encodeRequestPaymentWithSwap = exports.encodeRequestPaymentWithStream = exports.encodeRequestPaymentWithoutSwap = exports.encodeRequestPayment = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const erc20_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-proxy.js [app-ssr] (ecmascript)");
const erc20_fee_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-fee-proxy.js [app-ssr] (ecmascript)");
const any_to_erc20_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/any-to-erc20-proxy.js [app-ssr] (ecmascript)");
const swap_erc20_fee_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-erc20-fee-proxy.js [app-ssr] (ecmascript)");
const swap_any_to_erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-any-to-erc20.js [app-ssr] (ecmascript)");
const eth_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-proxy.js [app-ssr] (ecmascript)");
const eth_fee_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-fee-proxy.js [app-ssr] (ecmascript)");
const any_to_eth_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/any-to-eth-proxy.js [app-ssr] (ecmascript)");
const erc777_stream_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc777-stream.js [app-ssr] (ecmascript)");
/**
 * Encodes a transaction to pay a Request in generic way. ERC777 stream excepted.
 * @param request the request data to pay
 * @param provider the Web3 provider. Defaults to window.ethereum.
 * @param options optionally, the request payment options.
 */ function encodeRequestPayment(request, provider, options) {
    const formattedRequest = (0, payment_detection_1.flattenRequestByPnId)({
        request,
        pnIdentifier: options === null || options === void 0 ? void 0 : options.pnIdentifier
    });
    if (options && options.swap) {
        return encodeRequestPaymentWithSwap(formattedRequest, provider, options);
    } else {
        return encodeRequestPaymentWithoutSwap(formattedRequest, options);
    }
}
exports.encodeRequestPayment = encodeRequestPayment;
/**
 * Encodes a transaction to pay a Request in generic way without swap.
 * @param request the request data to pay
 * @param options optionally, the request payment options.
 */ function encodeRequestPaymentWithoutSwap(request, options) {
    var _a;
    const paymentNetwork = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
    const amount = (options === null || options === void 0 ? void 0 : options.amount) ? options.amount : undefined;
    const feeAmount = (options === null || options === void 0 ? void 0 : options.feeAmount) ? options.feeAmount : undefined;
    const overrides = (options === null || options === void 0 ? void 0 : options.overrides) ? options.overrides : {};
    switch(paymentNetwork){
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT:
            return Object.assign(Object.assign({}, (0, erc20_proxy_1.prepareErc20ProxyPaymentTransaction)(request, amount)), overrides);
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT:
            return Object.assign(Object.assign({}, (0, erc20_fee_proxy_1.prepareErc20FeeProxyPaymentTransaction)(request, amount, feeAmount)), overrides);
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY:
            {
                if (!options || !options.conversion || !options.conversion.currency || options.conversion.currency.type !== types_1.RequestLogicTypes.CURRENCY.ERC20) {
                    throw new Error('Conversion settings missing');
                }
                return Object.assign(Object.assign({}, (0, any_to_erc20_proxy_1.prepareAnyToErc20ProxyPaymentTransaction)(request, options.conversion, amount, feeAmount)), overrides);
            }
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY:
            {
                if (!options || !options.conversion || !options.conversion.currency || options.conversion.currency.type !== types_1.RequestLogicTypes.CURRENCY.ETH) {
                    throw new Error('Conversion settings missing');
                }
                return Object.assign(Object.assign({}, (0, any_to_eth_proxy_1.prepareAnyToEthProxyPaymentTransaction)(request, options.conversion, amount, feeAmount)), overrides);
            }
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA:
            return Object.assign(Object.assign({}, (0, eth_proxy_1.prepareEthProxyPaymentTransaction)(request, amount)), overrides);
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT:
            return Object.assign(Object.assign({}, (0, eth_fee_proxy_1.prepareEthFeeProxyPaymentTransaction)(request, amount, feeAmount)), overrides);
        default:
            throw new Error('Payment network not found');
    }
}
exports.encodeRequestPaymentWithoutSwap = encodeRequestPaymentWithoutSwap;
/**
 * Encodes a transaction to pay a Request with ERC777 stream.
 * @param request the request data to pay
 * @param provider the Web3 provider. Defaults to window.ethereum.
 * @param options optionally, the request payment options.
 */ function encodeRequestPaymentWithStream(request, provider, options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const paymentNetwork = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
        const overrides = (options === null || options === void 0 ? void 0 : options.overrides) ? options.overrides : {};
        switch(paymentNetwork){
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM:
                return Object.assign(Object.assign({}, (yield (0, erc777_stream_1.prepareErc777StreamPaymentTransaction)(request, provider))), overrides);
            default:
                throw new Error(`Payment network {paymentNetwork} does not support stream`);
        }
    });
}
exports.encodeRequestPaymentWithStream = encodeRequestPaymentWithStream;
/**
 * Encodes a transaction to pay a Request in generic way with swap.
 * @param request the request data to pay
 * @param provider the Web3 provider. Defaults to window.ethereum.
 * @param options optionally, the request payment options.
 */ function encodeRequestPaymentWithSwap(request, provider, options) {
    var _a;
    const paymentNetwork = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
    const amount = (options === null || options === void 0 ? void 0 : options.amount) ? options.amount : undefined;
    const feeAmount = (options === null || options === void 0 ? void 0 : options.feeAmount) ? options.feeAmount : undefined;
    const overrides = (options === null || options === void 0 ? void 0 : options.overrides) ? options.overrides : undefined;
    switch(paymentNetwork){
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT:
            if (options && options.swap) {
                return (0, swap_erc20_fee_proxy_1.prepareSwapToPayErc20FeeRequest)(request, provider, options.swap, {
                    amount,
                    feeAmount,
                    overrides
                });
            } else {
                throw new Error('No swap options');
            }
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY:
            {
                if (!options || !options.conversion || !options.conversion.currency || options.conversion.currency.type !== types_1.RequestLogicTypes.CURRENCY.ERC20) {
                    throw new Error('Conversion settings missing');
                }
                if (options.swap) {
                    return (0, swap_any_to_erc20_1.prepareSwapToPayAnyToErc20Request)(request, provider, options);
                } else {
                    throw new Error('Swap settings missing');
                }
            }
        default:
            throw new Error(`Payment network {paymentNetwork} does not support swap`);
    }
}
exports.encodeRequestPaymentWithSwap = encodeRequestPaymentWithSwap; //# sourceMappingURL=encoder-payment.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/index.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._getPaymentUrl = exports.canSwapToPay = exports.isSolvent = exports.hasSufficientFunds = exports.swapToPayRequest = exports.encodeRequestApprovalAndPayment = exports.payRequest = exports.UnsupportedPaymentChain = exports.UnsupportedNetworkError = exports.noConversionNetworks = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const btc_address_based_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/btc-address-based.js [app-ssr] (ecmascript)");
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)");
const erc20_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)");
const erc777_stream_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc777-stream.js [app-ssr] (ecmascript)");
const eth_input_data_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-input-data.js [app-ssr] (ecmascript)");
const eth_fee_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-fee-proxy.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const any_to_erc20_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/any-to-erc20-proxy.js [app-ssr] (ecmascript)");
const any_to_eth_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/any-to-eth-proxy.js [app-ssr] (ecmascript)");
const utils_near_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils-near.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
const encoder_approval_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/encoder-approval.js [app-ssr] (ecmascript)");
const encoder_payment_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/encoder-payment.js [app-ssr] (ecmascript)");
exports.noConversionNetworks = [
    types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM,
    types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT,
    types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
    types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE,
    types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA,
    types_1.ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN,
    types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT
];
const getPaymentNetwork = (request)=>{
    var _a;
    // eslint-disable-next-line
    const id = (_a = Object.values(request.extensions).find((x)=>x.type === 'payment-network')) === null || _a === void 0 ? void 0 : _a.id;
    if (types_1.TypesUtils.isPaymentNetworkId(id)) {
        return id;
    }
};
/**
 * Error thrown when the network is not supported.
 */ class UnsupportedNetworkError extends Error {
    constructor(networkName){
        super(`Payment network ${networkName} is not supported`);
        this.networkName = networkName;
    }
}
exports.UnsupportedNetworkError = UnsupportedNetworkError;
/**
 * Error thrown when the payment currency network is not supported.
 */ class UnsupportedPaymentChain extends Error {
    constructor(currencyNetworkName){
        super(`Payment currency network ${currencyNetworkName} is not supported`);
        this.currencyNetworkName = currencyNetworkName;
    }
}
exports.UnsupportedPaymentChain = UnsupportedPaymentChain;
/**
 * Processes a transaction to pay a Request.
 * Supported networks:
 * - ERC20_PROXY_CONTRACT
 * - ETH_INPUT_DATA
 * - ERC20_FEE_PROXY_CONTRACT
 * - ANY_TO_ERC20_PROXY
 * - ERC777_STREAM
 * - ERC20_TRANSFERABLE_RECEIVABLE
 *
 * @throws UnsupportedNetworkError if network isn't supported for swap or payment.
 * @throws UnsupportedPaymentChain if the currency network is not supported (eg Near)
 * @param request the request to pay.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 * @param overrides optionally, override default transaction values, like gas.
 */ function payRequest(request, signerOrProvider = (0, utils_1.getProvider)(), amount, overrides, paymentSettings) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        throwIfNotWeb3(request);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const paymentNetwork = getPaymentNetwork(request);
        switch(paymentNetwork){
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT:
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT:
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE:
                return (0, erc20_2.payErc20Request)(request, signer, amount, undefined, overrides);
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM:
                return (0, erc777_stream_1.payErc777StreamRequest)(request, signer);
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ERC20_PROXY:
                {
                    if (!paymentSettings) {
                        throw new Error('Missing payment settings for a payment with conversion');
                    }
                    return (0, any_to_erc20_proxy_1.payAnyToErc20ProxyRequest)(request, signer, paymentSettings, amount, undefined, overrides);
                }
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY:
                {
                    if (!paymentSettings) {
                        throw new Error('Missing payment settings for a payment with conversion');
                    }
                    return (0, any_to_eth_proxy_1.payAnyToEthProxyRequest)(request, signer, paymentSettings, amount, undefined, overrides);
                }
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA:
                return (0, eth_input_data_1.payEthInputDataRequest)(request, signer, amount, overrides);
            case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT:
                return (0, eth_fee_proxy_1.payEthFeeProxyRequest)(request, signer, amount, undefined, overrides);
            default:
                throw new UnsupportedNetworkError(paymentNetwork);
        }
    });
}
exports.payRequest = payRequest;
/**
 * Encode the transactions associated to a request
 * @param request the request to pay.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param options encoding options
 * @returns
 */ function encodeRequestApprovalAndPayment(request, signerOrProvider, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const preparedTransactions = [];
        const approvalTx = yield (0, encoder_approval_1.encodeRequestErc20Approval)(request, signerOrProvider, options);
        if (approvalTx) {
            preparedTransactions.push(approvalTx);
        }
        preparedTransactions.push((0, encoder_payment_1.encodeRequestPayment)(request, signerOrProvider, options));
        return preparedTransactions;
    });
}
exports.encodeRequestApprovalAndPayment = encodeRequestApprovalAndPayment;
/**
 * Processes a transaction to pay a Request with a swap
 * Supported payment networks: ERC20_PROXY_CONTRACT, ETH_INPUT_DATA, ERC20_FEE_PROXY_CONTRACT
 *
 * @throws UnsupportedNetworkError if network isn't supported for swap or payment.
 * @throws UnsupportedPaymentChain if the currency network is not supported (eg Near)
 * @param request the request to pay.
 * @param swapSettings the information of how to swap from another payment token.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay in request currency. Defaults to remaining amount of the request.
 * @param overrides optionally, override default transaction values, like gas.
 */ function swapToPayRequest(request, swapSettings, signerOrProvider = (0, utils_1.getProvider)(), amount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        throwIfNotWeb3(request);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const paymentNetwork = getPaymentNetwork(request);
        if (!canSwapToPay(request)) {
            throw new UnsupportedNetworkError(paymentNetwork);
        }
        return (0, erc20_2.payErc20Request)(request, signer, amount, undefined, overrides, swapSettings);
    });
}
exports.swapToPayRequest = swapToPayRequest;
/**
 * Verifies the address has enough funds to pay the request in its currency.
 * Only supports networks with no (on-chain) conversion.
 *
 * @throws UnsupportedNetworkError if network isn't supported
 * @param request the request to verify.
 * @param address the address holding the funds
 * @param providerOptions.provider the Web3 provider. Defaults to getDefaultProvider.
 * @param providerOptions.nearWalletConnection the Near WalletConnection
 */ function hasSufficientFunds({ request, address, providerOptions, needsGas = true }) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const paymentNetwork = getPaymentNetwork(request);
        if (!paymentNetwork || !exports.noConversionNetworks.includes(paymentNetwork)) {
            throw new UnsupportedNetworkError(paymentNetwork);
        }
        if (!(providerOptions === null || providerOptions === void 0 ? void 0 : providerOptions.nearWalletConnection) && !(providerOptions === null || providerOptions === void 0 ? void 0 : providerOptions.provider)) {
            providerOptions = {
                provider: (0, utils_1.getNetworkProvider)(request)
            };
        }
        let feeAmount = 0;
        if (paymentNetwork === types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT || paymentNetwork === types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT) {
            feeAmount = request.extensions[paymentNetwork].values.feeAmount || 0;
        }
        return isSolvent({
            fromAddress: address,
            currency: request.currencyInfo,
            amount: ethers_1.BigNumber.from(request.expectedAmount).add(feeAmount),
            providerOptions,
            needsGas
        });
    });
}
exports.hasSufficientFunds = hasSufficientFunds;
/**
 * Verifies the address has enough funds to pay an amount in a given currency.
 * Supported chains: EVMs and Near.
 *
 * @param fromAddress the address willing to pay
 * @param providerOptions.provider the Web3 provider. Defaults to getDefaultProvider.
 * @param providerOptions.nearWalletConnection the Near WalletConnection
 * @throws UnsupportedNetworkError if network isn't supported
 */ function isSolvent({ fromAddress, currency, amount, providerOptions, needsGas = true }) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        // Near case
        if (currency_1.NearChains.isChainSupported(currency.network) && (providerOptions === null || providerOptions === void 0 ? void 0 : providerOptions.nearWalletConnection)) {
            return (0, utils_near_1.isNearAccountSolvent)(amount, providerOptions.nearWalletConnection, currency);
        }
        // Main case (EVM)
        if (!(providerOptions === null || providerOptions === void 0 ? void 0 : providerOptions.provider)) {
            throw new Error('provider missing');
        }
        const provider = providerOptions.provider;
        const ethBalance = yield provider.getBalance(fromAddress);
        if (currency.type === 'ETH') {
            return ethBalance.gt(amount);
        } else {
            const balance = yield getCurrencyBalance(fromAddress, currency, provider);
            return (ethBalance.gt(0) || !needsGas) && ethers_1.BigNumber.from(balance).gte(amount);
        }
    });
}
exports.isSolvent = isSolvent;
/**
 * Returns the balance of a given address in a given currency.
 * @param address the address holding the funds
 * @param paymentCurrency if different from the requested currency
 * @param provider the Web3 provider. Defaults to Etherscan.
 * @throws UnsupportedNetworkError if the currency is not implemented.
 */ function getCurrencyBalance(address, paymentCurrency, provider) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        switch(paymentCurrency.type){
            case 'ETH':
                {
                    return provider.getBalance(address);
                }
            case 'ERC777':
            case 'ERC20':
                {
                    return (0, erc20_1.getAnyErc20Balance)(paymentCurrency.value, address, provider);
                }
            default:
                throw new UnsupportedNetworkError(paymentCurrency.network);
        }
    });
}
/**
 * Given a request, the function gives whether swap is supported for its payment network.
 * @param request the request that accepts or not swap to payment
 */ function canSwapToPay(request) {
    const paymentNetwork = getPaymentNetwork(request);
    return paymentNetwork !== undefined && paymentNetwork === types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT;
}
exports.canSwapToPay = canSwapToPay;
/**
 * Get a payment URL, if applicable to the payment network, for a request.
 * BTC: BIP21.
 * ERC20: EIP-681. (Warning, not widely used. Some wallets may not be able to pay.)
 * ETH: EIP-681. (Warning, not widely used. Some wallets may not be able to pay.)
 * @throws UnsupportedNetworkError if the network is not supported.
 * @param request the request to pay
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 */ function _getPaymentUrl(request, amount) {
    const paymentNetwork = getPaymentNetwork(request);
    switch(paymentNetwork){
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT:
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT:
            return (0, erc20_1._getErc20PaymentUrl)(request, amount);
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA:
            return (0, eth_input_data_1._getEthPaymentUrl)(request, amount);
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.BITCOIN_ADDRESS_BASED:
        case types_1.ExtensionTypes.PAYMENT_NETWORK_ID.TESTNET_BITCOIN_ADDRESS_BASED:
            return (0, btc_address_based_1.getBtcPaymentUrl)(request, amount);
        default:
            throw new UnsupportedNetworkError(paymentNetwork);
    }
}
exports._getPaymentUrl = _getPaymentUrl;
// FIXME: should also compare the signer.chainId with the request.currencyInfo.network...
const throwIfNotWeb3 = (request)=>{
    var _a;
    // FIXME: there is a near web3Provider equivalent: https://github.com/aurora-is-near/near-web3-provider
    if (((_a = request.currencyInfo) === null || _a === void 0 ? void 0 : _a.network) && currency_1.NearChains.isChainSupported(request.currencyInfo.network)) {
        throw new UnsupportedPaymentChain(request.currencyInfo.network);
    }
}; //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc777-utils.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkExistingStream = exports.unwrapSuperToken = exports.prepareUnwrapSuperToken = exports.wrapUnderlyingToken = exports.prepareWrapUnderlyingToken = exports.approveUnderlyingToken = exports.prepareApproveUnderlyingToken = exports.checkSuperTokenUnderlyingAllowance = exports.hasEnoughUnderlyingToken = exports.getUnderlyingTokenBalanceOf = exports.getRequestUnderlyingToken = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const erc777_stream_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc777-stream.js [app-ssr] (ecmascript)");
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)");
/**
 * Gets the underlying token address of an ERC777 currency based request
 * @param request the request that contains currency information
 * @param provider the web3 provider. Defaults to Etherscan
 */ function getRequestUnderlyingToken(request, provider = (0, utils_1.getNetworkProvider)(request)) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const id = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
        if (id !== types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM) {
            throw new Error('Not a supported ERC777 payment network request');
        }
        (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM);
        const sf = yield (0, erc777_stream_1.getSuperFluidFramework)(request, provider);
        const superToken = yield sf.loadSuperToken(request.currencyInfo.value);
        if (!superToken.underlyingToken) {
            throw new Error('No underlying token');
        }
        return superToken.underlyingToken;
    });
}
exports.getRequestUnderlyingToken = getRequestUnderlyingToken;
/**
 * Gets the underlying token address of an ERC777 currency based request
 * @param request the request that contains currency information
 * @param provider the web3 provider. Defaults to Etherscan
 */ function getUnderlyingTokenBalanceOf(request, address, provider = (0, utils_1.getNetworkProvider)(request)) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const underlyingToken = yield getRequestUnderlyingToken(request, provider);
        return (0, erc20_1.getAnyErc20Balance)(underlyingToken.address, address, provider);
    });
}
exports.getUnderlyingTokenBalanceOf = getUnderlyingTokenBalanceOf;
/**
 * Check if the user has the specified amount of underlying token
 * @param request the request that contains currency information
 * @param address token owner
 * @param provider the web3 provider. Defaults to Etherscan
 * @param amount the required amount
 */ function hasEnoughUnderlyingToken(request, address, provider = (0, utils_1.getNetworkProvider)(request), amount) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const balance = yield getUnderlyingTokenBalanceOf(request, address, provider);
        return amount.lte(balance);
    });
}
exports.hasEnoughUnderlyingToken = hasEnoughUnderlyingToken;
/**
 * Determine whether or not the supertoken has enough allowance
 * @param request the request that contains currency information
 * @param address token owner
 * @param provider the web3 provider. Defaults to Etherscan
 * @param amount of token required
 */ function checkSuperTokenUnderlyingAllowance(request, address, provider = (0, utils_1.getNetworkProvider)(request), amount = utils_1.MAX_ALLOWANCE) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const underlyingToken = yield getRequestUnderlyingToken(request, provider);
        return (0, erc20_1.checkErc20Allowance)(address, request.currencyInfo.value, provider, underlyingToken.address, amount);
    });
}
exports.checkSuperTokenUnderlyingAllowance = checkSuperTokenUnderlyingAllowance;
/**
 * Get the SF operation to approve the supertoken to spend underlying tokens
 * @param request the request that contains currency information
 * @param provider the web3 provider. Defaults to Etherscan
 * @param amount to allow, defalts to max allowance
 */ function prepareApproveUnderlyingToken(request, provider = (0, utils_1.getNetworkProvider)(request), amount = utils_1.MAX_ALLOWANCE) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const underlyingToken = yield getRequestUnderlyingToken(request, provider);
        return {
            data: (0, erc20_1.encodeApproveAnyErc20)(underlyingToken.address, request.currencyInfo.value, provider, amount),
            to: underlyingToken.address,
            value: 0
        };
    });
}
exports.prepareApproveUnderlyingToken = prepareApproveUnderlyingToken;
/**
 * Approve the supertoken to spend the speicified amount of underlying token
 * @param request the request that contains currency information
 * @param signer the web3 signer
 * @param amount to allow, defaults to max allowance
 * @returns
 */ function approveUnderlyingToken(request, signer, amount = utils_1.MAX_ALLOWANCE) {
    var _a, _b;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!(yield hasEnoughUnderlyingToken(request, (yield signer.getAddress()), (_a = signer.provider) !== null && _a !== void 0 ? _a : (0, utils_1.getProvider)(), amount))) {
            throw new Error('Sender does not have enough underlying token');
        }
        const preparedTx = yield prepareApproveUnderlyingToken(request, (_b = signer.provider) !== null && _b !== void 0 ? _b : (0, utils_1.getProvider)(), amount);
        return signer.sendTransaction(preparedTx);
    });
}
exports.approveUnderlyingToken = approveUnderlyingToken;
/**
 * Prepare the wrap transaction of the specified amount of underlying token into supertoken
 * @param request the request that contains currency information
 * @param provider the web3 provider
 * @param amount to allow, defaults to max allowance
 * @returns
 */ function prepareWrapUnderlyingToken(request, provider = (0, utils_1.getNetworkProvider)(request), amount = utils_1.MAX_ALLOWANCE) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const sf = yield (0, erc777_stream_1.getSuperFluidFramework)(request, provider);
        const superToken = yield sf.loadSuperToken(request.currencyInfo.value);
        return {
            value: 0,
            data: superToken.contract.interface.encodeFunctionData('upgrade', [
                amount
            ]),
            to: superToken.address
        };
    });
}
exports.prepareWrapUnderlyingToken = prepareWrapUnderlyingToken;
/**
 * Wrap the speicified amount of underlying token into supertokens
 * @param request the request that contains currency information
 * @param signer the web3 signer
 * @param amount to allow, defaults to max allowance
 * @returns
 */ function wrapUnderlyingToken(request, signer, amount = utils_1.MAX_ALLOWANCE) {
    var _a, _b;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const senderAddress = yield signer.getAddress();
        const provider = (_a = signer.provider) !== null && _a !== void 0 ? _a : (0, utils_1.getProvider)();
        if (!(yield checkSuperTokenUnderlyingAllowance(request, senderAddress, provider, amount))) {
            throw new Error('Supertoken not allowed to wrap this amount of underlying');
        }
        if (!(yield hasEnoughUnderlyingToken(request, senderAddress, provider, amount))) {
            throw new Error('Sender does not have enough underlying token');
        }
        const preparedTx = yield prepareWrapUnderlyingToken(request, (_b = signer.provider) !== null && _b !== void 0 ? _b : (0, utils_1.getProvider)(), amount);
        return signer.sendTransaction(preparedTx);
    });
}
exports.wrapUnderlyingToken = wrapUnderlyingToken;
/**
 * Prepare the unwrapping transaction of the supertoken (ERC777) into underlying asset (ERC20)
 * @param request the request that contains currency information
 * @param provider the web3 provider
 * @param amount to unwrap
 */ function prepareUnwrapSuperToken(request, provider = (0, utils_1.getNetworkProvider)(request), amount) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const sf = yield (0, erc777_stream_1.getSuperFluidFramework)(request, provider);
        const superToken = yield sf.loadSuperToken(request.currencyInfo.value);
        const underlyingToken = yield getRequestUnderlyingToken(request, provider);
        if (underlyingToken.address === superToken.address) {
            throw new Error('This is a native super token');
        }
        return {
            value: 0,
            data: superToken.contract.interface.encodeFunctionData('downgrade', [
                amount
            ]),
            to: superToken.address
        };
    });
}
exports.prepareUnwrapSuperToken = prepareUnwrapSuperToken;
/**
 * Unwrap the supertoken (ERC777) into underlying asset (ERC20)
 * @param request the request that contains currency information
 * @param signer the web3 signer
 * @param amount to unwrap
 */ function unwrapSuperToken(request, signer, amount) {
    var _a, _b, _c;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const sf = yield (0, erc777_stream_1.getSuperFluidFramework)(request, (_a = signer.provider) !== null && _a !== void 0 ? _a : (0, utils_1.getProvider)());
        const superToken = yield sf.loadSuperToken(request.currencyInfo.value);
        const userAddress = yield signer.getAddress();
        const userBalance = yield superToken.balanceOf({
            account: userAddress,
            providerOrSigner: (_b = signer.provider) !== null && _b !== void 0 ? _b : (0, utils_1.getProvider)()
        });
        if (amount.gt(userBalance)) {
            throw new Error('Sender does not have enough supertoken');
        }
        const preparedTx = yield prepareUnwrapSuperToken(request, (_c = signer.provider) !== null && _c !== void 0 ? _c : (0, utils_1.getProvider)(), amount);
        return signer.sendTransaction(preparedTx);
    });
}
exports.unwrapSuperToken = unwrapSuperToken;
/**
 * Check if there's an existing stream for the trio (Sender, Receiver, Currency)
 * @param sender address
 * @param receiver address
 * @param currency to stream
 * @param provider web3 provider.
 * @returns
 */ function checkExistingStream(request, sender, provider = (0, utils_1.getProvider)()) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const id = (_a = (0, payment_detection_1.getPaymentNetworkExtension)(request)) === null || _a === void 0 ? void 0 : _a.id;
        if (id !== types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM) {
            throw new Error('Not a supported ERC777 payment network request');
        }
        (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM);
        const { paymentAddress } = (0, utils_1.getRequestPaymentValues)(request);
        const sf = yield (0, erc777_stream_1.getSuperFluidFramework)(request, provider);
        const streams = yield sf.query.listStreams({
            sender,
            receiver: paymentAddress,
            token: request.currencyInfo.value
        });
        return streams.data.length > 0 && streams.data[0].currentFlowRate !== '0';
    });
}
exports.checkExistingStream = checkExistingStream; //# sourceMappingURL=erc777-utils.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/near-input-data.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.payNearInputDataRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const utils_near_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils-near.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
const validation_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/utils/validation.js [app-ssr] (ecmascript)");
/**
 * processes the transaction to pay a Near request.
 * @param request the request to pay
 * @param walletConnection the Near provider.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 */ function payNearInputDataRequest(request, walletConnection, amount, callback) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!request.currencyInfo.network || !currency_1.NearChains.isChainSupported(request.currencyInfo.network)) {
            throw new Error('request.currencyInfo should be a Near network');
        }
        currency_1.NearChains.assertChainSupported(request.currencyInfo.network);
        (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN);
        const { paymentReference, paymentAddress } = (0, utils_1.getRequestPaymentValues)(request);
        const amountToPay = (0, utils_1.getAmountToPay)(request, amount).toString();
        const version = (0, utils_1.getPaymentExtensionVersion)(request);
        (0, validation_1.validatePaymentReference)(paymentReference);
        return (0, utils_near_1.processNearPayment)(walletConnection, request.currencyInfo.network, amountToPay, paymentAddress, paymentReference, version, callback);
    });
}
exports.payNearInputDataRequest = payNearInputDataRequest; //# sourceMappingURL=near-input-data.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/near-conversion.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.payNearConversionRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const utils_near_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils-near.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
const validation_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/utils/validation.js [app-ssr] (ecmascript)");
/**
 * Processes the transaction to pay a request in NEAR with on-chain conversion.
 * @param request the request to pay
 * @param walletConnection the Near provider.
 * @param amount optionally, the amount to pay in request currency. Defaults to remaining amount of the request.
 */ function payNearConversionRequest(request, walletConnection, paymentSettings, amount, callback) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_NATIVE_TOKEN);
        const currencyManager = paymentSettings.currencyManager || currency_1.CurrencyManager.getDefault();
        const { paymentReference, paymentAddress, feeAddress, feeAmount, maxRateTimespan, network } = (0, utils_1.getRequestPaymentValues)(request);
        const requestCurrency = currencyManager.fromStorageCurrency(request.currencyInfo);
        if (!requestCurrency) {
            throw new currency_1.UnsupportedCurrencyError(request.currencyInfo);
        }
        (0, validation_1.validatePaymentReference)(paymentReference);
        currency_1.NearChains.assertChainSupported(network);
        const amountToPay = (0, utils_1.getAmountToPay)(request, amount).toString();
        const version = (0, utils_1.getPaymentExtensionVersion)(request);
        return (0, utils_near_1.processNearPaymentWithConversion)(walletConnection, network, amountToPay, paymentAddress, paymentReference, getTicker(request.currencyInfo), feeAddress || '0x', feeAmount || 0, paymentSettings.maxToSpend, maxRateTimespan || '0', version, callback);
    });
}
exports.payNearConversionRequest = payNearConversionRequest;
// FIXME: the previous oracle worked with ticker, this could be deprecated with the next oracle we implement.
const getTicker = (currency)=>{
    switch(currency.type){
        case types_1.RequestLogicTypes.CURRENCY.ISO4217:
            return currency.value;
        default:
            // Warning: the request contract for native payments and conversions only handles 2 decimals, not suited for cryptos.
            throw new Error('Near payment with conversion only implemented for fiat denominations.');
    }
}; //# sourceMappingURL=near-conversion.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/near-fungible.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.payNearFungibleRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const utils_near_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils-near.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
const validation_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/utils/validation.js [app-ssr] (ecmascript)");
/**
 * Processes the transaction to pay a request in fungible token on NEAR with fee (Erc20FeeProxy).
 * @param request the request to pay
 * @param walletConnection the Near provider.
 */ function payNearFungibleRequest(request, walletConnection, amount, callback) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        (0, utils_1.validateRequest)(request, types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT);
        const { paymentReference, paymentAddress, feeAddress, feeAmount, network } = (0, utils_1.getRequestPaymentValues)(request);
        (0, validation_1.validatePaymentReference)(paymentReference);
        currency_1.NearChains.assertChainSupported(network);
        const amountToPay = (0, utils_1.getAmountToPay)(request, amount).toString();
        if (!(yield (0, utils_near_1.isReceiverReady)(walletConnection, request.currencyInfo.value, paymentAddress))) {
            throw new Error(`The paymentAddress is not registered for the token ${request.currencyInfo.value}`);
        }
        const proxyAddress = smart_contracts_1.erc20FeeProxyArtifact.getAddress(network, 'near');
        if (!(yield (0, utils_near_1.isReceiverReady)(walletConnection, request.currencyInfo.value, proxyAddress))) {
            throw new Error(`The proxy is not registered for the token ${request.currencyInfo.value}`);
        }
        return (0, utils_near_1.processNearFungiblePayment)(walletConnection, network, amountToPay, paymentAddress, paymentReference, request.currencyInfo.value, feeAddress || '0x', feeAmount || 0, callback);
    });
}
exports.payNearFungibleRequest = payNearFungibleRequest; //# sourceMappingURL=near-fungible.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/near-amount-with-ref.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.payNearAmountWithReference = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const utils_near_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils-near.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
/**
 * Processes a transaction to make a payment in NEAR token with a reference.
 *
 * @notice This is used to pay a declarative request, with low-level arguments.
 *
 * @param paymentAddress must be a valid NEAR address on the given network.
 * @param network e.g. 'near'
 * @param paymentReference used to index payments.
 * @param walletConnection the Near provider.
 * @param amount amount to pay, in NEAR tokens.
 */ // FIXME: We could improve the method's interface by enforcing a type on `paymentInfo` for declarative requests.
function payNearAmountWithReference(paymentAddress, paymentReference, network, walletConnection, amount, callback) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        currency_1.NearChains.assertChainSupported(network);
        return (0, utils_near_1.processNearPayment)(walletConnection, network, amount, paymentAddress, paymentReference, '0.2.0', callback);
    });
}
exports.payNearAmountWithReference = payNearAmountWithReference; //# sourceMappingURL=near-amount-with-ref.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/batch-proxy.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encodeApproveErc20Batch = exports.prepareApproveErc20Batch = exports.approveErc20Batch = exports.hasErc20BatchApproval = exports.approveErc20BatchIfNeeded = exports.getBatchProxyAddress = exports.getBatchArgs = exports.encodePayBatchRequest = exports.prepareBatchPaymentTransaction = exports.payBatchProxyRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const eth_fee_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-fee-proxy.js [app-ssr] (ecmascript)");
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
/**
 * ERC20 Batch Proxy payment details:
 *   batch of request with the same payment network type: ERC20
 *   batch of request with the same payment network version
 *   2 modes available: single token or multi tokens
 * It requires batch proxy's approval
 *
 * Eth Batch Proxy payment details:
 *   batch of request with the same payment network type
 *   batch of request with the same payment network version
 * -> Eth batch proxy accepts requests with 2 id: ethProxy and ethFeeProxy
 *    but only call ethFeeProxy. It can impact payment detection
 */ /**
 * Processes a transaction to pay a batch of ETH Requests with fees.
 * Requests paymentType must be "ETH" or "ERC20"
 * @param requests List of requests
 * @param version The version version of the batch proxy, which can be different from request pn version
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param batchFee Only for batch ETH: additional fee applied to a batch, between 0 and 1000, default value = 10
 * @param overrides optionally, override default transaction values, like gas.
 */ function payBatchProxyRequest(requests, version, signerOrProvider = (0, utils_1.getProvider)(), batchFee, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const { data, to, value } = prepareBatchPaymentTransaction(requests, version, batchFee);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.payBatchProxyRequest = payBatchProxyRequest;
/**
 * Prepate the transaction to pay a batch of requests through the batch proxy contract, can be used with a Multisig contract.
 * Requests paymentType must be "ETH" or "ERC20"
 * @param requests list of ETH requests to pay
 * @param version The version version of the batch proxy, which can be different from request pn version
 * @param batchFee additional fee applied to a batch
 */ function prepareBatchPaymentTransaction(requests, version, batchFee) {
    const encodedTx = encodePayBatchRequest(requests);
    const proxyAddress = getBatchProxyAddress(requests[0], version);
    let totalAmount = 0;
    if (requests[0].currencyInfo.type === 'ETH') {
        const { amountsToPay, feesToPay } = getBatchArgs(requests);
        const amountToPay = amountsToPay.reduce((sum, current)=>sum.add(current), ethers_1.BigNumber.from(0));
        const batchFeeToPay = ethers_1.BigNumber.from(amountToPay).mul(batchFee).div(1000);
        const feeToPay = feesToPay.reduce((sum, current)=>sum.add(current), ethers_1.BigNumber.from(batchFeeToPay));
        totalAmount = amountToPay.add(feeToPay).toNumber();
    }
    return {
        data: encodedTx,
        to: proxyAddress,
        value: totalAmount
    };
}
exports.prepareBatchPaymentTransaction = prepareBatchPaymentTransaction;
/**
 * Encodes the call to pay a batch of requests through the ERC20Bacth or ETHBatch proxy contract,
 * can be used with a Multisig contract.
 * @param requests list of ECR20 requests to pay
 * @dev pn version of the requests is checked to avoid paying with two differents proxies (e.g: erc20proxy v1 and v2)
 */ function encodePayBatchRequest(requests) {
    const { tokenAddresses, paymentAddresses, amountsToPay, paymentReferences, feesToPay, feeAddressUsed } = getBatchArgs(requests);
    const proxyContract = types_1.BatchPayments__factory.createInterface();
    if (requests[0].currencyInfo.type === 'ERC20') {
        let isMultiTokens = false;
        for(let i = 0; tokenAddresses.length; i++){
            if (tokenAddresses[0] !== tokenAddresses[i]) {
                isMultiTokens = true;
                break;
            }
        }
        const pn = (0, payment_detection_1.getPaymentNetworkExtension)(requests[0]);
        for(let i = 0; i < requests.length; i++){
            (0, utils_1.validateErc20FeeProxyRequest)(requests[i]);
            (0, utils_1.comparePnTypeAndVersion)(pn, requests[i]);
        }
        if (isMultiTokens) {
            return proxyContract.encodeFunctionData('batchERC20PaymentsMultiTokensWithReference', [
                tokenAddresses,
                paymentAddresses,
                amountsToPay,
                paymentReferences,
                feesToPay,
                feeAddressUsed
            ]);
        } else {
            return proxyContract.encodeFunctionData('batchERC20PaymentsWithReference', [
                tokenAddresses[0],
                paymentAddresses,
                amountsToPay,
                paymentReferences,
                feesToPay,
                feeAddressUsed
            ]);
        }
    } else {
        tokenAddresses;
        return proxyContract.encodeFunctionData('batchEthPaymentsWithReference', [
            paymentAddresses,
            amountsToPay,
            paymentReferences,
            feesToPay,
            feeAddressUsed
        ]);
    }
}
exports.encodePayBatchRequest = encodePayBatchRequest;
/**
 * Get batch arguments
 * @param requests List of requests
 * @param forcedPaymentType It force to considere the request as an ETH or an ERC20 payment
 * @returns List with the args required by batch Eth and Erc20 functions,
 * @dev tokenAddresses returned is for batch Erc20 functions
 */ function getBatchArgs(requests, forcedPaymentType) {
    const tokenAddresses = [];
    const paymentAddresses = [];
    const amountsToPay = [];
    const paymentReferences = [];
    const feesToPay = [];
    let feeAddressUsed = ethers_1.constants.AddressZero;
    const paymentType = forcedPaymentType !== null && forcedPaymentType !== void 0 ? forcedPaymentType : requests[0].currencyInfo.type;
    for(let i = 0; i < requests.length; i++){
        if (paymentType === 'ETH') {
            (0, eth_fee_proxy_1.validateEthFeeProxyRequest)(requests[i]);
        } else if (paymentType === 'ERC20') {
            (0, utils_1.validateErc20FeeProxyRequest)(requests[i]);
        } else {
            throw new Error(`paymentType ${paymentType} is not supported for batch payment`);
        }
        const tokenAddress = requests[i].currencyInfo.value;
        const { paymentReference, paymentAddress, feeAddress, feeAmount } = (0, utils_1.getRequestPaymentValues)(requests[i]);
        tokenAddresses.push(tokenAddress);
        paymentAddresses.push(paymentAddress);
        amountsToPay.push((0, utils_1.getAmountToPay)(requests[i]));
        paymentReferences.push(`0x${paymentReference}`);
        feesToPay.push(ethers_1.BigNumber.from(feeAmount || 0));
        feeAddressUsed = feeAddress || ethers_1.constants.AddressZero;
    }
    return {
        tokenAddresses,
        paymentAddresses,
        amountsToPay,
        paymentReferences,
        feesToPay,
        feeAddressUsed
    };
}
exports.getBatchArgs = getBatchArgs;
/**
 * Get Batch contract Address
 * @param request The request to pay
 * @param version The version of the batch proxy, which can be different from request pn version
 */ function getBatchProxyAddress(request, version) {
    const pn = (0, payment_detection_1.getPaymentNetworkExtension)(request);
    const pnId = pn === null || pn === void 0 ? void 0 : pn.id;
    if (!pnId) {
        throw new Error('No payment network Id');
    }
    const { network } = request.currencyInfo;
    if (!network) {
        throw new Error('No currency network');
    }
    currency_1.EvmChains.assertChainSupported(network);
    const proxyAddress = smart_contracts_1.batchPaymentsArtifact.getAddress(network, version);
    if (!proxyAddress) {
        throw new Error(`No deployment found for network ${pn}, version ${pn === null || pn === void 0 ? void 0 : pn.version}`);
    }
    return proxyAddress;
}
exports.getBatchProxyAddress = getBatchProxyAddress;
/**
 * ERC20 Batch proxy approvals methods
 */ /**
 * Processes the approval transaction of the targeted ERC20 with batch proxy.
 * @param request The request to pay
 * @param account The account that will be used to pay the request
 * @param version The version version of the batch proxy, which can be different from request pn version
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function approveErc20BatchIfNeeded(request, account, version, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!(yield hasErc20BatchApproval(request, account, version, signerOrProvider))) {
            return approveErc20Batch(request, version, (0, utils_1.getSigner)(signerOrProvider), overrides);
        }
    });
}
exports.approveErc20BatchIfNeeded = approveErc20BatchIfNeeded;
/**
 * Checks if the batch proxy has the necessary allowance from a given account
 * to pay a given request with ERC20 batch
 * @param request The request to pay
 * @param account The account that will be used to pay the request
 * @param version The version version of the batch proxy, which can be different from request pn version
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 */ function hasErc20BatchApproval(request, account, version, signerOrProvider = (0, utils_1.getProvider)()) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        return (0, erc20_1.checkErc20Allowance)(account, getBatchProxyAddress(request, version), signerOrProvider, request.currencyInfo.value, request.expectedAmount);
    });
}
exports.hasErc20BatchApproval = hasErc20BatchApproval;
/**
 * Processes the transaction to approve the batch proxy to spend signer's tokens to pay
 * the request in its payment currency. Can be used with a Multisig contract.
 * @param request The request to pay
 * @param version The version version of the batch proxy, which can be different from request pn version
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function approveErc20Batch(request, version, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const preparedTx = prepareApproveErc20Batch(request, version, signerOrProvider, overrides);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(preparedTx);
        return tx;
    });
}
exports.approveErc20Batch = approveErc20Batch;
/**
 * Prepare the transaction to approve the proxy to spend signer's tokens to pay
 * the request in its payment currency. Can be used with a Multisig contract.
 * @param request The request to pay
 * @param version The version version of the batch proxy, which can be different from request pn version
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function prepareApproveErc20Batch(request, version, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    const encodedTx = encodeApproveErc20Batch(request, version, signerOrProvider);
    const tokenAddress = request.currencyInfo.value;
    return Object.assign({
        data: encodedTx,
        to: tokenAddress,
        value: 0
    }, overrides);
}
exports.prepareApproveErc20Batch = prepareApproveErc20Batch;
/**
 * Encodes the transaction to approve the batch proxy to spend signer's tokens to pay
 * the request in its payment currency. Can be used with a Multisig contract.
 * @param request The request to pay
 * @param version The version version of the batch proxy, which can be different from request pn version
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 */ function encodeApproveErc20Batch(request, version, signerOrProvider = (0, utils_1.getProvider)()) {
    const proxyAddress = getBatchProxyAddress(request, version);
    return (0, erc20_1.encodeApproveAnyErc20)(request.currencyInfo.value, proxyAddress, (0, utils_1.getSigner)(signerOrProvider));
}
exports.encodeApproveErc20Batch = encodeApproveErc20Batch; //# sourceMappingURL=batch-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/batch-conversion-proxy.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encodeApproveErc20BatchConversion = exports.prepareApproveErc20BatchConversion = exports.approveErc20BatchConversion = exports.hasErc20BatchConversionApproval = exports.approveErc20BatchConversionIfNeeded = exports.getBatchConversionProxyAddress = exports.prepareBatchConversionPaymentTransaction = exports.payBatchConversionProxyRequest = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const any_to_erc20_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/any-to-erc20-proxy.js [app-ssr] (ecmascript)");
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
const eth_fee_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-fee-proxy.js [app-ssr] (ecmascript)");
const any_to_eth_proxy_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/any-to-eth-proxy.js [app-ssr] (ecmascript)");
const CURRENCY = types_2.RequestLogicTypes.CURRENCY;
/**
 * Processes a transaction to pay a batch of requests with an ERC20 currency
 * that can be different from the request currency (eg. fiat)
 * The payment is made through ERC20 or ERC20Conversion proxies
 * It can be used with a Multisig contract
 * @param enrichedRequests List of EnrichedRequests to pay.
 * @param signerOrProvider The Web3 provider, or signer. Defaults to window.ethereum.
 * @param options It contains 3 paramaters required to do a batch payments:
 *  - conversion: It must contains the currencyManager.
 *  - skipFeeUSDLimit: It checks the value of batchFeeAmountUSDLimit of the batch proxy deployed.
 * Setting the value to true skips the USD fee limit, and reduces gas consumption.
 *  - version: The version of the batch conversion proxy.
 * @param overrides Optionally, override default transaction values, like gas.
 * @dev We only implement batchPayments using two ERC20 functions:
 *      batchMultiERC20ConversionPayments, and batchMultiERC20Payments.
 */ function payBatchConversionProxyRequest(enrichedRequests, signerOrProvider = (0, utils_1.getProvider)(), options, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const { data, to, value } = prepareBatchConversionPaymentTransaction(enrichedRequests, options);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        return signer.sendTransaction(Object.assign({
            data,
            to,
            value
        }, overrides));
    });
}
exports.payBatchConversionProxyRequest = payBatchConversionProxyRequest;
/**
 * Prepares a transaction to pay a batch of requests with an ERC20 currency
 * that can be different from the request currency (eg. fiat).
 * It can be used with a Multisig contract.
 * @param enrichedRequests List of EnrichedRequests to pay.
 * @param options It contains 3 paramaters required to prepare a batch payments:
 *  - conversion: It must contains the currencyManager.
 *  - skipFeeUSDLimit: It checks the value of batchFeeAmountUSDLimit of the batch proxy deployed.
 * Setting the value to true skips the USD fee limit, and reduces gas consumption.
 *  - version: The version of the batch conversion proxy.
 */ function prepareBatchConversionPaymentTransaction(enrichedRequests, options) {
    const encodedTx = encodePayBatchConversionRequest(enrichedRequests, options.skipFeeUSDLimit, options.conversion);
    const value = getBatchTxValue(enrichedRequests);
    const proxyAddress = getBatchConversionProxyAddress(enrichedRequests[0].request, options.version);
    return {
        data: encodedTx,
        to: proxyAddress,
        value
    };
}
exports.prepareBatchConversionPaymentTransaction = prepareBatchConversionPaymentTransaction;
const mapPnToDetailsBuilder = {
    'pn-any-to-erc20-proxy': getRequestDetailWithConversion,
    'pn-any-to-eth-proxy': getRequestDetailWithConversion,
    'pn-erc20-fee-proxy-contract': getRequestDetailWithoutConversion,
    'pn-eth-fee-proxy-contract': getRequestDetailWithoutConversion
};
const mapPnToAllowedCurrencies = {
    'pn-any-to-erc20-proxy': [
        CURRENCY.ERC20,
        CURRENCY.ISO4217,
        CURRENCY.ETH
    ],
    'pn-any-to-eth-proxy': [
        CURRENCY.ERC20,
        CURRENCY.ISO4217
    ],
    'pn-erc20-fee-proxy-contract': [
        CURRENCY.ERC20
    ],
    'pn-eth-fee-proxy-contract': [
        CURRENCY.ETH
    ]
};
const mapPnToBatchId = {
    'pn-any-to-erc20-proxy': types_2.PaymentTypes.BATCH_PAYMENT_NETWORK_ID.BATCH_MULTI_ERC20_CONVERSION_PAYMENTS,
    'pn-any-to-eth-proxy': types_2.PaymentTypes.BATCH_PAYMENT_NETWORK_ID.BATCH_ETH_CONVERSION_PAYMENTS,
    'pn-erc20-fee-proxy-contract': types_2.PaymentTypes.BATCH_PAYMENT_NETWORK_ID.BATCH_MULTI_ERC20_PAYMENTS,
    'pn-eth-fee-proxy-contract': types_2.PaymentTypes.BATCH_PAYMENT_NETWORK_ID.BATCH_ETH_PAYMENTS
};
const computeRequestDetails = ({ enrichedRequest, extension })=>{
    const paymentNetworkId = enrichedRequest.paymentNetworkId;
    const allowedCurrencies = mapPnToAllowedCurrencies[paymentNetworkId];
    const detailsBuilder = mapPnToDetailsBuilder[paymentNetworkId];
    const isNative = paymentNetworkId === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY || paymentNetworkId === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT;
    extension = extension !== null && extension !== void 0 ? extension : (0, payment_detection_1.getPaymentNetworkExtension)(enrichedRequest.request);
    (0, utils_1.comparePnTypeAndVersion)(extension, enrichedRequest.request);
    if (!allowedCurrencies.includes(enrichedRequest.request.currencyInfo.type)) {
        throw new Error(`wrong request currencyInfo type`);
    }
    return {
        input: detailsBuilder(enrichedRequest, isNative),
        extension
    };
};
/**
 * Encodes a transaction to pay a batch of requests with an ERC20 currency
 * that can be different from the request currency (eg. fiat).
 * It can be used with a Multisig contract.
 * @param enrichedRequests List of EnrichedRequests to pay.
 * @param skipFeeUSDLimit It checks the value of batchFeeAmountUSDLimit of the batch proxy deployed.
 * Setting the value to true skips the USD fee limit, and reduces gas consumption.
 */ function encodePayBatchConversionRequest(enrichedRequests, skipFeeUSDLimit = false, conversion) {
    if (!(conversion && conversion.currencyManager)) {
        throw 'the conversion object or the currencyManager is undefined';
    }
    const { feeAddress } = (0, utils_1.getRequestPaymentValues)(enrichedRequests[0].request);
    const { network } = (0, utils_1.getPnAndNetwork)(enrichedRequests[0].request);
    const requestDetails = {
        'pn-any-to-erc20-proxy': [],
        'pn-any-to-eth-proxy': [],
        'pn-erc20-fee-proxy-contract': [],
        'pn-eth-fee-proxy-contract': []
    };
    const requestExtensions = {
        'pn-any-to-erc20-proxy': undefined,
        'pn-any-to-eth-proxy': undefined,
        'pn-erc20-fee-proxy-contract': undefined,
        'pn-eth-fee-proxy-contract': undefined
    };
    for (const enrichedRequest of enrichedRequests){
        const request = enrichedRequest.request;
        const { input, extension } = computeRequestDetails({
            enrichedRequest,
            extension: requestExtensions[enrichedRequest.paymentNetworkId]
        });
        requestDetails[enrichedRequest.paymentNetworkId].push(input);
        requestExtensions[enrichedRequest.paymentNetworkId] = extension;
        if (network !== (0, utils_1.getPnAndNetwork)(request).network) throw new Error('All the requests must have the same network');
    }
    /**
     * The native with conversion payment inputs must be the last element.
     * See BatchConversionPayment batchPayments method in @requestnetwork/smart-contracts
     */ const metaDetails = Object.entries(requestDetails).map(([pn, details])=>({
            paymentNetworkId: mapPnToBatchId[pn],
            requestDetails: details
        })).filter((details)=>details.requestDetails.length > 0).sort((a, b)=>a.paymentNetworkId - b.paymentNetworkId);
    const hasNativePayment = requestDetails['pn-any-to-eth-proxy'].length > 0 || requestDetails['pn-eth-fee-proxy-contract'].length > 0;
    const pathsToUSD = getUSDPathsForFeeLimit([
        ...metaDetails.map((details)=>details.requestDetails).flat()
    ], network, skipFeeUSDLimit, conversion.currencyManager, hasNativePayment);
    const proxyContract = types_1.BatchConversionPayments__factory.createInterface();
    return proxyContract.encodeFunctionData('batchPayments', [
        metaDetails,
        pathsToUSD,
        feeAddress || ethers_1.constants.AddressZero
    ]);
}
/**
 * Get the batch input associated to a request without conversion.
 * @param enrichedRequest The enrichedRequest to pay.
 */ function getRequestDetailWithoutConversion(enrichedRequest, isNative) {
    var _a, _b;
    const request = enrichedRequest.request;
    isNative ? (0, eth_fee_proxy_1.validateEthFeeProxyRequest)(request) : (0, utils_1.validateErc20FeeProxyRequest)(request);
    const currencyManager = ((_a = enrichedRequest.paymentSettings) === null || _a === void 0 ? void 0 : _a.currencyManager) || currency_1.CurrencyManager.getDefault();
    const tokenAddress = isNative ? (_b = currencyManager.getNativeCurrency(types_2.RequestLogicTypes.CURRENCY.ETH, request.currencyInfo.network)) === null || _b === void 0 ? void 0 : _b.hash : request.currencyInfo.value;
    if (!tokenAddress) {
        throw new Error('Could not find the request currency');
    }
    const { paymentReference, paymentAddress, feeAmount } = (0, utils_1.getRequestPaymentValues)(request);
    return {
        recipient: paymentAddress,
        requestAmount: (0, utils_1.getAmountToPay)(request).toString(),
        path: [
            tokenAddress
        ],
        paymentReference: `0x${paymentReference}`,
        feeAmount: (feeAmount === null || feeAmount === void 0 ? void 0 : feeAmount.toString()) || '0',
        maxToSpend: '0',
        maxRateTimespan: '0'
    };
}
/**
 * Get the batch input associated to a request with conversion.
 * @param enrichedRequest The enrichedRequest to pay.
 */ function getRequestDetailWithConversion(enrichedRequest, isNative) {
    var _a;
    const { request, paymentSettings } = enrichedRequest;
    const { path, requestCurrency } = (isNative ? any_to_eth_proxy_1.getConversionPathForEthRequest : any_to_erc20_proxy_1.getConversionPathForErc20Request)(request, paymentSettings);
    isNative ? (0, eth_fee_proxy_1.validateEthFeeProxyRequest)(request, undefined, undefined, types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY) : (0, utils_1.validateConversionFeeProxyRequest)(request, path);
    const { paymentReference, paymentAddress, feeAmount, maxRateTimespan } = (0, utils_1.getRequestPaymentValues)(request);
    const requestAmount = ethers_1.BigNumber.from(request.expectedAmount).sub(((_a = request.balance) === null || _a === void 0 ? void 0 : _a.balance) || 0);
    const padRequestAmount = (0, payment_detection_1.padAmountForChainlink)(requestAmount, requestCurrency);
    const padFeeAmount = (0, payment_detection_1.padAmountForChainlink)(feeAmount || 0, requestCurrency);
    return {
        recipient: paymentAddress,
        requestAmount: padRequestAmount.toString(),
        path: path,
        paymentReference: `0x${paymentReference}`,
        feeAmount: padFeeAmount.toString(),
        maxToSpend: paymentSettings.maxToSpend.toString(),
        maxRateTimespan: maxRateTimespan || '0'
    };
}
const getBatchTxValue = (enrichedRequests)=>{
    return enrichedRequests.reduce((prev, curr)=>{
        if (curr.paymentNetworkId !== types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY && curr.paymentNetworkId !== types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT) return prev;
        return prev.add(curr.paymentNetworkId === types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ANY_TO_ETH_PROXY ? curr.paymentSettings.maxToSpend : (0, utils_1.getAmountToPay)(curr.request));
    }, ethers_1.BigNumber.from(0));
};
/**
 * Get the list of conversion paths from tokens to the USD address through currencyManager.
 * If there is no path to USD for a token, it goes to the next token.
 * @param requestDetails List of ERC20 requests to pay.
 * @param network The network targeted.
 * @param skipFeeUSDLimit Setting the value to true skips the USD fee limit, it skips the path calculation.
 * @param currencyManager The currencyManager used to get token conversion paths to USD.
 */ function getUSDPathsForFeeLimit(requestDetails, network, skipFeeUSDLimit, currencyManager, hasNativePayment) {
    var _a;
    if (skipFeeUSDLimit) return [];
    const USDCurrency = currencyManager.fromSymbol('USD');
    if (!USDCurrency) throw 'Cannot find the USD currency information';
    // Native to USD conversion path
    let nativeConversionPath = [];
    if (hasNativePayment) {
        const nativeCurrencyHash = (_a = currencyManager.getNativeCurrency(types_2.RequestLogicTypes.CURRENCY.ETH, network)) === null || _a === void 0 ? void 0 : _a.hash;
        if (!nativeCurrencyHash) throw 'Cannot find the Native currency information';
        nativeConversionPath = currencyManager.getConversionPath({
            hash: nativeCurrencyHash
        }, USDCurrency, network) || [];
    }
    // get a list of unique token addresses
    const tokenAddresses = requestDetails.map((rd)=>rd.path[rd.path.length - 1]).filter((value, index, self)=>self.indexOf(value) === index);
    // get the token currencies and keep the one that are defined
    const tokenCurrencies = tokenAddresses.map((token)=>currencyManager.fromAddress(token, network)).filter((value)=>!!value);
    // get all the conversion paths to USD when it exists and return it
    const path = tokenCurrencies.map((t)=>currencyManager.getConversionPath(t, USDCurrency, network)).filter((value)=>!!value);
    return hasNativePayment ? path.concat([
        nativeConversionPath
    ]) : path;
}
/**
 * @param network The network targeted.
 * @param version The version of the batch conversion proxy, the last one by default.
 * @returns
 */ function getBatchDeploymentInformation(network, version) {
    return {
        address: smart_contracts_1.batchConversionPaymentsArtifact.getAddress(network, version)
    };
}
/**
 * Gets batch conversion contract Address.
 * @param request The request for an ERC20 payment with/out conversion.
 * @param version The version of the batch conversion proxy.
 */ function getBatchConversionProxyAddress(request, version) {
    return (0, utils_1.getProxyAddress)(request, getBatchDeploymentInformation, version);
}
exports.getBatchConversionProxyAddress = getBatchConversionProxyAddress;
/**
 * ERC20 Batch conversion proxy approvals methods
 */ /**
 * Processes the approval transaction of the targeted ERC20 with batch conversion proxy.
 * @param request The request for an ERC20 payment with/out conversion.
 * @param account The account that will be used to pay the request
 * @param signerOrProvider The Web3 provider, or signer. Defaults to window.ethereum.
 * @param paymentSettings The payment settings are necessary for conversion payment approval.
 * @param version The version of the batch conversion proxy, which can be different from request pn version.
 * @param overrides Optionally, override default transaction values, like gas.
 */ function approveErc20BatchConversionIfNeeded(request, account, signerOrProvider = (0, utils_1.getProvider)(), amount = utils_1.MAX_ALLOWANCE, paymentSettings, version, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!(yield hasErc20BatchConversionApproval(request, account, signerOrProvider, paymentSettings, version))) {
            return approveErc20BatchConversion(request, (0, utils_1.getSigner)(signerOrProvider), amount, paymentSettings, version, overrides);
        }
    });
}
exports.approveErc20BatchConversionIfNeeded = approveErc20BatchConversionIfNeeded;
/**
 * Checks if the batch conversion proxy has the necessary allowance from a given account
 * to pay a given request with ERC20 batch conversion proxy
 * @param request The request for an ERC20 payment with/out conversion.
 * @param account The account that will be used to pay the request
 * @param signerOrProvider The Web3 provider, or signer. Defaults to window.ethereum.
 * @param paymentSettings The payment settings are necessary for conversion payment approval.
 * @param version The version of the batch conversion proxy.
 */ function hasErc20BatchConversionApproval(request, account, signerOrProvider = (0, utils_1.getProvider)(), paymentSettings, version) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        return (0, erc20_1.checkErc20Allowance)(account, getBatchConversionProxyAddress(request, version), signerOrProvider, getTokenAddress(request, paymentSettings), request.expectedAmount);
    });
}
exports.hasErc20BatchConversionApproval = hasErc20BatchConversionApproval;
/**
 * Processes the transaction to approve the batch conversion proxy to spend signer's tokens to pay
 * the request in its payment currency. Can be used with a Multisig contract.
 * @param request The request for an ERC20 payment with/out conversion.
 * @param signerOrProvider The Web3 provider, or signer. Defaults to window.ethereum.
 * @param paymentSettings The payment settings are necessary for conversion payment approval.
 * @param version The version of the batch conversion proxy, which can be different from request pn version.
 * @param overrides Optionally, override default transaction values, like gas.
 */ function approveErc20BatchConversion(request, signerOrProvider = (0, utils_1.getProvider)(), amount = utils_1.MAX_ALLOWANCE, paymentSettings, version, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const preparedTx = prepareApproveErc20BatchConversion(request, signerOrProvider, amount, paymentSettings, version, overrides);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(preparedTx);
        return tx;
    });
}
exports.approveErc20BatchConversion = approveErc20BatchConversion;
/**
 * Prepare the transaction to approve the proxy to spend signer's tokens to pay
 * the request in its payment currency. Can be used with a Multisig contract.
 * @param request The request for an ERC20 payment with/out conversion.
 * @param signerOrProvider The Web3 provider, or signer. Defaults to window.ethereum.
 * @param paymentSettings The payment settings are necessary for conversion payment approval.
 * @param version The version of the batch conversion proxy.
 * @param overrides Optionally, override default transaction values, like gas.
 */ function prepareApproveErc20BatchConversion(request, signerOrProvider = (0, utils_1.getProvider)(), amount = utils_1.MAX_ALLOWANCE, paymentSettings, version, overrides) {
    const encodedTx = encodeApproveErc20BatchConversion(request, signerOrProvider, amount, paymentSettings, version);
    return Object.assign({
        data: encodedTx,
        to: getTokenAddress(request, paymentSettings),
        value: 0
    }, overrides);
}
exports.prepareApproveErc20BatchConversion = prepareApproveErc20BatchConversion;
/**
 * Encodes the transaction to approve the batch conversion proxy to spend signer's tokens to pay
 * the request in its payment currency. Can be used with a Multisig contract.
 * @param request The request for an ERC20 payment with/out conversion.
 * @param signerOrProvider The Web3 provider, or signer. Defaults to window.ethereum.
 * @param paymentSettings The payment settings are necessary for conversion payment approval.
 * @param version The version of the batch conversion proxy.
 */ function encodeApproveErc20BatchConversion(request, signerOrProvider = (0, utils_1.getProvider)(), amount = utils_1.MAX_ALLOWANCE, paymentSettings, version) {
    const proxyAddress = getBatchConversionProxyAddress(request, version);
    return (0, erc20_1.encodeApproveAnyErc20)(getTokenAddress(request, paymentSettings), proxyAddress, (0, utils_1.getSigner)(signerOrProvider), amount);
}
exports.encodeApproveErc20BatchConversion = encodeApproveErc20BatchConversion;
/**
 * Get the address of the token to interact with,
 * if it is a conversion payment, the info is inside paymentSettings
 * @param request The request for an ERC20 payment with/out conversion.
 * @param paymentSettings The payment settings are necessary for conversion payment
 * */ function getTokenAddress(request, paymentSettings) {
    if (paymentSettings) {
        if (!paymentSettings.currency) throw 'paymentSetting must have a currency';
        return paymentSettings.currency.value;
    }
    return request.currencyInfo.value;
} //# sourceMappingURL=batch-conversion-proxy.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-escrow-payment.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encodeRefundFrozenFunds = exports.encodeRevertEmergencyClaim = exports.encodeCompleteEmergencyClaim = exports.encodeInitiateEmergencyClaim = exports.encodePayRequestFromEscrow = exports.encodeFreezeRequest = exports.preparePayEscrow = exports.encodePayEscrow = exports.refundFrozenFunds = exports.revertEmergencyClaim = exports.completeEmergencyClaim = exports.initiateEmergencyClaim = exports.payRequestFromEscrow = exports.freezeRequest = exports.payEscrow = exports.approveErc20ForEscrow = exports.prepareErc20EscrowApproval = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
/* eslint-disable @typescript-eslint/no-non-null-assertion */ const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const utils_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
const erc20_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)");
const currency_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+currency@0.23.0/node_modules/@requestnetwork/currency/dist/index.js [app-ssr] (ecmascript)");
/**
 * Returns the EscrowToPay contract address corresponding to the request payment network
 * @param request request to pay
 */ function getContractAddress(request) {
    const { network } = request.currencyInfo;
    currency_1.EvmChains.assertChainSupported(network);
    return smart_contracts_1.erc20EscrowToPayArtifact.getAddress(network);
}
/**
 * Prepare the approval transaction of the payment ERC20 to be spent by the escrow contract
 * @param request request to pay
 * @param paymentTokenAddress currency to approve
 * @param signerOrProvider the web3 provider
 * @param overrides optionally overrides default transaction values, like gas
 * @returns the prepared transaction
 */ function prepareErc20EscrowApproval(request, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), amount, overrides) {
    const contractAddress = getContractAddress(request);
    const encodedTx = (0, erc20_1.encodeApproveAnyErc20)(paymentTokenAddress, contractAddress, signerOrProvider, amount);
    return Object.assign({
        data: encodedTx,
        to: paymentTokenAddress,
        value: 0
    }, overrides);
}
exports.prepareErc20EscrowApproval = prepareErc20EscrowApproval;
/**
 * Processes the approval transaction of the payment ERC20 to be spent by the erc20EscrowToPay
 * contract during the fee proxy delegate call.
 * @param request request to pay, used to know the network
 * @param paymentTokenAddress picked currency to pay
 * @param signerOrProvider the web3 provider. Defaults to Etherscan.
 * @param overrides optionally, override default transaction values, like gas.
 */ function approveErc20ForEscrow(request, paymentTokenAddress, signerOrProvider = (0, utils_1.getProvider)(), amount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const preparedTx = prepareErc20EscrowApproval(request, paymentTokenAddress, signerOrProvider, amount, overrides);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        return yield signer.sendTransaction(preparedTx);
    });
}
exports.approveErc20ForEscrow = approveErc20ForEscrow;
/**
 * Processes a transaction to payEscrow().
 * @param request request to pay.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optional, if you want to override the amount in the request.
 * @param feeAmount optional, if you want to override the feeAmount in the request.
 * @param overrides optionally, override default transaction values, like gas.
 */ function payEscrow(request, signerOrProvider = (0, utils_1.getProvider)(), amount, feeAmount, overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const preparedTx = preparePayEscrow(request, amount, feeAmount, overrides);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        return yield signer.sendTransaction(preparedTx);
    });
}
exports.payEscrow = payEscrow;
/**
 * Processes a transaction to freeze request.
 * @param request request to pay.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function freezeRequest(request, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const contractAddress = getContractAddress(request);
        const encodedTx = encodeFreezeRequest(request);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(Object.assign({
            data: encodedTx,
            to: contractAddress,
            value: 0
        }, overrides));
        return tx;
    });
}
exports.freezeRequest = freezeRequest;
/**
 * Processes a transaction to payRequestFromEscrow().
 * @param request request to pay.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function payRequestFromEscrow(request, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const contractAddress = getContractAddress(request);
        const encodedTx = encodePayRequestFromEscrow(request);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(Object.assign({
            data: encodedTx,
            to: contractAddress,
            value: 0
        }, overrides));
        return tx;
    });
}
exports.payRequestFromEscrow = payRequestFromEscrow;
/**
 * Processes a transaction to initiateEmergencyClaim().
 * @param request request to pay.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function initiateEmergencyClaim(request, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const contractAddress = getContractAddress(request);
        const encodedTx = encodeInitiateEmergencyClaim(request);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(Object.assign({
            data: encodedTx,
            to: contractAddress,
            value: 0
        }, overrides));
        return tx;
    });
}
exports.initiateEmergencyClaim = initiateEmergencyClaim;
/**
 * Processes a transaction to completeEmergencyClaim().
 * @param request request to pay.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function completeEmergencyClaim(request, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const contractAddress = getContractAddress(request);
        const encodedTx = encodeCompleteEmergencyClaim(request);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(Object.assign({
            data: encodedTx,
            to: contractAddress,
            value: 0
        }, overrides));
        return tx;
    });
}
exports.completeEmergencyClaim = completeEmergencyClaim;
/**
 * Processes a transaction to revertEmergencyClaim().
 * @param request request to pay.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function revertEmergencyClaim(request, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const contractAddress = getContractAddress(request);
        const encodedTx = encodeRevertEmergencyClaim(request);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(Object.assign({
            data: encodedTx,
            to: contractAddress,
            value: 0
        }, overrides));
        return tx;
    });
}
exports.revertEmergencyClaim = revertEmergencyClaim;
/**
 * Processes a transaction to refundFrozenFunds().
 * @param request request to pay.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param overrides optionally, override default transaction values, like gas.
 */ function refundFrozenFunds(request, signerOrProvider = (0, utils_1.getProvider)(), overrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const contractAddress = getContractAddress(request);
        const encodedTx = encodeRefundFrozenFunds(request);
        const signer = (0, utils_1.getSigner)(signerOrProvider);
        const tx = yield signer.sendTransaction(Object.assign({
            data: encodedTx,
            to: contractAddress,
            value: 0
        }, overrides));
        return tx;
    });
}
exports.refundFrozenFunds = refundFrozenFunds;
/**
 * Encodes the call to payEscrow().
 * @param request request to pay.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optionally, the amount to pay. Defaults to remaining amount of the request.
 */ function encodePayEscrow(request, amount, feeAmountOverride) {
    (0, utils_1.validateRequest)(request, types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT);
    const tokenAddress = request.currencyInfo.value;
    // collects the parameters to be used, from the request
    const { paymentReference, paymentAddress, feeAmount, feeAddress } = (0, utils_1.getRequestPaymentValues)(request);
    const amountToPay = (0, utils_1.getAmountToPay)(request, amount);
    const feeToPay = ethers_1.BigNumber.from(feeAmountOverride || feeAmount || 0);
    const erc20EscrowContract = types_1.ERC20EscrowToPay__factory.createInterface();
    return erc20EscrowContract.encodeFunctionData('payEscrow', [
        tokenAddress,
        paymentAddress,
        amountToPay,
        `0x${paymentReference}`,
        feeToPay,
        feeAddress || ethers_1.constants.AddressZero
    ]);
}
exports.encodePayEscrow = encodePayEscrow;
/**
 * Prepare a transaction pay the escrow contract.
 * @param request request to pay.
 * @param signerOrProvider the Web3 provider, or signer. Defaults to window.ethereum.
 * @param amount optional, if you want to override the amount in the request.
 * @param feeAmount optional, if you want to override the feeAmount in the request.
 * @param overrides optionally, override default transaction values, like gas.
 */ function preparePayEscrow(request, amount, feeAmount, overrides) {
    const contractAddress = getContractAddress(request);
    const encodedTx = encodePayEscrow(request, amount, feeAmount);
    return Object.assign({
        data: encodedTx,
        to: contractAddress,
        value: 0
    }, overrides);
}
exports.preparePayEscrow = preparePayEscrow;
/**
 * Encapsulates the validation, paymentReference calculation and escrow contract interface creation.
 * These steps are used in all subsequent functions encoding escrow interaction transactions
 * @param request Request data
 * @returns {erc20EscrowToPayContract, paymentReference}
 */ function prepareForEncoding(request) {
    (0, utils_1.validateRequest)(request, types_2.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT);
    // collects the parameters to be used from the request
    const { paymentReference } = (0, utils_1.getRequestPaymentValues)(request);
    // connections to the escrow contract
    const erc20EscrowToPayContract = types_1.ERC20EscrowToPay__factory.createInterface();
    return {
        erc20EscrowToPayContract,
        paymentReference
    };
}
/**
 * Returns the encoded data to freezeRequest().
 * @param request request to pay.
 */ function encodeFreezeRequest(request) {
    const { erc20EscrowToPayContract, paymentReference } = prepareForEncoding(request);
    return erc20EscrowToPayContract.encodeFunctionData('freezeRequest', [
        `0x${paymentReference}`
    ]);
}
exports.encodeFreezeRequest = encodeFreezeRequest;
/**
 * Returns the encoded data to payRequestFromEscrow().
 * @param request request for pay
 */ function encodePayRequestFromEscrow(request) {
    const { erc20EscrowToPayContract, paymentReference } = prepareForEncoding(request);
    return erc20EscrowToPayContract.encodeFunctionData('payRequestFromEscrow', [
        `0x${paymentReference}`
    ]);
}
exports.encodePayRequestFromEscrow = encodePayRequestFromEscrow;
/**
 * Returns the encoded data to initiateEmergencyClaim().
 * @param request request to pay.
 */ function encodeInitiateEmergencyClaim(request) {
    const { erc20EscrowToPayContract, paymentReference } = prepareForEncoding(request);
    return erc20EscrowToPayContract.encodeFunctionData('initiateEmergencyClaim', [
        `0x${paymentReference}`
    ]);
}
exports.encodeInitiateEmergencyClaim = encodeInitiateEmergencyClaim;
/**
 * Returns the encoded data to completeEmergencyClaim().
 * @param request request to pay.
 */ function encodeCompleteEmergencyClaim(request) {
    const { erc20EscrowToPayContract, paymentReference } = prepareForEncoding(request);
    return erc20EscrowToPayContract.encodeFunctionData('completeEmergencyClaim', [
        `0x${paymentReference}`
    ]);
}
exports.encodeCompleteEmergencyClaim = encodeCompleteEmergencyClaim;
/**
 * Returns the encoded data to revertEmergencyClaim().
 * @param request request to pay.
 */ function encodeRevertEmergencyClaim(request) {
    const { erc20EscrowToPayContract, paymentReference } = prepareForEncoding(request);
    return erc20EscrowToPayContract.encodeFunctionData('revertEmergencyClaim', [
        `0x${paymentReference}`
    ]);
}
exports.encodeRevertEmergencyClaim = encodeRevertEmergencyClaim;
/**
 * Returns the encoded data to refundFrozenFunds().
 * @param request request to pay.
 */ function encodeRefundFrozenFunds(request) {
    const { erc20EscrowToPayContract, paymentReference } = prepareForEncoding(request);
    return erc20EscrowToPayContract.encodeFunctionData('refundFrozenFunds', [
        `0x${paymentReference}`
    ]);
}
exports.encodeRefundFrozenFunds = encodeRefundFrozenFunds; //# sourceMappingURL=erc20-escrow-payment.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/prepared-transaction.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
}); //# sourceMappingURL=prepared-transaction.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/single-request-forwarder.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.payRequestWithSingleRequestForwarder = exports.payWithEthereumSingleRequestForwarder = exports.payWithERC20SingleRequestForwarder = exports.deploySingleRequestForwarder = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
const ethers_1 = __turbopack_require__("[project]/node_modules/.pnpm/ethers@5.7.2/node_modules/ethers/lib.esm/index.js [app-ssr] (ecmascript)");
const payment_detection_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-detection@0.49.0/node_modules/@requestnetwork/payment-detection/dist/index.js [app-ssr] (ecmascript)");
const types_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+types@0.49.0/node_modules/@requestnetwork/types/dist/index.js [app-ssr] (ecmascript)");
const smart_contracts_1 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/dist/src/lib/index.js [app-ssr] (ecmascript)");
const types_2 = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+smart-contracts@0.43.0/node_modules/@requestnetwork/smart-contracts/types/index.js [app-ssr] (ecmascript)");
/**
 * Deploys a Single Request Forwarder contract for a given request.
 *
 * @param request - The request data object containing payment network and currency information.
 * @param signer - The Ethereum signer used to deploy the contract.
 * @returns A Promise that resolves to the address of the deployed Single Request Forwarder contract.
 * @throws {Error} If the payment network is unsupported, payment chain is not found, payee is not found, or if there are invalid payment network values.
 *
 * @remarks
 * This function supports deploying forwarders for ERC20_FEE_PROXY_CONTRACT and ETH_FEE_PROXY_CONTRACT payment networks.
 * It uses the SingleRequestForwarderFactory contract to create either an ERC20 or Ethereum Single Request Forwarder.
 * The function calculates the payment reference and handles the deployment transaction, including waiting for confirmation.
 * The factory address is automatically determined based on the payment chain using the singleRequestForwarderFactoryArtifact.
 */ function deploySingleRequestForwarder(request, signer) {
    var _a, _b, _c, _d, _e, _f, _g;
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const requestPaymentNetwork = (0, payment_detection_1.getPaymentNetworkExtension)(request);
        // Check if the payment network is supported, only ERC20_FEE_PROXY_CONTRACT and ETH_FEE_PROXY_CONTRACT are supported
        if (!requestPaymentNetwork || requestPaymentNetwork.id !== types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT && requestPaymentNetwork.id !== types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT) {
            throw new Error('Unsupported payment network');
        }
        const paymentChain = request.currencyInfo.network;
        if (!paymentChain) {
            throw new Error('Payment chain not found');
        }
        // Use artifact's default address for the payment chain
        const singleRequestForwarderFactory = smart_contracts_1.singleRequestForwarderFactoryArtifact.connect(paymentChain, signer);
        if (!singleRequestForwarderFactory.address) {
            throw new Error(`SingleRequestForwarderFactory not found on chain ${paymentChain}`);
        }
        const salt = (_a = requestPaymentNetwork === null || requestPaymentNetwork === void 0 ? void 0 : requestPaymentNetwork.values) === null || _a === void 0 ? void 0 : _a.salt;
        const feeAddress = (_b = requestPaymentNetwork === null || requestPaymentNetwork === void 0 ? void 0 : requestPaymentNetwork.values) === null || _b === void 0 ? void 0 : _b.feeAddress;
        const feeAmount = (_c = requestPaymentNetwork === null || requestPaymentNetwork === void 0 ? void 0 : requestPaymentNetwork.values) === null || _c === void 0 ? void 0 : _c.feeAmount;
        const paymentRecipient = (_d = requestPaymentNetwork === null || requestPaymentNetwork === void 0 ? void 0 : requestPaymentNetwork.values) === null || _d === void 0 ? void 0 : _d.paymentAddress;
        if (!salt || !feeAddress || !feeAmount || !paymentRecipient) {
            throw new Error('Invalid payment network values');
        }
        const paymentReference = `0x${payment_detection_1.PaymentReferenceCalculator.calculate(request.requestId, salt, paymentRecipient)}`;
        const isERC20 = requestPaymentNetwork.id === types_1.ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT;
        let tx;
        if (isERC20) {
            const tokenAddress = request.currencyInfo.value;
            tx = yield singleRequestForwarderFactory.createERC20SingleRequestProxy(paymentRecipient, tokenAddress, paymentReference, feeAddress, feeAmount);
        } else {
            tx = yield singleRequestForwarderFactory.createEthereumSingleRequestProxy(paymentRecipient, paymentReference, feeAddress, feeAmount);
        }
        const receipt = yield tx.wait();
        const event = (_e = receipt.events) === null || _e === void 0 ? void 0 : _e.find((e)=>e.event === (isERC20 ? 'ERC20SingleRequestProxyCreated' : 'EthereumSingleRequestProxyCreated'));
        if (!event) {
            throw new Error('Single request forwarder creation event not found');
        }
        const forwarderAddress = ((_f = event.args) === null || _f === void 0 ? void 0 : _f.proxyAddress) || ((_g = event.args) === null || _g === void 0 ? void 0 : _g[0]);
        if (!forwarderAddress) {
            throw new Error('Forwarder address not found in event data');
        }
        return forwarderAddress;
    });
}
exports.deploySingleRequestForwarder = deploySingleRequestForwarder;
/**
 * Validates that a contract is a SingleRequestForwarder by checking required methods
 * @param proxyAddress - The address of the contract to validate
 * @param signer - The Ethereum signer used to interact with the contract
 * @throws {Error} If the contract is not a valid SingleRequestForwarder
 */ function validateSingleRequestForwarder(forwarderAddress, signer) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        const forwarderInterface = new ethers_1.ethers.utils.Interface([
            'function payee() view returns (address)',
            'function paymentReference() view returns (bytes)',
            'function feeAddress() view returns (address)',
            'function feeAmount() view returns (uint256)'
        ]);
        const forwarderContract = new ethers_1.Contract(forwarderAddress, forwarderInterface, signer);
        try {
            yield Promise.all([
                forwarderContract.payee(),
                forwarderContract.paymentReference(),
                forwarderContract.feeAddress(),
                forwarderContract.feeAmount()
            ]);
        } catch (error) {
            throw new Error('Invalid SingleRequestForwarder contract');
        }
    });
}
/**
 * Executes a payment through an ERC20SingleRequestForwarder contract
 * @param forwarderAddress - The address of the SingleRequestForwarder contract
 * @param signer - The Ethereum signer used to execute the payment transaction
 * @param amount - The amount to be paid
 * @throws {Error} If the contract is not an ERC20SingleRequestForwarder
 */ function payWithERC20SingleRequestForwarder(forwarderAddress, signer, amount) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!amount || ethers_1.ethers.BigNumber.from(amount).lte(0)) {
            throw new Error('Amount must be a positive number');
        }
        const forwarderInterface = new ethers_1.ethers.utils.Interface([
            'function tokenAddress() view returns (address)'
        ]);
        const forwarderContract = new ethers_1.Contract(forwarderAddress, forwarderInterface, signer);
        let tokenAddress;
        try {
            // Attempt to fetch the token address from the forwarder contract, to determine if it's an ERC20 SingleRequestForwarder.
            tokenAddress = yield forwarderContract.tokenAddress();
        } catch (_a) {
            throw new Error('Contract is not an ERC20SingleRequestForwarder');
        }
        const erc20Contract = types_2.IERC20__factory.connect(tokenAddress, signer);
        // Transfer tokens to the forwarder
        const transferTx = yield erc20Contract.transfer(forwarderAddress, amount);
        yield transferTx.wait();
        // Trigger the proxy's receive function to finalize payment
        const triggerTx = yield signer.sendTransaction({
            to: forwarderAddress,
            value: ethers_1.ethers.constants.Zero
        });
        yield triggerTx.wait();
    });
}
exports.payWithERC20SingleRequestForwarder = payWithERC20SingleRequestForwarder;
/**
 * Executes a payment through an EthereumSingleRequestForwarder contract
 * @param forwarderAddress - The address of the SingleRequestForwarder contract
 * @param signer - The Ethereum signer used to execute the payment transaction
 * @param amount - The amount to be paid
 * @throws {Error} If the contract is not an EthereumSingleRequestForwarder
 */ function payWithEthereumSingleRequestForwarder(forwarderAddress, signer, amount) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!amount || ethers_1.ethers.BigNumber.from(amount).lte(0)) {
            throw new Error('Amount must be a positive number');
        }
        const forwarderInterface = new ethers_1.ethers.utils.Interface([
            'function tokenAddress() view returns (address)'
        ]);
        const forwarderContract = new ethers_1.Contract(forwarderAddress, forwarderInterface, signer);
        try {
            // Attempt to fetch the token address from the forwarder contract, to determine if it's an Ethereum SingleRequestForwarder.
            yield forwarderContract.tokenAddress();
            // If the token address is fetched, it means the contract is an ERC20SingleRequestForwarder.
            throw new Error('Contract is not an EthereumSingleRequestForwarder');
        } catch (error) {
            // If the token address is not fetched, it means the contract is an EthereumSingleRequestForwarder.
            if (error.message === 'Contract is not an EthereumSingleRequestForwarder') {
                // If the error message is 'Contract is not an EthereumSingleRequestForwarder', throw the error.
                throw error;
            }
        }
        const tx = yield signer.sendTransaction({
            to: forwarderAddress,
            value: amount
        });
        yield tx.wait();
    });
}
exports.payWithEthereumSingleRequestForwarder = payWithEthereumSingleRequestForwarder;
/**
 * Executes a payment through a Single Request Proxy contract.
 *
 * @param singleRequestForwarderAddress - The address of the deployed Single Request Forwarder contract.
 * @param signer - The Ethereum signer used to execute the payment transaction.
 * @param amount - The amount to be paid, as a string representation of the value.
 * @returns A Promise that resolves when the payment transaction is confirmed.
 * @throws {Error} If the SingleRequestForwarder contract is invalid.
 * @throws {Error} If the forwarder contract type cannot be determined, or if any transaction fails.
 *
 * @remarks
 * This function supports both ERC20 and Ethereum payments.
 * For ERC20 payments, it first transfers the tokens to the forwarder contract and then triggers the payment.
 * For Ethereum payments, it directly sends the Ether to the forwarder contract.
 * The function automatically detects whether the proxy is for ERC20 or Ethereum based on the contract interface.
 */ function payRequestWithSingleRequestForwarder(singleRequestForwarderAddress, signer, amount) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        if (!amount || ethers_1.ethers.BigNumber.from(amount).lte(0)) {
            throw new Error('Amount must be a positive number');
        }
        // Validate the SingleRequestForwarder contract
        yield validateSingleRequestForwarder(singleRequestForwarderAddress, signer);
        const forwarderInterface = new ethers_1.ethers.utils.Interface([
            'function tokenAddress() view returns (address)'
        ]);
        const forwarderContract = new ethers_1.Contract(singleRequestForwarderAddress, forwarderInterface, signer);
        let isERC20;
        try {
            yield forwarderContract.tokenAddress();
            isERC20 = true;
        } catch (_a) {
            isERC20 = false;
        }
        if (isERC20) {
            yield payWithERC20SingleRequestForwarder(singleRequestForwarderAddress, signer, amount);
        } else {
            yield payWithEthereumSingleRequestForwarder(singleRequestForwarderAddress, signer, amount);
        }
    });
}
exports.payRequestWithSingleRequestForwarder = payRequestWithSingleRequestForwarder; //# sourceMappingURL=single-request-forwarder.js.map
}}),
"[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/index.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.utils = exports.Escrow = void 0;
const tslib_1 = __turbopack_require__("[project]/node_modules/.pnpm/tslib@2.5.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/index.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/btc-address-based.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-proxy.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-fee-proxy.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc777-stream.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc777-utils.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-input-data.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/near-input-data.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/near-conversion.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/near-fungible.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/near-amount-with-ref.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-proxy.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/eth-fee-proxy.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/batch-proxy.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/batch-conversion-proxy.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-conversion-erc20.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-any-to-erc20.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-erc20.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-transferable-receivable.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/swap-erc20-fee-proxy.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/conversion-erc20.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/any-to-erc20-proxy.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/any-to-eth-proxy.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/encoder-payment.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/encoder-approval.js [app-ssr] (ecmascript)"), exports);
exports.Escrow = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/erc20-escrow-payment.js [app-ssr] (ecmascript)");
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/prepared-transaction.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils-near.js [app-ssr] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/single-request-forwarder.js [app-ssr] (ecmascript)"), exports);
const utils = __turbopack_require__("[project]/node_modules/.pnpm/@requestnetwork+payment-processor@0.52.0_graphql@16.8.1_typescript@5.6.3/node_modules/@requestnetwork/payment-processor/dist/payment/utils.js [app-ssr] (ecmascript)");
exports.utils = utils; //# sourceMappingURL=index.js.map
}}),

};

//# sourceMappingURL=18d82_%40requestnetwork_payment-processor_dist_7f31d5._.js.map