"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

export default function PromoBanner() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary text-white">
      <div className="section-container section-padding">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block px-4 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold mb-4">
              ✨ {t.promoTag}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
              {t.promoTitle}
            </h2>
            <p className="text-lg opacity-90 mb-6">
              {t.promoSubtitle}
            </p>
            <a
              href="https://wa.me/66946765524?text=Hi%20I%27m%20interested%20in%20a%20monthly%20stay%20at%20A-Thip%20House"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-accent text-primary font-bold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-poppins"
            >
              {t.promoCta}
            </a>
          </div>
          <div className="flex-1 max-w-sm">
            <img
              src="/images/monthly_promote.png"
              alt="A-Thip House Pai Monthly Promotion"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
    </section>
  );
}