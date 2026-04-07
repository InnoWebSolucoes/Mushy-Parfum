"use client";

import { useTranslations } from "next-intl";

export default function InfiniteMarquee() {
  const t = useTranslations("marquee");
  const items: string[] = t.raw("items");
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="relative py-6 overflow-hidden border-y border-[rgba(201,168,76,0.1)] my-16">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="font-cinzel text-xs tracking-[0.4em] uppercase text-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors duration-300 px-6">
              {item}
            </span>
            <span className="text-[#C9A84C]/20 text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
