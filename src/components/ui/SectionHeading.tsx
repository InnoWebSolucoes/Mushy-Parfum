"use client";

import ScrollReveal from "./ScrollReveal";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  center = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={center ? "text-center" : ""}>
      <ScrollReveal>
        <h2
          className="font-cinzel text-3xl md:text-4xl lg:text-5xl mb-4"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 50%, #9B7A2E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </h2>
      </ScrollReveal>
      {subtitle && (
        <ScrollReveal delay={0.15}>
          <p className={`font-cormorant text-xl ${light ? "text-white/60" : "text-[#C9A84C]/70"} italic`}>
            {subtitle}
          </p>
        </ScrollReveal>
      )}
      <ScrollReveal delay={0.2}>
        <div className="flex items-center justify-center mt-6 gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <div className="w-1.5 h-1.5 bg-[#C9A84C] rotate-45" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </div>
      </ScrollReveal>
    </div>
  );
}
