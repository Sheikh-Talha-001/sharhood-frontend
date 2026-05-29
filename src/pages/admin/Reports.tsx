import { useState, useEffect } from "react";
import { DashboardCard } from "@/src/components/DashboardCard";
import { AdminSearchBar } from "@/src/components/admin/AdminSearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { CheckCircle, XCircle, Eye, X } from "lucide-react";
import toast from "react-hot-toast";

export function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewModal, setViewModal] = useState<{isOpen: boolean, data: any}>({isOpen: false, data: null});

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getReports();
      setReports(response.data || []);
      setFilteredReports(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load reports.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredReports(reports);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredReports(
        reports.filter(r => 
          r.reportedUser?.name?.toLowerCase().includes(lowerQuery) || 
          r.reportedItem?.title?.toLowerCase().includes(lowerQuery) ||
          r.reason?.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  const handleAction = async (id: string, status: 'resolved' | 'dismissed') => {
    try {
      await adminService.updateReport(id, status);
      toast.success(`Report ${status} successfully!`);
      const updated = reports.map(r => r._id === id ? { ...r, status } : r);
      setReports(updated);
      setFilteredReports(updated);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update report.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900">Reports Moderation</h1>
           <p className="text-gray-500 font-medium mt-1">Review and resolve community submitted reports.</p>
         </div>
         <div className="w-full sm:w-72">
            <AdminSearchBar onSearch={handleSearch} placeholder="Search reports..." />
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
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Target</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Type & Reason</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Reporter</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                   <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {filteredReports.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">No reports found.</td>
                   </tr>
                 ) : (
                   filteredReports.map((report) => (
                     <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="py-4 px-6">
                          <p className="font-bold text-gray-900">
                             {report.type === 'user' ? report.reportedUser?.name : report.reportedItem?.title}
                          </p>
                          <p className="text-xs font-bold text-gray-400 uppercase">{report.type}</p>
                       </td>
                       <td className="py-4 px-6">
                          <p className="text-sm text-gray-700">{report.reason}</p>
                       </td>
                       <td className="py-4 px-6">
                          <p className="text-sm font-medium text-gray-900">{report.reportedBy?.name}</p>
                       </td>
                       <td className="py-4 px-6">
                         <span className={`px-3 py-1 text-xs font-bold rounded-md ${
                           report.status === 'resolved' ? 'bg-green-50 text-green-600' :
                           report.status === 'dismissed' ? 'bg-gray-100 text-gray-500' :
                           'bg-red-50 text-red-600'
                         }`}>
                           {report.status.toUpperCase()}
                         </span>
                       </td>
                       <td className="py-4 px-6 text-right space-x-2">
                         {report.status === 'pending' ? (
                           <>
                             <button 
                               onClick={() => setViewModal({isOpen: true, data: report})}
                               title="View Details"
                               className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-colors"
                             >
                               <Eye className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => handleAction(report._id, 'resolved')}
                               title="Resolve"
                               className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                             >
                               <CheckCircle className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => handleAction(report._id, 'dismissed')}
                               title="Dismiss"
                               className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-500 hover:text-white transition-colors"
                             >
                               <XCircle className="w-4 h-4" />
                             </button>
                           </>
                         ) : (
                           <button 
                             onClick={() => setViewModal({isOpen: true, data: report})}
                             className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-xs font-bold gap-1.5"
                           >
                             <Eye className="w-3.5 h-3.5" /> View
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
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Report Details</h2>
              <button onClick={() => setViewModal({isOpen: false, data: null})} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Reported By</p>
                  <p className="font-black text-gray-900">{viewModal.data.reportedBy?.name}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Target Type</p>
                  <span className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold uppercase">{viewModal.data.type || (viewModal.data.reportedUser ? 'user' : 'item')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Target Name</p>
                  <p className="font-bold text-brand-black">{viewModal.data.reportedUser?.name || viewModal.data.reportedItem?.title || 'Unknown'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                   Reason: <span className="text-red-500 font-black">{viewModal.data.reason}</span>
                </h3>
                <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100/50 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {viewModal.data.description}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
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
