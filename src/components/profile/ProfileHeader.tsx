import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "@/src/context/AuthContext";
import { VerificationBadge } from "@/src/components/VerificationBadge";

interface Props {
  user: User | null;
}

export function ProfileHeader({ user }: Props) {
  // Fallbacks if data is missing
  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'September 2022';
    
  const name = user?.name || "Neighbor";
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center w-full mb-10">
      {/* Avatar Container with Badge */}
      <div className="relative shrink-0">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-brand-yellow flex items-center justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl md:text-5xl font-black text-brand-black">{initials}</span>
          )}
        </div>
        {user?.verificationStatus === "verified" && (
          <div className="absolute -bottom-2 -right-2">
            <VerificationBadge showText={false} />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl md:text-4xl font-black text-brand-black tracking-tight">{name}</h1>
          {user?.verificationStatus === "verified" && (
             <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
               Verified Neighbor
             </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm md:text-base mb-6">
          <MapPin className="w-4 h-4" />
          <span>San Francisco, CA</span>
          <span className="mx-1">•</span>
          <span>Joined {joinDate}</span>
        </div>

        <div className="flex items-center gap-8 md:gap-12">
           <div className="flex flex-col">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Response Rate</span>
             <span className="text-lg font-black text-gray-900">99%</span>
           </div>
           <div className="h-8 border-r border-gray-200"></div>
           <div className="flex flex-col">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Shares</span>
             <span className="text-lg font-black text-gray-900">142</span>
           </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full md:w-auto gap-4 mt-4 md:mt-0">
        <Link to="/dashboard/profile/edit" className="flex-1 md:flex-none px-6 py-3 text-center rounded-full border-2 border-gray-200 text-brand-black font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-colors">
          Edit Profile
        </Link>
        <button className="flex-1 md:flex-none px-6 py-3 rounded-full bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors shadow-sm shadow-green-500/20 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Share Profile
        </button>
      </div>
    </div>
  );
}
