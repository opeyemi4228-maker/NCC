"use client";

/**
 * @file Navbar.jsx
 * @project Ngogbehei Cancer Center
 * @description Production-ready sticky navbar.
 *   ✓ Yellow top banner — typewriter intro → auto-carousel (10s)
 *   ✓ Scroll-aware: transparent on hero → solid white instantly on scroll
 *   ✓ Full-width mega menus — flush below header, correct z-index
 *   ✓ Logo + nav text adapts light/dark with scroll state
 *   ✓ Mobile slide-in drawer — dark theme, accordion nav
 *   ✓ Search overlay with quick chips
 *   ✓ Keyboard navigation (Escape closes menus/drawer/search)
 *   ✓ Body scroll lock when mobile drawer open
 *   ✓ Banner height tracked so mega menu top is always pixel-perfect
 *   ✓ Hover intent timer prevents accidental menu flicker
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  ChevronDown, ChevronRight, X, Menu, Heart,
  ArrowRight, Users, Microscope, BarChart3, HandHeart,
  BookOpen, Phone, Mail, Globe2, Shield, Award,
  Stethoscope, Activity, UserCheck, Calendar, FileText,
  Megaphone, Handshake, Landmark, Newspaper, Plus,
} from "lucide-react";

/* ─── constants ──────────────────────────────────────────── */
const BANNER_H = 38;   // px — must match TopBanner height
const HEADER_H = 64;   // px — must match nav height

const M = { fontFamily: "'Montserrat', sans-serif" };

/* ─── banner messages ────────────────────────────────────── */
const BANNER_MSGS = [
  "Free cancer screening every Saturday in Abuja — No appointment needed.",
  "Our palliative care team is available 24 / 7. Call +234-800-NCC-CARE.",
  "New: Breast cancer awareness workshop — Register at ngogbeheicc.org.",
  "All donations matched up to ₦5 M through December 2025. Give today.",
  "Early detection saves lives. Book your screening appointment now.",
];

/* ─── nav data ───────────────────────────────────────────── */
const NAV = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
    columns: [
      {
        heading: "Who We Are",
        links: [
          { label: "Mission & Vision",   href: "/about/mission",        icon: Shield,       desc: "Our purpose and commitment"    },
          { label: "Leadership",          href: "/about/leadership",     icon: Users,        desc: "Board and clinical leadership" },
          { label: "Our History",         href: "/about/history",        icon: Landmark,     desc: "Decades of care in Nigeria"    },
          { label: "Accreditations",      href: "/about/accreditations", icon: Award,        desc: "Global certifications"         },
        ],
      },
      {
        heading: "Governance",
        links: [
          { label: "Annual Reports",      href: "/about/reports",        icon: FileText,     desc: "Transparency & accountability" },
          { label: "Policies",            href: "/about/policies",       icon: BookOpen,     desc: "Ethics, safety & compliance"   },
          { label: "Partners",            href: "/about/partners",       icon: Handshake,    desc: "Strategic global alliances"    },
        ],
      },
    ],
    featured: {
      tag: "Our Story",       tagColor: "#059669",
      title: "Born from loss. Built for survival.",
      desc:  "How one man's grief became Africa's most urgent cancer movement.",
      href:  "/about",        cta: "Read our story",
      img:   "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&q=80",
    },
  },
  {
    label: "Impact",
    href: "/impact",
  },
  {
    label: "Get Involved",
    href: "/get-involved",
    columns: [
      {
        heading: "Support Us",
        links: [
          { label: "Donate",              href: "/donate",                icon: Heart,        desc: "Fund life-saving care"        },
          { label: "Volunteer",           href: "/get-involved/volunteer",icon: UserCheck,    desc: "Give your time & skills"      },
          { label: "Corporate Partners",  href: "/get-involved/partners", icon: Handshake,    desc: "Strategic giving programs"    },
        ],
      },
      {
        heading: "Participate",
        links: [
          { label: "Events & Walks",      href: "/get-involved/events",   icon: Calendar,     desc: "Fundraising events"           },
          { label: "Awareness Campaigns", href: "/get-involved/campaigns",icon: Megaphone,    desc: "Spread the message"           },
          { label: "Legacy Giving",       href: "/get-involved/legacy",   icon: Award,        desc: "Long-term impact"             },
        ],
      },
    ],
    featured: {
      tag: "Urgent",          tagColor: "#dc2626",
      title: "Double Your Impact",
      desc:  "All donations matched up to ₦5 M through December 2025.",
      href:  "/donate",       cta: "Donate today",
      img:   "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80",
    },
  },
  { label: "Contact", href: "/contact", columns: [] },
];

