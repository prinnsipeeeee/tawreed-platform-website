"use client";
import { useLanding } from "./landing-context";
export default function Closing() {
  const { t, links } = useLanding();
  return (
    <section
      id="closing"
      className="py-28 px-6 bg-linear-to-b from-[#131410] via-[#0b0c0a] to-black border-t border-[#f4efe3]/10"
    >
      <div className="max-w-5xl mx-auto text-center">
        <span className="text-xs text-[#d9a441] font-bold uppercase">
          {t("closing.text.001")}
        </span>
        <h2 className="text-3xl sm:text-5xl font-black mt-4">
          {t("closing.text.002")}
        </h2>
        <p className="text-[#9a9285] mt-5 max-w-3xl mx-auto">
          {t("closing.text.003")}
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-12 text-start">
          {links("closingCard").map((card) => (
            <article key={card.key} className="surface p-8">
              <span className="text-3xl">{card.icon}</span>
              <p className="text-xs text-[#d9a441] mt-4">{card.eyebrow}</p>
              <h3 className="text-xl font-bold mt-2">{card.title}</h3>
              <p className="text-sm text-[#9a9285] mt-4">{card.description}</p>
              <a href={card.href} className="button-primary inline-block mt-6">
                {card.label}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
