export interface LoadingSkeletonProps {
  lines?: number;
  showButton?: boolean;
}

export const LoadingSkeleton = ({
  lines = 3,
  showButton = true,
}: LoadingSkeletonProps) => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        {showButton && <div className="h-10 bg-gray-200 rounded-lg w-32"></div>}
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="flex justify-end space-x-2 mt-4">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
