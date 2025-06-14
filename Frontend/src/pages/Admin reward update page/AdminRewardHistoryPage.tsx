// AdminRewardHistoryPage.tsx
import { useState, useEffect } from "react";
import RewardHistoryTable from "@/layout/components/admin-page-component/reward-history-components/rewardHistoryTable";
import useSystemSettingStore from "@/stores/useSystemSettingStore";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Filter,
  Search,
  Gift,
  Minus,
  Plus,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminRewardHistoryPage = () => {
  const { rewardPointsHistory, fetchRewardPointsHistory, isLoading, error } =
    useSystemSettingStore();

  const [filteredData, setFilteredData] = useState(rewardPointsHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  useEffect(() => {
    fetchRewardPointsHistory();
  }, [fetchRewardPointsHistory]);

  useEffect(() => {
    // Apply filters whenever data or filters change
    let result = rewardPointsHistory;

    // Apply search filter (username, email, booking reference)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.user?.username?.toLowerCase().includes(term) ||
          item.user?.email?.toLowerCase().includes(term) ||
          (item.bookingReference &&
            item.bookingReference.toLowerCase().includes(term)),
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((item) => item.type === typeFilter);
    }

    // Apply source filter
    if (sourceFilter !== "all") {
      result = result.filter((item) => item.source === sourceFilter);
    }

    setFilteredData(result);
  }, [rewardPointsHistory, searchTerm, typeFilter, sourceFilter]);

  const handleRefresh = async () => {
    try {
      await fetchRewardPointsHistory();
    } catch (err) {
      console.error("Failed to refresh data:", err);
    }
  };

  // Calculate statistics
  const totalEarned = rewardPointsHistory
    .filter((item) => item.type === "earn")
    .reduce((sum, item) => sum + item.points, 0);

  const totalRedeemed = rewardPointsHistory
    .filter((item) => item.type === "redeem")
    .reduce((sum, item) => sum + item.points, 0);

  const totalTransactions = rewardPointsHistory.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Reward Points History
        </h1>
        <p className="text-gray-600">
          Track all reward point transactions across your platform
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>
            {error ||
              "Failed to load reward history data. Please try again."}
            <Button
              variant="outline"
              size="sm"
              className="mt-2 ml-4"
              onClick={handleRefresh}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filter Controls */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search user, email or booking..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading || !!error}
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
            disabled={isLoading || !!error}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="earn">Earn Points</SelectItem>
              <SelectItem value="redeem">Redeem Points</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sourceFilter}
            onValueChange={setSourceFilter}
            disabled={isLoading || !!error}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by Source" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="booking">Booking</SelectItem>
              <SelectItem value="Redemption">Redemption</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-green-100 p-3">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Points Earned</p>
              <p className="text-2xl font-bold text-gray-800">
                {error ? "N/A" : totalEarned}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-red-100 p-3">
              <Minus className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Points Redeemed</p>
              <p className="text-2xl font-bold text-gray-800">
                {error ? "N/A" : totalRedeemed}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-blue-100 p-3">
              <Gift className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-800">
                {error ? "N/A" : totalTransactions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <RewardHistoryTable
        rewardPointsHistory={filteredData}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default AdminRewardHistoryPage;
