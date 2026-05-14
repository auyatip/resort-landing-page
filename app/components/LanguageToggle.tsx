"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300 text-sm font-semibold"
      aria-label="Switch language"
    >
      <span className="text-base">{lang === "en" ? "🇬🇧" : "🇹🇭"}</span>
      <span className="text-gray-700 font-poppins">
        {lang === "en" ? "TH" : "EN"}
      </span>
    </button>
  );
}