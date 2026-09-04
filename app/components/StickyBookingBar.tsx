"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

export default function StickyBookingBar() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phoneNumber = "+66946765524";
  const phoneLink = `tel:${phoneNumber}`;
  const whatsappLink = `https://wa.me/${phoneNumber.replace("+", "")}?text=Hi%20I%27m%20interested%20in%20booking%20a%20room%20at%20A-Thip%20House`;
  const lineLink = `https://lin.ee/TB4B1R9`;

  return (
    <>
      {show && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 shadow-2xl z-40 md:hidden animate-slide-up pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-lg mx-auto px-3 py-3 flex gap-2 justify-center">
            <a
              href={phoneLink}
              className="flex-1 cta-primary text-center text-xs py-3"
              title="Call now"
            >
              <iconify-icon icon="material-symbols:call" width="16" height="16" aria-hidden="true" /> {t.stickyCall}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 cta-primary text-center text-xs py-3 bg-[#25D366] hover:bg-[#1fba59]"
              title="WhatsApp"
            >
              {t.stickyWhatsApp}
            </a>
            <a
              href={lineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 cta-primary text-center text-xs py-3 bg-blue-500 hover:bg-blue-600"
              title="LINE"
            >
              <iconify-icon icon="simple-icons:line" width="16" height="16" aria-hidden="true" /> {t.stickyLINE}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
