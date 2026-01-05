import "./globals.css";
import type { Metadata } from "next";
import { Outfit, Geist_Mono, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import ClientToaster from "@/components/generic/ClientToaster";

/* Main UI font */
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/* Mono font (code, ids, logs) */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/* Serif font (optional but elegant for headings / marketing copy) */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mailzard",
  description: "Marketing and Transactional Emails, Simplified.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            outfit.variable,
            geistMono.variable,
            playfair.variable
          )}
        >
          <ClientToaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
