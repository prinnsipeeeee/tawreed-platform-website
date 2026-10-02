import { NextResponse } from "next/server";
import { requireAdmin, sameOrigin } from "@/lib/auth";
import { listResource, saveResource, deleteResource } from "@/lib/content";
import { apiError } from "@/lib/http";
export async function GET(
  _: Request,
  context: { params: Promise<{ resource: string }> },
) {
  try {
    await requireAdmin();
    return NextResponse.json(
      await listResource((await context.params).resource),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(
  request: Request,
  context: { params: Promise<{ resource: string }> },
) {
  try {
    await sameOrigin();
    await requireAdmin();
    const body = await request.json();
    await saveResource(
      (await context.params).resource,
      body.data,
      body.originalKey,
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
export async function DELETE(
  request: Request,
  context: { params: Promise<{ resource: string }> },
) {
  try {
    await sameOrigin();
    await requireAdmin();
    const body = await request.json();
    await deleteResource((await context.params).resource, String(body.key));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
