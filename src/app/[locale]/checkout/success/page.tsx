"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Sparkles } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const t = useTranslations("success");
  const locale = useLocale();
  const params = useSearchParams();
  const ref = params.get("ref") ?? params.get("payment_intent") ?? "MP" + Date.now().toString().slice(-8);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-lg mx-auto text-center">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="relative w-24 h-24 mx-auto mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-[rgba(201,168,76,0.1)] border border-[#C9A84C]/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle size={36} className="text-[#C9A84C]" />
          </div>
          {/* Sparkle particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#C9A84C] rounded-full"
              style={{
                top: "50%",
                left: "50%",
              }}
              animate={{
                x: [0, (Math.cos((i * Math.PI * 2) / 6) * 50)],
                y: [0, (Math.sin((i * Math.PI * 2) / 6) * 50)],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
            />
          ))}
        </motion.div>

        <motion.h1
          className="font-cinzel text-3xl md:text-4xl mb-3"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 50%, #9B7A2E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {t("title")}
        </motion.h1>

        <motion.p
          className="font-cormorant text-2xl italic text-[#C9A84C]/60 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="border border-[rgba(201,168,76,0.15)] p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#F5F0E8]/30 mb-2">
            {t("orderRef")}
          </p>
          <p className="font-cinzel text-lg text-[#C9A84C]">{ref}</p>
        </motion.div>

        <motion.p
          className="font-cormorant text-lg italic text-[#F5F0E8]/40 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {t("message")}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href={`/${locale}/shop`}
            className="font-cinzel text-xs tracking-[0.2em] uppercase border border-[#C9A84C] text-[#C9A84C] px-8 py-3 hover:bg-[#C9A84C] hover:text-black transition-all duration-300"
          >
            {t("continueShopping")}
          </Link>
          <Link
            href={`/${locale}`}
            className="font-cinzel text-xs tracking-[0.2em] uppercase border border-[rgba(201,168,76,0.2)] text-[#F5F0E8]/40 px-8 py-3 hover:border-[#C9A84C]/50 hover:text-[#F5F0E8]/60 transition-all duration-300"
          >
            {t("home")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}
