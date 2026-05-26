import { Menu, Search, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";

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
        <div className="hidden lg:flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-200 w-80 focus-within:ring-2 focus-within:ring-brand-yellow/50 focus-within:border-brand-yellow transition-all">
          <Search className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none w-full text-sm font-medium" />
        </div>
      </div>
      <div className="flex items-center gap-4">
         <Link to="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors">
           {user?.avatar ? (
             <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
           ) : (
             <div className="w-8 h-8 bg-brand-black text-brand-yellow rounded-full flex items-center justify-center font-bold">
               {user?.name?.charAt(0).toUpperCase() || <UserCircle className="w-6 h-6" />}
             </div>
           )}
           <span className="font-bold text-sm hidden sm:block">{user?.name || "My Account"}</span>
         </Link>
      </div>
    </header>
  );
}
