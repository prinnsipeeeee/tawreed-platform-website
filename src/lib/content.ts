import "server-only";
import { db } from "./database";
import { resources, resourceSchema } from "./resources";
import { AppError } from "./errors";
import type { Prisma } from "../generated/prisma/client";
// All dynamic delegates are selected from this closed registry, never from request-provided model names.
type Delegate = {
  findMany: (args?: object) => Promise<Record<string, unknown>[]>;
  findUnique: (args: object) => Promise<Record<string, unknown> | null>;
  create: (args: object) => Promise<unknown>;
  update: (args: object) => Promise<unknown>;
  delete: (args: object) => Promise<unknown>;
};
function delegate(database: unknown, model: string) {
  return (database as Record<string, Delegate>)[model];
}
export async function listResource(name: string) {
  const resource = resources[name];
  if (!resource) throw new AppError("notFound", 404);
  const rows = await delegate(db(), resource.model).findMany(
    resource.itemKind
      ? { where: { kind: resource.itemKind }, orderBy: { position: "asc" } }
      : {},
  );
  return rows.map((row) =>
    resource.itemKind
      ? {
          key: row.key,
          ...JSON.parse(String(row.payload)),
          position: row.position,
          visible: row.visible,
        }
      : row,
  );
}
function checkSettings(key: string, value: unknown) {
  const n = Number(value);
  const constraints: Record<string, [number, number]> = {
    vatBasisPoints: [0, 10000],
    dealSize: [5000, 100000],
    winRate: [10, 50],
  };
  const range = constraints[key];
  if (!range || !Number.isInteger(n) || n < range[0] || n > range[1])
    throw new AppError("validation");
}
export async function saveResource(
  name: string,
  raw: unknown,
  originalKey?: string,
) {
  const resource = resources[name];
  if (!resource) throw new AppError("notFound", 404);
  const data = resourceSchema(resource).parse(raw) as Record<string, unknown>;
  const key = String(data.key);
  if (originalKey && key !== originalKey) throw new AppError("immutableKey");
  if (resource.singleton && !originalKey) throw new AppError("fixedRecord");
  if (name === "settings") checkSettings(key, data.value);
  if (name === "sections" && ["navbar", "footer"].includes(key)) {
    data.position = key === "navbar" ? -1 : 9999;
    data.visible = true;
  }
  if (name === "suppliers" && !data.cityKey) data.cityKey = null;
  let payload: Record<string, unknown> = data;
  if (resource.itemKind) {
    const { key: _unused, position, visible, ...fields } = data;
    payload = {
      key,
      kind: resource.itemKind,
      sectionKey: resource.section,
      payload: JSON.stringify(fields),
      position,
      visible,
    };
  }
  return db().$transaction(async (tx) => {
    const model = delegate(tx, resource.model);
    if (originalKey) {
      const existing = await model.findUnique({ where: { key } });
      if (
        !existing ||
        (resource.itemKind && existing.kind !== resource.itemKind)
      )
        throw new AppError("notFound", 404);
    }
    if (name === "fees") {
      const existing = originalKey
        ? await tx.feeTier.findUnique({ where: { key } })
        : null;
      if (existing?.minimumHalalas === 0 && data.minimumHalalas !== 0)
        throw new AppError("baseTierRequired");
    }
    return originalKey
      ? model.update({ where: { key }, data: payload })
      : model.create({ data: payload });
  });
}
export async function deleteResource(name: string, key: string) {
  const resource = resources[name];
  if (!resource) throw new AppError("notFound", 404);
  if (resource.singleton) throw new AppError("fixedRecord");
  await db().$transaction(async (tx) => {
    const model = delegate(tx, resource.model);
    const existing = await model.findUnique({ where: { key } });
    if (!existing || (resource.itemKind && existing.kind !== resource.itemKind))
      throw new AppError("notFound", 404);
    if (name === "fees" && existing.minimumHalalas === 0)
      throw new AppError("baseTierRequired");
    await model.delete({ where: { key } });
  });
}
export async function publicLanding() {
  const database = db();
  const [
    sections,
    texts,
    items,
    suppliers,
    clients,
    categories,
    cities,
    catalog,
    fees,
    settings,
  ] = await Promise.all([
    database.landingSection.findMany({ orderBy: { position: "asc" } }),
    database.contentText.findMany(),
    database.contentItem.findMany({
      where: { visible: true },
      orderBy: { position: "asc" },
    }),
    database.supplier.findMany({
      where: { visible: true },
      orderBy: [{ featured: "desc" }, { position: "asc" }],
    }),
    database.client.findMany({
      where: { visible: true },
      orderBy: [{ featured: "desc" }, { position: "asc" }],
    }),
    database.category.findMany({
      where: { visible: true },
      orderBy: { position: "asc" },
    }),
    database.city.findMany({
      where: { visible: true },
      orderBy: { position: "asc" },
    }),
    database.catalogItem.findMany({
      where: {
        visible: true,
        supplier: { visible: true },
        category: { visible: true },
      },
      orderBy: { position: "asc" },
    }),
    database.feeTier.findMany({ orderBy: { minimumHalalas: "asc" } }),
    database.siteSetting.findMany(),
  ]);
  // Explicit projection: private supplier contact details and uploads never enter the public client bundle.
  const profiles = [
    ...suppliers.map((s) => ({
      key: s.key,
      type: "supplier",
      nameEn: s.nameEn,
      nameAr: s.nameAr,
      descriptionEn: s.descriptionEn,
      descriptionAr: s.descriptionAr,
      specialtyEn: s.specialtyEn,
      specialtyAr: s.specialtyAr,
      coverageEn: s.coverageEn,
      coverageAr: s.coverageAr,
      crNumber: s.crNumber,
      rating: s.rating,
      turnaroundEn: s.turnaroundEn,
      turnaroundAr: s.turnaroundAr,
      projectsEn: s.projectsEn,
      projectsAr: s.projectsAr,
      verified: s.verified,
    })),
    ...clients.map((s) => ({ ...s, type: "client" })),
  ];
  return {
    sections,
    texts,
    items: items.map((i) => ({
      ...i,
      payload: JSON.parse(i.payload) as Record<string, unknown>,
    })),
    profiles,
    categories,
    cities,
    catalog,
    fees,
    settings: Object.fromEntries(settings.map((s) => [s.key, Number(s.value)])),
  };
}
export type LandingData = Awaited<ReturnType<typeof publicLanding>>;
export type Transaction = Prisma.TransactionClient;
