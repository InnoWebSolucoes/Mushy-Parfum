"use client";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const C = {
  bg:      "#09090B",
  cream:   "#EEEAE2",
  gold:    "#C4A35A",
  goldDim: "rgba(196,163,90,0.55)",
  dim:     "rgba(238,234,226,0.35)",
};

const STORY = [
  {
    layout: "img-left" as const,
    img: "/gallery-1.png",
    num: "I",
    headline: "A origem do oud",
    body: "Extraída das florestas mais profundas do oriente, nossa resina carrega séculos de tradição.",
  },
  {
    layout: "img-right" as const,
    img: "/gallery-2.png",
    num: "II",
    headline: "Calor e delicadeza",
    body: "O âmbar e a rosa se entrelaçam num abraço eterno — uma sinfonia que perdura na pele.",
  },
  {
    layout: "full" as const,
    img: "/gallery-3.png",
    num: "III",
    headline: "A pureza do sândalo",
    body: null,
  },
  {
    layout: "img-left" as const,
    img: "/gallery-4.png",
    num: "IV",
    headline: "O futuro do luxo",
    body: "Criamos perfumes para aqueles que definem tendências, não os que as seguem.",
  },
];

export default function MobileGallery() {
  return (
    <section style={{ background: C.bg, position: "relative", overflow: "hidden" }}>

      {/* Grain overlay */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: 0.025, backgroundImage: GRAIN, backgroundSize: "200px 200px", zIndex: 0,
      }} />

      {/* Section header */}
      <div style={{ padding: "72px 32px 48px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{
          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8,
          letterSpacing: "0.52em", textTransform: "uppercase", color: C.goldDim,
          marginBottom: 14, paddingRight: "0.52em",
        }}>A Coleção</p>
        <h2 style={{
          fontFamily: '"Playfair Display", serif', fontSize: "clamp(30px, 9vw, 40px)",
          fontWeight: 400, color: C.cream, letterSpacing: "-0.02em", lineHeight: 1.1,
          margin: 0,
        }}>Nossa história<br />em aromas</h2>
        <div style={{ width: 32, height: 1, background: C.gold, opacity: 0.5, margin: "24px auto 0" }} />
      </div>

      {/* Story rows */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {STORY.map((item, i) => {
          if (item.layout === "full") {
            return (
              <div key={i} style={{ position: "relative", height: "60vw", maxHeight: 340, overflow: "hidden", margin: "0 0 2px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.headline}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* Dark overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(9,9,11,0.88) 0%, rgba(9,9,11,0.2) 55%, rgba(9,9,11,0.05) 100%)",
                }} />
                {/* Gold top edge */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)`,
                }} />
                {/* Text overlay */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 28px 28px" }}>
                  <p style={{
                    fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 7.5,
                    letterSpacing: "0.45em", textTransform: "uppercase", color: C.goldDim,
                    marginBottom: 8, paddingRight: "0.45em",
                  }}>{item.num}</p>
                  <h3 style={{
                    fontFamily: '"Playfair Display", serif', fontSize: "clamp(22px, 6.5vw, 28px)",
                    fontWeight: 400, color: C.cream, letterSpacing: "-0.01em", lineHeight: 1.1, margin: 0,
                  }}>{item.headline}</h3>
                </div>
              </div>
            );
          }

          const imgLeft = item.layout === "img-left";
          return (
            <div key={i} style={{
              display: "flex", flexDirection: imgLeft ? "row" : "row-reverse",
              height: 220, margin: "2px 0",
              gap: 2,
            }}>
              {/* Image */}
              <div style={{ flex: "0 0 48%", position: "relative", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.headline}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: imgLeft
                    ? "linear-gradient(to right, transparent 60%, rgba(9,9,11,0.6) 100%)"
                    : "linear-gradient(to left,  transparent 60%, rgba(9,9,11,0.6) 100%)",
                }} />
              </div>

              {/* Text */}
              <div style={{
                flex: "0 0 52%", background: "#0d0d0f",
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: imgLeft ? "20px 22px 20px 18px" : "20px 18px 20px 22px",
                position: "relative",
              }}>
                <p style={{
                  fontFamily: '"Playfair Display", serif', fontWeight: 400, fontSize: 11,
                  color: C.goldDim, marginBottom: 10, letterSpacing: "0.04em",
                }}>{item.num}</p>
                <h3 style={{
                  fontFamily: '"Playfair Display", serif', fontSize: "clamp(15px, 4.5vw, 18px)",
                  fontWeight: 400, color: C.cream, letterSpacing: "-0.01em",
                  lineHeight: 1.25, margin: "0 0 10px",
                }}>{item.headline}</h3>
                {item.body && (
                  <p style={{
                    fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 9,
                    letterSpacing: "0.04em", lineHeight: 1.7,
                    color: "rgba(238,234,226,0.42)", margin: 0,
                  }}>{item.body}</p>
                )}
                {/* Accent line */}
                <div style={{
                  position: "absolute",
                  top: 0, bottom: 0,
                  [imgLeft ? "left" : "right"]: 0,
                  width: 1,
                  background: `linear-gradient(to bottom, transparent, ${C.gold}30, transparent)`,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Section footer */}
      <div style={{ padding: "40px 32px 64px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <button style={{
          background: "none", border: `1px solid rgba(196,163,90,0.35)`, borderRadius: 2,
          padding: "14px 32px", cursor: "pointer",
          fontFamily: '"Josefin Sans", sans-serif', fontWeight: 100, fontSize: 8.5,
          letterSpacing: "0.42em", textTransform: "uppercase", color: C.cream,
          paddingRight: "calc(32px + 0.42em)",
        }}>Ver toda a coleção</button>
      </div>
    </section>
  );
}
