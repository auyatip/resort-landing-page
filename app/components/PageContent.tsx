"use client";

import React from "react";
import Image from "next/image";
import RoomCard from "./RoomCard";
import ReviewCard from "./ReviewCard";
import Gallery from "./Gallery";
import FAQ from "./FAQ";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";
import { useScrollAnimation } from "../lib/useScrollAnimation";

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
    text: "Away from the hustle & bustle, 100 meters off the 1095 on the way to Mae Hong Song. 5 cute cottage style units recently revamped overlooking an open courtyard with chirping birds. Plenty parking space Super fast WiFi I'll be visiting again!!",
  },
  {
    name: "Hershko 🇮🇱",
    rating: 5,
    text: "I must say and praise this accommodation, we enjoyed it so much that we stayed for a week and a half. They gave us everything we needed, every day they brought us water and cookies. The cleanliness is very high. There is a place to sit outside. Very quiet.",
  },
];

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={`transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className || ""}`}
      style={{ willChange: "opacity" }}
    >
      {children}
    </div>
  );
}

export default function PageContent() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const phoneNumber = "+66946765524";
  const whatsappLink = `https://wa.me/${phoneNumber.replace(
    "+",
    ""
  )}?text=Hello%20I%20am%20interested%20in%20booking%20a%20room%20at%20A-Thip%20House`;
  const lineLink = `https://lin.ee/TB4B1R9`;

  return (
    <>
      {/* STAY AT A GLANCE */}
      <section className="bg-primary text-white px-4 py-7 md:py-10">
        <div className="section-container">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-accent">2.3 km</div>
                <p className="mt-1 text-xs md:text-sm text-white/75">from Pai town</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-accent">24/7</div>
                <p className="mt-1 text-xs md:text-sm text-white/75">direct support</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-accent">Fast WiFi</div>
                <p className="mt-1 text-xs md:text-sm text-white/75">remote-work ready</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-accent">5 rooms</div>
                <p className="mt-1 text-xs md:text-sm text-white/75">small &amp; private</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ROOMS */}
      <section id="rooms" className="section-padding bg-light">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
              {t.roomsTitle}
            </h2>
            <p className="text-center text-gray-600 mb-12">
              {t.roomsSubtitle}
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="flex justify-center">
              <RoomCard
                image="/images/room1.jpg"
                galleryImages={[
                  "/images/room1.jpg",
                  "/images/room2.jpg",
                  "/images/room3.jpg",
                  "/images/room4.jpg",
                  "/images/bathroom1.jpg",
                  "/images/bathroom2.jpg",
                ]}
                name={t.roomName}
                features={t.roomFeatures}
                price="฿550 - ฿990 / night"
                priceLabel={t.roomPrice}
                primaryBookText={t.roomBookPrimary}
                amenitiesLabel={t.roomAmenities}
                bookLineText={t.roomBookLine}
                bookWhatsAppText={t.roomBookWhatsApp}
                needInfoText={t.roomNeedInfo}
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* GALLERY */}
      <AnimatedSection>
        <Gallery />
      </AnimatedSection>

      {/* ABOUT */}
      <section id="about" className="section-padding scroll-mt-20 bg-light">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-primary mb-12">
              {t.aboutTitle}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <AnimatedSection>
                <div className="flex items-start">
                  <iconify-icon className="mr-4 text-3xl text-accent" icon="material-symbols:park" width="32" height="32" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-primary mb-1">
                      {t.aboutPeaceful}
                    </h3>
                    <p className="text-gray-700">
                      {t.aboutPeacefulDesc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="flex items-start">
                  <iconify-icon className="mr-4 text-3xl text-accent" icon="material-symbols:bed" width="32" height="32" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-primary mb-1">
                      {t.aboutClean}
                    </h3>
                    <p className="text-gray-700">
                      {t.aboutCleanDesc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="flex items-start">
                  <iconify-icon className="mr-4 text-3xl text-accent" icon="material-symbols:landscape" width="32" height="32" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-primary mb-1">
                      {t.aboutNature}
                    </h3>
                    <p className="text-gray-700">
                      {t.aboutNatureDesc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="flex items-start">
                  <span className="text-3xl mr-4">🏙️</span>
                  <div>
                    <h3 className="font-bold text-primary mb-1">
                      {t.aboutLocation}
                    </h3>
                    <p className="text-gray-700">
                      {t.aboutLocationDesc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="flex items-start">
                  <iconify-icon className="mr-4 text-3xl text-accent" icon="material-symbols:laptop-mac" width="32" height="32" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-primary mb-1">
                      {t.aboutDigital}
                    </h3>
                    <p className="text-gray-700">
                      {t.aboutDigitalDesc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="flex items-start">
                  <iconify-icon className="mr-4 text-3xl text-accent" icon="material-symbols:sell" width="32" height="32" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-primary mb-1">
                      {t.aboutPrice}
                    </h3>
                    <p className="text-gray-700">
                      {t.aboutPriceDesc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection>
              <div className="rounded-2xl overflow-hidden shadow-lg h-96 relative">
                <Image
                  src="/images/exterior1.jpg"
                  alt="A-Thip House Pai guesthouse surrounded by nature"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="section-padding scroll-mt-20 bg-white">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-primary mb-4">
              {t.reviewsTitle}
            </h2>
            <p className="text-center text-gray-600 mb-12">
              {t.reviewsSubtitle}
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review, idx) => (
                <ReviewCard key={idx} {...review} />
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {reviews.slice(3).map((review, idx) => (
                <ReviewCard key={idx + 3} {...review} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* PAI GUIDE PROMO */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5">
        <div className="section-container">
          <AnimatedSection>
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-64 md:h-auto min-h-[300px]">
                  <Image
                    src="/Guide/Md_Mamun_Miah-Sun_set.jpg"
                    alt="Stunning Pai sunset over mountains and rice fields"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 md:bg-gradient-to-l md:from-transparent md:to-white/60" />
                </div>
                {/* Content Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold tracking-wider uppercase w-fit">
                    <iconify-icon icon="material-symbols:map-outline" width="16" height="16" aria-hidden="true" /> Written by Locals
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">
                    The Pai Travel Guide
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Discover the real Pai with our comprehensive travel guides. From 3-day itineraries to hidden waterfalls, scooter routes, the best food, and local secrets — everything you need to plan the perfect trip.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                      { icon: "material-symbols:route", label: "Itineraries" },
                      { icon: "material-symbols:water", label: "Waterfalls" },
                      { icon: "material-symbols:restaurant", label: "Food Guide" },
                      { icon: "material-symbols:wb-sunny", label: "Sunset Spots" },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                        <iconify-icon icon={item.icon} width="26" height="26" aria-hidden="true" />
                        <span className="text-xs text-gray-600 font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href="/pai-guide"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all duration-300 transform hover:scale-105 w-fit"
                  >
                    <span>Explore Pai Guide</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <AnimatedSection>
        <FAQ />
      </AnimatedSection>

      {/* LOCATION */}
      <section id="location" className="section-padding scroll-mt-20 bg-light">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-primary mb-4">
              {t.locationTitle}
            </h2>
            <p className="text-center text-gray-600 mb-8">
              {t.locationSubtitle}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <AnimatedSection>
              <div>
                <h3 className="font-bold text-primary text-xl mb-4">
                  {t.locationHow}
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>{t.locationMaeHongSon}</strong> {t.locationMaeHongSonTime}
                  </li>
                  <li>
                    <strong>{t.locationChiangMai}</strong> {t.locationChiangMaiTime}
                  </li>
                  <li>
                    <strong>{t.locationFromPai}</strong> {t.locationFromPaiTime}
                  </li>
                  <li>
                    <strong>{t.locationNeedDirections}</strong> {t.locationNeedDirectionsDesc}
                  </li>
                </ul>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-primary mt-6 inline-block"
                >
                  {t.locationGetDirections}
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection>
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
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="section-container text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-4">
              {t.ctaTitle}
            </h2>
            <p className="text-lg opacity-90 mb-8">
              {t.ctaSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${phoneNumber}`}
                className="cta-primary bg-accent text-primary"
              >
                <iconify-icon icon="material-symbols:call" width="18" height="18" aria-hidden="true" /> {t.ctaCallNow} {phoneNumber}
              </a>

              <a
                href={whatsappLink}
                target="_blank"
                className="cta-primary bg-green-500 text-white"
              >
                <iconify-icon icon="simple-icons:whatsapp" width="18" height="18" aria-hidden="true" /> {t.ctaWhatsApp}
              </a>

              <a
                href={lineLink}
                target="_blank"
                className="cta-primary bg-blue-500 text-white"
              >
                <iconify-icon icon="simple-icons:line" width="18" height="18" aria-hidden="true" /> {t.ctaLINE}
              </a>
            </div>

            <p className="mt-8 text-sm opacity-75">
              {t.ctaFooter}
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
