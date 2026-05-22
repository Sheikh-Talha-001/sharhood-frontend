import { useState, useEffect } from "react";
import { AdminTable } from "@/src/components/AdminTable";
import { ConfirmationDialog } from "@/src/components/ConfirmationDialog";
import { SearchBar } from "@/src/components/SearchBar";
import { Store } from "lucide-react";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export function Partners() {
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getPartnerApps();
      setPartners(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAction = (request: any, type: "approve" | "reject") => {
    setSelectedPartner(request);
    setActionType(type);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedPartner) return;
    try {
      await adminService.updatePartnerApp(selectedPartner._id, actionType === "approve" ? "approved" : "rejected");
      await fetchPartners();
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const columns = [
    { 
      header: "Applicant", 
      accessor: "name", 
      render: (req: any) => (
        <div>
          <span className="font-bold text-gray-900 block">{req.user?.name}</span>
          <span className="text-xs font-medium text-gray-500">{req.user?.email}</span>
        </div>
      ) 
    },
    { header: "Categories", accessor: "categoriesInterestedIn", render: (req: any) => <span>{req.categoriesInterestedIn?.join(', ')}</span> },
    { header: "Submitted", accessor: "createdAt", render: (req: any) => <span>{new Date(req.createdAt).toLocaleDateString()}</span> },
    { header: "Status", accessor: "status", render: (req: any) => <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${req.status === 'pending' ? 'bg-orange-100 text-orange-800' : req.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{req.status}</span> },
    { 
      header: "Actions", 
      accessor: "actions", 
      render: (req: any) => (
        <>
          {req.status === 'pending' && (
            <div className="flex gap-2">
               <button onClick={() => handleAction(req, "approve")} className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors">Approve</button>
               <button onClick={() => handleAction(req, "reject")} className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">Reject</button>
            </div>
          )}
        </>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <div className="flex items-center gap-3 mb-1">
             <div className="w-8 h-8 rounded-lg bg-brand-yellow/20 flex items-center justify-center">
                <Store className="w-4 h-4 text-brand-black" />
             </div>
             <h1 className="text-3xl font-bold tracking-tight text-gray-900">Partner Applications</h1>
           </div>
           <p className="text-gray-500 font-medium">Review community members applying to list items.</p>
         </div>
         <div className="w-full sm:w-72">
           <SearchBar placeholder="Search partners..." />
         </div>
       </div>

       {isLoading ? <div className="py-20"><LoadingSpinner /></div> : <AdminTable columns={columns} data={partners} emptyMessage="No partner applications." />}

       <ConfirmationDialog 
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirm}
          title={actionType === "approve" ? "Approve Partner" : "Reject Partner"}
          message={`Are you sure you want to ${actionType} the partner application for ${selectedPartner?.user?.name}?`}
          confirmText={actionType === "approve" ? "Approve" : "Reject"}
          confirmVariant={actionType === "approve" ? "primary" : "danger"}
       />
    </div>
  );
}
