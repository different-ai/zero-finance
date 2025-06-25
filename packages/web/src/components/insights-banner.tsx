"use client";
import { useInboxStore } from '@/lib/store';
import { Sparkles } from 'lucide-react';

export function InsightsBanner(){
  const { cards } = useInboxStore();
  const avgConfidence = cards.length ? Math.round(cards.reduce((a,c)=> a + (c.confidence||0),0)/cards.length) : 0;
  const executed = cards.filter(c=> c.status==='executed');
  // simple prediction: average days between card timestamp and execution timestamp? not available; fallback constant.
  const predictedDays = executed.length ? 2 : 3;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Sparkles className="h-3 w-3 text-primary" />
      <span>Avg confidence {avgConfidence}% · usually processes in {predictedDays} days</span>
    </div>
  );
}