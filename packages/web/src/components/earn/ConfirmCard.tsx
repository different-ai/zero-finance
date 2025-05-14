'use client';

interface ConfirmCardProps {
  onFinish: () => void;
  isLoading: boolean; // Though not used in this simple version, good for consistency
}

export default function ConfirmCard({ onFinish, isLoading }: ConfirmCardProps) {
  return (
    <div className="p-4 my-4 border rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Step 3: Confirmation</h2>
      <p className="mb-4">You&apos;re all set! Your Earn module is configured.</p>
      <button 
        onClick={onFinish} 
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        disabled={isLoading} // Example usage, though current logic doesn't make it loading
      >
        {isLoading ? 'Finishing...' : 'Go to Dashboard'}
      </button>
    </div>
  );
} 