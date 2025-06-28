export const calculateLoyaltyTier = (userTotalSpentMoney) => {
    if (userTotalSpentMoney >= 10000) return "platinum"
    if (userTotalSpentMoney >= 5000) return "gold"
    if (userTotalSpentMoney >= 1000) return "silver"
    return "bronze";
}
