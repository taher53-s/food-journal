import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const supabase = createClient();
  const { data: photos } = await supabase
    .from("photos")
    .select("*, restaurant_visits(restaurant_name, cuisine)")
    .order("created_at", { ascending: false });

  const all = photos || [];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-forest-500 uppercase tracking-widest mb-3">Visual Stories</p>
            <h1 className="font-display text-5xl md:text-7xl font-light text-forest-950 mb-4">
              Food <span className="text-gradient italic">Gallery</span>
            </h1>
            <p className="text-forest-500 text-lg max-w-xl mx-auto font-light">
              {all.length} photos from {new Set(all.map((p: any) => p.visit_id)).size} restaurant visits
            </p>
          </div>
        </FadeIn>

        {all.length === 0 ? (
          <div className="text-center py-24 px-4 bg-gradient-to-tr from-cream-200 to-forest-50 border border-forest-100/50 rounded-4xl max-w-2xl mx-auto shadow-card">
            <div className="text-7xl mb-6">📸</div>
            <h3 className="font-display text-2xl text-forest-900 mb-2 font-semibold">No memories yet</h3>
            <p className="text-forest-600">Start discovering new places and capture your favorites!</p>
          </div>
        ) : (
          <StaggerContainer className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {all.map((photo: any) => (
              <StaggerItem key={photo.id}>
                <Link href={`/restaurants/${photo.visit_id}`}>
                  <div className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer mb-4">
                    <Image src={photo.image_url} alt={photo.caption || "Food photo"} width={400} height={300}
                      unoptimized={true} onError={(e) => { console.error('Image failed:', e.currentTarget.src); e.currentTarget.style.display = 'none'; }}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                    <img src={photo.image_url} alt={photo.caption || "Food photo"} className="w-full h-auto object-cover" style={{ zIndex: -1 }} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-xs font-semibold truncate">{photo.restaurant_visits?.restaurant_name}</p>
                      {photo.caption && <p className="text-white/70 text-xs truncate">{photo.caption}</p>}
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
