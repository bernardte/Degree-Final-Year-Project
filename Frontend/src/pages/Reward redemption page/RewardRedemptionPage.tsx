import { useState, useEffect } from "react";
import useRequest from "@/hooks/useApiRequest";
import useToast from "@/hooks/useToast";
import PointsDisplay from "@/layout/components/reward-redemption-page-component/PointsDisplay";
import CategoryFilter from "@/layout/components/reward-redemption-page-component/CategoryFilter";
import AvailableRewardsTab from "@/layout/components/reward-redemption-page-component/AvailableRewardsTab";
import ClaimedRewardsTab from "@/layout/components/reward-redemption-page-component/ClaimedRewardsTabs";
import AdditionalInfo from "@/layout/components/reward-redemption-page-component/AdditionalInfo";
import ErrorDisplay from "@/layout/components/reward-redemption-page-component/ErrorDisplay";
// import LoadingSpinner from "./LoadingSpinner";
import { Reward, ClaimedReward } from "@/types/interface.type";
import LoadingSpinner from "@/layout/components/share-components/LoadingSpinner";

const RewardRedemptionPage = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<ClaimedReward[]>([]);
  const [redeemedRewardId, setRedeemedRewardId] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [userLoyaltyTier, setUserLoyaltyTier] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"available" | "claimed">(
    "available",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { showToast } = useToast();
  const { request, isLoading } = useRequest();
  const premiumBadge = rewards.find(
    (reward) => reward.category === "Accomodation",
  );

  // Fetch rewards, user points, and claimed rewards
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rewardsRes, pointsRes, claimedRes] = await Promise.all([
          request("get", "/reward/show-user-all-reward", false),
          request("get", "/users/getUserRewardPoints", false),
          request("get", "/reward/show-user-claimed-reward", false),
        ]);

        setRewards(rewardsRes);
        setUserPoints(pointsRes.userPoints);
        setUserLoyaltyTier(pointsRes.userLoyaltyTier);
        setClaimedRewards(claimedRes ?? []);
        setError(null);
      } catch (error: any) {
        setError(error?.response?.data?.error || "Failed to load rewards");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle reward redemption
  const handleRedeem = async (rewardId: string, requiredPoints: number) => {
    if (userPoints < requiredPoints) {
      showToast("info", "Insufficient points to redeem this reward.");
      return;
    }
    setRedeemedRewardId(rewardId);

    try {
      const response = await request(
        "post",
        `/reward/reward-claim/${rewardId}`,
        {},
        {},
        "Reward redemption successful!",
        "success",
        true,
      );
      setUserPoints(response.userPoints);

      // Refresh claimed rewards after redemption
      const claimedRes = await request(
        "get",
        "/reward/show-user-claimed-reward",
        false,
      );
      setClaimedRewards(claimedRes ?? []);
    } catch (error: any) {
        showToast("error", error?.response?.data?.error);
    } finally {
      setRedeemedRewardId(null);
    }
  };

  // Filter rewards by category
  const knownCategories = [
    "Accommodation",
    "Dining",
    "Service",
    "Membership",
  ];

  const filteredRewards =
    selectedCategory === "all"
      ? rewards
      : selectedCategory === "Other"
        ? rewards.filter((reward) => !knownCategories.includes(reward.category))
        : rewards.filter((reward) => reward.category === selectedCategory);
    console.log(
      selectedCategory
    );
  if (loading || isLoading) return <LoadingSpinner message={"loading rewards..."}/>;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-900 px-4 py-8 text-white shadow-md">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            Exclusive Hotel Rewards
          </h1>
          {/* Premium Badge */}
          {premiumBadge && (
            <div className="absolute top-11 right-[55%] rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-xs font-bold text-white">
              PREMIUM
            </div>
          )}
          <p className="mb-6 max-w-2xl text-blue-200">
            Redeem your loyalty points for unforgettable experiences and premium
            benefits
          </p>

          <PointsDisplay
            userPoints={userPoints}
            userLoyaltyTier={userLoyaltyTier}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "available"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("available")}
          >
            Available Rewards
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "claimed"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("claimed")}
          >
            My Rewards (
            {Array.isArray(claimedRewards) ? claimedRewards.length : 0}
            )
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "available" ? (
          <>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <AvailableRewardsTab
              rewards={filteredRewards}
              onRedeem={handleRedeem}
              redeemedRewardId={redeemedRewardId}
            />
            <AdditionalInfo />
          </>
        ) : (
          <ClaimedRewardsTab
            claimedRewards={claimedRewards}
          />
        )}
      </div>
    </div>
  );
};

export default RewardRedemptionPage;
