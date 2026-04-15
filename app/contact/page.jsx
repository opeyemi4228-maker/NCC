"use client";

/**
 * @file ContactPage.jsx
 * @project Ngogbehei Cancer Center
 *
 * Layout:
 *  • Basel-style cinematic banner hero (~55vh) — category tag, headline, geometric SVG
 *  • Sharp white cut → content below
 *  • Split contact section: form left, info cards right
 *  • Office locations strip
 *  • FAQ accordion
 *  • Dark CTA banner
 */

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  MapPin, Phone, Mail, Clock, ChevronRight, ChevronDown,
  Plus, ArrowUpRight, MoveRight, Send, CheckCircle2,
  Globe2, Users, Heart, Calendar, MessageSquare,
} from "lucide-react";

const M = { fontFamily: "'Montserrat', sans-serif" };

/* ──────────────────────────────────────────────────────
   TYPEWRITER HOOK
────────────────────────────────────────────────────── */
function useTypewriter(phrases, speed = 68) {
  const [phase, setPhase] = useState("typing");
  const [idx,   setIdx]   = useState(0);
  const [char,  setChar]  = useState(0);
  const [text,  setText]  = useState("");
  useEffect(() => {
    const word = phrases[idx];
    if (phase === "typing") {
      if (char < word.length) {
        const t = setTimeout(() => { setText(word.slice(0, char + 1)); setChar(c => c + 1); }, speed);
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
        const t = setTimeout(() => { setText(word.slice(0, char - 1)); setChar(c => c - 1); }, speed * 0.36);
        return () => clearTimeout(t);
      }
      setIdx(i => (i + 1) % phrases.length);
      setPhase("typing");
    }
  }, [phase, char, idx, phrases, speed]);
  return text;
}

