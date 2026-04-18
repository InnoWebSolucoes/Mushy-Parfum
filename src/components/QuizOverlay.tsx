"use client";

import { useRef, useState, useCallback, useMemo, useEffect } from "react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const C = {
  bg:      "#09090B",
  cream:   "#EEEAE2",
  gold:    "#C4A35A",
  goldDim: "rgba(196,163,90,0.55)",
  dim:     "rgba(238,234,226,0.35)",
};

const QUIZ_PERFUMES = [
  {
    name: "Oud Noir",
    img: "/prod-1.jpg",
    tagline: "Profundo & Eterno",
    notes: "Oud · Âmbar · Sândalo",
    description: "Uma jornada pelas florestas do oriente. Rico, profundo e inconfundível — para quem não passa despercebido.",
    gender: ["neutral", "masculine"],
    intensity: 5,
    intentions: ["Sensual", "Festivo", "Presente"],
    price: "$$",
    explanation: "Você aprecia notas profundas e marcantes. O Oud Noir foi criado para quem quer deixar uma marca duradoura — exatamente o que as suas escolhas revelaram.",
  },
  {
    name: "Amber Rose",
    img: "/prod-2.jpg",
    tagline: "Quente & Romântico",
    notes: "Rosa · Âmbar · Patchouli",
    description: "Delicado como uma flor, quente como um abraço. O romântico que conquista sem esforço.",
    gender: ["feminine", "neutral"],
    intensity: 3,
    intentions: ["Romântico", "Presente", "Dia a dia"],
    price: "$",
    explanation: "O seu perfil aponta para aromas acolhedores e sedutores. O Amber Rose captura exatamente essa delicadeza com profundidade — perfeito para o seu estilo.",
  },
  {
    name: "Santal",
    img: "/prod-3.jpg",
    tagline: "Elegante & Discreto",
    notes: "Sândalo · Cedro · Vetiver",
    description: "A sofisticação do sândalo unida à secura do cedro. Elegância que não precisa de palavras.",
    gender: ["neutral", "masculine"],
    intensity: 2,
    intentions: ["Profissional", "Dia a dia", "Presente"],
    price: "$",
    explanation: "As suas preferências revelam alguém que valoriza a elegância discreta. O Santal é o companheiro perfeito para quem quer ser notado sem exagerar.",
  },
  {
    name: "White Musk",
    img: "/prod-4.jpg",
    tagline: "Fresco & Puro",
    notes: "Almíscar · Algodão · Bergamota",
    description: "Como uma segunda pele. Puro, limpo e irresistivelmente próximo.",
    gender: ["feminine", "neutral"],
    intensity: 1,
    intentions: ["Dia a dia", "Romântico"],
    price: "$",
    explanation: "Você prefere aromas frescos e próximos à pele. O White Musk é a escolha ideal — íntimo, delicado, com uma presença que encanta quem está perto.",
  },
  {
    name: "Noir Intense",
    img: "/prod-5.jpg",
    tagline: "Magnético & Intenso",
    notes: "Pimenta · Couro · Oud",
    description: "Para a noite que não se esquece. Intenso, magnético e absolutamente único.",
    gender: ["masculine", "neutral"],
    intensity: 5,
    intentions: ["Sensual", "Festivo"],
    price: "$$",
    explanation: "As suas escolhas mostram atração por experiências intensas e marcantes. O Noir Intense foi feito para você — audacioso, sofisticado, inesquecível.",
  },
];

