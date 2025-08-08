'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Building2, 
  ChevronRight, 
  ChevronLeft,
  Check,
  ArrowRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    icon: Building2,
    title: 'Getting started',
    subtitle: 'Do the essentials in minutes',
    description:
      'Set up your business and banking. Pick what you need now — you can always come back later.',
    features: [],
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-600',
    bgGradient: 'from-blue-50 to-white',
    accentColor: 'bg-blue-600',
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <Card className="relative w-full max-w-4xl bg-white overflow-hidden shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 group"
            aria-label="Skip tutorial"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        )}

        {/* Slide content */}
        <div className={cn(
          "relative p-4 sm:p-8 md:p-16 min-h-[500px] sm:min-h-[600px] bg-gradient-to-br transition-all duration-700",
          currentSlideData.bgGradient
        )}>
          {/* Progress dots */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex gap-2 sm:gap-3">
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
                    ? "w-8 sm:w-12 bg-gray-800" 
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Icon and title */}
          <div className="mb-6 sm:mb-10 mt-8 sm:mt-12">
            <div className={cn(
              "inline-flex p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br mb-4 sm:mb-8 shadow-lg",
              currentSlideData.color
            )}>
              <currentSlideData.icon className={cn("h-8 w-8 sm:h-10 sm:w-10", currentSlideData.iconColor)} />
            </div>
            
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight">
              {currentSlideData.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium">
              {currentSlideData.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 sm:mb-10 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl">
            {currentSlideData.description}
          </p>

          {/* Quick actions */}
          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Set up company */}
              <div className="rounded-xl border border-gray-200 bg-white/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">Set up your company</p>
                    <p className="text-sm text-gray-600 mt-1">Add your legal entity, address, and branding. Enables compliant invoicing and payouts.</p>
                  </div>
                  <Button asChild className="shrink-0" variant="outline">
                    <Link href="/dashboard/settings/company">Set up</Link>
                  </Button>
                </div>
              </div>

              {/* Create virtual account */}
              <div className="rounded-xl border border-gray-200 bg-white/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">Create virtual account</p>
                    <p className="text-sm text-gray-600 mt-1">Get USD ACH and EUR IBAN details to receive fiat. Auto-convert to USDC on Base.</p>
                  </div>
                  <Button asChild className="shrink-0" variant="outline">
                    <Link href="/dashboard/settings/virtual-accounts">Create</Link>
                  </Button>
                </div>
              </div>

              {/* Create your first invoice */}
              <div className="rounded-xl border border-gray-200 bg-white/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">Create your first invoice</p>
                    <p className="text-sm text-gray-600 mt-1">Generate a professional invoice with your company details and get paid in USDC.</p>
                  </div>
                  <Button asChild className="shrink-0" variant="outline">
                    <Link href="/dashboard/create-invoice">Create</Link>
                  </Button>
                </div>
              </div>

              {/* Earn on idle cash (single) */}
              <div className="rounded-xl border border-gray-200 bg-white/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">Earn on idle cash</p>
                    <p className="text-sm text-gray-600 mt-1">Put unused balances to work with transparent, crypto-native strategies.</p>
                  </div>
                  <Button asChild className="shrink-0" variant="outline">
                    <Link href="/dashboard/earn">Explore</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className="gap-2 px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg order-2 sm:order-1"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              Previous
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg sm:hidden"
              >
                Skip Tutorial
              </Button>
              
              <Button
                onClick={handleNext}
                className={cn(
                  "gap-2 px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg",
                  currentSlide === slides.length - 1 && "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {currentSlide === slides.length - 1 ? (
                  <>
                    Get Started
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSkip}
                className="hidden sm:flex px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg"
              >
                Skip Tutorial
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 