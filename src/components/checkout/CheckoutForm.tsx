"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { useTranslations, useLocale } from "next-intl";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Smartphone, ChevronRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_placeholder"
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#F5F0E8",
      fontFamily: '"Cinzel", serif',
      fontSize: "14px",
      letterSpacing: "0.05em",
      "::placeholder": { color: "rgba(245,240,232,0.3)" },
    },
    invalid: { color: "#e74c3c" },
  },
};

function MBWayForm({
  amount,
  onSuccess,
}: {
  amount: number;
  onSuccess: (ref: string) => void;
}) {
  const t = useTranslations("checkout");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [ref, setRef] = useState("");

  useEffect(() => {
    if (!sent) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sent]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mbway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setRef(data.reference);
        // Simulate auto-confirm after 5s for demo
        setTimeout(() => onSuccess(data.reference), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-[rgba(201,168,76,0.1)] border border-[#C9A84C] flex items-center justify-center mx-auto"
        >
          <Smartphone size={24} className="text-[#C9A84C]" />
        </motion.div>
        <p className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#C9A84C]">
          Ref: {ref}
        </p>
        <p className="font-cormorant text-xl italic text-[#F5F0E8]/60">{t("mbwayInstructions")}</p>
        <div className="font-cinzel text-3xl text-[#C9A84C]">{formatTime(timeLeft)}</div>
        <p className="font-cormorant text-sm italic text-[#F5F0E8]/30">
          Auto-confirming for demo in a moment...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#F5F0E8]/40 block mb-2">
          {t("phone")}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+351 9XX XXX XXX"
          className="w-full bg-transparent border border-[rgba(201,168,76,0.2)] text-[#F5F0E8] font-cormorant text-lg px-4 py-3 focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-[#F5F0E8]/20"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading || phone.length < 9}
        className="w-full font-cinzel text-sm tracking-[0.2em] uppercase bg-[#C9A84C] text-black py-4 hover:bg-[#E2C98A] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? t("paying") : `${t("pay")} · ${formatPrice(amount)}`}
      </button>
    </div>
  );
}

function StripeForm({ amount, onSuccess }: { amount: number; onSuccess: (id: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations("checkout");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const { clientSecret, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);

      const cardEl = elements.getElement(CardElement);
      if (!cardEl) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardEl },
      });

      if (result.error) {
        setError(result.error.message ?? "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#F5F0E8]/40 block mb-2">
          {t("cardNumber")}
        </label>
        <div className="border border-[rgba(201,168,76,0.2)] px-4 py-4 focus-within:border-[#C9A84C] transition-colors">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <p className="font-cormorant text-base text-red-400 italic">{error}</p>
      )}

      <p className="font-cormorant text-sm italic text-[#F5F0E8]/30">{t("demo")}</p>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full flex items-center justify-center gap-3 font-cinzel text-sm tracking-[0.2em] uppercase bg-[#C9A84C] text-black py-4 hover:bg-[#E2C98A] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? t("paying") : (
          <>
            {t("pay")} · {formatPrice(amount)}
            <ChevronRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}

export default function CheckoutForm() {
  const { state, totalPrice, clearCart } = useCart();
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const [method, setMethod] = useState<"card" | "mbway">("card");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (totalPrice > 0) {
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      })
        .then((r) => r.json())
        .then((d) => d.clientSecret && setClientSecret(d.clientSecret))
        .catch(() => {});
    }
  }, [totalPrice]);

  const handleSuccess = (ref: string) => {
    clearCart();
    router.push(`/${locale}/checkout/success?ref=${ref}`);
  };

  if (state.items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-cormorant text-2xl italic text-[#F5F0E8]/40">
          Your cart is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
      {/* Order summary */}
      <div>
        <h2 className="font-cinzel text-sm tracking-[0.3em] uppercase text-[#C9A84C]/60 mb-6">
          {t("orderSummary")}
        </h2>
        <div className="space-y-4 mb-8">
          {state.items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedSize.ml}`}
              className="flex gap-4 py-4 border-b border-[rgba(201,168,76,0.08)]"
            >
              <div className="relative w-16 h-16 bg-[#111] flex-shrink-0">
                <Image
                  src={item.product.images.primary}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-cinzel text-xs tracking-wider text-[#F5F0E8]">
                  {item.product.name}
                </p>
                <p className="font-cormorant text-sm text-[#C9A84C]/60 mt-0.5">
                  {item.selectedSize.ml}ml × {item.quantity}
                </p>
              </div>
              <p className="font-cinzel text-sm text-[#C9A84C]">
                {formatPrice(item.selectedSize.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t border-[rgba(201,168,76,0.1)]">
          <div className="flex justify-between">
            <span className="font-cinzel text-xs tracking-widest uppercase text-[#F5F0E8]/40">
              {t("subtotal")}
            </span>
            <span className="font-cinzel text-sm text-[#F5F0E8]/70">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-cinzel text-xs tracking-widest uppercase text-[#F5F0E8]/40">
              {t("shipping")}
            </span>
            <span className="font-cinzel text-sm text-[#C9A84C]">{t("free")}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[rgba(201,168,76,0.1)] mt-2">
            <span className="font-cinzel text-xs tracking-widest uppercase text-[#F5F0E8]/60">
              {t("total")}
            </span>
            <span className="font-cinzel text-lg text-[#C9A84C]">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div>
        <h2 className="font-cinzel text-sm tracking-[0.3em] uppercase text-[#C9A84C]/60 mb-6">
          {t("paymentMethod")}
        </h2>

        {/* Method toggle */}
        <div className="flex gap-3 mb-8">
          {(["card", "mbway"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`flex-1 flex items-center justify-center gap-2 font-cinzel text-[10px] tracking-[0.2em] uppercase py-3 border transition-all duration-300 ${
                method === m
                  ? "border-[#C9A84C] bg-[rgba(201,168,76,0.08)] text-[#C9A84C]"
                  : "border-[rgba(201,168,76,0.15)] text-[#F5F0E8]/40 hover:border-[#C9A84C]/50"
              }`}
            >
              {m === "card" ? <CreditCard size={14} /> : <Smartphone size={14} />}
              {t(m)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {method === "card" ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripeForm amount={totalPrice} onSuccess={handleSuccess} />
                </Elements>
              ) : (
                <Elements stripe={stripePromise}>
                  <StripeForm amount={totalPrice} onSuccess={handleSuccess} />
                </Elements>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="mbway"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MBWayForm amount={totalPrice} onSuccess={handleSuccess} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
