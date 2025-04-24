import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, KeyRound, Network, FileText, Link as LinkIcon } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">How hyprsqrl Works Under the Hood</h1>
      <p className="text-center text-muted-foreground mb-12">
        We believe in transparency. Here&apos;s a look at the technology securing your funds and powering your account.
      </p>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span>Your Secure Account Vault (Safe)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your primary hyprsqrl account is actually a <strong className="text-foreground">Smart Contract Wallet</strong> deployed on the Base blockchain (an Ethereum Layer 2 network). We use industry-leading <strong className="text-foreground">Safe (formerly Gnosis Safe)</strong> technology for these wallets.
            </p>
            <p>
              Unlike traditional wallets controlled by a single private key, Safes are smart contracts. This offers enhanced security and flexibility:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Self-Custody:</span> You, and only you, control the funds in your Safe via your login method (e.g., email, social login managed by Privy). hyprsqrl cannot access or move your funds.
              </li>
              <li>
                <span className="font-medium text-foreground">Programmable Security:</span> Safes enable features like multi-signature requirements (requiring multiple approvals for transactions - a planned future feature for hyprsqrl teams) and spending limits.
              </li>
              <li>
                <span className="font-medium text-foreground">Account Recovery Options:</span> Smart contract wallets can offer more robust recovery mechanisms than traditional wallets (details depend on configuration).
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-6 w-6 text-primary" />
              <span>Account Access (Privy)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We partner with <a href="https://privy.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privy</a> to manage user authentication and wallet interactions securely. When you log in (e.g., with email), Privy generates a secure key specific to your browser session.
            </p>
            <p>
              This session key is then used to interact with your <strong className="text-foreground">Privy Smart Wallet</strong>. This smart wallet acts as the <strong className="text-foreground">owner</strong> of your Safe account vault. This means actions you take in hyprsqrl (like approving a withdrawal) are authorized by your login session via Privy, which then directs your Safe to perform the action.
            </p>
             <p className="text-sm text-muted-foreground">
               Think of it like this: Your login method controls the Privy Smart Wallet, and the Privy Smart Wallet controls your main hyprsqrl Safe account vault.
            </p>
          </CardContent>
        </Card>
        
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-6 w-6 text-primary" />
              <span>Gas Fees & Sponsored Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Performing actions on a blockchain (like deploying your Safe or sending funds) requires paying a small &quot;gas&quot; fee to the network validators in the network&apos;s native currency (ETH on Base).
            </p>
            <p>
               To simplify onboarding, hyprsqrl (via Privy) <strong className="text-foreground">sponsors</strong> the gas fees for certain initial actions, like deploying your Safe account vault. This means you don&apos;t need to have ETH initially to get set up.
            </p>
            <p>
               However, for actions initiated later, like withdrawing funds from your hyprsqrl account to an external address, <strong className="text-foreground">you will be responsible for the gas fees</strong>. These are typically small but necessary for the blockchain transaction to be processed.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span>Invoice Tracking (Request Network)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For invoices created within hyprsqrl, we utilize the <a href="https://request.network/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Request Network protocol</a>.
            </p>
            <p>
              When you create an invoice, the details are stored both in our database and registered on Request Network. This creates a verifiable, on-chain record of the payment request, linked to your account address. It allows for decentralized tracking of invoice statuses (e.g., paid, pending) based on blockchain events.
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-6 w-6 text-primary" />
              <span>Blockchain Network (Base)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your secure account vault (Safe) and transactions primarily operate on the <a href="https://base.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Base network</a>.
            </p>
            <p>
              Base is an <strong className="text-foreground">Ethereum Layer 2 (L2)</strong> network developed by Coinbase. It offers significantly lower transaction fees and faster confirmation times compared to the main Ethereum network (Layer 1) while still benefiting from Ethereum&apos;s security.
            </p>
          </CardContent>
        </Card>

      </div>

       <div className="text-center mt-12">
          <p className="text-muted-foreground">Need more details? Feel free to reach out to our support team.</p>
        </div>
    </div>
  );
} 