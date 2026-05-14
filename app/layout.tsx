import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import LanguageToggle from "./components/LanguageToggle";
import JsonLd from "./components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://a-thip-housepai.vercel.app"),
  title: {
    template: "%s | A-Thip House @ Pai",
    default: "A-Thip House @ Pai | Peaceful Nature Stay in Pai",
  },
  description:
    "Book a peaceful and cozy stay surrounded by nature in Pai. Perfect for long stays and digital nomads seeking a quiet retreat.",
  keywords: [
    "Pai accommodation",
    "Pai guesthouse",
    "nature stay Pai",
    "boutique hotel Pai",
    "digital nomad Pai",
    "long stay Pai",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://a-thip-housepai.vercel.app",
    siteName: "A-Thip House @ Pai",
    title: "A-Thip House @ Pai | Peaceful Nature Stay in Pai",
    description:
      "Stay in a quiet and cozy guesthouse surrounded by nature in Pai, Thailand.",
    images: [
      {
        url: "/images/570093910_122107554375056471_7287830858178467148_n.jpg",
        width: 1200,
        height: 630,
        alt: "A-Thip House @ Pai - Peaceful Nature Stay",
      },
    ],
  },
  alternates: {
    canonical: "https://a-thip-housepai.vercel.app",
    languages: {
      "en": "https://a-thip-housepai.vercel.app",
      "th": "https://a-thip-housepai.vercel.app",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2D5016" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏡</text></svg>"
        />
        <JsonLd />
      </head>
      <body className="bg-light text-darkText">
        <LanguageProvider>
          <LanguageToggle />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}