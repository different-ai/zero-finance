'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ResetWelcomePage() {
  const router = useRouter();

  const resetAndGoToWelcome = () => {
    // Clear the flag that marks welcome as completed
    localStorage.removeItem('company_name_collected');
    sessionStorage.clear();
    
    // Go to welcome page
    router.push('/welcome');
  };

  const resetAndGoToDashboard = () => {
    // Clear the flag
    localStorage.removeItem('company_name_collected');
    sessionStorage.clear();
    
    // Go to dashboard (should redirect to welcome)
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#101010]/10 rounded-[12px] p-8 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
          <h1 className="font-serif text-[28px] mb-6">Reset Welcome Flow</h1>
          <p className="text-[#101010]/60 mb-6">
            Use these buttons to test the welcome flow
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={resetAndGoToWelcome}
              className="w-full"
            >
              Clear localStorage & Go to Welcome
            </Button>
            
            <Button
              onClick={resetAndGoToDashboard}
              variant="outline"
              className="w-full"
            >
              Clear localStorage & Go to Dashboard (should redirect)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
