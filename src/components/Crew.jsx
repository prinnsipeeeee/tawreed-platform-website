"use client";

import { useLanding } from "./landing-context";
import React, { useState } from "react";
export default function Crew() {
  const { t, participants } = useLanding();
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? participants
      : participants.filter((p) => p.type === activeTab);
  return (
    <section id="crew" className="py-24 px-6 bg-[#0b0c0a] relative">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADLINE */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold text-[#d9a441] tracking-widest uppercase mb-3 px-3 py-1 bg-[#131410] border border-[#d9a441]/30 rounded-sm">
            {t("crew.text.001")}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f4efe3] tracking-tight">
            {t("crew.text.002")}
          </h2>
          <p className="mt-4 text-[#9a9285] text-base sm:text-lg leading-relaxed">
            {t("crew.text.003")}
          </p>

          {/* TOGGLE TABS */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-xs cursor-pointer ${activeTab === "all" ? "bg-[#d9a441] text-[#0b0c0a]" : "bg-[#131410] text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/10"}`}
            >
              {t("crew.text.004")}
              {participants.length}
              {t("crew.text.005")}
            </button>
            <button
              onClick={() => setActiveTab("supplier")}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-xs cursor-pointer ${activeTab === "supplier" ? "bg-[#d9a441] text-[#0b0c0a]" : "bg-[#131410] text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/10"}`}
            >
              {t("crew.text.006")}
            </button>
            <button
              onClick={() => setActiveTab("client")}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-xs cursor-pointer ${activeTab === "client" ? "bg-[#d9a441] text-[#0b0c0a]" : "bg-[#131410] text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/10"}`}
            >
              {t("crew.text.007")}
            </button>
          </div>
        </div>

        {/* PARTICIPANT CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 bg-linear-to-b from-[#131410] to-[#0e0f0c] border border-[#f4efe3]/10 hover:border-[#d9a441]/50 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Corner Bracket */}
              <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-[#d9a441]/40 group-hover:border-[#d9a441] transition-colors" />
              <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-[#d9a441]/40 group-hover:border-[#d9a441] transition-colors" />

              <div>
                {/* Avatar Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#d9a441]/10 border border-[#d9a441]/40 flex items-center justify-center text-[#d9a441] font-bold text-lg">
                    {item.avatarText}
                  </div>
                  <span
                    className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 border ${item.type === "supplier" ? "bg-[#10241c] text-[#2f8464] border-[#2f8464]/40" : "bg-[#7a4526]/20 text-[#b56a3b] border-[#b56a3b]/40"}`}
                  >
                    {item.type === "supplier" ? "Supplier" : "Client / Buyer"}
                  </span>
                </div>

                {/* Name and Arabic translation */}
                <h4 className="text-base font-bold text-[#f4efe3] group-hover:text-[#d9a441] transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-[#9a9285] font-arabic mt-0.5 mb-2">
                  {item.arabicName}
                </p>

                {/* CR & Location */}
                <div className="text-xs text-[#9a9285] flex flex-col gap-1 my-3 pb-3 border-b border-[#f4efe3]/10">
                  <span className="flex items-center gap-1.5 text-[#f4efe3]/70">
                    <span>{t("crew.text.008")}</span> {item.city}
                  </span>
                  <span className="font-mono text-[0.7rem] text-[#9a9285]">
                    {item.crNumber}
                  </span>
                </div>

                {/* Performance stats */}
                <div className="grid grid-cols-2 gap-2 text-xs my-2">
                  <div className="bg-[#0b0c0a] p-2 border border-[#f4efe3]/5">
                    <span className="text-[0.65rem] text-[#9a9285] block">
                      {t("crew.text.009")}
                    </span>
                    <span className="font-semibold text-[#f4efe3]">
                      {item.projectsDone}
                    </span>
                  </div>
                  <div className="bg-[#0b0c0a] p-2 border border-[#f4efe3]/5">
                    <span className="text-[0.65rem] text-[#9a9285] block">
                      {t("crew.text.010")}
                    </span>
                    <span className="font-semibold text-[#d9a441]">
                      {item.quoteTurnaround}
                    </span>
                  </div>
                </div>

                {/* Specialty */}
                <p className="text-xs text-[#9a9285] mt-3 line-clamp-2">
                  <strong className="text-[#f4efe3]/70 font-medium">
                    {t("crew.text.011")}
                  </strong>
                  {item.specialty}
                </p>
              </div>

              {/* Verified Ribbon Bottom */}
              <div className="mt-6 pt-3 border-t border-[#f4efe3]/10 flex items-center justify-between text-xs">
                <span className="text-[#2f8464] font-bold flex items-center gap-1">
                  <span>{item.isVerified ? t("crew.text.012") : "○"}</span>
                  {item.isVerified
                    ? t("crew.text.013")
                    : t("crew.verificationPending")}
                </span>
                <span className="text-[0.7rem] text-[#d9a441] font-mono font-bold">
                  {t("crew.text.014")}
                  {item.rating}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PLATFORM COMPLIANCE & VETTING STRIP ================= */}
        <div className="mt-16 p-8 bg-[#131410] border border-[#f4efe3]/10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#d9a441] tracking-widest uppercase">
              {t("crew.text.015")}
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-[#f4efe3] mt-1">
              {t("crew.text.016")}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10241c] text-[#2f8464] border border-[#2f8464]/30 flex items-center justify-center font-bold text-sm shrink-0">
                {t("crew.text.017")}
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#f4efe3]">
                  {t("crew.text.018")}
                </h5>
                <p className="text-xs text-[#9a9285] mt-1">
                  {t("crew.text.019")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10241c] text-[#2f8464] border border-[#2f8464]/30 flex items-center justify-center font-bold text-sm shrink-0">
                {t("crew.text.020")}
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#f4efe3]">
                  {t("crew.text.021")}
                </h5>
                <p className="text-xs text-[#9a9285] mt-1">
                  {t("crew.text.022")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10241c] text-[#2f8464] border border-[#2f8464]/30 flex items-center justify-center font-bold text-sm shrink-0">
                {t("crew.text.023")}
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#f4efe3]">
                  {t("crew.text.024")}
                </h5>
                <p className="text-xs text-[#9a9285] mt-1">
                  {t("crew.text.025")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10241c] text-[#2f8464] border border-[#2f8464]/30 flex items-center justify-center font-bold text-sm shrink-0">
                {t("crew.text.026")}
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#f4efe3]">
                  {t("crew.text.027")}
                </h5>
                <p className="text-xs text-[#9a9285] mt-1">
                  {t("crew.text.028")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
