"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/home", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scenarios", label: "Practice" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/home" && pathname.startsWith(href));
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (pathname === "/" || pathname.startsWith("/chat")) return null;

  return (
    <header className="sticky top-0 z-50 h-[var(--header-height)] border-b border-border bg-bg-primary/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
        <Link id="header-logo" href="/home" className="gradient-text text-xl font-bold">
          Fluentia
        </Link>
        <div className="hidden h-full items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              id={`header-link-${link.label.toLowerCase()}`}
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
        <button
          id="header-mobile-menu"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((current) => !current)}
          className="rounded-full border border-border p-2 text-text-secondary hover:text-text-primary md:hidden"
        >
          {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
        </button>
      </nav>
      {open ? (
        <div className="border-b border-border bg-bg-primary/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <div className="mx-auto grid max-w-6xl gap-2">
            {links.map((link) => (
              <Link
                id={`header-mobile-link-${link.label.toLowerCase()}`}
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
          </div>
        </div>
      ) : null}
    </header>
  );
}
