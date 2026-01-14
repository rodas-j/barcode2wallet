"use client";

import { useState } from "react";
import Scanner from "@/components/Scanner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RotateCcw,
  Wallet,
  Camera,
  Palette,
  Download,
  Shield,
  Zap,
  Smartphone,
  Check,
  Loader2,
  Keyboard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

type Step = "scan" | "configure" | "success";

export default function Home() {
  const [step, setStep] = useState<Step>("scan");
  const [barcode, setBarcode] = useState<string>("");
  const [barcodeFormat, setBarcodeFormat] = useState<string | undefined>();
  const [cardName, setCardName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#60a389");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const colorPresets = [
    { name: "Green", value: "#60a389" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Pink", value: "#ec4899" },
    { name: "Slate", value: "#475569" },
    { name: "Black", value: "#1a1a1a" },
  ];

  const handleScan = (decodedText: string, format?: string) => {
    setBarcode(decodedText);
    setBarcodeFormat(format);
    setStep("configure");
  };

  const handleManualSubmit = () => {
    if (barcode.trim()) {
      setBarcodeFormat("MANUAL");
      setStep("configure");
    }
  };

  const resetAll = () => {
    setBarcode("");
    setBarcodeFormat(undefined);
    setCardName("");
    setBackgroundColor("#60a389");
    setError("");
    setStep("scan");
    setShowManualEntry(false);
  };

  const generateApplePass = async () => {
    if (!barcode) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/apple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode,
          format: barcodeFormat,
          backgroundColor,
          label: cardName || "My Card",
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to generate pass");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cardName || "pass"}.pkpass`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine if text should be light or dark based on background
  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      <main id="main-content" className="p-4 flex flex-col items-center">
        <div className="w-full max-w-md space-y-6 py-8">
          {/* Header */}
          <header className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2.5">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Wallet className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Barcode to Wallet
              </h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Digitize your loyalty cards, gym memberships, and more for Apple
              Wallet
            </p>
          </header>

          {/* Trust Signals */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              <span>No data stored</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Instant generation</span>
            </div>
          </div>

          {/* Step 1: Scan */}
          {step === "scan" && (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    1
                  </div>
                  <CardTitle className="text-lg">Scan Your Card</CardTitle>
                </div>
                <CardDescription>
                  Use your camera to scan the barcode, or upload an image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Scanner onScan={handleScan} />

                {/* Manual Entry Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowManualEntry(!showManualEntry)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                    aria-expanded={showManualEntry}
                    aria-controls="manual-entry"
                  >
                    <Keyboard className="h-4 w-4" aria-hidden="true" />
                    <span>Enter barcode manually</span>
                    {showManualEntry ? (
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>

                  {showManualEntry && (
                    <div id="manual-entry" className="mt-3 space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="manual-barcode">Barcode number</Label>
                        <Input
                          id="manual-barcode"
                          type="text"
                          placeholder="Enter barcode digits..."
                          value={barcode}
                          onChange={(e) => setBarcode(e.target.value)}
                          className="font-mono"
                        />
                      </div>
                      <Button
                        onClick={handleManualSubmit}
                        disabled={!barcode.trim()}
                        className="w-full"
                      >
                        Continue with this barcode
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Configure */}
          {step === "configure" && (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    2
                  </div>
                  <CardTitle className="text-lg">Customize Your Pass</CardTitle>
                </div>
                <CardDescription>
                  Name your card and choose a color
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Pass Preview */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Preview
                  </Label>
                  <div
                    className="rounded-xl p-4 transition-colors duration-200 shadow-lg"
                    style={{ backgroundColor }}
                    role="img"
                    aria-label={`Pass preview with ${
                      colorPresets.find((c) => c.value === backgroundColor)
                        ?.name || "custom"
                    } background`}
                  >
                    <div
                      className="space-y-3"
                      style={{ color: getContrastColor(backgroundColor) }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium opacity-90">
                          {cardName || "My Card"}
                        </span>
                        <Wallet
                          className="h-5 w-5 opacity-70"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-3 flex items-center justify-center">
                        <div className="text-center">
                          <div className="flex gap-0.5 justify-center mb-1">
                            {/* Barcode visualization */}
                            {[...Array(20)].map((_, i) => (
                              <div
                                key={i}
                                className="bg-black"
                                style={{
                                  width: Math.random() > 0.5 ? "2px" : "1px",
                                  height: "32px",
                                }}
                              />
                            ))}
                          </div>
                          <p className="font-mono text-xs text-gray-600 truncate max-w-[180px]">
                            {barcode}
                          </p>
                        </div>
                      </div>
                      {barcodeFormat && barcodeFormat !== "MANUAL" && (
                        <p className="text-xs opacity-60 text-center">
                          {barcodeFormat}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="card-name">Card name</Label>
                  <Input
                    id="card-name"
                    type="text"
                    placeholder="e.g., Gym Membership, Library Card..."
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    maxLength={30}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will appear on your wallet pass
                  </p>
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Pass color</Label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {backgroundColor.toUpperCase()}
                    </span>
                  </div>
                  <div
                    className="flex flex-wrap gap-2"
                    role="radiogroup"
                    aria-label="Choose pass color"
                  >
                    {colorPresets.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        role="radio"
                        aria-checked={backgroundColor === color.value}
                        aria-label={color.name}
                        onClick={() => setBackgroundColor(color.value)}
                        className={`w-9 h-9 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          backgroundColor === color.value
                            ? "border-foreground scale-110 shadow-md"
                            : "border-transparent hover:scale-105 hover:shadow-sm"
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                    <label className="relative w-9 h-9 rounded-full border-2 border-dashed border-muted-foreground/50 cursor-pointer hover:border-muted-foreground flex items-center justify-center overflow-hidden transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                      <Palette
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label="Choose custom color"
                      />
                    </label>
                  </div>
                </div>

                {/* Wallet Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={generateApplePass}
                    disabled={loading}
                    className="h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                    aria-label="Add to Apple Wallet"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2
                          className="h-5 w-5 animate-spin"
                          aria-hidden="true"
                        />
                        <span className="text-sm">Generating pass...</span>
                      </div>
                    ) : (
                      <Image
                        src="/add-to-apple-wallet.svg"
                        alt="Add to Apple Wallet"
                        width={156}
                        height={48}
                        className="h-12 w-auto"
                      />
                    )}
                  </button>

                  <div className="flex flex-col items-center gap-1">
                    <div className="relative">
                      <Image
                        src="/add-to-google-wallet.svg"
                        alt="Add to Google Wallet (Coming soon)"
                        width={200}
                        height={48}
                        className="h-12 w-auto opacity-40 grayscale"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Coming soon
                    </span>
                  </div>
                </div>

                <Button
                  onClick={resetAll}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Scan Different Card
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Check
                      className="h-8 w-8 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold">Pass Downloaded!</h2>
                    <p className="text-sm text-muted-foreground">
                      Open the .pkpass file on your iPhone to add it to Apple
                      Wallet
                    </p>
                  </div>
                  <div
                    className="rounded-xl p-4 mx-auto max-w-[200px]"
                    style={{ backgroundColor }}
                    role="img"
                    aria-label="Your generated pass"
                  >
                    <div
                      className="text-center"
                      style={{ color: getContrastColor(backgroundColor) }}
                    >
                      <p className="text-sm font-medium">
                        {cardName || "My Card"}
                      </p>
                    </div>
                  </div>
                  <Button onClick={resetAll} className="mt-4">
                    <Smartphone className="h-4 w-4" aria-hidden="true" />
                    Create Another Pass
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* How It Works Section (Collapsible for SEO content) */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="w-full flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              aria-expanded={showHowItWorks}
              aria-controls="how-it-works"
            >
              <span>How it works</span>
              {showHowItWorks ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            {showHowItWorks && (
              <div id="how-it-works" className="pt-4 space-y-4">
                <div className="grid gap-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Camera
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">1. Scan barcode</h3>
                      <p className="text-xs text-muted-foreground">
                        Use your camera to scan any barcode from loyalty cards,
                        gym memberships, library cards, and more.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Palette
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">2. Customize</h3>
                      <p className="text-xs text-muted-foreground">
                        Name your card and choose a background color to make it
                        easy to identify in your wallet.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Download
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">3. Add to Wallet</h3>
                      <p className="text-xs text-muted-foreground">
                        Download the pass and open it on your iPhone to add it
                        to Apple Wallet instantly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Content for SEO */}
                <div className="pt-4 space-y-3 border-t">
                  <h3 className="text-sm font-medium">
                    Frequently Asked Questions
                  </h3>
                  <details className="group">
                    <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                      What barcodes are supported?
                    </summary>
                    <p className="mt-2 text-xs text-muted-foreground pl-4">
                      We support QR codes, UPC-A, UPC-E, EAN-13, EAN-8, Code 128,
                      Code 39, Code 93, Codabar, ITF, PDF417, Aztec, and Data
                      Matrix formats.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                      Is my data stored?
                    </summary>
                    <p className="mt-2 text-xs text-muted-foreground pl-4">
                      No. Your barcode data is processed entirely on our servers
                      during pass generation and is never stored. We don&apos;t
                      keep any copies of your cards.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                      Does it work on Android?
                    </summary>
                    <p className="mt-2 text-xs text-muted-foreground pl-4">
                      Google Wallet support is coming soon. Currently, we
                      support Apple Wallet for iPhone users.
                    </p>
                  </details>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="pt-6 border-t">
            <div className="flex flex-col items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <a
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </div>
              <p>
                &copy; {new Date().getFullYear()} barcode2wallet.com. All rights
                reserved.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
