import { motion } from "motion/react";
import { Star, Heart, MessageCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

const REVIEWS = [
  {
    name: "Alex M.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    text: "Saved $200 renting a drill for my weekend project. So easy!",
    rating: 5,
    tag: "DIY Enthusiast"
  },
  {
    name: "Sarah J.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
    text: "Rented a professional camera for my trip. The process was seamless.",
    rating: 5,
    tag: "Photographer"
  },
  {
    name: "David R.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
    text: "Meeting my neighbors while sharing items is the best part of SharHood.",
    rating: 5,
    tag: "Community Lead"
  },
  {
    name: "Elena K.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    text: "My camping trip was a success thanks to the high-quality gear I rented.",
    rating: 5,
    tag: "Outdoor Guide"
  }
];

export function TrustSection() {
  return (
    <section className="py-32 lg:py-40 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl tracking-tight [word-spacing:0.15em] leading-[1.2] font-semibold mb-6 tracking-tight"
        >
          Rent the right items <br />
          at the right time. <br />
          <span className="font-handwriting italic font-normal text-brand-orange">It's that simple.</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {REVIEWS.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-200 shadow-xl relative">
              <img 
                src={review.image} 
                alt={review.name} 
                className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay Tags */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {review.tag}
                </div>
                <div className="bg-black/50 backdrop-blur-md p-2 rounded-full text-white">
                  <Heart className="size-4" />
                </div>
              </div>

              {/* Interaction Icons Floating */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-none"
              >
                <div className="size-10 bg-brand-lime rounded-full flex items-center justify-center shadow-lg">
                   <Star className="size-5 fill-current text-brand-black" />
                </div>
                <div className="size-10 bg-brand-orange rounded-full flex items-center justify-center shadow-lg">
                   <MessageCircle className="size-5 text-white" />
                </div>
              </motion.div>

              {/* User Info Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-bold text-lg mb-1">{review.name}</p>
                <p className="text-sm opacity-90 leading-tight italic">"{review.text}"</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
