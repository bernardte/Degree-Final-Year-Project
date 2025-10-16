import { useEffect, useState, useRef, useCallback } from "react";
import { Calendar, Bed, Clock } from "lucide-react";
import useRewardStore from "@/stores/useRewardStore";

const RewardHistoryTab = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1); // Current page number
  const [hasMore, setHasMore] = useState(true); // to Check is there more data

  const { rewardHistory, getRewardHistoryForCertainUser, isLoading } =
    useRewardStore((state) => state);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Initial loading of the first page
  useEffect(() => {
    getRewardHistoryForCertainUser(1, 10, false);
    setPage(1);
  }, [getRewardHistoryForCertainUser]);

  // Filtering
  const filteredRewards = rewardHistory.filter((reward) => {
    const matchesFilter =
      activeFilter === "all" || reward.type === activeFilter;
    return matchesFilter;
  });

  // Formatting Dates
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // IntersectionObserver monitors scroll bottoming out
  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && hasMore) {
        const nextPage = page + 1;
        await getRewardHistoryForCertainUser(nextPage, 10, true); // load more
        setPage(nextPage);
        if (rewardHistory.length < nextPage * 10) {
          setHasMore(false); //No more
        }
      }
    },
    [
      page,
      hasMore,
      isLoading,
      getRewardHistoryForCertainUser,
      rewardHistory.length,
    ],
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl overflow-auto px-4 sm:px-6 lg:px-8">
        {/* Control Area */}
        <div className="mb-6 rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col items-start justify-end gap-4 sm:flex-row sm:items-center">
              {/* Filter Button */}
              <div className="flex items-center gap-3">
                <div className="flex rounded-lg bg-gray-100 p-1">
                  {["all", "earn", "redeem"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                        activeFilter === filter
                          ? `bg-white ${
                              filter === "earn"
                                ? "text-green-600"
                                : filter === "redeem"
                                  ? "text-red-600"
                                  : "text-blue-600"
                            } shadow-sm`
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {filter === "all"
                        ? "All"
                        : filter === "earn"
                          ? "Earned"
                          : "Redeemed"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="overflow-hidden">
            {isLoading && rewardHistory.length === 0 ? (
              <div className="py-12 text-center text-gray-500">Loading...</div>
            ) : filteredRewards.length === 0 ? (
              <div className="py-12 text-center">
                <Bed className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-lg text-gray-500">No hotel rewards found</p>
                <p className="mt-1 text-sm text-gray-400">
                  Try adjusting your filter criteria
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200">
                  {filteredRewards.map((reward) => (
                    <div
                      key={reward._id}
                      className="p-6 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-3">
                              <h3
                                className={`font-semibold ${
                                  reward.type === "earn"
                                    ? "text-green-600"
                                    : "text-rose-600"
                                } capitalize`}
                              >
                                {reward.type}
                              </h3>
                            </div>
                            <p className="mb-2 text-sm font-semibold text-gray-600 capitalize">
                              {reward.bookingReference
                                ? "Booking Reference:"
                                : ""}{" "}
                              {reward.bookingReference}&nbsp;
                              {reward.description.toLowerCase()}
                            </p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                {formatDate(reward.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`text-lg font-semibold ${
                            reward.type === "earn"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {reward.type === "earn" ? "+" : "-"}
                          {reward.points} pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lazy loading trigger */}
                <div ref={loaderRef} className="py-8 text-center text-gray-400">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div
                          className="h-3 w-3 animate-bounce rounded-full bg-blue-600"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-3 w-3 animate-bounce rounded-full bg-blue-600"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="h-3 w-3 animate-bounce rounded-full bg-blue-600"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Loading more rewards...
                        </span>
                      </div>
                    </div>
                  ) : hasMore ? (
                    "Scroll to load more"
                  ) : (
                    "No more records"
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardHistoryTab;
