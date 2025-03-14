import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - hyprsqrl',
  description: 'Terms of Service for hyprsqrl - a non-custodial crypto financial platform',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            These Terms of Service govern your use of hyprsqrl, a non-custodial platform for crypto financial management.
          </p>
          <p className="mb-4">
            By using our services, you agree to these terms. Please read them carefully.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Non-Custodial Service</h2>
          <p className="mb-4">
            hyprsqrl operates as a non-custodial service. This means:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>We do not hold, store, or have access to your private keys, funds, or cryptocurrencies</li>
            <li>You maintain full control and custody of your digital assets at all times</li>
            <li>We cannot initiate transactions on your behalf without your explicit authorization</li>
            <li>You are solely responsible for maintaining the security of your private keys and wallet access</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
          <p className="mb-4">
            As a user of our non-custodial platform, you are responsible for:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Securing your private keys and access credentials</li>
            <li>Backing up your wallet information</li>
            <li>Verifying all transaction details before confirmation</li>
            <li>Complying with applicable laws and regulations in your jurisdiction</li>
            <li>Reporting any unauthorized access or security issues promptly</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Limitations of Liability</h2>
          <p className="mb-4">
            Due to the non-custodial nature of our service:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>We cannot recover or restore access to funds if you lose your private keys</li>
            <li>We are not responsible for unauthorized transactions if your credentials are compromised</li>
            <li>We cannot reverse or modify transactions once they are submitted to the blockchain</li>
            <li>Market volatility and blockchain network conditions are outside our control</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Service Modifications</h2>
          <p className="mb-4">
            We may modify or update these terms or our services at any time. Continued use of hyprsqrl after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12">
          Last updated: March 13, 2025
        </p>
      </div>
    </div>
  );
}