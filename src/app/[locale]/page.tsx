import { notFound } from "next/navigation";
import { publicLanding } from "@/lib/content";
import { LandingPage } from "@/components/landing-page";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const data = await publicLanding();
  return <LandingPage data={data} locale={locale} />;
}
