"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/", label: "Journal" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/hall-of-fame", label: "Hall of Fame" },
  { href: "/gallery", label: "Gallery" },
  { href: "/analytics", label: "Analytics" },
  { href: "/top-restaurants", label: "Top Picks" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);

      if (currentY > 80) {
        if (currentY > lastScrollY) {
          setHidden(true);
        } else {
          setHidden(false);
        }
      } else {
        setHidden(false);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(!!user);
    };
    checkAdmin();
  }, []);

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 z-[60] origin-left shadow-[0_0_12px_rgba(245,158,11,0.4)]" style={{ scaleX }} />
      <motion.div
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/80 backdrop-blur-2xl border-b border-white/20 shadow-[0_4px_30px_rgba(15,58,41,0.08)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[68px]">
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-9 h-9 bg-gradient-to-br from-forest-600 to-forest-700 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(27,94,67,0.3)] group-hover:shadow-[0_6px_20px_rgba(27,94,67,0.4)] transition-shadow duration-300"
              >
                <ChefHat className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <span className="font-display text-xl font-semibold text-forest-900 tracking-tight relative overflow-hidden group-hover:text-forest-700 transition-colors duration-300 inline-block">
                  FoodLog
                  <span className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </span>
                <span className="hidden sm:block text-[10px] text-forest-400 font-medium -mt-0.5 tracking-[0.15em] uppercase">Personal Journal</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 overflow-hidden group",
                      isActive ? "text-forest-800" : "text-forest-500 hover:text-forest-800"
                    )}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-forest-100 rounded-xl -z-0"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    {!isActive && (
                      <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              {isAdmin
                ? <Link href="/admin" className="btn-primary text-xs px-4 py-2.5 min-h-[44px]">Dashboard</Link>
                : <Link href="/login" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors duration-200 min-h-[44px]">
                    <span>Admin</span>
                  </Link>
              }
              <button onClick={() => setMobileOpen(true)} className="md:hidden p-2.5 rounded-xl text-forest-700 hover:bg-forest-100 transition-colors duration-200 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-2xl z-50 md:hidden shadow-[-8px_0_40px_rgba(0,0,0,0.12)]"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-forest-600 to-forest-700 rounded-lg flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display text-lg font-semibold text-forest-900">Menu</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="p-2.5 rounded-xl text-forest-600 hover:bg-forest-100 transition-colors active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  {navLinks.map((link, i) => (
                    <motion.div key={link.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}>
                      <Link href={link.href} onClick={() => setMobileOpen(false)}
                        className={cn("flex items-center gap-3 block px-4 py-3.5 rounded-xl text-base font-medium transition-all active:scale-[0.98]",
                          pathname === link.href ? "bg-forest-100 text-forest-800 font-semibold" : "text-forest-600 hover:bg-forest-50"
                        )}
                      >
                        {pathname === link.href && (
                          <motion.div layoutId="mobile-nav-dot" className="w-1.5 h-1.5 rounded-full bg-forest-600" transition={{ type: "spring", bounce: 0.3 }} />
                        )}
                        {pathname !== link.href && <span className="w-1.5 h-1.5 rounded-full bg-forest-200" />}
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-forest-100">
                  {isAdmin
                    ? <Link href="/admin" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center min-h-[48px]">Dashboard</Link>
                    : <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full justify-center min-h-[48px]">Admin Login</Link>
                  }
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
