'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Building2, 
  Mail, 
  TrendingUp, 
  ChevronRight, 
  ChevronLeft,
  Check,
  ArrowRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const slides = [
  {
    id: 1,
    icon: Building2,
    title: 'Get a Virtual Bank Account',
    subtitle: 'Receive payments globally',
    description: 'Get instant USD ACH and EUR IBAN account details. Receive payments from anywhere in the world and automatically convert them to USDC on Base.',
    features: [
      'Instant account creation after KYC',
      'Real USD ACH routing & account numbers',
      'European IBAN for SEPA transfers',
      'Automatic conversion to stablecoins',
      'No monthly fees or minimums'
    ],
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-600',
    bgGradient: 'from-blue-50 to-white',
    accentColor: 'bg-blue-600',
  },
  {
    id: 2,
    icon: Mail,
    title: 'Connect Gmail for Smart Inbox',
    subtitle: 'Never miss important transactions',
    description: 'Link your email to automatically detect invoices, receipts, and payment notifications. AI processes everything into actionable cards.',
    features: [
      'One-click Gmail integration',
      'AI extracts invoice & receipt data',
      'Auto-categorize transactions',
      'Smart notifications for due payments',
      'Bulk actions for efficiency'
    ],
    color: 'from-purple-500/20 to-purple-600/20',
    iconColor: 'text-purple-600',
    bgGradient: 'from-purple-50 to-white',
    accentColor: 'bg-purple-600',
  },
  {
    id: 3,
    icon: TrendingUp,
    title: 'Your Financial Command Center',
    subtitle: 'Everything in one place',
    description: 'Use 0 Finance as your primary financial dashboard. Track balances, send payments, manage invoices, and maximize yield on idle funds.',
    features: [
      'Real-time balance tracking',
      'Send USDC payments instantly',
      'Create & manage crypto invoices',
      'Auto-earn on idle balances (coming soon)',
      'Export data for accounting'
    ],
    color: 'from-green-500/20 to-green-600/20',
    iconColor: 'text-green-600',
    bgGradient: 'from-green-50 to-white',
    accentColor: 'bg-green-600',
  },
];

interface WelcomeSlideshowProps {
  onComplete?: () => void;
  showCloseButton?: boolean;
}

export function WelcomeSlideshow({ onComplete, showCloseButton = true }: WelcomeSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const router = useRouter();

  // Auto-advance slides if user hasn't interacted
  useEffect(() => {
    if (!hasInteracted && currentSlide < slides.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
      }, 6000); // 6 seconds per slide

      return () => clearTimeout(timer);
    }
  }, [currentSlide, hasInteracted]);

  const handleNext = () => {
    setHasInteracted(true);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    setHasInteracted(true);
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Mark slideshow as completed in localStorage
    localStorage.setItem('zero-welcome-completed', 'true');
    
    if (onComplete) {
      onComplete();
    } else {
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="relative w-full max-w-4xl bg-white overflow-hidden shadow-2xl">
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={handleSkip}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 group"
            aria-label="Skip tutorial"
          >
            <X className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        )}

        {/* Slide content */}
        <div className={cn(
          "relative p-8 md:p-16 min-h-[600px] bg-gradient-to-br transition-all duration-700",
          currentSlideData.bgGradient
        )}>
          {/* Progress dots */}
          <div className="absolute top-8 left-8 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setHasInteracted(true);
                  setCurrentSlide(index);
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentSlide 
                    ? "w-12 bg-gray-800" 
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Icon and title */}
          <div className="mb-10 mt-12">
            <div className={cn(
              "inline-flex p-5 rounded-3xl bg-gradient-to-br mb-8 shadow-lg",
              currentSlideData.color
            )}>
              <currentSlideData.icon className={cn("h-10 w-10", currentSlideData.iconColor)} />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {currentSlideData.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              {currentSlideData.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-10 text-lg md:text-xl leading-relaxed max-w-3xl">
            {currentSlideData.description}
          </p>

          {/* Features list */}
          <ul className="space-y-4 mb-12">
            {currentSlideData.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className={cn(
                  "mt-1 p-1.5 rounded-full shadow-sm",
                  currentSlideData.color
                )}>
                  <Check className={cn("h-4 w-4", currentSlideData.iconColor)} />
                </div>
                <span className="text-gray-700 text-lg">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className="gap-2 px-6 py-3 text-lg"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </Button>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="hidden sm:flex px-6 py-3 text-lg"
              >
                Skip Tutorial
              </Button>
              
              <Button
                onClick={handleNext}
                className={cn(
                  "gap-2 px-6 py-3 text-lg",
                  currentSlide === slides.length - 1 && "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {currentSlide === slides.length - 1 ? (
                  <>
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 