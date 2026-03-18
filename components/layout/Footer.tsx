"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChefHat, Heart, ArrowUp, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="relative bg-[#0A1A12] overflow-hidden mt-24">
        {/* Ambient gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, rgba(27,94,67,1) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,1) 0%, transparent 70%)", filter: "blur(50px)" }} />
        </div>

        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(27,94,67,0.5) 30%, rgba(245,158,11,0.3) 70%, transparent 100%)" }} />

        {/* Main content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          {/* Brand column */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            <div className="md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-forest-600 to-forest-700 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(27,94,67,0.3)]">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="font-display text-xl font-semibold text-white group-hover:text-gold-400 transition-colors duration-300">FoodLog</span>
              </Link>
              <p className="text-forest-400 text-sm leading-relaxed mb-6">
                A beautifully curated personal restaurant and food journal. Exploring the world, one plate at a time.
              </p>
              <div className="flex items-center gap-2 text-forest-500 text-xs">
                <span>Made with</span>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Heart className="w-3.5 h-3.5 text-ember-400 fill-ember-400" />
                </motion.div>
                <span>for the love of food</span>
              </div>
            </div>

            {/* Explore column */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500/70 mb-5">Explore</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { href: "/", label: "Journal" },
                  { href: "/restaurants", label: "Restaurants" },
                  { href: "/hall-of-fame", label: "Hall of Fame" },
                  { href: "/gallery", label: "Gallery" },
                ].map((l) => (
                  <Link key={l.href} href={l.href}
                    className="group flex items-center gap-2 text-sm text-forest-400 hover:text-white transition-all duration-200 py-0.5">
                    <span className="w-1 h-1 rounded-full bg-forest-600 group-hover:bg-gold-500 transition-colors duration-200" />
                    <span>{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Discover column */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500/70 mb-5">Discover</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { href: "/analytics", label: "Analytics" },
                  { href: "/top-restaurants", label: "Top Restaurants" },
                  { href: "/hall-of-fame", label: "Best Dishes" },
                ].map((l) => (
                  <Link key={l.href} href={l.href}
                    className="group flex items-center gap-2 text-sm text-forest-400 hover:text-white transition-all duration-200 py-0.5">
                    <span className="w-1 h-1 rounded-full bg-forest-600 group-hover:bg-gold-500 transition-colors duration-200" />
                    <span>{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Admin column */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500/70 mb-5">Manage</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { href: "/login", label: "Admin Login" },
                  { href: "/admin", label: "Dashboard" },
                  { href: "/admin/add-visit", label: "Add Visit" },
                ].map((l) => (
                  <Link key={l.href} href={l.href}
                    className="group flex items-center gap-2 text-sm text-forest-400 hover:text-white transition-all duration-200 py-0.5">
                    <span className="w-1 h-1 rounded-full bg-forest-600 group-hover:bg-gold-500 transition-colors duration-200" />
                    <span>{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-12 pt-8 border-t border-white/[0.05]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-forest-600 text-xs">© {new Date().getFullYear()} FoodLog. All memories reserved.</p>
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest text-forest-600">Powered by</span>
                <div className="flex items-center gap-1.5 text-forest-500 text-xs">
                  <ExternalLink className="w-3 h-3" />
                  <span>Supabase</span>
                </div>
                <div className="w-px h-3 bg-forest-700" />
                <div className="flex items-center gap-1.5 text-forest-500 text-xs">
                  <ExternalLink className="w-3 h-3" />
                  <span>Next.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: showTop ? 1 : 0, scale: showTop ? 1 : 0.8, y: showTop ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white/90 backdrop-blur-xl border border-forest-100/60 shadow-[0_4px_20px_rgba(15,58,41,0.15)] flex items-center justify-center text-forest-600 hover:text-forest-800 hover:bg-white hover:shadow-[0_6px_24px_rgba(15,58,41,0.2)] active:scale-95 transition-all duration-200"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </>
  );
}
