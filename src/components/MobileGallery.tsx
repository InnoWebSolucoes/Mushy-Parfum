"use client";

import { useEffect, useRef } from "react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const C = {
  bg:      "#09090B",
  cream:   "#EEEAE2",
  gold:    "#C4A35A",
  goldDim: "rgba(196,163,90,0.55)",
};

const STORY = [
  {
    layout: "img-left" as const,
    img: "/gallery-1.png",
    num: "I",
    headline: "A origem\ndo oud",
    body: "Extraída das florestas mais profundas do oriente, nossa resina carrega séculos de tradição.",
  },
  {
    layout: "img-right" as const,
    img: "/gallery-2.png",
    num: "II",
    headline: "Calor e\ndelicadeza",
    body: "O âmbar e a rosa se entrelaçam num abraço eterno — uma sinfonia que perdura na pele.",
  },
  {
    layout: "full" as const,
    img: "/gallery-3.png",
    num: "III",
    headline: "A pureza\ndo sândalo",
    body: null,
  },
  {
    layout: "img-left" as const,
    img: "/gallery-4.png",
    num: "IV",
    headline: "O futuro\ndo luxo",
    body: "Criamos perfumes para aqueles que definem tendências, não os que as seguem.",
  },
];

// Hook: fade/slide in when element enters viewport
function useReveal(ref: React.RefObject<HTMLElement | null>, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Set initial hidden state
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    el.style.transition = `opacity 0.9s ease ${delay}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, delay]);
}

function useRevealX(ref: React.RefObject<HTMLElement | null>, fromRight = false, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = `translateX(${fromRight ? "32px" : "-32px"})`;
    el.style.transition = `opacity 0.85s ease ${delay}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateX(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, fromRight, delay]);
}

// Section header
function Header() {
  const eyeRef  = useRef<HTMLParagraphElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  useReveal(eyeRef as React.RefObject<HTMLElement>, 0);
  useReveal(headRef as React.RefObject<HTMLElement>, 0.12);
  useReveal(lineRef as React.RefObject<HTMLElement>, 0.24);

  return (
    <div style={{ padding: "88px 36px 60px", textAlign: "center", position: "relative", zIndex: 1 }}>
      <p ref={eyeRef} style={{
        fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100,
        fontSize: 9, letterSpacing: "0.55em", textTransform: "uppercase",
        color: C.goldDim, marginBottom: 18, paddingRight: "0.55em",
      }}>A Coleção</p>
      <h2 ref={headRef} style={{
        fontFamily: '"Playfair Display", serif',
        fontSize: "clamp(36px, 10.5vw, 52px)",
        fontWeight: 400, color: C.cream,
        letterSpacing: "-0.025em", lineHeight: 1.05, margin: 0,
      }}>Nossa história<br />em aromas</h2>
      <div ref={lineRef} style={{
        width: 36, height: 1, background: C.gold, opacity: 0.45, margin: "28px auto 0",
      }} />
    </div>
  );
}

// Full-width row
function FullRow({ item }: { item: (typeof STORY)[2] }) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const textRef  = useRef<HTMLDivElement>(null);
  useReveal(wrapRef as React.RefObject<HTMLElement>, 0);
  useReveal(textRef as React.RefObject<HTMLElement>, 0.18);

  return (
    <div ref={wrapRef} style={{
      position: "relative", height: "70vw", maxHeight: 400,
      overflow: "hidden", margin: "0 0 4px",
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.img} alt={item.headline}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(9,9,11,0.9) 0%, rgba(9,9,11,0.2) 55%, rgba(9,9,11,0.05) 100%)",
      }} />
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)`,
      }} />
      <div ref={textRef} style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 32px 36px" }}>
        <p style={{
          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
          letterSpacing: "0.48em", textTransform: "uppercase", color: C.goldDim,
          marginBottom: 10, paddingRight: "0.48em",
        }}>{item.num}</p>
        <h3 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: "clamp(28px, 8vw, 38px)",
          fontWeight: 400, color: C.cream,
          letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0,
          whiteSpace: "pre-line",
        }}>{item.headline}</h3>
      </div>
    </div>
  );
}

// Half-half row
function HalfRow({ item }: { item: (typeof STORY)[0] }) {
  const imgLeft  = item.layout === "img-left";
  const imgRef   = useRef<HTMLDivElement>(null);
  const textRef  = useRef<HTMLDivElement>(null);
  useRevealX(imgRef as React.RefObject<HTMLElement>, !imgLeft, 0);
  useRevealX(textRef as React.RefObject<HTMLElement>, imgLeft, 0.14);

  return (
    <div style={{
      display: "flex", flexDirection: imgLeft ? "row" : "row-reverse",
      height: "clamp(240px, 60vw, 300px)", margin: "4px 0", gap: 4,
    }}>
      {/* Image */}
      <div ref={imgRef} style={{ flex: "0 0 48%", position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.img} alt={item.headline}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: imgLeft
            ? "linear-gradient(to right, transparent 60%, rgba(9,9,11,0.55) 100%)"
            : "linear-gradient(to left,  transparent 60%, rgba(9,9,11,0.55) 100%)",
        }} />
      </div>

      {/* Text */}
      <div ref={textRef} style={{
        flex: "0 0 52%", background: "#0d0d0f",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: imgLeft ? "28px 26px 28px 20px" : "28px 20px 28px 26px",
        position: "relative",
      }}>
        <p style={{
          fontFamily: '"Playfair Display", serif', fontWeight: 400, fontSize: 12,
          color: C.goldDim, marginBottom: 12, letterSpacing: "0.06em",
        }}>{item.num}</p>
        <h3 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: "clamp(20px, 5.5vw, 26px)",
          fontWeight: 400, color: C.cream,
          letterSpacing: "-0.015em", lineHeight: 1.2, margin: "0 0 14px",
          whiteSpace: "pre-line",
        }}>{item.headline}</h3>
        {item.body && (
          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(13px, 3.8vw, 15px)", lineHeight: 1.7,
            color: "rgba(238,234,226,0.48)", margin: 0,
          }}>{item.body}</p>
        )}
        {/* Accent line */}
        <div style={{
          position: "absolute",
          top: 0, bottom: 0,
          [imgLeft ? "left" : "right"]: 0,
          width: 1,
          background: `linear-gradient(to bottom, transparent, ${C.gold}28, transparent)`,
        }} />
      </div>
    </div>
  );
}

// Footer CTA
function FooterCta() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref as React.RefObject<HTMLElement>, 0);
  return (
    <div ref={ref} style={{ padding: "52px 36px 80px", textAlign: "center", position: "relative", zIndex: 1 }}>
      <button style={{
        background: "none", border: `1px solid rgba(196,163,90,0.35)`, borderRadius: 2,
        padding: "16px 40px", cursor: "pointer",
        fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 9,
        letterSpacing: "0.44em", textTransform: "uppercase", color: C.cream,
        paddingRight: "calc(40px + 0.44em)",
      }}>Ver toda a coleção</button>
    </div>
  );
}

export default function MobileGallery() {
  return (
    <section style={{ background: C.bg, position: "relative", overflow: "hidden" }}>
      {/* Grain overlay */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: 0.025, backgroundImage: GRAIN, backgroundSize: "200px 200px", zIndex: 0,
      }} />

      <Header />

      {/* Story rows */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {STORY.map((item, i) =>
          item.layout === "full"
            ? <FullRow key={i} item={item as (typeof STORY)[2]} />
            : <HalfRow key={i} item={item as (typeof STORY)[0]} />
        )}
      </div>

      <FooterCta />
    </section>
  );
}
