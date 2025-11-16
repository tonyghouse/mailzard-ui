import "./globals.css";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
// import { Geist, Geist_Mono } from "next/font/google";
// import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/navbar";
import localFont from "next/font/local";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });




const heming = localFont({
  src: [
    {
      path: "../../public/fonts/HemingVariable.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-heming",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mailzard",
  description: "Marketing and Transactional Emails, Simplified.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <ClerkProvider>
    <html lang="en" className={heming.variable}>
      <body  className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
         <Navbar/>
          {children}
          {/* <Toaster /> */}
          </body>
    </html>
    </ClerkProvider>
  );
}
