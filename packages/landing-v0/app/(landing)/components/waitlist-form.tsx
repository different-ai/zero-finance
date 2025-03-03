'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import posthog from 'posthog-js';
import { Wallet } from 'lucide-react';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formBody = `email=${encodeURIComponent(email)}&mailingLists=cm2uk2jop01mmhkoglglypkme`;
      
      const response = await fetch("https://app.loops.so/api/newsletter-form/cm2uk2jop01mmhkoglglypkme", {
        method: "POST",
        body: formBody,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await response.json();

      if (data.success) {
        // Track successful signup
        posthog.capture('waitlist_signup', {
          email: email,
          source: 'crypto_bank_landing'
        });
        
        toast({
          title: "You're on the list!",
          description: "We'll notify you when your crypto bank account is ready.",
        });
        setEmail('');
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      // Track failed signup
      posthog.capture('waitlist_signup_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="digital-effect py-4 px-5 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-3 w-full">
          <div className="flex-1 relative">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="nostalgic-input h-12 w-full border-2 bg-white/90"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="nostalgic-button text-white font-medium px-5 py-2 h-12 whitespace-nowrap"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isLoading ? "Processing..." : "Join Waitlist"}
          </Button>
        </form>
        <p className="text-xs text-secondary mt-3 text-center font-medium">
          Join 300+ freelancers already on the waitlist
        </p>
      </div>
    </div>
  );
}
export default WaitlistForm;