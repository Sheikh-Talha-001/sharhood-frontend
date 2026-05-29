import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FloatingSticker, Sticker } from "./FloatingSticker";

export function CTA() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto bg-brand-black rounded-[2.5rem] md:rounded-[4rem] px-6 py-20 sm:p-20 md:p-32 text-center relative overflow-hidden">
        {/* Floating stickers for the CTA - cornered on mobile/tablet to increase space to text */}
        <FloatingSticker className="top-6 left-6 md:top-20 md:left-10" rotate={-15} duration={5}>
           <Sticker text="Join 50k+ Neighbors" colorClass="bg-brand-orange" />
        </FloatingSticker>
        <FloatingSticker className="bottom-6 right-6 md:bottom-20 md:right-10" rotate={10} duration={6}>
           <Sticker text="List for Free" colorClass="bg-brand-lime !text-brand-black" />
        </FloatingSticker>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="relative z-10"
        >
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 md:mb-10 leading-tight">
             Start renting <br /> smarter today.
          </h2>
          <p className="text-base sm:text-xl text-gray-400 font-medium mb-10 md:mb-16 max-w-2xl mx-auto leading-relaxed">
             Join thousands of people who are saving money and building community by sharing what they own.
          </p>
          <div className="flex gap-3 sm:gap-6 w-full justify-center">
             <Link to="/marketplace" className="flex-1 sm:flex-initial bg-brand-lime text-brand-black px-4 sm:px-12 py-4 sm:py-6 rounded-full font-black text-xs sm:text-base md:text-xl uppercase tracking-wider sm:tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-4">
                Explore Marketplace
                <ArrowRight className="size-4 sm:size-6" />
             </Link>
             <Link to="/become-partner" className="flex-1 sm:flex-initial bg-white text-brand-black px-4 sm:px-12 py-4 sm:py-6 rounded-full font-black text-xs sm:text-base md:text-xl uppercase tracking-wider sm:tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
                Become a Lender
             </Link>
          </div>
        </motion.div>

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-brand-orange/20 via-transparent to-brand-lime/20 rounded-full blur-[120px]" />
      </div>
    </section>
  );
}
