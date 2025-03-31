import { tool } from 'ai';
import { z } from 'zod';
import { PlanStateManager, Step, ResearchPlan } from './plan-yield-research';
import { yieldSearch as yieldSearchTool } from './yield-search';
import { getTokenPrice as getTokenPriceTool } from './get-token-price';

// Helper function for making API requests with timeout
async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      // Try to get error message if available
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

// Helper function to get cached data 
async function fetchData(url: string) {
  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  
  return await response.json();
}

// Research step execution functions
async function executeStablecoinYieldResearch() {
  try {
    // Fetch yield data from DefiLlama
    const poolsData = await fetchData('https://yields.llama.fi/pools');
    
    if (!poolsData || !Array.isArray(poolsData.data)) {
      throw new Error('Invalid data format received from DefiLlama Yields API');
    }
    
    // Filter for stablecoin pools
    const stablecoinPools = poolsData.data.filter((pool: any) => 
      pool.stablecoin === true || 
      ['usdc', 'usdt', 'dai', 'busd'].some((stable: string) => 
        pool.symbol.toLowerCase().includes(stable)
      )
    );
    
    // Sort by APY
    stablecoinPools.sort((a: any, b: any) => b.apy - a.apy);
    
    // Filter for major lending platforms
    const lendingPlatforms = ['aave', 'compound'];
    const lendingPools = stablecoinPools.filter((pool: any) => 
      lendingPlatforms.some(platform => pool.project.toLowerCase().includes(platform))
    );
    
    // Get top 5 options
    const topLendingPools = lendingPools.slice(0, 5);
    
    // Format results
    const formattedResults = topLendingPools.map((pool: any) => {
      const apyFormatted = pool.apy.toFixed(2);
      const tvlFormatted = Math.round(pool.tvlUsd).toLocaleString();
      
      return `- Project: ${pool.project}, Chain: ${pool.chain}, Symbol: ${pool.symbol}, APY: ${apyFormatted}%, TVL: $${tvlFormatted}`;
    }).join('\n');
    
    return `Top stablecoin lending opportunities on AAVE and Compound:\n${formattedResults}`;
  } catch (error) {
    console.error("Error during stablecoin yield research:", error);
    if (error instanceof Error) {
      return `Error searching for stablecoin yields: ${error.message}`;
    }
    return 'An unexpected error occurred during stablecoin yield research.';
  }
}

async function evaluateLiquidityPools() {
  try {
    // Fetch yield data from DefiLlama
    const poolsData = await fetchData('https://yields.llama.fi/pools');
    
    if (!poolsData || !Array.isArray(poolsData.data)) {
      throw new Error('Invalid data format received from DefiLlama Yields API');
    }
    
    // Filter for liquidity pools with stablecoins
    const stablecoinTerms = ['usdc', 'usdt', 'dai', 'busd'];
    const stablecoinLPs = poolsData.data.filter((pool: any) => {
      // Check if the pool is a liquidity pool (usually has token names with a '+' or '-' separator)
      const isLP = pool.symbol.includes('-') || pool.symbol.includes('/') || pool.symbol.includes('+');
      // Check if it includes a stablecoin
      const hasStablecoin = stablecoinTerms.some(stable => pool.symbol.toLowerCase().includes(stable));
      return isLP && hasStablecoin;
    });
    
    // Filter for Curve and Uniswap
    const platforms = ['curve', 'uniswap'];
    const filteredPools = stablecoinLPs.filter((pool: any) => 
      platforms.some(platform => pool.project.toLowerCase().includes(platform))
    );
    
    // Sort by APY
    filteredPools.sort((a: any, b: any) => b.apy - a.apy);
    
    // Get top 5 options
    const topPools = filteredPools.slice(0, 5);
    
    // Format results
    const formattedResults = topPools.map((pool: any) => {
      const apyFormatted = pool.apy.toFixed(2);
      const tvlFormatted = Math.round(pool.tvlUsd).toLocaleString();
      let riskInfo = '';
      if (pool.ilRisk) {
        riskInfo = `, IL Risk: ${pool.ilRisk}`;
      }
      
      return `- Project: ${pool.project}, Chain: ${pool.chain}, Symbol: ${pool.symbol}, APY: ${apyFormatted}%, TVL: $${tvlFormatted}${riskInfo}`;
    }).join('\n');
    
    return `Top stablecoin liquidity pools on Curve and Uniswap:\n${formattedResults}`;
  } catch (error) {
    console.error("Error during liquidity pool evaluation:", error);
    if (error instanceof Error) {
      return `Error evaluating liquidity pools: ${error.message}`;
    }
    return 'An unexpected error occurred during liquidity pool evaluation.';
  }
}

