import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AppStateProvider } from "@/components/providers/AppStateProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Fluentia | AI Speaking Coach",
    template: "%s | Fluentia",
  },
  description: "A premium AI-powered English speaking coach for confident real-world practice.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased`}>
        <SmoothScrollProvider>
          <AppStateProvider>{children}</AppStateProvider>
        </SmoothScrollProvider>
        <Toaster theme="dark" richColors position="top-center" />
      </body>
    </html>
  );
}
