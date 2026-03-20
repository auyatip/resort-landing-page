import React from "react";

interface ReviewCardProps {
  name: string;
  rating: number;
  text: string;
}

export default function ReviewCard({ name, rating, text }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 animate-fade-in">
      <div className="flex items-center mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">★</span>
        ))}
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">{text}</p>
      <p className="font-semibold text-primary">{name}</p>
    </div>
  );
}
