"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

export type FaqEntry = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-white/10 border-t border-white/10">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <li key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-start justify-between gap-6 py-5 text-left group"
            >
              <span className="text-white text-base md:text-lg font-medium leading-snug">
                {item.question}
              </span>
              <span
                className={`shrink-0 mt-1 text-white/60 transition-transform duration-300 ${
                  isOpen ? "rotate-45" : "rotate-0"
                }`}
              >
                <Plus size={20} />
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-3xl">
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
