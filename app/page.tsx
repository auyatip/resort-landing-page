import React from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import PageContent from "./components/PageContent";
import StickyBookingBar from "./components/StickyBookingBar";
import FloatingButtons from "./components/FloatingButtons";
import Footer from "./components/Footer";

export const metadata = {
  title: "A-Thip House @ Pai | Peaceful Nature Stay in Pai",
  description:
    "Book a peaceful and cozy stay surrounded by nature in Pai. Perfect for long stays and digital nomads looking for a quiet retreat.",
  keywords:
    "Pai accommodation, Pai guesthouse, nature stay Pai, boutique hotel Pai, digital nomad Pai, long stay Pai",
  openGraph: {
    title: "A-Thip House @ Pai",
    description:
      "A peaceful and cozy guesthouse surrounded by nature in Pai, Thailand.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <Hero />
      <PageContent />
      <Footer />
      <StickyBookingBar />
      <FloatingButtons />
    </>
  );
}
