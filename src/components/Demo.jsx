import React, { useState, useId } from 'react';

export default function Demo() {
  const [selectedCategory, setSelectedCategory] = useState('General Contracting');
  const [selectedCity, setSelectedCity] = useState('Riyadh');
  const [selectedItems, setSelectedItems] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0); // 0: Idle, 1: Sent, 2: Matched, 3: Quote Ready, 4: Unlocked
  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supplier = 'Smartinbox Establishment';
  const clientName = 'Karam Al-Watan Co.';

  // Categories and their supplier catalogs
  const categories = [
    { id: 'General Contracting', label: 'General Contracting', icon: '🏗️', arabic: 'مقاولات عامة' },
    { id: 'Plumbing & Electrical', label: 'Plumbing & Electrical', icon: '⚡', arabic: 'كهرباء وسباكة' },
    { id: 'HVAC & Cooling', label: 'HVAC & Cooling', icon: '❄️', arabic: 'تكييف وتبريد' },
    { id: 'Interior & Decor', label: 'Interior & Decor', icon: '🎨', arabic: 'ديكور وتشطيبات' },
    { id: 'Waterproofing', label: 'Waterproofing & Insulation', icon: '🛡️', arabic: 'عزل مائي وحراري' },
  ];

  const cities = [
    { name: 'Riyadh', arabic: 'الرياض' },
    { name: 'Jeddah', arabic: 'جدة' },
    { name: 'Dammam', arabic: 'الدمام' },
    { name: 'Khobar', arabic: 'الخبر' },
  ];

  const catalogData = {
    'General Contracting': [
      { id: 'gc-1', name: 'Concrete Pouring & Casting (per m²)', price: 45, unit: 'm²' },
      { id: 'gc-2', name: 'Brickwork & Structural Masonry (per m²)', price: 60, unit: 'm²' },
      { id: 'gc-3', name: 'Skilled Construction Labor Crew (daily rate)', price: 180, unit: 'day' },
      { id: 'gc-4', name: 'Site Foundation Leveling & Compaction', price: 95, unit: 'm²' },
    ],
    'Plumbing & Electrical': [
      { id: 'pe-1', name: 'Electrical Outlet Point Layout & Wiring', price: 35, unit: 'point' },
      { id: 'pe-2', name: 'Piping & Master Water Lines (per meter)', price: 25, unit: 'meter' },
      { id: 'pe-3', name: 'Main Circuit Breaker Panel Installation', price: 120, unit: 'panel' },
      { id: 'pe-4', name: 'Bathroom Drainage & Trap Rough-in', price: 85, unit: 'set' },
    ],
    'HVAC & Cooling': [
      { id: 'hvac-1', name: 'Split Unit Routine Service & Cleaning', price: 120, unit: 'unit' },
      { id: 'hvac-2', name: 'High-Purity Freon Refrigerant Recharge', price: 150, unit: 'fill' },
      { id: 'hvac-3', name: 'Brand-New Split AC Unit Installation', price: 300, unit: 'unit' },
      { id: 'hvac-4', name: 'Centralized Duct Airflow Balancing', price: 250, unit: 'zone' },
    ],
    'Interior & Decor': [
      { id: 'id-1', name: 'Interior Wall Painting & Smoothing (per m²)', price: 15, unit: 'm²' },
      { id: 'id-2', name: 'Gypsum Board Suspended Ceiling (per m²)', price: 55, unit: 'm²' },
      { id: 'id-3', name: 'Architectural LED Concealed Spotlight Point', price: 90, unit: 'point' },
      { id: 'id-4', name: 'High-Traffic Epoxy Floor Coating (per m²)', price: 45, unit: 'm²' },
    ],
    'Waterproofing': [
      { id: 'wp-1', name: 'Bituminous Rooftop Waterproofing (per m²)', price: 35, unit: 'm²' },
      { id: 'wp-2', name: 'Rigid Thermal Polyurethane Insulation (per m²)', price: 40, unit: 'm²' },
      { id: 'wp-3', name: 'Acrylic Final Protective Topcoat (per m²)', price: 20, unit: 'm²' },
      { id: 'wp-4', name: 'Basement Underground Tanking Membrane', price: 65, unit: 'm²' },
    ],
  };

  const currentItems = catalogData[selectedCategory] || [];

  // Toggle item selection
  const handleItemToggle = (item) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (copy[item.id]) {
        delete copy[item.id];
      } else {
        copy[item.id] = { ...item, qty: 1 };
      }
      return copy;
    });
    setErrorMsg('');
  };

  // Change quantity
  const handleQtyChange = (itemId, delta) => {
    setSelectedItems((prev) => {
      if (!prev[itemId]) return prev;
      const newQty = Math.max(1, prev[itemId].qty + delta);
      return {
        ...prev,
        [itemId]: { ...prev[itemId], qty: newQty },
      };
    });
  };

  // Calculate Subtotal, VAT, and Total
  const selectedList = Object.values(selectedItems);
  const subtotal = selectedList.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const vat = Math.round(subtotal * 0.15 * 100) / 100;
  const grandTotal = Math.round((subtotal + vat) * 100) / 100;

  // Run the Simulation
  const handleRunSimulation = () => {
    if (selectedList.length === 0) {
      setErrorMsg('Please select at least one item from the catalog below.');
      return;
    }
    setErrorMsg('');
    setIsSimulating(true);
    setSimStep(1);

    // Sequence timing for realistic cinematic feel
    setTimeout(() => {
      setSimStep(2); // Matching
    }, 700);

    setTimeout(() => {
      setSimStep(3); // Quote ready
      setIsSimulating(false);
    }, 1800);
  };

  // Reset simulation
  const handleReset = () => {
    setSimStep(0);
    setIsSimulating(false);
    setSelectedItems({});
    setContactUnlocked(false);
    setErrorMsg('');
  };

  // Unique quote number based on date
  const quoteNumber = `Q-2026-${Math.floor(1000 + (subtotal % 8999))}`;

  return (
    <section id="demo" className="py-24 px-6 bg-[#0b0c0a] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold text-[#d9a441] tracking-widest uppercase mb-3 px-3 py-1 bg-[#131410] border border-[#d9a441]/30 rounded-sm">
            Act IV · Live Interactive Demo
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f4efe3] tracking-tight">
            Configure Your Scope & Generate an Instant Quote
          </h2>
          <p className="mt-4 text-[#9a9285] text-base sm:text-lg leading-relaxed">
            Prices are pulled live from certified supplier books. Select your parameters, inspect real-time unit rates, and experience the zero-wait quotation engine.
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
                <h3 className="text-xl font-bold text-[#f4efe3]">1. Request Builder</h3>
                <p className="text-xs text-[#9a9285] mt-0.5">Customize your specifications</p>
              </div>
              <span className="text-xs text-[#2f8464] bg-[#10241c] px-3 py-1 border border-[#2f8464]/30 font-semibold">
                Live Pricing Active
              </span>
            </div>

            {/* STEP A: CATEGORY SELECTOR */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-[#d9a441] tracking-wider uppercase mb-3">
                Step 1: Select Contracting Division
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
                      className={`p-3.5 text-left rounded-xs border transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1a1d17] border-[#d9a441] text-[#f4efe3] shadow-[0_0_15px_rgba(217,164,65,0.15)]'
                          : 'bg-[#0e0f0c] border-[#f4efe3]/10 text-[#9a9285] hover:border-[#f4efe3]/30 hover:text-[#f4efe3]'
                      } ${simStep > 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{cat.label}</div>
                        <div className="text-[0.65rem] text-[#9a9285]">{cat.arabic}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP B: CITY SELECTOR */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-[#d9a441] tracking-wider uppercase mb-3">
                Step 2: Project Location
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
                      className={`py-2.5 px-3 text-center rounded-xs border transition-all text-xs font-bold cursor-pointer ${
                        isSelected
                          ? 'bg-[#d9a441] text-[#0b0c0a] border-[#d9a441]'
                          : 'bg-[#0e0f0c] border-[#f4efe3]/10 text-[#9a9285] hover:border-[#f4efe3]/30 hover:text-[#f4efe3]'
                      } ${simStep > 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {city.name}
                      <span className="block text-[0.65rem] opacity-75 font-normal">{city.arabic}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP C: CATALOG ITEMS */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-[#d9a441] tracking-wider uppercase">
                  Step 3: Choose Items from {supplier}
                </label>
                <span className="text-[0.7rem] text-[#9a9285]">Select and adjust quantity</span>
              </div>

              <div className="space-y-3 max-h-90 overflow-y-auto pr-1">
                {currentItems.map((item) => {
                  const isChecked = !!selectedItems[item.id];
                  const qty = selectedItems[item.id]?.qty || 1;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xs border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-[#181a14] border-[#d9a441]/70'
                          : 'bg-[#0e0f0c] border-[#f4efe3]/10 hover:border-[#f4efe3]/20'
                      }`}
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
                          </div>
                          <div className="text-xs text-[#d9a441] font-mono mt-0.5">
                            {item.price} SAR <span className="text-[#9a9285] font-sans text-[0.7rem]">/ {item.unit}</span>
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
                            -
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
                            +
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
                <span className="text-xs text-[#9a9285] block">Estimated Subtotal</span>
                <span className="text-xs text-[#2f8464]">{selectedList.length} items configured</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-[#d9a441]">
                  {subtotal.toLocaleString()} <span className="text-xs font-sans">SAR</span>
                </span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            {simStep === 0 ? (
              <button
                type="button"
                onClick={handleRunSimulation}
                className="w-full py-4 text-sm font-bold text-[#0b0c0a] bg-[#d9a441] hover:bg-[#e8b559] transition-all transform hover:-translate-y-0.5 rounded-xs shadow-[0_4px_20px_rgba(217,164,65,0.25)] cursor-pointer"
              >
                Generate Instant Official Quote →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 text-xs font-bold text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/20 hover:border-[#f4efe3]/40 rounded-xs cursor-pointer transition-all"
              >
                ↻ Reset and Build Another Request
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
                    <span>{clientName} · {selectedCategory}</span>
                    <span>📍 {selectedCity}</span>
                  </div>
                  <div className="text-xs text-[#f4efe3]/90 space-y-1 mt-2">
                    {selectedList.map((it) => (
                      <div key={it.id} className="flex justify-between font-mono">
                        <span>• {it.name} × {it.qty}</span>
                        <span>{(it.price * it.qty).toLocaleString()} SAR</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. System Matching Indicator */}
                {simStep >= 2 && (
                  <div className="text-center py-2 text-xs text-[#9a9285] flex items-center justify-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#2f8464] animate-ping" />
                    <span>Cross-matching specification with catalog of {supplier}...</span>
                  </div>
                )}

                {/* 3. Supplier Response Badge */}
                {simStep >= 3 && (
                  <div className="p-4 bg-[#10241c] border border-[#2f8464]/40 rounded-xs">
                    <div className="text-[0.7rem] text-[#2f8464] font-bold flex items-center justify-between">
                      <span>✓ {supplier} (Verified)</span>
                      <span>Response SLA: 1.4s</span>
                    </div>
                    <p className="text-xs text-[#f4efe3] mt-1.5 leading-relaxed">
                      Official price book match confirmed. Quotation document generated with verified unit costs and 15% VAT breakdown below.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* THE LUXURY OFFICIAL QUOTE DOCUMENT (Appears on Step 3) */}
            {simStep >= 3 ? (
              <div className="bg-[#f4efe3] text-[#131410] p-8 rounded-xs shadow-2xl relative border-t-4 border-[#d9a441]">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#131410] pb-4 mb-6 gap-3">
                  <div>
                    <h4 className="text-xl font-black tracking-tight">{supplier}</h4>
                    <p className="text-xs text-[#6b6255] font-medium mt-0.5">
                      {selectedCategory} · Verified Supplier ({selectedCity})
                    </p>
                  </div>
                  <div className="self-start sm:self-auto px-3 py-1 bg-[#131410] text-[#f4efe3] text-xs font-bold uppercase tracking-wider">
                    Official Quotation
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-[#d8d0bd] pb-4 mb-4 text-[#4a4436]">
                  <div>
                    <span className="block text-[0.65rem] text-[#8c8273] uppercase">Submitted To</span>
                    <span className="font-bold">{clientName}</span>
                  </div>
                  <div>
                    <span className="block text-[0.65rem] text-[#8c8273] uppercase">Quote Ref</span>
                    <span className="font-mono font-bold">{quoteNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[0.65rem] text-[#8c8273] uppercase">Date Issued</span>
                    <span className="font-medium">March 19, 2026</span>
                  </div>
                  <div>
                    <span className="block text-[0.65rem] text-[#8c8273] uppercase">Validity</span>
                    <span className="text-[#7a4526] font-bold">7 Days</span>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#d8d0bd] text-[#6b6255]">
                        <th className="py-2 pr-2">Description</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Unit Price</th>
                        <th className="py-2 text-right pl-2">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e6e0d1]">
                      {selectedList.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2.5 pr-2 font-medium">{item.name}</td>
                          <td className="py-2.5 text-center font-mono">{item.qty}</td>
                          <td className="py-2.5 text-right font-mono">{item.price} SAR</td>
                          <td className="py-2.5 text-right pl-2 font-mono font-bold">
                            {(item.price * item.qty).toLocaleString()} SAR
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Totals */}
                <div className="border-t border-[#d8d0bd] pt-3 flex flex-col items-end text-xs space-y-1.5">
                  <div className="flex justify-between w-64 text-[#6b6255]">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold">{subtotal.toLocaleString()} SAR</span>
                  </div>
                  <div className="flex justify-between w-64 text-[#6b6255]">
                    <span>VAT (15%):</span>
                    <span className="font-mono font-bold">{vat.toLocaleString()} SAR</span>
                  </div>
                  <div className="flex justify-between w-64 text-sm font-black text-[#131410] border-t-2 border-[#131410] pt-2">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base">{grandTotal.toLocaleString()} SAR</span>
                  </div>
                </div>

                {/* Disclaimer & Print Action */}
                <div className="mt-6 pt-4 border-t border-dashed border-[#c9c0aa] text-[0.7rem] text-[#6b6255] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <p className="max-w-md">
                    This is an automated binding quote issued via Tawreed Platform. Final prices subject to site survey.
                  </p>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#131410] hover:bg-[#252820] text-[#f4efe3] font-bold text-xs rounded-xs transition-colors cursor-pointer shrink-0"
                  >
                    🖨️ Print / Save PDF
                  </button>
                </div>

                {/* OPPORTUNITY / LEAD FEE UNLOCK CONTAINER */}
                <div className="mt-8 p-5 bg-[#131410] text-[#f4efe3] rounded-xs border border-[#d9a441]/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[0.7rem] text-[#d9a441] uppercase tracking-wider font-bold block">
                        Platform Monetization Mechanism
                      </span>
                      <h5 className="text-sm font-bold mt-0.5">
                        {contactUnlocked
                          ? 'Direct Connection Established'
                          : 'Lock In Schedule & Execution'}
                      </h5>
                    </div>
                    <span className="text-xs text-[#2f8464] font-mono">Lead Fee: 50 SAR</span>
                  </div>

                  {!contactUnlocked ? (
                    <div className="mt-3">
                      <p className="text-xs text-[#9a9285] mb-3">
                        Supplier pays a flat opportunity micro-fee to unlock client WhatsApp & site address for site inspection.
                      </p>
                      <button
                        type="button"
                        onClick={() => setContactUnlocked(true)}
                        className="w-full py-2.5 text-xs font-bold text-[#0b0c0a] bg-[#d9a441] hover:bg-[#e8b559] rounded-xs transition-colors cursor-pointer"
                      >
                        🔓 Unlock Direct Phone & WhatsApp Access
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-[#10241c] border border-[#2f8464]/50 rounded-xs text-xs space-y-1">
                      <div className="text-[#2f8464] font-bold">
                        ✓ Contact Info Unlocked (Opportunity Fee Settled)
                      </div>
                      <div className="text-[#f4efe3]">
                        📞 Direct Line: <span className="font-mono text-[#d9a441]">+966 50 123 4567</span>
                      </div>
                      <div className="text-[#f4efe3]">
                        💬 WhatsApp: <span className="font-mono text-[#d9a441]">+966 50 123 4567</span> (Instant Chat Ready)
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* Placeholder state when not yet submitted */
              <div className="h-full min-h-120 bg-[#131410] border border-dashed border-[#f4efe3]/15 rounded-xs flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#1a1d17] border border-[#d9a441]/30 flex items-center justify-center text-2xl mb-4 text-[#d9a441]">
                  📄
                </div>
                <h4 className="text-lg font-bold text-[#f4efe3]">Official Quotation Sheet</h4>
                <p className="text-xs text-[#9a9285] max-w-sm mt-2 leading-relaxed">
                  Select your items on the left workbench and click "Generate Instant Official Quote" to simulate live cost breakdown and ZATCA compliance.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}