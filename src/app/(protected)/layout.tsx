"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { MobileBottomBar } from "@/components/sidebar/MobileBottomBar";


export default function ProtectedRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <>
      <SignedIn>
        {isMobile ? (
          <div className="pb-16">
            {/* Content */}
            <main className="p-4">{children}</main>

            {/* Bottom Nav */}
            <MobileBottomBar />
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
