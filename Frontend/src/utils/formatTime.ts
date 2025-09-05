import { formatDistanceToNow } from "date-fns";

export const formatTime = (date: Date | string) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    includeSeconds: true, // shows "less than 5 seconds ago", etc.
  });
};

export const formatTimeWithAMAndPM = (timeString: string) => {
  if (!timeString) return;

  //split to hour and minute
  const [hourString, minuteString] = timeString.split(":");
  let hour = parseInt(hourString, 10);
  const minute = minuteString || "00";

  // Determine AM/PM
  const ampm = hour > 12 ? "PM" : "AM";

  // Convert to 12-hour clock
  if (hour === 0) {
    hour = 12; //midnight
  }else if(hour > 12){
    hour -= 12;
  }

  return `${hour}:${minute} ${ampm}`;
}
 