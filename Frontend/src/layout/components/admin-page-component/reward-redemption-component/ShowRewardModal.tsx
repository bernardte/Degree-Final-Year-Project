import { Save, X } from "lucide-react";
import {JSX} from "react";

// Get icon component based on string
const iconKeys = [
    "Gift",
    "Bed",
    "Utensils",
    "ShoppingBag",
    "Sparkles",
    "Plane",
    "Wine",
    "Clock",
    "Heart",
    "Star",
    "Percent",
  ] as const;
  type IconName = (typeof iconKeys)[number];

type FormData = {
    _id: string,
    name: string,
    description: string,
    points: number,
    category: string,
    status: string,
    icon: string,
}

interface showRewardModalProps {
  isEditing: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
  handleSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  getIconComponent: (IconName: IconName | string) => JSX.Element;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<{
  _id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  status: string;
  icon: string;
}>>
}

const ShowRewardModal = ({
  isEditing,
  setShowModal,
  resetForm,
  handleSubmit,
  handleChange,
  getIconComponent,
  formData,
  setFormData,
} : showRewardModalProps) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditing ? "Edit Reward" : "Create New Reward"}
            </h2>
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Reward Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="points"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Points Required
                </label>
                <input
                  type="number"
                  id="points"
                  name="points"
                  min="1"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.points}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Accommodation">Accommodation</option>
                  <option value="Dining">Dining</option>
                  <option value="Experience">Experience</option>
                  <option value="Service">Service</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Membership">Membership</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  Select Icon
                </label>
                <div className="grid grid-cols-4 gap-4 md:grid-cols-6">
                  {[
                    "Gift",
                    "Bed",
                    "Utensils",
                    "ShoppingBag",
                    "Sparkles",
                    "Plane",
                    "Wine",
                    "Clock",
                    "Heart",
                    "Star",
                    "Percent",
                  ].map((icon) => (
                    <div
                      key={icon}
                      onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                      className={`flex cursor-pointer flex-col items-center rounded-lg border p-3 transition-colors ${
                        formData.icon === icon
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {getIconComponent(icon)}
                      <span className="mt-2 text-xs text-gray-600">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t pt-6">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="mr-3 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
              >
                <Save className="mr-2" size={18} />
                {isEditing ? "Update Reward" : "Create Reward"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShowRewardModal
