import RequireRole from "@/permission/RequireRole";
import useAuthStore from "@/stores/useAuthStore";
import {
    Hotel,
    Save,
} from "lucide-react"

interface HotelInformationSettingProps {
  hotelInfo: {
    name: string;
    email: string;
    phone: string;
    checkInTime: string;
    checkOutTime: string;
    address: string;
  };
  saveAllSettings: () => Promise<void>;
  handleHotelInfoChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const HotelInformationSetting = ({
  hotelInfo,
  handleHotelInfoChange,
  saveAllSettings,
}: HotelInformationSettingProps) => {

  const user = useAuthStore(state => state);
  const disabledUserToInput = user?.roles === "admin"

  
  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center">
        <Hotel className="mr-3 text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Hotel Information
        </h2>
      </div>

      <form>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Hotel Name
            </label>
            <input
              type="text"
              name="name"
              value={hotelInfo?.name || ""}
              onChange={handleHotelInfoChange}
              disabled={disabledUserToInput}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Contact Email
            </label>
            <input
              type="email"
              name="email"
              value={hotelInfo?.email || ""}
              onChange={handleHotelInfoChange}
              disabled={disabledUserToInput}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={hotelInfo?.phone || ""}
              onChange={handleHotelInfoChange}
              disabled={disabledUserToInput}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Check-in Time
              </label>
              <input
                type="time"
                name="checkInTime"
                value={hotelInfo?.checkInTime || ""}
                onChange={handleHotelInfoChange}
                disabled={disabledUserToInput}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Check-out Time
              </label>
              <input
                type="time"
                name="checkOutTime"
                value={hotelInfo?.checkOutTime || ""}
                onChange={handleHotelInfoChange}
                disabled={disabledUserToInput}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              value={hotelInfo?.address || ""}
              onChange={handleHotelInfoChange}
              rows={2}
              disabled={disabledUserToInput}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <RequireRole allowedRoles={["superAdmin"]}>
          <button
            type="button"
            onClick={saveAllSettings}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            <Save className="mr-2" size={18} />
            Update Hotel Information
          </button>
        </RequireRole>
      </form>
    </div>
  );
};

export default HotelInformationSetting
