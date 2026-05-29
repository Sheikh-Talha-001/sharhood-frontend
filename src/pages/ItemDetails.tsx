import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Info, CheckCircle, Shield, Heart, Flag } from "lucide-react";
import { TrustBadge } from "@/src/components/TrustBadge";
import { itemService, Item } from "@/src/services/itemService";
import { borrowRequestService } from "@/src/services/borrowRequestService";
import { LoadingSkeleton } from "@/src/components/LoadingSkeleton";
import { ReportModal } from "@/src/components/ReportModal";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "react-hot-toast";

export function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [isRequesting, setIsRequesting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [requestDays, setRequestDays] = useState(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await itemService.getById(id);
        setItem(response.data);
      } catch (err) {
        setError("Item not found or an error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleAuthAction = (action: () => void) => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
    } else {
      action();
    }
  };

  const handleSubmitRequest = async () => {
    if (!item || !user) return;
    setIsSubmitting(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + requestDays);

      await borrowRequestService.create({
        item: item._id || item.id,
        startDate: startDate.toISOString(),
        expectedReturnDate: endDate.toISOString(),
        message
      });
      toast.success("Request submitted successfully!");
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="py-10 max-w-5xl mx-auto"><LoadingSkeleton type="details" /></div>;
  if (error || !item) return <div className="py-20 text-center text-[#7e0038] font-semibold">{error || "Item not found"}</div>;

  const images = item.image ? [item.image] : (item.images && item.images.length > 0 ? item.images : ["https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1000&q=80"]);
  const isAvailable = item.availability !== undefined ? item.availability : (item.available !== undefined ? item.available : true);
  const owner = item.owner || { name: "Local User", isVerified: false, isPartner: false, memberSince: "2024" };
  const price = item.price || "Free";

  return (
    <div className="max-w-5xl mx-auto pb-12 px-4 sm:px-6 font-sans bg-[#ffffff] min-h-screen">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-[#333333] hover:text-[#7e0038] transition-colors mb-6 pt-6">
        <ArrowLeft className="w-4 h-4" /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#fcf3ec] border border-[#e5e5e5] relative group">
               <img src={images[activeImageIndex]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute top-4 left-4 bg-[#fcf3ec] px-4 py-2 rounded-xl text-sm font-semibold text-[#7e0038] border border-[#7e0038]/20 tracking-wide uppercase shadow-none">
                  {item.category}
               </div>
               <button className="absolute top-4 right-4 w-10 h-10 bg-[#ffffff] border border-[#e5e5e5] rounded-full flex items-center justify-center text-[#333333] hover:text-[#7e0038] hover:border-[#7e0038] transition-colors z-10 shadow-none">
                 <Heart className="w-5 h-5" />
               </button>
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-[#7e0038] opacity-100' : 'border-[#e5e5e5] opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
             <h1 className="text-4xl font-semibold text-[#241d1b] mb-4 tracking-tight leading-tight">{item.title}</h1>
             <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#333333] mb-8">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {owner.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#e5e5e5]" />
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fcf3ec] rounded-lg font-semibold text-[#241d1b] border border-[#e5e5e5] capitalize">Condition: {item.condition}</span>
             </div>

             <h2 className="text-xl font-semibold text-[#241d1b] mb-4">Description</h2>
             <p className="text-[#333333] leading-relaxed max-w-3xl font-medium">{item.description}</p>
          </div>

          <div className="border border-[#e5e5e5] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#e5e5e5] bg-[#fcf3ec]/50">
              <h3 className="font-semibold text-[16px] text-[#241d1b]">Item Specifications</h3>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#ffffff]">
              <div className="flex flex-col p-4 bg-[#fcf3ec] rounded-xl border border-[#e5e5e5]">
                <span className="text-xs font-semibold text-[#333333] uppercase tracking-wider mb-1">Category</span>
                <span className="text-[16px] font-semibold text-[#241d1b] capitalize">{item.category}</span>
              </div>
              <div className="flex flex-col p-4 bg-[#fcf3ec] rounded-xl border border-[#e5e5e5]">
                <span className="text-xs font-semibold text-[#333333] uppercase tracking-wider mb-1">Condition</span>
                <span className="text-[16px] font-semibold text-[#241d1b] capitalize">{item.condition}</span>
              </div>
            </div>
          </div>

          <div className="border border-[#e5e5e5] rounded-2xl overflow-hidden">
             <div className="p-5 border-b border-[#e5e5e5] bg-[#fcf3ec]/50">
               <h3 className="font-semibold text-[16px] text-[#241d1b]">Lender Rules & Agreements</h3>
             </div>
             <div className="p-5 space-y-6 bg-[#ffffff]">
               <div className="flex items-start gap-4 p-4 bg-[#fcf3ec] rounded-xl border border-[#e5e5e5]">
                 <div className="w-10 h-10 rounded-full bg-[#ffffff] border border-[#e5e5e5] flex items-center justify-center shrink-0 text-[#10664c]">
                   <Shield className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-[#241d1b] text-sm">Damage Protection</h4>
                   <p className="text-sm text-[#333333] font-medium mt-1 leading-relaxed">ShareHood protects items up to $1,000 for verified transactions. Both parties must document the item's condition at handover.</p>
                 </div>
               </div>
               <div className="flex items-start gap-4 p-4 bg-[#fcf3ec] rounded-xl border border-[#e5e5e5]">
                 <div className="w-10 h-10 rounded-full bg-[#ffffff] border border-[#e5e5e5] flex items-center justify-center shrink-0 text-[#7e0038]">
                   <Info className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-[#241d1b] text-sm">Late Returns</h4>
                   <p className="text-sm text-[#333333] font-medium mt-1 leading-relaxed">Late returns may incur a daily fee equivalent to 1.5x the rental rate. Communication is key—let the lender know if you're running late.</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Sticky Action Card & Owner Info */}
        <div className="space-y-6">
           <div className="bg-[#ffffff] rounded-2xl p-6 md:p-8 border border-[#e5e5e5] shadow-none">
              <div className="flex justify-between items-start mb-8">
                 <div>
                   <span className="text-4xl font-semibold text-[#241d1b]">{price}</span>
                   <span className="block text-sm font-semibold text-[#333333] mt-1">per day</span>
                 </div>
                 {isAvailable ? (
                   <span className="bg-[#10664c]/10 text-[#10664c] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#10664c]/20">Available Now</span>
                 ) : (
                   <span className="bg-[#241d1b]/10 text-[#241d1b] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#241d1b]/20">Currently Borrowed</span>
                 )}
              </div>

              {!isRequesting ? (
                <button 
                  disabled={!isAvailable}
                  onClick={() => handleAuthAction(() => setIsRequesting(true))}
                  className="w-full bg-[#7e0038] text-[#ffffff] font-semibold py-4 rounded-xl hover:bg-[#241d1b] transition-all duration-300 disabled:opacity-50 disabled:hover:bg-[#7e0038] mb-4 flex items-center justify-center gap-2 shadow-none text-[16px]"
                >
                  <Calendar className="w-5 h-5" /> {user ? "Request to Borrow" : "Login to Request"}
                </button>
              ) : (
                <div className="space-y-5 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                   <div className="bg-[#fcf3ec] p-5 rounded-xl border border-[#e5e5e5]">
                      <label className="block text-sm font-semibold text-[#241d1b] mb-3">Duration Request</label>
                      <select 
                        value={requestDays} 
                        onChange={(e) => setRequestDays(Number(e.target.value))}
                        className="w-full bg-[#ffffff] border border-[#e5e5e5] rounded-xl px-4 py-3.5 outline-none focus:border-[#7e0038] transition-all font-semibold text-sm cursor-pointer shadow-none">
                         <option value={1}>1 Day</option>
                         <option value={3}>3 Days</option>
                         <option value={7}>1 Week</option>
                         <option value={14}>2 Weeks</option>
                      </select>
                   </div>
                   
                   <textarea 
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     placeholder="Message to lender (e.g. When can you meet?)" 
                     className="w-full bg-[#fcf3ec] border border-[#e5e5e5] rounded-xl px-5 py-4 text-sm font-medium outline-none focus:border-[#7e0038] transition-all resize-none h-28 shadow-none" 
                   />

                   <label className="flex items-start gap-3 cursor-pointer group bg-[#fcf3ec] p-4 rounded-xl border border-[#e5e5e5] hover:border-[#7e0038]/50 transition-colors">
                     <div className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreed ? "border-[#7e0038] bg-[#7e0038] text-[#ffffff]" : "border-[#e5e5e5] bg-[#ffffff]"}`}>
                        {agreed && <CheckCircle className="w-3.5 h-3.5 outline-none border-none" />}
                     </div>
                     <span className="text-xs font-medium text-[#333333] leading-relaxed">
                       I agree to ShareHood's <a href="#" className="font-semibold underline hover:text-[#241d1b]">Terms of Service</a> and the lender's rules. I am responsible for damages and late fees.
                     </span>
                     <input type="checkbox" className="hidden" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                   </label>

                   <div className="flex gap-3 pt-2">
                     <button onClick={() => setIsRequesting(false)} className="flex-1 px-4 py-3.5 bg-[#fcf3ec] text-[#333333] font-semibold rounded-xl hover:bg-[#e5e5e5] hover:text-[#241d1b] transition-colors text-sm border border-[#e5e5e5]">Cancel</button>
                     <button onClick={handleSubmitRequest} disabled={!agreed || isSubmitting} className="flex-1 px-4 py-3.5 bg-[#7e0038] text-[#ffffff] font-semibold rounded-xl hover:bg-[#241d1b] transition-all text-sm disabled:opacity-50 shadow-none border border-[#7e0038]">{isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
                   </div>
                </div>
              )}

              <p className="text-xs text-center font-medium text-[#333333] mt-6 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> You won't be charged yet. The lender must approve.
              </p>
           </div>

           <div className="bg-[#ffffff] rounded-2xl border border-[#e5e5e5] shadow-none overflow-hidden">
              <div className="p-5 border-b border-[#e5e5e5] bg-[#fcf3ec]/50">
                 <h3 className="font-semibold text-[16px] text-[#241d1b]">Meet the Lender</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-16 h-16 bg-[#fcf3ec] rounded-full flex items-center justify-center text-xl font-semibold text-[#241d1b] border border-[#e5e5e5]">
                      {owner.name.charAt(0)}
                   </div>
                   <div>
                     <h4 className="font-semibold text-lg text-[#241d1b]">{owner.name}</h4>
                     <p className="text-sm font-medium text-[#333333]">Member since {owner.memberSince}</p>
                   </div>
                </div>
                <div className="flex flex-col gap-2 mb-6">
                   {owner.isVerified && (
                     <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10664c] bg-[#10664c]/10 px-3 py-1.5 rounded-lg border border-[#10664c]/20 w-fit">
                       <Shield className="w-3.5 h-3.5" /> Verified Identity
                     </div>
                   )}
                   {owner.isPartner && (
                     <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7e0038] bg-[#7e0038]/10 px-3 py-1.5 rounded-lg border border-[#7e0038]/20 w-fit">
                       <CheckCircle className="w-3.5 h-3.5" /> Approved Partner
                     </div>
                   )}
                </div>
                
                <button 
                  onClick={() => handleAuthAction(() => navigate(`/users/${owner._id || owner.id}`))}
                  className="block w-full py-3 text-center bg-[#fcf3ec] hover:bg-[#e5e5e5] text-[#241d1b] font-semibold rounded-xl transition-colors text-sm mb-6 border border-[#e5e5e5]"
                >
                  View Public Profile
                </button>
                <div className="bg-[#fcf3ec] p-4 rounded-xl border border-[#e5e5e5] flex items-center justify-between text-sm">
                   <span className="font-semibold text-[#333333]">Active Listings</span>
                   <span className="font-semibold text-[#241d1b] bg-[#ffffff] border border-[#e5e5e5] px-3 py-1 rounded-lg">{item.borrowRequestCount || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Report Button */}
            <div className="text-center mt-4">
              <button 
                onClick={() => handleAuthAction(() => setIsReportModalOpen(true))}
                className="text-sm font-semibold text-[#333333] hover:text-[#7e0038] transition-colors inline-flex items-center gap-1.5"
              >
                <Flag className="w-4 h-4" /> Report this listing
              </button>
            </div>
         </div>

      </div>

      {/* Report Modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        type="item" 
        targetId={item._id || item.id} 
        targetName={item.title} 
      />
    </div>
  );
}
