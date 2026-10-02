"use client";
import Link from "next/link";
import { useAdmin } from "./admin-context";
export function Dashboard({ counts }: { counts: Record<string, number> }) {
  const { msg } = useAdmin();
  return (
    <>
      <p className="eyebrow">{msg("dashboard")}</p>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2">{msg("welcome")}</h1>
      <p className="text-[#9a9285] mt-3">{msg("intro")}</p>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
        {Object.entries(counts).map(([key, value]) => (
          <Link
            href={
              key === "documents"
                ? "/admin/documents"
                : `/admin/manage/${key === "translations" ? "texts" : key}`
            }
            key={key}
            className="surface p-6"
          >
            <span className="text-xs text-[#9a9285]">{msg(key)}</span>
            <strong className="block text-4xl text-[#d9a441] mt-3">
              {value.toLocaleString()}
            </strong>
          </Link>
        ))}
      </div>
      <div className="surface p-6 mt-8">
        <p>{msg("published")}</p>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link href="/admin/manage/texts" className="button-primary">
            {msg("translations")}
          </Link>
          <Link href="/admin/imports" className="button-secondary">
            {msg("imports")}
          </Link>
          <Link href="/admin/documents" className="button-secondary">
            {msg("documents")}
          </Link>
        </div>
      </div>
    </>
  );
}
