import { tool } from 'ai';
import { z } from 'zod';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache: Record<string, { data: any, timestamp: number }> = {};

// Helper function for making API requests with timeout
async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      // Try to get error message from DefiLlama if available
      let errorBody = `API request failed with status ${response.status}`;
      try {
        const text = await response.text();
        errorBody += `: ${text}`;
      } catch (_) { /* ignore */ }
      throw new Error(errorBody);
    }
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API request timed out');
    }
    throw error;
  }
}

// Helper function to get cached data or fetch new
async function getCachedOrFetch(url: string, cacheKey: string) {
  const now = Date.now();
  if (cache[cacheKey] && (now - cache[cacheKey].timestamp) < CACHE_DURATION) {
    return cache[cacheKey].data;
  }
  
  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  
  const data = await response.json();
  cache[cacheKey] = { data, timestamp: now };
  return data;
}

export const deepSearch = tool({
  description: `Comprehensive search across DefiLlama's data sources to find specific information about DeFi protocols, yields, TVL, fees, chains, and more. This tool can search for broad data or specific details and return well-formatted results with proper comparisons when needed.`,
  parameters: z.object({
    query: z.string().describe(
      'The specific search query, which can include protocol names, chain names, asset names, metrics (TVL, fees, APY), and desired analysis (comparison, historical, trending).'
    ),
    type: z.enum(['tvl', 'yields', 'fees', 'protocols', 'chains', 'auto']).nullable().describe(
      'The type of data to search for. Use "auto" to let the tool decide based on your query.'
    ),
  }),
  execute: async ({ query, type }) => {
    console.log(`Executing deepSearch with query: ${query} and type: ${type}`);
    
    try {
      const lowerCaseQuery = query.toLowerCase();
      const queryTerms = lowerCaseQuery.split(/\s+/);
      
      // Determine the search type if set to auto
      let searchType = type;
      if (type === 'auto') {
        // Detect query intent
        if (queryTerms.some(term => ['apy', 'yield', 'interest', 'earn', 'staking', 'farming'].includes(term))) {
          searchType = 'yields';
        } else if (queryTerms.some(term => ['tvl', 'locked', 'value', 'size', 'growth'].includes(term))) {
          searchType = 'tvl';
        } else if (queryTerms.some(term => ['fee', 'revenue', 'earnings', 'profit', 'make', 'generating'].includes(term))) {
          searchType = 'fees';
        } else if (queryTerms.some(term => ['chain', 'blockchain', 'network', 'ecosystem'].includes(term))) {
          searchType = 'chains';
        } else {
          searchType = 'protocols'; // Default to protocols
        }
      }
      
      // Check for comparison requests
      const isComparison = queryTerms.some(term => 
        ['compare', 'comparison', 'versus', 'vs', 'better', 'difference'].includes(term)
      );
      
      // Common chain names for filtering
      const chains = ['ethereum', 'arbitrum', 'polygon', 'optimism', 'bsc', 'avalanche', 'solana', 'base'];
      const chainFilters = chains.filter(chain => queryTerms.includes(chain));
      
      // Known DeFi protocols for matching
      const knownProtocols = ['aave', 'compound', 'curve', 'uniswap', 'sushiswap', 'balancer', 'yearn', 'lido', 'gmx', 'convex'];
      const protocolMatches = knownProtocols.filter(protocol => queryTerms.includes(protocol));
      
      switch (searchType) {
        case 'yields':
          return await searchYields(query, queryTerms, chainFilters, protocolMatches);
          
        case 'tvl':
          return await searchTVL(query, queryTerms, chainFilters, protocolMatches, isComparison);
          
        case 'fees':
          return await searchFees(query, queryTerms, chainFilters, protocolMatches, isComparison);
          
        case 'chains':
          return await searchChains(query, queryTerms, chainFilters);
          
        case 'protocols':
        default:
          return await searchProtocols(query, queryTerms, chainFilters, protocolMatches);
      }
      
    } catch (error: unknown) {
      console.error("Error during deepSearch:", error);
      if (error instanceof Error) {
        return `Error during search: ${error.message}. Please try again with a more specific query.`;
      }
      return 'An unexpected error occurred during the search.';
    }
  },
});

// Search functions for different data types

