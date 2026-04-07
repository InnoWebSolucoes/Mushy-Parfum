import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* Hero */}
      <div className="relative py-20 px-6 text-center overflow-hidden mb-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />
        <p className="font-cinzel text-6xl md:text-8xl text-[#C9A84C]/5 mb-4 select-none">
          مشي
        </p>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto px-6 space-y-16">
        {[t("story1"), t("story2"), t("story3")].map((text, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <div className="relative pl-8 border-l border-[rgba(201,168,76,0.2)]">
              <div className="absolute left-0 top-0 -translate-x-1/2 w-2 h-2 bg-[#C9A84C] rotate-45" />
              <p className="font-cormorant text-xl md:text-2xl text-[#F5F0E8]/60 italic leading-relaxed">
                {text}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Mission & Vision */}
      <div className="max-w-5xl mx-auto px-6 mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: t("missionTitle"), body: t("mission") },
          { title: t("visionTitle"), body: t("vision") },
        ].map(({ title, body }, i) => (
          <ScrollReveal key={title} delay={i * 0.15}>
            <div className="border border-[rgba(201,168,76,0.15)] p-8 relative overflow-hidden group hover:border-[rgba(201,168,76,0.35)] transition-colors duration-500">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3
                className="font-cinzel text-lg tracking-[0.2em] uppercase mb-4"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {title}
              </h3>
              <p className="font-cormorant text-xl text-[#F5F0E8]/55 italic leading-relaxed">{body}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "20", label: "Fragrances" },
            { num: "100%", label: "Natural Oud" },
            { num: "∞", label: "Longevity" },
            { num: "1", label: "Obsession" },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.08}>
              <div className="border border-[rgba(201,168,76,0.1)] p-6">
                <p
                  className="font-cinzel text-3xl md:text-4xl mb-2"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.num}
                </p>
                <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#F5F0E8]/30">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
