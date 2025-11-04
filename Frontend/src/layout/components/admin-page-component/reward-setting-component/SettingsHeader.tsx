// src/components/rewards/SettingsHeader.jsx
import { Gift } from "lucide-react";

const SettingsHeader = () => (
  <div className="mb-6">
    <h1 className="items-center bg-gradient-to-r flex from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
      <Gift className="mr-3 text-blue-600" size={28} />
      Reward Points Setting
    </h1>
    <p className="mt-1 text-gray-600">
      Configure reward points settings for your hotel booking system
    </p>
  </div>
);

export default SettingsHeader;