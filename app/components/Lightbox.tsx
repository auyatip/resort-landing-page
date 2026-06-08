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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center transition-opacity duration-200 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Mobile: Bottom sheet / Desktop: Centered card */}
      <div
        className={`relative z-10 w-full md:max-w-3xl md:rounded-2xl rounded-t-2xl bg-white shadow-2xl flex flex-col transition-transform duration-200 ${
          isClosing ? "translate-y-full md:scale-95" : "translate-y-0 md:scale-100"
        }`}
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-2 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm font-medium text-gray-400">
            {currentIndex + 1} / {images.length}
          </span>

          <div className="flex items-center gap-1">
            {/* Download */}
            <button
              onClick={() => downloadImage(images[currentIndex], alts?.[currentIndex])}
              className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Save image"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            {/* Close */}
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center px-2">
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={alts?.[currentIndex] || "Gallery image"}
            className="max-w-full max-h-[60vh] object-contain rounded-lg select-none"
            draggable={false}
          />
        </div>

        {/* Nav arrows + thumbnails row */}
        <div className="flex items-center gap-2 px-2 py-3 border-t border-gray-100">
          {/* Prev arrow */}
          <button
            onClick={handlePrev}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Thumbnails */}
          <div
            className="flex-1 flex gap-1.5 overflow-x-auto py-1 justify-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                  index === currentIndex
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent opacity-40 hover:opacity-70"
                }`}
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={handleNext}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors"
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