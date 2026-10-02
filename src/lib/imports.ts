import "server-only";
import ExcelJS from "exceljs";
import { db } from "./database";
import { resources, resourceSchema } from "./resources";
import { AppError } from "./errors";
import { readUpload } from "./storage";
import { validateFile, EXCEL_TYPE } from "./file-validation";
import type { Transaction } from "./content";
export const importColumns = (kind: string) => {
  if (!["suppliers", "catalog"].includes(kind))
    throw new AppError("notFound", 404);
  return resources[kind].fields.map((f) =>
    f.key === "priceHalalas" ? "priceSar" : f.key,
  );
};
export async function workbookTemplate(kind: string) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(kind);
  sheet.columns = importColumns(kind).map((key) => ({
    header: key,
    key,
    width: key.includes("description") ? 45 : 24,
  }));
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.addRow(
    kind === "suppliers"
      ? {
          key: "example-supplier",
          nameEn: "Example Supplier",
          nameAr: "مورد تجريبي",
          visible: true,
          verified: false,
          featured: false,
          position: 0,
        }
      : {
          key: "example-item",
          supplierKey: "smartinbox",
          categoryKey: "general",
          nameEn: "Example Service",
          nameAr: "خدمة تجريبية",
          unitEn: "m²",
          unitAr: "م²",
          priceSar: 45,
          visible: true,
          position: 0,
        },
  );
  return workbook.xlsx.writeBuffer();
}
type ImportRow = {
  line: number;
  data: Record<string, unknown>;
  before: string | null;
  action: "create" | "update";
};
async function lookup(tx: Transaction, kind: string, key: string) {
  return kind === "suppliers"
    ? tx.supplier.findUnique({ where: { key } })
    : tx.catalogItem.findUnique({ where: { key } });
}
function comparable(row: Record<string, unknown>) {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(row).sort(([a], [b]) => a.localeCompare(b)),
    ),
  );
}
async function references(
  tx: Transaction,
  kind: string,
  data: Record<string, unknown>,
) {
  if (
    kind === "suppliers" &&
    data.cityKey &&
    !(await tx.city.findUnique({ where: { key: String(data.cityKey) } }))
  )
    throw new AppError("unknownReference");
  if (
    kind === "catalog" &&
    (!(await tx.supplier.findUnique({
      where: { key: String(data.supplierKey) },
    })) ||
      !(await tx.category.findUnique({
        where: { key: String(data.categoryKey) },
      })))
  )
    throw new AppError("unknownReference");
}
export async function previewImport(
  adminId: string,
  kind: string,
  uploadId: string,
) {
  const columns = importColumns(kind);
  const { row: file, bytes } = await readUpload(uploadId);
  if (file.adminId !== adminId || file.contentType !== EXCEL_TYPE)
    throw new AppError("invalidFile");
  validateFile(bytes, EXCEL_TYPE);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(bytes as unknown as ExcelJS.Buffer);
  if (workbook.worksheets.length !== 1) throw new AppError("invalidTemplate");
  const sheet = workbook.worksheets[0];
  if (sheet.rowCount > 2001) throw new AppError("fileLimit");
  const headers = columns.map((_, i) => sheet.getRow(1).getCell(i + 1).value);
  if (
    headers.some((v, i) => v !== columns[i]) ||
    sheet.getRow(1).cellCount !== columns.length
  )
    throw new AppError("invalidTemplate");
  const errors: { line: number; message: string }[] = [];
  const rows: ImportRow[] = [];
  const keys = new Set<string>();
  for (let line = 2; line <= sheet.rowCount; line++) {
    const row = sheet.getRow(line);
    if (!row.hasValues) continue;
    try {
      if (row.cellCount > columns.length) throw new AppError("invalidTemplate");
      const raw: Record<string, unknown> = {};
      for (const [i, column] of columns.entries()) {
        const cell = row.getCell(i + 1);
        const value = cell.value;
        if (value && typeof value === "object")
          throw new AppError("formulaOrObject");
        const key = column === "priceSar" ? "priceHalalas" : column;
        const field = resources[kind].fields.find((f) => f.key === key)!;
        if (field.type === "checkbox") {
          if (value === null || value === "") raw[key] = key === "visible";
          else if (
            [true, 1, "true", "TRUE"].includes(
              value as string | number | boolean,
            )
          )
            raw[key] = true;
          else if (
            [false, 0, "false", "FALSE"].includes(
              value as string | number | boolean,
            )
          )
            raw[key] = false;
          else throw new AppError("validation");
        } else if (field.type === "number") {
          const n = value === null || value === "" ? 0 : Number(value);
          if (
            column === "priceSar" &&
            (!Number.isFinite(n) ||
              Math.abs(n * 100 - Math.round(n * 100)) > 0.000001)
          )
            throw new AppError("validation");
          raw[key] = column === "priceSar" ? Math.round(n * 100) : n;
        } else raw[key] = value === null ? "" : String(value);
      }
      const data = resourceSchema(resources[kind]).parse(raw) as Record<
        string,
        unknown
      >;
      if (keys.has(String(data.key))) throw new AppError("duplicateKey");
      keys.add(String(data.key));
      if (kind === "suppliers" && !data.cityKey) data.cityKey = null;
      await references(db(), kind, data);
      const before = await lookup(db(), kind, String(data.key));
      rows.push({
        line,
        data,
        before: before ? comparable(before) : null,
        action: before ? "update" : "create",
      });
    } catch (error) {
      errors.push({
        line,
        message: error instanceof AppError ? error.code : "validation",
      });
    }
  }
  if (!rows.length && !errors.length) throw new AppError("emptyImport");
  return db().importBatch.create({
    data: {
      adminId,
      kind,
      filename: file.filename,
      rows: JSON.stringify(rows),
      errors: JSON.stringify(errors),
      status: errors.length ? "invalid" : "preview",
      createdCount: rows.filter((r) => r.action === "create").length,
      updatedCount: rows.filter((r) => r.action === "update").length,
    },
  });
}
export async function commitImport(adminId: string, id: string) {
  return db().$transaction(
    async (tx) => {
      const batch = await tx.importBatch.findUnique({ where: { id } });
      if (!batch || batch.adminId !== adminId)
        throw new AppError("notFound", 404);
      if (batch.status === "committed") return batch;
      if (batch.status !== "preview" || JSON.parse(batch.errors).length)
        throw new AppError("invalidImport");
      // Claim the batch within the transaction so concurrent confirms cannot apply it twice.
      const claim = await tx.importBatch.updateMany({
        where: { id, status: "preview" },
        data: { status: "committing" },
      });
      if (claim.count !== 1) throw new AppError("importChanged", 409);
      for (const row of JSON.parse(batch.rows) as ImportRow[]) {
        const before = await lookup(tx, batch.kind, String(row.data.key));
        if ((before ? comparable(before) : null) !== row.before)
          throw new AppError("importChanged", 409);
        await references(tx, batch.kind, row.data);
        if (batch.kind === "suppliers")
          await tx.supplier.upsert({
            where: { key: String(row.data.key) },
            create: row.data as never,
            update: row.data,
          });
        else
          await tx.catalogItem.upsert({
            where: { key: String(row.data.key) },
            create: row.data as never,
            update: row.data,
          });
      }
      return tx.importBatch.update({
        where: { id },
        data: { status: "committed", committedAt: new Date() },
      });
    },
    { timeout: 60000 },
  );
}
