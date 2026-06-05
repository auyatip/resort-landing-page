import Link from "next/link";

export default function GuideBreadcrumbs({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 md:px-8 max-w-4xl mx-auto">
      <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <li>
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
        </li>
        <li>
          <span className="mx-1">/</span>
          <Link href="/pai-guide" className="hover:text-primary transition-colors">
            Pai Guide
          </Link>
        </li>
        <li>
          <span className="mx-1">/</span>
          <span className="text-primary font-medium">{title}</span>
        </li>
      </ol>
    </nav>
  );
}