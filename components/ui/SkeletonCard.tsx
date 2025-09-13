const SkeletonCard = () => (
  <div className="rounded-lg p-3 md:p-6 border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="h-4 bg-gray-300 rounded w-24"></div>
      <div className="w-4 h-4 bg-gray-300 rounded"></div>
    </div>
    <div className="h-8 bg-gray-300 rounded w-20"></div>
  </div>
);

export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
);
