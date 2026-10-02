"use client";

import { useLanding } from "./landing-context";
import React, { useState } from "react";
export default function Scenes() {
  const { t, scenes } = useLanding();
  const [activeStep, setActiveStep] = useState(0);

  if (!scenes.length) return null;
  return (
    <section
      id="scenes"
      className="py-24 px-6 bg-[#131410] relative border-t border-[#f4efe3]/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold text-[#d9a441] tracking-widest uppercase mb-3 px-3 py-1 bg-[#10241c] border border-[#2f8464]/30 rounded-sm">
            {t("scenes.text.001")}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f4efe3] tracking-tight">
            {t("scenes.text.002")}
          </h2>
          <p className="mt-4 text-[#9a9285] text-base sm:text-lg leading-relaxed">
            {t("scenes.text.003")}
          </p>
        </div>

        {/* ================= TIMELINE STEPPER REEL ================= */}
        <div className="relative mb-14">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-7 left-[5%] right-[5%] h-px bg-linear-to-r from-[#f4efe3]/10 via-[#d9a441]/50 to-[#f4efe3]/10 z-0" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
            {scenes.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 text-center rounded-xs transition-all duration-300 flex flex-col items-center cursor-pointer border ${isActive ? "bg-[#1a1d17] border-[#d9a441] shadow-[0_0_20px_rgba(217,164,65,0.18)] -translate-y-1" : "bg-[#0e0f0c] border-[#f4efe3]/10 hover:border-[#f4efe3]/30 hover:bg-[#131410]"}`}
                >
                  {/* Circle Number */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-3 transition-all ${isActive ? "bg-[#d9a441] text-[#0b0c0a] scale-110 shadow-[0_0_15px_#d9a441]" : "bg-[#0b0c0a] text-[#d9a441] border border-[#d9a441]/40"}`}
                  >
                    {step.num}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-[#f4efe3] line-clamp-1">
                    {step.title}
                  </h4>
                  <p className="text-[0.7rem] text-[#9a9285] mt-1 line-clamp-2">
                    {step.shortDesc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= EXPANDED SCENE DETAILS MODAL/CARD ================= */}
        <div className="relative p-8 md:p-12 bg-linear-to-br from-[#161814] to-[#0c0d0a] border border-[#d9a441]/30">
          {/* Corner Brackets */}
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#d9a441]" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#d9a441]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Deep Dive Text */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#d9a441] px-2.5 py-1 bg-[#d9a441]/10 border border-[#d9a441]/30">
                  {scenes[activeStep].badge}
                </span>
                <span className="text-xs text-[#9a9285]">
                  {t("scenes.text.004")}
                  {activeStep + 1}
                  {t("scenes.text.005")}
                  {scenes.length}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#f4efe3]">
                {scenes[activeStep].detailTitle}
              </h3>
              <p className="text-xs text-[#d9a441] font-arabic mt-1">
                {scenes[activeStep].arabicTitle}
              </p>

              <p className="text-[#9a9285] text-sm sm:text-base mt-4 leading-relaxed">
                {scenes[activeStep].detailDesc}
              </p>

              {/* Specification Checklist */}
              <div className="mt-6 space-y-2.5">
                {scenes[activeStep].specs.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-xs sm:text-sm text-[#f4efe3]/90"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#10241c] text-[#2f8464] border border-[#2f8464]/50 flex items-center justify-center font-bold text-[0.65rem] shrink-0">
                      {t("scenes.text.006")}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual Simulation Panel */}
            <div className="lg:col-span-5 bg-[#0b0c0a] p-6 border border-[#f4efe3]/10 relative">
              <div className="flex items-center justify-between border-b border-[#f4efe3]/10 pb-3 mb-4">
                <span className="text-xs font-mono text-[#9a9285]">
                  {t("scenes.text.007")}
                  {activeStep + 1}
                  {t("scenes.text.008")}
                </span>
                <span className="text-[0.65rem] font-bold text-[#2f8464] uppercase tracking-wider bg-[#10241c] px-2 py-0.5 border border-[#2f8464]/30">
                  {t("scenes.text.009")}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#131410] border-l-2 border-[#d9a441] text-[#f4efe3]/80">
                  <span className="text-[#d9a441] block text-[0.7rem] font-bold">
                    {t("scenes.text.010")}
                  </span>
                  {t("scenes.text.011")}
                  {scenes[activeStep].mockTag}
                  {t("scenes.text.012")}
                </div>
                <div className="p-3 bg-[#131410] border-l-2 border-[#2f8464] text-[#9a9285]">
                  <span className="text-[#2f8464] block text-[0.7rem] font-bold">
                    {t("scenes.text.013")}
                  </span>
                  {t("scenes.text.014")}
                </div>
                <div className="p-3 bg-[#131410] border-l-2 border-[#b56a3b] text-[#9a9285]">
                  <span className="text-[#b56a3b] block text-[0.7rem] font-bold">
                    {t("scenes.text.015")}
                  </span>
                  {t("scenes.text.016")}
                </div>
              </div>

              {/* Next Step Fast Button */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 text-xs text-[#9a9285] hover:text-[#f4efe3] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {t("scenes.text.017")}
                </button>
                <button
                  disabled={activeStep === scenes.length - 1}
                  onClick={() =>
                    setActiveStep((prev) =>
                      Math.min(scenes.length - 1, prev + 1),
                    )
                  }
                  className="px-4 py-1.5 text-xs font-bold text-[#0b0c0a] bg-[#d9a441] hover:bg-[#e8b559] disabled:opacity-30 disabled:cursor-not-allowed rounded-xs"
                >
                  {t("scenes.text.018")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= STATS FOOTER ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
          <div className="p-6 bg-[#0b0c0a] border border-[#f4efe3]/10">
            <span className="text-3xl font-extrabold text-[#d9a441]">
              {t("scenes.text.019")}
            </span>
            <p className="text-xs text-[#9a9285] mt-1">
              {t("scenes.text.020")}
            </p>
          </div>
          <div className="p-6 bg-[#0b0c0a] border border-[#f4efe3]/10">
            <span className="text-3xl font-extrabold text-[#2f8464]">
              {t("scenes.text.021")}
            </span>
            <p className="text-xs text-[#9a9285] mt-1">
              {t("scenes.text.022")}
            </p>
          </div>
          <div className="p-6 bg-[#0b0c0a] border border-[#f4efe3]/10">
            <span className="text-3xl font-extrabold text-[#f4efe3]">
              {t("scenes.text.023")}
            </span>
            <p className="text-xs text-[#9a9285] mt-1">
              {t("scenes.text.024")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
