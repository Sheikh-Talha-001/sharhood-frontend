import { Outlet } from "react-router-dom";
import { useState, Suspense } from "react";
import { Sidebar } from "@/src/components/Sidebar";
import { DashboardHeader } from "@/src/components/DashboardHeader";
import { LoadingSkeleton } from "@/src/components/LoadingSkeleton";

export function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg flex">
      <Sidebar isMobileOpen={isMobileOpen} closeMobile={() => setIsMobileOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader toggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
           <div className="max-w-6xl mx-auto w-full">
             <Suspense fallback={<div className="py-10"><LoadingSkeleton type="details" /></div>}>
               <Outlet />
             </Suspense>
           </div>
        </main>
      </div>
    </div>
  );
}
