export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface GuideContent {
  title: string;
  slug: string;
  description: string;
  metaDescription: string;
  heroImage: string;
  heroImageAlt: string;
  heroImageCredit?: string;
  category: string;
  cluster: "travel" | "slow-living" | "digital-nomad" | "accommodation" | "food-transport";
  readingTime: number;
  lastUpdated: string;
  keywords: string[];
  content: string; // HTML content
  faqs: GuideFAQ[];
  relatedGuides: string[]; // slugs of related guides
  itinerary?: {
    days: {
      day: string;
      title: string;
      items: { time: string; activity: string; description: string }[];
    }[];
  };
}

export interface GuideCard {
  title: string;
  slug: string;
  description: string;
  heroImage: string;
  category: string;
  cluster: string;
  readingTime: number;
}

export interface AuthorInfo {
  name: string;
  bio: string;
  avatar: string;
}