import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://athiphouse-pai.com"),
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
    url: "https://athiphouse-pai.com",
    siteName: "A-Thip House @ Pai",
    title: "A-Thip House @ Pai | Peaceful Nature Stay in Pai",
    description:
      "Stay in a quiet and cozy guesthouse surrounded by nature in Pai, Thailand.",
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
      </head>
      <body className="bg-light text-darkText">
        {children}
      </body>
    </html>
  );
}