"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, Wallet, Building } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const offrampTransferSchema = z.object({
  amount: z.string().regex(/^[0-9]+(\.[0-9]+)?$/, "Invalid amount format"),
  source_token: z.enum(["usdc", "usdt", "eurc"]),
  source_network: z.enum(["polygon", "ethereum", "tron", "solana"]),
  destination_currency: z.enum(["usd", "eur"]),
  destination_payment_rails: z.enum(["ach", "wire", "sepa"]),
  account_type: z.enum(["us", "iban"]),
  // US Account fields
  routing_number: z.string().optional(),
  account_number: z.string().optional(),
  // IBAN fields
  iban: z.string().optional(),
  // Common fields
  bank_name: z.string().min(1, "Bank name is required"),
  account_holder_type: z.enum(["individual", "business"]),
  account_holder_first_name: z.string().optional(),
  account_holder_last_name: z.string().optional(),
  account_holder_business_name: z.string().optional(),
}).refine((data) => {
  if (data.account_type === "us") {
    return data.routing_number && data.account_number;
  }
  if (data.account_type === "iban") {
    return data.iban;
  }
  return false;
}, {
  message: "Please provide all required account details",
}).refine((data) => {
  if (data.account_holder_type === "individual") {
    return data.account_holder_first_name && data.account_holder_last_name;
  }
  if (data.account_holder_type === "business") {
    return data.account_holder_business_name;
  }
  return false;
}, {
  message: "Please provide all required account holder information",
});

type OfframpTransferFormValues = z.infer<typeof offrampTransferSchema>;

export function OfframpTransferForm() {
  const [isCreating, setIsCreating] = useState(false);
  const [transferDetails, setTransferDetails] = useState<any>(null);

  const form = useForm<OfframpTransferFormValues>({
    resolver: zodResolver(offrampTransferSchema),
    defaultValues: {
      amount: "",
      source_token: "usdc",
      source_network: "polygon",
      destination_currency: "usd",
      destination_payment_rails: "wire",
      account_type: "us",
      account_holder_type: "individual",
      bank_name: "",
      account_holder_first_name: "",
      account_holder_last_name: "",
      account_holder_business_name: "",
      routing_number: "",
      account_number: "",
      iban: "",
    },
  });

  const createOfframpTransfer = api.align.createOfframpTransfer.useMutation({
    onSuccess: (data) => {
      setTransferDetails(data);
      toast.success("Offramp transfer created successfully!");
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to create offramp transfer: " + error.message);
    },
  });

  async function onSubmit(values: OfframpTransferFormValues) {
    setIsCreating(true);
    try {
      const payload = {
        amount: values.amount,
        source_token: values.source_token,
        source_network: values.source_network,
        destination_currency: values.destination_currency,
        destination_payment_rails: values.destination_payment_rails,
        destination_bank_account: {
          bank_name: values.bank_name,
          account_holder_type: values.account_holder_type,
          account_holder_first_name: values.account_holder_first_name,
          account_holder_last_name: values.account_holder_last_name,
          account_holder_business_name: values.account_holder_business_name,
          account_type: values.account_type,
          ...(values.account_type === "us" 
            ? { us: { routing_number: values.routing_number, account_number: values.account_number } }
            : { iban: { iban: values.iban } }
          ),
        },
      };
      await createOfframpTransfer.mutateAsync(payload);
    } finally {
      setIsCreating(false);
    }
  }

  const destinationCurrency = form.watch("destination_currency");
  const accountType = form.watch("account_type");
  const accountHolderType = form.watch("account_holder_type");

  const availableRails = destinationCurrency === "eur" 
    ? [{ value: "sepa", label: "SEPA" }]
    : [{ value: "ach", label: "ACH" }, { value: "wire", label: "Wire" }];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Offramp Transfer</CardTitle>
          <CardDescription>
            Convert cryptocurrency to fiat and send to your bank account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Amount and Source */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="100.00" {...field} />
                      </FormControl>
                      <FormDescription>
                        The amount of crypto to convert
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="source_token"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source Token</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="usdc">USDC</SelectItem>
                            <SelectItem value="usdt">USDT</SelectItem>
                            <SelectItem value="eurc">EURC</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="source_network"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source Network</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="polygon">Polygon</SelectItem>
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                            <SelectItem value="tron">Tron</SelectItem>
                            <SelectItem value="solana">Solana</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="destination_currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="eur">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destination_payment_rails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Rails</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select rails" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableRails.map((rail) => (
                              <SelectItem key={rail.value} value={rail.value}>
                                {rail.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Bank Account Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bank Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="account_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="us" id="us" />
                              <label htmlFor="us">US Account</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="iban" id="iban" />
                              <label htmlFor="iban">IBAN</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bank_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bank name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {accountType === "us" && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="routing_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Routing Number</FormLabel>
                            <FormControl>
                              <Input placeholder="123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="account_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input placeholder="000000000000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {accountType === "iban" && (
                    <FormField
                      control={form.control}
                      name="iban"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IBAN</FormLabel>
                          <FormControl>
                            <Input placeholder="DE89370400440532013000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="account_holder_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="individual" id="individual" />
                              <label htmlFor="individual" className="flex items-center gap-2">
                                <Wallet className="h-4 w-4" />
                                Individual
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="business" id="business" />
                              <label htmlFor="business" className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Business
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {accountHolderType === "individual" && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="account_holder_first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="account_holder_last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {accountHolderType === "business" && (
                    <FormField
                      control={form.control}
                      name="account_holder_business_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corporation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Transfer...
                  </>
                ) : (
                  "Create Offramp Transfer"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {transferDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Transfer Created
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm font-medium">Transfer ID</div>
                <div className="text-sm text-muted-foreground font-mono">{transferDetails.id}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium">Status</div>
                <div className="text-sm text-muted-foreground capitalize">{transferDetails.status}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Amount</div>
                <div className="text-sm text-muted-foreground">
                  {transferDetails.amount} {transferDetails.source_token?.toUpperCase()}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Fee</div>
                <div className="text-sm text-muted-foreground">
                  {transferDetails.quote?.fee_amount} {transferDetails.destination_currency?.toUpperCase()}
                </div>
              </div>
            </div>

            {transferDetails.quote && (
              <Alert>
                <Wallet className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2 mt-2">
                    <div className="font-medium">Deposit Instructions</div>
                    <div className="text-sm space-y-1">
                      <div>Deposit Address: <span className="font-mono">{transferDetails.quote.deposit_blockchain_address}</span></div>
                      <div>Deposit Amount: {transferDetails.quote.deposit_amount} {transferDetails.quote.deposit_token?.toUpperCase()}</div>
                      <div>Network: {transferDetails.quote.deposit_network}</div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}