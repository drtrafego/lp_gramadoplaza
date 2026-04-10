"use client";

import { useEffect } from "react";

export default function CardapioScrollFx() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".gp-cardapio");
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const revealSelectors =
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .cta-final";
    root
      .querySelectorAll(revealSelectors)
      .forEach((el) => observer.observe(el));

    const bigTextObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.3 }
    );
    root
      .querySelectorAll(".big-text")
      .forEach((el) => bigTextObs.observe(el));

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
        heroBg.style.transform = `scale(${1 + scrolled * 0.0003}) translateY(${scrolled * 0.25}px)`;
      }
    };
    window.addEventListener("scroll", onScrollParallax, { passive: true });

    const cardsScroll = root.querySelector<HTMLElement>(".cards-scroll");
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (!cardsScroll) return;
      isDown = true;
      startX = e.pageX - cardsScroll.offsetLeft;
      scrollLeft = cardsScroll.scrollLeft;
    };
    const onMouseLeave = () => { isDown = false; };
    const onMouseUp = () => { isDown = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown || !cardsScroll) return;
      e.preventDefault();
      const x = e.pageX - cardsScroll.offsetLeft;
      cardsScroll.scrollLeft = scrollLeft - (x - startX) * 1.5;
    };

    cardsScroll?.addEventListener("mousedown", onMouseDown);
    cardsScroll?.addEventListener("mouseleave", onMouseLeave);
    cardsScroll?.addEventListener("mouseup", onMouseUp);
    cardsScroll?.addEventListener("mousemove", onMouseMove);

    return () => {
      observer.disconnect();
      bigTextObs.disconnect();
      window.removeEventListener("scroll", onScrollNav);
      window.removeEventListener("scroll", onScrollParallax);
      cardsScroll?.removeEventListener("mousedown", onMouseDown);
      cardsScroll?.removeEventListener("mouseleave", onMouseLeave);
      cardsScroll?.removeEventListener("mouseup", onMouseUp);
      cardsScroll?.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return null;
}
