"use client";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { getCuisineEmoji, occasionLabel } from "@/lib/utils";

const COLORS = ["#1B5E43", "#2D7D58", "#5EA882", "#9DCAB0", "#D4A017", "#F59E0B", "#C4633F", "#E07B3B"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A1A12]/95 border border-white/10 rounded-2xl shadow-luxury p-3 text-sm backdrop-blur-md">
        <p className="font-semibold text-gold-400">{label}</p>
        <p className="text-white/80">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-5 text-center group">
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <div className="font-display text-3xl md:text-4xl font-semibold text-white mb-1">{value}</div>
      <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</div>
      {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
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
        <StaggerItem><StatCard icon="🔥" label="Visit Streak" value={data.streak || 0} sub="months" /></StaggerItem>
        <StaggerItem><StatCard icon="⭐" label="Avg Rating" value={data.averageRating || "—"} sub="out of 10" /></StaggerItem>
        <StaggerItem><StatCard icon="🌍" label="Cuisines" value={(data.favoriteCuisines || []).length} sub="explored" /></StaggerItem>
        <StaggerItem>
          <StatCard icon="🥇" label="Top Cuisine"
            value={(data.favoriteCuisines || [])[0]?.cuisine || "—"}
            sub={(data.favoriteCuisines || [])[0] ? `${(data.favoriteCuisines || [])[0].count} visits` : ""} />
        </StaggerItem>
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FadeIn delay={0.1}>
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6">
            <h3 className="font-display text-xl font-semibold text-white/90 mb-5">Favourite Cuisines</h3>
            {cuisinesWithEmoji.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={cuisinesWithEmoji} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {cuisinesWithEmoji.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-white/30 text-sm">No data yet</div>}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6">
            <h3 className="font-display text-xl font-semibold text-white/90 mb-5">Price Distribution</h3>
            {(data.priceDistribution || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={data.priceDistribution}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ range, percent, cx, cy, midAngle, innerRadius }: any) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (90 - innerRadius) * 0.5 + 20;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text x={x} y={y} fill="rgba(255,255,255,0.5)" textAnchor="middle" dominantBaseline="central" fontSize={11}>
                          {range}
                        </text>
                      );
                    }}
                  >
                    {(data.priceDistribution || []).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-white/30 text-sm">No data yet</div>}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6">
            <h3 className="font-display text-xl font-semibold text-white/90 mb-5">Monthly Visits</h3>
            {(data.monthlyVisits || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.monthlyVisits}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="count" stroke="#5EA882" strokeWidth={2.5} dot={{ fill: "#2D7D58", r: 4 }} activeDot={{ r: 6, fill: "#D4A017" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-white/30 text-sm">No data yet</div>}
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6">
            <h3 className="font-display text-xl font-semibold text-white/90 mb-5">Dining Occasions</h3>
            {occasionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={occasionData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {occasionData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-white/30 text-sm">No data yet</div>}
          </div>
        </FadeIn>
      </div>

      {(data.topRatedRestaurants || []).length > 0 && (
        <FadeIn delay={0.3}>
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6">
            <h3 className="font-display text-xl font-semibold text-white/90 mb-5">Top Rated Restaurants</h3>
            <div className="space-y-2">
              {(data.topRatedRestaurants || []).map((r: any, i: number) => (
                <div key={i} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/[0.05] transition-all duration-200 active:scale-[0.99]">
                  <span className="text-xl w-8 text-center transition-transform duration-200 group-hover:scale-110">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}</span>
                  <span className="text-2xl transition-transform duration-200 group-hover:scale-110">{getCuisineEmoji(r.cuisine)}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-white/80 text-sm group-hover:text-white transition-colors">{r.name}</p>
                    <p className="text-xs text-white/40">{r.cuisine}</p>
                  </div>
                  <span className="font-display text-xl font-semibold text-gold-400">{r.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
