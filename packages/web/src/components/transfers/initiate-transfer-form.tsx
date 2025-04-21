'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, InfoIcon } from 'lucide-react';
import type { RouterOutputs, RouterInputs } from '@/utils/trpc';
import { formatUnits, parseUnits, getAddress, Address, createPublicClient, http } from 'viem'; // Import viem utils + client
import { base } from 'viem/chains'; // Import chain info
import { usePrivy } from '@privy-io/react-auth'; // For getting user wallet
import { toast } from 'sonner'; // Add toast import
import { Card } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combo-box'; // Import the new Combobox
import { cn } from '@/lib/utils'; // Import cn

// Define a list of countries with their ISO codes
const countryList = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Chile', code: 'CL' },
  { name: 'Colombia', code: 'CO' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Spain', code: 'ES' },
  { name: 'Italy', code: 'IT' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Austria', code: 'AT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Norway', code: 'NO' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Finland', code: 'FI' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Poland', code: 'PL' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Australia', code: 'AU' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Japan', code: 'JP' },
  { name: 'South Korea', code: 'KR' },
  { name: 'China', code: 'CN' },
  { name: 'India', code: 'IN' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'South Africa', code: 'ZA' },
  // Add more countries as needed
];

// Get bank account list item type
type DestinationBankAccountListItem = RouterOutputs['settings']['bankAccounts']['listBankAccounts'][number];
// Get full bank account details type
// type FullDestinationBankAccount = RouterOutputs['settings']['bankAccounts']['getBankAccountDetails']; // No longer needed here

// Get the correct input type from the router
type CreateOfframpTransferInput = RouterInputs['align']['createOfframpTransfer'];
// Define the expected structure for manual bank account input (matches backend schema)
const manualBankAccountSchema = z.object({
    bankName: z.string().min(1, 'Bank name is required'),
    accountHolderType: z.enum(['individual', 'business']),
    accountHolderFirstName: z.string().optional(),
    accountHolderLastName: z.string().optional(),
    accountHolderBusinessName: z.string().optional(),
    country: z.string().min(1, 'Country is required'), 
    city: z.string().min(1, 'City is required'),
    streetLine1: z.string().min(1, 'Street address is required'),
    streetLine2: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
    accountType: z.enum(['us', 'iban']),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    ibanNumber: z.string().optional(),
    bicSwift: z.string().optional(), // Frontend uses bicSwift, backend maps to bic
}).refine(data => { // Refine name fields
    if (data.accountHolderType === 'individual') {
      return !!data.accountHolderFirstName && !!data.accountHolderLastName;
    }
    if (data.accountHolderType === 'business') {
      return !!data.accountHolderBusinessName;
    }
    return false;
}, { message: "First/Last name (Individual) or Business name required.", path: ["accountHolderFirstName"] }) // Path helps focus error
  .refine(data => { // Refine US fields
    if (data.accountType === 'us') return !!data.accountNumber && !!data.routingNumber;
    return true;
}, { message: "Account Number and Routing Number are required for US accounts.", path: ["accountNumber"] })
  .refine(data => { // Refine IBAN fields
    if (data.accountType === 'iban') return !!data.ibanNumber && !!data.bicSwift;
    return true;
}, { message: "IBAN and BIC/SWIFT are required for IBAN accounts.", path: ["ibanNumber"] });

// --- SIMPLIFIED FORM SCHEMA ---
// Basic field definitions, complex validation moved to backend
const initiateTransferFormSchema = z.object({
    amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
    }),
    sourceToken: z.enum(['usdc']), // Keep enums for basic type safety
    sourceNetwork: z.enum(['base']),
    destinationCurrency: z.enum(['usd', 'eur']),
    destinationPaymentRails: z.enum(['ach', 'sepa']),
    
    // ID for selecting saved account OR flag for manual entry
    destinationSelection: z.string().min(1, "Please select a destination or choose to enter new details."), // Keep basic required check
    
    // Manual entry fields - Now truly optional at this level
    bankName: z.string().optional(),
    accountHolderType: z.enum(['individual', 'business']).optional(),
    accountHolderFirstName: z.string().optional(),
    accountHolderLastName: z.string().optional(),
    accountHolderBusinessName: z.string().optional(),
    country: z.string().optional(), 
    city: z.string().optional(),
    streetLine1: z.string().optional(),
    streetLine2: z.string().optional(),
    postalCode: z.string().optional(),
    accountType: z.enum(['us', 'iban']).optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    ibanNumber: z.string().optional(),
    bicSwift: z.string().optional(), // Frontend still uses bicSwift

}); // REMOVED superRefine

// REMOVED the separate manualBankAccountSchema - Backend will handle this validation


