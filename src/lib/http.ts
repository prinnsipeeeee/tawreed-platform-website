import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";
export function apiError(error: unknown) {
  if (error instanceof AppError)
    return NextResponse.json({ error: error.code }, { status: error.status });
  if (error instanceof ZodError)
    return NextResponse.json(
      {
        error: "validation",
        details: error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2003"
  )
    return NextResponse.json({ error: "referencedRecord" }, { status: 409 });
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  )
    return NextResponse.json({ error: "duplicateKey" }, { status: 409 });
  console.error(
    "Request failed",
    error instanceof Error ? error.name : "UnknownError",
  );
  return NextResponse.json({ error: "serverError" }, { status: 500 });
}
