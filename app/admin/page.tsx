import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, BarChart2, Trophy, Camera } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { AdminLogout } from "@/components/admin/AdminLogout";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: visits } = await supabase
    .from("restaurant_visits")
    .select("*, dishes(*), photos(*)")
    .order("date_visited", { ascending: false });

  const all = visits || [];
  const avgRating = all.length ? (all.reduce((a: number, v: any) => a + v.overall_rating, 0) / all.length).toFixed(1) : "0";

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold text-forest-500 uppercase tracking-widest mb-2">Welcome back</p>
              <h1 className="font-display text-4xl md:text-5xl font-light text-forest-950">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/add-visit" className="btn-primary"><Plus className="w-4 h-4" /> Add Visit</Link>
              <AdminLogout />
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: "🍽️", label: "Total Visits", value: all.length },
            { icon: "⭐", label: "Avg Rating", value: avgRating },
            { icon: "🌍", label: "Cuisines", value: [...new Set(all.map((v: any) => v.cuisine))].length },
            { icon: "🥇", label: "Must-Tries", value: all.filter((v: any) => v.recommendation_level === "must_try").length },
          ].map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="bg-white rounded-3xl p-5 border border-forest-100/60 shadow-card text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="font-display text-3xl font-semibold text-forest-900">{stat.value}</div>
                <div className="text-xs font-medium text-forest-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.2}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { href: "/admin/add-visit", icon: Plus, label: "Add Visit", color: "bg-forest-600 text-white" },
              { href: "/analytics", icon: BarChart2, label: "Analytics", color: "bg-gold-100 text-gold-700" },
              { href: "/hall-of-fame", icon: Trophy, label: "Hall of Fame", color: "bg-ember-100 text-ember-600" },
              { href: "/gallery", icon: Camera, label: "Gallery", color: "bg-forest-100 text-forest-700" },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link key={href} href={href} className={`flex flex-col items-center gap-2 p-4 rounded-2xl font-medium text-sm hover:opacity-80 transition-opacity ${color}`}>
                <Icon className="w-5 h-5" />{label}
              </Link>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-forest-900">Recent Visits</h2>
            <Link href="/restaurants" className="text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors">View all →</Link>
          </div>
        </FadeIn>

        {all.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {all.slice(0, 6).map((visit: any, i: number) => <RestaurantCard key={visit.id} visit={visit} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-forest-100/60 shadow-card">
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="font-display text-2xl text-forest-800 mb-2">No visits yet</h3>
            <p className="text-forest-500 mb-6">Add your first restaurant visit to get started</p>
            <Link href="/admin/add-visit" className="btn-primary inline-flex"><Plus className="w-4 h-4" /> Add Your First Visit</Link>
          </div>
        )}
      </div>
    </div>
  );
}
