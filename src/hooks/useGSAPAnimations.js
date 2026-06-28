import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGSAPAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // 1. HEADLINE REVEAL (clip-path dari bawah)
      gsap.utils.toArray(".gsap-headline").forEach(el => {
        gsap.fromTo(el,
          { clipPath: "inset(100% 0 0 0)", y: isMobile ? 20 : 40, opacity: 0 },
          {
            clipPath: "inset(0% 0 0 0)", y: 0, opacity: 1,
            duration: isMobile ? 0.8 : 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top 90%" : "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 2. PARAGRAPH FADE UP
      gsap.utils.toArray(".gsap-fade-up").forEach((el, i) => {
        gsap.fromTo(el,
          { y: isMobile ? 30 : 50, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: isMobile ? 0.7 : 0.9,
            ease: "power3.out",
            delay: i * 0.05,
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top 92%" : "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 3. IMAGE REVEAL (scale + slide)
      gsap.utils.toArray(".gsap-img-reveal").forEach(el => {
        const dir = el.dataset.dir || "left";
        gsap.fromTo(el,
          {
            x: isMobile ? 0 : (dir === "left" ? -80 : 80),
            y: isMobile ? 30 : 0,
            scale: isMobile ? 1.02 : 1.05,
            opacity: 0,
          },
          {
            x: 0, y: 0, scale: 1, opacity: 1,
            duration: isMobile ? 1.0 : 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top 90%" : "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 4. STAGGER CARDS (portfolio, team)
      gsap.utils.toArray(".gsap-stagger-parent").forEach(parent => {
        const children = parent.querySelectorAll(".gsap-stagger-child");
        gsap.fromTo(children,
          { y: isMobile ? 40 : 80, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: isMobile ? 0.6 : 0.8,
            ease: "power3.out",
            stagger: isMobile ? 0.08 : 0.12,
            scrollTrigger: {
              trigger: parent,
              start: isMobile ? "top 90%" : "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 5. GOLD LINE DRAW
      gsap.utils.toArray(".gsap-line-draw").forEach(el => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.0,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 6. NUMBER COUNTER
      gsap.utils.toArray(".gsap-number").forEach(el => {
        const target = parseInt(el.dataset.target || "0");
        gsap.fromTo(el,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.5,
            ease: "power1.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 7. HORIZONTAL MARQUEE (jika ada)
      gsap.utils.toArray(".gsap-marquee").forEach(el => {
        gsap.to(el, {
          xPercent: -50,
          ease: "none",
          duration: 20,
          repeat: -1,
        });
      });

    });

    return () => ctx.revert();
  }, []);
}
