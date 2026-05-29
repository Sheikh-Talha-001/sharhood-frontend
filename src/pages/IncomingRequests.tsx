import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardCard } from "@/src/components/DashboardCard";
import { borrowRequestService } from "@/src/services/borrowRequestService";
import { useAuth } from "@/src/context/AuthContext";
import { PageSkeleton } from "@/src/components/LoadingSkeletons";
import { EmptyState } from "@/src/components/EmptyState";
import { Check, X, Bell, Calendar, MessageSquare, ShieldCheck, ArrowRightLeft } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { ReturnConditionModal } from "@/src/components/ReturnConditionModal";

export function IncomingRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'completed'>('pending');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnRequest, setReturnRequest] = useState<any>(null);

  useEffect(() => {
    if (user && !user.canListItems) {
      navigate("/dashboard");
      return;
    }
    fetchRequests();
  }, [user, navigate]);

  const fetchRequests = async () => {
    try {
      const response = await borrowRequestService.getReceivedRequests();
      setRequests(response.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, data?: any) => {
    setProcessingId(id);
    try {
      await borrowRequestService.updateStatus(id, status, data);
      toast.success(`Request ${status} successfully`);
      fetchRequests(); // Refresh to get updated statuses and agreements
    } catch (err: any) {
      toast.error(err.response?.data?.error || `Failed to mark as ${status}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReturn = async (condition: string, notes: string) => {
    if (!returnRequest) return;
    
    await handleUpdateStatus(returnRequest._id, "returned", { 
      itemConditionAfter: `${condition}${notes ? ` - Notes: ${notes}` : ''}`
    });
    
    setIsReturnModalOpen(false);
    setReturnRequest(null);
  };

  if (isLoading) {
    return <PageSkeleton />;
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
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Incoming Requests</h1>
          <p className="text-gray-500 font-medium mt-1">Manage people asking to borrow your items.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl max-w-md">
        <button type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'pending' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-500 hover:text-brand-black'}`}
        >
          Pending ({pendingRequests.length})
        </button>
        <button type="button"
          onClick={() => setActiveTab('approved')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'approved' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-500 hover:text-brand-black'}`}
        >
          Active ({activeRequests.length})
        </button>
        <button type="button"
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'completed' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-500 hover:text-brand-black'}`}
        >
          Past ({pastRequests.length})
        </button>
      </div>

      {displayRequests.length === 0 ? (
        <EmptyState 
          icon={Bell}
          title={`No ${activeTab} requests`}
          description="You're all caught up! When someone requests to borrow your items, they'll appear here."
        />
      ) : (
        <div className="space-y-4">
          {displayRequests.map(request => {
            const borrower = request.borrower || {};
            const item = request.item || {};
            const image = item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80";
            
            return (
              <DashboardCard key={request._id} className="p-6 transition-colors hover:border-brand-yellow/30">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Item Image */}
                  <div className="w-full md:size-32 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                    <img src={image} alt={item.title} className="size-full object-cover" />
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
                            <Calendar className="size-4 text-gray-400" />
                            {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.expectedReturnDate), 'MMM d')}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="size-6 rounded-full bg-brand-yellow/20 flex items-center justify-center text-xs font-black text-brand-black">
                              {borrower.name?.charAt(0) || '?'}
                            </div>
                            <span className="font-bold text-gray-900">
                              <Link to={`/users/${borrower._id}`} className="hover:underline">{borrower.name}</Link>
                            </span>
                            {borrower.isVerified && <ShieldCheck className="size-4 text-green-500" title="Verified ID" />}
                          </div>
                       </div>
                       
                       {request.message && (
                         <div className="bg-gray-50 rounded-xl p-4 mb-4 relative">
                           <MessageSquare className="size-4 text-gray-400 absolute top-4 left-4" />
                           <p className="pl-6 text-sm text-gray-600 italic">"{request.message}"</p>
                         </div>
                       )}
                     </div>

                     {/* Action Buttons */}
                     <div className="flex flex-wrap items-center justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
                       {request.status === 'pending' && (
                         <>
                           <button type="button" 
                             onClick={() => handleUpdateStatus(request._id, 'rejected')}
                             disabled={processingId === request._id}
                             className="px-6 py-2.5 rounded-full font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                           >
                             <X className="size-4" /> Reject
                           </button>
                           <button type="button" 
                             onClick={() => handleUpdateStatus(request._id, 'approved')}
                             disabled={processingId === request._id}
                             className="px-6 py-2.5 rounded-full font-bold text-brand-black bg-brand-yellow hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center gap-2"
                           >
                             <Check className="size-4" /> Approve Request
                           </button>
                         </>
                       )}

                       {request.status === 'approved' && (
                         <>
                           <Link
                             to="/dashboard/agreements"
                             className="px-6 py-2.5 rounded-full font-bold text-brand-black bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
                           >
                             View Agreement
                           </Link>
                           <button type="button" 
                             onClick={() => {
                               setReturnRequest(request);
                               setIsReturnModalOpen(true);
                             }}
                             disabled={processingId === request._id}
                             className="px-6 py-2.5 rounded-full font-bold text-white bg-green-500 hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                           >
                             <ArrowRightLeft className="size-4" /> Mark as Returned
                           </button>
                         </>
                       )}
                     </div>
                  </div>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      )}

      {returnRequest && (
        <ReturnConditionModal
          isOpen={isReturnModalOpen}
          onClose={() => {
            if (processingId) return;
            setIsReturnModalOpen(false);
            setReturnRequest(null);
          }}
          onConfirm={handleConfirmReturn}
          isSubmitting={processingId === returnRequest._id}
          itemTitle={returnRequest.item?.title || "Item"}
        />
      )}
    </div>
  );
}
