import { RequestLogicTypes, CurrencyTypes } from "@requestnetwork/types";

export const createFormCurrencies: CurrencyTypes.CurrencyInput[] = [
  // Ethereum Mainnet
  {
    symbol: "ETH",
    network: "mainnet",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ETH,
  },
  {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    network: "mainnet",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    network: "mainnet",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    network: "mainnet",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },

  // Polygon (Matic)
  {
    symbol: "MATIC",
    network: "matic",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ETH,
  },
  {
    symbol: "USDC",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    network: "matic",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    symbol: "USDT",
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    network: "matic",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    symbol: "DAI",
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    network: "matic",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },

  // Sepolia Testnet
  {
    symbol: "ETH",
    network: "sepolia",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ETH,
  },
  {
    symbol: "fUSDC",
    address: "0x8267cF9254734C6Eb452a7bb9AAF97B392258b21",
    network: "sepolia",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    symbol: "fUSDT",
    address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
    network: "sepolia",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
];

export const dashboardCurrencies: CurrencyTypes.CurrencyInput[] = [
  // Ethereum Mainnet
  {
    symbol: "ETH",
    network: "mainnet",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ETH,
  },
  {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    network: "mainnet",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    network: "mainnet",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    network: "mainnet",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },

  // Polygon (Matic)
  {
    symbol: "MATIC",
    network: "matic",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ETH,
  },
  {
    symbol: "USDC",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    network: "matic",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    symbol: "USDT",
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    network: "matic",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    symbol: "DAI",
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    network: "matic",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },

  // Sepolia Testnet
  {
    symbol: "ETH",
    network: "sepolia",
    decimals: 18,
    type: RequestLogicTypes.CURRENCY.ETH,
  },
  {
    symbol: "fUSDC",
    address: "0x8267cF9254734C6Eb452a7bb9AAF97B392258b21",
    network: "sepolia",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    symbol: "fUSDT",
    address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
    network: "sepolia",
    decimals: 6,
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
];
