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
import { cn } from '@/lib/utils'; // Import cn

// Get bank account list item type
type DestinationBankAccountListItem = RouterOutputs['settings']['bankAccounts']['listBankAccounts'][number];
// Get full bank account details type
type FullDestinationBankAccount = RouterOutputs['settings']['bankAccounts']['getBankAccountDetails'];

// Get the correct input type from the router
type CreateOfframpTransferInput = RouterInputs['align']['createOfframpTransfer'];

// Combine form values with bank account details for validation
const initiateTransferFormSchema = z.object({
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
     message: "Amount must be a positive number",
  }),
  sourceToken: z.enum(['usdc']), // Only USDC supported initially?
  sourceNetwork: z.enum(['base']), // Only Base supported initially?
  destinationCurrency: z.enum(['usd', 'eur']), // Limit options initially
  destinationPaymentRails: z.enum(['ach', 'sepa']), // Limit options initially
  
  // Bank Account Details (Replicating backend schema)
  destinationBankAccountId: z.string().uuid().optional(), // Keep ID for selection logic, but not for final submission
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
  bicSwift: z.string().optional(),

}).refine(data => {
    if (data.accountHolderType === 'individual') {
      return !!data.accountHolderFirstName && !!data.accountHolderLastName;
    }
    if (data.accountHolderType === 'business') {
      return !!data.accountHolderBusinessName;
    }
    return false;
}, { message: "First/Last name (Individual) or Business name required.", path: ["accountHolderFirstName"] })
  .refine(data => {
    if (data.accountType === 'us') return !!data.accountNumber && !!data.routingNumber;
    return true;
}, { message: "Account Number and Routing Number are required for US accounts.", path: ["accountNumber"] })
  .refine(data => {
    if (data.accountType === 'iban') return !!data.ibanNumber && !!data.bicSwift;
    return true;
}, { message: "IBAN and BIC/SWIFT are required for IBAN accounts.", path: ["ibanNumber"] });

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
  const [showManualEntry, setShowManualEntry] = useState(true); // Start with manual entry shown
  const [isLoadingSelectedDetails, setIsLoadingSelectedDetails] = useState(false);
  
  // Fetch available destination bank accounts
  const { 
      data: bankAccounts,
      isLoading: isLoadingBankAccounts,
      error: bankAccountsError 
  } = api.settings.bankAccounts.listBankAccounts.useQuery();

  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset, // Use reset to populate form on selection
    formState: { errors },
  } = useForm<InitiateTransferFormValues>({ 
       resolver: zodResolver(initiateTransferFormSchema),
       defaultValues: {
            sourceToken: 'usdc',
            sourceNetwork: 'base',
            destinationCurrency: 'usd',
            destinationPaymentRails: 'ach',
            accountHolderType: 'individual', // Defaults for manual entry
            accountType: 'us',       
       }
   });

  const accountType = watch('accountType');
  const accountHolderType = watch('accountHolderType');
  const selectedBankAccountId = watch('destinationBankAccountId');

  // Effect to fetch full details when selection changes and populate form
  useEffect(() => {
    const fetchAndPopulate = async () => {
        if (selectedBankAccountId) {
            setShowManualEntry(false); // Hide manual fields if selecting saved
            setIsLoadingSelectedDetails(true);
            try {
                const details = await utils.settings.bankAccounts.getBankAccountDetails.fetch({
                    accountId: selectedBankAccountId
                });
                if (details) {
                    // Populate the form with fetched UNMASKED details
                    reset({
                        ...watch(), 
                        destinationBankAccountId: selectedBankAccountId,
                        bankName: details.bankName,
                        accountHolderType: details.accountHolderType,
                        accountHolderFirstName: details.accountHolderFirstName ?? undefined,
                        accountHolderLastName: details.accountHolderLastName ?? undefined,
                        accountHolderBusinessName: details.accountHolderBusinessName ?? undefined,
                        country: details.country,
                        city: details.city,
                        streetLine1: details.streetLine1,
                        streetLine2: details.streetLine2 ?? undefined,
                        postalCode: details.postalCode,
                        accountType: details.accountType,
                        accountNumber: details.accountNumber ?? undefined, 
                        routingNumber: details.routingNumber ?? undefined,
                        ibanNumber: details.ibanNumber ?? undefined,
                        bicSwift: details.bicSwift ?? undefined,
                    });
                    toast.success(`Loaded details for ${details.accountName}`);
                } else {
                    throw new Error("Account details not found.");
                }
            } catch (err) {
                toast.error("Failed to load details for selected bank account.");
                // Optionally reset to manual entry on error
                // setValue('destinationBankAccountId', undefined);
                // setShowManualEntry(true);
            } finally {
                setIsLoadingSelectedDetails(false);
            }
        } else {
            // If no account is selected (or deselected), show manual entry
            // Optionally clear fields here if desired
            setShowManualEntry(true); 
        }
    };
    fetchAndPopulate();
  }, [selectedBankAccountId, utils, reset, watch, setValue]);

  // Fetch USDC balance of Primary Safe
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
  }, [primarySafeAddress]); // Re-fetch if address changes

  const handleMaxClick = () => {
      if (usdcBalance) {
          setValue('amount', usdcBalance);
      }
  }

  // Submit handler constructs the final object from form values
  const handleFormSubmit = async (values: InitiateTransferFormValues) => {
    try {
        // Construct the destinationBankAccount object from form values
        const destinationBankAccount: CreateOfframpTransferInput['destinationBankAccount'] = {
            bank_name: values.bankName,
            account_holder_type: values.accountHolderType,
            account_holder_first_name: values.accountHolderFirstName,
            account_holder_last_name: values.accountHolderLastName,
            account_holder_business_name: values.accountHolderBusinessName,
            account_holder_address: {
                country: values.country,
                city: values.city,
                street_line_1: values.streetLine1,
                street_line_2: values.streetLine2,
                postal_code: values.postalCode,
                 // state: values.state, // Add if state exists in form schema
            },
            account_type: values.accountType,
            // Use the potentially now unmasked values from the form state
            us: values.accountType === 'us' ? { 
                account_number: values.accountNumber ?? '', 
                routing_number: values.routingNumber ?? ''
              } : undefined,
            iban: values.accountType === 'iban' ? { 
                iban_number: values.ibanNumber ?? '', 
                bic: values.bicSwift ?? '' 
              } : undefined,
        };

        // Construct the final mutation input
        const mutationInput: CreateOfframpTransferInput = {
            amount: values.amount,
            sourceToken: values.sourceToken,
            sourceNetwork: values.sourceNetwork,
            destinationCurrency: values.destinationCurrency,
            destinationPaymentRails: values.destinationPaymentRails,
            destinationBankAccount: destinationBankAccount, // Pass the constructed object
        };

        await onSubmit(mutationInput);
    } catch (error) { 
        console.error("Error submitting transfer initiation:", error);
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
            <Label htmlFor="destinationBankAccountId" className="text-gray-700">Destination Bank Account</Label>
            <Controller
                control={control}
                name="destinationBankAccountId"
                render={({ field }) => (
                    <Select 
                        onValueChange={(value) => {
                            field.onChange(value === '--manual--' ? undefined : value);
                            if (value === '--manual--') setShowManualEntry(true);
                        }}
                        value={field.value ?? '--manual--'}
                        disabled={isLoadingBankAccounts || isLoadingSelectedDetails}
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
            {isLoadingSelectedDetails && <p className="text-xs text-muted-foreground mt-1"><Loader2 className="h-3 w-3 mr-1 animate-spin inline-block"/> Loading account details...</p>}
        </div>

        {/* Manual Bank Account Entry Fields (conditional) */}
        {showManualEntry && (
            <Card className="p-4 border-gray-200 bg-gray-50 shadow-none border">
                 <h4 className="text-sm font-semibold mb-4 text-gray-800">Enter Destination Bank Details</h4>
                 <div className="space-y-4">
                    {/* Re-use structure from AddBankAccountForm */}
                    {/* Account Nickname (Optional here) & Bank Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Removed Nickname field for manual entry */}
                        <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" {...register("bankName")} />
                        {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName.message}</p>}
                        </div>
                         {/* Add Account Holder Type here */}
                         <div>
                            <Label htmlFor="accountHolderType">Account Holder Type</Label>
                            <Controller
                                control={control}
                                name="accountHolderType"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select account holder type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="individual">Individual</SelectItem>
                                        <SelectItem value="business">Business</SelectItem>
                                    </SelectContent>
                                    </Select>
                                )}
                            />
                         </div>
                    </div>

                    {/* Account Holder Details (conditional) */}
                    {accountHolderType === 'individual' && (
                        <>
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
                        </>
                    )}
                    
                    {accountHolderType === 'business' && (
                        <>
                        <div>
                        <Label htmlFor="accountHolderBusinessName">Business Name</Label>
                        <Input id="accountHolderBusinessName" {...register("accountHolderBusinessName")} />
                        {errors.accountHolderBusinessName && <p className="text-xs text-red-500 mt-1">{errors.accountHolderBusinessName.message}</p>}
                        </div>
                        </>
                    )}
                    
                    {/* Address Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" {...register("country")} />
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
                        <Label htmlFor="streetLine2">Street Line 2</Label>
                        <Input id="streetLine2" {...register("streetLine2")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" {...register("postalCode")} />
                        {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode.message}</p>}
                        </div>
                    </div>
                    
                    {/* Account Type & Details (conditional) */}
                    <div>
                    <Label htmlFor="accountType">Account Type</Label>
                    <Controller
                        control={control}
                        name="accountType"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    </div>
                    {accountType === 'us' && (
                        <>
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
                        </>
                    )}
                    {accountType === 'iban' && (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <Label htmlFor="ibanNumber">IBAN Number</Label>
                            <Input id="ibanNumber" {...register("ibanNumber")} />
                            {errors.ibanNumber && <p className="text-xs text-red-500 mt-1">{errors.ibanNumber.message}</p>}
                            </div>
                            <div>
                            <Label htmlFor="bicSwift">BIC/SWIFT</Label>
                            <Input id="bicSwift" {...register("bicSwift")} />
                            </div>
                        </div>
                        </>
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
        disabled={isLoading || isLoadingBankAccounts || isLoadingSelectedDetails} 
        className="w-full bg-gray-900 text-white hover:bg-gray-800"
      >
        {(isLoading || isLoadingSelectedDetails) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Initiating...' : (isLoadingSelectedDetails ? 'Loading Details...' : 'Initiate Withdrawal')}
      </Button>
    </form>
  );
} 