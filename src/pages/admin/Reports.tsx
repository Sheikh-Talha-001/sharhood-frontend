import { useState, useEffect } from "react";
import { DashboardCard } from "@/src/components/DashboardCard";
import { AdminSearchBar } from "@/src/components/admin/AdminSearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
