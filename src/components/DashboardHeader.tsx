import { Menu, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";
import { NotificationBell } from "@/src/components/NotificationBell";

interface Props {
  toggleMobileMenu: () => void;
}

export function DashboardHeader({ toggleMobileMenu }: Props) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={toggleMobileMenu} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <div className="flex items-center gap-6">
         <NotificationBell />
         <div className="w-px h-8 bg-gray-200"></div>
         <Link to="/dashboard/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
           {user?.avatar ? (
             <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-gray-100" />
           ) : (
             <div className="w-9 h-9 bg-brand-black text-brand-yellow rounded-full flex items-center justify-center font-bold">
               {user?.name?.charAt(0).toUpperCase() || <UserCircle className="w-6 h-6" />}
             </div>
           )}
           <span className="font-bold text-sm hidden sm:block">{user?.name || "My Account"}</span>
         </Link>
      </div>
    </header>
  );
}
