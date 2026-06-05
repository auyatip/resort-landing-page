"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#rooms", label: "Rooms" },
    { href: "#gallery", label: "Gallery" },
    { href: "#about", label: "About" },
    { href: "#reviews", label: "Reviews" },
    { href: "#faq", label: "FAQ" },
    { href: "#location", label: "Location" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className={`text-xl font-serif font-bold transition-colors ${scrolled ? "text-primary" : "text-white"}`}>
              A-Thip House
            </span>
            <span className={`hidden sm:inline text-xs font-poppins tracking-wider transition-colors ${scrolled ? "text-gray-500" : "text-white/70"}`}>
              @ Pai
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-poppins rounded-lg transition-all hover:bg-primary/10 ${
                  scrolled ? "text-gray-700 hover:text-primary" : "text-white/85 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/pai-guide"
              className={`ml-2 px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                scrolled
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30"
              }`}
            >
              <span>🗺️</span>
              <span>Pai Guide</span>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-gray-700" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg font-poppins text-sm"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/pai-guide"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm mt-2 text-center"
            >
              🗺️ Pai Travel Guide
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}