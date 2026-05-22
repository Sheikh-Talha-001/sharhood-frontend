import { useState, useEffect } from "react";
import { AdminTable } from "@/src/components/AdminTable";
import { ConfirmationDialog } from "@/src/components/ConfirmationDialog";
import { SearchBar } from "@/src/components/SearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export function Reports() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getReports();
      setReports(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = (report: any) => {
    setSelectedReport(report);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedReport) return;
    try {
      await adminService.updateReport(selectedReport._id, "resolved");
      await fetchReports();
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const columns = [
    { 
      header: "Type", 
      accessor: "reportedItem", 
      render: (req: any) => <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-md text-xs font-bold uppercase">{req.reportedItem ? 'Item' : 'User'}</span> 
    },
    { header: "Reported Target", accessor: "target", render: (req: any) => <span className="font-bold text-gray-900 block">{req.reportedItem?.title || req.reportedUser?.name}</span> },
    { header: "Reporter", accessor: "reporter", render: (req: any) => <span className="text-gray-900">{req.reporter?.name}</span> },
    { header: "Reason", accessor: "reason", render: (req: any) => <span className="text-gray-500 font-medium truncate max-w-[200px] block">{req.reason}</span> },
    { header: "Date", accessor: "createdAt", render: (req: any) => <span>{new Date(req.createdAt).toLocaleDateString()}</span> },
    { 
      header: "Actions", 
      accessor: "actions", 
      render: (req: any) => (
        <button onClick={() => handleAction(req)} className="text-sm font-bold text-brand-black bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">Review</button>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reports Moderation</h1>
           <p className="text-gray-500 font-medium mt-1">Review and action user reports regarding items or behavior.</p>
         </div>
         <div className="w-full sm:w-72">
           <SearchBar placeholder="Search reports..." />
         </div>
       </div>

       {isLoading ? <div className="py-20"><LoadingSpinner /></div> : <AdminTable columns={columns} data={reports} emptyMessage="No open reports." />}

       <ConfirmationDialog 
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirm}
          title="Resolve Report"
          message={`Mark the report against "${selectedReport?.reportedItem?.title || selectedReport?.reportedUser?.name}" as resolved? This removes it from the open queue.`}
          confirmText="Mark Resolved"
          confirmVariant="primary"
       />
    </div>
  );
}
