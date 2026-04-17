import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CartDrawer from "@/components/checkout/CartDrawer";
import { Toaster } from "react-hot-toast";
import "../globals.css";

export const metadata: Metadata = {
  title: "Mushy Parfum — Luxury Arabic & Oriental Perfumery",
  description:
    "Discover Mushy Parfum — a luxury Arabic & Oriental perfumery brand. Premium oud, amber, saffron, and rose fragrances crafted for those who command presence.",
  keywords: ["luxury perfume", "Arabic perfume", "oriental fragrance", "oud", "Mushy Parfum"],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "pt")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <head />
      <body className="bg-[#080808] text-[#F5F0E8] overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <div className="relative z-10">
              <Navbar />
              <main>{children}</main>
              <Footer />
              <WhatsAppButton />
              <CartDrawer />
              <Toaster position="bottom-left" />
            </div>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
