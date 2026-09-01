import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ALL_GUIDES, BOOKING_CTA } from "../lib/pai-guide/guides";
import { GuideContent } from "../lib/pai-guide/types";
import GuideCard from "../components/pai-guide/GuideCard";

const CLUSTERS: Record<string, { icon: string; name: string; description: string }> = {
  travel: { icon: "🏔️", name: "Pai Travel", description: "Itineraries, attractions, and things to do" },
  "slow-living": { icon: "🧘", name: "Slow Living", description: "Wellness, slow travel, and mindful living" },
  "digital-nomad": { icon: "💻", name: "Digital Nomad", description: "Remote work, coworking, and nomad life" },
  "food-transport": { icon: "🛵", name: "Food & Transport", description: "Best food, delivery apps, and getting around Pai" },
};

export const metadata: Metadata = {
  title: "Pai Travel Guide 2026 — By Athip House Pai | Authentic Pai Slow Living",
  description:
    "Your complete guide to Pai, Thailand. Itineraries, best places to stay, digital nomad tips, waterfalls, cafes, weather, and local secrets from the team at Athip House Pai.",
  keywords: [
    "Pai travel guide", "Pai Thailand", "things to do in Pai",
    "Pai itinerary", "where to stay in Pai", "Pai travel tips", "Athip House Pai",
  ],
  openGraph: {
    title: "Pai Travel Guide 2026 — By Athip House Pai",
    description: "Your complete guide to Pai, Thailand. Itineraries, local tips, and everything you need to plan your Pai trip.",
    url: "https://athiphousepai.com/pai-guide",
    siteName: "Athip House Pai",
    type: "website",
    images: [{ url: "/images/IMG_2677.jpg", width: 1200, height: 630, alt: "Pai Travel Guide by Athip House Pai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pai Travel Guide 2026 — By Athip House Pai",
    description: "Your complete guide to Pai, Thailand. Itineraries, local tips, and everything you need to plan your Pai trip.",
    images: ["/images/IMG_2677.jpg"],
  },
  alternates: { canonical: "https://athiphousepai.com/pai-guide" },
};

export default function PaiGuidePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image src="/Guide/Md_Mamun_Miah-Sun_set.jpg" alt="Pai Travel Guide - Stunning sunset over Pai valley and mountains" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
            The Pai Travel Guide
          </h1>
          <p className="text-white/85 text-lg md:text-xl max-w-2xl mb-6">
            Everything you need to plan the perfect Pai trip — written by locals who actually live here.
          </p>
          <p className="text-white/40 text-xs mb-4">📷 Md Mamun Miah</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="https://wa.me/66946765524?text=Hello%20I%20found%20you%20through%20the%20Pai%20Guide%20and%20I%20am%20interested%20in%20booking%20a%20room" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Book Your Stay at Athip House
            </a>
            <a href="#guides" className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm">
              Explore Guides ↓
            </a>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">Welcome to Pai</h2>
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          Nestled in a valley in Northern Thailand&apos;s Mae Hong Son province, Pai is a small town that captures hearts. Surrounded by mountains, hot springs, waterfalls, and rice paddies, Pai offers the perfect blend of adventure and relaxation. Our local team has put together these guides to help you experience the very best of Pai.
        </p>
      </section>

      {/* Guide Clusters */}
      <section id="guides" className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
        {Object.entries(CLUSTERS).map(([clusterKey, cluster]: [string, typeof CLUSTERS[string]]) => {
          const clusterGuides: GuideContent[] = ALL_GUIDES.filter((g: GuideContent) => g.cluster === clusterKey);
          if (clusterGuides.length === 0) return null;
          return (
            <div key={clusterKey} className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">{cluster.icon}</span>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary">{cluster.name}</h2>
                  <p className="text-gray-600 text-sm">{cluster.description}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clusterGuides.map((guide: GuideContent) => (
                  <GuideCard key={guide.slug} guide={guide} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Stay at Athip House Pai</h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            After exploring Pai, come home to a peaceful mountain retreat. Nestled among nature with comfortable rooms and warm Thai hospitality.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            {BOOKING_CTA.features.map((feature: string, i: number) => (
              <div key={i} className="flex items-start gap-2 bg-white p-4 rounded-lg shadow-sm">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">View Rooms</Link>
            <a href="https://wa.me/66946765524?text=Hello%20I%20am%20interested%20in%20booking%20a%20room" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">💬 WhatsApp Us</a>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Pai Travel Guide",
        description: "Complete travel guide to Pai, Thailand — itineraries, tips, and local insights from Athip House Pai.",
        url: "https://athiphousepai.com/pai-guide",
        publisher: { "@type": "Organization", name: "Athip House Pai", url: "https://athiphousepai.com" },
        breadcrumb: { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://athiphousepai.com" },
          { "@type": "ListItem", position: 2, name: "Pai Travel Guide", item: "https://athiphousepai.com/pai-guide" },
        ]},
      })}} />
    </>
  );
}
