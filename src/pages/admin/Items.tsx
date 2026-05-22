import { useState, useEffect } from "react";
import { AdminTable } from "@/src/components/AdminTable";
import { ConfirmationDialog } from "@/src/components/ConfirmationDialog";
import { SearchBar } from "@/src/components/SearchBar";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export function Items() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getItems();
      setItems(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAction = (item: any) => {
    setSelectedItem(item);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedItem) return;
    try {
      await adminService.removeItem(selectedItem._id, true);
      await fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const columns = [
    { 
      header: "Item Listing", 
      accessor: "title", 
      render: (item: any) => (
        <div>
          <span className="font-bold text-gray-900 block">{item.title}</span>
          <span className="text-xs font-medium text-gray-500">{item.category} • Free</span>
        </div>
      ) 
    },
    { header: "Owner", accessor: "owner", render: (item: any) => <span className="font-bold text-gray-700">{item.owner?.name}</span> },
    { 
      header: "Status", 
      accessor: "available", 
      render: (item: any) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.available ? 'Active' : 'Unavailable'}
        </span>
      ) 
    },
    { 
      header: "Actions", 
      accessor: "actions", 
      render: (item: any) => (
        <button onClick={() => handleAction(item)} className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">Remove Listing</button>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-bold tracking-tight text-gray-900">Item Moderation</h1>
           <p className="text-gray-500 font-medium mt-1">Review neighborhood listings and enforce platform policies.</p>
         </div>
         <div className="w-full sm:w-72">
           <SearchBar placeholder="Search listings..." />
         </div>
       </div>

       <div className="flex gap-2 mb-2 bg-gray-100 p-1 rounded-full w-max">
         <button className="px-6 py-2 rounded-full text-sm font-bold bg-white text-gray-900 shadow-sm transition-all">All Items</button>
         <button className="px-6 py-2 rounded-full text-sm font-bold text-gray-500 hover:text-gray-900 transition-all">Flagged</button>
         <button className="px-6 py-2 rounded-full text-sm font-bold text-gray-500 hover:text-gray-900 transition-all">Removed</button>
       </div>

       {isLoading ? <div className="py-20"><LoadingSpinner /></div> : <AdminTable columns={columns} data={items} />}

       <ConfirmationDialog 
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirm}
          title="Remove Listing"
          message={`Are you sure you want to permanently remove "${selectedItem?.title}" from the marketplace?`}
          confirmText="Remove Item"
          confirmVariant="danger"
       />
    </div>
  );
}
