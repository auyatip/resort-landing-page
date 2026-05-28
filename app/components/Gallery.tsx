"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

const galleryImages = [
  // — Exterior & Nature views (first impression) —
  { src: "/images/571356702_122107554357056471_7702819512676027154_n.jpg", alt: "A-Thip House guesthouse exterior surrounded by nature in Pai" },
  { src: "/images/568894149_122107554267056471_2090220231538691756_n.jpg", alt: "Beautiful view of A-Thip House surrounded by lush greenery in Pai" },
  { src: "/images/572413623_122107554537056471_1359709838975656868_n.jpg", alt: "Beautiful nature view from A-Thip House Pai guesthouse" },
  { src: "/images/569579808_122107554459056471_2870940757230995704_n.jpg", alt: "Scenic mountain and nature view near A-Thip House Pai" },
  { src: "/images/255210.jpg", alt: "Peaceful courtyard and nature at A-Thip House Pai Thailand" },

  // — Cottage & Exterior details —
  { src: "/images/571205205_122107554495056471_2385969894286004164_n.jpg", alt: "Cottage style accommodation at A-Thip House Pai" },
  { src: "/images/569897459_122107554417056471_2994833732871230405_n.jpg", alt: "Charming guesthouse exterior at A-Thip House Pai" },
  { src: "/images/571366990_122107554687056471_170208840943873972_n.jpg", alt: "A-Thip House Pai beautiful guesthouse building" },

  // — Outdoor & Garden areas —
  { src: "/images/S__34668549_0.jpg", alt: "Outdoor seating area surrounded by greenery at A-Thip House" },
  { src: "/images/korea1.jpeg", alt: "Guest relaxing in the peaceful garden at A-Thip House" },
  { src: "/images/kore2.jpeg", alt: "Beautiful garden and outdoor area at A-Thip House Pai" },

  // — Room interiors —
  { src: "/images/570093910_122107554375056471_7287830858178467148_n.jpg", alt: "Cozy room interior with comfortable bed at A-Thip House Pai" },
  { src: "/images/762705357.jpg", alt: "Clean and cozy room at A-Thip House Pai Thailand" },
  { src: "/images/762705353.jpg", alt: "Air conditioned room with amenities at A-Thip House Pai" },
  { src: "/images/762705354.jpg", alt: "Comfortable bedroom at A-Thip House Pai" },
  { src: "/images/763355797.jpg", alt: "Well-appointed guest room at A-Thip House Pai" },

  // — Additional room & area photos —
  { src: "/images/IMG_2644.jpg", alt: "A-Thip House Pai guest room and facilities" },
  { src: "/images/IMG_2646.jpg", alt: "Guest accommodation at A-Thip House Pai" },
  { src: "/images/IMG_2661.jpg", alt: "Room detail at A-Thip House Pai Thailand" },
  { src: "/images/IMG_2668.jpg", alt: "A-Thip House Pai interior view" },
  { src: "/images/IMG_2676.jpg", alt: "Guesthouse room at A-Thip House Pai" },
  { src: "/images/IMG_2677.jpg", alt: "Comfortable stay at A-Thip House Pai" },
  { src: "/images/IMG_2687.jpg", alt: "Room amenities at A-Thip House Pai" },
  { src: "/images/IMG_2689.jpg", alt: "A-Thip House Pai accommodation detail" },
  { src: "/images/IMG_2746.jpg", alt: "Beautiful corner at A-Thip House Pai" },

  // — Bathrooms —
  { src: "/images/762705359.jpg", alt: "Private bathroom with hot shower at A-Thip House" },
  { src: "/images/toilet2.jpg", alt: "Clean private bathroom at A-Thip House" },
  { src: "/images/toilet3.jpg", alt: "Modern bathroom facilities at A-Thip House Pai" },

  // — Kitchen —
  { src: "/images/kitchen1.jpg", alt: "Shared kitchen facility at A-Thip House Pai" },
];

export default function Gallery() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Mobile slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [isTransitioning]
  );

  const goPrev = useCallback(() => {
    goTo(currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1);
  }, [currentIndex, goTo]);

  const goNext = useCallback(() => {
    goTo(currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, goTo]);

  // Touch/swipe handlers for mobile slider
  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0) goNext();
      else goPrev();
    }
  };

  // Keyboard navigation for slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, lightboxOpen]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Only render current + prev + next images for mobile slider (instead of all 27)
  const sliderIndices = useMemo(() => {
    const prev = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    const next = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    return [prev, currentIndex, next];
  }, [currentIndex]);

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-3 md:mb-4 animate-fade-in">
          {t.galleryTitle}
        </h2>
        <p className="text-center text-gray-600 mb-8 md:mb-12 animate-fade-in text-sm md:text-base">
          {t.gallerySubtitle}
        </p>

        {/* ========== Mobile Slider (< md) ========== */}
        <div className="md:hidden">
          <div className="relative">
            {/* Main slider image */}
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={() => openLightbox(currentIndex)}
            >
              {sliderIndices.map((index) => (
                <Image
                  key={index}
                  src={galleryImages[index].src}
                  alt={galleryImages[index].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 100vw"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${
                    index === currentIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                  }`}
                  priority={index === 0}
                />
              ))}

              {/* Prev Arrow — always visible on mobile */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm text-primary rounded-full w-9 h-9 flex items-center justify-center shadow-md active:scale-95 transition-transform z-10"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Arrow — always visible on mobile */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm text-primary rounded-full w-9 h-9 flex items-center justify-center shadow-md active:scale-95 transition-transform z-10"
                aria-label="Next image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Counter badge */}
              <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
                {currentIndex + 1} / {galleryImages.length}
              </div>

              {/* Tap to expand hint */}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center items-center gap-1.5 mt-3 flex-wrap">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-4"
                      : "bg-gray-300 w-1.5 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ========== Desktop Grid (md+) ========== */}
        <div className="hidden md:block">
          <div className="relative grid grid-cols-4 grid-rows-2 gap-3 rounded-2xl overflow-hidden h-[400px] lg:h-[500px]">
            {/* First large image — spans 2 cols, 2 rows */}
            <div
              className="col-span-2 row-span-2 cursor-pointer group relative overflow-hidden"
              onClick={() => openLightbox(0)}
            >
              <Image
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                fill
                sizes="(min-width: 768px) 50vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>

            {/* Images 2–5 */}
            {galleryImages.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="cursor-pointer group relative overflow-hidden"
                onClick={() => openLightbox(index + 1)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                {/* "+N more" overlay on the last visible image */}
                {index === 3 && galleryImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 flex items-center justify-center transition-all duration-300">
                    <span className="text-white font-semibold text-lg">
                      +{galleryImages.length - 5}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* View all photos button */}
            <button
              onClick={() => openLightbox(0)}
              className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-primary px-4 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm border border-gray-200"
            >
              {lang === "th"
                ? `ดูทั้งหมด ${galleryImages.length} รูป`
                : `View all ${galleryImages.length} photos`}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={galleryImages.map((img) => img.src)}
          alts={galleryImages.map((img) => img.alt)}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}