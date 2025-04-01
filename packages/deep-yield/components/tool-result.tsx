'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { 
  Code as CodeIcon, 
  Eye as EyeIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  RefreshCw as RefreshIcon
} from 'lucide-react';

interface ToolResultProps {
  toolName: string;
  result: any;
}

export function ToolResult({ toolName, result }: ToolResultProps) {
  const [view, setView] = useState<'formatted' | 'raw'>('formatted');
  const [expanded, setExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshedPlan, setRefreshedPlan] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(toolName === 'planYieldResearch');
  
  // Function to refresh the plan status
  const refreshPlan = useCallback(async () => {
    if (toolName !== 'planYieldResearch' || !result?.success) return;
    
    try {
      setRefreshing(true);
      
      // Call the API to get the latest plan status
      const response = await fetch('/api/research/refresh-plan', {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.plan) {
          setRefreshedPlan(data);
        }
      }
    } catch (error) {
      console.error('Error refreshing plan:', error);
    } finally {
      setRefreshing(false);
    }
  }, [toolName, result]);
  
  // Auto-refresh timer for research plans
  useEffect(() => {
    if (!autoRefresh || toolName !== 'planYieldResearch') return;
    
    // Only auto-refresh if plan is not completed or failed
    const currentPlan = refreshedPlan || result;
    const planStatus = currentPlan?.plan?.status;
    if (planStatus === 'completed' || planStatus === 'failed') {
      setAutoRefresh(false);
      return;
    }
    
    const timer = setInterval(() => {
      refreshPlan();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(timer);
  }, [autoRefresh, refreshPlan, toolName]);
  
  // Stop auto-refresh when component unmounts
  useEffect(() => {
    return () => setAutoRefresh(false);
  }, []);

  // Format the JSON for raw display with syntax highlighting
  const formattedJson = () => {
    try {
      // If it's already a string (for tools that return strings), show it directly
      if (typeof result === 'string') {
        return result;
      }
      return JSON.stringify(result, null, 2);
    } catch (error) {
      return `Error formatting result: ${error}`;
    }
  };
  
  // The current active plan data (either refreshed or original)
  const activePlanData = refreshedPlan || result;
  
  // Function to render the appropriate tool result component
  const renderFormattedView = () => {
    switch (toolName) {
      case 'yieldSearch':
        // Will be implemented in a separate component
        return (
          <div className="p-4 text-sm">
            <div className="font-medium mb-2">Yield Search Results</div>
            <p className="text-gray-600">{result}</p>
          </div>
        );
      case 'getTokenPrice':
        // Will be implemented in a separate component
        return (
          <div className="p-4 text-sm">
            <div className="font-medium mb-2">Token Price</div>
            {result.success ? (
              <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md">
                <div className="font-medium text-base">${typeof result.price === 'number' ? result.price.toFixed(2) : '—'}</div>
                <div className="text-sm mt-1">{result.message}</div>
              </div>
            ) : (
              <div className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded-md">
                <div className="font-medium">Price Unavailable</div>
                <div className="text-sm mt-1">{result.message}</div>
                <div className="text-xs mt-2 text-yellow-600">
                  Try a different token symbol or check if CoinGecko supports this token.
                </div>
              </div>
            )}
          </div>
        );
      case 'executeYieldResearch':
        // Handle the research results object
        return (
          <div className="p-4 text-sm">
            <div className="font-medium text-lg mb-3 flex justify-between items-center">
              <span>Research Results</span>
              {toolName === 'executeYieldResearch' && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 px-2"
                    onClick={refreshPlan}
                    disabled={refreshing}
                  >
                    <RefreshIcon className={cn("size-3 mr-1", refreshing ? "animate-spin" : "")} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>
              )}
            </div>
            
            {activePlanData.success ? (
              <>
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md mb-4">
                  ✓ {activePlanData.message}
                </div>
                
                {/* Show steps progress if available */}
                {activePlanData.plan?.steps && activePlanData.plan.steps.length > 0 && (
                  <div className="my-4">
                    <h4 className="text-sm font-medium mb-2">Progress:</h4>
                    
                    {/* Progress bar */}
                    {(() => {
                      const totalSteps = activePlanData.plan.steps.length;
                      const completedSteps = activePlanData.plan.steps.filter(
                        (s: any) => s.status === 'completed'
                      ).length;
                      const inProgressSteps = activePlanData.plan.steps.filter(
                        (s: any) => s.status === 'in-progress'
                      ).length;
                      
                      const completedPercent = Math.round((completedSteps / totalSteps) * 100);
                      const inProgressPercent = Math.round((inProgressSteps / totalSteps) * 100);
                      
                      return (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>
                              {completedSteps} of {totalSteps} steps completed ({completedPercent}%)
                            </span>
                            <span>
                              {activePlanData.plan.status}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-green-500 h-full rounded-full" 
                              style={{ width: `${completedPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })()}
                    
                    <div className="space-y-2">
                      {activePlanData.plan.steps.map((step: any, index: number) => {
                        let statusColor = 'bg-gray-100 text-gray-700';
                        let statusIcon = '⏱️';
                        
                        if (step.status === 'completed') {
                          statusColor = 'bg-green-100 text-green-700';
                          statusIcon = '✓';
                        } else if (step.status === 'in-progress') {
                          statusColor = 'bg-blue-100 text-blue-700';
                          statusIcon = '⟳';
                        } else if (step.status === 'failed') {
                          statusColor = 'bg-red-100 text-red-700';
                          statusIcon = '✗';
                        }
                        
                        return (
                          <div key={step.id || index} className="flex items-start">
                            <div className={`px-2 py-1 rounded-md mr-2 ${statusColor} text-xs`}>
                              {statusIcon} {step.status}
                            </div>
                            <div className="grow text-sm">
                              {step.description}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {activePlanData.summary && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Summary</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 whitespace-pre-wrap">
                      {activePlanData.summary}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md">
                ✗ {activePlanData.message}
              </div>
            )}
          </div>
        );
      case 'planYieldResearch':
        // Handle the research plan object
        return (
          <div className="p-4 text-sm">
            <div className="font-medium text-lg mb-3 flex justify-between items-center">
              <span>Research Plan</span>
              {toolName === 'planYieldResearch' && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 px-2"
                    onClick={refreshPlan}
                    disabled={refreshing}
                  >
                    <RefreshIcon className={cn("size-3 mr-1", refreshing ? "animate-spin" : "")} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </Button>
                  <div className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      id="auto-refresh"
                      className="size-3"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                    />
                    <label htmlFor="auto-refresh" className="text-xs text-gray-500">
                      Auto-refresh
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            {activePlanData.success ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{activePlanData.plan?.title || 'Research Plan'}</h3>
                  <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {activePlanData.plan?.status || 'pending'}
                  </div>
                </div>
                
                {activePlanData.plan?.steps && activePlanData.plan.steps.length > 0 ? (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Steps:</h4>
                    <ol className="list-decimal pl-5 space-y-2">
                      {activePlanData.plan.steps.map((step: any, index: number) => (
                        <li key={step.id || index} className="pl-1">
                          <div className="flex items-start">
                            <div className="grow">
                              {step.description}
                              {step.dependsOn && step.dependsOn.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Depends on steps: {step.dependsOn.join(', ')}
                                </div>
                              )}
                            </div>
                            <div className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">
                              {step.status}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <p className="text-gray-600">No steps defined in the research plan.</p>
                )}
              </>
            ) : (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md">
                ✗ {activePlanData.message || 'Failed to create research plan'}
              </div>
            )}
          </div>
        );
      case 'getTokenInfo':
        // Token info display
        return (
          <div className="p-4 text-sm">
            <div className="font-medium text-lg mb-3">Token Information</div>
            
            {result.success ? (
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center">
                    {result.logo && (
                      <Image src={result.logo} alt={result.name} className="size-6 mr-2 rounded-full" width={24} height={24} />
                    )}
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-xs text-gray-500">{result.symbol}</div>
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                    {result.chain || 'Unknown Chain'}
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-gray-500">Contract Address</div>
                      <div className="font-mono text-xs truncate">{result.address}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Token Type</div>
                      <div>{result.type || 'Unknown'}</div>
                    </div>
                    {result.decimals !== undefined && (
                      <div>
                        <div className="text-xs text-gray-500">Decimals</div>
                        <div>{result.decimals}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md">
                {result.message || 'Failed to retrieve token information'}
              </div>
            )}
          </div>
        );
        
      case 'getSwapEstimate':
        // Swap estimate display
        return (
          <div className="p-4 text-sm">
            <div className="font-medium text-lg mb-3">Swap Estimate</div>
            
            {result && !result.error ? (
              <div className="border border-gray-200 rounded-md overflow-hidden" data-testid="swap-estimate-result">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{result.fromAmount}</span> {result.fromToken}
                    </div>
                    <div>→</div>
                    <div>
                      <span className="font-medium">
                        {result.formatted && result.formatted.amountOut 
                          ? result.formatted.amountOut 
                          : (typeof result.toAmount === 'number' 
                              ? result.toAmount.toFixed(4) 
                              : result.toAmount)}
                      </span> {result.toToken}
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Exchange Rate</div>
                      <div>1 {result.fromToken} = {result.formatted?.rate || result.rate} {result.toToken}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Gas Fee (est.)</div>
                      <div data-testid="gas-fee">{result.formatted?.gasFee || `$${result.gasFee}` || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Protocol Fee</div>
                      <div>{result.formatted?.protocolFee || `${result.protocolFee}%` || '0%'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Chain</div>
                      <div>{result.chain || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Cost</div>
                      <div className="font-medium" data-testid="total-cost">{result.formatted?.totalCost || `$${result.totalCost}` || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Protocol</div>
                      <div>{result.protocol || 'Unknown'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md">
                {result?.error || 'Failed to get swap estimate'}
              </div>
            )}
          </div>
        );
        
      case 'getBridgeQuote':
        // Bridge quote display
        return (
          <div className="p-4 text-sm">
            <div className="font-medium text-lg mb-3">Bridge Quote</div>
            
            {result && !result.error ? (
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-xs text-gray-500">From Chain</div>
                      <div className="font-medium">{result.fromChain}</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="size-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full">
                        →
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">To Chain</div>
                      <div className="font-medium">{result.toChain}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500">Send</div>
                      <div className="font-medium">{result.sendAmount} {result.tokenSymbol}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Receive</div>
                      <div className="font-medium">{result.receiveAmount} {result.tokenSymbol}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-gray-500">Bridge Fee</div>
                      <div>${result.bridgeFee || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Gas Fee (est.)</div>
                      <div>${result.gasFee || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Estimated Time</div>
                      <div>{result.estimatedTime || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Bridge Provider</div>
                      <div>{result.bridgeProvider || 'Unknown'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md">
                {result?.error || 'Failed to get bridge quote'}
              </div>
            )}
          </div>
        );
        
      case 'getProtocolTvl':
      case 'getChainTvl':
        // TVL display
        const isTvlProtocol = toolName === 'getProtocolTvl';
        return (
          <div className="p-4 text-sm">
            <div className="font-medium text-lg mb-3">
              {isTvlProtocol ? 'Protocol TVL' : 'Chain TVL'}
            </div>
            
            {result && !result.error ? (
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">
                      {isTvlProtocol ? result.protocol : result.chain}
                    </div>
                    <div className="text-lg font-bold">
                      ${typeof result.tvl === 'number' 
                        ? result.tvl.toLocaleString('en-US', { maximumFractionDigits: 2 })
                        : result.tvl}
                    </div>
                  </div>
                </div>
                
                {result.tvlChange && (
                  <div className="p-3">
                    <div className="grid grid-cols-3 gap-3">
                      {result.tvlChange.day && (
                        <div>
                          <div className="text-xs text-gray-500">24h Change</div>
                          <div className={result.tvlChange.day > 0 ? 'text-green-600' : 'text-red-600'}>
                            {result.tvlChange.day > 0 ? '+' : ''}{result.tvlChange.day}%
                          </div>
                        </div>
                      )}
                      {result.tvlChange.week && (
                        <div>
                          <div className="text-xs text-gray-500">7d Change</div>
                          <div className={result.tvlChange.week > 0 ? 'text-green-600' : 'text-red-600'}>
                            {result.tvlChange.week > 0 ? '+' : ''}{result.tvlChange.week}%
                          </div>
                        </div>
                      )}
                      {result.tvlChange.month && (
                        <div>
                          <div className="text-xs text-gray-500">30d Change</div>
                          <div className={result.tvlChange.month > 0 ? 'text-green-600' : 'text-red-600'}>
                            {result.tvlChange.month > 0 ? '+' : ''}{result.tvlChange.month}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md">
                {result?.error || `Failed to get ${isTvlProtocol ? 'protocol' : 'chain'} TVL`}
              </div>
            )}
          </div>
        );
      // Add more tool-specific views here
      default:
        // For tools without a specific view, show a message
        return (
          <div className="p-4 text-sm text-gray-600">
            <p>No specific formatter available for {toolName}.</p>
            <p className="mt-2">Click &quot;View Raw Data&quot; to see the complete response.</p>
          </div>
        );
    }
  };

  // The expandable section that shows the raw data
  const renderRawData = () => {
    return (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: expanded ? 'auto' : 0,
          opacity: expanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <pre className={cn(
          "bg-gray-50 rounded-md text-sm overflow-x-auto p-3 mt-2",
          expanded ? "max-h-[400px]" : "max-h-0"
        )}>
          <code>{formattedJson()}</code>
        </pre>
      </motion.div>
    );
  };

  return (
    <div className="tool-result-container w-full border border-gray-200 rounded-lg overflow-hidden">
      <div className="tool-result-header flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="text-sm font-medium">{toolName} Result</div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(
              "text-xs",
              view === 'formatted' ? "bg-primary/10 hover:bg-primary/20" : ""
            )}
            onClick={() => setView('formatted')}
          >
            <EyeIcon className="mr-1 size-3" />
            Formatted
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(
              "text-xs",
              view === 'raw' ? "bg-primary/10 hover:bg-primary/20" : ""
            )}
            onClick={() => setView('raw')}
          >
            <CodeIcon className="mr-1 size-3" />
            Raw
          </Button>
        </div>
      </div>
      
      <div className="tool-result-body p-3">
        {view === 'formatted' ? renderFormattedView() : (
          <pre className="bg-gray-50 rounded-md text-sm overflow-x-auto p-3">
            <code>{formattedJson()}</code>
          </pre>
        )}
      </div>
      
      {/* Show debug toggle only in formatted view */}
      {view === 'formatted' && (
        <div className="tool-result-footer px-4 py-2 border-t border-gray-200">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs w-full flex justify-center items-center"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUpIcon className="mr-1 size-4" />
                Hide Debug Data
              </>
            ) : (
              <>
                <ChevronDownIcon className="mr-1 size-4" />
                Show Debug Data
              </>
            )}
          </Button>
          {renderRawData()}
        </div>
      )}
    </div>
  );
} 