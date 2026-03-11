"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminLogout() {
  const router = useRouter();
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };
  return (
    <button onClick={handleLogout} className="btn-secondary gap-2 text-sm">
      <LogOut className="w-4 h-4" /> Logout
    </button>
  );
}
