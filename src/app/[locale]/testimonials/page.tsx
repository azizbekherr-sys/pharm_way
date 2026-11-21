import { permanentRedirect } from "next/navigation";

// Yangi dizaynda alohida "Fikrlar" sahifasi yo'q (tasdiqlangan sharhlar yo'q) —
// eski manzil "Biz haqimizda" sahifasiga 308 bilan yo'naltiriladi.
export default async function TestimonialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/about`);
}
