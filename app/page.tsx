import React from "react";
import Hero from "./components/Hero";
import RoomCard from "./components/RoomCard";
import Gallery from "./components/Gallery";
import ReviewCard from "./components/ReviewCard";
import Footer from "./components/Footer";
import StickyBookingBar from "./components/StickyBookingBar";

export const metadata = {
  title: "A-Thip House @ Pai | Peaceful Nature Stay in Pai",
  description:
    "Book a peaceful and cozy stay surrounded by nature in Pai. Perfect for long stays and digital nomads looking for a quiet retreat.",
  keywords:
    "Pai accommodation, Pai guesthouse, nature stay Pai, boutique hotel Pai, digital nomad Pai, long stay Pai",
  openGraph: {
    title: "A-Thip House @ Pai",
    description:
      "A peaceful and cozy guesthouse surrounded by nature in Pai, Thailand.",
    type: "website",
  },
};

export default function Home() {
  const phoneNumber = "+66946765524";
  const whatsappLink = `https://wa.me/${phoneNumber.replace(
    "+",
    ""
  )}?text=Hello%20I%20am%20interested%20in%20booking%20a%20room%20at%20A-Thip%20House`;
const lineLink = `https://lin.ee/TB4B1R9`;

  const roomFeatures = [
    "Queen-size bed",
    "Air conditioning",
    "Free high-speed WiFi",
    "Private bathroom with hot shower",
    "Mini refrigerator",
    "Microwave",
    "Shared kitchen",
    "Free parking",
  ];

  const reviews = [
    {
      name: "Karn 🇹🇭",
      rating: 5,
      text: "เราพักที่ A-Thip House@Pai ได้อย่างยอดเยี่ยมมาก สถานที่ตั้งอยู่ท่ามกลางธรรมชาติสวยงาม ให้ความรู้สึกสงบและเป็นกันเอง เจ้าของบ้านใจดีและเป็นมิตร และทุกมุมของบ้านให้ความรู้สึกเต็มไปด้วยความเอาใจใส่ เหมาะสำหรับผู้ที่ต้องการพักผ่อนอย่างแท้จริง",
    },
      {
      name: "도희 🇰🇷",
      rating: 5,
      text: "강아지를 좋아한다면 정말 천국같은 곳입니다. 호스트가 보호하고 있는 아기강아지(삐마이)가 정말 작고 너무나도 귀여워서 밖에서 돌아다니면서도 계속 생각났어요. 숙소 주변으로 정말 많은 개들이 있는데 다들 겁이많고 온순하고 귀여웠어요. 둘째날 아침에 개들과 관련한 해프닝이 있었는데 호스트가 정말 신속하게 대비책을 마련해주었어요. 호스트는 항상 응답이 빠르고 친절하고 따뜻한 마음씨를 가졌습니다! 숙소는 사용하는데 있어 크게 문제될만한게 없었고 3일간 굉장히 평화롭게 잘 지냈습니다. 면봉, 샴푸, 비누, 티, 과자 그리고 물 등의 어메니티가 있었으며, 온수기는 조금 미리 전원을 커두면 따뜻한 물이 잘 나왔고, 신기하게 화장실에서 향긋한 냄새가 계속 났습니다! 헤어드라이기도 있고, 침대도 잘만했어요. 정말 가성비있는 숙소였습니다! 빠이에 온다면 또 방문하고 싶어요~!",
    },
    {
      name: "Schubert 🇩🇪",
      rating: 5,
      text: "Beautifully situated in nature with clean rooms and courteous staff.",
    },
    {
      name: "Livne 🇪🇸",
      rating: 5,
      text: "A very nice and comfortable place to stay. Clean, cozy rooms and a friendly, helpful host. Quiet, pleasant atmosphere and good value for money.",
    },
    {
      name: "Sheroy 🇮🇳",
      rating: 5,
      text: "Away from the hustle & bustle, 100 meters off the 1095 on the way to Mae Hong Song. 5 cute cottage style units recently revamped overlooking an open courtyard with chirping birds. Plenty parking space Super fast WiFi I’ll be visiting again!!",
    },
    {
      name: "Hershko 🇮🇱",
      rating: 5,
      text: "I must say and praise this accommodation, we enjoyed it so much that we stayed for a week and a half. They gave us everything we needed, every day they brought us water and cookies. The cleanliness is very high. There is a place to sit outside. Very quiet.",
    },
  ];

  return (
    <>
      <Hero />

      {/* ROOMS */}
      <section id="rooms" className="section-padding bg-light">
        <div className="section-container">
          <h2 className="text-4xl font-bold text-center text-primary mb-4">
            Our Rooms
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Clean, simple, and cozy rooms with a relaxing atmosphere
          </p>

          <div className="flex justify-center">
            <RoomCard
              image="/images/762705354.jpg"
              name="Standard Room"
              features={roomFeatures}
              price="฿1,200 - ฿1,500 / night"
            />
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <Gallery />

      {/* ABOUT */}
      <section className="section-padding bg-light">
        <div className="section-container">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            Why Choose A-Thip House?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-3xl mr-4">🌿</span>
                <div>
                  <h3 className="font-bold text-primary mb-1">
                    Peaceful & Quiet
                  </h3>
                  <p className="text-gray-700">
                    Escape the noise and enjoy nature, birds, and fresh air.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">🛏️</span>
                <div>
                  <h3 className="font-bold text-primary mb-1">
                    Clean & Cozy
                  </h3>
                  <p className="text-gray-700">
                    Well-maintained rooms with a warm, home-like feeling.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">🌍</span>
                <div>
                  <h3 className="font-bold text-primary mb-1">
                    Close to Nature
                  </h3>
                  <p className="text-gray-700">
                    Surrounded by greenery and bamboo for a relaxing stay.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">🏙️</span>
                <div>
                  <h3 className="font-bold text-primary mb-1">
                    Great Location
                  </h3>
                  <p className="text-gray-700">
                    Only 2.3 km from Pai town, convenient yet peaceful.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">💻</span>
                <div>
                  <h3 className="font-bold text-primary mb-1">
                    Digital Nomad Friendly
                  </h3>
                  <p className="text-gray-700">
                    Fast WiFi and a comfortable environment for remote work.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-3xl mr-4">💰</span>
                <div>
                  <h3 className="font-bold text-primary mb-1">
                    Best Value
                  </h3>
                  <p className="text-gray-700">
                    Book direct for better prices — no commission fees.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg h-96">
              <img
                src="/images/569897459_122107554417056471_2994833732871230405_n.jpg"
                alt="A-Thip House Pai"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <h2 className="text-4xl font-bold text-center text-primary mb-4">
            Guest Reviews
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Hear what our guests love about their stay
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((review, idx) => (
              <ReviewCard key={idx} {...review} />
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {reviews.slice(3).map((review, idx) => (
              <ReviewCard key={idx + 3} {...review} />
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="section-padding bg-light">
        <div className="section-container">
          <h2 className="text-4xl font-bold text-center text-primary mb-4">
            Location
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Just 2.3 km from Pai town center
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-bold text-primary text-xl mb-4">
                How to Get Here
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>From Mae Hong Son Airport:</strong> ~2 hours
                </li>
                <li>
                  <strong>From Chiang Mai Airport:</strong> ~3–4 hours
                </li>
                <li>
                  <strong>From Pai town:</strong> ~5–10 minutes
                </li>
                <li>
                  <strong>Need directions?</strong> Contact us anytime
                </li>
              </ul>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary mt-6 inline-block"
              >
                Get Directions
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg h-96">
              <iframe
                title="A-Thip House @ Pai Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.8!2d98.4225!3d19.3581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da81f6e630fcc1%3A0x536127fb4513ac1f!2sA-thip%20House%20%40Pai!5e0!3m2!1sen!2sen!4v1710920000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="section-container text-center">
          <h2 className="text-4xl font-bold mb-4">
            Book Direct for the Best Price
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Skip the middleman and contact us directly for special deals
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${phoneNumber}`}
              className="cta-primary bg-accent text-primary"
            >
              ☎️ Call Now: {phoneNumber}
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              className="cta-primary bg-green-500 text-white"
            >
              💬 WhatsApp
            </a>

            <a
              href={lineLink}
              target="_blank"
              className="cta-primary bg-blue-500 text-white"
            >
              📱 LINE
            </a>
          </div>

          <p className="mt-8 text-sm opacity-75">
            Fast response • 24/7 support • Thai & English
          </p>
        </div>
      </section>

      <Footer />
      <StickyBookingBar />
    </>
  );
}