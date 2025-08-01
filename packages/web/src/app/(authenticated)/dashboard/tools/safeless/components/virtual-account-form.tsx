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
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const virtualAccountSchema = z.object({
  source_currency: z.enum(["usd", "eur"]),
  destination_token: z.enum(["usdc", "usdt"]),
  destination_network: z.enum(["polygon", "ethereum", "solana", "base"]),
  destination_address: z.string().min(1, "Destination address is required"),
});

type VirtualAccountFormValues = z.infer<typeof virtualAccountSchema>;

export function VirtualAccountForm() {
  const [isCreating, setIsCreating] = useState(false);
  const [accountDetails, setAccountDetails] = useState<any>(null);

  const form = useForm<VirtualAccountFormValues>({
    resolver: zodResolver(virtualAccountSchema),
    defaultValues: {
      source_currency: "usd",
      destination_token: "usdc",
      destination_network: "polygon",
      destination_address: "",
    },
  });

  const createVirtualAccount = api.align.createVirtualAccount.useMutation({
    onSuccess: (data) => {
      setAccountDetails(data);
      toast.success("Virtual account created successfully!");
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to create virtual account: " + error.message);
    },
  });

  async function onSubmit(values: VirtualAccountFormValues) {
    setIsCreating(true);
    try {
      await createVirtualAccount.mutateAsync(values);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <FormDescription>
                      The fiat currency for deposits
                    </FormDescription>
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
                    <FormDescription>
                      The stablecoin to receive
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="solana">Solana</SelectItem>
                        <SelectItem value="base">Base</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The blockchain network for receiving funds
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      Your wallet address to receive the funds
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isCreating} 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Virtual Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {accountDetails && (
        <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Virtual Account Created
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium">Account ID</div>
              <div className="text-sm text-muted-foreground font-mono">{accountDetails.id}</div>
            </div>
            
            <div className="grid gap-2">
              <div className="text-sm font-medium">Status</div>
              <div className="text-sm text-muted-foreground">{accountDetails.status}</div>
            </div>

            {accountDetails.deposit_instructions && (
              <Alert className="border-emerald-200 dark:border-emerald-800 bg-white dark:bg-neutral-900">
                <AlertCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <AlertDescription>
                  <div className="space-y-2 mt-2">
                    <div className="font-medium">Deposit Instructions</div>
                    <div className="text-sm space-y-1">
                      <div>Bank Name: {accountDetails.deposit_instructions.bank_name}</div>
                      <div>Bank Address: {accountDetails.deposit_instructions.bank_address}</div>
                      <div>Account Holder: {accountDetails.deposit_instructions.beneficiary_name}</div>
                      {accountDetails.deposit_instructions.iban && (
                        <div>IBAN: {accountDetails.deposit_instructions.iban.iban_number}</div>
                      )}
                      {accountDetails.deposit_instructions.us && (
                        <>
                          <div>Routing: {accountDetails.deposit_instructions.us.routing_number}</div>
                          <div>Account: {accountDetails.deposit_instructions.us.account_number}</div>
                        </>
                      )}
                      <div>Payment Rails: {accountDetails.deposit_instructions.payment_rails?.join(", ")}</div>
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