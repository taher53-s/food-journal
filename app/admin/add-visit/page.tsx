import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { VisitForm } from "@/components/admin/VisitForm";
import { FadeIn } from "@/components/animations/PageTransition";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Add Restaurant Visit" };

export default async function AddVisitPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="mb-8">
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-forest-500 hover:text-forest-700 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-light text-forest-950">Add New Visit</h1>
            <p className="text-forest-500 mt-2">Document your latest dining experience</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}><VisitForm /></FadeIn>
      </div>
    </div>
  );
}
