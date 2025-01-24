'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import posthog from 'posthog-js';

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
          source: 'landing_page'
        });
        
        toast({
          title: "Thanks for joining!",
          description: "We'll keep you updated on our progress.",
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
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm mx-auto space-x-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-background/60 backdrop-blur-sm"
      />
      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-[#6E45FE] hover:bg-[#5835DB] text-white"
      >
        {isLoading ? "Joining..." : "Join Waitlist"}
      </Button>
    </form>
  );
}
export default WaitlistForm;