/* ──────────────────────────────────────────────────────
   SPIRAL BACKGROUND  (decorative, aria-hidden)
────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────
   HERO BANNER
────────────────────────────────────────────────────── */
function ContactHero() {
  const PHRASES = ["Let's help.", "Let's connect.", "Let's care.", "Let's talk.", "Let's begin."];
  const typed = useTypewriter(PHRASES, 72);

  return (
    <section
      aria-label="Contact Ngogbehei Cancer Center"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(125% 125% at 0% 50%, #030712 45%, #011e10 100%)",
      }}
    >
      {/* Right-side image panel */}
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-[52%] pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.38) saturate(0.7)" }}
          fetchpriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, #030712 0%, rgba(3,7,18,0.82) 28%, rgba(3,7,18,0.18) 65%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #030712 0%, rgba(3,7,18,0.4) 22%, transparent 55%)",
          }}
        />
      </div>

      <SpiralBg opacity={0.16} size={850} />

      {/* Grid texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.055]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="cg-sm" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0L0 0 0 44" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cg-sm)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 min-h-screen flex flex-col justify-center pt-28 lg:pt-[130px] pb-20">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <motion.ol
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex items-center gap-2 mb-10 list-none p-0 m-0"
          >
            <li>
              <a href="/" className="text-[14px] text-white font-semibold tracking-widest uppercase hover:text-emerald-400 transition-colors">
                Home
              </a>
            </li>
            <li aria-hidden="true"><ChevronRight size={9} className="text-white" /></li>
            <li aria-current="page">
              <span className="text-[14px] text-emerald-400/80 font-bold tracking-widest uppercase">Contact</span>
            </li>
          </motion.ol>
        </nav>

        <div className="flex flex-col max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="flex items-center gap-3 mb-7"
          >
            <span className="h-px w-10 bg-emerald-500" aria-hidden="true" />
            <span className="text-[14px] font-bold tracking-[0.3em] uppercase text-emerald-400" style={M}>
              Get in Touch
            </span>
          </motion.div>

          {/* H1 */}
          <div className="mb-7 overflow-hidden">
            {["We're here.", "Let's talk."].map((line, i) => (
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
            <motion.div
              initial={{ opacity: 0, y: 56, skewY: 1.5 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ delay: 0.36, duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              <span
                className="font-black leading-[0.92] tracking-[-0.04em] text-emerald-400 min-h-[1em] block"
                style={{ fontSize: "clamp(2.8rem,6vw,6rem)", fontFamily: "'Montserrat', sans-serif" }}
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

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.44, duration: 0.7 }}
            className="text-[15px] sm:text-base text-white/90 leading-[1.75] mb-10 max-w-lg"
            style={M}
          >
            Have a question, need patient support, or want to partner with us?
            Our team is here — reach out and we'll respond as quickly as we can.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.65 }}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="#contact-form"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-black text-white"
              style={{ ...M, background: "linear-gradient(135deg,#047857,#059669)", boxShadow: "0 10px 36px rgba(5,150,105,0.38)" }}
            >
              <Plus size={13} aria-hidden="true" /> Send a Message
            </motion.a>
            <a
              href="#locations"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-bold text-white border border-white/[0.12] hover:border-white/[0.28] transition-all duration-200"
              style={M}
            >
              Our Locations <ChevronRight size={12} aria-hidden="true" />
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

/* ──────────────────────────────────────────────────────
   CONTACT FORM
────────────────────────────────────────────────────── */
const REASONS = [
  "General Enquiry",
  "Book a Screening",
  "Donate / Partner",
  "Media & Press",
  "Patient Support",
  "Volunteer",
  "Other",
];

function ContactForm() {
  const [form, setForm]       = useState({ name:"", email:"", phone:"", reason:"", message:"" });
  const [status, setStatus]   = useState("idle"); // idle | loading | success | error
  const [touched, setTouched] = useState({});
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true, margin:"-60px" });

  const update = (k, v) => setForm(f => ({ ...f, [k]:v }));
  const touch  = (k)    => setTouched(t => ({ ...t, [k]:true }));

  const errors = {
    name:    touched.name    && !form.name.trim()                          ? "Name is required" : "",
    email:   touched.email   && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "Valid email required" : "",
    message: touched.message && form.message.trim().length < 10           ? "Please tell us more (min 10 chars)" : "",
  };

  const valid = form.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.message.trim().length >= 10;

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ name:true, email:true, message:true });
    if (!valid) return;
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1400));
    setStatus("success");
  };

  const fw = (d=0) => ({
    initial:{ opacity:0, y:20 },
    animate: iv ? { opacity:1, y:0 } : {},
    transition:{ delay:d, duration:0.6, ease:[0.16,1,0.3,1] },
  });

  if (status === "success") {
    return (
      <motion.div ref={ref} initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
        transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
        className="flex flex-col items-center justify-center text-center gap-6 py-20 px-8 bg-white rounded-2xl border border-slate-100"
        style={{ boxShadow:"0 4px 24px rgba(0,0,0,0.05)", minHeight:480 }}>
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-emerald-600"/>
        </div>
        <div>
          <h3 className="text-[22px] font-black text-slate-900 mb-2" style={{ ...M, letterSpacing:"-0.02em" }}>
            Message received.
          </h3>
          <p className="text-[16px] text-slate-500 leading-relaxed max-w-xs" style={M}>
            We'll get back to you within 24 hours. Thank you for reaching out.
          </p>
        </div>
        <button onClick={() => { setForm({ name:"", email:"", phone:"", reason:"", message:"" }); setStatus("idle"); setTouched({}); }}
          className="text-[15px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors" style={M}>
          Send another message →
        </button>
      </motion.div>
    );
  }

  return (
    <form ref={ref} onSubmit={submit} noValidate className="flex flex-col gap-5">
      <motion.div {...fw(0)} className="flex items-center gap-3 mb-2">
        <span className="h-px w-8 bg-[#F5C300]"/>
        <span className="text-[14px] font-black tracking-[0.3em] uppercase text-slate-400" style={M}>Send a Message</span>
      </motion.div>

      <motion.h2 {...fw(0.06)}
        className="text-[2rem] sm:text-[2.4rem] font-black text-slate-900 mb-2"
        style={{ ...M, letterSpacing:"-0.03em" }}>
        How can we<br/><span style={{ color:"#059669" }}>help you?</span>
      </motion.h2>

      {/* Name + Email */}
      <motion.div {...fw(0.12)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-black uppercase tracking-wider text-slate-500" style={M}>Full Name *</label>
          <input value={form.name} onChange={e=>update("name",e.target.value)} onBlur={()=>touch("name")}
            type="text" placeholder="Amina Okafor" autoComplete="name"
            className="px-4 py-3 rounded-xl border text-[16px] font-semibold text-slate-800 placeholder-slate-300 outline-none transition-all duration-200"
            style={{ ...M, borderColor: errors.name ? "#ef4444" : "#e2e8f0",
              boxShadow: errors.name ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
              background:"white" }}
            onFocus={e => { e.target.style.borderColor="#059669"; e.target.style.boxShadow="0 0 0 3px rgba(5,150,105,0.12)"; }}
            onBlur={e  => { touch("name"); e.target.style.borderColor=errors.name?"#ef4444":"#e2e8f0"; e.target.style.boxShadow=errors.name?"0 0 0 3px rgba(239,68,68,0.1)":"none"; }}
          />
          {errors.name && <span className="text-[14px] text-red-500 font-semibold" style={M}>{errors.name}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-black uppercase tracking-wider text-slate-500" style={M}>Email Address *</label>
          <input value={form.email} onChange={e=>update("email",e.target.value)} onBlur={()=>touch("email")}
            type="email" placeholder="amina@example.com" autoComplete="email"
            className="px-4 py-3 rounded-xl border text-[16px] font-semibold text-slate-800 placeholder-slate-300 outline-none transition-all duration-200"
            style={{ ...M, borderColor: errors.email ? "#ef4444" : "#e2e8f0",
              background:"white" }}
            onFocus={e => { e.target.style.borderColor="#059669"; e.target.style.boxShadow="0 0 0 3px rgba(5,150,105,0.12)"; }}
            onBlur={e  => { touch("email"); e.target.style.borderColor=errors.email?"#ef4444":"#e2e8f0"; e.target.style.boxShadow=errors.email?"0 0 0 3px rgba(239,68,68,0.1)":"none"; }}
          />
          {errors.email && <span className="text-[14px] text-red-500 font-semibold" style={M}>{errors.email}</span>}
        </div>
      </motion.div>

      {/* Phone + Reason */}
      <motion.div {...fw(0.18)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-black uppercase tracking-wider text-slate-500" style={M}>Phone (Optional)</label>
          <input value={form.phone} onChange={e=>update("phone",e.target.value)}
            type="tel" placeholder="+234 800 000 0000" autoComplete="tel"
            className="px-4 py-3 rounded-xl border border-slate-200 text-[16px] font-semibold text-slate-800 placeholder-slate-300 outline-none transition-all duration-200"
            style={{ ...M, background:"white" }}
            onFocus={e => { e.target.style.borderColor="#059669"; e.target.style.boxShadow="0 0 0 3px rgba(5,150,105,0.12)"; }}
            onBlur={e  => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-black uppercase tracking-wider text-slate-500" style={M}>Reason for Contact</label>
          <select value={form.reason} onChange={e=>update("reason",e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 text-[16px] font-semibold text-slate-700 outline-none transition-all duration-200 cursor-pointer appearance-none"
            style={{ ...M, background:"white", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center" }}
            onFocus={e => { e.target.style.borderColor="#059669"; e.target.style.boxShadow="0 0 0 3px rgba(5,150,105,0.12)"; }}
            onBlur={e  => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; }}>
            <option value="">Select a reason…</option>
            {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Message */}
      <motion.div {...fw(0.24)} className="flex flex-col gap-1.5">
        <label className="text-[14px] font-black uppercase tracking-wider text-slate-500" style={M}>Your Message *</label>
        <textarea value={form.message} onChange={e=>update("message",e.target.value)} onBlur={()=>touch("message")}
          placeholder="Tell us how we can help…"
          rows={5}
          className="px-4 py-3 rounded-xl border text-[16px] font-semibold text-slate-800 placeholder-slate-300 outline-none transition-all duration-200 resize-none"
          style={{ ...M, borderColor: errors.message ? "#ef4444" : "#e2e8f0",
            boxShadow: errors.message ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
            background:"white" }}
          onFocus={e => { e.target.style.borderColor="#059669"; e.target.style.boxShadow="0 0 0 3px rgba(5,150,105,0.12)"; }}
          onBlur={e  => { touch("message"); e.target.style.borderColor=errors.message?"#ef4444":"#e2e8f0"; e.target.style.boxShadow=errors.message?"0 0 0 3px rgba(239,68,68,0.1)":"none"; }}
        />
        <div className="flex items-center justify-between">
          {errors.message
            ? <span className="text-[14px] text-red-500 font-semibold" style={M}>{errors.message}</span>
            : <span/>}
          <span className="text-[14px] text-slate-400 font-medium" style={M}>{form.message.length} chars</span>
        </div>
      </motion.div>

      {/* Submit */}
      <motion.div {...fw(0.30)}>
        <motion.button type="submit"
          disabled={status==="loading"}
          whileHover={valid && status!=="loading" ? { scale:1.02 } : {}}
          whileTap={valid && status!=="loading" ? { scale:0.98 } : {}}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-[15px] font-black text-[#030712] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ ...M, background:"linear-gradient(135deg,#F5C300,#e8b800)", boxShadow: valid ? "0 8px 28px rgba(245,195,0,0.3)" : "none" }}>
          {status==="loading" ? (
            <>
              <span className="w-4 h-4 border-2 border-[#030712]/30 border-t-[#030712] rounded-full animate-spin"/>
              Sending…
            </>
          ) : (
            <><Send size={13} strokeWidth={2.5}/> Send Message</>
          )}
        </motion.button>
        <p className="text-[14px] text-slate-400 mt-3" style={M}>
          We respond within 24 hours. Your data is never shared.
        </p>
      </motion.div>
    </form>
  );
}

/* ──────────────────────────────────────────────────────
   CONTACT INFO CARDS (right column)
────────────────────────────────────────────────────── */
const INFO_CARDS = [
  {
    icon: Phone, color:"#059669", bg:"#f0fdf4", border:"#bbf7d0",
    label:"Call Us",
    primary:"+234-800-NCC-CARE",
    secondary:"Available Mon–Fri, 8am–6pm WAT",
    href:"tel:+2348001234567",
  },
  {
    icon: Mail, color:"#0284c7", bg:"#eff6ff", border:"#bfdbfe",
    label:"Email Us",
    primary:"info@ngogbeheicc.org",
    secondary:"24-hour response guarantee",
    href:"mailto:info@ngogbeheicc.org",
  },
  {
    icon: MapPin, color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe",
    label:"Visit Us",
    primary:"Plot 123, Wuse 2, Abuja",
    secondary:"FCT, Nigeria",
    href:"https://maps.google.com",
  },
  {
    icon: Clock, color:"#f59e0b", bg:"#fffbeb", border:"#fde68a",
    label:"Hours",
    primary:"Mon – Fri  8:00am – 6:00pm",
    secondary:"Sat  9:00am – 2:00pm (screenings)",
  },
];

function InfoCards() {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true, margin:"-60px" });

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <motion.div initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ duration:0.5 }}
        className="flex items-center gap-3 mb-1">
        <span className="h-px w-8 bg-[#F5C300]"/>
        <span className="text-[14px] font-black tracking-[0.3em] uppercase text-slate-400" style={M}>Get in Touch</span>
      </motion.div>
      <motion.h2 initial={{ opacity:0, y:16 }} animate={iv?{opacity:1,y:0}:{}}
        transition={{ delay:0.07, duration:0.65, ease:[0.16,1,0.3,1] }}
        className="text-[2rem] font-black text-slate-900 mb-4"
        style={{ ...M, letterSpacing:"-0.03em" }}>
        Multiple ways<br/><span style={{ color:"#059669" }}>to reach us.</span>
      </motion.h2>

      {INFO_CARDS.map((card, i) => {
        const Icon = card.icon;
        const Wrap = card.href ? "a" : "div";
        return (
          <motion.div key={i}
            initial={{ opacity:0, x:24 }} animate={iv?{opacity:1,x:0}:{}}
            transition={{ delay:0.14+i*0.09, duration:0.6, ease:[0.16,1,0.3,1] }}>
            <Wrap href={card.href} target={card.href?.startsWith("http") ? "_blank" : undefined}
              rel={card.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 ${card.href ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : "cursor-default"}`}
              style={{ background:"white", borderColor: card.border, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: card.bg, border:`1px solid ${card.border}` }}>
                <Icon size={18} strokeWidth={1.8} style={{ color: card.color }}/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-black uppercase tracking-wider mb-0.5" style={{ ...M, color: card.color }}>{card.label}</p>
                <p className="text-[16px] font-black text-slate-900 leading-snug" style={{ ...M, letterSpacing:"-0.01em" }}>{card.primary}</p>
                <p className="text-[14px] text-slate-400 font-semibold mt-0.5" style={M}>{card.secondary}</p>
              </div>
              {card.href && (
                <ArrowUpRight size={14} className="text-slate-300 flex-shrink-0 mt-1 group-hover:text-slate-500 transition-colors"/>
              )}
            </Wrap>
          </motion.div>
        );
      })}

      {/* Emergency strip */}
      <motion.div initial={{ opacity:0, y:12 }} animate={iv?{opacity:1,y:0}:{}}
        transition={{ delay:0.6, duration:0.6 }}
        className="mt-2 p-5 rounded-2xl border border-red-100"
        style={{ background:"#fff5f5" }}>
        <p className="text-[14px] font-black uppercase tracking-wider text-red-500 mb-1" style={M}>⚠ Medical Emergency</p>
        <p className="text-[15px] text-slate-600 leading-relaxed" style={M}>
          For urgent medical situations, please call <strong className="text-slate-800">112</strong> or go directly to your nearest Emergency Department.
          NCC is not an emergency service.
        </p>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   MAIN CONTACT SECTION  (form + info, white bg)
────────────────────────────────────────────────────── */
/* ──────────────────────────────────────────────────────
   CONTACT PAGE HEADER  (below hero, above form)
────────────────────────────────────────────────────── */
function ContactPageHeader() {
  const ref = useRef(null);
  const iv  = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-14 pb-4">

        {/* Label row */}
        <motion.div
          initial={{ opacity: 0, x: -10 }} animate={iv ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-[#F5C300]"/>
          <span className="text-[14px] font-black tracking-[0.3em] uppercase text-slate-400" style={M}>
            Get In Touch
          </span>
        </motion.div>

        {/* Main heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 22 }} animate={iv ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="font-black text-[#0A2240] leading-[0.95]"
            style={{ ...M, fontSize: "clamp(2.6rem, 5.5vw, 5rem)", letterSpacing: "-0.04em" }}>
            Contact{" "}
            <span style={{ color: "#059669" }}>Us.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={iv ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.16, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-[16px] text-slate-500 leading-relaxed max-w-sm lg:text-right pb-1"
            style={M}>
            Whether you need patient support, want to partner with us,
            or simply have a question — our team responds within 24 hours.
          </motion.p>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }} animate={iv ? { scaleX: 1 } : {}}
          transition={{ delay: 0.28, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 h-px bg-slate-100 origin-left"/>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="w-full bg-white border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 xl:gap-24">
          <ContactForm/>
          <InfoCards/>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   OFFICE LOCATIONS STRIP
────────────────────────────────────────────────────── */
const OFFICES = [
  {
    city:"Abuja",      country:"Nigeria",        flag:"🇳🇬",
    role:"Head Office", color:"#059669",
    address:"Plot 123, Cadastral Zone, Wuse 2, Abuja, FCT",
    phone:"+234-800-NCC-CARE",
    email:"abuja@ngogbeheicc.org",
    hours:"Mon–Fri 8am–6pm",
    img:"https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&q=80",
  },
  {
    city:"Lagos",      country:"Nigeria",        flag:"🇳🇬",
    role:"Operations Hub", color:"#0284c7",
    address:"14 Bode Thomas Street, Surulere, Lagos",
    phone:"+234-800-NCC-LAGOS",
    email:"lagos@ngogbeheicc.org",
    hours:"Mon–Fri 8am–6pm",
    img:"https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&q=80",
  },
  {
    city:"London",     country:"United Kingdom", flag:"🇬🇧",
    role:"UK Registered Office", color:"#7c3aed",
    address:"71-75 Shelton Street, Covent Garden, London, WC2H 9JQ",
    phone:"+44-20-0000-0000",
    email:"uk@ngogbeheicc.org",
    hours:"Mon–Fri 9am–5pm GMT",
    img:"https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
  },
];

function Offices() {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true, margin:"-60px" });

  return (
    <section ref={ref} className="w-full bg-slate-50 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
          <div>
            <motion.div initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ duration:0.5 }}
              className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#F5C300]"/>
              <span className="text-[14px] font-black tracking-[0.3em] uppercase text-slate-400" style={M}>Our Offices</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:16 }} animate={iv?{opacity:1,y:0}:{}}
              transition={{ delay:0.07, duration:0.65, ease:[0.16,1,0.3,1] }}
              className="text-[2rem] sm:text-[2.4rem] font-black text-slate-900"
              style={{ ...M, letterSpacing:"-0.03em" }}>
              Find us in<br/><span style={{ color:"#059669" }}>three locations.</span>
            </motion.h2>
          </div>
          <motion.a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
            initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ delay:0.16 }}
            className="inline-flex items-center gap-1.5 text-[15px] font-bold text-slate-500 hover:text-slate-800 transition-colors group flex-shrink-0" style={M}>
            Open in Maps <MoveRight size={13} className="group-hover:translate-x-1 transition-transform duration-200"/>
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {OFFICES.map((o, i) => (
            <motion.div key={o.city}
              initial={{ opacity:0, y:28 }} animate={iv?{opacity:1,y:0}:{}}
              transition={{ delay:0.14+i*0.1, duration:0.65, ease:[0.16,1,0.3,1] }}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
              style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
              {/* Map/city photo */}
              <div className="relative overflow-hidden" style={{ height:160 }}>
                <img src={o.img} alt={o.city} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"/>
                <div className="absolute inset-0"
                  style={{ background:"linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }}/>
                <span className="absolute top-4 left-4 text-[14px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                  style={{ ...M, background: o.color }}>{o.role}</span>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="text-lg leading-none">{o.flag}</span>
                  <div>
                    <p className="text-[15px] font-black text-white leading-none" style={{ ...M, letterSpacing:"-0.015em" }}>{o.city}</p>
                    <p className="text-[14px] text-white font-bold mt-0.5" style={M}>{o.country}</p>
                  </div>
                </div>
              </div>
              {/* Details */}
              <div className="p-6 space-y-3">
                {[
                  { Icon:MapPin, text:o.address },
                  { Icon:Phone,  text:o.phone, href:`tel:${o.phone.replace(/[^+\d]/g,"")}` },
                  { Icon:Mail,   text:o.email, href:`mailto:${o.email}` },
                  { Icon:Clock,  text:o.hours },
                ].map(({ Icon, text, href }, j) => {
                  const Wrap = href ? "a" : "div";
                  return (
                    <Wrap key={j} href={href}
                      className={`flex items-start gap-2.5 text-[14px] font-semibold text-slate-500 leading-snug ${href ? "hover:text-slate-800 transition-colors" : ""}`}
                      style={M}>
                      <Icon size={13} strokeWidth={1.8} className="flex-shrink-0 mt-0.5" style={{ color:o.color }}/>
                      {text}
                    </Wrap>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   FAQ ACCORDION
────────────────────────────────────────────────────── */
const FAQS = [
  { q:"How do I book a free cancer screening?",     a:"You can book online through our website, call +234-800-NCC-CARE, or visit any of our partner clinics. Screenings are available every Saturday in Abuja and select weekdays in Lagos. No appointment is needed for walk-in Saturdays." },
  { q:"Is NCC a registered nonprofit?",             a:"Yes. The Marcel Ngogbehei Center for Cancer Education & Care is registered with the Charity Commission for England & Wales. We operate under full financial transparency and publish annual impact reports." },
  { q:"How are donations used?",                    a:"100% of donations fund our African programmes — cancer education, free screenings, patient support, and community outreach. Our UK administration costs are covered by separate grants. We publish detailed financial accounts annually." },
  { q:"Can I volunteer with NCC?",                  a:"Absolutely. We welcome healthcare professionals, community mobilisers, fundraisers, and general volunteers. Visit our Volunteer page to see current openings or submit a general expression of interest." },
  { q:"How can my company partner with NCC?",       a:"We offer CSR partnerships, sponsored screening drives, employee volunteering programmes, and co-branded awareness campaigns. Contact our partnerships team at partners@ngogbeheicc.org to discuss options." },
  { q:"Does NCC provide treatment directly?",       a:"NCC is primarily an education and early detection organisation. We do not operate hospitals. However, we navigate patients to partner treatment centres and provide financial support subsidies for those who cannot afford care." },
  { q:"How do I contact you for media enquiries?",  a:"For all press, media, and PR enquiries please email media@ngogbeheicc.org. Our communications team responds within 4 working hours. Interview requests should include your publication, deadline, and topic." },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group focus-visible:outline-none"
        aria-expanded={isOpen}>
        <span className="text-[14.5px] font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors duration-200 flex-1"
          style={{ ...M, letterSpacing:"-0.01em" }}>
          {item.q}
        </span>
        <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration:0.22, ease:[0.16,1,0.3,1] }}
          className="flex-shrink-0 mt-0.5">
          <Plus size={18} strokeWidth={2} className={`transition-colors duration-200 ${isOpen ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`}/>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:0.28, ease:[0.16,1,0.3,1] }}
            className="overflow-hidden">
            <p className="text-[16px] text-slate-500 leading-[1.75] pb-6 pr-8 max-w-2xl" style={M}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  const ref   = useRef(null);
  const iv    = useInView(ref, { once:true, margin:"-60px" });
  const [open, setOpen] = useState(0);

  return (
    <section ref={ref} className="w-full bg-white border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16">
          {/* Left */}
          <div className="lg:sticky lg:top-28 self-start">
            <motion.div initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ duration:0.5 }}
              className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#F5C300]"/>
              <span className="text-[14px] font-black tracking-[0.3em] uppercase text-slate-400" style={M}>FAQ</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:16 }} animate={iv?{opacity:1,y:0}:{}}
              transition={{ delay:0.07, duration:0.65, ease:[0.16,1,0.3,1] }}
              className="text-[2rem] sm:text-[2.4rem] font-black text-slate-900 leading-[1.06]"
              style={{ ...M, letterSpacing:"-0.03em" }}>
              Common<br/>questions<br/>
              <span style={{ color:"#059669" }}>answered.</span>
            </motion.h2>
            <motion.p initial={{ opacity:0, y:10 }} animate={iv?{opacity:1,y:0}:{}}
              transition={{ delay:0.16 }}
              className="text-[15px] text-slate-500 leading-relaxed mt-4 max-w-[220px]" style={M}>
              Can't find what you need?
            </motion.p>
            <motion.a href="mailto:info@ngogbeheicc.org" initial={{ opacity:0 }} animate={iv?{opacity:1}:{}}
              transition={{ delay:0.22 }}
              className="inline-flex items-center gap-1.5 text-[15px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors mt-2 group" style={M}>
              Email us directly <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"/>
            </motion.a>
          </div>

          {/* Right accordion */}
          <motion.div initial={{ opacity:0, y:20 }} animate={iv?{opacity:1,y:0}:{}}
            transition={{ delay:0.12, duration:0.65, ease:[0.16,1,0.3,1] }}
            className="divide-y divide-slate-100 border-t border-slate-100">
            {FAQS.map((item, i) => (
              <FAQItem key={i} item={item}
                isOpen={open===i} onToggle={()=>setOpen(open===i?null:i)}/>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   CTA BANNER  (dark)
────────────────────────────────────────────────────── */
function CTABanner() {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true, margin:"-60px" });

  return (
    <section ref={ref} className="relative w-full overflow-hidden border-t border-slate-900"
      style={{ background:"radial-gradient(125% 125% at 50% 10%, #030712 40%, #011e10 100%)" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 w-full h-full opacity-[0.055]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-g2" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0L0 0 0 44" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-g2)"/>
        </svg>
        {/* Gold scanning beam */}
        <motion.div className="absolute inset-y-0 w-px"
          style={{ background:"linear-gradient(to bottom,transparent,rgba(245,195,0,0.12) 40%,rgba(245,195,0,0.2) 50%,rgba(245,195,0,0.12) 60%,transparent)" }}
          animate={{ left:["0%","100%","0%"] }}
          transition={{ repeat:Infinity, duration:28, ease:"linear" }}/>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity:0 }} animate={iv?{opacity:1}:{}} transition={{ duration:0.5 }}
              className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#F5C300]"/>
              <span className="text-[14px] font-bold tracking-[0.3em] uppercase text-[#F5C300]/65" style={M}>Still Have Questions?</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:22 }} animate={iv?{opacity:1,y:0}:{}}
              transition={{ delay:0.08, duration:0.72, ease:[0.16,1,0.3,1] }}
              className="font-black text-white leading-[0.95] mb-5"
              style={{ ...M, fontSize:"clamp(2.2rem,5vw,4.5rem)", letterSpacing:"-0.04em" }}>
              Our team is<br/>ready to help<br/>
              <span style={{ color:"#F5C300" }}>right now.</span>
            </motion.h2>
            <motion.p initial={{ opacity:0, y:10 }} animate={iv?{opacity:1,y:0}:{}}
              transition={{ delay:0.17 }}
              className="text-[16px] text-white leading-relaxed max-w-md" style={M}>
              Whether it's booking a screening, understanding your diagnosis, or finding out how to get involved — we're one message away.
            </motion.p>
          </div>

          <motion.div initial={{ opacity:0, x:20 }} animate={iv?{opacity:1,x:0}:{}}
            transition={{ delay:0.24, duration:0.65, ease:[0.16,1,0.3,1] }}
            className="grid grid-cols-2 gap-4">
            {[
              { icon:MessageSquare, label:"Live Chat",     sub:"Chat with us now",        color:"#F5C300", bg:"rgba(245,195,0,0.1)", href:"#" },
              { icon:Phone,         label:"Call Us",       sub:"+234-800-NCC-CARE",       color:"#10b981", bg:"rgba(16,185,129,0.1)", href:"tel:+2348001234567" },
              { icon:Mail,          label:"Email Us",      sub:"info@ngogbeheicc.org",    color:"#60a5fa", bg:"rgba(96,165,250,0.1)", href:"mailto:info@ngogbeheicc.org" },
              { icon:Calendar,      label:"Book Screening",sub:"Free, no appointment",   color:"#f59e0b", bg:"rgba(245,158,11,0.1)", href:"/services/screening" },
            ].map(({ icon:Icon, label, sub, color, bg, href }, i) => (
              <motion.a key={i} href={href}
                initial={{ opacity:0, scale:0.92 }} animate={iv?{opacity:1,scale:1}:{}}
                transition={{ delay:0.3+i*0.07, duration:0.5 }}
                whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
                className="flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-200 cursor-pointer"
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${color}40`; e.currentTarget.style.background=bg;}}
                onMouseLeave={e=>{e.currentTarget.style.border="1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)";}}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:`${color}18`, border:`1px solid ${color}28` }}>
                  <Icon size={16} strokeWidth={1.8} style={{ color }}/>
                </div>
                <div>
                  <p className="text-[15px] font-black text-white leading-none mb-0.5" style={M}>{label}</p>
                  <p className="text-[14px] text-white font-semibold" style={M}>{sub}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   PAGE ASSEMBLY
────────────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <main className="w-full">
      <ContactHero/>
      <ContactPageHeader/>
      <ContactSection/>
      <Offices/>
      <FAQ/>
      <CTABanner/>
    </main>
  );
}