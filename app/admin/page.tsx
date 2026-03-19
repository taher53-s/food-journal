import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, BarChart2, Trophy, Camera } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, SectionHeading, AnimatedDivider } from "@/components/animations/PageTransition";
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
    <div className="min-h-screen bg-[#0A1A12]">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(27,94,67,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-24">
        <FadeIn>
          <div className="flex items-start justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">★ Welcome back</p>
              <h1 className="font-display text-4xl md:text-5xl font-light text-white">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/add-visit" className="btn-gold"><Plus className="w-4 h-4" /> Add Visit</Link>
              <AdminLogout />
            </div>
          </div>
        </FadeIn>

        <AnimatedDivider className="mb-10" />

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: "🍽️", label: "Total Visits", value: all.length },
            { icon: "⭐", label: "Avg Rating", value: avgRating },
            { icon: "🌍", label: "Cuisines", value: Array.from(new Set(all.map((v: any) => v.cuisine))).length },
            { icon: "🥇", label: "Must-Tries", value: all.filter((v: any) => v.recommendation_level === "must_try").length },
          ].map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-5 text-center group hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                <div className="font-display text-3xl font-semibold text-white/90">{stat.value}</div>
                <div className="text-xs font-medium text-white/40 uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Quick actions */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
            {[
              { href: "/admin/add-visit", icon: Plus, label: "Add Visit", color: "from-gold-500/20 to-gold-600/10 border-gold-500/20 text-gold-400 hover:border-gold-500/40 hover:from-gold-500/30" },
              { href: "/analytics", icon: BarChart2, label: "Analytics", color: "from-gold-500/20 to-gold-600/10 border-gold-500/20 text-gold-400 hover:border-gold-500/40 hover:from-gold-500/30" },
              { href: "/hall-of-fame", icon: Trophy, label: "Hall of Fame", color: "from-gold-500/20 to-gold-600/10 border-gold-500/20 text-gold-400 hover:border-gold-500/40 hover:from-gold-500/30" },
              { href: "/gallery", icon: Camera, label: "Gallery", color: "from-gold-500/20 to-gold-600/10 border-gold-500/20 text-gold-400 hover:border-gold-500/40 hover:from-gold-500/30" },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link key={href} href={href} className={`flex flex-col items-center gap-2 p-4 rounded-2xl font-medium text-sm bg-gradient-to-br border transition-all hover:-translate-y-0.5 hover:shadow-lg ${color}`}>
                <Icon className="w-5 h-5" />{label}
              </Link>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-white/80">Recent Visits</h2>
            <Link href="/restaurants" className="text-sm font-medium text-white/40 hover:text-white/70 transition-colors">View all →</Link>
          </div>
        </FadeIn>

        {all.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {all.slice(0, 6).map((visit: any, i: number) => <RestaurantCard key={visit.id} visit={visit} index={i} dark />)}
          </div>
        ) : (
          <FadeIn>
            <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] rounded-4xl p-16 max-w-md mx-auto text-center">
              <div className="relative z-10">
                <div className="text-5xl mb-4">🍽️</div>
                <h3 className="font-display text-2xl text-white/80 mb-2">No visits yet</h3>
                <p className="text-white/30 mb-6">Add your first restaurant visit to get started</p>
                <Link href="/admin/add-visit" className="btn-gold inline-flex"><Plus className="w-4 h-4" /> Add Your First Visit</Link>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
