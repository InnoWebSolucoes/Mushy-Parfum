"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import QuizOverlay from "./QuizOverlay";

// ── Desktop config ─────────────────────────────────────────────────
const TOTAL_FRAMES  = 150;
const FRAME_URL     = (n: number) => `/frames/${String(n).padStart(3, "0")}.jpg`;
const FADE_START    = 0.78;
const FADE_FINISH   = 0.96;
const TEXT_FADE_END = 0.05;

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const C = {
  bg:      "#09090B",
  cream:   "#EEEAE2",
  gold:    "#C4A35A",
  goldDim: "rgba(196,163,90,0.55)",
  dim:     "rgba(238,234,226,0.35)",
};

// Extra carousel slides (after CTA slide 0)
const CAROUSEL_EXTRA = [
  {
    bg:      "radial-gradient(ellipse at 50% 60%, #1a1206 0%, #09090B 100%)",
    eyebrow: "Descubra",
    title:   "nossa coleção completa",
    cta:     "Ver tudo",
  },
  {
    bg:      "radial-gradient(ellipse at 40% 40%, #0f0820 0%, #09090B 100%)",
    eyebrow: "Criado para",
    title:   "uma saída à noite",
    cta:     "Explorar",
  },
  {
    bg:      "radial-gradient(ellipse at 60% 40%, #0a140a 0%, #09090B 100%)",
    eyebrow: "Perfeito para",
    title:   "o dia a dia",
    cta:     "Explorar",
  },
];
const TOTAL_SLIDES = 1 + CAROUSEL_EXTRA.length;

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
  const [cardVisible, setCardVisible] = useState(false);
  const [slideIdx,    setSlideIdx]    = useState(0);
  const [lastFrameUrl, setLastFrameUrl] = useState<string | null>(null);
  const [quizActive,  setQuizActive]  = useState(false);

  const carouselDragRef = useRef({ startX: 0, startY: 0, moved: false });

  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);

  // ── Mobile: scroll lock until carousel visible; lock during quiz ─────
  useEffect(() => {
    if (isMobile !== true) return;
    const locked = !cardVisible || quizActive;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, cardVisible, quizActive]);

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

  // ── Desktop: preload ──────────────────────────────────────────────
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

  // ── Desktop: intro fade ───────────────────────────────────────────
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

  // ── Mobile: intro text ────────────────────────────────────────────
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

  // ── Mobile: capture frame at 65% ─────────────────────────────────
  useEffect(() => {
    if (mPhase !== "video") return;
    const video = mVideoRef.current;
    if (!video) return;
    const check = () => {
      if (!video.duration) return;
      if (!mUIShown && video.currentTime / video.duration >= 0.65) {
        setMUIShown(true);
        try {
          const tmp = document.createElement("canvas");
          tmp.width  = video.videoWidth  || 390;
          tmp.height = video.videoHeight || 844;
          tmp.getContext("2d")?.drawImage(video, 0, 0, tmp.width, tmp.height);
          setLastFrameUrl(tmp.toDataURL("image/jpeg", 0.92));
        } catch { /* cross-origin guard */ }
      }
    };
    video.addEventListener("timeupdate", check, { passive: true });
    return () => video.removeEventListener("timeupdate", check);
  }, [mPhase, mUIShown]);

  // ── Mobile: delay card reveal slightly after chrome ──────────────
  useEffect(() => {
    if (!mUIShown) return;
    const t = setTimeout(() => setCardVisible(true), 180);
    return () => clearTimeout(t);
  }, [mUIShown]);

  // ── Mobile: video ended ───────────────────────────────────────────
  const handleVideoEnded = useCallback(() => {
    setMPhase("done");
  }, []);

  // ── Carousel drag handlers ────────────────────────────────────────
  const onCarouselDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    carouselDragRef.current = { startX: e.clientX, startY: e.clientY, moved: false };
  }, []);

  const onCarouselMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const dx = Math.abs(e.clientX - carouselDragRef.current.startX);
    const dy = Math.abs(e.clientY - carouselDragRef.current.startY);
    if (dx > 8 || dy > 8) carouselDragRef.current.moved = true;
  }, []);

  const onCarouselUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const dx = e.clientX - carouselDragRef.current.startX;
    const dy = e.clientY - carouselDragRef.current.startY;
    if (!carouselDragRef.current.moved) return;
    if (Math.abs(dy) > Math.abs(dx) && dy > 60) {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    } else if (Math.abs(dx) > 40) {
      setSlideIdx(i => dx < 0 ? Math.min(i + 1, TOTAL_SLIDES - 1) : Math.max(i - 1, 0));
    }
  }, []);

  const onCtaTap = useCallback(() => {
    if (!carouselDragRef.current.moved) setQuizActive(true);
  }, []);

  // ── Menu scroll lock ──────────────────────────────────────────────
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else if (isMobile === true && (!cardVisible || quizActive)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, isMobile, cardVisible, quizActive]);

  const scrollToContent = () => {
    if (heroRef.current) window.scrollTo({ top: heroRef.current.offsetHeight, behavior: "smooth" });
  };

  // ═══════════════════════════════════════════════════════════════════
  // MENU
  // ═══════════════════════════════════════════════════════════════════
  const renderMenu = () => (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navegação"
      style={{
        position: "fixed", inset: 0, zIndex: 200, background: C.bg,
        transform: menuOpen ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.72s cubic-bezier(0.76,0,0.24,1)",
        display: "flex", flexDirection: "column",
      }}
    >
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: 0.025, backgroundImage: GRAIN, backgroundSize: "200px 200px",
      }} />
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "36px 36px 0", flexShrink: 0 }}>
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar menu"
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontFamily: '"Josefin Sans", sans-serif',
            fontWeight: 100, fontSize: 9, letterSpacing: "0.5em",
            textTransform: "uppercase", color: C.dim, paddingRight: "0.5em",
          }}
        >Fechar</button>
      </div>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 40px" }}>
        {(["Coleções", "Sobre", "Revendedores", "Contato"] as const).map((label, i) => (
          <a
            key={label}
            href="#"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              fontFamily: '"Playfair Display", serif',
              fontSize: "clamp(40px, 11.5vw, 54px)",
              fontWeight: 400, letterSpacing: "-0.01em", color: C.cream,
              textDecoration: "none", lineHeight: 1.22,
              borderBottom: "1px solid rgba(238,234,226,0.07)",
              padding: "0.22em 0",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.55s ease ${0.06 + i * 0.09}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.06 + i * 0.09}s`,
            }}
          >{label}</a>
        ))}
      </nav>
      <div style={{
        padding: "0 40px 40px", flexShrink: 0,
        opacity: menuOpen ? 1 : 0, transition: "opacity 0.5s ease 0.44s",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      }}>
        <span style={{
          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100,
          fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase",
          color: "rgba(238,234,226,0.14)", paddingRight: "0.38em",
        }}>Mushy Parfum</span>
        <span style={{
          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100,
          fontSize: 8, letterSpacing: "0.2em", color: "rgba(238,234,226,0.09)",
        }}>Est. 2024</span>
      </div>
    </div>
  );

  if (isMobile === null) return <div style={{ height: "100svh", background: C.bg }} />;

  // ═══════════════════════════════════════════════════════════════════
  // MOBILE
  // ═══════════════════════════════════════════════════════════════════
  if (isMobile) {
    const uiVisible     = mUIShown || mPhase === "done";
    const carouselShown = cardVisible && !quizActive;

    return (
      <>
        <section style={{ height: "100svh", background: C.bg, position: "relative", overflow: "hidden" }}>

          {/* Grain */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 9, pointerEvents: "none",
            opacity: 0.03, backgroundImage: GRAIN, backgroundSize: "200px 200px",
          }} />

          {/* Video */}
          <video
            ref={mVideoRef}
            src="/mobile-hero.mp4"
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", zIndex: 1,
              opacity: mPhase === "intro" ? 0 : mPhase === "done" ? 0 : 1,
              transition: mPhase === "done" ? "opacity 1.4s ease" : "opacity 3.8s ease",
            }}
          />

          {/* Vignette */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
            opacity: mPhase !== "intro" ? 1 : 0, transition: "opacity 3.8s ease",
            background: [
              "linear-gradient(to bottom, rgba(9,9,11,0.55) 0%, transparent 25%)",
              "linear-gradient(to top,    rgba(9,9,11,0.7) 0%, transparent 30%)",
            ].join(","),
          }} />

          {/* ═══ REDESIGNED INTRO ══════════════════════════════════ */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", pointerEvents: "none",
            // Exit: whole container fades + rises when video starts
            opacity: mPhase === "intro" ? 1 : 0,
            transform: mPhase === "intro" ? "translateY(0)" : "translateY(-16px) scale(0.97)",
            transition: mPhase !== "intro"
              ? "opacity 0.9s ease, transform 1s cubic-bezier(0.16,1,0.3,1)"
              : "none",
          }}>
            {/* Ambient glow orb */}
            <div aria-hidden="true" style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -60%)",
              width: "100vw", height: "70vw",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(196,163,90,0.07) 0%, transparent 70%)",
              opacity: mIntroShown ? 1 : 0,
              transition: "opacity 3s ease 1s",
            }} />

            {/* Decorative entry line (top) */}
            <div style={{
              width: 1, height: 44,
              background: `linear-gradient(to bottom, transparent, ${C.goldDim})`,
              marginBottom: 24,
              opacity: mIntroShown ? 1 : 0,
              transform: mIntroShown ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "top",
              transition: mIntroShown
                ? "opacity 1s ease 0.25s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.25s"
                : "none",
            }} />

            {/* MUSHY — letter-by-letter reveal */}
            <div style={{ overflow: "hidden", display: "flex", lineHeight: 0.88 }}>
              {"MUSHY".split("").map((letter, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    fontFamily: '"Playfair Display", serif',
                    fontSize: "clamp(74px, 22.5vw, 100px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: C.cream,
                    opacity: mIntroShown ? 1 : 0,
                    transform: mIntroShown ? "translateY(0)" : "translateY(110%)",
                    transition: mIntroShown
                      ? `opacity 0.7s ease ${0.18 + i * 0.09}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${0.18 + i * 0.09}s`
                      : "none",
                  }}
                >{letter}</span>
              ))}
            </div>

            {/* Gold accent line */}
            <div style={{
              width: mIntroShown ? 40 : 0, height: 1,
              background: C.gold, opacity: 0.55,
              margin: "20px auto",
              transition: mIntroShown ? "width 1.2s cubic-bezier(0.16,1,0.3,1) 0.9s" : "none",
            }} />

            {/* PARFUM eyebrow */}
            <p style={{
              fontFamily: '"Josefin Sans", sans-serif',
              fontWeight: 100, fontSize: "clamp(10px, 3vw, 13px)",
              letterSpacing: "0.8em", textTransform: "uppercase",
              color: C.goldDim, margin: "0 0 10px", paddingRight: "0.8em", lineHeight: 1,
              opacity: mIntroShown ? 1 : 0,
              transition: mIntroShown ? "opacity 1.1s ease 0.9s" : "none",
            }}>Parfum</p>

            {/* Tagline */}
            <p style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: "italic", fontWeight: 300,
              fontSize: "clamp(13px, 3.8vw, 16px)",
              letterSpacing: "0.06em",
              color: "rgba(238,234,226,0.3)", margin: 0,
              opacity: mIntroShown ? 1 : 0,
              transition: mIntroShown ? "opacity 1s ease 1.15s" : "none",
            }}>A arte do aroma</p>

            {/* Scroll indicator */}
            <div style={{
              position: "absolute", bottom: "8vh", left: "50%", transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              opacity: mIntroShown ? 0.55 : 0,
              transition: mIntroShown ? "opacity 1.2s ease 1.5s" : "none",
            }}>
              <span style={{
                fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7.5,
                letterSpacing: "0.42em", textTransform: "uppercase", color: C.cream, paddingRight: "0.42em",
              }}>Toque para começar</span>
              <div style={{
                width: 1, height: 40,
                background: `linear-gradient(to bottom, ${C.goldDim}, transparent)`,
                animation: "pulse-line 2.8s ease-in-out infinite",
              }} />
            </div>
          </div>

          {/* ═══ CAROUSEL ═════════════════════════════════════════ */}
          {carouselShown && (
            <div style={{
              position: "absolute", top: "13vh", left: "50%", zIndex: 30,
              width: "82vw", maxWidth: 340,
              transform: cardVisible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(30px)",
              opacity: cardVisible ? 1 : 0,
              transition: "opacity 1s ease, transform 1s cubic-bezier(0.16,1,0.3,1)",
            }}>
              {/* Card shell */}
              <div
                onPointerDown={onCarouselDown}
                onPointerMove={onCarouselMove}
                onPointerUp={onCarouselUp}
                style={{
                  width: "100%", height: "63vh", maxHeight: 510,
                  borderRadius: 28, overflow: "hidden", position: "relative",
                  cursor: "grab", touchAction: "none", userSelect: "none",
                  boxShadow: [
                    "0 40px 90px rgba(0,0,0,0.9)",
                    "0 16px 36px rgba(0,0,0,0.7)",
                    "inset 0 1px 0 rgba(255,255,255,0.06)",
                  ].join(", "),
                  animation: "card-float 5s ease-in-out 0.9s infinite",
                }}
              >
                {/* Carousel strip */}
                <div style={{
                  display: "flex",
                  width: `${TOTAL_SLIDES * 100}%`,
                  height: "100%",
                  transform: `translateX(${(-slideIdx / TOTAL_SLIDES) * 100}%)`,
                  transition: "transform 0.72s cubic-bezier(0.76,0,0.24,1)",
                }}>

                  {/* Slide 0: CTA */}
                  <div
                    style={{
                      width: `${100 / TOTAL_SLIDES}%`,
                      flexShrink: 0, height: "100%",
                      position: "relative", overflow: "hidden",
                      background: "#0d0d0f",
                      display: "flex", flexDirection: "column",
                      justifyContent: "flex-start", alignItems: "center",
                      paddingTop: "10%",
                      cursor: "pointer",
                    }}
                    onClick={onCtaTap}
                  >
                    {/* Last video frame as full background */}
                    {lastFrameUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={lastFrameUrl}
                        alt=""
                        aria-hidden="true"
                        style={{
                          position: "absolute", inset: 0,
                          width: "100%", height: "100%",
                          objectFit: "cover",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    {/* Overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: lastFrameUrl
                        ? "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.72) 100%)"
                        : "linear-gradient(160deg, #131313 0%, #09090B 100%)",
                      pointerEvents: "none",
                    }} />
                    <div aria-hidden="true" style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      opacity: 0.03, backgroundImage: GRAIN, backgroundSize: "200px 200px",
                    }} />

                    {/* CTA text — centered at top of card, 2 lines */}
                    <div style={{
                      position: "relative", zIndex: 2,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", textAlign: "center",
                      padding: "0 28px",
                    }}>
                      <div style={{ width: 22, height: 1, background: C.gold, marginBottom: 20, opacity: 0.7 }} />
                      <h2 style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: "clamp(20px, 6.2vw, 24px)",
                        fontWeight: 400, color: C.cream,
                        lineHeight: 1.3, letterSpacing: "-0.01em",
                        margin: "0 0 18px",
                        textShadow: "0 2px 20px rgba(0,0,0,0.8)",
                      }}>
                        Descubra o perfume<br />feito para você
                      </h2>
                      <p style={{
                        fontFamily: '"Josefin Sans", sans-serif',
                        fontWeight: 100, fontSize: 8,
                        letterSpacing: "0.52em", textTransform: "uppercase",
                        color: C.goldDim, paddingRight: "0.52em",
                        textShadow: "0 1px 10px rgba(0,0,0,0.8)",
                      }}>Toque para começar</p>
                    </div>
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 1,
                      background: "linear-gradient(to right, transparent, rgba(196,163,90,0.35), transparent)",
                      zIndex: 3,
                    }} />
                  </div>

                  {/* Slides 1–3: collection cards */}
                  {CAROUSEL_EXTRA.map((slide, i) => (
                    <div
                      key={i}
                      style={{
                        width: `${100 / TOTAL_SLIDES}%`,
                        flexShrink: 0, height: "100%",
                        background: slide.bg,
                        position: "relative",
                        display: "flex", flexDirection: "column", justifyContent: "flex-end",
                      }}
                    >
                      <div aria-hidden="true" style={{
                        position: "absolute", inset: 0, pointerEvents: "none",
                        opacity: 0.04, backgroundImage: GRAIN, backgroundSize: "200px 200px",
                      }} />
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 60%)",
                      }} />
                      <div style={{ position: "relative", zIndex: 1, padding: "0 26px 30px" }}>
                        <p style={{
                          fontFamily: '"Josefin Sans", sans-serif',
                          fontWeight: 100, fontSize: 8,
                          letterSpacing: "0.42em", textTransform: "uppercase",
                          color: C.goldDim, marginBottom: 8, paddingRight: "0.42em",
                        }}>{slide.eyebrow}</p>
                        <h2 style={{
                          fontFamily: '"Playfair Display", serif',
                          fontSize: "clamp(22px, 6.5vw, 26px)",
                          fontWeight: 400, color: C.cream,
                          letterSpacing: "-0.01em", lineHeight: 1.15, margin: "0 0 18px",
                        }}>{slide.title}</h2>
                        <p style={{
                          fontFamily: '"Josefin Sans", sans-serif',
                          fontWeight: 100, fontSize: 8,
                          letterSpacing: "0.42em", textTransform: "uppercase",
                          color: "rgba(238,234,226,0.35)", paddingRight: "0.42em",
                        }}>{slide.cta} →</p>
                      </div>
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 1,
                        background: "linear-gradient(to right, transparent, rgba(196,163,90,0.22), transparent)",
                        zIndex: 2,
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots */}
              <div style={{
                display: "flex", justifyContent: "center", alignItems: "center",
                gap: 8, marginTop: 18,
              }}>
                {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIdx(i)}
                    aria-label={`Slide ${i + 1}`}
                    style={{
                      width: i === slideIdx ? 22 : 6, height: 6, borderRadius: 3,
                      border: "none", cursor: "pointer", padding: 0,
                      background: i === slideIdx ? C.gold : "rgba(238,234,226,0.2)",
                      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                ))}
              </div>

              {/* Scroll-down hint */}
              <button
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
                aria-label="Ver coleção"
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                  marginTop: 22, background: "none", border: "none", cursor: "pointer", padding: 0,
                }}
              >
                <span style={{
                  fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7.5,
                  letterSpacing: "0.42em", textTransform: "uppercase",
                  color: "rgba(238,234,226,0.28)", paddingRight: "0.42em",
                }}>Ver coleção</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.3, animation: "pulse-fade 2.4s ease-in-out infinite" }}>
                  <path d="M7 1v12M2 8l5 5 5-5" stroke="#EEEAE2" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* ═══ CHROME ═══════════════════════════════════════════ */}
          <div style={{
            position: "absolute", top: 26, left: 26, zIndex: 50,
            opacity: uiVisible ? 1 : 0, transition: "opacity 1.6s ease", pointerEvents: "none",
          }}>
            <Image src="/logo.jpeg" alt="Mushy Parfum" width={34} height={34} className="rounded" style={{ opacity: 0.92 }} />
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            style={{
              position: "absolute", top: 30, right: 28, zIndex: 50,
              opacity: uiVisible ? 1 : 0, pointerEvents: uiVisible ? "auto" : "none",
              transition: "opacity 1.6s ease",
              background: "none", border: "none", padding: 0, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6,
            }}
          >
            <span style={{ display: "block", width: 24, height: 1, background: C.cream, opacity: 0.65 }} />
            <span style={{ display: "block", width: 16, height: 1, background: C.cream, opacity: 0.65 }} />
            <span style={{ display: "block", width: 24, height: 1, background: C.cream, opacity: 0.65 }} />
          </button>

        </section>

        {renderMenu()}

        {/* Quiz overlay — fixed fullscreen, appears on top of everything */}
        <QuizOverlay active={quizActive} onClose={() => setQuizActive(false)} />
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

          <canvas ref={canvasRef} className="absolute inset-0" style={{ width: "100%", height: "100%", display: "block" }} />

          {/* Loading */}
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center" style={{
            background: "#080808", opacity: ready ? 0 : 1,
            pointerEvents: ready ? "none" : "auto", transition: "opacity 0.8s ease",
          }}>
            <div className="relative overflow-hidden" style={{ width: 140, height: 1, background: "rgba(196,163,90,0.18)" }}>
              <div style={{ position: "absolute", inset: 0, background: C.gold, transform: `scaleX(${loadPct / 100})`, transformOrigin: "left", transition: "transform 0.2s ease" }} />
            </div>
            <p style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 9, letterSpacing: "0.4em", color: "rgba(196,163,90,0.45)", marginTop: 14 }}>
              {loadPct < 100 ? "CARREGANDO" : ""}
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

          {/* Desktop intro */}
          <div ref={dIntroRef} className="absolute inset-0 z-20 pointer-events-none" style={{
            opacity: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", textAlign: "center",
          }}>
            <h1 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "clamp(56px, 8vw, 90px)",
              fontWeight: 700, color: C.cream,
              letterSpacing: "-0.025em", lineHeight: 0.9, margin: 0,
            }}>Mushy</h1>
            <p style={{
              fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100,
              fontSize: "clamp(10px, 1.1vw, 14px)", letterSpacing: "0.65em",
              textTransform: "uppercase", color: C.goldDim,
              margin: "20px 0 0", paddingRight: "0.65em",
            }}>Parfum</p>
            <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
              <span style={{
                fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100,
                fontSize: 9, letterSpacing: "0.45em", textTransform: "uppercase",
                color: "rgba(238,234,226,0.35)", paddingRight: "0.45em",
                animation: "pulse-fade 2.5s ease-in-out infinite",
              }}>Role para descobrir</span>
              <span style={{
                display: "block", width: 1, height: 36,
                background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
                animation: "pulse-line 2.5s ease-in-out infinite",
              }} />
            </div>
          </div>

          {/* Desktop logo */}
          <div ref={dLogoRef} className="absolute top-6 left-6 z-50 pointer-events-none" style={{ opacity: 0, transition: "opacity 0.5s ease" }}>
            <Image src="/logo.jpeg" alt="Mushy Parfum" width={40} height={40} className="rounded" />
          </div>

          {/* Desktop menu button */}
          <button
            ref={dMenuBtnRef}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
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

          {/* Desktop see more */}
          <button
            ref={dSeeMoreRef}
            onClick={scrollToContent}
            aria-label="Ver mais"
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
              textShadow: "0 1px 16px rgba(0,0,0,0.9)", whiteSpace: "nowrap",
            }}>Ver mais</span>
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
