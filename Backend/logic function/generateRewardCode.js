export const generateRewardCode = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase(); // e.g. "4FZ8KJ
  const datePart = Date.now().toString().slice(-4); // last 4 digits of timestamp
  return `REW-${random}${datePart}`;
}