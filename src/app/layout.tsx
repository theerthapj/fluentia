import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppStateProvider } from "@/components/providers/AppStateProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { FallingPattern } from "@/components/ui/falling-pattern";
import { FluviProvider } from "@/context/FluviContext";
import { FluviIntroGate } from "@/components/fluvi/FluviIntro";
import { FluviDebugPanel } from "@/components/fluvi/FluviDebugPanel";

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
      <body suppressHydrationWarning className="font-sans antialiased">
        <SmoothScrollProvider>
          <AppStateProvider>
            <FluviProvider>
              <div className="flex min-h-screen bg-bg-primary">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block lg:w-72 lg:shrink-0 relative z-50">
                  <Sidebar />
                </div>
                
                <div className="flex flex-1 flex-col overflow-hidden">
                  <Header />
                  <main className="relative isolate flex-1 overflow-y-auto pb-28 md:pb-32 lg:pb-8">
                    <FallingPattern className="absolute inset-0 z-[-1]" />
                    <div className="relative z-10">{children}</div>
                  </main>
                  <Footer />
                </div>

                {/* Mobile Sidebar (Fixed at bottom) */}
                <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 lg:hidden">
                  <Sidebar mobileOnly />
                </div>
              </div>
              <FluviIntroGate />
              <FluviDebugPanel />
            </FluviProvider>
          </AppStateProvider>
        </SmoothScrollProvider>
        <Toaster theme="dark" richColors position="top-center" />
      </body>
    </html>
  );
}
