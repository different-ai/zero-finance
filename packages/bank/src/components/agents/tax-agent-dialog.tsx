'use client';
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { addAgent } from './active-agents';
import { ClipboardList, Mail, File } from 'lucide-react';

interface TaxAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxData: any;
}

export function TaxAgentDialog({ open, onOpenChange, taxData }: TaxAgentDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [config, setConfig] = useState({
    collectReceipts: true,
    automateFilings: true,
    notifyBeforeDeadlines: true,
    emailIntegration: false,
    documentScanning: false,
  });

  // Reset steps when dialog is opened
  useEffect(() => {
    if (open) {
      setStep(1);
    }
  }, [open]);

  const handleCreateAgent = () => {
    addAgent({
      id: `tax-${crypto.randomUUID()}`,
      name: `Tax Automation for ${taxData.country}`,
      type: 'tax',
      status: 'active',
      description: `Managing tax compliance, receipt collection, and filing for your business in ${taxData.country}`,
      config: {
        ...taxData,
        ...config,
      },
      createdAt: new Date(),
      lastActivity: new Date(),
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Setup Tax Automation Agent
          </DialogTitle>
          <DialogDescription>
            Configure your tax automation agent for {taxData?.country || 'your business'}
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 && (
          <div className="py-4">
            <h3 className="font-medium mb-3">What would you like this agent to handle?</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={config.collectReceipts} 
                  onChange={(e) => setConfig({...config, collectReceipts: e.target.checked})}
                  className="rounded"
                />
                <span>Collect and categorize receipts and invoices</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={config.automateFilings} 
                  onChange={(e) => setConfig({...config, automateFilings: e.target.checked})}
                  className="rounded"
                />
                <span>Prepare and automate tax filings</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={config.notifyBeforeDeadlines} 
                  onChange={(e) => setConfig({...config, notifyBeforeDeadlines: e.target.checked})}
                  className="rounded"
                />
                <span>Notify me about upcoming tax deadlines</span>
              </label>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setStep(2)}>Continue</Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="py-4">
            <h3 className="font-medium mb-3">Connect your data sources</h3>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-md flex items-start space-x-3">
                <Mail className="h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-medium">Email Integration</h4>
                  <p className="text-sm text-muted-foreground mb-2">Allow the agent to monitor your email for receipts and invoices</p>
                  <Button 
                    variant={config.emailIntegration ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setConfig({...config, emailIntegration: !config.emailIntegration})}
                  >
                    {config.emailIntegration ? 'Connected' : 'Connect Email'}
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-md flex items-start space-x-3">
                <File className="h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-medium">Document Scanner</h4>
                  <p className="text-sm text-muted-foreground mb-2">Process physical documents by taking photos</p>
                  <Button 
                    variant={config.documentScanning ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setConfig({...config, documentScanning: !config.documentScanning})}
                  >
                    {config.documentScanning ? 'Enabled' : 'Enable Scanner'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Continue</Button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="py-4">
            <h3 className="font-medium mb-3">Review and Confirm</h3>
            
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-muted rounded-md">
                <span className="font-medium">Tax Jurisdiction:</span> {taxData.country}
              </div>
              
              <div className="p-3 bg-muted rounded-md">
                <span className="font-medium">Features:</span>
                <ul className="mt-1 ml-5 list-disc">
                  {config.collectReceipts && <li>Receipt Collection</li>}
                  {config.automateFilings && <li>Tax Filing Automation</li>}
                  {config.notifyBeforeDeadlines && <li>Deadline Notifications</li>}
                </ul>
              </div>
              
              <div className="p-3 bg-muted rounded-md">
                <span className="font-medium">Integrations:</span>
                <ul className="mt-1 ml-5 list-disc">
                  {config.emailIntegration && <li>Email Connected</li>}
                  {config.documentScanning && <li>Document Scanner Enabled</li>}
                </ul>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleCreateAgent}>Create Tax Agent</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}