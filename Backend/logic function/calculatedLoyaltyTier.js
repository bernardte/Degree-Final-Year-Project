export const calculateLoyaltyTier = (totalRewardPoints) => {
    if (totalRewardPoints >= 10000) return "platinum"
    if (totalRewardPoints >= 5000) return "gold"
    if (totalRewardPoints >= 1000) return "silver"
    return "bronze";
}
