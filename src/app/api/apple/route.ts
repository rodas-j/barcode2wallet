import { NextRequest, NextResponse } from "next/server";
import { PKPass } from "passkit-generator";
import path from "path";
import fs from "fs";
import os from "os";
import { v4 as uuidv4 } from 'uuid';

// Apple Wallet barcode format types
type BarcodeFormat = "PKBarcodeFormatQR" | "PKBarcodeFormatPDF417" | "PKBarcodeFormatAztec" | "PKBarcodeFormatCode128";

// Helper to handle certs in both Local (file) and Vercel (Env Var) environments
const resolveCert = (fileName: string, envVarName: string): string => {
  // 1. Try Environment Variable (Production/Vercel)
  if (process.env[envVarName]) {
    const tempPath = path.join(os.tmpdir(), fileName);
    fs.writeFileSync(tempPath, process.env[envVarName] as string);
    return tempPath;
  }

  // 2. Fallback to local 'certs' directory (Local Dev)
  return path.resolve(process.cwd(), "certs", fileName);
};

// Convert hex color to RGB format for Apple Wallet
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return "rgb(96, 163, 137)"; // Default green
};

// Map scanner formats to Apple Wallet formats
const mapBarcodeFormat = (scannedFormat: string = ""): BarcodeFormat => {
  const format = scannedFormat.toUpperCase();
  switch (format) {
    case 'QR_CODE':
    case 'QR':
      return 'PKBarcodeFormatQR';
    case 'PDF_417':
      return 'PKBarcodeFormatPDF417';
    case 'AZTEC':
      return 'PKBarcodeFormatAztec';
    case 'CODE_128':
    case 'CODE_39':
    case 'EAN_13':
    case 'EAN_8':
    case 'UPC_A':
    case 'UPC_E':
      return 'PKBarcodeFormatCode128';
    default:
      console.warn(`Warning: Unsupported barcode format '${scannedFormat}'. Defaulting to Code 128.`);
      return 'PKBarcodeFormatCode128';
  }
};

export async function POST(req: NextRequest) {
  try {
    const { barcode, format, location, backgroundColor, label } = await req.json();

    if (!barcode) {
      return NextResponse.json({ message: "Barcode required" }, { status: 400 });
    }

    // RESOLVE CERTIFICATES
    // checks Env Vars first, then local files
    const wwdr = resolveCert("wwdr.pem", "WWDR_CERT_PEM");
    const signerCert = resolveCert("pass.pem", "SIGNER_CERT_PEM");
    const signerKey = resolveCert("key.pem", "SIGNER_KEY_PEM");

    // Validate existence
    if (!fs.existsSync(signerCert) || !fs.existsSync(signerKey) || !fs.existsSync(wwdr)) {
      console.error("Certificates missing at paths:", { wwdr, signerCert, signerKey });
      return NextResponse.json({ 
        message: "Server Configuration Error: Certificates not found. Check Environment Variables or certs/ folder." 
      }, { status: 500 });
    }

    // Load the template model
    const modelPath = path.resolve(process.cwd(), "src/lib/pass-model.pass");

    // Read certificate contents directly instead of passing paths
    const wwdrContent = fs.readFileSync(wwdr, 'utf8');
    const signerCertContent = fs.readFileSync(signerCert, 'utf8');
    const signerKeyContent = fs.readFileSync(signerKey, 'utf8');

    // Create the pass with overrides
    const pass = await PKPass.from({
      model: modelPath,
      certificates: {
        wwdr: wwdrContent,
        signerCert: signerCertContent,
        signerKey: signerKeyContent,
      },
    }, {
      serialNumber: uuidv4(),
      backgroundColor: hexToRgb(backgroundColor || "#60a389"),
      logoText: label || "My Card",
      description: label || "Digital Barcode Pass",
    });

    // Set barcode using the API method
    const appleBarcodeFormat = mapBarcodeFormat(format);
    console.log(`Mapping scanned format '${format}' to '${appleBarcodeFormat}'`);

    pass.setBarcodes({
      format: appleBarcodeFormat,
      message: barcode,
      messageEncoding: "iso-8859-1"
    });

    // Location Injection
    if (location && location.lat && location.lng) {
      pass.setLocations({
        latitude: location.lat,
        longitude: location.lng,
        relevantText: "Your card is nearby"
      });
    }

    // Generate buffer
    const buffer = pass.getAsBuffer();

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="pass.pkpass"`,
      },
    });

  } catch (error: any) {
    console.error("Pass Generation Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
