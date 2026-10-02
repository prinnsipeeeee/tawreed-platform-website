import { NextResponse } from "next/server";
import { requireAdmin, sameOrigin } from "@/lib/auth";
import { db } from "@/lib/database";
import { apiError } from "@/lib/http";
import { requestUpload, deleteUpload, storageDriver } from "@/lib/storage";
export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(
      {
        driver: storageDriver(),
        files: await db().upload.findMany({
          select: {
            id: true,
            filename: true,
            size: true,
            contentType: true,
            supplierKey: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        }),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request) {
  try {
    await sameOrigin();
    const admin = await requireAdmin();
    const body = await request.json();
    return NextResponse.json(
      await requestUpload(
        admin.id,
        String(body.filename),
        Number(body.size),
        body.supplierKey ? String(body.supplierKey) : undefined,
      ),
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function DELETE(request: Request) {
  try {
    await sameOrigin();
    await requireAdmin();
    await deleteUpload(String((await request.json()).id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
