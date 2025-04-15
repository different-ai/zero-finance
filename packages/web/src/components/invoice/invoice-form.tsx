'use client';

import React, { forwardRef, useImperativeHandle, useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import { useInvoiceStore, InvoiceFormData, InvoiceItemData } from '@/lib/store/invoice-store';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useInvoice } from '@/hooks/use-invoice';
import {
  useQueryState,
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsFloat,
  parseAsIsoDateTime,
  parseAsJson,
  parseAsStringEnum,
  createParser,
  Parser,
} from 'nuqs';
import { z } from 'zod';

// Define Zod schema for InvoiceItemData
const invoiceItemZodSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: 'Unit price must be a non-negative number'
  }),
  tax: z.number().min(0).max(100), // Tax percentage
});

// Define Zod schema for the array of items
const invoiceItemsArrayZodSchema = z.array(invoiceItemZodSchema);

// Define Zod schema for BankDetails
const bankDetailsZodSchema = z.object({
  accountHolder: z.string().optional(),
  iban: z.string().optional(),
  bic: z.string().optional(),
  bankName: z.string().optional(),
}).nullable(); // Allow null

// Type for BankDetails (matching the structure, optional fields, nullable)
type BankDetails = z.infer<typeof bankDetailsZodSchema>;

// Custom parser for invoice items using createParser and Zod
const parseAsInvoiceItems = createParser({
  parse: (queryValue: string): InvoiceItemData[] | null => {
    try {
      // Return null if queryValue is empty, allowing default to take over
      if (!queryValue) return null;
      const parsed = JSON.parse(queryValue);
      const validationResult = invoiceItemsArrayZodSchema.safeParse(parsed);
      if (validationResult.success) {
        // Ensure items have IDs if missing (though parser expects well-formed data)
        return validationResult.data.map((item, index) => ({
          ...item,
          id: item.id ?? Date.now() + index, // Use nullish coalescing for ID
        }));
      } else {
        console.error("Zod validation failed for invoice items:", validationResult.error.flatten());
        return null; // Indicate parsing/validation failure
      }
    } catch (error) {
      console.error("Failed to parse invoice items JSON:", error);
      return null; // JSON parsing failed
    }
  },
  serialize: (items: InvoiceItemData[] | null): string => {
    if (!items) return ''; // Remove param if null
    // Serialize only if it passes validation
    const validationResult = invoiceItemsArrayZodSchema.safeParse(items);
    if (validationResult.success) {
       return JSON.stringify(items);
    }
    console.warn("Attempted to serialize invalid invoice items, returning empty string.", items);
    return ''; // Remove param if invalid
  },
});

// Custom parser for bank details using createParser and Zod
const parseAsBankDetails = createParser({
  parse: (queryValue: string): BankDetails | null => {
    try {
      if (!queryValue) return null; // Allow default for empty query value
      const parsed = JSON.parse(queryValue);
      // Allow null to be parsed correctly if explicitly set in JSON
      if (parsed === null) return null;
      const validationResult = bankDetailsZodSchema.safeParse(parsed);
      if (validationResult.success) {
        return validationResult.data;
      }
      console.error("Zod validation failed for bank details:", validationResult.error.flatten());
      return null; // Fallback to null on validation failure
    } catch (error) {
      console.error("Failed to parse bank details JSON:", error);
      return null;
    }
  },
  serialize: (details: BankDetails | null): string => {
    if (details === null) return 'null'; // Explicitly serialize null if needed, or '' to remove param
    if (details) {
       const validationResult = bankDetailsZodSchema.safeParse(details);
       if (validationResult.success) {
           return JSON.stringify(details);
       }
       console.warn("Attempted to serialize invalid bank details, returning empty string.", details);
    }
    return ''; // Remove param if undefined or invalid
  },
});

interface InvoiceFormProps {
  onSubmit?: (data: any) => void;
  isSubmitting?: boolean;
}

