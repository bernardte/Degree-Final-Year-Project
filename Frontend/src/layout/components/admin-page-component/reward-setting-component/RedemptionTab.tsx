// src/components/rewards/RedemptionTab.jsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";

interface RedemptionTabProps {
  settings: {
    minRedeemPoints: number;
    maxRedeemPoints: number;
  };
  handleSettingChange: (key: string, value: number) => void;
}

const RedemptionTab: React.FC<RedemptionTabProps> = ({ settings, handleSettingChange }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <CreditCard className="mr-2 text-green-500" size={20} />
        Points Redemption
      </CardTitle>
      <CardDescription>
        Configure how guests can redeem their points for rewards
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="minRedeemPoints">Minimum Redemption Points</Label>
          <p className="text-sm text-gray-500">
            Minimum points required for redemption
          </p>
          <div className="flex items-center">
            <Input
              id="minRedeemPoints"
              type="number"
              min="0"
              value={settings.minRedeemPoints}
              onChange={(e) =>
                handleSettingChange("minRedeemPoints", parseInt(e.target.value))
              }
              className="w-32"
            />
            <span className="ml-2 text-gray-600">points</span>
          </div>
        </div>
        <div>
          <div className="space-y-2">
            <Label htmlFor="maxRedeemPoints">
              Maximum Redemption per Transaction
            </Label>
            <p className="text-sm text-gray-500">
              Maximum points allowed per redemption transaction
            </p>
            <div className="flex items-center">
              <Input
                id="maxRedeemPoints"
                type="number"
                min="0"
                value={settings.maxRedeemPoints}
                onChange={(e) =>
                  handleSettingChange("maxRedeemPoints", parseInt(e.target.value))
                }
                className="w-32"
              />
              <span className="ml-2 text-gray-600">points</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default RedemptionTab;
