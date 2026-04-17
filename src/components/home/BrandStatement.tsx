"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function BrandStatement() {
  const t = useTranslations("brand");

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Arabic decorative script */}
        <motion.p
          className="font-cinzel text-5xl md:text-7xl text-[#C9A84C]/10 mb-8 select-none"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          مشي
        </motion.p>

        <motion.h2
          className="font-cinzel text-2xl md:text-3xl lg:text-4xl mb-8 leading-relaxed"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 50%, #9B7A2E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          {t("title")}
        </motion.h2>

        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <div className="w-1 h-1 bg-[#C9A84C] rotate-45" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </motion.div>

        <motion.p
          className="font-cormorant text-xl md:text-2xl text-[#F5F0E8]/60 italic leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          {t("description")}
        </motion.p>
      </div>
    </section>
  );
}
