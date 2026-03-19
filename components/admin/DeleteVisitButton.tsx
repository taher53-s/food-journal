"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteVisitButton({ visitId }: { visitId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    if (!confirm("Delete this visit? This will also delete all dishes and photos. This cannot be undone.")) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("restaurant_visits").delete().eq("id", visitId);
      if (error) throw error;
      router.refresh();
      router.push("/restaurants");
    } catch (err) {
      alert("Failed to delete visit. Please try again.");
      setLoading(false);
    }
  };
  return (
    <button onClick={handleDelete} disabled={loading}
      className="flex items-center gap-2 bg-red-500/20 backdrop-blur-md border border-red-300/30 text-white px-4 py-2.5 rounded-2xl text-sm font-medium hover:bg-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
    </button>
  );
}
