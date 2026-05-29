import { useState, useEffect } from "react";
import { DashboardCard } from "@/src/components/DashboardCard";
import { AdminSearchBar } from "@/src/components/admin/AdminSearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { ShieldCheck, Ban, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suspendModal, setSuspendModal] = useState<{isOpen: boolean, user: any, reason: string}>({isOpen: false, user: null, reason: ''});

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getUsers();
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredUsers(users);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredUsers(
        users.filter(u => 
          u.name?.toLowerCase().includes(lowerQuery) || 
          u.email?.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  const handleSuspendToggle = async (user: any) => {
    if (!user.isSuspended) {
      setSuspendModal({ isOpen: true, user, reason: '' });
      return;
    }
    
    try {
      await adminService.suspendUser(user._id, false);
      toast.success("User reactivated");
      
      const updated = users.map(u => u._id === user._id ? { ...u, isSuspended: false } : u);
      setUsers(updated);
      setFilteredUsers(updated);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status.");
    }
  };

  const confirmSuspend = async () => {
    const user = suspendModal.user;
    if (!user) return;
    
    try {
      await adminService.suspendUser(user._id, true, suspendModal.reason);
      toast.success("User suspended");
      
      const updated = users.map(u => u._id === user._id ? { ...u, isSuspended: true, suspensionReason: suspendModal.reason } : u);
      setUsers(updated);
      setFilteredUsers(updated);
      setSuspendModal({ isOpen: false, user: null, reason: '' });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900">User Management</h1>
           <p className="text-gray-500 font-medium mt-1">Manage all platform users and handle suspensions.</p>
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
             <table className="w-full">
               <thead>
                 <tr className="border-b border-gray-100">
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status / Badges</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                   <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {filteredUsers.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="py-12 text-center text-gray-500 font-medium">No users found.</td>
                   </tr>
                 ) : (
                   filteredUsers.map((user) => (
                     <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="py-4 px-6">
                          <div>
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                       </td>
                       <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                             {user.isSuspended ? (
                               <span className="px-2 py-1 text-xs font-bold rounded bg-red-50 text-red-600 uppercase tracking-wider">Suspended</span>
                             ) : (
                               <span className="px-2 py-1 text-xs font-bold rounded bg-green-50 text-green-600 uppercase tracking-wider">Active</span>
                             )}
                             {user.verificationStatus === 'verified' && (
                               <ShieldCheck className="w-4 h-4 text-green-500" title="Verified" />
                             )}
                          </div>
                       </td>
                       <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                         {new Date(user.createdAt).toLocaleDateString()}
                       </td>
                       <td className="py-4 px-6 text-right">
                         {user.role !== 'admin' && (
                           <button 
                             onClick={() => handleSuspendToggle(user)}
                             className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                               user.isSuspended 
                                 ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                 : 'bg-red-50 text-red-600 hover:bg-red-100'
                             }`}
                           >
                             {user.isSuspended ? (
                               <><CheckCircle className="w-4 h-4" /> Activate</>
                             ) : (
                               <><Ban className="w-4 h-4" /> Suspend</>
                             )}
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

       {/* Suspend Modal */}
       {suspendModal.isOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
             <div className="p-6">
               <h3 className="text-2xl font-black text-gray-900 mb-2">Suspend User</h3>
               <p className="text-gray-500 mb-6">
                 You are about to suspend <strong>{suspendModal.user?.name}</strong>. Please provide a reason.
               </p>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Suspension Reason</label>
                   <textarea
                     value={suspendModal.reason}
                     onChange={(e) => setSuspendModal({ ...suspendModal, reason: e.target.value })}
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-black focus:ring-1 focus:ring-brand-black outline-none transition-all resize-none h-32"
                     placeholder="E.g., Repeated violation of community guidelines..."
                     autoFocus
                   />
                 </div>
               </div>
               
               <div className="flex items-center justify-end gap-3 mt-8">
                 <button 
                   onClick={() => setSuspendModal({ isOpen: false, user: null, reason: '' })}
                   className="px-6 py-2.5 rounded-full font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={confirmSuspend}
                   disabled={!suspendModal.reason.trim()}
                   className="px-6 py-2.5 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                 >
                   Confirm Suspension
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}