const COLLECTIONS = [
  {
    name: "Noite Oriental",
    bg: "radial-gradient(ellipse at 50% 40%, #2a1806 0%, #0a0804 100%)",
    tags: ["neutral", "masculine"],
    intentions: ["Sensual", "Festivo"],
    price: "$$",
    desc: "Madeiras profundas e especiarias raras.",
    count: 8,
  },
  {
    name: "Floral Blanc",
    bg: "radial-gradient(ellipse at 40% 60%, #1a0e14 0%, #0e070a 100%)",
    tags: ["feminine", "neutral"],
    intentions: ["Romântico", "Dia a dia", "Presente"],
    price: "$",
    desc: "Pétalas frescas, elegância feminina.",
    count: 6,
  },
  {
    name: "Bois Précieux",
    bg: "radial-gradient(ellipse at 55% 35%, #0c1a0a 0%, #050f05 100%)",
    tags: ["neutral", "masculine"],
    intentions: ["Profissional", "Presente"],
    price: "$$",
    desc: "Madeiras nobres e resinas raras.",
    count: 5,
  },
  {
    name: "Aqua Silk",
    bg: "radial-gradient(ellipse at 60% 40%, #081420 0%, #05090f 100%)",
    tags: ["feminine", "neutral"],
    intentions: ["Dia a dia", "Profissional"],
    price: "$",
    desc: "Frescura aquática, sofisticação silenciosa.",
    count: 7,
  },
  {
    name: "La Maison",
    bg: "radial-gradient(ellipse at 45% 55%, #1a1510 0%, #0c0b09 100%)",
    tags: ["neutral", "feminine", "masculine"],
    intentions: ["Dia a dia", "Presente", "Romântico"],
    price: "$",
    desc: "Calor e conforto, elegância sem esforço.",
    count: 9,
  },
  {
    name: "Velvet Noir",
    bg: "radial-gradient(ellipse at 50% 50%, #1a0a1a 0%, #0a050a 100%)",
    tags: ["feminine", "masculine", "neutral"],
    intentions: ["Sensual", "Festivo"],
    price: "$$",
    desc: "Opulência e sedução em cada nota.",
    count: 4,
  },
];

const INTENTIONS = ["Romântico", "Sensual", "Dia a dia", "Presente", "Profissional", "Festivo"];
const STRENGTHS: { key: "floral" | "amadeirado" | "especiado" | "fresco"; label: string }[] = [
  { key: "floral",      label: "Floral"      },
  { key: "amadeirado",  label: "Amadeirado"  },
  { key: "especiado",   label: "Especiado"   },
  { key: "fresco",      label: "Fresco"      },
];

