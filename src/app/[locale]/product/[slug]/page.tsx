import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/lib/products";
import ProductHero from "@/components/product/ProductHero";
import FragranceNotes from "@/components/product/FragranceNotes";
import PerformanceMetrics from "@/components/product/PerformanceMetrics";
import PurchaseSection from "@/components/product/PurchaseSection";
import RelatedProducts from "@/components/product/RelatedProducts";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const locales = ["en", "pt"];
  return products.flatMap((p) =>
    locales.map((locale) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Mushy Parfum`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div>
      <ProductHero product={product} />

      {/* Story section */}
      <section className="py-20 px-6 max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/50" />
          <div className="w-1 h-1 bg-[#C9A84C]/50 rotate-45" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/50" />
        </div>
        <p className="font-cormorant text-xl md:text-2xl text-[#F5F0E8]/60 italic leading-relaxed">
          {product.description}
        </p>
      </section>

      <FragranceNotes notes={product.notes} />

      <PerformanceMetrics performance={product.performance} />

      <PurchaseSection product={product} />

      <RelatedProducts product={product} />
    </div>
  );
}
