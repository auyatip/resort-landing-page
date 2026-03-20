"use client";

import React, { useState } from "react";
import Lightbox from "./Lightbox";

const galleryImages = [
  "/images/571356702_122107554357056471_7702819512676027154_n.jpg",
  "/images/570093910_122107554375056471_7287830858178467148_n.jpg",
  "/images/korea1.jpeg",
  "/images/572413623_122107554537056471_1359709838975656868_n.jpg",
  "/images/571205205_122107554495056471_2385969894286004164_n.jpg",

  "/images/762705357.jpg",

  "/images/762705359.jpg",
   "/images/762705353.jpg",


  "/images/S__34668549_0.jpg",
  "/images/255210.jpg",


];

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="section-container">
        <h2 className="text-4xl font-bold text-center text-primary mb-4 animate-fade-in">
          Gallery
        </h2>
        <p className="text-center text-gray-600 mb-12 animate-fade-in">
          Beautiful moments at A-Thip House @ Pai
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="h-64 rounded-xl overflow-hidden cursor-pointer group animate-fade-in"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={galleryImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
