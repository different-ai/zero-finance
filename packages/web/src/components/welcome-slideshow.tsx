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
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const slides = [
  {
    id: 1,
    icon: Building2,
    title: 'Get a Virtual Bank Account',
    subtitle: 'Receive Payments Globally',
    description: 'Get instant USD ACH and EUR IBAN account details. Receive payments from anywhere in the world and automatically convert them to USDC on Base.',
    features: [
      'Instant account creation after KYC',
      'Real USD ACH routing & account numbers',
      'European IBAN for SEPA transfers',
      'Automatic conversion to stablecoins',
      'No monthly fees or minimums'
    ],
    color: 'from-blue-500/10 to-blue-600/20',
    iconColor: 'text-blue-600',
    bgGradient: 'from-blue-50/50 via-white to-blue-50/30',
    accentColor: 'border-blue-200',
  },
  {
    id: 2,
    icon: Mail,
    title: 'Connect Gmail for Smart Inbox',
    subtitle: 'Never Miss Important Transactions',
    description: 'Link your email to automatically detect invoices, receipts, and payment notifications. AI processes everything into actionable cards.',
    features: [
      'One-click Gmail integration',
      'AI extracts invoice & receipt data',
      'Auto-categorize transactions',
      'Smart notifications for due payments',
      'Bulk actions for efficiency'
    ],
    color: 'from-purple-500/10 to-purple-600/20',
    iconColor: 'text-purple-600',
    bgGradient: 'from-purple-50/50 via-white to-purple-50/30',
    accentColor: 'border-purple-200',
  },
  {
    id: 3,
    icon: TrendingUp,
    title: 'Your Financial Command Center',
    subtitle: 'Everything in One Place',
    description: 'Use 0 Finance as your primary financial dashboard. Track balances, send payments, manage invoices, and maximize yield on idle funds.',
    features: [
      'Real-time balance tracking',
      'Send USDC payments instantly',
      'Create & manage crypto invoices',
      'Auto-earn on idle balances (coming soon)',
      'Export data for accounting'
    ],
    color: 'from-green-500/10 to-green-600/20',
    iconColor: 'text-green-600',
    bgGradient: 'from-green-50/50 via-white to-green-50/30',
    accentColor: 'border-green-200',
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-0 duration-300">
      <Card className="relative w-full max-w-4xl bg-white overflow-hidden shadow-2xl border-0 animate-in slide-in-from-bottom-4 duration-500">
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={handleSkip}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all duration-200 z-10 hover:scale-110"
            aria-label="Skip tutorial"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}

        {/* Slide content */}
        <div className={cn(
          "relative p-8 md:p-16 min-h-[600px] bg-gradient-to-br transition-all duration-700 border-t-4",
          currentSlideData.bgGradient,
          currentSlideData.accentColor
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
                  "h-2 rounded-full transition-all duration-300 hover:scale-110",
                  index === currentSlide 
                    ? "w-8 bg-gray-800 shadow-sm" 
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Icon and title */}
          <div className="mb-12 mt-8">
            <div className={cn(
              "relative inline-flex p-5 rounded-3xl bg-gradient-to-br mb-8 shadow-lg border backdrop-blur-sm",
              currentSlideData.color,
              currentSlideData.accentColor
            )}>
              <currentSlideData.icon className={cn("h-10 w-10", currentSlideData.iconColor)} />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {currentSlideData.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              {currentSlideData.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-10 text-lg md:text-xl leading-relaxed max-w-3xl font-medium">
            {currentSlideData.description}
          </p>

          {/* Features list */}
          <div className="mb-16">
            <ul className="space-y-4">
              {currentSlideData.features.map((feature, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-4 animate-in slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={cn(
                    "mt-1 p-2 rounded-full shadow-sm border",
                    currentSlideData.color,
                    currentSlideData.accentColor
                  )}>
                    <Check className={cn("h-4 w-4", currentSlideData.iconColor)} />
                  </div>
                  <span className="text-gray-700 text-lg font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className="gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-full transition-all duration-200 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </Button>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="hidden sm:flex px-6 py-3 rounded-full border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                Skip Tutorial
              </Button>
              
              <Button
                onClick={handleNext}
                className={cn(
                  "gap-2 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 hover:scale-105",
                  currentSlide === slides.length - 1 
                    ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-green-200" 
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-200"
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