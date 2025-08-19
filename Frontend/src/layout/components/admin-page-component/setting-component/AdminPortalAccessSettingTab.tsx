import RequireRole from "@/permission/RequireRole";
import { Lock, Key } from "lucide-react";
import { Dispatch } from "react";

interface AdminPortalAccessSettingTabProps {
  handleUpdateAccessCode: (e: React.FormEvent) => Promise<void>;
  adminCode: string;
  newAdminCode: string;
  confirmAdminCode: string;
  setNewAdminCode: Dispatch<React.SetStateAction<string>>;
  setConfirmAdminCode: Dispatch<React.SetStateAction<string>>;
}

const AdminPortalAccessSettingTab = ({ handleUpdateAccessCode, adminCode, newAdminCode, confirmAdminCode, setNewAdminCode, setConfirmAdminCode } : AdminPortalAccessSettingTabProps) => {
  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center">
        <Key className="mr-3 text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Admin Access Code
        </h2>
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium text-gray-700">
          Current Access Code
        </label>
        <div className="flex items-center rounded-lg bg-gray-100 px-4 py-3">
          <span className="font-mono tracking-wider">{adminCode}</span>
          <Lock className="ml-2 text-gray-500" size={18} />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          This code is required for accessing the admin dashboard.
        </p>
      </div>
      <RequireRole allowedRoles={["superAdmin"]}>
          <form onSubmit={handleUpdateAccessCode}>
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  New Access Code
                </label>
                <input
                  type="password"
                  value={newAdminCode}
                  onChange={(e) => setNewAdminCode(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new access code"
                  minLength={6}
                  maxLength={6}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Confirm New Code
                </label>
                <input
                  type="password"
                  value={confirmAdminCode}
                  onChange={(e) => setConfirmAdminCode(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new access code"
                  minLength={6}
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="submit"
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                disabled={!newAdminCode || !confirmAdminCode || newAdminCode !== confirmAdminCode}
              >
                <Lock className="mr-2" size={18} />
                Update Access Code
              </button>
              <p className="ml-4 text-sm text-gray-600">
                Use 6 characters including letters and numbers
              </p>
            </div>
          </form>
      </RequireRole>
    </div>
  );
}

export default AdminPortalAccessSettingTab
