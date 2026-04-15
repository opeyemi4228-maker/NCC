"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, ArrowUpRight, Quote, ChevronRight } from "lucide-react";

const M = { fontFamily: "'Montserrat', sans-serif" };

/* ── Story articles data ── */
const STORIES = [
  {
    id: 1,
    tag: "Founder Story",
    headline: "The mission Marcel Ngogbehei started — and why it can't stop now.",
    caption: "How one man's grief became Africa's most urgent cancer movement.",
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=85",
    href: "/story/founder",
    large: true,
  },
  {
    id: 2,
    tag: "Community Impact",
    headline: "She had never heard the word 'mammogram'. Now she teaches it.",
    caption: "Real people. Real impact. Real lives being changed.",
    img: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=800&q=85",
    href: "/story/community",
  },
  {
    id: 3,
    tag: "Early Detection",
    headline: "Caught at Stage 1. The screening that saved Amina's life.",
    caption: "A day in the life of an NCC outreach nurse.",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=85",
    href: "/story/amina",
  },
];

/* ══════════════════════════════════════════════════
   VIDEO MODAL
══════════════════════════════════════════════════ */
function VideoModal({ open, onClose }) {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
            title="NCC Story"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
          style={{ fontSize: 18 }}>✕</button>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN SECTION 8 — STORY / MEDIA
══════════════════════════════════════════════════ */
export default function StorySection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [videoOpen, setVideoOpen] = useState(false);

  const fw = (d = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <>
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

      <section ref={ref} className="relative w-full bg-white overflow-hidden"
        style={{ borderTop: "1px solid #f1f5f9" }}>

        {/* ── GRID BG ── */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="s8-xs" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0L0 0 0 40" fill="none" stroke="rgba(16,185,129,0.05)" strokeWidth="0.4"/>
              </pattern>
              <pattern id="s8-lg" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M200 0L0 0 0 200" fill="none" stroke="rgba(16,185,129,0.09)" strokeWidth="0.7"/>
              </pattern>
              <radialGradient id="s8-vig" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="white" stopOpacity="0"/>
                <stop offset="70%" stopColor="white" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="white" stopOpacity="1"/>
              </radialGradient>
              <mask id="s8-mask"><rect width="100%" height="100%" fill="url(#s8-vig)"/></mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#s8-xs)"/>
            <rect width="100%" height="100%" fill="url(#s8-lg)"/>
            <rect width="100%" height="100%" fill="white" fillOpacity="1" mask="url(#s8-mask)"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-20">

          {/* ── TOP HEADER — exactly like reference ── */}
          <motion.div {...fw(0)}
            className="flex items-start justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-emerald-500"/>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-600" style={M}>
                  🎥 Stories & Media
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.04]"
                style={{ ...M, letterSpacing: "-0.03em", maxWidth: 480 }}>
                Real people.<br/>
                Real impact.<br/>
                <span style={{ color: "#059669" }}>Real lives</span> changed.
              </h2>
            </div>
            <a href="/stories"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors group mt-2 flex-shrink-0"
              style={M}>
              Visit our stories
              <span className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-emerald-500 group-hover:bg-emerald-50 flex items-center justify-center transition-all duration-200">
                <ArrowUpRight size={14}/>
              </span>
            </a>
          </motion.div>

          {/* ── BENTO PHOTO GRID — matches reference layout ── */}
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4 mb-12">

            {/* LEFT — large hero photo */}
            <motion.div
              initial={{ opacity: 0, x: -24 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ minHeight: 480 }}
              onClick={() => setVideoOpen(true)}
            >
              <img src={STORIES[0].img} alt={STORIES[0].headline}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ position: "absolute", inset: 0 }} loading="eager"/>

              {/* Gradient */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.04) 100%)" }}/>

              {/* Play button — centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="w-18 h-18 rounded-full flex items-center justify-center"
                  style={{
                    width: 72, height: 72,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(12px)",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                  }}>
                  <Play size={26} className="text-white ml-1" fill="white"/>
                </motion.div>
              </div>

              {/* Bottom caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block text-[9px] font-bold tracking-[0.28em] uppercase px-2.5 py-1 rounded-full mb-3"
                  style={{ background: "rgba(5,150,105,0.85)", color: "white", ...M }}>
                  {STORIES[0].tag}
                </span>
                <h3 className="text-xl font-black text-white leading-tight mb-1"
                  style={{ ...M, letterSpacing: "-0.02em" }}>
                  {STORIES[0].headline}
                </h3>
                <div className="flex items-center gap-2 mt-3">
                  <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center flex-shrink-0">
                    <ChevronRight size={10} className="text-white"/>
                  </span>
                  <span className="text-xs font-bold text-white/70" style={M}>Watch the story</span>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — two stacked cards */}
            <div className="flex flex-col gap-4">
              {STORIES.slice(1).map((s, i) => (
                <motion.a key={s.id} href={s.href}
                  initial={{ opacity: 0, x: 24 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-2xl flex-1 cursor-pointer block"
                  style={{ minHeight: 220 }}>
                  <img src={s.img} alt={s.headline}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{ position: "absolute", inset: 0 }} loading="lazy"/>
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }}/>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-base font-black text-white leading-snug mb-2"
                      style={{ ...M, letterSpacing: "-0.015em" }}>{s.headline}</p>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center flex-shrink-0
                        group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-200">
                        <ChevronRight size={9} className="text-white"/>
                      </span>
                      <span className="text-[11px] font-bold text-white/70 group-hover:text-white/90 transition-colors" style={M}>
                        Read more
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* ── PULL QUOTE ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl px-8 sm:px-12 py-8"
            style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfdf5 50%,#f0fdf4)" }}>

            {/* large quote mark */}
            <Quote size={64} className="absolute top-4 right-8 text-emerald-100" strokeWidth={1}/>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <p className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-3"
                  style={{ ...M, letterSpacing: "-0.02em" }}>
                  "When they told me it was caught early, I cried. Not from fear — but from relief.
                  The NCC team was there every step of the way."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-black" style={M}>A</div>
                  <div>
                    <p className="text-sm font-black text-slate-800" style={M}>Amina T., Lagos</p>
                    <p className="text-xs text-slate-400 font-semibold" style={M}>Cancer Survivor · NCC Programme 2024</p>
                  </div>
                </div>
              </div>
              <motion.a href="/stories"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black text-white flex-shrink-0"
                style={{ ...M, background: "linear-gradient(135deg,#047857,#059669)", boxShadow: "0 8px 24px rgba(5,150,105,0.25)" }}>
                More Stories
                <ArrowUpRight size={14}/>
              </motion.a>
            </div>
          </motion.div>

          {/* bottom rule */}
          <motion.div
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.9, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 h-px origin-left"
            style={{ background: "linear-gradient(to right,transparent,#a7f3d0 30%,#6ee7b7 50%,#a7f3d0 70%,transparent)" }}/>
        </div>
      </section>
    </>
  );
}