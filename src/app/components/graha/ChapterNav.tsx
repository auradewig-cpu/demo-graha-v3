import { useState, useEffect } from "react";

interface ChapterNavProps {
  activeChapter: string;
}

const CHAPTERS = [
  { id: "ch-01", label: "01 VISI" },
  { id: "ch-02", label: "02 PERENCANAAN" },
  { id: "ch-03", label: "03 KONSTRUKSI" },
  { id: "ch-04", label: "04 PENYERAHAN" },
];

export function ChapterNav({ activeChapter }: ChapterNavProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        position: "sticky",
        top: "72px",
        zIndex: 30,
        padding: isMobile ? "0 5vw" : "0 80px",
        maxWidth: "1440px",
        margin: "0 auto 48px",
      }}
    >
      <div
        className="chapter-nav-scroll"
        style={{
          display: "flex",
          gap: isMobile ? "0" : "32px",
          borderBottom: "1px solid rgba(77,70,58,0.3)",
          background: "rgba(7,8,10,0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "12px 20px 0",
          overflowX: isMobile ? "auto" : "visible",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {CHAPTERS.map((ch) => (
          <button
            key={ch.id}
            onClick={() => scrollTo(ch.id)}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: isMobile ? 10 : 11,
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color:
                activeChapter === ch.id ? "var(--gs-gold)" : "var(--gs-on-surface-variant)",
              background: "none",
              border: "none",
              borderBottom:
                activeChapter === ch.id
                  ? "2px solid var(--gs-gold)"
                  : "2px solid transparent",
              padding: isMobile ? "8px 12px 16px" : "0 0 16px",
              marginBottom: "-1px",
              cursor: "pointer",
              transition: "color 0.3s, border-color 0.3s",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--gs-gold)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                activeChapter === ch.id ? "var(--gs-gold)" : "var(--gs-on-surface-variant)")
            }
          >
            {ch.label}
          </button>
        ))}
      </div>
    </div>
  );
}
