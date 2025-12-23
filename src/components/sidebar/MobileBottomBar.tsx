"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileStack,
  CalendarClock,
  AlertCircle,
  ContactIcon,
  BarChart3,
  Cable,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Templates", url: "/templates", icon: FileStack },
  { title: "Scheduled", url: "/scheduled-emails", icon: CalendarClock },
  { title: "Failed", url: "/failed-emails", icon: AlertCircle },
  { title: "Contacts", url: "/contacts", icon: ContactIcon },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Accounts", url: "/connect-accounts", icon: Cable },
];

export function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        border-t border-border bg-background
        h-16
      "
    >
      <div
        className="
          flex items-center gap-1
          h-full px-2
          overflow-x-auto
          scrollbar-none
        "
      >
            {/* Profile */}
        <div className="flex items-center justify-center min-w-[64px] h-full">
          <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
        </div>

    {items.map(({ title, url, icon: Icon }) => {
  const isActive = pathname.startsWith(url);

  return (
    <Link
      key={title}
      href={url}
      className={cn(
        "relative flex flex-col items-center justify-center",
        "min-w-[64px] h-full",
        "text-muted-foreground",
        "transition-all duration-150 ease-out",
        "active:scale-90",              // 👈 haptic press
        isActive && "text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />

      {/* Active indicator dot */}
      <span
        className={cn(
          "absolute bottom-2",
          "h-1.5 w-1.5 rounded-full",
          "bg-foreground",
          "transition-opacity duration-200",
          isActive ? "opacity-100" : "opacity-0"
        )}
      />
    </Link>
  );
})}


    
      </div>
    </nav>
  );
}
