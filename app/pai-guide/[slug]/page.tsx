import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_GUIDES, getGuideBySlug, getAllGuideSlugs, getRelatedGuides, SITE_URL, AUTHOR } from "../../lib/pai-guide/guides";
import GuideHeader from "../../components/pai-guide/GuideHeader";
import GuideBreadcrumbs from "../../components/pai-guide/GuideBreadcrumbs";
import GuideCTA from "../../components/pai-guide/GuideCTA";
import GuideFAQ from "../../components/pai-guide/GuideFAQ";
import GuideRelated from "../../components/pai-guide/GuideRelated";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: `${guide.title} | Athip House Pai`,
    description: guide.metaDescription,
    keywords: guide.keywords,
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      url: `${SITE_URL}/pai-guide/${guide.slug}`,
      siteName: "Athip House Pai",
      type: "article",
      publishedTime: guide.lastUpdated,
      modifiedTime: guide.lastUpdated,
      authors: [AUTHOR.name],
      images: [{ url: guide.heroImage, width: 1200, height: 630, alt: guide.heroImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.metaDescription,
      images: [guide.heroImage],
    },
    alternates: { canonical: `${SITE_URL}/pai-guide/${guide.slug}` },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(guide.relatedGuides);

  // JSON-LD: Article
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    image: `${SITE_URL}${guide.heroImage}`,
    datePublished: guide.lastUpdated,
    dateModified: guide.lastUpdated,
    author: {
      "@type": "Organization",
      name: AUTHOR.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Athip House Pai",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/pai-guide/${guide.slug}`,
    },
  };

  // JSON-LD: Breadcrumb
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Pai Travel Guide", item: `${SITE_URL}/pai-guide` },
      { "@type": "ListItem", position: 3, name: guide.title, item: `${SITE_URL}/pai-guide/${guide.slug}` },
    ],
  };

  // JSON-LD: FAQ
  const faqJsonLd = guide.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } : null;

  return (
    <>
      <GuideBreadcrumbs title={guide.title} />
      <GuideHeader guide={guide} />

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
            AH
          </div>
          <div>
            <p className="font-semibold text-primary text-sm">{AUTHOR.name}</p>
            <p className="text-gray-500 text-xs">
              Updated {new Date(guide.lastUpdated).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {guide.readingTime} min read
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <nav className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
          <h2 className="font-serif font-bold text-primary text-lg mb-3">In This Guide</h2>
          <div
            className="guide-toc"
            dangerouslySetInnerHTML={{
              __html: extractHeadings(guide.content),
            }}
          />
        </nav>

        {/* Main Content */}
        <div
          className="guide-article prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />

        {/* Inline CTA */}
        <GuideCTA />

        {/* FAQs */}
        {guide.faqs.length > 0 && <GuideFAQ faqs={guide.faqs} />}

        {/* Related Guides */}
        <GuideRelated guides={related} />
      </article>

      {/* JSON-LD Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
    </>
  );
}

function extractHeadings(html: string): string {
  const headingRegex = /<h[23] id="([^"]*)"[^>]*>(.*?)<\/h[23]>/g;
  const links: string[] = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const id = match[1];
    const text = match[2].replace(/<[^>]*>/g, "");
    links.push(`<li><a href="#${id}" class="text-primary/70 hover:text-primary transition-colors text-sm">${text}</a></li>`);
  }
  return `<ul class="space-y-1.5">${links.join("")}</ul>`;
}