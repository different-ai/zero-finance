'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addFundingSourceSchema, type AddFundingSourceFormValues } from '../../lib/validators/add-funding-source';
import { addFundingSource, type AddFundingSourceResult } from '../../actions/add-funding-source';
import { parseBankDetails } from '../../actions/parse-bank-details';

import { Button } from "@/components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea"; // Import Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Loader2, AlertCircle, Wand2 } from "lucide-react"; // Add Wand2 for Parse button

export function AddFundingSourceForm() {
  const [formResult, setFormResult] = useState<AddFundingSourceResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freeFormInput, setFreeFormInput] = useState(''); // State for free-form input
  const [isParsing, setIsParsing] = useState(false); // State for parsing loading
  const [parseError, setParseError] = useState<string | null>(null); // State for parsing errors

  const form = useForm<AddFundingSourceFormValues>({
    resolver: zodResolver(addFundingSourceSchema),
    defaultValues: {
      sourceAccountType: 'us_ach', // Default to US
      sourceCurrency: 'USD',
      sourceBankName: '',
      sourceBankAddress: '',
      sourceBankBeneficiaryName: '',
      sourceBankBeneficiaryAddress: '',
      sourceRoutingNumber: '', 
      sourceAccountNumber: '',
      sourceIban: '',
      sourceBicSwift: '',
      sourceSortCode: '',
      sourcePaymentRail: 'ach_push', // Example default
      destinationCurrency: 'USDC',
      destinationPaymentRail: 'base',
      destinationAddress: '' // Should be pre-filled ideally, but start empty
    },
  });

  const selectedAccountType = form.watch('sourceAccountType');

  // Handler for the Parse Details button
  const handleParseDetails = async () => {
    setIsParsing(true);
    setParseError(null);
    setFormResult(null); // Clear previous submission results

    try {
      // Call the actual server action
      const result = await parseBankDetails(freeFormInput);
      console.log("Parsing text:", freeFormInput);

      if (result.success && result.data) {
        console.log("Parsed data:", result.data);
        // Pre-fill form fields using form.setValue
        // Iterate over keys ensuring they exist in AddFundingSourceFormValues
        for (const key in result.data) {
          if (Object.prototype.hasOwnProperty.call(result.data, key) && key in form.getValues()) {
            const value = result.data[key as keyof typeof result.data];
             if (value !== undefined && value !== null) {
              form.setValue(key as keyof AddFundingSourceFormValues, String(value), { shouldValidate: true, shouldDirty: true });
             }
          }
        }
        // Explicitly set account type first if available, as fields depend on it
        if (result.data.sourceAccountType) {
          // Type check to ensure the value matches the expected literal union
          const validTypes: AddFundingSourceFormValues['sourceAccountType'][] = ['us_ach', 'iban', 'uk_details', 'other'];
          if (validTypes.includes(result.data.sourceAccountType as any)) {
            form.setValue('sourceAccountType', result.data.sourceAccountType as AddFundingSourceFormValues['sourceAccountType'], { shouldValidate: true, shouldDirty: true });
          } else {
            console.warn(`Parsed account type "${result.data.sourceAccountType}" is not a valid type. Defaulting or skipping.`);
            // Optionally set to 'other' or handle differently
            // form.setValue('sourceAccountType', 'other', { shouldValidate: true, shouldDirty: true });
          }
        }
        console.log("Form values after parsing:", form.getValues());
      } else if (!result.success) {
        // Explicitly cast result type to access error property
        const errorResult = result as { success: false; error: string }; 
        setParseError(errorResult.error || "Failed to parse details. Please check the input or fill manually."); 
      }
    } catch (error) {
      console.error("Parsing error:", error);
      setParseError("An unexpected error occurred during parsing.");
    } finally {
      setIsParsing(false);
    }
  };

  const onSubmit = async (data: AddFundingSourceFormValues) => {
    setIsSubmitting(true);
    setParseError(null); // Clear parse errors on submit
    setFormResult(null);
    console.log("Submitting data:", data);

    // Clear fields not relevant to the selected type before submission
    const dataToSubmit = { ...data };
    if (data.sourceAccountType !== 'us_ach') {
      dataToSubmit.sourceRoutingNumber = undefined;
      if(data.sourceAccountType !== 'uk_details') dataToSubmit.sourceAccountNumber = undefined; // Keep for UK
    }
    if (data.sourceAccountType !== 'iban') {
      dataToSubmit.sourceIban = undefined;
      dataToSubmit.sourceBicSwift = undefined;
    }
    if (data.sourceAccountType !== 'uk_details') {
       if(data.sourceAccountType !== 'us_ach') dataToSubmit.sourceAccountNumber = undefined; // Keep for US
      dataToSubmit.sourceSortCode = undefined;
    }

    const result = await addFundingSource(dataToSubmit);
    console.log("Action result:", result);
    setFormResult(result);
    setIsSubmitting(false);

    if (result.success) {
      // Optionally reset form or redirect
      // form.reset(); 
      // Potentially show success message longer or trigger parent component reload
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Funding Source</CardTitle>
        <CardDescription>Link a bank account. You can paste details below for auto-fill.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Free-form input section */}
        <div className="space-y-2 mb-6 border-b pb-6">
          <Label htmlFor="freeFormInput">Paste Bank Details Here (Optional)</Label>
          <Textarea
            id="freeFormInput"
            placeholder="e.g., Routing: 111000025, Account: 123456789, Bank: Chase, Beneficiary: John Doe..."
            value={freeFormInput}
            onChange={(e) => setFreeFormInput(e.target.value)}
            rows={4}
            className="text-sm"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleParseDetails} 
            disabled={isParsing || !freeFormInput}
          >
            {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            {isParsing ? 'Parsing...' : 'Parse & Fill Form'}
          </Button>
           {/* Parsing Error Display */}
           {parseError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Parsing Error</AlertTitle>
              <AlertDescription>{parseError}</AlertDescription>
            </Alert>
          )}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="sourceAccountType">Account Type</Label>
            <Controller
              control={form.control}
              name="sourceAccountType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="sourceAccountType">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us_ach">US Account (ACH)</SelectItem>
                    <SelectItem value="iban">IBAN (SEPA/SWIFT)</SelectItem>
                    <SelectItem value="uk_details">UK Account</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Conditional Fields */}
          {selectedAccountType === 'us_ach' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="sourceRoutingNumber">Routing Number</Label>
                  <Input id="sourceRoutingNumber" {...form.register("sourceRoutingNumber")} />
                  {form.formState.errors.sourceRoutingNumber && <p className="text-xs text-destructive">{form.formState.errors.sourceRoutingNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sourceAccountNumber">Account Number</Label>
                  <Input id="sourceAccountNumber" {...form.register("sourceAccountNumber")} />
                  {form.formState.errors.sourceAccountNumber && <p className="text-xs text-destructive">{form.formState.errors.sourceAccountNumber.message}</p>}
                </div>
              </div>
            </>
          )}

          {selectedAccountType === 'iban' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="sourceIban">IBAN</Label>
                <Input id="sourceIban" {...form.register("sourceIban")} />
                {form.formState.errors.sourceIban && <p className="text-xs text-destructive">{form.formState.errors.sourceIban.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourceBicSwift">BIC / SWIFT (Optional)</Label>
                <Input id="sourceBicSwift" {...form.register("sourceBicSwift")} />
                 {form.formState.errors.sourceBicSwift && <p className="text-xs text-destructive">{form.formState.errors.sourceBicSwift.message}</p>}
             </div>
            </>
          )}
          
          {selectedAccountType === 'uk_details' && (
             <>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="sourceSortCode">Sort Code</Label>
                  <Input id="sourceSortCode" {...form.register("sourceSortCode")} placeholder="e.g., 123456"/>
                  {form.formState.errors.sourceSortCode && <p className="text-xs text-destructive">{form.formState.errors.sourceSortCode.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sourceAccountNumber">Account Number</Label>
                  <Input id="sourceAccountNumber" {...form.register("sourceAccountNumber")} placeholder="e.g., 12345678" />
                  {form.formState.errors.sourceAccountNumber && <p className="text-xs text-destructive">{form.formState.errors.sourceAccountNumber.message}</p>}
                </div>
              </div>
            </>
          )}
          
          {/* Common Fields */}
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="sourceCurrency">Bank Currency</Label>
                <Input id="sourceCurrency" {...form.register("sourceCurrency")} placeholder="e.g., USD"/>
                {form.formState.errors.sourceCurrency && <p className="text-xs text-destructive">{form.formState.errors.sourceCurrency.message}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="sourceBankName">Bank Name</Label>
              <Input id="sourceBankName" {...form.register("sourceBankName")} />
              {form.formState.errors.sourceBankName && <p className="text-xs text-destructive">{form.formState.errors.sourceBankName.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sourceBankBeneficiaryName">Beneficiary Name (Your Name)</Label>
            <Input id="sourceBankBeneficiaryName" {...form.register("sourceBankBeneficiaryName")} />
            {form.formState.errors.sourceBankBeneficiaryName && <p className="text-xs text-destructive">{form.formState.errors.sourceBankBeneficiaryName.message}</p>}
          </div>

           {/* Optional Addresses */}
           {/* Consider adding these if needed, or remove if not critical for MVP */}
           {/* 
           <div className="space-y-2">
            <Label htmlFor="sourceBankAddress">Bank Address (Optional)</Label>
            <Input id="sourceBankAddress" {...form.register("sourceBankAddress")} />
           </div>
           <div className="space-y-2">
            <Label htmlFor="sourceBankBeneficiaryAddress">Beneficiary Address (Optional)</Label>
            <Input id="sourceBankBeneficiaryAddress" {...form.register("sourceBankBeneficiaryAddress")} />
           </div> 
           */}

          {/* Destination Address - TODO: Make read-only and pre-fill? */}
          <div className="space-y-2">
            <Label htmlFor="destinationAddress">Destination Address (Primary Safe)</Label>
            <Input id="destinationAddress" {...form.register("destinationAddress")} placeholder="0x..." />
             {form.formState.errors.destinationAddress && <p className="text-xs text-destructive">{form.formState.errors.destinationAddress.message}</p>}
             <p className="text-xs text-muted-foreground">Funds will be converted to {form.getValues("destinationCurrency")} and sent here.</p>
         </div>
          
          {/* Submission Feedback */}
          {formResult && (
            <Alert variant={formResult.success ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{formResult.success ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{formResult.message}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Adding...' : 'Add Funding Source'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 