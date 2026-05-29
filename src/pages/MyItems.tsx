import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardCard } from "@/src/components/DashboardCard";
import { itemService } from "@/src/services/itemService";
import { useAuth } from "@/src/context/AuthContext";
import { PageSkeleton } from "@/src/components/LoadingSkeletons";
import { EmptyState } from "@/src/components/EmptyState";
import { Edit2, Trash2, PlusCircle, Package, Loader2 } from "lucide-react";
import { ItemEditModal } from "@/src/components/ItemEditModal";
import toast from "react-hot-toast";

export function MyItems() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Double check capability, though route should protect it
    if (user && !user.canListItems) {
      navigate("/dashboard");
      return;
    }
    fetchMyItems();
  }, [user, navigate]);

  const fetchMyItems = async () => {
    try {
      const response = await itemService.getMyItems();
      setItems(response.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to load your items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;
    
    setIsDeleting(id);
    try {
      await itemService.delete(id);
      toast.success("Item deleted successfully");
      setItems(items.filter(item => (item._id || item.id) !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete item");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">My Items</h1>
          <p className="text-gray-500 font-medium mt-1">Manage the items you have listed for borrowing.</p>
        </div>
        <Link 
          to="/dashboard/upload" 
          className="bg-brand-black text-white px-6 py-3 rounded-full font-bold hover:bg-brand-yellow hover:text-brand-black transition-all flex items-center gap-2 shadow-sm"
        >
          <PlusCircle className="size-5" />
          List New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState 
          icon={Package}
          title="You haven't listed any items yet"
          description="Help your neighbors by listing tools, camping gear, or other items you don't use every day."
          actionLabel="Create Your First Listing"
          actionLink="/dashboard/upload"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const itemId = item._id || item.id;
            const image = item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80";
            const isAvailable = item.availability !== undefined ? item.availability : (item.available !== undefined ? item.available : true);
            
            return (
              <DashboardCard key={itemId} className="flex flex-col overflow-hidden hover:border-brand-yellow/30 transition-colors group">
                <div className="relative aspect-video bg-gray-100 overflow-hidden -mx-6 -mt-6 mb-4">
                  <img src={image} alt={item.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm uppercase tracking-wider">
                    {item.category}
                  </div>
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-brand-black text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                        Currently Borrowed
                      </span>
                    </div>
                  )}
                  {item.isRemovedByAdmin && (
                    <div className="absolute inset-0 bg-red-500/80 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-white text-red-600 px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                        Removed by Admin
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 capitalize">Condition: {item.condition}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link 
                      to={`/dashboard/marketplace/${itemId}`}
                      className="text-sm font-bold text-gray-500 hover:text-brand-black transition-colors"
                    >
                      View Listing
                    </Link>
                    <div className="flex items-center gap-2">
                      <button type="button" 
                        onClick={() => {
                          setEditingItem(item);
                          setIsEditModalOpen(true);
                        }}
                        className="size-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button type="button" 
                        onClick={() => handleDelete(itemId)}
                        disabled={isDeleting === itemId}
                        className="size-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {isDeleting === itemId ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      )}

      {editingItem && (
        <ItemEditModal 
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          item={editingItem}
          onSuccess={fetchMyItems}
        />
      )}
    </div>
  );
}
