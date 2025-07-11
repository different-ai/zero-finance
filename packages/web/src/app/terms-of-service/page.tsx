import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – Different AI Inc.",
  description:
    "Review the terms and conditions governing your use of 0.finance, a service provided by Different AI Inc.",
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 prose prose-slate dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: 24&nbsp;June&nbsp;2025</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using <strong>0.finance</strong> (the "Service"), you agree to
        be bound by these Terms of Service ("Terms"). If you do not agree with
        any part of the Terms, you may not access the Service.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18&nbsp;years old and capable of entering into a
        legally binding agreement to use the Service. By using the Service, you
        represent and warrant that you meet these requirements.
      </p>

      <h2>3. Account Registration</h2>
      <p>
        You may need to create an account to access certain features. You are
        responsible for safeguarding your login credentials and all activities
        that occur under your account.
      </p>

      <h2>4. Prohibited Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose;</li>
        <li>Violate any applicable laws or regulations;</li>
        <li>
          Interfere with or disrupt the integrity or performance of the Service;
        </li>
        <li>
          Attempt to gain unauthorised access to any part of the Service or its
          related systems;
        </li>
        <li>Transmit harmful, fraudulent, or objectionable content;</li>
        <li>
          Engage in any activity that would otherwise violate these Terms.
        </li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>
        All content, trademarks, and other intellectual property on the Service
        are owned by Different AI&nbsp;Inc. or its licensors. You may not copy,
        modify, distribute, or create derivative works without our explicit
        permission.
      </p>

      <h2>6. Disclaimer of Warranties</h2>
      <p>
        The Service is provided "as&nbsp;is" and "as&nbsp;available" without warranties
        of any kind, whether express or implied, including but not limited to
        merchantability, fitness for a particular purpose, and non-infringement.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Different AI&nbsp;Inc. shall not be
        liable for any indirect, incidental, special, consequential, or punitive
        damages arising out of or related to your use of the Service.
      </p>

      <h2>8. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Different AI&nbsp;Inc., its
        officers, directors, employees, and agents from any claims, damages, or
        expenses arising from your use of the Service or violation of these
        Terms.
      </p>

      <h2>9. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at any time,
        with or without notice, for conduct that we believe violates these
        Terms or is otherwise harmful.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of the State of Delaware, USA, without regard to its conflict of
        law principles.
      </p>

      <h2>11. Changes to Terms</h2>
      <p>
        We may modify these Terms at any time. We will notify you of material
        changes by posting the updated Terms on this page and updating the
        "Last updated" date.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please email us at&nbsp;
        <a href="mailto:support@0.finance">support@0.finance</a>.
      </p>

      <hr />
      <p className="text-sm">
        © {new Date().getFullYear()} Different AI&nbsp;Inc. All rights reserved.
      </p>
    </main>
  );
}