import { useState, useEffect } from "react";
import { DashboardCard } from "@/src/components/DashboardCard";
import { AdminSearchBar } from "@/src/components/admin/AdminSearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export function Partners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
             <table className="w-full">
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
                             <button 
                               onClick={() => handleAction(app._id, 'approved')}
                               className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                             >
                               <CheckCircle className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => handleAction(app._id, 'rejected')}
                               className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                             >
                               <XCircle className="w-4 h-4" />
                             </button>
                           </>
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
    </div>
  );
}
