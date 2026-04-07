"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Product, SizeOption } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PurchaseSection({ product }: { product: Product }) {
  const t = useTranslations("product");
  const locale = useLocale();
  const { addItem } = useCart();
  const inStockSizes = product.sizes.filter((s) => s.inStock);
  const [selected, setSelected] = useState<SizeOption>(inStockSizes[0] ?? product.sizes[0]);

  const handleAddToCart = () => {
    addItem(product, selected);
    toast.success(`${product.name} added to cart`, {
      style: {
        background: "#0D0D0D",
        color: "#C9A84C",
        border: "1px solid rgba(201,168,76,0.2)",
        fontFamily: "Cinzel, serif",
        fontSize: "12px",
        letterSpacing: "0.1em",
      },
    });
  };

  return (
    <section className="py-16 px-6 border-t border-[rgba(201,168,76,0.1)]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          {/* Limited notice */}
          <div className="flex items-center gap-3 p-4 border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.03)]">
            <AlertCircle size={14} className="text-[#C9A84C]/60 flex-shrink-0" />
            <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#C9A84C]/50">
              {t("limitedStock")}
            </p>
          </div>

          {/* Size selection */}
          <div>
            <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#F5F0E8]/40 mb-4">
              {t("size")}
            </p>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size.ml}
                  onClick={() => size.inStock && setSelected(size)}
                  disabled={!size.inStock}
                  className={`relative font-cinzel text-xs tracking-wider px-6 py-3 border transition-all duration-300 ${
                    selected.ml === size.ml
                      ? "border-[#C9A84C] bg-[rgba(201,168,76,0.1)] text-[#C9A84C]"
                      : size.inStock
                      ? "border-[rgba(201,168,76,0.2)] text-[#F5F0E8]/50 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                      : "border-[rgba(255,255,255,0.05)] text-[#F5F0E8]/20 cursor-not-allowed"
                  }`}
                >
                  <span>{size.ml}ml</span>
                  <span className="block text-[10px] mt-0.5">{formatPrice(size.price)}</span>
                  {!size.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-20" />
                      <span className="font-cinzel text-[8px] tracking-widest uppercase text-[#F5F0E8]/20 relative">
                        {t("outOfStock")}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <span
              className="font-cinzel text-4xl"
              style={{
                background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 50%, #9B7A2E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {formatPrice(selected.price)}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!selected.inStock}
              className="flex-1 flex items-center justify-center gap-3 font-cinzel text-sm tracking-[0.2em] uppercase border border-[#C9A84C] text-[#C9A84C] py-4 hover:bg-[#C9A84C] hover:text-black hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} />
              {t("addToCart")}
            </button>
            <Link
              href={`/${locale}/checkout`}
              onClick={() => selected.inStock && addItem(product, selected)}
              className="flex-1 flex items-center justify-center gap-3 font-cinzel text-sm tracking-[0.2em] uppercase bg-[#C9A84C] text-black py-4 hover:bg-[#E2C98A] hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] transition-all duration-500"
            >
              {t("buyNow")}
            </Link>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 text-[#F5F0E8]/25">
            <Lock size={12} />
            <span className="font-cinzel text-[9px] tracking-widest uppercase">
              Secure Checkout · Stripe · MB Way
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
