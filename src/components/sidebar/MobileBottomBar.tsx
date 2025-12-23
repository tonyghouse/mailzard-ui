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
import { useEffect, useRef, useState } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateFade = () => {
      setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };

    updateFade();
    el.addEventListener("scroll", updateFade);
    window.addEventListener("resize", updateFade);

    return () => {
      el.removeEventListener("scroll", updateFade);
      window.removeEventListener("resize", updateFade);
    };
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border bg-background">
      <div className="relative h-full">
        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="
            flex items-center h-full gap-1 px-2
            overflow-x-auto scrollbar-none
          "
        >
          {/* Profile at start */}
          <div
            className="
              flex items-center justify-center
              min-w-[64px] h-full
              active:scale-90
              transition-transform duration-150 ease-out
            "
          >
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
                  "transition-transform duration-150 ease-out",
                  "active:scale-90",
                  isActive && "text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />

                {/* Active dot */}
                <span
                  className={cn(
                    "absolute bottom-2 h-1.5 w-1.5 rounded-full bg-foreground",
                    "transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </Link>
            );
          })}
        </div>

        {/* Right fade indicator */}
        {showRightFade && (
          <div
            className="
              pointer-events-none
              absolute top-0 right-0 h-full w-8
              bg-gradient-to-l
              from-background to-transparent
            "
          />
        )}
      </div>
    </nav>
  );
}
