import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, UserCircle, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/AuthContext";
import { userService } from "@/src/services/userService";

export function EditProfile() {
  const { user, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    neighborhood: "",
    bio: "",
  });

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        neighborhood: user.neighborhood || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Handle Text Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Profile Image Selection & Upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append("image", file); // Must match Multer configuration

      await userService.updateAvatar(uploadData);
      await checkAuthStatus(); // Refresh global auth state immediately
      toast.success("Profile picture updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile picture");
    } finally {
      setIsUploadingImage(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (formData.bio.length > 500) {
      toast.error("Bio cannot exceed 500 characters");
      return;
    }

    if (formData.neighborhood.length > 200) {
      toast.error("Neighborhood cannot exceed 200 characters");
      return;
    }

    setIsSaving(true);
    try {
      await userService.updateProfile(formData);
      await checkAuthStatus(); // Refresh global auth state
      toast.success("Profile updated successfully!");
      navigate("/dashboard/profile");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <button 
        onClick={() => navigate("/dashboard/profile")}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-black font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Profile
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Edit Profile</h1>
          <p className="text-gray-500 font-medium mb-10">Update your personal details and how you appear to the neighborhood.</p>

          {/* Profile Picture Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-gray-100">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-sm border-2 border-gray-100 bg-brand-yellow flex items-center justify-center">
                {isUploadingImage ? (
                   <Loader2 className="w-8 h-8 text-brand-black animate-spin" />
                ) : user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl md:text-5xl font-black text-brand-black">
                    {user.name?.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-bold text-gray-900 mb-1">Profile Picture</h3>
              <p className="text-sm font-medium text-gray-500 mb-4 max-w-sm">
                A friendly face builds trust. JPG or PNG under 5MB.
              </p>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="px-6 py-2.5 rounded-full border border-brand-black text-brand-black font-bold text-sm hover:bg-brand-black hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand-black flex items-center justify-center gap-2 mx-auto md:mx-0"
              >
                <Camera className="w-4 h-4" />
                {isUploadingImage ? "Uploading..." : "Change Picture"}
              </button>
            </div>
          </div>

          {/* Text Fields Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex justify-between">
                   <span>Email Address</span>
                   <span className="text-gray-400 font-medium text-xs">Cannot be changed</span>
                </label>
                <input 
                  type="email" 
                  value={user.email}
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3.5 font-medium text-gray-500 cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  maxLength={20}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Neighborhood / Area</label>
                <input 
                  type="text" 
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  placeholder="e.g. Mission District, SF"
                  maxLength={200}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Bio <span className="text-gray-400 font-medium ml-1">({formData.bio.length}/500)</span>
              </label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell your neighbors a bit about yourself..."
                maxLength={500}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium h-32 resize-none" 
              />
            </div>

            <div className="pt-6 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-brand-black text-white px-8 py-4 rounded-full font-bold hover:bg-brand-yellow hover:text-brand-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-w-[200px]"
              >
                {isSaving ? (
                   <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     Saving Changes...
                   </>
                ) : (
                   "Save Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