/* ─── framer variants ────────────────────────────────────── */
const megaV = {
  hidden:  { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.2,  ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.14, ease: "easeIn" } },
};

const drawerV = {
  hidden:  { x: "100%" },
  visible: { x: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
  exit:    { x: "100%", transition: { duration: 0.22, ease: "easeIn" } },
};

/* ═══════════════════════════════════════════════
   TOP BANNER  (typewriter → carousel)
═══════════════════════════════════════════════ */
function TopBanner({ visible, onDismiss }) {
  const [phase,    setPhase]   = useState("typing");
  const [text,     setText]    = useState("");
  const [msgIdx,   setMsgIdx]  = useState(0);
  const [slideKey, setSlideKey]= useState(0);
  const charRef  = useRef(0);
  const timerRef = useRef(null);

  /* typewriter for first message */
  useEffect(() => {
    if (phase !== "typing" && phase !== "deleting") return;
    const FIRST = BANNER_MSGS[0];
    clearTimeout(timerRef.current);

    if (phase === "typing") {
      const tick = () => {
        if (charRef.current <= FIRST.length) {
          setText(FIRST.slice(0, charRef.current++));
          timerRef.current = setTimeout(tick, charRef.current <= 1 ? 600 : 30);
        } else {
          timerRef.current = setTimeout(() => setPhase("deleting"), 2600);
        }
      };
      timerRef.current = setTimeout(tick, 700);
    } else {
      const del = () => {
        if (charRef.current > 0) {
          setText(FIRST.slice(0, --charRef.current));
          timerRef.current = setTimeout(del, 10);
        } else {
          setPhase("carousel");
        }
      };
      timerRef.current = setTimeout(del, 80);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase]);

  /* carousel after typewriter */
  useEffect(() => {
    if (phase !== "carousel") return;
    setMsgIdx(1); setSlideKey(k => k + 1);
    const id = setInterval(() => {
      setMsgIdx(i => { const n = (i + 1) % BANNER_MSGS.length; setSlideKey(k => k + 1); return n; });
    }, 9500);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <motion.div
      initial={false}
      animate={visible
        ? { height: BANNER_H, opacity: 1, transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] } }
        : { height: 0,        opacity: 0, transition: { duration: 0.2,  ease: "easeIn" } }}
      className="w-full overflow-hidden select-none"
      style={{ background: "linear-gradient(135deg,#F5C300 0%,#e8b800 100%)" }}
      role="banner"
      aria-label="Site announcement">
      <div className="relative flex items-center justify-center h-[38px] px-12">
        <div className="overflow-hidden flex items-center max-w-[86%]">
          {phase !== "carousel" ? (
            <p className="text-[14px] font-black text-[#1a1200] whitespace-nowrap tracking-wide leading-none" style={M}>
              {text}
              <span className="inline-block w-[1.5px] h-[0.85em] bg-[#1a1200] ml-[2px] align-middle"
                style={{ animation: "ncc-blink 0.65s step-end infinite" }}/>
            </p>
          ) : (
            <div className="overflow-hidden" style={{ height: "1.25em" }}>
              <AnimatePresence mode="wait">
                <motion.p key={slideKey}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{   y: "-110%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
                  className="text-[14px] font-black text-[#1a1200] whitespace-nowrap tracking-wide leading-[1.25em]"
                  style={M}>
                  {BANNER_MSGS[msgIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          )}
        </div>
        <button onClick={onDismiss} aria-label="Dismiss announcement"
          className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/10 transition-colors">
          <X size={12} strokeWidth={2.5} className="text-[#1a1200]/55"/>
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   LOGO
═══════════════════════════════════════════════ */
function Logo({ scrolled }) {
  return (
    <Link href="/" aria-label="Ngogbehei Cancer Center — Home"
      className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg">
      <div className="relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
        style={{
          background: scrolled ? "#F5C300" : "rgba(245,195,0,0.12)",
          border:     scrolled ? "2px solid #F5C300" : "1.5px solid rgba(245,195,0,0.38)",
        }}>
        <svg viewBox="0 0 36 36" fill="none" className="w-[20px] h-[20px]">
          <circle cx="18" cy="18" r="13"
            stroke={scrolled ? "#0A2240" : "#F5C300"} strokeWidth="1.4" fill="none"/>
          <ellipse cx="18" cy="18" rx="6" ry="13"
            stroke={scrolled ? "#0A2240" : "#F5C300"} strokeWidth="1.1" fill="none"/>
          <line x1="5" y1="18" x2="31" y2="18"
            stroke={scrolled ? "#0A2240" : "#F5C300"} strokeWidth="1.1"/>
          <path d="M7 12 Q18 9 29 12" stroke={scrolled ? "#0A2240" : "#F5C300"} strokeWidth="0.9" fill="none"/>
          <path d="M7 24 Q18 27 29 24" stroke={scrolled ? "#0A2240" : "#F5C300"} strokeWidth="0.9" fill="none"/>
          <path d="M18 13 C18 13 14 16.5 14 19.5 C14 21.4 15.8 23 18 23 C20.2 23 22 21.4 22 19.5 C22 16.5 18 13 18 13Z"
            fill={scrolled ? "#0A2240" : "#F5C300"} opacity="0.28"/>
          <path d="M18 15.5 L18 21.5 M16 17.5 L18 15.5 L20 17.5"
            stroke={scrolled ? "#0A2240" : "white"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex flex-col leading-[1.2]">
        <span className="text-[15px] font-black tracking-[0.05em] uppercase transition-colors duration-300"
          style={{ ...M, color: scrolled ? "#0A2240" : "white" }}>Ngogbehei</span>
        <span className="text-[14px] font-bold tracking-[0.18em] uppercase transition-colors duration-300"
          style={{ ...M, color: scrolled ? "#8a6e00" : "rgba(245,195,0,0.72)" }}>Cancer Center</span>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════
   MEGA MENU  (full-width, position:fixed)
═══════════════════════════════════════════════ */
function MegaMenu({ item, navbarBottom, onLinkClick }) {
  if (!item.columns?.length) return null;

  return (
    <motion.div
      variants={megaV} initial="hidden" animate="visible" exit="exit"
      className="fixed left-0 right-0 z-[9994]"
      style={{ top: navbarBottom }}
      role="dialog" aria-label={`${item.label} menu`}>

      {/* Gold accent rule */}
      <div className="h-[3px]"
        style={{ background: "linear-gradient(to right, transparent, #F5C300 20%, #e8b800 50%, #F5C300 80%, transparent)" }}/>

      <div className="bg-white border-b border-slate-100"
        style={{ boxShadow: "0 20px 56px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05)" }}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-8">
          <div className="grid grid-cols-[1fr_1fr_300px] gap-10">

            {/* Two link columns */}
            <div className="col-span-2 grid grid-cols-2 gap-8">
              {item.columns.map((col, ci) => (
                <div key={ci}>
                  {/* Column heading */}
                  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                    <span className="w-[3px] h-4 rounded-full bg-[#F5C300] flex-shrink-0"/>
                    <p className="text-[14px] font-black tracking-[0.2em] uppercase text-slate-400" style={M}>
                      {col.heading}
                    </p>
                  </div>
                  {/* Links */}
                  <ul className="space-y-0.5" role="list">
                    {col.links.map((link, li) => {
                      const Icon = link.icon;
                      return (
                        <motion.li key={li} role="listitem"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0, transition: { delay: li * 0.03 + ci * 0.06, duration: 0.18 } }}>
                          <Link href={link.href} onClick={onLinkClick}
                            className="group flex items-start gap-3 py-2.5 px-3 rounded-xl transition-all duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:bg-slate-50">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                              style={{ background: "rgba(245,195,0,0.1)", border: "1px solid rgba(245,195,0,0.22)" }}>
                              <Icon size={13} strokeWidth={1.8} style={{ color: "#8a6e00" }}/>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[15px] font-bold text-slate-800 group-hover:text-[#0A2240] transition-colors leading-tight" style={M}>
                                {link.label}
                              </p>
                              <p className="text-[11.5px] text-slate-400 mt-0.5 leading-snug truncate" style={M}>
                                {link.desc}
                              </p>
                            </div>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Featured card */}
            {item.featured && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.08, duration: 0.28 } }}
                className="relative overflow-hidden rounded-2xl flex flex-col border border-slate-100"
                style={{ background: "#f8fafc" }}>
                {/* Photo */}
                <div className="relative overflow-hidden flex-shrink-0" style={{ height: 150 }}>
                  <img src={item.featured.img} alt={item.featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                    loading="lazy"/>
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }}/>
                  <span className="absolute top-3 left-3 text-[14px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                    style={{ ...M, background: item.featured.tagColor }}>
                    {item.featured.tag}
                  </span>
                </div>
                {/* Text */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-black text-slate-900 leading-snug mb-1.5"
                      style={{ ...M, letterSpacing: "-0.01em" }}>
                      {item.featured.title}
                    </p>
                    <p className="text-[14px] text-slate-500 leading-relaxed" style={M}>
                      {item.featured.desc}
                    </p>
                  </div>
                  <Link href={item.featured.href} onClick={onLinkClick}
                    className="inline-flex items-center gap-1.5 text-[14px] font-black transition-colors group w-fit focus-visible:outline-none focus-visible:underline"
                    style={{ ...M, color: item.featured.tagColor }}>
                    {item.featured.cta}
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200"/>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MOBILE DRAWER
═══════════════════════════════════════════════ */
function MobileDrawer({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  const pathname = usePathname();

  /* body scroll lock */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  /* escape key */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* close on route change */
  useEffect(() => { onClose(); }, [pathname]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div key="mob-bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9997]"
            style={{ background: "rgba(3,7,18,0.62)", backdropFilter: "blur(3px)" }}
            onClick={onClose}
            aria-hidden="true"/>

          {/* Drawer panel */}
          <motion.div key="mob-panel"
            variants={drawerV} initial="hidden" animate="visible" exit="exit"
            className="fixed top-0 right-0 h-full w-[300px] z-[9998] flex flex-col overflow-hidden"
            style={{ background: "radial-gradient(130% 130% at 110% 0%, #030712 42%, #011e10 100%)" }}
            role="dialog" aria-label="Navigation menu" aria-modal="true">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F5C300] flex-shrink-0">
                  <svg viewBox="0 0 22 22" fill="none" className="w-[17px] h-[17px]">
                    <circle cx="11" cy="11" r="9" fill="#0A2240"/>
                    <path d="M11 7.5V15M8.5 10.5L11 7.5L13.5 10.5"
                      stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex flex-col leading-[1.2]">
                  <span className="text-[14px] font-black text-white tracking-[0.05em] uppercase" style={M}>Ngogbehei</span>
                  <span className="text-[8px] font-bold text-[#F5C300]/65 tracking-[0.16em] uppercase" style={M}>Cancer Center</span>
                </div>
              </div>
              <button onClick={onClose} aria-label="Close menu"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all duration-200">
                <X size={16}/>
              </button>
            </div>

            {/* Nav accordion */}
            <nav className="flex-1 overflow-y-auto py-1" aria-label="Mobile navigation">
              {NAV.map((item, i) => {
                const isExpanded = expanded === i;
                const hasCols    = item.columns?.length > 0;
                const allLinks   = item.columns?.flatMap(c => c.links) ?? [];

                return (
                  <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {hasCols ? (
                      <button
                        onClick={() => setExpanded(isExpanded ? null : i)}
                        aria-expanded={isExpanded}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.035] transition-colors duration-150">
                        <span className="text-[16px] font-bold text-white" style={M}>{item.label}</span>
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.18 }}>
                          <ChevronDown size={13} className="text-white"/>
                        </motion.span>
                      </button>
                    ) : (
                      <Link href={item.href} onClick={onClose}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.035] transition-colors duration-150">
                        <span className="text-[16px] font-bold text-white" style={M}>{item.label}</span>
                        <ChevronRight size={12} className="text-white"/>
                      </Link>
                    )}

                    <AnimatePresence>
                      {isExpanded && hasCols && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{   height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          className="overflow-hidden">
                          <div className="px-4 pb-2 pt-1" style={{ background: "rgba(255,255,255,0.02)" }}>
                            {allLinks.map((link, li) => (
                              <Link key={li} href={link.href} onClick={onClose}
                                className="flex items-center gap-2.5 py-2.5 px-2 text-[15px] text-white hover:text-white transition-colors"
                                style={M}>
                                <ChevronRight size={9} className="text-emerald-500 flex-shrink-0"/>
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* CTA buttons */}
            <div className="p-4 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <Link href="/donate" onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[15px] font-black text-[#1a1200] uppercase tracking-wider transition-all duration-200 active:scale-95"
                style={{ ...M, background: "linear-gradient(135deg,#F5C300,#e8b800)", boxShadow: "0 4px 16px rgba(245,195,0,0.28)" }}>
                <Heart size={13} strokeWidth={2.5}/> Donate Now
              </Link>
              <Link href="/services/screening" onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[15px] font-bold text-white hover:text-white border border-white/10 hover:border-white/22 transition-all duration-200"
                style={M}>
                Book a Free Screening
              </Link>
            </div>

            {/* Contact strip */}
            <div className="px-5 pb-5 pt-2 space-y-2.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <a href="tel:+2348001234567"
                className="flex items-center gap-2.5 text-[14px] text-white hover:text-white transition-colors" style={M}>
                <Phone size={11} style={{ color: "#F5C300", flexShrink: 0 }}/>
                +234-800-NCC-CARE
              </a>
              <a href="mailto:info@ngogbeheicc.org"
                className="flex items-center gap-2.5 text-[14px] text-white hover:text-white transition-colors" style={M}>
                <Mail size={11} style={{ color: "#F5C300", flexShrink: 0 }}/>
                info@ngogbeheicc.org
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════
   MAIN NAVBAR
═══════════════════════════════════════════════ */
export default function Navbar() {
  const pathname = usePathname();

  const [bannerVisible, setBannerVisible] = useState(true);
  const [activeMenu,    setActiveMenu]    = useState(null);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [scrolled,      setScrolled]      = useState(false);

  const menuTimer = useRef(null);
  const { scrollY } = useScroll();

  /* Scroll detection — immediate at 1px */
  useMotionValueEvent(scrollY, "change", val => setScrolled(val > 1));

  /* Hover intent timer — prevents accidental menu flicker */
  const onEnter = useCallback((label) => {
    clearTimeout(menuTimer.current);
    setActiveMenu(label);
  }, []);

  const onLeave = useCallback(() => {
    menuTimer.current = setTimeout(() => setActiveMenu(null), 80);
  }, []);

  useEffect(() => () => clearTimeout(menuTimer.current), []);

  /* Close mega menu on route change */
  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  /* Escape closes any open overlay */
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== "Escape") return;
      if (mobileOpen)       { setMobileOpen(false); return; }
      if (activeMenu)       { setActiveMenu(null);  return; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileOpen, activeMenu]);

  /* Pixel-perfect mega menu top position */
  const bannerH    = bannerVisible ? BANNER_H : 0;
  const navbarBottom = bannerH + HEADER_H;

  /* Adaptive colours */
  const linkColor  = scrolled ? "#374151" : "rgba(255,255,255,0.82)";
  const headerBg   = scrolled ? "#ffffff" : "transparent";
  const headerBorder = scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent";
  const headerShadow = scrolled ? "0 2px 20px rgba(0,0,0,0.07)" : "none";

  return (
    <>
      {/* ──────────────────────────────────────
          Fixed wrapper — stacks banner + header
      ────────────────────────────────────── */}
      <div className="fixed top-0 left-0 w-full z-[9990]" role="navigation" aria-label="Site navigation">

        {/* Banner */}
        <TopBanner visible={bannerVisible} onDismiss={() => setBannerVisible(false)}/>

        {/* Header */}
        <motion.header
          animate={{ background: headerBg, borderBottom: headerBorder, boxShadow: headerShadow }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>

          <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 xl:px-20
                          flex items-center justify-between gap-6"
            style={{ height: HEADER_H }}>

            {/* ── Logo ── */}
            <Logo scrolled={scrolled}/>

            {/* ── Desktop nav ── */}
            <div className="hidden lg:flex items-center h-full" role="menubar">
              {NAV.map(item => {
                const isActive = activeMenu === item.label;
                const hasCols  = item.columns?.length > 0;
                const isCurrent = pathname?.startsWith(item.href) && item.href !== "/";

                return (
                  <div key={item.label}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => hasCols ? onEnter(item.label) : undefined}
                    onMouseLeave={hasCols ? onLeave : undefined}
                    role="none">

                    {hasCols ? (
                      <button
                        role="menuitem"
                        aria-expanded={isActive}
                        aria-haspopup="true"
                        onClick={() => setActiveMenu(isActive ? null : item.label)}
                        className="relative flex items-center gap-[5px] px-4 h-full text-[15px] font-bold whitespace-nowrap transition-colors duration-200 focus-visible:outline-none"
                        style={{ ...M, color: isActive ? (scrolled ? "#0A2240" : "white") : linkColor }}>
                        {item.label}
                        <motion.span
                          animate={{ rotate: isActive ? 180 : 0 }}
                          transition={{ duration: 0.16 }}
                          className="flex items-center opacity-70">
                          <ChevronDown size={11} strokeWidth={2.5}/>
                        </motion.span>
                        {/* Active underline */}
                        <motion.span
                          className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-t-sm origin-left"
                          style={{ background: "#F5C300" }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isActive || isCurrent ? 1 : 0 }}
                          transition={{ duration: 0.16 }}/>
                      </button>
                    ) : (
                      <Link href={item.href}
                        role="menuitem"
                        className="relative flex items-center px-4 h-full text-[15px] font-bold whitespace-nowrap transition-colors duration-200 focus-visible:outline-none"
                        style={{ ...M, color: isCurrent ? (scrolled ? "#0A2240" : "white") : linkColor }}>
                        {item.label}
                        {isCurrent && (
                          <span className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-t-sm bg-[#F5C300]"/>
                        )}
                      </Link>
                    )}

                    {/* Mega menu portal — rendered inline, positioned fixed */}
                    <AnimatePresence>
                      {isActive && hasCols && (
                        <MegaMenu
                          item={item}
                          navbarBottom={navbarBottom}
                          onLinkClick={() => setActiveMenu(null)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop right actions ── */}
            <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">

              {/* Donate CTA */}
              <motion.a href="/donate"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-black text-[#1a1200] uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C300]"
                style={{ ...M, background: "linear-gradient(135deg,#F5C300 0%,#e8b800 100%)", boxShadow: "0 4px 14px rgba(245,195,0,0.36)" }}>
                <Heart size={12} strokeWidth={2.5}/> Donate
              </motion.a>
            </div>

            {/* ── Mobile right ── */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-label="Open navigation menu"
                className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                style={{
                  color:        scrolled ? "#374151"               : "rgba(255,255,255,0.72)",
                  borderColor:  scrolled ? "#e5e7eb"               : "rgba(255,255,255,0.18)",
                  background:   scrolled ? "#ffffff"               : "rgba(255,255,255,0.06)",
                }}>
                <Menu size={18}/>
              </button>
            </div>

          </div>
        </motion.header>
      </div>

      {/* Overlays */}
      <MobileDrawer  open={mobileOpen} onClose={() => setMobileOpen(false)}/>

      {/* Keyframes */}
      <style>{`@keyframes ncc-blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </>
  );
}