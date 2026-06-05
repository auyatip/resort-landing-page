"use client";

import { useState } from "react";
import { GuideFAQ as GuideFAQType } from "../../lib/pai-guide/types";

export default function GuideFAQ({ faqs }: { faqs: GuideFAQType[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-primary pr-4">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-gray-700 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}