"use client";

import { useEffect } from "react";

export default function HomeScrollFx() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".gp-home");
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const revealSelectors =
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .divider, .etapa";
    const revealEls = root.querySelectorAll(revealSelectors);
    revealEls.forEach((el) => observer.observe(el));

    const nav = root.querySelector<HTMLElement>(".nav");
    const onScrollNav = () => {
      if (!nav) return;
      nav.classList.toggle("scrolled", window.scrollY > 80);
    };
    onScrollNav();
    window.addEventListener("scroll", onScrollNav, { passive: true });

    const heroBg = root.querySelector<HTMLElement>(".hero-bg");
    heroBg?.classList.add("loaded");

    const onScrollParallax = () => {
      if (!heroBg) return;
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `scale(${1 + scrolled * 0.0002}) translateY(${scrolled * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", onScrollParallax, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollNav);
      window.removeEventListener("scroll", onScrollParallax);
    };
  }, []);

  return null;
}
