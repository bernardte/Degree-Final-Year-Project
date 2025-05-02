const RoomCardSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl px-10 md:px-0">
      <div className="mb-6 animate-pulse flex gap-3 items-center justify-center">
        {/* Skeleton for RoomFilter Button */}
        <div className="h-13 w-25 animate-pulse rounded-full bg-gray-200" />
        <div className="h-13 w-25 animate-pulse rounded-full bg-gray-200" />
        <div className="h-13 w-25 animate-pulse rounded-full bg-gray-200" />
        <div className="h-13 w-25 animate-pulse rounded-full bg-gray-200" />
        <div className="h-13 w-25 animate-pulse rounded-full bg-gray-200" />
      </div>

      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="mb-10 animate-pulse overflow-hidden rounded-2xl bg-white shadow-lg"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="w-full md:w-1/2">
              <div className="animate-pulse h-[350px] min-w-100 rounded-t-2xl bg-gray-200 md:rounded-none md:rounded-l-2xl" />
            </div>

            {/* Content Section */}
            <div className="flex w-full flex-col justify-between p-8 md:w-1/2 animate-pulse">
              <div>
                <div className="mb-4 h-8 w-2/3 rounded animate-pulse bg-gray-300" />
                <div className="mb-2 h-4 w-1/2 rounded animate-pulse bg-gray-200" />
                <div className="mb-6 h-4 w-full rounded animate-pulse bg-gray-200" />
                <div className="mb-2 h-4 w-11/12 rounded animate-pulse bg-gray-200" />
                <div className="mb-4 h-4 w-10/12 rounded animate-pulse bg-gray-200" />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="h-10 w-36 rounded-md animate-pulse bg-gray-300" />
                <div className="h-5 w-32 rounded animate-pulse bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomCardSkeleton;
