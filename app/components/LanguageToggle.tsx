"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <button
      onClick={toggleLang}
      className="fixed right-16 top-4 z-[60] inline-flex h-10 items-center gap-1.5 rounded-lg border border-white/50 bg-white/40 px-2.5 text-xs font-semibold text-primary shadow-none backdrop-blur-md transition-colors duration-200 hover:bg-white/60 md:right-4 md:border-gray-200 md:bg-white/90 md:shadow-sm md:hover:bg-white"
      aria-label={lang === "en" ? "Switch to Thai" : "เปลี่ยนเป็นภาษาอังกฤษ"}
    >
      <iconify-icon icon="material-symbols:language" width="17" height="17" aria-hidden="true" />
      <span className="font-poppins">
        {lang === "en" ? "TH" : "EN"}
      </span>
    </button>
  );
}
