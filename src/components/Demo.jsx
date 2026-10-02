"use client";

import { useLanding } from "./landing-context";
import { totals, feeFor } from "../lib/pricing";
import React, { useState, useEffect, useRef } from "react";
export default function Demo() {
  const {
    t,
    locale,
    settings,
    categories,
    cities,
    catalogData,
    supplierOptions,
    clientName,
    tiers,
    money,
  } = useLanding();
  const [supplierKey, setSupplierKey] = useState(supplierOptions[0]?.key || "");
  const supplier =
    supplierOptions.find((s) => s.key === supplierKey)?.name ||
    t("demo.noSupplier");
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0]?.id || "",
  );
  const [selectedCity, setSelectedCity] = useState(cities[0]?.name || "");
  const [selectedItems, setSelectedItems] = useState({});
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const [simStep, setSimStep] = useState(0); // 0: Idle, 1: Sent, 2: Matched, 3: Quote Ready, 4: Unlocked
  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Categories and their supplier catalogs

  const currentItems = (catalogData[selectedCategory] || []).filter(
    (item) => item.supplierKey === supplierKey,
  );

  // Toggle item selection
  const handleItemToggle = (item) => {
    setSelectedItems((prev) => {
      const copy = {
        ...prev,
      };
      if (copy[item.id]) {
        delete copy[item.id];
      } else {
        copy[item.id] = {
          ...item,
          qty: 1,
        };
      }
      return copy;
    });
    setErrorMsg("");
  };

  // Change quantity
  const handleQtyChange = (itemId, delta) => {
    setSelectedItems((prev) => {
      if (!prev[itemId]) return prev;
      const newQty = Math.min(100000, Math.max(1, prev[itemId].qty + delta));
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          qty: newQty,
        },
      };
    });
  };

  // Calculate Subtotal, VAT, and Total
  const selectedList = Object.values(selectedItems);
  const amounts = totals(selectedList, settings.vatBasisPoints);
  const subtotal = amounts.subtotal / 100;
  const vat = amounts.vat / 100;
  const grandTotal = amounts.total / 100;

  // Run the Simulation
  const handleRunSimulation = () => {
    if (selectedList.length === 0) {
      setErrorMsg(
        locale === "ar"
          ? "اختر عنصراً واحداً على الأقل."
          : "Please select at least one item.",
      );
      return;
    }
    setErrorMsg("");

    setSimStep(1);

    // Sequence timing for realistic cinematic feel
    timers.current.push(
      setTimeout(() => {
        setSimStep(2); // Matching
      }, 700),
    );
    timers.current.push(
      setTimeout(() => {
        setSimStep(3); // Quote ready
      }, 1800),
    );
  };

  // Reset simulation
  const handleReset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSimStep(0);

    setSelectedItems({});
    setContactUnlocked(false);
    setErrorMsg("");
  };

  // Unique quote number based on date
  const quoteNumber = `DEMO-${Math.floor(1000 + (subtotal % 8999))}`;
  return (
    <section id="demo" className="py-24 px-6 bg-[#0b0c0a] relative">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold text-[#d9a441] tracking-widest uppercase mb-3 px-3 py-1 bg-[#131410] border border-[#d9a441]/30 rounded-sm">
            {t("demo.text.001")}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f4efe3] tracking-tight">
            {t("demo.text.002")}
          </h2>
          <p className="mt-4 text-[#9a9285] text-base sm:text-lg leading-relaxed">
            {t("demo.text.003")}
          </p>
        </div>

        {/* ================= SPACIOUS TWO-COLUMN WORKBENCH ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: SCOPE CONFIGURATOR (Spacious & Clean) */}
          <div className="lg:col-span-6 bg-[#131410] border border-[#f4efe3]/10 p-8 sm:p-10 rounded-xs relative">
            {/* Corner Bracket */}
            <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-[#d9a441]" />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-[#d9a441]" />

            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#f4efe3]/10">
              <div>
                <h3 className="text-xl font-bold text-[#f4efe3]">
                  {t("demo.text.004")}
                </h3>
                <p className="text-xs text-[#9a9285] mt-0.5">
                  {t("demo.text.005")}
                </p>
              </div>
              <span className="text-xs text-[#2f8464] bg-[#10241c] px-3 py-1 border border-[#2f8464]/30 font-semibold">
                {t("demo.text.006")}
              </span>
            </div>

            <label className="block text-xs text-[#d9a441] mb-6">
              {t("demo.supplierLabel")}
              <select
                aria-label={t("demo.supplierLabel")}
                disabled={simStep > 0}
                className="block w-full mt-2 p-3 border border-[#f4efe3]/20 bg-[#0b0c0a] text-[#f4efe3]"
                value={supplierKey}
                onChange={(event) => {
                  setSupplierKey(event.target.value);
                  setSelectedItems({});
                }}
              >
                {supplierOptions.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            {/* STEP A: CATEGORY SELECTOR */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-[#d9a441] tracking-wider uppercase mb-3">
                {t("demo.text.007")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      disabled={simStep > 0}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedItems({});
                      }}
                      className={`p-3.5 text-left rounded-xs border transition-all flex items-center gap-3 cursor-pointer ${isSelected ? "bg-[#1a1d17] border-[#d9a441] text-[#f4efe3] shadow-[0_0_15px_rgba(217,164,65,0.15)]" : "bg-[#0e0f0c] border-[#f4efe3]/10 text-[#9a9285] hover:border-[#f4efe3]/30 hover:text-[#f4efe3]"} ${simStep > 0 ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{cat.label}</div>
                        <div className="text-[0.65rem] text-[#9a9285]">
                          {cat.arabic}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP B: CITY SELECTOR */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-[#d9a441] tracking-wider uppercase mb-3">
                {t("demo.text.008")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {cities.map((city) => {
                  const isSelected = selectedCity === city.name;
                  return (
                    <button
                      key={city.name}
                      type="button"
                      disabled={simStep > 0}
                      onClick={() => setSelectedCity(city.name)}
                      className={`py-2.5 px-3 text-center rounded-xs border transition-all text-xs font-bold cursor-pointer ${isSelected ? "bg-[#d9a441] text-[#0b0c0a] border-[#d9a441]" : "bg-[#0e0f0c] border-[#f4efe3]/10 text-[#9a9285] hover:border-[#f4efe3]/30 hover:text-[#f4efe3]"} ${simStep > 0 ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {city.name}
                      <span className="block text-[0.65rem] opacity-75 font-normal">
                        {city.arabic}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP C: CATALOG ITEMS */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-[#d9a441] tracking-wider uppercase">
                  {t("demo.text.009")}
                  {supplier}
                </label>
                <span className="text-[0.7rem] text-[#9a9285]">
                  {t("demo.text.010")}
                </span>
              </div>

              <div className="space-y-3 max-h-90 overflow-y-auto pr-1">
                {currentItems.map((item) => {
                  const isChecked = !!selectedItems[item.id];
                  const qty = selectedItems[item.id]?.qty || 1;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xs border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${isChecked ? "bg-[#181a14] border-[#d9a441]/70" : "bg-[#0e0f0c] border-[#f4efe3]/10 hover:border-[#f4efe3]/20"}`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          disabled={simStep > 0}
                          checked={isChecked}
                          onChange={() => handleItemToggle(item)}
                          className="w-4 h-4 accent-[#d9a441] rounded-xs cursor-pointer"
                        />
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-[#f4efe3]">
                            {item.name}
                            <span className="block text-xs text-[#9a9285]">
                              {item.supplierName}
                            </span>
                          </div>
                          <div className="text-xs text-[#d9a441] font-mono mt-0.5">
                            {money(item.priceHalalas)}
                            <span className="text-[#9a9285] font-sans text-[0.7rem]">
                              {t("demo.text.012")}
                              {item.unit}
                            </span>
                          </div>
                        </div>
                      </label>

                      {/* Quantity Stepper */}
                      {isChecked && (
                        <div className="flex items-center gap-2 self-end sm:self-center bg-[#0b0c0a] p-1 border border-[#f4efe3]/10 rounded-xs">
                          <button
                            type="button"
                            disabled={simStep > 0 || qty <= 1}
                            onClick={() => handleQtyChange(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#f4efe3] hover:text-[#d9a441] disabled:opacity-30 cursor-pointer"
                          >
                            {t("demo.text.013")}
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold text-[#f4efe3]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            disabled={simStep > 0}
                            onClick={() => handleQtyChange(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#f4efe3] hover:text-[#d9a441] cursor-pointer"
                          >
                            {t("demo.text.014")}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ERROR MESSAGE IF ANY */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-800/50 text-red-300 text-xs rounded-xs">
                {errorMsg}
              </div>
            )}

            {/* LIVE TOTAL BAR */}
            <div className="p-4 bg-[#0b0c0a] border border-[#d9a441]/30 flex items-center justify-between mb-6">
              <div>
                <span className="text-xs text-[#9a9285] block">
                  {t("demo.text.015")}
                </span>
                <span className="text-xs text-[#2f8464]">
                  {selectedList.length}
                  {t("demo.text.016")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-[#d9a441]">
                  {subtotal.toLocaleString(
                    locale === "ar" ? "ar-SA" : "en-SA",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}{" "}
                  <span className="text-xs font-sans">
                    {t("demo.text.017")}
                  </span>
                </span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            {simStep === 0 ? (
              <button
                type="button"
                disabled={!supplierKey || !cities.length || !categories.length}
                onClick={handleRunSimulation}
                className="w-full py-4 text-sm font-bold text-[#0b0c0a] bg-[#d9a441] hover:bg-[#e8b559] transition-all transform hover:-translate-y-0.5 rounded-xs shadow-[0_4px_20px_rgba(217,164,65,0.25)] cursor-pointer"
              >
                {t("demo.text.018")}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 text-xs font-bold text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/20 hover:border-[#f4efe3]/40 rounded-xs cursor-pointer transition-all"
              >
                {t("demo.text.019")}
              </button>
            )}
          </div>

          {/* RIGHT COLUMN: SIMULATION THREAD & OFFICIAL QUOTE SHEET */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* SIMULATION THREAD BUBBLES */}
            {simStep >= 1 && (
              <div className="bg-[#131410] border border-[#f4efe3]/10 p-6 rounded-xs space-y-4">
                {/* 1. Client Bubble */}
                <div className="p-4 bg-[#1a1d17] border border-[#d9a441]/30 rounded-xs">
                  <div className="text-[0.7rem] text-[#d9a441] font-semibold mb-1 flex items-center justify-between">
                    <span>
                      {clientName}
                      {t("demo.text.020")}
                      {selectedCategory}
                    </span>
                    <span>
                      {t("demo.text.021")}
                      {selectedCity}
                    </span>
                  </div>
                  <div className="text-xs text-[#f4efe3]/90 space-y-1 mt-2">
                    {selectedList.map((it) => (
                      <div
                        key={it.id}
                        className="flex justify-between font-mono"
                      >
                        <span>
                          {t("demo.text.022")}
                          {it.name}
                          {t("demo.text.023")}
                          {it.qty}
                        </span>
                        <span>
                          {(it.price * it.qty).toLocaleString(
                            locale === "ar" ? "ar-SA" : "en-SA",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                          {t("demo.text.024")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. System Matching Indicator */}
                {simStep >= 2 && (
                  <div className="text-center py-2 text-xs text-[#9a9285] flex items-center justify-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#2f8464] animate-ping" />
                    <span>
                      {t("demo.text.025")}
                      {supplier}
                      {t("demo.text.026")}
                    </span>
                  </div>
                )}

                {/* 3. Supplier Response Badge */}
                {simStep >= 3 && (
                  <div className="p-4 bg-[#10241c] border border-[#2f8464]/40 rounded-xs">
                    <div className="text-[0.7rem] text-[#2f8464] font-bold flex items-center justify-between">
                      <span>
                        {t("demo.text.027")}
                        {supplier}
                        {t("demo.text.028")}
                      </span>
                      <span>{t("demo.text.029")}</span>
                    </div>
                    <p className="text-xs text-[#f4efe3] mt-1.5 leading-relaxed">
                      {t("demo.text.030")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* THE LUXURY OFFICIAL QUOTE DOCUMENT (Appears on Step 3) */}
            {simStep >= 3 ? (
              <div
                data-quote-sheet
                className="bg-[#f4efe3] text-[#131410] p-8 rounded-xs shadow-2xl relative border-t-4 border-[#d9a441]"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#131410] pb-4 mb-6 gap-3">
                  <div>
                    <h4 className="text-xl font-black tracking-tight">
                      {supplier}
                    </h4>
                    <p className="text-xs text-[#6b6255] font-medium mt-0.5">
                      {selectedCategory}
                      {t("demo.text.031")}
                      {selectedCity}
                      {t("demo.text.032")}
                    </p>
                  </div>
                  <div className="self-start sm:self-auto px-3 py-1 bg-[#131410] text-[#f4efe3] text-xs font-bold uppercase tracking-wider">
                    {t("demo.text.033")}
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-[#d8d0bd] pb-4 mb-4 text-[#4a4436]">
                  <div>
                    <span className="block text-[0.65rem] text-[#8c8273] uppercase">
                      {t("demo.text.034")}
                    </span>
                    <span className="font-bold">{clientName}</span>
                  </div>
                  <div>
                    <span className="block text-[0.65rem] text-[#8c8273] uppercase">
                      {t("demo.text.035")}
                    </span>
                    <span className="font-mono font-bold">{quoteNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[0.65rem] text-[#8c8273] uppercase">
                      {t("demo.text.036")}
                    </span>
                    <span className="font-medium">
                      {new Intl.DateTimeFormat(
                        locale === "ar" ? "ar-SA" : "en-SA",
                      ).format(new Date())}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[0.65rem] text-[#8c8273] uppercase">
                      {t("demo.text.038")}
                    </span>
                    <span className="text-[#7a4526] font-bold">
                      {t("demo.text.039")}
                    </span>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#d8d0bd] text-[#6b6255]">
                        <th className="py-2 pr-2">{t("demo.text.040")}</th>
                        <th className="py-2 text-center">
                          {t("demo.text.041")}
                        </th>
                        <th className="py-2 text-right">
                          {t("demo.text.042")}
                        </th>
                        <th className="py-2 text-right pl-2">
                          {t("demo.text.043")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e6e0d1]">
                      {selectedList.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2.5 pr-2 font-medium">
                            {item.name}
                          </td>
                          <td className="py-2.5 text-center font-mono">
                            {item.qty}
                          </td>
                          <td className="py-2.5 text-right font-mono">
                            {money(item.priceHalalas)}
                          </td>
                          <td className="py-2.5 text-right pl-2 font-mono font-bold">
                            {(item.price * item.qty).toLocaleString(
                              locale === "ar" ? "ar-SA" : "en-SA",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                            {t("demo.text.045")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Totals */}
                <div className="border-t border-[#d8d0bd] pt-3 flex flex-col items-end text-xs space-y-1.5">
                  <div className="flex justify-between w-64 text-[#6b6255]">
                    <span>{t("demo.text.046")}</span>
                    <span className="font-mono font-bold">
                      {subtotal.toLocaleString(
                        locale === "ar" ? "ar-SA" : "en-SA",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                      )}
                      {t("demo.text.047")}
                    </span>
                  </div>
                  <div className="flex justify-between w-64 text-[#6b6255]">
                    <span>
                      {t("demo.text.048")} ({settings.vatBasisPoints / 100}%)
                    </span>
                    <span className="font-mono font-bold">
                      {vat.toLocaleString(locale === "ar" ? "ar-SA" : "en-SA", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      {t("demo.text.049")}
                    </span>
                  </div>
                  <div className="flex justify-between w-64 text-sm font-black text-[#131410] border-t-2 border-[#131410] pt-2">
                    <span>{t("demo.text.050")}</span>
                    <span className="font-mono text-base">
                      {grandTotal.toLocaleString(
                        locale === "ar" ? "ar-SA" : "en-SA",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                      )}
                      {t("demo.text.051")}
                    </span>
                  </div>
                </div>

                {/* Disclaimer & Print Action */}
                <div className="mt-6 pt-4 border-t border-dashed border-[#c9c0aa] text-[0.7rem] text-[#6b6255] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <p className="max-w-md">{t("demo.text.052")}</p>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#131410] hover:bg-[#252820] text-[#f4efe3] font-bold text-xs rounded-xs transition-colors cursor-pointer shrink-0"
                  >
                    {t("demo.text.053")}
                  </button>
                </div>

                {/* OPPORTUNITY / LEAD FEE UNLOCK CONTAINER */}
                <div className="mt-8 p-5 bg-[#131410] text-[#f4efe3] rounded-xs border border-[#d9a441]/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[0.7rem] text-[#d9a441] uppercase tracking-wider font-bold block">
                        {t("demo.text.054")}
                      </span>
                      <h5 className="text-sm font-bold mt-0.5">
                        {contactUnlocked
                          ? "Direct Connection Established"
                          : "Lock In Schedule & Execution"}
                      </h5>
                    </div>
                    <span className="text-xs text-[#2f8464] font-mono">
                      {t("demo.text.055")}:{" "}
                      {money(feeFor(amounts.subtotal, tiers))}
                    </span>
                  </div>

                  {!contactUnlocked ? (
                    <div className="mt-3">
                      <p className="text-xs text-[#9a9285] mb-3">
                        {t("demo.text.056")}
                      </p>
                      <button
                        type="button"
                        onClick={() => setContactUnlocked(true)}
                        className="w-full py-2.5 text-xs font-bold text-[#0b0c0a] bg-[#d9a441] hover:bg-[#e8b559] rounded-xs transition-colors cursor-pointer"
                      >
                        {t("demo.text.057")}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-[#10241c] border border-[#2f8464]/50 rounded-xs text-xs space-y-1">
                      <div className="text-[#2f8464] font-bold">
                        {t("demo.text.058")}
                      </div>
                      <div className="text-[#f4efe3]">
                        {t("demo.text.059")}
                        <span className="font-mono text-[#d9a441]">
                          {t("demo.text.060")}
                        </span>
                      </div>
                      <div className="text-[#f4efe3]">
                        {t("demo.text.061")}
                        <span className="font-mono text-[#d9a441]">
                          {t("demo.text.062")}
                        </span>
                        {t("demo.text.063")}
                      </div>
                    </div>
                  )}
                </div>
              </div> /* Placeholder state when not yet submitted */
            ) : (
              <div className="h-full min-h-120 bg-[#131410] border border-dashed border-[#f4efe3]/15 rounded-xs flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#1a1d17] border border-[#d9a441]/30 flex items-center justify-center text-2xl mb-4 text-[#d9a441]">
                  {t("demo.text.064")}
                </div>
                <h4 className="text-lg font-bold text-[#f4efe3]">
                  {t("demo.text.065")}
                </h4>
                <p className="text-xs text-[#9a9285] max-w-sm mt-2 leading-relaxed">
                  {t("demo.text.066")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
