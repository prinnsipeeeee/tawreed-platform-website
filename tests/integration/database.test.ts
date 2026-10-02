import { seedAdmin } from "../../src/seed/admin";
import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { db } from "../../src/lib/database";
import { seedLanding } from "../../src/seed/defaults";
import {
  saveResource,
  deleteResource,
  publicLanding,
  listResource,
} from "../../src/lib/content";
import {
  requestUpload,
  completeLocal,
  readUpload,
  deleteUpload,
} from "../../src/lib/storage";
import {
  previewImport,
  commitImport,
  workbookTemplate,
} from "../../src/lib/imports";
import ExcelJS from "exceljs";
let adminId: string;
before(async () => {
  await seedLanding();
  const admin = await db().admin.upsert({
    where: { email: "integration@example.test" },
    create: { email: "integration@example.test", passwordHash: "test-only" },
    update: {},
  });
  adminId = admin.id;
});
after(async () => {
  await db().$disconnect();
});
test("seeders preserve edited text and do not duplicate collections", async () => {
  const count = await db().contentText.count();
  await db().contentText.update({
    where: { key: "hero.text.002" },
    data: { en: "Edited by admin" },
  });
  await seedLanding();
  assert.equal(await db().contentText.count(), count);
  assert.equal(
    (
      await db().contentText.findUniqueOrThrow({
        where: { key: "hero.text.002" },
      })
    ).en,
    "Edited by admin",
  );
  assert.equal(await db().catalogItem.count(), 20);
});
test("CRUD publishes content and enforces stable keys and references", async () => {
  await saveResource("cities", {
    key: "test-city",
    nameEn: "Test City",
    nameAr: "مدينة تجريبية",
    position: 8,
    visible: true,
  });
  let cities = await listResource("cities");
  assert.ok(cities.some((c) => c.key === "test-city"));
  await saveResource(
    "cities",
    {
      key: "test-city",
      nameEn: "Changed",
      nameAr: "",
      position: 8,
      visible: false,
    },
    "test-city",
  );
  assert.ok(!(await publicLanding()).cities.some((c) => c.key === "test-city"));
  await assert.rejects(() =>
    saveResource("cities", { key: "other", nameEn: "Other" }, "test-city"),
  );
  await assert.rejects(() => deleteResource("suppliers", "smartinbox"));
  await deleteResource("cities", "test-city");
});
test("public data never exposes supplier contact information", async () => {
  await db().supplier.update({
    where: { key: "smartinbox" },
    data: { phone: "private-phone", email: "private@example.test" },
  });
  const data = await publicLanding();
  assert.ok(!JSON.stringify(data).includes("private-phone"));
  assert.ok(!JSON.stringify(data).includes("private@example.test"));
});
test("baseline fee tier and fixed sections cannot be removed", async () => {
  await assert.rejects(() => deleteResource("fees", "tier-1"));
  await assert.rejects(() => deleteResource("sections", "hero"));
});
test("PDF storage validates signatures and deletes independently", async () => {
  const bytes = Buffer.from("%PDF-1.4\n%%EOF");
  const intent = await requestUpload(
    adminId,
    "document.pdf",
    bytes.length,
    "smartinbox",
  );
  await completeLocal(
    intent.id,
    adminId,
    new Request("http://localhost", { method: "POST", body: bytes }),
  );
  assert.deepEqual((await readUpload(intent.id)).bytes, bytes);
  await deleteUpload(intent.id);
  assert.ok(await db().supplier.findUnique({ where: { key: "smartinbox" } }));
  await assert.rejects(() => readUpload(intent.id));
});
async function uploadedWorkbook(workbook: ExcelJS.Workbook) {
  const bytes = Buffer.from(await workbook.xlsx.writeBuffer());
  const intent = await requestUpload(adminId, "import.xlsx", bytes.length);
  await completeLocal(
    intent.id,
    adminId,
    new Request("http://localhost", { method: "POST", body: bytes }),
  );
  return intent.id;
}
async function template() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await workbookTemplate("catalog"));
  return workbook;
}
test("Excel preview does not write catalog until confirmation; repeated confirmation is safe", async () => {
  const workbook = await template();
  const uploadId = await uploadedWorkbook(workbook);
  const batch = await previewImport(adminId, "catalog", uploadId);
  assert.equal(batch.status, "preview");
  assert.equal(
    await db().catalogItem.findUnique({ where: { key: "example-item" } }),
    null,
  );
  await commitImport(adminId, batch.id);
  await commitImport(adminId, batch.id);
  assert.equal(
    (
      await db().catalogItem.findUniqueOrThrow({
        where: { key: "example-item" },
      })
    ).priceHalalas,
    4500,
  );
  await deleteUpload(uploadId);
});
test("duplicate keys and formulas prevent the complete import", async () => {
  const workbook = await template();
  const sheet = workbook.worksheets[0];
  sheet.addRow(sheet.getRow(2).values);
  sheet.getRow(3).getCell(1).value = "formula-item";
  sheet.getRow(3).getCell(8).value = { formula: "1+1", result: 2 };
  sheet.addRow(sheet.getRow(2).values);
  const id = await uploadedWorkbook(workbook);
  const batch = await previewImport(adminId, "catalog", id);
  assert.equal(batch.status, "invalid");
  assert.ok(JSON.parse(batch.errors).length >= 2);
  await assert.rejects(() => commitImport(adminId, batch.id));
  await deleteUpload(id);
});
test("reference errors and stale previews roll back atomically", async () => {
  const workbook = await template();
  workbook.worksheets[0].getRow(2).getCell(1).value = "unknown-item";
  workbook.worksheets[0].getRow(2).getCell(2).value = "missing-supplier";
  const id = await uploadedWorkbook(workbook);
  const invalid = await previewImport(adminId, "catalog", id);
  assert.equal(invalid.status, "invalid");
  await deleteUpload(id);
  const next = await template();
  const secondId = await uploadedWorkbook(next);
  const batch = await previewImport(adminId, "catalog", secondId);
  await db().catalogItem.update({
    where: { key: "example-item" },
    data: { priceHalalas: 9900 },
  });
  await assert.rejects(() => commitImport(adminId, batch.id));
  assert.equal(
    (await db().importBatch.findUniqueOrThrow({ where: { id: batch.id } }))
      .status,
    "preview",
  );
  assert.equal(
    (
      await db().catalogItem.findUniqueOrThrow({
        where: { key: "example-item" },
      })
    ).priceHalalas,
    9900,
  );
  await deleteUpload(secondId);
});

