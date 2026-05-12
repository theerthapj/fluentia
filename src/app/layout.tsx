import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { AppStateProvider } from "@/components/providers/AppStateProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { FluviProvider } from "@/context/FluviContext";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: {
    default: "Fluentia | AI Speaking Coach",
    template: "%s | Fluentia",
  },
  description: "A premium AI-powered English speaking coach for confident real-world practice.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="font-sans antialiased">
        <SmoothScrollProvider>
          <AppStateProvider userId={user?.id ?? null}>
            <FluviProvider>
              <AppShell>{children}</AppShell>
            </FluviProvider>
          </AppStateProvider>
        </SmoothScrollProvider>
        <Toaster theme="dark" richColors position="top-center" />
      </body>
    </html>
  );
}
