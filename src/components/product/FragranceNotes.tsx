"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FragranceNote } from "@/types";
import Image from "next/image";

interface NoteCardProps {
  note: FragranceNote;
  index: number;
}

function NoteCard({ note, index }: NoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group flex flex-col items-center text-center"
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 overflow-hidden rounded-full border border-[rgba(201,168,76,0.2)] group-hover:border-[#C9A84C] transition-colors duration-300 bg-[#111]">
        <Image
          src={note.image}
          alt={note.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,8,0.4)] to-transparent" />
      </div>
      <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#C9A84C] mb-1">
        {note.name}
      </span>
      <span className="font-cormorant text-xs italic text-[#F5F0E8]/40 hidden md:block">
        {note.description}
      </span>
    </motion.div>
  );
}

interface NoteColumnProps {
  title: string;
  notes: FragranceNote[];
  delay?: number;
}

function NoteColumn({ title, notes, delay = 0 }: NoteColumnProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
    >
      <div className="text-center mb-8">
        <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#C9A84C]/60">
          {title}
        </span>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h-px w-8 bg-[#C9A84C]/30" />
          <div className="w-1 h-1 bg-[#C9A84C]/50 rotate-45" />
          <div className="h-px w-8 bg-[#C9A84C]/30" />
        </div>
      </div>
      <div className="flex justify-center gap-6 md:gap-8 flex-wrap">
        {notes.map((note, i) => (
          <NoteCard key={note.name} note={note} index={i + delay * 5} />
        ))}
      </div>
    </motion.div>
  );
}

interface FragranceNotesProps {
  notes: {
    top: FragranceNote[];
    heart: FragranceNote[];
    base: FragranceNote[];
  };
}

export default function FragranceNotes({ notes }: FragranceNotesProps) {
  const t = useTranslations("product");

  return (
    <section className="py-20 px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#C9A84C]/3 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="font-cinzel text-2xl md:text-3xl tracking-[0.2em] uppercase mb-2"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #E2C98A 50%, #9B7A2E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("notesTitle")}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/50" />
            <div className="w-1 h-1 bg-[#C9A84C]/50 rotate-45" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/50" />
          </div>
        </motion.div>

        {/* Pyramid structure */}
        <div className="space-y-12">
          {/* Top notes — narrow */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <NoteColumn title={t("topNotes")} notes={notes.top} delay={0} />
            </div>
          </div>

          {/* Pyramid divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[rgba(201,168,76,0.1)]" />
            <div className="font-cinzel text-[8px] tracking-[0.4em] uppercase text-[#C9A84C]/30 px-4">↓</div>
            <div className="flex-1 h-px bg-[rgba(201,168,76,0.1)]" />
          </div>

          {/* Heart notes — medium */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <NoteColumn title={t("heartNotes")} notes={notes.heart} delay={0.1} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[rgba(201,168,76,0.1)]" />
            <div className="font-cinzel text-[8px] tracking-[0.4em] uppercase text-[#C9A84C]/30 px-4">↓</div>
            <div className="flex-1 h-px bg-[rgba(201,168,76,0.1)]" />
          </div>

          {/* Base notes — wide */}
          <NoteColumn title={t("baseNotes")} notes={notes.base} delay={0.2} />
        </div>
      </div>
    </section>
  );
}
