"use client";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { getCuisineEmoji, occasionLabel } from "@/lib/utils";

const COLORS = ["#1B5E43","#2D7D58","#5EA882","#9DCAB0","#D4A017","#F59E0B","#C4633F","#E07B3B"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-forest-100 rounded-2xl shadow-card-hover p-3 text-sm">
        <p className="font-semibold text-forest-800">{label}</p>
        <p className="text-forest-600">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-forest-100/60 shadow-card text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-display text-4xl font-semibold text-forest-900 mb-1">{value}</div>
      <div className="text-xs font-semibold text-forest-500 uppercase tracking-wider">{label}</div>
      {sub && <div className="text-xs text-forest-400 mt-1">{sub}</div>}
    </div>
  );
}

export function AnalyticsDashboard({ data }: { data: any }) {
  const cuisinesWithEmoji = (data.favoriteCuisines || []).map((c: any) => ({
    ...c, name: `${getCuisineEmoji(c.cuisine)} ${c.cuisine}`,
  }));

  const occasionData = (data.occasionBreakdown || []).map((o: any) => ({
    ...o, name: occasionLabel[o.occasion as keyof typeof occasionLabel] || o.occasion,
  }));

  return (
    <div className="space-y-8">
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StaggerItem><StatCard icon="🍽️" label="Restaurants" value={data.totalRestaurants} /></StaggerItem>
        <StaggerItem><StatCard icon="⭐" label="Avg Rating" value={data.averageRating || "—"} sub="out of 10" /></StaggerItem>
        <StaggerItem><StatCard icon="🌍" label="Cuisines" value={(data.favoriteCuisines || []).length} sub="explored" /></StaggerItem>
        <StaggerItem>
          <StatCard icon="🥇" label="Top Cuisine"
            value={(data.favoriteCuisines || [])[0]?.cuisine || "—"}
            sub={(data.favoriteCuisines || [])[0] ? `${(data.favoriteCuisines || [])[0].count} visits` : ""} />
        </StaggerItem>
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn delay={0.1}>
          <div className="bg-white rounded-3xl p-6 border border-forest-100/60 shadow-card">
            <h3 className="font-display text-xl font-semibold text-forest-900 mb-6">Favourite Cuisines</h3>
            {cuisinesWithEmoji.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={cuisinesWithEmoji} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#5EA882" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#2D7D58" }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0,8,8,0]}>
                    {cuisinesWithEmoji.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-forest-400 text-sm">No data yet</div>}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="bg-white rounded-3xl p-6 border border-forest-100/60 shadow-card">
            <h3 className="font-display text-xl font-semibold text-forest-900 mb-6">Price Distribution</h3>
            {(data.priceDistribution || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data.priceDistribution} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={90}
                    label={({ range, percent }: any) => `${range} ${(percent * 100).toFixed(0)}%`}>
                    {(data.priceDistribution || []).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-forest-400 text-sm">No data yet</div>}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="bg-white rounded-3xl p-6 border border-forest-100/60 shadow-card">
            <h3 className="font-display text-xl font-semibold text-forest-900 mb-6">Monthly Visits</h3>
            {(data.monthlyVisits || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.monthlyVisits}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE1C8" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#5EA882" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#5EA882" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="count" stroke="#1B5E43" strokeWidth={2.5} dot={{ fill: "#1B5E43", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-forest-400 text-sm">No data yet</div>}
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="bg-white rounded-3xl p-6 border border-forest-100/60 shadow-card">
            <h3 className="font-display text-xl font-semibold text-forest-900 mb-6">Dining Occasions</h3>
            {occasionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={occasionData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#5EA882" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#5EA882" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[8,8,0,0]}>
                    {occasionData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-forest-400 text-sm">No data yet</div>}
          </div>
        </FadeIn>
      </div>

      {(data.topRatedRestaurants || []).length > 0 && (
        <FadeIn delay={0.3}>
          <div className="bg-white rounded-3xl p-6 border border-forest-100/60 shadow-card">
            <h3 className="font-display text-xl font-semibold text-forest-900 mb-6">Top Rated Restaurants</h3>
            <div className="space-y-3">
              {(data.topRatedRestaurants || []).map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-forest-50 transition-colors">
                  <span className="text-xl w-8 text-center">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}</span>
                  <span className="text-2xl">{getCuisineEmoji(r.cuisine)}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-forest-900 text-sm">{r.name}</p>
                    <p className="text-xs text-forest-500">{r.cuisine}</p>
                  </div>
                  <span className="font-display text-xl font-semibold text-forest-700">{r.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
