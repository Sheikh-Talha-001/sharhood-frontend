import { useState, useEffect } from "react";
import { DashboardCard } from "@/src/components/DashboardCard";
import { AdminSearchBar } from "@/src/components/admin/AdminSearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { Trash2, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

export function Items() {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getItems();
      setItems(response.data || []);
      setFilteredItems(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load items.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredItems(items);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredItems(
        items.filter(i => 
          i.title?.toLowerCase().includes(lowerQuery) || 
          i.owner?.name?.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  const handleRemoveToggle = async (item: any) => {
    const isRemoving = !item.isRemovedByAdmin;
    try {
      await adminService.removeItem(item._id, isRemoving);
      toast.success(isRemoving ? "Item removed" : "Item restored");
      
      const updated = items.map(i => i._id === item._id ? { ...i, isRemovedByAdmin: isRemoving } : i);
      setItems(updated);
      setFilteredItems(updated);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item status.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-black tracking-tight text-gray-900">Items Moderation</h1>
           <p className="text-gray-500 font-medium mt-1">Manage and moderate marketplace listings.</p>
         </div>
         <div className="w-full sm:w-72">
            <AdminSearchBar onSearch={handleSearch} placeholder="Search by item title or owner..." />
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
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Listing</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Owner</th>
                   <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                   <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {filteredItems.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="py-12 text-center text-gray-500 font-medium">No items found.</td>
                   </tr>
                 ) : (
                   filteredItems.map((item) => (
                     <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                             <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                               {item.image ? (
                                 <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full bg-gray-200"></div>
                               )}
                             </div>
                             <div>
                               <p className="font-bold text-gray-900 line-clamp-1">{item.title}</p>
                               <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">{item.category}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-4 px-6">
                          <p className="font-bold text-gray-900">{item.owner?.name}</p>
                          <p className="text-sm text-gray-500">{item.owner?.email}</p>
                       </td>
                       <td className="py-4 px-6">
                          {item.isRemovedByAdmin ? (
                            <span className="px-2 py-1 text-xs font-bold rounded bg-red-50 text-red-600 uppercase tracking-wider">Removed</span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-bold rounded bg-green-50 text-green-600 uppercase tracking-wider">Active</span>
                          )}
                       </td>
                       <td className="py-4 px-6 text-right">
                          <button 
                             onClick={() => handleRemoveToggle(item)}
                             className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                               item.isRemovedByAdmin 
                                 ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                 : 'bg-red-50 text-red-600 hover:bg-red-100'
                             }`}
                           >
                             {item.isRemovedByAdmin ? (
                               <><RotateCcw className="w-4 h-4" /> Restore</>
                             ) : (
                               <><Trash2 className="w-4 h-4" /> Remove</>
                             )}
                           </button>
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
