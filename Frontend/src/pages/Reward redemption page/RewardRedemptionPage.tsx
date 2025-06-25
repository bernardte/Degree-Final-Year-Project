import { useState, useEffect } from "react";
import {
  Gift,
  Star,
  Coffee,
  ShoppingBag,
  Ticket,
  Zap,
  Hotel,
  Utensils,
  Sparkles,
  Mountain,
} from "lucide-react";
import useRequest from "@/hooks/useApiRequest";
import { Reward } from "@/types/interface.type";
import useToast from "@/hooks/useToast";

const RewardRedemptionPage = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const { showToast } = useToast();
  const [userPoints, setUserPoints] = useState(0);
  const [userLoyaltyTier, setUserLoyaltyTier] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { request, isLoading } = useRequest();

  const premiumBadge = rewards.find(
    (reward) => reward.category === "Accomodation",
  );

  // Enhanced icon mapping with hotel-themed options
  const iconComponents = {
    gift: Gift,
    star: Star,
    coffee: Coffee,
    shopping: ShoppingBag,
    ticket: Ticket,
    zap: Zap,
    hotel: Hotel,
    dining: Utensils,
    experience: Sparkles,
    travel: Mountain,
  };

  // Category options for filtering
  const categories = [
    { id: "all", name: "All Rewards" },
    { id: "stay", name: "Hotel Stays" },
    { id: "dining", name: "Dining" },
    { id: "experience", name: "Experiences" },
    { id: "other", name: "Other" },
  ];

  // Fetch rewards and user points
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rewardsRes, pointsRes] = await Promise.all([
          request("get", "/reward/rewards", false),
          request("get", "/users/getUserRewardPoints", false),
        ]);

        setRewards(rewardsRes);
        setUserPoints(pointsRes.userPoints);
        setUserLoyaltyTier(pointsRes.userLoyaltyTier);
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
      showToast("error", "Insufficient points to redeem this reward.");
      return;
    }

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
    } catch (err: any) {
      showToast("error", err?.response?.data?.error);
    }
  };

  // Filter rewards by selected category
  const filteredRewards =
    selectedCategory === "all"
      ? rewards
      : rewards.filter((reward) => reward.category === selectedCategory);

  // Loading and error states
  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex animate-pulse flex-col items-center">
          <div className="mb-4 h-16 w-16 rounded-full bg-gray-200"></div>
          <div className="text-xl text-gray-600">Loading rewards...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="max-w-md rounded-xl bg-red-50 p-8 text-center">
          <div className="mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-800">
            Error Loading Rewards
          </h3>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-900 px-4 py-8 text-white shadow-md">
        <div className="mx-auto max-w-6xl">
          <div className="relative">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              Exclusive Hotel Rewards
            </h1>
            {/* Premium Badge */}
            {premiumBadge && (
              <div className="absolute top-0 right-1/2 mx-15 my-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-xs font-bold text-white">
                PREMIUM
              </div>
            )}
          </div>

          <p className="mb-6 max-w-2xl text-blue-200">
            Redeem your loyalty points for unforgettable experiences and premium
            benefits
          </p>

          {/* Points Display */}
          <div className="flex max-w-md items-center justify-between rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div>
              <h2 className="text-lg font-semibold text-blue-100">
                Your Reward Balance
              </h2>
              <div className="mt-2 flex items-center">
                <Star className="mr-2 text-yellow-400" size={24} />
                <span className="text-2xl font-bold">
                  {userPoints.toLocaleString()}
                </span>
                <span className="ml-1 text-gray-300">Points</span>
              </div>
            </div>
            <div
              className={`rounded-full ${
                userLoyaltyTier === "bronze"
                  ? "bg-yellow-700 text-white"
                  : userLoyaltyTier === "silver"
                    ? "bg-gray-300 text-black"
                    : userLoyaltyTier === "gold"
                      ? "bg-yellow-500"
                      : "bg-indigo-500"
              } px-3 py-1 text-sm font-bold text-blue-900 capitalize`}
            >
              {userLoyaltyTier} Tier
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        {filteredRewards.length === 0 ? (
          <div className="py-12 text-center">
            <Hotel className="mx-auto mb-4 text-gray-300" size={48} />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              No rewards found
            </h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        ) : (
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRewards.map((reward) => {
              const IconComponent =
                iconComponents[reward.icon as keyof typeof iconComponents] ||
                Gift;
              const canRedeem = userPoints >= reward.points;

              return (
                <div
                  key={reward._id}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-transform duration-300 hover:shadow-xl"
                >
                  {/* Card Top - Image Placeholder */}
                  <div className="flex h-40 items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="rounded-full bg-white p-4 shadow-md">
                      <IconComponent
                        className={`${canRedeem ? "text-blue-600" : "text-gray-300"}`}
                        size={48}
                      />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    {/* Category Tag */}
                    <div className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                      {reward.category}
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-gray-800">
                      {reward.name}
                    </h3>
                    <p className="mb-4 min-h-[60px] text-gray-600">
                      {reward.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="mr-1 text-yellow-400" size={18} />
                        <span className="text-lg font-semibold">
                          {reward.points.toLocaleString()} pts
                        </span>
                      </div>

                      <button
                        onClick={() => handleRedeem(reward._id, reward.points)}
                        disabled={!canRedeem}
                        className={`rounded-lg px-4 py-2 font-medium transition-all ${
                          canRedeem
                            ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md hover:from-blue-700 hover:to-indigo-800"
                            : "cursor-not-allowed bg-gray-100 text-gray-400"
                        }`}
                      >
                        {canRedeem ? "Redeem Now" : "More Points Needed"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Additional Information */}
        <div className="mx-auto max-w-3xl rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex items-start">
            <div className="mr-4 rounded-lg bg-blue-600 p-3 text-white">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                Maximize Your Rewards
              </h3>
              <p className="mb-3 text-gray-600">
                Earn 2x points on dining experiences and 3x points on weekend
                stays. Points never expire for Gold members and above.
              </p>
              <button className="font-medium text-blue-600 hover:underline">
                View complete rewards terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardRedemptionPage;
