import { useState, useEffect } from "react";
import { AdminTable } from "@/src/components/AdminTable";
import { ConfirmationDialog } from "@/src/components/ConfirmationDialog";
import { SearchBar } from "@/src/components/SearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export function Verifications() {
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const [verifications, setVerifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getVerifications();
      setVerifications(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleAction = (request: any, type: "approve" | "reject") => {
    setSelectedVerification(request);
    setActionType(type);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedVerification) return;
    try {
      await adminService.updateVerification(selectedVerification._id, actionType === "approve" ? "approved" : "rejected");
      await fetchVerifications();
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const columns = [
    { header: "Name", accessor: "name", render: (req: any) => <span className="font-bold text-gray-900">{req.user?.name}</span> },
    { header: "Email", accessor: "email", render: (req: any) => <span>{req.user?.email}</span> },
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
           <h1 className="text-3xl font-bold tracking-tight text-gray-900">Identity Verifications</h1>
           <p className="text-gray-500 font-medium mt-1">Review user identity documents and approve accounts.</p>
         </div>
         <div className="w-full sm:w-72">
           <SearchBar placeholder="Search applicants..." />
         </div>
       </div>

       {isLoading ? <div className="py-20"><LoadingSpinner /></div> : <AdminTable columns={columns} data={verifications} emptyMessage="No pending verifications." />}

       <ConfirmationDialog 
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirm}
          title={actionType === "approve" ? "Approve Verification" : "Reject Verification"}
          message={`Are you sure you want to ${actionType} the identity verification for ${selectedVerification?.user?.name}?`}
          confirmText={actionType === "approve" ? "Approve" : "Reject"}
          confirmVariant={actionType === "approve" ? "primary" : "danger"}
       />
    </div>
  );
}
