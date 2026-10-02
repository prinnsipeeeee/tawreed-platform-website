import { requireAdmin } from "@/lib/auth";
import { workbookTemplate } from "@/lib/imports";
import { apiError } from "@/lib/http";
import { EXCEL_TYPE } from "@/lib/file-validation";
export async function GET(
  _: Request,
  context: { params: Promise<{ kind: string }> },
) {
  try {
    await requireAdmin();
    const { kind } = await context.params;
    const bytes = await workbookTemplate(kind);
    return new Response(new Uint8Array(bytes as ArrayBuffer), {
      headers: {
        "Content-Type": EXCEL_TYPE,
        "Content-Disposition": `attachment; filename="${kind}-template.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return apiError(e);
  }
}
