import { useState, useEffect } from "react";
import {
  UserCircle,
  Lock,
  Camera,
  X,
  Check,
  Eye,
  EyeOff,
  Mail,
  Loader,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/useUserStore";
import { emailValidation } from "@/utils/emailValidation";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import useAuthStore from "@/stores/useAuthStore";

interface FormErrors {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  avatar?: string;
}

const Profile = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const { currentLoginUser, fetchCurrentLoginUser } = useUserStore(
    (state) => state,
  );
  const [formData, setFormData] = useState({
    username: currentLoginUser?.username || "",
    email: currentLoginUser?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState(currentLoginUser?.profilePic || "");
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const { showToast } = useToast();
  const role =
    currentLoginUser?.role?.replace(/([a-z])([A-Z])/g, "$1 $2") || "";
  const { setCurrentLoginUser } = useAuthStore();
  // Fetch user data on mount
  useEffect(() => {
    fetchCurrentLoginUser().finally(() => setIsLoading(false));
  }, [fetchCurrentLoginUser]);

  // Update form data when user data loads
  useEffect(() => {
    if (currentLoginUser) {
      setFormData({
        username: currentLoginUser.username,
        email: currentLoginUser.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPreview(currentLoginUser.profilePic);
    }
  }, [currentLoginUser]);

  // Toggle password visibility
  const togglePasswordVisibility = (field: "confirmPassword" | "currentPassword" | "newPassword") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle file input changes
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ avatar: "Please upload an image file" });
        return;
      }
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (emailValidation(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("error", Object.values(validationErrors).join("\n"));
      return;
    }

    const noChanges =
      formData.username === currentLoginUser?.username &&
      formData.email === currentLoginUser?.email &&
      !formData.currentPassword &&
      !formData.newPassword &&
      !formData.confirmPassword &&
      !avatar;

    if (noChanges) {
      showToast("info", "No changes detected to update.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("username", formData.username);
      payload.append("email", formData.email);
      payload.append("currentPassword", formData.currentPassword);
      if (formData.newPassword)
        payload.append("newPassword", formData.newPassword);
      if (avatar) payload.append("profilePic", avatar);

      const { data } = await axiosInstance.put(
        `/api/users/updateProfile/${currentLoginUser?._id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      showToast("success", "Profile updated successfully!");
      setCurrentLoginUser(data);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setAvatar(null);
    } catch (error: any) {
      showToast("error", error?.data?.error || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
        {/* Profile Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-500">
            Manage your account information and security
          </p>
        </div>

        {/* Avatar Section */}
        <div className="mb-12 flex flex-col items-center">
          <label className="group relative cursor-pointer">
            <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-400 to-blue-400 p-1">
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar"
                  className="h-full w-full rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
                  <UserCircle className="h-20 w-20 text-gray-400" />
                </div>
              )}
              <div className="absolute right-0 bottom-0 rounded-full bg-white p-2 shadow-md transition-colors group-hover:bg-indigo-100">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
          {errors.avatar && (
            <p className="mt-2 flex items-center text-sm text-red-500">
              <X className="mr-1 h-4 w-4" /> {errors.avatar}
            </p>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="flex items-center font-medium text-gray-700">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              Username
            </label>
            <input
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="flex items-center text-sm text-red-500">
                <X className="mr-1 h-4 w-4" /> {errors.username}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="flex items-center font-medium text-gray-700">
              <Mail className="mr-2 h-5 w-5 text-blue-600" />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="flex items-center text-sm text-red-500">
                <X className="mr-1 h-4 w-4" /> {errors.email}
              </p>
            )}
          </div>

          {/* Role Display */}
          <div className="space-y-2">
            <label className="flex items-center font-medium text-gray-700">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              Account Role
            </label>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <span className="font-medium text-gray-700 capitalize">
                {role}
              </span>
            </div>
          </div>

          {/* Password Update Section */}
          <div className="space-y-6 border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-gray-900">
              Password Settings
            </h3>

            {/* Current Password */}
            <div className="space-y-2">
              <label className="flex items-center font-medium text-gray-700">
                <Lock className="mr-2 h-5 w-5 text-blue-600" />
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.currentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  className="absolute top-3.5 right-3 text-gray-400 hover:text-blue-600"
                >
                  {showPassword.currentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="flex items-center font-medium text-gray-700">
                <Lock className="mr-2 h-5 w-5 text-blue-600" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute top-3.5 right-3 text-gray-400 hover:text-blue-600"
                >
                  {showPassword.newPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="flex items-center font-medium text-gray-700">
                <Lock className="mr-2 h-5 w-5 text-blue-600" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute top-3.5 right-3 text-gray-400 hover:text-blue-600"
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="flex items-center text-sm text-red-500">
                  <X className="mr-1 h-4 w-4" /> {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 border-t border-gray-200 pt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center rounded-lg px-6 py-2.5 bg-rose-200 text-gray-600 transition-colors cursor-pointer hover:bg-rose-300"
            >
              <X className="mr-2 h-5 w-5 text-rose-500" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-2.5 cursor-pointer text-white transition-all hover:from-indigo-700 hover:to-blue-600 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
