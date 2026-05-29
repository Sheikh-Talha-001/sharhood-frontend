import { ShieldCheck } from "lucide-react";

export function MarketplaceHero() {
  return (
    <div className="bg-[#241d1b] rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-none mb-8 flex flex-col md:flex-row items-center justify-between gap-8 font-sans">
      {/* Minimal clean background */}
      
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
           <ShieldCheck className="size-5 text-[#10664c]" />
           <span className="text-[#10664c] font-semibold text-sm tracking-wide uppercase">Community-Powered Lending</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-[#ffffff] mb-4 tracking-tight leading-tight">
          Borrow safely from verified neighbors.
        </h1>
        <p className="text-[#fcf3ec] font-medium text-lg md:text-xl leading-relaxed opacity-80">
          Discover tools, camping gear, electronics, and more available right in your neighborhood.
        </p>
      </div>

      <div className="relative z-10 w-full md:w-auto flex shrink-0">
         <div className="bg-[#ffffff]/10 border border-[#ffffff]/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-[#ffffff] font-semibold text-xl mb-1">1,000+ Items</h3>
            <p className="text-[#fcf3ec] text-sm font-medium opacity-80">Available Nearby</p>
         </div>
      </div>
    </div>
  );
}
