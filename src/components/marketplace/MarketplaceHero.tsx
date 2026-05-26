import { ShieldCheck } from "lucide-react";

export function MarketplaceHero() {
  return (
    <div className="bg-brand-black rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
      
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
           <ShieldCheck className="w-5 h-5 text-green-400" />
           <span className="text-green-400 font-bold text-sm tracking-wide uppercase">Community-Powered Lending</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
          Borrow safely from verified neighbors.
        </h1>
        <p className="text-gray-400 font-medium text-lg md:text-xl leading-relaxed">
          Discover tools, camping gear, electronics, and more available right in your neighborhood.
        </p>
      </div>

      <div className="relative z-10 w-full md:w-auto flex shrink-0">
         <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-white font-bold text-xl mb-1">1,000+ Items</h3>
            <p className="text-gray-400 text-sm font-medium">Available Nearby</p>
         </div>
      </div>
    </div>
  );
}
