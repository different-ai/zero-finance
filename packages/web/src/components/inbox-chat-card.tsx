import type { InboxCardDB } from '@/db/schema';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Tag, Briefcase, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface InboxChatCardProps {
  card: InboxCardDB;
}

function formatAmount(amount: string | null | undefined, currency: string | null | undefined) {
    if (!amount || !currency) return null;
    try {
        const numberAmount = parseFloat(amount);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(numberAmount);
    } catch (e) {
        return `${amount} ${currency}`;
    }
}

export function InboxChatCard({ card }: InboxChatCardProps) {
  const formattedAmount = formatAmount(card.amount, card.currency);

  return (
    <Card className="my-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">{card.title}</CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {card.subtitle}
                </CardDescription>
            </div>
            {formattedAmount && (
                 <Badge variant="secondary" className="text-sm font-bold">
                    {formattedAmount}
                 </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <div className="flex items-center space-x-2">
            <Briefcase className="h-3 w-3 text-slate-400"/>
            <span>From: <strong>{card.fromEntity}</strong></span>
        </div>
         <div className="flex items-center space-x-2">
            <FileText className="h-3 w-3 text-slate-400"/>
            <span>Type: <Badge variant="outline" className="text-xs">{card.sourceType}</Badge></span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 py-2 px-4">
        <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3"/>
            <span>{formatDistanceToNow(new Date(card.timestamp), { addSuffix: true })}</span>
        </div>
        {card.requiresAction && (
          <Button size="sm" variant="ghost" className="text-xs">
            {card.suggestedActionLabel || 'View Action'} <ArrowRight className="h-3 w-3 ml-1"/>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 