// deep-search.ts
import { tool } from 'ai';
import { z } from 'zod';

// Define the expected structure of a pool from the DefiLlama API
interface DefiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  pool: string; // Unique identifier for the pool
  apyBase?: number;
  apyReward?: number;
  il7d?: number;
  underlyingTokens?: string[];
  url?: string;
  stablecoin?: boolean;
  ilRisk?: string;
  exposure?: string;
  predictions?: {
    predictedClass: string;
    predictedProbability: number;
  };
  rewardTokens?: string[];
  totalSupplyUsd?: number;
}

// Protocol info interface for trending data
interface ProtocolInfo {
  name: string;
  tvl: number;
  change_1d?: number;
  change_7d?: number;
  category?: string;
}

// Helper function for making API requests with timeout
async function fetchWithTimeout(url: string, timeout = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const deepSearch = tool({
  description: `Search for crypto yield farming opportunities. Use this tool to find current Annual Percentage Yields (APYs) and Total Value Locked (TVLs) for specific assets, protocols, or chains in the DeFi ecosystem using data from DefiLlama. Be specific in your query (e.g., "USDC yields on Arbitrum", "Highest APY pools for ETH", "Aave polygon pools", "stablecoin yields", "low risk yields", "trending DeFi protocols").`,
  parameters: z.object({
    query: z.string().describe(
      'The specific search query for crypto yields. Can mention asset names, protocol names, chain names, characteristics like "stablecoin", "high APY", "low risk", or ask for "trending" protocols.'
    ),
  }),
  execute: async ({ query }) => {
    console.log(`Executing deepSearch with query: ${query}`);
    try {
      const lowerCaseQuery = query.toLowerCase();
      const queryTerms = lowerCaseQuery.split(/\s+/);
      
      // Check if looking for trending protocols
      const wantsTrending = queryTerms.some(term => 
        ['trending', 'popular', 'hot', 'top'].includes(term)
      );
      
      // Handle trending protocols request
      if (wantsTrending) {
        try {
          const trendingResponse = await fetchWithTimeout('https://api.llama.fi/protocols');
          
          if (!trendingResponse.ok) {
            throw new Error(`DefiLlama trending API request failed with status ${trendingResponse.status}`);
          }
          
          const protocols: ProtocolInfo[] = await trendingResponse.json();
          
          if (!protocols || !Array.isArray(protocols)) {
            throw new Error('Invalid data format received from DefiLlama API');
          }
          
          // Filter if specific chain or category is requested
          let filteredProtocols = protocols;
          
          const chains = ['ethereum', 'arbitrum', 'polygon', 'optimism', 'bsc', 'avalanche', 'solana'];
          const chainFilters = chains.filter(chain => queryTerms.includes(chain));
          
          if (chainFilters.length > 0) {
            // For trending, we need to check chains differently since the data structure is different
            filteredProtocols = filteredProtocols.filter(protocol => 
              protocol.name && chainFilters.some(chain => 
                protocol.name.toLowerCase().includes(chain)
              )
            );
          }
          
          // Sort by TVL change (trending) or TVL
          if (queryTerms.includes('growing')) {
            filteredProtocols.sort((a, b) => (b.change_7d || 0) - (a.change_7d || 0));
          } else {
            filteredProtocols.sort((a, b) => b.tvl - a.tvl);
          }
          
          const top10Protocols = filteredProtocols.slice(0, 10);
          
          const formattedTrending = top10Protocols.map(protocol => {
            const tvlFormatted = Math.round(protocol.tvl).toLocaleString();
            const change7d = protocol.change_7d !== undefined ? `${protocol.change_7d > 0 ? '+' : ''}${protocol.change_7d.toFixed(2)}%` : 'N/A';
            
            return `- Protocol: ${protocol.name}, TVL: $${tvlFormatted}, 7d Change: ${change7d}${protocol.category ? `, Category: ${protocol.category}` : ''}`;
          }).join('\n');
          
          return `Top ${top10Protocols.length} DeFi protocols by TVL:\n${formattedTrending}\n\nData source: DefiLlama`;
        } catch (trendingError: unknown) {
          console.error("Error fetching trending protocols:", trendingError);
          const errorMessage = trendingError instanceof Error ? trendingError.message : 'Unknown error';
          return `Error fetching trending protocols: ${errorMessage}. Please try again later or refine your query.`;
        }
      }
      
      // Standard yield pool search
      try {
        const poolsResponse = await fetchWithTimeout(`https://yields.llama.fi/pools`);

        if (!poolsResponse.ok) {
          throw new Error(`DefiLlama API request failed with status ${poolsResponse.status}`);
        }

        const data: { data: DefiLlamaPool[] } = await poolsResponse.json();

        if (!data || !Array.isArray(data.data)) {
          throw new Error('Invalid data format received from DefiLlama API');
        }
        
        // Check for specific filtering needs
        const wantsStablecoins = queryTerms.some(term => 
          ['stablecoin', 'stable', 'usdc', 'usdt', 'dai', 'busd'].includes(term)
        );
        
        const wantsHighApy = queryTerms.some(term => 
          ['high apy', 'high yield', 'highest', 'best yield'].includes(term)
        );
        
        const wantsLowRisk = queryTerms.some(term => 
          ['low risk', 'safe', 'low il', 'conservative'].includes(term)
        );
        
        // Apply filters
        let filteredPools = data.data;
        
        // Apply stablecoin filter
        if (wantsStablecoins) {
          filteredPools = filteredPools.filter(pool => 
            pool.stablecoin === true || 
            ['usdc', 'usdt', 'dai', 'busd'].some(stable => 
              pool.symbol.toLowerCase().includes(stable)
            )
          );
        }
        
        // Filter by specific chain
        const chains = ['ethereum', 'arbitrum', 'polygon', 'optimism', 'bsc', 'avalanche', 'solana'];
        const chainFilters = chains.filter(chain => queryTerms.includes(chain));
        if (chainFilters.length > 0) {
          filteredPools = filteredPools.filter(pool => 
            chainFilters.some(chain => pool.chain.toLowerCase().includes(chain))
          );
        }
        
        // Filter by project name
        const knownProtocols = ['aave', 'compound', 'curve', 'uniswap', 'sushiswap', 'balancer', 'yearn'];
        const protocolFilters = knownProtocols.filter(protocol => queryTerms.includes(protocol));
        if (protocolFilters.length > 0) {
          filteredPools = filteredPools.filter(pool => 
            protocolFilters.some(protocol => pool.project.toLowerCase().includes(protocol))
          );
        }
        
        // Filter by keyword matching across all fields
        if (!wantsStablecoins && chainFilters.length === 0 && protocolFilters.length === 0) {
          filteredPools = filteredPools.filter(pool => {
            const poolText = `${pool.chain} ${pool.project} ${pool.symbol}`.toLowerCase();
            return queryTerms.some(term => poolText.includes(term));
          });
        }
        
        if (filteredPools.length === 0) {
          return `No yield pools found matching "${query}" on DefiLlama. Try a different query or check for alternative keywords.`;
        }
        
        // Apply sorting based on query
        if (wantsHighApy) {
          filteredPools.sort((a, b) => b.apy - a.apy);
        } else if (wantsLowRisk) {
          // For low risk, prioritize stablecoins and higher TVL
          filteredPools.sort((a, b) => {
            if (a.stablecoin && !b.stablecoin) return -1;
            if (!a.stablecoin && b.stablecoin) return 1;
            return b.tvlUsd - a.tvlUsd;
          });
        } else {
          // Default: sort by TVL (higher = more liquid = generally safer)
          filteredPools.sort((a, b) => b.tvlUsd - a.tvlUsd);
        }

        // Limit the number of results
        const topPools = filteredPools.slice(0, 10);

        // Create a more detailed formatted result
        const formattedResults = topPools.map(pool => {
          const apyFormatted = pool.apy.toFixed(2);
          const tvlFormatted = Math.round(pool.tvlUsd).toLocaleString();
          
          let riskInfo = '';
          if (pool.ilRisk) {
            riskInfo = `, Risk: ${pool.ilRisk}`;
          }
          
          return `- Project: ${pool.project}, Chain: ${pool.chain}, Symbol: ${pool.symbol}, APY: ${apyFormatted}%, TVL: $${tvlFormatted}${riskInfo}`;
        }).join('\n');

        const sortType = wantsHighApy ? "highest APY" : wantsLowRisk ? "lowest risk" : "highest TVL";
        const resultSummary = `Found ${filteredPools.length} pools matching "${query}". Here are the top ${topPools.length} by ${sortType}:\n${formattedResults}\n\nData source: DefiLlama`;

        console.log("deepSearch result summary length:", resultSummary.length);
        return resultSummary;
      } catch (poolsError: unknown) {
        console.error("Error fetching yield pools:", poolsError);
        const errorMessage = poolsError instanceof Error ? poolsError.message : 'Unknown error';
        return `Error fetching yield pool data: ${errorMessage}. Please try again later or refine your query.`;
      }
    } catch (error: unknown) {
      console.error("Error during deepSearch:", error);
      if (error instanceof Error) {
        return `Error fetching crypto yield data: ${error.message}. Please try again later or rephrase your query.`;
      }
      return 'An unexpected error occurred while searching for crypto yield data.';
    }
  },
});
