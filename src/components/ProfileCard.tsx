import { VerificationBadge } from "./VerificationBadge";

interface Props {
  user: {
    name: string;
    email: string;
    avatar?: string;
    memberSince: string;
    isVerified: boolean;
    isPartner: boolean;
  };
}

export function ProfileCard({ user }: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
      <div className="size-24 bg-gray-100 rounded-full mb-4 overflow-hidden flex items-center justify-center text-3xl font-bold text-gray-500 relative group cursor-pointer border-4 border-white shadow-sm ring-1 ring-gray-100">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="size-full object-cover" />
        ) : (
          user.name.charAt(0)
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-white text-xs font-bold uppercase tracking-wider">Edit</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
      <p className="text-sm font-medium text-gray-500 mb-4">{user.email}</p>
      
      <div className="flex flex-col gap-2 w-full mt-2">
         {user.isVerified ? (
           <VerificationBadge status="verified" type="identity" />
         ) : (
           <VerificationBadge status="unverified" type="identity" />
         )}
         
         {user.isPartner && (
            <VerificationBadge status="verified" type="partner" />
         )}
      </div>
      
      <div className="w-full h-px bg-gray-100 my-6" />
      
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Member since {user.memberSince}</p>
    </div>
  );
}
