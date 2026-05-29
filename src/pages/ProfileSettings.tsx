import { useState } from "react";
import { UserCircle, Camera, Lock } from "lucide-react";
import { DashboardCard } from "@/src/components/DashboardCard";
import { ProfileCard } from "@/src/components/ProfileCard";

export function ProfileSettings() {
  const [user] = useState({
    name: "User Name",
    email: "user@example.com",
    memberSince: "Oct 2023",
    isVerified: true,
    isPartner: false,
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Preview */}
        <div className="space-y-6">
           <ProfileCard user={user} />
           <p className="text-xs text-center font-medium text-gray-400 px-4">
             This is how your profile appears to other users in the neighborhood.
           </p>
        </div>

        {/* Right Column: Settings Forms */}
        <div className="lg:col-span-2 space-y-8">
           <DashboardCard title="Personal Information" icon={<UserCircle className="size-5" />}>
             <form className="space-y-5">
               <div className="flex items-center gap-6 mb-6">
                  <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                     <Camera className="size-6 text-gray-400" />
                  </div>
                  <button type="button" className="px-4 py-2 border border-brand-black text-brand-black font-bold rounded-full hover:bg-brand-black hover:text-white transition-colors text-sm">
                    Upload Photo
                  </button>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
                    <input type="text" defaultValue={user.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-yellow transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3.5 font-medium text-gray-500 cursor-not-allowed" />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Bio</label>
                  <textarea placeholder="Tell your neighbors a bit about yourself..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-yellow transition-all font-medium h-24 resize-none" />
               </div>
               <div className="pt-2">
                 <button type="button" className="bg-brand-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-brand-yellow hover:text-brand-black transition-colors">
                   Save Changes
                 </button>
               </div>
             </form>
           </DashboardCard>

           <DashboardCard title="Security" icon={<Lock className="size-5" />}>
             <form className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-yellow transition-all font-medium max-w-md" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-md">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-yellow transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Confirm Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-yellow transition-all font-medium" />
                  </div>
                </div>
                <div className="pt-2">
                 <button type="button" className="bg-white border border-gray-200 text-brand-black px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors">
                   Update Password
                 </button>
               </div>
             </form>
           </DashboardCard>
        </div>
      </div>
    </div>
  );
}
