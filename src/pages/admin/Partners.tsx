import { useState, useEffect } from "react";
import { DashboardCard } from "@/src/components/DashboardCard";
import { AdminSearchBar } from "@/src/components/admin/AdminSearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { CheckCircle, XCircle, Eye, X } from "lucide-react";
import toast from "react-hot-toast";

export function Partners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewModal, setViewModal] = useState<{isOpen: boolean, data: any}>({isOpen: false, data: null});

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getPartners();
      setPartners(response.data || []);
      setFilteredPartners(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load partner applications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredPartners(partners);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredPartners(
        partners.filter(p => 
          p.user?.name?.toLowerCase().includes(lowerQuery) || 
          p.user?.email?.toLowerCase().includes(lowerQuery) ||
          p.businessName?.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await adminService.updatePartner(id, status);
      toast.success(`Application ${status} successfully!`);
      const updated = partners.map(p => p._id === id ? { ...p, status } : p);
      setPartners(updated);
      setFilteredPartners(updated);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update application.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900">Partner Applications</h1>
           <p className="text-gray-500 font-medium mt-1">Review requests to become an approved partner.</p>
         </div>
         <div className="w-full sm:w-72">
            <AdminSearchBar onSearch={handleSearch} placeholder="Search applications..." />
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
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Categories</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Submitted Date</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                   <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {filteredPartners.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">No partner applications found.</td>
                   </tr>
                 ) : (
                   filteredPartners.map((app) => (
                     <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="py-4 px-6">
                          <div>
                            <p className="font-bold text-gray-900">{app.businessName || app.user?.name}</p>
                            <p className="text-sm text-gray-500">{app.user?.email}</p>
                          </div>
                       </td>
                       <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {app.intendedCategories?.map((c: string) => (
                              <span key={c} className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600 font-medium">{c}</span>
                            ))}
                          </div>
                       </td>
                       <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                         {new Date(app.createdAt).toLocaleDateString()}
                       </td>
                       <td className="py-4 px-6">
                         <span className={`px-3 py-1 text-xs font-bold rounded-md ${
                           app.status === 'approved' ? 'bg-green-50 text-green-600' :
                           app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                           'bg-yellow-50 text-yellow-600'
                         }`}>
                           {app.status.toUpperCase()}
                         </span>
                       </td>
                       <td className="py-4 px-6 text-right space-x-2">
                         {app.status === 'pending' ? (
                           <>
                             <button type="button" 
                               onClick={() => setViewModal({isOpen: true, data: app})}
                               className="inline-flex items-center justify-center size-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-colors"
                               title="View Details"
                             >
                               <Eye className="size-4" />
                             </button>
                             <button type="button" 
                               onClick={() => handleAction(app._id, 'approved')}
                               className="inline-flex items-center justify-center size-8 rounded-full bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                               title="Approve"
                             >
                               <CheckCircle className="size-4" />
                             </button>
                             <button type="button" 
                               onClick={() => handleAction(app._id, 'rejected')}
                               className="inline-flex items-center justify-center size-8 rounded-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                             >
                               <XCircle className="size-4" />
                             </button>
                           </>
                         ) : (
                           <button type="button" 
                             onClick={() => setViewModal({isOpen: true, data: app})}
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
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Application Details</h2>
              <button type="button" onClick={() => setViewModal({isOpen: false, data: null})} className="size-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Applicant Name</p>
                  <p className="font-bold text-gray-900">{viewModal.data.fullName || viewModal.data.user?.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Contact Email</p>
                  <p className="font-bold text-gray-900">{viewModal.data.user?.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Phone Number</p>
                  <p className="font-bold text-gray-900">{viewModal.data.phoneNumber || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">City</p>
                  <p className="font-bold text-gray-900">{viewModal.data.city || 'N/A'}</p>
                </div>
              </div>

              {viewModal.data.businessName && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Business Name</h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700">
                    {viewModal.data.businessName}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Reason for Joining</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap">
                  {viewModal.data.reasonForJoining || 'No reason provided.'}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Experience</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap">
                  {viewModal.data.experienceDescription || 'No experience provided.'}
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
