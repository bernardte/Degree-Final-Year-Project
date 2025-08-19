import { ShieldCheck } from 'lucide-react';

const UserActivityTrackSetting = () => {
  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center">
        <ShieldCheck className="mr-3 text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Activity Tracking
        </h2>
      </div>
     
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Recent Activity
        </h3>
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between border-b border-gray-200 py-3">
            <div>
              <p className="font-medium">Admin Login</p>
              <p className="text-sm text-gray-600">New York, United States</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Today, 10:30 AM</p>
              <p className="text-sm text-green-600">Successful</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-b border-gray-200 py-3">
            <div>
              <p className="font-medium">Settings Update</p>
              <p className="text-sm text-gray-600">
                Notification settings changed
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">Yesterday, 3:45 PM</p>
              <p className="text-sm text-green-600">Completed</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Report Generation</p>
              <p className="text-sm text-gray-600">Monthly financial report</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Aug 12, 2023, 9:15 AM</p>
              <p className="text-sm text-green-600">Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserActivityTrackSetting
