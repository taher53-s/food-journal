"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminLogout({ dark = true }: { dark?: boolean }) {
  const router = useRouter();
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };
  return (
    <button onClick={handleLogout} className={
      dark
        ? "inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-white/60 hover:border-white/40 hover:text-white hover:bg-white/[0.06] active:scale-[0.97] transition-all duration-200 cursor-pointer"
        : "inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-forest-200 bg-transparent px-5 py-3 text-sm font-semibold text-forest-700 hover:bg-forest-50 hover:border-forest-400 active:scale-[0.97] transition-all duration-200 cursor-pointer"
    }>
      <LogOut className="w-4 h-4" /> Logout
    </button>
  );
}
