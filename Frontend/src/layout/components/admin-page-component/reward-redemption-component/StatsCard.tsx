import { Reward } from '@/types/interface.type';
import { Clock, Gift, Sparkles } from 'lucide-react';


const StatsCard = ({ rewards } : { rewards: Reward[] }) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-xl border-l-4 border-indigo-500 bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {rewards.length}
            </h3>
            <p className="text-gray-600">Total Rewards</p>
          </div>
          <Gift className="text-indigo-500" size={32} />
        </div>
      </div>

      <div className="rounded-xl border-l-4 border-green-500 bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {rewards.filter((r) => r.status === "active").length}
            </h3>
            <p className="text-gray-600">Active Rewards</p>
          </div>
          <Sparkles className="text-green-500" size={32} />
        </div>
      </div>

      <div className="rounded-xl border-l-4 border-amber-500 bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {rewards.filter((r) => r.status === "inactive").length}
            </h3>
            <p className="text-gray-600">Inactive Rewards</p>
          </div>
          <Clock className="text-amber-500" size={32} />
        </div>
      </div>
    </div>
  );
}

export default StatsCard
