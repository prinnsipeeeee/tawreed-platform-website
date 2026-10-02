"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin, api } from "./admin-context";
export function Login() {
  const { locale, toggle, msg } = useAdmin();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,rgba(217,164,65,0.12),transparent_65%)]">
      <div className="surface w-full max-w-md p-8 sm:p-10">
        <div className="flex items-center justify-between">
          <span className="brand-mark">T</span>
          <button type="button" onClick={toggle} className="button-secondary">
            {locale === "ar" ? "English" : "العربية"}
          </button>
        </div>
        <p className="eyebrow mt-8">{msg("privacy")}</p>
        <h1 className="text-3xl font-bold mt-2">{msg("signIn")}</h1>
        <form
          className="grid gap-5 mt-8"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            const data = new FormData(event.currentTarget);
            try {
              await api("/api/auth/login", Object.fromEntries(data));
              router.replace("/admin");
              router.refresh();
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            {msg("email")}
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              dir="ltr"
            />
          </label>
          <label>
            {msg("password")}
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={72}
              dir="ltr"
            />
          </label>
          {error && (
            <p role="alert" className="notice-error">
              {msg(error)}
            </p>
          )}
          <button className="button-primary py-3" disabled={busy}>
            {msg(busy ? "loading" : "signIn")}
          </button>
        </form>
      </div>
    </main>
  );
}
