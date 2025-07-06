import { formatDistanceToNow } from "date-fns";

export const formatTime = (date: Date | string) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    includeSeconds: true, // shows "less than 5 seconds ago", etc.
  });
};
