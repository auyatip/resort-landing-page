"use client";

import React, { useState, useEffect } from "react";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* WhatsApp Float */}
      <a
        href="https://wa.me/66946765524?text=Hello%20I%20am%20interested%20in%20booking%20a%20room%20at%20A-Thip%20House"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-xl border border-[#25D366]/35 bg-white/95 text-[#128C7E] shadow-md backdrop-blur-md transition-colors duration-200 hover:bg-[#f2fff7] md:bottom-7 md:right-7"
        aria-label="Chat on WhatsApp"
      >
        <iconify-icon icon="simple-icons:whatsapp" width="22" height="22" aria-hidden="true" />
      </a>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-[4.25rem] z-40 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-primary text-white shadow-md transition-colors duration-200 hover:bg-[#2d5038] md:bottom-7 md:right-[6.75rem] ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <iconify-icon icon="material-symbols:keyboard-arrow-up" width="22" height="22" aria-hidden="true" />
      </button>
    </>
  );
}
