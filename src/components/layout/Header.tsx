"use client";

import Link from "next/link";
import { Menu, MessageSquare, Settings, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/home", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/mode", label: "Practice" },
  { href: "/free-chat", label: "Free Chat" },
  { href: "/settings", label: "Settings" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/home" && pathname.startsWith(href));
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { state, updatePreferences } = useAppState();

  if (pathname === "/" || pathname.startsWith("/chat")) return null;

  return (
    <header className="sticky top-0 z-50 h-[var(--header-height)] border-b border-border bg-bg-primary/85 backdrop-blur-xl">
      <nav aria-label="Primary" className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
        <Link id="header-logo" href="/home" className="gradient-text text-xl font-bold">
          Fluentia
        </Link>
        <div className="hidden h-full items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              id={`header-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              key={link.href}
              href={link.href}
              className={cn(
                "flex h-full items-center border-b-2 border-transparent text-sm font-semibold text-text-secondary transition hover:text-text-primary",
                isActive(pathname, link.href) && "border-accent-primary text-accent-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">

          <button
            onClick={() => {
              updatePreferences({
                preferredInputMode: state.preferences.preferredInputMode === "voice" ? "text" : "voice",
              });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-text-secondary transition hover:bg-white/5 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            <MessageSquare aria-hidden="true" className="h-3.5 w-3.5" />
            {state.preferences.preferredInputMode === "voice" ? "Voice First" : "Text First"}
          </button>
        </div>
        <button
          id="header-mobile-menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((current) => !current)}
          className="rounded-full border border-border p-2 text-text-secondary hover:text-text-primary md:hidden"
        >
          {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
      </nav>
      {open ? (
        <div id="mobile-nav" className="border-b border-border bg-bg-primary/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <div className="mx-auto grid max-w-6xl gap-2">
            {links.map((link) => (
              <Link
                id={`header-mobile-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary hover:bg-white/5 hover:text-text-primary",
                  isActive(pathname, link.href) && "text-accent-primary",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              id="header-mobile-link-settings-shortcut"
              href="/settings"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-semibold text-text-secondary"
            >
              <Settings aria-hidden="true" className="h-4 w-4" />
              Quick Settings
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
