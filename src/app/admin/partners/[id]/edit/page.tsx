import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import PartnerForm from "@/components/admin/PartnerForm";

export default async function EditPartnerPage({ params }: { params: { id: string } }) {
  const { data: partner } = await supabaseAdmin.from("partners").select("*").eq("id", params.id).single();

  if (!partner) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Hamkorni tahrirlash</h1>
      <PartnerForm
        initial={{
          id: partner.id,
          name: partner.name,
          country: partner.country ?? "",
          countryFlag: partner.country_flag ?? "",
          category: partner.category ?? "manufacturer",
          descriptionUz: partner.description ?? "",
          descriptionRu: partner.description_ru ?? "",
          descriptionEn: partner.description_en ?? "",
          website: partner.website ?? "",
          order: partner.order ?? 0,
          active: partner.active,
          logoUrl: partner.logo_url ?? "",
        }}
      />
    </div>
  );
}
