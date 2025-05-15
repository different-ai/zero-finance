'use client';

// Assuming SweepEvent is defined and imported
interface SweepEvent {
  id: string;
  timestamp: string; 
  amount: string;    // Assuming this is a string representing a large number
  currency: string;  
  apyAtTime: number; 
  status: 'success' | 'pending' | 'failed';
  txHash?: string;   
  failureReason?: string;
}

interface ActivityProps {
  events: SweepEvent[];
}

// Helper to format large string numbers (like amount) to a more readable format
const formatAmount = (amountStr: string, decimals: number = 6): string => {
  try {
    const amountBigInt = BigInt(amountStr);
    const divisor = BigInt(10 ** decimals);
    const integerPart = amountBigInt / divisor;
    const fractionalPart = amountBigInt % divisor;
    return `${integerPart.toString()}.${fractionalPart.toString().padStart(decimals, '0').slice(0, 2)}`;
  } catch (e) {
    console.error("Error formatting amount:", e);
    return "N/A";
  }
};

export default function Activity({ events }: ActivityProps) {
  if (!events || events.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Activity</h2>
        <p className="text-gray-500">No earn activity yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
      <ul className="space-y-3">
        {events.slice(0, 5).map((event) => ( // Show latest 5 events
          <li key={event.id} className="p-3 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {event.status === 'success' ? 'Funds Swept' : 
                   event.status === 'pending' ? 'Sweep Pending' : 'Sweep Failed'}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleString()} - APY: {event.apyAtTime.toFixed(2)}%
                </p>
              </div>
              <div className={`text-right ${event.status === 'failed' ? 'text-red-500' : 'text-green-500'}`}>
                <p className="font-semibold">{formatAmount(event.amount)} {event.currency}</p>
                {event.txHash && 
                  <a 
                    href={`https://basescan.org/tx/${event.txHash}`} // Example link, adjust for actual explorer
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View Tx
                  </a>
                }
                {event.status === 'failed' && event.failureReason &&
                  <p className="text-xs text-red-400">{event.failureReason}</p>
                }
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 