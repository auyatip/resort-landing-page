"use client";

import React from "react";
import { useLanguage } from "@/app/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-6 right-6 z-50 flex gap-2 bg-white rounded-lg shadow-md p-1">
      <button
        onClick={() => setLanguage("th")}
        className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
          language === "th"
            ? "bg-primary text-white"
            : "text-primary hover:bg-gray-100"
        }`}
      >
        ไทย
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
          language === "en"
            ? "bg-primary text-white"
            : "text-primary hover:bg-gray-100"
        }`}
      >
        English
      </button>
    </div>
  );
}
