"use client";

import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

export default function FAQ() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
    { q: t.faqQ6, a: t.faqA6 },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <h2 className="text-4xl font-bold text-center text-primary mb-4">
          {t.faqTitle}
        </h2>
        <p className="text-center text-gray-600 mb-12">{t.faqSubtitle}</p>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 bg-light hover:bg-accent/30 transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-semibold text-primary">{faq.q}</span>
                <span
                  className={`text-2xl text-primary transition-transform duration-300 flex-shrink-0 ${
                    openIndex === idx ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 py-4 text-gray-700 bg-light/50">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}