import { TrendingUp } from "lucide-react";

export function TrustScoreCard() {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden h-full flex flex-col justify-center min-h-[280px]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        {/* Left Content */}
        <div className="flex-1">
          <h2 className="text-2xl font-black text-gray-900 mb-3">Neighborhood Trust Score</h2>
          <p className="text-gray-500 font-medium leading-relaxed mb-6 max-w-sm">
            Calculated based on item care, punctuality, and community feedback over 142 successful transactions.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">Reliable Borrower</span>
            <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">Top 5% Contributor</span>
            <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">Safe Lender</span>
          </div>
        </div>

        {/* Right Score Circle */}
        <div className="shrink-0 relative flex items-center justify-center">
          {/* Circular Progress SVG Background */}
          <div className="absolute inset-0 flex items-center justify-center">
             <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray="565" strokeDashoffset="28" strokeLinecap="round" transform="rotate(-90 100 100)" />
             </svg>
          </div>
          
          <div className="size-48 rounded-full flex flex-col items-center justify-center bg-white relative z-10">
            <span className="text-6xl font-black text-gray-900 tracking-tighter -mb-2">4.9</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Out of 5.0</span>
          </div>
          
          {/* Exceptional Badge */}
          <div className="absolute -top-4 right-0 bg-white border border-gray-100 shadow-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 z-20">
             <TrendingUp className="size-3.5 text-green-500" />
             <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Exceptional</span>
          </div>
        </div>
      </div>
    </div>
  );
}
