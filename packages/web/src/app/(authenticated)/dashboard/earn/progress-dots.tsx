'use client';

interface ProgressDotsProps {
  currentStep: string;
  steps: string[];
}

export default function ProgressDots({ currentStep, steps }: ProgressDotsProps) {
  const currentIndex = steps.indexOf(currentStep);
  return (
    <div className="flex justify-center space-x-2 my-4">
      {steps.map((step, index) => (
        <div 
          key={step}
          className={`w-3 h-3 rounded-full ${index <= currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
} 