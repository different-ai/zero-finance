/**
 * Interface for yield protocol information
 */
export interface YieldProtocol {
  name: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  token: string;
  chain: string;
  type: string;
  url: string;
}

/**
 * Fetches yield protocols for a given blockchain and token
 * 
 * @param chain - The blockchain to fetch protocols for (e.g., "Ethereum", "Polygon")
 * @param token - The token to fetch protocols for (e.g., "USDC", "ETH")
 * @returns Array of yield protocols
 */
export async function fetchYieldProtocols(
  chain: string,
  token: string
): Promise<YieldProtocol[]> {
  console.log(`Fetching yield protocols for ${token} on ${chain}`);
  
  // For now, we'll return mock data
  // In a production environment, this would call an API or data provider
  
  // Normalize chain and token for comparison
  const normalizedChain = chain.toLowerCase();
  const normalizedToken = token.toUpperCase();
  
  // Select appropriate mock data based on input
  if (normalizedChain.includes('ethereum')) {
    if (normalizedToken === 'USDC' || normalizedToken === 'USDT' || normalizedToken.includes('STABLE')) {
      return getMockUsdcEthereumProtocols();
    }
    if (normalizedToken === 'ETH' || normalizedToken === 'WETH') {
      return getMockEthereumProtocols();
    }
  }
  
  if (normalizedChain.includes('polygon')) {
    if (normalizedToken === 'USDC' || normalizedToken === 'USDT' || normalizedToken.includes('STABLE')) {
      return getMockUsdcPolygonProtocols();
    }
  }
  
  // Default response with some basic protocols if no match
  return [
    {
      name: "Generic Lending Protocol",
      apy: 3.5,
      tvl: 1500000000,
      risk: "medium",
      token: normalizedToken,
      chain: chain,
      type: "lending",
      url: "https://example.com/protocol"
    },
    {
      name: "Basic Staking Service",
      apy: 5.2,
      tvl: 850000000,
      risk: "low",
      token: normalizedToken,
      chain: chain,
      type: "staking",
      url: "https://example.com/staking"
    },
    {
      name: "DeFi Yield Aggregator",
      apy: 8.7,
      tvl: 350000000,
      risk: "high",
      token: normalizedToken,
      chain: chain,
      type: "yield",
      url: "https://example.com/defi"
    }
  ];
}

// Mock data for USDC on Ethereum
function getMockUsdcEthereumProtocols(): YieldProtocol[] {
  return [
    {
      name: "Aave V3",
      apy: 3.2,
      tvl: 2500000000,
      risk: "low",
      token: "USDC",
      chain: "Ethereum",
      type: "lending",
      url: "https://app.aave.com"
    },
    {
      name: "Compound",
      apy: 2.8,
      tvl: 1800000000,
      risk: "low",
      token: "USDC",
      chain: "Ethereum",
      type: "lending",
      url: "https://compound.finance"
    },
    {
      name: "Curve Finance",
      apy: 4.5,
      tvl: 1200000000,
      risk: "medium",
      token: "USDC",
      chain: "Ethereum",
      type: "liquidity",
      url: "https://curve.fi"
    },
    {
      name: "Yearn Finance",
      apy: 6.3,
      tvl: 800000000,
      risk: "medium",
      token: "USDC",
      chain: "Ethereum",
      type: "yield",
      url: "https://yearn.finance"
    },
    {
      name: "Convex Finance",
      apy: 7.2,
      tvl: 650000000,
      risk: "medium",
      token: "USDC",
      chain: "Ethereum",
      type: "yield",
      url: "https://www.convexfinance.com"
    },
    {
      name: "Harvest Finance",
      apy: 8.5,
      tvl: 250000000,
      risk: "high",
      token: "USDC",
      chain: "Ethereum",
      type: "yield",
      url: "https://harvest.finance"
    },
  ];
}

// Mock data for ETH on Ethereum
function getMockEthereumProtocols(): YieldProtocol[] {
  return [
    {
      name: "Lido",
      apy: 4.0,
      tvl: 16000000000,
      risk: "low",
      token: "ETH",
      chain: "Ethereum",
      type: "staking",
      url: "https://lido.fi"
    },
    {
      name: "Rocket Pool",
      apy: 4.2,
      tvl: 2500000000,
      risk: "low",
      token: "ETH",
      chain: "Ethereum",
      type: "staking",
      url: "https://rocketpool.net"
    },
    {
      name: "Aave V3",
      apy: 0.8,
      tvl: 1200000000,
      risk: "low",
      token: "ETH",
      chain: "Ethereum",
      type: "lending",
      url: "https://app.aave.com"
    },
    {
      name: "Compound",
      apy: 0.6,
      tvl: 900000000,
      risk: "low",
      token: "ETH",
      chain: "Ethereum",
      type: "lending",
      url: "https://compound.finance"
    },
    {
      name: "Uniswap V3",
      apy: 15.3,
      tvl: 850000000,
      risk: "high",
      token: "ETH",
      chain: "Ethereum",
      type: "liquidity",
      url: "https://app.uniswap.org"
    },
    {
      name: "Balancer",
      apy: 12.8,
      tvl: 450000000,
      risk: "high",
      token: "ETH",
      chain: "Ethereum",
      type: "liquidity",
      url: "https://balancer.fi"
    },
  ];
}

// Mock data for USDC on Polygon
function getMockUsdcPolygonProtocols(): YieldProtocol[] {
  return [
    {
      name: "Aave V3",
      apy: 3.8,
      tvl: 850000000,
      risk: "low",
      token: "USDC",
      chain: "Polygon",
      type: "lending",
      url: "https://app.aave.com"
    },
    {
      name: "QuickSwap",
      apy: 10.5,
      tvl: 350000000,
      risk: "high",
      token: "USDC",
      chain: "Polygon",
      type: "liquidity",
      url: "https://quickswap.exchange"
    },
    {
      name: "MELD",
      apy: 6.2,
      tvl: 180000000,
      risk: "medium",
      token: "USDC",
      chain: "Polygon",
      type: "lending",
      url: "https://meld.com"
    },
    {
      name: "Beefy Finance",
      apy: 8.1,
      tvl: 120000000,
      risk: "medium",
      token: "USDC",
      chain: "Polygon",
      type: "yield",
      url: "https://beefy.finance"
    },
    {
      name: "Gains Network",
      apy: 15.7,
      tvl: 75000000,
      risk: "high",
      token: "USDC",
      chain: "Polygon",
      type: "trading",
      url: "https://gains.trade"
    },
  ];
} 