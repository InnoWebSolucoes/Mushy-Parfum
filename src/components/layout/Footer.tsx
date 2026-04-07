"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
// Instagram icon via inline SVG (lucide-react v1 removed it)

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="relative border-t border-[rgba(201,168,76,0.1)] bg-[#050505] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span
                className="font-cinzel text-2xl tracking-[0.3em]"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 50%, #9B7A2E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                MUSHY PARFUM
              </span>
            </div>
            <p className="font-cormorant text-lg italic text-[#F5F0E8]/50">{t("tagline")}</p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com/mushy_parfum"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href="https://wa.me/351912345678"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#C9A84C]/60 mb-5">
              {t("navigation")}
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { href: `/${locale}`, label: nav("home") },
                { href: `/${locale}/shop`, label: nav("shop") },
                { href: `/${locale}/about`, label: nav("about") },
                { href: `/${locale}/contact`, label: nav("contact") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-cormorant text-lg text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Follow */}
          <div>
            <h3 className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#C9A84C]/60 mb-5">
              {t("followUs")}
            </h3>
            <a
              href="https://instagram.com/mushy_parfum"
              target="_blank"
              rel="noopener noreferrer"
              className="font-cormorant text-xl text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors duration-300"
            >
              @mushy_parfum
            </a>
            <div className="mt-8 pt-8 border-t border-[rgba(201,168,76,0.1)]">
              <p className="font-cormorant text-sm text-[#F5F0E8]/30 italic">
                Luxury Arabic & Oriental Perfumery
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-[rgba(201,168,76,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-cormorant text-sm text-[#F5F0E8]/30">
            © {new Date().getFullYear()} Mushy Parfum. {t("rights")}
          </p>
          <div className="flex gap-6">
            <Link
              href={`/${locale}/privacy`}
              className="font-cormorant text-sm text-[#F5F0E8]/30 hover:text-[#C9A84C] transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="font-cormorant text-sm text-[#F5F0E8]/30 hover:text-[#C9A84C] transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
