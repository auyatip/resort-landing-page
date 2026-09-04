"use client";

import React, { useState } from "react";
import Image from "next/image";
import BookingGateButton from "./BookingGateButton";

interface RoomCardProps {
  image: string;
  galleryImages?: string[];
  name: string;
  features: string[];
  price: string;
  priceLabel?: string;
  primaryBookText?: string;
  amenitiesLabel?: string;
  bookLineText?: string;
  bookWhatsAppText?: string;
  needInfoText?: string;
}

export default function RoomCard({
  image,
  galleryImages = [image],
  name,
  features,
  price,
  priceLabel = "Price per night",
  primaryBookText = "Check dates & book",
  amenitiesLabel = "Amenities",
  bookLineText = "Book via LINE",
  bookWhatsAppText = "Book via WhatsApp",
  needInfoText = "Need more info? Call:",
}: RoomCardProps) {
  const images = galleryImages.length ? galleryImages : [image];
  const [activeImage, setActiveImage] = useState(0);
  const showPrevious = () => setActiveImage((current) => (current - 1 + images.length) % images.length);
  const showNext = () => setActiveImage((current) => (current + 1) % images.length);
  return (
    <div className="w-full max-w-2xl">
      {/* Featured Room Card */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-md">
        {/* Image Container with overlay */}
        <div className="relative aspect-[4/3] bg-gray-300 overflow-hidden group sm:aspect-[16/10]">
          <Image
            src={images[activeImage]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-cover"
            priority
          />
          {images.length > 1 && <>
            <button type="button" onClick={showPrevious} className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-2xl text-white backdrop-blur-sm transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white" aria-label={`Previous ${name} photo`}>
              <iconify-icon icon="material-symbols:chevron-left" width="24" height="24" aria-hidden="true" />
            </button>
            <button type="button" onClick={showNext} className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-primary shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white" aria-label={`Next ${name} photo`}>
              <iconify-icon icon="material-symbols:chevron-right" width="24" height="24" aria-hidden="true" />
            </button>
            <span className="absolute bottom-4 right-4 z-20 rounded-md bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">{activeImage + 1} / {images.length}</span>
          </>}
        </div>

        <div className="flex gap-2 overflow-x-auto bg-white px-6 pt-4" aria-label={`${name} photo thumbnails`}>
          {images.map((src, index) => (
            <button type="button" key={src} onClick={() => setActiveImage(index)} className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg transition ${activeImage === index ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"}`} aria-label={`Show photo ${index + 1}`}>
              <Image src={src} alt={`${name} photo ${index + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>

        {/* Content Container */}
        <div className="p-5 sm:p-8">
          {/* Title with accent */}
          <div className="mb-6">
            <h3 className="text-3xl font-serif font-bold text-primary mb-2">{name}</h3>
            <div className="h-px w-12 bg-accent"></div>
          </div>

          {/* Features Grid */}
          <div className="mb-8">
            <p className="text-xs font-poppins text-gray-500 uppercase tracking-widest mb-4">{amenitiesLabel}</p>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <iconify-icon className="text-accent" icon="material-symbols:check" width="18" height="18" aria-hidden="true" />
                  <span className="text-gray-700 text-sm font-poppins">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 border-y border-primary/10 py-4">
            <p className="mb-1 text-xs font-poppins uppercase tracking-widest text-gray-500">{priceLabel}</p>
            <p className="font-serif text-3xl font-bold text-primary">{price}</p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <BookingGateButton
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3.5 text-center font-poppins font-bold text-primary shadow-[0_6px_16px_rgba(196,154,66,0.22)] transition-colors duration-200 hover:bg-[#d6b260]"
            >
              <iconify-icon icon="material-symbols:calendar-month" width="18" height="18" aria-hidden="true" />
              {primaryBookText}
            </BookingGateButton>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://lin.ee/TB4B1R9"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary bg-transparent px-3 py-3 text-center text-sm font-poppins font-semibold text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
              >
                {bookLineText}
              </a>
              <a
                href="https://wa.me/66946765524?text=Hi%20I%27m%20interested%20in%20booking%20a%20room%20at%20A-Thip%20House"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-green-600 bg-transparent px-3 py-3 text-center text-sm font-poppins font-semibold text-green-700 transition-colors duration-200 hover:bg-green-600 hover:text-white"
              >
                {bookWhatsAppText}
              </a>
            </div>
          </div>

          {/* Info text */}
          <p className="text-center text-xs text-gray-500 mt-4 font-poppins">
            {needInfoText} <span className="font-semibold">+66 946765524</span>
          </p>
        </div>
      </div>
    </div>
  );
}
