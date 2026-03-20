import React from "react";

export default function Hero() {
  const phoneNumber = "+66946765524";
  const whatsappLink = `https://wa.me/${phoneNumber.replace(
    "+",
    ""
  )}?text=Hello%20I%20am%20interested%20in%20booking%20a%20room%20at%20A-Thip%20House`;

  return (
     <section
      className="relative h-screen md:h-[700px] bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{
  backgroundImage:
    "linear-gradient(135deg, rgba(45, 80, 22, 0.48) 0%, rgba(45, 80, 22, 0.32) 100%), url('/images/570093910_122107554375056471_7287830858178467148_n.jpg')",
}}
    >

      {/* Decorative blur */}
      <div className="absolute top-32 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-16 w-56 h-56 bg-primary/5 rounded-full blur-3xl"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25"></div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/25">
          <span className="text-xs md:text-sm font-poppins font-medium tracking-wider uppercase">
            ✨ Boutique Nature Stay
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif">
          <span className="block text-6xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl leading-tight mb-2">
            A-Thip House
          </span>
          <div className="h-1 w-20 bg-gradient-to-r from-accent via-accent to-transparent mx-auto my-4 rounded-full"></div>
        </h1>

        {/* Tagline */}
        <p className="text-base md:text-xl text-white/85 mb-3 font-poppins font-light tracking-wide drop-shadow-lg">
          Peaceful • Cozy • Surrounded by Nature
        </p>
        <p className="text-xs md:text-sm text-white/70 mb-12 font-poppins tracking-widest uppercase">
          2.3 km from Pai town center
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#rooms"
            className="group relative px-8 py-4 bg-accent text-primary font-bold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-poppins overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
            <span className="relative">Check Availability</span>
          </a>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-poppins overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
            <span className="relative">Book via WhatsApp</span>
          </a>
        </div>

        {/* Scroll */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <p className="text-xs md:text-sm text-white/65 font-poppins tracking-wider">
            Scroll down to explore
          </p>
          <div className="animate-bounce">
            <svg
              className="w-5 h-5 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}