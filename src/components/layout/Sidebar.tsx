"use client";

import Link from "next/link";
import { BarChart2, Home, LayoutDashboard, MessageSquare, Settings, Volume2, Waves } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppState } from "@/components/providers/AppStateProvider";
import { GradientMenu } from "@/components/ui/gradient-menu";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Home", Icon: Home },
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/mode", label: "Practice", Icon: MessageSquare },
  { href: "/free-chat", label: "Free Chat", Icon: Waves },
  { href: "/pronunciation", label: "Pronunciation", Icon: Volume2 },
  { href: "/dashboard#progress", label: "Progress", Icon: BarChart2 },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, resetDemo } = useAppState();

  return (
    <aside className="rounded-2xl border border-border bg-surface/60 p-4 lg:sticky lg:top-20 lg:h-[calc(100vh-96px)] lg:w-72">
      <div className="lg:hidden">
        <GradientMenu />
      </div>
      <Link id="sidebar-logo" href="/home" className="gradient-text block px-2 text-xl font-bold">
        Fluentia
      </Link>
      <p className="mt-2 px-2 text-sm text-text-secondary">
        Listening: {state.preferences.listeningEnabled ? "On" : "Off"} · Speed: {state.preferences.playbackSpeed}
      </p>
      <nav aria-label="Dashboard" className="mt-6 hidden lg:block">
        <ul className="grid gap-1">
          {items.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link
                id={`sidebar-${label.toLowerCase().replace(/\s+/g, "-")}`}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary transition hover:bg-white/5 hover:text-text-primary",
                  pathname === href.split("#")[0] && "bg-accent-primary/10 text-accent-primary",
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        id="sidebar-reset-demo"
        onClick={() => {
          resetDemo();
          toast.success("Demo data reset.");
          router.push("/home");
        }}
        className="mt-8 rounded-xl px-3 py-3 text-left text-sm font-semibold text-error hover:bg-error/10"
      >
        Reset Demo
      </button>
    </aside>
  );
}
