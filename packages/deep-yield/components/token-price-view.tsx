'use client';

import { DollarSignIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

interface TokenPriceViewProps {
  data: any; // This can be a number or an object with price information
}

export function TokenPriceView({ data }: TokenPriceViewProps) {
  // Extract price and other data
  const price = typeof data === 'number' 
    ? data 
    : data?.price ?? null;
    
  const currency = data?.currency ?? 'USD';
  const symbol = data?.symbol ?? '';
  const change24h = data?.change24h ?? null;
  
  if (price === null) {
    return (
      <div className="text-sm text-gray-600 p-3">
        <p>No price data available.</p>
      </div>
    );
  }

  return (
    <div className="token-price-view p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {symbol && (
            <div className="bg-blue-100 text-blue-600 size-10 rounded-full flex items-center justify-center mr-3">
              {symbol.substring(0, 3)}
            </div>
          )}
          <div>
            <h3 className="font-medium text-lg">
              {symbol && `${symbol} Price`}
              {!symbol && 'Token Price'}
            </h3>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold flex items-center">
            <DollarSignIcon className="size-5 mr-1 text-gray-500" />
            {typeof price === 'number' ? price.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: price < 1 ? 6 : 2
            }) : price}
          </div>
          {change24h !== null && (
            <div className={`text-sm flex items-center justify-end ${change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change24h >= 0 ? (
                <TrendingUpIcon className="size-3 mr-1" />
              ) : (
                <TrendingDownIcon className="size-3 mr-1" />
              )}
              {`${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`}
              <span className="text-gray-500 ml-1">24h</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional information if available */}
      {data?.marketCap && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-gray-500">Market Cap</div>
              <div className="font-medium">${data.marketCap.toLocaleString()}</div>
            </div>
            {data?.volume24h && (
              <div>
                <div className="text-sm text-gray-500">24h Volume</div>
                <div className="font-medium">${data.volume24h.toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 