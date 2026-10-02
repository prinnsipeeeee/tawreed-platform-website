"use client";
import { useEffect, useState } from "react";
import { api, useAdmin } from "./admin-context";
import { uploadFile } from "./upload-client";
import { resources } from "@/lib/resources";
type Batch = {
  id: string;
  kind: string;
  filename: string;
  rows: string;
  errors: string;
  status: string;
  createdCount: number;
  updatedCount: number;
  createdAt: string;
};
export function ImportsPanel() {
  const { msg, locale } = useAdmin();
  const [kind, setKind] = useState("suppliers");
  const [file, setFile] = useState<File | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selected, setSelected] = useState<Batch | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const reload = async () => setBatches(await api("/api/admin/imports"));
  useEffect(() => {
    api("/api/admin/imports")
      .then(setBatches)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <>
      <p className="eyebrow">{msg("admin")}</p>
      <h1 className="text-3xl font-bold mt-2">{msg("imports")}</h1>
      <p className="text-[#9a9285] mt-3">{msg("importHelp")}</p>
      <form
        className="surface p-6 grid gap-4 mt-7"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!file) return;
          setBusy(true);
          setError("");
          try {
            const id = await uploadFile(file);
            const batch = await api("/api/admin/imports", {
              kind,
              uploadId: id,
            });
            setSelected(batch);
            await reload();
          } catch (error) {
            setError((error as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="flex flex-wrap gap-4">
          <select
            className="max-w-xs"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="suppliers">
              {locale === "ar" ? "الموردون" : "Suppliers"}
            </option>
            <option value="catalog">
              {locale === "ar" ? "الكتالوج" : "Catalog"}
            </option>
          </select>
          <a className="button-secondary" href={`/api/admin/templates/${kind}`}>
            {msg("template")}
          </a>
        </div>
        <input
          aria-label={msg("filename")}
          type="file"
          accept=".xlsx"
          required
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <p className="text-xs text-[#9a9285]">{msg("fileHelp")}</p>
        <button className="button-primary justify-self-start" disabled={busy}>
          {msg(busy ? "loading" : "preview")}
        </button>
      </form>
      {error && (
        <p role="alert" className="notice-error mt-4">
          {msg(error)}
        </p>
      )}
      {selected && (
        <section className="surface p-6 mt-6">
          <h2 className="text-xl font-bold">{selected.filename}</h2>
          <p className="text-sm text-[#d9a441] mt-2">
            {msg(selected.status)} · {msg("createCount")}:{" "}
            {selected.createdCount} · {msg("updateCount")}:{" "}
            {selected.updatedCount}
          </p>
          {JSON.parse(selected.errors).map(
            (e: { line: number; message: string }) => (
              <p role="alert" key={e.line} className="notice-error mt-2">
                {msg("line")} {e.line}: {msg(e.message)}
              </p>
            ),
          )}
          <div className="max-h-96 overflow-auto mt-5">
            {JSON.parse(selected.rows).map(
              (row: {
                line: number;
                action: string;
                data: Record<string, unknown>;
                before: string | null;
              }) => (
                <details
                  className="border-b border-[#f4efe3]/10 p-3"
                  key={row.line}
                >
                  <summary className="cursor-pointer text-sm">
                    {msg("line")} {row.line}: {String(row.data.key)} ·{" "}
                    {row.action === "create"
                      ? msg("createCount")
                      : msg("updateCount")}
                  </summary>
                  <table className="admin-table text-xs">
                    <thead>
                      <tr>
                        <th>{msg("details")}</th>
                        <th>{msg("before")}</th>
                        <th>{msg("after")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(row.data).map(([key, value]) => (
                        <tr key={key}>
                          <td>
                            {locale === "ar"
                              ? resources[selected.kind].fields.find(
                                  (f) => f.key === key,
                                )?.ar
                              : resources[selected.kind].fields.find(
                                  (f) => f.key === key,
                                )?.label}
                          </td>
                          <td>
                            {String(
                              row.before
                                ? (JSON.parse(row.before)[key] ?? "—")
                                : "—",
                            )}
                          </td>
                          <td>{String(value ?? "—")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              ),
            )}
          </div>
          {selected.status === "preview" && (
            <button
              className="button-primary mt-5"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError("");
                try {
                  setSelected(
                    await api("/api/admin/imports", {
                      action: "commit",
                      id: selected.id,
                    }),
                  );
                  await reload();
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {msg(busy ? "loading" : "commit")}
            </button>
          )}
        </section>
      )}
      <div className="surface mt-6 overflow-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{msg("filename")}</th>
              <th>{msg("status")}</th>
              <th>{msg("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch.id}>
                <td>
                  {batch.filename}
                  <span className="block text-xs text-[#9a9285]">
                    {new Date(batch.createdAt).toLocaleString(
                      locale === "ar" ? "ar-SA" : "en-SA",
                    )}
                  </span>
                </td>
                <td>{msg(batch.status)}</td>
                <td>
                  <button
                    className="button-secondary"
                    onClick={() => setSelected(batch)}
                  >
                    {msg("details")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
