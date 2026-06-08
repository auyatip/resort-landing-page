"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

type GalleryCategory = "all" | "exterior" | "rooms" | "bathroom" | "kitchen";

interface GalleryImage {
  src: string;
  alt: string;
  category: GalleryCategory[];
}

const galleryImages: GalleryImage[] = [
  // — Exterior views —
  { src: "/images/exterior.jpg", alt: "A-Thip House guesthouse exterior surrounded by nature in Pai", category: ["exterior"] },
  { src: "/images/exterior1.jpg", alt: "Beautiful nature view from A-Thip House Pai guesthouse", category: ["exterior"] },
  { src: "/images/exterior2.jpg", alt: "Peaceful courtyard and nature at A-Thip House Pai Thailand", category: ["exterior"] },
  { src: "/images/exterior3.jpg", alt: "Cottage style accommodation at A-Thip House Pai", category: ["exterior"] },
  { src: "/images/exterior4.jpg", alt: "Charming guesthouse exterior at A-Thip House Pai", category: ["exterior"] },
  { src: "/images/exterior5.jpg", alt: "A-Thip House Pai beautiful guesthouse building", category: ["exterior"] },
  { src: "/images/exterior6.jpg", alt: "Scenic mountain and nature view near A-Thip House Pai", category: ["exterior"] },
  { src: "/images/exterior7.jpg", alt: "Guesthouse entrance and surroundings at A-Thip House", category: ["exterior"] },
  { src: "/images/exterior8.jpg", alt: "A-Thip House Pai outdoor area and landscape", category: ["exterior"] },
  { src: "/images/exterior9.jpg", alt: "Lush greenery around A-Thip House Pai guesthouse", category: ["exterior"] },
  { src: "/images/exterior10.jpg", alt: "Beautiful exterior view of A-Thip House Pai", category: ["exterior"] },
  { src: "/images/exterior11.jpg", alt: "A-Thip House Pai guesthouse surrounded by nature", category: ["exterior"] },

  // — Room interiors —
  { src: "/images/570093910_122107554375056471_7287830858178467148_n.jpg", alt: "Cozy room interior with comfortable bed at A-Thip House Pai", category: ["rooms"] },
  { src: "/images/room1.jpg", alt: "Clean and cozy room at A-Thip House Pai Thailand", category: ["rooms"] },
  { src: "/images/room2.jpg", alt: "Air conditioned room with amenities at A-Thip House Pai", category: ["rooms"] },
  { src: "/images/room3.jpg", alt: "Comfortable bedroom at A-Thip House Pai", category: ["rooms"] },
  { src: "/images/room4.jpg", alt: "Well-appointed guest room at A-Thip House Pai", category: ["rooms"] },
  { src: "/images/IMG_2661.jpg", alt: "Room detail at A-Thip House Pai Thailand", category: ["rooms"] },
  { src: "/images/IMG_2689.jpg", alt: "A-Thip House Pai accommodation detail", category: ["rooms"] },

  // — Bathrooms —
  { src: "/images/bathroom.jpg4.jpg", alt: "Private bathroom with hot shower at A-Thip House", category: ["bathroom"] },
  { src: "/images/bathroom1.jpg", alt: "Clean private bathroom at A-Thip House", category: ["bathroom"] },
  { src: "/images/bathroom2.jpg", alt: "Modern bathroom facilities at A-Thip House Pai", category: ["bathroom"] },
  { src: "/images/bathroom3.jpg.jpg", alt: "Bathroom with amenities at A-Thip House Pai", category: ["bathroom"] },
  { src: "/images/toilet.jpg", alt: "Toilet and bathroom at A-Thip House Pai", category: ["bathroom"] },

  // — Kitchen —
  { src: "/images/kitchen1.jpg", alt: "Shared kitchen facility at A-Thip House Pai", category: ["kitchen"] },
];

const categoryConfig: { key: GalleryCategory; emoji: string }[] = [
  { key: "all", emoji: "🖼️" },
  { key: "exterior", emoji: "🏠" },
  { key: "rooms", emoji: "🛏️" },
  { key: "bathroom", emoji: "🚿" },
  { key: "kitchen", emoji: "🍳" },
];

export default function Gallery() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Category filter state
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Mobile slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  // Filtered images based on category
  const filteredImages = useMemo(() => {
    if (activeCategory === "all") return galleryImages;
    return galleryImages.filter((img) => img.category.includes(activeCategory));
  }, [activeCategory]);

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
    goTo(currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1);
  }, [currentIndex, goTo, filteredImages.length]);

  const goNext = useCallback(() => {
    goTo(currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, goTo, filteredImages.length]);

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

  // Reset slider index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Only render current + prev + next images for mobile slider
  const sliderIndices = useMemo(() => {
    const prev = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    const next = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    return [prev, currentIndex, next];
  }, [currentIndex, filteredImages.length]);

  // Get category label
  const getCategoryLabel = (key: GalleryCategory): string => {
    const labels: Record<GalleryCategory, { en: string; th: string }> = {
      all: { en: "All", th: "ทั้งหมด" },
      exterior: { en: "Exterior", th: "อาคารและวิว" },
      rooms: { en: "Rooms", th: "ห้องพัก" },
      bathroom: { en: "Bathroom", th: "ห้องน้ำ" },
      kitchen: { en: "Kitchen", th: "ครัว" },
    };
    return labels[key][lang];
  };

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-3 md:mb-4 animate-fade-in">
          {t.galleryTitle}
        </h2>
        <p className="text-center text-gray-600 mb-6 md:mb-8 animate-fade-in text-sm md:text-base">
          {t.gallerySubtitle}
        </p>

        {/* ========== Category Filter Tabs ========== */}
        <div className="flex justify-center mb-6 md:mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categoryConfig.map(({ key, emoji }) => {
              const count = key === "all"
                ? galleryImages.length
                : galleryImages.filter((img) => img.category.includes(key)).length;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === key
                      ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-102"
                  }`}
                >
                  <span className="text-base">{emoji}</span>
                  <span>{getCategoryLabel(key)}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeCategory === key
                      ? "bg-white/25 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

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
                  src={filteredImages[index].src}
                  alt={filteredImages[index].alt}
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

              {/* Prev Arrow */}
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

              {/* Next Arrow */}
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
                {currentIndex + 1} / {filteredImages.length}
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
              {filteredImages.map((_, index) => (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredImages.map((image, index) => (
              <div
                key={image.src}
                className={`cursor-pointer group relative overflow-hidden rounded-xl ${
                  // Make first image larger when showing all
                  activeCategory === "all" && index === 0
                    ? "col-span-2 row-span-2 aspect-square"
                    : "aspect-[4/3]"
                }`}
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  loading={index < 8 ? "eager" : "lazy"}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                {/* Hover overlay with icons */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    {/* Preview icon */}
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                    {/* Download icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image.src, image.alt);
                      }}
                      className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      title={lang === "th" ? "บันทึกรูปภาพ" : "Save image"}
                    >
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Category badge */}
                {activeCategory === "all" && (
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.category.map((cat) => getCategoryLabel(cat)).join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">{lang === "th" ? "ไม่มีรูปภาพในหมวดหมู่นี้" : "No images in this category"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={filteredImages.map((img) => img.src)}
          alts={filteredImages.map((img) => img.alt)}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}

// Download helper function
async function downloadImage(src: string, alt: string) {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // Create a clean filename from alt text
    const filename = alt
      .replace(/[^a-zA-Z0-9ก-๙\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);
    const ext = src.split(".").pop() || "jpg";
    link.download = `${filename}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    // Fallback: open in new tab
    window.open(src, "_blank");
  }
}