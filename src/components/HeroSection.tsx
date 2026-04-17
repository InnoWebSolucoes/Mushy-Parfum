"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────
//  CONFIG — edit these two lines after uploading your frames
// ─────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 150;
const FRAME_URL    = (n: number) =>
  `/frames/${String(n).padStart(3, "0")}.png`;
// ─────────────────────────────────────────────────────────────────

const FADE_START  = 0.78;
const FADE_FINISH = 0.96;

export default function HeroSection() {
  const heroRef    = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const seeMoreRef = useRef<HTMLButtonElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);

  // Frames array and load tracking (refs = no re-render on update)
  const framesRef     = useRef<HTMLImageElement[]>([]);
  const loadedRef     = useRef(0);

  const [loadPct,  setLoadPct]  = useState(0);    // 0-100 for progress bar
  const [ready,    setReady]    = useState(false); // all frames loaded

  const [menuOpen, setMenuOpen] = useState(false);

  // ── Cover-fit canvas draw ──────────────────────────────────────
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dx = (cw - iw * scale) / 2;
    const dy = (ch - ih * scale) / 2;
    ctx.drawImage(img, dx, dy, iw * scale, ih * scale);
  }, []);

  // ── Preload all frames on mount ────────────────────────────────
  useEffect(() => {
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    framesRef.current = imgs;
    loadedRef.current = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = FRAME_URL(i + 1);   // frames are 1-indexed

      img.onload = () => {
        loadedRef.current += 1;
        const pct = Math.round((loadedRef.current / TOTAL_FRAMES) * 100);
        setLoadPct(pct);

        // Draw the very first frame as soon as it arrives
        if (i === 0) drawFrame(img);

        if (loadedRef.current === TOTAL_FRAMES) {
          setReady(true);
        }
      };

      img.onerror = () => {
        // Count failed loads so the bar still completes
        loadedRef.current += 1;
        const pct = Math.round((loadedRef.current / TOTAL_FRAMES) * 100);
        setLoadPct(pct);
        if (loadedRef.current === TOTAL_FRAMES) setReady(true);
      };

      imgs[i] = img;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Canvas resize ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      // Redraw current frame after resize
      const frames = framesRef.current;
      if (frames.length > 0 && frames[0]?.complete) drawFrame(frames[0]);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame]);

  // ── Scroll → frame index + UI opacity ─────────────────────────
  useEffect(() => {
    if (!ready) return;

    const hero = heroRef.current;
    if (!hero) return;

    const onScroll = () => {
      const range = hero.offsetHeight - window.innerHeight;
      const progress = range > 0
        ? Math.max(0, Math.min(window.scrollY / range, 1))
        : 0;

      // Draw the correct frame — synchronous, instant
      const idx = Math.min(
        Math.floor(progress * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      );
      const frame = framesRef.current[idx];
      if (frame) drawFrame(frame);

      // UI opacity — direct DOM, zero React re-renders
      const rawOp = progress >= FADE_START
        ? (progress - FADE_START) / (FADE_FINISH - FADE_START)
        : 0;
      const op = String(Math.min(rawOp, 1));
      const pe = parseFloat(op) > 0.4 ? "auto" : "none";

      if (menuBtnRef.current) {
        menuBtnRef.current.style.opacity       = op;
        menuBtnRef.current.style.pointerEvents = pe;
      }
      if (seeMoreRef.current) {
        seeMoreRef.current.style.opacity       = op;
        seeMoreRef.current.style.pointerEvents = pe;
      }
      if (logoRef.current) {
        logoRef.current.style.opacity = op;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once to paint frame 0 at initial position
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready, drawFrame]);

  // ── Menu body-scroll lock ──────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollToContent = () => {
    if (heroRef.current)
      window.scrollTo({ top: heroRef.current.offsetHeight, behavior: "smooth" });
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          HERO — 500 vh scroll zone
      ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{ height: "500vh" }} className="relative">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100svh" }}>

          {/* Canvas — the visible surface, painted from pre-loaded frames */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%", display: "block" }}
          />

          {/* Loading overlay — fades out once all frames are ready */}
          <div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center"
            style={{
              background: "#080808",
              opacity: ready ? 0 : 1,
              pointerEvents: ready ? "none" : "auto",
              transition: "opacity 0.8s ease",
            }}
          >
            {/* Gold progress bar */}
            <div
              className="relative overflow-hidden rounded-full"
              style={{ width: 160, height: 1, background: "rgba(201,168,76,0.2)" }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#C9A84C",
                  transform: `scaleX(${loadPct / 100})`,
                  transformOrigin: "left",
                  transition: "transform 0.2s ease",
                }}
              />
            </div>
            <p
              className="font-cinzel mt-4"
              style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(201,168,76,0.5)" }}
            >
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

          {/* Logo */}
          <div
            ref={logoRef}
            aria-hidden="true"
            className="absolute top-5 left-5 z-50 pointer-events-none"
            style={{ opacity: 0, transition: "opacity 0.5s ease" }}
          >
            <Image
              src="/logo.jpeg"
              alt="Mushy Parfum"
              width={44}
              height={44}
              className="rounded"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}
            />
          </div>

          {/* Menu button */}
          <button
            ref={menuBtnRef}
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
            ref={seeMoreRef}
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
            <span
              className="font-cinzel text-[11px] tracking-[0.25em] uppercase whitespace-nowrap"
              style={{
                color: "#F5F0E8",
                textShadow: "0 1px 14px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.6)",
              }}
            >
              See more
            </span>
            <span
              className="block w-px h-8"
              style={{
                background: "linear-gradient(to bottom, #C9A84C, transparent)",
                animation: "pulse-line 2s ease-in-out infinite",
              }}
            />
          </button>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MENU OVERLAY
      ═══════════════════════════════════════════════════════ */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="fixed inset-0 z-[200] flex flex-col"
        style={{
          background: "#080808",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.55s cubic-bezier(0.76,0,0.24,1)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute left-8 inset-y-0 w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(201,168,76,0.4) 20%, rgba(201,168,76,0.4) 80%, transparent)",
          }}
        />

        <div className="flex items-center justify-between px-5 pt-6 pb-5 pl-14 flex-shrink-0">
          <Image src="/logo.jpeg" alt="Mushy Parfum" width={40} height={40} className="rounded opacity-90" />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="w-11 h-11 flex items-center justify-center rounded text-lg font-light flex-shrink-0"
            style={{ color: "#C9A84C", border: "1px solid rgba(201,168,76,0.20)" }}
          >
            ✕
          </button>
        </div>

        <div
          aria-hidden="true"
          className="mx-5 ml-14 h-px flex-shrink-0"
          style={{ background: "linear-gradient(to right, rgba(139,115,85,0.4), transparent)" }}
        />

        <nav className="flex-1 flex flex-col justify-center pl-14 pr-5 gap-1 py-10">
          {[["01","Collections"],["02","About"],["03","Stockists"],["04","Contact"]].map(([num, label]) => (
            <a
              key={label}
              href="#"
              onClick={() => setMenuOpen(false)}
              className="block py-3 font-cormorant text-[36px] font-light"
              style={{
                color: "#F5F0E8",
                borderBottom: "1px solid rgba(201,168,76,0.08)",
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              <span className="font-cinzel text-[11px] tracking-[0.18em] align-super mr-2" style={{ color: "#8B7355" }}>
                {num}
              </span>
              {label}
            </a>
          ))}
        </nav>

        <div className="pl-14 pr-5 pb-10 flex-shrink-0">
          <p className="font-cormorant italic text-[13px] mb-4" style={{ color: "#8B7355", letterSpacing: "0.06em" }}>
            "Elegance · Confidence · Class"
          </p>
          <div className="flex gap-5">
            {["Instagram","TikTok","Pinterest"].map(s => (
              <a key={s} href="#" className="font-cinzel text-[10px] tracking-[0.18em] uppercase"
                style={{ color: "rgba(245,240,232,0.4)", textDecoration: "none" }}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
