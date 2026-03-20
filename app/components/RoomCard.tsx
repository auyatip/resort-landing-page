import React from "react";

interface RoomCardProps {
  image: string;
  name: string;
  features: string[];
  price: string;
}

export default function RoomCard({ image, name, features, price }: RoomCardProps) {
  return (
    <div className="w-full max-w-2xl animate-fade-in">
      {/* Featured Room Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Image Container with overlay */}
        <div className="relative h-96 bg-gray-300 overflow-hidden group">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
            <p className="text-sm font-poppins text-gray-500 uppercase tracking-widest mb-4">Amenities</p>
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
              href="https://lin.ee/TB4B1R9"
              className="flex-1 px-6 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-poppins text-center"
            >
              Book via LINE
            </a>
            <a
              href="https://wa.me/66946765524?text=Hi%20I%27m%20interested%20in%20booking%20a%20room%20at%20A-Thip%20House"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-poppins text-center"
            >
              Book via WhatsApp
            </a>
          </div>

          {/* Info text */}
          <p className="text-center text-xs text-gray-500 mt-4 font-poppins">
            Need more info? Call: <span className="font-semibold">+66 946765524</span>
          </p>
        </div>
      </div>
    </div>
  );
}
