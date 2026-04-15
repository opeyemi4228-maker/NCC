"use client";

/**
 * @file HeroSection.jsx
 * @project Ngogbehei Cancer Center — Digital Platform
 *
 * Reference: Basel Area website — full-bleed photo, category label top-left,
 * massive headline bottom-left anchored, geometric SVG line art top-right,
 * horizontal tab strip at bottom, virtually no overlay darkening.
 *
 * Layout:
 *   • Full viewport height photo, no heavy gradient
 *   • Category label (small caps) top-left
 *   • Giant headline — bottom-left, large, bold, white
 *   • Geometric SVG decoration — top-right quadrant (like the arrow/shape in ref)
 *   • Tab strip pinned to the very bottom — 4 slides
 *   • Scroll indicator bottom-left
 *   • Autoplay 7s per slide with progress underline
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

/* ─────────────────────────────────────────────────
   SLIDES DATA
───────────────────────────────────────────────── */
const SLIDES = [
  {
    id: "care",
    tag: "Patient Care",
    tagColor: "#F5C300",
    headline: ["Every life deserves", "cancer care."],
    sub: "Free screening, expert treatment, and compassionate support — for every Nigerian, regardless of income.",
    cta: { text: "Book Free Screening", href: "/services/screening/free" },
    ghost: { text: "Our Services", href: "/services" },
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1800&q=85",
    alt: "Doctor with patient",
  },
  {
    id: "community",
    tag: "Community Outreach",
    tagColor: "#F5C300",
    headline: ["Reaching every", "corner of Nigeria."],
    sub: "Mobile clinics and community health workers bringing early detection to underserved communities.",
    cta: { text: "See Our Impact", href: "/impact" },
    ghost: { text: "Volunteer", href: "/get-involved/volunteer" },
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1800&q=85",
    alt: "Community health outreach",
  },
  {
    id: "research",
    tag: "Medical Excellence",
    tagColor: "#F5C300",
    headline: ["Pioneering oncology", "for Africa's future."],
    sub: "Cutting-edge diagnostics and treatment protocols built for Nigeria's unique healthcare landscape.",
    cta: { text: "Our Research", href: "/impact/research" },
    ghost: { text: "2024 Impact Report", href: "/impact/reports/2024" },
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1800&q=85",
    alt: "Medical research lab",
  },
  {
    id: "donate",
    tag: "Give Today",
    tagColor: "#F5C300",
    headline: ["Double your impact", "by December 2025."],
    sub: "Every donation matched up to ₦5 million. Fund free screenings, treatment subsidies, and palliative care.",
    cta: { text: "Donate Now", href: "/donate" },
    ghost: { text: "Partnership Options", href: "/get-involved/partners" },
    img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1800&q=85",
    alt: "Supporters making a difference",
  },
];

/* ─────────────────────────────────────────────────
   GEOMETRIC SVG DECORATION  (top-right, like ref)
───────────────────────────────────────────────── */
function GeometricDeco({ accent }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.6 }}
      className="absolute top-0 right-0 z-[8] pointer-events-none"
      style={{ width: "clamp(260px, 32vw, 480px)", height: "clamp(260px, 32vw, 480px)" }}
      aria-hidden>
      <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full">
        {/* Large quarter-circle arc — like Basel reference */}
        <motion.path
          d="M 480 0 Q 480 320 160 460"
          stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}/>
        {/* Inner arc */}
        <motion.path
          d="M 480 0 Q 480 220 240 380"
          stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}/>
        {/* Corner bracket top-right */}
        <motion.path
          d="M 360 0 L 480 0 L 480 120"
          stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}/>
        {/* Accent tick marks */}
        {[80, 160, 240, 320, 400].map((x, i) => (
          <motion.line key={x} x1={x} y1={0} x2={x} y2={10}
            stroke="rgba(255,255,255,0.15)" strokeWidth="1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.0 + i * 0.08 }}/>
        ))}
        {[80, 160, 240, 320, 400].map((y, i) => (
          <motion.line key={y} x1={480} y1={y} x2={470} y2={y}
            stroke="rgba(255,255,255,0.15)" strokeWidth="1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.0 + i * 0.08 }}/>
        ))}
        {/* Gold dot — accent node */}
        <motion.circle cx="480" cy="0" r="5"
          fill={accent} fillOpacity="0.9"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
          style={{ transformOrigin: "480px 0px" }}/>
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────
   VIDEO MODAL
