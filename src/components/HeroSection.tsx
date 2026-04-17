"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

// ── Desktop animation config ──────────────────────────────────────
const TOTAL_FRAMES  = 150;
const FRAME_URL     = (n: number) =>
  `/frames/${String(n).padStart(3, "0")}.jpg`;
const FADE_START    = 0.78;
const FADE_FINISH   = 0.96;
const TEXT_FADE_END = 0.05;

type MobilePhase = "intro" | "video" | "done";

export default function HeroSection() {

  // ── Shared ────────────────────────────────────────────────────────
  const [isMobile, setIsMobile]   = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen]   = useState(false);

  // ── Desktop ───────────────────────────────────────────────────────
  const heroRef       = useRef<HTMLElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const dMenuBtnRef   = useRef<HTMLButtonElement>(null);
  const dSeeMoreRef   = useRef<HTMLButtonElement>(null);
  const dLogoRef      = useRef<HTMLDivElement>(null);
  const dIntroRef     = useRef<HTMLDivElement>(null);
  const framesRef     = useRef<HTMLImageElement[]>([]);
  const loadedRef     = useRef(0);
  const currentIdxRef = useRef(0);
  const [loadPct, setLoadPct] = useState(0);
  const [ready,   setReady]   = useState(false);

  // ── Mobile ────────────────────────────────────────────────────────
  const mVideoRef        = useRef<HTMLVideoElement>(null);
  const [mPhase,         setMPhase]       = useState<MobilePhase>("intro");
  const [mIntroShown,    setMIntroShown]  = useState(false);

  // ── Detect device ─────────────────────────────────────────────────
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // ── Cover-fit draw (desktop) ──────────────────────────────────────
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    ctx.drawImage(img,
      (cw - iw * scale) / 2,
      (ch - ih * scale) / 2,
      iw * scale, ih * scale
    );
  }, []);

  // ── Desktop: preload frames ───────────────────────────────────────
  useEffect(() => {
    if (isMobile !== false) return;
    const imgs = new Array<HTMLImageElement>(TOTAL_FRAMES);
    framesRef.current = imgs;
    loadedRef.current = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = FRAME_URL(i + 1);
      img.onload = () => {
        loadedRef.current += 1;
        setLoadPct(Math.round((loadedRef.current / TOTAL_FRAMES) * 100));
        if (i === 0) drawFrame(img);
        if (loadedRef.current === TOTAL_FRAMES) setReady(true);
      };
      img.onerror = () => {
        loadedRef.current += 1;
        setLoadPct(Math.round((loadedRef.current / TOTAL_FRAMES) * 100));
        if (loadedRef.current === TOTAL_FRAMES) setReady(true);
      };
      imgs[i] = img;
    }
  }, [isMobile, drawFrame]);

  // ── Desktop: canvas resize (width-only, ignores mobile toolbar) ───
  useEffect(() => {
    if (isMobile !== false) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      if (window.innerWidth === canvas.width) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const f = framesRef.current[currentIdxRef.current];
      if (f?.complete && f.naturalWidth) drawFrame(f);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, [isMobile, drawFrame]);

  // ── Desktop: intro text fade-in ───────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const el = dIntroRef.current;
    if (!el) return;
    el.style.transition = "opacity 1.4s ease";
    requestAnimationFrame(() => { el.style.opacity = "1"; });
  }, [ready]);

  // ── Desktop: scroll → frames + UI ────────────────────────────────
  useEffect(() => {
    if (isMobile !== false || !ready) return;
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const range    = hero.offsetHeight - window.innerHeight;
      const progress = range > 0
        ? Math.max(0, Math.min(window.scrollY / range, 1))
        : 0;
      const idx = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);
      currentIdxRef.current = idx;
      const frame = framesRef.current[idx];
      if (frame) drawFrame(frame);
      // Intro text
      if (dIntroRef.current && window.scrollY > 0) {
        const tOp = Math.max(0, 1 - progress / TEXT_FADE_END);
        dIntroRef.current.style.transition = "";
        dIntroRef.current.style.opacity    = String(tOp);
      }
      // UI elements
      const rawOp = progress >= FADE_START
        ? (progress - FADE_START) / (FADE_FINISH - FADE_START)
        : 0;
      const op = String(Math.min(rawOp, 1));
      const pe = parseFloat(op) > 0.4 ? "auto" : "none";
      if (dMenuBtnRef.current)  { dMenuBtnRef.current.style.opacity = op; dMenuBtnRef.current.style.pointerEvents = pe; }
      if (dSeeMoreRef.current)  { dSeeMoreRef.current.style.opacity = op; dSeeMoreRef.current.style.pointerEvents = pe; }
      if (dLogoRef.current)       dLogoRef.current.style.opacity = op;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile, ready, drawFrame]);

  // ── Mobile: fade in intro text after mount ────────────────────────
  useEffect(() => {
    if (isMobile !== true) return;
    const t = setTimeout(() => setMIntroShown(true), 300);
    return () => clearTimeout(t);
  }, [isMobile]);

  // ── Mobile: trigger on first scroll or swipe ─────────────────────
  useEffect(() => {
    if (isMobile !== true || mPhase !== "intro") return;
    const trigger = () => setMPhase("video");
    window.addEventListener("wheel",     trigger, { passive: true, once: true });
    window.addEventListener("touchmove", trigger, { passive: true, once: true });
    return () => {
      window.removeEventListener("wheel",     trigger);
      window.removeEventListener("touchmove", trigger);
    };
  }, [isMobile, mPhase]);

  // ── Mobile: play video when phase → video ────────────────────────
  useEffect(() => {
    if (mPhase !== "video") return;
    mVideoRef.current?.play().catch(() => {});
  }, [mPhase]);

  // ── Menu scroll lock ──────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollToContent = () => {
    if (heroRef.current)
      window.scrollTo({ top: heroRef.current.offsetHeight, behavior: "smooth" });
  };

  // ── Shared menu overlay ───────────────────────────────────────────
  const renderMenu = () => (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#0c0b09",
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.65s cubic-bezier(0.76,0,0.24,1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Grain */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.032,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "32px 32px 0", flexShrink: 0 }}>
        <span style={{
          fontFamily: '"Cinzel", serif',
          fontSize: 8.5,
          letterSpacing: "0.3em",
          color: "rgba(184,145,74,0.45)",
          textTransform: "uppercase",
        }}>
          Mushy Parfum
        </span>
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          style={{
            background: "none", border: "none", padding: 0,
            cursor: "pointer",
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 28, fontWeight: 300,
            color: "rgba(232,226,214,0.38)",
            lineHeight: 1,
          }}
        >×</button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px" }}>
        {[["01","Collections"],["02","About"],["03","Stockists"],["04","Contact"]].map(([num, label], i) => (
          <a
            key={label}
            href="#"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "1.2em",
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(24px, 7vw, 32px)",
              fontWeight: 400,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#E8E2D6",
              textDecoration: "none",
              padding: "0.62em 0",
              borderBottom: "1px solid rgba(184,145,74,0.09)",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateX(0)" : "translateX(24px)",
              transition: `opacity 0.45s ease ${0.08 + i * 0.07}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.08 + i * 0.07}s`,
            }}
          >
            <span style={{
              fontFamily: '"Cinzel", serif',
              fontSize: 8,
              letterSpacing: "0.12em",
              color: "rgba(184,145,74,0.32)",
              flexShrink: 0,
            }}>{num}</span>
            {label}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "0 32px 36px", flexShrink: 0 }}>
        <p style={{
          fontFamily: '"Cinzel", serif', fontSize: 7,
          letterSpacing: "0.35em", color: "rgba(232,226,214,0.1)",
          textTransform: "uppercase",
        }}>Est. 2024</p>
      </div>
    </div>
  );

  // ── Before hydration ──────────────────────────────────────────────
  if (isMobile === null) {
    return <div style={{ height: "100svh", background: "#080808" }} />;
  }

  // ═══════════════════════════════════════════════════════════════════
  // MOBILE
  // ═══════════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <>
        <section style={{ height: "100svh", background: "#0c0b09", position: "relative", overflow: "hidden" }}>

          {/* Grain — always visible */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none", opacity: 0.034,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }} />

          {/* Video — slow cinematic fade in */}
          <video
            ref={mVideoRef}
            src="/mobile-hero.mp4"
            muted
            playsInline
            preload="auto"
            onEnded={() => setMPhase("done")}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", zIndex: 1,
              opacity: mPhase !== "intro" ? 1 : 0,
              transition: "opacity 3.2s ease",
            }}
          />

          {/* Video vignette */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
            opacity: mPhase !== "intro" ? 1 : 0,
            transition: "opacity 3.2s ease",
            background: [
              "linear-gradient(to bottom, rgba(12,11,9,0.4) 0%, transparent 30%)",
              "linear-gradient(to top, rgba(12,11,9,0.55) 0%, transparent 35%)",
            ].join(","),
          }} />

          {/* ── INTRO ─────────────────────────────────────────── */}
          <div
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
              opacity: mPhase === "intro" ? (mIntroShown ? 1 : 0) : 0,
              transform: mPhase !== "intro" ? "translateY(-32px) scale(0.97)" : "translateY(0) scale(1)",
              transition: mPhase !== "intro"
                ? "opacity 0.55s ease, transform 0.85s cubic-bezier(0.4,0,0.2,1)"
                : "opacity 1.6s ease",
            }}
          >
            {/* Title block */}
            <div style={{ textAlign: "center", lineHeight: 1 }}>
              <h1 style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(52px, 15.5vw, 74px)",
                fontWeight: 500,
                letterSpacing: "0.24em",
                color: "#E8E2D6",
                textTransform: "uppercase",
                margin: 0,
                lineHeight: 0.95,
                paddingRight: "0.24em",
              }}>
                Mushy
              </h1>

              {/* Gold gradient rule */}
              <div style={{
                width: "100%",
                height: 1,
                margin: "0.55em 0",
                background: "linear-gradient(to right, transparent, rgba(184,145,74,0.55) 20%, rgba(184,145,74,0.55) 80%, transparent)",
              }} />

              <p style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(22px, 6.5vw, 32px)",
                fontWeight: 400,
                letterSpacing: "0.58em",
                color: "rgba(184,145,74,0.78)",
                textTransform: "uppercase",
                margin: 0,
                lineHeight: 1,
                paddingRight: "0.58em",
              }}>
                Parfum
              </p>
            </div>

            {/* Scroll cue — pinned to bottom */}
            <div style={{
              position: "absolute",
              bottom: "9vh",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
            }}>
              <span style={{
                fontFamily: '"Cinzel", serif',
                fontSize: 7,
                letterSpacing: "0.52em",
                color: "rgba(232,226,214,0.25)",
                textTransform: "uppercase",
                paddingRight: "0.52em",
                animation: "pulse-fade 3s ease-in-out infinite",
                whiteSpace: "nowrap",
              }}>
                Scroll
              </span>
              <span style={{
                display: "block", width: 1, height: 38,
                background: "linear-gradient(to bottom, rgba(184,145,74,0.4), transparent)",
                animation: "pulse-line 3s ease-in-out infinite",
              }} />
            </div>
          </div>

          {/* ── POST-VIDEO UI ──────────────────────────────────── */}

          {/* Logo — top left */}
          <div style={{
            position: "absolute", top: 28, left: 28, zIndex: 50,
            opacity: mPhase === "done" ? 1 : 0,
            transition: "opacity 1s ease 0.4s",
            pointerEvents: "none",
          }}>
            <Image
              src="/logo.jpeg"
              alt="Mushy Parfum"
              width={38}
              height={38}
              className="rounded"
              style={{ opacity: 0.88 }}
            />
          </div>

          {/* Hamburger — top right, bare lines */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              position: "absolute", top: 28, right: 28, zIndex: 50,
              opacity: mPhase === "done" ? 1 : 0,
              pointerEvents: mPhase === "done" ? "auto" : "none",
              transition: "opacity 1s ease 0.4s",
              background: "none", border: "none", padding: 0, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7,
            }}
          >
            <span style={{ display: "block", width: 28, height: 1, background: "#E8E2D6", opacity: 0.72 }} />
            <span style={{ display: "block", width: 20, height: 1, background: "#E8E2D6", opacity: 0.72 }} />
            <span style={{ display: "block", width: 28, height: 1, background: "#E8E2D6", opacity: 0.72 }} />
          </button>

          {/* Explore cue — bottom center */}
          <div style={{
            position: "absolute", bottom: 28, left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            opacity: mPhase === "done" ? 1 : 0,
            transition: "opacity 1s ease 0.7s",
            pointerEvents: "none",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.65rem",
          }}>
            <span style={{
              fontFamily: '"Cinzel", serif',
              fontSize: 7.5,
              letterSpacing: "0.44em",
              color: "rgba(232,226,214,0.5)",
              textTransform: "uppercase",
              paddingRight: "0.44em",
              textShadow: "0 1px 18px rgba(0,0,0,0.9)",
              whiteSpace: "nowrap",
            }}>
              Explore
            </span>
            <span style={{
              display: "block", width: 1, height: 32,
              background: "linear-gradient(to bottom, rgba(184,145,74,0.6), transparent)",
              animation: "pulse-line 2.4s ease-in-out infinite",
            }} />
          </div>

        </section>

        {renderMenu()}
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // DESKTOP — scroll-driven frame animation (unchanged)
  // ═══════════════════════════════════════════════════════════════════
  return (
    <>
      <section ref={heroRef} style={{ height: "500vh" }} className="relative">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100svh" }}>

          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%", display: "block" }}
          />

          {/* Loading overlay */}
          <div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center"
            style={{
              background: "#080808",
              opacity: ready ? 0 : 1,
              pointerEvents: ready ? "none" : "auto",
              transition: "opacity 0.8s ease",
            }}
          >
            <div
              className="relative overflow-hidden rounded-full"
              style={{ width: 160, height: 1, background: "rgba(201,168,76,0.2)" }}
            >
              <div style={{ position: "absolute", inset: 0, background: "#C9A84C", transform: `scaleX(${loadPct / 100})`, transformOrigin: "left", transition: "transform 0.2s ease" }} />
            </div>
            <p className="font-cinzel mt-4" style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(201,168,76,0.5)" }}>
              {loadPct < 100 ? "LOADING" : ""}
            </p>
          </div>

          {/* Edge vignette */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                "radial-gradient(ellipse 130% 55% at 50% 0%,    rgba(8,8,8,0.60) 0%, transparent 70%)",
                "radial-gradient(ellipse 130% 45% at 50% 100%,  rgba(8,8,8,0.75) 0%, transparent 70%)",
                "radial-gradient(ellipse 35%  100% at 0%   50%, rgba(8,8,8,0.35) 0%, transparent 60%)",
                "radial-gradient(ellipse 35%  100% at 100% 50%, rgba(8,8,8,0.35) 0%, transparent 60%)",
              ].join(","),
            }}
          />

          {/* Desktop intro text */}
          <div
            ref={dIntroRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
            style={{ opacity: 0 }}
          >
            <p className="font-cinzel" style={{ fontSize: 10, letterSpacing: "0.45em", color: "#8B7355", marginBottom: "1.5rem", textTransform: "uppercase" }}>
              The House of
            </p>
            <h1 className="font-cormorant" style={{ fontSize: "clamp(44px, 12vw, 64px)", fontWeight: 300, letterSpacing: "-0.01em", color: "#F5F0E8", lineHeight: 1, textShadow: "0 2px 40px rgba(0,0,0,0.7)" }}>
              Mushy Parfum
            </h1>
            <div style={{ marginTop: "3.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <span className="font-cinzel" style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(245,240,232,0.45)", textTransform: "uppercase", animation: "pulse-fade 2.5s ease-in-out infinite" }}>
                Scroll to discover
              </span>
              <span className="block w-px h-8" style={{ background: "linear-gradient(to bottom, #C9A84C, transparent)", animation: "pulse-line 2.5s ease-in-out infinite" }} />
            </div>
          </div>

          {/* Logo */}
          <div
            ref={dLogoRef}
            aria-hidden="true"
            className="absolute top-5 left-5 z-50 pointer-events-none"
            style={{ opacity: 0, transition: "opacity 0.5s ease" }}
          >
            <Image src="/logo.jpeg" alt="Mushy Parfum" width={44} height={44} className="rounded" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }} />
          </div>

          {/* Menu button */}
          <button
            ref={dMenuBtnRef}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="absolute top-5 right-5 z-50 w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded"
            style={{
              opacity: 0,
              pointerEvents: "none",
              transition: "opacity 0.5s ease",
              background: "rgba(8,8,8,0.45)",
              border: "1px solid rgba(201,168,76,0.30)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <span className="block w-5 h-[1.5px] rounded-sm" style={{ background: "#C9A84C" }} />
            <span className="block w-3.5 h-[1.5px] rounded-sm self-start ml-3" style={{ background: "#C9A84C" }} />
            <span className="block w-5 h-[1.5px] rounded-sm" style={{ background: "#C9A84C" }} />
          </button>

          {/* See more */}
          <button
            ref={dSeeMoreRef}
            onClick={scrollToContent}
            aria-label="See more"
            className="absolute z-50 flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer"
            style={{
              opacity: 0,
              pointerEvents: "none",
              transition: "opacity 0.5s ease",
              bottom: "33%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <span className="font-cinzel text-[11px] tracking-[0.25em] uppercase whitespace-nowrap" style={{ color: "#F5F0E8", textShadow: "0 1px 14px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.6)" }}>
              See more
            </span>
            <span className="block w-px h-8" style={{ background: "linear-gradient(to bottom, #C9A84C, transparent)", animation: "pulse-line 2s ease-in-out infinite" }} />
          </button>

        </div>
      </section>

      {renderMenu()}
    </>
  );
}
