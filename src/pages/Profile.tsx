import { useAuth } from "@/src/context/AuthContext";
import { ProfileHeader } from "@/src/components/profile/ProfileHeader";
import { TrustScoreCard } from "@/src/components/profile/TrustScoreCard";
import { VerificationCard } from "@/src/components/profile/VerificationCard";
import { ReviewCard } from "@/src/components/profile/ReviewCard";
import { CommunityCard } from "@/src/components/profile/CommunityCard";

export function Profile() {
  const { user } = useAuth();

  // Mocked reviews representing real community endorsements for the UI layout
  const mockReviews = [
    {
      id: 1,
      name: "Marcus Webb",
      role: "borrowed" as const,
      itemContext: "Professional Drill Kit",
      rating: 5,
      comment: `${user?.name || "The user"} was incredibly helpful and quick to respond. The equipment was in pristine condition. Exactly why I love this community!`,
      date: "MARCH 12, 2024"
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      role: "lent" as const,
      itemContext: "Camping Tent",
      rating: 5,
      comment: `Returned my tent even cleaner than when they took it. Very respectful of others' property. Would lend to ${user?.name || "them"} any time.`,
      date: "FEBRUARY 28, 2024"
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <ProfileHeader user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <TrustScoreCard />
        </div>
        <div>
          <VerificationCard user={user} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-end justify-between mb-2">
             <h2 className="text-2xl font-black text-gray-900">Community Endorsements <span className="text-gray-400 font-bold ml-2 text-xl">48</span></h2>
             <button type="button" className="text-sm font-bold text-green-500 hover:text-green-600 transition-colors uppercase tracking-wide">
               View All History
             </button>
          </div>
          
          {mockReviews.map((review) => (
             <ReviewCard key={review.id} {...review} />
          ))}
        </div>
        
        <div className="space-y-8">
           <CommunityCard />
        </div>
      </div>
    </div>
  );
}
