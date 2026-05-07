import { BUSINESS } from "@/lib/business";

export function NapBlock() {
  return (
    <div className="liquid-glass rounded-2xl p-6 md:p-8">
      <div className="text-white/40 text-xs tracking-widest uppercase mb-4">
        Visit
      </div>
      <address className="not-italic text-white text-base leading-relaxed">
        <div className="font-medium">{BUSINESS.name}</div>
        <div className="text-white/70">{BUSINESS.streetAddress}</div>
        <div className="text-white/70">
          {BUSINESS.city}, {BUSINESS.region} {BUSINESS.postalCode}
        </div>
      </address>
      <a
        href={`tel:${BUSINESS.telephoneTel}`}
        className="block mt-3 text-white hover:text-white/80 transition-colors"
      >
        {BUSINESS.telephone}
      </a>
      <ul className="mt-5 pt-5 border-t border-white/10 space-y-2 text-sm">
        {BUSINESS.hoursLong.map((row) => (
          <li key={row.days} className="flex justify-between gap-4">
            <span className="text-white/50">{row.days}</span>
            <span className="text-white">{row.hours}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
