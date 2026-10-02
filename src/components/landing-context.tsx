"use client";
import { createContext, useContext, useEffect } from "react";
import type { LandingData } from "@/lib/content";
export type Locale = "en" | "ar";
const Context = createContext<ReturnType<typeof landingValue> | null>(null);
function landingValue(data: LandingData, locale: Locale) {
  const local = (en: string, ar?: string) => (locale === "ar" && ar ? ar : en);
  const textMap = Object.fromEntries(
    data.texts.map((t) => [t.key, local(t.en, t.ar)]),
  );
  const localized = (payload: Record<string, unknown>): Record<string, any> =>
    Object.fromEntries(
      Object.entries(payload)
        .filter(([key]) => !key.endsWith("Ar"))
        .map(([key, value]) => [
          key,
          locale === "ar" &&
          payload[key + "Ar"] &&
          (typeof payload[key + "Ar"] !== "object" ||
            (payload[key + "Ar"] as unknown[]).length)
            ? payload[key + "Ar"]
            : value,
        ]),
    );
  const records = (
    kind: string,
  ): Array<Record<string, any> & { id: string; key: string }> =>
    data.items
      .filter((i) => i.kind === kind)
      .map((i) => ({ ...localized(i.payload), id: i.key, key: i.key }));
  const participants = data.profiles.map((s) => ({
    id: s.key,
    type: s.type,
    name: local(s.nameEn, s.nameAr),
    arabicName: s.nameAr,
    role: local(s.descriptionEn, s.descriptionAr),
    avatarText: local(s.nameEn, s.nameAr).slice(0, 1),
    city: local(s.coverageEn, s.coverageAr),
    crNumber: s.crNumber,
    rating: s.rating,
    quoteTurnaround: local(s.turnaroundEn, s.turnaroundAr),
    specialty: local(s.specialtyEn, s.specialtyAr),
    projectsDone: local(s.projectsEn, s.projectsAr),
    isVerified: s.verified,
    badgeColor: s.type === "supplier" ? "emerald" : "gold",
  }));
  const supplier = data.profiles.find((s) => s.type === "supplier");
  const client = data.profiles.find((s) => s.type === "client");
  const categories = data.categories.map((c) => ({
    id: c.key,
    label: local(c.nameEn, c.nameAr),
    icon: c.icon,
    arabic: c.nameAr,
  }));
  const catalogData = Object.fromEntries(
    categories.map((c) => [
      c.id,
      data.catalog
        .filter((i) => i.categoryKey === c.id)
        .map((i) => ({
          id: i.key,
          name: local(i.nameEn, i.nameAr),
          price: i.priceHalalas / 100,
          priceHalalas: i.priceHalalas,
          unit: local(i.unitEn, i.unitAr),
          supplierKey: i.supplierKey,
          supplierName: (() => {
            const s = data.profiles.find((p) => p.key === i.supplierKey);
            return s ? local(s.nameEn, s.nameAr) : "";
          })(),
        })),
    ]),
  );
  const money = (halalas: number) =>
    new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
      style: "currency",
      currency: "SAR",
    }).format(halalas / 100);
  const tiers = data.fees.map((f, i) => ({
    name: local(f.nameEn, f.nameAr),
    description: local(f.descriptionEn, f.descriptionAr),
    fee: money(f.feeHalalas),
    minimumHalalas: f.minimumHalalas,
    feeHalalas: f.feeHalalas,
    color: f.color,
    scope:
      locale === "ar"
        ? `من ${money(f.minimumHalalas)}${data.fees[i + 1] ? ` إلى أقل من ${money(data.fees[i + 1].minimumHalalas)}` : ""}`
        : `From ${money(f.minimumHalalas)}${data.fees[i + 1] ? ` to under ${money(data.fees[i + 1].minimumHalalas)}` : ""}`,
  }));
  const visibleSections = new Set(
    data.sections.filter((s) => s.visible).map((s) => s.key),
  );
  const links = (kind: string) =>
    records(kind).filter(
      (i) =>
        !String(i.href || "").startsWith("#") ||
        visibleSections.has(String(i.href).slice(1)),
    );
  return {
    locale,
    sectionVisible: (key: string) => visibleSections.has(key),
    supplierOptions: data.profiles
      .filter((s) => s.type === "supplier")
      .map((s) => ({ key: s.key, name: local(s.nameEn, s.nameAr) })),
    t: (key: string) => textMap[key] ?? "",
    settings: {
      vatBasisPoints: 1500,
      dealSize: 25000,
      winRate: 25,
      ...data.settings,
    },
    divisions: records("division").map((d) => ({
      ...d,
      arabicTitle:
        data.items.find((i) => i.key === d.key)?.payload.titleAr || "",
    })),
    participants,
    scenes: records("workflow").map((s, i) => ({
      ...s,
      num: String(i + 1).padStart(2, "0"),
      arabicTitle:
        data.items.find((i) => i.key === s.key)?.payload.titleAr || "",
    })),
    categories,
    cities: data.cities.map((c) => ({
      name: local(c.nameEn, c.nameAr),
      arabic: c.nameAr,
    })),
    catalogData,
    supplier: supplier
      ? local(supplier.nameEn, supplier.nameAr)
      : local("Demo Supplier", "مورد تجريبي"),
    clientName: client
      ? local(client.nameEn, client.nameAr)
      : local("Demo Client", "عميل تجريبي"),
    tiers,
    records,
    links,
    money,
  };
}
export function LandingProvider({
  data,
  locale,
  children,
}: {
  data: LandingData;
  locale: Locale;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);
  return (
    <Context.Provider value={landingValue(data, locale)}>
      <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
        {children}
      </div>
    </Context.Provider>
  );
}
export function useLanding() {
  const value = useContext(Context);
  if (!value) throw new Error("LandingProvider is required");
  return value;
}
