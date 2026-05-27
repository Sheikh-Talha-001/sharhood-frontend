import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardCard } from "@/src/components/DashboardCard";
import { borrowRequestService } from "@/src/services/borrowRequestService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { X, FileText, Calendar, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export function MyRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'completed'>('pending');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await borrowRequestService.getMyRequests();
      setRequests(response.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to load your requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    
    setProcessingId(id);
    try {
      await borrowRequestService.updateStatus(id, 'cancelled');
      toast.success("Request cancelled");
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to cancel request");
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <div className="py-20"><LoadingSpinner /></div>;
  }

  // Filter requests into categories
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const activeRequests = requests.filter(r => r.status === 'approved');
  const pastRequests = requests.filter(r => ['rejected', 'cancelled', 'returned'].includes(r.status));

  const displayRequests = 
    activeTab === 'pending' ? pendingRequests : 
    activeTab === 'approved' ? activeRequests : pastRequests;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">My Requests</h1>
          <p className="text-gray-500 font-medium mt-1">Track items you have requested to borrow.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'pending' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-500 hover:text-brand-black'}`}
        >
          Pending ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'approved' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-500 hover:text-brand-black'}`}
        >
          Active ({activeRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'completed' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-500 hover:text-brand-black'}`}
        >
          Past ({pastRequests.length})
        </button>
      </div>

      {displayRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
           <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10" />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">No {activeTab} requests</h2>
           <p className="text-gray-500 mb-8 max-w-md mx-auto">
             You don't have any {activeTab} borrow requests right now.
           </p>
           <Link 
             to="/dashboard/marketplace" 
             className="inline-block bg-brand-yellow text-brand-black px-8 py-4 rounded-full font-bold hover:bg-yellow-400 transition-colors"
           >
             Browse Marketplace
           </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayRequests.map(request => {
            const owner = request.owner || {};
            const item = request.item || {};
            const image = item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80";
            
            return (
              <DashboardCard key={request._id} className="p-6 transition-colors hover:border-brand-yellow/30">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Item Image */}
                  <div className="w-full md:w-32 h-32 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                    <img src={image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Request Info */}
                  <div className="flex-1 flex flex-col justify-between">
                     <div>
                       <div className="flex items-center justify-between mb-2">
                         <h3 className="text-xl font-black text-gray-900 tracking-tight">{item.title}</h3>
                         <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${
                            request.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                            request.status === 'approved' ? 'bg-green-50 text-green-600' :
                            request.status === 'returned' ? 'bg-blue-50 text-blue-600' :
                            'bg-red-50 text-red-600'
                         }`}>
                           {request.status}
                         </span>
                       </div>
                       
                       <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600 mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.expectedReturnDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400">Owner:</span>
                            <div className="w-6 h-6 rounded-full bg-brand-yellow/20 flex items-center justify-center text-xs font-black text-brand-black">
                              {owner.name?.charAt(0) || '?'}
                            </div>
                            <span className="font-bold text-gray-900">
                              <Link to={`/users/${owner._id}`} className="hover:underline">{owner.name}</Link>
                            </span>
                            {owner.isPartner && <ShieldCheck className="w-4 h-4 text-brand-yellow" title="Partner" />}
                          </div>
                       </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex flex-wrap items-center justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
                       {request.status === 'pending' && (
                         <button 
                           onClick={() => handleCancelRequest(request._id)}
                           disabled={processingId === request._id}
                           className="px-6 py-2.5 rounded-full font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                         >
                           <X className="w-4 h-4" /> Cancel Request
                         </button>
                       )}

                       {request.status === 'approved' && (
                         <Link
                           to="/dashboard/agreements"
                           className="px-6 py-2.5 rounded-full font-bold text-brand-black bg-brand-yellow hover:bg-yellow-400 transition-colors flex items-center gap-2"
                         >
                           <FileText className="w-4 h-4" /> View Agreement
                         </Link>
                       )}
                     </div>
                  </div>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
