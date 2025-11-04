import RequireRole from "@/permission/RequireRole";
import useAuthStore from "@/stores/useAuthStore";
import {
  Hotel,
  Save,
  Image,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building,
} from "lucide-react";

interface HotelInformationSettingProps {
  hotelInfo: {
    name: string;
    email: string;
    phone: string;
    checkInTime: string;
    checkOutTime: string;
    address: string;
    logo: File | null | string;
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
  const user = useAuthStore((state) => state);
  const disabledUserToInput = user?.roles === "admin";

  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Header Section */}
      <div className="mb-8 flex items-center pb-4">
        <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <Hotel className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Hotel Information
          </h2>
          <p className="mt-1 text-gray-500">
            Manage your hotel's basic information and settings
          </p>
        </div>
      </div>

      <form>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Logo Upload */}
          <div className="md:col-span-2">
            <label className="mb-3 block text-sm font-medium text-gray-700">
              {hotelInfo.logo ? "Update Logo" : "Upload Logo"}
            </label>
            <div className="flex flex-col items-start gap-6 md:flex-row">
              <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors duration-200 hover:border-blue-400">
                {hotelInfo.logo ? (
                  <img
                    src={
                      typeof hotelInfo.logo === "string"
                        ? hotelInfo.logo
                        : URL.createObjectURL(hotelInfo.logo)
                    }
                    alt="Logo Preview"
                    className="h-full w-full object-contain p-3"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
                    <Image className="mb-3 h-8 w-8 text-gray-400" />
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-medium">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleHotelInfoChange}
                  disabled={disabledUserToInput}
                  className="hidden"
                />
              </label>

              <div className="flex-1 text-sm text-gray-500">
                <p className="mb-2 font-medium text-gray-700">
                  Logo Guidelines
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Recommended size: 240×240 pixels</li>
                  <li>Formats: PNG, JPG with transparent background</li>
                  <li>Max file size: 5MB</li>
                  <li>
                    Will be displayed in booking confirmations and invoice
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hotel Name */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Building className="mr-2 h-4 w-4" />
              Hotel Name
            </label>
            <input
              type="text"
              name="name"
              value={hotelInfo?.name || ""}
              onChange={handleHotelInfoChange}
              disabled={disabledUserToInput}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Mail className="mr-2 h-4 w-4" />
              Contact Email
            </label>
            <input
              type="email"
              name="email"
              value={hotelInfo?.email || ""}
              onChange={handleHotelInfoChange}
              disabled={disabledUserToInput}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Phone className="mr-2 h-4 w-4" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={hotelInfo?.phone || ""}
              onChange={handleHotelInfoChange}
              disabled={disabledUserToInput}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          {/* Check-in/Check-out Times */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Clock className="mr-2 h-4 w-4" />
                Check-in Time
              </label>
              <input
                type="time"
                name="checkInTime"
                value={hotelInfo?.checkInTime || ""}
                onChange={handleHotelInfoChange}
                disabled={disabledUserToInput}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Clock className="mr-2 h-4 w-4" />
                Check-out Time
              </label>
              <input
                type="time"
                name="checkOutTime"
                value={hotelInfo?.checkOutTime || ""}
                onChange={handleHotelInfoChange}
                disabled={disabledUserToInput}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <MapPin className="mr-2 h-4 w-4" />
              Address
            </label>
            <textarea
              name="address"
              value={hotelInfo?.address || ""}
              onChange={handleHotelInfoChange}
              rows={3}
              disabled={disabledUserToInput}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>
        </div>

        {/* Save Button */}
        <RequireRole allowedRoles={["superAdmin"]}>
          <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={saveAllSettings}
              className="flex items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-6 py-3 text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md"
            >
              <Save className="mr-2" size={18} />
              Update Hotel Information
            </button>
          </div>
        </RequireRole>
      </form>
    </div>
  );
};

export default HotelInformationSetting;