───────────────────────────────────────────────── */
function VideoModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/82 px-4"
          style={{ backdropFilter: "blur(6px)" }}
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.18 } }}
            className="relative w-full max-w-[860px] overflow-hidden rounded-2xl bg-[#030712]"
            style={{ aspectRatio: "16/9" }}
            onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full border border-[#F5C300]/40 flex items-center justify-center">
                <Play size={28} className="text-[#F5C300] ml-1" fill="#F5C300"/>
              </div>
              <p className="text-white text-[15px]">Video coming soon</p>
            </div>
            <button onClick={onClose} aria-label="Close video"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-white hover:bg-white/20 transition-all">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────
   MAIN HERO
───────────────────────────────────────────────── */
export default function HeroSection() {
  const [active,    setActive]    = useState(0);
  const [autoplay,  setAutoplay]  = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const [prevActive, setPrev]     = useState(null);

  const intervalRef = useRef(null);
  const heroRef     = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const contentY   = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.7]);

  /* Autoplay */
  const startTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive(i => { setPrev(i); return (i + 1) % SLIDES.length; });
    }, 7000);
  }, []);

  useEffect(() => {
    if (autoplay) startTimer();
    return () => clearInterval(intervalRef.current);
  }, [autoplay, startTimer]);

  const goTo = useCallback((i) => {
    setPrev(active);
    setActive(i);
    setAutoplay(false);
    clearInterval(intervalRef.current);
    setTimeout(() => setAutoplay(true), 14000);
  }, [active]);

  /* Escape closes video */
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape" && videoOpen) setVideoOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [videoOpen]);

  const slide = SLIDES[active];
  const TAB_H = 64;

  return (
    <>
      <section ref={heroRef}
        className="relative w-full overflow-hidden bg-[#030712]"
        style={{ height: "100svh", minHeight: 620 }}
        aria-label={`Hero — ${slide.headline.join(" ")}`}>

        {/* ══════════════════════════════════════
            BACKGROUND PHOTO  (full bleed, minimal darkening)
        ══════════════════════════════════════ */}
        <AnimatePresence mode="sync">
          <motion.div key={`bg-${active}`}
            className="absolute inset-0 z-0"
            style={{ scale: imgScale, opacity: imgOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeIn" } }}>
            <Image src={slide.img} alt={slide.alt} fill priority sizes="100vw"
              className="object-cover object-center"/>
          </motion.div>
        </AnimatePresence>

        {/* ══════════════════════════════════════
            OVERLAYS — restrained, like reference
        ══════════════════════════════════════ */}
        {/* Left vignette — only left 55%, lets photo breathe on right */}
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: "linear-gradient(100deg, rgba(3,7,18,0.78) 0%, rgba(3,7,18,0.48) 35%, rgba(3,7,18,0.12) 58%, transparent 75%)" }}/>
        {/* Bottom sweep — for headline readability */}
        <div className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
          style={{ height: "50%", background: "linear-gradient(to top, rgba(3,7,18,0.72) 0%, rgba(3,7,18,0.3) 40%, transparent 100%)" }}/>
        {/* Top strip — minimal, just enough for tag */}
        <div className="absolute top-0 left-0 right-0 z-[1] pointer-events-none"
          style={{ height: "18%", background: "linear-gradient(to bottom, rgba(3,7,18,0.38) 0%, transparent 100%)" }}/>

        {/* ══════════════════════════════════════
            GEOMETRIC SVG DECORATION  (top-right)
        ══════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          <GeometricDeco key={`deco-${active}`} accent={slide.tagColor}/>
        </AnimatePresence>

        {/* ══════════════════════════════════════
            SCROLLABLE CONTENT LAYER
        ══════════════════════════════════════ */}
        <motion.div style={{ y: contentY }}
          className="relative z-[10] flex flex-col h-full"
          style={{ paddingBottom: TAB_H }}>

          {/* ── CATEGORY TAG  top-left (exact Basel ref style) ── */}
          <div className="flex-shrink-0 px-6 sm:px-10 lg:px-16 xl:px-20 pt-[calc(var(--navbar-h,102px)+28px)]">
            <AnimatePresence mode="wait">
              <motion.div key={`tag-${active}`}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2.5">
                {/* Red square dot — exact Basel reference */}
                <span className="w-[7px] h-[7px] flex-shrink-0"
                  style={{ background: slide.tagColor }}/>
                <span className="text-[14px] font-black tracking-[0.28em] uppercase text-white"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {slide.tag}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── SPACER: 10px on mobile/tablet, full flex on desktop ── */}
          <div className="h-[10px] lg:flex-1"/>

          {/* ── HEADLINE + CTA  bottom-left anchored ── */}
          <div className="flex-shrink-0 px-6 sm:px-10 lg:px-16 xl:px-20 pb-10">
            <div className="max-w-[900px]">

              {/* Headline */}
              <AnimatePresence mode="wait">
                <motion.h1 key={`h1-${active}`}
                  className="font-black text-white leading-[0.95] tracking-[-0.03em] mb-7"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>

                  {/* ── Mobile / tablet: one fluid block, natural wrap ── */}
                  <motion.span
                    className="block lg:hidden text-[1.9rem] sm:text-[2.5rem] md:text-[3.2rem]"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
                    {slide.headline.join(" ")}
                  </motion.span>

                  {/* ── Desktop: staggered line-by-line, 2 lines only ── */}
                  {slide.headline.map((line, i) => (
                    <motion.span key={`${active}-${i}`}
                      className="hidden lg:block overflow-hidden"
                      style={{ fontSize: "5.5rem" }}
                      initial={{ opacity: 0, y: 52, skewY: 1.2 }}
                      animate={{ opacity: 1, y: 0, skewY: 0 }}
                      exit={{ opacity: 0, y: -22 }}
                      transition={{ delay: i * 0.1, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}>
                      <span className="block">{line}</span>
                    </motion.span>
                  ))}
                </motion.h1>
              </AnimatePresence>

              {/* Sub + CTAs */}
              <AnimatePresence mode="wait">
                <motion.div key={`sub-${active}`}
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.32, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>

                  <p className="text-[15px] text-white leading-[1.75] mb-8 max-w-[520px]"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {slide.sub}
                  </p>

                  {/* CTA row */}
                  <div className="flex flex-wrap items-center gap-4">

                    {/* Primary pill */}
                    <Link href={slide.cta.href}
                      className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-black text-[15px] tracking-wide transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                      style={{ fontFamily: "'Montserrat', sans-serif", background: slide.tagColor, color: "#030712", boxShadow: `0 8px 28px rgba(245,195,0,0.28)` }}>
                      {slide.cta.text}
                      <span className="w-6 h-6 rounded-full bg-black/14 flex items-center justify-center group-hover:translate-x-[2px] transition-transform duration-200">
                        <ArrowRight size={12} strokeWidth={2.8}/>
                      </span>
                    </Link>

                    {/* Ghost */}
                    <Link href={slide.ghost.href}
                      className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-[15px] text-white border border-white/18 hover:bg-white/8 hover:border-white/35 hover:text-white transition-all duration-200"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {slide.ghost.text}
                      <ArrowRight size={13} strokeWidth={2} className="group-hover:translate-x-[2px] transition-transform duration-200"/>
                    </Link>

                    {/* Watch story */}
                    <button onClick={() => setVideoOpen(true)} aria-label="Watch our story"
                      className="group hidden sm:flex items-center gap-3 text-white hover:text-white transition-colors duration-200">
                      <span className="w-10 h-10 rounded-full border border-white/18 flex items-center justify-center group-hover:border-white/38 group-hover:bg-white/6 transition-all duration-200">
                        <Play size={13} strokeWidth={2} className="ml-[2px]" fill="currentColor"/>
                      </span>
                      <span className="text-[14px] font-bold tracking-wide"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Watch our story
                      </span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════
            SCROLL INDICATOR  bottom-left
        ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute z-[15] hidden lg:flex flex-col items-center gap-2"
          style={{ left: "clamp(24px, 2.5vw, 48px)", bottom: TAB_H + 24 }}>
          <div className="relative w-[1px] h-10 bg-white/14 rounded-full overflow-hidden">
            <motion.div className="absolute top-0 left-0 w-full rounded-full bg-white/60"
              style={{ height: "42%" }}
              animate={{ y: ["0%", "238%"] }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}/>
          </div>
          <span className="text-[14px] font-bold tracking-[0.22em] uppercase text-white"
            style={{ writingMode: "vertical-rl", fontFamily: "'Montserrat', sans-serif" }}>
            Scroll
          </span>
        </motion.div>

        {/* ══════════════════════════════════════
            VERTICAL SLIDE DOTS  right side
        ══════════════════════════════════════ */}
        <div className="absolute z-[15] right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: 3,
                height: i === active ? 28 : 12,
                background: i === active ? "white" : "rgba(255,255,255,0.24)",
              }}/>
          ))}
        </div>

        {/* ══════════════════════════════════════
            TAB NAVIGATOR  — pinned to very bottom
        ══════════════════════════════════════ */}
        <div className="absolute bottom-0 left-0 right-0 z-[20]">
          {/* Hairline separator */}
          <div className="w-full h-[1px] bg-white/[0.09]"/>

          <div className="flex" style={{ height: TAB_H }}>
            {SLIDES.map((s, i) => {
              const isActive = i === active;
              return (
                <button key={s.id} onClick={() => goTo(i)}
                  aria-current={isActive ? "true" : undefined}
                  className="relative flex-1 flex items-center justify-center sm:justify-start px-4 sm:px-8 transition-colors duration-200"
                  style={{ background: isActive ? "rgba(255,255,255,0.07)" : "rgba(3,7,18,0.55)" }}>

                  {/* Dot + label */}
                  <span className="flex items-center gap-2.5">
                    <span className="w-[6px] h-[6px] rounded-full flex-shrink-0 transition-all duration-300"
                      style={{ background: isActive ? s.tagColor : "rgba(255,255,255,0.22)" }}/>
                    <span className="text-[14px] font-black tracking-[0.15em] uppercase transition-colors duration-200 leading-none hidden sm:block"
                      style={{ fontFamily: "'Montserrat', sans-serif", color: isActive ? "white" : "rgba(255,255,255,0.35)" }}>
                      {s.tag}
                    </span>
                    {/* Mobile: just number */}
                    <span className="text-[14px] font-black text-white sm:hidden"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>

                  {/* Gold accent underline */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-[3px]"
                        style={{ background: s.tagColor }}
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                        exit={{ scaleX: 0, originX: 1, transition: { duration: 0.22 } }}/>
                    )}
                  </AnimatePresence>

                  {/* Autoplay progress */}
                  {isActive && autoplay && (
                    <motion.span
                      key={`prog-${active}`}
                      className="absolute bottom-0 left-0 h-[2px] opacity-40"
                      style={{ background: s.tagColor }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%", transition: { duration: 7, ease: "linear" } }}/>
                  )}

                  {/* Vertical divider between tabs */}
                  {i < SLIDES.length - 1 && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-6 bg-white/[0.08]"/>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CSS var for navbar height — set by your layout if needed */}
        <style>{`
          :root { --navbar-h: 102px; }
          @media (max-width: 768px) { :root { --navbar-h: 102px; } }
        `}</style>
      </section>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)}/>
    </>
  );
}