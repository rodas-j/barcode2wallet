"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Camera } from "lucide-react";
import Image from "next/image";

interface ScannerProps {
  onScan: (decodedText: string, format?: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerElementRef = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(true);

  // Create scanner element outside React's control
  useEffect(() => {
    if (containerRef.current && !scannerElementRef.current) {
      const el = document.createElement("div");
      el.id = `scanner-${Date.now()}`;
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.display = "none";
      containerRef.current.appendChild(el);
      scannerElementRef.current = el;
    }

    return () => {
      // Cleanup scanner element on unmount
      if (scannerElementRef.current && scannerElementRef.current.parentNode) {
        scannerElementRef.current.parentNode.removeChild(scannerElementRef.current);
        scannerElementRef.current = null;
      }
    };
  }, []);

  const cleanup = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    scannerRef.current = null;

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch (e) {
      // Ignore stop errors
    }

    // Wait a bit before clearing
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      scanner.clear();
    } catch (e) {
      // Ignore clear errors
    }

    // Hide scanner element
    if (scannerElementRef.current) {
      scannerElementRef.current.style.display = "none";
    }
  }, []);

  const stopCamera = useCallback(async () => {
    await cleanup();
    if (mountedRef.current) {
      setIsScanning(false);
    }
  }, [cleanup]);

  const startCamera = useCallback(async () => {
    if (!mountedRef.current || !scannerElementRef.current) return;

    setError(null);
    setIsLoading(true);

    try {
      await cleanup();

      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

      const formatsToSupport = [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.CODE_93,
        Html5QrcodeSupportedFormats.CODABAR,
        Html5QrcodeSupportedFormats.ITF,
        Html5QrcodeSupportedFormats.PDF_417,
        Html5QrcodeSupportedFormats.AZTEC,
        Html5QrcodeSupportedFormats.DATA_MATRIX,
      ];

      await new Promise(resolve => setTimeout(resolve, 100));
      if (!mountedRef.current) return;

      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        throw new Error("No cameras found");
      }

      // Select back camera by ID (more reliable than facingMode on mobile)
      const backCamera = cameras.find(c =>
        c.label.toLowerCase().includes("back") ||
        c.label.toLowerCase().includes("rear") ||
        c.label.toLowerCase().includes("environment")
      );
      const selectedCamera = backCamera || cameras[cameras.length - 1]; // Last camera is often back camera

      // Show scanner element
      scannerElementRef.current.style.display = "block";

      const scanner = new Html5Qrcode(scannerElementRef.current.id, {
        formatsToSupport,
        verbose: false,
      });
      scannerRef.current = scanner;

      // Calculate responsive qrbox
      const containerWidth = containerRef.current?.offsetWidth || 300;
      const qrboxSize = Math.min(Math.floor(containerWidth * 0.7), 250);

      await scanner.start(
        selectedCamera.id,
        {
          fps: 10,
          qrbox: { width: qrboxSize, height: Math.floor(qrboxSize * 0.5) },
        },
        (decodedText: string, decodedResult: any) => {
          if (mountedRef.current) {
            const format = decodedResult?.result?.format?.formatName;
            onScan(decodedText, format);
            stopCamera();
          }
        },
        () => {}
      );

      if (mountedRef.current) {
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      await cleanup();

      if (!mountedRef.current) return;

      const message = err instanceof Error ? err.message : String(err);

      if (message.includes("NotAllowedError") || message.toLowerCase().includes("permission")) {
        setError("Camera access denied. Please allow camera access in your browser settings.");
      } else if (message.includes("No cameras") || message.includes("NotFoundError")) {
        setError("No camera found on this device.");
      } else if (message.includes("NotReadableError")) {
        setError("Camera is in use by another application.");
      } else {
        setError("Could not start camera. Try the Upload button instead.");
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [onScan, stopCamera, cleanup]);

  // Process image to fix mobile orientation and resize for scanner compatibility
  const processImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          // Mobile images are often 12MP+ which causes scanner to fail
          // Downscale to max 800px for reliable barcode detection
          const maxDim = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round(height * (maxDim / width));
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round(width * (maxDim / height));
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.8 // Lower quality helps with processing
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsLoading(true);

    // Reset file input immediately so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

      const formatsToSupport = [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.CODE_93,
        Html5QrcodeSupportedFormats.CODABAR,
        Html5QrcodeSupportedFormats.ITF,
        Html5QrcodeSupportedFormats.PDF_417,
        Html5QrcodeSupportedFormats.AZTEC,
        Html5QrcodeSupportedFormats.DATA_MATRIX,
      ];

      // Create temp element
      const tempId = `temp-scanner-${Date.now()}`;
      const tempDiv = document.createElement("div");
      tempDiv.id = tempId;
      tempDiv.style.cssText = "position:fixed;left:-9999px;width:300px;height:300px;";
      document.body.appendChild(tempDiv);

      let tempScanner: any = null;
      let result: string | null = null;

      try {
        tempScanner = new Html5Qrcode(tempId, { formatsToSupport, verbose: false });

        // Try original file first (works better on desktop)
        try {
          result = await tempScanner.scanFile(file, false);
        } catch {
          // If original fails, try processed/compressed version (better for mobile)
          const processedFile = await processImage(file);
          result = await tempScanner.scanFile(processedFile, false);
        }

        if (result) {
          onScan(result, undefined);
        }
      } finally {
        if (tempScanner) {
          try { tempScanner.clear(); } catch {}
        }
        setTimeout(() => {
          const el = document.getElementById(tempId);
          if (el) el.remove();
        }, 50);
      }
    } catch (err) {
      console.error("File scan error:", err);
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("No barcode") || message.includes("No MultiFormat")) {
        setError("No barcode found in image. Try a clearer photo with good lighting.");
      } else {
        setError(`Scan failed: ${message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onScan, processImage]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="space-y-4">
      {/* Container wrapper */}
      <div className="w-full aspect-[4/3] bg-muted/50 rounded-lg overflow-hidden relative">
        {/* Scanner element container - must have explicit dimensions for video to show */}
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        {/* Overlay for placeholder/loading - separate from scanner */}
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isLoading ? (
              <div className="bg-muted/80 absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Image
                src="/scanner-placeholder.svg"
                alt="Barcode scanner"
                width={200}
                height={140}
                className="opacity-90"
                priority
              />
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <div className="flex gap-2">
        {!isScanning ? (
          <>
            <Button
              onClick={startCamera}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              {isLoading ? "Starting..." : "Start Camera"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </>
        ) : (
          <Button onClick={stopCamera} variant="secondary" className="flex-1">
            <X className="h-4 w-4" />
            Stop Camera
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default Scanner;
