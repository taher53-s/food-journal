"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import heic2any from "heic2any";
import { FlavorTagSelector } from "@/components/ui/FlavorTag";
import { FlavorTag } from "@/types";
import { Plus, Trash2, Upload } from "lucide-react";

const OCCASIONS = ["date", "friends", "family", "solo", "business", "celebration"];
const PRICE_RANGES = ["budget", "moderate", "expensive", "luxury"];
const RECOMMENDATION_LEVELS = ["must_try", "worth_it", "decent", "skip"];
const CUISINES = ["Italian", "Japanese", "Indian", "Mexican", "French", "Chinese", "Thai", "Mediterranean", "American", "Korean", "Spanish", "New Nordic", "Middle Eastern", "Vietnamese", "Greek", "Other"];

interface DishEntry {
  /** If set, this is an existing dish to update; otherwise a new dish to insert */
  id?: string;
  dish_name: string; price: string; rating: number;
  notes: string; flavor_tags: FlavorTag[]; image: File | null;
}

function RatingSlider({ label, value, onChange, dark }: { label: string; value: number; onChange: (v: number) => void; dark?: boolean }) {
  const labelClass = dark ? "text-sm font-medium text-white/60" : "text-sm font-medium text-forest-700";
  const badgeClass = dark
    ? (value >= 9 ? "text-gold-400 bg-gold-500/20" : value >= 7 ? "text-white/70 bg-white/10" : "text-ember-400 bg-ember-500/20")
    : (value >= 9 ? "text-gold-600 bg-gold-50" : value >= 7 ? "text-forest-700 bg-forest-100" : "text-ember-600 bg-ember-50");
  const trackClass = dark ? "bg-white/20" : "bg-forest-100";
  const thumbClass = dark ? "accent-gold-500" : "accent-forest-600";
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className={labelClass}>{label}</label>
        <span className={`text-sm font-bold font-display px-2.5 py-0.5 rounded-lg ${badgeClass}`}>
          {value}/10
        </span>
      </div>
      <input type="range" min="0" max="10" step="0.5" value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-2 rounded-full appearance-none cursor-pointer ${thumbClass} ${trackClass}`}
      />
    </div>
  );
}

export function VisitForm({ initialData, visitId, dark = true }: { initialData?: any; visitId?: string; dark?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    restaurant_name: initialData?.restaurant_name || "",
    location: initialData?.location || "",
    cuisine: initialData?.cuisine || "",
    date_visited: initialData?.date_visited || new Date().toISOString().split("T")[0],
    occasion: initialData?.occasion || "friends",
    companions: initialData?.companions || "",
    price_range: initialData?.price_range || "moderate",
    ambience_rating: initialData?.ambience_rating || 7,
    service_rating: initialData?.service_rating || 7,
    food_rating: initialData?.food_rating || 7,
    value_rating: initialData?.value_rating || 7,
    overall_rating: initialData?.overall_rating || 7,
    experience_notes: initialData?.experience_notes || "",
    would_return: initialData?.would_return ?? true,
    recommendation_level: initialData?.recommendation_level || "worth_it",
  });
  const [dishes, setDishes] = useState<DishEntry[]>(
    initialData?.dishes?.map((d: any) => ({
      id: d.id,
      dish_name: d.dish_name,
      price: d.price?.toString() || "",
      rating: d.rating,
      notes: d.notes || "",
      flavor_tags: d.flavor_tags || [],
      image: null,
    })) || []
  );
  /** IDs of dishes that existed when the form loaded — used to detect removals */
  const originalDishIds = initialData?.dishes?.map((d: any) => d.id).filter(Boolean) || [];
  const setField = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const addDish = () => setDishes([...dishes, { dish_name: "", price: "", rating: 7, notes: "", flavor_tags: [], image: null }]);
  const updateDish = (i: number, key: keyof DishEntry, value: any) => {
    const updated = [...dishes];
    (updated[i] as any)[key] = value;
    setDishes(updated);
  };
  const removeDish = (i: number) => setDishes(dishes.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let visitResult;
      if (visitId) {
        const { data, error } = await supabase.from("restaurant_visits").update({ ...form }).eq("id", visitId).select().single();
        if (error) throw error;
        visitResult = data;
      } else {
        const { data, error } = await supabase.from("restaurant_visits").insert({ ...form, user_id: user.id }).select().single();
        if (error) throw error;
        visitResult = data;
      }

      // Detect removed dishes: existing IDs no longer in the form
      const currentIds = dishes.map(d => d.id).filter(Boolean) as string[];
      const removedIds = originalDishIds.filter((id: string) => !currentIds.includes(id));

      // Delete removed dishes
      if (removedIds.length > 0) {
        const { error: delErr } = await supabase.from("dishes").delete().in("id", removedIds);
        if (delErr) throw delErr;
      }

      for (const dish of dishes) {
        if (!dish.dish_name) continue;
        let image_url = null;
        if (dish.image) {
          let fileToUpload = dish.image;
          let filename = dish.image.name;
          let ext = filename.split(".").pop()?.toLowerCase() || '';

          if (ext === "heic" || ext === "heif") {
            setIsConverting(true);
            try {
              const convertedBlob = await heic2any({
                blob: dish.image,
                toType: "image/jpeg",
                quality: 0.8,
              });
              const blobArray = Array.isArray(convertedBlob) ? convertedBlob : [convertedBlob];
              const blob = blobArray[0];
              fileToUpload = new File([blob], filename.replace(/\.heic|\.heif/i, ".jpg"), {
                type: "image/jpeg"
              });
              ext = "jpg";
            } catch (convErr: any) {
              console.error("HEIC conversion failed:", convErr);
              throw new Error("Failed to convert HEIC/HEIF image. Please try another format.");
            } finally {
              setIsConverting(false);
            }
          }

          const path = `${visitResult.id}/${Date.now()}.${ext}`;

          const { data: up, error: upErr } = await supabase.storage.from("food-photos").upload(path, fileToUpload, {
            contentType: fileToUpload.type,
            upsert: false
          });

          if (!upErr && up) {
            const { data: { publicUrl } } = supabase.storage.from("food-photos").getPublicUrl(up.path);
            if (!publicUrl) {
              throw new Error("Failed to receive public URL for the uploaded image.");
            }
            image_url = publicUrl;
          } else if (upErr) {
            throw upErr;
          }
        }

        if (dish.id) {
          // Existing dish — update it
          const { error: updErr } = await supabase.from("dishes").update({
            dish_name: dish.dish_name,
            price: dish.price ? parseFloat(dish.price) : null,
            rating: dish.rating,
            notes: dish.notes || null,
            flavor_tags: dish.flavor_tags,
            image_url: image_url || undefined,
          }).eq("id", dish.id);
          if (updErr) throw updErr;
        } else {
          // New dish — insert it
          const { error: insErr } = await supabase.from("dishes").insert({
            visit_id: visitResult.id, dish_name: dish.dish_name,
            price: dish.price ? parseFloat(dish.price) : null,
            rating: dish.rating, notes: dish.notes || null,
            flavor_tags: dish.flavor_tags, image_url,
          });
          if (insErr) throw insErr;
        }
      }

      router.push(`/restaurants/${visitResult.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  const inputClass = dark
    ? "w-full rounded-2xl border border-white/[0.1] bg-white/[0.06] backdrop-blur-sm px-5 py-4 text-sm font-medium text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/30 transition-all"
    : "w-full rounded-2xl border border-forest-100 bg-white px-5 py-4 text-sm font-medium text-forest-800 placeholder:text-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-400/30 focus:border-forest-300 transition-all";
  const labelClass = dark ? "block text-sm font-semibold text-white/70 mb-2" : "block text-sm font-semibold text-forest-700 mb-2";
  const sectionClass = dark
    ? "bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6 space-y-5"
    : "bg-white rounded-3xl p-6 border border-forest-100/60 shadow-card space-y-5";
  const sectionTitleClass = dark ? "font-display text-xl font-semibold text-white/90" : "font-display text-xl font-semibold text-forest-900";
  const dishCardClass = dark ? "bg-white/[0.06] rounded-2xl p-5 space-y-4" : "bg-forest-50 rounded-2xl p-5 space-y-4";
  const dishTextClass = dark ? "text-white/80" : "text-forest-800";
  const emptyStateClass = dark ? "text-white/30" : "text-forest-400";
  const errorClass = dark ? "text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3" : "text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3";
  const uploadLabelClass = dark
    ? "flex items-center gap-3 cursor-pointer bg-white/[0.06] border-2 border-dashed border-white/[0.15] rounded-xl px-4 py-3 hover:border-gold-500/40 transition-colors"
    : "flex items-center gap-3 cursor-pointer bg-white border-2 border-dashed border-forest-200 rounded-xl px-4 py-3 hover:border-forest-400 transition-colors";
  const uploadTextClass = dark ? "text-sm text-white/50" : "text-sm text-forest-600";
  const borderTopClass = dark ? "border-t border-white/[0.06]" : "border-t border-forest-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Restaurant Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Restaurant Name *</label>
            <input type="text" required value={form.restaurant_name} onChange={(e) => setField("restaurant_name", e.target.value)} placeholder="e.g. Dishoom" className={inputClass} /></div>
          <div><label className={labelClass}>Location *</label>
            <input type="text" required value={form.location} onChange={(e) => setField("location", e.target.value)} placeholder="e.g. London, UK" className={inputClass} /></div>
          <div><label className={labelClass}>Cuisine *</label>
            <input type="text" list="cuisines" required value={form.cuisine} onChange={(e) => setField("cuisine", e.target.value)} placeholder="e.g. Indian" className={inputClass} />
            <datalist id="cuisines">{CUISINES.map((c) => <option key={c} value={c} />)}</datalist></div>
          <div><label className={labelClass}>Date Visited *</label>
            <input type="date" required value={form.date_visited} onChange={(e) => setField("date_visited", e.target.value)} className={inputClass} /></div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Visit Context</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Occasion</label>
            <select value={form.occasion} onChange={(e) => setField("occasion", e.target.value)} className={inputClass}>
              {OCCASIONS.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}</select></div>
          <div><label className={labelClass}>Price Range</label>
            <select value={form.price_range} onChange={(e) => setField("price_range", e.target.value)} className={inputClass}>
              {PRICE_RANGES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}</select></div>
          <div><label className={labelClass}>Recommendation</label>
            <select value={form.recommendation_level} onChange={(e) => setField("recommendation_level", e.target.value)} className={inputClass}>
              {RECOMMENDATION_LEVELS.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}</select></div>
          <div><label className={labelClass}>Companions</label>
            <input type="text" value={form.companions} onChange={(e) => setField("companions", e.target.value)} placeholder="Who did you go with?" className={inputClass} /></div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="would_return" checked={form.would_return} onChange={(e) => setField("would_return", e.target.checked)} className="w-5 h-5 rounded-lg accent-gold-500" />
          <label htmlFor="would_return" className="text-sm font-medium text-white/70">Would return</label>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Ratings</h2>
        <div className="space-y-4">
          <RatingSlider label="Food Quality" value={form.food_rating} onChange={(v) => setField("food_rating", v)} dark={dark} />
          <RatingSlider label="Service" value={form.service_rating} onChange={(v) => setField("service_rating", v)} dark={dark} />
          <RatingSlider label="Ambience" value={form.ambience_rating} onChange={(v) => setField("ambience_rating", v)} dark={dark} />
          <RatingSlider label="Value for Money" value={form.value_rating} onChange={(v) => setField("value_rating", v)} dark={dark} />
          <div className={`pt-2 ${borderTopClass}`}>
            <RatingSlider label="Overall Rating" value={form.overall_rating} onChange={(v) => setField("overall_rating", v)} dark={dark} />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Experience Notes</h2>
        <textarea value={form.experience_notes} onChange={(e) => setField("experience_notes", e.target.value)}
          placeholder="Describe your experience... What made it special?" rows={4} className={`${inputClass} resize-none`} />
      </div>

      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className={sectionTitleClass}>Dishes</h2>
          <button type="button" onClick={addDish} className={dark ? "btn-gold text-xs px-4 py-2.5 gap-1.5" : "btn-secondary text-xs px-4 py-2.5 gap-1.5"}>
            <Plus className="w-3.5 h-3.5" /> Add Dish
          </button>
        </div>
        {dishes.map((dish, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className={dishCardClass}>
            <div className="flex items-center justify-between">
              <h4 className={`font-semibold ${dishTextClass} text-sm`}>Dish #{i + 1}</h4>
              <button type="button" onClick={() => removeDish(i)} className={dark ? "p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors" : "p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Dish name" value={dish.dish_name} onChange={(e) => updateDish(i, "dish_name", e.target.value)} className={inputClass} />
              <input type="number" placeholder="Price" value={dish.price} onChange={(e) => updateDish(i, "price", e.target.value)} className={inputClass} />
            </div>
            <RatingSlider label="Rating" value={dish.rating} onChange={(v) => updateDish(i, "rating", v)} dark={dark} />
            <textarea placeholder="Notes on taste, texture..." value={dish.notes} onChange={(e) => updateDish(i, "notes", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
            <div>
              <label className={labelClass}>Flavor Tags</label>
              <FlavorTagSelector selected={dish.flavor_tags} onChange={(tags) => updateDish(i, "flavor_tags", tags)} dark={dark} />
            </div>
            <div>
              <label className={labelClass}>Photo</label>
              <label className={uploadLabelClass}>
                <Upload className={dark ? "w-4 h-4 text-white/40" : "w-4 h-4 text-forest-500"} />
                <span className={uploadTextClass}>{dish.image ? dish.image.name : "Upload dish photo"}</span>
                <input type="file" accept="image/*,.heic,.heif" className="hidden" onChange={(e) => updateDish(i, "image", e.target.files?.[0] || null)} />
              </label>
            </div>
          </motion.div>
        ))}
        {dishes.length === 0 && (
          <div className={`text-center py-8 ${emptyStateClass} text-sm`}>
            <div className="text-3xl mb-2">🍽️</div>
            <p>Click &ldquo;Add Dish&rdquo; to log what you ate</p>
          </div>
        )}
      </div>

      {error && <p className={errorClass}>{error}</p>}

      <button type="submit" disabled={loading || isConverting} className="btn-gold w-full py-4 text-base disabled:opacity-60">
        {loading || isConverting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-forest-950/40 border-t-forest-950 rounded-full animate-spin" />
            {isConverting ? "Converting image..." : "Saving..."}
          </span>
        ) : visitId ? "Update Visit" : "Save Visit"}
      </button>
    </form>
  );
}
