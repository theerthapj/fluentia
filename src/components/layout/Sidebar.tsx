"use client";

import Link from "next/link";
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
import { useFluvi } from "@/context/FluviContext";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", Icon: Home, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
  { href: "/mode", label: "Practice", Icon: MessageSquare, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { href: "/brain-boost", label: "Brain Boost", Icon: Brain, from: "var(--accent-primary)", to: "var(--accent-secondary)" },
  { href: "/free-chat", label: "Free Chat", Icon: Waves, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
  { href: "/progress", label: "Progress", Icon: BarChart3, from: "var(--accent-secondary)", to: "var(--accent-primary)" },
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
  const { dispatch } = useFluvi();
  const showDemoReset = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_DEMO_RESET === "true";

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
        "relative z-50 flex h-screen flex-col bg-transparent transition-[padding] duration-300",
        collapsed ? "overflow-visible p-3 pt-6" : "overflow-hidden p-5",
      )}
      data-collapsed={collapsed}
    >
      <div className={cn("relative z-20 flex items-center", collapsed ? "mb-7 justify-center" : "mb-5 justify-between")}>
        {!collapsed ? (
          <Link href="/" aria-label="Go to Fluentia home page" className="gradient-text truncate text-xl font-black tracking-tighter">
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
      <nav aria-label="Main Navigation" className={cn("relative z-30 flex-1", collapsed ? "overflow-visible pt-1" : "overflow-y-auto pr-1")}>
        <ul className={cn("grid", collapsed ? "gap-4" : "gap-3")}>
          {items.map(({ href, label, Icon, from, to }) => {
            const active = pathname === href || (href !== "/" && href === "/brain-boost" && pathname.startsWith("/brain-boost"));
            return (
              <li key={href} className={cn(collapsed && "relative h-14 w-14 overflow-visible")}>
                <Link
                  id={`sidebar-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  aria-label={collapsed ? label : undefined}
                  title={collapsed ? label : undefined}
                  style={{ "--gradient-from": from, "--gradient-to": to } as React.CSSProperties}
                  className={cn(
                    "group/nav relative flex min-h-14 items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] text-sm font-semibold text-text-secondary shadow-[0_14px_40px_rgba(2,6,23,0.28)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:text-white hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70",
                    collapsed ? "h-14 w-14 justify-start px-[17px] py-0 hover:w-52 hover:px-5" : "gap-3 px-4 py-3",
                    active 
                      ? "border-white/20 text-white shadow-2xl" 
                      : ""
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-0 bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] transition-opacity duration-300",
                      active ? "opacity-100" : "opacity-0 group-hover/nav:opacity-100",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute inset-x-4 top-3 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-2xl transition-opacity duration-300",
                      active ? "opacity-30" : "opacity-0 group-hover/nav:opacity-30",
                    )}
                  />
                  <Icon 
                    aria-hidden="true" 
                    className={cn("relative z-10 h-5 w-5 shrink-0 transition-transform duration-300 group-hover/nav:scale-110", active && "scale-110")} 
                  />
                  <span
                    aria-hidden={collapsed ? "true" : undefined}
                    className={cn(
                      "relative z-10 truncate text-base transition-all duration-300",
                      collapsed
                        ? "ml-3 max-w-0 -translate-x-1 overflow-hidden whitespace-nowrap opacity-0 group-hover/nav:max-w-40 group-hover/nav:translate-x-0 group-hover/nav:opacity-100"
                        : "group-hover/nav:translate-x-1",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {showDemoReset ? (
        <div className={cn("relative z-30 mt-auto", collapsed ? "overflow-visible pt-6" : "border-t border-white/10 pt-6")}>
          <button
            id="sidebar-reset-demo"
            onClick={() => {
              const confirmed = window.confirm("Reset all demo progress and return Fluentia to its first-time state?");
              if (!confirmed) return;
              resetDemo();
              dispatch({ type: "RESET_ALL" });
              toast.success("Demo data reset.");
              router.push("/");
            }}
            aria-label={collapsed ? "Reset demo" : undefined}
            title={collapsed ? "Reset demo" : undefined}
            className={cn(
              "group/reset relative flex min-h-14 items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] text-sm font-semibold text-error shadow-[0_14px_40px_rgba(2,6,23,0.28)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-error/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/60",
              collapsed ? "h-14 w-14 justify-start px-[17px] py-0 hover:w-44 hover:px-5" : "w-full gap-3 px-4 py-3",
            )}
          >
            <span className="absolute inset-0 bg-[linear-gradient(45deg,#ef4444,#f97316)] opacity-0 transition-opacity duration-300 group-hover/reset:opacity-100" />
            <span className="absolute inset-x-4 top-3 h-full rounded-full bg-[linear-gradient(45deg,#ef4444,#f97316)] opacity-0 blur-2xl transition-opacity duration-300 group-hover/reset:opacity-30" />
            <ArrowLeft className="relative z-10 h-5 w-5 shrink-0 transition-transform duration-300 group-hover/reset:-translate-x-1" />
            <span
              aria-hidden={collapsed ? "true" : undefined}
              className={cn(
                "relative z-10 text-base transition-all duration-300",
                collapsed
                  ? "ml-3 max-w-0 -translate-x-1 overflow-hidden whitespace-nowrap opacity-0 group-hover/reset:max-w-28 group-hover/reset:translate-x-0 group-hover/reset:opacity-100"
                  : "",
              )}
            >
              Reset Demo
            </span>
          </button>
        </div>
      ) : null}
    </aside>
  );
}