// Define the type for nuqsFormData based on the parsers used
// This helps with type safety when accessing/setting nuqs state
type NuqsFormData = {
    invoiceNumber: string;
    issueDate: Date | null;
    dueDate: Date | null;
    sellerBusinessName: string;
    sellerEmail: string;
    sellerAddress: string;
    sellerCity: string;
    sellerPostalCode: string;
    sellerCountry: string;
    buyerBusinessName: string;
    buyerEmail: string;
    buyerAddress: string;
    buyerCity: string;
    buyerPostalCode: string;
    buyerCountry: string;
    paymentType: 'crypto' | 'fiat';
    currency: string;
    network: string;
    note: string;
    terms: string;
    bankDetails: BankDetails;
}

export const InvoiceForm = forwardRef(({ onSubmit, isSubmitting: externalIsSubmitting }: InvoiceFormProps, ref) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createInvoice: trpcCreateInvoice } = useInvoice();

  // Zustand store for initial defaults and potentially detected data
  const { 
    formData: storeFormData, 
    invoiceItems: storeInvoiceItems, 
    updateFormData: updateStoreFormData, // Keep for sync if needed
    updateInvoiceItems: updateStoreInvoiceItems, // Keep for sync if needed
    detectedInvoiceData
  } = useInvoiceStore();

  // --- nuqs State Management ---
  const [nuqsFormData, setNuqsFormData] = useQueryStates({
    // Use keys matching NuqsFormData type
    invoiceNumber: parseAsString.withDefault(storeFormData.invoiceNumber),
    issueDate: parseAsIsoDateTime.withDefault(new Date(storeFormData.issueDate)),
    dueDate: parseAsIsoDateTime.withDefault(new Date(storeFormData.dueDate)),
    sellerBusinessName: parseAsString.withDefault(storeFormData.sellerBusinessName),
    sellerEmail: parseAsString.withDefault(storeFormData.sellerEmail),
    sellerAddress: parseAsString.withDefault(storeFormData.sellerAddress),
    sellerCity: parseAsString.withDefault(storeFormData.sellerCity),
    sellerPostalCode: parseAsString.withDefault(storeFormData.sellerPostalCode),
    sellerCountry: parseAsString.withDefault(storeFormData.sellerCountry),
    buyerBusinessName: parseAsString.withDefault(storeFormData.buyerBusinessName),
    buyerEmail: parseAsString.withDefault(storeFormData.buyerEmail),
    buyerAddress: parseAsString.withDefault(storeFormData.buyerAddress),
    buyerCity: parseAsString.withDefault(storeFormData.buyerCity),
    buyerPostalCode: parseAsString.withDefault(storeFormData.buyerPostalCode),
    buyerCountry: parseAsString.withDefault(storeFormData.buyerCountry),
    paymentType: parseAsStringEnum(['crypto', 'fiat'] as const).withDefault(storeFormData.paymentType),
    currency: parseAsString.withDefault(storeFormData.currency),
    network: parseAsString.withDefault(storeFormData.network),
    note: parseAsString.withDefault(storeFormData.note),
    terms: parseAsString.withDefault(storeFormData.terms),
    // Use the custom parser with its default handling
    bankDetails: parseAsBankDetails.withDefault({}), // Default to empty object, parser handles empty/invalid
  }, {
    history: 'replace',
    shallow: true,
  });

  const [nuqsItems, setNuqsItems] = useQueryState(
    'items',
    // Apply .withDefault() to the created parser
    parseAsInvoiceItems
      .withDefault(storeInvoiceItems)
      .withOptions({ history: 'replace', shallow: true })
  );

  // --- Synchronization: nuqs -> Zustand (Optional, if store needs to be kept in sync) ---
  useEffect(() => {
    // This effect syncs the URL state (nuqs) TO the Zustand store.
    // If nuqs is the source of truth for the form, this might be removable
    // unless other components rely on the Zustand store being up-to-date.
    const nuqsDataForStore: Partial<InvoiceFormData> = {
      invoiceNumber: nuqsFormData.invoiceNumber,
      issueDate: nuqsFormData.issueDate instanceof Date ? nuqsFormData.issueDate.toISOString().split('T')[0] : '',
      dueDate: nuqsFormData.dueDate instanceof Date ? nuqsFormData.dueDate.toISOString().split('T')[0] : '',
      sellerBusinessName: nuqsFormData.sellerBusinessName,
      sellerEmail: nuqsFormData.sellerEmail,
      sellerAddress: nuqsFormData.sellerAddress,
      sellerCity: nuqsFormData.sellerCity,
      sellerPostalCode: nuqsFormData.sellerPostalCode,
      sellerCountry: nuqsFormData.sellerCountry,
      buyerBusinessName: nuqsFormData.buyerBusinessName,
      buyerEmail: nuqsFormData.buyerEmail,
      buyerAddress: nuqsFormData.buyerAddress,
      buyerCity: nuqsFormData.buyerCity,
      buyerPostalCode: nuqsFormData.buyerPostalCode,
      buyerCountry: nuqsFormData.buyerCountry,
      paymentType: nuqsFormData.paymentType,
      currency: nuqsFormData.currency,
      network: nuqsFormData.network,
      note: nuqsFormData.note,
      terms: nuqsFormData.terms,
      bankDetails: nuqsFormData.bankDetails, // Types should align now
    };

    // Compare effectively, avoiding unnecessary updates
    const storeDataForCompare = { ...storeFormData }; // Make a copy to avoid mutation issues if any
    let needsStoreUpdate = false;
    for (const key in nuqsDataForStore) {
        const typedKey = key as keyof InvoiceFormData;
        if (JSON.stringify(nuqsDataForStore[typedKey]) !== JSON.stringify(storeDataForCompare[typedKey])) {
            needsStoreUpdate = true;
            break;
        }
    }
    if (needsStoreUpdate) {
        console.log("Syncing nuqsFormData to Zustand store");
        updateStoreFormData(nuqsDataForStore);
    }

    const currentNuqsItems = nuqsItems ?? [];
    if (JSON.stringify(currentNuqsItems) !== JSON.stringify(storeInvoiceItems)) {
        console.log("Syncing nuqsItems to Zustand store");
        updateStoreInvoiceItems(currentNuqsItems);
    }

  }, [ /* Dependencies: nuqsFormData properties, nuqsItems, store updaters */
      nuqsFormData.invoiceNumber, nuqsFormData.issueDate, nuqsFormData.dueDate,
      nuqsFormData.sellerBusinessName, nuqsFormData.sellerEmail, nuqsFormData.sellerAddress,
      nuqsFormData.sellerCity, nuqsFormData.sellerPostalCode, nuqsFormData.sellerCountry,
      nuqsFormData.buyerBusinessName, nuqsFormData.buyerEmail, nuqsFormData.buyerAddress,
      nuqsFormData.buyerCity, nuqsFormData.buyerPostalCode, nuqsFormData.buyerCountry,
      nuqsFormData.paymentType, nuqsFormData.currency, nuqsFormData.network,
      nuqsFormData.note, nuqsFormData.terms, nuqsFormData.bankDetails,
      nuqsItems,
      updateStoreFormData, updateStoreInvoiceItems, storeInvoiceItems // Removed storeFormData from deps to break potential loops
  ]);

  // Expose limited methods via ref if necessary (might be removable)
  useImperativeHandle(ref, () => ({
    // Example: Only expose a way to trigger submission if needed by parent
    // submit: handleSubmit, // Careful with event passing
    // updateFormData: ... // Avoid exposing direct setters if nuqs is source of truth
  }));

  // Apply detected data - update nuqs state directly
  useEffect(() => {
    if (detectedInvoiceData) {
      console.log("Applying detected invoice data to nuqs state:", detectedInvoiceData);
      // Assuming detectedInvoiceData structure matches InvoiceFormData + items
      const { items, ...formDataFromDetection } = detectedInvoiceData as any; // Use any temporarily if type is uncertain

      // Prepare update payload for useQueryStates
      const nuqsUpdateData: Partial<NuqsFormData> = {};

      // Map detected data, handle potential mismatches (e.g., issueDate)
      for (const key in formDataFromDetection) {
          const formKey = key as keyof InvoiceFormData;
          // Handle potential key differences if necessary
          // Remove the specific check for 'issuedAt' as it's likely incorrect
          let nuqsKey: keyof NuqsFormData | null = null;
          // if (formKey === 'issuedAt' && 'issueDate' in nuqsFormData) { 
          //     nuqsKey = 'issueDate';
          // } else
           if (formKey in nuqsFormData) {
              nuqsKey = formKey as keyof NuqsFormData;
          }

          if (nuqsKey) {
              const value = formDataFromDetection[formKey];
              if ((nuqsKey === 'issueDate' || nuqsKey === 'dueDate') && typeof value === 'string') {
                  try {
                      (nuqsUpdateData as any)[nuqsKey] = new Date(value);
                  } catch { /* Handle invalid date string */ }
              } else {
                  (nuqsUpdateData as any)[nuqsKey] = value;
              }
          }
      }
      
      // Only update if there's something to update
      if (Object.keys(nuqsUpdateData).length > 0) {
         setNuqsFormData(nuqsUpdateData);
      }

      if (items && Array.isArray(items) && items.length > 0) {
        const itemsWithIds = items.map((item: any, index: number) => ({
          ...item,
          id: item.id ?? Date.now() + index,
          // Ensure types match InvoiceItemData (e.g., quantity/tax are numbers)
          quantity: Number(item.quantity || 1),
          tax: Number(item.tax || 0),
          unitPrice: String(item.unitPrice || '0'), // Ensure string
        }));
        // Validate before setting
        const validation = invoiceItemsArrayZodSchema.safeParse(itemsWithIds);
        if (validation.success) {
          setNuqsItems(validation.data);
        } else {
          console.error("Detected items failed validation:", validation.error.flatten());
          toast.error("Could not apply detected items due to invalid data.");
        }
      }

      // Clear detected data from store after attempting to apply
      useInvoiceStore.setState({ detectedInvoiceData: null });
    }
  }, [detectedInvoiceData, setNuqsFormData, setNuqsItems]);

  // Use nuqsItems, falling back to an empty array. This is the source of truth for items.
  const currentItems: InvoiceItemData[] = nuqsItems ?? [];

  const addItem = useCallback(() => {
    const newItem: InvoiceItemData = {
      id: Date.now(),
      name: '',
      quantity: 1,
      unitPrice: '0', // Default to '0' string
      tax: 0,
    };
    setNuqsItems([...currentItems, newItem]);
  }, [currentItems, setNuqsItems]);

  const removeItem = useCallback((id: number) => {
    if (currentItems.length <= 1) {
      toast.info("You must have at least one item.");
      return;
    }
    setNuqsItems(currentItems.filter(item => item.id !== id));
  }, [currentItems, setNuqsItems]);

  const updateItem = useCallback((id: number, field: keyof InvoiceItemData, value: any) => {
    const newItems = currentItems.map((item): InvoiceItemData => {
      if (item.id === id) {
        let processedValue: string | number = value;
        if (field === 'quantity') {
          processedValue = Math.max(1, Number(value) || 1);
        } else if (field === 'tax') {
          processedValue = Math.max(0, Math.min(100, Number(value) || 0));
        } else if (field === 'unitPrice') {
          // Keep as string, allow empty or partial numbers during input
          processedValue = String(value); 
        } else if (field === 'name') {
          processedValue = String(value);
        }
        return { ...item, [field]: processedValue };
      }
      return item;
    });
    setNuqsItems(newItems);
  }, [currentItems, setNuqsItems]);

  // Handle form field changes - Update nuqs state
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const nuqsKey = name as keyof NuqsFormData;

    if (type === 'date') {
      const dateValue = value ? new Date(value + 'T00:00:00Z') : null; // Use Z to indicate UTC midnight
      setNuqsFormData({ [nuqsKey]: dateValue });
    } else if (name === 'paymentType') {
      const newPaymentType = value as 'crypto' | 'fiat';
      setNuqsFormData({
        paymentType: newPaymentType,
        currency: newPaymentType === 'crypto' ? 'USDC' : 'EUR',
        network: newPaymentType === 'crypto' ? 'base' : 'mainnet',
        bankDetails: newPaymentType === 'fiat' ? nuqsFormData.bankDetails : null,
      });
    } else if (name === 'currency' && nuqsFormData.paymentType === 'crypto') {
      setNuqsFormData({ currency: value, network: 'base' });
    } else if (name.startsWith('bankDetails.')) {
      const field = name.split('.')[1] as keyof NonNullable<BankDetails>; // Use NonNullable here
      setNuqsFormData({
        bankDetails: {
          ...(nuqsFormData.bankDetails ?? {}),
          [field]: value
        }
      });
    } else {
      // Check if key exists in NuqsFormData to avoid setting unrelated state
      if (nuqsKey in nuqsFormData) {
          setNuqsFormData({ [nuqsKey]: value });
      }
    }
  }, [setNuqsFormData, nuqsFormData.paymentType, nuqsFormData.bankDetails]);

  // --- Calculations --- Use nuqs state directly or via currentItems
  const calculateSubtotal = useCallback(() => {
    return currentItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);
  }, [currentItems]);

  const calculateTax = useCallback(() => {
    return currentItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const tax = Number(item.tax) || 0;
      return sum + (quantity * unitPrice * tax / 100);
    }, 0);
  }, [currentItems]);

  const getCurrencySymbol = useCallback(() => {
    // Could enhance this to show actual symbols (€, $, £) if needed
    return nuqsFormData.currency ?? ''
  }, [nuqsFormData.currency]);

  const calculateTotal = useCallback(() => {
    return calculateSubtotal() + calculateTax();
  }, [calculateSubtotal, calculateTax]);

  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isAlreadySubmitting = externalIsSubmitting ?? isSubmitting;
    if (isAlreadySubmitting) return;

    if (externalIsSubmitting === undefined) setIsSubmitting(true);

    try {
      // --- Validation --- Use nuqs state
      const { bankDetails, ...mainFormData } = nuqsFormData;
      const requiredFields: (keyof NuqsFormData)[] = ['invoiceNumber', 'issueDate', 'dueDate', 'sellerEmail', 'buyerEmail', 'currency', 'paymentType'];
      // Correctly check existence on the filtered mainFormData
      const missingFields = requiredFields.filter(field => !mainFormData[field as keyof typeof mainFormData]);
      if (missingFields.length > 0) {
          toast.error(`Please fill in required fields: ${missingFields.join(', ')}`);
          if (externalIsSubmitting === undefined) setIsSubmitting(false);
          return;
      }

      if (mainFormData.paymentType === 'fiat' && (!bankDetails?.accountHolder || !bankDetails?.iban || !bankDetails?.bic)) {
        toast.error('Fiat payments require Account Holder, IBAN, and BIC in Bank Details.');
        if (externalIsSubmitting === undefined) setIsSubmitting(false);
        return;
      }

      // Validate items more robustly using Zod schema again before submission
      const itemsValidation = invoiceItemsArrayZodSchema.safeParse(currentItems);
      if (!itemsValidation.success || currentItems.length === 0) {
          const errorMessages = itemsValidation.success ? ['At least one item required'] : itemsValidation.error.flatten().fieldErrors;
          console.error("Item validation failed on submit:", errorMessages);
          toast.error(`Invalid invoice items: ${JSON.stringify(errorMessages)}`);
          if (externalIsSubmitting === undefined) setIsSubmitting(false);
          return;
      }
      const validatedItems = itemsValidation.data; // Use validated data

      // Ensure dates are valid before formatting (should be guaranteed by parser/state type)
      const issueDateISO = mainFormData.issueDate!.toISOString();
      const dueDateISO = mainFormData.dueDate!.toISOString();

      // --- Construct Payload --- Map nuqs state to the backend schema
      const invoiceData = {
        meta: { format: 'rnf_invoice', version: '0.0.3' },
        creationDate: issueDateISO,
        invoiceNumber: mainFormData.invoiceNumber,
        network: mainFormData.network ?? (mainFormData.paymentType === 'crypto' ? 'base' : 'mainnet'),
        sellerInfo: {
          businessName: mainFormData.sellerBusinessName || '',
          email: mainFormData.sellerEmail,
          address: {
            'street-address': mainFormData.sellerAddress || '',
            locality: mainFormData.sellerCity || '',
            'postal-code': mainFormData.sellerPostalCode || '',
            'country-name': mainFormData.sellerCountry || '',
          },
        },
        buyerInfo: {
          businessName: mainFormData.buyerBusinessName || '',
          email: mainFormData.buyerEmail,
          address: {
            'street-address': mainFormData.buyerAddress || '',
            locality: mainFormData.buyerCity || '',
            'postal-code': mainFormData.buyerPostalCode || '',
            'country-name': mainFormData.buyerCountry || '',
          },
        },
        invoiceItems: validatedItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice, // Send as standard string (e.g., "100.50")
          currency: mainFormData.currency,
          tax: {
            type: "percentage" as const,
            amount: item.tax.toString(),
          },
        })),
        paymentTerms: {
          dueDate: dueDateISO,
          // Removed paymentType and bankDetails from here
          // ...(mainFormData.paymentType === 'fiat' && bankDetails && {
          //   bankDetails: {
          //     accountHolder: bankDetails.accountHolder || '', // Ensure string
          //     iban: bankDetails.iban || '', // Ensure string
          //     bic: bankDetails.bic || '', // Ensure string
          //     bankName: bankDetails.bankName || undefined, // bankName can be optional
          //   },
          // }),
          // ...(mainFormData.paymentType === 'crypto' && {
          //   currency: mainFormData.currency || '', 
          //   network: mainFormData.network || '', 
          // }),
        },
        note: mainFormData.note || '',
        terms: mainFormData.terms || '',
        // Top-level fields expected by the backend schema:
        currency: mainFormData.currency,
        paymentType: mainFormData.paymentType,
        bankDetails: mainFormData.paymentType === 'fiat' ? bankDetails : undefined,
      };

      // --- Submission Logic ---
      if (onSubmit) {
        onSubmit(invoiceData);
        // Parent should handle resetting submitting state
        return;
      }

      console.log("Submitting invoice data:", invoiceData);
      const result = await trpcCreateInvoice(invoiceData);

      // Success handling simplified: Only shows toast and redirects
      toast.success('Invoice draft saved successfully! Commit to Request Network next.');

      // Redirect to the newly created invoice detail page using the database ID
      router.push(`/dashboard/invoice/${result.invoiceId}`);

    } catch (error: any) {
      console.error('0xHypr', 'Failed to create invoice:', error);
      let errorMessage = 'Failed to create invoice.';
      if (error instanceof Error) errorMessage = error.message;
      else if (typeof error === 'string') errorMessage = error;
      else if (error?.message) errorMessage = error.message;
      // Handle potential TRPC Zod errors
      if (error?.data?.zodError?.fieldErrors) {
        const fieldErrors = Object.entries(error.data.zodError.fieldErrors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        errorMessage = `Invalid input: ${fieldErrors}`;
      }
      toast.error(errorMessage);
    } finally {
      if (externalIsSubmitting === undefined) setIsSubmitting(false);
    }
  };

  const submitting = externalIsSubmitting ?? isSubmitting;

  // Format date for input type="date" (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    try {
      // Use UTC methods to avoid timezone shifting the date during formatting
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = date.getUTCDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error("Error formatting date:", date, e);
      return '';
    }
  };

  // --- Main Form Render --- Use nuqsFormData and currentItems
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="space-y-8">
          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <input
                id="invoiceNumber"
                type="text"
                name="invoiceNumber"
                value={nuqsFormData.invoiceNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
              <input
                id="issueDate"
                type="date"
                name="issueDate"
                value={formatDateForInput(nuqsFormData.issueDate)}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={formatDateForInput(nuqsFormData.dueDate)}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Seller Info */}
          <div>
            <h4 className="text-md font-medium mb-3">Your Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label htmlFor="sellerBusinessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                 <input
                   id="sellerBusinessName"
                   type="text"
                   name="sellerBusinessName"
                   value={nuqsFormData.sellerBusinessName}
                   onChange={handleChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
                   required // Assuming seller name is required
                 />
               </div>
               <div>
                 <label htmlFor="sellerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                 <input
                   id="sellerEmail"
                   type="email"
                   name="sellerEmail"
                   value={nuqsFormData.sellerEmail}
                   onChange={handleChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
                   required
                 />
               </div>
               <div className="md:col-span-2">
                 <label htmlFor="sellerAddress" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                 <input
                   id="sellerAddress"
                   type="text"
                   name="sellerAddress"
                   value={nuqsFormData.sellerAddress}
                   onChange={handleChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
                 />
               </div>
               <div>
                 <label htmlFor="sellerCity" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                 <input
                   id="sellerCity"
                   type="text"
                   name="sellerCity"
                   value={nuqsFormData.sellerCity}
                   onChange={handleChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label htmlFor="sellerPostalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                   <input
                     id="sellerPostalCode"
                     type="text"
                     name="sellerPostalCode"
                     value={nuqsFormData.sellerPostalCode}
                     onChange={handleChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
                   />
                 </div>
                 <div>
                   <label htmlFor="sellerCountry" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                   <input
                     id="sellerCountry"
                     type="text"
                     name="sellerCountry"
                     value={nuqsFormData.sellerCountry}
                     onChange={handleChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
                   />
                 </div>
               </div>
             </div>
          </div>

          {/* Client Info */}
          <div>
             <h4 className="text-md font-medium mb-3">Client Information</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label htmlFor="buyerBusinessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                 <input
                   id="buyerBusinessName"
                   type="text"
                   name="buyerBusinessName"
                   value={nuqsFormData.buyerBusinessName}
                   onChange={handleChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
                 />
               </div>
               <div>
                 <label htmlFor="buyerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                 <input
                   id="buyerEmail"
                   type="email"
                   name="buyerEmail"
                   value={nuqsFormData.buyerEmail}
                   onChange={handleChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
                   required
                 />
               </div>
               <div className="md:col-span-2">
                 <label htmlFor="buyerAddress" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                 <input
                   id="buyerAddress"
                   type="text"
                   name="buyerAddress"
                   value={nuqsFormData.buyerAddress}
                   onChange={handleChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
                 />
               </div>
               <div>
                 <label htmlFor="buyerCity" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                 <input
                   id="buyerCity"
                   type="text"
                   name="buyerCity"
                   value={nuqsFormData.buyerCity}
                   onChange={handleChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label htmlFor="buyerPostalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                   <input
                     id="buyerPostalCode"
                     type="text"
                     name="buyerPostalCode"
                     value={nuqsFormData.buyerPostalCode}
                     onChange={handleChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
                   />
                 </div>
                 <div>
                   <label htmlFor="buyerCountry" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                   <input
                     id="buyerCountry"
                     type="text"
                     name="buyerCountry"
                     value={nuqsFormData.buyerCountry}
                     onChange={handleChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
                   />
                 </div>
               </div>
             </div>
          </div>

          {/* Payment Details */}
          <div>
            <h4 className="text-md font-medium mb-3">Payment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <select
                  id="paymentType"
                  name="paymentType"
                  value={nuqsFormData.paymentType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="crypto">Cryptocurrency</option>
                  <option value="fiat">Fiat Currency</option>
                </select>
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                {nuqsFormData.paymentType === 'crypto' ? (
                  <>
                    <select
                      id="currency"
                      name="currency"
                      value={nuqsFormData.currency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="USDC">USDC on Base Network</option>
                      <option value="ETH">ETH on Base Network</option>
                    </select>
                    <p className="text-xs mt-1 text-gray-500">Base network provides lower transaction fees.</p>
                  </>
                ) : (
                  <select
                    id="currency"
                    name="currency"
                    value={nuqsFormData.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="EUR">EUR - Euro</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                )}
              </div>
            </div>

            {/* Bank Details for Fiat Payments */} 
            {nuqsFormData.paymentType === 'fiat' && (
              <div className="border rounded-md p-4 bg-gray-50">
                 <h4 className="text-md font-medium mb-2">Bank Details</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label htmlFor="bankDetails.accountHolder" className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
                     <input
                       id="bankDetails.accountHolder"
                       type="text"
                       name="bankDetails.accountHolder"
                       value={nuqsFormData.bankDetails?.accountHolder ?? ''}
                       onChange={handleChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
                       required={nuqsFormData.paymentType === 'fiat'}
                     />
                   </div>
                   <div>
                     <label htmlFor="bankDetails.iban" className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                     <input
                       id="bankDetails.iban"
                       type="text"
                       name="bankDetails.iban"
                       value={nuqsFormData.bankDetails?.iban ?? ''}
                       onChange={handleChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
                       required={nuqsFormData.paymentType === 'fiat'}
                     />
                   </div>
                   <div>
                     <label htmlFor="bankDetails.bic" className="block text-sm font-medium text-gray-700 mb-1">BIC/SWIFT</label>
                     <input
                       id="bankDetails.bic"
                       type="text"
                       name="bankDetails.bic"
                       value={nuqsFormData.bankDetails?.bic ?? ''}
                       onChange={handleChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
                       required={nuqsFormData.paymentType === 'fiat'}
                     />
                   </div>
                   <div>
                     <label htmlFor="bankDetails.bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                     <input
                       id="bankDetails.bankName"
                       type="text"
                       name="bankDetails.bankName"
                       value={nuqsFormData.bankDetails?.bankName ?? ''}
                       onChange={handleChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
                     />
                   </div>
                 </div>
               </div>
            )}
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium">Invoice Items</h4>
              <button
                type="button"
                className="text-sm px-3 py-1 border border-gray-300 rounded flex items-center hover:bg-gray-50"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </button>
            </div>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Qty</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Price</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Tax %</th>
                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Total (incl. Tax)</th>
                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-10"></th>
                   </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((item, index) => (
                    <tr key={item.id ?? `item-${index}`}> {/* Ensure key exists */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          aria-label={`Item ${index + 1} description`}
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          placeholder="Item description"
                          className="w-full border-0 focus:ring-0 p-2"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          aria-label={`Item ${index + 1} quantity`}
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                          min="1"
                          className="w-full border-0 focus:ring-0 p-2 text-right"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text" // Use text for better UX with decimals
                          aria-label={`Item ${index + 1} unit price`}
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                          placeholder="0.00"
                          className="w-full border-0 focus:ring-0 p-2 text-right"
                          required
                          inputMode="decimal" // Hint for mobile keyboards
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          aria-label={`Item ${index + 1} tax percentage`}
                          value={item.tax}
                          onChange={(e) => updateItem(item.id, 'tax', e.target.value)}
                          min="0"
                          max="100"
                          step="0.01" // Allow decimal tax rates
                          className="w-full border-0 focus:ring-0 p-2 text-right"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {getCurrencySymbol()}{' '}
                        {((Number(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0) * (1 + (Number(item.tax) || 0) / 100)).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                          disabled={currentItems.length <= 1}
                          aria-label={`Remove item ${item.name || index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Totals */} 
            <div className="mt-4 border-t pt-4">
               <div className="flex justify-end text-right">
                 <div className="w-56">
                   <div className="flex justify-between py-1">
                     <span className="text-sm text-gray-600">Subtotal:</span>
                     <span className="font-medium">{getCurrencySymbol()} {calculateSubtotal().toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between py-1">
                     <span className="text-sm text-gray-600">Tax:</span>
                     <span className="font-medium">{getCurrencySymbol()} {calculateTax().toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
                     <span className="font-medium text-lg">Total:</span>
                     <span className="font-bold text-lg">{getCurrencySymbol()} {calculateTotal().toFixed(2)}</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          {/* Notes and Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Note to Client</label>
               <textarea
                 id="note"
                 name="note"
                 value={nuqsFormData.note}
                 onChange={handleChange}
                 rows={3}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
                 placeholder="Thank you for your business"
               ></textarea>
             </div>
             <div>
               <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">Terms and Conditions</label>
               <textarea
                 id="terms"
                 name="terms"
                 value={nuqsFormData.terms}
                 onChange={handleChange}
                 rows={3}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
                 placeholder="Payment terms, late fees, etc."
               ></textarea>
             </div>
           </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className={`px-6 py-2 rounded-md font-medium flex items-center transition-colors ${
                submitting
                  ? "bg-blue-600 text-white opacity-80 cursor-wait"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Invoice...
                </>
              ) : (
                'Create Invoice'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
});

InvoiceForm.displayName = 'InvoiceForm';