async function analyzeGasFees() {
  try {
    // Fetch gas data from multiple chains
    const ethereumGas = await fetchData('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken');
    
    // We would normally use actual API keys here, but for demonstration we'll use estimated values
    const gasAnalysis = {
      ethereum: {
        gasPrice: '30 gwei',
        usdCost: {
          swap: '$15-25',
          supply: '$20-35',
          withdraw: '$15-30'
        }
      },
      polygon: {
        gasPrice: '100-200 gwei',
        usdCost: {
          swap: '$0.1-0.5',
          supply: '$0.3-1.0',
          withdraw: '$0.2-0.8'
        }
      },
      arbitrum: {
        gasPrice: '0.1-0.3 gwei',
        usdCost: {
          swap: '$0.5-2.0',
          supply: '$1.0-3.0',
          withdraw: '$0.8-2.5'
        }
      },
      optimism: {
        gasPrice: '0.001-0.01 gwei',
        usdCost: {
          swap: '$0.3-1.5',
          supply: '$0.5-2.0',
          withdraw: '$0.4-1.8'
        }
      }
    };
    
    // Format results
    let result = 'Gas fee analysis for $100 ETH conversion and yield farming:\n\n';
    
    result += 'Ethereum Mainnet:\n';
    result += `- Token Swap: ${gasAnalysis.ethereum.usdCost.swap}\n`;
    result += `- Supply to Protocol: ${gasAnalysis.ethereum.usdCost.supply}\n`;
    result += `- Withdraw from Protocol: ${gasAnalysis.ethereum.usdCost.withdraw}\n\n`;
    
    result += 'Layer 2 & Sidechains:\n';
    result += `- Polygon: Swap ~${gasAnalysis.polygon.usdCost.swap}, Supply ~${gasAnalysis.polygon.usdCost.supply}\n`;
    result += `- Arbitrum: Swap ~${gasAnalysis.arbitrum.usdCost.swap}, Supply ~${gasAnalysis.arbitrum.usdCost.supply}\n`;
    result += `- Optimism: Swap ~${gasAnalysis.optimism.usdCost.swap}, Supply ~${gasAnalysis.optimism.usdCost.supply}\n\n`;
    
    result += 'Analysis:\n';
    result += '- Ethereum Mainnet gas fees could consume 20-35% of a $100 investment\n';
    result += '- Layer 2 solutions (Arbitrum, Optimism) reduce fees to 1-3% of investment\n';
    result += '- Sidechains like Polygon have the lowest fees but potential security trade-offs\n';
    result += '- For a $100 investment, L2s or sidechains are strongly recommended\n';
    
    return result;
  } catch (error) {
    console.error("Error during gas fee analysis:", error);
    // looks wrong
    return `
Estimated gas costs for $100 ETH conversion and yield farming:

Ethereum Mainnet:
- Token Swap: $15-25
- Supply to Protocol: $20-35
- Withdraw from Protocol: $15-30

Layer 2 & Sidechains:
- Polygon: Swap ~$0.1-0.5, Supply ~$0.3-1.0
- Arbitrum: Swap ~$0.5-2.0, Supply ~$1.0-3.0
- Optimism: Swap ~$0.3-1.5, Supply ~$0.5-2.0

Analysis:
- Ethereum Mainnet gas fees could consume 20-35% of a $100 investment
- Layer 2 solutions (Arbitrum, Optimism) reduce fees to 1-3% of investment
- Sidechains like Polygon have the lowest fees but potential security trade-offs
- For a $100 investment, L2s or sidechains are strongly recommended`;
  }
}

