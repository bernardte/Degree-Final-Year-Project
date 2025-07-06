import useNotificationStore from '@/stores/useNotificationStore';
import { Check } from 'lucide-react';

const NotificationMarkAsReadForSmallDevice = () => {
  const markAllAsRead = useNotificationStore(state => state.markAllAsRead);
  return (
    <div className="mt-6 sm:hidden">
      <button
        onClick={markAllAsRead}
        className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-white transition-colors hover:bg-indigo-700"
      >
        <Check className="mr-2 h-5 w-5" />
        Mark all as read
      </button>
    </div>
  );
};

export default NotificationMarkAsReadForSmallDevice