async function searchYields(query: string, queryTerms: string[], chainFilters: string[], protocolMatches: string[]) {
  console.log("Searching yields for:", query);
  
  const wantsStablecoins = queryTerms.some(term => 
    ['stablecoin', 'stable', 'usdc', 'usdt', 'dai', 'busd'].includes(term)
  );
  
  const wantsHighApy = queryTerms.some(term => 
    ['high apy', 'high yield', 'highest', 'best yield'].includes(term)
  );
  
  const wantsLowRisk = queryTerms.some(term => 
    ['low risk', 'safe', 'low il', 'conservative'].includes(term)
  );
  
  // Fetch data from DefiLlama yields API
  const poolsData = await getCachedOrFetch('https://yields.llama.fi/pools', 'yields_pools');
  
  if (!poolsData || !Array.isArray(poolsData.data)) {
    throw new Error('Invalid data format received from DefiLlama Yields API');
  }
  
  // Apply filters
  let filteredPools = poolsData.data;
  
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
  if (chainFilters.length > 0) {
    filteredPools = filteredPools.filter(pool => 
      chainFilters.some(chain => pool.chain.toLowerCase().includes(chain))
    );
  }
  
  // Filter by project name
  if (protocolMatches.length > 0) {
    filteredPools = filteredPools.filter(pool => 
      protocolMatches.some(protocol => pool.project.toLowerCase().includes(protocol))
    );
  }
  
  // Filter by keyword matching across all fields
  if (!wantsStablecoins && chainFilters.length === 0 && protocolMatches.length === 0) {
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
  return `Found ${filteredPools.length} pools matching "${query}". Here are the top ${topPools.length} by ${sortType}:\n${formattedResults}\n\nData source: DefiLlama`;
}

async function searchTVL(query: string, queryTerms: string[], chainFilters: string[], protocolMatches: string[], isComparison: boolean) {
  console.log("Searching TVL for:", query);
  
  // For comparison requests, we'll return data for multiple protocols
  if (isComparison) {
    // Need at least one protocol match for comparison
    if (protocolMatches.length === 0) {
      // Try to extract potential protocol names from the query
      const potentialProtocols = queryTerms.filter(term => term.length > 3 && !['what', 'which', 'more', 'less', 'than', 'has', 'have', 'does', 'with'].includes(term));
      
      if (potentialProtocols.length >= 2) {
        // Use the potential protocols for comparison
        return await compareTVL(potentialProtocols);
      } else {
        return `Please specify which protocols you'd like to compare TVL for.`;
      }
    } else if (protocolMatches.length >= 2) {
      // Compare the matched protocols
      return await compareTVL(protocolMatches);
    } else if (chainFilters.length >= 2) {
      // Compare chains instead
      return await compareChainTVL(chainFilters);
    } else {
      // Not enough matches for comparison
      return `Please specify at least two protocols or chains to compare TVL.`;
    }
  }
  
  // Single protocol or chain TVL request
  if (protocolMatches.length === 1) {
    try {
      const protocol = protocolMatches[0];
      const apiUrl = `https://api.llama.fi/tvl/${protocol}`;
      const tvl = await getCachedOrFetch(apiUrl, `tvl_${protocol}`);
      
      if (typeof tvl !== 'number') {
        throw new Error('Invalid TVL data received');
      }
      
      // Format and return
      const formattedTvl = tvl.toLocaleString(undefined, { maximumFractionDigits: 0 });
      return `The current TVL for ${protocol} is $${formattedTvl}. Data source: DefiLlama.`;
    } catch (error) {
      return `Could not fetch TVL for ${protocolMatches[0]}. ${error instanceof Error ? error.message : ''}`;
    }
  } else if (chainFilters.length === 1) {
    try {
      const chain = chainFilters[0];
      const apiUrl = `https://api.llama.fi/v2/historicalChainTvl/${chain}`;
      const tvlData = await getCachedOrFetch(apiUrl, `chain_tvl_${chain}`);
      
      if (!Array.isArray(tvlData) || tvlData.length === 0) {
        throw new Error(`No TVL data found for chain: ${chain}`);
      }
      
      // Get the most recent TVL data point
      const latestData = tvlData[tvlData.length - 1];
      const tvl = latestData.tvl;
      
      // Format and return
      const formattedTvl = tvl.toLocaleString(undefined, { maximumFractionDigits: 0 });
      return `The current TVL for ${chain} is $${formattedTvl}. Data source: DefiLlama.`;
    } catch (error) {
      return `Could not fetch TVL for ${chainFilters[0]}. ${error instanceof Error ? error.message : ''}`;
    }
  } else {
    // No specific protocol or chain - get top protocols by TVL
    try {
      const protocolsData = await getCachedOrFetch('https://api.llama.fi/protocols', 'all_protocols');
      
      if (!Array.isArray(protocolsData)) {
        throw new Error('Invalid data format received');
      }
      
      // Sort by TVL and get top 10
      const sortedProtocols = [...protocolsData].sort((a, b) => b.tvl - a.tvl).slice(0, 10);
      
      // Format results
      const formattedResults = sortedProtocols.map(protocol => {
        const tvlFormatted = Math.round(protocol.tvl).toLocaleString();
        const change7d = protocol.change_7d !== undefined ? `${protocol.change_7d > 0 ? '+' : ''}${protocol.change_7d.toFixed(2)}%` : 'N/A';
        
        return `- Protocol: ${protocol.name}, TVL: $${tvlFormatted}, 7d Change: ${change7d}`;
      }).join('\n');
      
      return `Top 10 DeFi protocols by TVL:\n${formattedResults}\n\nData source: DefiLlama`;
    } catch (error) {
      return `Error fetching TVL data: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}

async function searchFees(query: string, queryTerms: string[], chainFilters: string[], protocolMatches: string[], isComparison: boolean) {
  console.log("Searching fees for:", query);
  
  // For comparison requests between protocols
  if (isComparison && protocolMatches.length >= 2) {
    return await compareFees(protocolMatches);
  }
  
  // Single protocol fee data
  if (protocolMatches.length === 1) {
    try {
      const protocol = protocolMatches[0];
      const apiUrl = `https://api.llama.fi/summary/fees/${protocol}`;
      const feeData = await getCachedOrFetch(apiUrl, `fees_${protocol}`);
      
      if (!feeData || !feeData.name) {
        throw new Error(`No fee data found for protocol: ${protocol}`);
      }
      
      // Format the fees response
      const format = (num: number | null | undefined) => {
        if (num === null || num === undefined) return 'N/A';
        return '$' + Math.round(num).toLocaleString();
      };
      
      const formatPercent = (num: number | null | undefined) => {
        if (num === null || num === undefined) return 'N/A';
        const sign = num > 0 ? '+' : '';
        return `${sign}${num.toFixed(2)}%`;
      };
      
      let result = `📊 ${feeData.name} Protocol Fees and Revenue:\n\n`;
      
      // 24h data
      result += `24h Fees: ${format(feeData.feesTotal24h || feeData.fees24h)}\n`;
      result += `24h Revenue: ${format(feeData.revenueTotal24h || feeData.revenue24h)}\n`;
      
      // Fee change percentage
      if (feeData.feesChange || feeData.feesChange24h) {
        result += `Fee Change (24h): ${formatPercent(feeData.feesChange || feeData.feesChange24h)}\n`;
      }
      
      // Revenue change percentage
      if (feeData.revenueChange || feeData.revenueChange24h) {
        result += `Revenue Change (24h): ${formatPercent(feeData.revenueChange || feeData.revenueChange24h)}\n`;
      }
      
      // Total stats if available
      if (feeData.totalFees) {
        result += `Total Fees (All-time): ${format(feeData.totalFees)}\n`;
      }
      
      if (feeData.totalRevenue) {
        result += `Total Revenue (All-time): ${format(feeData.totalRevenue)}\n`;
      }
      
      result += `\nData source: DefiLlama Fees API`;
      
      return result;
    } catch (error) {
      // Try to get from the overview data if specific endpoint failed
      try {
        const overviewUrl = 'https://api.llama.fi/overview/fees';
        const overviewData = await getCachedOrFetch(overviewUrl, 'fees_overview');
        
        if (!overviewData || !Array.isArray(overviewData.protocols)) {
          throw new Error('Invalid data format received from fees overview API');
        }
        
        const protocol = protocolMatches[0];
        const matchedProtocol = overviewData.protocols.find((p: any) => 
          p.slug === protocol || p.name.toLowerCase() === protocol
        );
        
        if (matchedProtocol) {
          // Format results similarly to above
          const format = (num: number | null | undefined) => {
            if (num === null || num === undefined) return 'N/A';
            return '$' + Math.round(num).toLocaleString();
          };
          
          let result = `📊 ${matchedProtocol.name} Protocol Fees and Revenue:\n\n`;
          result += `24h Fees: ${format(matchedProtocol.total24h)}\n`;
          result += `24h Revenue: ${format(matchedProtocol.revenue24h)}\n`;
          result += `Total Fees (30d): ${format(matchedProtocol.total30d)}\n`;
          result += `\nData source: DefiLlama Fees API`;
          
          return result;
        }
        
        return `Could not find fee data for ${protocol}. Try a different protocol name.`;
      } catch (overviewError) {
        return `Error fetching fee data for ${protocolMatches[0]}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }
  }
  
  // No specific protocol - get top fee-generating protocols
  try {
    const overviewUrl = 'https://api.llama.fi/overview/fees';
    const overviewData = await getCachedOrFetch(overviewUrl, 'fees_overview');
    
    if (!overviewData || !Array.isArray(overviewData.protocols)) {
      throw new Error('Invalid data format received from fees overview API');
    }
    
    // Apply chain filter if needed
    let filteredProtocols = overviewData.protocols;
    if (chainFilters.length > 0) {
      filteredProtocols = filteredProtocols.filter((protocol: any) => 
        protocol.chains && chainFilters.some(chain => 
          protocol.chains.map((c: string) => c.toLowerCase()).includes(chain)
        )
      );
    }
    
    // Sort by daily fees
    filteredProtocols.sort((a: any, b: any) => (b.total24h || 0) - (a.total24h || 0));
    
    // Get top 10
    const topProtocols = filteredProtocols.slice(0, 10);
    
    // Format results
    const formattedResults = topProtocols.map((protocol: any) => {
      const feesFormatted = protocol.total24h ? '$' + Math.round(protocol.total24h).toLocaleString() : 'N/A';
      const revenueFormatted = protocol.revenue24h ? '$' + Math.round(protocol.revenue24h).toLocaleString() : 'N/A';
      
      return `- Protocol: ${protocol.name}, 24h Fees: ${feesFormatted}, 24h Revenue: ${revenueFormatted}`;
    }).join('\n');
    
    return `Top 10 DeFi protocols by fees (last 24h):\n${formattedResults}\n\nData source: DefiLlama Fees API`;
  } catch (error) {
    return `Error fetching fee data: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

async function searchChains(query: string, queryTerms: string[], chainFilters: string[]) {
  console.log("Searching chains for:", query);
  
  try {
    const chainsUrl = 'https://api.llama.fi/v2/chains';
    const chainsData = await getCachedOrFetch(chainsUrl, 'all_chains');
    
    if (!Array.isArray(chainsData)) {
      throw new Error('Invalid data format received from chains API');
    }
    
    // If specific chains are requested, filter to those
    let filteredChains = chainsData;
    if (chainFilters.length > 0) {
      filteredChains = filteredChains.filter(chain => 
        chainFilters.some(filter => chain.name.toLowerCase().includes(filter))
      );
      
      if (filteredChains.length === 0) {
        // Try again with more flexible matching
        filteredChains = chainsData.filter(chain => 
          chainFilters.some(filter => 
            chain.name.toLowerCase().includes(filter) ||
            (chain.tokenSymbol && chain.tokenSymbol.toLowerCase().includes(filter))
          )
        );
      }
    }
    
    // Sort by TVL
    filteredChains.sort((a, b) => b.tvl - a.tvl);
    
    // Limit number of results if we have a lot
    const displayChains = filteredChains.length > 10 && chainFilters.length === 0 
      ? filteredChains.slice(0, 10) 
      : filteredChains;
    
    // Format results
    const formattedResults = displayChains.map(chain => {
      const tvlFormatted = '$' + Math.round(chain.tvl).toLocaleString();
      
      // Include token symbol if available
      const tokenInfo = chain.tokenSymbol ? `, Token: ${chain.tokenSymbol}` : '';
      
      return `- Chain: ${chain.name}, TVL: ${tvlFormatted}${tokenInfo}`;
    }).join('\n');
    
    if (displayChains.length === 0) {
      return `No blockchain data found matching "${query}". Try a different query.`;
    }
    
    let title = chainFilters.length > 0 
      ? `Blockchain data for ${chainFilters.join(', ')}:` 
      : `Top ${displayChains.length} blockchains by TVL:`;
    
    return `${title}\n${formattedResults}\n\nData source: DefiLlama`;
  } catch (error) {
    return `Error fetching blockchain data: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

async function searchProtocols(query: string, queryTerms: string[], chainFilters: string[], protocolMatches: string[]) {
  console.log("Searching protocols for:", query);
  
  try {
    const protocolsUrl = 'https://api.llama.fi/protocols';
    const protocolsData = await getCachedOrFetch(protocolsUrl, 'all_protocols');
    
    if (!Array.isArray(protocolsData)) {
      throw new Error('Invalid data format received');
    }
    
    // Apply filters
    let filteredProtocols = protocolsData;
    
    // Filter by chain if specified
    if (chainFilters.length > 0) {
      filteredProtocols = filteredProtocols.filter(protocol => 
        protocol.chains && chainFilters.some(chain => 
          protocol.chains.map((c: string) => c.toLowerCase()).includes(chain)
        )
      );
    }
    
    // Filter by protocol name if specified
    if (protocolMatches.length > 0) {
      filteredProtocols = filteredProtocols.filter(protocol => 
        protocolMatches.some(match => 
          protocol.name.toLowerCase().includes(match) || 
          (protocol.slug && protocol.slug.toLowerCase().includes(match))
        )
      );
    }
    
    // If both filters resulted in no matches, try a more general keyword match
    if (filteredProtocols.length === 0 && (chainFilters.length > 0 || protocolMatches.length > 0)) {
      filteredProtocols = protocolsData.filter(protocol => {
        const protocolText = `${protocol.name} ${protocol.slug || ''} ${protocol.category || ''}`.toLowerCase();
        return queryTerms.some(term => protocolText.includes(term));
      });
    }
    
    // Check for trending request
    const wantsTrending = queryTerms.some(term => 
      ['trending', 'popular', 'hot', 'top', 'growing'].includes(term)
    );
    
    // Sort the protocols
    if (wantsTrending && queryTerms.includes('growing')) {
      // Sort by 7d change
      filteredProtocols.sort((a, b) => (b.change_7d || 0) - (a.change_7d || 0));
    } else {
      // Default sort by TVL
      filteredProtocols.sort((a, b) => b.tvl - a.tvl);
    }
    
    // Limit results
    const topProtocols = filteredProtocols.slice(0, 10);
    
    if (topProtocols.length === 0) {
      return `No protocols found matching "${query}". Try a different query.`;
    }
    
    // Format results
    const formattedResults = topProtocols.map(protocol => {
      const tvlFormatted = '$' + Math.round(protocol.tvl).toLocaleString();
      const change7d = protocol.change_7d !== undefined 
        ? `${protocol.change_7d > 0 ? '+' : ''}${protocol.change_7d.toFixed(2)}%` 
        : 'N/A';
      
      let extraInfo = '';
      if (protocol.category) {
        extraInfo += `, Category: ${protocol.category}`;
      }
      if (protocol.chains && protocol.chains.length > 0) {
        extraInfo += `, Chains: ${protocol.chains.slice(0, 3).join(', ')}`;
        if (protocol.chains.length > 3) {
          extraInfo += ` +${protocol.chains.length - 3} more`;
        }
      }
      
      return `- Protocol: ${protocol.name}, TVL: ${tvlFormatted}, 7d Change: ${change7d}${extraInfo}`;
    }).join('\n');
    
    const title = wantsTrending 
      ? `Top ${topProtocols.length} ${queryTerms.includes('growing') ? 'fastest growing' : 'trending'} DeFi protocols` 
      : `Top ${topProtocols.length} DeFi protocols matching "${query}"`;
    
    return `${title}:\n${formattedResults}\n\nData source: DefiLlama`;
  } catch (error) {
    return `Error fetching protocol data: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// Helper functions for comparisons

async function compareTVL(protocols: string[]) {
  try {
    const results = await Promise.all(
      protocols.map(async protocol => {
        try {
          const apiUrl = `https://api.llama.fi/tvl/${protocol}`;
          const tvl = await getCachedOrFetch(apiUrl, `tvl_${protocol}`);
          
          if (typeof tvl !== 'number') {
            return { protocol, tvl: null, error: 'Invalid TVL data' };
          }
          
          return { protocol, tvl, error: null };
        } catch (error) {
          return { protocol, tvl: null, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      })
    );
    
    // Filter out any failed requests
    const validResults = results.filter(result => result.tvl !== null);
    
    if (validResults.length === 0) {
      return `Could not fetch TVL data for any of the specified protocols: ${protocols.join(', ')}`;
    }
    
    // Sort by TVL descending
    validResults.sort((a, b) => (b.tvl || 0) - (a.tvl || 0));
    
    // Format results
    const comparisonRows = validResults.map(result => {
      const tvlFormatted = result.tvl ? '$' + Math.round(result.tvl).toLocaleString() : 'N/A';
      return `- ${result.protocol}: ${tvlFormatted}`;
    }).join('\n');
    
    // Add failed results if any
    const failedResults = results.filter(result => result.tvl === null);
    let failedInfo = '';
    if (failedResults.length > 0) {
      failedInfo = `\n\nCould not fetch data for: ${failedResults.map(r => r.protocol).join(', ')}`;
    }
    
    return `TVL Comparison:\n${comparisonRows}${failedInfo}\n\nData source: DefiLlama`;
  } catch (error) {
    return `Error comparing protocol TVLs: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

async function compareChainTVL(chains: string[]) {
  try {
    const chainsUrl = 'https://api.llama.fi/v2/chains';
    const chainsData = await getCachedOrFetch(chainsUrl, 'all_chains');
    
    if (!Array.isArray(chainsData)) {
      throw new Error('Invalid data format received from chains API');
    }
    
    // Find matches for each requested chain
    const matchedChains = chains.map(chain => {
      const match = chainsData.find(c => 
        c.name.toLowerCase().includes(chain) ||
        (c.tokenSymbol && c.tokenSymbol.toLowerCase() === chain)
      );
      
      return {
        chain,
        match: match || null
      };
    });
    
    // Filter to only matched chains
    const validChains = matchedChains.filter(c => c.match !== null);
    
    if (validChains.length === 0) {
      return `Could not find TVL data for any of the specified chains: ${chains.join(', ')}`;
    }
    
    // Sort by TVL
    validChains.sort((a, b) => (b.match?.tvl || 0) - (a.match?.tvl || 0));
    
    // Format comparison
    const comparisonRows = validChains.map(c => {
      const tvlFormatted = c.match?.tvl ? '$' + Math.round(c.match.tvl).toLocaleString() : 'N/A';
      return `- ${c.match?.name}: ${tvlFormatted}`;
    }).join('\n');
    
    // Add info about unmatched chains
    const unmatched = matchedChains.filter(c => c.match === null);
    let unmatchedInfo = '';
    if (unmatched.length > 0) {
      unmatchedInfo = `\n\nCould not find data for: ${unmatched.map(c => c.chain).join(', ')}`;
    }
    
    return `Blockchain TVL Comparison:\n${comparisonRows}${unmatchedInfo}\n\nData source: DefiLlama`;
  } catch (error) {
    return `Error comparing chain TVLs: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

async function compareFees(protocols: string[]) {
  try {
    const overviewUrl = 'https://api.llama.fi/overview/fees';
    const overviewData = await getCachedOrFetch(overviewUrl, 'fees_overview');
    
    if (!overviewData || !Array.isArray(overviewData.protocols)) {
      throw new Error('Invalid data format received from fees overview API');
    }
    
    // Find matches for each requested protocol
    const matchedProtocols = protocols.map(protocol => {
      const match = overviewData.protocols.find((p: any) => 
        p.slug === protocol || 
        p.name.toLowerCase().includes(protocol) ||
        (p.slug && p.slug.toLowerCase().includes(protocol))
      );
      
      return {
        protocol,
        match: match || null
      };
    });
    
    // Filter to only matched protocols
    const validProtocols = matchedProtocols.filter(p => p.match !== null);
    
    if (validProtocols.length === 0) {
      return `Could not find fee data for any of the specified protocols: ${protocols.join(', ')}`;
    }
    
    // Sort by 24h fees
    validProtocols.sort((a, b) => (b.match?.total24h || 0) - (a.match?.total24h || 0));
    
    // Format for fees and revenue
    const format = (num: number | null | undefined) => {
      if (num === null || num === undefined) return 'N/A';
      return '$' + Math.round(num).toLocaleString();
    };
    
    // Format comparison
    const comparisonRows = validProtocols.map(p => {
      const fees24h = format(p.match?.total24h);
      const revenue24h = format(p.match?.revenue24h);
      
      return `- ${p.match?.name}:\n  • 24h Fees: ${fees24h}\n  • 24h Revenue: ${revenue24h}`;
    }).join('\n');
    
    // Add info about unmatched protocols
    const unmatched = matchedProtocols.filter(p => p.match === null);
    let unmatchedInfo = '';
    if (unmatched.length > 0) {
      unmatchedInfo = `\n\nCould not find data for: ${unmatched.map(p => p.protocol).join(', ')}`;
    }
    
    return `Protocol Fees Comparison (24h):\n${comparisonRows}${unmatchedInfo}\n\nData source: DefiLlama Fees API`;
  } catch (error) {
    return `Error comparing protocol fees: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}