"use client";

import { useState } from "react";
import Scanner from "@/components/Scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Apple, RotateCcw, Wallet } from "lucide-react";

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

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button
                  onClick={generateApplePass}
                  disabled={loading}
                >
                  <Apple className="h-4 w-4" />
                  Apple Wallet
                </Button>

                <Button
                  onClick={generateGooglePass}
                  disabled={loading}
                  variant="secondary"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google Wallet
                </Button>
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
