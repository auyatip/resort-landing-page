"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-12">
      <div className="section-container section-padding">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">{t.footerBrand}</h3>
            <p className="text-accent">{t.footerTagline}</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t.footerContact}</h4>
            <div className="space-y-2">
              <p>
                📱{" "}
                <a href="tel:+66946765524" className="hover:text-accent transition">
                  +66 946765524
                </a>
              </p>
              <p>
                💬{" "}
                <a
                  href="https://wa.me/66946765524"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition"
                >
                  WhatsApp
                </a>
              </p>
              <p>
                📮 Pai, Mae Hong Son, Thailand{" "}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t.footerLocation}</h4>
            <p className="text-sm leading-relaxed">
              {t.footerLocationDesc}
            </p>
          </div>
        </div>

        <div className="border-t border-accent pt-8 text-center text-sm">
          <p>
            © {year} A-Thip House @ Pai. {t.footerCopyright}
          </p>
          <p className="mt-2 text-xs opacity-75">
            {t.footerCreated}
          </p>
        </div>
      </div>
    </footer>
  );
}