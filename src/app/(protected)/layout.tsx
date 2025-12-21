"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

export default function ProtectedRootLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <>
      <SignedIn>
        {isMobile ? (
          <div> 
            <AppSidebar />
            <main className="p-4">{children}</main>
          </div>
        ) : (
          <div className="flex h-screen w-full">
            <AppSidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        )}
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/sign-in" />
      </SignedOut>
    </>
  );
}
