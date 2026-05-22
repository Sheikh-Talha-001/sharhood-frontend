import { Link } from "react-router-dom";
import { TrustBadge } from "./TrustBadge";
import { Heart, ArrowRight } from "lucide-react";

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
    isVerified: boolean;
    isPartner: boolean;
  };
  available?: boolean;
  availability?: boolean;
}

interface Props {
  item: ItemProps;
}

export function ItemCard({ item }: Props) {
  // Handle both API response formats (sometimes _id, sometimes id, etc)
  const itemId = item._id || item.id;
  const image = item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80";
  const isAvailable = item.available !== undefined ? item.available : (item.availability !== undefined ? item.availability : true);
  const owner = item.owner || { name: "Local User", isVerified: false, isPartner: false };
  const price = item.price || "Free";

  return (
    <Link to={`/dashboard/marketplace/${itemId}`} className="group bg-white rounded-4xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
      <div className="aspect-4/3 relative overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-sm">
          {item.category}
        </div>
        
        {/* Favorite Placeholder */}
        <button 
          onClick={(e) => { e.preventDefault(); /* Wishlist placeholder logic */ }}
          className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10"
        >
          <Heart className="w-4 h-4" />
        </button>

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-white text-brand-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">Currently Borrowed</span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-1 group-hover:text-brand-yellow transition-colors">{item.title}</h3>
          <span className="font-bold text-brand-black bg-brand-yellow/20 px-2.5 py-1 rounded-md text-sm whitespace-nowrap ml-3">{price}</span>
        </div>
        <div className="text-xs font-bold text-gray-500 mb-5 bg-gray-50 self-start px-2.5 py-1.5 rounded-lg border border-gray-100">
          Condition: <span className="text-gray-700">{item.condition}</span>
        </div>
        
        <div className="mt-auto pt-5 border-t border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 border border-gray-200">
                  {owner.name.charAt(0)}
               </div>
               <div>
                 <p className="text-sm font-bold text-gray-900 leading-none mb-1.5">{owner.name}</p>
                 <div className="flex items-center gap-1.5">
                   {owner.isVerified && <TrustBadge type="verified" showText={false} className="px-1.5! py-0.5!" />}
                   {owner.isPartner && <TrustBadge type="partner" showText={false} className="px-1.5! py-0.5!" />}
                 </div>
               </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">View Details</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-yellow group-hover:text-brand-black text-gray-400 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
