// src/components/rewards/EarningPointsTab.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Coins } from "lucide-react";
import { RewardSettings } from "@/types/interface.type";

interface EarningPointsTabProps {
  settings: RewardSettings;
  handleSettingChange: (key: string, value: number | boolean) => void;
}

const EarningPointsTab: React.FC<EarningPointsTabProps> = ({ settings, handleSettingChange }) => {
  console.log(settings);
  return(
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Coins className="mr-2 text-yellow-500" size={20} />
          Earning Reward Points
        </CardTitle>
        <CardDescription>
          Configure how guests earn points through bookings and referrals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center">
              <div>
                <Label htmlFor="rewardProgramEnabled">
                  Reward Program
                </Label>
                <p className="text-sm text-gray-500">
                  Enable or disable the entire reward program
                </p>
              </div>
              <Switch
                className="ml-10"
                id="rewardProgramEnabled"
                checked={settings.rewardProgramEnabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("rewardProgramEnabled", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookingRewardPoints">
                Points per Booking
              </Label>
              <p className="text-sm text-gray-500">
                Points awarded for each completed booking
              </p>
              <div className="flex items-center">
                <Input
                  id="bookingRewardPoints"
                  type="number"
                  min="0"
                  value={settings.bookingRewardPoints ?? 0}
                  onChange={(e) =>
                    handleSettingChange(
                      "bookingRewardPoints",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-32"
                />
                <span className="ml-2 text-gray-600">points</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="earningRatio">Earning Ratio</Label>
            <p className="text-sm text-gray-500">
              Set how many points guests earn per ringgit spent
            </p>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">RM1 =</span>
              <Input
                id="earningRatio"
                type="number"
                step="0.1"
                min="0.1"
                value={settings.earningRatio}
                onChange={(e) =>
                  handleSettingChange(
                    "earningRatio",
                    parseFloat(e.target.value))
                }
                className="w-32"
              />
              <span className="ml-2 text-gray-600">points</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningPointsTab;