"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import { MessageCircle, Mail, Send } from "lucide-react";

// Instagram SVG (lucide-react v1 removed it)
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1500)); // Simulate send
    setStatus("success");
  };

  const links = [
    {
      icon: MessageCircle,
      label: t("whatsapp"),
      href: "https://wa.me/351912345678",
      sub: "+351 912 345 678",
    },
    {
      icon: InstagramIcon,
      label: t("instagram"),
      href: "https://instagram.com/mushy_parfum",
      sub: "@mushy_parfum",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:info@mushyparfum.com",
      sub: "info@mushyparfum.com",
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact links */}
          <div className="space-y-6">
            {links.map(({ icon: Icon, label, href, sub }, i) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                className="flex items-center gap-5 p-6 border border-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.35)] transition-all duration-400 group"
              >
                <div className="w-12 h-12 border border-[rgba(201,168,76,0.2)] flex items-center justify-center group-hover:border-[#C9A84C] group-hover:bg-[rgba(201,168,76,0.05)] transition-all duration-300">
                  <Icon size={18} className="text-[#C9A84C]/60 group-hover:text-[#C9A84C] transition-colors duration-300" />
                </div>
                <div>
                  <p className="font-cinzel text-xs tracking-[0.2em] uppercase text-[#F5F0E8]/60 group-hover:text-[#C9A84C] transition-colors duration-300">
                    {label}
                  </p>
                  <p className="font-cormorant text-lg text-[#F5F0E8]/40 mt-0.5">{sub}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <h3 className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#C9A84C]/60 mb-6">
              {t("email")}
            </h3>

            {status === "success" ? (
              <div className="border border-[rgba(201,168,76,0.2)] p-8 text-center">
                <div className="w-12 h-12 bg-[rgba(201,168,76,0.1)] border border-[#C9A84C]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={18} className="text-[#C9A84C]" />
                </div>
                <p className="font-cormorant text-xl italic text-[#F5F0E8]/60">{t("success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: "name", label: t("name"), type: "text" },
                  { name: "email", label: t("emailField"), type: "email" },
                ].map(({ name, label, type }) => (
                  <div key={name}>
                    <label className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#F5F0E8]/40 block mb-2">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={form[name as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                      required
                      className="w-full bg-transparent border border-[rgba(201,168,76,0.15)] text-[#F5F0E8] font-cormorant text-lg px-4 py-3 focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-[#F5F0E8]/20"
                    />
                  </div>
                ))}

                <div>
                  <label className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#F5F0E8]/40 block mb-2">
                    {t("message")}
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full bg-transparent border border-[rgba(201,168,76,0.15)] text-[#F5F0E8] font-cormorant text-lg px-4 py-3 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none placeholder:text-[#F5F0E8]/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-3 font-cinzel text-sm tracking-[0.2em] uppercase border border-[#C9A84C] text-[#C9A84C] py-4 hover:bg-[#C9A84C] hover:text-black transition-all duration-400 disabled:opacity-40"
                >
                  <Send size={14} />
                  {status === "sending" ? t("sending") : t("send")}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
