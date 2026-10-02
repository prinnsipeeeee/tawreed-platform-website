"use client";
import { useEffect, useState } from "react";
import { useAdmin, api } from "./admin-context";
import { uploadFile } from "./upload-client";
type FileRow = {
  id: string;
  filename: string;
  size: number;
  supplierKey: string | null;
  status: string;
};
type Supplier = { key: string; nameEn: string; nameAr: string };
export function DocumentsPanel() {
  const { msg, locale } = useAdmin();
  const [files, setFiles] = useState<FileRow[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierKey, setSupplierKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const reload = async () => setFiles((await api("/api/admin/files")).files);
  useEffect(() => {
    Promise.all([
      api("/api/admin/files").then((data) => setFiles(data.files)),
      api("/api/admin/suppliers").then(setSuppliers),
    ]).catch((e) => setError(e.message));
  }, []);
  return (
    <>
      <p className="eyebrow">{msg("admin")}</p>
      <h1 className="text-3xl font-bold mt-2">{msg("documents")}</h1>
      <p className="text-[#9a9285] mt-3">{msg("fileHelp")}</p>
      <form
        className="surface p-6 grid gap-4 mt-7"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!file) return;
          setBusy(true);
          setError("");
          try {
            await uploadFile(file, supplierKey || undefined);
            await reload();
          } catch (error) {
            setError((error as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          {msg("supplier")}
          <select
            aria-label={msg("supplier")}
            value={supplierKey}
            required
            onChange={(e) => setSupplierKey(e.target.value)}
          >
            <option value="">{msg("choose")}</option>
            {suppliers.map((s) => (
              <option key={s.key} value={s.key}>
                {locale === "ar" && s.nameAr ? s.nameAr : s.nameEn}
              </option>
            ))}
          </select>
        </label>
        <input
          type="file"
          aria-label={msg("filename")}
          accept=".pdf,.xlsx"
          required
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button className="button-primary justify-self-start" disabled={busy}>
          {msg(busy ? "loading" : "upload")}
        </button>
      </form>
      {error && (
        <p role="alert" className="notice-error mt-4">
          {msg(error)}
        </p>
      )}
      <div className="surface mt-6 overflow-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{msg("filename")}</th>
              <th>{msg("supplier")}</th>
              <th>{msg("status")}</th>
              <th>{msg("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>
                  {file.filename}
                  <span className="block text-xs text-[#9a9285]">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </td>
                <td>{file.supplierKey || "—"}</td>
                <td>{msg(file.status)}</td>
                <td>
                  <div className="flex gap-2">
                    {file.status === "ready" && (
                      <a
                        className="button-secondary"
                        href={`/api/admin/files/${file.id}`}
                      >
                        {msg("download")}
                      </a>
                    )}
                    <button
                      className="button-danger"
                      disabled={busy}
                      onClick={async () => {
                        if (!window.confirm(msg("confirmDelete"))) return;
                        setBusy(true);
                        setError("");
                        try {
                          await api(
                            "/api/admin/files",
                            { id: file.id },
                            "DELETE",
                          );
                          await reload();
                        } catch (e) {
                          setError((e as Error).message);
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      {msg("remove")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!files.length && <p className="p-8 text-[#9a9285]">{msg("empty")}</p>}
      </div>
    </>
  );
}
