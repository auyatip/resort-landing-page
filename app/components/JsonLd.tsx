export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "A-Thip House @ Pai",
    description:
      "A peaceful and cozy guesthouse surrounded by nature in Pai, Thailand. Perfect for long stays and digital nomads.",
    url: "https://athiphouse-pai.com",
    telephone: "+66946765524",
    address: {
      "@type": "PostalAddress",
      streetAddress: "2.3 km from Pai Town Center",
      addressLocality: "Pai",
      addressRegion: "Mae Hong Son",
      postalCode: "58130",
      addressCountry: "TH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.3581,
      longitude: 98.4225,
    },
    priceRange: "฿1,200 - ฿1,500",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "6",
      bestRating: "5",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Karn" },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody:
          "เราพักที่ A-Thip House@Pai ได้อย่างยอดเยี่ยมมาก สถานที่ตั้งอยู่ท่ามกลางธรรมชาติสวยงาม",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Schubert" },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody:
          "Beautifully situated in nature with clean rooms and courteous staff.",
      },
    ],
    image: [
      "https://athiphouse-pai.com/images/570093910_122107554375056471_7287830858178467148_n.jpg",
      "https://athiphouse-pai.com/images/762705354.jpg",
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
    ],
    checkinTime: "14:00",
    checkoutTime: "12:00",
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How far is A-Thip House from Pai town center?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A-Thip House is located just 2.3 km from Pai town center, approximately 5-10 minutes by motorbike or car.",
        },
      },
      {
        "@type": "Question",
        name: "Is WiFi available at A-Thip House?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, free high-speed WiFi is available throughout the property, perfect for digital nomads and remote workers.",
        },
      },
      {
        "@type": "Question",
        name: "What are the check-in and check-out times?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check-in is at 2:00 PM and check-out is at 12:00 PM. Early check-in or late check-out may be arranged upon request.",
        },
      },
      {
        "@type": "Question",
        name: "Is A-Thip House suitable for long stays?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! A-Thip House is perfect for long stays with amenities like shared kitchen, fast WiFi, and a quiet workspace. Monthly rates are available.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  );
}