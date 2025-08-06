'use client';

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import {
  useInvoiceStore,
  InvoiceFormData,
  InvoiceItemData,
} from '@/lib/store/invoice-store';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { api as trpc } from '@/trpc/react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { RouterOutputs } from '@/utils/trpc';
import { type invoiceDataSchema } from '../../server/routers/invoice-router';

// Define Zod schema for InvoiceItemData
const invoiceItemZodSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: 'Unit price must be a non-negative number',
    }),
  tax: z.number().min(0).max(100), // Tax percentage
});

// Define Zod schema for the array of items
const invoiceItemsArrayZodSchema = z.array(invoiceItemZodSchema);

// Define Zod schema for BankDetails
const bankDetailsZodSchema = z
  .object({
    accountType: z.enum(['us', 'iban']).optional(),
    accountHolder: z.string().optional(),
    bankName: z.string().optional(),
    // US ACH fields
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    // IBAN fields
    iban: z.string().optional(),
    bic: z.string().optional(),
  })
  .nullable(); // Allow null

// Type for BankDetails (matching the structure, optional fields, nullable)
type BankDetails = z.infer<typeof bankDetailsZodSchema>;

// Type for the listFundingSources query output
type FundingSourceListItem =
  RouterOutputs['fundingSource']['listFundingSources'][number];

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
  bankDetails: BankDetails | null;
};

// Restore Custom parser for invoice items using createParser and Zod
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
        console.error(
          'Zod validation failed for invoice items:',
          validationResult.error.flatten(),
        );
        return null; // Indicate parsing/validation failure
      }
    } catch (error) {
      console.error('Failed to parse invoice items JSON:', error);
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
    console.warn(
      'Attempted to serialize invalid invoice items, returning empty string.',
      items,
    );
    return ''; // Remove param if invalid
  },
});

// Restore Custom parser for bank details using createParser and Zod
const parseAsBankDetails: Parser<BankDetails | null> = createParser({
  parse(value) {
    try {
      // Handle empty string or explicit 'null' as null
      if (!value || value === 'null') return null;
      const parsed = JSON.parse(value);
      // Basic validation: Check if it's an object (and not null)
      if (typeof parsed === 'object' && parsed !== null) {
        // Optionally add more robust Zod validation here if needed
        return parsed as BankDetails;
      }
      return null; // Invalid format
    } catch {
      return null; // Not valid JSON
    }
  },
  serialize(value: BankDetails | null) {
    // Serialize null explicitly or handle based on preference
    if (value === null) return 'null'; // Or return '' to remove param
    // Only serialize if it's a non-empty object
    if (value && typeof value === 'object' && Object.keys(value).length > 0) {
      // Optionally add Zod validation before stringifying
      return JSON.stringify(value);
    }
    return ''; // Represent empty object or undefined as empty string
  },
});

