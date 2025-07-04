'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { trpc } from '@/utils/trpc';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { user } = usePrivy();
  
  const sendFeedbackMutation = trpc.feedback.sendFeedback.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    },
    onError: (error) => {
      console.error('failed to send feedback:', error);
      // You could add toast notification here
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || !user?.email?.address) return;

    sendFeedbackMutation.mutate({
      feedback: feedback.trim(),
      userEmail: user.email.address,
    });
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">thank you for your feedback!</h3>
              <p className="text-sm text-muted-foreground">
                we appreciate your input and will use it to improve 0 finance.
              </p>
              <p className="text-xs text-muted-foreground">
                a copy has been sent to your email address.
              </p>
              <p className="text-xs text-muted-foreground">
                redirecting you back to the dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">feedback</h1>
        <p className="text-muted-foreground">
          help us improve 0 finance by sharing your thoughts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            share your feedback
          </CardTitle>
          <CardDescription>
            tell us what you love, what could be better, or any ideas you have
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="your feedback helps us build a better product..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={6}
              className="resize-none"
              autoFocus
            />
            
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                cancel
              </Button>
              <Button
                type="submit"
                disabled={!feedback.trim() || sendFeedbackMutation.isPending || !user?.email?.address}
              >
                {sendFeedbackMutation.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    send feedback
                  </>
                )}
              </Button>
            </div>
          </form>
          {!user?.email?.address && (
            <p className="text-xs text-muted-foreground mt-2">
              please ensure you have an email address associated with your account to send feedback.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 