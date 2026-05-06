"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/chat")) return null;

  return (
    <footer className="border-t border-border bg-bg-primary px-5 py-8 text-sm text-text-secondary">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p>&copy; 2026 AI Speaking Coach</p>
        <nav aria-label="Footer" className="flex items-center gap-4">
          {footerLinks.map((link) => (
            <Link key={link.href} id={`footer-${link.label.toLowerCase()}`} href={link.href} className="hover:text-text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
