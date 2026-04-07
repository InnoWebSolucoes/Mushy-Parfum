"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTranslations, useLocale } from "next-intl";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, totalPrice } = useCart();
  const t = useTranslations("cart");
  const locale = useLocale();

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0D0D0D] border-l border-[rgba(201,168,76,0.15)] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(201,168,76,0.1)]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-[#C9A84C]" />
                <span className="font-cinzel text-sm tracking-[0.2em] uppercase text-[#F5F0E8]">
                  {t("title")}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={40} className="text-[#C9A84C]/30" />
                  <p className="font-cormorant text-xl text-[#F5F0E8]/50">{t("empty")}</p>
                  <p className="font-cormorant text-base italic text-[#F5F0E8]/30">{t("emptySubtitle")}</p>
                  <Link
                    href={`/${locale}/shop`}
                    onClick={closeCart}
                    className="mt-2 font-cinzel text-xs tracking-[0.2em] uppercase border border-[#C9A84C] text-[#C9A84C] px-6 py-2 hover:bg-[#C9A84C] hover:text-black transition-all duration-300"
                  >
                    {t("explore")}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {state.items.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedSize.ml}`}
                      layout
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 py-4 border-b border-[rgba(201,168,76,0.08)]"
                    >
                      <div className="relative w-20 h-20 bg-[#111] flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.product.images.primary}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-cinzel text-xs tracking-wider text-[#F5F0E8] truncate">
                          {item.product.name}
                        </p>
                        <p className="font-cormorant text-sm text-[#C9A84C]/70 mt-0.5">
                          {item.selectedSize.ml}ml
                        </p>
                        <p className="font-cinzel text-sm text-[#C9A84C] mt-1">
                          {formatPrice(item.selectedSize.price * item.quantity)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.selectedSize.ml, item.quantity - 1)
                            }
                            className="text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-cinzel text-sm text-[#F5F0E8] w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.selectedSize.ml, item.quantity + 1)
                            }
                            className="text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id, item.selectedSize.ml)}
                            className="ml-auto text-[#F5F0E8]/30 hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="px-6 py-5 border-t border-[rgba(201,168,76,0.1)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-cinzel text-xs tracking-widest uppercase text-[#F5F0E8]/60">
                    {t("total")}
                  </span>
                  <span className="font-cinzel text-lg text-[#C9A84C]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <Link
                  href={`/${locale}/checkout`}
                  onClick={closeCart}
                  className="block w-full text-center font-cinzel text-sm tracking-[0.2em] uppercase bg-[#C9A84C] text-black py-4 hover:bg-[#E2C98A] transition-colors duration-300"
                >
                  {t("checkout")}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
