interface GridListSkeletonProps {
  count?: number;
  title?: string;
}

const GridListSkeleton = ({
  count = 3,
  title = "Loading...",
}: GridListSkeletonProps) => {
  return (
    <div>
      <h2 className="animate-pulse bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text py-3 text-center text-5xl font-bold text-transparent">
        {title}
      </h2>
      <div className="grid-row-1 grid gap-6 px-4 py-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="relative flex animate-pulse items-center justify-center overflow-hidden rounded-lg bg-gray-200 shadow-md"
          >
            <div className="h-[250px] w-full bg-gray-300" />

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
              <div className="mb-2 h-6 w-2/3 rounded bg-gray-400" />
              <div className="h-4 w-1/3 rounded bg-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridListSkeleton;
