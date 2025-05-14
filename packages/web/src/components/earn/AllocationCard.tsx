'use client';

interface AllocationCardProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  isLoading: boolean;
}

export default function AllocationCard(
  { value, onChange, onNext, isLoading }: AllocationCardProps
) {
  return (
    <div className="p-4 my-4 border rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Step 2: Set Allocation</h2>
      <p className="mb-4">Choose the percentage of your funds to allocate to earning.</p>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full mb-2"
        disabled={isLoading}
      />
      <p className="text-center mb-4">{value}%</p>
      <button 
        onClick={onNext} 
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {isLoading ? 'Saving...' : 'Set Allocation & Next'}
      </button>
    </div>
  );
} 