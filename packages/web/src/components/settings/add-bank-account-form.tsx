'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn utility exists

// Replicate the validation schema from the backend router for client-side validation
// Ideally, share this schema via a shared package
const addBankAccountFormSchema = z.object({
  accountName: z.string().min(1, 'Account nickname is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountHolderType: z.enum(['individual', 'business']),
  accountHolderFirstName: z.string().optional(),
  accountHolderLastName: z.string().optional(),
  accountHolderBusinessName: z.string().optional(),
  country: z.string().min(1, 'Country is required'), // TODO: Use country select component?
  city: z.string().min(1, 'City is required'),
  streetLine1: z.string().min(1, 'Street address is required'),
  streetLine2: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  accountType: z.enum(['us', 'iban']),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  ibanNumber: z.string().optional(),
  bicSwift: z.string().optional(),
  isDefault: z.boolean().default(false),
}).refine(data => {
    if (data.accountHolderType === 'individual') {
      return !!data.accountHolderFirstName && !!data.accountHolderLastName;
    }
    if (data.accountHolderType === 'business') {
      return !!data.accountHolderBusinessName;
    }
    return false;
}, {
    message: "First/Last name required for individuals, Business name required for businesses.",
    path: ["accountHolderFirstName"], // Add refinement path for better error display
}).refine(data => {
    if (data.accountType === 'us') {
      return !!data.accountNumber && !!data.routingNumber;
    }
    return true; // Only validate US fields here
}, {
    message: "Account Number and Routing Number are required for US accounts.",
    path: ["accountNumber"], 
}).refine(data => {
    if (data.accountType === 'iban') {
      return !!data.ibanNumber && !!data.bicSwift;
    }
    return true; // Only validate IBAN fields here
}, {
    message: "IBAN and BIC/SWIFT are required for IBAN accounts.",
    path: ["ibanNumber"], 
});

export type AddBankAccountFormValues = z.infer<typeof addBankAccountFormSchema>;

interface AddBankAccountFormProps {
  onSubmit: (values: AddBankAccountFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  initialValues?: Partial<AddBankAccountFormValues>; // Add optional initialValues prop
}

export function AddBankAccountForm({ onSubmit, isSubmitting, onCancel, initialValues }: AddBankAccountFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset, // Import reset from useForm
    formState: { errors },
  } = useForm<AddBankAccountFormValues>({
    resolver: zodResolver(addBankAccountFormSchema),
    defaultValues: initialValues || { // Use initialValues if provided
      accountHolderType: 'individual', 
      accountType: 'us', 
      isDefault: false,
      country: 'US',
    },
  });

  // Reset form when initialValues change (e.g., when opening edit dialog)
  React.useEffect(() => {
      if (initialValues) {
          reset(initialValues);
      }
  }, [initialValues, reset]);

  const accountType = watch('accountType');
  const accountHolderType = watch('accountHolderType');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Account Nickname & Bank Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="accountName">Account Nickname</Label>
          <Input id="accountName" {...register("accountName")} />
          {errors.accountName && <p className="text-xs text-red-500 mt-1">{errors.accountName.message}</p>}
        </div>
        <div>
          <Label htmlFor="bankName">Bank Name</Label>
          <Input id="bankName" {...register("bankName")} />
          {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName.message}</p>}
        </div>
      </div>

      {/* Account Holder Type & Details */}
      <div>
        <Label htmlFor="accountHolderType">Account Holder Type</Label>
        <Controller
            control={control}
            name="accountHolderType"
            render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                    <SelectValue placeholder="Select holder type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                </SelectContent>
                </Select>
            )}
        />
      </div>

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
      {/* Display refinement error for names */}
      {errors.accountHolderFirstName && errors.accountHolderFirstName.type === 'refine' && (
            <p className="text-xs text-red-500 mt-1">{errors.accountHolderFirstName.message}</p>
      )}

      {/* Address Fields */}
      <div>
        <Label htmlFor="streetLine1">Street Address</Label>
        <Input id="streetLine1" {...register("streetLine1")} placeholder="Street Address Line 1" />
        {errors.streetLine1 && <p className="text-xs text-red-500 mt-1">{errors.streetLine1.message}</p>}
      </div>
       <div>
        <Label htmlFor="streetLine2">Street Address Line 2 (Optional)</Label>
        <Input id="streetLine2" {...register("streetLine2")} placeholder="Apartment, suite, etc."/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} />
          {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <Label htmlFor="postalCode">Postal / ZIP Code</Label>
          <Input id="postalCode" {...register("postalCode")} />
          {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode.message}</p>}
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          {/* TODO: Replace with a proper country select component */}
          <Input id="country" {...register("country")} placeholder="e.g., US" />
          {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
        </div>
      </div>

      {/* Account Type & Details */}
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
                    <SelectItem value="us">US Account (ACH)</SelectItem>
                    <SelectItem value="iban">IBAN (SEPA/SWIFT)</SelectItem>
                </SelectContent>
                </Select>
            )}
        />
      </div>

      {accountType === 'us' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input id="accountNumber" {...register("accountNumber")} />
             {/* Display general or refinement error */}
             {(errors.accountNumber || (errors.root && errors.root.message?.includes('Account Number'))) && 
                <p className="text-xs text-red-500 mt-1">
                    {errors.accountNumber?.message || "Account Number and Routing Number are required for US accounts."}
                </p>
             }
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
            <Label htmlFor="ibanNumber">IBAN</Label>
            <Input id="ibanNumber" {...register("ibanNumber")} />
            {(errors.ibanNumber || (errors.root && errors.root.message?.includes('IBAN'))) && 
                <p className="text-xs text-red-500 mt-1">
                    {errors.ibanNumber?.message || "IBAN and BIC/SWIFT are required for IBAN accounts."}
                </p>
             }
          </div>
          <div>
            <Label htmlFor="bicSwift">BIC/SWIFT</Label>
            <Input id="bicSwift" {...register("bicSwift")} />
            {errors.bicSwift && <p className="text-xs text-red-500 mt-1">{errors.bicSwift.message}</p>}
          </div>
        </div>
      )}
      
      {/* Set as Default */}
      <div className="flex items-center space-x-2 pt-2">
         <Controller
            control={control}
            name="isDefault"
            render={({ field }) => (
                 <Switch
                    id="isDefault"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                 />
            )}
          />
        <Label htmlFor="isDefault" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Set as default withdrawal account
        </Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : (initialValues ? 'Update Account' : 'Save Account')}
        </Button>
      </div>
    </form>
  );
} 