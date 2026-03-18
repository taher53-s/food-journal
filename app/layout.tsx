import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: { default: "FoodLog — A Personal Food Journal", template: "%s | FoodLog" },
  description: "A beautifully curated personal restaurant and food diary. Exploring the world one plate at a time.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Food Journal",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152.png", sizes: "152x152", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Food Journal",
    "theme-color": "#1B5E43",
  },
  openGraph: {
    title: "FoodLog — A Personal Food Journal",
    description: "A beautifully curated personal restaurant and food diary.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B5E43",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-warm font-body antialiased">
        {/* Subtle warm gradient overlay */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: "radial-gradient(ellipse 120% 50% at 50% -10%, rgba(212,175,135,0.07) 0%, transparent 55%)",
        }} />
        {/* Forest-tinted top gradient */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: "radial-gradient(ellipse 80% 40% at 50% -20%, rgba(27,94,67,0.04) 0%, transparent 60%)",
        }} />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
