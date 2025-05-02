const RoomInformationSkeleton = () => {
  return (
    <div className="inset-0 flex min-h-screen items-center bg-gradient-to-b from-cyan-100 via-white to-sky-100">
      <div className="flex h-full w-full animate-pulse flex-col md:flex-row">
        {/* Image Skeleton */}
        <div className="mx-10 h-[300px] w-full md:h-auto md:w-1/2">
          <div className="h-full w-full rounded-2xl bg-gray-300" />
        </div>

        {/* Info Skeleton */}
        <div className="flex w-full flex-col justify-between space-y-4 p-8 md:w-1/2 animate-pulse">
          <div>
            <div className="mb-2 h-8 w-2/3 rounded bg-gray-300"></div>
            <div className="mb-4 h-5 w-1/2 rounded bg-gray-200"></div>
            <div className="mb-6 h-20 w-full rounded bg-gray-200"></div>

            <ul className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <li key={index} className="h-4 w-1/2 rounded bg-gray-200" />
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 animate-pulse">
            <div className="space-y-2">
              <div className="h-6 w-32 rounded bg-gray-300"></div>
              <div className="h-4 w-40 rounded bg-gray-200"></div>
            </div>
            <div className="h-10 w-32 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomInformationSkeleton;
