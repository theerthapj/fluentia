"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, BarChart2, Brain, Home, LayoutDashboard, MessageSquare, Settings, Waves } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppState } from "@/components/providers/AppStateProvider";
import { GradientMenu } from "@/components/ui/gradient-menu";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Home", Icon: Home },
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/brain-boost", label: "Brain Boost Zone", Icon: Brain },
  { href: "/mode", label: "Practice", Icon: MessageSquare },
  { href: "/free-chat", label: "Free Chat", Icon: Waves },
  { href: "/dashboard#progress", label: "Progress", Icon: BarChart2 },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export function Sidebar({ mobileOnly = false }: { mobileOnly?: boolean }) {
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
    <aside className="flex h-screen flex-col border-r border-border bg-surface/60 p-6">
      <nav aria-label="Main Navigation" className="flex-1 overflow-y-auto">
        <ul className="grid gap-2">
          {items.map(({ href, label, Icon }) => {
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
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                    active 
                      ? "bg-accent-primary/15 text-accent-primary shadow-[inset_0_0_0_1px_rgba(20,184,166,0.2)]" 
                      : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                  )}
                >
                  <Icon 
                    aria-hidden="true" 
                    className={cn("h-4 w-4 transition-transform group-hover:scale-110", active && "scale-110")} 
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-border/50">
        <button
          id="sidebar-reset-demo"
          onClick={() => {
            resetDemo();
            toast.success("Demo data reset.");
            router.push("/home");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-error transition-colors hover:bg-error/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Reset Demo
        </button>
      </div>
    </aside>
  );
}
