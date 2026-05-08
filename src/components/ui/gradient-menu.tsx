"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Brain, Home, LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Home", href: "/home", icon: <Home />, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard />, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
  { title: "Boost", href: "/brain-boost", icon: <Brain />, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { title: "Speak", href: "/mode", icon: <MessageSquare />, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { title: "Stats", href: "/dashboard#progress", icon: <BarChart3 />, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
  { title: "Settings", href: "/settings", icon: <Settings />, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
];

export function GradientMenu() {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    const frame = window.requestAnimationFrame(handleHashChange);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  return (
    <nav aria-label="Quick navigation" className="flex items-center justify-center bg-transparent py-4">
      <ul className="flex max-w-full gap-2 overflow-x-auto px-1 sm:gap-4">
        {menuItems.map(({ title, href, icon, from, to }) => {
          // Fix for hash links: handle active state properly
          const pathPart = href.split("#")[0];
          const hashPart = href.includes("#") ? "#" + href.split("#")[1] : "";
          
          let isActive = false;
          if (href.includes("#")) {
            isActive = pathname === pathPart && currentHash === hashPart;
          } else {
            isActive = (pathname === href || (href === "/brain-boost" && pathname.startsWith("/brain-boost"))) && (!currentHash || currentHash === "");
          }
          return (
            <li key={href} className="group relative shrink-0">
              <Link
                href={href}
                aria-label={title}
                style={{ "--gradient-from": from, "--gradient-to": to } as React.CSSProperties}
                className={cn(
                  "group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 sm:h-[56px] sm:w-[56px] sm:hover:w-[152px]",
                  isActive && "border-white/20 sm:w-[152px]",
                )}
              >
                <span
                  className={cn(
                    "absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 top-2 -z-10 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[14px] transition-all duration-300",
                    isActive ? "opacity-30" : "opacity-0 sm:group-hover:opacity-30",
                  )}
                />
                <span className={cn("relative z-10 text-text-secondary transition-all duration-300 sm:group-hover:scale-0", isActive && "text-white sm:scale-0")}>
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
