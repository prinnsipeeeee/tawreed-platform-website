import React from 'react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b0c0a] text-[#9a9285] border-t border-[#f4efe3]/10 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP ROW: BRAND & QUICK LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#f4efe3]/10">
          
          {/* Brand Dossier (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#hero" className="flex items-center gap-3 text-decoration-none group">
              <div className="relative w-9 h-9 border border-[#d9a441]/60 flex items-center justify-center bg-[#131410] group-hover:scale-105 transition-transform">
                <span className="text-[#d9a441] font-bold text-lg">T</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#d9a441]" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#d9a441]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#f4efe3] font-bold text-xl tracking-tight">
                  Tawreed Platform
                </span>
                <span className="text-[0.65rem] text-[#d9a441] -mt-1 font-medium tracking-wider">
                  منصّة توريد · Chapter One: Contracting
                </span>
              </div>
            </a>

            <p className="text-xs leading-relaxed max-w-sm text-[#9a9285]">
              Saudi Arabia’s unified procurement ecosystem connecting general contractors, MEP specialists, and developers with zero-friction, instant official quotations.
            </p>

            {/* Compliance Strip */}
            <div className="flex items-center gap-2 pt-2 text-[0.7rem] text-[#f4efe3]/70">
              <span className="px-2 py-0.5 bg-[#10241c] text-[#2f8464] border border-[#2f8464]/30 rounded-xs font-semibold">
                🇸🇦 Saudi Arabia
              </span>
              <span className="px-2 py-0.5 bg-[#131410] border border-[#f4efe3]/10 rounded-xs">
                ZATCA 15% VAT Compliant
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#f4efe3] uppercase tracking-wider block">
              Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero" className="hover:text-[#d9a441] transition-colors">The Story (Hero)</a></li>
              <li><a href="#acts" className="hover:text-[#d9a441] transition-colors">Contracting Divisions</a></li>
              <li><a href="#crew" className="hover:text-[#d9a441] transition-colors">Vetted Suppliers</a></li>
              <li><a href="#scenes" className="hover:text-[#d9a441] transition-colors">How It Works</a></li>
              <li><a href="#demo" className="hover:text-[#d9a441] transition-colors">Interactive Demo</a></li>
              <li><a href="#model" className="hover:text-[#d9a441] transition-colors">Revenue Model</a></li>
            </ul>
          </div>

          {/* Divisions */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#f4efe3] uppercase tracking-wider block">
              Core Divisions
            </span>
            <ul className="space-y-2 text-xs">
              <li><a href="#acts" className="hover:text-[#d9a441] transition-colors">Civil & Structural</a></li>
              <li><a href="#acts" className="hover:text-[#d9a441] transition-colors">MEP & Utilities</a></li>
              <li><a href="#acts" className="hover:text-[#d9a441] transition-colors">HVAC Systems</a></li>
              <li><a href="#acts" className="hover:text-[#d9a441] transition-colors">Finishing & Fitout</a></li>
              <li><a href="#acts" className="hover:text-[#d9a441] transition-colors">Waterproofing & Insulation</a></li>
            </ul>
          </div>

          {/* Legal / Regions */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#f4efe3] uppercase tracking-wider block">
              Operating Coverage
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-[#f4efe3]/80"><span>📍</span> Riyadh Central Hub</li>
              <li className="flex items-center gap-1.5 text-[#f4efe3]/80"><span>📍</span> Jeddah & Makkah Province</li>
              <li className="flex items-center gap-1.5 text-[#f4efe3]/80"><span>📍</span> Dammam & Khobar Hub</li>
              <li className="text-[0.7rem] text-[#d9a441] pt-2">Full Kingdom rollout active</li>
            </ul>
          </div>

        </div>

        {/* BOTTOM ROW: COPYRIGHT & BACK-TO-TOP */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} Tawreed Platform (منصّة توريد). Prototype & Architectural Blueprint · KSA.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-[#d9a441] hover:text-[#e8b559] transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <span>↑</span>
          </button>
        </div>

      </div>
    </footer>
  );
}