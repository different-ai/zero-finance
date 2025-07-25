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
import { Loader2, CheckCircle2, Info, DollarSign } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const onrampTransferSchema = z.object({
  amount: z.string().regex(/^[0-9]+(\.[0-9]+)?$/, "Invalid amount format"),
  source_currency: z.enum(["usd", "eur"]),
  source_rails: z.enum(["swift", "ach", "sepa", "wire"]),
  destination_network: z.enum(["polygon", "ethereum", "tron", "solana"]),
  destination_token: z.enum(["usdc", "usdt"]),
  destination_address: z.string().min(1, "Destination address is required"),
});

type OnrampTransferFormValues = z.infer<typeof onrampTransferSchema>;

export function OnrampTransferForm() {
  const [isCreating, setIsCreating] = useState(false);
  const [transferDetails, setTransferDetails] = useState<any>(null);

  const form = useForm<OnrampTransferFormValues>({
    resolver: zodResolver(onrampTransferSchema),
    defaultValues: {
      amount: "",
      source_currency: "usd",
      source_rails: "wire",
      destination_network: "polygon",
      destination_token: "usdc",
      destination_address: "",
    },
  });

  const createOnrampTransfer = api.align.createOnrampTransfer.useMutation({
    onSuccess: (data) => {
      setTransferDetails(data);
      toast.success("Onramp transfer created successfully!");
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to create onramp transfer: " + error.message);
    },
  });

  async function onSubmit(values: OnrampTransferFormValues) {
    setIsCreating(true);
    try {
      await createOnrampTransfer.mutateAsync(values);
    } finally {
      setIsCreating(false);
    }
  }

  const sourceCurrency = form.watch("source_currency");
  const sourceRails = form.watch("source_rails");

  const availableRails = sourceCurrency === "eur" 
    ? [{ value: "sepa", label: "SEPA" }, { value: "swift", label: "SWIFT" }, { value: "wire", label: "Wire" }]
    : [{ value: "ach", label: "ACH" }, { value: "wire", label: "Wire" }, { value: "swift", label: "SWIFT" }];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Onramp Transfer</CardTitle>
          <CardDescription>
            Convert fiat currency to cryptocurrency on your preferred network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="100.00" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      The amount to convert
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="source_currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Currency</FormLabel>
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
                  name="source_rails"
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="destination_network"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Network</FormLabel>
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

                <FormField
                  control={form.control}
                  name="destination_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Token</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select token" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="usdc">USDC</SelectItem>
                          <SelectItem value="usdt">USDT</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="destination_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Address</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Your wallet address to receive the crypto
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Transfer...
                  </>
                ) : (
                  "Create Onramp Transfer"
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
                  {transferDetails.amount} {transferDetails.source_currency?.toUpperCase()}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Fee</div>
                <div className="text-sm text-muted-foreground">
                  {transferDetails.quote?.fee_amount} {transferDetails.source_currency?.toUpperCase()}
                </div>
              </div>
            </div>

            {transferDetails.quote && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2 mt-2">
                    <div className="font-medium">Deposit Instructions</div>
                    <div className="text-sm space-y-1">
                      <div>Amount to Deposit: {transferDetails.quote.deposit_amount} {transferDetails.quote.deposit_currency?.toUpperCase()}</div>
                      <div>Payment Rails: {transferDetails.quote.deposit_rails?.toUpperCase()}</div>
                      {transferDetails.quote.deposit_message && (
                        <div>Reference: {transferDetails.quote.deposit_message}</div>
                      )}
                      {transferDetails.quote.deposit_bank_account && (
                        <div className="mt-2 p-2 bg-muted rounded-md">
                          <div className="font-medium mb-1">Bank Account Details</div>
                          {/* Bank account details would be displayed here based on the actual response structure */}
                          <div className="text-xs">Full bank details provided in response</div>
                        </div>
                      )}
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