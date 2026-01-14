import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Barcode to Wallet - Learn how we handle your data.",
};

export default function PrivacyPage() {
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
          <h1>Privacy Policy</h1>
          <p className="lead">
            Last updated: January 13, 2025
          </p>

          <p>
            At Barcode to Wallet (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we are committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
          </p>

          <h2>Information We Collect</h2>
          <h3>Barcode Data</h3>
          <p>
            When you scan or upload a barcode, the barcode data is transmitted to our servers solely for the purpose
            of generating your digital wallet pass. <strong>We do not store, log, or retain any barcode data</strong> after
            your pass has been generated and delivered to you.
          </p>

          <h3>Automatically Collected Information</h3>
          <p>
            We may collect certain information automatically when you use our service, including:
          </p>
          <ul>
            <li>Browser type and version</li>
            <li>Device type</li>
            <li>General location (country/region level only)</li>
            <li>Usage patterns (pages visited, time spent)</li>
          </ul>
          <p>
            This information is collected through standard web analytics and is used to improve our service.
            It is not linked to any personal barcode data.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Generate and deliver your digital wallet passes</li>
            <li>Improve and optimize our service</li>
            <li>Analyze usage trends</li>
            <li>Ensure the security of our platform</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            All data transmission between your browser and our servers is encrypted using industry-standard TLS/SSL encryption.
            Barcode data is processed in memory and is not written to persistent storage.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We do not sell, trade, or otherwise transfer your information to third parties.
            Generated passes are created using Apple&apos;s PassKit technology and are delivered directly to you.
          </p>

          <h2>Your Rights</h2>
          <p>
            Since we do not store your barcode data, there is no personal data to access, modify, or delete.
            If you have questions about your data, please contact us.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
            the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@barcode2wallet.com">privacy@barcode2wallet.com</a>.
          </p>
        </article>
      </div>
    </div>
  );
}
