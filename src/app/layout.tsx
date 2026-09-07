import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StarfieldBackground } from "@/components/shared/StarfieldBackground";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/lib/toast/ToastContext";
import { APP_CONFIG } from "@/lib/constants";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} — Private Romantic Journal`,
  description: APP_CONFIG.tagline,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_CONFIG.name,
  },
  openGraph: {
    title: `${APP_CONFIG.name} | ${APP_CONFIG.couple.monogram}`,
    description: APP_CONFIG.tagline,
    siteName: APP_CONFIG.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable} dark`}>
      <body className="bg-universe-950 text-cream-50 font-sans antialiased min-h-screen flex flex-col selection:bg-gold-400/20 selection:text-gold-200">
        <AuthProvider>
          <ToastProvider>
            {/* Ambient celestial background canvas */}
            <StarfieldBackground />

            {/* Global Floating Glass Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 pt-20 sm:pt-24">{children}</main>

            {/* Global Luxury Footer */}
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
