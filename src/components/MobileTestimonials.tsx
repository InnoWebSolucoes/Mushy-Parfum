"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const C = {
  bg:      "#09090B",
  cream:   "#EEEAE2",
  gold:    "#C4A35A",
  goldDim: "rgba(196,163,90,0.55)",
};

const TESTIMONIALS = [
  {
    name: "Sofia A.",
    location: "Lisboa",
    rating: 5,
    perfume: "Oud Noir",
    review: "Mudou a forma como me apresento ao mundo. Recebo elogios todos os dias — é simplesmente inconfundível.",
    bg: "radial-gradient(ellipse at 60% 30%, #2a1806 0%, #0a0804 100%)",
  },
  {
    name: "Mariana L.",
    location: "São Paulo",
    rating: 5,
    perfume: "Amber Rose",
    review: "O mais bonito que já usei. A duração é incrível e a sillage é perfeita — não muito intenso, só irresistível.",
    bg: "radial-gradient(ellipse at 40% 60%, #280d14 0%, #0e070a 100%)",
  },
  {
    name: "Carlos M.",
    location: "Porto",
    rating: 5,
    perfume: "Santal",
    review: "Discreto, elegante, profissional. Uso todos os dias no trabalho e as pessoas sempre perguntam qual é.",
    bg: "radial-gradient(ellipse at 55% 35%, #081420 0%, #05090f 100%)",
  },
  {
    name: "Ana B.",
    location: "Luanda",
    rating: 4,
    perfume: "White Musk",
    review: "Leveza que ficou na minha memória. Um aroma limpo e sofisticado que me acompanha do manhã à noite.",
    bg: "radial-gradient(ellipse at 50% 50%, #181818 0%, #090909 100%)",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1l1.24 2.52L10 3.91l-2 1.95.47 2.75L6 7.27 3.53 8.61 4 5.86 2 3.91l2.76-.39L6 1z"
            fill={i < rating ? C.gold : "rgba(238,234,226,0.15)"}
          />
        </svg>
      ))}
    </div>
  );
}

