"use client";

import React, { useState, useCallback, useEffect } from "react";
import Lightbox from "./Lightbox";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

const galleryImages = [
  { src: "/images/571356702_122107554357056471_7702819512676027154_n.jpg", alt: "A-Thip House guesthouse exterior surrounded by nature in Pai" },
  { src: "/images/570093910_122107554375056471_7287830858178467148_n.jpg", alt: "Cozy room interior with comfortable bed at A-Thip House Pai" },
  { src: "/images/korea1.jpeg", alt: "Guest relaxing in the peaceful garden at A-Thip House" },
  { src: "/images/572413623_122107554537056471_1359709838975656868_n.jpg", alt: "Beautiful nature view from A-Thip House Pai guesthouse" },
  { src: "/images/571205205_122107554495056471_2385969894286004164_n.jpg", alt: "Cottage style accommodation at A-Thip House Pai" },
  { src: "/images/762705357.jpg", alt: "Clean and cozy room at A-Thip House Pai Thailand" },
  { src: "/images/762705353.jpg", alt: "Air conditioned room with amenities at A-Thip House Pai" },

  { src: "/images/762705359.jpg", alt: "Private bathroom with hot shower at A-Thip House" },
  { src: "/images/toilet2.jpg", alt: "Private bathroom with hot shower at A-Thip House" },
  { src: "/images/toilet3.jpg", alt: "Private bathroom with hot shower at A-Thip House" },
  { src: "/images/toilet4.jpg", alt: "Private bathroom with hot shower at A-Thip House" },

  { src: "/images/S__34668549_0.jpg", alt: "Outdoor seating area surrounded by greenery at A-Thip House" },
  { src: "/images/kitchen1.jpg", alt: "Shared kitchen facility at A-Thip House Pai" },
  { src: "/images/255210.jpg", alt: "Peaceful courtyard and nature at A-Thip House Pai Thailand" },

];

export default function Gallery() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, lightboxOpen]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      if (distance > 0) goNext();
      else goPrev();
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="section-container">
        <h2 className="text-4xl font-bold text-center text-primary mb-4 animate-fade-in">
          {t.galleryTitle}
        </h2>
        <p className="text-center text-gray-600 mb-12 animate-fade-in">
          {t.gallerySubtitle}
        </p>

        {/* Main Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Image */}
          <div
            className="relative h-64 sm:h-80 md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => openLightbox(currentIndex)}
          >
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  index === currentIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>
            ))}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>

            {/* Prev Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image counter */}
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
              {currentIndex + 1} / {galleryImages.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 justify-center">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                  index === currentIndex
                    ? "border-primary scale-110 shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={galleryImages.map((img) => img.src)}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}