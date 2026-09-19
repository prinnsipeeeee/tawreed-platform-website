import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function para i-trigger ang Google Translate Engine sa index.html mo
  const toggleLanguage = () => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      const targetLang = isArabic ? 'en' : 'ar';
      select.value = targetLang;
      select.dispatchEvent(new Event('change'));
      setIsArabic(!isArabic);

      // Auto-switch ng text direction: RTL para sa Arabic, LTR para sa English
      document.documentElement.dir = targetLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = targetLang;
    } else {
      console.warn('Google Translate is initializing...');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0c0a]/90 backdrop-blur-md border-b border-[#f4efe3]/10 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* BRAND LOGO */}
        <a href="#hero" className="flex items-center gap-3 group text-decoration-none">
          {/* Corner Bracket Emblem */}
          <div className="relative w-9 h-9 border border-[#d9a441]/60 flex items-center justify-center bg-[#131410] transition-transform duration-300 group-hover:scale-105">
            <span className="text-[#d9a441] font-bold text-lg">T</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#d9a441]" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#d9a441]" />
          </div>

          <div className="flex flex-col">
            <span className="text-[#f4efe3] font-bold text-xl tracking-tight">
              Tawreed Platform
            </span>
            <span className="text-[0.7rem] text-[#d9a441] -mt-1 font-medium tracking-wider">
              Chapter One · Contracting
            </span>
          </div>
        </a>

        {/* DESKTOP NAV LINKS (English) */}
        <nav className="hidden lg:flex items-center gap-6">
          <a href="#hero" className="text-[#9a9285] hover:text-[#d9a441] text-sm font-medium transition-colors">Home</a>
          <a href="#acts" className="text-[#9a9285] hover:text-[#d9a441] text-sm font-medium transition-colors">Divisions</a>
          <a href="#crew" className="text-[#9a9285] hover:text-[#d9a441] text-sm font-medium transition-colors">Suppliers & Clients</a>
          <a href="#scenes" className="text-[#9a9285] hover:text-[#d9a441] text-sm font-medium transition-colors">How It Works</a>
          <a href="#demo" className="text-[#9a9285] hover:text-[#d9a441] text-sm font-medium transition-colors">Live Demo</a>
          <a href="#model" className="text-[#9a9285] hover:text-[#d9a441] text-sm font-medium transition-colors">Revenue Model</a>
        </nav>

        {/* RIGHT ACTIONS: TRANSLATOR BUTTON + CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* TRANSLATE TOGGLE BUTTON */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-[#d9a441] border border-[#d9a441]/50 hover:border-[#d9a441] hover:bg-[#d9a441]/10 rounded-xs transition-all cursor-pointer"
            title="Translate between English and Arabic"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>{isArabic ? 'English' : 'العربية (Arabic)'}</span>
          </button>

          {/* CTA BUTTON */}
          <a
            href="#demo"
            className="px-5 py-2 text-sm font-bold text-[#0b0c0a] bg-[#d9a441] hover:bg-[#e8b559] transition-all duration-200 transform hover:-translate-y-0.5 rounded-xs shadow-[0_0_20px_rgba(217,164,65,0.25)]"
          >
            Get Instant Quote
          </a>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1 text-xs font-bold text-[#d9a441] border border-[#d9a441]/50 rounded-xs"
          >
            {isArabic ? 'EN' : 'عربي'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#f4efe3] hover:text-[#d9a441] p-1.5 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e0f0c] border-b border-[#f4efe3]/10 px-6 py-5">
          <div className="flex flex-col gap-3">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-[#9a9285] hover:text-[#d9a441] text-sm">Home</a>
            <a href="#acts" onClick={() => setMobileMenuOpen(false)} className="text-[#9a9285] hover:text-[#d9a441] text-sm">Divisions</a>
            <a href="#crew" onClick={() => setMobileMenuOpen(false)} className="text-[#9a9285] hover:text-[#d9a441] text-sm">Suppliers & Clients</a>
            <a href="#scenes" onClick={() => setMobileMenuOpen(false)} className="text-[#9a9285] hover:text-[#d9a441] text-sm">How It Works</a>
            <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="text-[#9a9285] hover:text-[#d9a441] text-sm">Live Demo</a>
            <a href="#model" onClick={() => setMobileMenuOpen(false)} className="text-[#9a9285] hover:text-[#d9a441] text-sm">Revenue Model</a>
            <div className="pt-3 border-t border-[#f4efe3]/10">
              <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 text-sm font-bold text-[#0b0c0a] bg-[#d9a441] rounded-xs">
                Get Instant Quote
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}