import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { User } from "@/src/context/AuthContext";

interface Props {
  user: User | null;
}

export function DashboardHero({ user }: Props) {
  const firstName = user?.name?.split(' ')[0] || 'Neighbor';

  return (
    <div className="bg-brand-black rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-lg mb-8">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="text-white max-w-xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Welcome back, {firstName} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg leading-relaxed mb-6">
            Here's what's happening in your neighborhood today. Discover new items to borrow or manage your active requests.
          </p>
          <div className="flex items-center gap-3">
             <div className="bg-green-500/20 border border-green-500/30 px-3 py-1.5 rounded-full flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-green-400" />
               <span className="text-green-400 text-xs font-bold uppercase tracking-wide">
                 {user?.verificationStatus === "verified" ? "Verified Neighbor" : "Account Active"}
               </span>
             </div>
          </div>
        </div>

        <div className="shrink-0">
          <Link 
            to="/dashboard/marketplace" 
            className="bg-brand-yellow text-brand-black px-8 py-4 rounded-full font-black text-lg hover:bg-white hover:scale-105 transition-all shadow-xl shadow-brand-yellow/20 flex items-center gap-3"
          >
            Browse Items
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
