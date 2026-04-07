"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
}

export default function GoldButton({
  variant = "outline",
  size = "md",
  href,
  children,
  className,
  ...props
}: GoldButtonProps) {
  const base =
    "inline-flex items-center justify-center font-cinzel tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer";

  const sizes = {
    sm: "px-6 py-2 text-xs",
    md: "px-8 py-3 text-sm",
    lg: "px-12 py-4 text-base",
  };

  const variants = {
    filled:
      "bg-[#C9A84C] text-black hover:bg-[#E2C98A] hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]",
    outline:
      "border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]",
    ghost:
      "text-[#C9A84C] hover:text-[#E2C98A] underline underline-offset-4 decoration-[#C9A84C]",
  };

  const classes = cn(base, sizes[size], variants[variant], className);

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
