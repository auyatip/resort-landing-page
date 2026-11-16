"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";
import BookingGateButton from "./BookingGateButton";

export default function Hero() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const phoneNumber = "+66946765524";
  const whatsappLink = `https://wa.me/${phoneNumber.replace(
    "+",
    ""
  )}?text=Hello%20I%20am%20interested%20in%20booking%20a%20room%20at%20A-Thip%20House`;

  return (
     <section
      className="relative min-h-[760px] md:h-[840px] bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{
  backgroundImage:
    "linear-gradient(135deg, rgba(45, 80, 22, 0.56) 0%, rgba(45, 80, 22, 0.32) 100%), url('/images/exterior2.jpg')",
}}
    >

      {/* Decorative blur */}
      <div className="absolute top-32 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-16 w-56 h-56 bg-primary/5 rounded-full blur-3xl"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25"></div>

      <div className="relative z-10 text-center text-white px-5 max-w-5xl mx-auto pt-10 animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/30">
          <span className="text-xs md:text-sm font-poppins font-medium tracking-wider uppercase">
            {t.heroBadge}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif">
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl leading-tight mb-2">
            A-Thip House
          </span>
          <div className="h-1 w-20 bg-gradient-to-r from-accent via-accent to-transparent mx-auto my-4 rounded-full"></div>
        </h1>

        {/* Tagline */}
        <p className="text-base md:text-xl text-white/85 mb-3 font-poppins font-light tracking-wide drop-shadow-lg">
          {t.heroTagline}
        </p>
        <p className="text-xs md:text-sm text-white/80 mb-8 font-poppins tracking-widest uppercase">
          {t.heroLocation}
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
          <BookingGateButton
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-7 py-3.5 font-poppins font-bold text-primary shadow-lg transition-colors duration-200 hover:bg-[#d6b260]"
          >
            <iconify-icon icon="material-symbols:calendar-month" width="18" height="18" aria-hidden="true" />
            <span>{t.heroCheckAvailability}</span>
          </BookingGateButton>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/50 bg-white/10 px-7 py-3.5 font-poppins font-bold text-white transition-colors duration-200 hover:bg-white/20"
          >
            <iconify-icon icon="simple-icons:whatsapp" width="18" height="18" aria-hidden="true" />
            <span>{t.heroBookWhatsApp}</span>
          </a>
        </div>

        {/* Scroll */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-xs md:text-sm text-white/65 font-poppins tracking-wider">
            {t.heroScroll}
          </p>
          <div className="animate-bounce">
            <svg
              className="w-5 h-5 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
