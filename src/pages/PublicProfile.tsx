import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { userService } from "@/src/services/userService";
import { ItemCard } from "@/src/components/ItemCard";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { ReportModal } from "@/src/components/ReportModal";
import { ShieldCheck, MapPin, Store, Calendar, ArrowLeft, Flag } from "lucide-react";
import toast from "react-hot-toast";

export function PublicProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await userService.getPublicProfile(id!);
      setProfile(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "User not found");
      navigate("/marketplace");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="py-20"><LoadingSpinner /></div>;
  }

  if (!profile) return null;

  // Handle both the old flattened backend format and the new structured format
  const user = profile.user || profile;
  const listedItems = profile.listedItems || [];
  
  const isVerified = user.verificationStatus === 'verified';
  const isPartner = user.canListItems || user.partnerStatus === 'approved';
  
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-black font-bold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-4xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="h-32 md:h-48 bg-gradient-to-r from-gray-100 to-gray-200 w-full relative">
           {/* Report Button */}
           <button 
             onClick={() => setIsReportModalOpen(true)}
             className="absolute top-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur text-gray-500 hover:text-red-500 px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm"
           >
             <Flag className="w-3.5 h-3.5" /> Report User
           </button>
        </div>
        <div className="px-8 md:px-12 pb-10 relative">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-brand-black rounded-2xl border-4 border-white shadow-xl flex items-center justify-center -mt-12 md:-mt-16 mb-4 relative z-10 overflow-hidden">
             {user.avatar ? (
               <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
             ) : (
               <span className="text-brand-yellow font-black text-4xl md:text-5xl">{user.name.charAt(0)}</span>
             )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                {user.name}
                {isPartner && <Store className="w-6 h-6 text-brand-yellow" title="Approved Partner" />}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium text-gray-600">
                 {user.neighborhood && (
                   <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400"/> {user.neighborhood}</span>
                 )}
                 <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400"/> Member since {new Date(user.createdAt).getFullYear()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isVerified && (
                <div className="bg-green-50 text-green-600 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm">
                  <ShieldCheck className="w-5 h-5" /> Verified ID
                </div>
              )}
            </div>
          </div>
          
          {user.bio && (
            <div className="mt-8 pt-8 border-t border-gray-100 max-w-3xl">
              <h3 className="font-bold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600 leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items Grid */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-6">Items available to borrow ({listedItems?.length || 0})</h2>
        
        {!listedItems || listedItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
            <p className="text-gray-500 font-medium">This user hasn't listed any items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {listedItems.map((item: any) => (
                <ItemCard key={item._id} item={item} />
             ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        type="user" 
        targetId={user._id} 
        targetName={user.name} 
      />
    </div>
  );
}
