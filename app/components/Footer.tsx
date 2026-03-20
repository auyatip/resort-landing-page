import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-12">
      <div className="section-container section-padding">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">A-Thip House @ Pai</h3>
            <p className="text-accent">Peaceful. Comfortable. Nature.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <p>
                📱{" "}
                <a href="tel:+66946765524" className="hover:text-accent transition">
                  +66 946765524
                </a>
              </p>
              <p>
                💬{" "}
                <a
                  href="https://wa.me/66946765524"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition"
                >
                  WhatsApp
                </a>
              </p>
              <p>
                📮 Pai, Mae Hong Son, Thailand{" "}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Location</h4>
            <p className="text-sm leading-relaxed">
              2.3 km from Pai Town Center <br />
              Perfect for long stays and digital nomads
            </p>
          </div>
        </div>

        <div className="border-t border-accent pt-8 text-center text-sm">
          <p>
            © {year} A-Thip House @ Pai. All rights reserved.
          </p>
          <p className="mt-2 text-xs opacity-75">
            Created with care for travelers seeking peace and comfort.
          </p>
        </div>
      </div>
    </footer>
  );
}
