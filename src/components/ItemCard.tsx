import { Link } from "react-router-dom";
import { ShieldCheck, Heart, MapPin } from "lucide-react";

export interface ItemProps {
  id: string;
  _id?: string;
  title: string;
  category: string;
  condition: string;
  image?: string;
  images?: string[];
  price?: string;
  owner?: {
    name: string;
    isVerified: boolean | string; // Could be boolean or "verified" string depending on backend population
    isPartner: boolean;
  };
  available?: boolean;
  availability?: boolean;
}

interface Props {
  item: ItemProps;
}

export function ItemCard({ item }: Props) {
  // Normalize fields between different API shapes
  const itemId = item._id || item.id;
  const image = item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80";
  const isAvailable = item.available !== undefined ? item.available : (item.availability !== undefined ? item.availability : true);
  const owner = item.owner || { name: "Local User", isVerified: false, isPartner: false };
  const price = item.price || "Free";
  const isVerified = owner.isVerified === true || owner.isVerified === "verified";

  return (
    <Link to={`/dashboard/marketplace/${itemId}`} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col h-full relative">
      <div className="aspect-4/3 relative overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-900 shadow-sm uppercase tracking-widest border border-white/20">
          {item.category}
        </div>
        
        {/* Favorite Placeholder */}
        <button 
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10"
        >
          <Heart className="w-4 h-4" />
        </button>

        {!isAvailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
             <div className="bg-brand-black text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl">
                Currently Borrowed
             </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="font-black text-xl text-gray-900 line-clamp-1 group-hover:text-brand-yellow transition-colors leading-tight">
             {item.title}
          </h3>
          <span className="font-black text-brand-black bg-brand-yellow/30 px-3 py-1 rounded-lg text-sm shrink-0">
             {price}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Nearby</span>
          <span>•</span>
          <span>{item.condition}</span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 border border-gray-200 shrink-0">
                  {owner.name.charAt(0).toUpperCase()}
               </div>
               <div>
                 <p className="text-sm font-bold text-gray-900 leading-none mb-1">{owner.name}</p>
                 <div className="flex items-center">
                   {isVerified ? (
                     <div className="flex items-center gap-1 text-green-600">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                     </div>
                   ) : (
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Neighbor</span>
                   )}
                 </div>
               </div>
            </div>
            
            <div className="px-4 py-2 rounded-full bg-gray-50 text-brand-black text-xs font-bold group-hover:bg-brand-black group-hover:text-white transition-colors text-center shrink-0">
               {isAvailable ? "Borrow" : "View"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
