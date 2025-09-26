'use client';

import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AllocationSliderProps {
  id?: string;
  percentage: number;
  onPercentageChange: (newPercentage: number) => void;
  accentColor?: string;
}

export default function AllocationSliderComponent({
  id,
  percentage,
  onPercentageChange,
  accentColor = '#0050ff', // Changed to app's primary blue
}: AllocationSliderProps) {
  const handleSliderChange = (newValue: number[]) => {
    onPercentageChange(newValue[0]);
  };

  const isAggressive = percentage > 50;

  return (
    <div className="px-1 py-3">
      <style jsx global>{`
        .custom-themed-slider
          .relative.flex.w-full.touch-none.select-none.items-center {
          height: 1.25rem; /* Increased height for easier interaction */
        }
        .custom-themed-slider
          .relative.flex.w-full.touch-none.select-none.items-center
          > .absolute.h-full {
          /* Track */
          background-color: #e5e7eb !important; /* Tailwind gray-200 for track background */
          height: 0.375rem !important; /* 6px */
          border-radius: 0.125rem !important; /* Slightly rounded track */
        }
        .custom-themed-slider
          .relative.flex.w-full.touch-none.select-none.items-center
          > span
          > .absolute.h-full {
          /* Range */
          background-color: ${accentColor} !important;
          border-radius: 0.125rem !important; /* Slightly rounded range */
        }
        .custom-themed-slider
          .relative.flex.w-full.touch-none.select-none.items-center
          > span
          > .block.h-5.w-5 {
          /* Thumb */
          height: 1.25rem !important; /* 20px */
          width: 1.25rem !important; /* 20px */
          background-color: white !important;
          border: 3px solid ${accentColor} !important;
          box-shadow:
            0 2px 6px rgba(0, 0, 0, 0.1),
            0 0 0 3px white !important; /* Ring effect + subtle shadow */
          cursor: grab;
          transition: transform 0.1s ease-out;
        }
        .custom-themed-slider
          .relative.flex.w-full.touch-none.select-none.items-center
          > span
          > .block.h-5.w-5:active {
          cursor: grabbing;
          transform: scale(1.1);
        }
        .custom-themed-slider
          .relative.flex.w-full.touch-none.select-none.items-center
          > span
          > .block.h-5.w-5:focus-visible {
          outline: 3px solid ${accentColor}33; /* Lighter blue for focus ring */
          outline-offset: 2px;
        }
      `}</style>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Slider
              id={id}
              value={[percentage]}
              max={100} // Max percentage
              step={5} // Snap to 5% increments
              onValueChange={handleSliderChange}
              className="custom-themed-slider w-full"
            />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="bg-deep-navy text-white text-xs rounded-md shadow-lg"
          >
            <p>{percentage}% Allocation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex justify-between text-xs mt-3 px-1 text-deep-navy/60">
        <span>0%</span>
        <span className={isAggressive ? 'font-semibold text-primary' : ''}>
          100%
        </span>
      </div>
    </div>
  );
}
