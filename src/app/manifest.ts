import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Barcode to Wallet",
    short_name: "Barcode2Wallet",
    description: "Convert physical barcode cards to digital wallet passes",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#60a389",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
