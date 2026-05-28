"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

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
  const [dragDownY, setDragDownY] = useState(0);
  // Track which images have been loaded
  const [loadedImages, setLoadedImages] = useState<Set<number>>(() => new Set([initialIndex]));
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isDraggingDownRef = useRef(false);

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

  // Mark image as loaded
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  // Preload adjacent images when currentIndex changes
  useEffect(() => {
    const prevIdx = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    const nextIdx = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    [prevIdx, currentIndex, nextIdx].forEach((idx) => {
      const img = new window.Image();
      img.src = images[idx];
      img.onload = () => handleImageLoad(idx);
    });
  }, [currentIndex, images, handleImageLoad]);

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

  // Touch handlers — swipe horizontal for nav, swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now(),
    };
    isDraggingDownRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.targetTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.targetTouches[0].clientY - touchStartRef.current.y;

    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
      isDraggingDownRef.current = true;
      const rubberBand = deltaY * 0.4;
      setDragDownY(rubberBand);
    } else {
      isDraggingDownRef.current = false;
      setDragDownY(0);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

    if (isDraggingDownRef.current) {
      if (deltaY > 100) {
        handleClose();
      }
      setDragDownY(0);
      isDraggingDownRef.current = false;
      return;
    }

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) handleNext();
      else handlePrev();
    }

    touchStartRef.current = null;
  };

  // Tap on dark background to close
  const handleImageAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const dragOpacity = isClosing ? 0 : Math.max(0.3, 1 - dragDownY / 400);

  // Determine which images to render: current + prev + next + any that are already loaded nearby
  const prevIdx = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
  const nextIdx = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
  const renderIndices = [prevIdx, currentIndex, nextIdx];

  return (
    <div
      className={`fixed inset-0 bg-black z-[60] flex flex-col transition-opacity duration-200 ${
        isClosing ? "opacity-0" : ""
      }`}
      style={{
        opacity: isClosing ? undefined : dragOpacity,
        transform: `translateY(${dragDownY}px)`,
        transition: dragDownY === 0 ? "opacity 0.2s" : "none",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 text-white shrink-0">
        <div className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-sm font-semibold">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <button
          onClick={handleClose}
          className="w-12 h-12 rounded-full bg-white/25 hover:bg-white/40 active:bg-white/50 flex items-center justify-center transition-all active:scale-90 backdrop-blur-sm"
          aria-label="Close lightbox"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Swipe down hint */}
      {dragDownY > 30 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full pointer-events-none animate-pulse">
          ↕ ปัดลงเพื่อปิด / Swipe down to close
        </div>
      )}

      {/* Main image area */}
      <div
        className="flex-1 relative flex items-center justify-center min-h-0 px-4 md:px-12 cursor-pointer"
        onClick={handleImageAreaClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          {renderIndices.map((index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              {/* Loading spinner while image hasn't loaded */}
              {!loadedImages.has(index) && index === currentIndex && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <img
                src={images[index]}
                alt={alts?.[index] || "Gallery image"}
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{ 
                  opacity: loadedImages.has(index) ? 1 : 0,
                  transition: "opacity 0.3s"
                }}
                onLoad={() => handleImageLoad(index)}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Prev button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all active:scale-90"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all active:scale-90"
          aria-label="Next image"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bottom bar: thumbnails */}
      <div className="shrink-0 px-4 pb-4 pt-2">
        <div className="md:hidden flex justify-center mb-2">
          <button
            onClick={handleClose}
            className="text-white/50 text-xs flex items-center gap-1.5 active:text-white/80"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            แตะพื้นที่ว่างเพื่อปิด / Tap outside to close
          </button>
        </div>

        {/* Thumbnail strip */}
        <div
          ref={thumbnailScrollRef}
          className="flex gap-1.5 overflow-x-auto py-1 justify-center scrollbar-hide"
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
              className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                index === currentIndex
                  ? "border-white scale-110 shadow-lg"
                  : "border-white/20 opacity-40 hover:opacity-70"
              }`}
            >
              <Image
                src={image}
                alt={alts?.[index] || "Thumbnail"}
                width={56}
                height={56}
                sizes="56px"
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