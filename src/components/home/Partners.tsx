import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Partner = {
  id: string;
  name: string;
  country: string | null;
  country_flag: string | null;
  logo_url: string | null;
  website: string | null;
};

const MARQUEE_THRESHOLD = 6;

async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabaseAdmin
    .from("partners")
    .select("id, name, country, country_flag, logo_url, website")
    .eq("active", true)
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.filter((p) => p.logo_url && p.logo_url.trim() !== "");
}

function PartnerCard({ partner, instanceKey }: { partner: Partner; instanceKey: string }) {
  const Card = partner.website ? "a" : "div";
  const linkProps = partner.website
    ? { href: partner.website, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Card
      key={instanceKey}
      {...linkProps}
      className={`flex w-40 shrink-0 flex-col items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] no-underline transition-all duration-200 ${
        partner.website
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-primary-600 hover:shadow-[0_8px_24px_rgba(27,58,107,0.12)]"
          : "cursor-default"
      }`}
    >
      <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Image
          src={partner.logo_url!}
          alt={partner.name}
          width={72}
          height={72}
          className="h-full w-full object-contain p-2"
        />
      </div>
      <p className="text-xs font-semibold text-slate-800">{partner.name}</p>
    </Card>
  );
}

export default async function Partners() {
  const t = await getTranslations("home.partners");
  const partners = await getPartners();

  if (partners.length === 0) return null;

  const useMarquee = partners.length > MARQUEE_THRESHOLD;
  const items = useMarquee ? [...partners, ...partners] : partners;

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-slate-500">{t("subtitle")}</p>
        </div>
      </div>

      {useMarquee ? (
        <div className="relative mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex w-max gap-5">
            {items.map((partner, i) => (
              <PartnerCard key={`${partner.id}-${i}`} partner={partner} instanceKey={`${partner.id}-${i}`} />
            ))}
          </div>
        </div>
      ) : (
        <div className="container-page mt-12">
          <div className="flex flex-wrap justify-center gap-5">
            {items.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} instanceKey={partner.id} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
