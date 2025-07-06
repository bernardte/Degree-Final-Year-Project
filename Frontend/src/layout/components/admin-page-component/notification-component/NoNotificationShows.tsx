import { BookOpen } from "lucide-react";

const NoNotificationShows = () => {
  return (
    <div className="py-16 text-center">
      <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
      <h3 className="mb-1 text-lg font-medium text-gray-900">
        No notifications
      </h3>
      <p className="text-gray-500">You're all caught up!</p>
    </div>
  );
}

export default NoNotificationShows
