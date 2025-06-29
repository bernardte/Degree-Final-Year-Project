const formatCurrency = (amount?: number) => {
  const value = typeof amount === "number" ? amount : 0;
  return `RM ${value.toFixed(2)}`;
};

export default formatCurrency;
