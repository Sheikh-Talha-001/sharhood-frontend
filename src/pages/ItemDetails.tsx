import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Info, CheckCircle, Shield, Heart, Flag } from "lucide-react";
import { DashboardCard } from "@/src/components/DashboardCard";
import { TrustBadge } from "@/src/components/TrustBadge";
import { itemService, Item } from "@/src/services/itemService";
import { borrowRequestService } from "@/src/services/borrowRequestService";
import { LoadingSkeleton } from "@/src/components/LoadingSkeleton";
import { ReportModal } from "@/src/components/ReportModal";
import { toast } from "react-hot-toast";

export function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const handleSubmitRequest = async () => {
    if (!item) return;
    setIsSubmitting(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + requestDays);

      await borrowRequestService.create({
        item: item._id || item.id, // Backend expects 'item' not 'itemId'
        startDate: startDate.toISOString(),
        expectedReturnDate: endDate.toISOString(), // Backend expects 'expectedReturnDate' not 'endDate'
        message
      });
      toast.success("Request submitted successfully!");
      navigate('/dashboard'); // Navigate to dashboard on success
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="py-10"><LoadingSkeleton type="details" /></div>;
  if (error || !item) return <div className="py-20 text-center text-red-500 font-bold">{error || "Item not found"}</div>;

  const images = item.image ? [item.image] : (item.images && item.images.length > 0 ? item.images : ["https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1000&q=80"]);
  const isAvailable = item.availability !== undefined ? item.availability : (item.available !== undefined ? item.available : true);
  const owner = item.owner || { name: "Local User", isVerified: false, isPartner: false, memberSince: "2024" };
  const price = item.price || "Free";

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/dashboard/marketplace" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-black transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-4/3 rounded-4xl overflow-hidden bg-gray-100 border border-gray-100 relative group">
               <img src={images[activeImageIndex]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  {item.category}
               </div>
               <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10">
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
                    className={`w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-brand-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
             <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{item.title}</h1>
             <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600 mb-8">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {owner.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg font-bold text-gray-700 border border-gray-200">Condition: {item.condition}</span>
             </div>

             <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
             <p className="text-gray-600 leading-relaxed max-w-3xl font-medium">{item.description}</p>
          </div>

          <DashboardCard title="Item Specifications">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</span>
                <span className="text-base font-bold text-gray-900">{item.category}</span>
              </div>
              <div className="flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Condition</span>
                <span className="text-base font-bold text-gray-900">{item.condition}</span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Lender Rules & Agreements">
             <div className="space-y-6">
               <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                   <Shield className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-900 text-sm">Damage Protection</h4>
                   <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">ShareHood protects items up to $1,000 for verified transactions. Both parties must document the item's condition at handover.</p>
                 </div>
               </div>
               <div className="flex items-start gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                 <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
                   <Info className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-900 text-sm">Late Returns</h4>
                   <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">Late returns may incur a daily fee equivalent to 1.5x the rental rate. Communication is key—let the lender know if you're running late.</p>
                 </div>
               </div>
             </div>
          </DashboardCard>
        </div>

        {/* Right Column: Sticky Action Card & Owner Info */}
        <div className="space-y-6">
           <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 lg:sticky lg:top-28">
              <div className="flex justify-between items-start mb-8">
                 <div>
                   <span className="text-4xl font-black text-brand-black">{price}</span>
                   <span className="block text-sm font-bold text-gray-500 mt-1">per day</span>
                 </div>
                 {isAvailable ? (
                   <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-200">Available Now</span>
                 ) : (
                   <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-200">Currently Borrowed</span>
                 )}
              </div>

              {!isRequesting ? (
                <button 
                  disabled={!isAvailable}
                  onClick={() => setIsRequesting(true)}
                  className="w-full bg-brand-yellow text-brand-black font-bold py-4 rounded-2xl hover:bg-brand-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:hover:bg-brand-yellow disabled:hover:text-brand-black mb-4 flex items-center justify-center gap-2 shadow-sm text-lg"
                >
                  <Calendar className="w-5 h-5" /> Request to Borrow
                </button>
              ) : (
                <div className="space-y-5 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                   <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                      <label className="block text-sm font-bold text-gray-900 mb-3">Duration Request</label>
                      <select 
                        value={requestDays} 
                        onChange={(e) => setRequestDays(Number(e.target.value))}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-bold text-sm cursor-pointer shadow-sm">
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
                     className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all resize-none h-28 shadow-sm" 
                   />

                   <label className="flex items-start gap-3 cursor-pointer group bg-brand-yellow/10 p-4 rounded-2xl border border-brand-yellow/20 hover:bg-brand-yellow/20 transition-colors">
                     <div className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreed ? "border-brand-black bg-brand-black text-brand-yellow" : "border-brand-black/20 bg-white"}`}>
                        {agreed && <CheckCircle className="w-3.5 h-3.5 outline-none border-none" />}
                     </div>
                     <span className="text-xs font-medium text-gray-800 leading-relaxed">
                       I agree to ShareHood's <a href="#" className="font-bold underline hover:text-brand-black">Terms of Service</a> and the lender's rules. I am responsible for damages and late fees.
                     </span>
                     <input type="checkbox" className="hidden" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                   </label>

                   <div className="flex gap-3 pt-2">
                     <button onClick={() => setIsRequesting(false)} className="flex-1 px-4 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">Cancel</button>
                     <button onClick={handleSubmitRequest} disabled={!agreed || isSubmitting} className="flex-1 px-4 py-3.5 bg-brand-black text-brand-yellow font-bold rounded-xl hover:bg-gray-900 transition-all text-sm disabled:opacity-50 shadow-sm">{isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
                   </div>
                </div>
              )}

              <p className="text-xs text-center font-medium text-gray-500 mt-6 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> You won't be charged yet. The lender must approve.
              </p>
           </div>

           <DashboardCard title="Meet the Lender">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-black text-gray-600 border-2 border-white shadow-sm ring-1 ring-gray-100">
                    {owner.name.charAt(0)}
                 </div>
                 <div>
                   <h4 className="font-bold text-lg text-gray-900">{owner.name}</h4>
                   <p className="text-sm font-medium text-gray-500">Member since {owner.memberSince}</p>
                 </div>
              </div>
              <div className="flex flex-col gap-2 mb-6">
                 {owner.isVerified && <TrustBadge type="verified" />}
                 {owner.isPartner && <TrustBadge type="partner" />}
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between text-sm">
                 <span className="font-bold text-gray-600">Borrow Requests</span>
                 <span className="font-black text-brand-black bg-white px-3 py-1 rounded-lg shadow-sm">{item.borrowRequestCount || 0}</span>
              </div>
            </DashboardCard>
            
            {/* Report Button */}
            <div className="text-center mt-4">
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors inline-flex items-center gap-1.5"
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
