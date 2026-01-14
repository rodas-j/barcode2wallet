"use client";

import { useState } from "react";
import Scanner from "@/components/Scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RotateCcw, Wallet } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [barcodeFormat, setBarcodeFormat] = useState<string | undefined>();
  const [backgroundColor, setBackgroundColor] = useState("#60a389");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  };

  const generateApplePass = async () => {
    if (!barcode) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/apple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode, format: barcodeFormat, backgroundColor }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to generate pass");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pass.pkpass";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const generateGooglePass = async () => {
    if (!barcode) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          barcode, 
          format: barcodeFormat, 
          backgroundColor,
          label: "My Card" // We could add an input for this
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to generate Google Wallet pass");
      }

      const data = await response.json();
      if (data.saveUrl) {
        window.open(data.saveUrl, "_blank");
      } else {
        throw new Error("No save URL returned");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 p-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6 py-8">
        <header className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2.5">
            <Wallet className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Barcode to Wallet
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Convert physical cards to digital wallet passes
          </p>
        </header>

        {!barcode ? (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Scan Your Card</CardTitle>
              <CardDescription>
                Position the barcode within the camera frame
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Scanner onScan={handleScan} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Card Scanned</CardTitle>
              <CardDescription>
                Configure your digital wallet pass
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg bg-muted/60 border px-4 py-3 space-y-1">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Barcode</p>
                  <p className="font-mono text-sm break-all">{barcode}</p>
                </div>
                {barcodeFormat && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Format</p>
                    <p className="font-mono text-xs text-primary">{barcodeFormat}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Card Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setBackgroundColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        backgroundColor === color.value
                          ? "border-foreground scale-110"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                  <label className="relative w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/50 cursor-pointer hover:border-muted-foreground flex items-center justify-center overflow-hidden">
                    <span className="text-xs text-muted-foreground">+</span>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-1">
                <button
                  onClick={generateApplePass}
                  disabled={loading}
                  className="h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-80"
                >
                  <Image
                    src="/add-to-apple-wallet.svg"
                    alt="Add to Apple Wallet"
                    width={156}
                    height={48}
                    className="h-12 w-auto"
                  />
                </button>

                <button
                  onClick={generateGooglePass}
                  disabled={loading}
                  className="h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-80"
                >
                  <Image
                    src="/add-to-google-wallet.svg"
                    alt="Add to Google Wallet"
                    width={200}
                    height={48}
                    className="h-12 w-auto"
                  />
                </button>
              </div>

              <Button
                onClick={() => setBarcode(null)}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Scan Different Card
              </Button>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <footer className="text-center pt-4">
          <a 
            href="https://barcode2wallet.com" 
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            barcode2wallet.com
          </a>
        </footer>
      </div>
    </main>
  );
}
