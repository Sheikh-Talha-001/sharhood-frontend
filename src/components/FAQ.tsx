import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "How does verification work?",
    a: "We partner with Stripe Identity to verify every user's government ID and facial biometrics before they can list or rent items."
  },
  {
    q: "What happens if an item gets damaged?",
    a: "Every rental is covered by SharHood Protection. Lenders are protected up to $5,000 for item damage or loss."
  },
  {
    q: "Are payments secure?",
    a: "Yes, we use bank-level encryption. Lenders receive payments directly to their connected bank account 24 hours after a successful return."
  },
  {
    q: "How do rentals work?",
    a: "Just search, request, pay, and meet! Lenders and borrowers communicate via our secure in-app chat to coordinate hand-off."
  },
  {
    q: "Can businesses join?",
    a: "Absolutely. Local rental shops often use SharHood to reach more neighbors and manage their inventory digitally."
  }
];

export function FAQ() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-32 lg:py-40 px-6 max-w-4xl mx-auto">
      <h2 className="text-5xl lg:text-6xl font-black text-center mb-20 underline decoration-brand-lime decoration-8 underline-offset-8">Common Questions</h2>
      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="border-b-2 border-brand-black/5 last:border-0">
            <button type="button"
              onClick={() => setActive(active === i ? null : i)}
              className="w-full flex items-center justify-between py-8 text-left group"
            >
              <span className="text-xl md:text-2xl font-bold group-hover:text-brand-orange transition-colors">{faq.q}</span>
              <div className="bg-brand-black text-white p-2 rounded-full transform transition-transform group-hover:rotate-90">
                {active === i ? <Minus className="size-6" /> : <Plus className="size-6" />}
              </div>
            </button>
            <AnimatePresence>
              {active === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="pb-8 text-lg text-gray-600 font-medium leading-relaxed leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
