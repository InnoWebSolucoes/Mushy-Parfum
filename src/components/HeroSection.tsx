"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

// ── Desktop animation config ──────────────────────────────────────
const TOTAL_FRAMES  = 150;
const FRAME_URL     = (n: number) => `/frames/${String(n).padStart(3, "0")}.jpg`;
const FADE_START    = 0.78;
const FADE_FINISH   = 0.96;
const TEXT_FADE_END = 0.05;

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type MobilePhase = "intro" | "video" | "done";

export default function HeroSection() {

  // ── Shared ────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
  const mVideoRef     = useRef<HTMLVideoElement>(null);
  const [mPhase,      setMPhase]      = useState<MobilePhase>("intro");
  const [mIntroShown, setMIntroShown] = useState(false);
  const [mUIShown,    setMUIShown]    = useState(false); // logo + nav appear mid-video

  // ── Detect device ─────────────────────────────────────────────────
  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);

  // ── Cover-fit draw (desktop) ──────────────────────────────────────
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    ctx.drawImage(img, (cw - iw * scale) / 2, (ch - ih * scale) / 2, iw * scale, ih * scale);
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

  // ── Desktop: canvas resize ────────────────────────────────────────
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
      const progress = range > 0 ? Math.max(0, Math.min(window.scrollY / range, 1)) : 0;
      const idx = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);
      currentIdxRef.current = idx;
      const frame = framesRef.current[idx];
      if (frame) drawFrame(frame);
      if (dIntroRef.current && window.scrollY > 0) {
        const tOp = Math.max(0, 1 - progress / TEXT_FADE_END);
        dIntroRef.current.style.transition = "";
        dIntroRef.current.style.opacity    = String(tOp);
      }
      const rawOp = progress >= FADE_START ? (progress - FADE_START) / (FADE_FINISH - FADE_START) : 0;
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

  // ── Mobile: intro text fade-in ────────────────────────────────────
  useEffect(() => {
    if (isMobile !== true) return;
    const t = setTimeout(() => setMIntroShown(true), 300);
    return () => clearTimeout(t);
  }, [isMobile]);

  // ── Mobile: first scroll → video ─────────────────────────────────
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

  // ── Mobile: play video ────────────────────────────────────────────
  useEffect(() => {
    if (mPhase !== "video") return;
    mVideoRef.current?.play().catch(() => {});
  }, [mPhase]);

  // ── Mobile: reveal UI at 65% of video ────────────────────────────
  useEffect(() => {
    if (mPhase !== "video") return;
    const video = mVideoRef.current;
    if (!video) return;
    const onTime = () => {
      if (mUIShown) return;
      const pct = video.duration > 0 ? video.currentTime / video.duration : 0;
      if (pct >= 0.65) setMUIShown(true);
    };
    video.addEventListener("timeupdate", onTime, { passive: true });
    return () => video.removeEventListener("timeupdate", onTime);
  }, [mPhase, mUIShown]);

  // ── Menu scroll lock ──────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollToContent = () => {
    if (heroRef.current) window.scrollTo({ top: heroRef.current.offsetHeight, behavior: "smooth" });
  };

  // ═══════════════════════════════════════════════════════════════════
  // MENU OVERLAY
  // ═══════════════════════════════════════════════════════════════════
  const renderMenu = () => (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#080706",
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.72s cubic-bezier(0.76,0,0.24,1)",
      }}
    >
      {/* Grain */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: 0.03, backgroundImage: GRAIN, backgroundSize: "200px 200px",
      }} />

      {/* Close — bare, top-right, no container */}
      <button
        onClick={() => setMenuOpen(false)}
        aria-label="Close menu"
        style={{
          position: "absolute", top: 32, right: 32, zIndex: 1,
          background: "none", border: "none", padding: 0, cursor: "pointer",
          fontFamily: '"Cormorant Garamond", serif',
          fontStyle: "italic", fontSize: 30, fontWeight: 300,
          color: "rgba(230,223,210,0.32)", lineHeight: 1,
        }}
      >×</button>

      {/* Nav — anchored to bottom of screen */}
      <nav style={{
        position: "absolute",
        bottom: "11vh",
        left: 0,
        right: 0,
        padding: "0 36px",
      }}>
        {["Collections", "About", "Stockists", "Contact"].map((label, i) => (
          <a
            key={label}
            href="#"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: "italic",
              fontSize: "clamp(44px, 13vw, 60px)",
              fontWeight: 300,
              letterSpacing: "0.01em",
              color: "#E6DFD2",
              textDecoration: "none",
              lineHeight: 1.18,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(24px)",
              transition: `opacity 0.5s ease ${0.04 + i * 0.09}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${0.04 + i * 0.09}s`,
            }}
          >
            {label}
          </a>
        ))}

        {/* Thin gold rule after items */}
        <div style={{
          marginTop: "1.4em",
          width: 28,
          height: 1,
          background: "rgba(196,158,82,0.28)",
          opacity: menuOpen ? 1 : 0,
          transition: "opacity 0.5s ease 0.42s",
        }} />
      </nav>
    </div>
  );

  // ── Before hydration ──────────────────────────────────────────────
  if (isMobile === null) {
    return <div style={{ height: "100svh", background: "#080706" }} />;
  }

  // ═══════════════════════════════════════════════════════════════════
  // MOBILE
  // ═══════════════════════════════════════════════════════════════════
  if (isMobile) {
    const uiVisible = mUIShown || mPhase === "done";

    return (
      <>
        <section style={{ height: "100svh", background: "#080706", position: "relative", overflow: "hidden" }}>

          {/* Grain */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none",
            opacity: 0.034, backgroundImage: GRAIN, backgroundSize: "200px 200px",
          }} />

          {/* Video — slow cinematic bleed-in */}
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
              transition: "opacity 3.5s ease",
            }}
          />

          {/* Video vignette — fades in with video */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
            opacity: mPhase !== "intro" ? 1 : 0,
            transition: "opacity 3.5s ease",
            background: [
              "linear-gradient(to bottom, rgba(8,7,6,0.5) 0%, transparent 30%)",
              "linear-gradient(to top,   rgba(8,7,6,0.6) 0%, transparent 35%)",
            ].join(","),
          }} />

          {/* ── INTRO ──────────────────────────────────────────────── */}
          <div style={{
            position: "absolute",
            bottom: "22vh",
            left: 0,
            right: 0,
            zIndex: 10,
            padding: "0 36px",
            pointerEvents: "none",
            opacity: mPhase === "intro" ? 1 : 0,
            transform: mPhase !== "intro" ? "translateY(-28px)" : "translateY(0)",
            transition: mPhase !== "intro"
              ? "opacity 0.5s ease, transform 0.75s cubic-bezier(0.4,0,0.2,1)"
              : "none",
          }}>
            {/* MUSHY — per-letter stagger */}
            <h1 style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(58px, 17.5vw, 78px)",
              fontWeight: 400,
              letterSpacing: "0.17em",
              color: "#E6DFD2",
              textTransform: "uppercase",
              lineHeight: 1,
              margin: 0,
              paddingRight: "0.17em", // offset trailing letter-spacing
            }}>
              {"MUSHY".split("").map((char, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: mIntroShown ? 1 : 0,
                    transform: mIntroShown ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.65s ease ${0.1 + i * 0.055}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.055}s`,
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>

            {/* Parfum — slides in from left, italic contrast */}
            <p style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: "italic",
              fontSize: "clamp(25px, 7.5vw, 35px)",
              fontWeight: 300,
              letterSpacing: "0.18em",
              color: "rgba(196,158,82,0.8)",
              margin: "6px 0 0",
              lineHeight: 1,
              opacity: mIntroShown ? 1 : 0,
              transform: mIntroShown ? "translateX(0)" : "translateX(-20px)",
              transition: "opacity 0.85s ease 0.44s, transform 0.85s cubic-bezier(0.16,1,0.3,1) 0.44s",
            }}>
              Parfum
            </p>
          </div>

          {/* Vertical scroll indicator — right edge */}
          <div style={{
            position: "absolute",
            right: 26,
            bottom: "13vh",
            zIndex: 10,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            opacity: mPhase === "intro" && mIntroShown ? 0.3 : 0,
            transform: mPhase !== "intro" ? "translateY(-16px)" : "translateY(0)",
            transition: mPhase !== "intro"
              ? "opacity 0.4s ease, transform 0.6s ease"
              : "opacity 1.5s ease 0.95s, transform 0.6s ease",
          }}>
            <span style={{
              fontFamily: '"Cinzel", serif',
              fontSize: 6.5,
              letterSpacing: "0.44em",
              color: "#E6DFD2",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              paddingBottom: "0.44em",
            }}>
              Scroll
            </span>
            <div style={{
              width: 1, height: 38,
              background: "linear-gradient(to bottom, rgba(196,158,82,0.5), transparent)",
              animation: mIntroShown ? "pulse-line 2.8s ease-in-out infinite" : "none",
            }} />
          </div>

          {/* ── POST-VIDEO UI ───────────────────────────────────── */}

          {/* Logo — fades in at 65% of video */}
          <div style={{
            position: "absolute", top: 28, left: 28, zIndex: 50,
            opacity: uiVisible ? 1 : 0,
            transition: "opacity 1.4s ease",
            pointerEvents: "none",
          }}>
            <Image
              src="/logo.jpeg"
              alt="Mushy Parfum"
              width={36}
              height={36}
              className="rounded"
              style={{ opacity: 0.9 }}
            />
          </div>

          {/* Hamburger — fades in at 65% of video */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              position: "absolute", top: 30, right: 28, zIndex: 50,
              opacity: uiVisible ? 1 : 0,
              pointerEvents: uiVisible ? "auto" : "none",
              transition: "opacity 1.4s ease",
              background: "none", border: "none", padding: 0, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7,
            }}
          >
            <span style={{ display: "block", width: 26, height: 1, background: "#E6DFD2", opacity: 0.68 }} />
            <span style={{ display: "block", width: 18, height: 1, background: "#E6DFD2", opacity: 0.68 }} />
            <span style={{ display: "block", width: 26, height: 1, background: "#E6DFD2", opacity: 0.68 }} />
          </button>

        </section>

        {renderMenu()}
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // DESKTOP — scroll-driven frame animation
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
