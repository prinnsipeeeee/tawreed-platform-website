import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin, sameOrigin } from "@/lib/auth";
import { db } from "@/lib/database";
import { AppError } from "@/lib/errors";
import { completeBlob } from "@/lib/storage";
import { apiError } from "@/lib/http";
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        await sameOrigin();
        const admin = await requireAdmin();
        const id = JSON.parse(clientPayload || "{}").id;
        const row = await db().upload.findUnique({ where: { id } });
        if (
          !row ||
          row.adminId !== admin.id ||
          row.locator !== pathname ||
          row.driver !== "blob" ||
          row.status !== "pending"
        )
          throw new AppError("forbidden", 403);
        return {
          allowedContentTypes: [row.contentType],
          maximumSizeInBytes: row.size,
          addRandomSuffix: false,
          allowOverwrite: false,
          validUntil: Date.now() + 5 * 60_000,
          tokenPayload: JSON.stringify({ id }),
        };
      },
      onUploadCompleted: async ({ tokenPayload }) => {
        await completeBlob(JSON.parse(tokenPayload || "{}").id);
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return apiError(e);
  }
}
