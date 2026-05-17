"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Brain, Home, LayoutDashboard, MessageSquare, Settings, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Home", href: "/", icon: <Home />, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard />, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
  { title: "Studio", href: "/mode", icon: <MessageSquare />, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { title: "Boost", href: "/brain-boost", icon: <Brain />, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { title: "Chat", href: "/free-chat", icon: <Waves />, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
  { title: "Progress", href: "/progress", icon: <BarChart3 />, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
  { title: "Settings", href: "/settings", icon: <Settings />, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
];

export function GradientMenu() {
  const pathname = usePathname();

  return (
    <nav aria-label="Quick navigation" className="flex items-center justify-center bg-transparent py-4">
      <ul className="flex max-w-full gap-2 overflow-x-auto rounded-full border border-border bg-white/90 px-2 py-2 shadow-[0_14px_38px_rgba(74,144,226,0.18)] backdrop-blur-xl sm:gap-3">
        {menuItems.map(({ title, href, icon, from, to }) => {
          const isActive = pathname === href || (href === "/brain-boost" && pathname.startsWith("/brain-boost"));
          return (
            <li key={href} className="group relative shrink-0">
              <Link
                href={href}
                aria-label={title}
                aria-current={isActive ? "page" : undefined}
                style={{ "--gradient-from": from, "--gradient-to": to } as React.CSSProperties}
                className={cn(
                  "group relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-secondary text-text-secondary shadow-sm transition-all duration-300 sm:h-[56px] sm:w-[56px] sm:hover:w-[152px]",
                  isActive && "border-[#357ABD] bg-[#357ABD] text-white sm:w-[152px]",
                )}
              >
                <span
                  className={cn(
                    "absolute inset-0 rounded-full bg-[#357ABD] transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 top-2 -z-10 h-full rounded-full bg-accent-primary blur-[14px] transition-all duration-300",
                    isActive ? "opacity-20" : "opacity-0 sm:group-hover:opacity-20",
                  )}
                />
                <span className={cn("relative z-10 transition-all duration-300 sm:group-hover:scale-0", isActive && "text-white sm:scale-0")}>
                  {React.cloneElement(icon as React.ReactElement<{ className?: string; "aria-hidden"?: string }>, {
                    className: "h-5 w-5 sm:h-6 sm:w-6",
                    "aria-hidden": "true",
                  })}
                </span>
                <span
                  className={cn(
                    "absolute scale-0 text-xs font-bold uppercase text-white transition-all delay-100 duration-300 sm:group-hover:scale-100",
                    isActive && "sm:scale-100",
                  )}
                >
                  {title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
