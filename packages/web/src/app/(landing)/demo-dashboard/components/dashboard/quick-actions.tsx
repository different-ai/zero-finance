'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Upload, 
  Calendar, 
  MessageSquare, 
  FileText,
  Send,
  RefreshCw,
  Wallet,
  TrendingUp,
  Globe
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  highlight?: boolean;
}

interface QuickActionsProps {
  onActionClick?: (action: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'send-payment',
      title: 'Send Payment',
      description: 'Pay suppliers instantly',
      icon: <Send className="w-6 h-6" />,
      onClick: () => onActionClick?.('send-payment'),
      highlight: true,
    },
    {
      id: 'convert',
      title: 'Convert Currency',
      description: 'Best FX rates',
      icon: <RefreshCw className="w-6 h-6" />,
      onClick: () => onActionClick?.('convert'),
    },
    {
      id: 'create-invoice',
      title: 'Create Invoice',
      description: 'Get paid in crypto',
      icon: <FileText className="w-6 h-6" />,
      onClick: () => onActionClick?.('create-invoice'),
    },
    {
      id: 'schedule-payment',
      title: 'Schedule Payment',
      description: 'Automate payments',
      icon: <Calendar className="w-6 h-6" />,
      onClick: () => onActionClick?.('schedule-payment'),
    },
    {
      id: 'upload-invoice',
      title: 'Upload Invoice',
      description: 'AI data extraction',
      icon: <Upload className="w-6 h-6" />,
      onClick: () => onActionClick?.('upload-invoice'),
    },
    {
      id: 'ai-cfo',
      title: 'Ask AI CFO',
      description: 'Financial insights',
      icon: <MessageSquare className="w-6 h-6" />,
      onClick: () => onActionClick?.('ai-cfo'),
    },
  ];

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`
                p-4 rounded-lg transition-all text-left
                ${action.highlight 
                  ? 'bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300' 
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                }
                hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              <div className={`mb-2 ${action.highlight ? 'text-blue-600' : 'text-gray-600'}`}>
                {action.icon}
              </div>
              <p className={`font-medium text-sm ${action.highlight ? 'text-blue-900' : 'text-gray-900'}`}>
                {action.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}