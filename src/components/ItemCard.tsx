import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Heart, MapPin, CheckCircle2 } from "lucide-react";

export interface ItemProps {
  id: string;
  _id?: string;
  title: string;
  category: string;
  condition: string;
  location?: string;
  image?: string;
  images?: string[];
  price?: string;
  owner?: {
    name: string;
    isVerified: boolean | string;
    isPartner: boolean;
  };
  available?: boolean;
  availability?: boolean;
}

interface Props {
  item: ItemProps;
}

export function ItemCard({ item }: Props) {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/dashboard') ? '/dashboard/marketplace' : '/marketplace';
  
  const itemId = item._id || item.id;
  const image = item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80";
  const isAvailable = item.available !== undefined ? item.available : (item.availability !== undefined ? item.availability : true);
  const owner = item.owner || { name: "Neighbor", isVerified: false, isPartner: false };
  const price = item.price || "Free to borrow";
  const isVerified = owner.isVerified === true || owner.isVerified === "verified";
  const itemLocation = item.location || "Nearby";

  return (
    <Link to={`${basePath}/${itemId}`} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:border-brand-yellow/30 transition-all duration-500 relative">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img 
          src={image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Category & Status Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black text-brand-black shadow-sm uppercase tracking-widest border border-gray-100/50">
             {item.category}
           </div>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10"
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* Unavailability Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
             <div className="bg-brand-black text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2">
                Currently Borrowed
             </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
           <h3 className="font-black text-xl text-gray-900 line-clamp-1 group-hover:text-brand-yellow transition-colors tracking-tight mb-1">
              {item.title}
           </h3>
           <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {itemLocation}
           </p>
        </div>
        
        <div className="flex items-center gap-2 mb-5">
           <span className="font-bold text-brand-black bg-gray-100 px-3 py-1.5 rounded-lg text-xs">
              {price}
           </span>
           <span className="font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg text-xs capitalize">
              Condition: {item.condition}
           </span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-brand-yellow/20 text-brand-black rounded-full flex items-center justify-center text-sm font-black shrink-0">
                {owner.name.charAt(0).toUpperCase()}
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-bold text-gray-900 leading-none">{owner.name}</span>
               {isVerified ? (
                 <span className="text-[10px] font-black text-green-600 flex items-center gap-1 mt-1 uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                 </span>
               ) : (
                 <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                    Neighbor
                 </span>
               )}
             </div>
          </div>
          
          <div className="bg-brand-black text-white px-5 py-2 rounded-full text-xs font-bold group-hover:bg-brand-yellow group-hover:text-brand-black transition-colors shrink-0 shadow-sm">
             {isAvailable ? "Request" : "View"}
          </div>
        </div>
      </div>
    </Link>
  );
}
