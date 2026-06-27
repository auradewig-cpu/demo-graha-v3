import { useRef, useEffect, useCallback, useState } from "react";

const TOTAL = 220;
const SRC = (i) => `/frames/hero-sequence-${String(i+1).padStart(4,"0")}.webp`;
const MAX_CONCURRENT = 6; // Fix 5: naik dari 4 ke 6, Image() lebih stabil dari fetch

export function useFullPageScrub() {
  const canvasRef       = useRef(null);
  const bitmaps         = useRef(new Array(TOTAL).fill(null));
  const loaded          = useRef(new Array(TOTAL).fill(false));
  const inFlight        = useRef(new Set());
  const queue           = useRef([]);
  const rafId           = useRef(null);
  const lastIdx         = useRef(-1);
  const doneCount       = useRef(0);
  const currentProgress = useRef(0); // Fix 2: lerp state

  const [loadPct, setLoadPct] = useState(0);
  const [ready,   setReady]   = useState(false);

  // ── Queue processor — Fix 4: Image() langsung, hapus createImageBitmap ──
  const processQueue = useCallback(() => {
    while (
      inFlight.current.size < MAX_CONCURRENT &&
      queue.current.length > 0
    ) {
      const { index, onDone } = queue.current.shift();
      if (loaded.current[index]) { onDone?.(); continue; }
      if (inFlight.current.has(index)) continue;

      inFlight.current.add(index);

      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        bitmaps.current[index] = img;
        loaded.current[index]  = true;
        inFlight.current.delete(index);
        doneCount.current++;
        onDone?.();
        processQueue();
      };
      img.onerror = () => {
        loaded.current[index] = true;
        inFlight.current.delete(index);
        processQueue();
      };
      img.src = SRC(index);
    }
  }, []);

  // ── Enqueue helper ──
  const enqueue = useCallback((index, onDone, priority = false) => {
    if (loaded.current[index] || inFlight.current.has(index)) {
      onDone?.();
      return;
    }
    const alreadyQueued = queue.current.some(q => q.index === index);
    if (alreadyQueued) return;

    const item = { index, onDone };
    if (priority) {
      queue.current.unshift(item);
    } else {
      queue.current.push(item);
    }
    processQueue();
  }, [processQueue]);

  // ── Fix 1: Nearest frame fallback — tidak blank saat frame belum loaded ──
  const findNearestLoaded = useCallback((target) => {
    if (loaded.current[target]) return target;
    for (let offset = 1; offset < 10; offset++) {
      const right = target + offset;
      const left  = target - offset;
      if (right < TOTAL && loaded.current[right]) return right;
      if (left  >= 0    && loaded.current[left])  return left;
    }
    return lastIdx.current >= 0 ? lastIdx.current : 0;
  }, []);

  // ── Draw frame to canvas ──
  const drawFrame = useCallback((idx) => {
    const canvas = canvasRef.current;
    const bm = bitmaps.current[idx];
    if (!canvas || !bm) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    const cw = canvas.width, ch = canvas.height;
    const bw = bm.width  || bm.naturalWidth;
    const bh = bm.height || bm.naturalHeight;
    const ratio = bw / bh;
    const cr    = cw / ch;
    let sx=0, sy=0, sw=bw, sh=bh;
    if (ratio > cr) { sw = bh * cr; sx = (bw - sw) / 2; }
    else            { sh = bw / cr; sy = (bh - sh) / 2; }
    ctx.drawImage(bm, sx, sy, sw, sh, 0, 0, cw, ch);
  }, []);

  // ── Resize canvas ──
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const mobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
    c.width  = Math.round(window.innerWidth  * dpr);
    c.height = Math.round(window.innerHeight * dpr);
    c.style.width  = window.innerWidth  + "px";
    c.style.height = window.innerHeight + "px";
    c.getContext("2d", { alpha: false }).scale(dpr, dpr);
    if (lastIdx.current >= 0 && bitmaps.current[lastIdx.current]) {
      drawFrame(lastIdx.current);
    }
  }, [drawFrame]);

  // ── RAF loop — Fix 2 (lerp) + Fix 3 (dir-aware queue) + Fix 1 (nearest) ──
  useEffect(() => {
    let running = true;
    function tick() {
      if (!running) return;
      rafId.current = requestAnimationFrame(tick);
      if (!ready) return;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      // Fix 2: lerp progress untuk smooth easing
      const rawProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      currentProgress.current += (rawProgress - currentProgress.current) * 0.12;
      const progress = currentProgress.current;
      const target   = Math.min(TOTAL - 1, Math.floor(progress * (TOTAL - 1)));

      // Fix 3: arah scroll menentukan berapa frame ahead vs behind
      const scrollDir = rawProgress > currentProgress.current ? 1 : -1;
      const ahead  = scrollDir > 0 ? 8 : 3;
      const behind = scrollDir > 0 ? 2 : 6;
      for (let i = Math.max(0, target - behind); i <= Math.min(TOTAL - 1, target + ahead); i++) {
        enqueue(i, undefined, true);
      }

      // Fix 1: tampilkan nearest loaded frame, tidak blank
      const frameToShow = findNearestLoaded(target);
      if (frameToShow !== lastIdx.current) {
        lastIdx.current = frameToShow;
        drawFrame(frameToShow);
      }

      window.dispatchEvent(
        new CustomEvent("scrub-progress", { detail: progress })
      );
    }
    rafId.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafId.current); };
  }, [ready, enqueue, drawFrame, findNearestLoaded]);

  // ── Initial load strategy ──
  useEffect(() => {
    resizeCanvas();

    const PRIORITY_FRAMES = 30;
    let priorityDone = 0;

    const onPriorityDone = () => {
      priorityDone++;
      setLoadPct(Math.round((priorityDone / PRIORITY_FRAMES) * 100));

      if (priorityDone === 1) {
        resizeCanvas();
        drawFrame(0);
      }
      if (priorityDone >= PRIORITY_FRAMES) {
        setReady(true);
        for (let i = PRIORITY_FRAMES; i < TOTAL; i++) {
          enqueue(i);
        }
      }
    };

    for (let i = 0; i < PRIORITY_FRAMES; i++) {
      enqueue(i, onPriorityDone, true);
    }

    window.addEventListener("resize", resizeCanvas, { passive: true });
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [enqueue, drawFrame, resizeCanvas]);

  return { canvasRef, loadPct, ready };
}
