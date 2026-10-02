"use client";

import { useLanding } from "./landing-context";
import React, { useState } from "react";
export default function Model() {
  const { t, locale, settings, tiers } = useLanding();
  const [dealSize, setDealSize] = useState(settings.dealSize); // in SAR
  const [winRate, setWinRate] = useState(settings.winRate); // 25% win rate (1 in 4)

  // Calculate Lead Acquisition Cost
  const leadFee =
    [...tiers].reverse().find((tier) => dealSize * 100 >= tier.minimumHalalas)
      ?.feeHalalas / 100 || 0;
  const leadsNeededToWin = Math.ceil(100 / winRate);
  const totalLeadCost = leadsNeededToWin * leadFee;
  const effectiveCAC = ((totalLeadCost / dealSize) * 100).toFixed(1);

  return (
    <section
      id="model"
      className="py-24 px-6 bg-[#131410] relative border-t border-[#f4efe3]/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold text-[#d9a441] tracking-widest uppercase mb-3 px-3 py-1 bg-[#1a1d17] border border-[#d9a441]/30 rounded-sm">
            {t("model.text.001")}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f4efe3] tracking-tight">
            {t("model.text.002")}
          </h2>
          <p className="mt-4 text-[#9a9285] text-base sm:text-lg leading-relaxed">
            {t("model.text.003")}
          </p>
        </div>

        {/* ================= HERO HIGHLIGHT: THE CORE MECHANIC ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Left: Visual Gold Box */}
          <div className="lg:col-span-5 bg-linear-to-br from-[#1a170d] to-[#0e0c06] border border-[#d9a441]/40 p-8 sm:p-10 rounded-xs relative">
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#d9a441]" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#d9a441]" />

            <span className="text-xs font-mono font-bold text-[#d9a441] uppercase tracking-widest">
              {t("model.text.004")}
            </span>
            <div className="text-4xl sm:text-5xl font-black text-[#d9a441] mt-3 font-mono">
              {t("model.text.005")}
            </div>
            <p className="text-sm sm:text-base text-[#f4efe3] font-medium mt-4 leading-relaxed">
              {t("model.text.006")}
            </p>

            <div className="mt-6 pt-6 border-t border-[#d9a441]/20 space-y-2 text-xs text-[#9a9285]">
              <div className="flex items-center gap-2">
                <span className="text-[#2f8464] font-bold">
                  {t("model.text.007")}
                </span>
                <span>{t("model.text.008")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#2f8464] font-bold">
                  {t("model.text.009")}
                </span>
                <span>{t("model.text.010")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#2f8464] font-bold">
                  {t("model.text.011")}
                </span>
                <span>{t("model.text.012")}</span>
              </div>
            </div>
          </div>

          {/* Right: Why This Eliminates Platform Leakage */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#f4efe3]">
              {t("model.text.013")}
            </h3>
            <p className="text-sm sm:text-base text-[#9a9285] leading-relaxed">
              {t("model.text.014")}
            </p>
            <p className="text-sm sm:text-base text-[#9a9285] leading-relaxed">
              {t("model.text.015")}
              <strong className="text-[#d9a441]">{t("model.text.016")}</strong>
              {t("model.text.017")}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#0b0c0a] border border-[#f4efe3]/10">
                <span className="text-xl font-bold text-[#2f8464]">
                  {t("model.text.018")}
                </span>
                <p className="text-xs text-[#9a9285] mt-1">
                  {t("model.text.019")}
                </p>
              </div>
              <div className="p-4 bg-[#0b0c0a] border border-[#f4efe3]/10">
                <span className="text-xl font-bold text-[#d9a441]">
                  {t("model.text.020")}
                </span>
                <p className="text-xs text-[#9a9285] mt-1">
                  {t("model.text.021")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TIERED PRICING SCHEDULE ================= */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#d9a441] tracking-widest uppercase">
              {t("model.text.022")}
            </span>
            <h4 className="text-2xl font-bold text-[#f4efe3] mt-1">
              {t("model.text.023")}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-8 bg-[#0b0c0a] border border-[#f4efe3]/10 hover:border-[#d9a441]/60 transition-all rounded-xs flex flex-col justify-between group"
              >
                <div>
                  <span className="text-xs font-mono text-[#9a9285] uppercase tracking-wider block">
                    {tier.scope}
                  </span>
                  <h5 className="text-lg font-bold text-[#f4efe3] group-hover:text-[#d9a441] transition-colors mt-1">
                    {tier.name}
                  </h5>
                  <div className="text-3xl font-black font-mono text-[#d9a441] my-4">
                    {tier.fee}
                    <span className="text-xs font-sans font-normal text-[#9a9285] ml-1">
                      {t("model.text.024")}
                    </span>
                  </div>
                  <p className="text-xs text-[#9a9285] leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#f4efe3]/10 flex items-center justify-between text-xs text-[#2f8464] font-semibold">
                  <span>{t("model.text.025")}</span>
                  <span>{t("model.text.026")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= INTERACTIVE SUPPLIER ROI SIMULATOR ================= */}
        <div className="p-8 sm:p-10 bg-[#0b0c0a] border border-[#d9a441]/30 rounded-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d9a441]">
                {t("model.text.027")}
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-[#f4efe3] mt-1">
                {t("model.text.028")}
              </h4>
              <p className="text-xs sm:text-sm text-[#9a9285] mt-2 leading-relaxed">
                {t("model.text.029")}
              </p>

              {/* Deal Size Slider */}
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#f4efe3]">{t("model.text.030")}</span>
                  <span className="font-mono font-bold text-[#d9a441]">
                    {dealSize.toLocaleString(
                      locale === "ar" ? "ar-SA" : "en-SA",
                    )}
                    {t("model.text.031")}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={dealSize}
                  onChange={(e) => setDealSize(Number(e.target.value))}
                  className="w-full accent-[#d9a441] cursor-pointer"
                />
              </div>

              {/* Win Rate Slider */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#f4efe3]">{t("model.text.032")}</span>
                  <span className="font-mono font-bold text-[#2f8464]">
                    {winRate}
                    {t("model.text.033")}
                    {leadsNeededToWin}
                    {t("model.text.034")}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={winRate}
                  onChange={(e) => setWinRate(Number(e.target.value))}
                  className="w-full accent-[#2f8464] cursor-pointer"
                />
              </div>
            </div>

            {/* Right: The Math Results */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 bg-[#131410] p-6 border border-[#f4efe3]/10">
              <div className="p-4 bg-[#0b0c0a] border border-[#f4efe3]/5">
                <span className="text-[0.7rem] text-[#9a9285] uppercase block">
                  {t("model.text.035")}
                </span>
                <span className="text-2xl font-bold font-mono text-[#f4efe3] mt-1 block">
                  {totalLeadCost}
                  {t("model.text.036")}
                </span>
                <span className="text-[0.65rem] text-[#9a9285]">
                  {t("model.text.037")}
                </span>
              </div>

              <div className="p-4 bg-[#0b0c0a] border border-[#f4efe3]/5">
                <span className="text-[0.7rem] text-[#9a9285] uppercase block">
                  {t("model.text.038")}
                </span>
                <span className="text-2xl font-bold font-mono text-[#2f8464] mt-1 block">
                  {effectiveCAC}
                  {t("model.text.039")}
                </span>
                <span className="text-[0.65rem] text-[#9a9285]">
                  {t("model.text.040")}
                </span>
              </div>

              <div className="col-span-2 p-3 bg-[#10241c] border border-[#2f8464]/30 text-xs text-[#f4efe3]/90">
                {t("model.text.041")}
                <strong>{t("model.text.042")}</strong>
                {t("model.text.043")}
                <strong>
                  {totalLeadCost}
                  {t("model.text.044")}
                </strong>
                {t("model.text.045")}
                <strong>
                  {dealSize.toLocaleString(locale === "ar" ? "ar-SA" : "en-SA")}
                  {t("model.text.046")}
                </strong>
                {t("model.text.047")}
                <strong>
                  {(dealSize * 0.08).toLocaleString(
                    locale === "ar" ? "ar-SA" : "en-SA",
                  )}
                  {t("model.text.048")}
                </strong>
                {t("model.text.049")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
