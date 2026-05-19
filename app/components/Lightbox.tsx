"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface LightboxProps {
  images: string[];
  alts?: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, alts, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 300);
  }, [images.length, isAnimating]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 300);
  }, [images.length, isAnimating]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200);
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, handleClose]);

  // Lock body scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailScrollRef.current) {
      const activeThumb = thumbnailScrollRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  // Touch handlers for swipe
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
      if (distance > 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black z-50 flex flex-col transition-opacity duration-200 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white shrink-0">
        <span className="text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Close lightbox"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 relative flex items-center justify-center min-h-0 px-4 md:px-12"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image container with transition */}
        <div className="relative w-full h-full flex items-center justify-center">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={alts?.[index] || "Gallery image"}
              className={`absolute max-w-full max-h-full object-contain transition-all duration-300 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
              draggable={false}
            />
          ))}
        </div>

        {/* Prev button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          aria-label="Next image"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="shrink-0 px-4 pb-4 pt-2">
        <div
          ref={thumbnailScrollRef}
          className="flex gap-2 overflow-x-auto py-2 justify-center scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 300);
                }
              }}
              className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                index === currentIndex
                  ? "border-white scale-110 shadow-lg"
                  : "border-white/20 opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={image}
                alt={alts?.[index] || "Thumbnail"}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}