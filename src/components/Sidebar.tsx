import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, FileText, Bell, Users, Settings, LogOut, X, Shield, Store, ShieldCheck, AlertTriangle, Scale, Activity, ArrowLeft, PlusCircle } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";

interface Props {
  isMobileOpen?: boolean;
  closeMobile?: () => void;
}

export function Sidebar({ isMobileOpen, closeMobile }: Props) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  const inAdminRoute = location.pathname.startsWith("/admin");

  const userNavItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "Browse Items", path: "/dashboard/marketplace", icon: Package },
    // Conditional items for Partners/Lenders
    ...(user?.canListItems ? [
      { label: "My Items", path: "/dashboard/my-items", icon: Package },
      { label: "Incoming Requests", path: "/dashboard/incoming-requests", icon: Bell },
    ] : []),
    { label: "My Requests", path: "/dashboard/my-requests", icon: FileText },
    { label: "Upload Item", path: "/dashboard/upload", icon: PlusCircle },
    { label: "Agreements", path: "/dashboard/agreements", icon: FileText },
    { label: "Verification", path: "/dashboard/verification", icon: Shield },
    { label: "Partner Program", path: "/dashboard/partner", icon: Store },
    { label: "Profile", path: "/dashboard/profile", icon: Settings },
  ];

  const adminNavItems = [
    { label: "Admin Overview", path: "/admin", icon: ShieldCheck, exact: true },
    { label: "Verifications", path: "/admin/verifications", icon: Shield },
    { label: "Partner Apps", path: "/admin/partners", icon: Store },
    { label: "Reports", path: "/admin/reports", icon: AlertTriangle },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Items", path: "/admin/items", icon: Package },
    { label: "Appeals", path: "/admin/appeals", icon: Scale },
    { label: "Activity Feed", path: "/admin/activity", icon: Activity },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "bg-white border-r border-gray-200 flex flex-col w-64 h-screen fixed md:sticky top-0 z-50 transition-transform duration-300 md:translate-x-0 overflow-hidden shrink-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-brand-black rounded-lg flex items-center justify-center">
                <span className="text-brand-yellow font-black text-lg leading-none">S</span>
             </div>
             <span className="font-bold text-xl tracking-tight text-brand-black">ShareHood</span>
           </div>
           {isMobileOpen && (
             <button onClick={closeMobile} className="md:hidden text-gray-500 hover:bg-gray-100 p-1.5 rounded-md">
               <X className="w-5 h-5" />
             </button>
           )}
        </div>
        
        <div className="flex-1 overflow-y-auto w-full">
          {inAdminRoute ? (
            <div className="p-4 flex flex-col gap-1">
               <p className="px-4 text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5"/> Admin Panel</p>
               {adminNavItems.map((item) => (
                 <NavLink
                   key={item.path}
                   to={item.path}
                   end={item.exact}
                   onClick={closeMobile}
                   className={({ isActive }) => cn(
                     "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-sm",
                     isActive ? "bg-red-50 text-red-600 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                   )}
                 >
                   <item.icon className="w-5 h-5 flex-shrink-0" />
                   {item.label}
                 </NavLink>
               ))}
               
               <div className="mt-8 border-t border-gray-100 pt-4">
                 <NavLink to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 transition-all text-sm">
                   <ArrowLeft className="w-5 h-5" /> Exit Admin
                 </NavLink>
               </div>
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-1">
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Community</p>
              {userNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={closeMobile}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-sm",
                    isActive ? "bg-brand-yellow text-brand-black shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </NavLink>
              ))}

              {isAdmin && (
                <div className="mt-8 border-t border-gray-100 pt-4">
                   <NavLink to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-all text-sm shadow-sm">
                     <ShieldCheck className="w-5 h-5" /> Go to Admin Panel
                   </NavLink>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={logout} className="flex flex-row items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-sm">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
