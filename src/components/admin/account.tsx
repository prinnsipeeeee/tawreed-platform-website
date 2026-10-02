"use client";
import { useState } from "react";
import { useAdmin, api } from "./admin-context";
export function Account() {
  const { msg } = useAdmin();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <p className="eyebrow">{msg("admin")}</p>
      <h1 className="text-3xl font-bold mt-2">{msg("account")}</h1>
      <form
        className="surface p-6 mt-7 grid gap-5 max-w-xl"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          setBusy(true);
          setError("");
          setSaved(false);
          try {
            await api(
              "/api/auth/password",
              Object.fromEntries(new FormData(form)),
            );
            setSaved(true);
            form.reset();
          } catch (error) {
            setError((error as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          {msg("oldPassword")}
          <input
            name="oldPassword"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <label>
          {msg("newPassword")}
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={72}
            required
          />
        </label>
        {error && (
          <p role="alert" className="notice-error">
            {msg(error)}
          </p>
        )}
        {saved && (
          <p role="status" className="notice-success">
            {msg("saved")}
          </p>
        )}
        <button className="button-primary justify-self-start" disabled={busy}>
          {msg(busy ? "loading" : "changePassword")}
        </button>
      </form>
    </>
  );
}
