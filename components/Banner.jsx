"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Building2, GraduationCap, Heart, Briefcase, Plus } from "lucide-react";

const M = { fontFamily: "'Montserrat', sans-serif" };

/* ══════════════════════════════════════════════════
   SPIRAL SVG (from bento-features reference)
══════════════════════════════════════════════════ */
function SpiralBg() {
  const spiralRef = useRef(null);
  useEffect(() => {
    if (!spiralRef.current) return;
    const SIZE = 700, N = 900, DOT = 1.4, CENTER = SIZE / 2, MAX_R = CENTER - 8;
    const GA = Math.PI * (3 - Math.sqrt(5));
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", String(SIZE));
    svg.setAttribute("height", String(SIZE));
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
    for (let i = 0; i < N; i++) {
      const frac = (i + 0.5) / N;
      const r = Math.sqrt(frac) * MAX_R;
      const th = (i + 0.5) * GA;
      const c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", (CENTER + r * Math.cos(th)).toFixed(2));
      c.setAttribute("cy", (CENTER + r * Math.sin(th)).toFixed(2));
      c.setAttribute("r", String(DOT));
      c.setAttribute("fill", "#ffffff");
      const animR = document.createElementNS(svgNS, "animate");
      animR.setAttribute("attributeName", "r");
      animR.setAttribute("values", `${DOT * 0.5};${DOT * 1.4};${DOT * 0.5}`);
      animR.setAttribute("dur", "3s");
      animR.setAttribute("begin", `${(frac * 3).toFixed(3)}s`);
      animR.setAttribute("repeatCount", "indefinite");
      c.appendChild(animR);
      const animO = document.createElementNS(svgNS, "animate");
      animO.setAttribute("attributeName", "opacity");
      animO.setAttribute("values", "0.2;0.85;0.2");
      animO.setAttribute("dur", "3s");
      animO.setAttribute("begin", `${(frac * 3).toFixed(3)}s`);
      animO.setAttribute("repeatCount", "indefinite");
      c.appendChild(animO);
      svg.appendChild(c);
    }
    spiralRef.current.innerHTML = "";
    spiralRef.current.appendChild(svg);
  }, []);
  return (
    <div
      ref={spiralRef}
      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.18]"
      style={{ mixBlendMode: "screen", maskImage: "radial-gradient(circle at center,rgba(255,255,255,1) 0%,rgba(255,255,255,0.2) 55%,transparent 75%)" }}
    />
  );
}

/* ── Partner data ── */
const PARTNER_CATS = [
  {
    icon: Building2,
    category: "Health Departments",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.25)",
    partners: [
      { name: "Federal Ministry of Health", abbr: "FMoH", country: "Nigeria" },
      { name: "Lagos State Health Dept.", abbr: "LSHD", country: "Nigeria" },
      { name: "NHS Charity Division",       abbr: "NHS",  country: "UK" },
      { name: "Abuja PHC Board",            abbr: "APHC", country: "FCT" },
    ],
  },
  {
    icon: GraduationCap,
    category: "Universities & Medical Schools",
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.12)",
    border: "rgba(14,165,233,0.25)",
    partners: [
      { name: "University of Lagos College of Medicine", abbr: "CMUL", country: "Nigeria" },
      { name: "University of Ibadan",    abbr: "UI",   country: "Nigeria" },
      { name: "King's College London",  abbr: "KCL",  country: "UK" },
      { name: "UNIABUJA Medical School", abbr: "UAMS", country: "FCT" },
    ],
  },
  {
    icon: Heart,
    category: "NGOs & Faith-Based Orgs",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.1)",
    border: "rgba(244,63,94,0.22)",
    partners: [
      { name: "Women Against Cancer Africa",  abbr: "WACA",  country: "Pan-Africa" },
      { name: "Church of Nigeria Health Arm", abbr: "CNHA",  country: "Nigeria" },
      { name: "Muslim Aid UK",               abbr: "MAUK",  country: "UK" },
      { name: "African Cancer Foundation",   abbr: "ACF",   country: "Ghana" },
    ],
  },
  {
    icon: Briefcase,
    category: "Corporate / CSR Partners",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.22)",
    partners: [
      { name: "Dangote Foundation",   abbr: "DF",   country: "Nigeria" },
      { name: "MTN Foundation",       abbr: "MTN",  country: "Nigeria" },
      { name: "Shell LiveWIRE",       abbr: "SLW",  country: "Nigeria" },
      { name: "Access Bank CSR",      abbr: "ABCSR",country: "Nigeria" },
    ],
  },
];

