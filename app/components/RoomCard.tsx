"use client";

import React, { useState } from "react";
import Image from "next/image";

interface RoomCardProps {
  image: string;
  galleryImages?: string[];
  name: string;
  features: string[];
  price: string;
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
    <div className="w-full max-w-2xl animate-fade-in">
      {/* Featured Room Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Image Container with overlay */}
        <div className="relative h-96 bg-gray-300 overflow-hidden group">
          <Image
            src={images[activeImage]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {images.length > 1 && <>
            <button type="button" onClick={showPrevious} className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-2xl text-white backdrop-blur-sm transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white" aria-label={`Previous ${name} photo`}>
              ‹
            </button>
            <button type="button" onClick={showNext} className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-primary shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white" aria-label={`Next ${name} photo`}>
              ›
            </button>
            <span className="absolute bottom-4 right-4 z-20 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">{activeImage + 1} / {images.length}</span>
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
        <div className="p-8 md:p-10">
          {/* Title with accent */}
          <div className="mb-6">
            <h3 className="text-4xl md:text-4xl font-serif font-bold text-primary mb-2">{name}</h3>
            <div className="h-1 w-16 bg-gradient-to-r from-accent to-transparent rounded-full"></div>
          </div>

          {/* Features Grid */}
          <div className="mb-8">
            <p className="text-sm font-poppins text-gray-500 uppercase tracking-widest mb-4">{amenitiesLabel}</p>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-accent text-lg">✓</span>
                  <span className="text-gray-700 text-sm font-poppins">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Section */}
          {/* <div className="bg-gradient-to-r from-accent/10 to-secondary/10 rounded-2xl p-6 mb-6">
            <p className="text-xs font-poppins text-gray-600 uppercase tracking-widest mb-2">Price Per Night</p>
            <p className="text-3xl md:text-4xl font-bold text-secondary font-serif">{price}</p>
          </div> */}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/booking"
              className="flex-1 px-6 py-4 bg-accent text-primary font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-poppins text-center"
            >
              Check dates & book
            </a>
            <a
              href="https://lin.ee/TB4B1R9"
              className="flex-1 px-6 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-poppins text-center"
            >
              {bookLineText}
            </a>
            <a
              href="https://wa.me/66946765524?text=Hi%20I%27m%20interested%20in%20booking%20a%20room%20at%20A-Thip%20House"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-poppins text-center"
            >
              {bookWhatsAppText}
            </a>
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
