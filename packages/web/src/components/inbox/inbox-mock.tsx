'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  FileText, 
  Clock, 
  DollarSign, 
  Lock, 
  Sparkles, 
  TrendingUp,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';

// Mock data for the preview
const mockInboxCards = [
  {
    id: '1',
    title: 'Monthly Software Invoice',
    subtitle: 'Adobe Creative Cloud',
    amount: '$52.99',
    confidence: 95,
    status: 'pending',
    timestamp: '2 hours ago',
    type: 'invoice',
  },
  {
    id: '2',
    title: 'Office Supplies Receipt',
    subtitle: 'Staples Order #12345',
    amount: '$127.43',
    confidence: 88,
    status: 'pending',
    timestamp: '1 day ago',
    type: 'receipt',
  },
  {
    id: '3',
    title: 'Utility Bill',
    subtitle: 'Electric Company',
    amount: '$89.20',
    confidence: 92,
    status: 'processed',
    timestamp: '3 days ago',
    type: 'bill',
  },
];

const features = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'AI-Powered Detection',
    description: 'Automatically find invoices, receipts, and bills in your emails',
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: 'Smart Categorization',
    description: 'Organize expenses by vendor, amount, and frequency',
  },
  {
    icon: <CheckCircle className="h-5 w-5" />,
    title: 'Bulk Actions',
    description: 'Process multiple items at once with smart bulk operations',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Export & Reports',
    description: 'Generate CSV exports and detailed financial reports',
  },
];

export function InboxMock() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-100/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="relative">
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
              Inbox
            </h1>
            <Lock className="h-6 w-6 text-amber-500" />
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            AI-powered financial document processing for your inbox
          </p>
          
          {/* Preview Badge */}
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm">
            <Star className="h-4 w-4 mr-1" />
            Premium Feature Preview
          </Badge>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20" />
            <CardHeader className="relative pb-2">
              <CardDescription>Pending Items</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <div className="blur-sm">12</div>
                <Lock className="h-4 w-4 text-amber-500" />
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" />
            <CardHeader className="relative pb-2">
              <CardDescription>Processed Today</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <div className="blur-sm">8</div>
                <Lock className="h-4 w-4 text-amber-500" />
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20" />
            <CardHeader className="relative pb-2">
              <CardDescription>Total Amount</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <div className="blur-sm">$2,341</div>
                <Lock className="h-4 w-4 text-amber-500" />
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20" />
            <CardHeader className="relative pb-2">
              <CardDescription>Accuracy</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <div className="blur-sm">94%</div>
                <Lock className="h-4 w-4 text-amber-500" />
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Preview Cards */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Preview: Inbox Items
                  <Badge variant="secondary">Demo</Badge>
                </CardTitle>
                <CardDescription>
                  See how AI automatically detects and categorizes your financial documents
                </CardDescription>
              </div>
              <Lock className="h-6 w-6 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInboxCards.map((card) => (
                <div
                  key={card.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    hoveredCard === card.id
                      ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-950/10'
                      : 'border-neutral-200 dark:border-neutral-800'
                  } ${card.status === 'processed' ? 'opacity-60' : ''}`}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {card.type === 'invoice' && <FileText className="h-5 w-5 text-blue-600" />}
                        {card.type === 'receipt' && <FileText className="h-5 w-5 text-green-600" />}
                        {card.type === 'bill' && <DollarSign className="h-5 w-5 text-orange-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{card.title}</h3>
                          <Badge 
                            variant={card.status === 'pending' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {card.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{card.subtitle}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {card.timestamp}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {card.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">{card.amount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Unlock Your AI-Powered Inbox
              </h2>
              <p className="text-muted-foreground">
                Get unlimited access to intelligent document processing, auto-categorization, and advanced analytics
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="https://buy.polar.sh/polar_cl_FJM7jQ61Kj8vMDH4H1KrcsGdstxyeozSXdgvc2FL0yb"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Access Now
                </Button>
              </Link>
              
              <div className="text-sm text-muted-foreground">
                One-time purchase • Lifetime access
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 