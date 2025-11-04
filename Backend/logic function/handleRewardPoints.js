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
  // get system setting for reward points
  const setting = await SystemSetting.findOne({ key: "rewardPointsSetting" });
  const rewardProgramActivate = setting?.value?.rewardProgramEnabled;
  if (!rewardProgramActivate) return;

  // Get relevant parameters (with default values ​​to prevent errors)
  const pointsPerBooking = setting?.value?.bookingRewardPoints || 0; // 每房每晚积分
  const earnRatio = setting?.value?.earningRatio || 0; // 每RM获得多少积分
  const tierMultipliers =
    setting?.value?.tierMultipliers?.[user.loyaltyTier?.toLowerCase()] || 1;

  // Calculate basic data
  const totalSpent = booking.totalPrice || 0;
  const nights = Math.ceil(
    (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
  );
  const roomsBooked = rooms?.length || 0;

  // Calculate two sources of points
  const perBookingPoints = nights * roomsBooked * pointsPerBooking;
  const perRinggitPoints = totalSpent * earnRatio;

  // Combine points and add membership multiplier
  const totalRewardPoints = Math.round(
    (perBookingPoints + perRinggitPoints) * tierMultipliers
  );

  // Update user total consumption & membership level
  user.totalSpent += totalSpent;
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

  // Update points balance
  user.rewardPoints = (user.rewardPoints || 0) + totalRewardPoints;
  await user.save();

  //store to reward history
  await RewardHistory.create({
    user: user._id,
    bookingId: booking._id,
    bookingReference: booking.bookingReference,
    points: totalRewardPoints,
    description: `Earned ${totalRewardPoints} points — ${roomsBooked} room(s), ${nights} night(s), RM ${totalSpent.toFixed(
      2
    )} spent.`,
    type: "earn",
    source: "booking",
  });
};
