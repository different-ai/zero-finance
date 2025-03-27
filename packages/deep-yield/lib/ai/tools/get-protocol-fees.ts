import { tool } from 'ai';
import { z } from 'zod';

// Basic cache for protocol fees data
const protocolFeesCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Types for DefiLlama fees response
interface ProtocolFees {
  feesTotal24h: number | null;
  feesChange: number | null;
  revenueTotal24h: number | null;
  revenueChange: number | null;
  dailyRevenues: number[];
  dailyFees: number[];
  totalRevenue: number;
  totalFees: number;
  methodologies?: Record<string, string>;
  name: string;
  id: string;
  chains: string[];
  category?: string;
}

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

export const getProtocolFees = tool({
  description: `Fetches fee and revenue data for a specific DeFi protocol using its slug name (e.g., 'aave', 'uniswap-v3'). Returns information about 24h fees, daily revenue, total fees collected, and fee trends. Use this for questions about protocol earnings, fee generation, or revenue models.`,
  parameters: z.object({
    protocolSlug: z.string().describe(
      `The unique slug identifier for the protocol on DefiLlama. Examples: 'aave', 'uniswap-v3', 'gmx', 'lido'. Should be lowercase and often includes hyphens.`
    ),
  }),
  execute: async ({ protocolSlug }) => {
    console.log(`Executing getProtocolFees for slug: ${protocolSlug}`);
    const cacheKey = protocolSlug.toLowerCase();
    const now = Date.now();

    // Check cache first
    if (protocolFeesCache[cacheKey] && (now - protocolFeesCache[cacheKey].timestamp) < CACHE_DURATION) {
      console.log(`Returning cached fees data for ${protocolSlug}`);
      const cachedData = protocolFeesCache[cacheKey].data;
      return formatFeesResponse(cachedData, true);
    }

    try {
      // First try to fetch specific protocol data
      const apiUrl = `https://api.llama.fi/summary/fees/${protocolSlug}`;
      console.log(`Fetching fees data from: ${apiUrl}`);
      const response = await fetchWithTimeout(apiUrl);
      const data = await response.json();

      if (!data || !data.name) {
        throw new Error(`No fee data found for protocol: ${protocolSlug}`);
      }

      // Update cache
      protocolFeesCache[cacheKey] = { data, timestamp: now };
      
      return formatFeesResponse(data);

    } catch (error: unknown) {
      console.error(`Error fetching fees for ${protocolSlug}:`, error);
      
      // If specific protocol endpoint fails, try to find it in the overview
      try {
        const overviewUrl = 'https://api.llama.fi/overview/fees';
        console.log(`Fetching from overview fees API to find ${protocolSlug}`);
        const overviewResponse = await fetchWithTimeout(overviewUrl);
        const overviewData = await overviewResponse.json();
        
        if (!overviewData || !Array.isArray(overviewData.protocols)) {
          throw new Error('Invalid data format received from fees overview API');
        }
        
        // Try to find the protocol by name or slug
        const matchedProtocol = overviewData.protocols.find((p: any) => 
          p.slug === protocolSlug || 
          p.name.toLowerCase() === protocolSlug.toLowerCase()
        );
        
        if (matchedProtocol) {
          // Update cache
          protocolFeesCache[cacheKey] = { data: matchedProtocol, timestamp: now };
          return formatFeesResponse(matchedProtocol);
        }
        
        // No match found
        return `Could not find fee data for protocol '${protocolSlug}' on DefiLlama. Please ensure the protocol slug is correct.`;
        
      } catch (overviewError) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return `Error fetching fees for ${protocolSlug}: ${errorMessage}.`;
      }
    }
  },
});

// Helper function to format the fees response in a readable way
function formatFeesResponse(data: any, fromCache: boolean = false): string {
  const cacheMention = fromCache ? ' (cached data)' : '';
  
  // Format revenue and fees with commas and rounding
  const format = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    return '$' + Math.round(num).toLocaleString();
  };
  
  // Format percentages
  const formatPercent = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A';
    const sign = num > 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };
  
  let result = `📊 ${data.name} Protocol Fees and Revenue${cacheMention}:\n\n`;
  
  // 24h data
  result += `24h Fees: ${format(data.feesTotal24h || data.fees24h)}\n`;
  result += `24h Revenue: ${format(data.revenueTotal24h || data.revenue24h)}\n`;
  
  // Fee change percentage
  if (data.feesChange || data.feesChange24h) {
    result += `Fee Change (24h): ${formatPercent(data.feesChange || data.feesChange24h)}\n`;
  }
  
  // Revenue change percentage
  if (data.revenueChange || data.revenueChange24h) {
    result += `Revenue Change (24h): ${formatPercent(data.revenueChange || data.revenueChange24h)}\n`;
  }
  
  // Total stats if available
  if (data.totalFees) {
    result += `Total Fees (All-time): ${format(data.totalFees)}\n`;
  }
  
  if (data.totalRevenue) {
    result += `Total Revenue (All-time): ${format(data.totalRevenue)}\n`;
  }
  
  // Add chains if available
  if (data.chains && data.chains.length > 0) {
    result += `Chains: ${data.chains.join(', ')}\n`;
  }
  
  // Add methodology explanation if available
  if (data.methodologies && Object.keys(data.methodologies).length > 0) {
    result += `\nMethodology: ${Object.values(data.methodologies)[0]}\n`;
  }
  
  result += `\nData source: DefiLlama Fees API`;
  
  return result;
}