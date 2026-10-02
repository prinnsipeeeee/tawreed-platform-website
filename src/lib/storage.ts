import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import { resolve, join } from "node:path";
import { get, head, del } from "@vercel/blob";
import { db } from "./database";
import { AppError } from "./errors";
import { uploadSpec, validateFile } from "./file-validation";
export function storageDriver() {
  const driver = process.env.STORAGE_DRIVER || "local";
  if (!["local", "blob"].includes(driver)) throw new AppError("storageConfig");
  if (process.env.VERCEL && driver === "local")
    throw new AppError("storageConfig");
  return driver;
}
export async function requestUpload(
  adminId: string,
  filename: string,
  size: number,
  supplierKey?: string,
) {
  const spec = uploadSpec(filename, size);
  if (
    supplierKey &&
    !(await db().supplier.findUnique({ where: { key: supplierKey } }))
  )
    throw new AppError("unknownReference");
  const id = randomUUID();
  const driver = storageDriver();
  const locator = driver === "local" ? id : `uploads/${id}/${spec.filename}`;
  const row = await db().upload.create({
    data: {
      id,
      adminId,
      filename: spec.filename,
      contentType: spec.contentType,
      size,
      locator,
      driver,
      supplierKey: supplierKey || null,
    },
  });
  return {
    id: row.id,
    driver,
    pathname: locator,
    contentType: spec.contentType,
  };
}
const localPath = (id: string) => {
  if (!/^[a-zA-Z0-9-]+$/.test(id)) throw new AppError("invalidFile");
  return join(resolve(process.env.UPLOAD_DIR || "./data/uploads"), id);
};
export async function readUpload(id: string) {
  const row = await db().upload.findUnique({ where: { id } });
  if (!row || row.status !== "ready") throw new AppError("notFound", 404);
  if (row.driver === "local")
    return { row, bytes: await readFile(localPath(id)) };
  const result = await get(row.locator, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) throw new AppError("notFound", 404);
  return {
    row,
    bytes: Buffer.from(await new Response(result.stream).arrayBuffer()),
  };
}
export async function completeLocal(
  id: string,
  adminId: string,
  request: Request,
) {
  const row = await db().upload.findUnique({ where: { id } });
  if (
    !row ||
    row.adminId !== adminId ||
    row.driver !== "local" ||
    row.status !== "pending"
  )
    throw new AppError("invalidFile");
  const max = uploadSpec(row.filename, row.size).max;
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (!request.body) throw new AppError("invalidFile");
  const reader = request.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      throw new AppError("fileLimit");
    }
    chunks.push(value);
  }
  const bytes = Buffer.concat(chunks);
  if (bytes.length !== row.size) throw new AppError("invalidFile");
  validateFile(bytes, row.contentType);
  await mkdir(resolve(process.env.UPLOAD_DIR || "./data/uploads"), {
    recursive: true,
  });
  try {
    await writeFile(localPath(id), bytes, { flag: "wx", mode: 0o600 });
    await db().upload.update({ where: { id }, data: { status: "ready" } });
  } catch (error) {
    await unlink(localPath(id)).catch(() => {});
    throw error;
  }
}
export async function completeBlob(id: string) {
  const row = await db().upload.findUnique({ where: { id } });
  if (!row || row.driver !== "blob") throw new AppError("invalidFile");
  if (row.status === "ready") return;
  try {
    const metadata = await head(row.locator);
    if (metadata.size !== row.size) throw new AppError("invalidFile");
    const result = await get(row.locator, {
      access: "private",
      useCache: false,
    });
    if (!result || result.statusCode !== 200) throw new AppError("invalidFile");
    const bytes = Buffer.from(await new Response(result.stream).arrayBuffer());
    if (bytes.length !== row.size) throw new AppError("invalidFile");
    validateFile(bytes, row.contentType);
    await db().upload.update({ where: { id }, data: { status: "ready" } });
  } catch (error) {
    await del(row.locator).catch(() => {});
    await db().upload.update({ where: { id }, data: { status: "failed" } });
    throw error;
  }
}
export async function deleteUpload(id: string) {
  const row = await db().upload.findUnique({ where: { id } });
  if (!row) throw new AppError("notFound", 404);
  if (row.driver === "blob") await del(row.locator);
  else
    await unlink(localPath(id)).catch((e: NodeJS.ErrnoException) => {
      if (e.code !== "ENOENT") throw e;
    });
  await db().upload.delete({ where: { id } });
}
