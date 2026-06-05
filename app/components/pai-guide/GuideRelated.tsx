import { GuideContent } from "../../lib/pai-guide/types";
import GuideCard from "./GuideCard";

export default function GuideRelated({ guides }: { guides: GuideContent[] }) {
  if (guides.length === 0) return null;
  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-6">
        Continue Reading
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.slice(0, 3).map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </section>
  );
}