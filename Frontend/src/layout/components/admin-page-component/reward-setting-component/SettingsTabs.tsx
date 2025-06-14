// src/components/rewards/SettingsTabs.jsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EarningPointsTab from "./EarningPointsTabs";
import RedemptionTab  from "./RedemptionTab";
import TierMultipliersTab  from "./TierMultipliersTab";
import { Coins, CreditCard, BadgePercent } from "lucide-react";
import { RewardSettings } from "@/types/interface.type";
interface SettingsTabsProps {
  settings: RewardSettings;
  handleSettingChange: (key: string, value: number | boolean) => void; // Adjust the type as needed
  handleNestedSettingChange: (
    parentKey: string,
    childKey: string,
    value: any,
  ) => void; // Adjust the type as needed
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  settings,
  handleSettingChange,
  handleNestedSettingChange,
}) => (
  <Tabs defaultValue="earning" className="mb-6 h-full">
    <TabsList className="grid w-full grid-cols-3 mt-10 h-full">
      <TabsTrigger value="earning">
        <Coins className="mr-2 h-4 w-4" />
        Earning Points
      </TabsTrigger>
      <TabsTrigger value="redemption">
        <CreditCard className="mr-2 h-4 w-4" />
        Redemption
      </TabsTrigger>
      <TabsTrigger value="tiers">
        <BadgePercent className="mr-2 h-4 w-4" />
        Tier Multipliers
      </TabsTrigger>
    </TabsList>

    <TabsContent value="earning">
      <EarningPointsTab
        settings={settings}
        handleSettingChange={handleSettingChange}
      />
    </TabsContent>

    <TabsContent value="redemption">
      <RedemptionTab
        settings={{
          minRedeemPoints: settings.minRedeemPoints,
          maxRedeemPoints: settings.maxRedeemPoints,
        }}
        handleSettingChange={handleSettingChange}
      />
    </TabsContent>

    <TabsContent value="tiers">
      <TierMultipliersTab
        settings={{
          tierMultipliers: settings.tierMultipliers,
        }}
        handleNestedSettingChange={handleNestedSettingChange}
      />
    </TabsContent>
  </Tabs>
);

export default SettingsTabs;