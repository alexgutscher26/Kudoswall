"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

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
    <div className="flex flex-col gap-4">
      {items.map((faq, index) => (
        <div
          key={faq.question}
          className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all hover:border-neutral-200"
        >
          <button
            type="button"
            className="flex w-full items-center justify-between px-6 py-5 text-left"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="text-base font-semibold text-neutral-900">{faq.question}</span>
            {openIndex === index ? (
              <Minus className="size-5 text-neutral-400" />
            ) : (
              <Plus className="size-5 text-neutral-400" />
            )}
          </button>
          {openIndex === index && (
            <div className="border-t border-neutral-50 px-6 py-5">
              <p className="text-sm leading-relaxed text-neutral-500">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
