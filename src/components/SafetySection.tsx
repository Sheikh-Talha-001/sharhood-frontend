import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Lock, Users, ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    title: "Verified identities",
    desc: "Every member of SharHood undergoes a multi-layer verification process including ID checks and community vetting.",
    color: "bg-brand-orange",
    icon: Shield,
    textColor: "text-white"
  },
  {
    title: "Secure transactions",
    desc: "Payments are held in escrow until the rental is successfully completed. We use bank-grade encryption for all financial data.",
    color: "bg-brand-yellow",
    icon: Lock,
    textColor: "text-brand-black"
  },
  {
    title: "Community reputation",
    desc: "Building trust through transparency. Our rating system ensures that great lenders and borrowers are rewarded.",
    color: "bg-brand-lime",
    icon: Users,
    textColor: "text-brand-black"
  }
];

export function SafetySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      
      cards.forEach((card, index) => {
        if (index === 0) return; // First card doesn't push

        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%", // Start early
            end: "top 20%",
            scrub: true,
            // markers: true,
          },
          y: -100 * index, // Slight overlap
          scale: 1 + (0.02 * index), // Subtle scale up as they stack
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 lg:py-40 px-6 max-w-7xl mx-auto">
      <div className="mb-20 text-center">
        <h2 className="text-5xl lg:text-6xl font-black mb-6">Trust & Safety</h2>
        <p className="text-xl font-medium text-gray-600">Your security is our top priority at SharHood.</p>
      </div>

      <div className="flex flex-col gap-6">
        {CARDS.map((card, i) => (
          <div
            key={i}
            ref={(el) => { if (el) cardsRef.current[i] = el; }}
            className={cn(
              "w-full rounded-[3rem] p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-12 sticky top-24 shadow-2xl transition-all duration-500",
              card.color,
              card.textColor
            )}
          >
            <div className="flex-1">
              <div className="size-20 rounded-3xl bg-black/10 backdrop-blur-md flex items-center justify-center mb-8">
                <card.icon className="size-10" />
              </div>
              <h3 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter">{card.title}</h3>
              <p className="text-xl font-medium opacity-80 max-w-2xl leading-relaxed mb-10">{card.desc}</p>
              
              <button type="button" className={cn(
                "px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all hover:gap-5",
                i === 0 ? "bg-white text-brand-orange" : "bg-brand-black text-white"
              )}>
                 Learn how we protect you
                 <ArrowRight className="size-5" />
              </button>
            </div>
            
            <div className="lg:w-1/3 hidden lg:flex items-center justify-center">
              {/* Abstract Illustration */}
              <div className="size-64 border-8 border-current opacity-20 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
