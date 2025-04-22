'use client';

import Link from 'next/link';
import { ArrowRight, Users, Send } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TransferHubPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Safe Actions</h1>
        <p className="text-muted-foreground mb-8">
          Choose an action to perform with your primary Safe wallet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Send className="h-6 w-6 text-primary" />
                <CardTitle>Send Crypto (USDC)</CardTitle>
              </div>
              <CardDescription>
                Send USDC tokens from your Safe wallet using gas-less
                transactions via the Privy relayer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/send-usdc" passHref legacyBehavior>
                <Button variant="outline" className="w-full">
                  Send USDC <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Manage Owners</CardTitle>
              </div>
              <CardDescription>
                Add or remove owners from your Safe wallet. Requires signing a
                transaction with your embedded wallet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/settings/add-owner" passHref legacyBehavior>
                <Button variant="outline" className="w-full">
                  Add Owner <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {/* Add link to Remove Owner page when implemented */}
              {/*
              <Link href="/dashboard/settings/remove-owner" passHref legacyBehavior>
                <Button variant="outline" className="w-full mt-2">
                  Remove Owner <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 