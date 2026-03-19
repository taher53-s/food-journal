import { createClient } from "@/lib/supabase/server";
import { FadeIn, AnimatedDivider, SectionHeading } from "@/components/animations/PageTransition";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const supabase = createClient();
  const { data: visits } = await supabase.from("restaurant_visits").select("*");
  const all = visits || [];

  const totalRestaurants = all.length;
  const averageRating = all.length
    ? Math.round((all.reduce((a: number, v: any) => a + v.overall_rating, 0) / all.length) * 10) / 10
    : 0;

  const cuisineCounts: Record<string, number> = {};
  all.forEach((v: any) => { cuisineCounts[v.cuisine] = (cuisineCounts[v.cuisine] || 0) + 1; });
  const favoriteCuisines = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([cuisine, count]) => ({ cuisine, count }));

  const topRatedRestaurants = [...all].sort((a: any, b: any) => b.overall_rating - a.overall_rating).slice(0, 5).map((v: any) => ({
    name: v.restaurant_name, rating: v.overall_rating, cuisine: v.cuisine,
  }));

  const priceCounts: Record<string, number> = {};
  all.forEach((v: any) => { priceCounts[v.price_range] = (priceCounts[v.price_range] || 0) + 1; });
  const priceDistribution = Object.entries(priceCounts).map(([range, count]) => ({ range, count }));

  const occasionCounts: Record<string, number> = {};
  all.forEach((v: any) => { occasionCounts[v.occasion] = (occasionCounts[v.occasion] || 0) + 1; });
  const occasionBreakdown = Object.entries(occasionCounts).map(([occasion, count]) => ({ occasion, count }));

  const monthCounts: Record<string, number> = {};
  all.forEach((v: any) => { const month = v.date_visited.substring(0, 7); monthCounts[month] = (monthCounts[month] || 0) + 1; });
  const monthlyVisits = Object.entries(monthCounts).sort((a, b) => a[0].localeCompare(b[0])).slice(-12).map(([month, count]) => ({ month, count }));

  let streak = 0;
  if (monthlyVisits.length > 0) {
    const dates = monthlyVisits.map(m => new Date(m.month + "-01"));
    streak = 1;
    for (let i = dates.length - 1; i > 0; i--) {
      const diffMonths = (dates[i].getFullYear() - dates[i - 1].getFullYear()) * 12 + dates[i].getMonth() - dates[i - 1].getMonth();
      if (diffMonths === 1) streak++;
      else break;
    }
  }

  const data = { totalRestaurants, averageRating, favoriteCuisines, topRatedRestaurants, priceDistribution, occasionBreakdown, monthlyVisits, streak };

  return (
    <div className="min-h-screen bg-[#0A1A12]">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(27,94,67,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-24">
        <FadeIn>
          <SectionHeading
            eyebrow="★ Data Insights"
            title="Food Analytics"
            subtitle="A deep dive into the patterns and preferences of this culinary journey."
            dark
          />
        </FadeIn>
        <AnimatedDivider className="mb-12" dark />
        <AnalyticsDashboard data={data} />
      </div>
    </div>
  );
}
