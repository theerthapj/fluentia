"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (!["/", "/home", "/dashboard"].includes(pathname)) return null;

  return (
    <footer className="border-t border-border bg-bg-primary px-5 py-8 text-sm text-text-secondary">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p>© 2025 Fluentia - AI Speaking Coach</p>
        <div className="flex items-center gap-4">
          <Link id="footer-about" href="#" className="hover:text-text-primary">About</Link>
          <Link id="footer-privacy" href="#" className="hover:text-text-primary">Privacy</Link>
          <Link id="footer-contact" href="#" className="hover:text-text-primary">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
