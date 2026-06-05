import Image from "next/image";
import Link from "next/link";
import { GuideContent } from "../../lib/pai-guide/types";
import { CLUSTER_COLORS } from "../../lib/pai-guide/guides";

export default function GuideCard({ guide }: { guide: GuideContent }) {
  return (
    <Link
      href={`/pai-guide/${guide.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={guide.heroImage}
          alt={guide.heroImageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
            CLUSTER_COLORS[guide.cluster] || "bg-gray-100 text-gray-800"
          }`}
        >
          {guide.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif font-bold text-primary text-lg mb-2 group-hover:text-primary/80 transition-colors line-clamp-2">
          {guide.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {guide.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {guide.readingTime} min read
          </span>
          <span className="text-primary font-semibold group-hover:underline">
            Read Guide →
          </span>
        </div>
      </div>
    </Link>
  );
}