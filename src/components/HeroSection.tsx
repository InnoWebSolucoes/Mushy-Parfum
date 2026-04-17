"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

// ─── Lerp factor ────────────────────────────────────────────────────────────
// 0.08 → luxuriously smooth deceleration (~130 ms half-life at 60 fps)
// Raise to 0.15+ if you want a tighter follow
const LERP = 0.08;
const FADE_START  = 0.78;
const FADE_FINISH = 0.96;

export default function HeroSection() {
  const heroRef     = useRef<HTMLElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  // Direct DOM refs for UI elements — lets us update opacity every frame
  // without triggering any React re-render
  const menuBtnRef  = useRef<HTMLButtonElement>(null);
  const seeMoreRef  = useRef<HTMLButtonElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);

  // Progress state lives entirely in refs (hot path, no re-renders)
  const targetRef   = useRef(0);   // scroll-derived progress  [0, 1]
  const smoothRef   = useRef(0);   // lerped progress          [0, 1]
  const rafRef      = useRef(0);

  const [menuOpen, setMenuOpen] = useState(false);

  // ── Main effect: RAF loop + scroll listener ──────────────────────────────
  useEffect(() => {
    const video  = videoRef.current!;
    const canvas = canvasRef.current!;
    const hero   = heroRef.current!;
    if (!video || !canvas || !hero) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    // ── Canvas sizing ──────────────────────────────────────────────────────
    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // ── Cover-fit draw helper ──────────────────────────────────────────────
    // Replicates CSS object-fit: cover on the canvas
    function drawCover() {
      if (!video || !canvas || !ctx) return;
      if (video.readyState < 2) return;        // no frame yet

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const cw = canvas.width;
      const ch = canvas.height;
      if (!vw || !vh) return;

      const scale = Math.max(cw / vw, ch / vh);
      const dx    = (cw - vw * scale) / 2;
      const dy    = (ch - vh * scale) / 2;
      ctx.drawImage(video, dx, dy, vw * scale, vh * scale);
    }

    // ── Scroll listener — only updates target, never reads DOM ────────────
    function onScroll() {
      const range = hero.offsetHeight - window.innerHeight;
      targetRef.current = range > 0
        ? Math.max(0, Math.min(window.scrollY / range, 1))
        : 0;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── RAF animation loop ─────────────────────────────────────────────────
    function tick() {
      const target = targetRef.current;
      const prev   = smoothRef.current;

      // Lerp: snap when within floating-point noise to avoid drift
      const next = Math.abs(target - prev) < 0.0001
        ? target
        : prev + (target - prev) * LERP;
      smoothRef.current = next;

      // Seek video to the lerped position
      if (video.duration) {
        const t = next * video.duration;
        // Only seek when the delta is larger than one frame at 60fps (~16 ms)
        if (Math.abs(video.currentTime - t) > 0.016) {
          video.currentTime = t;
        }
      }

      // Paint decoded frame to canvas every tick
      drawCover();

      // Update UI opacity — direct DOM, zero React involvement
      const rawOp = next >= FADE_START
        ? (next - FADE_START) / (FADE_FINISH - FADE_START)
        : 0;
      const op = Math.min(rawOp, 1);
      const pe = op > 0.4 ? "auto" : "none";
      const os = String(op);

      if (menuBtnRef.current) {
        menuBtnRef.current.style.opacity       = os;
        menuBtnRef.current.style.pointerEvents = pe;
      }
      if (seeMoreRef.current) {
        seeMoreRef.current.style.opacity       = os;
        seeMoreRef.current.style.pointerEvents = pe;
      }
      if (logoRef.current) {
        logoRef.current.style.opacity = os;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll",  onScroll);
      window.removeEventListener("resize",  resize);
    };
  }, []);

  // ── Menu body-scroll lock ─────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollToContent = () => {
    const hero = heroRef.current;
    if (hero) window.scrollTo({ top: hero.offsetHeight, behavior: "smooth" });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          HERO — 500 vh scroll zone
      ══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{ height: "500vh" }} className="relative">
        <div className="sticky top-0 overflow-hidden" style={{ height: "100svh" }}>

          {/* Video — hidden; canvas draws from its decoded frames */}
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            style={{ display: "none" }}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* Canvas — the visible surface */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%", display: "block" }}
          />

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

          {/* ── Logo — top left ──────────────────────────────────── */}
          <div
            ref={logoRef}
            aria-hidden="true"
            className="absolute top-5 left-5 z-50 pointer-events-none"
            style={{ opacity: 0 }}
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

          {/* ── Menu button — top right ───────────────────────────── */}
          <button
            ref={menuBtnRef}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="absolute top-5 right-5 z-50 w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded"
            style={{
              opacity: 0,
              pointerEvents: "none",
              background: "rgba(8,8,8,0.45)",
              border: "1px solid rgba(201,168,76,0.30)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              // transition intentionally omitted — RAF drives this directly
            }}
          >
            <span className="block w-5 h-[1.5px] rounded-sm" style={{ background: "#C9A84C" }} />
            <span className="block w-3.5 h-[1.5px] rounded-sm self-start ml-3" style={{ background: "#C9A84C" }} />
            <span className="block w-5 h-[1.5px] rounded-sm" style={{ background: "#C9A84C" }} />
          </button>

          {/* ── "See more" — bottom third ────────────────────────── */}
          <button
            ref={seeMoreRef}
            onClick={scrollToContent}
            aria-label="See more"
            className="absolute z-50 flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer"
            style={{
              opacity: 0,
              pointerEvents: "none",
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

      {/* ══════════════════════════════════════════════════════════
          MENU OVERLAY
      ══════════════════════════════════════════════════════════ */}
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
        {/* Grain texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Gold vertical accent */}
        <div
          aria-hidden="true"
          className="absolute left-8 inset-y-0 w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(201,168,76,0.4) 20%, rgba(201,168,76,0.4) 80%, transparent)",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5 pl-14 flex-shrink-0">
          <Image
            src="/logo.jpeg"
            alt="Mushy Parfum"
            width={40}
            height={40}
            className="rounded opacity-90"
          />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="w-11 h-11 flex items-center justify-center rounded text-lg font-light flex-shrink-0"
            style={{ color: "#C9A84C", border: "1px solid rgba(201,168,76,0.20)" }}
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="mx-5 ml-14 h-px flex-shrink-0"
          style={{ background: "linear-gradient(to right, rgba(139,115,85,0.4), transparent)" }}
        />

        {/* Nav */}
        <nav className="flex-1 flex flex-col justify-center pl-14 pr-5 gap-1 py-10">
          {[
            ["01", "Collections"],
            ["02", "About"],
            ["03", "Stockists"],
            ["04", "Contact"],
          ].map(([num, label]) => (
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
              <span
                className="font-cinzel text-[11px] tracking-[0.18em] align-super mr-2"
                style={{ color: "#8B7355" }}
              >
                {num}
              </span>
              {label}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="pl-14 pr-5 pb-10 flex-shrink-0">
          <p
            className="font-cormorant italic text-[13px] mb-4"
            style={{ color: "#8B7355", letterSpacing: "0.06em" }}
          >
            "Elegance · Confidence · Class"
          </p>
          <div className="flex gap-5">
            {["Instagram", "TikTok", "Pinterest"].map((s) => (
              <a
                key={s}
                href="#"
                className="font-cinzel text-[10px] tracking-[0.18em] uppercase"
                style={{ color: "rgba(245,240,232,0.4)", textDecoration: "none" }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
