"use client";

import React, { useState, useEffect } from "react";

export default function StickyBookingBar() {
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 md:hidden animate-slide-up">
          <div className="max-w-lg mx-auto px-4 py-2 flex gap-2 justify-center">
            <a
              href={phoneLink}
              className="flex-1 cta-primary text-center text-sm py-1"
              title="Call now"
            >
              📞 Call
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 cta-primary text-center text-sm py-2 bg-green-500 hover:bg-green-600"
              title="WhatsApp"
            >
              WhatsApp
            </a>
            <a
              href={lineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 cta-primary text-center text-sm py-2 bg-blue-500 hover:bg-blue-600"
              title="LINE"
            >
              📱 LINE
            </a>
          </div>
        </div>
      )}
    </>
  );
}
