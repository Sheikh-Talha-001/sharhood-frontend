import { useState } from "react";
import { AdminTable } from "@/src/components/AdminTable";
import { ConfirmationDialog } from "@/src/components/ConfirmationDialog";
import { SearchBar } from "@/src/components/SearchBar";

export function Appeals() {
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<"reinstate" | "deny">("reinstate");

  const handleAction = (appeal: any, type: "reinstate" | "deny") => {
    setSelectedAppeal(appeal);
    setActionType(type);
    setIsConfirmOpen(true);
  };

  const MOCK_DATA = [
     { id: "1", user: "John Doe", reason: "Suspended for late return without notice.", appealText: "I was in the hospital, please review my attachments.", status: "Pending", date: "Oct 25, 2023" },
  ];

  const columns = [
    { 
      header: "User / Date", 
      accessor: "user", 
      render: (appeal: any) => (
        <div>
          <span className="font-bold text-gray-900 block">{appeal.user}</span>
          <span className="text-xs font-medium text-gray-500">{appeal.date}</span>
        </div>
      ) 
    },
    { header: "Suspension Reason", accessor: "reason", render: (appeal: any) => <span className="font-medium text-gray-600 truncate max-w-[200px] block">{appeal.reason}</span> },
    { header: "Appeal Message", accessor: "appealText", render: (appeal: any) => <span className="font-medium text-gray-500 italic truncate max-w-[300px] block">"{appeal.appealText}"</span> },
    { header: "Status", accessor: "status", render: (appeal: any) => <span className="px-2.5 py-1 bg-orange-100 text-orange-800 rounded-md text-xs font-bold uppercase">{appeal.status}</span> },
    { 
      header: "Actions", 
      accessor: "actions", 
      render: (appeal: any) => (
        <div className="flex gap-2">
           <button onClick={() => handleAction(appeal, "reinstate")} className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors">Reinstate</button>
           <button onClick={() => handleAction(appeal, "deny")} className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">Deny</button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-bold tracking-tight text-gray-900">Suspension Appeals</h1>
           <p className="text-gray-500 font-medium mt-1">Review appeals from suspended users.</p>
         </div>
         <div className="w-full sm:w-72">
           <SearchBar placeholder="Search appeals..." />
         </div>
       </div>

       <AdminTable columns={columns} data={MOCK_DATA} emptyMessage="No pending appeals." />

       <ConfirmationDialog 
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => setIsConfirmOpen(false)}
          title={actionType === "reinstate" ? "Reinstate User" : "Deny Appeal"}
          message={`Are you sure you want to ${actionType === 'reinstate' ? 'restore access for' : 'deny the appeal from'} ${selectedAppeal?.user}? ${actionType === 'deny' ? 'This action is final.' : ''}`}
          confirmText={actionType === "reinstate" ? "Reinstate" : "Deny"}
          confirmVariant={actionType === "reinstate" ? "primary" : "danger"}
       />
    </div>
  );
}
