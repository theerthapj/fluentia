"use client";

import Link from "next/link";
import { BarChart2, Home, LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAppState } from "@/components/providers/AppStateProvider";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Home", Icon: Home },
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/scenarios", label: "Practice", Icon: MessageSquare },
  { href: "/dashboard#progress", label: "Progress", Icon: BarChart2 },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resetDemo } = useAppState();

  return (
    <aside className="rounded-2xl border border-border bg-surface/60 p-4 lg:sticky lg:top-20 lg:h-[calc(100vh-96px)] lg:w-60">
      <Link id="sidebar-logo" href="/home" className="gradient-text block px-2 text-xl font-bold">
        Fluentia
      </Link>
      <nav className="mt-6 grid gap-1">
        {items.map(({ href, label, Icon }) => (
          <Link
            id={`sidebar-${label.toLowerCase()}`}
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary transition hover:bg-white/5 hover:text-text-primary",
              pathname === href.split("#")[0] && "bg-accent-primary/10 text-accent-primary",
            )}
          >
            <Icon aria-hidden className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <button
        id="sidebar-reset-demo"
        onClick={() => {
          resetDemo();
          router.push("/home");
        }}
        className="mt-8 rounded-xl px-3 py-3 text-left text-sm font-semibold text-error hover:bg-error/10"
      >
        Reset Demo
      </button>
    </aside>
  );
}
