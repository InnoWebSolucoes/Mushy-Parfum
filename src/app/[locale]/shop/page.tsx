import { getTranslations } from "next-intl/server";
import ProductGrid from "@/components/shop/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";

export default async function ShopPage() {
  const t = await getTranslations("shop");

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        </div>
        <ProductGrid />
      </div>
    </div>
  );
}
