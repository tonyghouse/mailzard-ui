"use client";

import {
  LayoutDashboard,
  FileEdit,
  FileStack,
  CalendarClock,
  AlertCircle,
  BarChart3,
  Cable,
  Menu,
  X,
  ChevronLeft,
  ContactIcon,
  Mail
} from "lucide-react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Using lucide-react icons with clean, geometric designs
const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Templates", url: "/templates", icon: FileStack },
  { title: "Scheduled Emails", url: "/scheduled-emails", icon: CalendarClock },
  { title: "Failed Emails", url: "/failed-emails", icon: AlertCircle },
  { title: "Contacts", url: "/contacts", icon: ContactIcon },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Connect Accounts", url: "/connect-accounts", icon: Cable },
];

export function AppSidebar({ isMobile }: { isMobile?: boolean }) {
  const { isSignedIn, user } = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  /* ================= MOBILE ================= */
  if (isMobile) {
    return (
      <>
        <div className="flex items-center justify-between h-16 w-full bg-background border-b border-border px-4">
          {/* Mobile toggle */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="p-2 hover:bg-muted transition-colors"
          >
            {isDrawerOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-semibold text-foreground">MAILZARD</span>
            <Badge
              variant="outline"
              className="border-red-500/20 bg-red-500/10 text-red-600 text-[0.6rem] px-1.5"
            >
              Beta
            </Badge>
          </Link>

          {/* Profile */}
          {isSignedIn && (
            <UserButton
              appearance={{ elements: { avatarBox: "w-8 h-8" } }}
            />
          )}
        </div>

        {/* Overlay */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}

        {/* Drawer */}
        <div
          className={`
            fixed top-16 left-0
            h-[calc(100vh-4rem)] w-64
            bg-background
            border-r border-border
            z-50 transition-transform duration-300
            ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <nav className="px-3 py-4 space-y-1">
            {items.map(({ title, url, icon: Icon }) => (
              <Link
                key={title}
                href={url}
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Icon className="h-5 w-5" />
                {title}
              </Link>
            ))}
          </nav>
        </div>
      </>
    );
  }

  /* ================= DESKTOP ================= */
  return (
    <div
      className={`
        h-screen
        flex flex-col
        bg-background
        border-r border-border
        transition-all duration-300
        ${isCollapsed ? "w-16" : "w-64"}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!isCollapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-semibold text-foreground">MAILZARD</span>
            <Badge
              variant="outline"
              className="border-red-500/20 bg-red-500/10 text-red-600 text-[0.6rem] px-1.5"
            >
              Beta
            </Badge>
          </Link>
        ) : (
          <div className="w-full flex justify-center">
            <Mail className="h-5 w-5 text-foreground" />
          </div>
        )}

        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mt-2 p-1.5 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
        </button>
      )}

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ title, url, icon: Icon }) => (
          <Link
            key={title}
            href={url}
            title={isCollapsed ? title : undefined}
            className={`
              flex items-center gap-3
              px-4 py-2.5
              text-sm text-muted-foreground
              hover:text-foreground hover:bg-muted
              transition-colors
              ${isCollapsed && "justify-center"}
            `}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{title}</span>}
          </Link>
        ))}
      </nav>

      {/* USER */}
      <div className="border-t border-border px-4 py-4">
        {isSignedIn ? (
          <div
            className={`flex items-center gap-3 ${
              isCollapsed && "justify-center"
            }`}
          >
            <UserButton
              appearance={{ elements: { avatarBox: "w-9 h-9" } }}
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            )}
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className={`w-full ${isCollapsed && "px-2"}`}>
              {isCollapsed ? "Sign In" : "Sign In"}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}