import { z } from "zod";
export type Field = {
  key: string;
  label: string;
  ar: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "select" | "lines";
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
};
export type Resource = {
  title: string;
  ar: string;
  model: string;
  fields: Field[];
  itemKind?: string;
  section?: string;
  singleton?: boolean;
};
const f = (
  key: string,
  label: string,
  ar: string,
  extra: Partial<Field> = {},
): Field => ({ key, label, ar, ...extra });
const key = f("key", "Stable key", "المعرّف الثابت", { required: true });
const names = [
  f("nameEn", "Name · English", "الاسم · الإنجليزية", { required: true }),
  f("nameAr", "Name · Arabic", "الاسم · العربية"),
];
const descriptions = [
  f("descriptionEn", "Description · English", "الوصف · الإنجليزية", {
    type: "textarea",
  }),
  f("descriptionAr", "Description · Arabic", "الوصف · العربية", {
    type: "textarea",
  }),
];
const order = [
  f("position", "Display order", "ترتيب العرض", { type: "number", min: 0 }),
  f("visible", "Visible on landing page", "ظاهر في الصفحة الرئيسية", {
    type: "checkbox",
  }),
];
const profiles = [
  ...names,
  ...descriptions,
  f("specialtyEn", "Specialties · English", "التخصصات · الإنجليزية"),
  f("specialtyAr", "Specialties · Arabic", "التخصصات · العربية"),
  f("coverageEn", "Coverage · English", "التغطية · الإنجليزية"),
  f("coverageAr", "Coverage · Arabic", "التغطية · العربية"),
  f("crNumber", "Commercial registration", "السجل التجاري"),
  f("rating", "Rating / display metric", "التقييم"),
  f("turnaroundEn", "Response time · English", "زمن الاستجابة · الإنجليزية"),
  f("turnaroundAr", "Response time · Arabic", "زمن الاستجابة · العربية"),
  f("projectsEn", "Track record · English", "سجل المشاريع · الإنجليزية"),
  f("projectsAr", "Track record · Arabic", "سجل المشاريع · العربية"),
  f("verified", "Verified", "موثّق", { type: "checkbox" }),
  f("featured", "Featured", "مميّز", { type: "checkbox" }),
  ...order,
];
const textPair = (
  field: string,
  label: string,
  ar: string,
  type: Field["type"] = "text",
) => [
  f(field, label + " · English", ar + " · الإنجليزية", {
    type,
    required: true,
  }),
  f(field + "Ar", label + " · Arabic", ar + " · العربية", { type }),
];
function item(
  title: string,
  ar: string,
  kind: string,
  section: string,
  fields: Field[],
): Resource {
  return {
    title,
    ar,
    model: "contentItem",
    itemKind: kind,
    section,
    fields: [key, ...fields, ...order],
  };
}
const links = [
  ...textPair("label", "Label", "العنوان"),
  f("href", "Destination (#section or https://)", "الرابط", { required: true }),
];
export const resources: Record<string, Resource> = {
  sections: {
    title: "Sections",
    ar: "أقسام الصفحة",
    model: "landingSection",
    fields: [key, { ...order[0], min: -1 }, order[1]],
    singleton: true,
  },
  texts: {
    title: "Landing text & translations",
    ar: "نصوص الصفحة والترجمات",
    model: "contentText",
    fields: [
      key,
      f("sectionKey", "Section", "القسم", { required: true }),
      f("en", "English", "الإنجليزية", { type: "textarea", required: true }),
      f("ar", "Arabic", "العربية", { type: "textarea" }),
    ],
    singleton: true,
  },
  suppliers: {
    title: "Suppliers",
    ar: "الموردون",
    model: "supplier",
    fields: [
      key,
      ...profiles,
      f("email", "Email", "البريد الإلكتروني"),
      f("phone", "Telephone", "الهاتف"),
      f("whatsapp", "WhatsApp", "واتساب"),
      f("cityKey", "City key", "معرّف المدينة"),
    ],
  },
  clients: {
    title: "Clients",
    ar: "العملاء",
    model: "client",
    fields: [key, ...profiles],
  },
  categories: {
    title: "Catalog categories",
    ar: "فئات الكتالوج",
    model: "category",
    fields: [key, ...names, f("icon", "Icon / symbol", "الرمز"), ...order],
  },
  cities: {
    title: "Cities",
    ar: "المدن",
    model: "city",
    fields: [key, ...names, ...order],
  },
  catalog: {
    title: "Catalog & unit prices",
    ar: "الكتالوج والأسعار",
    model: "catalogItem",
    fields: [
      key,
      f("supplierKey", "Supplier key", "معرّف المورد", { required: true }),
      f("categoryKey", "Category key", "معرّف الفئة", { required: true }),
      ...names,
      f("unitEn", "Unit · English", "الوحدة · الإنجليزية", { required: true }),
      f("unitAr", "Unit · Arabic", "الوحدة · العربية"),
      f(
        "priceHalalas",
        "Unit price (halalas; 100 = SAR 1)",
        "سعر الوحدة (هللات؛ ١٠٠ = ريال)",
        { type: "number", required: true, min: 0, max: 100000000 },
      ),
      ...order,
    ],
  },
  fees: {
    title: "Lead fee tiers",
    ar: "شرائح رسوم الفرص",
    model: "feeTier",
    fields: [
      key,
      ...names,
      ...descriptions,
      f(
        "minimumHalalas",
        "Minimum project value (halalas)",
        "الحد الأدنى لقيمة المشروع (هللات)",
        { type: "number", required: true, min: 0, max: 100000000 },
      ),
      f("feeHalalas", "Lead fee (halalas)", "رسوم الفرصة (هللات)", {
        type: "number",
        required: true,
        min: 0,
        max: 100000000,
      }),
      f("color", "Accent", "اللون", {
        type: "select",
        options: ["gold", "emerald"],
      }),
    ],
  },
  settings: {
    title: "Demo settings",
    ar: "إعدادات العرض",
    model: "siteSetting",
    fields: [key, f("value", "Value", "القيمة", { required: true })],
    singleton: true,
  },
  divisions: item("Divisions", "التخصصات", "division", "acts", [
    f("category", "Filter group", "مجموعة التصفية", {
      type: "select",
      options: ["structural", "engineering", "fitout"],
    }),
    ...textPair("title", "Title", "العنوان"),
    ...textPair("tag", "Badge", "الشارة"),
    ...textPair("description", "Description", "الوصف", "textarea"),
    ...textPair(
      "services",
      "Services (one per line)",
      "الخدمات (كل خدمة في سطر)",
      "lines",
    ),
    ...textPair("sla", "Response badge", "شارة الاستجابة"),
    f("color", "Accent", "اللون", {
      type: "select",
      options: ["gold", "emerald"],
    }),
  ]),
  workflow: item("Workflow steps", "خطوات العمل", "workflow", "scenes", [
    ...textPair("title", "Title", "العنوان"),
    ...textPair("shortDesc", "Summary", "الملخص", "textarea"),
    ...textPair("badge", "Badge", "الشارة"),
    ...textPair("detailTitle", "Detail title", "عنوان التفاصيل"),
    ...textPair("detailDesc", "Details", "التفاصيل", "textarea"),
    ...textPair(
      "specs",
      "Specifications (one per line)",
      "المواصفات (كل منها في سطر)",
      "lines",
    ),
    ...textPair("mockTag", "Simulation label", "عنوان المحاكاة"),
  ]),
  nav: item("Navigation links", "روابط التنقل", "nav", "navbar", links),
  footerLinks: item(
    "Footer links",
    "روابط التذييل",
    "footerLink",
    "footer",
    links,
  ),
  heroButtons: item(
    "Hero buttons",
    "أزرار المقدمة",
    "heroButton",
    "hero",
    links,
  ),
  heroBadges: item("Hero trust badges", "شارات الثقة", "heroBadge", "hero", [
    ...textPair("label", "Label", "العنوان"),
    f("icon", "Symbol", "الرمز"),
  ]),
  closingCards: item(
    "Closing cards",
    "بطاقات الدعوة",
    "closingCard",
    "closing",
    [
      ...textPair("eyebrow", "Audience", "الفئة"),
      ...textPair("title", "Title", "العنوان"),
      ...textPair("description", "Description", "الوصف", "textarea"),
      ...textPair("label", "Button label", "عنوان الزر"),
      f("href", "Destination", "الرابط", { required: true }),
      f("icon", "Symbol", "الرمز"),
    ],
  ),
  coverage: item("Coverage regions", "مناطق التغطية", "coverage", "footer", [
    ...textPair("label", "Region", "المنطقة"),
  ]),
};
export function resourceSchema(resource: Resource) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of resource.fields) {
    let rule: z.ZodType;
    if (field.type === "checkbox")
      rule = z.boolean().default(field.key === "visible");
    else if (field.type === "number")
      rule = z
        .number()
        .int()
        .min(field.min ?? 0)
        .max(field.max ?? 1000000)
        .default(0);
    else if (field.type === "lines")
      rule = z.array(z.string().min(1).max(1000)).max(30).default([]);
    else if (field.type === "select")
      rule = z.enum(field.options as [string, ...string[]]);
    else {
      const max =
        !resource.itemKind &&
        field.type !== "textarea" &&
        ![
          "en",
          "ar",
          "value",
          "specialtyEn",
          "specialtyAr",
          "coverageEn",
          "coverageAr",
        ].includes(field.key)
          ? 191
          : 5000;
      rule = field.required
        ? z.string().min(1).max(max)
        : z.string().max(max).default("");
    }
    if (field.key === "key")
      rule = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/);
    if (field.key === "href")
      rule = z
        .string()
        .max(1000)
        .refine(
          (v) =>
            /^#[a-z][a-z0-9-]*$/.test(v) ||
            /^https:\/\//.test(v) ||
            /^mailto:[^\s]+$/.test(v) ||
            /^tel:[+0-9 -]+$/.test(v),
          "Use an anchor, HTTPS, mailto, or tel link",
        );
    if (field.key === "email")
      rule = z.union([z.literal(""), z.email().max(191)]).default("");
    shape[field.key] = rule;
  }
  return z.object(shape).strict();
}
export function missingTranslations(
  row: Record<string, unknown>,
  resource: Resource,
) {
  return resource.fields.some(
    (f) =>
      (f.key === "ar" || f.key.endsWith("Ar")) &&
      (!row[f.key] ||
        (Array.isArray(row[f.key]) && !(row[f.key] as unknown[]).length)),
  );
}
