"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function HeroSection() {
  const heroRef   = useRef<HTMLElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  const onScroll = useCallback(() => {
    const hero  = heroRef.current;
    const video = videoRef.current;
    if (!hero) return;

    const range    = hero.offsetHeight - window.innerHeight;
    const progress = range > 0 ? Math.max(0, Math.min(window.scrollY / range, 1)) : 0;

    // Drive video frame
    if (video && video.readyState >= 2 && video.duration) {
      const target = progress * video.duration;
      if (Math.abs(video.currentTime - target) > 0.016) {
        video.currentTime = target;
      }
    }

    // Fade in UI at 78–96% of scroll range
    const FADE_START  = 0.78;
    const FADE_FINISH = 0.96;
    if (progress >= FADE_START) {
      setOpacity(Math.min((progress - FADE_START) / (FADE_FINISH - FADE_START), 1));
    } else {
      setOpacity(0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // Run once on mount to catch page load state
  useEffect(() => { onScroll(); }, [onScroll]);

  const openMenu = () => {
    window.dispatchEvent(new CustomEvent("hero:openMenu"));
  };

  const scrollToContent = () => {
    const hero = heroRef.current;
    if (!hero) return;
    window.scrollTo({ top: hero.offsetHeight, behavior: "smooth" });
  };

  const isVisible = opacity > 0;

  return (
    <section
      ref={heroRef}
      className="relative"
      style={{ height: "500vh" }}
    >
      {/* ── Sticky viewport ───────────────────────── */}
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: "100svh" }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Edge vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 120% 55% at 50% 0%,   rgba(8,8,8,0.55) 0%, transparent 70%),
              radial-gradient(ellipse 120% 40% at 50% 100%,  rgba(8,8,8,0.70) 0%, transparent 70%),
              radial-gradient(ellipse 35%  100% at 0%   50%, rgba(8,8,8,0.35) 0%, transparent 60%),
              radial-gradient(ellipse 35%  100% at 100% 50%, rgba(8,8,8,0.35) 0%, transparent 60%)
            `,
          }}
        />

        {/* ── Menu button — top right ───────────────── */}
        <button
          onClick={openMenu}
          aria-label="Open menu"
          style={{
            opacity,
            pointerEvents: isVisible ? "auto" : "none",
            transition: "opacity 0.6s cubic-bezier(0.25,0.46,0.45,0.94), background 0.3s ease",
          }}
          className="absolute top-5 right-5 z-50 w-11 h-11 flex flex-col items-center justify-center gap-[5px]
                     bg-[rgba(8,8,8,0.45)] border border-[rgba(201,168,76,0.30)] rounded backdrop-blur-sm
                     hover:bg-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.6)]
                     active:bg-[rgba(201,168,76,0.25)]"
        >
          <span className="block w-5 h-[1.5px] bg-[#C9A84C] rounded-sm" />
          <span className="block w-3.5 h-[1.5px] bg-[#C9A84C] rounded-sm self-start ml-3" />
          <span className="block w-5 h-[1.5px] bg-[#C9A84C] rounded-sm" />
        </button>

        {/* ── Logo — top left ───────────────────────── */}
        <div
          style={{
            opacity,
            pointerEvents: "none",
            transition: "opacity 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
          className="absolute top-4 left-5 z-50"
        >
          <Image
            src="/logo.jpeg"
            alt="Mushy Parfum"
            width={40}
            height={40}
            className="rounded-sm opacity-90"
          />
        </div>

        {/* ── See More — bottom third ───────────────── */}
        <button
          onClick={scrollToContent}
          aria-label="See more"
          style={{
            opacity,
            pointerEvents: isVisible ? "auto" : "none",
            transition: "opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
            bottom: "33%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className="absolute z-50 flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer"
        >
          <span
            className="font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#F5F0E8] whitespace-nowrap"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.5)" }}
          >
            See more
          </span>
          <span
            className="block w-px h-8 animate-[pulse-line_2s_ease-in-out_infinite]"
            style={{ background: "linear-gradient(to bottom, #C9A84C, transparent)" }}
          />
        </button>
      </div>
    </section>
  );
}
