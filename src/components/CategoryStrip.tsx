import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { Star, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const PRODUCTS = [
  { name: "Sander", price: "6 €/day", rating: 4, user: "Marc", image: "https://res.cloudinary.com/duyq66vog/image/upload/v1780079583/download_6_jkyhte.jpg" },
  { name: "Pressure washer", price: "18 €/day", rating: 5, user: "Michelle", image: "https://res.cloudinary.com/duyq66vog/image/upload/v1780079678/download_8_cfci8e.jpg" },
  { name: "Carpet cleaner", price: "14 €/day", rating: 5, user: "Julie", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001" },
  { name: "Beer tap", price: "Free", rating: 5, user: "E. Leclerc Lille", image: "https://res.cloudinary.com/duyq66vog/image/upload/v1780079583/download_6_jkyhte.jpg" },
  { name: "Electric drill", price: "5 €/day", rating: 4.6, user: "Maxime", image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5" },
  { name: "Sander", price: "6 €/day", rating: 4, user: "Marc", image: "https://res.cloudinary.com/duyq66vog/image/upload/v1780079632/download_7_kzj9or.jpg" },
];

export function CategoryStrip() {
  return (
    <section className="py-24 bg-brand-bg overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative">
        {/* Floating Interactive Icons */}
        <motion.div 
           animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 5, 0] }}
           transition={{ duration: 4, repeat: Infinity }}
           className="absolute top-0 left-0 text-brand-black/20"
        >
          <Star className="size-8 fill-current" />
        </motion.div>
        <motion.div 
           animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }}
           transition={{ duration: 5, repeat: Infinity }}
           className="absolute top-10 right-0 text-brand-black/20"
        >
          <Sparkles className="size-10" />
        </motion.div>
        <motion.div 
           animate={{ y: [0, 10, -10, 0] }}
           transition={{ duration: 6, repeat: Infinity }}
           className="absolute -bottom-10 left-1/4 text-brand-black/20"
        >
          <Star className="size-6" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-5xl font-semibold max-w-5xl mx-auto tracking-tight [word-spacing:0.15em] leading-[1.2] text-brand-black mb-12"
        >
          Lendly is the go-to app for accessing 
          <span className="font-handwriting italic font-normal text-brand-orange">anything,</span> whenever <span className="font-handwriting italic font-normal text-brand-orange">you need it.</span>
        </motion.h2>
      </div>

      <div className="relative flex overflow-hidden py-10">
        <motion.div
          animate={{
            x: [0, -1000],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-8 whitespace-nowrap pl-8"
        >
          {PRODUCTS.map((prod, i) => (
            <ProductCard key={i} {...prod} />
          ))}
          {PRODUCTS.map((prod, i) => (
            <ProductCard key={`dup-${i}`} {...prod} />
          ))}
        </motion.div>
      </div>

      <div className="mt-12 text-center">
         <Link to="/marketplace" className="bg-brand-black text-white px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 mx-auto hover:scale-105 transition-all shadow-xl max-w-fit">
            <Search className="size-5" />
            Find what I need
         </Link>
         <p className="mt-8 text-gray-500 font-medium text-sm md:text-base max-w-2xl mx-auto px-6">
            With over <span className="font-bold text-brand-black">100,000 items</span> on Lendly, find everything <br className="hidden md:block" /> you need from your neighbors and nearby shops.
         </p>
      </div>
    </section>
  );
}

function ProductCard({ name, price, rating, user, image }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-3xl w-[220px] md:w-[260px] p-4 flex flex-col shadow-sm border border-brand-black/5 flex-shrink-0 group"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
         <img src={image} alt={name} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
         {/* Price Tag */}
         <div className={cn(
           "absolute top-2 right-2 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-lg",
           price === "Free" ? "bg-brand-orange text-white" : "bg-brand-pink text-[#7e0038]"
         )}>
           {price}
         </div>
         {/* Pro Badge */}
         <div className="absolute top-2 left-2 bg-white px-2 py-0.5 rounded-md text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-gray-100">
           Pro
         </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
         <h4 className="font-bold text-base md:text-lg text-brand-black truncate">{name}</h4>
         <div className="flex items-center gap-1">
            <Star className="w-3 md:w-4 h-3 md:h-4 fill-brand-yellow text-brand-yellow" />
            <span className="text-xs md:text-sm font-bold text-brand-black">{rating}</span>
         </div>
      </div>

      <div className="flex items-center gap-2 border-t pt-3">
         <div className="size-6 rounded-full bg-gray-200 overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`} alt="" loading="lazy" />
         </div>
         <span className="text-xs font-medium text-gray-500">{user}</span>
      </div>
    </motion.div>
  );
}
