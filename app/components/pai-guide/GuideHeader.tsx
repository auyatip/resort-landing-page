import Image from "next/image";
import { GuideContent } from "../../lib/pai-guide/types";
import { CLUSTER_COLORS } from "../../lib/pai-guide/guides";

export default function GuideHeader({ guide }: { guide: GuideContent }) {
  return (
    <header className="relative">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <Image
          src={guide.heroImage}
          alt={guide.heroImageAlt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
              CLUSTER_COLORS[guide.cluster] || "bg-gray-100 text-gray-800"
            }`}
          >
            {guide.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3 leading-tight">
            {guide.title}
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-2xl">
            {guide.description}
          </p>
          {guide.heroImageCredit && (
            <p className="text-white/50 text-xs mt-2">
              📷 {guide.heroImageCredit}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {guide.readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Updated {new Date(guide.lastUpdated).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}