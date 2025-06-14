// src/components/rewards/TierMultipliersTab.jsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BadgePercent } from "lucide-react";

const TierMultipliersTab = ({
  settings,
  handleNestedSettingChange,
}: {
  settings: {
    tierMultipliers: {
      [key: string]: number;
    };
  };
  handleNestedSettingChange: (
    parentKey: string,
    childKey: string,
    value: any,
  ) => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <BadgePercent className="mr-2 text-purple-500" size={20} />
        Loyalty Tier Multipliers
      </CardTitle>
      <CardDescription>
        Configure point multipliers for different loyalty tiers
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="bronzeMultiplier">Bronze Tier</Label>
          <p className="text-sm text-gray-500">Standard multiplier</p>
          <div className="flex items-center">
            <Input
              id="bronzeMultiplier"
              type="number"
              step="0.1"
              min="1.0"
              value={settings.tierMultipliers.bronze}
              onChange={(e) =>
                handleNestedSettingChange(
                  "tierMultipliers",
                  "bronze",
                  parseFloat(e.target.value),
                )
              }
              className="w-32"
            />
            <span className="ml-2 text-gray-600">x points</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="silverMultiplier">Silver Tier</Label>
          <p className="text-sm text-gray-500">After 5 completed bookings</p>
          <div className="flex items-center">
            <Input
              id="silverMultiplier"
              type="number"
              step="0.1"
              min="1.0"
              value={settings.tierMultipliers.silver}
              onChange={(e) =>
                handleNestedSettingChange(
                  "tierMultipliers",
                  "silver",
                  parseFloat(e.target.value),
                )
              }
              className="w-32"
            />
            <span className="ml-2 text-gray-600">x points</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goldMultiplier">Gold Tier</Label>
          <p className="text-sm text-gray-500">After 15 completed bookings</p>
          <div className="flex items-center">
            <Input
              id="goldMultiplier"
              type="number"
              step="0.1"
              min="1.0"
              value={settings.tierMultipliers.gold}
              onChange={(e) =>
                handleNestedSettingChange(
                  "tierMultipliers",
                  "gold",
                  parseFloat(e.target.value),
                )
              }
              className="w-32"
            />
            <span className="ml-2 text-gray-600">x points</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="platinumMultiplier">Platinum Tier</Label>
          <p className="text-sm text-gray-500">After 30 completed bookings</p>
          <div className="flex items-center">
            <Input
              id="platinumMultiplier"
              type="number"
              step="0.1"
              min="1.0"
              value={settings.tierMultipliers.platinum}
              onChange={(e) =>
                handleNestedSettingChange(
                  "tierMultipliers",
                  "platinum",
                  parseFloat(e.target.value),
                )
              }
              className="w-32"
            />
            <span className="ml-2 text-gray-600">x points</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TierMultipliersTab;
