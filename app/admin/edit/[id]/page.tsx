import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { VisitForm } from "@/components/admin/VisitForm";
import { FadeIn, SectionHeading, AnimatedDivider } from "@/components/animations/PageTransition";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditVisitPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: visit } = await supabase.from("restaurant_visits").select("*").eq("id", params.id).single();
  if (!visit) redirect("/admin");

  return (
    <div className="min-h-screen bg-[#0A1A12]">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(27,94,67,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 pt-32 pb-24">
        <FadeIn>
          <Link href={`/restaurants/${params.id}`} className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4" /> Back to Visit
          </Link>
        </FadeIn>
        <FadeIn delay={0.05}>
          <SectionHeading
            eyebrow="✎ Edit"
            title="Edit Visit"
            subtitle={visit.restaurant_name}
            dark
          />
        </FadeIn>
        <AnimatedDivider className="mb-10" dark />
        <FadeIn delay={0.1}><VisitForm initialData={visit} visitId={visit.id} dark /></FadeIn>
      </div>
    </div>
  );
}
