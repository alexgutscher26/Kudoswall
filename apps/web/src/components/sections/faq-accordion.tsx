"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FAQItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-neutral-900 [text-wrap:balance]">
                {faq.question}
              </span>
              <CaretDown
                className={`size-4 shrink-0 text-neutral-500 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                weight="bold"
              />
            </button>
            {isOpen && (
              <div className="border-t border-neutral-100 px-6 py-4">
                <p className="text-sm leading-relaxed text-neutral-600 [text-wrap:pretty]">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
