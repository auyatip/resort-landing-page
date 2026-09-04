import { BOOKING_CTA } from "../../lib/pai-guide/guides";

export default function GuideCTA() {
  return (
    <section className="bg-primary text-white rounded-2xl p-6 md:p-8 my-12">
      <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
        {BOOKING_CTA.title}
      </h2>
      <p className="text-white/80 mb-6">{BOOKING_CTA.subtitle}</p>
      <ul className="space-y-2 mb-6">
        {BOOKING_CTA.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-white/90 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={BOOKING_CTA.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.594-.764-6.39-2.054l-.446-.34-2.98.999.999-2.98-.34-.446A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
          </svg>
          Book via WhatsApp
        </a>
        <a
          href={BOOKING_CTA.lineLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          <iconify-icon icon="material-symbols:chat" width="18" height="18" aria-hidden="true" />
          Book via LINE
        </a>
        <a
          href={`tel:${BOOKING_CTA.phone}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/80 transition-colors"
        >
          <iconify-icon icon="material-symbols:call" width="18" height="18" aria-hidden="true" />
          Call {BOOKING_CTA.phone}
        </a>
      </div>
    </section>
  );
}
