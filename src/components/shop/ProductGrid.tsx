"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/products";
import ProductCard from "./ProductCard";
import { useTranslations } from "next-intl";
import { Category, Gender } from "@/types";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

type FilterCategory = Category | "all";
type FilterGender = Gender | "all";
type SortOption = "featured" | "priceAsc" | "priceDesc" | "name";

export default function ProductGrid() {
  const t = useTranslations("shop");
  const [category, setCategory] = useState<FilterCategory>("all");
  const [gender, setGender] = useState<FilterGender>("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const categories: FilterCategory[] = ["all", "oud", "amber", "floral", "oriental", "woody", "citrus", "fresh"];
  const genders: FilterGender[] = ["all", "masculine", "feminine", "unisex"];

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (gender !== "all") list = list.filter((p) => p.gender === gender);
    switch (sort) {
      case "featured":
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "priceAsc":
        list.sort((a, b) => Math.min(...a.sizes.map((s) => s.price)) - Math.min(...b.sizes.map((s) => s.price)));
        break;
      case "priceDesc":
        list.sort((a, b) => Math.min(...b.sizes.map((s) => s.price)) - Math.min(...a.sizes.map((s) => s.price)));
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [category, gender, sort]);

  const FilterChip = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`font-cinzel text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-300 ${
        active
          ? "border-[#C9A84C] bg-[#C9A84C] text-black"
          : "border-[rgba(201,168,76,0.2)] text-[#F5F0E8]/50 hover:border-[#C9A84C] hover:text-[#C9A84C]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Filter toggle (mobile) */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 font-cinzel text-xs tracking-[0.2em] uppercase text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors md:hidden"
        >
          <SlidersHorizontal size={14} />
          {t("filter")}
        </button>

        {/* Sort */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="font-cinzel text-[10px] tracking-widest uppercase text-[#F5F0E8]/30 hidden sm:block">
            {t("sortBy")}
          </span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="font-cinzel text-[10px] tracking-wider uppercase bg-transparent border border-[rgba(201,168,76,0.2)] text-[#C9A84C]/70 px-4 py-2 pr-8 appearance-none cursor-pointer hover:border-[#C9A84C] transition-colors focus:outline-none"
            >
              <option value="featured" className="bg-[#080808]">{t("featured")}</option>
              <option value="priceAsc" className="bg-[#080808]">{t("priceAsc")}</option>
              <option value="priceDesc" className="bg-[#080808]">{t("priceDesc")}</option>
              <option value="name" className="bg-[#080808]">{t("name")}</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {(showFilters || true) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="hidden md:block mb-10"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((c) => (
                <FilterChip
                  key={c}
                  label={c === "all" ? t("all") : t(c)}
                  active={category === c}
                  onClick={() => setCategory(c)}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {genders.map((g) => (
                <FilterChip
                  key={g}
                  label={g === "all" ? t("all") : t(g)}
                  active={gender === g}
                  onClick={() => setGender(g)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mb-6 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((c) => (
                <FilterChip
                  key={c}
                  label={c === "all" ? t("all") : t(c)}
                  active={category === c}
                  onClick={() => setCategory(c)}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {genders.map((g) => (
                <FilterChip
                  key={g}
                  label={g === "all" ? t("all") : t(g)}
                  active={gender === g}
                  onClick={() => setGender(g)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Count */}
      <p className="font-cormorant text-sm italic text-[#F5F0E8]/30 mb-8">
        {filtered.length} {filtered.length === 1 ? "fragrance" : "fragrances"}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-cormorant text-2xl italic text-[#F5F0E8]/40">{t("noResults")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
