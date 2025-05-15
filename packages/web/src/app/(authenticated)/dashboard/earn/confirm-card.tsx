'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfirmCardProps {
  onFinish: () => void;
  isLoading: boolean;
  allocation: number;
}

export default function ConfirmCard({ onFinish, isLoading, allocation }: ConfirmCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">All Set!</h2>
        <p className="text-gray-600">
          Your auto-earn feature is now configured and ready to go.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">Your Configuration</h3>
        <div className="flex justify-between items-center">
          <span>Allocation percentage:</span>
          <span className="font-bold text-blue-600">{allocation}%</span>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• We&apos;ll silently sweep {allocation}% of every incoming dollar into a yield vault</li>
          <li>• Your funds remain in your control at all times</li>
          <li>• You&apos;ll see your earning balance and current APY on the dashboard</li>
          <li>• Activity timeline will show all sweep events</li>
        </ul>
      </div>

      <div className="mt-6 flex justify-center">
        <Button 
          onClick={onFinish} 
          disabled={isLoading} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
        >
          {isLoading ? 'Loading...' : 'Go to Dashboard'}
        </Button>
      </div>
    </motion.div>
  );
} 