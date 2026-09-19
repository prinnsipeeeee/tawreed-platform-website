import React, { useState } from 'react';

export default function Model() {
  const [dealSize, setDealSize] = useState(25000); // in SAR
  const [winRate, setWinRate] = useState(25); // 25% win rate (1 in 4)

  // Calculate Lead Acquisition Cost
  const leadFee = dealSize > 30000 ? 150 : dealSize > 10000 ? 75 : 35;
  const leadsNeededToWin = Math.ceil(100 / winRate);
  const totalLeadCost = leadsNeededToWin * leadFee;
  const effectiveCAC = ((totalLeadCost / dealSize) * 100).toFixed(1);

  const tiers = [
    {
      name: 'Minor Works & Maintenance',
      scope: 'Projects under 10,000 SAR',
      fee: '35 SAR',
      description: 'Quick repair jobs, single AC installs, painting rooms, minor plumbing leaks.',
      color: 'emerald',
    },
    {
      name: 'Standard MEP & Renovations',
      scope: 'Projects 10,000 – 50,000 SAR',
      fee: '75 SAR',
      description: 'Full apartment electrical rewiring, central HVAC maintenance, waterproofing.',
      color: 'gold',
    },
    {
      name: 'Major Turnkey & Structural',
      scope: 'Projects over 50,000 SAR',
      fee: '150 SAR',
      description: 'Full villa construction, commercial fitouts, concrete structural casting.',
      color: 'gold',
    },
  ];

  return (
    <section id="model" className="py-24 px-6 bg-[#131410] relative border-t border-[#f4efe3]/10">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold text-[#d9a441] tracking-widest uppercase mb-3 px-3 py-1 bg-[#1a1d17] border border-[#d9a441]/30 rounded-sm">
            Act V · Sustainable Monetization
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f4efe3] tracking-tight">
            The Revenue Model: Pure Pay-Per-Lead
          </h2>
          <p className="mt-4 text-[#9a9285] text-base sm:text-lg leading-relaxed">
            Zero subscription traps. Zero post-deal disputes. Suppliers only pay a micro-fee when they choose to unlock verified client contact details.
          </p>
        </div>

        {/* ================= HERO HIGHLIGHT: THE CORE MECHANIC ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Left: Visual Gold Box */}
          <div className="lg:col-span-5 bg-linear-to-br from-[#1a170d] to-[#0e0c06] border border-[#d9a441]/40 p-8 sm:p-10 rounded-xs relative">
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#d9a441]" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#d9a441]" />

            <span className="text-xs font-mono font-bold text-[#d9a441] uppercase tracking-widest">
              Core Commercial Principle
            </span>
            <div className="text-4xl sm:text-5xl font-black text-[#d9a441] mt-3 font-mono">
              Lead Fee
            </div>
            <p className="text-sm sm:text-base text-[#f4efe3] font-medium mt-4 leading-relaxed">
              A fixed, predictable micro-fee paid strictly upon unlocking client telephone and WhatsApp credentials.
            </p>

            <div className="mt-6 pt-6 border-t border-[#d9a441]/20 space-y-2 text-xs text-[#9a9285]">
              <div className="flex items-center gap-2">
                <span className="text-[#2f8464] font-bold">✓</span>
                <span>No recurring monthly retainers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#2f8464] font-bold">✓</span>
                <span>Zero commission tracking or invoice audits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#2f8464] font-bold">✓</span>
                <span>Suppliers only pay when they see profitable fit</span>
              </div>
            </div>
          </div>

          {/* Right: Why This Eliminates Platform Leakage */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#f4efe3]">
              Why Traditional Construction Marketplaces Fail — And Why Ours Thrives
            </h3>
            <p className="text-sm sm:text-base text-[#9a9285] leading-relaxed">
              In the contracting sector, taking a percentage of the final contract (e.g., 5% of a 500,000 SAR build) never works. 
              Clients and contractors inevitably take the conversation offline and pay with cash to evade the platform fee.
            </p>
            <p className="text-sm sm:text-base text-[#9a9285] leading-relaxed">
              By collecting a modest <strong className="text-[#d9a441]">flat fee at the instant of unlocking</strong>, value is captured immediately. 
              The platform facilitates the connection, the supplier pays instantly via Apple Pay or Mada, and both parties transact with zero friction.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#0b0c0a] border border-[#f4efe3]/10">
                <span className="text-xl font-bold text-[#2f8464]">100%</span>
                <p className="text-xs text-[#9a9285] mt-1">Cash flow realization at point of unlock</p>
              </div>
              <div className="p-4 bg-[#0b0c0a] border border-[#f4efe3]/10">
                <span className="text-xl font-bold text-[#d9a441]">0%</span>
                <p className="text-xs text-[#9a9285] mt-1">Platform evasion & offline commission disputes</p>
              </div>
            </div>
          </div>

        </div>

        {/* ================= TIERED PRICING SCHEDULE ================= */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#d9a441] tracking-widest uppercase">
              Transparent Pricing Schedule
            </span>
            <h4 className="text-2xl font-bold text-[#f4efe3] mt-1">
              Predictable Opportunity Tiers
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
                    <span className="text-xs font-sans font-normal text-[#9a9285] ml-1">/ lead</span>
                  </div>
                  <p className="text-xs text-[#9a9285] leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#f4efe3]/10 flex items-center justify-between text-xs text-[#2f8464] font-semibold">
                  <span>✓ Instant Mada / Apple Pay</span>
                  <span>Direct WhatsApp</span>
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
                Interactive Calculator
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-[#f4efe3] mt-1">
                Calculate Contractor Return On Investment (ROI)
              </h4>
              <p className="text-xs sm:text-sm text-[#9a9285] mt-2 leading-relaxed">
                Adjust contract values and closing rates to see how economical lead fees are compared to paying traditional 10% agent broker fees.
              </p>

              {/* Deal Size Slider */}
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#f4efe3]">Expected Project Value</span>
                  <span className="font-mono font-bold text-[#d9a441]">{dealSize.toLocaleString()} SAR</span>
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
                  <span className="text-[#f4efe3]">Contractor Closing Rate</span>
                  <span className="font-mono font-bold text-[#2f8464]">{winRate}% (1 in {leadsNeededToWin} leads)</span>
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
                <span className="text-[0.7rem] text-[#9a9285] uppercase block">Total Lead Fee Cost</span>
                <span className="text-2xl font-bold font-mono text-[#f4efe3] mt-1 block">
                  {totalLeadCost} SAR
                </span>
                <span className="text-[0.65rem] text-[#9a9285]">To secure 1 won project</span>
              </div>

              <div className="p-4 bg-[#0b0c0a] border border-[#f4efe3]/5">
                <span className="text-[0.7rem] text-[#9a9285] uppercase block">Customer Acquisition Cost</span>
                <span className="text-2xl font-bold font-mono text-[#2f8464] mt-1 block">
                  {effectiveCAC}%
                </span>
                <span className="text-[0.65rem] text-[#9a9285]">Of total project gross</span>
              </div>

              <div className="col-span-2 p-3 bg-[#10241c] border border-[#2f8464]/30 text-xs text-[#f4efe3]/90">
                💡 <strong>Commercial Insight:</strong> By paying only <strong>{totalLeadCost} SAR</strong> in lead unlock fees, the contractor pockets a <strong>{dealSize.toLocaleString()} SAR</strong> contract — saving over <strong>{(dealSize * 0.08).toLocaleString()} SAR</strong> compared to paying customary 8-10% construction brokers!
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}