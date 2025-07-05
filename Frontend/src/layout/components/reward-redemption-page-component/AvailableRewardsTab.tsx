import RewardCard from "./RewardCard";
import { Hotel } from "lucide-react";
import { Reward } from "@/types/interface.type";


interface AvailableRewardsTabProps {
  rewards: Reward[];
  onRedeem: (rewardId: string, requiredPoints: number) => void;
  redeemedRewardId: string | null;
}

const AvailableRewardsTab = ({
  rewards,
  onRedeem,
  redeemedRewardId,
}: AvailableRewardsTabProps) => {
  return (
    <>
      {rewards.length === 0 ? (
        <div className="py-12 text-center">
          <Hotel className="mx-auto mb-4 text-gray-300" size={48} />
          <h3 className="mb-2 text-xl font-semibold text-gray-700">
            No rewards found
          </h3>
          <p className="text-gray-500">Try selecting a different category</p>
        </div>
      ) : (
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward) => (
            <RewardCard
              key={reward._id}
              reward={reward}
              onRedeem={onRedeem}
              redeemedRewardId={redeemedRewardId}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AvailableRewardsTab;
