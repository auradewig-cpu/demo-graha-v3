import { useRef, useEffect, useCallback, useState } from "react";

const TOTAL = 220;
const SRC = (i) => `/frames/hero-sequence-${String(i + 1).padStart(4, "0")}.webp`;

export function useFullPageScrub() {
  const canvasRef = useRef(null);
  const bitmaps = useRef(new Array(TOTAL).fill(null));
  const loaded = useRef(new Array(TOTAL).fill(false));
  const rafId = useRef(null);
  const lastIdx = useRef(-1);
  const [loadPct, setLoadPct] = useState(0);
  const [ready, setReady] = useState(false);
  const loadedCount = useRef(0);

  const loadFrame = useCallback((i, onDone) => {
    if (loaded.current[i]) { onDone?.(); return; }
    fetch(SRC(i))
      .then(r => r.blob())
      .then(b => {
        if (typeof createImageBitmap !== "undefined") {
          return createImageBitmap(b);
        }
        return new Promise((res) => {
          const img = new Image();
          img.onload = () => res(img);
          img.src = URL.createObjectURL(b);
        });
      })
      .then(bitmap => {
        bitmaps.current[i] = bitmap;
        loaded.current[i] = true;
        loadedCount.current++;
        onDone?.();
      })
      .catch(() => { loaded.current[i] = true; onDone?.(); });
  }, []);

  const drawFrame = useCallback((idx) => {
    const canvas = canvasRef.current;
    const bm = bitmaps.current[idx];
    if (!canvas || !bm) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    const { width: cw, height: ch } = canvas;
    const bw = bm.width || bm.naturalWidth;
    const bh = bm.height || bm.naturalHeight;
    const ratio = bw / bh;
    const cr = cw / ch;
    let sx = 0, sy = 0, sw = bw, sh = bh;
    if (ratio > cr) { sw = bh * cr; sx = (bw - sw) / 2; }
    else { sh = bw / cr; sy = (bh - sh) / 2; }
    ctx.drawImage(bm, sx, sy, sw, sh, 0, 0, cw, ch);
  }, []);

  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const mobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
    c.width = Math.round(window.innerWidth * dpr);
    c.height = Math.round(window.innerHeight * dpr);
    c.style.width = window.innerWidth + "px";
    c.style.height = window.innerHeight + "px";
    c.getContext("2d", { alpha: false }).scale(dpr, dpr);
    if (lastIdx.current >= 0 && bitmaps.current[lastIdx.current]) {
      drawFrame(lastIdx.current);
    }
  }, [drawFrame]);

  // RAF loop — map global scroll ke frame index
  useEffect(() => {
    let running = true;
    function tick() {
      if (!running) return;
      rafId.current = requestAnimationFrame(tick);
      if (!ready) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      const target = Math.min(TOTAL - 1, Math.floor(progress * (TOTAL - 1)));
      const ahead = 25;
      for (let i = Math.max(0, target - 3); i <= Math.min(TOTAL - 1, target + ahead); i++) {
        if (!loaded.current[i]) loadFrame(i);
      }
      if (target !== lastIdx.current && loaded.current[target]) {
        lastIdx.current = target;
        drawFrame(target);
      }
    }
    rafId.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafId.current); };
  }, [ready, loadFrame, drawFrame]);

  // Preload strategy: prioritas frame 0-39, lalu batch bertahap
  useEffect(() => {
    let firstBatch = 0;
    const PRIORITY = 40;

    const checkReady = () => {
      firstBatch++;
      const pct = Math.round((firstBatch / PRIORITY) * 100);
      setLoadPct(pct);
      if (firstBatch === 1) { resizeCanvas(); drawFrame(0); }
      if (firstBatch >= PRIORITY) { setReady(true); }
    };

    for (let i = 0; i < PRIORITY; i++) loadFrame(i, checkReady);

    const b1 = setTimeout(() => { for (let i = 40; i < 100; i++) loadFrame(i); }, 600);
    const b2 = setTimeout(() => { for (let i = 100; i < 160; i++) loadFrame(i); }, 1400);
    const b3 = setTimeout(() => { for (let i = 160; i < 220; i++) loadFrame(i); }, 2200);

    window.addEventListener("resize", resizeCanvas, { passive: true });
    return () => {
      clearTimeout(b1); clearTimeout(b2); clearTimeout(b3);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [loadFrame, drawFrame, resizeCanvas]);

  return { canvasRef, loadPct, ready };
}
