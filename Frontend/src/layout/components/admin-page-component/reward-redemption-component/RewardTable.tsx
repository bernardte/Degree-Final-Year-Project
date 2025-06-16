import { Reward } from "@/types/interface.type";
import { Edit, Gift, Sparkles, Trash2 } from "lucide-react";
import { JSX } from "react";

const iconKeys = [
  "Gift",
  "Bed",
  "Utensils",
  "ShoppingBag",
  "Sparkles",
  "Plane",
  "Wine",
  "Clock",
  "Heart",
  "Star",
  "Percent",
] as const;
type IconName = (typeof iconKeys)[number];

const RewardTable = ({
  filteredRewards,
  getIconComponent,
  handleEdit,
  handleDelete,
}: {
  filteredRewards: Reward[];
  getIconComponent: (
    iconName: IconName | string,
  ) => JSX.Element;
  handleEdit: (reward: Reward) => void;
  handleDelete: (rewardId: string) => void;
}) => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Reward
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Points
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredRewards.length > 0 ? (
              filteredRewards.map((reward) => (
                <tr key={reward._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-3 rounded-lg bg-gray-100 p-2">
                        {getIconComponent(reward.icon)}
                      </div>
                      <div className="font-medium text-gray-900">
                        {reward.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs text-sm text-gray-600">
                      {reward.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Sparkles className="mr-1 text-amber-500" size={16} />
                      <span className="text-sm font-medium">
                        {reward.points.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {reward.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        reward.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {reward.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(reward)}
                      className="mr-4 text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(reward._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Gift className="mb-2 text-gray-400" size={32} />
                    <p className="text-lg">
                      No rewards found matching your criteria
                    </p>
                    <p className="mt-2">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RewardTable;
