import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, Suspense } from "react";
import { Sidebar } from "@/src/components/Sidebar";
import { DashboardHeader } from "@/src/components/DashboardHeader";
import { LoadingSkeleton } from "@/src/components/LoadingSkeleton";
import { useAuth } from "@/src/context/AuthContext";
import { AlertTriangle, ArrowRight } from "lucide-react";

export function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isSuspended = user?.isSuspended;
  const isAppealPage = location.pathname === '/dashboard/appeal';

  return (
    <div className="min-h-screen bg-brand-bg flex">
      <Sidebar isMobileOpen={isMobileOpen} closeMobile={() => setIsMobileOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader toggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
           <div className="max-w-6xl mx-auto w-full">
             {isSuspended && !isAppealPage ? (
               <div className="bg-white rounded-3xl p-12 text-center border border-red-100 max-w-2xl mx-auto mt-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="mx-auto flex items-center justify-center size-20 rounded-full bg-red-50 mb-6">
                   <AlertTriangle className="size-10 text-red-600" />
                 </div>
                 <h2 className="text-3xl font-black text-gray-900 mb-4">Account Suspended</h2>
                 <p className="text-gray-500 font-medium mb-8 text-lg leading-relaxed">
                   Your account has been suspended by a moderator for a violation of our community guidelines. You are currently restricted from accessing this page.
                 </p>
                 <button type="button" 
                   onClick={() => navigate('/dashboard/appeal')}
                   className="inline-flex items-center justify-center gap-2 bg-brand-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-sm"
                 >
                   Appeal Suspension <ArrowRight className="size-5" />
                 </button>
               </div>
             ) : (
               <Suspense fallback={<div className="py-10"><LoadingSkeleton type="details" /></div>}>
                 <Outlet />
               </Suspense>
             )}
           </div>
        </main>
      </div>
    </div>
  );
}
