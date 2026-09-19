import React, { useState, useEffect } from 'react';

export default function Hero() {
  const [isOpened, setIsOpened] = useState(false);

  // Theatrical curtain / letterbox open animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpened(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-[#0b0c0a] pt-20"
      style={{
        background: `
          radial-gradient(ellipse 65% 55% at 50% 45%, rgba(217,164,65,0.18), transparent 75%),
          linear-gradient(180deg, #0e0f0c 0%, #0b0c0a 100%)
        `,
      }}
    >
      {/* ================= CINEMATIC LETTERBOX BARS ================= */}
      {/* Top Curtain Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-[10vh] min-h-12 bg-[#000000] z-20 transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isOpened ? '-translate-y-full' : 'translate-y-0'
        }`}
      />
      {/* Bottom Curtain Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[10vh] min-h-12 bg-[#000000] z-20 transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isOpened ? 'translate-y-full' : 'translate-y-0'
        }`}
      />

      {/* ================= CORNER BRACKET DECORATIVE BORDER ================= */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center p-8 md:p-12">
        {/* Subtle top-right and bottom-left gold bracket frame */}
        <div className="absolute -top-3 -right-3 w-7 h-7 border-t-2 border-r-2 border-[#d9a441] opacity-75 pointer-events-none" />
        <div className="absolute -bottom-3 -left-3 w-7 h-7 border-b-2 border-l-2 border-[#d9a441] opacity-75 pointer-events-none" />

        {/* TOP EYEBROW BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d9a441]/30 bg-[#131410]/80 backdrop-blur-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d9a441] animate-pulse" />
          <span className="text-xs font-semibold tracking-widest text-[#d9a441] uppercase">
            Saudi Procurement Platform · Chapter One
          </span>
        </div>

        {/* HERO MAIN HEADLINE */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#f4efe3] tracking-tight leading-[1.1] drop-shadow-[0_0_50px_rgba(217,164,65,0.3)]">
          The Story Begins <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#f4efe3] via-[#d9a441] to-[#e8b559]">
            With A Single Request
          </span>
        </h1>

        {/* SUBTITLE */}
        <p className="max-w-2xl mt-6 text-base sm:text-lg md:text-xl text-[#9a9285] leading-relaxed">
          A specialized platform uniting Saudi contracting suppliers in one ecosystem. 
          Send your specifications and instantly convert them into standardized, comparable official quotations.
        </p>

        {/* TRUST PILLS / KEY HIGHLIGHTS */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#131410] border border-[#f4efe3]/10 text-xs text-[#f4efe3]/80">
            <span className="text-[#2f8464] font-bold">✓</span> Verified Contracting Suppliers
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#131410] border border-[#f4efe3]/10 text-xs text-[#f4efe3]/80">
            <span className="text-[#d9a441] font-bold">⚡</span> Instant Quotation Engine
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#131410] border border-[#f4efe3]/10 text-xs text-[#f4efe3]/80">
            <span className="text-[#b56a3b] font-bold">★</span> Zero Commission Hassle
          </div>
        </div>

        {/* CALL TO ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <a
            href="#demo"
            className="px-8 py-3.5 text-sm sm:text-base font-bold text-[#0b0c0a] bg-[#d9a441] hover:bg-[#e8b559] transition-all duration-300 transform hover:-translate-y-1 rounded-xs shadow-[0_4px_25px_rgba(217,164,65,0.35)]"
          >
            Experience Live Quote
          </a>
          <a
            href="#scenes"
            className="px-8 py-3.5 text-sm sm:text-base font-semibold text-[#f4efe3] bg-transparent border border-[#f4efe3]/20 hover:border-[#d9a441] hover:text-[#d9a441] transition-all duration-300 rounded-xs"
          >
            How The Story Unfolds
          </a>
        </div>
      </div>

      {/* ================= SCROLL DOWN CUE ================= */}
      <a
        href="#acts"
        className="mt-14 mb-4 flex flex-col items-center gap-2 text-xs text-[#9a9285] hover:text-[#d9a441] transition-colors z-10 group"
      >
        <div className="w-px h-10 bg-linear-to-b from-transparent via-[#d9a441] to-transparent group-hover:h-12 transition-all duration-300" />
        <span className="tracking-widest uppercase text-[0.7rem]">Scroll Down</span>
      </a>
    </section>
  );
}