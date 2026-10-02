import { NextResponse } from "next/server";
import { login, logout, changePassword, sameOrigin } from "@/lib/auth";
import { apiError } from "@/lib/http";
export async function POST(
  request: Request,
  context: { params: Promise<{ action: string }> },
) {
  try {
    await sameOrigin();
    const { action } = await context.params;
    const body = await request.json();
    if (action === "login")
      await login(String(body.email || ""), String(body.password || ""));
    else if (action === "logout") await logout();
    else if (action === "password")
      await changePassword(
        String(body.oldPassword || ""),
        String(body.password || ""),
      );
    else return NextResponse.json({ error: "notFound" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
