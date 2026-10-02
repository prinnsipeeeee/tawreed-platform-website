"use client";
import { useState, useEffect } from "react";
import { useAdmin, api } from "./admin-context";
import { resources, missingTranslations, type Field } from "@/lib/resources";
type Row = Record<string, unknown>;
export function ResourceEditor({
  name,
  initialRows,
}: {
  name: string;
  initialRows: Row[];
}) {
  const resource = resources[name];
  const { locale, msg } = useAdmin();
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<Row | null>(null);
  const [originalKey, setOriginalKey] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [missing, setMissing] = useState(false);
  const [section, setSection] = useState("");
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");
  const [details, setDetails] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [references, setReferences] = useState<Record<string, Row[]>>({});
  useEffect(() => {
    if (name === "catalog" || name === "suppliers")
      Promise.all(
        ["suppliers", "categories", "cities"].map(async (key) => [
          key,
          await api(`/api/admin/${key}`),
        ]),
      )
        .then((entries) => setReferences(Object.fromEntries(entries)))
        .catch((e) => setError(e.message));
  }, [name]);
  const reload = async () => setRows(await api(`/api/admin/${name}`));
  const start = (row?: Row) => {
    setOriginalKey(row ? String(row.key) : undefined);
    setEditing(
      row
        ? Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
              key,
              value === null ? "" : value,
            ]),
          )
        : Object.fromEntries(
            resource.fields.map((f) => [
              f.key,
              f.type === "checkbox"
                ? f.key === "visible"
                : f.type === "number"
                  ? 0
                  : f.type === "lines"
                    ? []
                    : f.type === "select"
                      ? f.options?.[0]
                      : "",
            ]),
          ),
    );
    setError("");
    setDetails([]);
    setSaved(false);
  };
  const filtered = rows.filter(
    (row) =>
      (!section || row.sectionKey === section) &&
      (!missing || missingTranslations(row, resource)) &&
      Object.values(row).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase()),
      ),
  );
  const totalPages = Math.ceil(filtered.length / 20);
  const displayed = filtered.slice(page * 20, page * 20 + 20);
  const fieldInput = (field: Field) => {
    const value = editing![field.key];
    const update = (v: unknown) =>
      setEditing((current) => ({ ...current, [field.key]: v }));
    const ref = {
      supplierKey: "suppliers",
      categoryKey: "categories",
      cityKey: "cities",
    }[field.key as "supplierKey" | "categoryKey" | "cityKey"];
    const shared = {
      id: `field-${field.key}`,
      required: field.required,
      "aria-label": locale === "ar" ? field.ar : field.label,
      "aria-invalid": details.includes(field.key),
      disabled:
        (field.key === "key" && !!originalKey) ||
        (name === "sections" &&
          ["navbar", "footer"].includes(String(editing!.key)) &&
          ["position", "visible"].includes(field.key)),
      dir: (field.key === "ar" || field.key.endsWith("Ar") ? "rtl" : "ltr") as
        "rtl" | "ltr",
    };
    if (field.type === "checkbox")
      return (
        <input
          {...shared}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => update(e.target.checked)}
        />
      );
    if (ref || field.type === "select")
      return (
        <select
          {...shared}
          value={String(value ?? "")}
          onChange={(e) => update(e.target.value)}
        >
          {ref ? (
            <>
              <option value="">—</option>
              {references[ref]?.map((r) => (
                <option key={String(r.key)} value={String(r.key)}>
                  {String(locale === "ar" && r.nameAr ? r.nameAr : r.nameEn)} (
                  {String(r.key)})
                </option>
              ))}
            </>
          ) : (
            field.options?.map((option) => (
              <option key={option} value={option}>
                {option === "gold"
                  ? locale === "ar"
                    ? "ذهبي"
                    : "Gold"
                  : option === "emerald"
                    ? locale === "ar"
                      ? "أخضر"
                      : "Emerald"
                    : option === "structural"
                      ? locale === "ar"
                        ? "إنشائي"
                        : "Structural"
                      : option === "engineering"
                        ? locale === "ar"
                          ? "هندسي"
                          : "Engineering"
                        : locale === "ar"
                          ? "تشطيبات"
                          : "Fitout"}
              </option>
            ))
          )}
        </select>
      );
    if (field.type === "textarea" || field.type === "lines")
      return (
        <textarea
          {...shared}
          rows={field.type === "lines" ? 4 : 3}
          value={Array.isArray(value) ? value.join("\n") : String(value ?? "")}
          onChange={(e) =>
            update(
              field.type === "lines"
                ? e.target.value.split("\n")
                : e.target.value,
            )
          }
        />
      );
    return (
      <input
        {...shared}
        type={
          field.type === "number"
            ? "number"
            : field.key === "email"
              ? "email"
              : "text"
        }
        min={field.min}
        max={field.max}
        step={field.type === "number" ? 1 : undefined}
        value={String(value ?? "")}
        onChange={(e) =>
          update(
            field.type === "number" ? Number(e.target.value) : e.target.value,
          )
        }
      />
    );
  };
  return (
    <>
      <p className="eyebrow">{msg("admin")}</p>
      <div className="flex flex-wrap justify-between gap-4 items-center mt-2">
        <h1 className="text-3xl font-bold">
          {locale === "ar" ? resource.ar : resource.title}
        </h1>
        {!resource.singleton && (
          <button className="button-primary" onClick={() => start()}>
            {msg("create")}
          </button>
        )}
      </div>
      <p className="text-sm text-[#9a9285] mt-3">{msg("published")}</p>
      <div className="flex flex-wrap gap-4 items-center my-6">
        <input
          className="max-w-md"
          aria-label={msg("search")}
          placeholder={msg("search")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
        {name === "texts" && (
          <select
            aria-label={msg("filter")}
            className="max-w-48"
            value={section}
            onChange={(e) => {
              setSection(e.target.value);
              setPage(0);
            }}
          >
            <option value="">{msg("all")}</option>
            {[
              "navbar",
              "hero",
              "acts",
              "crew",
              "scenes",
              "demo",
              "model",
              "closing",
              "footer",
            ].map((s) => (
              <option key={s} value={s}>
                {msg(s)}
              </option>
            ))}
          </select>
        )}
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={missing}
            onChange={(e) => {
              setMissing(e.target.checked);
              setPage(0);
            }}
          />
          {msg("missing")}
        </label>
      </div>
      {error && !editing && (
        <p role="alert" className="notice-error">
          {msg(error)}
        </p>
      )}
      {saved && (
        <p role="status" className="notice-success">
          {msg("saved")}
        </p>
      )}
      <div className="surface overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{msg("records")}</th>
              <th>{locale === "ar" ? "المعرّف" : "Key"}</th>
              <th>{msg("status")}</th>
              <th>{msg("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((row) => (
              <tr key={String(row.key)}>
                <td className="max-w-md">
                  <strong className="block truncate">
                    {String(
                      locale === "ar" &&
                        (row.nameAr || row.titleAr || row.labelAr || row.ar)
                        ? row.nameAr || row.titleAr || row.labelAr || row.ar
                        : row.nameEn ||
                            row.title ||
                            row.label ||
                            row.en ||
                            (name === "sections"
                              ? msg(String(row.key))
                              : row.key),
                    )}
                  </strong>
                  {row.value !== undefined && <span>{String(row.value)}</span>}
                  {row.position !== undefined && (
                    <span className="text-xs text-[#9a9285]">
                      {msg("order")}: {String(row.position)}
                    </span>
                  )}
                </td>
                <td className="text-xs text-[#9a9285]" dir="ltr">
                  {String(row.key)}
                </td>
                <td>
                  <span className="badge">
                    {row.visible === false ? msg("hidden") : msg("visible")}
                  </span>
                  {missingTranslations(row, resource) && (
                    <span className="block text-xs text-amber-300 mt-2">
                      {msg("missing")}
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="button-secondary"
                      onClick={() => start(row)}
                    >
                      {msg("edit")}
                    </button>
                    {!resource.singleton && (
                      <button
                        className="button-danger"
                        disabled={busy}
                        onClick={async () => {
                          if (!window.confirm(msg("confirmDelete"))) return;
                          setBusy(true);
                          setError("");
                          try {
                            await api(
                              `/api/admin/${name}`,
                              { key: row.key },
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
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!displayed.length && (
          <p className="p-8 text-[#9a9285]">{msg("empty")}</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-[#9a9285]">
          {filtered.length} {msg("records")}
        </span>
        <div className="flex gap-3">
          <button
            className="button-secondary"
            disabled={page <= 0}
            onClick={() => setPage(page - 1)}
          >
            ←
          </button>
          <span>
            {page + 1} / {Math.max(1, totalPages)}
          </span>
          <button
            className="button-secondary"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            →
          </button>
        </div>
      </div>
      {editing && (
        <div className="dialog-backdrop">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-title"
            className="surface dialog-panel"
          >
            <h2 id="edit-title" className="text-2xl font-bold">
              {msg(originalKey ? "edit" : "create")} ·{" "}
              {locale === "ar" ? resource.ar : resource.title}
            </h2>
            <form
              className="mt-6"
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(true);
                setError("");
                setDetails([]);
                try {
                  const data = { ...editing };
                  for (const field of resource.fields)
                    if (field.type === "lines")
                      data[field.key] = (data[field.key] as string[]).filter(
                        (line) => line.trim(),
                      );
                  await api(`/api/admin/${name}`, { data, originalKey });
                  await reload();
                  setEditing(null);
                  setSaved(true);
                } catch (e) {
                  setError((e as Error).message);
                  setDetails(
                    (
                      (e as Error & { details?: { path: string }[] }).details ||
                      []
                    ).map((d) => d.path),
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              <div className="grid md:grid-cols-2 gap-5">
                {resource.fields.map((field) => (
                  <label
                    key={field.key}
                    className={
                      field.type === "textarea" || field.type === "lines"
                        ? "md:col-span-2"
                        : ""
                    }
                    htmlFor={`field-${field.key}`}
                  >
                    <span className="block text-sm mb-2">
                      {locale === "ar" ? field.ar : field.label}
                      {field.required ? " *" : ""}
                    </span>
                    {fieldInput(field)}
                  </label>
                ))}
              </div>
              {error && (
                <p role="alert" className="notice-error mt-5">
                  {msg(error)}{" "}
                  {details
                    .map((key) => resource.fields.find((f) => f.key === key))
                    .filter(Boolean)
                    .map((f) => (locale === "ar" ? f!.ar : f!.label))
                    .join(" · ")}
                </p>
              )}
              <div className="sticky bottom-0 bg-[#131410] flex gap-3 pt-6 pb-2 mt-6">
                <button className="button-primary" disabled={busy}>
                  {msg(busy ? "loading" : "save")}
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  disabled={busy}
                  onClick={() => setEditing(null)}
                >
                  {msg("cancel")}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
