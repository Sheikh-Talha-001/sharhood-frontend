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
    const isSuspending = !user.isSuspended;
    try {
      await adminService.suspendUser(user._id, isSuspending);
      toast.success(isSuspending ? "User suspended" : "User reactivated");
      
      const updated = users.map(u => u._id === user._id ? { ...u, isSuspended: isSuspending } : u);
      setUsers(updated);
      setFilteredUsers(updated);
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
    </div>
  );
}
