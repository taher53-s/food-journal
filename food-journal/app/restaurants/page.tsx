"use client";
import { useEffect, useState, useCallback } from "react";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { FadeIn } from "@/components/animations/PageTransition";
import { createClient } from "@/lib/supabase/client";
import { RestaurantVisit } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const CUISINES = ["All","Italian","Japanese","Indian","Mexican","French","Chinese","Thai","Mediterranean","American","Korean"];
const PRICE_RANGES = [{ value:"all",label:"Any Price" },{ value:"budget",label:"$ Budget" },{ value:"moderate",label:"$$ Moderate" },{ value:"expensive",label:"$$$ Expensive" },{ value:"luxury",label:"$$$$ Luxury" }];

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
    console.log("Fetching restaurants...");
    supabase.from("restaurant_visits").select("*, dishes(*), photos(*)").order("date_visited", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase error:", error);
        } else {
          console.log("Got data:", data?.length, "visits");
        }
        setVisits((data as RestaurantVisit[]) || []);
        setFiltered((data as RestaurantVisit[]) || []);
        setLoading(false);
      });
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
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="mb-10">
            <p className="text-xs font-bold text-forest-500 uppercase tracking-widest mb-2">The Collection</p>
            <h1 className="font-display text-5xl md:text-6xl font-light text-forest-950 mb-4">All Restaurants</h1>
            <p className="text-forest-500 text-lg font-light">{visits.length} places explored and counting</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="sticky top-20 z-30 bg-cream-100/90 backdrop-blur-xl py-4 -mx-4 px-4 mb-8 border-b border-forest-100/50">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                <input type="text" placeholder="Search restaurants, cuisines, locations..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-forest-100 text-sm font-medium text-forest-800 placeholder:text-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-400/30 focus:border-forest-300 transition-all" />
                {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-forest-400 hover:text-forest-600"><X className="w-3.5 h-3.5" /></button>}
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={cn("flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all",
                  showFilters ? "bg-forest-600 text-white border-forest-600" : "bg-white text-forest-700 border-forest-200 hover:border-forest-400")}>
                <SlidersHorizontal className="w-4 h-4" /><span className="hidden sm:block">Filters</span>
              </button>
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-forest-600 uppercase tracking-wider mb-2 block">Cuisine</label>
                      <div className="flex flex-wrap gap-1.5">
                        {CUISINES.map((c) => (
                          <button key={c} onClick={() => setCuisine(c)}
                            className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all", cuisine === c ? "bg-forest-600 text-white" : "bg-white border border-forest-200 text-forest-600 hover:border-forest-400")}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-forest-600 uppercase tracking-wider mb-2 block">Price Range</label>
                      <div className="flex flex-wrap gap-1.5">
                        {PRICE_RANGES.map((p) => (
                          <button key={p.value} onClick={() => setPriceRange(p.value)}
                            className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all", priceRange === p.value ? "bg-gold-500 text-forest-950" : "bg-white border border-forest-200 text-forest-600 hover:border-gold-400")}>
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-forest-600 uppercase tracking-wider mb-2 block">Min Rating: {minRating > 0 ? minRating : "Any"}</label>
                      <input type="range" min="0" max="10" step="0.5" value={minRating} onChange={(e) => setMinRating(parseFloat(e.target.value))} className="w-full accent-forest-600" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>

        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-forest-500">Showing <span className="font-semibold text-forest-800">{filtered.length}</span> {filtered.length === 1 ? "restaurant" : "restaurants"}</p>
            {(search || cuisine !== "All" || priceRange !== "all" || minRating > 0) && (
              <button onClick={() => { setSearch(""); setCuisine("All"); setPriceRange("all"); setMinRating(0); }} className="text-xs font-semibold text-ember-500 hover:text-ember-700 transition-colors">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-3xl h-80 animate-pulse" />)}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((visit, i) => (
                <motion.div key={visit.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
                  <RestaurantCard visit={visit} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-2xl text-forest-800 mb-2">No results found</h3>
            <p className="text-forest-500 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