// ── Strength bar ──────────────────────────────────────────────────────────────
function StrengthBar({
  label, value, onChange,
}: { label: string; value: number; onChange: (v: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const active = useRef(false);

  const updateFromEvent = useCallback((clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onChange(Math.round(pct * 100));
  }, [onChange]);

  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{
          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100,
          fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
          color: "rgba(238,234,226,0.55)",
        }}>{label}</span>
        <span style={{
          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100,
          fontSize: 9, letterSpacing: "0.1em", color: C.goldDim,
        }}>{value}%</span>
      </div>
      <div
        ref={trackRef}
        style={{ height: 2, background: "rgba(238,234,226,0.1)", position: "relative", cursor: "pointer", touchAction: "none" }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          active.current = true;
          updateFromEvent(e.clientX);
        }}
        onPointerMove={(e) => { if (active.current) updateFromEvent(e.clientX); }}
        onPointerUp={() => { active.current = false; }}
        onPointerCancel={() => { active.current = false; }}
      >
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${value}%`,
          background: `linear-gradient(to right, rgba(196,163,90,0.4), ${C.gold})`,
          transition: "none",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: `${value}%`,
          transform: "translate(-50%, -50%)",
          width: 14, height: 14, borderRadius: "50%",
          background: C.gold,
          boxShadow: `0 0 10px rgba(196,163,90,0.5)`,
          cursor: "grab",
        }} />
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  active: boolean;
  onClose: () => void;
}

export default function QuizOverlay({ active, onClose }: Props) {
  type Phase = "quiz" | "result" | "personal";

  const [phase,       setPhase]       = useState<Phase>("quiz");
  const [quizIdx,     setQuizIdx]     = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [likedIds,    setLikedIds]    = useState<number[]>([]);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [exiting,     setExiting]     = useState<"left" | "right" | null>(null);
  const [showResult,  setShowResult]  = useState(false);

  // Personalization
  const [gender,     setGender]     = useState<"feminine" | "neutral" | "masculine">("neutral");
  const [strengths,  setStrengths]  = useState({ floral: 50, amadeirado: 50, especiado: 30, fresco: 60 });
  const [selections, setSelections] = useState<string[]>([]);
  const [price,      setPrice]      = useState<"$" | "$$" | null>(null);

  const dragRef     = useRef({ startX: 0, startY: 0, moved: false });
  const overlayRef  = useRef<HTMLDivElement>(null);

  // Reset when opened
  useEffect(() => {
    if (!active) return;
    setPhase("quiz");
    setQuizIdx(0);
    setCardFlipped(false);
    setLikedIds([]);
    setSwipeOffset(0);
    setExiting(null);
    setShowResult(false);
    setGender("neutral");
    setStrengths({ floral: 50, amadeirado: 50, especiado: 30, fresco: 60 });
    setSelections([]);
    setPrice(null);
  }, [active]);

  // Scroll to top when phase changes
  useEffect(() => {
    overlayRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    if (phase === "result") {
      const t = setTimeout(() => setShowResult(true), 120);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Recommended perfume
  const recommend = useMemo(() => {
    if (likedIds.length > 0) return QUIZ_PERFUMES[likedIds[0]];
    return QUIZ_PERFUMES[2]; // Santal as fallback
  }, [likedIds]);

  // Filtered collections
  const filteredCollections = useMemo(() => {
    let result = [...COLLECTIONS];
    // Gender filter (lenient: neutral is always included)
    if (gender !== "neutral") {
      result = result.filter(c => c.tags.includes(gender) || c.tags.includes("neutral"));
    }
    // Intention filter
    if (selections.length > 0) {
      result = result.filter(c => selections.some(s => c.intentions.includes(s)));
    }
    // Price filter
    if (price) {
      result = result.filter(c => c.price === price);
    }
    // Always at least 2
    if (result.length < 2) return COLLECTIONS.slice(0, 4);
    return result.slice(0, 6);
  }, [gender, selections, price]);

  // ── Swipe handlers ───────────────────────────────────────────────────────────
  const advance = useCallback((liked: boolean) => {
    const dir = liked ? "right" : "left";
    setExiting(dir);
    if (liked) setLikedIds(prev => [...prev, quizIdx]);
    setTimeout(() => {
      setSwipeOffset(0);
      setExiting(null);
      setCardFlipped(false);
      const next = quizIdx + 1;
      if (next >= QUIZ_PERFUMES.length) {
        setPhase("result");
      } else {
        setQuizIdx(next);
      }
    }, 430);
  }, [quizIdx]);

  const onCardDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, moved: false };
  }, []);

  const onCardMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const dx = Math.abs(e.clientX - dragRef.current.startX);
    if (dx > 7) {
      dragRef.current.moved = true;
      setSwipeOffset(e.clientX - dragRef.current.startX);
    }
  }, []);

  const onCardUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.moved) {
      // Tap = flip card
      setCardFlipped(f => !f);
      return;
    }
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 80) {
      advance(dx > 0);
    } else {
      setSwipeOffset(0);
    }
  }, [advance]);

  const toggleIntention = useCallback((label: string) => {
    setSelections(prev =>
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
  }, []);

  if (!active) return null;

  const perfume = QUIZ_PERFUMES[quizIdx];

  // Swipe card visual
  const swipeTransform = exiting === "right"
    ? "translateX(110vw) rotate(22deg)"
    : exiting === "left"
      ? "translateX(-110vw) rotate(-22deg)"
      : `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.022}deg)`;

  const swipeTransition = exiting
    ? "transform 0.43s cubic-bezier(0.25,1,0.5,1)"
    : swipeOffset === 0
      ? "transform 0.55s cubic-bezier(0.16,1,0.3,1)"
      : "none";

  // Like/dislike indicator opacity
  const likeOpacity   = Math.max(0, Math.min(1, swipeOffset / 100));
  const dislikeOpacity = Math.max(0, Math.min(1, -swipeOffset / 100));

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: C.bg,
        overflowY: phase === "quiz" ? "hidden" : "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      } as React.CSSProperties}
    >
      {/* Grain */}
      <div aria-hidden="true" style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        opacity: 0.025, backgroundImage: GRAIN, backgroundSize: "200px 200px",
      }} />

      {/* Close / back button */}
      <button
        onClick={onClose}
        aria-label="Fechar"
        style={{
          position: "fixed", top: 28, left: 26, zIndex: 110,
          background: "none", border: "none", cursor: "pointer", padding: 0,
          display: "flex", alignItems: "center", gap: 8,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9l5 5" stroke={C.cream} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
        </svg>
      </button>

      {/* ════════════════════════ QUIZ PHASE ════════════════════════ */}
      {phase === "quiz" && (
        <div style={{
          position: "relative", zIndex: 1,
          height: "100svh", display: "flex", flexDirection: "column",
          alignItems: "center",
        }}>
          {/* Progress dots */}
          <div style={{
            display: "flex", gap: 6, marginTop: 34,
            justifyContent: "center", alignItems: "center",
          }}>
            {QUIZ_PERFUMES.map((_, i) => (
              <div key={i} style={{
                width: i < quizIdx ? 18 : i === quizIdx ? 22 : 5,
                height: 5, borderRadius: 3,
                background: i < quizIdx
                  ? `rgba(196,163,90,0.4)`
                  : i === quizIdx
                    ? C.gold
                    : "rgba(238,234,226,0.15)",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              }} />
            ))}
          </div>

          {/* Instruction */}
          <p style={{
            fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100,
            fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase",
            color: "rgba(238,234,226,0.28)", marginTop: 14,
            paddingRight: "0.38em",
          }}>
            {cardFlipped ? "Arraste para votar" : "Toque para ver · Arraste para votar"}
          </p>

          {/* Card area */}
          <div style={{
            flex: 1, width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", marginTop: 8,
          }}>
            {/* Like indicator */}
            <div aria-hidden="true" style={{
              position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)",
              opacity: likeOpacity, pointerEvents: "none", zIndex: 2,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: `2px solid ${C.gold}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(196,163,90,0.12)",
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 17s-7-5-7-9a4 4 0 018 0 4 4 0 018 0c0 4-7 9-7 9z" fill={C.gold} />
                </svg>
              </div>
              <span style={{
                fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7.5,
                letterSpacing: "0.32em", textTransform: "uppercase",
                color: C.gold, paddingRight: "0.32em",
              }}>Gostei</span>
            </div>

            {/* Dislike indicator */}
            <div aria-hidden="true" style={{
              position: "absolute", left: "8%", top: "50%", transform: "translateY(-50%)",
              opacity: dislikeOpacity, pointerEvents: "none", zIndex: 2,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: "2px solid rgba(238,234,226,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(238,234,226,0.06)",
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="rgba(238,234,226,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{
                fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7.5,
                letterSpacing: "0.32em", textTransform: "uppercase",
                color: "rgba(238,234,226,0.4)", paddingRight: "0.32em",
              }}>Passar</span>
            </div>

            {/* Swipe wrapper */}
            <div
              key={quizIdx}
              onPointerDown={onCardDown}
              onPointerMove={onCardMove}
              onPointerUp={onCardUp}
              onPointerCancel={onCardUp}
              style={{
                width: "82vw", maxWidth: 340,
                height: "58vh", maxHeight: 470,
                cursor: "grab", touchAction: "none", userSelect: "none",
                transform: swipeTransform,
                transition: swipeTransition,
                willChange: "transform",
              }}
            >
              {/* Flip container */}
              <div style={{ perspective: "1200px", width: "100%", height: "100%" }}>
                <div style={{
                  width: "100%", height: "100%", position: "relative",
                  transformStyle: "preserve-3d",
                  transform: cardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
                  borderRadius: 28,
                  boxShadow: [
                    "0 40px 90px rgba(0,0,0,0.92)",
                    "0 16px 36px rgba(0,0,0,0.7)",
                    "inset 0 1px 0 rgba(255,255,255,0.06)",
                  ].join(", "),
                }}>

                  {/* ── FRONT: full-background product image ── */}
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden",
                    backfaceVisibility: "hidden",
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={perfume.img}
                      alt={perfume.name}
                      style={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%", objectFit: "cover",
                        display: "block",
                      }}
                      draggable={false}
                    />
                    {/* Dark overlay for readability */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.32) 100%)",
                    }} />
                    <div aria-hidden="true" style={{
                      position: "absolute", inset: 0, opacity: 0.03,
                      backgroundImage: GRAIN, backgroundSize: "200px 200px", pointerEvents: "none",
                    }} />
                    {/* Top gold line */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 1,
                      background: "linear-gradient(to right, transparent, rgba(196,163,90,0.4), transparent)",
                    }} />
                    {/* Card number */}
                    <div style={{
                      position: "absolute", top: 22, right: 22,
                      fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
                      letterSpacing: "0.32em", textTransform: "uppercase",
                      color: "rgba(238,234,226,0.35)", paddingRight: "0.32em",
                    }}>{quizIdx + 1} / {QUIZ_PERFUMES.length}</div>
                    {/* Bottom content */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 26px 28px" }}>
                      <p style={{
                        fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7.5,
                        letterSpacing: "0.38em", textTransform: "uppercase",
                        color: C.goldDim, marginBottom: 8, paddingRight: "0.38em",
                      }}>{perfume.tagline}</p>
                      <h3 style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: "clamp(26px, 7.5vw, 32px)",
                        fontWeight: 400, color: C.cream,
                        letterSpacing: "-0.01em", lineHeight: 1.1, margin: "0 0 8px",
                      }}>{perfume.name}</h3>
                      <p style={{
                        fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic",
                        fontWeight: 300, fontSize: 13, letterSpacing: "0.06em",
                        color: "rgba(238,234,226,0.5)", margin: 0,
                      }}>{perfume.notes}</p>
                    </div>
                    {/* Flip hint */}
                    <div style={{
                      position: "absolute", top: 20, left: 22,
                      fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7,
                      letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "rgba(238,234,226,0.22)", paddingRight: "0.22em",
                    }}>Toque</div>
                  </div>

                  {/* ── BACK: perfume info ── */}
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "#0d0d0f",
                    display: "flex", flexDirection: "column",
                    justifyContent: "center", padding: "32px 30px",
                  }}>
                    <div aria-hidden="true" style={{
                      position: "absolute", inset: 0, opacity: 0.03,
                      backgroundImage: GRAIN, backgroundSize: "200px 200px", pointerEvents: "none",
                    }} />
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 1,
                      background: "linear-gradient(to right, transparent, rgba(196,163,90,0.35), transparent)",
                    }} />
                    <p style={{
                      fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7.5,
                      letterSpacing: "0.42em", textTransform: "uppercase",
                      color: C.goldDim, marginBottom: 12, paddingRight: "0.42em",
                    }}>Notas</p>
                    <p style={{
                      fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic",
                      fontWeight: 300, fontSize: 15, color: "rgba(238,234,226,0.55)",
                      margin: "0 0 24px", lineHeight: 1.5, letterSpacing: "0.04em",
                    }}>{perfume.notes}</p>
                    <div style={{ width: 24, height: 1, background: C.gold, opacity: 0.35, marginBottom: 20 }} />
                    <h3 style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: "clamp(22px, 6.5vw, 26px)",
                      fontWeight: 400, color: C.cream,
                      letterSpacing: "-0.01em", lineHeight: 1.15, margin: "0 0 16px",
                    }}>{perfume.name}</h3>
                    <p style={{
                      fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic",
                      fontWeight: 300, fontSize: "clamp(14px, 4vw, 16px)",
                      color: "rgba(238,234,226,0.65)", lineHeight: 1.6, margin: "0 0 28px",
                    }}>{perfume.description}</p>
                    {/* Intensity dots */}
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      <span style={{
                        fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7.5,
                        letterSpacing: "0.28em", textTransform: "uppercase",
                        color: "rgba(238,234,226,0.28)", marginRight: 8, paddingRight: "0.28em",
                      }}>Intensidade</span>
                      {Array.from({ length: 5 }, (_, i) => (
                        <div key={i} style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: i < perfume.intensity ? C.gold : "rgba(238,234,226,0.1)",
                        }} />
                      ))}
                    </div>
                    {/* Price */}
                    <div style={{
                      position: "absolute", bottom: 26, right: 26,
                      fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 10,
                      letterSpacing: "0.2em", color: C.goldDim,
                    }}>{perfume.price}</div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Like / Dislike buttons */}
          <div style={{
            display: "flex", gap: 20, paddingBottom: "max(28px, env(safe-area-inset-bottom))",
            paddingTop: 16,
          }}>
            <button
              onClick={() => advance(false)}
              aria-label="Não gostei"
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(238,234,226,0.05)",
                border: "1px solid rgba(238,234,226,0.15)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="rgba(238,234,226,0.45)" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={() => advance(true)}
              aria-label="Gostei"
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(196,163,90,0.12)",
                border: `1px solid rgba(196,163,90,0.35)`,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 17s-7-5-7-9a4 4 0 018 0 4 4 0 018 0c0 4-7 9-7 9z" fill={C.gold} />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════ RESULT + PERSONAL PHASE ════════════════════════ */}
      {(phase === "result" || phase === "personal") && (
        <div style={{ position: "relative", zIndex: 1, paddingBottom: 80 }}>

          {/* ── Result: recommended perfume ── */}
          <div style={{ padding: "80px 28px 48px", textAlign: "center" }}>
            <p style={{
              fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
              letterSpacing: "0.52em", textTransform: "uppercase", color: C.goldDim,
              marginBottom: 14, paddingRight: "0.52em",
              opacity: showResult ? 1 : 0,
              transform: showResult ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
            }}>Seleção pronta</p>
            <h2 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "clamp(30px, 9vw, 40px)",
              fontWeight: 400, color: C.cream,
              letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 8px",
              opacity: showResult ? 1 : 0,
              transform: showResult ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
            }}>
              {recommend.name}
            </h2>
            <p style={{
              fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic",
              fontWeight: 300, fontSize: 15,
              color: "rgba(238,234,226,0.45)", margin: 0,
              opacity: showResult ? 1 : 0,
              transition: "opacity 0.8s ease 0.22s",
            }}>{recommend.tagline}</p>
          </div>

          {/* Recommended card (large) */}
          <div style={{
            margin: "0 auto 40px",
            width: "82vw", maxWidth: 340, height: "62vw", maxHeight: 280,
            borderRadius: 28, overflow: "hidden", position: "relative",
            boxShadow: "0 40px 90px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
            opacity: showResult ? 1 : 0,
            transform: showResult ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
            transition: "opacity 0.9s ease 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recommend.img}
              alt={recommend.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.25) 100%)",
            }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 22px" }}>
              <p style={{
                fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic",
                fontWeight: 300, fontSize: 13,
                color: "rgba(238,234,226,0.5)", margin: "0 0 6px",
              }}>{recommend.notes}</p>
              {/* Intensity */}
              <div style={{ display: "flex", gap: 5 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: i < recommend.intensity ? C.gold : "rgba(238,234,226,0.12)",
                  }} />
                ))}
              </div>
            </div>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: "linear-gradient(to right, transparent, rgba(196,163,90,0.4), transparent)",
            }} />
          </div>

          {/* Why section */}
          <div style={{
            margin: "0 28px",
            padding: "28px 26px",
            background: "#0d0d0f",
            borderRadius: 20,
            borderTop: `1px solid rgba(196,163,90,0.2)`,
            opacity: showResult ? 1 : 0,
            transform: showResult ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease 0.35s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s",
          }}>
            <p style={{
              fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7.5,
              letterSpacing: "0.42em", textTransform: "uppercase", color: C.goldDim,
              marginBottom: 14, paddingRight: "0.42em",
            }}>Por que foi escolhido para você</p>
            <p style={{
              fontFamily: '"Cormorant Garamond", serif', fontStyle: "italic",
              fontWeight: 300, fontSize: "clamp(16px, 4.5vw, 18px)",
              color: "rgba(238,234,226,0.75)", lineHeight: 1.65, margin: 0,
            }}>"{recommend.explanation}"</p>
          </div>

          {/* Personalizar button */}
          <div style={{
            padding: "36px 28px 0", textAlign: "center",
            opacity: showResult ? 1 : 0, transition: "opacity 0.8s ease 0.48s",
          }}>
            <button
              onClick={() => setPhase("personal")}
              style={{
                background: "none", border: `1px solid rgba(196,163,90,0.35)`,
                borderRadius: 2, padding: "15px 36px", cursor: "pointer",
                fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8.5,
                letterSpacing: "0.42em", textTransform: "uppercase", color: C.cream,
                paddingRight: "calc(36px + 0.42em)",
              }}
            >Personalizar mais</button>
          </div>

          {/* ── Personal phase ── */}
          {phase === "personal" && (
            <div style={{ paddingTop: 64 }}>

              {/* Personal header */}
              <div style={{ padding: "0 28px 40px", textAlign: "center" }}>
                <p style={{
                  fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
                  letterSpacing: "0.52em", textTransform: "uppercase", color: C.goldDim,
                  marginBottom: 12, paddingRight: "0.52em",
                }}>Preferências</p>
                <h2 style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: "clamp(26px, 8vw, 34px)",
                  fontWeight: 400, color: C.cream,
                  letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0,
                }}>Refine o seu<br />perfume ideal</h2>
              </div>

              {/* Divider */}
              <div style={{ width: 32, height: 1, background: C.gold, opacity: 0.35, margin: "0 auto 48px" }} />

              {/* Gender toggle */}
              <div style={{ padding: "0 28px 44px" }}>
                <p style={{
                  fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
                  letterSpacing: "0.38em", textTransform: "uppercase",
                  color: "rgba(238,234,226,0.4)", marginBottom: 16, paddingRight: "0.38em",
                }}>Género</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {(["Feminino", "Neutro", "Masculino"] as const).map(label => {
                    const keyMap: Record<string, "feminine" | "neutral" | "masculine"> = {
                      Feminino: "feminine", Neutro: "neutral", Masculino: "masculine",
                    };
                    const key = keyMap[label];
                    const active = gender === key;
                    return (
                      <button
                        key={label}
                        onClick={() => setGender(key)}
                        style={{
                          flex: 1, padding: "12px 0", borderRadius: 6,
                          border: `1px solid ${active ? C.gold : "rgba(238,234,226,0.12)"}`,
                          background: active ? "rgba(196,163,90,0.12)" : "transparent",
                          cursor: "pointer",
                          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8.5,
                          letterSpacing: "0.22em", textTransform: "uppercase",
                          color: active ? C.gold : "rgba(238,234,226,0.38)",
                          transition: "all 0.3s ease",
                        }}
                      >{label}</button>
                    );
                  })}
                </div>
              </div>

              {/* Strength bars */}
              <div style={{ padding: "0 28px 40px" }}>
                <p style={{
                  fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
                  letterSpacing: "0.38em", textTransform: "uppercase",
                  color: "rgba(238,234,226,0.4)", marginBottom: 24, paddingRight: "0.38em",
                }}>Notas preferidas</p>
                {STRENGTHS.map(({ key, label }) => (
                  <StrengthBar
                    key={key}
                    label={label}
                    value={strengths[key]}
                    onChange={(v) => setStrengths(s => ({ ...s, [key]: v }))}
                  />
                ))}
              </div>

              {/* Intentions */}
              <div style={{ padding: "0 28px 40px" }}>
                <p style={{
                  fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
                  letterSpacing: "0.38em", textTransform: "uppercase",
                  color: "rgba(238,234,226,0.4)", marginBottom: 16, paddingRight: "0.38em",
                }}>Intenção</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {INTENTIONS.map(label => {
                    const selected = selections.includes(label);
                    return (
                      <button
                        key={label}
                        onClick={() => toggleIntention(label)}
                        style={{
                          padding: "18px 8px",
                          borderRadius: 10,
                          border: `1px solid ${selected ? C.gold : "rgba(238,234,226,0.1)"}`,
                          background: selected ? "rgba(196,163,90,0.1)" : "#0d0d0f",
                          cursor: "pointer",
                          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
                          letterSpacing: "0.18em", textTransform: "uppercase",
                          color: selected ? C.gold : "rgba(238,234,226,0.38)",
                          transition: "all 0.3s ease",
                          textAlign: "center" as const,
                          lineHeight: 1.4,
                        }}
                      >{label}</button>
                    );
                  })}
                </div>
              </div>

              {/* Price range */}
              <div style={{ padding: "0 28px 52px" }}>
                <p style={{
                  fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
                  letterSpacing: "0.38em", textTransform: "uppercase",
                  color: "rgba(238,234,226,0.4)", marginBottom: 16, paddingRight: "0.38em",
                }}>Preço</p>
                <div style={{ display: "flex", gap: 12 }}>
                  {(["$", "$$"] as const).map(p => {
                    const sel = price === p;
                    return (
                      <button
                        key={p}
                        onClick={() => setPrice(sel ? null : p)}
                        style={{
                          flex: 1, padding: "14px 0", borderRadius: 6,
                          border: `1px solid ${sel ? C.gold : "rgba(238,234,226,0.12)"}`,
                          background: sel ? "rgba(196,163,90,0.12)" : "transparent",
                          cursor: "pointer",
                          fontFamily: '"Playfair Display", serif', fontWeight: 400,
                          fontSize: 16, letterSpacing: "0.1em",
                          color: sel ? C.gold : "rgba(238,234,226,0.38)",
                          transition: "all 0.3s ease",
                        }}
                      >{p}</button>
                    );
                  })}
                </div>
              </div>

              {/* Collections */}
              <div style={{ padding: "0 0 16px" }}>
                <div style={{ padding: "0 28px 28px", textAlign: "center" }}>
                  <p style={{
                    fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
                    letterSpacing: "0.52em", textTransform: "uppercase", color: C.goldDim,
                    marginBottom: 12, paddingRight: "0.52em",
                  }}>Para você</p>
                  <h3 style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: "clamp(24px, 7vw, 30px)",
                    fontWeight: 400, color: C.cream,
                    letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0,
                  }}>Coleções<br />selecionadas</h3>
                </div>

                {/* 2-column grid */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: 3, padding: "0 0",
                }}>
                  {filteredCollections.map((col, i) => (
                    <div
                      key={col.name}
                      style={{
                        height: "52vw", maxHeight: 210,
                        position: "relative", overflow: "hidden",
                        background: col.bg,
                        cursor: "pointer",
                      }}
                    >
                      {/* Overlay */}
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 60%)",
                      }} />
                      {/* Top line */}
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 1,
                        background: "linear-gradient(to right, transparent, rgba(196,163,90,0.25), transparent)",
                      }} />
                      {/* Content */}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 16px" }}>
                        <p style={{
                          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7,
                          letterSpacing: "0.22em", textTransform: "uppercase",
                          color: C.goldDim, marginBottom: 5, paddingRight: "0.22em",
                        }}>{col.count} perfumes</p>
                        <h4 style={{
                          fontFamily: '"Playfair Display", serif',
                          fontSize: "clamp(14px, 4vw, 16px)",
                          fontWeight: 400, color: C.cream,
                          letterSpacing: "-0.01em", lineHeight: 1.15, margin: "0 0 5px",
                        }}>{col.name}</h4>
                        <p style={{
                          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7,
                          letterSpacing: "0.1em", lineHeight: 1.5,
                          color: "rgba(238,234,226,0.35)", margin: 0,
                        }}>{col.desc}</p>
                      </div>
                      {/* Price badge */}
                      <div style={{
                        position: "absolute", top: 12, right: 12,
                        fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
                        color: C.goldDim, letterSpacing: "0.08em",
                      }}>{col.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final CTA */}
              <div style={{ padding: "40px 28px 0", textAlign: "center" }}>
                <button style={{
                  background: "none", border: `1px solid rgba(196,163,90,0.35)`,
                  borderRadius: 2, padding: "15px 36px", cursor: "pointer",
                  fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8.5,
                  letterSpacing: "0.42em", textTransform: "uppercase", color: C.cream,
                  paddingRight: "calc(36px + 0.42em)",
                }}>Ver toda a coleção</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
