import { Sparkles } from "lucide-react";

const AdditionalInfo = () => {
  return (
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
            Earn 2x points on dining experiences and 3x points on weekend stays.
            Points never expire for Gold members and above.
          </p>
          <button className="font-medium text-blue-600 hover:underline">
            View complete rewards terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
