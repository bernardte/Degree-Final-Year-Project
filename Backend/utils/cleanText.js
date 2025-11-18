export const cleanText = (text) => {
  return text
    ?.replace(/\uFEFF/g, "")
    ?.replace(/\u200B/g, "")
    ?.replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, "")
    ?.trim();
};
