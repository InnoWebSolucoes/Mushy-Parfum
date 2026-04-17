"use client";

import { useTranslations, useLocale } from "next-intl";
import { Product } from "@/types";
import { getRelatedProducts } from "@/lib/products";
import SectionHeading from "../ui/SectionHeading";
import ProductCard from "../shop/ProductCard";

export default function RelatedProducts({ product }: { product: Product }) {
  const t = useTranslations("product");
  const related = getRelatedProducts(product);
  if (!related.length) return null;

  return (
    <section className="py-20 px-6 border-t border-[rgba(201,168,76,0.08)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <SectionHeading title={t("relatedTitle")} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {related.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
