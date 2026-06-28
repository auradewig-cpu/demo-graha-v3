import { useEffect } from "react";
import { useFullPageScrub } from "../hooks/useFullPageScrub";

export function FullPageCanvas({ onReady }) {
  const { canvasRef, loadPct, ready } = useFullPageScrub();

  useEffect(() => {
    if (ready) onReady?.();
  }, [ready, onReady]);

  return (
    <>
      {/* Loading Screen */}
      {!ready && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#07080A",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "0 24px",
          }}
        >
          <p
            style={{
              color: "#C8A96E",
              fontSize: 11,
              letterSpacing: "0.25em",
              marginBottom: 24,
              fontFamily: "sans-serif",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            GRAHA STUDIO
          </p>
          <div
            style={{
              width: "min(180px, 60vw)",
              height: 1,
              background: "rgba(200,169,110,0.2)",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#C8A96E",
                width: loadPct + "%",
                transition: "width 0.15s ease",
              }}
            />
          </div>
          <p
            style={{
              color: "rgba(200,169,110,0.4)",
              fontSize: 10,
              marginTop: 12,
              fontFamily: "sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            {loadPct}%
          </p>
        </div>
      )}

      {/* Static img fallback — visible until canvas is ready */}
      <img
        src="/frames/hero-sequence-0001.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: ready ? -1 : 0,
          opacity: ready ? 0 : 1,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      />

      {/* Canvas — fixed, behind everything */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          willChange: "contents",
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          pointerEvents: "none",
          display: ready ? "block" : "none",
        }}
      />
    </>
  );
}
