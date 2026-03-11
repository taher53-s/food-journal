"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteVisitButton({ visitId }: { visitId: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("Delete this visit? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("restaurant_visits").delete().eq("id", visitId);
    router.push("/restaurants");
    router.refresh();
  };
  return (
    <button onClick={handleDelete}
      className="flex items-center gap-2 bg-red-500/20 backdrop-blur-md border border-red-300/30 text-white px-4 py-2.5 rounded-2xl text-sm font-medium hover:bg-red-500/40 transition-all"
    >
      <Trash2 className="w-4 h-4" /> Delete
    </button>
  );
}
