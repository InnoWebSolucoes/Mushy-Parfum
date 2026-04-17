"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useTranslations("shop");
  const { addItem } = useCart();
  const defaultSize = product.sizes.find((s) => s.inStock) ?? product.sizes[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group relative border border-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.35)] transition-all duration-500 hover:shadow-[0_0_30px_rgba(201,168,76,0.08)]"
    >
      <Link href={`/${locale}/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0F0F0F]">
          <Image
            src={product.images.primary}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[rgba(8,8,8,0.2)] to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNew && (
              <span className="font-cinzel text-[9px] tracking-widest uppercase bg-[#C9A84C] text-black px-2 py-0.5">
                {t("new")}
              </span>
            )}
            {product.isBestseller && (
              <span className="font-cinzel text-[9px] tracking-widest uppercase border border-[#C9A84C] text-[#C9A84C] px-2 py-0.5 bg-[rgba(8,8,8,0.6)] backdrop-blur-sm">
                {t("bestseller")}
              </span>
            )}
          </div>

          {/* Hover: View details */}
          <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase border border-[#C9A84C] text-[#C9A84C] bg-[rgba(8,8,8,0.85)] px-6 py-2 backdrop-blur-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
              {t("viewDetails")}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-[#0A0A0A]">
          <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#C9A84C]/40 mb-1">
            {product.nameAr}
          </p>
          <h3 className="font-cinzel text-sm tracking-wider text-[#F5F0E8] mb-1 leading-tight">
            {product.name}
          </h3>
          <p className="font-cormorant text-sm italic text-[#F5F0E8]/40 line-clamp-1 mb-3">
            {product.tagline}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-sm text-[#C9A84C]">
              {formatPrice(Math.min(...product.sizes.map((s) => s.price)))}
            </span>
            <span className="font-cormorant text-xs italic text-[#F5F0E8]/30">
              {product.sizes.map((s) => `${s.ml}ml`).join(" · ")}
            </span>
          </div>
        </div>
      </Link>

      {/* Quick add to cart */}
      {defaultSize.inStock && (
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product, defaultSize);
          }}
          className="absolute bottom-[60px] right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#C9A84C] text-black p-2 hover:bg-[#E2C98A] translate-y-2 group-hover:translate-y-0"
          title={t("buyNow")}
        >
          <ShoppingBag size={14} />
        </button>
      )}
    </motion.div>
  );
}
