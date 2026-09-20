import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// On Apple devices the app uses the system San Francisco font; Inter is the fallback elsewhere.
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apple Orbit AI Agent — iPhone prototype",
  description: "Prototype of an agent platform for iPhone: home, agent library, voice capture, and agent builder.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
