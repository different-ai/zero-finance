'use client';
import { useEffect, useRef, useState } from 'react';
import { AgentResponse, useAgentResponses } from '@/lib/agent-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TaxAgentDialog } from '@/components/agents/tax-agent-dialog';
import { Bot, Clock, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AgentResponses() {
  const responses = useAgentResponses();
  const responsesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new responses arrive
  useEffect(() => {
    responsesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [responses]);

  if (responses.length === 0) {
    return (
      <div className="bg-white border border-primary/20 rounded-lg p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <Bot className="h-5 w-5 text-primary mr-2" />
          <span className="font-medium text-gray-800">AI Agent Activity</span>
        </div>
        <p className="text-sm text-gray-500">
          Your financial AI assistant will display information and insights here after you ask questions or request tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-1">
        <Bot className="h-5 w-5 text-primary mr-2" />
        <span className="font-medium text-gray-800">AI Agent Activity</span>
      </div>
      
      <AnimatePresence>
        {responses.map((response) => (
          <motion.div
            key={response.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResponseCard response={response} />
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={responsesEndRef} />
    </div>
  );
}

function ResponseCard({ response }: { response: AgentResponse }) {
  const [taxDialogOpen, setTaxDialogOpen] = useState(false);
  
  return (
    <div className="bg-white border border-primary/20 rounded-lg overflow-hidden shadow-sm mb-4">
      <div className="border-b border-primary/10 p-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">AI Assistant</span>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(response.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-4">{response.content}</p>
        
        {response.type === 'yield-opportunities' && response.data && (
          <YieldOpportunitiesResponse data={response.data} />
        )}
        
        {response.type === 'tax-info' && response.data && (
          <>
            <TaxInfoResponse 
              data={response.data}
              onSetupAgent={() => setTaxDialogOpen(true)}
            />
            
            <TaxAgentDialog 
              open={taxDialogOpen}
              onOpenChange={setTaxDialogOpen}
              taxData={response.data}
            />
          </>
        )}
      </div>
    </div>
  );
}

function YieldOpportunitiesResponse({ data }: { data: any[] }) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number | ''>('');
  const [alertThreshold, setAlertThreshold] = useState<number>(0);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  
  useEffect(() => {
    if (selectedOpportunity) {
      setAlertThreshold(selectedOpportunity.apy * 0.8);
    }
  }, [selectedOpportunity]);
  
  const handleActivateAgent = () => {
    if (!selectedOpportunity) return;
    
    const opportunity = {
      ...selectedOpportunity,
      investmentAmount: investmentAmount || selectedOpportunity.minInvestment
    };
    
    const config = {
      opportunity,
      alertThreshold,
      emailAlerts,
      rebalanceFrequency: 'weekly'
    };
    
    window.dispatchEvent(new CustomEvent('activateYieldAgent', { 
      detail: {
        ...selectedOpportunity,
        config
      }
    }));
    
    setSelectedOpportunity(null);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Top Opportunities:</h3>
      
      {!selectedOpportunity ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.slice(0, 4).map((opportunity: any) => (
            <div key={opportunity.id} className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{opportunity.name}</h4>
                <span className="text-sm font-bold">{opportunity.apy}% APY</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{opportunity.description}</p>
              <div className="flex justify-between text-sm mb-3">
                <span>Min: {formatCurrency(opportunity.minInvestment, opportunity.currency)}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  opportunity.risk === 'low' 
                    ? 'bg-green-100 text-green-800' 
                    : opportunity.risk === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {opportunity.risk.charAt(0).toUpperCase() + opportunity.risk.slice(1)} Risk
                </span>
              </div>
              <Button 
                className="w-full" 
                size="sm" 
                variant="default" 
                onClick={() => setSelectedOpportunity(opportunity)}
              >
                Use This Yield
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Setup Yield Agent: {selectedOpportunity.name}</h4>
            <Button size="sm" variant="ghost" onClick={() => setSelectedOpportunity(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4 mb-4">
            <div>
              <h5 className="text-sm font-medium mb-1">Investment amount</h5>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={`Min: ${selectedOpportunity.minInvestment}`}
                  className="flex-1 border rounded-md p-2 text-sm"
                />
                <span className="text-sm">{selectedOpportunity.currency}</span>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-1">Alert me when APY falls below</h5>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(Number(e.target.value))}
                  className="flex-1 border rounded-md p-2 text-sm"
                />
                <span className="text-sm">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Agent will monitor rates and alert you if the yield drops
              </p>
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Receive email alerts</span>
              </label>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            variant="default" 
            onClick={handleActivateAgent}
          >
            Create Yield Agent
          </Button>
        </div>
      )}
    </div>
  );
}

function TaxInfoResponse({ data, onSetupAgent }: { data: any, onSetupAgent?: () => void }) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Tax Information for {data.country}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Corporate Tax Rate</h4>
          <p className="text-2xl font-bold">{data.corporateTaxRate}</p>
        </div>
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">VAT Rate</h4>
          <p className="text-2xl font-bold">{data.vatRate}</p>
        </div>
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Withholding Tax</h4>
          <p className="text-2xl font-bold">{data.witholdingTax}</p>
        </div>
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Tax Treaties</h4>
          <div className="flex flex-wrap gap-1">
            {data.taxTreaties.map((country: string) => (
              <span key={country} className="px-2 py-0.5 bg-secondary rounded-full text-xs">
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>
      {data.notes && (
        <div className="border rounded-md p-4 mb-4">
          <h4 className="font-medium mb-2">Additional Notes</h4>
          <p className="text-sm">{data.notes}</p>
        </div>
      )}
      
      <Button 
        className="w-full" 
        variant="default"
        onClick={onSetupAgent || (() => window.dispatchEvent(new CustomEvent('activateTaxAgent', { detail: data })))}
      >
        Setup Tax Automation Agent
      </Button>
    </div>
  );
}