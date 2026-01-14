import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Barcode to Wallet.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-muted/40 p-4">
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to app
        </Link>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h1>Terms of Service</h1>
          <p className="lead">
            Last updated: January 13, 2025
          </p>

          <p>
            Welcome to Barcode to Wallet. By using our service, you agree to these Terms of Service.
            Please read them carefully.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Barcode to Wallet, you agree to be bound by these Terms of Service
            and our Privacy Policy. If you do not agree to these terms, please do not use our service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Barcode to Wallet is a free web-based tool that allows you to convert physical barcode cards
            into digital wallet passes compatible with Apple Wallet. The service is provided &quot;as is&quot;
            without any guarantees or warranties.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>You agree to use our service only for lawful purposes. You must not:</p>
          <ul>
            <li>Use the service to create fraudulent or counterfeit passes</li>
            <li>Attempt to reverse engineer or exploit our systems</li>
            <li>Use the service in any way that violates applicable laws</li>
            <li>Interfere with or disrupt the service</li>
            <li>Create passes for barcodes you do not have the right to use</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>
            The service, including its design, code, and content, is owned by Barcode to Wallet.
            You retain all rights to your barcode data. Apple Wallet and related trademarks are
            the property of Apple Inc.
          </p>

          <h2>5. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
            EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED,
            SECURE, OR ERROR-FREE.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, BARCODE TO WALLET SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
            LIMITED TO LOSS OF DATA OR PROFITS.
          </p>

          <h2>7. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Barcode to Wallet from any claims, damages,
            or expenses arising from your use of the service or violation of these terms.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be
            effective immediately upon posting to this page. Your continued use of the service
            constitutes acceptance of the modified terms.
          </p>

          <h2>9. Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to our service at any time,
            without notice, for conduct that we believe violates these Terms of Service or
            is harmful to other users or the service.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the
            laws of the jurisdiction in which Barcode to Wallet operates, without regard to
            conflict of law principles.
          </p>

          <h2>11. Contact</h2>
          <p>
            For questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:legal@barcode2wallet.com">legal@barcode2wallet.com</a>.
          </p>
        </article>
      </div>
    </div>
  );
}
