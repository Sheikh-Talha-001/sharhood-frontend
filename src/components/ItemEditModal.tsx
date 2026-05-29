import { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { itemService } from "@/src/services/itemService";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onSuccess: () => void;
}

export function ItemEditModal({ isOpen, onClose, item, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    category: "",
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        price: item.price?.toString() || "",
        condition: item.condition || "good",
        category: item.category || "",
        isAvailable: item.availability !== undefined ? item.availability : (item.available !== undefined ? item.available : true),
      });
      setPreview(item.image || item.images?.[0] || null);
    }
  }, [item]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, etc)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("condition", formData.condition);
      submitData.append("category", formData.category);
      submitData.append("availability", String(formData.isAvailable));
      
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      await itemService.update(item._id || item.id, submitData);
      toast.success("Item updated successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Edit Item</h2>
          <button 
            type="button"
            onClick={onClose}
            className="size-10 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Item Image</label>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100 group w-full sm:w-64">
                <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm">
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-64 border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors flex flex-col items-center gap-2">
                <Upload className="size-6 text-gray-400" />
                <span className="font-bold text-gray-900 text-sm">Upload Photo</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-900 mb-2">Title <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 focus:ring-2 focus:ring-brand-yellow" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-900 mb-2">Description <span className="text-red-500">*</span></label>
              <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 focus:ring-2 focus:ring-brand-yellow min-h-[100px]" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Price per day ($) <span className="text-red-500">*</span></label>
              <input type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 focus:ring-2 focus:ring-brand-yellow" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Category <span className="text-red-500">*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 focus:ring-2 focus:ring-brand-yellow">
                <option value="">Select Category</option>
                <option value="Tools">Tools</option>
                <option value="Camping">Camping</option>
                <option value="Electronics">Electronics</option>
                <option value="Sports">Sports</option>
                <option value="Party">Party</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Condition <span className="text-red-500">*</span></label>
              <select name="condition" value={formData.condition} onChange={handleChange} required className="w-full bg-gray-50 border-0 rounded-xl p-3.5 text-gray-900 focus:ring-2 focus:ring-brand-yellow">
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-xl">
              <input type="checkbox" id="isAvailable" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="size-5 text-brand-black rounded border-gray-300 focus:ring-brand-yellow" />
              <label htmlFor="isAvailable" className="text-sm font-bold text-gray-900 cursor-pointer">Available for rent</label>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3.5 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3.5 rounded-full font-bold text-brand-black bg-brand-yellow hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? <><Loader2 className="size-5 animate-spin" /> Saving...</> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
