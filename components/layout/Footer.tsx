import Link from "next/link";
import { ChefHat, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-forest-950 text-forest-200 py-16 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-white">FoodLog</span>
            </div>
            <p className="text-forest-400 text-sm leading-relaxed">A beautifully curated personal restaurant and food journal. Exploring the world, one plate at a time.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-widest mb-4">Explore</h4>
            <div className="flex flex-col gap-2.5">
              {[{ href: "/", label: "Journal" },{ href: "/restaurants", label: "Restaurants" },{ href: "/hall-of-fame", label: "Hall of Fame" },{ href: "/gallery", label: "Gallery" }].map((l) => (
                <Link key={l.href} href={l.href} className="text-forest-400 hover:text-forest-200 text-sm transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-widest mb-4">Discover</h4>
            <div className="flex flex-col gap-2.5">
              {[{ href: "/analytics", label: "Analytics" },{ href: "/top-restaurants", label: "Top Restaurants" },{ href: "/hall-of-fame", label: "Best Dishes" }].map((l) => (
                <Link key={l.href} href={l.href} className="text-forest-400 hover:text-forest-200 text-sm transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-forest-500 text-sm">© {new Date().getFullYear()} FoodLog. All memories reserved.</p>
          <div className="flex items-center gap-1.5 text-forest-500 text-sm">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-ember-400 fill-ember-400" />
            <span>for the love of food</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
