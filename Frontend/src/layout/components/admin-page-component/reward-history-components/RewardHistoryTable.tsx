// RewardHistoryTable.tsx
import { useState } from "react";
import { RewardHistories } from "@/types/interface.type";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import {
  DollarSign,
  Gift,
  Minus,
  Plus,
  UserCheck,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Type for sort configuration
type SortConfig = {
  key: keyof RewardHistories;
  direction: "asc" | "desc";
};

const RewardHistoryTable = ({
  rewardPointsHistory,
  isLoading,
  error,
}: {
  rewardPointsHistory: RewardHistories[];
  isLoading: boolean;
  error: String | null;
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Render icon based on transaction type
  const renderTypeIcon = (type: string) => {
    if (type === "earn") {
      return <Plus size={16} className="text-green-500" />;
    }
    return <Minus size={16} className="text-red-500" />;
  };

  // Render icon based on point source
  const renderSourceIcon = (source: string) => {
    switch (source) {
      case "booking":
        return <DollarSign size={16} className="text-blue-500" />;
      case "Redemption":
        return <Gift size={16} className="text-orange-500" />;
      default:
        return <Gift size={16} className="text-gray-500" />;
    }
  };

  // Handle sorting
  const requestSort = (key: keyof RewardHistories) => {
    if (isLoading || error) return;

    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to data
  const sortedData = () => {
    if (!sortConfig || error) return rewardPointsHistory;

    return [...rewardPointsHistory].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData().slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rewardPointsHistory.length / itemsPerPage);

  // Render sort indicator
  const getSortIndicator = (key: keyof RewardHistories) => {
    if (error) return null;
    if (!sortConfig || sortConfig.key !== key)
      return <ArrowUpDown size={14} className="ml-1" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={14} className="ml-1" />
    ) : (
      <ChevronDown size={14} className="ml-1" />
    );
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (isLoading) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      {error ? (
        <div className="p-8 text-center">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Data Loading Failed</AlertTitle>
            <AlertDescription>
              {error || "Failed to load reward history data"}
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                    onClick={() => requestSort("user")}
                  >
                    <div className="flex items-center">
                      User
                      {getSortIndicator("user")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                    onClick={() => requestSort("type")}
                  >
                    <div className="flex items-center">
                      Type
                      {getSortIndicator("type")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                    onClick={() => requestSort("points")}
                  >
                    <div className="flex items-center">
                      Points
                      {getSortIndicator("points")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Source
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Booking Reference
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                    onClick={() => requestSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIndicator("createdAt")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    </tr>
                  ))
                ) : currentItems.length > 0 ? (
                  currentItems.map((reward) => (
                    <tr key={reward?._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserCheck className="mr-2 text-gray-400" size={16} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {reward?.user?.username || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {reward?.user?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderTypeIcon(reward.type)}
                          <span
                            className={`ml-2 text-sm font-medium ${
                              reward.type === "earn"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {reward.type.charAt(0).toUpperCase() +
                              reward.type.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs leading-5 font-semibold ${
                            reward.type === "earn"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {reward.type === "earn" ? "+" : "-"}
                          {reward.points}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderSourceIcon(reward.source)}
                          <span className="ml-2 text-sm text-gray-900">
                            {reward.source}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {reward.bookingReference || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDateInBookingCheckOut(reward.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center py-12">
                        <Gift className="mb-4 h-12 w-12 text-gray-400" />
                        <p className="text-lg font-medium">
                          No reward history found
                        </p>
                        <p className="mt-2 text-gray-600">
                          Try adjusting your filters or refresh the data
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && rewardPointsHistory.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, rewardPointsHistory.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {rewardPointsHistory.length}
                </span>{" "}
                transactions
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className={`rounded-md px-3 py-1 ${
                    currentPage === 1 || isLoading
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className={`rounded-md px-3 py-1 ${
                    currentPage === totalPages || isLoading
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RewardHistoryTable;
