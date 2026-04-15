"use client";

/**
 * @file Footer.jsx
 * @project Ngogbehei Cancer Center — Digital Platform
 * @description World-class Footer. Dark theme matching PartnersSection spiral bg.
 *              Premium editorial layout with animated spiral, newsletter, social
 *              icons, contact info, multi-column links, and legal bottom bar.
 * @dependencies framer-motion, lucide-react, react-icons
 */

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Heart, Send, ArrowUpRight, ChevronRight } from "lucide-react";
import { FaFacebook, FaXTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";

const M = { fontFamily: "'Montserrat', sans-serif" };

/* ──────────────────────────────────────────────
   SPIRAL BACKGROUND
────────────────────────────────────────────── */
function FooterSpiral() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const SIZE = 700, N = 700, DOT = 1.3, C = SIZE / 2, R = C - 10;
    const GA = Math.PI * (3 - Math.sqrt(5));
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", String(SIZE));
    svg.setAttribute("height", String(SIZE));
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
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
      aR.setAttribute("values", `${DOT * 0.4};${DOT * 1.5};${DOT * 0.4}`);
      aR.setAttribute("dur", "3.8s");
      aR.setAttribute("begin", `${(f * 3.8).toFixed(3)}s`);
      aR.setAttribute("repeatCount", "indefinite");
      c.appendChild(aR);
      const aO = document.createElementNS(ns, "animate");
      aO.setAttribute("attributeName", "opacity");
      aO.setAttribute("values", "0.08;0.7;0.08");
      aO.setAttribute("dur", "3.8s");
      aO.setAttribute("begin", `${(f * 3.8).toFixed(3)}s`);
      aO.setAttribute("repeatCount", "indefinite");
      c.appendChild(aO);
      svg.appendChild(c);
    }
    ref.current.innerHTML = "";
    ref.current.appendChild(svg);
  }, []);
  return (
    <div ref={ref}
      className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center"
      style={{
        opacity: 0.15,
        mixBlendMode: "screen",
        maskImage: "radial-gradient(ellipse 60% 70% at 85% 40%, white 0%, rgba(255,255,255,0.3) 50%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 85% 40%, white 0%, rgba(255,255,255,0.3) 50%, transparent 75%)",
      }}
    />
  );
}

