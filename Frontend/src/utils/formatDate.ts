export const formatDate = (date: Date) => {
   return date.toLocaleDateString("sv-SE");
};

export function formatDateInBookingCheckOut(
  date?: string | Date,
  locale: string = "en-US",
) {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  // Extra safety: check if the parsed date is valid
  if (isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

