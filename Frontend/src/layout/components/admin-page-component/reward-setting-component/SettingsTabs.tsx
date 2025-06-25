// src/components/rewards/SettingsTabs.jsx
import React, { useState } from "react";
import {
  Coins,
  CreditCard,
  BadgePercent,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import EarningPointsTab from "./EarningPointsTabs";
import RedemptionTab from "./RedemptionTab";
import TierMultipliersTab from "./TierMultipliersTab";
import { RewardSettings } from "@/types/interface.type";

interface SettingsTabsProps {
  settings: RewardSettings;
  handleSettingChange: (key: string, value: number | boolean) => void;
  handleNestedSettingChange: (
    parentKey: string,
    childKey: string,
    value: any,
  ) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  settings,
  handleSettingChange,
  handleNestedSettingChange,
}) => {
  const [activeTab, setActiveTab] = useState("earning");

  const tabs = [
    {
      id: "earning",
      label: "Earning Points",
      icon: <Coins className="h-5 w-5" />,
      color: "from-amber-500/90 to-yellow-500/90",
      accent: "bg-amber-500",
      content: (
        <EarningPointsTab
          settings={settings}
          handleSettingChange={handleSettingChange}
        />
      ),
    },
    {
      id: "redemption",
      label: "Redemption",
      icon: <CreditCard className="h-5 w-5" />,
      color: "from-blue-500/90 to-indigo-500/90",
      accent: "bg-blue-500",
      content: (
        <RedemptionTab
          settings={{
            minRedeemPoints: settings.minRedeemPoints,
            maxRedeemPoints: settings.maxRedeemPoints,
          }}
          handleSettingChange={handleSettingChange}
        />
      ),
    },
    {
      id: "tiers",
      label: "Tier Multipliers",
      icon: <BadgePercent className="h-5 w-5" />,
      color: "from-emerald-500/90 to-teal-500/90",
      accent: "bg-emerald-500",
      content: (
        <TierMultipliersTab
          settings={{
            tierMultipliers: settings.tierMultipliers,
          }}
          handleNestedSettingChange={handleNestedSettingChange}
        />
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Tab Navigation - Luxury Design */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-1 items-center justify-center px-6 py-5 transition-all duration-300 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                : "bg-white/80 text-gray-700 backdrop-blur-sm hover:bg-gray-50/90"
            } overflow-hidden rounded-xl border border-gray-200/60`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`rounded-xl p-3 ${activeTab === tab.id ? "bg-white/20" : "bg-gray-100"}`}
              >
                {React.cloneElement(tab.icon, {
                  className: `${activeTab === tab.id ? "text-white" : "text-gray-500"}`,
                })}
              </div>
              <span className="text-lg font-medium">{tab.label}</span>
            </div>

            {activeTab === tab.id && (
              <div className="absolute right-0 bottom-0 left-0 h-1 animate-pulse bg-white"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content - Luxury Card */}
      <div className="relative">
        <div className="relative z-10 overflow-hidden rounded-2xl border border-gray-200/60 bg-white/95 shadow-2xl backdrop-blur-sm">
          {/* Card header */}
          <div className="border-b border-gray-200/60 px-8 py-6">
            <div className="flex items-center">
              <div
                className={`rounded-xl p-3 ${tabs.find((t) => t.id === activeTab)?.accent} bg-opacity-10`}
              >
                {tabs.find((t) => t.id === activeTab)?.icon}
              </div>
              <h2 className="ml-4 font-serif text-2xl font-bold text-gray-800">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
            </div>
          </div>

          {/* Content area */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 p-8">
            <div className="mx-auto max-w-7xl h-full">
              {tabs.find((t) => t.id === activeTab)?.content}
            </div>
          </div>

          {/* Card footer */}
          <div className="border-t border-gray-200/60 bg-gray-50/60 px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                <p className="text-sm text-gray-600">
                  Changes will be applied to all guest rewards accounts
                  immediately
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const currentIndex = tabs.findIndex(
                      (tab) => tab.id === activeTab,
                    );
                    const prevIndex =
                      currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                    setActiveTab(tabs[prevIndex].id);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm transition-colors hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>

                <button
                  onClick={() => {
                    const currentIndex = tabs.findIndex(
                      (tab) => tab.id === activeTab,
                    );
                    const nextIndex =
                      currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                    setActiveTab(tabs[nextIndex].id);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm transition-colors hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTabs;
