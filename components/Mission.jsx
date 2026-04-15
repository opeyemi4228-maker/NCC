"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, MoveRight, Plus } from "lucide-react";

/* ══════════════════════════════════════
   COUNTER
══════════════════════════════════════ */
function Counter({ to, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const iv = useInView(ref, { once: true });
  useEffect(() => {
    if (!iv) return;
    let s = null;
    const f = (t) => {
      if (!s) s = t;
      const p = Math.min((t - s) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 4)) * to));
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }, [iv, to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ══════════════════════════════════════
   CARD DATA
══════════════════════════════════════ */
const CARDS = [
  {
    id: 0,
    num: 12, suffix: "+",
    label: "Communities Reached",
    sub: "Active communities",
    goal: 25, pct: 48,
    tag: "Outreach",
    accent: "#059669",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=85",
    body: "Mobile awareness units deployed into underserved Nigerian communities where cancer information has never reached.",
    href: "/impact/communities",
  },
  {
    id: 1,
    num: 3400, suffix: "+",
    label: "People Educated",
    sub: "Individuals informed",
    goal: 10000, pct: 34,
    tag: "Education",
    accent: "#0d9488",
    img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&q=85",
    body: "Cancer literacy programmes running through schools, churches, and community centres across five states.",
    href: "/impact/education",
  },
  {
    id: 2,
    num: 890, suffix: "+",
    label: "Screenings Conducted",
    sub: "Free screenings done",
    goal: 3000, pct: 29,
    tag: "Detection",
    accent: "#0284c7",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=85",
    body: "Free early detection drives bringing clinical-grade screening directly into rural and peri-urban areas.",
    href: "/impact/screenings",
  },
  {
    id: 3,
    num: 210, suffix: "+",
    label: "Patients Supported",
    sub: "Guided to treatment",
    goal: 500, pct: 42,
    tag: "Care",
    accent: "#7c3aed",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=85",
    body: "Direct navigation support connecting diagnosed patients to specialist care regardless of geography or income.",
    href: "/impact/patients",
  },
  {
    id: 4,
    num: 10000, suffix: "+",
    label: "12-Month Target",
    sub: "Individuals to reach",
    goal: 10000, pct: 18,
    tag: "Mission",
    accent: "#059669",
    img: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=900&q=85",
    body: "Our boldest goal: reach 10,000+ individuals in underserved communities within the next 12 months.",
    href: "/about",
    isMission: true,
  },
];

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export default function ImpactSection() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-80px" });

  const [active, setActive]     = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused]     = useState(false);
  const timerRef  = useRef(null);
  const dragStart = useRef(0);

  const cardW = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 380;
    return el.querySelector("[data-card]")?.offsetWidth ?? 380;
  }, []);

  const goTo = useCallback((idx, smooth = true) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, CARDS.length - 1));
    setActive(clamped);
    el.scrollTo({ left: clamped * (cardW() + 20), behavior: smooth ? "smooth" : "auto" });
  }, [cardW]);

  useEffect(() => {
    if (!inView || paused) return;
    timerRef.current = setInterval(() => {
      setActive(prev => {
        const next = prev >= CARDS.length - 1 ? 0 : prev + 1;
        goTo(next);
        return next;
      });
    }, 20000);
    return () => clearInterval(timerRef.current);
  }, [inView, paused, goTo]);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / (cardW() + 20));
    setActive(Math.max(0, Math.min(idx, CARDS.length - 1)));
  };

  const onMouseDown = (e) => { setDragging(true); dragStart.current = e.clientX + (trackRef.current?.scrollLeft ?? 0); };
  const onMouseMove = (e) => { if (!dragging || !trackRef.current) return; trackRef.current.scrollLeft = dragStart.current - e.clientX; };
  const onMouseUp   = () => { setDragging(false); onScroll(); };

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!inView || paused) { setProgress(0); return; }
    setProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      setProgress(((Date.now() - start) % 30000) / 300);
    }, 80);
    return () => clearInterval(id);
  }, [inView, paused, active]);

  const fadeUp = (d = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white overflow-hidden border-t border-slate-100"
    >

      {/* ─── GRID BACKGROUND ─── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ip-xs" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0L0 0 0 40" fill="none" stroke="rgba(16,185,129,0.055)" strokeWidth="0.4"/>
            </pattern>
            <pattern id="ip-lg" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M200 0L0 0 0 200" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="0.8"/>
            </pattern>
            <radialGradient id="ip-vignette" cx="50%" cy="40%" r="55%">
              <stop offset="0%"   stopColor="white" stopOpacity="0"/>
              <stop offset="65%"  stopColor="white" stopOpacity="0.55"/>
              <stop offset="100%" stopColor="white" stopOpacity="1"/>
            </radialGradient>
            <mask id="ip-mask">
              <rect width="100%" height="100%" fill="url(#ip-vignette)"/>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#ip-xs)"/>
          <rect width="100%" height="100%" fill="url(#ip-lg)"/>
          <rect width="100%" height="100%" fill="white" fillOpacity="1" mask="url(#ip-mask)"/>
        </svg>

        {/* Emerald top glow */}
        <div className="absolute top-0 inset-x-0 h-72 bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(16,185,129,0.07)_0%,transparent_100%)]" />

        {/* Scanning beam */}
        <motion.div
          className="absolute inset-y-0 w-px bg-[linear-gradient(to_bottom,transparent,rgba(16,185,129,0.18)_40%,rgba(16,185,129,0.28)_50%,rgba(16,185,129,0.18)_60%,transparent)]"
          animate={{ left: ["0%", "100%", "0%"] }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        />

        {/* Corner marks */}
        {[
          ["top-8 left-8",    "M0,20 L0,0 L20,0"],
          ["top-8 right-8",   "M0,20 L0,0 L20,0"],
          ["bottom-8 left-8", "M0,-20 L0,0 L20,0"],
          ["bottom-8 right-8","M0,-20 L0,0 L20,0"],
        ].map(([pos, d], i) => (
          <svg key={i} className={`absolute ${pos} w-7 h-7`} viewBox="-4 -4 28 28" fill="none">
            <path d={d} stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="0" cy="0" r="2" fill="rgba(16,185,129,0.35)"/>
          </svg>
        ))}
      </div>

      {/* ─── CONTENT ─── */}
      <div className="relative z-10 pt-24 pb-20">

        {/* ── HEADER ZONE ── */}
        <div className="px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1440px] mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-8">

            {/* Left: eyebrow + headline */}
            <div>
              <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-emerald-500" />
                <span className="text-[14px] font-bold tracking-[0.32em] uppercase text-emerald-600">
                  📊 Impact & Progress
                </span>
              </motion.div>

              <motion.h2
                {...fadeUp(0.07)}
                className="text-[2.6rem] sm:text-5xl lg:text-[3.6rem] font-black text-slate-900 leading-[1.0] tracking-[-0.035em] mb-5"
              >
                Every number<br />
                <span className="text-emerald-600">is a life</span> we&apos;ve{" "}
                <span className="relative inline-block">
                  touched.
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-[5px] rounded-full bg-emerald-200 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              </motion.h2>

              <motion.p {...fadeUp(0.15)} className="text-base text-slate-500 leading-relaxed max-w-xl">
                Our pilot programs are already delivering results across Nigeria and West Africa.
                Scroll through five pillars of measurable impact — and the mission that drives us.
              </motion.p>
            </div>

            {/* Right: nav controls + progress */}
            <motion.div {...fadeUp(0.2)} className="flex flex-col items-end gap-4">
              {/* Auto-advance progress bar */}
              <div
                className="w-48 h-[3px] rounded-full overflow-hidden bg-slate-100"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0 }}
                />
              </div>
              <p className="text-[14px] text-slate-400 font-semibold tracking-wider uppercase">
                {paused ? "Paused" : `Next in ${Math.ceil((100 - progress) * 0.3)}s`}
              </p>

              {/* Dot nav */}
              <div className="flex items-center gap-2 mt-1">
                {CARDS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { goTo(i); setPaused(true); setTimeout(() => setPaused(false), 8000); }}
                    className="rounded-full transition-all duration-300 focus:outline-none"
                    style={{
                      width: i === active ? 28 : 8,
                      height: 8,
                      background: i === active ? "#059669" : "#e2e8f0",
                    }}
                  />
                ))}
              </div>

              {/* Arrow pair */}
              <div className="flex gap-2 mt-1">
                {[{ d: -1, label: "←" }, { d: 1, label: "→" }].map(({ d, label }) => (
                  <button
                    key={label}
                    onClick={() => { goTo(active + d); setPaused(true); setTimeout(() => setPaused(false), 8000); }}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 transition-all duration-200 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 active:scale-95"
                  >
                    {label === "←"
                      ? <ArrowRight size={15} className="rotate-180" />
                      : <ArrowRight size={15} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── CARD TRACK ── */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className={`flex overflow-x-auto select-none snap-x snap-mandatory gap-5 pl-[clamp(24px,5vw,80px)] pr-[clamp(24px,5vw,80px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch] ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          {CARDS.map((card, i) => (
            <motion.article
              data-card
              key={card.id}
              initial={{ opacity: 0, y: 48 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.09, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 snap-start group w-[clamp(300px,30vw,400px)]"
            >
              {/* ── IMAGE FRAME ── */}
              <div className="relative overflow-hidden rounded-[20px] aspect-[3/4] bg-slate-900">
                <img
                  src={card.img}
                  alt={card.label}
                  className="w-full h-full object-cover opacity-[0.88] transition-all duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                  draggable={false}
                />

                {/* Layered overlays */}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.3)_40%,rgba(0,0,0,0.05)_70%,transparent_100%)]" />
                {/* Colored vignette — dynamic accent, must stay inline */}
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, ${card.accent}22 0%, transparent 65%)` }} />

                {/* TAG — top left */}
                <div className="absolute top-5 left-5">
                  <span
                    className="text-[14px] font-black tracking-[0.28em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
                    style={{ background: `${card.accent}22`, color: card.accent, border: `1px solid ${card.accent}44` }}
                  >
                    {card.tag}
                  </span>
                </div>

                {/* NUMBER — floating center on hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-6xl font-black text-white tracking-[-0.04em] [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]">
                    <Counter to={card.num} suffix={card.suffix} duration={1600} />
                  </p>
                  <p className="text-xs font-bold text-white uppercase tracking-widest mt-1">{card.sub}</p>
                </div>

                {/* BOTTOM text area on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-[2.6rem] font-black text-white leading-none tracking-[-0.04em]">
                        <Counter to={card.num} suffix={card.suffix} duration={1600} />
                      </p>
                      <p className="text-[14px] font-bold text-white uppercase tracking-widest mt-0.5">{card.sub}</p>
                    </div>
                    {/* Progress ring */}
                    <svg width="44" height="44" viewBox="0 0 44 44" className="flex-shrink-0">
                      <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                      <motion.circle
                        cx="22" cy="22" r="18" fill="none"
                        stroke={card.accent} strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 18}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                        animate={inView ? { strokeDashoffset: 2 * Math.PI * 18 * (1 - card.pct / 100) } : {}}
                        transition={{ delay: 0.6 + i * 0.1, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformOrigin: "22px 22px", transform: "rotate(-90deg)" }}
                      />
                      <text x="22" y="26" textAnchor="middle" fontSize="9" fontWeight="800" fill="white">{card.pct}%</text>
                    </svg>
                  </div>

                  {/* Thin progress bar */}
                  <div className="h-[2px] w-full rounded-full overflow-hidden mb-4 bg-white/[0.12]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: card.accent }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${card.pct}%` } : {}}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>

                  <p className="text-[14px] font-bold text-white uppercase tracking-widest">
                    Goal: {card.goal.toLocaleString()} {card.sub.toLowerCase()}
                  </p>
                </div>
              </div>

              {/* ── TEXT BELOW IMAGE ── */}
              <div className="pt-5 px-1">
                <h3 className="text-[17px] font-black text-slate-900 leading-tight tracking-[-0.02em] mb-2">
                  {card.label}
                </h3>
                <p className="text-[15px] text-slate-500 leading-relaxed mb-5">{card.body}</p>

                <a
                  href={card.href}
                  className="group/lnk inline-flex items-center gap-2.5 text-sm font-bold w-fit"
                  style={{ color: card.accent }}
                >
                  <span className="relative">
                    Learn more
                    <span
                      className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] rounded-full origin-left scale-x-100 group-hover/lnk:scale-x-110 transition-transform duration-200 opacity-50"
                      style={{ background: card.accent }}
                    />
                  </span>
                  <MoveRight size={14} className="transition-transform duration-200 group-hover/lnk:translate-x-1.5" />
                </a>
              </div>
            </motion.article>
          ))}
          {/* trailing pad */}
          <div className="flex-shrink-0 w-8" />
        </div>

        {/* ── MISSION BANNER ── */}
        <div className="px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1440px] mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#064e3b_0%,#065f46_35%,#047857_65%,#059669_100%)] shadow-[0_32px_80px_rgba(5,150,105,0.22),0_4px_16px_rgba(5,150,105,0.12)]"
          >

            {/* Background grid on banner */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="bpat" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M32 0L0 0 0 32" fill="none" stroke="white" strokeWidth="0.6"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bpat)"/>
            </svg>

            {/* Glow orbs */}
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_70%)]" />
            <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)]" />

            {/* Large number watermark */}
            <span
              aria-hidden
              className="absolute right-10 top-1/2 -translate-y-1/2 font-black text-white/[0.06] leading-none select-none pointer-events-none text-[clamp(80px,12vw,160px)]"
            >
              10K
            </span>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 px-8 sm:px-12 py-10 sm:py-12">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-8 bg-emerald-300/60" />
                  <span className="text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-300/80">
                    12-Month Mission Target
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-[-0.03em]">
                  Reach{" "}
                  <span className="relative inline-block">
                    <Counter to={10000} suffix="+" duration={2200} />
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-emerald-300/50 origin-left"
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : {}}
                      transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>{" "}
                  individuals.
                </p>
                <p className="text-emerald-100/70 text-sm leading-relaxed mt-3 max-w-md">
                  No one in an underserved community should die from a cancer that could have been caught early.
                  Help us get there.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
                <motion.a
                  href="/donate"
                  whileHover={{ scale: 1.04, boxShadow: "0 16px 48px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-black text-emerald-900 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
                >
                  <Plus size={15} />
                  Support Our Mission
                </motion.a>
                <a
                  href="/impact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-colors duration-200"
                >
                  View Full Impact
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* bottom rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 1.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 h-px origin-left bg-[linear-gradient(to_right,transparent,#a7f3d0_30%,#6ee7b7_50%,#a7f3d0_70%,transparent)]"
          />
        </div>
      </div>
    </section>
  );
}
