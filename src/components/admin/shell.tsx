"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin, api } from "./admin-context";
import { resources } from "@/lib/resources";
import { useState } from "react";
export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const { locale, toggle, msg } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const links = [
    { href: "/admin", label: msg("dashboard") },
    ...Object.entries(resources).map(([key, r]) => ({
      href: `/admin/manage/${key}`,
      label: locale === "ar" ? r.ar : r.title,
    })),
    { href: "/admin/imports", label: msg("imports") },
    { href: "/admin/documents", label: msg("documents") },
    { href: "/admin/account", label: msg("account") },
  ];
  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
        <Link href="/admin" className="flex items-center gap-3 pb-7">
          <span className="brand-mark">T</span>
          <span>
            <strong className="block text-lg">
              {locale === "ar" ? "منصّة توريد" : "Tawreed"}
            </strong>
            <span className="text-xs text-[#d9a441]">{msg("admin")}</span>
          </span>
        </Link>
        <nav className="grid gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`admin-nav ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-[#9a9285] mt-8">{msg("privacy")}</p>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="button-secondary lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            ☰
          </button>
          <span
            className="text-xs sm:text-sm text-[#9a9285] truncate"
            dir="ltr"
          >
            {email}
          </span>
          <div className="flex flex-wrap gap-2">
            <Link href={`/${locale}`} className="button-secondary">
              {msg("landing")}
            </Link>
            <button onClick={toggle} className="button-secondary">
              {locale === "ar" ? "English" : "العربية"}
            </button>
            <button
              className="button-secondary"
              onClick={async () => {
                try {
                  await api("/api/auth/logout", {});
                  router.replace("/admin/login");
                  router.refresh();
                } catch (e) {
                  setError((e as Error).message);
                }
              }}
            >
              {msg("logout")}
            </button>
          </div>
        </header>
        <main className="admin-content">
          {error && (
            <p role="alert" className="notice-error">
              {msg(error)}
            </p>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
