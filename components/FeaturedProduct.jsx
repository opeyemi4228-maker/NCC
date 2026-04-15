"use client";

/**
 * @file DiscoverSection.jsx
 * @project Ngogbehei Cancer Center — Digital Platform
 * @description "Discover NCC" section — editorial intro + 4 image cards.
 *              Layout ref: Saudi Aramco "Discover Aramco" section.
 *              Animations: scroll-triggered stagger, card hover Ken Burns,
 *              arrow morph, headline word reveal.
 *              SEO: JSON-LD ItemList, semantic HTML, aria labels.
 * @dependencies framer-motion, lucide-react
 */

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

// ─── SECTION DATA ─────────────────────────────────────────────────────────────
const CARDS = [
  {
    id:       "screening",
    category: "OUR SERVICES",
    headline: "World-class cancer screening available to every Nigerian",
    href:     "/services/screening",
    img:      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80",
    alt:      "Medical professional performing a cancer screening",
  },
  {
    id:       "treatment",
    category: "WHAT WE DO",
    headline: "From diagnostics to chemotherapy, excellence is our standard",
    href:     "/services/treatment",
    img:      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80",
    alt:      "Oncology treatment team at Ngogbehei Cancer Center",
  },
  {
    id:       "community",
    category: "COMMUNITY",
    headline: "We reach patients in every corner of Nigeria",
    href:     "/services/outreach",
    img:      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=900&q=80",
    alt:      "Community health workers engaging with patients in Nigeria",
  },
  {
    id:       "impact",
    category: "OUR IMPACT",
    headline: "Ngogbehei is one of Africa's most trusted cancer foundations",
    href:     "/impact",
    img:      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=900&q=80",
    alt:      "Impact report data and patient outcomes at Ngogbehei Cancer Center",
  },
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ngogbeheicc.org";

// ─── JSON-LD ──────────────────────────────────────────────────────────────────
function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    name:       "Discover Ngogbehei Cancer Center",
    description:"Key programs, services and impact areas of Ngogbehei Cancer Center, Nigeria's leading cancer foundation.",
    numberOfItems: CARDS.length,
    itemListElement: CARDS.map((card, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       card.category,
      description: card.headline,
      url:        `${SITE_URL}${card.href}`,
      image:      card.img,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  },
});

const cardVar = (i) => ({
  hidden:  { opacity: 0, y: 48, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.65, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
  },
});

const lineVar = {
  hidden:  { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] } },
};

// ─── CARD COMPONENT ───────────────────────────────────────────────────────────
function DiscoverCard({ card, index }) {
  return (
    <motion.article
      variants={cardVar(index)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{ aspectRatio: "3/4" }}
      aria-label={`${card.category} — ${card.headline}`}
    >
      <Link href={card.href} className="block w-full h-full">

        {/* ── Background image with Ken Burns on hover ── */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <Image
            src={card.img}
            alt={card.alt}
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 25vw"
            className="object-cover object-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          />
        </div>

        {/* ── Dark gradient overlay — stronger on hover ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-500 rounded-2xl" />

        {/* ── Card content ── */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">

          {/* Top: category label */}
          <div>
            <span className="inline-block text-[10.5px] font-[700] tracking-[.18em] uppercase text-white/80 group-hover:text-white transition-colors duration-300">
              {card.category}
            </span>
          </div>

          {/* Bottom: headline + arrow */}
          <div className="flex flex-col gap-5">
            <h3 className="text-white font-[600] leading-[1.3] transition-all duration-300 group-hover:translate-y-[-2px]"
              style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}
            >
              {card.headline}
            </h3>

            {/* Arrow button — Aramco circle style */}
            <div className="flex items-center justify-end">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-full border border-white/40 group-hover:border-white overflow-hidden transition-all duration-300">
                {/* Fill ring on hover */}
                <span className="absolute inset-0 bg-white scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 ease-out origin-center" />
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="relative z-10 text-white group-hover:text-[#0A2240] transition-colors duration-300 group-hover:translate-x-[1px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Gold accent bottom bar on hover ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C8962E] origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </Link>
    </motion.article>
  );
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
export default function DiscoverSection() {
  const sectionRef = useRef(null);
  const inView     = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <>
      <StructuredData />

      <section
        ref={sectionRef}
        className="w-full bg-[#F4F4F2] py-20 lg:py-28"
        aria-labelledby="discover-heading"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">

          {/* ── EDITORIAL HEADER ── */}
          <div className="mb-16 lg:mb-20">

            {/* Section label — small caps */}
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex items-center gap-3 mb-5"
            >
              {/* Gold accent rule */}
              <motion.span
                variants={lineVar}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="block h-[2px] w-8 bg-[#C8962E] origin-left"
              />
              <span className="text-[11px] font-[700] tracking-[.2em] uppercase text-[#C8962E]">
                Discover NCC
              </span>
            </motion.div>

            {/* Large editorial headline — Aramco style */}
            <motion.h2
              id="discover-heading"
              variants={fadeUp(0.1)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="font-[400] text-[#0A2240] leading-[1.25] max-w-[720px]"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              We are Nigeria&apos;s leading cancer foundation — delivering
              world-class screening, treatment, and support to{" "}
              <em className="not-italic font-[700] text-[#C8962E]">
                every patient
              </em>
              {" "}who needs us.
            </motion.h2>
          </div>

          {/* ── 4-COLUMN CARD GRID ── */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
            role="list"
            aria-label="Discover Ngogbehei Cancer Center programs"
          >
            {CARDS.map((card, i) => (
              <div key={card.id} role="listitem">
                <DiscoverCard card={card} index={i} />
              </div>
            ))}
          </div>

          {/* ── BOTTOM CTA STRIP ── */}
          <motion.div
            variants={fadeUp(0.5)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <p className="text-[14.5px] font-[400] text-[#6B7280] max-w-[480px] leading-relaxed">
              From Abuja to Lagos, Port Harcourt to Kano — Ngogbehei Cancer Center
              is wherever Nigerians need cancer care most.
            </p>

            <Link
              href="/about"
              className="group flex items-center gap-3 text-[14px] font-[700] text-[#0A2240] hover:text-[#C8962E] transition-colors duration-200 whitespace-nowrap"
            >
              Learn about our foundation
              <span className="flex items-center justify-center w-9 h-9 rounded-full border border-[#0A2240]/25 group-hover:border-[#C8962E] group-hover:bg-[#C8962E] transition-all duration-300 overflow-hidden">
                <ArrowRight
                  size={15}
                  strokeWidth={2}
                  className="text-[#0A2240] group-hover:text-white transition-colors duration-300 group-hover:translate-x-[1px]"
                />
              </span>
            </Link>
          </motion.div>

        </div>
      </section>
    </>
  );
}