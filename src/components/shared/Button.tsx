"use client";

import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({ className, variant = "primary", size = "md", loading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-5 py-3 text-sm",
        size === "lg" && "px-6 py-4 text-base",
        variant === "primary" && "bg-accent-primary text-white shadow-[0_14px_32px_rgba(74,144,226,0.24)] hover:bg-[#357ABD]",
        variant === "secondary" && "border border-[#34C759]/30 bg-accent-secondary text-white shadow-[0_12px_28px_rgba(52,199,89,0.18)] hover:bg-[#269E46]",
        variant === "tertiary" && "bg-transparent text-text-secondary hover:text-text-primary",
        className,
      )}
    >
      {loading ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
