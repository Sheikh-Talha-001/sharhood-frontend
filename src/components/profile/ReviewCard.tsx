import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  avatarUrl?: string;
  role: "borrowed" | "lent";
  itemContext: string;
  rating: number;
  comment: string;
  date: string;
}

export function ReviewCard({ name, avatarUrl, role, itemContext, rating, comment, date }: ReviewCardProps) {
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
           {avatarUrl ? (
             <img src={avatarUrl} alt={name} className="size-12 rounded-full object-cover bg-gray-100" />
           ) : (
             <div className="size-12 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold">
               {initials}
             </div>
           )}
           <div>
             <h4 className="font-bold text-gray-900 leading-none mb-1">{name}</h4>
             <p className="text-xs font-medium text-gray-500 capitalize">
               {role === "borrowed" ? "Borrowed" : "Lent"}: {itemContext}
             </p>
           </div>
        </div>

        {/* Stars */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`size-4 ${i < rating ? 'text-green-500 fill-green-500' : 'text-gray-200'}`} />
          ))}
        </div>
      </div>

      <p className="text-sm font-medium text-gray-700 italic leading-relaxed mt-2">
        "{comment}"
      </p>

      <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {date}
      </div>
    </div>
  );
}
