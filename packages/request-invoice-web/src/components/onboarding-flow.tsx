'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, ArrowRight, Check, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { addresses } from '@/app/api/wallet/addresses-store';
import { ethers } from 'ethers';

// Define onboarding steps
const STEPS = {
  WELCOME: 0,
  PAYMENT_ADDRESS: 1,
  PLATFORM_INFO: 2,
  COMPLETE: 3,
};

export function OnboardingFlow() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [customAddress, setCustomAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if onboarding is needed
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const response = await fetch('/api/user/onboarding');
        const data = await response.json();
        
        if (!data.hasCompletedOnboarding) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    
    checkOnboarding();
  }, []);
  
  // We don't set default addresses - users must input their own
  // Removing the automatic address selection as we don't own these wallets

  // This function was removed to prevent re-render loops

  // Helper function to check if an address is valid without causing re-render loops
  const isValidAddress = (address: string): boolean => {
    if (!address || !address.trim()) {
      return false;
    }
    return ethers.utils.isAddress(address);
  };
  
  // Handle completion of onboarding
  const completeOnboarding = async () => {
    // Users must provide their own address
    const finalAddress = customAddress;
    
    if (!isValidAddress(finalAddress)) {
      setAddressError('Invalid Ethereum address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          paymentAddress: finalAddress,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }
      
      setCurrentStep(STEPS.COMPLETE);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle closing the onboarding dialog
  const closeOnboarding = () => {
    setIsOpen(false);
    
    // If we're on the complete step, redirect to create invoice
    if (currentStep === STEPS.COMPLETE) {
      router.push('/create-invoice');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Welcome to hyprsqrl</h2>
          {currentStep !== STEPS.COMPLETE && (
            <button 
              onClick={closeOnboarding}
              className="text-white/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Stepper */}
        <div className="px-6 py-3 bg-blue-50 border-b">
          <div className="flex items-center">
            {[STEPS.WELCOME, STEPS.PAYMENT_ADDRESS, STEPS.PLATFORM_INFO, STEPS.COMPLETE].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">
                    {step === STEPS.WELCOME && 'Welcome'}
                    {step === STEPS.PAYMENT_ADDRESS && 'Payment'}
                    {step === STEPS.PLATFORM_INFO && 'Info'}
                    {step === STEPS.COMPLETE && 'Complete'}
                  </span>
                </div>
                {step < STEPS.COMPLETE && (
                  <div className={`flex-1 h-[1px] mx-2 ${
                    currentStep > step ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Step 1: Welcome */}
          {currentStep === STEPS.WELCOME && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Welcome to hyprsqrl!</h3>
              <p className="mb-4">
                We'll help you get set up with a few quick steps so you can start creating invoices
                and receiving payments in cryptocurrency.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-blue-800 mb-2">What you'll be able to do:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Create and send crypto invoices in seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Receive payments in EURe on Gnosis Chain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Manage all your invoices in one place</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-sm text-gray-600 mb-6">
                <p>
                  Currently, hyprsqrl is in early access and supports crypto payments only.
                  We're working on adding fiat payments, multi-chain support, and more features soon!
                </p>
              </div>
            </div>
          )}
          
          {/* Step 2: Payment Address Setup */}
          {currentStep === STEPS.PAYMENT_ADDRESS && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Set Your Payment Address</h3>
              <p className="mb-4">
                Your payment address is where you'll receive crypto payments from your invoices.
                This address must be on the Gnosis Chain for EURe payments.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg mb-4 text-blue-800 text-sm">
                  <p className="font-medium mb-2">Important</p>
                  <p>You need to provide your own wallet address on Gnosis Chain to receive payments.</p>
                  <p className="mt-1">This address will receive all EURe payments from your invoices.</p>
                </div>
                
                {/* Wallet address input */}
                <div className="border rounded-lg p-4">
                  <label htmlFor="wallet-address-input" className="block font-medium mb-2">Your Gnosis Chain Wallet Address</label>
                  <input
                    id="wallet-address-input"
                    type="text"
                    value={customAddress || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setCustomAddress(newValue);
                      
                      // Don't call validateAddress here - it causes re-render loops
                      // Instead, just set the error message directly
                      if (!newValue.trim()) {
                        setAddressError('');
                      } else if (!ethers.utils.isAddress(newValue)) {
                        setAddressError('Invalid Ethereum address');
                      } else {
                        setAddressError('');
                      }
                    }}
                    placeholder="0x..."
                    className={`w-full p-2 border rounded-md font-mono text-sm ${
                      addressError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {addressError && (
                    <p className="text-sm text-red-500 mt-1">{addressError}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    This must be a valid Ethereum address on the Gnosis Chain network.
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800 mb-6">
                <strong>Note:</strong> If you don't have a Gnosis Chain wallet yet, you can create one using MetaMask 
                or other compatible wallets and add the Gnosis Chain network.
              </div>
            </div>
          )}
          
          {/* Step 3: Platform Information */}
          {currentStep === STEPS.PLATFORM_INFO && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Platform Information</h3>
              
              <div className="space-y-6 mb-6">
                <div>
                  <h4 className="font-medium text-lg mb-2">Current Capabilities</h4>
                  <p className="mb-3">
                    hyprsqrl currently supports:
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Creating and sending crypto invoices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Receiving payments in EURe on Gnosis Chain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Managing invoices through a simple dashboard</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-lg mb-2 text-blue-800">ScreenPipe Integration</h4>
                  <p className="mb-3">
                    To enhance your invoice creation experience, you can optionally use ScreenPipe:
                  </p>
                  <ul className="space-y-2 mb-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>ScreenPipe helps pre-fill invoice information from your screen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>It's completely optional but enhances your experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Simply paste email text into chat to extract invoice details</span>
                    </li>
                  </ul>
                  <Link 
                    href="https://screenpi.pe" 
                    target="_blank"
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Download ScreenPipe <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </div>
                
                <div>
                  <h4 className="font-medium text-lg mb-2">Coming Soon</h4>
                  <p className="mb-3">
                    We're actively working on:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-blue-500 text-xs">→</span>
                      </div>
                      <span>Fiat integration with Monerium for IBAN connectivity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-blue-500 text-xs">→</span>
                      </div>
                      <span>AI-powered insights with enhanced automation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-blue-500 text-xs">→</span>
                      </div>
                      <span>Multi-chain support for more cryptocurrencies</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link 
                  href="https://hyprsqrl.com/roadmap" 
                  target="_blank"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                  View Full Roadmap <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
                <Link 
                  href="https://github.com/different-ai/hypr-v0/issues/new" 
                  target="_blank"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                  Request Features <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
          
          {/* Step 4: Complete */}
          {currentStep === STEPS.COMPLETE && (
            <div className="py-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Setup Complete!</h3>
                <p className="mb-4">
                  You're all set to start creating invoices and receiving payments in EURe on Gnosis Chain.
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Your payment address has been saved, and you can change it anytime in the Settings.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-lg mb-2 text-blue-800">Quick Tips for Using the Invoice Assistant</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-blue-700 mb-1">Easy Invoice Creation</h5>
                    <p className="text-sm text-blue-800">
                      The chat assistant can help you create invoices in seconds. Simply:
                    </p>
                    <ul className="text-sm text-blue-700 list-disc pl-5 mt-1 space-y-1">
                      <li>Copy and paste email text from clients or suppliers directly into the chat</li>
                      <li>The assistant will automatically extract invoice information and pre-fill the form</li>
                      <li>Review and adjust any details before finalizing your invoice</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-blue-700 mb-1">Ask Natural Questions</h5>
                    <p className="text-sm text-blue-700">
                      You can also ask the assistant questions like:
                    </p>
                    <ul className="text-sm text-blue-700 list-disc pl-5 mt-1 space-y-1">
                      <li>"Create an invoice for web design services"</li>
                      <li>"Help me fill out an invoice for [client name]"</li>
                      <li>"Extract information from this email"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
          {currentStep > STEPS.WELCOME && currentStep < STEPS.COMPLETE && (
            <button
              onClick={() => setCurrentStep(prevStep => prevStep - 1)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Back
            </button>
          )}
          <div></div>
          {currentStep < STEPS.COMPLETE && (
            <button
              onClick={() => {
                if (currentStep === STEPS.PLATFORM_INFO) {
                  completeOnboarding();
                } else {
                  setCurrentStep(prevStep => prevStep + 1);
                }
              }}
              disabled={currentStep === STEPS.PAYMENT_ADDRESS && 
                (!customAddress || !isValidAddress(customAddress)) || 
                isLoading}
              className={`px-4 py-2 text-white rounded-md inline-flex items-center ${
                (currentStep === STEPS.PAYMENT_ADDRESS && 
                  (!customAddress || !isValidAddress(customAddress))) || isLoading
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {currentStep === STEPS.PLATFORM_INFO ? 'Complete Setup' : 'Next'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          )}
          {currentStep === STEPS.COMPLETE && (
            <button
              onClick={() => {
                closeOnboarding();
                router.push('/create-invoice');
              }}
              className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md inline-flex items-center"
            >
              Create Your First Invoice
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}