/* ──────────────────────────────────────────────
   GRID LINES
────────────────────────────────────────────── */
function FooterGrid() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.055]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="fg-sm" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0L0 0 0 44" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <pattern id="fg-lg" width="220" height="220" patternUnits="userSpaceOnUse">
            <path d="M220 0L0 0 0 220" fill="none" stroke="white" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fg-sm)"/>
        <rect width="100%" height="100%" fill="url(#fg-lg)"/>
      </svg>
      {/* scanning beam */}
      <motion.div className="absolute inset-y-0 w-px"
        style={{ background: "linear-gradient(to bottom,transparent,rgba(16,185,129,0.18) 40%,rgba(16,185,129,0.28) 50%,rgba(16,185,129,0.18) 60%,transparent)" }}
        animate={{ left: ["0%","100%","0%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}/>
      {/* corner brackets */}
      {[["top-5 left-5","M0,18 L0,0 L18,0"],["top-5 right-5","M0,18 L0,0 L18,0"],
        ["bottom-5 left-5","M0,-18 L0,0 L18,0"],["bottom-5 right-5","M0,-18 L0,0 L18,0"]
      ].map(([pos,d],i)=>(
        <svg key={i} className={`absolute ${pos} w-7 h-7`} viewBox="-4 -4 26 26" fill="none">
          <path d={d} stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="0" cy="0" r="1.8" fill="rgba(16,185,129,0.35)"/>
        </svg>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   DATA
────────────────────────────────────────────── */
const NAV_COLS = [
  {
    title: "About",
    links: [
      { name: "Mission & Vision",    href: "/about/mission"         },
      { name: "Leadership",          href: "/about/leadership"      },
      { name: "Our History",         href: "/about/history"         },
      { name: "Accreditations",      href: "/about/accreditations"  },
      { name: "Annual Reports",      href: "/about/reports"         },
      { name: "Policies",            href: "/about/policies"        },
    ],
  },

  {
    title: "Quick Links",
    links: [
      { name: "Home",                href: "/"                      },
      { name: "About NCC",           href: "/about"                 },
      { name: "Our Impact",          href: "/impact"                },
      { name: "Partners",            href: "/about/partners"        },
      { name: "Contact Us",          href: "/contact"               },
      { name: "Impact Reports",      href: "/impact/reports"        },
    ],
  },
];

const SOCIALS = [
  { Icon: FaFacebook,  href: "https://facebook.com/NgogbeheiCC",                     label: "Facebook"  },
  { Icon: FaXTwitter,  href: "https://twitter.com/NgogbeheiCC",                      label: "X/Twitter" },
  { Icon: FaInstagram, href: "https://instagram.com/NgogbeheiCC",                    label: "Instagram" },
  { Icon: FaLinkedin,  href: "https://linkedin.com/company/ngogbehei-cancer-center",  label: "LinkedIn"  },
  { Icon: FaYoutube,   href: "https://youtube.com/@NgogbeheiCC",                     label: "YouTube"   },
];

const LEGAL = [
  { name: "Terms of Use",    href: "/legal/terms"        },
  { name: "Privacy Policy",  href: "/legal/privacy"      },
  { name: "Accessibility",   href: "/legal/accessibility" },
  { name: "Transparency",    href: "/legal/transparency"  },
];

/* ──────────────────────────────────────────────
   LOGO
────────────────────────────────────────────── */
function Logo() {
  return (
    <Link href="/" aria-label="Ngogbehei Cancer Center — Home" className="inline-flex items-center gap-3 group w-fit">
      <div className="relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border border-[#F5C300]/40 group-hover:border-[#F5C300] transition-all duration-300"
        style={{ background:"rgba(245,195,0,0.08)" }}>
        <svg viewBox="0 0 36 36" fill="none" className="w-[22px] h-[22px]">
          <circle cx="18" cy="18" r="13" stroke="#F5C300" strokeWidth="1.4" fill="none"/>
          <ellipse cx="18" cy="18" rx="6" ry="13" stroke="#F5C300" strokeWidth="1.1" fill="none"/>
          <line x1="5" y1="18" x2="31" y2="18" stroke="#F5C300" strokeWidth="1.1"/>
          <path d="M7 12 Q18 9 29 12" stroke="#F5C300" strokeWidth="0.9" fill="none"/>
          <path d="M7 24 Q18 27 29 24" stroke="#F5C300" strokeWidth="0.9" fill="none"/>
          <path d="M18 13 C18 13 14 16.5 14 19.5 C14 21.4 15.8 23 18 23 C20.2 23 22 21.4 22 19.5 C22 16.5 18 13 18 13Z"
            fill="#F5C300" opacity="0.35"/>
          <path d="M18 15.5 L18 21.5 M16 17.5 L18 15.5 L20 17.5"
            stroke="#030712" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex flex-col leading-[1.25]">
        <span className="text-[16px] font-black text-white tracking-wide uppercase" style={M}>Ngogbehei</span>
        <span className="text-[14px] font-bold text-[#F5C300]/80 tracking-[0.2em] uppercase" style={M}>Cancer Center</span>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────
   NEWSLETTER
────────────────────────────────────────────── */
function Newsletter() {
  const [email, setEmail]     = useState("");
  const [status, setStatus]   = useState("idle");
  const [msg, setMsg]         = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error"); setMsg("Please enter a valid email."); return;
    }
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1100));
    setStatus("success"); setMsg("You're subscribed. Thank you!"); setEmail("");
  };

  return (
    <div>
      <p className="text-[14px] font-bold tracking-[0.28em] uppercase text-emerald-400 mb-2" style={M}>Newsletter</p>
      <p className="text-[15px] text-white leading-relaxed mb-4" style={M}>
        Stay updated on breakthroughs, events, and impact stories from NCC.
      </p>
      <form onSubmit={submit} noValidate className="flex items-stretch">
        <input
          type="email" value={email}
          onChange={e => { setEmail(e.target.value); setStatus("idle"); setMsg(""); }}
          placeholder="your@email.com"
          disabled={status === "loading" || status === "success"}
          className="flex-1 min-w-0 text-[14px] font-semibold text-white placeholder-white/25 px-4 py-3 rounded-l-xl outline-none transition-all duration-200 disabled:opacity-50"
          style={{ ...M, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRight:"none" }}
          onFocus={e => e.target.style.borderColor="rgba(16,185,129,0.5)"}
          onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"}
        />
        <button type="submit"
          disabled={status === "loading" || status === "success"}
          className="flex items-center gap-1.5 px-4 py-3 rounded-r-xl text-[14px] font-black uppercase tracking-wider transition-all duration-200 disabled:opacity-50 flex-shrink-0"
          style={{ ...M, background:"linear-gradient(135deg,#047857,#059669)", color:"white", border:"1px solid rgba(16,185,129,0.4)" }}>
          {status === "loading"
            ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
            : <><Send size={11} strokeWidth={2.5}/> Subscribe</>
          }
        </button>
      </form>
      {msg && (
        <motion.p initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
          className={`mt-2 text-[14px] font-bold ${status==="success"?"text-emerald-400":"text-red-400"}`} style={M}>
          {msg}
        </motion.p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   MAIN FOOTER
────────────────────────────────────────────── */
export default function Footer() {
  const ref  = useRef(null);
  const iv   = useInView(ref, { once: true, margin: "-60px" });
  const year = new Date().getFullYear();

  const fw = (d = 0) => ({
    initial:  { opacity: 0, y: 22 },
    animate:  iv ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <footer ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: "radial-gradient(125% 125% at 50% 10%, #030712 40%, #011e10 100%)" }}
      aria-label="Site footer" role="contentinfo">

      <FooterSpiral/>
      <FooterGrid/>

      {/* ══════════════════════════════════════════
          TOP CTA BAND
      ══════════════════════════════════════════ */}
      <motion.div {...fw(0)}
        className="relative z-10 border-b border-white/[0.07]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-px h-10 bg-emerald-500/60"/>
            <div>
              <p className="text-[14px] font-bold tracking-[0.28em] uppercase text-emerald-400 mb-0.5" style={M}>Act Now</p>
              <p className="text-xl font-black text-white" style={{ ...M, letterSpacing:"-0.02em" }}>
                Help us reach the next 10,000 lives.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <motion.a href="/donate"
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black text-emerald-900 bg-white"
              style={{ ...M, boxShadow:"0 8px 28px rgba(255,255,255,0.1)" }}>
              Donate Now
            </motion.a>
            <a href="/partners/apply"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white hover:text-white border border-white/15 hover:border-white/35 transition-all duration-200"
              style={M}>
              Partner <ArrowUpRight size={13}/>
            </a>
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          MAIN GRID
      ══════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:pl-16 lg:pr-[30px] xl:pl-20 xl:pr-[30px] py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1.3fr_1.5fr_1.3fr_1.5fr] gap-8 xl:gap-10">

          {/* ── Col 1: Brand + mission + contact ── */}
          <motion.div {...fw(0.06)}>
            <Logo/>
            <p className="mt-6 text-[15px] text-white leading-[1.8] max-w-xs" style={M}>
              The Ngogbehei Cancer Center is a UK-registered nonprofit bridging
              the deadly gap between cancer awareness and access to care across
              Nigeria and Africa.
            </p>

            {/* Contact details */}
            <div className="mt-8 space-y-3">
              {[
                { Icon:Phone, text:"+234-800-NCC-CARE", href:"tel:+2348001234567" },
                { Icon:Mail,  text:"info@ngogbeheicc.org", href:"mailto:info@ngogbeheicc.org" },
                { Icon:MapPin,text:"Wuse 2, Abuja, FCT, Nigeria", href:null },
              ].map(({ Icon, text, href }, i) => {
                const Wrap = href ? "a" : "span";
                return (
                  <Wrap key={i} href={href||undefined}
                    className="flex items-start gap-3 text-[14px] text-white hover:text-white transition-colors duration-200 group"
                    style={M}>
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background:"rgba(245,195,0,0.1)", border:"1px solid rgba(245,195,0,0.15)" }}>
                      <Icon size={12} strokeWidth={2} style={{ color:"#F5C300" }}/>
                    </span>
                    {text}
                  </Wrap>
                );
              })}
            </div>

            {/* Social icons */}
            <div className="mt-8 flex items-center gap-2" role="list">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label} role="listitem"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:text-white transition-all duration-200"
                  style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => { e.currentTarget.style.border="1px solid rgba(16,185,129,0.5)"; e.currentTarget.style.background="rgba(16,185,129,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.border="1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}>
                  <Icon size={14}/>
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Cols 2–4: Nav link columns ── */}
          {NAV_COLS.map((col, ci) => (
            <motion.div key={col.title} {...fw(0.12 + ci * 0.07)}>
              <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                <span className="w-1 h-4 rounded-full bg-emerald-500 flex-shrink-0"/>
                <h3 className="text-[14px] font-black tracking-[0.22em] uppercase text-white" style={M}>
                  {col.title}
                </h3>
              </div>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.name}>
                    <Link href={link.href}
                      className="group inline-flex items-center gap-1.5 text-[15px] text-white hover:text-white transition-all duration-200"
                      style={M}>
                      <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-emerald-500 -ml-2 group-hover:ml-0 flex-shrink-0"/>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* ── Col 5: Newsletter + UK registration ── */}
          <motion.div {...fw(0.33)}
            className="lg:pl-6 lg:border-l"
            style={{ borderColor:"rgba(255,255,255,0.07)" }}>
            <Newsletter/>

            {/* UK registration badge */}
            <motion.div {...fw(0.42)}
              className="mt-8 rounded-2xl p-5"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)" }}>
                  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                    <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
                      fill="#10b981" fillOpacity="0.7" stroke="#10b981" strokeWidth="0.8"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-black text-white leading-snug mb-1" style={M}>UK-Registered Nonprofit</p>
                  <p className="text-[14px] text-white leading-relaxed" style={M}>
                    Registered with the Charity Commission for England & Wales.
                    100% of donations fund our African programmes.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ══════════════════════════════════════════
          DIVIDER
      ══════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <motion.div initial={{ scaleX:0 }} animate={iv?{scaleX:1}:{}}
          transition={{ delay:0.5, duration:1.4, ease:[0.16,1,0.3,1] }}
          className="h-px origin-left"
          style={{ background:"linear-gradient(to right,transparent,rgba(16,185,129,0.35) 25%,rgba(110,231,183,0.5) 50%,rgba(16,185,129,0.35) 75%,transparent)" }}/>
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM BAR
      ══════════════════════════════════════════ */}
      <motion.div {...fw(0.45)} className="relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          {/* Copyright */}
          <div className="flex items-center gap-4">
            <p className="text-[14px] text-white font-medium" style={M}>
              © {year} The Marcel Ngogbehei Center for Cancer Education & Care.
            </p>
           
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL.map((l, i) => (
              <Link key={i} href={l.href}
                className="text-[14px] font-semibold text-white hover:text-white transition-colors duration-200"
                style={M}>
                {l.name}
              </Link>
            ))}
          </div>

        </div>
      </motion.div>

    </footer>
  );
}