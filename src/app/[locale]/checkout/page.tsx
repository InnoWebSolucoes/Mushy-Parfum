import { getTranslations } from "next-intl/server";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default async function CheckoutPage() {
  const t = await getTranslations("checkout");
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1
            className="font-cinzel text-3xl md:text-4xl tracking-[0.2em] uppercase mb-4"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 50%, #9B7A2E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("title")}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/50" />
            <div className="w-1 h-1 bg-[#C9A84C]/50 rotate-45" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/50" />
          </div>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}