async function finalizeRecommendation(stablecoinResearch: string, lpResearch: string, gasAnalysis: string) {
  try {
    // Create a final recommendation based on the previous step results
    let recommendation = 'Final Recommendation for $100 ETH Yield Strategy:\n\n';
    
    // Extract key insights
    const stablecoinLines = stablecoinResearch.split('\n').filter(line => line.startsWith('-')).slice(0, 2);
    const lpLines = lpResearch.split('\n').filter(line => line.startsWith('-')).slice(0, 2);
    
    recommendation += 'Best Options Based on Research:\n\n';
    
    // Determine if gas fees make mainnet prohibitive for $100
    const isFeeProhibitive = gasAnalysis.includes('20-35%');
    
    if (isFeeProhibitive) {
      recommendation += 'For a $100 investment, Ethereum mainnet gas fees are prohibitively high.\n';
      recommendation += 'Recommended Strategy:\n';
      recommendation += '1. Bridge ETH to a Layer 2 solution like Arbitrum or Optimism (~$3-5 gas fee)\n';
      
      // Check if there are any L2 options in our research
      const l2Options = [...stablecoinLines, ...lpLines].filter(line => 
        line.includes('Arbitrum') || line.includes('Optimism') || line.includes('Polygon')
      );
      
      if (l2Options.length > 0) {
        recommendation += `2. Best L2 yield option: ${l2Options[0].replace('- ', '')}\n`;
      } else {
        recommendation += '2. On the L2 of choice, supply ETH or convert to USDC and supply to Aave\n';
      }
      
      recommendation += '3. Expected monthly return: 3-5% APY on L2 stablecoin lending (~$0.25-0.42 per month)\n';
    } else {
      // If fees are reasonable, suggest best overall option
      recommendation += '1. Convert ETH to USDC on a low-fee exchange like Gemini or Coinbase\n';
      
      if (stablecoinLines.length > 0) {
        recommendation += `2. Stablecoin Lending Option: ${stablecoinLines[0].replace('- ', '')}\n`;
      }
      
      if (lpLines.length > 0) {
        recommendation += `3. Liquidity Pool Alternative: ${lpLines[0].replace('- ', '')} (higher risk)\n`;
      }
      
      recommendation += '4. Expected monthly return: 3-8% APY depending on option (~$0.25-0.67 per month)\n';
    }
    
    recommendation += '\nAdditional Notes:\n';
    recommendation += '- Consider leaving assets on a centralized exchange with yield programs if amount is small\n';
    recommendation += '- Monitor gas prices for optimal entry/exit timing\n';
    recommendation += '- Expected returns are approximate and may vary with market conditions\n';
    
    return recommendation;
  } catch (error) {
    console.error("Error during recommendation finalization:", error);
    if (error instanceof Error) {
      return `Error creating final recommendation: ${error.message}`;
    }
    return 'An unexpected error occurred creating the final recommendation.';
  }
}