test("admin seeder creates a hashed account and preserves its password on rerun", async () => {
  await seedAdmin({
    ADMIN_EMAIL: "seeded@example.test",
    ADMIN_PASSWORD: "initial-test-password",
  });
  const first = await db().admin.findUniqueOrThrow({
    where: { email: "seeded@example.test" },
  });
  assert.ok(first.passwordHash.startsWith("$2"));
  assert.notEqual(first.passwordHash, "initial-test-password");
  await seedAdmin({
    ADMIN_EMAIL: "seeded@example.test",
    ADMIN_PASSWORD: "replacement-test-password",
  });
  assert.equal(
    (
      await db().admin.findUniqueOrThrow({
        where: { email: "seeded@example.test" },
      })
    ).passwordHash,
    first.passwordHash,
  );
});
test("section ordering and visibility update the public payload", async () => {
  await saveResource(
    "sections",
    { key: "hero", position: 6, visible: false },
    "hero",
  );
  const hero = (await publicLanding()).sections.find((s) => s.key === "hero")!;
  assert.equal(hero.position, 6);
  assert.equal(hero.visible, false);
  await saveResource(
    "sections",
    { key: "navbar", position: -1, visible: false },
    "navbar",
  );
  assert.equal(
    (await db().landingSection.findUniqueOrThrow({ where: { key: "navbar" } }))
      .visible,
    true,
  );
});
