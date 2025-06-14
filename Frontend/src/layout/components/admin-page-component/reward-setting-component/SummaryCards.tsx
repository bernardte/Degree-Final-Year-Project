// src/components/rewards/SummaryCards.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Hotel, Gem, Crown, Award, Trophy } from "lucide-react";
import { RewardSettings } from "@/types/interface.type";

interface SummaryCardsProps {
  settings: RewardSettings;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ settings }) => (
  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {/* Booking Reward */}
    <Card>
      <CardContent className="flex items-center pt-6">
        <div className="rounded-full bg-blue-100 p-3">
          <Hotel className="text-blue-600" size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">Per Booking Reward</h3>
          <p className="text-2xl font-bold">
            {settings.bookingRewardPoints} points
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Bronze Tier */}
    <Card>
      <CardContent className="flex items-center pt-6">
        <div className="rounded-full bg-yellow-100 p-3">
          <Award className="text-yellow-800" size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">Bronze Tier</h3>
          <p className="text-2xl font-bold">
            {settings.tierMultipliers.bronze}x
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Silver Tier */}
    <Card>
      <CardContent className="flex items-center pt-6">
        <div className="rounded-full bg-gray-100 p-3">
          <Trophy className="text-gray-400" size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">Silver Tier</h3>
          <p className="text-2xl font-bold">
            {settings.tierMultipliers.silver}x
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Gold Tier */}
    <Card>
      <CardContent className="flex items-center pt-6">
        <div className="rounded-full bg-yellow-100 p-3">
          <Crown className="text-yellow-500" size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">Gold Tier</h3>
          <p className="text-2xl font-bold">{settings.tierMultipliers.gold}x</p>
        </div>
      </CardContent>
    </Card>

    {/* Platinum Tier */}
    <Card>
      <CardContent className="flex items-center pt-6">
        <div className="rounded-full bg-indigo-100 p-3">
          <Gem className="text-indigo-500" size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">Platinum Tier</h3>
          <p className="text-2xl font-bold">
            {settings.tierMultipliers.platinum}x
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default SummaryCards;