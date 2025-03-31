'use client';

import { useMemo } from 'react';
import { ChartBarIcon, TrendingUpIcon, ShieldCheckIcon } from 'lucide-react';

interface YieldResultViewProps {
  data: string;
}

interface ParsedYieldData {
  title: string;
  pools: YieldPool[];
  footer?: string;
}

interface YieldPool {
  project: string;
  chain: string;
  symbol: string;
  apy: string;
  tvl: string;
  risk?: string;
}

export function YieldResultView({ data }: YieldResultViewProps) {
  // Parse the yield search result string into structured data
  const parsedData = useMemo(() => parseYieldData(data), [data]);

  if (!parsedData) {
    return (
      <div className="text-sm text-gray-600 p-3">
        <p>Couldn&apos;t parse yield data. View the raw data to see the complete response.</p>
      </div>
    );
  }

  return (
    <div className="yield-results">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">{parsedData.title}</h3>
      </div>

      {/* Yield Pools */}
      <div className="space-y-3">
        {parsedData.pools.map((pool, index) => (
          <div 
            key={index} 
            className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{pool.project}</div>
                <div className="text-sm text-gray-600 flex items-center mt-1">
                  <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                    {pool.chain}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span>{pool.symbol}</span>
                  {pool.risk && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="flex items-center">
                        <ShieldCheckIcon className="size-3 mr-1" />
                        {pool.risk}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="flex items-center text-green-600 font-semibold">
                    <TrendingUpIcon className="size-3 mr-1" />
                    {pool.apy}
                  </div>
                  <div className="text-xs text-gray-500">APY</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{pool.tvl}</div>
                  <div className="text-xs text-gray-500">TVL</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {parsedData.footer && (
        <div className="mt-4 text-sm text-gray-600">
          <p>{parsedData.footer}</p>
        </div>
      )}
    </div>
  );
}

// Helper function to parse the yield result string into structured data
function parseYieldData(data: string): ParsedYieldData | null {
  try {
    if (!data) return null;

    const lines = data.split('\n');
    let title = '';
    const pools: YieldPool[] = [];
    let footer = '';
    
    // Extract title (first line or before the first empty line)
    const titleLineIndex = lines.findIndex(line => line.trim() !== '' && !line.startsWith('-'));
    if (titleLineIndex >= 0) {
      title = lines[titleLineIndex].trim();
    }
    
    // Extract pools (lines starting with '- ')
    lines.forEach(line => {
      if (line.startsWith('- ')) {
        const poolData = line.substring(2); // Remove the leading '- '
        const parts = poolData.split(', ');
        
        if (parts.length >= 4) { // Ensure minimum required data
          const pool: YieldPool = {
            project: extractValue(parts[0], 'Project'),
            chain: extractValue(parts[1], 'Chain'),
            symbol: extractValue(parts[2], 'Symbol'),
            apy: extractValue(parts[3], 'APY'),
            tvl: extractValue(parts[4], 'TVL'),
          };
          
          // Add risk if available
          if (parts.length > 5) {
            const riskPart = parts.find(part => part.includes('Risk'));
            if (riskPart) {
              pool.risk = extractValue(riskPart, 'Risk');
            }
          }
          
          pools.push(pool);
        }
      }
    });
    
    // Extract footer (anything after the last pool and Data source)
    const dataSourceIndex = lines.findIndex(line => line.includes('Data source'));
    if (dataSourceIndex > 0) {
      footer = lines[dataSourceIndex].trim();
    }
    
    return { title, pools, footer };
  } catch (error) {
    console.error('Error parsing yield data:', error);
    return null;
  }
}

// Helper function to extract values from key-value pairs in the format "Key: Value"
function extractValue(part: string, key: string): string {
  try {
    if (part.includes(':')) {
      return part.split(':')[1].trim();
    } else if (part.includes(key)) {
      return part.replace(`${key}:`, '').trim();
    }
    return part.trim();
  } catch {
    return part;
  }
} 