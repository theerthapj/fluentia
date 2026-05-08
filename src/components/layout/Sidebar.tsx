"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  BarChart3,
  Brain,
  Home,
  LayoutDashboard,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Waves,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppState } from "@/components/providers/AppStateProvider";
import { GradientMenu } from "@/components/ui/gradient-menu";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Home", Icon: Home, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
  { href: "/brain-boost", label: "Brain Boost Zone", Icon: Brain, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { href: "/mode", label: "Practice", Icon: MessageSquare, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { href: "/free-chat", label: "Free Chat", Icon: Waves, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
  { href: "/dashboard#progress", label: "Progress", Icon: BarChart3, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
  { href: "/settings", label: "Settings", Icon: Settings, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
];

type SidebarProps = {
  collapsed?: boolean;
  mobileOnly?: boolean;
  onToggleCollapsed?: () => void;
};

export function Sidebar({ collapsed = false, mobileOnly = false, onToggleCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { resetDemo } = useAppState();
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

  // On mobile, we only show the GradientMenu (floating dock)
  if (mobileOnly) {
    return (
      <div className="flex justify-center">
        <GradientMenu />
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "relative z-50 flex h-screen flex-col overflow-hidden border-r border-white/10 bg-surface/45 shadow-2xl backdrop-blur-xl transition-[padding] duration-300",
        collapsed ? "p-3" : "p-5",
      )}
      data-collapsed={collapsed}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_10%,rgba(20,184,166,0.16),transparent_28%),radial-gradient(circle_at_88%_32%,rgba(59,130,246,0.12),transparent_30%)]" />
      <div className={cn("relative z-10 mb-5 flex items-center", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed ? (
          <Link href="/home" className="gradient-text truncate text-xl font-black tracking-tighter">
            Fluentia
          </Link>
        ) : null}
        <button
          id="sidebar-collapse-toggle"
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-text-secondary transition hover:border-accent-primary/40 hover:bg-accent-primary/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70"
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" aria-hidden /> : <PanelLeftClose className="h-5 w-5" aria-hidden />}
        </button>
      </div>
      <nav aria-label="Main Navigation" className="relative z-10 flex-1 overflow-y-auto pr-1">
        <ul className="grid gap-3">
          {items.map(({ href, label, Icon, from, to }) => {
            let active = false;
            if (href.includes("#")) {
              const [path, hash] = href.split("#");
              active = pathname === path && currentHash === "#" + hash;
            } else {
              active = (pathname === href || (href === "/brain-boost" && pathname.startsWith("/brain-boost"))) && (!currentHash || currentHash === "");
            }
            return (
              <li key={href}>
                <Link
                  id={`sidebar-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  aria-label={collapsed ? label : undefined}
                  title={collapsed ? label : undefined}
                  style={{ "--gradient-from": from, "--gradient-to": to } as React.CSSProperties}
                  className={cn(
                    "group relative flex min-h-14 items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.045] text-sm font-semibold text-text-secondary shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:text-white hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70",
                    collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
                    active 
                      ? "border-white/20 text-white shadow-2xl" 
                      : ""
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-0 bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] transition-opacity duration-300",
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute inset-x-4 top-3 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-2xl transition-opacity duration-300",
                      active ? "opacity-30" : "opacity-0 group-hover:opacity-30",
                    )}
                  />
                  <Icon 
                    aria-hidden="true" 
                    className={cn("relative z-10 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", active && "scale-110")} 
                  />
                  <span className={cn("relative z-10 truncate text-base transition-all duration-300 group-hover:translate-x-1", collapsed && "sr-only")}>
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative z-10 mt-auto border-t border-white/10 pt-6">
        <button
          id="sidebar-reset-demo"
          onClick={() => {
            resetDemo();
            toast.success("Demo data reset.");
            router.push("/home");
          }}
          aria-label={collapsed ? "Reset demo" : undefined}
          title={collapsed ? "Reset demo" : undefined}
          className={cn(
            "group relative flex min-h-14 w-full items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] text-sm font-semibold text-error shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-error/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/60",
            collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
          )}
        >
          <span className="absolute inset-0 bg-[linear-gradient(45deg,#ef4444,#f97316)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute inset-x-4 top-3 h-full rounded-full bg-[linear-gradient(45deg,#ef4444,#f97316)] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30" />
          <ArrowLeft className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className={cn("relative z-10 text-base", collapsed && "sr-only")}>Reset Demo</span>
        </button>
      </div>
    </aside>
  );
}
