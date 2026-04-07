"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 3,
}));

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const words = t("headline").split(" ");

  return (
    <div ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 50%, rgba(139,37,0,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(74,20,0,0.2) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#C9A84C]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Mist / fog layers */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(8,8,8,0.8) 0%, transparent 100%)",
        }}
      />

      {/* Content */}
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" style={{ opacity }}>
        {/* Eyebrow */}
        <motion.p
          className="font-cinzel text-xs md:text-sm tracking-[0.5em] uppercase text-[#C9A84C]/70 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t("eyebrow")}
        </motion.p>

        {/* Headline — word by word */}
        <h1 className="font-cinzel text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none mb-8">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.2em] last:mr-0"
              style={{
                background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 40%, #9B7A2E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              initial={{ opacity: 0, y: 60, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.4 + i * 0.15,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Divider */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <div className="w-1.5 h-1.5 bg-[#C9A84C] rotate-45" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-cormorant text-lg md:text-2xl text-[#F5F0E8]/60 italic max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {t("sub")}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center justify-center font-cinzel text-sm tracking-[0.3em] uppercase border border-[#C9A84C] text-[#C9A84C] px-12 py-4 hover:bg-[#C9A84C] hover:text-black hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] transition-all duration-500"
          >
            {t("cta")}
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating bottle glow */}
      <motion.div
        className="absolute right-[5%] md:right-[10%] top-1/2 -translate-y-1/2 pointer-events-none"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 1.5, -0.5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute inset-0 blur-3xl bg-[#C9A84C]/20 rounded-full scale-150" />
          {/* Bottle silhouette */}
          <div className="relative w-28 md:w-44 h-64 md:h-96 flex items-center justify-center">
            <svg viewBox="0 0 120 280" className="w-full h-full" fill="none">
              <defs>
                <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#E2C98A" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#9B7A2E" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                </linearGradient>
              </defs>
              {/* Cap */}
              <rect x="42" y="10" width="36" height="30" rx="4" fill="url(#bottleGrad)" />
              <rect x="46" y="5" width="28" height="12" rx="3" fill="url(#bottleGrad)" />
              {/* Neck */}
              <rect x="48" y="40" width="24" height="30" rx="2" fill="url(#bottleGrad)" opacity="0.8" />
              {/* Body */}
              <path d="M20 90 C20 72 48 70 60 70 C72 70 100 72 100 90 L108 240 C108 258 88 268 60 268 C32 268 12 258 12 240 Z" fill="url(#bottleGrad)" />
              {/* Glass highlight */}
              <path d="M28 100 C28 85 48 80 60 80 L30 250 C20 245 20 235 22 220 Z" fill="url(#glassGrad)" />
              {/* Label area */}
              <rect x="28" y="130" width="64" height="80" rx="4" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
              <text x="60" y="165" textAnchor="middle" fill="rgba(201,168,76,0.6)" fontSize="8" fontFamily="serif" letterSpacing="2">MUSHY</text>
              <text x="60" y="180" textAnchor="middle" fill="rgba(201,168,76,0.4)" fontSize="6" fontFamily="serif" letterSpacing="3">PARFUM</text>
            </svg>
          </div>

          {/* Mist particles around bottle */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#C9A84C]/20 blur-md"
              style={{
                width: Math.random() * 20 + 10,
                height: Math.random() * 20 + 10,
                left: `${20 + Math.random() * 60}%`,
                top: `${60 + Math.random() * 30}%`,
              }}
              animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.5, 0.5], y: [0, -30, -60] }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: i * 0.5,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-[#F5F0E8]/30">
          {t("scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-[#C9A84C]/40" />
        </motion.div>
      </motion.div>
    </div>
  );
}
