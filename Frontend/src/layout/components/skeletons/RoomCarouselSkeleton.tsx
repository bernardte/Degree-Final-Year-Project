const RoomCarouselSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-md">
      <div className="h-60 w-full bg-gray-300" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-2/3 rounded bg-gray-300" />
        <div className="flex justify-between">
          <div className="h-4 w-1/4 rounded bg-gray-300" />
          <div className="h-4 w-1/4 rounded bg-gray-300" />
        </div>
        <div className="h-10 w-full rounded bg-gray-300" />
      </div>
    </div>
  );
}

export default RoomCarouselSkeleton;
