"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { getFeaturedProducts } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "../ui/SectionHeading";
import { formatPrice } from "@/lib/utils";

export default function FeaturedProducts() {
  const t = useTranslations("featured");
  const shop = useTranslations("shop");
  const locale = useLocale();
  const featured = getFeaturedProducts();

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Link href={`/${locale}/product/${product.slug}`}>
                <div className="group relative overflow-hidden cursor-pointer border border-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.3)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(201,168,76,0.1)]">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
                    <Image
                      src={product.images.primary}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-70" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="font-cinzel text-[9px] tracking-widest uppercase bg-[#C9A84C] text-black px-2 py-1">
                          {shop("new")}
                        </span>
                      )}
                      {product.isBestseller && (
                        <span className="font-cinzel text-[9px] tracking-widest uppercase border border-[#C9A84C] text-[#C9A84C] px-2 py-1">
                          {shop("bestseller")}
                        </span>
                      )}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[rgba(201,168,76,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* View button appears on hover */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                      <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase border border-[#C9A84C] text-[#C9A84C] bg-[rgba(8,8,8,0.8)] px-5 py-2 backdrop-blur-sm">
                        {shop("viewDetails")}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 bg-[#0A0A0A]">
                    <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]/50 mb-1">
                      {product.nameAr}
                    </p>
                    <h3 className="font-cinzel text-sm tracking-wider text-[#F5F0E8] mb-2">
                      {product.name}
                    </h3>
                    <p className="font-cormorant text-sm italic text-[#F5F0E8]/40 line-clamp-1 mb-3">
                      {product.tagline}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel text-sm text-[#C9A84C]">
                        {formatPrice(Math.min(...product.sizes.map((s) => s.price)))}
                      </span>
                      <span className="font-cormorant text-xs text-[#F5F0E8]/30 italic">
                        {product.sizes[0].ml}ml
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center justify-center font-cinzel text-xs tracking-[0.3em] uppercase border border-[rgba(201,168,76,0.4)] text-[#C9A84C]/70 px-10 py-3 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
          >
            View Full Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
