import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

const TESTIMONIALS = [
  {
    quote: "The best thing to happen to our neighborhood in years.",
    author: "Jordan L.",
    bg: "bg-brand-pink",
    size: "lg"
  },
  {
    quote: "I've made $500 this month just lending out my lawnmower.",
    author: "Chris P.",
    bg: "bg-brand-yellow",
    size: "sm"
  },
  {
    quote: "Verified and safe. I never worry about my gear.",
    author: "Maya W.",
    bg: "bg-brand-orange",
    size: "md"
  },
  {
    quote: "Sustainability made simple. Why buy when you can rent?",
    author: "Leaf T.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    bg: "bg-brand-lime",
    size: "md"
  },
  {
    quote: "Found a power washer for $15! Projects are finally getting done.",
    author: "Tom B.",
    bg: "bg-brand-yellow",
    size: "sm"
  },
  {
    quote: "Community is key. SharHood makes it easy to connect.",
    author: "Sarah G.",
    bg: "bg-brand-pink",
    size: "lg"
  }
];

export function Testimonials() {
  return (
    <section className="py-32 lg:py-40 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-20 text-center">
         <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-8">Voices of <br /> the Hood</h2>
         <div className="size-24 bg-brand-yellow rounded-full flex items-center justify-center animate-bounce">
            <span className="text-3xl">💬</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.author}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn(
               "p-10 rounded-[3rem] flex flex-col justify-between shadow-lg relative overflow-hidden",
               t.bg,
               t.size === 'lg' ? 'row-span-2' : ''
            )}
          >
             {t.image && (
                <img src={t.image} className="absolute inset-0 size-full object-cover opacity-20 multiply" alt="" />
             )}
             <p className="text-2xl font-bold leading-tight mb-12 relative z-10 italic">"{t.quote}"</p>
             <div className="flex items-center gap-4 relative z-10">
                <div className="size-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center font-bold">
                   {t.author.charAt(0)}
                </div>
                <span className="font-black text-lg uppercase tracking-widest">{t.author}</span>
             </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
