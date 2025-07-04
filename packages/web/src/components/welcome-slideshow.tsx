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
    title: 'get a virtual bank account',
    subtitle: 'receive payments globally',
    description: 'get instant usd ach and eur iban account details. receive payments from anywhere in the world and automatically convert them to usdc on base.',
    features: [
      'instant account creation after kyc',
      'real usd ach routing & account numbers',
      'european iban for sepa transfers',
      'automatic conversion to stablecoins',
      'no monthly fees or minimums'
    ],
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-600',
    bgGradient: 'from-blue-50 to-white',
  },
  {
    id: 2,
    icon: Mail,
    title: 'connect gmail for smart inbox',
    subtitle: 'never miss important transactions',
    description: 'link your email to automatically detect invoices, receipts, and payment notifications. ai processes everything into actionable cards.',
    features: [
      'one-click gmail integration',
      'ai extracts invoice & receipt data',
      'auto-categorize transactions',
      'smart notifications for due payments',
      'bulk actions for efficiency'
    ],
    color: 'from-purple-500/20 to-purple-600/20',
    iconColor: 'text-purple-600',
    bgGradient: 'from-purple-50 to-white',
  },
  {
    id: 3,
    icon: TrendingUp,
    title: 'your financial command center',
    subtitle: 'everything in one place',
    description: 'use 0 finance as your primary financial dashboard. track balances, send payments, manage invoices, and maximize yield on idle funds.',
    features: [
      'real-time balance tracking',
      'send usdc payments instantly',
      'create & manage crypto invoices',
      'auto-earn on idle balances (coming soon)',
      'export data for accounting'
    ],
    color: 'from-green-500/20 to-green-600/20',
    iconColor: 'text-green-600',
    bgGradient: 'from-green-50 to-white',
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="relative w-full max-w-3xl bg-white overflow-hidden">
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
            aria-label="Skip tutorial"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}

        {/* Slide content */}
        <div className={cn(
          "relative p-8 md:p-12 min-h-[500px] bg-gradient-to-br transition-all duration-500",
          currentSlideData.bgGradient
        )}>
          {/* Progress dots */}
          <div className="absolute top-8 left-8 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setHasInteracted(true);
                  setCurrentSlide(index);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentSlide 
                    ? "w-8 bg-gray-800" 
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Icon and title */}
          <div className="mb-8 mt-8">
            <div className={cn(
              "inline-flex p-4 rounded-2xl bg-gradient-to-br mb-6",
              currentSlideData.color
            )}>
              <currentSlideData.icon className={cn("h-8 w-8", currentSlideData.iconColor)} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {currentSlideData.title}
            </h2>
            <p className="text-xl text-gray-600">
              {currentSlideData.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-8 text-lg leading-relaxed max-w-2xl">
            {currentSlideData.description}
          </p>

          {/* Features list */}
          <ul className="space-y-3 mb-12">
            {currentSlideData.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5 p-1 rounded-full",
                  currentSlideData.color
                )}>
                  <Check className={cn("h-4 w-4", currentSlideData.iconColor)} />
                </div>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              previous
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="hidden sm:flex"
              >
                skip tutorial
              </Button>
              
              <Button
                onClick={handleNext}
                className={cn(
                  "gap-2",
                  currentSlide === slides.length - 1 && "bg-green-600 hover:bg-green-700"
                )}
              >
                {currentSlide === slides.length - 1 ? (
                  <>
                    get started
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    next
                    <ChevronRight className="h-4 w-4" />
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