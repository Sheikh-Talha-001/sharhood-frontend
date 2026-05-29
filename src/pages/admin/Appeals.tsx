import { useState, useEffect } from "react";
import { DashboardCard } from "@/src/components/DashboardCard";
import { AdminSearchBar } from "@/src/components/admin/AdminSearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { CheckCircle, XCircle, Eye, X } from "lucide-react";
import toast from "react-hot-toast";

export function Appeals() {
  const [appeals, setAppeals] = useState<any[]>([]);
  const [filteredAppeals, setFilteredAppeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewModal, setViewModal] = useState<{isOpen: boolean, data: any}>({isOpen: false, data: null});

  const fetchAppeals = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getAppeals();
      setAppeals(response.data || []);
      setFilteredAppeals(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load suspension appeals.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppeals();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredAppeals(appeals);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredAppeals(
        appeals.filter(a => 
          a.user?.name?.toLowerCase().includes(lowerQuery) || 
          a.user?.email?.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await adminService.updateAppeal(id, status);
      toast.success(`Appeal ${status} successfully!`);
      const updated = appeals.map(a => a._id === id ? { ...a, status } : a);
      setAppeals(updated);
      setFilteredAppeals(updated);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update appeal.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900">Suspension Appeals</h1>
           <p className="text-gray-500 font-medium mt-1">Review requests from suspended users to restore their accounts.</p>
         </div>
         <div className="w-full sm:w-72">
            <AdminSearchBar onSearch={handleSearch} placeholder="Search appeals..." />
         </div>
       </div>

       <DashboardCard>
         {isLoading ? (
           <div className="py-20"><LoadingSpinner /></div>
         ) : error ? (
           <div className="py-12 text-center text-red-500 font-bold">{error}</div>
         ) : (
            <div className="overflow-x-auto">
             <table className="w-full min-w-[800px]">
               <thead>
                 <tr className="border-b border-gray-100">
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">User / Date</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Appeal Message</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                   <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {filteredAppeals.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="py-12 text-center text-gray-500 font-medium">No appeals found.</td>
                   </tr>
                 ) : (
                   filteredAppeals.map((appeal) => (
                     <tr key={appeal._id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="py-4 px-6">
                          <p className="font-bold text-gray-900">{appeal.user?.name}</p>
                          <p className="text-sm text-gray-500">{new Date(appeal.createdAt).toLocaleDateString()}</p>
                       </td>
                       <td className="py-4 px-6 max-w-md">
                          <p className="text-sm text-gray-700">{appeal.message}</p>
                       </td>
                       <td className="py-4 px-6">
                         <span className={`px-3 py-1 text-xs font-bold rounded-md ${
                           appeal.status === 'approved' ? 'bg-green-50 text-green-600' :
                           appeal.status === 'rejected' ? 'bg-red-50 text-red-600' :
                           'bg-yellow-50 text-yellow-600'
                         }`}>
                           {appeal.status.toUpperCase()}
                         </span>
                       </td>
                       <td className="py-4 px-6 text-right space-x-2">
                         {appeal.status === 'pending' ? (
                           <>
                             <button type="button" 
                               onClick={() => setViewModal({isOpen: true, data: appeal})}
                               title="View Details"
                               className="inline-flex items-center justify-center size-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-colors"
                             >
                               <Eye className="size-4" />
                             </button>
                             <button type="button" 
                               onClick={() => handleAction(appeal._id, 'approved')}
                               title="Approve (Restore User)"
                               className="inline-flex items-center justify-center size-8 rounded-full bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                             >
                               <CheckCircle className="size-4" />
                             </button>
                             <button type="button" 
                               onClick={() => handleAction(appeal._id, 'rejected')}
                               title="Reject (Keep Suspended)"
                               className="inline-flex items-center justify-center size-8 rounded-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                             >
                               <XCircle className="size-4" />
                             </button>
                           </>
                         ) : (
                           <button type="button" 
                             onClick={() => setViewModal({isOpen: true, data: appeal})}
                             className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-xs font-bold gap-1.5"
                           >
                             <Eye className="size-3.5" /> View
                           </button>
                         )}
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
              </table>
            </div>
         )}
       </DashboardCard>

      {/* View Details Modal */}
      {viewModal.isOpen && viewModal.data && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Appeal Details</h2>
              <button type="button" onClick={() => setViewModal({isOpen: false, data: null})} className="size-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">User Name</p>
                  <p className="font-black text-gray-900">{viewModal.data.user?.name}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="font-medium text-gray-900">{viewModal.data.user?.email || viewModal.data.email}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Submitted On</p>
                  <p className="font-medium text-gray-900">{new Date(viewModal.data.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                   Appeal Message
                </h3>
                <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100/50 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {viewModal.data.appealMessage || viewModal.data.message || 'No message provided.'}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" 
                onClick={() => setViewModal({isOpen: false, data: null})}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
