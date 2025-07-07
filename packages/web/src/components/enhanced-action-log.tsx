'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard, 
  FileText, 
  Zap, 
  AlertCircle,
  DollarSign,
  Calendar,
  Bot,
  User,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface ActionLogEntry {
  id: string;
  actionTitle: string;
  actionSubtitle: string | null;
  actionType: string;
  sourceType: string;
  amount?: string | null;
  currency?: string | null;
  status: string;
  approvedAt: string;
  executedAt?: string | null;
  confidence?: number | null;
  metadata?: any;
  executionDetails?: any;
  note?: string | null;
}

export function EnhancedActionLog() {
  const { data: actions, isLoading } = api.actionLedger.getRecentActions.useQuery({
    limit: 20,
  });

  const getActionIcon = (actionType: string, status: string) => {
    switch (actionType) {
      case 'classification_auto_approved':
        return <Sparkles className="h-4 w-4 text-blue-500" />;
      case 'classification_evaluated':
        return <Bot className="h-4 w-4 text-gray-500" />;
      case 'classification_matched':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'payment_scheduled':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'payment_cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'document_uploaded':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'document_rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'expense':
        return <DollarSign className="h-4 w-4 text-orange-500" />;
      default:
        if (status === 'executed') {
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        } else if (status === 'failed') {
          return <XCircle className="h-4 w-4 text-red-500" />;
        }
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'executed':
        return <Badge className="bg-green-100 text-green-800">Executed</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActorInfo = (actionType: string, metadata?: any) => {
    if (actionType.startsWith('classification_') || actionType === 'ai_') {
      return {
        actor: 'AI',
        icon: <Bot className="h-3 w-3" />,
        details: metadata?.aiModel || 'AI Classification',
        color: 'text-blue-600',
      };
    }
    return {
      actor: 'User',
      icon: <User className="h-3 w-3" />,
      details: 'Manual Action',
      color: 'text-gray-600',
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Action Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!actions || actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Action Log</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No actions logged yet. Upload a document or connect your email to see AI decisions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Action Log
            <Badge variant="outline" className="ml-2">
              {actions.length} recent
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
                     {actions.map((action: ActionLogEntry, index: number) => {
            const actorInfo = getActorInfo(action.actionType, action.metadata);
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Timeline connector */}
                {index < actions.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-px bg-gray-200" />
                )}
                
                <div className="flex items-start gap-4">
                  {/* Action Icon */}
                  <div className="flex-shrink-0 p-2 bg-gray-50 rounded-full">
                    {getActionIcon(action.actionType, action.status)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {action.actionTitle}
                      </h4>
                      {getStatusBadge(action.status)}
                    </div>
                    
                    {action.actionSubtitle && (
                      <p className="text-sm text-gray-600">
                        {action.actionSubtitle}
                      </p>
                    )}
                    
                    {/* Amount display */}
                    {action.amount && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-3 w-3 text-green-600" />
                        <span className="font-medium">
                          {action.currency} {action.amount}
                        </span>
                      </div>
                    )}
                    
                                         {/* AI Classification Details */}
                     {action.actionType.startsWith('classification_') && action.executionDetails && 'classificationResults' in action.executionDetails && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            AI Classification Result
                          </span>
                        </div>
                        
                        {action.executionDetails.classificationResults.matched.map((rule: any, ruleIndex: number) => (
                          <div key={ruleIndex} className="text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <ArrowRight className="h-3 w-3 text-blue-500" />
                              <span className="font-medium">Rule: {rule.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {rule.confidence}% confidence
                              </Badge>
                            </div>
                            {rule.actions && rule.actions.length > 0 && (
                              <div className="ml-5 text-gray-600">
                                Actions: {rule.actions.map((a: any) => a.type).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {action.executionDetails.classificationResults.autoApproved && (
                          <div className="mt-2 flex items-center gap-2 text-green-700">
                            <CheckCircle className="h-3 w-3" />
                            <span className="text-xs font-medium">Auto-approved</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                                         {/* Payment Scheduling Details */}
                     {action.actionType === 'payment_scheduled' && action.executionDetails && 'scheduledFor' in action.executionDetails && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">
                            Payment Scheduled
                          </span>
                        </div>
                        <div className="text-sm space-y-1 text-gray-700">
                          <div>
                            <strong>Scheduled for:</strong> {new Date(action.executionDetails.scheduledFor).toLocaleDateString()}
                          </div>
                          <div>
                            <strong>Method:</strong> {action.executionDetails.paymentMethod?.toUpperCase()}
                          </div>
                          <div>
                            <strong>Delay:</strong> {action.executionDetails.delayBusinessDays} business days
                          </div>
                          {action.executionDetails.canCancel && (
                            <div className="mt-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                Cancel Payment
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Actor and timing info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                      <div className="flex items-center gap-1">
                        {actorInfo.icon}
                        <span className={actorInfo.color}>
                          {actorInfo.actor}
                        </span>
                        {action.confidence && (
                          <Badge variant="outline" className="text-xs ml-2">
                            {action.confidence}% confidence
                          </Badge>
                        )}
                      </div>
                      <span>
                        {formatDistanceToNow(new Date(action.approvedAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    {/* Note */}
                    {action.note && (
                      <div className="mt-2 text-xs text-gray-600 italic">
                        &ldquo;{action.note}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {actions.length === 20 && (
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm">
              Load More Actions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 