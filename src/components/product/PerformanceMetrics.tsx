"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { PerformanceData } from "@/types";

interface MetricBarProps {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  delay: number;
}

function MetricBar({ label, value, max = 10, unit, delay }: MetricBarProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const pct = (value / max) * 100;

  return (
    <div ref={ref} className="mb-6">
      <div className="flex items-end justify-between mb-2">
        <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/50">
          {label}
        </span>
        <span className="font-cinzel text-sm text-[#C9A84C]">
          {value}{unit ? ` ${unit}` : "/10"}
        </span>
      </div>
      <div className="h-px bg-[rgba(255,255,255,0.06)] relative overflow-visible">
        <motion.div
          className="h-full relative"
          style={{
            background: "linear-gradient(90deg, #9B7A2E 0%, #C9A84C 60%, #E2C98A 100%)",
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {/* Glow dot at end */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#E2C98A] shadow-[0_0_8px_rgba(226,201,138,0.8)]"
            style={{ opacity: inView ? 1 : 0 }}
          />
        </motion.div>
      </div>
    </div>
  );
}

interface SeductionScoreProps {
  score: number;
  phrase: string;
}

function SeductionScore({ score, phrase }: SeductionScoreProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative border border-[rgba(201,168,76,0.25)] p-8 text-center overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,168,76,0.05)] to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

      <p className="font-cinzel text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/50 mb-3">
        Seduction Score
      </p>
      <div
        className="font-cinzel text-6xl md:text-7xl mb-2"
        style={{
          background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 50%, #9B7A2E 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {score}
        <span className="text-2xl text-[#C9A84C]/40">/10</span>
      </div>
      <p className="font-cormorant text-lg italic text-[#F5F0E8]/50">{phrase}</p>
    </motion.div>
  );
}

interface PerformanceMetricsProps {
  performance: PerformanceData;
}

export default function PerformanceMetrics({ performance }: PerformanceMetricsProps) {
  const t = useTranslations("product");

  return (
    <section className="py-20 px-6 bg-[rgba(255,255,255,0.01)]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="font-cinzel text-2xl md:text-3xl tracking-[0.2em] uppercase mb-2"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 50%, #9B7A2E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("performance")}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/50" />
            <div className="w-1 h-1 bg-[#C9A84C]/50 rotate-45" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/50" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
          <div>
            <MetricBar
              label={t("longevity")}
              value={performance.longevity}
              max={20}
              unit={t("hours")}
              delay={0}
            />
            <MetricBar label={t("sillage")} value={performance.sillage} delay={0.1} />
            <MetricBar label={t("projection")} value={performance.projection} delay={0.2} />
          </div>
          <div>
            <MetricBar label={t("onClothes")} value={performance.sillageClothes} delay={0.15} />
            <MetricBar label={t("compliments")} value={performance.compliments} delay={0.25} />
            {/* Seasons */}
            <div className="mb-6">
              <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/50 block mb-3">
                Season
              </span>
              <div className="flex gap-2 flex-wrap">
                {["spring", "summer", "autumn", "winter"].map((s) => (
                  <span
                    key={s}
                    className={`font-cinzel text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                      performance.seasons.includes(s as "spring" | "summer" | "autumn" | "winter")
                        ? "border-[#C9A84C] bg-[rgba(201,168,76,0.1)] text-[#C9A84C]"
                        : "border-[rgba(255,255,255,0.06)] text-[#F5F0E8]/20"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SeductionScore
            score={performance.seductionScore}
            phrase={performance.seductionPhrase}
          />
        </div>
      </div>
    </section>
  );
}
