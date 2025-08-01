'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign,
  Calendar,
  Zap,
  AlertCircle
} from 'lucide-react';
import { mockAutoPayRules } from '../mock-data';
import { toast } from 'sonner';

export function AutoPaySettings() {
  const [rules, setRules] = useState(mockAutoPayRules);

  const toggleRule = (id: string) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
    
    const rule = rules.find(r => r.id === id);
    if (rule) {
      toast.success(
        rule.enabled ? 'Auto-pay rule disabled' : 'Auto-pay rule enabled',
        { description: `${rule.recipientName} auto-pay ${rule.enabled ? 'disabled' : 'enabled'}` }
      );
    }
  };

  const deleteRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (rule && confirm(`Delete auto-pay rule for ${rule.recipientName}?`)) {
      setRules(prev => prev.filter(r => r.id !== id));
      toast.success('Auto-pay rule deleted');
    }
  };

  const getChainBadgeColor = (chain: string) => {
    switch (chain) {
      case 'ethereum':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'base':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'solana':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Auto-Pay Rules
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Set up automatic payments for recurring invoices
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                How Auto-Pay Works
              </p>
              <p className="text-blue-700 dark:text-blue-300 mt-1">
                When an invoice matches a rule, it will be automatically paid after a 24-hour review period. 
                You'll receive notifications before any payment is made.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Rules List */}
      <div className="space-y-3">
        {rules.map(rule => (
          <Card key={rule.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Rule Header */}
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{rule.recipientName}</h3>
                    <Badge className={getChainBadgeColor(rule.chain)}>
                      {rule.chain}
                    </Badge>
                    {!rule.enabled && (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </div>
                  
                  {/* Recipient Address */}
                  <p className="text-sm text-muted-foreground font-mono">
                    {rule.recipientAddress}
                  </p>
                  
                  {/* Rule Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Max Amount</p>
                        <p className="font-medium">${rule.maxAmount}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Auto-approve under</p>
                        <p className="font-medium">${rule.autoApproveUnder}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-medium capitalize">{rule.frequency}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Last Triggered */}
                  {rule.lastTriggered && (
                    <p className="text-xs text-muted-foreground">
                      Last triggered: {new Date(rule.lastTriggered).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={rule.enabled} 
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {rules.length === 0 && (
        <Card className="p-8 text-center">
          <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No auto-pay rules set up yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add rules to automatically pay recurring invoices
          </p>
          <Button className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Rule
          </Button>
        </Card>
      )}
    </div>
  );
}