// Combine form values with bank account details for validation
// --- REMOVED OLD COMPLEX SCHEMA ---
// const initiateTransferFormSchema = z.object({ ... }).superRefine(...)


export type InitiateTransferFormValues = z.infer<typeof initiateTransferFormSchema>;

// ERC20 ABI fragment for balanceOf
const erc20AbiBalanceOf = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const;

// Define USDC contract address on Base
const USDC_BASE_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address;

interface InitiateTransferFormProps {
  onSubmit: (values: CreateOfframpTransferInput) => Promise<void>;
  isLoading: boolean;
  primarySafeAddress: Address | null | undefined;
}

export function InitiateTransferForm({ onSubmit, isLoading, primarySafeAddress }: InitiateTransferFormProps) {
  const { user } = usePrivy();
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(true); // Controlled by selection now
  // const [isLoadingSelectedDetails, setIsLoadingSelectedDetails] = useState(false); // No longer needed
  
  // Fetch available destination bank accounts
  const { 
      data: bankAccounts,
      isLoading: isLoadingBankAccounts,
      error: bankAccountsError 
  } = api.settings.bankAccounts.listBankAccounts.useQuery();

  // const utils = api.useUtils(); // No longer needed for fetching details here

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset, // Still useful for resetting form or setting defaults
    formState: { errors },
  } = useForm<InitiateTransferFormValues>({ 
       resolver: zodResolver(initiateTransferFormSchema),
       defaultValues: {
            sourceToken: 'usdc',
            sourceNetwork: 'base',
            destinationCurrency: 'usd',
            destinationPaymentRails: 'ach',
            destinationSelection: '--manual--', // Default to manual entry
            // Default manual fields (optional, but can improve UX)
            // accountHolderType: 'individual', 
            // accountType: 'us',       
       }
   });

  const accountType = watch('accountType'); // Still watch for conditional UI
  const accountHolderType = watch('accountHolderType'); // Still watch for conditional UI
  const destinationSelection = watch('destinationSelection');

  // Effect to control visibility of manual entry section
  useEffect(() => {
    setShowManualEntry(destinationSelection === '--manual--');
    // Optionally clear manual fields when switching TO a saved account
    if (destinationSelection !== '--manual--') {
       // Example: clear bankName, could clear others too if desired
       // setValue('bankName', undefined); 
       // Be careful with clearing as it might conflict with user edits
    }
  }, [destinationSelection, setValue]);

  // REMOVE THE useEffect that fetched details and populated the form


  // Fetch USDC balance of Primary Safe (Keep this effect)
  useEffect(() => {
      const fetchBalance = async () => {
          if (!primarySafeAddress) {
              setUsdcBalance(null);
              return;
          }
          setIsLoadingBalance(true);
          try {
              // Create a public client for Base network
               const publicClient = createPublicClient({
                  chain: base, 
                  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL)
              });

              // Fetch balance
              const balance = await publicClient.readContract({
                  address: USDC_BASE_ADDRESS,
                  abi: erc20AbiBalanceOf,
                  functionName: 'balanceOf',
                  args: [primarySafeAddress]
              });

              // Format balance (assuming 6 decimals for USDC)
              // Assert type directly in the call
              const formattedBalance = formatUnits(balance as bigint, 6);
              setUsdcBalance(formattedBalance);

          } catch (err) {
              console.error("Failed to fetch Safe USDC balance:", err);
              setUsdcBalance(null);
              toast.error("Could not fetch USDC balance for your Safe.");
          } finally {
              setIsLoadingBalance(false);
          }
      };
      fetchBalance();
  }, [primarySafeAddress]);

  const handleMaxClick = () => {
      if (usdcBalance) {
          setValue('amount', usdcBalance);
      }
  }

  // Submit handler constructs the input for the backend mutation
  const handleFormSubmit = async (values: InitiateTransferFormValues) => {
    // --- SIMPLIFIED SUBMISSION ---
    // We now send the raw form values directly. 
    // The backend will interpret `destinationSelection` and validate accordingly.
    
    // The `CreateOfframpTransferInput` type on the `onSubmit` prop expects the backend's 
    // input structure. Since we haven't updated the backend yet, there might be a temporary 
    // type mismatch here. We'll cast `values` for now, knowing the backend update will resolve this.
    // The backend expects either { type: 'manual', ... } or { type: 'saved', ... }
    
    // Construct payload based on selection type (minimal frontend logic)
    let submissionPayload: any; // Use 'any' temporarily, backend update will fix type safety

    if (values.destinationSelection === '--manual--') {
        submissionPayload = {
            type: 'manual',
            ...values // Send all form values
        };
    } else {
        submissionPayload = {
            type: 'saved',
            // Send only relevant fields for saved type
            amount: values.amount,
            sourceToken: values.sourceToken,
            sourceNetwork: values.sourceNetwork,
            destinationCurrency: values.destinationCurrency,
            destinationPaymentRails: values.destinationPaymentRails,
            destinationBankAccountId: values.destinationSelection, // The ID is in destinationSelection
        };
    }


    // Call the onSubmit prop passed from the parent component
    try {
        // Cast the payload to the expected input type for the onSubmit prop
        // This assumes the parent component's onSubmit expects CreateOfframpTransferInput
        // which we will align when we update the backend router.
        await onSubmit(submissionPayload as CreateOfframpTransferInput); 
    } catch (error) { 
        console.error("Error submitting transfer initiation:", error);
        // Error handling might be done in parent or here
        toast.error("Failed to submit transfer request"); 
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
       {/* Amount and Source Token */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <Label htmlFor="amount" className="text-gray-700">Amount to Withdraw</Label>
                <div className="flex items-center space-x-2 mt-1">
                    <Input id="amount" type="number" step="any" placeholder="0.00" {...register("amount")} />
                    <Button type="button" variant="outline" size="sm" onClick={handleMaxClick} disabled={!usdcBalance || isLoadingBalance} className="border-gray-300 text-gray-700">
                        MAX
                    </Button>
                </div>
                {isLoadingBalance && <p className="text-xs text-muted-foreground mt-1"><Loader2 className="h-3 w-3 mr-1 animate-spin inline-block"/> Checking balance...</p>}
                {!isLoadingBalance && usdcBalance !== null && <p className="text-xs text-muted-foreground mt-1">Safe Balance: {usdcBalance} USDC</p>}
                {!isLoadingBalance && usdcBalance === null && <p className="text-xs text-red-500 mt-1">Could not load balance.</p>}
                {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
            </div>
             <div>
                <Label className="text-gray-700">Source</Label>
                <Input disabled value="USDC on Base Network (Primary Safe)" className="mt-1 bg-gray-50 border-gray-200"/>
                {/* Hidden inputs for schema validation */}
                <input type="hidden" {...register("sourceToken")} />
                <input type="hidden" {...register("sourceNetwork")} />
            </div>
        </div>

        {/* Destination Details */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <Label htmlFor="destinationCurrency" className="text-gray-700">Destination Currency</Label>
                <Controller
                    control={control}
                    name="destinationCurrency"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="eur">EUR</SelectItem>
                            {/* Add other currencies as needed */}
                        </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div>
                <Label htmlFor="destinationPaymentRails" className="text-gray-700">Payment Rail</Label>
                <Controller
                    control={control}
                    name="destinationPaymentRails"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select rail" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ach">ACH (US)</SelectItem>
                            <SelectItem value="sepa">SEPA (EUR)</SelectItem>
                             {/* Add other rails as needed */}
                        </SelectContent>
                        </Select>
                    )}
                />
            </div>
         </div>

        {/* Destination Bank Account Selection */}
        <div className="space-y-1.5">
            <Label htmlFor="destinationSelection" className="text-gray-700">Destination Bank Account</Label>
            <Controller
                control={control}
                name="destinationSelection" // Control the selection field
                render={({ field }) => (
                    <Select 
                        onValueChange={field.onChange} // Directly update the selection field
                        value={field.value}
                        disabled={isLoadingBankAccounts} // Only disable while loading list
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select saved or enter new" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="--manual--">-- Enter New Account Details --</SelectItem>
                            {bankAccounts?.map(acc => (
                                <SelectItem key={acc.id} value={acc.id}>
                                    {acc.accountName} ({acc.bankName} - {acc.maskedAccountNumber || acc.maskedIbanNumber})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {/* Removed loading indicator for selected details */}
            {errors.destinationSelection && <p className="text-xs text-red-500 mt-1">{errors.destinationSelection.message}</p>}
        </div>

        {/* Manual Bank Account Entry Fields (conditional) */}
        {showManualEntry && (
            <Card className="p-4 border-gray-200 bg-gray-50 shadow-none border">
                 <h4 className="text-sm font-semibold mb-4 text-gray-800">Enter Destination Bank Details</h4>
                 <div className="space-y-4">
                    {/* Account Nickname Removed & Bank Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" {...register("bankName")} />
                        {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="accountHolderType">Account Holder Type</Label>
                            <Controller
                                control={control}
                                name="accountHolderType"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value ?? ''} defaultValue=""> 
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="individual">Individual</SelectItem>
                                        <SelectItem value="business">Business</SelectItem>
                                    </SelectContent>
                                    </Select>
                                )}
                            />
                             {errors.accountHolderType && <p className="text-xs text-red-500 mt-1">{errors.accountHolderType.message}</p>}
                        </div>
                    </div>

                    {/* Account Holder Details (conditional) */}
                    {accountHolderType === 'individual' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <Label htmlFor="accountHolderFirstName">First Name</Label>
                            <Input id="accountHolderFirstName" {...register("accountHolderFirstName")} />
                            {errors.accountHolderFirstName && <p className="text-xs text-red-500 mt-1">{errors.accountHolderFirstName.message}</p>}
                            </div>
                            <div>
                            <Label htmlFor="accountHolderLastName">Last Name</Label>
                            <Input id="accountHolderLastName" {...register("accountHolderLastName")} />
                            {errors.accountHolderLastName && <p className="text-xs text-red-500 mt-1">{errors.accountHolderLastName.message}</p>}
                            </div>
                        </div>
                    )}
                    {accountHolderType === 'business' && (
                        <div>
                        <Label htmlFor="accountHolderBusinessName">Business Name</Label>
                        <Input id="accountHolderBusinessName" {...register("accountHolderBusinessName")} />
                        {errors.accountHolderBusinessName && <p className="text-xs text-red-500 mt-1">{errors.accountHolderBusinessName.message}</p>}
                        </div>
                    )}
                    
                    {/* Address Fields */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                        <Label htmlFor="country">Country</Label>
                        <Controller
                            control={control}
                            name="country"
                            render={({ field }) => (
                               <Combobox
                                 options={countryList.map(country => ({ label: country.name, value: country.code }))}
                                 value={typeof field.value === 'string' ? field.value : undefined}
                                 onChange={field.onChange}
                                 placeholder="Select country..."
                                 searchPlaceholder="Search country..."
                                 emptyPlaceholder="No country found."
                                 // Add triggerClassName if needed for styling consistency with other inputs/selects
                                 // triggerClassName="mt-1" 
                               />
                            )}
                        />
                        {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
                        </div>
                        <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register("city")} />
                        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                        <Label htmlFor="streetLine1">Street Line 1</Label>
                        <Input id="streetLine1" {...register("streetLine1")} />
                        {errors.streetLine1 && <p className="text-xs text-red-500 mt-1">{errors.streetLine1.message}</p>}
                        </div>
                         <div>
                        <Label htmlFor="streetLine2">Street Line 2 (Optional)</Label>
                        <Input id="streetLine2" {...register("streetLine2")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" {...register("postalCode")} />
                        {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode.message}</p>}
                        </div>
                         {/* Placeholder for potential State field */}
                    </div>
                    
                    {/* Account Type & Details (conditional) */}
                    <div>
                    <Label htmlFor="accountType">Account Type</Label>
                    <Controller
                        control={control}
                        name="accountType"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value ?? ''} defaultValue="">
                            <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="us">US</SelectItem>
                                <SelectItem value="iban">IBAN</SelectItem>
                            </SelectContent>
                            </Select>
                        )}
                    />
                     {errors.accountType && <p className="text-xs text-red-500 mt-1">{errors.accountType.message}</p>}
                    </div>
                    {accountType === 'us' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input id="accountNumber" {...register("accountNumber")} />
                            {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber.message}</p>}
                            </div>
                            <div>
                            <Label htmlFor="routingNumber">Routing Number</Label>
                            <Input id="routingNumber" {...register("routingNumber")} />
                            {errors.routingNumber && <p className="text-xs text-red-500 mt-1">{errors.routingNumber.message}</p>}
                            </div>
                        </div>
                    )}
                    {accountType === 'iban' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <Label htmlFor="ibanNumber">IBAN Number</Label>
                            <Input id="ibanNumber" {...register("ibanNumber")} />
                            {errors.ibanNumber && <p className="text-xs text-red-500 mt-1">{errors.ibanNumber.message}</p>}
                            </div>
                            <div>
                            <Label htmlFor="bicSwift">BIC/SWIFT</Label>
                            <Input id="bicSwift" {...register("bicSwift")} />
                             {errors.bicSwift && <p className="text-xs text-red-500 mt-1">{errors.bicSwift.message}</p>}
                            </div>
                        </div>
                    )}
                    
                    <Alert variant="default" className="text-xs bg-blue-50 border-blue-200 text-blue-800">
                        <InfoIcon className="h-4 w-4"/>
                        <AlertDescription>Ensure all bank details are correct. Funds sent to incorrect accounts may not be recoverable.</AlertDescription>
                    </Alert>
                 </div>
            </Card>
        )}
        
       {/* Submit Button - Primary Style */}
      <Button 
        type="submit" 
        disabled={isLoading || isLoadingBankAccounts} // Removed isLoadingSelectedDetails 
        className="w-full bg-gray-900 text-white hover:bg-gray-800"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Initiating...' : 'Initiate Withdrawal'}
      </Button>
    </form>
  );
} 