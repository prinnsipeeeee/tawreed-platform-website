import data from "./landing-default.json";
import { db } from "../lib/database";
import { resourceSchema, resources } from "../lib/resources";
export async function seedLanding() {
  const database = db();
  await database.$transaction(
    async (tx) => {
      const sections = [
        "navbar",
        "hero",
        "acts",
        "crew",
        "scenes",
        "demo",
        "model",
        "closing",
        "footer",
      ];
      for (const [position, key] of sections.entries())
        await tx.landingSection.upsert({
          where: { key },
          update: {},
          create: {
            key,
            position:
              key === "navbar" ? -1 : key === "footer" ? 9999 : position,
          },
        });
      for (const text of data.texts)
        await tx.contentText.upsert({
          where: { key: text.key },
          update: {},
          create: text,
        });
      const item = async (
        key: string,
        kind: string,
        sectionKey: string,
        payload: object,
        position: number,
      ) => {
        const resource = Object.values(resources).find(
          (r) => r.itemKind === kind,
        )!;
        const {
          key: _ignored,
          position: _ignoredPosition,
          visible: _ignoredVisibility,
          ...fields
        } = resourceSchema(resource).parse({
          key,
          ...payload,
          position,
          visible: true,
        });
        await tx.contentItem.upsert({
          where: { key },
          update: {},
          create: {
            key,
            kind,
            sectionKey,
            payload: JSON.stringify(fields),
            position,
          },
        });
      };
      for (const [i, d] of data.divisions.entries()) {
        const { id, ...fields } = d;
        await item(id, "division", "acts", fields, i);
      }
      for (const [i, s] of data.scenes.entries()) {
        const { num, ...fields } = s;
        await item(`workflow-${num}`, "workflow", "scenes", fields, i);
      }
      const categoryKeys = [
        "general",
        "mep",
        "hvac",
        "interior",
        "waterproofing",
      ];
      for (const [i, c] of data.categories.entries())
        await tx.category.upsert({
          where: { key: categoryKeys[i] },
          update: {},
          create: {
            key: categoryKeys[i],
            nameEn: c.label,
            nameAr: c.arabic,
            icon: c.icon,
            position: i,
          },
        });
      for (const [i, c] of data.cities.entries())
        await tx.city.upsert({
          where: { key: c.name.toLowerCase() },
          update: {},
          create: {
            key: c.name.toLowerCase(),
            nameEn: c.name,
            nameAr: c.arabic,
            position: i,
          },
        });
      const profileKeys = [
        "smartinbox",
        "karam-al-watan",
        "al-safwa",
        "riyadh-horizon",
      ];
      for (const [i, s] of data.participants.entries()) {
        const profile = {
          key: profileKeys[i],
          nameEn: s.name,
          nameAr: s.arabicName,
          descriptionEn: s.role,
          descriptionAr: s.descriptionAr,
          specialtyEn: s.specialty,
          specialtyAr: s.specialtyAr,
          coverageEn: s.city,
          coverageAr: s.coverageAr,
          crNumber: s.crNumber,
          rating: s.rating,
          turnaroundEn: s.quoteTurnaround,
          turnaroundAr: s.turnaroundAr,
          projectsEn: s.projectsDone,
          projectsAr: s.projectsAr,
          verified: s.isVerified,
          featured: i < 2,
          position: i,
        };
        if (s.type === "supplier")
          await tx.supplier.upsert({
            where: { key: profile.key },
            update: {},
            create: { ...profile, cityKey: i === 0 ? "riyadh" : "jeddah" },
          });
        else
          await tx.client.upsert({
            where: { key: profile.key },
            update: {},
            create: profile,
          });
      }
      for (const [i, items] of Object.values(data.catalogData).entries())
        for (const [position, c] of items.entries())
          await tx.catalogItem.upsert({
            where: { key: c.id },
            update: {},
            create: {
              key: c.id,
              supplierKey: "smartinbox",
              categoryKey: categoryKeys[i],
              nameEn: c.name,
              nameAr: c.nameAr,
              unitEn: c.unit,
              unitAr: c.unitAr,
              priceHalalas: Math.round(c.price * 100),
              position,
            },
          });
      for (const [i, tier] of data.tiers.entries())
        await tx.feeTier.upsert({
          where: { key: `tier-${i + 1}` },
          update: {},
          create: {
            key: `tier-${i + 1}`,
            nameEn: tier.name,
            nameAr: [
              "أعمال الصيانة البسيطة",
              "التجديد والمرافق",
              "المشاريع الإنشائية الكبرى",
            ][i],
            descriptionEn: tier.description,
            descriptionAr: [
              "صيانة وإصلاح ودهان وأعمال بسيطة",
              "كهرباء وتكييف وتجديد وعزل",
              "مقاولات وتسليم مفتاح وتشطيبات كبرى",
            ][i],
            minimumHalalas: [0, 1000000, 5000000][i],
            feeHalalas: [3500, 7500, 15000][i],
            color: tier.color,
          },
        });
      for (const [key, value] of Object.entries({
        vatBasisPoints: "1500",
        dealSize: "25000",
        winRate: "25",
      }))
        await tx.siteSetting.upsert({
          where: { key },
          update: {},
          create: { key, value },
        });
      const nav = [
        ["Home", "الرئيسية", "#hero"],
        ["Divisions", "التخصصات", "#acts"],
        ["Suppliers & Clients", "الموردون والعملاء", "#crew"],
        ["How It Works", "كيف تعمل المنصة", "#scenes"],
        ["Live Demo", "العرض التجريبي", "#demo"],
        ["Revenue Model", "نموذج الإيرادات", "#model"],
      ];
      for (const [i, [label, labelAr, href]] of nav.entries()) {
        await item(
          `nav-${i + 1}`,
          "nav",
          "navbar",
          { label, labelAr, href },
          i,
        );
        await item(
          `footer-link-${i + 1}`,
          "footerLink",
          "footer",
          { label, labelAr, href },
          i,
        );
      }
      await item(
        "hero-quote",
        "heroButton",
        "hero",
        {
          label: "Experience Live Quote",
          labelAr: "جرّب عرض السعر",
          href: "#demo",
        },
        0,
      );
      await item(
        "hero-workflow",
        "heroButton",
        "hero",
        {
          label: "How The Story Unfolds",
          labelAr: "اكتشف كيف تعمل المنصة",
          href: "#scenes",
        },
        1,
      );
      for (const [i, [label, labelAr, icon]] of [
        ["Verified Contracting Suppliers", "موردو مقاولات موثّقون", "✓"],
        ["Instant Quotation Engine", "محرك عروض الأسعار الفوري", "⚡"],
        ["Zero Commission Hassle", "بدون تعقيدات العمولات", "★"],
      ].entries())
        await item(
          `hero-badge-${i + 1}`,
          "heroBadge",
          "hero",
          { label, labelAr, icon },
          i,
        );
      await item(
        "closing-owner",
        "closingCard",
        "closing",
        {
          eyebrow: "For Project Owners & Developers",
          eyebrowAr: "لأصحاب المشاريع والمطورين",
          title: "Need Fast Official Quotes?",
          titleAr: "تحتاج عروض أسعار سريعة؟",
          description:
            "Configure your project parameters and explore standardized demo quotations.",
          descriptionAr:
            "حدد متطلبات المشروع واستكشف عروض الأسعار التجريبية الموحدة.",
          label: "Launch Demo Quote Builder",
          labelAr: "ابدأ إعداد عرض تجريبي",
          href: "#demo",
          icon: "🏗️",
        },
        0,
      );
      await item(
        "closing-supplier",
        "closingCard",
        "closing",
        {
          eyebrow: "For Suppliers & Contractors",
          eyebrowAr: "للموردين والمقاولين",
          title: "Explore Featured Suppliers",
          titleAr: "استكشف الموردين",
          description:
            "Discover the participating suppliers and their specialties.",
          descriptionAr: "تعرّف على الجهات المشاركة وتخصصاتها.",
          label: "Explore Suppliers",
          labelAr: "استكشف الموردين",
          href: "#crew",
          icon: "🛡️",
        },
        1,
      );
      for (const [i, [label, labelAr]] of [
        ["Riyadh Central Hub", "مركز الرياض"],
        ["Jeddah & Makkah Province", "جدة ومنطقة مكة"],
        ["Dammam & Khobar Hub", "الدمام والخبر"],
      ].entries())
        await item(
          `coverage-${i + 1}`,
          "coverage",
          "footer",
          { label, labelAr },
          i,
        );
    },
    { timeout: 60000 },
  );
}
