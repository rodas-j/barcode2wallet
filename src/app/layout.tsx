import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Barcode to Wallet | Convert Physical Cards to Digital Passes",
    template: "%s | Barcode to Wallet",
  },
  description:
    "Easily scan and convert your physical barcode cards, loyalty cards, and gym memberships into digital passes for Apple Wallet and Google Wallet.",
  keywords: [
    "barcode to wallet",
    "digital wallet",
    "apple wallet",
    "google wallet",
    "loyalty cards",
    "passkit",
    "pkpass",
    "barcode scanner",
    "digitize cards",
    "wallet digitizer",
    "gym membership card",
    "library card digital",
  ],
  authors: [{ name: "Barcode to Wallet" }],
  creator: "Barcode to Wallet",
  publisher: "Barcode to Wallet",
  metadataBase: new URL("https://barcode2wallet.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Barcode to Wallet | Digitize Your Cards",
    description:
      "Turn your physical plastic cards into digital wallet passes instantly. Support for Apple Wallet and Google Wallet.",
    url: "https://barcode2wallet.com",
    siteName: "Barcode to Wallet",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Barcode to Wallet - Convert physical cards to digital wallet passes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barcode to Wallet",
    description: "Convert physical barcode cards to digital wallet passes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Barcode to Wallet",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Convert physical barcode cards to digital wallet passes for Apple Wallet and Google Wallet.",
      url: "https://barcode2wallet.com",
      author: {
        "@type": "Organization",
        name: "Barcode to Wallet",
      },
      featureList: [
        "Barcode scanning via camera",
        "Image upload support",
        "Apple Wallet pass generation",
        "Customizable pass colors",
        "Support for 13+ barcode formats",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What barcode formats are supported?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We support QR codes, UPC-A, UPC-E, EAN-13, EAN-8, Code 128, Code 39, Code 93, Codabar, ITF, PDF417, Aztec, and Data Matrix formats.",
          },
        },
        {
          "@type": "Question",
          name: "Is my barcode data stored?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Your barcode data is processed entirely on our servers during pass generation and is never stored. We don't keep any copies of your cards.",
          },
        },
        {
          "@type": "Question",
          name: "Does Barcode to Wallet work on Android?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Google Wallet support is coming soon. Currently, we support Apple Wallet for iPhone users.",
          },
        },
        {
          "@type": "Question",
          name: "How do I add the pass to my iPhone?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "After generating your pass, download the .pkpass file and open it on your iPhone. iOS will automatically prompt you to add it to Apple Wallet.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
