"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "bg-white/90 backdrop-blur-xl border-b border-forest-100/60 shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: [0,-10,10,0], scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-9 h-9 bg-forest-600 rounded-xl flex items-center justify-center shadow-md"
              >
                <ChefHat className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <span className="font-display text-xl font-semibold text-forest-900 tracking-tight">FoodLog</span>
                <span className="hidden sm:block text-[10px] text-forest-500 font-medium -mt-0.5 tracking-widest uppercase">Personal Journal</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                    pathname === link.href ? "text-forest-700 bg-forest-50" : "text-forest-600 hover:text-forest-800 hover:bg-forest-50/70"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-forest-100 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.4 }} />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {isAdmin
                ? <Link href="/admin" className="btn-primary text-xs px-4 py-2.5">Dashboard</Link>
                : <Link href="/login" className="hidden md:inline-flex text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors">Admin</Link>
              }
              <button onClick={() => setMobileOpen(true)} className="md:hidden p-2.5 rounded-xl text-forest-700 hover:bg-forest-100 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/40 z-50 md:hidden" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 h-full w-72 bg-white z-50 md:hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display text-xl font-semibold text-forest-900">Menu</span>
                  <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl text-forest-600 hover:bg-forest-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div key={link.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link href={link.href} onClick={() => setMobileOpen(false)}
                        className={cn("block px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                          pathname === link.href ? "bg-forest-100 text-forest-800" : "text-forest-600 hover:bg-forest-50"
                        )}
                      >{link.label}</Link>
                    </motion.div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-forest-100">
                    {isAdmin
                      ? <Link href="/admin" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center">Dashboard</Link>
                      : <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full justify-center">Admin Login</Link>
                    }
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
