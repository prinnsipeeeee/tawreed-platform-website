"use client";
import { useState, useEffect } from "react";
import { useLanding } from "./landing-context";
export default function Navbar() {
  const { t, locale, links } = useLanding();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const listener = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  }, []);
  const toggle = () =>
    window.location.assign(
      `/${locale === "ar" ? "en" : "ar"}${window.location.hash}`,
    );
  const nav = links("nav");
  return (
    <header
      id="navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "bg-[#0b0c0a]/95 backdrop-blur-md border-b border-[#f4efe3]/10 py-3" : "bg-[#0b0c0a]/75 py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4 items-center justify-between">
        <a
          href={nav[0]?.href || `/${locale}`}
          className="flex items-center gap-3"
        >
          <span className="brand-mark">{t("navbar.text.001")}</span>
          <span>
            <strong className="block text-xl">{t("navbar.text.002")}</strong>
            <span className="text-xs text-[#d9a441]">
              {t("navbar.text.003")}
            </span>
          </span>
        </a>
        <nav
          aria-label={locale === "ar" ? "التنقل" : "Navigation"}
          className="hidden lg:flex flex-wrap gap-5 text-sm text-[#9a9285]"
        >
          {nav.map((link) => (
            <a key={link.key} href={link.href} className="hover:text-[#d9a441]">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className="button-secondary"
            aria-label={t("navbar.text.010")}
          >
            {locale === "ar" ? "English" : "العربية"}
          </button>
          <button
            type="button"
            className="lg:hidden button-secondary"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={locale === "ar" ? "القائمة" : "Menu"}
          >
            ☰
          </button>
        </div>
        {open && (
          <nav className="lg:hidden basis-full grid gap-3 text-sm">
            {nav.map((link) => (
              <a key={link.key} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
