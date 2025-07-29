'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FXRate {
  from: string;
  to: string;
  rate: number;
  change: number;
  savings: number;
  trend: 'up' | 'down' | 'stable';
}

interface FXOpportunitiesProps {
  onConvert?: (from: string, to: string) => void;
}

export function FXOpportunities({ onConvert }: FXOpportunitiesProps) {
  const [rates, setRates] = useState<FXRate[]>([
    { from: "CNY", to: "USD", rate: 7.21, change: 0.003, savings: 201, trend: 'up' },
    { from: "EUR", to: "USD", rate: 1.088, change: -0.002, savings: 89, trend: 'down' },
    { from: "INR", to: "USD", rate: 83.12, change: 0.001, savings: 156, trend: 'stable' }
  ]);

  // Simulate rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev => prev.map(rate => ({
        ...rate,
        rate: rate.rate * (1 + (Math.random() - 0.5) * 0.0002),
        change: (Math.random() - 0.5) * 0.005,
        savings: Math.floor(Math.random() * 300) + 50,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string, change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            FX Opportunities
            <Zap className="w-5 h-5 text-yellow-500" />
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {rates.map((rate) => (
          <div 
            key={`${rate.from}-${rate.to}`} 
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group"
            onClick={() => onConvert?.(rate.from, rate.to)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {rate.from} → {rate.to}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Save ${rate.savings}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  {rate.rate.toFixed(4)}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(rate.trend, rate.change)}
                  <span className={cn(
                    "text-xs font-medium",
                    rate.change >= 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {rate.change >= 0 ? '+' : ''}{(rate.change * 100).toFixed(3)}%
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-gray-500">Market rate</p>
                <p className="text-sm font-medium text-gray-700">
                  {(rate.rate * 1.003).toFixed(4)}
                </p>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                0.3% better than traditional banks • No hidden fees
              </p>
            </div>
          </div>
        ))}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Real-time FX monitoring
              </p>
              <p className="text-xs text-blue-700 mt-1">
                We'll notify you when rates are favorable for your frequent currency pairs
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}