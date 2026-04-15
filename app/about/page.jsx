"use client";

/**
 * Ngogbehei Cancer Center — About Us Page
 * Production-ready · SEO-optimized · Next.js compatible
 *
 * SEO Strategy:
 *  - Semantic HTML5 landmarks (main, section, article, aside)
 *  - Single H1 per page, logical H2/H3 hierarchy
 *  - Descriptive alt text on all images
 *  - Schema.org JSON-LD (Organization + NGO)
 *  - Canonical-friendly slug IDs on sections
 *  - aria-label / aria-hidden on decorative elements
 *  - Lazy loading on below-fold images
 *  - Google Fonts preconnect hint (add to <head> in layout)
 *  - Open Graph meta handled at layout level via generateMetadata()
 */

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowUpRight, Plus, MoveRight, ChevronRight,
} from "lucide-react";

/* ── Montserrat override token ── */
const M = { fontFamily: "'Montserrat', sans-serif" };

/* ─────────────────────────────────────────────────────
   JSON-LD SCHEMA  (inject once per page, SSR-safe)
───────────────────────────────────────────────────── */
function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "NGO"],
    name: "Ngogbehei Cancer Center",
    alternateName: "NCC",
    legalName: "Marcel Ngogbehei Center for Cancer Education & Care",
    description:
      "A UK-registered nonprofit empowering rural African communities through cancer education, early detection, and accessible pathways to care.",
    url: "https://www.ngogbehei.org",
    logo: "https://www.ngogbehei.org/logo.png",
    foundingDate: "2021",
    nonprofitStatus: "Nonprofit501c3",
    areaServed: ["Nigeria", "Ghana", "West Africa"],
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "General Enquiries",
      email: "hello@ngogbehei.org",
    },
    sameAs: [
      "https://twitter.com/ngogbehei",
      "https://www.linkedin.com/company/ngogbehei",
      "https://www.facebook.com/ngogbehei",
    ],
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ─────────────────────────────────────────────────────
   SPIRAL BACKGROUND  (decorative, aria-hidden)
