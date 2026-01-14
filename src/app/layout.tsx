import type { Metadata } from "next";
import { Geist, Geist_Mono, Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Barcode to Wallet | Convert Physical Cards to Digital Passes",
    template: "%s | Barcode to Wallet",
  },
  description: "Easily scan and convert your physical barcode cards, loyalty cards, and gym memberships into digital passes for Apple Wallet and Google Wallet.",
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
  ],
  authors: [{ name: "Barcode to Wallet Team" }],
  creator: "Barcode to Wallet",
  publisher: "Barcode to Wallet",
  metadataBase: new URL("https://barcode2wallet.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Barcode to Wallet | Digitize Your Cards",
    description: "Turn your physical plastic cards into digital wallet passes instantly. Support for Apple Wallet and Google Wallet.",
    url: "https://barcode2wallet.com",
    siteName: "Barcode to Wallet",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Barcode to Wallet Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barcode to Wallet",
    description: "Convert physical barcode cards to digital wallet passes.",
    images: ["/og-image.png"], // Re-using OG image for consistency
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Barcode to Wallet",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "description": "Convert physical barcode cards to digital wallet passes for Apple Wallet and Google Wallet.",
  "url": "https://barcode2wallet.com",
  "author": {
    "@type": "Organization",
    "name": "Barcode to Wallet"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={publicSans.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
