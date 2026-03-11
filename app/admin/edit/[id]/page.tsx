import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { VisitForm } from "@/components/admin/VisitForm";
import { FadeIn } from "@/components/animations/PageTransition";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditVisitPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: visit } = await supabase.from("restaurant_visits").select("*").eq("id", params.id).single();
  if (!visit) redirect("/admin");

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="mb-8">
            <Link href={`/restaurants/${params.id}`} className="inline-flex items-center gap-2 text-sm text-forest-500 hover:text-forest-700 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Visit
            </Link>
            <h1 className="font-display text-4xl font-light text-forest-950">Edit Visit</h1>
            <p className="text-forest-500 mt-1">{visit.restaurant_name}</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}><VisitForm initialData={visit} visitId={visit.id} /></FadeIn>
      </div>
    </div>
  );
}