───────────────────────────────────────────────────── */
function SpiralBg({ opacity = 0.18, size = 800 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const N = 900, DOT = 1.4, C = size / 2, R = C - 10;
    const GA = Math.PI * (3 - Math.sqrt(5));
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("aria-hidden", "true");
    for (let i = 0; i < N; i++) {
      const f = (i + 0.5) / N;
      const r = Math.sqrt(f) * R;
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", (C + r * Math.cos((i + 0.5) * GA)).toFixed(2));
      c.setAttribute("cy", (C + r * Math.sin((i + 0.5) * GA)).toFixed(2));
      c.setAttribute("r", String(DOT));
      c.setAttribute("fill", "#ffffff");
      const aR = document.createElementNS(ns, "animate");
      aR.setAttribute("attributeName", "r");
      aR.setAttribute("values", `${DOT * 0.4};${DOT * 1.6};${DOT * 0.4}`);
      aR.setAttribute("dur", "3.5s");
      aR.setAttribute("begin", `${(f * 3.5).toFixed(3)}s`);
      aR.setAttribute("repeatCount", "indefinite");
      c.appendChild(aR);
      const aO = document.createElementNS(ns, "animate");
      aO.setAttribute("attributeName", "opacity");
      aO.setAttribute("values", "0.1;0.85;0.1");
      aO.setAttribute("dur", "3.5s");
      aO.setAttribute("begin", `${(f * 3.5).toFixed(3)}s`);
      aO.setAttribute("repeatCount", "indefinite");
      c.appendChild(aO);
      svg.appendChild(c);
    }
    ref.current.innerHTML = "";
    ref.current.appendChild(svg);
  }, [size]);

  const mask = `radial-gradient(circle at 70% 50%, white 0%, rgba(255,255,255,0.08) 55%, transparent 72%)`;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-end"
      style={{ opacity, mixBlendMode: "screen", maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}

/* ─────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────── */
function Counter({ to, suffix = "", duration = 1800 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const iv = useInView(ref, { once: true });
  useEffect(() => {
    if (!iv) return;
    let s = null;
    const f = (t) => {
      if (!s) s = t;
      const p = Math.min((t - s) / duration, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }, [iv, to, duration]);
  return (
    <span ref={ref}>
      {v.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────
   TYPEWRITER HOOK
───────────────────────────────────────────────────── */
function useTypewriter(phrases, speed = 68) {
  const [phase, setPhase] = useState("typing");
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const word = phrases[idx];
    if (phase === "typing") {
      if (char < word.length) {
        const t = setTimeout(() => {
          setText(word.slice(0, char + 1));
          setChar((c) => c + 1);
        }, speed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("hold"), 2600);
      return () => clearTimeout(t);
    }
    if (phase === "hold") {
      const t = setTimeout(() => setPhase("deleting"), 220);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (char > 0) {
        const t = setTimeout(() => {
          setText(word.slice(0, char - 1));
          setChar((c) => c - 1);
        }, speed * 0.36);
        return () => clearTimeout(t);
      }
      setIdx((i) => (i + 1) % phrases.length);
      setPhase("typing");
    }
  }, [phase, char, idx, phrases, speed]);

  return text;
}

/* ═══════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════ */
function Hero() {
  const PHRASES = [
    "late diagnosis.",
    "information gaps.",
    "the deadly silence.",
    "rural invisibility.",
    "every community.",
  ];
  const typed = useTypewriter(PHRASES, 68);

  return (
    <section
      aria-label="About Ngogbehei Cancer Center"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(125% 125% at 0% 50%, #030712 45%, #011e10 100%)",
      }}
    >
      {/* Hero background image */}
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-[52%] pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.38) saturate(0.7)" }}
          fetchpriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #030712 0%, rgba(3,7,18,0.82) 28%, rgba(3,7,18,0.18) 65%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #030712 0%, rgba(3,7,18,0.4) 22%, transparent 55%)",
          }}
        />
      </div>

      <SpiralBg opacity={0.16} size={850} />

      {/* Grid texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.055]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="hg-sm" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0L0 0 0 44" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hg-sm)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 min-h-screen flex flex-col justify-center pt-28 lg:pt-[130px] pb-20">

        {/* Breadcrumb — SEO: helps search engines understand site hierarchy */}
        <nav aria-label="Breadcrumb">
          <motion.ol
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex items-center gap-2 mb-10 list-none p-0 m-0"
          >
            <li>
              <a
                href="/"
                className="text-[14px] text-white font-semibold tracking-widest uppercase hover:text-emerald-400 transition-colors"
              >
                Home
              </a>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={9} className="text-white" />
            </li>
            <li aria-current="page">
              <span className="text-[14px] text-emerald-400/80 font-bold tracking-widest uppercase">
                About Us
              </span>
            </li>
          </motion.ol>
        </nav>

        <div className="flex flex-col max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="flex items-center gap-3 mb-7"
          >
            <span className="h-px w-10 bg-emerald-500" aria-hidden="true" />
            <span
              className="text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-400"
              style={M}
            >
              About Ngogbehei Cancer Center
            </span>
          </motion.div>

          {/* H1 — single per page, critical for SEO */}
          <div className="mb-7 overflow-hidden">
            {["We exist to", "bridge the gap"].map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: 56, skewY: 1.5 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{ delay: 0.16 + i * 0.1, duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1
                  className="font-black text-white leading-[0.92] tracking-[-0.04em]"
                  style={{ fontSize: "clamp(2.8rem,6vw,6rem)", fontFamily: "'Montserrat', sans-serif" }}
                >
                  {line}
                </h1>
              </motion.div>
            ))}

            {/* Typewriter — decorative continuation of H1 */}
            <motion.div
              initial={{ opacity: 0, y: 56, skewY: 1.5 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ delay: 0.36, duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              <span
                className="font-black leading-[0.92] tracking-[-0.04em] text-emerald-400 min-h-[1em] block"
                style={{
                  fontSize: "clamp(2.8rem,6vw,6rem)",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {typed}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.52 }}
                  className="inline-block w-[0.06em] h-[0.82em] bg-emerald-400 ml-[0.06em] align-middle rounded-sm"
                />
              </span>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.44, duration: 0.7 }}
            className="text-[15px] sm:text-base text-white/90 leading-[1.75] mb-10 max-w-lg"
            style={M}
          >
            A UK-registered nonprofit closing the deadliest gap in African healthcare —
            bringing cancer education, early detection, and patient support directly to the
            rural communities that need it most.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.65 }}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="/get-involved"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-black text-white"
              style={{
                ...M,
                background: "linear-gradient(135deg,#047857,#059669)",
                boxShadow: "0 10px 36px rgba(5,150,105,0.38)",
              }}
              aria-label="Get involved with Ngogbehei Cancer Center"
            >
              <Plus size={13} aria-hidden="true" /> Get Involved
            </motion.a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-bold text-white border border-white/[0.12] hover:border-white/[0.28] transition-all duration-200"
              style={M}
            >
              Our Story <ChevronRight size={12} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>

      <div
        className="absolute bottom-0 inset-x-0 h-36 pointer-events-none"
        aria-hidden="true"
        style={{ background: "linear-gradient(to bottom, transparent, #030712)" }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ORIGIN STORY
═══════════════════════════════════════════════════ */
function Origin() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-80px" });
  const anim = (d = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: iv ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section
      id="story"
      ref={ref}
      aria-labelledby="origin-heading"
      className="relative w-full bg-white"
      style={{ borderTop: "1px solid #f1f5f9" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-28 items-center">

          {/* Founder photo */}
          <motion.div {...anim(0)} className="relative order-2 lg:order-1">
            <figure className="relative overflow-hidden rounded-2xl m-0" style={{ aspectRatio: "4/5" }}>
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=900&q=85"
                alt="Marcel Ngogbehei, founder of Ngogbehei Cancer Center"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.88) contrast(1.04)" }}
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
                }}
              />
              <figcaption className="absolute bottom-6 left-6">
                <p
                  className="text-[14px] font-bold text-white uppercase tracking-widest mb-0.5"
                  style={M}
                >
                  Founder
                </p>
                <p
                  className="text-[17px] font-black text-white"
                  style={{ ...M, letterSpacing: "-0.015em" }}
                >
                  Marcel Ngogbehei
                </p>
              </figcaption>
            </figure>

            {/* Founded year badge */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={iv ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 0.42, duration: 0.6 }}
              className="absolute -bottom-5 -right-4 sm:-right-6 rounded-2xl px-5 py-4 bg-white border border-slate-100 shadow-xl"
              aria-label="Founded in 2021"
            >
              <p
                className="text-[28px] font-black text-slate-900 leading-none"
                style={{ ...M, letterSpacing: "-0.03em" }}
              >
                2021
              </p>
              <p
                className="text-[14px] font-bold uppercase tracking-widest text-emerald-600 mt-0.5"
                style={M}
              >
                Founded
              </p>
            </motion.div>

            {/* UK registered badge */}
            <motion.div
              initial={{ opacity: 0, x: -18, y: -18 }}
              animate={iv ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -top-4 -left-4 sm:-left-6 rounded-xl px-4 py-3 bg-white border border-slate-100 shadow-lg flex items-center gap-2.5"
              aria-label="Registered charity in England and Wales"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 font-black text-[14px]" style={M}>
                  UK
                </span>
              </div>
              <div>
                <p
                  className="text-[14px] font-bold uppercase tracking-widest text-slate-400 leading-none"
                  style={M}
                >
                  Registered
                </p>
                <p className="text-[14px] font-black text-slate-800 mt-0.5" style={M}>
                  England &amp; Wales
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Story text */}
          <article className="order-1 lg:order-2">
            <motion.div {...anim(0.1)} className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-emerald-500" aria-hidden="true" />
              <span
                className="text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-600"
                style={M}
              >
                Our Origin
              </span>
            </motion.div>

            <motion.h2
              id="origin-heading"
              {...anim(0.16)}
              className="text-[2.4rem] sm:text-[2.8rem] font-black text-slate-900 leading-[1.06] mb-7"
              style={{ ...M, letterSpacing: "-0.03em" }}
            >
              Born from loss.
              <br />
              <span style={{ color: "#059669" }}>Built for survival.</span>
            </motion.h2>

            <div className="space-y-4 mb-10">
              {[
                "The Marcel Ngogbehei Center for Cancer Education & Care was established after a deeply personal encounter with the devastating cost of late cancer diagnosis in Africa. Marcel watched loved ones lose their battle — not because treatment was impossible, but because nobody caught it in time.",
                "In underserved African communities, the word 'cancer' still carries a death sentence — not from biology, but from information gaps, poverty, and inaccessible healthcare. NCC was built to change that equation permanently, one community at a time.",
                "Registered in England & Wales, with core operations rooted in Nigeria and beyond, NCC deploys mobile awareness units, free screenings, and patient navigation support directly into the rural communities that need it most.",
              ].map((p, i) => (
                <motion.p
                  key={i}
                  {...anim(0.22 + i * 0.08)}
                  className="text-[15px] text-slate-500 leading-[1.75]"
                  style={M}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            <motion.div {...anim(0.48)} className="flex items-center gap-4 flex-wrap">
              <motion.a
                href="/mission"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-black text-white"
                style={{
                  ...M,
                  background: "linear-gradient(135deg,#047857,#059669)",
                  boxShadow: "0 6px 24px rgba(5,150,105,0.26)",
                }}
              >
                Our Mission <ArrowUpRight size={13} aria-hidden="true" />
              </motion.a>
              <a
                href="/impact"
                className="inline-flex items-center gap-1.5 text-[15px] font-bold text-slate-500 hover:text-emerald-600 transition-colors group"
                style={M}
              >
                See Our Impact{" "}
                <MoveRight
                  size={13}
                  aria-hidden="true"
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </a>
            </motion.div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════════ */
function Stats() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  const data = [
    { num: 5,    suf: "+",  label: "African Nations",    sub: "Active operations"     },
    { num: 3400, suf: "+",  label: "People Educated",    sub: "Cancer literacy"       },
    { num: 890,  suf: "+",  label: "Free Screenings",    sub: "Conducted to date"     },
    { num: 210,  suf: "+",  label: "Patients Supported", sub: "Through navigation"    },
    { num: 12,   suf: "+",  label: "Communities",        sub: "Directly reached"      },
    { num: 100,  suf: "%",  label: "Nonprofit",          sub: "UK-registered charity" },
  ];
  return (
    <section
      ref={ref}
      aria-label="Ngogbehei Cancer Center impact statistics"
      className="relative w-full border-t border-slate-100"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {data.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col py-10 px-6 border-r border-b border-slate-100 last:border-r-0"
            >
              <p
                className="text-[2rem] font-black text-slate-900 leading-none tabular-nums mb-2"
                style={{ ...M, letterSpacing: "-0.03em" }}
                aria-label={`${s.num}${s.suf} ${s.label}`}
              >
                {iv ? <Counter to={s.num} suffix={s.suf} duration={1600} /> : `0${s.suf}`}
              </p>
              <p
                className="text-[14px] font-black text-slate-700 uppercase tracking-wider mb-1"
                style={M}
              >
                {s.label}
              </p>
              <p className="text-[14px] text-slate-400 font-medium" style={M}>
                {s.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MISSION / VISION / VALUES
═══════════════════════════════════════════════════ */
function MVV() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  const cards = [
    {
      label: "Mission",
      color: "#059669",
      text: "To empower underserved communities — especially in African rural areas — through cancer education, early detection awareness, and accessible pathways to care and support. Because knowledge saves lives, and every person deserves a fighting chance against cancer, no matter where they live.",
    },
    {
      label: "Vision",
      color: "#0284c7",
      text: "A world where cancer is no longer a death sentence in rural communities — because education and access always come first. An Africa where geography and income never determine who survives.",
    },
    {
      label: "Values",
      color: "#7c3aed",
      text: "Dignity in every encounter. Radical access over convenience. Community first. Evidence-based action. Relentless hope in the face of overwhelming odds. Because justice is at the heart of every life we fight for.",
    },
  ];
  return (
    <section
      ref={ref}
      aria-labelledby="mvv-heading"
      className="relative w-full bg-slate-50 border-t border-slate-100"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-16 lg:gap-24 items-start">

          {/* Left heading */}
          <div className="lg:pt-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.55 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-px w-8 bg-emerald-500" aria-hidden="true" />
              <span
                className="text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-600"
                style={M}
              >
                What Drives Us
              </span>
            </motion.div>
            <motion.h2
              id="mvv-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2rem] sm:text-[2.4rem] font-black text-slate-900 leading-[1.08] whitespace-nowrap"
              style={{ ...M, letterSpacing: "-0.03em" }}
            >
              Purpose.
              <br />
              Direction.
              <br />
              <span style={{ color: "#059669" }}>Character.</span>
            </motion.h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.map((c, i) => (
              <motion.article
                key={c.label}
                initial={{ opacity: 0, y: 28 }}
                animate={iv ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.14 + i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-white rounded-2xl p-7 border border-slate-100"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                aria-label={`NCC ${c.label}`}
              >
                <motion.div
                  className="absolute top-0 left-7 right-7 h-[2px] rounded-full"
                  style={{ background: c.color, originX: 0 }}
                  initial={{ scaleX: 0 }}
                  animate={iv ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.28 + i * 0.1, duration: 0.8 }}
                  aria-hidden="true"
                />
                <h3
                  className="text-[14px] font-black uppercase tracking-[0.2em] mb-4 mt-3"
                  style={{ ...M, color: c.color }}
                >
                  {c.label}
                </h3>
                <p className="text-[16px] text-slate-600 leading-[1.75]" style={M}>
                  {c.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   WHAT WE DO — Four Programme Pillars
═══════════════════════════════════════════════════ */
function Pillars() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  const items = [
    {
      num: "01",
      title: "Community Education & Awareness",
      color: "#059669",
      desc: "Workshops in rural areas on cancer symptoms, risk factors, myths, and lifestyle changes. We partner with local schools, churches, and community centres — distributing materials in local languages.",
      stat: "3,400+",
      statLbl: "Individuals reached",
    },
    {
      num: "02",
      title: "Screening & Early Detection",
      color: "#0284c7",
      desc: "Mobile screening units and pop-up clinics bringing breast, cervical, and prostate screenings directly into communities. We train health volunteers in symptom spotting and referral pathways.",
      stat: "890+",
      statLbl: "Free screenings",
    },
    {
      num: "03",
      title: "Access to Care & Navigation",
      color: "#7c3aed",
      desc: "We walk beside every patient — connecting them to hospitals, specialists, and treatment. Financial micro-grants and transport support ensure poverty is never a barrier to survival.",
      stat: "210+",
      statLbl: "Patients guided",
    },
    {
      num: "04",
      title: "Survivor & Caregiver Support",
      color: "#0891b2",
      desc: "Peer support groups for survivors and caregivers, mental health programmes post-diagnosis, and survivor story campaigns that reduce stigma and inspire communities to act early.",
      stat: "5+",
      statLbl: "Nations active",
    },
  ];

  return (
    <section
      ref={ref}
      aria-labelledby="pillars-heading"
      className="relative w-full bg-white border-t border-slate-100"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.55 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-px w-8 bg-emerald-500" aria-hidden="true" />
              <span
                className="text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-600"
                style={M}
              >
                What We Do
              </span>
            </motion.div>
            <motion.h2
              id="pillars-heading"
              initial={{ opacity: 0, y: 18 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.2rem] sm:text-[2.6rem] font-black text-slate-900"
              style={{ ...M, letterSpacing: "-0.03em" }}
            >
              Four pillars.
              <br />
              <span style={{ color: "#059669" }}>One mission.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={iv ? { opacity: 1 } : {}}
            transition={{ delay: 0.14 }}
            className="text-[16px] text-slate-500 leading-relaxed max-w-sm"
            style={M}
          >
            Everything NCC does flows from one belief: that early action saves lives —
            and that no rural community should be left behind.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
          {items.map((item, i) => (
            <motion.article
              key={item.num}
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ delay: 0.16 + i * 0.09, duration: 0.6 }}
              className="bg-white p-8 flex flex-col gap-6 group hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <span
                  className="text-[15px] font-black tabular-nums"
                  style={{ ...M, color: item.color }}
                >
                  {item.num}
                </span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `${item.color}14` }}
                  aria-hidden="true"
                >
                  <ArrowUpRight size={12} style={{ color: item.color }} />
                </div>
              </div>
              <div>
                <h3
                  className="text-[15px] font-black text-slate-900 mb-2.5"
                  style={{ ...M, letterSpacing: "-0.01em" }}
                >
                  {item.title}
                </h3>
                <p className="text-[15px] text-slate-500 leading-[1.7]" style={M}>
                  {item.desc}
                </p>
              </div>
              <div className="mt-auto pt-5 border-t border-slate-100">
                <p
                  className="text-[20px] font-black leading-none"
                  style={{ ...M, letterSpacing: "-0.03em", color: item.color }}
                >
                  {item.stat}
                </p>
                <p className="text-[14px] text-slate-400 font-semibold mt-1" style={M}>
                  {item.statLbl}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TEAM / LEADERSHIP
═══════════════════════════════════════════════════ */
function Team() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  const people = [
    {
      name: "Marcel Ngogbehei",
      role: "Founder & Executive Director",
      country: "Nigeria · UK",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    },
    {
      name: "Dr. Adaeze Okonkwo",
      role: "Medical Director",
      country: "Nigeria",
      img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80",
    },
    {
      name: "James Whitfield",
      role: "Head of Partnerships",
      country: "United Kingdom",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
    },
    {
      name: "Fatima Al-Rashid",
      role: "Community Outreach Lead",
      country: "Nigeria",
      img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
    },
  ];
  return (
    <section
      ref={ref}
      aria-labelledby="team-heading"
      className="relative w-full bg-white border-t border-slate-100"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="h-px w-8 bg-emerald-500" aria-hidden="true" />
              <span
                className="text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-600"
                style={M}
              >
                Leadership
              </span>
            </motion.div>
            <motion.h2
              id="team-heading"
              initial={{ opacity: 0, y: 18 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.2rem] sm:text-[2.6rem] font-black text-slate-900"
              style={{ ...M, letterSpacing: "-0.03em" }}
            >
              The people behind
              <br />
              <span style={{ color: "#059669" }}>the mission.</span>
            </motion.h2>
          </div>
          <motion.a
            href="/team"
            initial={{ opacity: 0 }}
            animate={iv ? { opacity: 1 } : {}}
            transition={{ delay: 0.18 }}
            className="inline-flex items-center gap-1.5 text-[15px] font-bold text-slate-500 hover:text-emerald-600 transition-colors group flex-shrink-0"
            style={M}
          >
            Full team{" "}
            <MoveRight
              size={13}
              aria-hidden="true"
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </motion.a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {people.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 28 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.14 + i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl"
              style={{ aspectRatio: "3/4" }}
            >
              <img
                src={p.img}
                alt={`${p.name}, ${p.role} at Ngogbehei Cancer Center`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.08) 52%, transparent 100%)",
                }}
              />
              <div className="absolute top-4 left-4">
                <span
                  className="text-[13px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                  style={{ ...M, background: "rgba(5,150,105,0.85)" }}
                >
                  {p.country}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p
                  className="text-[15px] font-black text-white leading-tight"
                  style={{ ...M, letterSpacing: "-0.01em" }}
                >
                  {p.name}
                </p>
                <p
                  className="text-[13px] text-white/80 font-semibold mt-0.5 uppercase tracking-wider"
                  style={M}
                >
                  {p.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TESTIMONIAL
═══════════════════════════════════════════════════ */
function Testimonial() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section
      ref={ref}
      aria-label="Survivor testimonial"
      className="relative w-full bg-slate-50 border-t border-slate-100"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={iv ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center m-0"
        >
          <div
            className="w-10 h-px bg-emerald-500 mx-auto mb-8"
            aria-hidden="true"
          />
          <blockquote className="m-0 p-0">
            <p
              className="text-[1.5rem] sm:text-[1.75rem] font-black text-slate-900 leading-[1.35] mb-8"
              style={{ ...M, letterSpacing: "-0.025em" }}
            >
              "When they told me it was caught early, I didn't cry from fear —
              I cried from relief. The NCC team was there every single step of the way."
            </p>
          </blockquote>
          <figcaption className="flex items-center justify-center gap-3">
            <div
              className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[15px] font-black"
              aria-hidden="true"
              style={M}
            >
              A
            </div>
            <div className="text-left">
              <p className="text-[15px] font-black text-slate-800" style={M}>
                Amina T., Lagos
              </p>
              <p className="text-[14px] text-slate-400 font-semibold" style={M}>
                Cancer Survivor · NCC Programme 2024
              </p>
            </div>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CTA — Dark, full width
═══════════════════════════════════════════════════ */
function CTA() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section
      ref={ref}
      aria-labelledby="cta-heading"
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #030712 40%, #011e10 100%)",
      }}
    >
      {/* Grid texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.055]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="cg" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0L0 0 0 44" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cg)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={iv ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-px w-8 bg-emerald-500" aria-hidden="true" />
              <span
                className="text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-400"
                style={M}
              >
                Join the Mission
              </span>
            </motion.div>
            <motion.h2
              id="cta-heading"
              initial={{ opacity: 0, y: 22 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              className="font-black text-white leading-[0.95] mb-5"
              style={{
                ...M,
                fontSize: "clamp(2.2rem,5vw,4.5rem)",
                letterSpacing: "-0.04em",
              }}
            >
              Don't just read
              <br />
              our story —
              <br />
              <span style={{ color: "#10b981" }}>help write it.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={iv ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.16, duration: 0.6 }}
              className="text-[16px] text-white/80 leading-relaxed max-w-md"
              style={M}
            >
              Whether you give, volunteer, partner, or simply spread the word —
              every action moves us closer to a cancer-aware Africa where no one
              is left behind because of where they live.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={iv ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.22, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 min-w-[200px]"
          >
            <motion.a
              href="/donate"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-[15px] font-black text-slate-900 bg-white"
              style={{ ...M, boxShadow: "0 8px 32px rgba(255,255,255,0.1)" }}
              aria-label="Donate to Ngogbehei Cancer Center"
            >
              <Plus size={13} aria-hidden="true" /> Donate Now
            </motion.a>
            <a
              href="/volunteer"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-[15px] font-bold text-white border border-white/[0.12] hover:border-white/[0.28] transition-all duration-200"
              style={M}
              aria-label="Volunteer with Ngogbehei Cancer Center"
            >
              Volunteer <ArrowUpRight size={12} aria-hidden="true" />
            </a>
            <a
              href="/partners/apply"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-[15px] font-bold text-white border border-white/[0.12] hover:border-white/[0.28] transition-all duration-200"
              style={M}
              aria-label="Apply to partner with Ngogbehei Cancer Center"
            >
              Partner With Us <ChevronRight size={12} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE EXPORT
   Add generateMetadata() in your Next.js layout/page:

   export const metadata = {
     title: "About Us | Ngogbehei Cancer Center",
     description:
       "Learn how Ngogbehei Cancer Center (NCC) is empowering rural African communities through cancer education, free screenings, and patient support. UK-registered nonprofit.",
     openGraph: {
       title: "About Ngogbehei Cancer Center",
       description: "A UK-registered nonprofit closing the cancer awareness gap in rural Africa.",
       url: "https://www.ngogbehei.org/about",
       siteName: "Ngogbehei Cancer Center",
       images: [{ url: "https://www.ngogbehei.org/og-about.jpg", width: 1200, height: 630 }],
       locale: "en_GB",
       type: "website",
     },
     twitter: {
       card: "summary_large_image",
       title: "About Ngogbehei Cancer Center",
       description: "Empowering rural African communities through cancer education & early detection.",
       images: ["https://www.ngogbehei.org/og-about.jpg"],
     },
     alternates: { canonical: "https://www.ngogbehei.org/about" },
   };
═══════════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <>
      <OrganizationSchema />
      <main className="w-full" id="main-content">
        {/* Skip to main content link — accessibility + SEO */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg focus:font-bold"
        >
          Skip to main content
        </a>
        <Hero />
        <Origin />
        <Stats />
        <MVV />
        <Pillars />
        <Team />
        <Testimonial />
        <CTA />
      </main>
    </>
  );
}