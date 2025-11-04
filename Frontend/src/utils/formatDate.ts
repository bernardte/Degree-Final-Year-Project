import {
  isToday,
  isYesterday,
  differenceInCalendarDays,
  format,
} from "date-fns";

export const formatDate = (date?: string | Date) => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("sv-SE");
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

export const getChatFormattedDate = (dateString: string | Date) => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  const daysAgo = differenceInCalendarDays(new Date(), date);

  if (daysAgo <= 6) {
    return format(date, "EEEE"); // EEEE = full weekday name (e.g., "Monday")
  }

  return format(date, "MMMM d, yyyy"); // e.g., July 1, 2025
};

export const formatDateWithDayAndTime = (date: Date) => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } else if (diffDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};