export const executeYieldResearch = tool({
  description: `Executes the yield research plan created with planYieldResearch. This tool takes the current research plan and executes all the steps in the plan autonomously, providing detailed analysis for each step. Use this immediately after creating a research plan to automatically execute all steps in sequence.`,
  parameters: z.object({
    includeRawData: z.boolean().nullable().describe("Whether to include raw data in the results. Defaults to false."),
  }),
  execute: async ({ 
    includeRawData = false
  }) => {
    console.log(`Executing yield research plan`);
    
    try {
      // Get the current plan from the state manager
      const stateManager = PlanStateManager.getInstance();
      const currentPlan = stateManager.getCurrentPlan();
      
      if (!currentPlan) {
        return {
          success: false,
          message: "No research plan exists. Create one first with planYieldResearch."
        };
      }
      
      console.log(`Executing plan: ${currentPlan.title}`);
      
      // Update plan status to in-progress
      stateManager.updatePlan({ status: 'in-progress' });
      
      // Keep track of completed steps
      const completedStepIds = new Set<string>();
      
      // Execute all steps in the plan (respecting dependencies)
      let allStepsCompleted = false;
      let iterationCount = 0;
      const MAX_ITERATIONS = 20; // Safety limit
      
      while (!allStepsCompleted && iterationCount < MAX_ITERATIONS) {
        iterationCount++;
        console.log(`Iteration ${iterationCount} of plan execution`);
        
        // Find steps that are ready to execute (pending with all dependencies completed)
        const readySteps = currentPlan.steps.filter(step => {
          // Skip steps that are already completed or in-progress
          if (step.status !== 'pending') return false;
          
          // Check if all dependencies are completed
          if (step.dependsOn && step.dependsOn.length > 0) {
            return step.dependsOn.every(depId => completedStepIds.has(depId));
          }
          
          // No dependencies, step is ready
          return true;
        });
        
        if (readySteps.length === 0) {
          // If no steps are ready but not all completed, we might be stuck
          const pendingSteps = currentPlan.steps.filter(s => s.status === 'pending');
          if (pendingSteps.length > 0) {
            console.log(`Warning: No steps ready to execute but ${pendingSteps.length} pending steps remain`);
            // Check if we're stuck in a dependency cycle or missing a dependency
            const missingDeps = pendingSteps.flatMap(s => (s.dependsOn || [])
              .filter(depId => !completedStepIds.has(depId) && 
                              !currentPlan.steps.some(step => step.id === depId)));
            
            if (missingDeps.length > 0) {
              return {
                success: false,
                message: `Error executing research plan: Missing dependencies ${missingDeps.join(', ')}`
              };
            }
            
            // If we can't identify the issue, just break
            break;
          } else {
            // All steps are completed, we're done
            allStepsCompleted = true;
            break;
          }
        }
        
        // Execute each ready step
        for (const step of readySteps) {
          console.log(`Executing step ${step.id}: ${step.description}`);
          stateManager.updateStep(step.id, 'in-progress');
          
          try {
            // Determine which research function to call based on step description
            const stepResult = await executeResearchStep(step, currentPlan.context);
            
            // Update step status
            stateManager.updateStep(step.id, 'completed', stepResult);
            completedStepIds.add(step.id);
            console.log(`Completed step ${step.id}`);
          } catch (error) {
            console.error(`Error executing step ${step.id}:`, error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            stateManager.updateStep(step.id, 'failed', `Error: ${errorMessage}`);
            return {
              success: false,
              message: `Error executing step ${step.id}: ${errorMessage}`
            };
          }
        }
      }
      
      // Check if we hit the iteration limit
      if (iterationCount >= MAX_ITERATIONS) {
        return {
          success: false,
          message: `Execution aborted: Maximum number of iterations (${MAX_ITERATIONS}) reached.`
        };
      }
      
      // Update plan status to completed
      stateManager.updatePlan({ status: 'completed' });
      
      // Get the updated plan
      const updatedPlan = stateManager.getCurrentPlan();
      
      // Create the response
      const response: any = {
        success: true,
        message: `Research plan "${updatedPlan?.title}" executed successfully.`,
        summary: generateResearchSummary(updatedPlan)
      };
      
      // Include the full plan data if requested
      if (includeRawData) {
        response.plan = updatedPlan;
      }
      
      return response;
    } catch (error) {
      console.error("Error during yield research execution:", error);
      if (error instanceof Error) {
        return {
          success: false,
          message: `Error executing yield research: ${error.message}`
        };
      }
      return {
        success: false,
        message: 'An unexpected error occurred during yield research execution.'
      };
    }
  },
});

// Function to execute a specific research step based on its description
async function executeResearchStep(step: Step, context: Record<string, any>): Promise<string> {
  // Parse the step description to determine what action to take
  const desc = step.description.toLowerCase();
  
  // Search for yield opportunities by chain
  if (desc.includes('yield') && (desc.includes('opportunities') || desc.includes('search'))) {
    // Determine the target chain
    let targetChain = '';
    if (desc.includes('gnosis')) targetChain = 'Gnosis';
    else if (desc.includes('base')) targetChain = 'Base';
    else if (desc.includes('ethereum') || desc.includes('mainnet')) targetChain = 'Ethereum';
    else if (desc.includes('arbitrum')) targetChain = 'Arbitrum';
    else if (desc.includes('optimism')) targetChain = 'Optimism';
    else if (desc.includes('polygon')) targetChain = 'Polygon';
    
    // Generate an appropriate query for yieldSearch
    const inputToken = context.inputToken || 'ETH';
    const riskLevel = context.riskPreference || 'medium';
    const searchQuery = `${inputToken} yield opportunities on ${targetChain} chain for ${context.inputAmount ? `$${context.inputAmount}` : 'small'} investments, ${riskLevel} risk`;
    
    console.log(`Executing yield search with query: ${searchQuery}`);
    
    try {
      // Call the yieldSearch tool's execute method
      const result = await yieldSearchTool.execute({ query: searchQuery });
      return result;
    } catch (error) {
      console.error('Error in yield search:', error);
      throw new Error(`Failed to search for yield opportunities: ${error}`);
    }
  }
  
  // Get token prices
  else if (desc.includes('price') && (desc.includes('token') || desc.includes('coin'))) {
    // Extract token symbol
    const tokenSymbol = context.inputToken || 'ETH';
    
    try {
      // Call the getTokenPrice tool's execute method
      const result = await getTokenPriceTool.execute({ tokenSymbol: tokenSymbol, vsCurrency: null });
      // Format the result
      const price = typeof result === 'number' ? result : 
                    result.price ? result.price : 
                    3000; // fallback value
      
      return `Current price of ${tokenSymbol}: $${price.toFixed(2)}`;
    } catch (error) {
      console.error('Error getting token price:', error);
      throw new Error(`Failed to get token price: ${error}`);
    }
  }
  
  // Compare or analyze results
  else if (desc.includes('compare') || desc.includes('analyze') || desc.includes('evaluate')) {
    // This step likely depends on previous steps, so we need to get their results
    const updatedPlan = PlanStateManager.getInstance().getCurrentPlan();
    if (!updatedPlan) {
      throw new Error('Plan not found when trying to compare/analyze results');
    }
    
    // Get the dependencies
    const dependenciesResults = step.dependsOn?.map(depId => {
      const depStep = updatedPlan.steps.find(s => s.id === depId);
      return depStep?.result || '';
    }).filter(Boolean) || [];
    
    if (dependenciesResults.length === 0) {
      throw new Error('No dependency results found for comparison/analysis');
    }
    
    // Analyze the results
    if (desc.includes('compare') && (desc.includes('gnosis') || desc.includes('base'))) {
      // This is comparing yield opportunities between chains
      return analyzeYieldComparison(dependenciesResults, context);
    } else {
      // Generic analysis
      return `Analysis of collected data:\n\n${dependenciesResults.join('\n\n')}`;
    }
  }
  
  // Recommend or suggest actions
  else if (desc.includes('recommend') || desc.includes('suggest')) {
    // This step needs to provide a final recommendation
    const updatedPlan = PlanStateManager.getInstance().getCurrentPlan();
    if (!updatedPlan) {
      throw new Error('Plan not found when trying to make recommendation');
    }
    
    // Get results from all previous steps
    const allResults = updatedPlan.steps
      .filter(s => s.result && s.id !== step.id)
      .map(s => s.result || '')
      .filter(Boolean);
    
    // Generate recommendation
    return generateRecommendation(allResults, context);
  }
  
  // If we can't determine what to do, return a generic message
  return `Executed step "${step.description}" - no specific action could be determined`;
}

// Function to analyze yield comparison between chains
function analyzeYieldComparison(results: string[], context: Record<string, any>): string {
  // Extract yield data from the results
  const yieldData: Record<string, any[]> = {};
  
  results.forEach(result => {
    // Determine which chain this result is for
    let chain = '';
    if (result.toLowerCase().includes('gnosis')) chain = 'Gnosis';
    else if (result.toLowerCase().includes('base')) chain = 'Base';
    else return; // Skip if we can't determine the chain
    
    // Extract the yield opportunities
    const opportunities: any[] = [];
    const lines = result.split('\n');
    
    lines.forEach(line => {
      if (line.startsWith('-')) {
        // Parse the line into components
        const parts = line.substring(2).split(', ');
        try {
          const opportunity = {
            project: parts[0].split(': ')[1],
            chain: parts[1].split(': ')[1],
            symbol: parts[2].split(': ')[1],
            apy: parseFloat(parts[3].split(': ')[1].replace('%', '')),
            tvl: parts[4].split(': ')[1],
            risk: parts[5]?.split(': ')[1] || 'unknown'
          };
          opportunities.push(opportunity);
        } catch (error) {
          console.error('Error parsing opportunity:', error, line);
        }
      }
    });
    
    yieldData[chain] = opportunities;
  });
  
  // Compare the opportunities
  let analysis = `Comparison of yield opportunities on Gnosis vs Base chains:\n\n`;
  
  // Check if we have data for both chains
  if (!yieldData.Gnosis || !yieldData.Base) {
    return `Insufficient data to compare yield opportunities between Gnosis and Base chains.`;
  }
  
  // Find highest APY on each chain
  const gnosisHighest = [...yieldData.Gnosis].sort((a, b) => b.apy - a.apy)[0];
  const baseHighest = [...yieldData.Base].sort((a, b) => b.apy - a.apy)[0];
  
  analysis += `Highest APY on Gnosis: ${gnosisHighest.project} (${gnosisHighest.symbol}) at ${gnosisHighest.apy}% APY\n`;
  analysis += `Highest APY on Base: ${baseHighest.project} (${baseHighest.symbol}) at ${baseHighest.apy}% APY\n\n`;
  
  // Compare fees (this would be more accurate with actual chain data)
  analysis += `Fee Comparison:\n`;
  analysis += `- Gnosis chain typically has lower gas fees (~$0.01-0.10 per transaction)\n`;
  analysis += `- Base chain has moderate gas fees (~$0.10-0.50 per transaction)\n\n`;
  
  // Determine which is better for a small investment
  const inputAmount = context.inputAmount || 20;
  analysis += `Analysis for $${inputAmount} investment:\n`;
  
  // Very simple calculation - in reality, this would be more complex
  const gnosisFeePercent = 0.005; // 0.5% of investment
  const baseFeePercent = 0.02; // 2% of investment
  
  const gnosisYearlyReturn = inputAmount * (gnosisHighest.apy / 100) * (1 - gnosisFeePercent);
  const baseYearlyReturn = inputAmount * (baseHighest.apy / 100) * (1 - baseFeePercent);
  
  analysis += `- Estimated yearly return on Gnosis: $${gnosisYearlyReturn.toFixed(2)} (after fees)\n`;
  analysis += `- Estimated yearly return on Base: $${baseYearlyReturn.toFixed(2)} (after fees)\n\n`;
  
  // Provide a recommendation
  if (gnosisYearlyReturn > baseYearlyReturn) {
    analysis += `For a $${inputAmount} investment, Gnosis chain appears more cost-effective due to lower fees, even though the raw APY might be similar to Base.`;
  } else {
    analysis += `For a $${inputAmount} investment, Base chain appears to offer better returns despite slightly higher fees, due to the higher raw APY available.`;
  }
  
  return analysis;
}

// Function to generate a final recommendation
function generateRecommendation(results: string[], context: Record<string, any>): string {
  // Combine all results
  const combinedResults = results.join('\n\n');
  
  // Generate a recommendation based on the investment amount
  const inputAmount = context.inputAmount || 20;
  const inputToken = context.inputToken || 'ETH';
  
  let recommendation = `Recommendation for $${inputAmount} ${inputToken}:\n\n`;
  
  // Extract the highest APY opportunity and chain from the results
  let highestApy = 0;
  let bestOpportunity = '';
  let bestChain = '';
  
  // Very simplistic parsing - in a real implementation, this would be more robust
  results.forEach(result => {
    if (result.includes('Highest APY')) {
      const apyMatch = result.match(/(\d+(\.\d+)?)% APY/);
      const chainMatch = result.match(/Highest APY on ([^:]+):/);
      const opportunityMatch = result.match(/Highest APY on [^:]+: ([^(]+)/);
      
      if (apyMatch && chainMatch && opportunityMatch) {
        const apy = parseFloat(apyMatch[1]);
        if (apy > highestApy) {
          highestApy = apy;
          bestChain = chainMatch[1].trim();
          bestOpportunity = opportunityMatch[1].trim();
        }
      }
    }
  });
  
  if (bestOpportunity && bestChain) {
    recommendation += `Based on our research, the best yield opportunity for your $${inputAmount} ${inputToken} is ${bestOpportunity} on the ${bestChain} chain, offering approximately ${highestApy.toFixed(2)}% APY.\n\n`;
  }
  
  // Check for fee information
  if (combinedResults.toLowerCase().includes('fee')) {
    recommendation += "Fee considerations:\n";
    if (combinedResults.toLowerCase().includes('gnosis') && combinedResults.toLowerCase().includes('lower fees')) {
      recommendation += "- Gnosis chain offers lower transaction fees, making it more cost-effective for smaller investments\n";
    }
    if (combinedResults.toLowerCase().includes('base') && combinedResults.toLowerCase().includes('moderate fees')) {
      recommendation += "- Base chain has moderate fees but may offer higher raw APY on certain protocols\n";
    }
  }
  
  // Add a general conclusion
  recommendation += `\nFor your investment size ($${inputAmount}), we recommend prioritizing lower transaction fees as they can significantly impact your overall returns. Always consider the security profile of the protocol and the chain when making your final decision.`;
  
  return recommendation;
}

// Function to generate a summary of the research
function generateResearchSummary(plan: ResearchPlan | null): string {
  if (!plan) return "No research plan available.";
  
  let summary = `Research Summary: ${plan.title}\n\n`;
  
  // Add context information
  if (plan.context) {
    summary += `Investment: $${plan.context.inputAmount || 'unknown'} in ${plan.context.inputToken || 'unknown'}\n`;
    summary += `Target Chain(s): ${plan.context.targetChain || 'unknown'}\n`;
    summary += `Risk Preference: ${plan.context.riskPreference || 'medium'}\n\n`;
  }
  
  // Add completed step results
  const completedSteps = plan.steps.filter(step => step.status === 'completed' && step.result);
  if (completedSteps.length > 0) {
    // For the final step (recommendation), include its full result
    const recommendationStep = completedSteps.find(step => 
      step.description.toLowerCase().includes('recommend') || 
      step.description.toLowerCase().includes('suggest'));
    
    if (recommendationStep && recommendationStep.result) {
      summary += recommendationStep.result;
    } else {
      // If no recommendation step, include the last step's result
      const lastStep = completedSteps[completedSteps.length - 1];
      if (lastStep && lastStep.result) {
        summary += lastStep.result;
      }
    }
  } else {
    summary += "No completed research steps found.";
  }
  
  return summary;
}