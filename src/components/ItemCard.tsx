import { Link, useLocation } from "react-router-dom";
import { Heart, MapPin, CheckCircle2 } from "lucide-react";

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
    <Link to={`${basePath}/${itemId}`} className="group flex flex-col h-full bg-[#ffffff] rounded-2xl overflow-hidden border border-[#e5e5e5] hover:border-[#7e0038] transition-colors duration-300 relative shadow-none font-sans">
      
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#fcf3ec]">
        <img 
          src={image} 
          alt={item.title} 
          loading="lazy"
          className="size-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Category & Status Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <div className="bg-[#fcf3ec] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#7e0038] border border-[#7e0038]/20 tracking-wide uppercase">
             {item.category}
           </div>
        </div>

        {/* Favorite Button */}
        <button type="button" 
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-4 right-4 size-10 bg-[#ffffff] border border-[#e5e5e5] rounded-full flex items-center justify-center text-[#333333] hover:text-[#7e0038] hover:border-[#7e0038] transition-colors z-10"
        >
          <Heart className="size-5" />
        </button>

        {/* Unavailability Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-[#fcf3ec]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 border-t border-[#e5e5e5]">
             <div className="bg-[#241d1b] text-[#ffffff] px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                Currently Borrowed
             </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
           <h3 className="font-semibold text-[16px] text-[#241d1b] line-clamp-1 group-hover:text-[#7e0038] transition-colors mb-1">
              {item.title}
           </h3>
           <p className="text-sm font-medium text-[#333333] flex items-center gap-1.5">
              <MapPin className="size-4" /> {itemLocation}
           </p>
        </div>
        
        <div className="flex items-center gap-2 mb-5">
           <span className="font-semibold text-[#241d1b] bg-[#fcf3ec] px-3 py-1.5 rounded-lg text-xs border border-[#e5e5e5]">
              {price}
           </span>
           <span className="font-medium text-[#333333] bg-[#fcf3ec] px-3 py-1.5 rounded-lg text-xs capitalize border border-[#e5e5e5]">
              Condition: {item.condition}
           </span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-[#e5e5e5] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="size-10 bg-[#fcf3ec] border border-[#e5e5e5] text-[#241d1b] rounded-full flex items-center justify-center text-[15.36px] font-semibold shrink-0">
                {owner.name.charAt(0).toUpperCase()}
             </div>
             <div className="flex flex-col">
               <span className="text-[15.36px] font-medium text-[#241d1b] leading-tight">{owner.name}</span>
               {isVerified ? (
                 <span className="text-xs font-semibold text-[#10664c] flex items-center gap-1 mt-0.5 tracking-wide">
                    <CheckCircle2 className="size-3.5" /> Verified
                 </span>
               ) : (
                 <span className="text-xs font-medium text-[#333333] mt-0.5 tracking-wide">
                    Neighbor
                 </span>
               )}
             </div>
          </div>
          
          <div className="bg-[#fcf3ec] border border-[#7e0038] text-[#7e0038] px-5 py-2 rounded-xl text-sm font-semibold group-hover:bg-[#7e0038] group-hover:text-[#ffffff] transition-colors shrink-0">
             {isAvailable ? "Request" : "View"}
          </div>
        </div>
      </div>
    </Link>
  );
}
