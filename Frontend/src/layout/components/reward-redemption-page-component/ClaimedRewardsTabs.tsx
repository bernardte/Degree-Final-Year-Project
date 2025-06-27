import ClaimedRewardCard from "./ClaimedRewardCard";
import { Gift } from "lucide-react";
import { ClaimedReward } from "@/types/interface.type";

interface ClaimedRewardsTabProps {
  claimedRewards: ClaimedReward[];
}

const ClaimedRewardsTab = ({
  claimedRewards,
}: ClaimedRewardsTabProps) => {
  // Filter rewards by status
  const activeRewards = claimedRewards.filter((r) => r.status === "active");
  const usedRewards = claimedRewards.filter((r) => r.status === "used");
  const expiredRewards = claimedRewards.filter((r) => r.status === "expired");

  return (
    <div className="mt-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">My Rewards</h2>

      {claimedRewards.length === 0 ? (
        <div className="py-12 text-center">
          <Gift className="mx-auto mb-4 text-gray-300" size={48} />
          <h3 className="mb-2 text-xl font-semibold text-gray-700">
            No rewards claimed yet
          </h3>
          <p className="mb-6 text-gray-500">
            Redeem your points for exciting rewards in the Available Rewards
            section
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Rewards */}
          {activeRewards.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-green-600">
                Active Rewards
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeRewards.map((reward) => (
                  <ClaimedRewardCard
                    key={reward._id}
                    claimedReward={reward}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Used Rewards */}
          {usedRewards.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-blue-600">
                Used Rewards
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {usedRewards.map((reward) => (
                  <ClaimedRewardCard
                    key={reward._id}
                    claimedReward={reward}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Expired Rewards */}
          {expiredRewards.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-600">
                Expired Rewards
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {expiredRewards.map((reward) => (
                  <ClaimedRewardCard
                    key={reward._id}
                    claimedReward={reward}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClaimedRewardsTab;
