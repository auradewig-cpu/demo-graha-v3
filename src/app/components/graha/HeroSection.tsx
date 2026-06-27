import { Play } from "lucide-react";

interface HeroSectionProps {
  onCta: () => void;
}

export function HeroSection({ onCta }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="gs-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "128px",
        paddingBottom: "80px",
        paddingLeft: "clamp(24px, 6vw, 80px)",
        paddingRight: "clamp(24px, 6vw, 80px)",
        maxWidth: "1440px",
        margin: "0 auto",
        background: "transparent",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "32px",
          width: "100%",
        }}
        className="grid-cols-1 lg:grid-cols-12"
      >
        {/* Content */}
        <div
          style={{ gridColumn: "1 / 7", display: "flex", flexDirection: "column", justifyContent: "center" }}
          className="col-span-12 lg:col-span-6"
        >
          <span
            className="gsap-fade-up"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gs-gold)",
              marginBottom: "24px",
              display: "block",
              textShadow: "0 2px 20px rgba(0,0,0,0.9)",
            }}
          >
            Arsitektur &amp; Konstruksi
          </span>

          <h1
            className="gsap-headline"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 6vw, 80px)",
              fontWeight: 600,
              color: "var(--gs-on-surface)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "32px",
              textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.6)",
            }}
          >
            Dari Pondasi
            <br />
            Hingga Sempurna
          </h1>

          <p
            className="gsap-fade-up"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              lineHeight: 1.6,
              color: "var(--gs-on-surface-variant)",
              marginBottom: "48px",
              maxWidth: "480px",
              textShadow: "0 2px 20px rgba(0,0,0,0.9)",
            }}
          >
            Mewujudkan visi arsitektural dengan presisi tanpa kompromi. Kami adalah mitra
            konstruksi premium untuk ruang yang abadi.
          </p>

          <div className="gsap-fade-up" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={onCta}
              className="gs-pulse"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C8A96E",
                background: "rgba(200,169,110,0.1)",
                border: "1px solid rgba(200,169,110,0.5)",
                backdropFilter: "blur(8px)",
                padding: "16px 36px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(200,169,110,0.2)";
                el.style.borderColor = "var(--gs-gold)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(200,169,110,0.1)";
                el.style.borderColor = "rgba(200,169,110,0.5)";
              }}
            >
              Mulai Konsultasi
            </button>
            <button
              onClick={() => {
                document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--gs-gold)",
                background: "transparent",
                border: "1px solid rgba(200,169,110,0.4)",
                padding: "16px 36px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--gs-gold)";
                el.style.background = "rgba(200,169,110,0.06)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(200,169,110,0.4)";
                el.style.background = "transparent";
              }}
            >
              Lihat Portfolio
            </button>
          </div>
        </div>

        {/* Hero Glass Panel — canvas shows through */}
        <div
          className="gsap-img-reveal col-span-12 lg:col-span-6"
          style={{ gridColumn: "7 / 13" }}
          data-dir="right"
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "3/4",
              border: "1px solid rgba(200,169,110,0.2)",
              boxShadow: "0 0 60px rgba(200,169,110,0.1)",
              position: "relative",
              overflow: "hidden",
              background: "rgba(7,8,10,0.25)",
              backdropFilter: "blur(12px)",
              cursor: "pointer",
            }}
            className="group"
            onClick={onCta}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,169,110,0.45)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 80px rgba(200,169,110,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,169,110,0.2)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 60px rgba(200,169,110,0.1)";
            }}
          >
            {/* Play button */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  border: "1px solid rgba(200,169,110,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(13,13,13,0.4)",
                  backdropFilter: "blur(4px)",
                  transition: "all 0.3s",
                }}
                className="group-hover:scale-110 group-hover:border-[var(--gs-gold)]"
              >
                <Play size={24} color="var(--gs-gold)" fill="var(--gs-gold)" />
              </div>
            </div>

            {/* Gold corner accent */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                width: "40px",
                height: "40px",
                borderTop: "1px solid rgba(200,169,110,0.5)",
                borderLeft: "1px solid rgba(200,169,110,0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                width: "40px",
                height: "40px",
                borderBottom: "1px solid rgba(200,169,110,0.5)",
                borderRight: "1px solid rgba(200,169,110,0.5)",
              }}
            />

            {/* Bottom label */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                zIndex: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(200,169,110,0.7)",
                }}
              >
                Architectural Noir Est. Indonesia
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
