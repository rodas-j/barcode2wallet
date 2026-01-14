# barcode2wallet

A Next.js application to digitize physical barcode cards into Apple Wallet and Google Wallet passes.

## Prerequisites

1.  **Node.js** (v18+)
2.  **Apple Developer Account** (For Apple Wallet)
3.  **Google Pay Issuer Account** (For Google Wallet)

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  **Certificates (Crucial Step)**:
    To generate valid `.pkpass` files, you must place your Apple certificates in the `certs/` folder at the root of the project.
    
    *   `certs/wwdr.pem`: Apple Worldwide Developer Relations Certificate.
    *   `certs/signerCert.pem`: Your Pass Type ID Certificate.
    *   `certs/signerKey.pem`: The private key for your certificate.

    > **Note:** Do not commit these files to Git!

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:3000` on your phone (or a device with a camera).

## How it works

1.  **Scan:** Use the camera to scan a barcode from a physical card.
2.  **Label:** Give the card a name (e.g., "Library Card").
3.  **Generate:** Click the button to download the pass.

## Troubleshooting

*   **Scanner not working?** Ensure you have granted camera permissions to the browser.
*   **"Missing Certificates" error?** You cannot generate a real Apple Wallet pass without valid certificates signed by Apple. This is a security requirement by Apple.