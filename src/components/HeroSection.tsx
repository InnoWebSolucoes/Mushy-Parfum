"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

// ── Desktop config ─────────────────────────────────────────────────
const TOTAL_FRAMES  = 150;
const FRAME_URL     = (n: number) => `/frames/${String(n).padStart(3, "0")}.jpg`;
const FADE_START    = 0.78;
const FADE_FINISH   = 0.96;
const TEXT_FADE_END = 0.05;

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Design tokens
const C = {
  bg:      "#09090B",
  cream:   "#EEEAE2",
  gold:    "#C4A35A",
  goldDim: "rgba(196,163,90,0.55)",
  dim:     "rgba(238,234,226,0.38)",
};

type MobilePhase = "intro" | "video" | "done";

export default function HeroSection() {

  // ── Shared ────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Desktop refs ──────────────────────────────────────────────────
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

  // ── Mobile state ──────────────────────────────────────────────────
  const mVideoRef     = useRef<HTMLVideoElement>(null);
  const [mPhase,      setMPhase]      = useState<MobilePhase>("intro");
  const [mIntroShown, setMIntroShown] = useState(false);
  const [mUIShown,    setMUIShown]    = useState(false);

  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);

  // ── Desktop: cover-fit draw ───────────────────────────────────────
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: cw, height: ch } = canvas;
    const { naturalWidth: iw, naturalHeight: ih } = img;
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
        loadedRef.current++;
        setLoadPct(Math.round((loadedRef.current / TOTAL_FRAMES) * 100));
        if (i === 0) drawFrame(img);
        if (loadedRef.current === TOTAL_FRAMES) setReady(true);
      };
      img.onerror = () => {
        loadedRef.current++;
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

  // ── Desktop: intro fade-in ────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const el = dIntroRef.current;
    if (!el) return;
    el.style.transition = "opacity 1.4s ease";
    requestAnimationFrame(() => { el.style.opacity = "1"; });
  }, [ready]);

  // ── Desktop: scroll handler ───────────────────────────────────────
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
        dIntroRef.current.style.transition = "";
        dIntroRef.current.style.opacity = String(Math.max(0, 1 - progress / TEXT_FADE_END));
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

  // ── Mobile: show intro text ───────────────────────────────────────
  useEffect(() => {
    if (isMobile !== true) return;
    const t = setTimeout(() => setMIntroShown(true), 200);
    return () => clearTimeout(t);
  }, [isMobile]);

  // ── Mobile: first touch → video ──────────────────────────────────
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

  // ── Mobile: show chrome at 65% of video ──────────────────────────
  useEffect(() => {
    if (mPhase !== "video") return;
    const video = mVideoRef.current;
    if (!video) return;
    const check = () => {
      if (mUIShown) return;
      if (video.duration > 0 && video.currentTime / video.duration >= 0.65) setMUIShown(true);
    };
    video.addEventListener("timeupdate", check, { passive: true });
    return () => video.removeEventListener("timeupdate", check);
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
  // MENU — slides up from bottom
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
        background: C.bg,
        transform: menuOpen ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.72s cubic-bezier(0.76,0,0.24,1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Subtle grain */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: 0.025, backgroundImage: GRAIN, backgroundSize: "200px 200px",
      }} />

      {/* Top bar: just the close label */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "36px 36px 0",
        flexShrink: 0,
      }}>
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontFamily: '"Josefin Sans", sans-serif',
            fontWeight: 100,
            fontSize: 9,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: C.dim,
            lineHeight: 1,
            paddingRight: "0.5em",
          }}
        >
          Close
        </button>
      </div>

      {/* Nav — vertically centered, left-aligned */}
      <nav style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 40px",
        gap: 0,
      }}>
        {["Collections", "About", "Stockists", "Contact"].map((label, i) => (
          <a
            key={label}
            href="#"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              fontFamily: '"Playfair Display", serif',
              fontSize: "clamp(40px, 11.5vw, 54px)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: C.cream,
              textDecoration: "none",
              lineHeight: 1.22,
              borderBottom: `1px solid rgba(238,234,226,0.07)`,
              padding: "0.22em 0",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.55s ease ${0.06 + i * 0.09}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.06 + i * 0.09}s`,
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Footer: year + brand name ultra-small */}
      <div style={{
        padding: "0 40px 40px",
        flexShrink: 0,
        opacity: menuOpen ? 1 : 0,
        transition: "opacity 0.5s ease 0.44s",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{
            fontFamily: '"Josefin Sans", sans-serif',
            fontWeight: 100,
            fontSize: 8,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(238,234,226,0.15)",
            paddingRight: "0.38em",
          }}>
            Mushy Parfum
          </span>
          <span style={{
            fontFamily: '"Josefin Sans", sans-serif',
            fontWeight: 100,
            fontSize: 8,
            letterSpacing: "0.2em",
            color: "rgba(238,234,226,0.1)",
          }}>
            Est. 2024
          </span>
        </div>
      </div>
    </div>
  );

  // ── Before hydration ──────────────────────────────────────────────
  if (isMobile === null) {
    return <div style={{ height: "100svh", background: C.bg }} />;
  }

  // ═══════════════════════════════════════════════════════════════════
  // MOBILE
  // ═══════════════════════════════════════════════════════════════════
  if (isMobile) {
    const uiVisible = mUIShown || mPhase === "done";

    return (
      <>
        <section style={{ height: "100svh", background: C.bg, position: "relative", overflow: "hidden" }}>

          {/* Grain overlay */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 9, pointerEvents: "none",
            opacity: 0.032, backgroundImage: GRAIN, backgroundSize: "200px 200px",
          }} />

          {/* Video */}
          <video
            ref={mVideoRef}
            src="/mobile-hero.mp4"
            muted
            playsInline
            preload="auto"
            onEnded={() => setMPhase("done")}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", zIndex: 1,
              opacity: mPhase !== "intro" ? 1 : 0,
              transition: "opacity 3.8s ease",
            }}
          />

          {/* Vignette over video */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
            opacity: mPhase !== "intro" ? 1 : 0,
            transition: "opacity 3.8s ease",
            background: [
              "linear-gradient(to bottom, rgba(9,9,11,0.55) 0%, transparent 25%)",
              "linear-gradient(to top,    rgba(9,9,11,0.65) 0%, transparent 30%)",
            ].join(","),
          }} />

          {/* ═══ INTRO ════════════════════════════════════════════════ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 36px",
              paddingBottom: "8vh",
              pointerEvents: "none",
              opacity: mPhase === "intro" ? (mIntroShown ? 1 : 0) : 0,
              transition: mPhase !== "intro"
                ? "opacity 0.6s ease"
                : "opacity 1.8s ease",
            }}
          >
            {/* Brand name — Playfair Display, the whole block fades as one unit */}
            <div>
              <h1 style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: "clamp(72px, 22vw, 96px)",
                fontWeight: 700,
                color: C.cream,
                letterSpacing: "-0.025em",
                lineHeight: 0.88,
                margin: 0,
              }}>
                Mushy
              </h1>
              <p style={{
                fontFamily: '"Josefin Sans", sans-serif',
                fontWeight: 100,
                fontSize: "clamp(11px, 3.2vw, 15px)",
                letterSpacing: "0.68em",
                textTransform: "uppercase",
                color: C.goldDim,
                margin: "18px 0 0 4px",
                paddingRight: "0.68em",
                lineHeight: 1,
              }}>
                Parfum
              </p>
            </div>

            {/* Scroll hint — absolute, bottom of intro container */}
            <div style={{
              position: "absolute",
              bottom: "9vh",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}>
              <div style={{
                width: 1,
                height: 44,
                background: `linear-gradient(to bottom, ${C.goldDim}, transparent)`,
                animation: "pulse-line 2.6s ease-in-out infinite",
              }} />
            </div>
          </div>

          {/* ═══ POST-VIDEO CHROME ════════════════════════════════════ */}

          {/* Logo — top left */}
          <div style={{
            position: "absolute", top: 28, left: 28, zIndex: 50,
            opacity: uiVisible ? 1 : 0,
            transition: "opacity 1.6s ease",
            pointerEvents: "none",
          }}>
            <Image
              src="/logo.jpeg"
              alt="Mushy Parfum"
              width={34}
              height={34}
              className="rounded"
              style={{ opacity: 0.92 }}
            />
          </div>

          {/* Hamburger — top right, bare */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              position: "absolute", top: 32, right: 30, zIndex: 50,
              opacity: uiVisible ? 1 : 0,
              pointerEvents: uiVisible ? "auto" : "none",
              transition: "opacity 1.6s ease",
              background: "none", border: "none", padding: 0, cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            <span style={{ display: "block", width: 24, height: 1, background: C.cream, opacity: 0.7 }} />
            <span style={{ display: "block", width: 16, height: 1, background: C.cream, opacity: 0.7 }} />
            <span style={{ display: "block", width: 24, height: 1, background: C.cream, opacity: 0.7 }} />
          </button>

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
            <div className="relative overflow-hidden" style={{ width: 140, height: 1, background: "rgba(196,163,90,0.18)" }}>
              <div style={{ position: "absolute", inset: 0, background: C.gold, transform: `scaleX(${loadPct / 100})`, transformOrigin: "left", transition: "transform 0.2s ease" }} />
            </div>
            <p style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 9, letterSpacing: "0.4em", color: "rgba(196,163,90,0.45)", marginTop: 14 }}>
              {loadPct < 100 ? "LOADING" : ""}
            </p>
          </div>

          {/* Edge vignette */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
            background: [
              "radial-gradient(ellipse 130% 55% at 50% 0%,    rgba(9,9,11,0.65) 0%, transparent 70%)",
              "radial-gradient(ellipse 130% 45% at 50% 100%,  rgba(9,9,11,0.75) 0%, transparent 70%)",
              "radial-gradient(ellipse 35%  100% at 0%   50%, rgba(9,9,11,0.35) 0%, transparent 60%)",
              "radial-gradient(ellipse 35%  100% at 100% 50%, rgba(9,9,11,0.35) 0%, transparent 60%)",
            ].join(","),
          }} />

          {/* Desktop intro text */}
          <div
            ref={dIntroRef}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ opacity: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8vw" }}
          >
            <h1 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "clamp(56px, 8vw, 90px)",
              fontWeight: 700,
              color: C.cream,
              letterSpacing: "-0.025em",
              lineHeight: 0.9,
              margin: 0,
            }}>
              Mushy
            </h1>
            <p style={{
              fontFamily: '"Josefin Sans", sans-serif',
              fontWeight: 100,
              fontSize: "clamp(10px, 1.1vw, 14px)",
              letterSpacing: "0.65em",
              textTransform: "uppercase",
              color: C.goldDim,
              margin: "20px 0 0 4px",
              paddingRight: "0.65em",
            }}>
              Parfum
            </p>
            <div style={{ marginTop: "3.5rem", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.6rem" }}>
              <span style={{
                fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100,
                fontSize: 9, letterSpacing: "0.45em", textTransform: "uppercase",
                color: "rgba(238,234,226,0.35)", paddingRight: "0.45em",
                animation: "pulse-fade 2.5s ease-in-out infinite",
              }}>
                Scroll to discover
              </span>
              <span style={{
                display: "block", width: 1, height: 36,
                background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
                animation: "pulse-line 2.5s ease-in-out infinite",
              }} />
            </div>
          </div>

          {/* Desktop: Logo */}
          <div ref={dLogoRef} className="absolute top-6 left-6 z-50 pointer-events-none" style={{ opacity: 0, transition: "opacity 0.5s ease" }}>
            <Image src="/logo.jpeg" alt="Mushy Parfum" width={40} height={40} className="rounded" />
          </div>

          {/* Desktop: menu button */}
          <button
            ref={dMenuBtnRef}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              position: "absolute", top: 28, right: 28, zIndex: 50,
              opacity: 0, pointerEvents: "none", transition: "opacity 0.5s ease",
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, padding: 0,
            }}
          >
            <span style={{ display: "block", width: 26, height: 1, background: C.cream, opacity: 0.65 }} />
            <span style={{ display: "block", width: 18, height: 1, background: C.cream, opacity: 0.65 }} />
            <span style={{ display: "block", width: 26, height: 1, background: C.cream, opacity: 0.65 }} />
          </button>

          {/* Desktop: see more */}
          <button
            ref={dSeeMoreRef}
            onClick={scrollToContent}
            aria-label="See more"
            style={{
              position: "absolute", bottom: "30%", left: "50%", transform: "translateX(-50%)",
              zIndex: 50, opacity: 0, pointerEvents: "none", transition: "opacity 0.5s ease",
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            }}
          >
            <span style={{
              fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100,
              fontSize: 9, letterSpacing: "0.45em", textTransform: "uppercase",
              color: C.cream, paddingRight: "0.45em",
              textShadow: "0 1px 16px rgba(0,0,0,0.9)",
              whiteSpace: "nowrap",
            }}>
              See more
            </span>
            <span style={{
              display: "block", width: 1, height: 32,
              background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
              animation: "pulse-line 2s ease-in-out infinite",
            }} />
          </button>

        </div>
      </section>

      {renderMenu()}
    </>
  );
}
