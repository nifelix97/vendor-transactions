const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-1 items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-200" />
              
              <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 rounded-full bg-gray-200" />
                  <div className="h-6 w-24 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <div className="h-5 w-24 rounded bg-gray-200" />
              <div className="h-3 w-16 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
