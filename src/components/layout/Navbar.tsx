"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTranslations, useLocale } from "next-intl";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heroPhase, setHeroPhase] = useState(true);
  const { totalItems, openCart } = useCart();
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    const HERO_HEIGHT = window.innerHeight * 5; // ~500vh
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      // On mobile, hide navbar while inside the hero scroll zone
      setHeroPhase(window.scrollY < HERO_HEIGHT - window.innerHeight * 1.1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hero section dispatches this event when its menu button is tapped
  useEffect(() => {
    const handler = () => setMobileOpen(true);
    window.addEventListener("hero:openMenu", handler);
    return () => window.removeEventListener("hero:openMenu", handler);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/shop`, label: t("shop") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  const otherLocale = locale === "en" ? "pt" : "en";
  const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(8,8,8,0.95)] backdrop-blur-md border-b border-[rgba(201,168,76,0.1)] py-3"
            : "bg-transparent py-5"
        } ${heroPhase ? "md:opacity-100 opacity-0 pointer-events-none md:pointer-events-auto" : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex flex-col items-center leading-none">
            <span
              className="font-cinzel text-xl md:text-2xl tracking-[0.3em]"
              style={{
                background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 50%, #9B7A2E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MUSHY
            </span>
            <span className="font-cinzel text-[10px] md:text-xs tracking-[0.5em] text-[#C9A84C]/60 mt-0.5">
              PARFUM
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-cinzel text-xs tracking-[0.2em] uppercase text-[#F5F0E8]/70 hover:text-[#C9A84C] transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language switcher */}
            <Link
              href={newPath}
              className="font-cinzel text-xs tracking-widest text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors duration-300 hidden sm:block"
            >
              {otherLocale.toUpperCase()}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative text-[#F5F0E8]/70 hover:text-[#C9A84C] transition-colors duration-300"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-[#C9A84C] text-black text-[10px] font-cinzel w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              className="md:hidden text-[#F5F0E8]/70 hover:text-[#C9A84C] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-[#080808]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  className="font-cinzel text-2xl tracking-[0.3em] uppercase text-[#F5F0E8]/80 hover:text-[#C9A84C] transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className="flex items-center gap-4 mt-4">
              <Link
                href={newPath}
                className="font-cinzel text-sm tracking-widest text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {otherLocale.toUpperCase()}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
