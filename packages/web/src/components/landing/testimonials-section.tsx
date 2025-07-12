'use client';

import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  metrics?: {
    label: string;
    value: string;
  };
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Freelance Designer',
    company: 'Chen Creative Studio',
    content: "0 finance completely transformed how I handle my business finances. I used to spend 2-3 hours every week on invoicing and payment tracking. Now it's all automated, and I can focus on what I love - designing.",
    rating: 5,
    avatar: 'SC',
    metrics: {
      label: 'Time saved per month',
      value: '12+ hours'
    }
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Marketing Consultant',
    company: 'Growth Labs',
    content: "The AI-powered expense categorization is incredible. My quarterly tax prep went from a nightmare to a 5-minute review. The high-yield vault has also earned me an extra $2,400 this year on idle cash.",
    rating: 5,
    avatar: 'MR',
    metrics: {
      label: 'Extra earnings this year',
      value: '$2,400+'
    }
  },
  {
    id: '3',
    name: 'Emma Thompson',
    role: 'Content Creator',
    company: 'Thompson Media',
    content: "Having a global USD account has been game-changing for my international clients. Payments that used to take 5-7 days now arrive instantly. The automated invoicing saves me hours every month.",
    rating: 5,
    avatar: 'ET',
    metrics: {
      label: 'Faster payments',
      value: 'Instant vs 5-7 days'
    }
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Software Developer',
    company: 'Kim Development',
    content: "I was skeptical about AI handling my finances, but 0 finance has been incredibly accurate. The expense tracking and tax categorization are spot-on, and I love earning yield on my business savings.",
    rating: 5,
    avatar: 'DK',
    metrics: {
      label: 'Accuracy rate',
      value: '99.8%'
    }
  },
  {
    id: '5',
    name: 'Lisa Wang',
    role: 'Digital Agency Owner',
    company: 'Pixel Perfect Agency',
    content: "Managing cash flow for multiple clients used to be chaotic. 0 finance's automated sweep feature ensures our idle cash is always working for us. We've earned an extra 6% APY on our reserves.",
    rating: 5,
    avatar: 'LW',
    metrics: {
      label: 'APY on reserves',
      value: '6.2%'
    }
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#0040FF]/5 to-[#DDE0F2]/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
            Loved by thousands of businesses
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-medium text-[#5a6b91] max-w-3xl mx-auto px-4">
            See how 0 finance is helping businesses save time, earn more, and simplify their financial operations
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0040FF] mb-1">
              $50M+
            </div>
            <div className="text-sm sm:text-base text-[#5a6b91]">
              Processed
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0040FF] mb-1">
              2,500+
            </div>
            <div className="text-sm sm:text-base text-[#5a6b91]">
              Happy Users
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0040FF] mb-1">
              15hrs
            </div>
            <div className="text-sm sm:text-base text-[#5a6b91]">
              Saved Monthly
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0040FF] mb-1">
              6.2%
            </div>
            <div className="text-sm sm:text-base text-[#5a6b91]">
              Avg APY
            </div>
          </div>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8 sm:p-12">
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-[#0040FF]/10 rounded-full flex items-center justify-center">
                  <Quote className="w-6 h-6 text-[#0040FF]" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-[#0f1e46] text-center mb-8 leading-relaxed">
                &ldquo;{currentTestimonial.content}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0040FF] to-[#0040FF]/80 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                  {currentTestimonial.avatar}
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-semibold text-[#0f1e46] text-lg">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-[#5a6b91]">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </div>
                </div>
              </div>

              {/* Metric */}
              {currentTestimonial.metrics && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-[#0040FF]/10 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-[#5a6b91]">
                      {currentTestimonial.metrics.label}:
                    </span>
                    <span className="text-sm font-bold text-[#0040FF]">
                      {currentTestimonial.metrics.value}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full p-0 border-[#0040FF]/20 hover:bg-[#0040FF]/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-[#0040FF] w-6'
                          : 'bg-[#0040FF]/30 hover:bg-[#0040FF]/50'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full p-0 border-[#0040FF]/20 hover:bg-[#0040FF]/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-sm sm:text-base text-[#5a6b91] mb-4">
            Trusted by businesses in 50+ countries
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 opacity-60">
            {/* Placeholder for company logos */}
            <div className="text-xs sm:text-sm font-medium text-[#5a6b91] bg-white/50 px-3 py-1 rounded-full">
              Y Combinator
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#5a6b91] bg-white/50 px-3 py-1 rounded-full">
              Techstars
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#5a6b91] bg-white/50 px-3 py-1 rounded-full">
              500 Startups
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#5a6b91] bg-white/50 px-3 py-1 rounded-full">
              Andreessen Horowitz
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 