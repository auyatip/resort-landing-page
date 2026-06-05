import Link from "next/link";
import "../globals.css";

export default function PaiGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-light">
      {/* Guide Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-primary font-serif font-bold text-lg hover:opacity-80 transition-opacity"
            >
              ← Athip House Pai
            </Link>
            <span className="hidden sm:inline text-gray-300">|</span>
            <Link
              href="/pai-guide"
              className="hidden sm:inline text-primary font-serif font-semibold hover:opacity-80 transition-opacity"
            >
              Pai Guide
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/pai-guide"
              className="text-sm text-gray-600 hover:text-primary transition-colors hidden md:inline"
            >
              All Guides
            </Link>
            <a
              href="https://wa.me/66946765524?text=Hello%20I%20found%20you%20through%20the%20Pai%20Guide%20and%20I%20am%20interested%20in%20booking%20a%20room"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Book Your Stay
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>{children}</main>

      {/* Guide Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif font-bold text-xl mb-3">Athip House Pai</h3>
              <p className="text-white/70 text-sm">
                Authentic Pai Slow Living. A peaceful mountain retreat for travelers
                seeking the real Pai experience.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Explore</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="/pai-guide" className="hover:text-white transition-colors">
                    Pai Travel Guide
                  </Link>
                </li>
                <li>
                  <Link href="/pai-guide/3-days-in-pai" className="hover:text-white transition-colors">
                    3 Days in Pai
                  </Link>
                </li>
                <li>
                  <Link href="/pai-guide/where-to-stay-in-pai" className="hover:text-white transition-colors">
                    Where to Stay
                  </Link>
                </li>
                <li>
                  <Link href="/pai-guide/digital-nomad-pai" className="hover:text-white transition-colors">
                    Digital Nomad Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Book Direct</h4>
              <p className="text-white/70 text-sm mb-3">
                Get the best rate by booking directly with us.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://wa.me/66946765524?text=Hello%20I%20am%20interested%20in%20booking%20a%20room"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-300 hover:text-green-200 transition-colors"
                >
                  💬 WhatsApp
                </a>
                <a
                  href="https://lin.ee/TB4B1R9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
                >
                  📱 LINE
                </a>
                <a
                  href="tel:+66946765524"
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  ☎️ +66 946 765 524
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/50">
            © {new Date().getFullYear()} Athip House Pai. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}