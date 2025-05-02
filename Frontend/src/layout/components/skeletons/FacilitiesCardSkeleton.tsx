const FacilitiesCardSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-md">
      <div className="h-48 w-full bg-gray-300" />

      <div className="flex gap-2 p-2">
        <div className="align-center my-auto w-1/2 justify-center text-lg font-semibold text-gray-800 animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-24 rounded bg-gray-300" />
            <div className="h-7 w-7 rounded-full bg-gray-300" />
          </div>
        </div>
        <div className="w-1/2 justify-center animate-pulse">
          <div className="mb-2 h-4 w-full rounded bg-gray-300" />
          <div className="mb-1 h-4 w-32 rounded bg-gray-300" />
          <div className="mb-1 h-4 w-32 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default FacilitiesCardSkeleton;
