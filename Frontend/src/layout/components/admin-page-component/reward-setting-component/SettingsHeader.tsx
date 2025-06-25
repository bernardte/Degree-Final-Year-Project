// src/components/rewards/SettingsHeader.jsx
import { Gift } from "lucide-react";

const SettingsHeader = () => (
  <div className="mb-6">
    <h1 className="flex items-center text-2xl font-bold text-gray-800">
      <Gift className="mr-3 text-blue-600" size={28} />
      Reward Points Setting
    </h1>
    <p className="mt-1 text-gray-600">
      Configure reward points settings for your hotel booking system
    </p>
  </div>
);

export default SettingsHeader;