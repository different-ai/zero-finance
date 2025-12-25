'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplifiedOffRamp = SimplifiedOffRamp;
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var react_2 = require("@/trpc/react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var alert_1 = require("@/components/ui/alert");
var lucide_react_1 = require("lucide-react");
var viem_1 = require("viem");
var viem_2 = require("viem");
var chains_1 = require("viem/chains");
var sonner_1 = require("sonner");
var smart_wallets_1 = require("@privy-io/react-auth/smart-wallets");
var protocol_kit_1 = require("@safe-global/protocol-kit");
var radio_group_1 = require("@/components/ui/radio-group");
var utils_1 = require("@/lib/utils");
var core_1 = require("@/lib/sponsor-tx/core");
var use_safe_relay_1 = require("@/hooks/use-safe-relay");
var constants_1 = require("@/lib/constants");
var combo_box_1 = require("@/components/ui/combo-box");
var bimodal_1 = require("@/components/ui/bimodal");
var checkbox_1 = require("@/components/ui/checkbox");
var CRYPTO_ASSETS = {
    usdc: {
        symbol: 'USDC',
        name: 'USD Coin',
        address: constants_1.USDC_ADDRESS,
        decimals: constants_1.USDC_DECIMALS,
        icon: '💵',
        isNative: false,
    },
    weth: {
        symbol: 'WETH',
        name: 'Wrapped Ether',
        address: constants_1.WETH_ADDRESS,
        decimals: constants_1.WETH_DECIMALS,
        icon: '⟠',
        isNative: false,
    },
    eth: {
        symbol: 'ETH',
        name: 'Ether',
        address: null,
        decimals: 18,
        icon: '⟠',
        isNative: true,
    },
};
// Approximate exchange rates (would be fetched from API in production)
var APPROX_RATES = {
    USDC_TO_EUR: 0.92,
    USDC_TO_USD: 1.0,
    FEE_PERCENTAGE: 0.005, // 0.5%
};
// Country list
var COUNTRIES = [
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'ES', label: 'Spain' },
    { value: 'IT', label: 'Italy' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'SE', label: 'Sweden' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'JP', label: 'Japan' },
    { value: 'SG', label: 'Singapore' },
    { value: 'HK', label: 'Hong Kong' },
    { value: 'BR', label: 'Brazil' },
    { value: 'MX', label: 'Mexico' },
].sort(function (a, b) { return a.label.localeCompare(b.label); });
var erc20AbiBalanceOf = [
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
    },
];
var USDC_BASE_ADDRESS = constants_1.USDC_ADDRESS;
// ============================================================================
// UTILITY COMPONENTS
// ============================================================================
// Clean conversion arrow (no animations per design language)
var ConversionArrow = function (_a) {
    var className = _a.className;
    return (<div className={(0, utils_1.cn)('flex items-center justify-center py-2', className)}>
    <div className="flex flex-col items-center">
      <div className="w-px h-3 bg-[#101010]/10"/>
      <div className="bg-white border border-[#101010]/10 rounded-full p-1.5">
        <lucide_react_1.ArrowDown className="h-4 w-4 text-[#101010]/40"/>
      </div>
      <div className="w-px h-3 bg-[#101010]/10"/>
    </div>
  </div>);
};
// Currency pill - clean, minimal per design language
var CurrencyPill = function (_a) {
    var currency = _a.currency, _b = _a.variant, variant = _b === void 0 ? 'default' : _b;
    return (<span className={(0, utils_1.cn)('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium uppercase tracking-wider', variant === 'highlight'
            ? 'bg-[#1B29FF]/10 text-[#1B29FF]'
            : 'bg-[#101010]/5 text-[#101010]/60')}>
      {currency}
    </span>);
};
// Success checkmark - clean, no excessive animation
var SuccessAnimation = function () { return (<div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center">
    <lucide_react_1.CheckCircle2 className="h-8 w-8 text-[#10B981]"/>
  </div>); };
