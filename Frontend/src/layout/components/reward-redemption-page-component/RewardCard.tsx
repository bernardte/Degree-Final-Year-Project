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
  Bed,
} from "lucide-react";
import { Reward } from "@/types/interface.type";

const iconComponents = {
  gift: Gift,
  star: Star,
  coffee: Coffee,
  shopping: ShoppingBag,
  ticket: Ticket,
  zap: Zap,
  hotel: Hotel,
  bed: Bed,
  dining: Utensils,
  experience: Sparkles,
  travel: Mountain,
};

interface RewardCardProps {
  reward: Reward;
  onRedeem: (rewardId: string, requiredPoints: number) => void;
  redeemedRewardId: string | null;
}

const RewardCard = ({
  reward,
  onRedeem,
  redeemedRewardId,
}: RewardCardProps) => {
  const IconComponent =
    iconComponents[reward.icon.toLowerCase() as keyof typeof iconComponents] || Gift;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-transform duration-300 hover:shadow-xl">
      <div className="flex h-40 items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="rounded-full bg-white p-4 shadow-md">
          <IconComponent className="text-blue-600" size={48} />
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
          {reward.category}
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-800">{reward.name}</h3>
        <p className="mb-4 min-h-[60px] text-gray-600">{reward.description}</p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center">
            <Star className="mr-1 text-yellow-400" size={18} />
            <span className="text-lg font-semibold">
              {reward.points.toLocaleString()} pts
            </span>
          </div>

          <button
            onClick={() => onRedeem(reward._id, reward.points)}
            disabled={redeemedRewardId === reward._id}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              redeemedRewardId === reward._id
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md hover:from-blue-700 hover:to-indigo-800"
            }`}
          >
            {redeemedRewardId === reward._id ? "Processing..." : "Redeem Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
