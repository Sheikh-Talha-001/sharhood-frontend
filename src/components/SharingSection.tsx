import { motion } from "motion/react";
import { Search, Send, ShieldCheck, MapPin, RefreshCcw } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Link } from "react-router-dom";

const STEPS = [
  {
    title: "Find nearby items",
    desc: "Search for specific items or browse categories available in your 1-mile radius.",
    icon: Search,
    color: "bg-brand-pink"
  },
  {
    title: "Request rental",
    desc: "Send a request to the lender with your desired dates and pick-up time.",
    icon: Send,
    color: "bg-brand-orange"
  },
  {
    title: "Verify identity",
    desc: "Our secure platform ensures everyone is verified for peace of mind.",
    icon: ShieldCheck,
    color: "bg-brand-yellow"
  },
  {
    title: "Meet safely",
    desc: "Coordinate a safe meeting point or drop-off location through our encrypted chat.",
    icon: MapPin,
    color: "bg-brand-lime"
  },
  {
    title: "Return item",
    desc: "Easily return the item after use and leave a review for the neighborhood.",
    icon: RefreshCcw,
    color: "bg-brand-pink"
  }
];

export function SharingSection() {
  return (
    <section className="py-32 lg:py-40 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-5xl lg:text-6xl font-black tracking-tight">How it works...</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left List */}
        <div>
        <div className="space-y-8">
          {STEPS.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 group cursor-pointer"
            >
              <div className={cn(
                "size-16 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                step.color
              )}>
                <step.icon className="size-8 text-white" />
              </div>
              <div className="pt-2">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-brand-orange transition-colors">{step.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Highlight Card */}
      <div className="flex items-center">
        <motion.div 
          initial={{ rotate: -5, scale: 0.9 }}
          whileInView={{ rotate: 3, scale: 1 }}
          viewport={{ once: true }}
          className="w-full bg-brand-yellow rounded-[4rem] p-12 lg:p-20 relative aspect-square flex flex-col justify-between shadow-2xl overflow-hidden"
        >
          {/* Background Illustration Simulation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-4 border-dashed border-brand-black opacity-10 rounded-full" />
          
          <div>
             <h3 className="text-5xl font-black leading-tight text-brand-black mb-6">Start your <br /> collection today.</h3>
             <p className="text-xl font-medium text-brand-black/70">Turn your unused items into neighborhood assets.</p>
          </div>

          <div className="relative">
             <div className="size-32 bg-brand-black rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                <div className="size-16 border-4 border-brand-lime rounded-full"></div>
             </div>
             <Link to="/about" className="bg-brand-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-lime hover:text-brand-black transition-all inline-block">
                Learn more
             </Link>
          </div>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
