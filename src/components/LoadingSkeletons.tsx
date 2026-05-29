export function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200 w-full" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
        <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="size-10 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="border-b border-gray-100 p-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="divide-y divide-gray-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-1/5" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse pb-12">
      <div>
        <div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
