"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "th";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null;
    const nextLang = saved === "th" || saved === "en" ? saved : "en";
    setLang(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.classList.toggle("thai-font", nextLang === "th");
    setMounted(true);
  }, []);

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === "en" ? "th" : "en";
      localStorage.setItem("lang", next);
      document.documentElement.lang = next;
      document.documentElement.classList.toggle("thai-font", next === "th");
      return next;
    });
  };

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
