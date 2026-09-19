import React, { useState } from 'react';

export default function Crew() {
  const [activeTab, setActiveTab] = useState('all');

  const participants = [
    {
      type: 'supplier',
      name: 'Smartinbox Establishment',
      arabicName: 'مؤسسة سمات إنبوكس للمقاولات',
      role: 'Featured Verified Supplier',
      avatarText: 'S',
      city: 'Riyadh, Saudi Arabia',
      crNumber: 'CR 1010784920',
      rating: '4.95 / 5.0',
      quoteTurnaround: '< 5 Mins',
      specialty: 'Civil Works, MEP Utilities & HVAC',
      projectsDone: '140+ Projects',
      isVerified: true,
      badgeColor: 'emerald',
    },
    {
      type: 'client',
      name: 'Karam Al-Watan Co.',
      arabicName: 'شركة كرم الوطن للتطوير العقاري',
      role: 'Enterprise Buyer & Client',
      avatarText: 'K',
      city: 'Riyadh, Saudi Arabia',
      crNumber: 'CR 1010452319',
      rating: 'Verified Buyer',
      quoteTurnaround: 'Active Requester',
      specialty: 'Commercial Developments & Turnkey Sites',
      projectsDone: '28 Active RFQs',
      isVerified: true,
      badgeColor: 'gold',
    },
    {
      type: 'supplier',
      name: 'Al-Safwa MEP Engineering',
      arabicName: 'شركة الصفوة للأنظمة الكهروميكانيكية',
      role: 'Specialized MEP Contractor',
      avatarText: 'A',
      city: 'Jeddah & Western Province',
      crNumber: 'CR 4030219842',
      rating: '4.91 / 5.0',
      quoteTurnaround: '< 8 Mins',
      specialty: 'Industrial Electrical Panels & Chilled Water Lines',
      projectsDone: '85+ Projects',
      isVerified: true,
      badgeColor: 'emerald',
    },
    {
      type: 'client',
      name: 'Riyadh Horizon Developments',
      arabicName: 'مشاريع أفق الرياض المعمارية',
      role: 'Commercial Contractor & Developer',
      avatarText: 'R',
      city: 'Riyadh & Eastern Province',
      crNumber: 'CR 1010992381',
      rating: 'Tier-1 Client',
      quoteTurnaround: 'Immediate Issuer',
      specialty: 'Mixed-Use Plazas & Villa Communities',
      projectsDone: '42 Active RFQs',
      isVerified: true,
      badgeColor: 'gold',
    },
  ];

  const filtered =
    activeTab === 'all'
      ? participants
      : participants.filter((p) => p.type === activeTab);

  return (
    <section id="crew" className="py-24 px-6 bg-[#0b0c0a] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADLINE */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold text-[#d9a441] tracking-widest uppercase mb-3 px-3 py-1 bg-[#131410] border border-[#d9a441]/30 rounded-sm">
            Act II · Key Characters
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f4efe3] tracking-tight">
            The Client & Supplier in this Live Experience
          </h2>
          <p className="mt-4 text-[#9a9285] text-base sm:text-lg leading-relaxed">
            Real enterprise case study model. How verified suppliers and professional construction clients transact without endless negotiations or middleman frictions.
          </p>

          {/* TOGGLE TABS */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-xs cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#d9a441] text-[#0b0c0a]'
                  : 'bg-[#131410] text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/10'
              }`}
            >
              All Entities ({participants.length})
            </button>
            <button
              onClick={() => setActiveTab('supplier')}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-xs cursor-pointer ${
                activeTab === 'supplier'
                  ? 'bg-[#d9a441] text-[#0b0c0a]'
                  : 'bg-[#131410] text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/10'
              }`}
            >
              Verified Suppliers
            </button>
            <button
              onClick={() => setActiveTab('client')}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-xs cursor-pointer ${
                activeTab === 'client'
                  ? 'bg-[#d9a441] text-[#0b0c0a]'
                  : 'bg-[#131410] text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/10'
              }`}
            >
              Contractor Clients
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
                    className={`text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                      item.type === 'supplier'
                        ? 'bg-[#10241c] text-[#2f8464] border-[#2f8464]/40'
                        : 'bg-[#7a4526]/20 text-[#b56a3b] border-[#b56a3b]/40'
                    }`}
                  >
                    {item.type === 'supplier' ? 'Supplier' : 'Client / Buyer'}
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
                    <span>📍</span> {item.city}
                  </span>
                  <span className="font-mono text-[0.7rem] text-[#9a9285]">
                    {item.crNumber}
                  </span>
                </div>

                {/* Performance stats */}
                <div className="grid grid-cols-2 gap-2 text-xs my-2">
                  <div className="bg-[#0b0c0a] p-2 border border-[#f4efe3]/5">
                    <span className="text-[0.65rem] text-[#9a9285] block">Track Record</span>
                    <span className="font-semibold text-[#f4efe3]">{item.projectsDone}</span>
                  </div>
                  <div className="bg-[#0b0c0a] p-2 border border-[#f4efe3]/5">
                    <span className="text-[0.65rem] text-[#9a9285] block">Response SLA</span>
                    <span className="font-semibold text-[#d9a441]">{item.quoteTurnaround}</span>
                  </div>
                </div>

                {/* Specialty */}
                <p className="text-xs text-[#9a9285] mt-3 line-clamp-2">
                  <strong className="text-[#f4efe3]/70 font-medium">Domain: </strong>
                  {item.specialty}
                </p>
              </div>

              {/* Verified Ribbon Bottom */}
              <div className="mt-6 pt-3 border-t border-[#f4efe3]/10 flex items-center justify-between text-xs">
                <span className="text-[#2f8464] font-bold flex items-center gap-1">
                  <span>✓</span> MoCI & Balady Verified
                </span>
                <span className="text-[0.7rem] text-[#d9a441] font-mono font-bold">
                  ★ {item.rating}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PLATFORM COMPLIANCE & VETTING STRIP ================= */}
        <div className="mt-16 p-8 bg-[#131410] border border-[#f4efe3]/10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#d9a441] tracking-widest uppercase">
              Rigorous Quality Assurance
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-[#f4efe3] mt-1">
              How We Verify Every Participating Supplier
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10241c] text-[#2f8464] border border-[#2f8464]/30 flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#f4efe3]">Commercial Registration</h5>
                <p className="text-xs text-[#9a9285] mt-1">Verified via Saudi Ministry of Commerce API with active contracting license.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10241c] text-[#2f8464] border border-[#2f8464]/30 flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#f4efe3]">Chamber of Commerce</h5>
                <p className="text-xs text-[#9a9285] mt-1">Active membership in the Riyadh, Jeddah, or Eastern Chamber.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10241c] text-[#2f8464] border border-[#2f8464]/30 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#f4efe3]">Tax & Zakat Compliance</h5>
                <p className="text-xs text-[#9a9285] mt-1">Certified ZATCA 15% VAT invoice compatibility and clear audit history.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#10241c] text-[#2f8464] border border-[#2f8464]/30 flex items-center justify-center font-bold text-sm shrink-0">
                4
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#f4efe3]">Site & Warehouse Audits</h5>
                <p className="text-xs text-[#9a9285] mt-1">Physical spot inspections on machinery and inventory availability.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}