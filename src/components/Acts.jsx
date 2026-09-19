import React, { useState } from 'react';

export default function Acts() {
  const [activeCategory, setActiveCategory] = useState('all');

  const divisions = [
    {
      id: 'civil',
      category: 'structural',
      title: 'Civil & General Contracting',
      arabicTitle: 'مقاولات عامة وإنشائية',
      tag: 'Core Division',
      description: 'Foundations, concrete casting, structural masonry, and turn-key site management from ground zero to handover.',
      services: ['Concrete Pouring (per m²)', 'Brickwork & Masonry', 'Excavation & Earthworks', 'Turnkey Contracting'],
      sla: 'Instant Matching',
      color: 'emerald',
    },
    {
      id: 'mep',
      category: 'engineering',
      title: 'MEP (Electrical & Plumbing)',
      arabicTitle: 'كهرباء وسباكة هندسية',
      tag: 'Critical Utilities',
      description: 'Standardized utility grids, certified electrical point layout, industrial drainage, and master piping supply.',
      services: ['Electrical Point Distribution', 'Piping & Water Supply', 'Circuit Panel Setup', 'Sanitary Rough-in'],
      sla: '5 Min Response',
      color: 'emerald',
    },
    {
      id: 'hvac',
      category: 'engineering',
      title: 'HVAC & Climate Control',
      arabicTitle: 'أنظمة التكييف والتبريد',
      tag: 'Climate Tech',
      description: 'Split system installations, centralized duct routing, regular maintenance, and industrial-grade Freon supplies.',
      services: ['Split Unit Installation', 'Centralized Duct Routing', 'Compressor Overhaul', 'Freon Recharge'],
      sla: 'Certified Technicians',
      color: 'gold',
    },
    {
      id: 'finishing',
      category: 'fitout',
      title: 'Architectural Finishing & Decor',
      arabicTitle: 'التشطيبات والديكور',
      tag: 'Interior Fitout',
      description: 'Luxury interior treatments, smooth wall coatings, suspended gypsum acoustic ceilings, and ambient spotlight grids.',
      services: ['Wall Painting & Texture', 'Gypsum Board Ceilings', 'Architectural Lighting', 'Porcelain & Flooring'],
      sla: 'Quality Guaranteed',
      color: 'gold',
    },
    {
      id: 'insulation',
      category: 'structural',
      title: 'Waterproofing & Insulation',
      arabicTitle: 'العزل المائي والحراري',
      tag: 'Building Protection',
      description: 'Saudi code-compliant thermal roof insulation, bituminous waterproofing membranes, and chemical protective coatings.',
      services: ['Rooftop Waterproofing', 'Thermal Barrier Foam', 'Protective Topcoats', 'Basement Tanking'],
      sla: 'Certified Materials',
      color: 'emerald',
    },
    {
      id: 'steel',
      category: 'structural',
      title: 'Structural Steel & Metalwork',
      arabicTitle: 'أعمال الحديد والهياكل',
      tag: 'Industrial',
      description: 'Prefabricated metal canopies, hangar structural steel, wrought iron safety railings, and reinforced perimeter fencing.',
      services: ['Steel Hangars & Framing', 'Wrought Iron Gates', 'Safety Stair Railings', 'Custom Sheet Metal'],
      sla: 'Heavy Duty',
      color: 'emerald',
    },
  ];

  const filteredDivisions =
    activeCategory === 'all'
      ? divisions
      : divisions.filter((d) => d.category === activeCategory);

  return (
    <section id="acts" className="py-24 px-6 bg-[#131410] relative border-t border-[#f4efe3]/10">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold text-[#d9a441] tracking-widest uppercase mb-3 px-3 py-1 bg-[#1d4b3a]/30 border border-[#2f8464]/30 rounded-sm">
            Act I · Specialized Divisions
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f4efe3] tracking-tight">
            Everything Your Contracting Project Needs
          </h2>
          <p className="mt-4 text-[#9a9285] text-base sm:text-lg leading-relaxed">
            Built from the ground up for the Saudi contracting ecosystem. A single structured request routes automatically to the exact vetted specialists.
          </p>

          {/* FILTER PILLS */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-xs cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#d9a441] text-[#0b0c0a]'
                  : 'bg-[#0b0c0a] text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/10'
              }`}
            >
              All Divisions ({divisions.length})
            </button>
            <button
              onClick={() => setActiveCategory('structural')}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-xs cursor-pointer ${
                activeCategory === 'structural'
                  ? 'bg-[#d9a441] text-[#0b0c0a]'
                  : 'bg-[#0b0c0a] text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/10'
              }`}
            >
              Structural & Civil
            </button>
            <button
              onClick={() => setActiveCategory('engineering')}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-xs cursor-pointer ${
                activeCategory === 'engineering'
                  ? 'bg-[#d9a441] text-[#0b0c0a]'
                  : 'bg-[#0b0c0a] text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/10'
              }`}
            >
              MEP & Utilities
            </button>
            <button
              onClick={() => setActiveCategory('fitout')}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-xs cursor-pointer ${
                activeCategory === 'fitout'
                  ? 'bg-[#d9a441] text-[#0b0c0a]'
                  : 'bg-[#0b0c0a] text-[#9a9285] hover:text-[#f4efe3] border border-[#f4efe3]/10'
              }`}
            >
              Finishing & Fitout
            </button>
          </div>
        </div>

        {/* DIVISION CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDivisions.map((div) => (
            <div
              key={div.id}
              className="relative p-7 bg-linear-to-b from-[#161814] to-[#0e0f0c] border border-[#f4efe3]/10 hover:border-[#2f8464]/60 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Corner Bracket Accent */}
              <div className="absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-[#d9a441]/50 group-hover:border-[#d9a441] transition-colors" />
              <div className="absolute -bottom-px  -left-[px w-5 h-5 border-b-2 border-l-2 border-[#d9a441]/50 group-hover:border-[#d9a441] transition-colors" />

              <div>
                {/* Header Tag & SLA */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[0.7rem] font-bold tracking-wider text-[#d9a441] uppercase px-2 py-0.5 bg-[#d9a441]/10 border border-[#d9a441]/20">
                    {div.tag}
                  </span>
                  <span className="text-[0.7rem] text-[#2f8464] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2f8464] animate-ping" />
                    {div.sla}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#f4efe3] group-hover:text-[#d9a441] transition-colors">
                  {div.title}
                </h3>
                <p className="text-xs text-[#9a9285] font-arabic mt-0.5">
                  {div.arabicTitle}
                </p>

                {/* Description */}
                <p className="text-sm text-[#9a9285] mt-4 leading-relaxed">
                  {div.description}
                </p>

                {/* Services List / Scope */}
                <div className="mt-6 pt-4 border-t border-[#f4efe3]/10">
                  <p className="text-[0.75rem] font-semibold text-[#f4efe3]/60 uppercase tracking-wider mb-2">
                    Scope of Supply:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {div.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 bg-[#10241c] text-[#2f8464] border border-[#2f8464]/30 rounded-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="mt-8 pt-4 flex items-center justify-between">
                <a
                  href="#demo"
                  className="text-xs font-bold text-[#d9a441] hover:text-[#e8b559] flex items-center gap-1.5 group-hover:translate-x-1 transition-all"
                >
                  Request Quote in this Division
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ================= ROADMAP TEASER: FUTURE CHAPTERS ================= */}
        <div className="mt-16 p-8 bg-[#0b0c0a] border border-[#f4efe3]/10 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#b56a3b] uppercase tracking-widest">
                Upcoming Roadmap · Platform Expansion
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-[#f4efe3] mt-1">
                More Contracting Ecosystems Coming in Chapter Two & Three
              </h4>
              <p className="text-sm text-[#9a9285] mt-1 max-w-2xl">
                We are actively integrating verified suppliers for heavy machinery leasing (Chapter II) and bulk building material logistics (Chapter III).
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 border border-[#f4efe3]/20 bg-[#131410] text-xs text-[#9a9285]">
                🚜 Heavy Equipment <span className="text-[#d9a441] ml-1">(Q3)</span>
              </div>
              <div className="px-4 py-2 border border-[#f4efe3]/20 bg-[#131410] text-xs text-[#9a9285]">
                🧱 Bulk Cement & Rebar <span className="text-[#d9a441] ml-1">(Q4)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}