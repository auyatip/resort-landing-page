"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface LightboxProps {
  images: string[];
  alts?: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, alts, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isClosing, setIsClosing] = useState(false);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200);
  }, [onClose]);

  // Keyboard navigation (desktop)
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [handlePrev, handleNext, handleClose]);

  // Swipe support
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = touchStartRef.current.x - e.changedTouches[0].clientX;
    const dy = touchStartRef.current.y - e.changedTouches[0].clientY;
    // Horizontal swipe = navigate
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx > 0) handleNext();
      else handlePrev();
    }
    // Vertical swipe down = close
    if (dy < -60 && Math.abs(dy) > Math.abs(dx)) {
      handleClose();
    }
    touchStartRef.current = null;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 md:p-8 transition-opacity duration-200 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Simple centered image viewer */}
      <div
        className={`relative z-10 w-full max-w-5xl rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden transition-transform duration-200 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-3 bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-sm font-semibold text-gray-500 tabular-nums">
            <span className="text-white">{currentIndex + 1} / {images.length}</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center bg-gray-950 px-3 py-12 md:px-12 md:py-10">
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={alts?.[currentIndex] || "Gallery image"}
            className="max-w-full max-h-[62vh] md:max-h-[70vh] object-contain rounded-lg select-none animate-fade-in"
            draggable={false}
          />
        </div>

        {/* Navigation */}
        <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-between px-3 md:px-5">
          {/* Prev arrow */}
          <button
            onClick={handlePrev}
            className="pointer-events-auto w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next arrow */}
          <button
            onClick={handleNext}
            className="pointer-events-auto w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Next"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

async function downloadImage(src: string, alt?: string) {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = (alt || "athip-house-pai")
      .replace(/[^a-zA-Z0-9ก-๙\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);
    const ext = src.split(".").pop() || "jpg";
    link.download = `${filename}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch {
    window.open(src, "_blank");
  }
}
