import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Loader2, ArrowLeft, Info, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/AuthContext";
import { itemService } from "@/src/services/itemService";

const ITEM_CATEGORIES = [
  "Tools",
  "Electronics",
  "Kitchen",
  "Sports",
  "Outdoor",
  "Books",
  "Furniture",
  "Other",
];

const CONDITIONS = [
  { value: "new", label: "Brand New" },
  { value: "like-new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" }
];

export function UploadItem() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "good",
    location: user?.neighborhood || "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // While auth is resolving, show nothing to avoid flash of blocked UI
  if (authLoading) {
    return (
      <div className="max-w-3xl mx-auto py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-yellow" />
      </div>
    );
  }

  // Access Control: Only approved partners or admins can upload items
  // Backend stores this in `canListItems` (boolean) set when partner is approved,
  // or we fall back to checking `partnerStatus === 'approved'`
  const isAllowedToList =
    user?.role === 'admin' ||
    user?.canListItems === true ||
    user?.partnerStatus === 'approved';

  if (!isAllowedToList) {
    const isPending = user?.partnerStatus === 'pending';
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-20 h-20 bg-brand-yellow/10 text-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
          <Info className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">
          {isPending ? 'Application Under Review' : 'Partner Access Only'}
        </h1>
        <p className="text-gray-500 font-medium mb-8 text-lg max-w-md mx-auto">
          {isPending
            ? 'Your partner application is currently under review. You will be notified once approved and can start listing items.'
            : 'You must be an approved partner to list items on the marketplace. This ensures trust and quality in our community.'}
        </p>
        {!isPending && (
          <button
            onClick={() => navigate('/dashboard/partner')}
            className="bg-brand-black text-white px-8 py-4 rounded-full font-bold hover:bg-brand-yellow hover:text-brand-black transition-colors"
          >
            Apply to Become a Partner
          </button>
        )}
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.category) return toast.error("Please select a category");
    
    setIsSubmitting(true);
    try {
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("category", formData.category);
      uploadData.append("condition", formData.condition);
      uploadData.append("location", formData.location);
      uploadData.append("description", formData.description);
      
      if (selectedFile) {
        uploadData.append("image", selectedFile);
      }

      await itemService.create(uploadData);
      toast.success("Item listed successfully!");
      navigate("/dashboard/marketplace");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to list item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <button 
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-black font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">List an Item</h1>
          <p className="text-gray-500 font-medium mb-10">Share your everyday items with the neighborhood.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Item Photo</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-64 rounded-2xl border-2 border-dashed ${previewUrl ? 'border-brand-yellow' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'} transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group`}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-bold flex items-center gap-2"><Camera className="w-5 h-5"/> Change Photo</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-400 group-hover:text-brand-black transition-colors">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-gray-900 mb-1">Click to upload photo</p>
                    <p className="text-xs font-medium text-gray-500">JPG or PNG up to 5MB</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">Item Title *</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. DeWalt Cordless Drill"
                  maxLength={100}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Category *</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium appearance-none" 
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {ITEM_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Condition</label>
                <select 
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium appearance-none" 
                >
                  {CONDITIONS.map(cond => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">Location / Pickup Area</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Mission District, SF"
                  maxLength={100}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Description <span className="text-gray-400 font-medium ml-1">({formData.description.length}/1000)</span>
                </label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the item, any quirks, or what it includes..."
                  maxLength={1000}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium h-32 resize-none" 
                />
              </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100">
               <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                 <CheckCircle className="w-4 h-4 text-green-500" /> Free to list on ShareHood
               </p>
               <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="w-full md:w-auto bg-brand-black text-white px-8 py-4 rounded-full font-bold hover:bg-brand-yellow hover:text-brand-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-w-[200px] shadow-sm"
               >
                 {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Publishing...
                    </>
                 ) : (
                    "Publish Listing"
                 )}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
