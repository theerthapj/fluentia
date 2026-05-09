import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import type { ReactNode } from "react";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const motionPropNames = new Set([
    "animate",
    "custom",
    "exit",
    "initial",
    "layout",
    "transition",
    "variants",
    "viewport",
    "whileHover",
    "whileInView",
    "whileTap",
  ]);

  const createMotionElement = (tag: string) => {
    const MotionElement = React.forwardRef<HTMLElement, { children?: ReactNode; [key: string]: unknown }>(
      ({ children, ...props }, ref) => {
        const domProps = Object.fromEntries(
          Object.entries(props).filter(([key]) => !motionPropNames.has(key)),
        );
        return React.createElement(tag, { ...domProps, ref }, children);
      },
    );
    MotionElement.displayName = `MockMotion.${tag}`;
    return MotionElement;
  };

  return {
    AnimatePresence: ({ children }: { children?: ReactNode }) => React.createElement(React.Fragment, null, children),
    motion: new Proxy(
      {},
      {
        get: (_target, tag: string) => createMotionElement(tag),
      },
    ),
  };
});

vi.mock("sonner", () => ({
  Toaster: () => null,
  toast: {
    success: () => undefined,
    error: () => undefined,
    info: () => undefined,
    warning: () => undefined,
  },
}));
