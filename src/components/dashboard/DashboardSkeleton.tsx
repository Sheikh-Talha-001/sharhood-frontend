export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-64 bg-gray-200 rounded-3xl w-full"></div>
      
      {/* Stats and Trust Section Skeleton */}
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="h-32 bg-gray-200 rounded-3xl"></div>
           ))}
        </div>
        <div className="lg:col-span-2 h-[272px] bg-gray-200 rounded-3xl"></div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[1, 2, 3, 4].map(i => (
           <div key={i} className="h-40 bg-gray-200 rounded-3xl"></div>
         ))}
      </div>
    </div>
  );
}
