import { motion } from "motion/react";
import { FloatingSticker, Sticker } from "./FloatingSticker";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen pt-40 pb-20 pl-14 pr-4 overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 font-semibold gap-20 items-center">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-20"
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl leading-[1.2] tracking-tight [word-spacing:0.15em] text-brand-black mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Everything <br />
            we need, is <br />
            already <span className="font-handwriting text-brand-orange italic font-semibold">nearby.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-700 max-w-md mb-10 leading-relaxed font-normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            SharHood is the peer-to-peer marketplace that connects you with people in your neighborhood to rent anything from tools to tech.
          </motion.p>

          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button className="bg-brand-yellow text-brand-black px-10 py-5 rounded-full font-medium text-lg flex items-center gap-2 hover:bg-brand-black hover:text-white transition-all group shadow-xl shadow-brand-yellow/20">
              Explore Rentals
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent text-brand-black px-10 py-5 rounded-full font-medium border-2 border-brand-black text-lg flex items-center gap-2 hover:bg-brand-black hover:text-white transition-all">
              List Your Item
            </button>
          </motion.div>
        </motion.div>

        {/* Right Visuals - Laptop Mockup */}
        <div className="relative z-10 h-[500px] md:h-[600px] flex items-center justify-center pr-18">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 w-full"
          >
            {/* Simple Laptop Representation */}
            <div className="relative mx-auto w-[90%] max-w-[600px] aspect-[1.6/1]">
              <div className="w-full h-full bg-brand-black rounded-t-3xl p-3 border-4 border-gray-800 shadow-2xl relative overflow-hidden">
                <div className="w-full h-full bg-white rounded-t-2xl overflow-hidden p-4 relative">
                  {/* Laptop Screen Content UI */}
                  
                  <div className="w-full h-full rounded-lg overflow-hidden border border-gray-100 shadow-inner">
                    <img 
                      src="https://res.cloudinary.com/duyq66vog/image/upload/v1779208535/sharehood_discovery_dashboard_-_Copy_gfbvuo.png" 
                      className="w-full h-full object-cover object-top" 
                      alt="ShareHood Discovery Dashboard" 
                    />
                  </div>
                </div>
              </div>
              <div className="w-[110%] h-[15px] bg-gray-300 -ml-[5%] rounded-b-xl border-t-2 border-gray-400" />
            </div>

            {/* Floating Stickers around Laptop */}
            <FloatingSticker className="-top-12 right-[10%]" rotate={-15} duration={5}>
              <Sticker text="DIY tools" colorClass="bg-[#7e0038]" className="text-white" />
            </FloatingSticker>
            <FloatingSticker className="top-10 -right-10" rotate={10} duration={6} delay={1}>
              <Sticker text="Sports" colorClass="bg-brand-orange" />
            </FloatingSticker>
            <FloatingSticker className="top-25 -right-20" rotate={5} duration={4.5} delay={0.5}>
              <Sticker text="Events" colorClass="bg-[#fcf3ec] !text-[#7e0038]" />
            </FloatingSticker>
            <FloatingSticker className="bottom-15 -right-20" rotate={15} duration={5.5} delay={2}>
              <Sticker text="Babies" colorClass="bg-brand-pink" />
            </FloatingSticker>
            <FloatingSticker className="bottom-0 -right-16" rotate={-10} duration={4} delay={1.5}>
              <Sticker text="Hobbies" colorClass="bg-[#10664c] text-[#D7FF00]" />
            </FloatingSticker>
             <FloatingSticker className="-bottom-20 right-0" rotate={5} duration={6} delay={0.8}>
              <Sticker text="Gardening" colorClass="bg-brand-yellow !text-[#7e0038]" />
            </FloatingSticker>
          </motion.div>

          {/* Background Decorative Shapes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/10 rounded-full blur-[100px] -z-10" />
        </div>
      </div>
    </section>
  );
}
