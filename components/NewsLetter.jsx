"use client";

/**
 * @file ContactSection.jsx
 * @project Ngogbehei Cancer Center — Digital Platform
 * @description "Get in Touch" contact section.
 *              Left: photo card with email overlay.
 *              Right: mint-green panel with contact form.
 *              Matches the ChildrenofLife reference layout.
 * @dependencies framer-motion, lucide-react
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Mail, Phone, User, MessageSquare } from "lucide-react";

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── FIELD COMPONENT ─────────────────────────────────────────────────────────
function Field({ icon: Icon, label, type = "text", placeholder, value, onChange, error, as, rows }) {
  const base = `
    w-full bg-white border text-gray-800 text-[13.5px] font-normal
    placeholder-gray-400 px-4 rounded-xl outline-none
    transition-all duration-200
    ${error
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-[#22A96A] focus:ring-2 focus:ring-[#22A96A]/15"
    }
  `;

  return (
    <div className="relative w-full">
      {as === "textarea" ? (
        <textarea
          rows={rows || 4}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-label={label}
          className={`${base} py-3 resize-none`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-label={label}
          className={`${base} py-[11px]`}
        />
      )}
      {error && (
        <p className="mt-1 text-[11.5px] text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState("idle"); // idle | loading | success

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())                                          e.name    = "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email   = "Valid email is required.";
    if (!form.message.trim())                                       e.message = "Please share your message.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1400));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-[#22A96A]/15 flex items-center justify-center">
          <CheckCircle size={32} className="text-[#22A96A]" strokeWidth={1.8} />
        </div>
        <h3 className="text-[20px] font-bold text-gray-900">Message Received!</h3>
        <p className="text-[13.5px] text-gray-500 max-w-[280px] leading-relaxed">
          Thank you for reaching out. Our team will get back to you within 3 days.
        </p>
        <button
          onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", message: "" }); }}
          className="mt-2 text-[13px] font-semibold text-[#22A96A] hover:underline underline-offset-2 transition-all"
        >
          Send another message →
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {/* Full name */}
      <Field
        label="Full name" placeholder="Enter your full name"
        value={form.name} onChange={set("name")} error={errors.name}
      />
      {/* Email + Phone row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="Email" type="email" placeholder="Enter your email address"
          value={form.email} onChange={set("email")} error={errors.email}
        />
        <Field
          label="Phone" type="tel" placeholder="Enter your phone number"
          value={form.phone} onChange={set("phone")} error={errors.phone}
        />
      </div>
      {/* Message */}
      <Field
        label="Message" as="textarea" rows={4}
        placeholder="Tell us about your request or idea..."
        value={form.message} onChange={set("message")} error={errors.message}
      />
      {/* Submit */}
      <div className="pt-1">
        <motion.button
          type="submit"
          disabled={status === "loading"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-8 py-[11px] bg-[#22A96A] text-white text-[13.5px] font-bold tracking-wide rounded-xl hover:bg-[#1a8f58] transition-colors duration-200 disabled:opacity-60 shadow-[0_4px_14px_rgba(34,169,106,0.30)]"
        >
          {status === "loading" ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send size={14} strokeWidth={2.5} />
              Submit
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function ContactSection() {
  return (
    <section className="w-full py-16 px-4 md:px-6 lg:px-10 bg-white" aria-label="Contact us">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-stretch">

          {/* ── LEFT: Photo Card ── */}
          <motion.div
            variants={fadeUp} custom={0}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative rounded-2xl overflow-hidden min-h-[460px] lg:min-h-0"
          >
            {/* Photo */}
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
              alt="Children smiling — Ngogbehei Cancer Center community"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Subtle dark gradient at bottom for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            {/* Decorative envelope badge — bottom right */}
            <div className="absolute bottom-5 right-5 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
                {/* Envelope body */}
                <rect x="4" y="10" width="32" height="22" rx="3" fill="#d1fae5" stroke="#22A96A" strokeWidth="1.6" />
                {/* Envelope flap */}
                <path d="M4 13 L20 23 L36 13" stroke="#22A96A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* @ symbol */}
                <text x="20" y="27" textAnchor="middle" fontSize="10" fontWeight="700" fill="#22A96A" fontFamily="sans-serif">@</text>
              </svg>
            </div>

            {/* Email overlay — bottom left */}
            <div className="absolute bottom-5 left-5 right-24">
              <p className="text-[11px] font-medium text-white/70 mb-[2px]">Email us at</p>
              <a
                href="mailto:info@ngogbeheicc.org"
                className="text-[14px] font-bold text-white hover:text-[#F5C300] transition-colors duration-200 break-all"
              >
                info@ngogbeheicc.org
              </a>
            </div>
          </motion.div>

          {/* ── RIGHT: Form Panel ── */}
          <motion.div
            variants={fadeUp} custom={1}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-[#e8f8f0] rounded-2xl px-8 py-10 flex flex-col justify-center"
          >
            {/* Heading */}
            <div className="mb-7">
              <h2 className="text-[28px] font-extrabold text-gray-900 leading-tight mb-2">
                Get in Touch With Us
              </h2>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                We're here to listen, support, and collaborate.
              </p>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                Donor, partner, or volunteer? Share your message, and we'll reply in 3 days.
              </p>
            </div>

            {/* Form */}
            <ContactForm />
          </motion.div>

        </div>
      </div>
    </section>
  );
}