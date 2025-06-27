import SystemSetting from "../models/systemSetting.model.js";
import RewardHistory from "../models/rewardHistory.model.js";
import { calculateLoyaltyTier } from "../logic function/calculatedLoyaltyTier.js";

export const handleRewardPoints = async (
  user,
  booking,
  checkInDate,
  checkOutDate,
  rooms
) => {
  const setting = await SystemSetting.findOne({ key: "rewardPointsSetting" });
  const pointsPerNight = setting?.value.bookingRewardPoints || 0;
  const rewardProgramActivate = setting?.value?.rewardProgramEnabled;
  if (!rewardProgramActivate) return;

  const nights = Math.ceil(
    (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
  );
  const roomsBooked = rooms.length;
  const tierMultipliers =
    setting?.value.tierMultipliers?.[user.loyaltyTier.toLowerCase()] || 1;

  const basePoints = nights * roomsBooked * pointsPerNight;
  const rewardPoints = Math.round(basePoints * tierMultipliers);

  user.totalSpent += booking.totalPrice;
  const newTier = calculateLoyaltyTier(user.totalSpent);
  if (user.loyaltyTier !== newTier) {
    user.loyaltyTier = newTier;
    await RewardHistory.create({
      user: user._id,
      bookingId: booking._id,
      bookingReference: booking.bookingReference,
      points: 0,
      description: `Loyalty tier upgraded to ${newTier}`,
      type: "tier-upgrade",
      source: "loyalty",
    });
  }

  user.rewardPoints = (user.rewardPoints || 0) + rewardPoints;
  await user.save();
  await RewardHistory.create({
    user: user._id,
    bookingId: booking._id,
    bookingReference: booking.bookingReference,
    points: rewardPoints,
    description: `Earned for booking ${rooms.length} room(s) for ${nights} night(s)`,
    type: "earn",
    source: "booking",
  });
}


