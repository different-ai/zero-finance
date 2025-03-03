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
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background/60 backdrop-blur-sm border-purple-800/30 focus:border-purple-500"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isLoading ? "Processing..." : "Get Early Access"}
        </Button>
      </form>
      <p className="text-xs text-gray-500 mt-2 text-center">Join 300+ freelancers already on the waitlist</p>
    </div>
  );
}
export default WaitlistForm;