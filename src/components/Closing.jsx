import React from 'react';

export default function Closing() {
  return (
    <section className="py-28 px-6 bg-linear-to-b from-[#131410] via-[#0b0c0a] to-[#000000] relative border-t border-[#f4efe3]/10 overflow-hidden">
      
      {/* Background Gold Ambient Radial Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87.5 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, #d9a441 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        
        {/* EYEBROW BADGE */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d9a441]/40 bg-[#1a170d]/60 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#d9a441] animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-[#d9a441] uppercase">
            The Next Chapter
          </span>
        </div>

        {/* HEADLINE */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#f4efe3] tracking-tight leading-[1.15] max-w-3xl mx-auto">
          The Real Transformation Begins With Your First Request
        </h2>

        {/* SUBTITLE */}
        <p className="max-w-2xl mx-auto mt-6 text-base sm:text-lg text-[#9a9285] leading-relaxed">
          Whether you are a developer seeking guaranteed transparent prices, or a certified contractor looking for high-intent Saudi construction projects.
        </p>

        {/* ================= DUAL ONBOARDING PATHWAYS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14 text-left max-w-3xl mx-auto">
          
          {/* Card A: For Project Owners / Clients */}
          <div className="p-8 bg-[#131410] border border-[#f4efe3]/10 hover:border-[#d9a441]/60 transition-all rounded-xs relative flex flex-col justify-between group">
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#d9a441]" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#d9a441]" />

            <div>
              <span className="text-xs font-bold text-[#d9a441] uppercase tracking-wider block">
                For Project Owners & Developers
              </span>
              <h3 className="text-xl font-bold text-[#f4efe3] mt-1 group-hover:text-[#d9a441] transition-colors">
                Need Fast Official Quotes?
              </h3>
              <p className="text-xs text-[#9a9285] mt-3 leading-relaxed">
                Skip unverified WhatsApp groups. Configure your project parameters and get instant standardized quotes in seconds.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#f4efe3]/10">
              <a
                href="#demo"
                className="w-full block text-center py-3 text-xs font-bold text-[#0b0c0a] bg-[#d9a441] hover:bg-[#e8b559] transition-all rounded-xs shadow-[0_4px_15px_rgba(217,164,65,0.2)]"
              >
                Launch Live Quote Builder →
              </a>
            </div>
          </div>

          {/* Card B: For Contractors & Suppliers */}
          <div className="p-8 bg-[#131410] border border-[#f4efe3]/10 hover:border-[#2f8464]/60 transition-all rounded-xs relative flex flex-col justify-between group">
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#2f8464]" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#2f8464]" />

            <div>
              <span className="text-xs font-bold text-[#2f8464] uppercase tracking-wider block">
                For Suppliers & Contractors
              </span>
              <h3 className="text-xl font-bold text-[#f4efe3] mt-1 group-hover:text-[#2f8464] transition-colors">
                Join As A Verified Supplier
              </h3>
              <p className="text-xs text-[#9a9285] mt-3 leading-relaxed">
                Connect your price book, link your Commercial Registration (CR), and receive qualified construction leads directly to your phone.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#f4efe3]/10">
              <button
                type="button"
                onClick={() => alert('Supplier Onboarding Portal: Commercial Registration (CR) verification API gateway will open here.')}
                className="w-full py-3 text-xs font-bold text-[#f4efe3] bg-transparent border border-[#2f8464] hover:bg-[#2f8464]/20 transition-all rounded-xs cursor-pointer"
              >
                Register Supplier License
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}