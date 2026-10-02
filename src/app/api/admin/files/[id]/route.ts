import { NextResponse } from "next/server";
import { requireAdmin, sameOrigin } from "@/lib/auth";
import { completeLocal, readUpload, completeBlob } from "@/lib/storage";
import { apiError } from "@/lib/http";
import { db } from "@/lib/database";
import { AppError } from "@/lib/errors";
export const maxDuration = 60;
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { row, bytes } = await readUpload((await context.params).id);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": row.contentType,
        "Content-Disposition": `attachment; filename="${row.filename.replace(/[^a-zA-Z0-9._-]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(row.filename)}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await sameOrigin();
    const admin = await requireAdmin();
    const { id } = await context.params;
    const row = await db().upload.findUnique({ where: { id } });
    if (!row || row.adminId !== admin.id) throw new AppError("notFound", 404);
    if (row.driver === "local") await completeLocal(id, admin.id, request);
    else await completeBlob(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