function VideoPlaceholder({ bg, name }: { bg: string; name: string }) {
  return (
    <div style={{
      width: "100%", height: "100%", background: bg, position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* Waveform */}
      <div style={{
        position: "absolute", bottom: 22, left: 20, right: 20,
        display: "flex", alignItems: "flex-end", gap: 2.5, height: 26,
      }}>
        {[0.3,0.6,0.9,0.5,1,0.7,0.4,0.8,0.5,0.9,0.6,0.3,0.7,1,0.5,0.4,0.8,0.6].map((h, i) => (
          <div key={i} style={{
            flex: 1, height: `${h * 100}%`,
            background: `rgba(196,163,90,${h * 0.4})`,
            borderRadius: 2,
          }} />
        ))}
      </div>
      {/* Duration */}
      <div style={{
        position: "absolute", bottom: 16, right: 16,
        fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
        letterSpacing: "0.12em", color: "rgba(238,234,226,0.4)",
        background: "rgba(0,0,0,0.45)", borderRadius: 20, padding: "4px 9px",
      }}>0:42</div>
      {/* Avatar */}
      <div style={{
        position: "absolute", top: 18, left: 18,
        width: 38, height: 38, borderRadius: "50%",
        background: "rgba(196,163,90,0.14)",
        border: "1px solid rgba(196,163,90,0.28)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: '"Playfair Display", serif', fontWeight: 400, fontSize: 14,
        color: C.goldDim,
      }}>{name[0]}</div>
      {/* Play */}
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "rgba(196,163,90,0.13)",
        border: "1.5px solid rgba(196,163,90,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}>
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M5 3l9 5-9 5V3z" fill={C.gold} />
        </svg>
      </div>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(to right, transparent, rgba(196,163,90,0.35), transparent)`,
      }} />
    </div>
  );
}

export default function MobileTestimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const dragRef = useRef({ startX: 0, moved: false });

  // Scroll-reveal refs
  const sectionRef  = useRef<HTMLDivElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dotsRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets: [React.RefObject<HTMLElement | null>, number][] = [
      [headerRef as React.RefObject<HTMLElement>,   0],
      [carouselRef as React.RefObject<HTMLElement>, 0.1],
      [dotsRef as React.RefObject<HTMLElement>,     0.2],
    ];
    const observers: IntersectionObserver[] = [];
    targets.forEach(([ref, delay]) => {
      const el = ref.current;
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = `opacity 0.9s ease ${delay}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      }, { threshold: 0.12 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const onDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, moved: false };
  }, []);

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (Math.abs(e.clientX - dragRef.current.startX) > 8) dragRef.current.moved = true;
  }, []);

  const onUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.moved) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 44)
      setActiveIdx(i => dx < 0 ? Math.min(i + 1, TESTIMONIALS.length - 1) : Math.max(i - 1, 0));
  }, []);

  return (
    <section ref={sectionRef} style={{ background: C.bg, position: "relative", overflow: "hidden", paddingBottom: 88 }}>

      {/* Grain */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        opacity: 0.025, backgroundImage: GRAIN, backgroundSize: "200px 200px",
      }} />

      {/* Section header */}
      <div ref={headerRef} style={{ padding: "80px 36px 52px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{
          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 9,
          letterSpacing: "0.55em", textTransform: "uppercase", color: C.goldDim,
          marginBottom: 18, paddingRight: "0.55em",
        }}>Depoimentos</p>
        <h2 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: "clamp(34px, 10vw, 48px)",
          fontWeight: 400, color: C.cream,
          letterSpacing: "-0.025em", lineHeight: 1.05, margin: 0,
        }}>O que dizem<br />nossos clientes</h2>
        <div style={{ width: 32, height: 1, background: C.gold, opacity: 0.4, margin: "28px auto 0" }} />
      </div>

      {/* Cards carousel */}
      <div
        ref={carouselRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{
          position: "relative", zIndex: 1,
          touchAction: "pan-y", userSelect: "none", cursor: "grab",
          overflow: "hidden",
        }}
      >
        <div style={{
          display: "flex",
          gap: 16,
          padding: "0 24px",
          transform: `translateX(calc(${-activeIdx * (88 + 4)}vw))`,
          transition: "transform 0.68s cubic-bezier(0.76,0,0.24,1)",
          willChange: "transform",
        }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 88vw", maxWidth: 380,
                borderRadius: 24, overflow: "hidden",
                background: "#0d0d0f",
                boxShadow: [
                  "0 28px 64px rgba(0,0,0,0.82)",
                  "0 8px 24px rgba(0,0,0,0.6)",
                  "inset 0 1px 0 rgba(255,255,255,0.05)",
                ].join(", "),
                opacity: i === activeIdx ? 1 : 0.42,
                transform: i === activeIdx ? "scale(1)" : "scale(0.95)",
                transition: "opacity 0.45s ease, transform 0.45s ease",
              }}
            >
              {/* Video area */}
              <div style={{ height: 230, position: "relative" }}>
                <VideoPlaceholder bg={t.bg} name={t.name} />
              </div>

              <div style={{ height: 1, background: "rgba(238,234,226,0.05)" }} />

              {/* Review content */}
              <div style={{ padding: "26px 26px 30px" }}>
                {/* Stars + perfume */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <Stars rating={t.rating} />
                  <span style={{
                    fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
                    letterSpacing: "0.28em", textTransform: "uppercase",
                    color: C.goldDim, paddingRight: "0.28em",
                  }}>{t.perfume}</span>
                </div>

                {/* Review text */}
                <p style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: "italic", fontWeight: 300,
                  fontSize: "clamp(17px, 4.8vw, 20px)", lineHeight: 1.65,
                  color: "rgba(238,234,226,0.8)", margin: "0 0 22px",
                }}>"{t.review}"</p>

                {/* Name + location */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <p style={{
                      fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 10.5,
                      letterSpacing: "0.14em", color: C.cream, margin: "0 0 4px",
                    }}>{t.name}</p>
                    <p style={{
                      fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
                      letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "rgba(238,234,226,0.25)", margin: 0, paddingRight: "0.22em",
                    }}>{t.location}</p>
                  </div>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: "rgba(196,163,90,0.1)",
                    border: "1px solid rgba(196,163,90,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l4 4 4-4M6 2v8" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator dots */}
      <div ref={dotsRef} style={{
        display: "flex", justifyContent: "center", gap: 8, marginTop: 28,
        position: "relative", zIndex: 1,
      }}>
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            aria-label={`Depoimento ${i + 1}`}
            style={{
              width: i === activeIdx ? 22 : 6, height: 6, borderRadius: 3,
              border: "none", cursor: "pointer", padding: 0,
              background: i === activeIdx ? C.gold : "rgba(238,234,226,0.16)",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
