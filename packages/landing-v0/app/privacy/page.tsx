import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - hyprsqrl',
  description: 'Privacy Policy for hyprsqrl - a non-custodial crypto financial platform',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            At hyprsqrl, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our non-custodial crypto financial platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="mb-4">
            As a non-custodial service, we collect minimal personal information:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Contact information (email address) if you sign up for updates</li>
            <li>Usage data and analytics to improve our service</li>
            <li>Public blockchain addresses you choose to connect to our platform</li>
          </ul>
          <p className="mb-4">
            <strong>We do not collect or store:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Your private keys or seed phrases</li>
            <li>Your cryptocurrency holdings or balances</li>
            <li>Your transaction history beyond what's publicly available on the blockchain</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide and improve our services</li>
            <li>Communicate with you about updates and features</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Ensure the security and proper functioning of our platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Non-Custodial Privacy Benefits</h2>
          <p className="mb-4">
            Our non-custodial approach enhances your privacy in several ways:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>We never have access to your funds or private keys</li>
            <li>All cryptographic operations happen locally on your device</li>
            <li>We maintain minimal personal data that could be subject to breach or disclosure</li>
            <li>You maintain control over your digital identity and assets</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Cookies and Tracking</h2>
          <p className="mb-4">
            We use essential cookies to ensure the functionality of our website. We also use analytics tools to help us understand how users interact with our platform, but these are configured to respect your privacy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of your personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
            <li>Request transfer of your personal data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Changes to This Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at privacy@hyprsqrl.com.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12">
          Last updated: March 13, 2025
        </p>
      </div>
    </div>
  );
}