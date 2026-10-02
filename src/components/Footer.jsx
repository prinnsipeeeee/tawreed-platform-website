"use client";
import { useLanding } from "./landing-context";
export default function Footer() {
  const { t, links, records, divisions } = useLanding();
  return (
    <footer
      id="footer"
      className="bg-[#0b0c0a] text-[#9a9285] border-t border-[#f4efe3]/10 pt-16 pb-12 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#f4efe3]/10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="brand-mark">{t("footer.text.001")}</span>
              <div>
                <strong className="text-xl text-[#f4efe3]">
                  {t("footer.text.002")}
                </strong>
                <p className="text-xs text-[#d9a441]">{t("footer.text.003")}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              {t("footer.text.004")}
            </p>
            <p className="text-xs text-[#2f8464]">
              {t("footer.text.005")} · {t("footer.text.006")}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#f4efe3] mb-3">
              {t("footer.text.007")}
            </h3>
            <ul className="space-y-2 text-xs">
              {links("footerLink").map((l) => (
                <li key={l.key}>
                  <a href={l.href} className="hover:text-[#d9a441]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#f4efe3] mb-3">
              {t("footer.text.014")}
            </h3>
            <ul className="space-y-2 text-xs">
              {divisions.map((d) => (
                <li key={d.key}>{d.title}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#f4efe3] mb-3">
              {t("footer.text.020")}
            </h3>
            <ul className="space-y-2 text-xs">
              {records("coverage").map((c) => (
                <li key={c.key}>📍 {c.label}</li>
              ))}
            </ul>
            <p className="text-xs text-[#d9a441] mt-3">
              {t("footer.text.027")}
            </p>
          </div>
        </div>
        <div className="pt-8 flex flex-wrap gap-3 justify-between text-xs">
          <p>
            © {new Date().getFullYear()} {t("footer.text.029")}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[#d9a441]"
          >
            {t("footer.text.030")} ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
