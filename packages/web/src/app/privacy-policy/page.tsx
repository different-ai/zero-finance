import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Different AI Inc.",
  description:
    "Learn how Different AI Inc. (0.finance) collects, uses, and protects your information when you use our services.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 prose prose-slate dark:prose-invert">
      <h1>Privacy Policy</h1>

      <p>Last updated: 24&nbsp;June&nbsp;2025</p>

      <p>
        Different AI&nbsp;Inc. (doing business as <strong>0.finance</strong>) values your
        privacy and is committed to protecting your personal information. This
        Privacy Policy explains what data we collect, how we use it, and your
        rights in relation to that data.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>
          <strong>Information you provide&nbsp;to&nbsp;us</strong> – when you create an
          account, fill in forms, or communicate with us.
        </li>
        <li>
          <strong>Automatically collected information</strong> – such as log data,
          device information, and usage statistics collected through cookies and
          similar technologies.
        </li>
        <li>
          <strong>Transaction information</strong> – details of payments made through
          our platform.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, operate, and maintain our services;</li>
        <li>Process and facilitate payments;</li>
        <li>Communicate with you, including sending transactional emails;</li>
        <li>Improve and personalise our services;</li>
        <li>Ensure the security and integrity of our platform;</li>
        <li>Comply with legal obligations.</li>
      </ul>

      <h2>3. Sharing of Information</h2>
      <p>
        We do not sell your personal information. We may share it with trusted
        third-party service providers who help us operate our business (for
        example, cloud hosting, analytics, and payment processors) and when
        required by law.
      </p>

      <h2>4. Cookies &amp; Similar Technologies</h2>
      <p>
        We use cookies and similar technologies to recognise repeat visits,
        understand usage patterns, and improve our services. You can control
        cookies through your browser settings.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your information only for as long as necessary to fulfil the
        purposes outlined in this policy or to comply with legal requirements.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        Subject to applicable law, you may have the right to access, rectify,
        delete, or restrict processing of your personal information. To
        exercise these rights, please contact us at&nbsp;
        <a href="mailto:privacy@0.finance">privacy@0.finance</a>.
      </p>

      <h2>7. International Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other
        than the one in which you reside. We take appropriate safeguards to
        ensure your data remains protected.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will
        be posted on this page with an updated "Last updated" date.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please email us at&nbsp;
        <a href="mailto:privacy@0.finance">privacy@0.finance</a>.
      </p>

      <hr />
      <p className="text-sm">
        © {new Date().getFullYear()} Different AI&nbsp;Inc. All rights reserved.
      </p>
    </main>
  );
}