export const InvoiceForm = forwardRef<unknown, InvoiceFormProps>(
  ({ onSubmit, isSubmitting: externalIsSubmitting }, ref) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Create tRPC mutation
    const createInvoiceMutation = trpc.invoice.create.useMutation({
      onSuccess: () => {
        toast.success('Invoice created successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to create invoice: ${error.message}`);
      },
    });
    
    // State for managing bank details input mode
    const [bankDetailsMode, setBankDetailsMode] = useState<'manual' | 'select'>(
      'manual',
    );
    // State for storing the ID of the selected saved funding source
    const [selectedFundingSourceId, setSelectedFundingSourceId] = useState<
      string | null
    >(null);
    // *** Local state for managing the active bank details ***
    const [localBankDetails, setLocalBankDetails] =
      useState<BankDetails | null>(null);

    // Fetch saved funding sources
    const { data: savedFundingSources, isLoading: isLoadingFundingSources } =
      trpc.fundingSource.listFundingSources.useQuery(undefined, {
        // Only fetch if payment type is fiat (or maybe always fetch?)
        // enabled: nuqsFormData.paymentType === 'fiat', // Consider fetching always for quicker switching
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      });

    // Zustand store for initial defaults and potentially detected data
    const {
      formData: storeFormData,
      invoiceItems: storeInvoiceItems,
      updateFormData: updateStoreFormData, // Keep for sync if needed
      updateInvoiceItems: updateStoreInvoiceItems, // Keep for sync if needed
      detectedInvoiceData,
    } = useInvoiceStore();

    // --- nuqs State Management ---
    const [nuqsFormData, setNuqsFormData] = useQueryStates(
      {
        // Define the schema using the base parsers
        invoiceNumber: parseAsString,
        issueDate: parseAsIsoDateTime,
        dueDate: parseAsIsoDateTime,
        sellerBusinessName: parseAsString,
        sellerEmail: parseAsString,
        sellerAddress: parseAsString,
        sellerCity: parseAsString,
        sellerPostalCode: parseAsString,
        sellerCountry: parseAsString,
        buyerBusinessName: parseAsString,
        buyerEmail: parseAsString,
        buyerAddress: parseAsString,
        buyerCity: parseAsString,
        buyerPostalCode: parseAsString,
        buyerCountry: parseAsString,
        paymentType: parseAsStringEnum(['crypto', 'fiat'] as const),
        currency: parseAsString,
        network: parseAsString,
        note: parseAsString,
        terms: parseAsString,
        bankDetails: parseAsBankDetails, // Use the custom parser
      },
      // Provide options in the second argument
      {
        history: 'replace',
        shallow: true,
      },
    );

    const [nuqsItems, setNuqsItems] = useQueryState(
      'items',
      parseAsInvoiceItems.withOptions({ history: 'replace', shallow: true }),
    );

    // --- Set Initial Defaults / Sync URL Bank Details to Local State ---
    useEffect(() => {
      // Apply defaults from storeFormData to nuqs state if URL params are missing
      const initialNuqsValues: Partial<NuqsFormData> = {};
      let needsNuqsUpdate = false;

      // Type guard to ensure the key is valid for NuqsFormData (excluding bankDetails)
      function isValidNuqsKey(
        key: string,
      ): key is keyof Omit<NuqsFormData, 'bankDetails'> {
        return key !== 'bankDetails' && key in nuqsFormData;
      }

      // Iterate over keys managed by nuqs (excluding bankDetails)
      (Object.keys(nuqsFormData) as Array<keyof NuqsFormData>).forEach(
        (key) => {
          if (!isValidNuqsKey(key)) return; // Skip bankDetails or invalid keys

          if (nuqsFormData[key] === null) {
            const storeValue = storeFormData[key as keyof InvoiceFormData]; // Map to store key
            if (storeValue !== undefined && storeValue !== null) {
              if (key === 'issueDate' || key === 'dueDate') {
                initialNuqsValues[key] = new Date(storeValue as string);
              } else if (key === 'paymentType') {
                initialNuqsValues[key] =
                  storeValue === 'fiat' ? 'fiat' : 'crypto';
              } else {
                // For string types, ensure we pass a string, even if empty
                initialNuqsValues[key] = String(storeValue || '');
              }
              needsNuqsUpdate = true;
            }
            // If store value is also null/undefined, we might still need to set a default non-null value
            // based on parser type, e.g., empty string for parseAsString.
            else if (key !== 'network') {
              // Allow network to remain null/undefined if not set
              if (key === 'issueDate' || key === 'dueDate') {
                initialNuqsValues[key] = new Date(); // Default to now if store is null
              } else if (key === 'paymentType') {
                initialNuqsValues[key] = 'crypto'; // Default payment type
              } else if (key === 'currency') {
                initialNuqsValues[key] = 'USDC'; // Default currency
              } else {
                initialNuqsValues[key] = ''; // Default to empty string for other string fields
              }
              needsNuqsUpdate = true;
            }
          }
        },
      );

      if (needsNuqsUpdate) {
        setNuqsFormData(initialNuqsValues);
      }

      // Sync initial bankDetails from URL (via nuqs) to local state ONCE
      if (nuqsFormData.bankDetails !== undefined && localBankDetails === null) {
        // Check if nuqs has value and local hasn't been set
        setLocalBankDetails(nuqsFormData.bankDetails);
        // If URL provides bank details, assume manual mode initially?
        // Or try to match with saved sources? For simplicity, assume manual.
        if (nuqsFormData.bankDetails) {
          setBankDetailsMode('manual');
        }
      }

      // Dependencies: nuqsFormData object to react to URL changes, storeFormData for defaults
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nuqsFormData, storeFormData]);

    // --- Synchronization: nuqs -> Zustand (Removed - local state is primary now) ---
    useEffect(() => {
      // This effect syncs the URL state (nuqs) TO the Zustand store.
      // If nuqs is the source of truth for the form, this might be removable
      // unless other components rely on the Zustand store being up-to-date.
      const nuqsDataForStore: Partial<InvoiceFormData> = {
        invoiceNumber: nuqsFormData.invoiceNumber ?? '',
        issueDate:
          nuqsFormData.issueDate instanceof Date
            ? nuqsFormData.issueDate.toISOString().split('T')[0]
            : '',
        dueDate:
          nuqsFormData.dueDate instanceof Date
            ? nuqsFormData.dueDate.toISOString().split('T')[0]
            : '',
        sellerBusinessName: nuqsFormData.sellerBusinessName ?? '',
        sellerEmail: nuqsFormData.sellerEmail ?? '',
        sellerAddress: nuqsFormData.sellerAddress ?? '',
        sellerCity: nuqsFormData.sellerCity ?? '',
        sellerPostalCode: nuqsFormData.sellerPostalCode ?? '',
        sellerCountry: nuqsFormData.sellerCountry ?? '',
        buyerBusinessName: nuqsFormData.buyerBusinessName ?? '',
        buyerEmail: nuqsFormData.buyerEmail ?? '',
        buyerAddress: nuqsFormData.buyerAddress ?? '',
        buyerCity: nuqsFormData.buyerCity ?? '',
        buyerPostalCode: nuqsFormData.buyerPostalCode ?? '',
        buyerCountry: nuqsFormData.buyerCountry ?? '',
        paymentType: nuqsFormData.paymentType ?? 'crypto', // Default to crypto if null
        currency: nuqsFormData.currency ?? 'USDC', // Default currency if null
        network: nuqsFormData.network ?? '',
        note: nuqsFormData.note ?? '',
        terms: nuqsFormData.terms ?? '',
        bankDetails: nuqsFormData.bankDetails, // Types should align now
      };

      // Compare effectively, avoiding unnecessary updates
      const storeDataForCompare = { ...storeFormData }; // Make a copy to avoid mutation issues if any
      let needsStoreUpdate = false;
      for (const key in nuqsDataForStore) {
        const typedKey = key as keyof InvoiceFormData;
        if (
          JSON.stringify(nuqsDataForStore[typedKey]) !==
          JSON.stringify(storeDataForCompare[typedKey])
        ) {
          needsStoreUpdate = true;
          break;
        }
      }
      if (needsStoreUpdate) {
        console.log('Syncing nuqsFormData to Zustand store');
        updateStoreFormData({
          ...nuqsDataForStore, // contains other mapped fields
          bankDetails: nuqsFormData.bankDetails, // Use the potentially null value
        });
      }

      const currentNuqsItems = nuqsItems ?? [];
      if (
        JSON.stringify(currentNuqsItems) !== JSON.stringify(storeInvoiceItems)
      ) {
        console.log('Syncing nuqsItems to Zustand store');
        updateStoreInvoiceItems(currentNuqsItems);
      }
    }, [
      /* Dependencies: nuqsFormData properties, nuqsItems, store updaters */
      nuqsFormData.invoiceNumber,
      nuqsFormData.issueDate,
      nuqsFormData.dueDate,
      nuqsFormData.sellerBusinessName,
      nuqsFormData.sellerEmail,
      nuqsFormData.sellerAddress,
      nuqsFormData.sellerCity,
      nuqsFormData.sellerPostalCode,
      nuqsFormData.sellerCountry,
      nuqsFormData.buyerBusinessName,
      nuqsFormData.buyerEmail,
      nuqsFormData.buyerAddress,
      nuqsFormData.buyerCity,
      nuqsFormData.buyerPostalCode,
      nuqsFormData.buyerCountry,
      nuqsFormData.paymentType,
      nuqsFormData.currency,
      nuqsFormData.network,
      nuqsFormData.note,
      nuqsFormData.terms,
      nuqsFormData.bankDetails,
      nuqsItems,
      updateStoreFormData,
      updateStoreInvoiceItems,
      storeInvoiceItems, // Removed storeFormData from deps to break potential loops
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
        console.log(
          'Applying detected invoice data to nuqs state:',
          detectedInvoiceData,
        );
        // We may receive nested structures like buyerInfo, sellerInfo, paymentTerms.
        // We'll flatten them into the fields expected by `nuqsFormData`.

        const { invoiceItems: items, ...rest } = detectedInvoiceData as any;

        const nuqsUpdateData: Partial<NuqsFormData> = {};

        // 1️⃣  Top-level simple fields that match directly.
        const simpleFields: (keyof NuqsFormData)[] = [
          'invoiceNumber',
          'note',
          'terms',
          'currency',
          'network',
        ];
        simpleFields.forEach((field) => {
          if (rest[field] && !nuqsFormData[field]) {
            (nuqsUpdateData as any)[field] = rest[field];
          }
        });

        // 2️⃣  Dates – issueDate / dueDate can come from issuedAt or paymentTerms.dueDate.
        if (!nuqsFormData.issueDate && rest.issuedAt) {
          nuqsUpdateData.issueDate = new Date(rest.issuedAt);
        }
        if (!nuqsFormData.dueDate) {
          const due =
            rest.dueDate ||
            (typeof detectedInvoiceData.paymentTerms === 'object' &&
              detectedInvoiceData.paymentTerms?.dueDate);
          if (typeof due === 'string') {
            nuqsUpdateData.dueDate = new Date(due);
          }
        }

        // 3️⃣  Buyer info (only set if blank so we don't overwrite user edits).
        const buyer = detectedInvoiceData.buyerInfo ?? {};
        if (!nuqsFormData.buyerBusinessName && buyer.businessName) {
          nuqsUpdateData.buyerBusinessName = buyer.businessName;
        }
        if (!nuqsFormData.buyerEmail && buyer.email) {
          nuqsUpdateData.buyerEmail = buyer.email;
        }
        if (buyer.address) {
          const addr = buyer.address;
          if (typeof addr === 'object') {
            const street = (addr as any)['street-address'];
            const locality = (addr as any)['locality'];
            const postal = (addr as any)['postal-code'];
            const country = (addr as any)['country-name'];

            if (!nuqsFormData.buyerAddress && street) {
              nuqsUpdateData.buyerAddress = street;
            }
            if (!nuqsFormData.buyerCity && locality) {
              nuqsUpdateData.buyerCity = locality;
            }
            if (!nuqsFormData.buyerPostalCode && postal) {
              nuqsUpdateData.buyerPostalCode = postal;
            }
            if (!nuqsFormData.buyerCountry && country) {
              nuqsUpdateData.buyerCountry = country;
            }
          }
        }

        // 4️⃣  Infer paymentType from currency.
        if (!nuqsFormData.paymentType && detectedInvoiceData.currency) {
          const upper = detectedInvoiceData.currency.toUpperCase();
          nuqsUpdateData.paymentType = (upper === 'USDC' || upper === 'ETH')
            ? 'crypto'
            : (['EUR', 'USD', 'GBP'].includes(upper) ? 'fiat' : undefined);
        }

        // 5️⃣  Apply all collected updates – only if we actually have something.
        if (Object.keys(nuqsUpdateData).length > 0) {
          setNuqsFormData(nuqsUpdateData);
        }

        if (items && Array.isArray(items) && items.length > 0) {
          const itemsWithIds = items.map((item: any, index: number) => {
            // Coerce & sanitise fields so the Zod schema passes.
            const safeQuantity = Number(item.quantity);
            const parsedPrice = parseFloat(item.unitPrice ?? '');

            return {
              id: item.id ?? Date.now() + index,
              name: item.name || 'Item',
              quantity: isFinite(safeQuantity) && safeQuantity > 0 ? safeQuantity : 1,
              tax: isFinite(Number(item.tax)) ? Number(item.tax) : 0,
              // Zod expects a numeric string; fallback to "0" if we can't parse
              unitPrice: isFinite(parsedPrice) && parsedPrice >= 0 ? String(parsedPrice) : '0',
            } as InvoiceItemData;
          });
          // Validate before setting
          const validation = invoiceItemsArrayZodSchema.safeParse(itemsWithIds);
          if (validation.success) {
            setNuqsItems(validation.data);
          } else {
            console.error(
              'Detected items failed validation:',
              validation.error.flatten(),
            );
            toast.error('Could not apply detected items due to invalid data.');
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

    const removeItem = useCallback(
      (id: number) => {
        if (currentItems.length <= 1) {
          toast.info('You must have at least one item.');
          return;
        }
        setNuqsItems(currentItems.filter((item) => item.id !== id));
      },
      [currentItems, setNuqsItems],
    );

    const updateItem = useCallback(
      (id: number, field: keyof InvoiceItemData, value: any) => {
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
      },
      [currentItems, setNuqsItems],
    );

    // Handle form field changes - Update nuqs state
    const handleChange = useCallback(
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const { name, value, type } = e.target;
        const nuqsKey = name as keyof NuqsFormData;

        // Handle fields managed by nuqs directly
        if (type === 'date') {
          const dateValue = value ? new Date(value + 'T00:00:00Z') : null;
          setNuqsFormData({ [nuqsKey]: dateValue });
        } else if (name === 'paymentType') {
          const newPaymentType = value as 'crypto' | 'fiat';
          setNuqsFormData({
            paymentType: newPaymentType,
            currency: newPaymentType === 'crypto' ? 'USDC' : 'EUR', // Default currency
            network: newPaymentType === 'crypto' ? 'base' : '', // Default network
          });
          // Reset bank details state when switching payment type
          setLocalBankDetails(
            newPaymentType === 'fiat' ? { accountType: 'us' } : null,
          );
          setSelectedFundingSourceId(null);
          setBankDetailsMode('manual'); // Default to manual when switching to fiat
        } else if (name === 'currency') {
          // Handle currency changes based on payment type
          if (nuqsFormData.paymentType === 'crypto') {
            setNuqsFormData({ currency: value, network: 'base' }); // Assume Base for crypto
          } else {
            setNuqsFormData({ currency: value }); // Just update currency for fiat
          }
          // Handle bank detail fields (update LOCAL state only if in manual mode)
        } else if (
          name.startsWith('bankDetails.') &&
          bankDetailsMode === 'manual'
        ) {
          const field = name.split('.')[1] as keyof BankDetails;
          const currentBankDetails = localBankDetails ?? {};
          let updatedBankDetails: BankDetails = {
            ...currentBankDetails,
            [field]: value,
          };

          // Clear fields when switching accountType within bankDetails (in manual mode)
          if (field === 'accountType') {
            if (value === 'us') {
              delete updatedBankDetails.iban;
              delete updatedBankDetails.bic;
            } else if (value === 'iban') {
              delete updatedBankDetails.accountNumber;
              delete updatedBankDetails.routingNumber;
            }
          }
          setLocalBankDetails(updatedBankDetails);
        } else if (
          Object.prototype.hasOwnProperty.call(nuqsFormData, nuqsKey) &&
          nuqsKey !== 'bankDetails'
        ) {
          // Handle other top-level form fields managed by nuqs
          const keyToSet = nuqsKey as Exclude<
            keyof NuqsFormData,
            'bankDetails'
          >;
          setNuqsFormData({ [keyToSet]: value });
        }
      },
      // Dependencies updated
      [
        setNuqsFormData,
        nuqsFormData.paymentType,
        bankDetailsMode,
        localBankDetails,
      ],
    );

    // Specific handler for Select components used for bankDetails fields (like accountType)
    const handleBankDetailSelectChange = useCallback(
      (name: keyof BankDetails, value: string) => {
        if (bankDetailsMode !== 'manual') return; // Only act in manual mode

        setLocalBankDetails((prevDetails) => {
          const currentBankDetails = prevDetails ?? {};
          let updatedBankDetails: BankDetails = {
            ...currentBankDetails,
            [name]: value, // Directly use the name and value
          };

          // Clear fields when switching accountType
          if (name === 'accountType') {
            if (value === 'us') {
              delete updatedBankDetails.iban;
              delete updatedBankDetails.bic;
            } else if (value === 'iban') {
              delete updatedBankDetails.accountNumber;
              delete updatedBankDetails.routingNumber;
            }
          }
          return updatedBankDetails;
        });
      },
      [bankDetailsMode, setLocalBankDetails], // Updated dependencies
    );

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
        return sum + (quantity * unitPrice * tax) / 100;
      }, 0);
    }, [currentItems]);

    const getCurrencySymbol = useCallback(() => {
      // Could enhance this to show actual symbols (€, $, £) if needed
      return nuqsFormData.currency ?? '';
    }, [nuqsFormData.currency]);

    const calculateTotal = useCallback(() => {
      return calculateSubtotal() + calculateTax();
    }, [calculateSubtotal, calculateTax]);

    // --- Handler for selecting a saved funding source ---
    const handleSavedAccountSelect = useCallback(
      (selectedId: string) => {
        setSelectedFundingSourceId(selectedId);
        const selectedSource = savedFundingSources?.find(
          (source) => source.id === selectedId,
        );

        if (selectedSource) {
          // Map the selected source details to the BankDetails structure
          // Normalize accountType for form compatibility
          let formAccountType: 'us' | 'iban' | undefined;
          if (selectedSource.accountType === 'iban') {
            formAccountType = 'iban';
          } else if (
            ['us_ach', 'uk_details'].includes(selectedSource.accountType ?? '')
          ) {
            formAccountType = 'us'; // Treat US ACH and UK Details as 'us' for form selection
          } // 'other' or null/undefined maps to undefined

          const newBankDetails: BankDetails = {
            accountType: formAccountType,
            accountHolder: selectedSource.accountHolder ?? undefined,
            bankName: selectedSource.bankName ?? undefined,
            // US details
            accountNumber: selectedSource.accountNumber ?? undefined,
            routingNumber: selectedSource.routingNumber ?? undefined,
            // IBAN details
            iban: selectedSource.iban ?? undefined,
            bic: selectedSource.bic ?? undefined,
          };
          console.log(
            'Mapped bank details from selected source:',
            newBankDetails,
          );
          // Update LOCAL bank details state
          setLocalBankDetails(newBankDetails);
        } else {
          // Handle case where selected source not found (shouldn't happen ideally)
          setLocalBankDetails(null); // Reset local state
          setSelectedFundingSourceId(null); // Reset selection
        }
      },
      [savedFundingSources, setLocalBankDetails],
    ); // Update dependency

    // --- Form Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const isAlreadySubmitting = externalIsSubmitting ?? isSubmitting;
      if (isAlreadySubmitting) return;

      if (externalIsSubmitting === undefined) setIsSubmitting(true);
      
      // Show immediate feedback
      toast.loading('Creating invoice...', { id: 'invoice-creation' });

      try {
        // --- Validation --- Use nuqs state
        const { bankDetails, ...mainFormData } = nuqsFormData;
        const requiredFields: (keyof Omit<NuqsFormData, 'bankDetails'>)[] = [
          'invoiceNumber',
          'issueDate',
          'dueDate',
          'sellerEmail',
          'buyerEmail',
          'currency',
          'paymentType',
        ];
        const missingFields = requiredFields.filter(
          (field) => !mainFormData[field],
        );

        if (missingFields.length > 0) {
          toast.dismiss('invoice-creation');
          toast.error(
            `Please fill in required fields: ${missingFields.join(', ')}`,
          );
          if (externalIsSubmitting === undefined) setIsSubmitting(false);
          return;
        }

        // --- Bank Details Validation (Only if paymentType is 'fiat') ---
        let validatedBankDetails: BankDetails | undefined = undefined;
        if (mainFormData.paymentType === 'fiat') {
          // Use the LOCAL bank details state for validation
          validatedBankDetails = localBankDetails;

          // Re-validate the populated bankDetails
          if (
            !validatedBankDetails ||
            !validatedBankDetails.accountType ||
            !validatedBankDetails.accountHolder
          ) {
            toast.dismiss('invoice-creation');
            toast.error(
              'Fiat payments require Bank Account Type and Account Holder.',
            );
            if (externalIsSubmitting === undefined) setIsSubmitting(false);
            return;
          }
          // ... rest of bank details validation ...
        }
        // --- End Bank Details Validation ---

        // Validate items more robustly using Zod schema again before submission
        const itemsValidation =
          invoiceItemsArrayZodSchema.safeParse(currentItems);
        if (!itemsValidation.success || currentItems.length === 0) {
          const errorMessages = itemsValidation.success
            ? ['At least one item required']
            : itemsValidation.error.flatten().fieldErrors;
          console.error('Item validation failed on submit:', errorMessages);
          toast.dismiss('invoice-creation');
          toast.error(
            `Invalid invoice items: ${JSON.stringify(errorMessages)}`,
          );
          if (externalIsSubmitting === undefined) setIsSubmitting(false);
          return;
        }
        const validatedItems = itemsValidation.data; // Use validated data

        // Ensure dates are valid before formatting (should be guaranteed by parser/state type)
        const issueDateISO = mainFormData.issueDate!.toISOString();
        const dueDateISO = mainFormData.dueDate!.toISOString();

        // --- Construct Payload --- Map nuqs state to the backend schema
        const invoiceData: z.infer<typeof invoiceDataSchema> = {
          meta: { format: 'rnf_invoice', version: '0.0.3' },
          creationDate: issueDateISO,
          invoiceNumber: mainFormData.invoiceNumber ?? '', // Coalesce null to empty string
          network:
            mainFormData.network ??
            (mainFormData.paymentType === 'crypto' ? 'base' : 'mainnet'),
          sellerInfo: {
            businessName: mainFormData.sellerBusinessName ?? '',
            email: mainFormData.sellerEmail ?? '', // Coalesce null to empty string
            address: {
              'street-address': mainFormData.sellerAddress ?? '',
              locality: mainFormData.sellerCity ?? '',
              'postal-code': mainFormData.sellerPostalCode ?? '',
              'country-name': mainFormData.sellerCountry ?? '',
            },
          },
          buyerInfo: {
            businessName: mainFormData.buyerBusinessName ?? '',
            email: mainFormData.buyerEmail ?? '', // Coalesce null to empty string
            address: {
              'street-address': mainFormData.buyerAddress ?? '',
              locality: mainFormData.buyerCity ?? '',
              'postal-code': mainFormData.buyerPostalCode ?? '',
              'country-name': mainFormData.buyerCountry ?? '',
            },
          },
          invoiceItems: validatedItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice, // Send as standard string (e.g., "100.50")
            currency: mainFormData.currency ?? 'USDC', // Coalesce null currency
            tax: {
              type: 'percentage' as const,
              amount: item.tax.toString(),
            },
          })),
          paymentTerms: {
            dueDate: dueDateISO,
            // Bank details are now top-level
          },
          note: mainFormData.note ?? '',
          terms: mainFormData.terms ?? '',
          // Top-level fields expected by the backend schema:
          currency: mainFormData.currency ?? 'USDC', // Coalesce null currency
          paymentType: mainFormData.paymentType ?? 'crypto', // Coalesce null paymentType
          // Use LOCAL bank details for payload
          bankDetails:
            mainFormData.paymentType === 'fiat'
              ? (validatedBankDetails as any)
              : undefined,
        };

        // --- Submission Logic ---
        if (onSubmit) {
          onSubmit(invoiceData);
          // Parent should handle resetting submitting state
          return;
        }

        console.log('Submitting invoice data:', invoiceData);
        
        createInvoiceMutation.mutate(invoiceData, {
          onSuccess: (result) => {
            // Dismiss loading toast and show success
            toast.dismiss('invoice-creation');
            toast.success('Invoice created successfully!');

            // Redirect to the newly created invoice detail page using the database ID
            router.push(`/dashboard/invoices/${result.invoiceId}`);
          },
          onError: (error: any) => {
            // Dismiss loading toast
            toast.dismiss('invoice-creation');
            
            let errorMessage = 'Failed to create invoice.';
            if (error instanceof Error) errorMessage = error.message;
            else if (typeof error === 'string') errorMessage = error;
            else if (error?.message) errorMessage = error.message;
            // Handle potential TRPC Zod errors
            if (error?.data?.zodError?.fieldErrors) {
              const fieldErrors = Object.entries(error.data.zodError.fieldErrors)
                .map(
                  ([field, messages]) =>
                    `${field}: ${(messages as string[]).join(', ')}`,
                )
                .join('; ');
              errorMessage = `Invalid input: ${fieldErrors}`;
            }
            toast.error(errorMessage);
          },
        });
      } catch (error: any) {
        console.error('0xHypr', 'Failed to create invoice:', error);
        // Dismiss loading toast on unexpected errors
        toast.dismiss('invoice-creation');
        toast.error('An unexpected error occurred');
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
        console.error('Error formatting date:', date, e);
        return '';
      }
    };

    const foundingSources = useMemo(() => (savedFundingSources ?? []).filter((source) =>
      nuqsFormData.currency?.toUpperCase() === source.currency?.toUpperCase()), [nuqsFormData.currency, savedFundingSources]);
    
    // --- Main Form Render --- Use nuqsFormData and currentItems
    return (
      <div className="relative">
        {/* Loading Overlay */}
        {submitting && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900">Creating Invoice...</p>
                <p className="text-sm text-gray-600">This may take a moment</p>
              </div>
            </div>
          </div>
        )}
        
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="p-6">
          <div className="space-y-8">
            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <Label
                  htmlFor="invoiceNumber"
                  className="block text-sm font-medium text-gray-600 mb-1.5"
                >
                  Invoice Number
                </Label>
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={nuqsFormData.invoiceNumber ?? ''}
                  onChange={handleChange}
                  className="w-full border-gray-200 rounded-md"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="issueDate"
                  className="block text-sm font-medium text-gray-600 mb-1.5"
                >
                  Issue Date
                </Label>
                <Input
                  id="issueDate"
                  type="date"
                  name="issueDate"
                  value={formatDateForInput(nuqsFormData.issueDate)}
                  onChange={handleChange}
                  className="w-full border-gray-200 rounded-md"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-600 mb-1.5"
                >
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  value={formatDateForInput(nuqsFormData.dueDate)}
                  onChange={handleChange}
                  className="w-full border-gray-200 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Seller Info */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Your Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <Label
                    htmlFor="sellerBusinessName"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    Business Name
                  </Label>
                  <Input
                    id="sellerBusinessName"
                    name="sellerBusinessName"
                    value={nuqsFormData.sellerBusinessName ?? ''}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded-md"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="sellerEmail"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="sellerEmail"
                    type="email"
                    name="sellerEmail"
                    value={nuqsFormData.sellerEmail ?? ''}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded-md"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label
                    htmlFor="sellerAddress"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    Address
                  </Label>
                  <Input
                    id="sellerAddress"
                    name="sellerAddress"
                    value={nuqsFormData.sellerAddress ?? ''}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded-md"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="sellerCity"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    City
                  </Label>
                  <Input
                    id="sellerCity"
                    name="sellerCity"
                    value={nuqsFormData.sellerCity ?? ''}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="sellerPostalCode"
                      className="block text-sm font-medium text-gray-600 mb-1.5"
                    >
                      Postal Code
                    </Label>
                    <Input
                      id="sellerPostalCode"
                      name="sellerPostalCode"
                      value={nuqsFormData.sellerPostalCode ?? ''}
                      onChange={handleChange}
                      className="w-full border-gray-200 rounded-md"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="sellerCountry"
                      className="block text-sm font-medium text-gray-600 mb-1.5"
                    >
                      Country
                    </Label>
                    <Input
                      id="sellerCountry"
                      name="sellerCountry"
                      value={nuqsFormData.sellerCountry ?? ''}
                      onChange={handleChange}
                      className="w-full border-gray-200 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Client Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <Label
                    htmlFor="buyerBusinessName"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    Business Name
                  </Label>
                  <Input
                    id="buyerBusinessName"
                    name="buyerBusinessName"
                    value={nuqsFormData.buyerBusinessName ?? ''}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded-md"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="buyerEmail"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="buyerEmail"
                    type="email"
                    name="buyerEmail"
                    value={nuqsFormData.buyerEmail ?? ''}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded-md"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label
                    htmlFor="buyerAddress"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    Address
                  </Label>
                  <Input
                    id="buyerAddress"
                    name="buyerAddress"
                    value={nuqsFormData.buyerAddress ?? ''}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded-md"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="buyerCity"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    City
                  </Label>
                  <Input
                    id="buyerCity"
                    name="buyerCity"
                    value={nuqsFormData.buyerCity ?? ''}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="buyerPostalCode"
                      className="block text-sm font-medium text-gray-600 mb-1.5"
                    >
                      Postal Code
                    </Label>
                    <Input
                      id="buyerPostalCode"
                      name="buyerPostalCode"
                      value={nuqsFormData.buyerPostalCode ?? ''}
                      onChange={handleChange}
                      className="w-full border-gray-200 rounded-md"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="buyerCountry"
                      className="block text-sm font-medium text-gray-600 mb-1.5"
                    >
                      Country
                    </Label>
                    <Input
                      id="buyerCountry"
                      name="buyerCountry"
                      value={nuqsFormData.buyerCountry ?? ''}
                      onChange={handleChange}
                      className="w-full border-gray-200 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                <div>
                  <Label
                    htmlFor="paymentType"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    Payment Type
                  </Label>
                  <Select
                    value={nuqsFormData.paymentType ?? ''}
                    onValueChange={(value) =>
                      handleChange({
                        target: { name: 'paymentType', value, type: 'select' },
                      } as any)
                    }
                  >
                    <SelectTrigger className="w-full border-gray-200 rounded-md">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiat">Bank Transfer</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    Currency
                  </Label>
                  {nuqsFormData.paymentType === 'crypto' ? (
                    <>
                      <Select
                        value={nuqsFormData.currency ?? ''}
                        onValueChange={(value) =>
                          handleChange({
                            target: { name: 'currency', value, type: 'select' },
                          } as any)
                        }
                      >
                        <SelectTrigger className="w-full border-gray-200 rounded-md">
                          <SelectValue placeholder="Select crypto currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USDC">USDC on Base</SelectItem>
                          <SelectItem value="ETH">ETH on Base</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-600 mt-1.5">
                        Base network for lower fees.
                      </p>
                    </>
                  ) : (
                    <Select
                      value={nuqsFormData.currency ?? ''}
                      onValueChange={(value) => {
                        handleChange({
                          target: { name: 'currency', value, type: 'select' },
                        } as any)
                        if (bankDetailsMode === 'select') {
                          // Clear selection when changing currency
                          handleSavedAccountSelect(''); 
                        }
                      }}
                    >
                      <SelectTrigger className="w-full border-gray-200 rounded-md">
                        <SelectValue placeholder="Select fiat currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Bank Details for Fiat Payments - Conditional Rendering based on accountType */}
              {nuqsFormData.paymentType === 'fiat' && (
                <div className="border rounded-lg border-gray-200 p-4 bg-gray-50 space-y-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Recipient Bank Details
                  </h4>

                  {/* Mode Selector */}
                  <RadioGroup
                    value={bankDetailsMode}
                    onValueChange={(value: 'manual' | 'select') => {
                      setBankDetailsMode(value);
                      if (value === 'manual') {
                        setSelectedFundingSourceId(null); // Clear selection when switching to manual
                        // Reset local bank details to default manual state
                        setLocalBankDetails({ accountType: 'us' });
                      } else {
                        if (
                          savedFundingSources &&
                          savedFundingSources.length > 0
                        ) {
                          // Clear local bank details when switching TO select mode
                          setLocalBankDetails(null);
                          setSelectedFundingSourceId(null);
                        } else {
                          toast.info(
                            'No saved funding sources found. Please add one in settings or enter manually.',
                          );
                          setBankDetailsMode('manual');
                        }
                      }
                    }}
                    className="flex space-x-4 mb-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="bank-manual" />
                      <Label htmlFor="bank-manual">Enter Manually</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="select"
                        id="bank-select"
                        disabled={
                          isLoadingFundingSources ||
                          !savedFundingSources ||
                          savedFundingSources.length === 0
                        }
                      />
                      <Label
                        htmlFor="bank-select"
                        className={
                          !savedFundingSources ||
                          savedFundingSources.length === 0
                            ? 'text-muted-foreground'
                            : ''
                        }
                      >
                        Select Saved Account{' '}
                        {isLoadingFundingSources && '(Loading...)'}{' '}
                        {!isLoadingFundingSources &&
                          (!savedFundingSources ||
                            savedFundingSources.length === 0) &&
                          '(None saved)'}
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Conditional Rendering: Manual Form or Select Dropdown */}
                  {bankDetailsMode === 'select' && (
                    <div>
                      <Label
                        htmlFor="savedFundingSource"
                        className="block text-sm font-medium text-gray-600 mb-1.5"
                      >
                        Select Account
                      </Label>
                      <Select
                        value={selectedFundingSourceId ?? ''}
                        onValueChange={handleSavedAccountSelect}
                        disabled={isLoadingFundingSources}
                      >
                        <SelectTrigger
                          id="savedFundingSource"
                          className="w-full border-gray-200 rounded-md"
                        >
                          <SelectValue placeholder="Select a saved funding source..." />
                        </SelectTrigger>
                        <SelectContent>
                          {foundingSources.map((source) => (
                            <SelectItem key={source.id} value={source.id}>
                              {source.beneficiaryName} - {source.bankName} (
                              {source.currency}) -{' '}
                              {source.accountType === 'us_ach' // Explicit check against DB value
                                ? 'US ACH'
                                : source.accountType === 'iban'
                                  ? 'IBAN'
                                  : source.accountType === 'uk_details' // Explicit check
                                    ? 'UK Details'
                                    : 'Other'}
                              {/* Add masked number display here later */}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {bankDetailsMode === 'manual' && (
                    <div className="space-y-4">
                      {/* Account Type Selector */}
                      <div>
                        <Label
                          htmlFor="bankDetails.accountType"
                          className="block text-sm font-medium text-gray-600 mb-1.5"
                        >
                          Bank Account Type
                        </Label>
                        <Select
                          value={localBankDetails?.accountType ?? ''}
                          onValueChange={(value) =>
                            handleBankDetailSelectChange('accountType' as keyof BankDetails, value)
                          }
                          disabled={bankDetailsMode === ('select' as typeof bankDetailsMode)}
                        >
                          <SelectTrigger
                            id="bankDetails.accountType"
                            className="w-full border-gray-200 rounded-md"
                          >
                            <SelectValue placeholder="Select account type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">
                              US Bank Account (ACH)
                            </SelectItem>
                            <SelectItem value="iban">
                              International (IBAN/SWIFT)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Common Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="bankDetails.accountHolder"
                            className="block text-sm font-medium text-gray-600 mb-1.5"
                          >
                            Account Holder Name
                          </Label>
                          <Input
                            id="bankDetails.accountHolder"
                            name="bankDetails.accountHolder"
                            value={localBankDetails?.accountHolder ?? ''}
                            onChange={handleChange}
                            className="w-full border-gray-200 rounded-md"
                            disabled={bankDetailsMode === ('select' as typeof bankDetailsMode)}
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="bankDetails.bankName"
                            className="block text-sm font-medium text-gray-600 mb-1.5"
                          >
                            Bank Name (Optional)
                          </Label>
                          <Input
                            id="bankDetails.bankName"
                            name="bankDetails.bankName"
                            value={localBankDetails?.bankName ?? ''}
                            onChange={handleChange}
                            className="w-full border-gray-200 rounded-md"
                            disabled={bankDetailsMode === ('select' as typeof bankDetailsMode)}
                          />
                        </div>
                      </div>

                      {/* Conditional Fields based on Account Type - Use localBankDetails */}
                      {(localBankDetails?.accountType === 'us' ||
                        !localBankDetails?.accountType) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="bankDetails.accountNumber"
                              className="block text-sm font-medium text-gray-600 mb-1.5"
                            >
                              Account Number
                            </Label>
                            <Input
                              id="bankDetails.accountNumber"
                              name="bankDetails.accountNumber"
                              value={localBankDetails?.accountNumber ?? ''}
                              onChange={handleChange}
                              className="w-full border-gray-200 rounded-md"
                              required={
                                nuqsFormData.paymentType === 'fiat' &&
                                localBankDetails?.accountType === 'us'
                              }
                              disabled={bankDetailsMode === ('select' as typeof bankDetailsMode)}
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="bankDetails.routingNumber"
                              className="block text-sm font-medium text-gray-600 mb-1.5"
                            >
                              Routing Number (ACH)
                            </Label>
                            <Input
                              id="bankDetails.routingNumber"
                              name="bankDetails.routingNumber"
                              value={localBankDetails?.routingNumber ?? ''}
                              onChange={handleChange}
                              className="w-full border-gray-200 rounded-md"
                              required={
                                nuqsFormData.paymentType === 'fiat' &&
                                localBankDetails?.accountType === 'us'
                              }
                              disabled={bankDetailsMode === ('select' as typeof bankDetailsMode)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Render IBAN fields only if accountType is explicitly 'iban' - Use localBankDetails */}
                      {localBankDetails?.accountType === 'iban' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="bankDetails.iban"
                              className="block text-sm font-medium text-gray-600 mb-1.5"
                            >
                              IBAN
                            </Label>
                            <Input
                              id="bankDetails.iban"
                              name="bankDetails.iban"
                              value={localBankDetails?.iban ?? ''}
                              onChange={handleChange}
                              className="w-full border-gray-200 rounded-md"
                              required={
                                nuqsFormData.paymentType === 'fiat' &&
                                localBankDetails?.accountType === 'iban'
                              }
                              disabled={bankDetailsMode === ('select' as typeof bankDetailsMode)}
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="bankDetails.bic"
                              className="block text-sm font-medium text-gray-600 mb-1.5"
                            >
                              BIC / SWIFT
                            </Label>
                            <Input
                              id="bankDetails.bic"
                              name="bankDetails.bic"
                              value={localBankDetails?.bic ?? ''}
                              onChange={handleChange}
                              className="w-full border-gray-200 rounded-md"
                              required={
                                nuqsFormData.paymentType === 'fiat' &&
                                localBankDetails?.accountType === 'iban'
                              }
                              disabled={bankDetailsMode === ('select' as typeof bankDetailsMode)}
                            />
                          </div>
                        </div>
                      )}
                    </div> // End manual mode div
                  )}
                </div> // End fiat details border div
              )}
            </div>

            {/* Invoice Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-md font-medium text-gray-900">
                  Invoice Items
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="rounded-md"
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Add Item
                </Button>
              </div>
              <div className="border rounded-lg border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-20">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-28">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-20">
                        Tax %
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider w-32">
                        Total
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((item, index) => (
                      <tr key={item.id ?? `item-${index}`}>
                        <td className="px-4 py-3">
                          <Input
                            type="text"
                            aria-label={`Item ${index + 1} description`}
                            value={item.name}
                            onChange={(e) =>
                              updateItem(item.id, 'name', e.target.value)
                            }
                            placeholder="Item description"
                            className="w-full border-0 focus:ring-1 focus:ring-gray-300 rounded p-1"
                            required
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            aria-label={`Item ${index + 1} quantity`}
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, 'quantity', e.target.value)
                            }
                            min="1"
                            className="w-full border-0 focus:ring-1 focus:ring-gray-300 rounded p-1 text-right"
                            required
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="text"
                            aria-label={`Item ${index + 1} unit price`}
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(item.id, 'unitPrice', e.target.value)
                            }
                            placeholder="0.00"
                            className="w-full border-0 focus:ring-1 focus:ring-gray-300 rounded p-1 text-right"
                            required
                            inputMode="decimal"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            aria-label={`Item ${index + 1} tax percentage`}
                            value={item.tax}
                            onChange={(e) =>
                              updateItem(item.id, 'tax', e.target.value)
                            }
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-full border-0 focus:ring-1 focus:ring-gray-300 rounded p-1 text-right"
                          />
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          {getCurrencySymbol()}
                          {(
                            (Number(item.quantity) || 0) *
                            (parseFloat(item.unitPrice) || 0) *
                            (1 + (Number(item.tax) || 0) / 100)
                          ).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-400 p-1"
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
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-end text-right">
                  <div className="w-64">
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {getCurrencySymbol()} {calculateSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-sm text-gray-600">Tax:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {getCurrencySymbol()} {calculateTax().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
                      <span className="text-md font-medium text-gray-900">
                        Total:
                      </span>
                      <span className="text-md font-semibold text-gray-900">
                        {getCurrencySymbol()} {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-600 mb-1.5"
                >
                  Note to Client
                </Label>
                <textarea
                  id="note"
                  name="note"
                  value={nuqsFormData.note ?? ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  placeholder="Thank you for your business"
                ></textarea>
              </div>
              <div>
                <Label
                  htmlFor="terms"
                  className="block text-sm font-medium text-gray-600 mb-1.5"
                >
                  Terms and Conditions
                </Label>
                <textarea
                  id="terms"
                  name="terms"
                  value={nuqsFormData.terms ?? ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  placeholder="Payment terms, late fees, etc."
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="rounded-md"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Invoice...
                  </>
                ) : (
                  'Create Invoice'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
      </div>
    );
  },
);

InvoiceForm.displayName = 'InvoiceForm';
