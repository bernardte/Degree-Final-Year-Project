import { Star } from "lucide-react";

interface PointsDisplayProps {
  userPoints: number;
  userLoyaltyTier: string;
}

const PointsDisplay = ({ userPoints, userLoyaltyTier }: PointsDisplayProps) => {
  const tierColors = {
    bronze: "bg-yellow-700 text-white",
    silver: "bg-gray-300 text-black",
    gold: "bg-yellow-500",
    platinum: "bg-indigo-500 text-white",
  };

  return (
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
        className={`rounded-full px-3 py-1 text-sm font-bold capitalize ${
          tierColors[userLoyaltyTier as keyof typeof tierColors] ||
          "bg-indigo-500 text-white"
        }`}
      >
        {userLoyaltyTier} Tier
      </div>
    </div>
  );
};

export default PointsDisplay;
