import { NextResponse } from "next/server";
import { requireAdmin, sameOrigin } from "@/lib/auth";
import { db } from "@/lib/database";
import { previewImport, commitImport } from "@/lib/imports";
import { apiError } from "@/lib/http";
export const maxDuration = 60;
export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(
      await db().importBatch.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
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
    const result =
      body.action === "commit"
        ? await commitImport(admin.id, String(body.id))
        : await previewImport(
            admin.id,
            String(body.kind),
            String(body.uploadId),
          );
    return NextResponse.json(result);
  } catch (e) {
    return apiError(e);
  }
}
