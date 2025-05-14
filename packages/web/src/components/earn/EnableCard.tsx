'use client';

interface EnableCardProps {
  onNext: () => void;
  isLoading: boolean;
}

export default function EnableCard({ onNext, isLoading }: EnableCardProps) {
  return (
    <div className="p-4 my-4 border rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Step 1: Enable Earn Module</h2>
      <p className="mb-4">Allow the system to start earning yield on your allocated funds.</p>
      <button 
        onClick={onNext} 
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {isLoading ? 'Enabling...' : 'Enable Earn'}
      </button>
    </div>
  );
} 