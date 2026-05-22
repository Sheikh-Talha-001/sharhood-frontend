import React from "react";

interface SkeletonProps {
  type?: "card" | "text" | "details" | "filters";
  count?: number;
}

export function LoadingSkeleton({ type = "card", count = 1 }: SkeletonProps) {
  const renderCardSkeleton = () => (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      <div className="aspect-4/3 bg-gray-200"></div>
      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
        </div>
        <div className="h-5 bg-gray-100 rounded-md w-1/3"></div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
             <div className="space-y-2">
               <div className="h-4 bg-gray-200 rounded w-20"></div>
               <div className="h-3 bg-gray-100 rounded w-16"></div>
             </div>
          </div>
          <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  const renderDetailsSkeleton = () => (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-6"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-4/3 rounded-3xl bg-gray-200"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            <div className="pt-4 space-y-3">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3"></div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl lg:sticky lg:top-28 space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-14 bg-gray-200 rounded-full w-full"></div>
            <div className="h-32 bg-gray-100 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFiltersSkeleton = () => (
    <div className="w-full space-y-6 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-3xl border border-gray-100 p-5">
           <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
           <div className="space-y-3">
             {[1, 2, 3, 4].map((j) => (
               <div key={j} className="flex items-center gap-3">
                 <div className="w-5 h-5 bg-gray-200 rounded"></div>
                 <div className="h-4 bg-gray-100 rounded w-2/3"></div>
               </div>
             ))}
           </div>
        </div>
      ))}
    </div>
  );

  if (type === "details") return renderDetailsSkeleton();
  if (type === "filters") return renderFiltersSkeleton();

  return (
    <React.Fragment>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          {type === "card" && renderCardSkeleton()}
          {type === "text" && <div className="h-4 bg-gray-200 rounded w-full animate-pulse my-2"></div>}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
