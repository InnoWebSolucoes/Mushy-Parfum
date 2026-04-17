"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLocale } from "next-intl";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ProductHero({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bottleY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const words = product.tagline.split(" ");

  return (
    <div ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic background based on product accent color */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${product.accentColor}22 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(201,168,76,0.06) 0%, transparent 50%)`,
        }}
      />

      {/* Hero image with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]) }}
      >
        <Image
          src={product.images.hero}
          alt={product.name}
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/50 via-transparent to-[#080808]" />
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { l: 15, t: 20, w: 2.5, d: 4, delay: 0 },
          { l: 35, t: 45, w: 1.5, d: 5, delay: 0.3 },
          { l: 60, t: 15, w: 3, d: 3.5, delay: 0.7 },
          { l: 80, t: 60, w: 2, d: 6, delay: 1.1 },
          { l: 25, t: 75, w: 1, d: 4.5, delay: 0.5 },
          { l: 70, t: 35, w: 2.8, d: 5.5, delay: 0.9 },
          { l: 45, t: 55, w: 1.8, d: 3, delay: 1.4 },
          { l: 88, t: 25, w: 2.2, d: 4, delay: 0.2 },
          { l: 12, t: 65, w: 3, d: 5, delay: 1.6 },
          { l: 55, t: 80, w: 1.5, d: 6, delay: 0.8 },
          { l: 30, t: 30, w: 2, d: 4.5, delay: 1.2 },
          { l: 75, t: 70, w: 1, d: 3.5, delay: 0.4 },
          { l: 50, t: 12, w: 2.5, d: 5, delay: 1.0 },
          { l: 20, t: 50, w: 3, d: 4, delay: 1.8 },
          { l: 90, t: 45, w: 1.8, d: 5.5, delay: 0.6 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ left: `${p.l}%`, top: `${p.t}%`, width: p.w, height: p.w, backgroundColor: product.accentColor, opacity: 0.4 }}
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Back link */}
      <motion.div
        className="absolute top-24 left-6 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href={`/${locale}/shop`}
          className="flex items-center gap-2 font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors duration-300"
        >
          <ChevronLeft size={12} />
          Collection
        </Link>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6 w-full">
        {/* Text side */}
        <motion.div style={{ y: textY, opacity }}>
          <motion.p
            className="font-cinzel text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: `${product.accentColor}` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {product.nameAr} · {product.gender}
          </motion.p>

          <h1 className="font-cinzel text-5xl md:text-6xl lg:text-7xl leading-none mb-6">
            {product.name.split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="block"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 50%, #9B7A2E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <div className="w-1 h-1 bg-[#C9A84C] rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </motion.div>

          <motion.p
            className="font-cormorant text-2xl md:text-3xl italic text-[#F5F0E8]/60 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            &ldquo;{product.tagline}&rdquo;
          </motion.p>

          <motion.p
            className="font-cormorant text-lg text-[#F5F0E8]/40 leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            {product.description.substring(0, 160)}...
          </motion.p>
        </motion.div>

        {/* Bottle side */}
        <motion.div
          className="flex justify-center lg:justify-end"
          style={{ y: bottleY }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <motion.div
            animate={{ y: [0, -16, 0], rotate: [0, 1, -0.5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Glow */}
            <div
              className="absolute inset-0 blur-3xl rounded-full scale-150 opacity-30"
              style={{ backgroundColor: product.accentColor }}
            />
            {/* Bottle image */}
            <div className="relative w-56 md:w-72 h-80 md:h-96">
              <Image
                src={product.images.bottle}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
            {/* Mist */}
            {[
              { w: 25, h: 18, l: 28, t: 70, d: 3.2 },
              { w: 18, h: 22, l: 50, t: 75, d: 4.0 },
              { w: 30, h: 16, l: 65, t: 68, d: 3.6 },
              { w: 20, h: 28, l: 38, t: 78, d: 4.5 },
              { w: 22, h: 20, l: 55, t: 72, d: 3.8 },
            ].map((p, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full blur-md"
                style={{ width: p.w, height: p.h, left: `${p.l}%`, top: `${p.t}%`, backgroundColor: product.accentColor, opacity: 0.3 }}
                animate={{ opacity: [0, 0.3, 0], scale: [0.5, 1.5, 0.5], y: [0, -40] }}
                transition={{ duration: p.d, delay: i * 0.6, repeat: Infinity }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
    </div>
  );
}
