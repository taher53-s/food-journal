"use client";
import { useEffect, useState, useCallback } from "react";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { FadeIn, StaggerContainer, StaggerItem, SectionHeading, AnimatedDivider } from "@/components/animations/PageTransition";
import { createClient } from "@/lib/supabase/client";
import { RestaurantVisit } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const CUISINES = ["All", "Italian", "Japanese", "Indian", "Mexican", "French", "Chinese", "Thai", "Mediterranean", "American", "Korean"];
const PRICE_RANGES = [{ value: "all", label: "Any Price" }, { value: "budget", label: "$ Budget" }, { value: "moderate", label: "$$ Moderate" }, { value: "expensive", label: "$$$ Expensive" }, { value: "luxury", label: "$$$$ Luxury" }];

export default function RestaurantsPage() {
  const [visits, setVisits] = useState<RestaurantVisit[]>([]);
  const [filtered, setFiltered] = useState<RestaurantVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("restaurant_visits").select("*, dishes(*), photos(*)").order("date_visited", { ascending: false })
      .then(({ data }) => { setVisits((data as RestaurantVisit[]) || []); setFiltered((data as RestaurantVisit[]) || []); setLoading(false); });
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...visits];
    if (search) { const s = search.toLowerCase(); result = result.filter((v) => v.restaurant_name.toLowerCase().includes(s) || v.location.toLowerCase().includes(s) || v.cuisine.toLowerCase().includes(s)); }
    if (cuisine !== "All") result = result.filter((v) => v.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
    if (priceRange !== "all") result = result.filter((v) => v.price_range === priceRange);
    if (minRating > 0) result = result.filter((v) => v.overall_rating >= minRating);
    setFiltered(result);
  }, [visits, search, cuisine, priceRange, minRating]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  return (
    <div className="min-h-screen bg-[#0A1A12]">
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(27,94,67,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-24">
        <FadeIn>
          <SectionHeading
            eyebrow="★ The Collection"
            title="All Restaurants"
            subtitle={`${visits.length} places explored and counting`}
            dark
          />
        </FadeIn>

        <AnimatedDivider className="mb-10" dark />

        {/* Sticky filter bar — dark glass */}
        <FadeIn delay={0.1}>
          <div className="sticky top-20 z-30 backdrop-blur-2xl py-4 -mx-4 px-4 mb-10 bg-[#0A1A12]/80 border-b border-white/[0.06]">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" placeholder="Search restaurants, cuisines, locations..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/[0.1] text-sm font-medium text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/30 transition-all min-h-[48px]" />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={cn("flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all min-h-[48px]",
                  showFilters ? "bg-gold-500 text-forest-950 border-gold-500 shadow-lg shadow-gold-500/20" : "bg-white/[0.06] backdrop-blur-md border-white/[0.1] text-white/70 hover:bg-white/[0.1] hover:text-white hover:border-white/[0.2]")}>
                <SlidersHorizontal className="w-4 h-4" /><span className="hidden sm:block">Filters</span>
              </button>
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2 block">Cuisine</label>
                      <div className="flex flex-wrap gap-1.5">
                        {CUISINES.map((c) => (
                          <button key={c} onClick={() => setCuisine(c)}
                            className={cn("px-3 py-2 rounded-full text-xs font-medium transition-all min-h-[40px]", cuisine === c ? "bg-gold-500 text-forest-950 shadow-sm" : "bg-white/[0.06] border border-white/[0.1] text-white/60 hover:border-gold-500/40 hover:text-gold-400 hover:bg-gold-500/10")}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2 block">Price Range</label>
                      <div className="flex flex-wrap gap-1.5">
                        {PRICE_RANGES.map((p) => (
                          <button key={p.value} onClick={() => setPriceRange(p.value)}
                            className={cn("px-3 py-2 rounded-full text-xs font-medium transition-all min-h-[40px]", priceRange === p.value ? "bg-gold-500 text-forest-950 shadow-sm" : "bg-white/[0.06] border border-white/[0.1] text-white/60 hover:border-gold-500/40 hover:text-gold-400 hover:bg-gold-500/10")}>
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2 block">Min Rating: {minRating > 0 ? minRating : "Any"}</label>
                      <input type="range" min="0" max="10" step="0.5" value={minRating} onChange={(e) => setMinRating(parseFloat(e.target.value))} className="w-full accent-gold-500 min-h-[40px] mt-1" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>

        {!loading && (
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-white/40">Showing <span className="font-semibold text-white/70">{filtered.length}</span> {filtered.length === 1 ? "restaurant" : "restaurants"}</p>
            {(search || cuisine !== "All" || priceRange !== "all" || minRating > 0) && (
              <button onClick={() => { setSearch(""); setCuisine("All"); setPriceRange("all"); setMinRating(0); }} className="text-xs font-semibold text-ember-400 hover:text-ember-300 transition-colors">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-3xl h-80 animate-pulse" />)}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((visit, i) => (
                <motion.div key={visit.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
                  <RestaurantCard visit={visit} index={i} dark />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <FadeIn>
            <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] rounded-4xl p-16 max-w-2xl mx-auto text-center">
              {/* Decorative orb */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)", filter: "blur(40px)", transform: "translate(30%, -30%)" }} />
              <div className="relative z-10">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl text-white/80 mb-2">No results found</h3>
                <p className="text-white/30">Try adjusting your filters or search terms.</p>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
