export const phoneNumberValidation = (number: string): boolean => {
  // Remove spaces and hyphens for validation
  const cleaned = number.replace(/[\s-]/g, "");

  // Check if contains only digits (and optionally starts with +)
  if (!/^\+?\d+$/.test(cleaned)) {
    return true; // return true if invalid
  }

  // Malaysian mobile or landline number format
  const mobileRegex = /^(?:\+?60|0)1[0-46-9]\d{7,8}$/;
  const landlineRegex = /^(?:\+?60|0)[3-9]\d{7,8}$/;

  return !(mobileRegex.test(cleaned) || landlineRegex.test(cleaned));
};
