import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/animations/PageTransition";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const supabase = createClient();
  const { data: visits } = await supabase.from("restaurant_visits").select("*");
  const all = visits || [];

  const totalRestaurants = all.length;
  const averageRating = all.length ? Math.round((all.reduce((a: number, v: any) => a + v.overall_rating, 0) / all.length) * 10) / 10 : 0;

  const cuisineCounts: Record<string, number> = {};
  all.forEach((v: any) => { cuisineCounts[v.cuisine] = (cuisineCounts[v.cuisine] || 0) + 1; });
  const favoriteCuisines = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([cuisine, count]) => ({ cuisine, count }));

  const topRatedRestaurants = [...all].sort((a: any, b: any) => b.overall_rating - a.overall_rating).slice(0, 5).map((v: any) => ({ name: v.restaurant_name, rating: v.overall_rating, cuisine: v.cuisine }));

  const priceCounts: Record<string, number> = {};
  all.forEach((v: any) => { priceCounts[v.price_range] = (priceCounts[v.price_range] || 0) + 1; });
  const priceDistribution = Object.entries(priceCounts).map(([range, count]) => ({ range, count }));

  const occasionCounts: Record<string, number> = {};
  all.forEach((v: any) => { occasionCounts[v.occasion] = (occasionCounts[v.occasion] || 0) + 1; });
  const occasionBreakdown = Object.entries(occasionCounts).map(([occasion, count]) => ({ occasion, count }));

  const monthCounts: Record<string, number> = {};
  all.forEach((v: any) => { const month = v.date_visited.substring(0, 7); monthCounts[month] = (monthCounts[month] || 0) + 1; });
  const monthlyVisits = Object.entries(monthCounts).sort((a, b) => a[0].localeCompare(b[0])).slice(-12).map(([month, count]) => ({ month, count }));

  const data = { totalRestaurants, averageRating, favoriteCuisines, topRatedRestaurants, priceDistribution, occasionBreakdown, monthlyVisits };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="mb-12">
            <p className="text-xs font-bold text-forest-500 uppercase tracking-widest mb-3">Data Insights</p>
            <h1 className="font-display text-5xl md:text-6xl font-light text-forest-950 mb-4">
              Food <span className="text-gradient italic">Analytics</span>
            </h1>
            <p className="text-forest-500 text-lg font-light">A deep dive into the patterns and preferences of this culinary journey.</p>
          </div>
        </FadeIn>
        <AnalyticsDashboard data={data} />
      </div>
    </div>
  );
}
