import { useState, useEffect } from "react";
import { AdminTable } from "@/src/components/AdminTable";
import { ConfirmationDialog } from "@/src/components/ConfirmationDialog";
import { SearchBar } from "@/src/components/SearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export function Users() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<"suspend" | "activate">("suspend");

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = (user: any, type: "suspend" | "activate") => {
    setSelectedUser(user);
    setActionType(type);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;
    try {
      await adminService.suspendUser(selectedUser._id, actionType === "suspend");
      await fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const columns = [
    { 
      header: "User", 
      accessor: "name", 
      render: (user: any) => (
        <div>
          <span className="font-bold text-gray-900 block">{user.name}</span>
          <span className="text-xs font-medium text-gray-500">{user.email}</span>
        </div>
      ) 
    },
    { 
      header: "Badges", 
      accessor: "badges", 
      render: (user: any) => (
        <div className="flex gap-1 border-none">
          {user.isVerified && <span className="w-5 h-5 bg-blue-100 text-blue-500 rounded flex items-center justify-center text-xs" title="Verified ID">ID</span>}
          {user.isPartner && <span className="w-5 h-5 bg-purple-100 text-purple-500 rounded flex items-center justify-center text-xs" title="Partner">P</span>}
        </div>
      ) 
    },
    { header: "Joined", accessor: "createdAt", render: (user: any) => <span>{new Date(user.createdAt).toLocaleDateString()}</span> },
    { 
      header: "Status", 
      accessor: "isSuspended", 
      render: (user: any) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${!user.isSuspended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {!user.isSuspended ? 'Active' : 'Suspended'}
        </span>
      ) 
    },
    { 
      header: "Actions", 
      accessor: "actions", 
      render: (user: any) => (
        <div className="flex gap-2">
           {!user.isSuspended ? (
             <button onClick={() => handleAction(user, "suspend")} className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">Suspend</button>
           ) : (
             <button onClick={() => handleAction(user, "activate")} className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors">Activate</button>
           )}
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
           <p className="text-gray-500 font-medium mt-1">Manage user accounts, badges, and platform access.</p>
         </div>
         <div className="w-full sm:w-72">
           <SearchBar placeholder="Search users by name or email..." />
         </div>
       </div>

       <div className="flex gap-2 mb-2 bg-gray-100 p-1 rounded-full w-max">
         <button className="px-6 py-2 rounded-full text-sm font-bold bg-white text-gray-900 shadow-sm transition-all">All Users</button>
         <button className="px-6 py-2 rounded-full text-sm font-bold text-gray-500 hover:text-gray-900 transition-all">Suspended</button>
       </div>

       {isLoading ? <div className="py-20"><LoadingSpinner /></div> : <AdminTable columns={columns} data={users} />}

       <ConfirmationDialog 
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirm}
          title={actionType === "suspend" ? "Suspend User" : "Activate User"}
          message={`Are you sure you want to ${actionType} the account for ${selectedUser?.name}?`}
          confirmText={actionType === "suspend" ? "Suspend User" : "Activate User"}
          confirmVariant={actionType === "suspend" ? "danger" : "primary"}
       />
    </div>
  );
}