/* ── Partner logo pill ── */
function PartnerPill({ abbr, name, delay, color, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      title={name}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-300 hover:scale-[1.03] cursor-default"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[14px] font-black flex-shrink-0"
        style={{ background: color + "22", color, border: `1px solid ${color}33`, ...M }}>
        {abbr.slice(0, 2)}
      </span>
      <span className="text-xs font-bold text-white truncate" style={{ ...M, maxWidth: 130 }}>{name}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN SECTION 9 — PARTNERS
══════════════════════════════════════════════════ */
export default function PartnersSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const fw = (d = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section ref={ref} className="relative w-full overflow-hidden"
      style={{ background: "radial-gradient(125% 125% at 50% 10%, #030712 40%, #011e10 100%)" }}>

      {/* spiral bg */}
      <SpiralBg/>

      {/* fine grid overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="p9-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0L0 0 0 48" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p9-grid)"/>
        </svg>
        {/* corner brackets */}
        {[["top-8 left-8","M0,22 L0,0 L22,0"],["top-8 right-8","M0,22 L0,0 L22,0"],
          ["bottom-8 left-8","M0,-22 L0,0 L22,0"],["bottom-8 right-8","M0,-22 L0,0 L22,0"]
        ].map(([pos, d], i) => (
          <svg key={i} className={`absolute ${pos} w-9 h-9`} viewBox="-4 -4 30 30" fill="none">
            <path d={d} stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="0" cy="0" r="2.5" fill="rgba(16,185,129,0.4)"/>
          </svg>
        ))}
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-20">

        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <motion.div {...fw(0)} className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-emerald-500"/>
              <span className="text-[14px] font-bold tracking-[0.32em] uppercase text-emerald-400" style={M}>
                🤝 Partners & Collaborations
              </span>
            </motion.div>
            <motion.h2 {...fw(0.07)}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-white leading-[1.0]"
              style={{ ...M, letterSpacing: "-0.035em" }}>
              Authority built on<br/>
              <span style={{ color: "#10b981" }}>trusted partnerships.</span>
            </motion.h2>
          </div>
          <motion.div {...fw(0.14)} className="flex-shrink-0">
            <p className="text-white text-sm leading-relaxed max-w-sm mb-5" style={M}>
              NCC operates in collaboration with health institutions, universities, NGOs,
              and forward-thinking corporations across Nigeria, the UK, and beyond.
            </p>
            <motion.a href="/partners"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-black"
              style={{
                ...M,
                background: "linear-gradient(135deg,#047857,#059669,#10b981)",
                color: "white",
                boxShadow: "0 8px 32px rgba(5,150,105,0.35)",
              }}>
              <Plus size={14}/>
              Partner With Us
            </motion.a>
          </motion.div>
        </div>

        {/* ── PARTNER BENTO GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PARTNER_CATS.map((cat, ci) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + ci * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:border-opacity-50 group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                }}>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${cat.color}14 0%, transparent 65%)` }}/>

                {/* Category header */}
                <div className="relative z-10 flex items-center gap-3 mb-5 pb-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: cat.bg, border: `1px solid ${cat.border}` }}>
                    <Icon size={16} style={{ color: cat.color }}/>
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-white leading-tight" style={M}>{cat.category}</p>
                    <p className="text-[14px] text-white font-semibold mt-0.5" style={M}>{cat.partners.length} partners</p>
                  </div>
                </div>

                {/* Partner pills */}
                <div className="relative z-10 flex flex-col gap-2">
                  {cat.partners.map((p, pi) => (
                    <PartnerPill
                      key={p.abbr} abbr={p.abbr} name={p.name}
                      color={cat.color} inView={inView}
                      delay={0.3 + ci * 0.1 + pi * 0.06}
                    />
                  ))}
                </div>

                {/* Top accent bar */}
                <motion.div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                  style={{ background: cat.color, originX: 0 }}
                  initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.35 + ci * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}/>
              </motion.div>
            );
          })}
        </div>

        {/* ── BECOME A PARTNER BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.75, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl mt-6 px-8 sm:px-12 py-8 border"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}>

          {/* Large faded text watermark */}
          <span aria-hidden className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-white/[0.04] leading-none pointer-events-none select-none"
            style={{ ...M, fontSize: "clamp(60px,10vw,120px)" }}>PARTNERS</span>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="h-px w-6 bg-emerald-500"/>
                <span className="text-[14px] font-bold tracking-[0.28em] uppercase text-emerald-400" style={M}>
                  Become a Partner
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white" style={{ ...M, letterSpacing: "-0.025em" }}>
                Join us in making cancer<br/>
                <span style={{ color: "#10b981" }}>history in Africa.</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
              <motion.a href="/partners/apply"
                whileHover={{ scale: 1.04, boxShadow: "0 16px 48px rgba(5,150,105,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-black text-emerald-900 bg-white"
                style={{ ...M, boxShadow: "0 8px 32px rgba(255,255,255,0.1)" }}>
                <Plus size={14}/>
                Partner With Us
              </motion.a>
              <a href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white hover:text-white border border-white/15 hover:border-white/30 transition-all duration-200"
                style={M}>
                Learn More
                <ArrowUpRight size={13}/>
              </a>
            </div>
          </div>
        </motion.div>

        {/* bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 1.0, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 h-px origin-left"
          style={{ background: "linear-gradient(to right,transparent,rgba(16,185,129,0.4) 30%,rgba(110,231,183,0.6) 50%,rgba(16,185,129,0.4) 70%,transparent)" }}/>
      </div>
    </section>
  );
}