import { motion } from "motion/react";
import { FloatingSticker, Sticker } from "./FloatingSticker";
import { ArrowUpRight } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="py-24 px-6">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto bg-brand-lime rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 size-64 bg-brand-yellow/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 size-64 bg-brand-pink/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Left Column: Laptop Mockup */}
        <div className="flex-1 relative order-2 lg:order-1 w-full">
          <motion.div
            initial={{ rotate: 5, y: 50 }}
            whileInView={{ rotate: -5, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
             {/* Simple Laptop Representation */}
             <div className="relative mx-auto w-[90%] max-w-[450px] aspect-[1.6/1]">
                <div className="size-full bg-brand-black rounded-t-3xl p-2 border-4 border-gray-800 shadow-2xl relative overflow-hidden">
                   <div className="size-full bg-white rounded-t-2xl overflow-hidden p-4 relative flex items-center justify-center">
                      <div className="text-center">
                         <div className="size-12 bg-brand-orange rounded-xl mx-auto mb-3 flex items-center justify-center">
                            <ArrowUpRight className="size-6 text-white" />
                         </div>
                         <p className="font-bold text-lg text-brand-black uppercase tracking-tight">Marketplace <br /> Insights</p>
                      </div>
                   </div>
                </div>
                <div className="w-[110%] h-[12px] bg-gray-300 -ml-[5%] rounded-b-lg border-t-2 border-gray-400" />
             </div>
             
             {/* Stickers */}
             <FloatingSticker className="-top-10 left-10" rotate={-15}>
                <Sticker text="Verified" colorClass="bg-brand-black" />
             </FloatingSticker>
             <FloatingSticker className="bottom-10 -right-5" rotate={10}>
                <Sticker text="Global" colorClass="bg-brand-orange text-white" />
             </FloatingSticker>
             <FloatingSticker className="top-1/2 -left-10" rotate={20}>
                <Sticker text="Pro" colorClass="bg-brand-pink text-white" />
             </FloatingSticker>
          </motion.div>
        </div>

        {/* Right Column: Content */}
        <div className="flex-1 z-10 text-center lg:text-left order-1 lg:order-2">
          <h2 className="text-5xl md:text-6xl font-bold text-brand-black leading-[1.1] mb-8 tracking-tight">
            Access anything, <br /> anywhere.
          </h2>
          <p className="text-lg md:text-xl text-brand-black/70 font-medium mb-12 max-w-xl leading-relaxed">
            Our growing community lets you borrow the world, one neighborhood at a time. Reduce waste, save money, and meet your neighbors.
          </p>
          <button type="button" className="bg-brand-black text-white px-8 py-4 rounded-full font-bold text-base uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform flex items-center gap-3 mx-auto lg:mx-0 shadow-lg group">
            Explore Marketplace
            <div className="size-8 bg-brand-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight className="size-5" />
            </div>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