// Progress stepper - minimal design
var ProgressStepper = function (_a) {
    var currentStep = _a.currentStep, totalSteps = _a.totalSteps;
    return (<div className="flex items-center gap-1">
    {Array.from({ length: totalSteps }).map(function (_, i) { return (<div key={i} className={(0, utils_1.cn)('h-1.5 rounded-full transition-all', i <= currentStep ? 'bg-[#1B29FF] w-6' : 'bg-[#101010]/10 w-4')}/>); })}
  </div>);
};
var QuotePreview = function (_a) {
    var amountUsdc = _a.amountUsdc, destinationType = _a.destinationType, onQuoteChange = _a.onQuoteChange;
    var _b = (0, react_1.useState)(0), debouncedAmount = _b[0], setDebouncedAmount = _b[1];
    var isEur = destinationType === 'iban';
    var currencySymbol = isEur ? '€' : '$';
    var currencyCode = isEur ? 'EUR' : 'USD';
    // Debounce the amount to avoid too many API calls
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () {
            setDebouncedAmount(amountUsdc);
        }, 500);
        return function () { return clearTimeout(timer); };
    }, [amountUsdc]);
    // Fetch real quote from Align API
    var _c = react_2.api.align.getOfframpQuote.useMutation(), fetchQuote = _c.mutate, quote = _c.data, isLoading = _c.isPending, error = _c.error;
    // Notify parent when quote changes
    (0, react_1.useEffect)(function () {
        if (quote && onQuoteChange) {
            onQuoteChange({
                quoteId: quote.quoteId,
                sourceAmount: quote.sourceAmount,
                destinationAmount: quote.destinationAmount,
                feeAmount: quote.feeAmount,
                exchangeRate: quote.exchangeRate,
                destinationCurrency: quote.destinationCurrency,
                destinationPaymentRails: isEur ? 'sepa' : 'ach',
            });
        }
        else if (!quote && onQuoteChange) {
            onQuoteChange(null);
        }
    }, [quote, onQuoteChange, isEur]);
    // Fetch quote when debounced amount changes - query by SOURCE amount (USDC)
    (0, react_1.useEffect)(function () {
        if (debouncedAmount > 0) {
            fetchQuote({
                sourceAmount: debouncedAmount.toString(),
                destinationCurrency: isEur ? 'eur' : 'usd',
                destinationPaymentRails: isEur ? 'sepa' : 'ach',
                sourceToken: 'usdc',
                sourceNetwork: 'base',
            });
        }
    }, [debouncedAmount, isEur, fetchQuote]);
    if (amountUsdc <= 0) {
        return null;
    }
    // Parse quote data
    var destinationAmount = quote ? parseFloat(quote.destinationAmount) : 0;
    var feeAmount = quote ? parseFloat(quote.feeAmount) : 0;
    var exchangeRate = quote ? parseFloat(quote.exchangeRate) : 0;
    return (<div className="bg-white border border-[#101010]/10 rounded-md p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            {quote ? 'Quote' : 'Getting quote...'}
          </p>
          {quote && (<p className="text-[11px] text-[#101010]/40">Expires in 60s</p>)}
        </div>

        {/* Error state */}
        {error && (<div className="text-[12px] text-[#EF4444] bg-[#EF4444]/5 border border-[#EF4444]/20 p-3 rounded-md">
            Failed to get quote. Please try again.
          </div>)}

        {/* Conversion visualization */}
        <div className="space-y-2">
          {/* You send */}
          <div className="flex items-center justify-between p-3 bg-[#F7F7F2] rounded-md">
            <div>
              <p className="text-[11px] text-[#101010]/60 uppercase tracking-wider mb-1">
                You send
              </p>
              <p className="text-[24px] font-semibold tabular-nums text-[#101010]">
                {amountUsdc.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}
              </p>
            </div>
            <CurrencyPill currency="USDC" variant="highlight"/>
          </div>

          <ConversionArrow />

          {/* Bank receives */}
          <div className="flex items-center justify-between p-3 bg-[#10B981]/5 border border-[#10B981]/20 rounded-md">
            <div>
              <p className="text-[11px] text-[#10B981]/70 uppercase tracking-wider mb-1">
                Bank receives
              </p>
              <p className="text-[24px] font-semibold tabular-nums text-[#10B981]">
                {isLoading ? (<lucide_react_1.Loader2 className="h-5 w-5 animate-spin inline"/>) : quote ? ("".concat(currencySymbol).concat(destinationAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }))) : ('—')}
              </p>
            </div>
            <CurrencyPill currency={currencyCode}/>
          </div>
        </div>

        {/* Fee breakdown */}
        {quote && (<div className="pt-3 border-t border-[#101010]/10 space-y-1.5">
            {feeAmount > 0 && (<div className="flex justify-between items-center text-[12px]">
                <span className="text-[#101010]/60">Fee</span>
                <span className="tabular-nums text-[#101010]">
                  {feeAmount.toFixed(2)} USDC
                </span>
              </div>)}
            {exchangeRate > 0 && (<div className="flex justify-between items-center text-[12px]">
                <span className="text-[#101010]/60">Rate</span>
                <span className="tabular-nums text-[#101010]">
                  1 USDC = {currencySymbol}
                  {exchangeRate.toFixed(4)}
                </span>
              </div>)}
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#101010]/60">Arrival</span>
              <span className="text-[#101010]">
                {isEur ? 'Same day' : '1-2 business days'}
              </span>
            </div>
          </div>)}
      </div>
    </div>);
};
var UnifiedAmountQuote = function (_a) {
    var amountValue = _a.amountValue, onAmountChange = _a.onAmountChange, destinationType = _a.destinationType, onQuoteChange = _a.onQuoteChange, usdcBalance = _a.usdcBalance, isLoadingBalance = _a.isLoadingBalance, maxBalance = _a.maxBalance, formError = _a.error;
    var _b = (0, react_1.useState)(0), debouncedAmount = _b[0], setDebouncedAmount = _b[1];
    var amountNum = parseFloat(amountValue || '0');
    var isEur = destinationType === 'iban';
    var currencySymbol = isEur ? '€' : '$';
    var currencyCode = isEur ? 'EUR' : 'USD';
    // Debounce the amount to avoid too many API calls
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () {
            setDebouncedAmount(amountNum);
        }, 500);
        return function () { return clearTimeout(timer); };
    }, [amountNum]);
    // Fetch real quote from Align API
    var _c = react_2.api.align.getOfframpQuote.useMutation(), fetchQuote = _c.mutate, quote = _c.data, isLoading = _c.isPending, quoteError = _c.error;
    // Notify parent when quote changes
    (0, react_1.useEffect)(function () {
        if (quote && onQuoteChange) {
            onQuoteChange({
                quoteId: quote.quoteId,
                sourceAmount: quote.sourceAmount,
                destinationAmount: quote.destinationAmount,
                feeAmount: quote.feeAmount,
                exchangeRate: quote.exchangeRate,
                destinationCurrency: quote.destinationCurrency,
                destinationPaymentRails: isEur ? 'sepa' : 'ach',
            });
        }
        else if (!quote && onQuoteChange) {
            onQuoteChange(null);
        }
    }, [quote, onQuoteChange, isEur]);
    // Fetch quote when debounced amount changes
    (0, react_1.useEffect)(function () {
        if (debouncedAmount > 0) {
            fetchQuote({
                sourceAmount: debouncedAmount.toString(),
                destinationCurrency: isEur ? 'eur' : 'usd',
                destinationPaymentRails: isEur ? 'sepa' : 'ach',
                sourceToken: 'usdc',
                sourceNetwork: 'base',
            });
        }
    }, [debouncedAmount, isEur, fetchQuote]);
    // Parse quote data
    var destinationAmount = quote ? parseFloat(quote.destinationAmount) : 0;
    var feeAmount = quote ? parseFloat(quote.feeAmount) : 0;
    var exchangeRate = quote ? parseFloat(quote.exchangeRate) : 0;
    var handleMaxClick = function () {
        var balance = maxBalance !== undefined ? maxBalance.toString() : usdcBalance;
        if (balance) {
            onAmountChange(balance);
        }
    };
    return (<div className="bg-white border border-[#101010]/10 rounded-2xl overflow-hidden">
      {/* You Send Section */}
      <div className="p-5 bg-[#F7F7F2]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] text-[#101010]/60 uppercase tracking-wider">
              You send
            </p>
          </div>
          <CurrencyPill currency="USDC" variant="highlight"/>
        </div>
        <div className="relative">
          <input_1.Input type="text" inputMode="decimal" value={amountValue} onChange={function (e) { return onAmountChange(e.target.value); }} placeholder="0.00" className="text-[32px] font-semibold tabular-nums h-14 border-0 bg-transparent p-0 focus-visible:ring-0 pr-20"/>
          {!isLoadingBalance && (maxBalance !== undefined || usdcBalance) && (<button type="button" onClick={handleMaxClick} className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[12px] font-medium text-[#1B29FF] bg-[#1B29FF]/10 rounded-lg hover:bg-[#1B29FF]/20 transition-colors">
              MAX
            </button>)}
        </div>
        <div className="mt-3 flex justify-between text-[12px]">
          <span className="text-[#101010]/60">Available</span>
          <span className="font-medium tabular-nums text-[#101010]">
            {isLoadingBalance ? (<lucide_react_1.Loader2 className="h-3 w-3 animate-spin inline"/>) : maxBalance !== undefined ? ("".concat(maxBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }), " USDC")) : usdcBalance ? ("".concat(parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2 }), " USDC")) : ('—')}
          </span>
        </div>
        {formError && (<p className="text-[12px] text-red-500 mt-2">{formError}</p>)}
      </div>

      {/* Conversion Arrow Divider */}
      <div className="relative h-0">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-10 h-10 rounded-full bg-white border-2 border-[#101010]/10 flex items-center justify-center shadow-sm">
            {isLoading ? (<lucide_react_1.Loader2 className="h-4 w-4 animate-spin text-[#101010]/40"/>) : (<lucide_react_1.ArrowDown className="h-4 w-4 text-[#101010]/60"/>)}
          </div>
        </div>
      </div>

      {/* Bank Receives Section */}
      <div className="p-5 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] text-[#10B981]/70 uppercase tracking-wider">
              Bank receives
            </p>
          </div>
          <CurrencyPill currency={currencyCode}/>
        </div>
        <div className="h-14 flex items-center">
          {amountNum <= 0 ? (<span className="text-[32px] font-semibold tabular-nums text-[#101010]/30">
              {currencySymbol}0.00
            </span>) : isLoading ? (<div className="flex items-center gap-2">
              <lucide_react_1.Loader2 className="h-5 w-5 animate-spin text-[#101010]/40"/>
              <span className="text-[14px] text-[#101010]/40">
                Calculating...
              </span>
            </div>) : quote ? (<span className="text-[32px] font-semibold tabular-nums text-[#10B981]">
              {currencySymbol}
              {destinationAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}
            </span>) : quoteError ? (<span className="text-[14px] text-red-500">
              Failed to get quote
            </span>) : (<span className="text-[32px] font-semibold tabular-nums text-[#101010]/30">
              {currencySymbol}—
            </span>)}
        </div>
      </div>

      {/* Fee breakdown footer */}
      {amountNum > 0 && (<div className="px-5 py-3 bg-[#F7F7F2]/50 border-t border-[#101010]/5">
          <div className="flex items-center justify-between text-[12px]">
            {quote ? (<>
                <div className="flex items-center gap-4">
                  {feeAmount > 0 && (<span className="text-[#101010]/60">
                      Fee:{' '}
                      <span className="text-[#101010] tabular-nums">
                        {feeAmount.toFixed(2)} USDC
                      </span>
                    </span>)}
                  {exchangeRate > 0 && (<span className="text-[#101010]/60">
                      Rate:{' '}
                      <span className="text-[#101010] tabular-nums">
                        1 USDC = {currencySymbol}
                        {exchangeRate.toFixed(4)}
                      </span>
                    </span>)}
                </div>
                <span className="text-[#101010]/60">
                  {isEur ? 'Same day' : '1-2 days'}
                </span>
              </>) : isLoading ? (<span className="text-[#101010]/40">Getting best rate...</span>) : (<span className="text-[#101010]/40">Enter amount for quote</span>)}
          </div>
        </div>)}
    </div>);
};
var DestinationSelector = function (_a) {
    var value = _a.value, onChange = _a.onChange, hasAchAccount = _a.hasAchAccount, hasIbanAccount = _a.hasIbanAccount, isTechnical = _a.isTechnical;
    var options = [
        {
            id: 'ach',
            title: 'US Bank',
            subtitle: 'Receive dollars via ACH transfer',
            icon: (<div className="w-10 h-10 bg-[#101010]/5 rounded-md flex items-center justify-center">
          <lucide_react_1.CircleDollarSign className="h-5 w-5 text-[#101010]/70"/>
        </div>),
            badge: 'ACH',
            timing: '1-2 days',
            currency: 'USD',
            disabled: !hasAchAccount,
        },
        {
            id: 'iban',
            title: 'EU Bank',
            subtitle: 'Receive euros via SEPA transfer',
            icon: (<div className="w-10 h-10 bg-[#101010]/5 rounded-md flex items-center justify-center">
          <lucide_react_1.Euro className="h-5 w-5 text-[#101010]/70"/>
        </div>),
            badge: 'SEPA',
            timing: 'Same day',
            currency: 'EUR',
            disabled: !hasIbanAccount,
        },
    ];
    // Crypto wallet option - always available regardless of mode
    options.push({
        id: 'crypto',
        title: 'Crypto Wallet',
        subtitle: 'Send to any EVM address',
        icon: (<div className="w-10 h-10 bg-[#1B29FF]/10 rounded-md flex items-center justify-center">
        <lucide_react_1.Coins className="h-5 w-5 text-[#1B29FF]"/>
      </div>),
        badge: 'INSTANT',
        timing: '~30 seconds',
        currency: 'CRYPTO',
    });
    return (<div className="grid grid-cols-1 gap-2">
      {options.map(function (option) { return (<button key={option.id} type="button" onClick={function () { return !option.disabled && onChange(option.id); }} disabled={option.disabled} className={(0, utils_1.cn)('relative flex items-center gap-4 p-4 rounded-md border transition-colors text-left', value === option.id
                ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                : 'border-[#101010]/10 bg-white hover:border-[#101010]/20', option.disabled && 'opacity-40 cursor-not-allowed')}>
          {option.icon}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[14px] text-[#101010]">
                {option.title}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-[#101010]/5 text-[#101010]/60">
                {option.badge}
              </span>
            </div>
            <p className="text-[12px] text-[#101010]/60 mt-0.5">
              {option.subtitle}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#101010]/50 block">
              {option.timing}
            </span>
          </div>

          {value === option.id && (<div className="absolute top-3 right-3">
              <div className="w-4 h-4 bg-[#1B29FF] rounded-full flex items-center justify-center">
                <lucide_react_1.Check className="h-2.5 w-2.5 text-white"/>
              </div>
            </div>)}
        </button>); })}
    </div>);
};
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function buildPrevalidatedSig(owner) {
    return "0x000000000000000000000000".concat(owner.slice(2), "000000000000000000000000000000000000000000000000000000000000000001");
}
// ============================================================================
// DEMO MODE COMPONENT
// ============================================================================
function SimplifiedOffRampDemo(_a) {
    var _this = this;
    var _b, _c;
    var fundingSources = _a.fundingSources, defaultValues = _a.defaultValues, prefillFromInvoice = _a.prefillFromInvoice;
    var _d = (0, react_1.useState)((_c = (_b = defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.amount) !== null && _b !== void 0 ? _b : prefillFromInvoice === null || prefillFromInvoice === void 0 ? void 0 : prefillFromInvoice.amount) !== null && _c !== void 0 ? _c : '10000'), amount = _d[0], setAmount = _d[1];
    var _e = (0, react_1.useState)('ach'), destinationType = _e[0], setDestinationType = _e[1];
    var _f = (0, react_1.useState)(false), isProcessing = _f[0], setIsProcessing = _f[1];
    var _g = (0, react_1.useState)(false), isComplete = _g[0], setIsComplete = _g[1];
    var _h = (0, react_1.useState)(1), step = _h[0], setStep = _h[1];
    var getAccountType = function (source) {
        return source.sourceAccountType || source.accountType;
    };
    var achAccount = fundingSources.find(function (source) { return getAccountType(source) === 'us_ach'; });
    var ibanAccount = fundingSources.find(function (source) { return getAccountType(source) === 'iban'; });
    var processingSteps = [
        'Verifying account details...',
        'Initiating transfer...',
        'Processing payment...',
    ];
    var handleTransfer = function () { return __awaiter(_this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsProcessing(true);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < processingSteps.length)) return [3 /*break*/, 4];
                    setStep(i + 1);
                    // eslint-disable-next-line no-await-in-loop
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 2:
                    // eslint-disable-next-line no-await-in-loop
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4:
                    setIsProcessing(false);
                    setIsComplete(true);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleReset = function () {
        var _a, _b;
        setAmount((_b = (_a = defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.amount) !== null && _a !== void 0 ? _a : prefillFromInvoice === null || prefillFromInvoice === void 0 ? void 0 : prefillFromInvoice.amount) !== null && _b !== void 0 ? _b : '10000');
        setDestinationType('ach');
        setIsComplete(false);
        setStep(1);
    };
    if (isComplete) {
        return (<div className="bg-white h-full max-h-[100dvh] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center justify-center p-6 space-y-6">
          <SuccessAnimation />
          <div className="text-center space-y-2">
            <h3 className="text-[28px] font-semibold tracking-[-0.01em] text-[#101010]">
              Transfer initiated
            </h3>
            <p className="text-[14px] text-[#101010]/65 max-w-md">
              Your transfer of {(0, utils_1.formatUsd)(Number(amount || 0))} has been
              successfully initiated. Funds will arrive in 1-2 business days.
            </p>
          </div>
          <button_1.Button onClick={handleReset} className="bg-[#1B29FF] hover:bg-[#1420CC] text-white px-6 py-2.5 text-[14px] font-medium transition-all">
            Make Another Transfer
          </button_1.Button>
        </div>
        <div className="flex-shrink-0 p-4 text-center text-[11px] text-[#101010]/40 uppercase tracking-[0.14em]">
          Demo Mode
        </div>
      </div>);
    }
    if (isProcessing) {
        return (<div className="bg-white h-full max-h-[100dvh] flex flex-col items-center justify-center p-6 space-y-6 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-[#1B29FF]/20 rounded-full animate-ping"/>
          <div className="relative bg-[#1B29FF]/10 rounded-full p-4">
            <lucide_react_1.Loader2 className="h-8 w-8 text-[#1B29FF] animate-spin"/>
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-[24px] font-semibold tracking-[-0.01em] text-[#101010]">
            Processing transfer
          </h3>
          <p className="text-[14px] text-[#1B29FF] animate-pulse">
            {processingSteps[step - 1]}
          </p>
        </div>
        <div className="w-full max-w-xs">
          <div className="h-1 bg-[#101010]/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#1B29FF] transition-all duration-500" style={{ width: "".concat((step / processingSteps.length) * 100, "%") }}/>
          </div>
        </div>
      </div>);
    }
    return (<div className="bg-white h-full max-h-[100dvh] flex flex-col overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-5 sm:p-6 space-y-6">
          {/* Header */}
          <div>
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
              Transfer to Bank
            </p>
            <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-[#101010]">
              Move funds to your bank
            </h2>
          </div>

          {/* Amount Input */}
          <div className="bg-[#F7F7F2] border border-[#101010]/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label_1.Label className="text-[13px] font-medium text-[#101010]">
                Amount to send
              </label_1.Label>
              <CurrencyPill currency="USDC"/>
            </div>
            <input_1.Input type="number" value={amount} onChange={function (e) { return setAmount(e.target.value); }} className="text-[28px] font-semibold tabular-nums h-14 border-0 bg-transparent p-0 focus-visible:ring-0" placeholder="0.00"/>
            <div className="mt-3 flex justify-between text-[12px]">
              <span className="text-[#101010]/60">Demo balance</span>
              <span className="font-medium tabular-nums text-[#101010]">
                {(0, utils_1.formatUsd)(2500000)}
              </span>
            </div>
          </div>

          {/* Destination */}
          <div>
            <label_1.Label className="text-[13px] font-medium text-[#101010] mb-3 block">
              Send to
            </label_1.Label>
            <DestinationSelector value={destinationType} onChange={setDestinationType} hasAchAccount={!!achAccount} hasIbanAccount={!!ibanAccount} isTechnical={false}/>
          </div>

          {/* Quote Preview */}
          <QuotePreview amountUsdc={Number(amount || 0)} destinationType={destinationType}/>

          <div className="text-center text-[11px] text-[#101010]/40 uppercase tracking-[0.14em]">
            Demo Mode • No actual funds will be transferred
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="flex-shrink-0 bg-white border-t border-[#101010]/10 p-4 sm:p-6">
        <button_1.Button onClick={handleTransfer} disabled={!amount || Number(amount) <= 0} className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white h-14 text-[15px] font-semibold rounded-xl transition-all shadow-lg shadow-[#1B29FF]/20">
          <span>Continue</span>
          <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
        </button_1.Button>
      </div>
    </div>);
}
// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================
function SimplifiedOffRamp(props) {
    var _a = props.mode, mode = _a === void 0 ? 'real' : _a, rest = __rest(props, ["mode"]);
    if (mode === 'demo') {
        return <SimplifiedOffRampDemo {...rest}/>;
    }
    return <SimplifiedOffRampReal {...rest}/>;
}
// ============================================================================
// REAL MODE COMPONENT
// ============================================================================
function SimplifiedOffRampReal(_a) {
    var _this = this;
    var _b, _c;
    var fundingSources = _a.fundingSources, prefillFromInvoice = _a.prefillFromInvoice, defaultValues = _a.defaultValues, maxBalance = _a.maxBalance;
    var _d = (0, react_1.useState)(0), currentStep = _d[0], setCurrentStep = _d[1];
    var _e = (0, react_1.useState)(1), formStep = _e[0], setFormStep = _e[1];
    var _f = (0, react_1.useState)(false), isLoading = _f[0], setIsLoading = _f[1];
    var _g = (0, react_1.useState)('Processing...'), loadingMessage = _g[0], setLoadingMessage = _g[1];
    var _h = (0, react_1.useState)(null), error = _h[0], setError = _h[1];
    var _j = (0, react_1.useState)(null), usdcBalance = _j[0], setUsdcBalance = _j[1];
    var _k = (0, react_1.useState)(null), wethBalance = _k[0], setWethBalance = _k[1];
    var _l = (0, react_1.useState)(null), ethBalance = _l[0], setEthBalance = _l[1];
    var _m = (0, react_1.useState)(false), isLoadingBalance = _m[0], setIsLoadingBalance = _m[1];
    var _o = (0, react_1.useState)(null), transferDetails = _o[0], setTransferDetails = _o[1];
    // Track the current quote for creating transfer
    var _p = (0, react_1.useState)(null), currentQuote = _p[0], setCurrentQuote = _p[1];
    var _q = (0, react_1.useState)(null), userOpHash = _q[0], setUserOpHash = _q[1];
    var _r = (0, react_1.useState)(null), primarySafeAddress = _r[0], setPrimarySafeAddress = _r[1];
    var _s = (0, react_1.useState)(null), cryptoTxHash = _s[0], setCryptoTxHash = _s[1];
    var smartClient = (0, smart_wallets_1.useSmartWallets)().client;
    var isTechnical = (0, bimodal_1.useBimodal)().isTechnical;
    var _t = react_2.api.settings.userSafes.getPrimarySafeAddress.useQuery(), fetchedPrimarySafeAddress = _t.data, isLoadingSafeAddress = _t.isLoading;
    var _u = (0, use_safe_relay_1.useSafeRelay)(primarySafeAddress || undefined), isRelayReady = _u.ready, sendWithRelay = _u.send;
    // Saved bank accounts
    var _v = react_2.api.settings.bankAccounts.listBankAccounts.useQuery(), savedBankAccounts = _v.data, refetchBankAccounts = _v.refetch;
    var addBankAccountMutation = react_2.api.settings.bankAccounts.addBankAccount.useMutation({
        onSuccess: function () {
            refetchBankAccounts();
            sonner_1.toast.success('Bank account saved for future transfers');
        },
        onError: function (err) {
            sonner_1.toast.error('Failed to save bank account', {
                description: err.message,
            });
        },
    });
    var getAccountType = function (source) {
        return source.sourceAccountType || source.accountType;
    };
    var achAccount = fundingSources.find(function (source) { return getAccountType(source) === 'us_ach'; });
    var ibanAccount = fundingSources.find(function (source) { return getAccountType(source) === 'iban'; });
    (0, react_1.useEffect)(function () {
        if (fetchedPrimarySafeAddress) {
            setPrimarySafeAddress(fetchedPrimarySafeAddress);
        }
    }, [fetchedPrimarySafeAddress]);
    // Only default to crypto if technical mode AND no bank accounts
    var shouldDefaultToCrypto = isTechnical && !ibanAccount && !achAccount;
    var mergedDefaultValues = __assign({ destinationType: shouldDefaultToCrypto
            ? 'crypto'
            : achAccount
                ? 'ach'
                : ibanAccount
                    ? 'iban'
                    : 'ach', accountHolderType: 'individual', country: 'US', city: '', streetLine1: '', streetLine2: '', postalCode: '', cryptoAddress: '', cryptoAsset: 'usdc', amount: (prefillFromInvoice === null || prefillFromInvoice === void 0 ? void 0 : prefillFromInvoice.amount) || '' }, defaultValues);
    var _w = (0, react_hook_form_1.useForm)({
        defaultValues: mergedDefaultValues,
    }), register = _w.register, handleSubmit = _w.handleSubmit, setValue = _w.setValue, control = _w.control, watch = _w.watch, errors = _w.formState.errors, trigger = _w.trigger;
    var destinationType = watch('destinationType');
    var accountHolderType = watch('accountHolderType');
    var watchedAmount = watch('amount');
    var cryptoAsset = watch('cryptoAsset') || 'usdc';
    var savedBankAccountId = watch('savedBankAccountId');
    var saveForFuture = watch('saveForFuture');
    // Track if user wants to use a new bank account vs saved
    var _x = (0, react_1.useState)(true), useNewAccount = _x[0], setUseNewAccount = _x[1];
    // Helper to get the balance for the selected crypto asset
    var getSelectedAssetBalance = (0, react_1.useCallback)(function () {
        switch (cryptoAsset) {
            case 'usdc':
                return usdcBalance;
            case 'weth':
                return wethBalance;
            case 'eth':
                return ethBalance;
            default:
                return usdcBalance;
        }
    }, [cryptoAsset, usdcBalance, wethBalance, ethBalance]);
    var selectedAssetConfig = CRYPTO_ASSETS[cryptoAsset];
    (0, react_1.useEffect)(function () {
        var fetchBalances = function () { return __awaiter(_this, void 0, void 0, function () {
            var publicClient, usdcBal, wethBal, ethBal, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!primarySafeAddress)
                            return [2 /*return*/];
                        setIsLoadingBalance(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        publicClient = (0, viem_1.createPublicClient)({
                            chain: chains_1.base,
                            transport: (0, viem_1.http)(process.env.NEXT_PUBLIC_BASE_RPC_URL),
                        });
                        return [4 /*yield*/, publicClient.readContract({
                                address: USDC_BASE_ADDRESS,
                                abi: erc20AbiBalanceOf,
                                functionName: 'balanceOf',
                                args: [primarySafeAddress],
                            })];
                    case 2:
                        usdcBal = _a.sent();
                        setUsdcBalance((0, viem_1.formatUnits)(usdcBal, constants_1.USDC_DECIMALS));
                        if (!isTechnical) return [3 /*break*/, 5];
                        return [4 /*yield*/, publicClient.readContract({
                                address: constants_1.WETH_ADDRESS,
                                abi: erc20AbiBalanceOf,
                                functionName: 'balanceOf',
                                args: [primarySafeAddress],
                            })];
                    case 3:
                        wethBal = _a.sent();
                        setWethBalance((0, viem_1.formatUnits)(wethBal, constants_1.WETH_DECIMALS));
                        return [4 /*yield*/, publicClient.getBalance({
                                address: primarySafeAddress,
                            })];
                    case 4:
                        ethBal = _a.sent();
                        setEthBalance((0, viem_1.formatUnits)(ethBal, 18));
                        _a.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        err_1 = _a.sent();
                        sonner_1.toast.error('Could not fetch balances.');
                        return [3 /*break*/, 8];
                    case 7:
                        setIsLoadingBalance(false);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        fetchBalances();
    }, [primarySafeAddress, isTechnical]);
    // Effect to populate form when selecting a saved bank account
    (0, react_1.useEffect)(function () {
        if (!savedBankAccountId || useNewAccount)
            return;
        var selectedAccount = savedBankAccounts === null || savedBankAccounts === void 0 ? void 0 : savedBankAccounts.find(function (acc) { return acc.id === savedBankAccountId; });
        if (!selectedAccount)
            return;
        // Populate form with saved account details
        setValue('bankName', selectedAccount.bankName);
        setValue('accountHolderType', selectedAccount.accountHolderType);
        setValue('country', selectedAccount.country);
        // Set destination type based on account type
        if (selectedAccount.accountType === 'us') {
            setValue('destinationType', 'ach');
        }
        else if (selectedAccount.accountType === 'iban') {
            setValue('destinationType', 'iban');
        }
    }, [savedBankAccountId, savedBankAccounts, useNewAccount, setValue]);
    // Use quote-based transfer creation for accurate amounts
    var createTransferFromQuoteMutation = react_2.api.align.createOfframpTransferFromQuote.useMutation({
        onSuccess: function (data) {
            setTransferDetails(data);
            setCurrentStep(1);
            sonner_1.toast.success('Transfer initiated. Ready to send funds.');
        },
        onError: function (err) { return setError("Failed to initiate transfer: ".concat(err.message)); },
    });
    var prepareTxMutation = react_2.api.align.prepareOfframpTokenTransfer.useMutation({
        onError: function (err) {
            return setError("Transaction preparation failed: ".concat(err.message));
        },
    });
    var completeTransferMutation = react_2.api.align.completeOfframpTransfer.useMutation({
        onSuccess: function () {
            setCurrentStep(2);
            sonner_1.toast.success('Transfer processing.');
        },
        onError: function (err) { return setError("Failed to finalize transfer: ".concat(err.message)); },
        onSettled: function () { return setIsLoading(false); },
    });
    var isSubmittingTransfer = isLoading || createTransferFromQuoteMutation.isPending;
    var handleNextStep = function () { return __awaiter(_this, void 0, void 0, function () {
        var fieldsToValidate, isValid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fieldsToValidate = [];
                    if (formStep === 1) {
                        fieldsToValidate = ['destinationType'];
                    }
                    else if (formStep === 2) {
                        fieldsToValidate = ['amount'];
                        if (destinationType === 'crypto') {
                            fieldsToValidate.push('cryptoAddress', 'cryptoAsset');
                        }
                        else {
                            fieldsToValidate.push('accountHolderType', 'bankName');
                            if (accountHolderType === 'individual') {
                                fieldsToValidate.push('accountHolderFirstName', 'accountHolderLastName');
                            }
                            else {
                                fieldsToValidate.push('accountHolderBusinessName');
                            }
                            if (destinationType === 'ach') {
                                fieldsToValidate.push('accountNumber', 'routingNumber');
                            }
                            else {
                                fieldsToValidate.push('iban', 'bic');
                            }
                            fieldsToValidate.push('country', 'city', 'streetLine1', 'postalCode');
                        }
                    }
                    return [4 /*yield*/, trigger(fieldsToValidate)];
                case 1:
                    isValid = _a.sent();
                    if (isValid) {
                        setFormStep(formStep + 1);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handlePreviousStep = function () {
        setFormStep(formStep - 1);
    };
    var handleCryptoTransfer = function (values) { return __awaiter(_this, void 0, void 0, function () {
        var asset, assetConfig, valueInUnits, transactions, transferData, txHash, err_2, errMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isRelayReady || !values.cryptoAddress || !primarySafeAddress) {
                        sonner_1.toast.error('Required information is missing.');
                        return [2 /*return*/];
                    }
                    if (!(0, viem_1.isAddress)(values.cryptoAddress)) {
                        setError('Invalid recipient address.');
                        return [2 /*return*/];
                    }
                    asset = values.cryptoAsset || 'usdc';
                    assetConfig = CRYPTO_ASSETS[asset];
                    setIsLoading(true);
                    setError(null);
                    setCryptoTxHash(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoadingMessage("Preparing ".concat(assetConfig.symbol, " transfer..."));
                    valueInUnits = (0, viem_1.parseUnits)(values.amount, assetConfig.decimals);
                    if (valueInUnits <= 0n) {
                        throw new Error('Amount must be greater than 0.');
                    }
                    transactions = void 0;
                    if (assetConfig.isNative) {
                        // Native ETH transfer
                        transactions = [
                            {
                                to: values.cryptoAddress,
                                value: valueInUnits.toString(),
                                data: '0x',
                            },
                        ];
                    }
                    else {
                        transferData = (0, viem_1.encodeFunctionData)({
                            abi: viem_2.erc20Abi,
                            functionName: 'transfer',
                            args: [values.cryptoAddress, valueInUnits],
                        });
                        transactions = [
                            {
                                to: assetConfig.address,
                                value: '0',
                                data: transferData,
                            },
                        ];
                    }
                    setLoadingMessage('Sending transaction...');
                    return [4 /*yield*/, sendWithRelay(transactions)];
                case 2:
                    txHash = _a.sent();
                    setCryptoTxHash(txHash);
                    setCurrentStep(2);
                    sonner_1.toast.success("".concat(assetConfig.symbol, " transfer completed successfully!"));
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    errMsg = err_2.message || 'An unknown error occurred.';
                    setError("Failed to send ".concat(assetConfig.symbol, " transfer: ").concat(errMsg));
                    sonner_1.toast.error("".concat(assetConfig.symbol, " transfer failed"), {
                        description: errMsg,
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleInitiateSubmit = function (values) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setError(null);
                    if (!(values.destinationType === 'crypto')) return [3 /*break*/, 2];
                    return [4 /*yield*/, handleCryptoTransfer(values)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
                case 2:
                    // Validate that we have a quote
                    if (!currentQuote) {
                        sonner_1.toast.error('Please wait for the quote to load.');
                        return [2 /*return*/];
                    }
                    if (!(values.saveForFuture && useNewAccount)) return [3 /*break*/, 6];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, addBankAccountMutation.mutateAsync({
                            accountName: values.accountNickname ||
                                "".concat(values.bankName, " - ").concat(values.accountHolderType === 'individual' ? "".concat(values.accountHolderFirstName, " ").concat(values.accountHolderLastName) : values.accountHolderBusinessName),
                            bankName: values.bankName,
                            accountHolderType: values.accountHolderType,
                            accountHolderFirstName: values.accountHolderFirstName,
                            accountHolderLastName: values.accountHolderLastName,
                            accountHolderBusinessName: values.accountHolderBusinessName,
                            country: values.country,
                            city: values.city,
                            streetLine1: values.streetLine1,
                            streetLine2: values.streetLine2,
                            postalCode: values.postalCode,
                            accountType: values.destinationType === 'ach' ? 'us' : 'iban',
                            accountNumber: values.accountNumber,
                            routingNumber: values.routingNumber,
                            ibanNumber: values.iban,
                            bicSwift: values.bic,
                            isDefault: false,
                        })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _a = _b.sent();
                    return [3 /*break*/, 6];
                case 6: 
                // Create transfer from quote with accurate amounts
                return [4 /*yield*/, createTransferFromQuoteMutation.mutateAsync({
                        quoteId: currentQuote.quoteId,
                        bankName: values.bankName,
                        accountHolderType: values.accountHolderType,
                        accountHolderFirstName: values.accountHolderFirstName,
                        accountHolderLastName: values.accountHolderLastName,
                        accountHolderBusinessName: values.accountHolderBusinessName,
                        country: values.country,
                        city: values.city,
                        streetLine1: values.streetLine1,
                        streetLine2: values.streetLine2,
                        postalCode: values.postalCode,
                        accountType: values.destinationType === 'ach' ? 'us' : 'iban',
                        accountNumber: values.accountNumber,
                        routingNumber: values.routingNumber,
                        ibanNumber: values.iban,
                        bicSwift: values.bic,
                        // Pass quote data for DB storage
                        sourceAmount: currentQuote.sourceAmount,
                        destinationAmount: currentQuote.destinationAmount,
                        destinationCurrency: currentQuote.destinationCurrency,
                        destinationPaymentRails: values.destinationType === 'ach' ? 'ach' : 'sepa',
                        feeAmount: currentQuote.feeAmount,
                    })];
                case 7:
                    // Create transfer from quote with accurate amounts
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleSendFunds = function () { return __awaiter(_this, void 0, void 0, function () {
        var alignTransferId, preparedData, safeSdk, safeTransaction, ownerAddress, encodedExecData, txResponse, err_3, errMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!transferDetails || !primarySafeAddress || !(smartClient === null || smartClient === void 0 ? void 0 : smartClient.account)) {
                        sonner_1.toast.error('Required information is missing.');
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    setError(null);
                    alignTransferId = transferDetails.alignTransferId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    setLoadingMessage('Preparing transaction...');
                    return [4 /*yield*/, prepareTxMutation.mutateAsync({
                            alignTransferId: alignTransferId,
                        })];
                case 2:
                    preparedData = _a.sent();
                    if (!(preparedData === null || preparedData === void 0 ? void 0 : preparedData.to) || !preparedData.data) {
                        throw new Error('Invalid transaction data from server.');
                    }
                    setLoadingMessage('Initializing secure account...');
                    return [4 /*yield*/, protocol_kit_1.default.init({
                            provider: process.env.NEXT_PUBLIC_BASE_RPC_URL,
                            safeAddress: primarySafeAddress,
                        })];
                case 3:
                    safeSdk = _a.sent();
                    setLoadingMessage('Creating transaction...');
                    return [4 /*yield*/, safeSdk.createTransaction({
                            transactions: [preparedData],
                        })];
                case 4:
                    safeTransaction = _a.sent();
                    safeTransaction.data.safeTxGas = BigInt(220000).toString();
                    setLoadingMessage('Signing transaction...');
                    ownerAddress = smartClient.account.address;
                    safeTransaction.addSignature({
                        signer: ownerAddress,
                        data: buildPrevalidatedSig(ownerAddress),
                    });
                    encodedExecData = (0, viem_1.encodeFunctionData)({
                        abi: core_1.SAFE_ABI,
                        functionName: 'execTransaction',
                        args: [
                            safeTransaction.data.to,
                            BigInt(safeTransaction.data.value),
                            safeTransaction.data.data,
                            safeTransaction.data.operation,
                            BigInt(safeTransaction.data.safeTxGas),
                            BigInt(safeTransaction.data.baseGas),
                            BigInt(safeTransaction.data.gasPrice),
                            safeTransaction.data.gasToken,
                            safeTransaction.data.refundReceiver,
                            safeTransaction.encodedSignatures(),
                        ],
                    });
                    setLoadingMessage('Sending transaction...');
                    return [4 /*yield*/, smartClient.sendTransaction({
                            to: primarySafeAddress,
                            data: encodedExecData,
                        })];
                case 5:
                    txResponse = _a.sent();
                    setUserOpHash(txResponse);
                    setLoadingMessage('Finalizing...');
                    completeTransferMutation.mutate({
                        alignTransferId: alignTransferId,
                        depositTransactionHash: txResponse,
                    });
                    return [3 /*break*/, 7];
                case 6:
                    err_3 = _a.sent();
                    errMsg = err_3.message || 'An unknown error occurred.';
                    setError("Failed to send funds: ".concat(errMsg));
                    setIsLoading(false);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Loading state
    if (isLoadingSafeAddress) {
        return (<div className="bg-white flex justify-center items-center h-40">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-[#1B29FF]"/>
      </div>);
    }
    // Error state - no safe
    if (!primarySafeAddress) {
        return (<div className="bg-white p-6">
        <alert_1.Alert className="border-red-200 bg-red-50">
          <lucide_react_1.AlertCircle className="h-4 w-4 text-red-600"/>
          <alert_1.AlertTitle className="text-red-900">
            Primary Account Not Found
          </alert_1.AlertTitle>
          <alert_1.AlertDescription className="text-red-700">
            We could not find your primary account. Please set it up in settings
            to proceed.
          </alert_1.AlertDescription>
        </alert_1.Alert>
      </div>);
    }
    // ============================================================================
    // SUCCESS STATE
    // ============================================================================
    if (currentStep === 2) {
        var isEur = destinationType === 'iban';
        var currencySymbol = isEur ? '€' : '$';
        // Use actual values from the transfer/quote, not hardcoded calculations
        // For bank transfers, use transferDetails; for crypto, use watchedAmount
        var sourceAmount = transferDetails
            ? Number(transferDetails.sourceAmount || transferDetails.depositAmount || 0)
            : Number(watchedAmount || 0);
        var destinationAmount = transferDetails
            ? Number(transferDetails.destinationAmount || 0)
            : 0;
        var fee = transferDetails ? Number(transferDetails.fee || 0) : 0;
        return (<div className="bg-white h-full max-h-[100dvh] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center justify-center p-6 space-y-8">
          <SuccessAnimation />

          <div className="text-center space-y-3">
            <h3 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.01em] text-[#101010]">
              {cryptoTxHash ? 'Transfer Complete' : 'Transfer Processing'}
            </h3>
            <p className="text-[14px] text-[#101010]/65 max-w-md">
              {cryptoTxHash
                ? 'Your crypto transfer has been completed successfully.'
                : destinationType === 'crypto'
                    ? 'Your transfer is being processed.'
                    : "Your bank will receive ".concat(currencySymbol).concat(destinationAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), " ").concat(isEur ? 'EUR' : 'USD', " in ").concat(isEur ? 'less than 24 hours' : '1-2 business days', ".")}
            </p>
          </div>

          {/* Transaction summary */}
          {destinationType !== 'crypto' && (<div className="w-full max-w-sm bg-[#F7F7F2] rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-[#101010]/60">You sent</span>
                <span className="text-[15px] font-medium tabular-nums">
                  {sourceAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                })}{' '}
                  USDC
                </span>
              </div>
              {fee > 0 && (<div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#101010]/60">Fee</span>
                  <span className="text-[15px] tabular-nums text-[#101010]/70">
                    -{fee.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                    USDC
                  </span>
                </div>)}
              <div className="border-t border-[#101010]/10 pt-3 flex justify-between items-center">
                <span className="text-[13px] font-medium text-[#101010]">
                  Bank receives
                </span>
                <span className="text-[18px] font-semibold tabular-nums text-green-600">
                  {currencySymbol}
                  {destinationAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                })}
                </span>
              </div>
            </div>)}

          {(userOpHash || cryptoTxHash) && (<a href={"https://basescan.org/tx/".concat(userOpHash || cryptoTxHash)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[13px] text-[#1B29FF] hover:text-[#1420CC] transition-colors">
              <span>View on Basescan</span>
              <lucide_react_1.ExternalLink className="h-3.5 w-3.5"/>
            </a>)}

          <button_1.Button onClick={function () {
                setCurrentStep(0);
                setCryptoTxHash(null);
                setUserOpHash(null);
                setFormStep(1);
            }} className="bg-[#1B29FF] hover:bg-[#1420CC] text-white px-8 py-3 text-[14px] font-medium rounded-xl shadow-lg shadow-[#1B29FF]/20">
            Make Another Transfer
          </button_1.Button>
        </div>
      </div>);
    }
    // ============================================================================
    // CONFIRMATION STATE (after transfer created, before sending)
    // ============================================================================
    if (currentStep === 1 && transferDetails) {
        var isEur = destinationType === 'iban';
        // Use data from the quote-based transfer
        // sourceAmount = USDC user will send, destinationAmount = fiat bank receives
        var sourceAmount = Number(transferDetails.sourceAmount || transferDetails.depositAmount || 0);
        var destinationAmount = Number(transferDetails.destinationAmount || 0);
        var feeAmount = Number(transferDetails.fee || 0);
        var currencySymbol = isEur ? '€' : '$';
        var currencyCode = isEur ? 'EUR' : 'USD';
        return (<div className="bg-white h-full max-h-[100dvh] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-5 sm:p-6 space-y-6">
            {/* Header */}
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                Confirm Transfer
              </p>
              <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-[#101010]">
                Review and send
              </h2>
            </div>

            {/* Transfer summary */}
            <div className="space-y-4">
              {/* You send */}
              <div className="bg-[#F7F7F2] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-[#101010]/50 uppercase tracking-wider">
                    You send
                  </span>
                  <CurrencyPill currency="USDC"/>
                </div>
                <p className="text-[32px] font-bold tabular-nums text-[#101010]">
                  {sourceAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
            })}
                </p>
                <p className="text-[13px] text-[#101010]/50 mt-1">
                  Includes{' '}
                  {feeAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
            })}{' '}
                  USDC processing fee
                </p>
              </div>

              <ConversionArrow />

              {/* They receive */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-green-700/70 uppercase tracking-wider">
                    Bank receives
                  </span>
                  <CurrencyPill currency={currencyCode} variant="highlight"/>
                </div>
                <p className="text-[36px] font-bold tabular-nums text-green-700">
                  {currencySymbol}
                  {destinationAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
            })}
                </p>
                <p className="text-[13px] text-green-600/70 mt-1">
                  Arrives in 1-2 business days
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white border border-[#101010]/10 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#101010]/60">Network</span>
                <span className="font-medium text-[#101010]">
                  {transferDetails.depositNetwork.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#101010]/60">Effective rate</span>
                <span className="font-medium tabular-nums text-[#101010]">
                  {sourceAmount.toFixed(2)} USDC → {currencySymbol}
                  {destinationAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed bottom actions */}
        <div className="flex-shrink-0 bg-white border-t border-[#101010]/10 p-4 sm:p-6 space-y-3">
          {error && (<alert_1.Alert className="bg-red-50 border-red-200 mb-3">
              <lucide_react_1.AlertCircle className="h-4 w-4 text-red-600"/>
              <alert_1.AlertDescription className="text-red-700 text-[13px]">
                {error}
              </alert_1.AlertDescription>
            </alert_1.Alert>)}

          <button_1.Button onClick={handleSendFunds} disabled={isLoading} className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white h-14 text-[15px] font-semibold rounded-xl transition-all shadow-lg shadow-[#1B29FF]/20">
            {isLoading ? (<>
                <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                {loadingMessage}
              </>) : (<>
                Confirm & Send
                <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
              </>)}
          </button_1.Button>

          <button type="button" onClick={function () { return setCurrentStep(0); }} className="w-full text-[13px] text-[#101010]/60 hover:text-[#101010] py-2 transition-colors">
            Go back
          </button>
        </div>
      </div>);
    }
    // ============================================================================
    // MAIN FORM
    // ============================================================================
    return (<div className="bg-white h-full max-h-[100dvh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4 flex-shrink-0">
        {prefillFromInvoice && (<div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-start gap-3">
              <lucide_react_1.Receipt className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"/>
              <div>
                <p className="text-[13px] font-medium text-[#101010] mb-1">
                  Payment for Invoice
                </p>
                <div className="text-[12px] text-[#101010]/70 space-y-0.5">
                  {prefillFromInvoice.vendorName && (<p>Vendor: {prefillFromInvoice.vendorName}</p>)}
                  {prefillFromInvoice.amount && (<p>
                      Amount: {(0, utils_1.formatUsd)(Number(prefillFromInvoice.amount))}
                    </p>)}
                </div>
              </div>
            </div>
          </div>)}

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-1">
              Step {formStep} of 3
            </p>
            <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.01em] text-[#101010]">
              {formStep === 1
            ? 'Where to?'
            : formStep === 2
                ? 'How much?'
                : 'Confirm'}
            </h2>
          </div>
          <ProgressStepper currentStep={formStep - 1} totalSteps={3}/>
        </div>
      </div>

      {/* Scrollable form content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <form onSubmit={handleSubmit(handleInitiateSubmit)} className="p-5 sm:p-6">
          {/* ==================== STEP 1: Destination ==================== */}
          {formStep === 1 && (<div className="space-y-5">
              <p className="text-[14px] text-[#101010]/70">
                Choose where you'd like to receive your funds.
              </p>

              <react_hook_form_1.Controller control={control} name="destinationType" render={function (_a) {
                var field = _a.field;
                return (<DestinationSelector value={field.value} onChange={field.onChange} hasAchAccount={!!achAccount} hasIbanAccount={!!ibanAccount} isTechnical={isTechnical}/>);
            }}/>

              {errors.destinationType && (<p className="text-[12px] text-red-500">
                  {errors.destinationType.message}
                </p>)}
            </div>)}

          {/* ==================== STEP 2: Amount & Details ==================== */}
          {formStep === 2 && destinationType !== 'crypto' && (<div className="space-y-6">
              {/* Unified Amount + Quote Component (Wise-style) */}
              <react_hook_form_1.Controller control={control} name="amount" rules={{
                required: 'Amount is required',
                validate: function (value) {
                    var num = parseFloat(value);
                    if (isNaN(num) || num <= 0)
                        return 'Please enter a valid positive amount.';
                    // Validate against USDC balance
                    var balance = parseFloat(usdcBalance || '0');
                    if (num > balance)
                        return "Insufficient balance. You have ".concat(balance.toFixed(2), " USDC.");
                    return true;
                },
            }} render={function (_a) {
                var _b;
                var field = _a.field;
                return (<UnifiedAmountQuote amountValue={field.value || ''} onAmountChange={function (value) {
                        field.onChange(value);
                    }} destinationType={destinationType} onQuoteChange={setCurrentQuote} usdcBalance={usdcBalance} isLoadingBalance={isLoadingBalance} maxBalance={maxBalance} error={(_b = errors.amount) === null || _b === void 0 ? void 0 : _b.message}/>);
            }}/>

              {/* Saved Bank Accounts Selector */}
              {savedBankAccounts && savedBankAccounts.length > 0 && (<div className="space-y-3">
                  <p className="text-[13px] font-medium text-[#101010]">
                    Send to
                  </p>

                  {/* Saved accounts */}
                  <div className="space-y-2">
                    {savedBankAccounts
                    .filter(function (acc) {
                    return destinationType === 'ach'
                        ? acc.accountType === 'us'
                        : acc.accountType === 'iban';
                })
                    .map(function (account) { return (<button key={account.id} type="button" onClick={function () {
                        setUseNewAccount(false);
                        setValue('savedBankAccountId', account.id);
                        // Populate form fields from saved account
                        setValue('bankName', account.bankName);
                        setValue('accountHolderType', account.accountHolderType);
                        setValue('country', account.country);
                    }} className={(0, utils_1.cn)('w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left', savedBankAccountId === account.id && !useNewAccount
                        ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                        : 'border-[#101010]/10 hover:border-[#101010]/20')}>
                          <div className="w-10 h-10 bg-[#F7F7F2] rounded-lg flex items-center justify-center">
                            <lucide_react_1.CreditCard className="h-5 w-5 text-[#101010]/60"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium text-[#101010] truncate">
                              {account.accountName}
                            </p>
                            <p className="text-[12px] text-[#101010]/60">
                              {account.bankName} •{' '}
                              {account.maskedIbanNumber ||
                        account.maskedAccountNumber}
                            </p>
                          </div>
                          {savedBankAccountId === account.id &&
                        !useNewAccount && (<div className="w-5 h-5 bg-[#1B29FF] rounded-full flex items-center justify-center">
                                <lucide_react_1.Check className="h-3 w-3 text-white"/>
                              </div>)}
                        </button>); })}

                    {/* Add new account option */}
                    <button type="button" onClick={function () {
                    setUseNewAccount(true);
                    setValue('savedBankAccountId', undefined);
                }} className={(0, utils_1.cn)('w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed transition-all text-left', useNewAccount
                    ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                    : 'border-[#101010]/10 hover:border-[#101010]/20')}>
                      <div className="w-10 h-10 bg-[#1B29FF]/10 rounded-lg flex items-center justify-center">
                        <lucide_react_1.Plus className="h-5 w-5 text-[#1B29FF]"/>
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] font-medium text-[#101010]">
                          New bank account
                        </p>
                        <p className="text-[12px] text-[#101010]/60">
                          Enter recipient details manually
                        </p>
                      </div>
                      {useNewAccount && (<div className="w-5 h-5 bg-[#1B29FF] rounded-full flex items-center justify-center">
                          <lucide_react_1.Check className="h-3 w-3 text-white"/>
                        </div>)}
                    </button>
                  </div>
                </div>)}

              {/* Bank Account Details - only show when adding new account */}
              {(useNewAccount || !(savedBankAccounts === null || savedBankAccounts === void 0 ? void 0 : savedBankAccounts.length)) && (<div className="space-y-4">
                  <p className="text-[13px] font-medium text-[#101010]">
                    Recipient details
                  </p>

                  {/* Account Holder Type */}
                  <react_hook_form_1.Controller control={control} name="accountHolderType" render={function (_a) {
                    var field = _a.field;
                    return (<radio_group_1.RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-3">
                        <label className="flex items-center gap-2 px-4 py-2.5 border border-[#101010]/10 rounded-xl cursor-pointer hover:bg-[#F7F7F2]/50 transition-colors">
                          <radio_group_1.RadioGroupItem value="individual" id="individual"/>
                          <span className="text-[13px] text-[#101010]">
                            Individual
                          </span>
                        </label>
                        <label className="flex items-center gap-2 px-4 py-2.5 border border-[#101010]/10 rounded-xl cursor-pointer hover:bg-[#F7F7F2]/50 transition-colors">
                          <radio_group_1.RadioGroupItem value="business" id="business"/>
                          <span className="text-[13px] text-[#101010]">
                            Business
                          </span>
                        </label>
                      </radio_group_1.RadioGroup>);
                }}/>

                  {/* Name Fields */}
                  {accountHolderType === 'individual' ? (<div className="grid grid-cols-2 gap-3">
                      <div>
                        <label_1.Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          First Name
                        </label_1.Label>
                        <input_1.Input {...register('accountHolderFirstName', {
                    required: 'Required',
                })} placeholder="John" className="h-11 rounded-xl"/>
                        {errors.accountHolderFirstName && (<p className="text-[11px] text-red-500 mt-1">
                            {errors.accountHolderFirstName.message}
                          </p>)}
                      </div>
                      <div>
                        <label_1.Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          Last Name
                        </label_1.Label>
                        <input_1.Input {...register('accountHolderLastName', {
                    required: 'Required',
                })} placeholder="Doe" className="h-11 rounded-xl"/>
                        {errors.accountHolderLastName && (<p className="text-[11px] text-red-500 mt-1">
                            {errors.accountHolderLastName.message}
                          </p>)}
                      </div>
                    </div>) : (<div>
                      <label_1.Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                        Business Name
                      </label_1.Label>
                      <input_1.Input {...register('accountHolderBusinessName', {
                    required: 'Required',
                })} placeholder="Acme Corp" className="h-11 rounded-xl"/>
                      {errors.accountHolderBusinessName && (<p className="text-[11px] text-red-500 mt-1">
                          {errors.accountHolderBusinessName.message}
                        </p>)}
                    </div>)}

                  {/* Bank Details */}
                  <div>
                    <label_1.Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                      Bank Name
                    </label_1.Label>
                    <input_1.Input {...register('bankName', { required: 'Required' })} placeholder="Chase Bank" className="h-11 rounded-xl"/>
                    {errors.bankName && (<p className="text-[11px] text-red-500 mt-1">
                        {errors.bankName.message}
                      </p>)}
                  </div>

                  {destinationType === 'ach' ? (<div className="grid grid-cols-2 gap-3">
                      <div>
                        <label_1.Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          Account Number
                        </label_1.Label>
                        <input_1.Input {...register('accountNumber', {
                    required: 'Required',
                })} placeholder="123456789" className="h-11 rounded-xl"/>
                        {errors.accountNumber && (<p className="text-[11px] text-red-500 mt-1">
                            {errors.accountNumber.message}
                          </p>)}
                      </div>
                      <div>
                        <label_1.Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          Routing Number
                        </label_1.Label>
                        <input_1.Input {...register('routingNumber', {
                    required: 'Required',
                })} placeholder="021000021" className="h-11 rounded-xl"/>
                        {errors.routingNumber && (<p className="text-[11px] text-red-500 mt-1">
                            {errors.routingNumber.message}
                          </p>)}
                      </div>
                    </div>) : (<div className="space-y-3">
                      <div>
                        <label_1.Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          IBAN
                        </label_1.Label>
                        <input_1.Input {...register('iban', { required: 'Required' })} placeholder="DE89370400440532013000" className="h-11 rounded-xl font-mono text-[13px]"/>
                        {errors.iban && (<p className="text-[11px] text-red-500 mt-1">
                            {errors.iban.message}
                          </p>)}
                      </div>
                      <div>
                        <label_1.Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          BIC/SWIFT
                        </label_1.Label>
                        <input_1.Input {...register('bic', { required: 'Required' })} placeholder="COBADEFFXXX" className="h-11 rounded-xl font-mono text-[13px]"/>
                        {errors.bic && (<p className="text-[11px] text-red-500 mt-1">
                            {errors.bic.message}
                          </p>)}
                      </div>
                    </div>)}

                  {/* Address */}
                  <div className="space-y-3 pt-2">
                    <p className="text-[12px] text-[#101010]/60">
                      Beneficiary Address
                    </p>
                    <input_1.Input {...register('streetLine1', { required: 'Required' })} placeholder="Street address" className="h-11 rounded-xl"/>
                    <input_1.Input {...register('streetLine2')} placeholder="Apartment, suite, etc. (optional)" className="h-11 rounded-xl"/>
                    <div className="grid grid-cols-2 gap-3">
                      <input_1.Input {...register('city', { required: 'Required' })} placeholder="City" className="h-11 rounded-xl"/>
                      <input_1.Input {...register('postalCode', { required: 'Required' })} placeholder="ZIP / Postal" className="h-11 rounded-xl"/>
                    </div>
                    <react_hook_form_1.Controller control={control} name="country" rules={{ required: 'Required' }} render={function (_a) {
                    var field = _a.field;
                    return (<combo_box_1.Combobox options={COUNTRIES} value={field.value} onChange={field.onChange} placeholder="Select country..." searchPlaceholder="Search countries..." emptyPlaceholder="No country found." triggerClassName="h-11 rounded-xl"/>);
                }}/>
                  </div>

                  {/* Save for future transfers */}
                  <div className="pt-3 border-t border-[#101010]/10">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <react_hook_form_1.Controller control={control} name="saveForFuture" render={function (_a) {
                    var field = _a.field;
                    return (<checkbox_1.Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5"/>);
                }}/>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <lucide_react_1.BookmarkPlus className="h-4 w-4 text-[#1B29FF]"/>
                          <span className="text-[13px] font-medium text-[#101010] group-hover:text-[#1B29FF] transition-colors">
                            Save for future transfers
                          </span>
                        </div>
                        <p className="text-[12px] text-[#101010]/60 mt-0.5">
                          Quickly select this account for your next transfer
                        </p>
                      </div>
                    </label>

                    {/* Account nickname input - show when saving */}
                    {saveForFuture && (<div className="mt-3 pl-7">
                        <label_1.Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          Account nickname (optional)
                        </label_1.Label>
                        <input_1.Input {...register('accountNickname')} placeholder={"e.g., ".concat(watch('bankName') || 'Bank', " - ").concat(watch('accountHolderFirstName') || 'Name')} className="h-10 rounded-lg text-[13px]"/>
                      </div>)}
                  </div>
                </div>)}
            </div>)}

          {/* ==================== STEP 2: Crypto Transfer (Technical Mode) ==================== */}
          {formStep === 2 && destinationType === 'crypto' && (<div className="space-y-5">
              {/* Asset Selection */}
              <div className="relative bg-white border border-[#1B29FF]/20 rounded-xl overflow-hidden">
                <bimodal_1.BlueprintGrid className="opacity-30"/>
                <bimodal_1.Crosshairs position="top-left"/>
                <bimodal_1.Crosshairs position="top-right"/>

                <div className="relative z-10 p-4">
                  <p className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase mb-3">
                    SELECT_ASSET
                  </p>
                  <react_hook_form_1.Controller control={control} name="cryptoAsset" render={function (_a) {
                var field = _a.field;
                return (<radio_group_1.RadioGroup onValueChange={field.onChange} value={field.value || 'usdc'} className="grid grid-cols-3 gap-2">
                        {Object.entries(CRYPTO_ASSETS).map(function (_a) {
                        var key = _a[0], asset = _a[1];
                        var balance = key === 'usdc'
                            ? usdcBalance
                            : key === 'weth'
                                ? wethBalance
                                : ethBalance;
                        var isSelected = field.value === key;
                        return (<label key={key} className={(0, utils_1.cn)('relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all', isSelected
                                ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                                : 'border-[#1B29FF]/20 hover:border-[#1B29FF]/40')}>
                              <radio_group_1.RadioGroupItem value={key} className="sr-only"/>
                              <span className="text-lg mb-1">{asset.icon}</span>
                              <span className="font-mono text-[12px] font-medium">
                                {asset.symbol}
                              </span>
                              <span className="font-mono text-[10px] text-[#101010]/50 tabular-nums">
                                {balance
                                ? parseFloat(balance).toFixed(4)
                                : '0.0000'}
                              </span>
                              {isSelected && (<lucide_react_1.Check className="absolute top-1 right-1 h-3 w-3 text-[#1B29FF]"/>)}
                            </label>);
                    })}
                      </radio_group_1.RadioGroup>);
            }}/>
                </div>
              </div>

              {/* Amount */}
              <div className="relative bg-white border border-[#1B29FF]/20 rounded-xl overflow-hidden">
                <bimodal_1.BlueprintGrid className="opacity-30"/>

                <div className="relative z-10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase">
                      AMOUNT::{selectedAssetConfig.symbol}
                    </p>
                    <span className="font-mono text-[9px] text-[#101010]/50 bg-[#101010]/5 px-2 py-0.5 rounded">
                      on Base
                    </span>
                  </div>
                  <div className="relative">
                    <input_1.Input {...register('amount', {
            required: 'Amount is required',
            validate: function (value) {
                var num = parseFloat(value);
                if (isNaN(num) || num <= 0)
                    return 'Invalid amount';
                var bal = getSelectedAssetBalance();
                if (bal && num > parseFloat(bal))
                    return 'Exceeds balance';
                return true;
            },
        })} placeholder="0.00" className="text-[24px] font-mono font-semibold tabular-nums h-12 border-[#1B29FF]/20 rounded-lg pr-20"/>
                    {getSelectedAssetBalance() && (<button type="button" onClick={function () {
                    var bal = getSelectedAssetBalance();
                    if (bal)
                        setValue('amount', bal, { shouldValidate: true });
                }} className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 font-mono text-[10px] text-[#1B29FF] border border-[#1B29FF]/30 rounded hover:bg-[#1B29FF]/5">
                        MAX
                      </button>)}
                  </div>
                  {errors.amount && (<p className="font-mono text-[11px] text-red-500 mt-2">
                      {errors.amount.message}
                    </p>)}
                </div>
              </div>

              {/* Recipient Address */}
              <div className="relative bg-white border border-[#1B29FF]/20 rounded-xl overflow-hidden">
                <bimodal_1.BlueprintGrid className="opacity-30"/>

                <div className="relative z-10 p-4">
                  <p className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase mb-3">
                    DESTINATION_ADDRESS
                  </p>
                  <input_1.Input {...register('cryptoAddress', {
            required: 'Address required',
            validate: function (v) { return (v && (0, viem_1.isAddress)(v)) || 'Invalid address'; },
        })} placeholder="0x..." className="h-12 font-mono text-[13px] border-[#1B29FF]/20 rounded-lg"/>
                  {errors.cryptoAddress && (<p className="font-mono text-[11px] text-red-500 mt-2">
                      {errors.cryptoAddress.message}
                    </p>)}
                </div>
              </div>
            </div>)}

          {/* ==================== STEP 3: Review ==================== */}
          {formStep === 3 && (<div className="space-y-5">
              {isSubmittingTransfer && (<div className="flex flex-col items-center justify-center py-8 gap-4">
                  <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-[#1B29FF]"/>
                  <p className="text-[14px] text-[#101010]/70">
                    {loadingMessage}
                  </p>
                </div>)}

              {!isSubmittingTransfer && (<>
                  {/* Summary */}
                  <div className="bg-[#F7F7F2] rounded-2xl p-5 space-y-4">
                    <p className="text-[11px] text-[#101010]/50 uppercase tracking-wider">
                      Transfer Summary
                    </p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-[#101010]/60">
                          Type
                        </span>
                        <span className="text-[13px] font-medium text-[#101010]">
                          {destinationType === 'ach'
                    ? 'ACH Transfer'
                    : destinationType === 'iban'
                        ? 'SEPA Transfer'
                        : "".concat(selectedAssetConfig.symbol, " Transfer")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-[#101010]/60">
                          Network
                        </span>
                        <span className="text-[13px] font-medium text-[#101010]">
                          Base
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-[#101010]/60">
                          You send
                        </span>
                        <div className="text-right">
                          <span className="text-[18px] font-semibold tabular-nums text-[#101010]">
                            {destinationType === 'crypto'
                    ? "".concat(watchedAmount, " ").concat(selectedAssetConfig.symbol)
                    : "".concat(watchedAmount, " USDC")}
                          </span>
                          <p className="text-[11px] text-[#101010]/50">
                            on Base
                          </p>
                        </div>
                      </div>

                      {destinationType !== 'crypto' && (<>
                          <div className="border-t border-[#101010]/10 pt-3 flex justify-between">
                            <span className="text-[13px] text-[#101010]/60">
                              Recipient
                            </span>
                            <span className="text-[13px] text-[#101010]">
                              {accountHolderType === 'individual'
                        ? "".concat(watch('accountHolderFirstName'), " ").concat(watch('accountHolderLastName'))
                        : watch('accountHolderBusinessName')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[13px] text-[#101010]/60">
                              Bank
                            </span>
                            <span className="text-[13px] text-[#101010]">
                              {watch('bankName')}
                            </span>
                          </div>
                        </>)}

                      {destinationType === 'crypto' && (<div className="border-t border-[#101010]/10 pt-3 flex justify-between">
                          <span className="text-[13px] text-[#101010]/60">
                            Wallet
                          </span>
                          <span className="text-[12px] font-mono text-[#101010]">
                            {(_b = watch('cryptoAddress')) === null || _b === void 0 ? void 0 : _b.slice(0, 6)}...
                            {(_c = watch('cryptoAddress')) === null || _c === void 0 ? void 0 : _c.slice(-4)}
                          </span>
                        </div>)}
                    </div>
                  </div>

                  {/* Warning */}
                  <alert_1.Alert className="bg-amber-50 border-amber-200 rounded-xl">
                    <lucide_react_1.AlertCircle className="h-4 w-4 text-amber-600"/>
                    <alert_1.AlertDescription className="text-[12px] text-amber-800">
                      {destinationType === 'crypto'
                    ? 'Crypto transfers are irreversible. Please verify the address.'
                    : 'Bank transfers typically process within 1-3 business days.'}
                    </alert_1.AlertDescription>
                  </alert_1.Alert>
                </>)}
            </div>)}
        </form>
      </div>

      {/* Fixed bottom navigation */}
      <div className="flex-shrink-0 bg-white border-t border-[#101010]/10 p-4 sm:p-6">
        {error && (<alert_1.Alert className="bg-red-50 border-red-200 mb-3 rounded-xl">
            <lucide_react_1.AlertCircle className="h-4 w-4 text-red-600"/>
            <alert_1.AlertDescription className="text-red-700 text-[13px]">
              {error}
            </alert_1.AlertDescription>
          </alert_1.Alert>)}

        <div className="flex gap-3">
          {formStep > 1 && (<button_1.Button type="button" onClick={handlePreviousStep} variant="outline" disabled={isSubmittingTransfer} className="flex-1 h-12 rounded-xl border-[#101010]/10">
              <lucide_react_1.ArrowLeft className="mr-2 h-4 w-4"/>
              Back
            </button_1.Button>)}

          {formStep < 3 ? (<button_1.Button type="button" onClick={handleNextStep} disabled={formStep === 1 && !destinationType} className={(0, utils_1.cn)('bg-[#1B29FF] hover:bg-[#1420CC] text-white h-12 text-[14px] font-semibold rounded-xl shadow-lg shadow-[#1B29FF]/20', formStep === 1 ? 'w-full' : 'flex-1')}>
              Continue
              <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
            </button_1.Button>) : (<button_1.Button type="button" onClick={handleSubmit(handleInitiateSubmit)} disabled={isSubmittingTransfer} className="flex-1 bg-[#1B29FF] hover:bg-[#1420CC] text-white h-12 text-[14px] font-semibold rounded-xl shadow-lg shadow-[#1B29FF]/20">
              {isSubmittingTransfer ? (<>
                  <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  {loadingMessage}
                </>) : (<>
                  Complete Transfer
                  <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
                </>)}
            </button_1.Button>)}
        </div>
      </div>
    </div>);
}
