import { Gift, Plus } from "lucide-react";
import { SetStateAction } from "react";

const RewardHeader = ({ setShowModal }: {setShowModal: React.Dispatch<SetStateAction<boolean>> }) => {
  return (
    <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
      <div>
        <h1 className="flex items-center text-3xl font-bold text-gray-800">
          <Gift className="mr-3 text-indigo-600" size={32} />
          Reward Management System
        </h1>
        <p className="mt-2 text-gray-600">
          Create, edit, and manage rewards for your hotel loyalty program
        </p>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 flex items-center rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-indigo-700 md:mt-0"
      >
        <Plus className="mr-2" size={20} />
        Add New Reward
      </button>
    </div>
  );
}

export default RewardHeader;
