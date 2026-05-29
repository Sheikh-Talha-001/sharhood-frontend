import { useState, useEffect } from "react";
import { DashboardCard } from "@/src/components/DashboardCard";
import { VerificationModal } from "@/src/components/admin/VerificationModal";
import { AdminSearchBar } from "@/src/components/admin/AdminSearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { Shield, Eye, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export function Verifications() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getVerifications();
      setVerifications(response.data || []);
      setFilteredVerifications(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load verification requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredVerifications(verifications);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredVerifications(
        verifications.filter(v => 
          v.user?.name?.toLowerCase().includes(lowerQuery) || 
          v.user?.email?.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setIsProcessing(true);
    try {
      const reason = status === 'rejected' ? window.prompt("Reason for rejection?") || "Documents unclear" : undefined;
      await adminService.updateVerification(id, status, reason);
      
      toast.success(`Verification ${status} successfully!`);
      
      // Update local state instead of hard reload
      const updated = verifications.map(v => v._id === id ? { ...v, status } : v);
      setVerifications(updated);
      setFilteredVerifications(updated);
      setSelectedVerification(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update verification.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900">Identity Verifications</h1>
           <p className="text-gray-500 font-medium mt-1">Review user submitted identification documents.</p>
         </div>
         <div className="w-full sm:w-72">
            <AdminSearchBar onSearch={handleSearch} placeholder="Search by name or email..." />
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
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Applicant</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Submitted Date</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                   <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {filteredVerifications.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="py-12 text-center text-gray-500 font-medium">No verification requests found.</td>
                   </tr>
                 ) : (
                   filteredVerifications.map((req) => (
                     <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                             <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                               {req.user?.name?.charAt(0) || '?'}
                             </div>
                             <div>
                               <p className="font-bold text-gray-900">{req.user?.name || "Unknown"}</p>
                               <p className="text-sm text-gray-500">{req.user?.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                         {new Date(req.createdAt).toLocaleDateString()}
                       </td>
                       <td className="py-4 px-6">
                         <span className={`px-3 py-1 text-xs font-bold rounded-md ${
                           req.status === 'approved' ? 'bg-green-50 text-green-600' :
                           req.status === 'rejected' ? 'bg-red-50 text-red-600' :
                           'bg-yellow-50 text-yellow-600'
                         }`}>
                           {req.status.toUpperCase()}
                         </span>
                       </td>
                       <td className="py-4 px-6 text-right">
                         {req.status === 'pending' ? (
                           <button type="button" 
                             onClick={() => setSelectedVerification(req)}
                             className="inline-flex items-center gap-2 px-4 py-2 bg-brand-black text-white text-sm font-bold rounded-lg hover:bg-brand-yellow hover:text-brand-black transition-colors"
                           >
                             <Eye className="size-4" /> Review
                           </button>
                         ) : (
                           <span className="text-sm font-medium text-gray-400">Reviewed</span>
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

       {selectedVerification && (
         <VerificationModal 
           verification={selectedVerification}
           isProcessing={isProcessing}
           onClose={() => setSelectedVerification(null)}
           onApprove={() => handleAction(selectedVerification._id, 'approved')}
           onReject={() => handleAction(selectedVerification._id, 'rejected')}
         />
       )}
    </div>
  );
}
