"use client";
import Link from "next/link";
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container mx-auto px-6">
        <nav className="h-16 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              MAILZARD
            </span>
            
            <Badge
              variant="outline"
              className="border-red-500/20 bg-red-500/10 text-red-600 text-[0.65rem] font-medium uppercase tracking-wide px-2 py-0.5"
            >
              Beta
            </Badge>
          </Link>

          {/* CENTER NAV LINKS (optional) */}
          {/* <div className="hidden md:flex items-center gap-1">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/docs">Docs</NavLink>
          </div> */}

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <UserButton 
                appearance={{ 
                  elements: { 
                    avatarBox: "w-8 h-8"
                  } 
                }} 
              />
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="h-10 px-5 font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button 
                    className="h-10 px-5 font-medium"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

// Optional: Navigation links component
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
}