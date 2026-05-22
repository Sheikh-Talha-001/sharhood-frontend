import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { FloatingSticker, Sticker } from "./FloatingSticker";

export function CTA() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto bg-brand-black rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden">
        {/* Floating stickers for the CTA */}
        <FloatingSticker className="top-20 left-10" rotate={-15} duration={5}>
           <Sticker text="Join 50k+ Neighbors" colorClass="bg-brand-orange" />
        </FloatingSticker>
        <FloatingSticker className="bottom-20 right-10" rotate={10} duration={6}>
           <Sticker text="List for Free" colorClass="bg-brand-lime !text-brand-black" />
        </FloatingSticker>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight">
             Start renting <br /> smarter today.
          </h2>
          <p className="text-xl text-gray-400 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
             Join thousands of people who are saving money and building community by sharing what they own.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
             <button className="bg-brand-lime text-brand-black px-12 py-6 rounded-full font-black text-xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                Explore Marketplace
                <ArrowRight className="w-6 h-6" />
             </button>
             <button className="bg-white text-brand-black px-12 py-6 rounded-full font-black text-xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                Become a Lender
             </button>
          </div>
        </motion.div>

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-brand-orange/20 via-transparent to-brand-lime/20 rounded-full blur-[120px]" />
      </div>
    </section>
  );
}
