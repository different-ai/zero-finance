'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner'; // Assuming sonner for toasts, adjust if different
import { Wallet, Loader2 } from 'lucide-react';
// Assuming posthog is initialized elsewhere and available globally or via context
// import posthog from 'posthog-js'; 

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return; // Basic validation
    setIsLoading(true);

    try {
      // Assuming posthog is available
      // posthog?.identify(email); // Optional: Identify the user
      
      const formBody = `email=${encodeURIComponent(email)}`; // Removed mailingLists hardcoding, Loops likely handles list association via form ID
      
      // Using the specific Loops endpoint provided by user
      const response = await fetch("https://app.loops.so/api/newsletter-form/cm2uk2jop01mmhkoglglypkme", {
        method: "POST",
        body: formBody,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Track successful signup
        // posthog?.capture('waitlist_signup_submitted', {
        //   email: email, // Avoid PII if possible, maybe use a hash or just track the event
        //   source: 'landing_page_form'
        // });
        
        toast.success("You're on the list!", {
          description: "We'll notify you when we launch.",
        });
        setEmail('');
      } else {
        throw new Error(data.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      // Track failed signup
      // posthog?.capture('waitlist_signup_error', {
      //   error: error instanceof Error ? error.message : 'Unknown error'
      // });
      
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Apply design system: clean bg, subtle border, rounded corners */}
      <div className="bg-white border border-gray-100/80 rounded-lg shadow-sm p-6"> 
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex-1 relative">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              // Apply design system: Standard input height, clean border, appropriate padding
              className="h-11 w-full border-gray-200 focus-visible:ring-gray-400" 
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !email}
            // Apply design system: Black primary CTA, standard height, subtle transition
            className="bg-gray-900 text-white hover:bg-gray-800 h-11 px-5 py-2 whitespace-nowrap transition-colors"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
        {/* Apply design system: Subtle secondary text */}
        <p className="text-xs text-gray-500 mt-3 text-center font-medium">
          Stay tuned for updates.
        </p>
      </div>
    </div>
  );
} 