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
  BadgeCheck,
  Gem,
  Crown,
  Medal,
  Award,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/useUserStore";
import { emailValidation } from "@/utils/emailValidation";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import useAuthStore from "@/stores/useAuthStore";
import { motion } from "framer-motion";

interface FormErrors {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  avatar?: string;
}

// 忠诚度等级配置
const loyaltyTiers = {
  bronze: {
    name: "Bronze",
    color: "#cd7f32",
    gradient: "linear-gradient(135deg, #8c6b46, #cd7f32, #a67c52)",
    icon: <Medal className="text-[#cd7f32]" />,
    badgeClass: "bg-gradient-to-r from-amber-800 to-amber-600",
    borderClass: "border-amber-600",
    glowClass: "shadow-[0_0_20px_rgba(205,127,50,0.3)]",
  },
  silver: {
    name: "Silver",
    color: "#c0c0c0",
    gradient: "linear-gradient(135deg, #e0e0e0, #c0c0c0, #a0a0a0)",
    icon: <Award className="text-[#c0c0c0]" />,
    badgeClass: "bg-gradient-to-r from-gray-300 to-gray-400",
    borderClass: "border-gray-300",
    glowClass: "shadow-[0_0_20px_rgba(192,192,192,0.3)]",
  },
  gold: {
    name: "Gold",
    color: "#ffd700",
    gradient: "linear-gradient(135deg, #ffd700, #daa520, #ffec8b)",
    icon: <Gem className="text-[#ffd700]" />,
    badgeClass: "bg-gradient-to-r from-yellow-500 to-yellow-300",
    borderClass: "border-yellow-400",
    glowClass: "shadow-[0_0_20px_rgba(255,215,0,0.3)]",
  },
  platinum: {
    name: "Platinum",
    color: "#e5e4e2",
    gradient: "linear-gradient(135deg, #f8f9fa, #e5e4e2, #d3d3d3, #f8f9fa)",
    icon: <Crown className="text-[#e5e4e2]" />,
    badgeClass: "bg-gradient-to-r from-gray-200 to-gray-100",
    borderClass: "border-gray-200",
    glowClass: "shadow-[0_0_20px_rgba(229,228,226,0.4)]",
  },
};

const Profile = () => {
  // 状态管理
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

  // 获取当前用户的忠诚度等级配置
  const userTier = currentLoginUser?.loyaltyTier?.toLowerCase() || "bronze";
  const tierConfig =
    loyaltyTiers[userTier as keyof typeof loyaltyTiers] || loyaltyTiers.bronze;

  // 获取用户数据
  useEffect(() => {
    fetchCurrentLoginUser().finally(() => setIsLoading(false));
  }, [fetchCurrentLoginUser]);

  // 更新表单数据
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

  // 切换密码可见性
  const togglePasswordVisibility = (
    field: "confirmPassword" | "currentPassword" | "newPassword",
  ) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // 处理头像更改
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

  // 表单验证
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

  // 处理表单提交
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl ${tierConfig.glowClass}`}
      >
        {/* 个人资料头部 - 徽章部分 */}
        <div className="relative mb-10 text-center">
          {/* 忠诚度等级徽章 - 固定在顶部 */}
          <div
            className={`absolute top-20 left-1/2 -translate-x-1/2 transform rounded-full px-4 py-2 font-bold text-white ${tierConfig.badgeClass} z-10 flex items-center gap-2`}
          >
            {tierConfig.icon}
            <span>{tierConfig.name.toUpperCase()} TIER</span>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-600 pb-5">
            Manage your account information and security
          </p>
        </div>

        {/* 头像部分 */}
        <div className="mb-12 flex flex-col items-center">
          <label className="group relative cursor-pointer">
            <div
              className={`h-32 w-32 rounded-full border-2 p-1 ${tierConfig.borderClass}`}
            >
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
              <div className="absolute right-0 bottom-0 rounded-full bg-white p-2 shadow-md transition-colors group-hover:bg-blue-100">
                <Camera
                  className="h-6 w-6"
                  style={{ color: tierConfig.color }}
                />
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

        {/* 个人资料表单 */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 用户名输入 */}
          <div className="space-y-2">
            <label className="flex items-center font-medium text-gray-700">
              <User
                className="mr-2 h-5 w-5"
                style={{ color: tierConfig.color }}
              />
              Username
            </label>
            <input
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              className={`w-full rounded-lg border border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-[${tierConfig.color}]`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="flex items-center text-sm text-red-500">
                <X className="mr-1 h-4 w-4" /> {errors.username}
              </p>
            )}
          </div>

          {/* 邮箱输入 */}
          <div className="space-y-2">
            <label className="flex items-center font-medium text-gray-700">
              <Mail
                className="mr-2 h-5 w-5"
                style={{ color: tierConfig.color }}
              />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className={`w-full rounded-lg border border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-[${tierConfig.color}]`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="flex items-center text-sm text-red-500">
                <X className="mr-1 h-4 w-4" /> {errors.email}
              </p>
            )}
          </div>

          {/* 账户信息卡片 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* 账户角色显示 */}
            <div className="space-y-2">
              <label className="flex items-center font-medium text-gray-700">
                <User
                  className="mr-2 h-5 w-5"
                  style={{ color: tierConfig.color }}
                />
                Account Role
              </label>
              <div
                className={`rounded-lg border ${tierConfig.borderClass} bg-white px-4 py-3`}
              >
                <span className="font-medium text-gray-700 capitalize">
                  {role}
                </span>
              </div>
            </div>

            {/* 忠诚度等级显示 */}
            <div className="space-y-2">
              <label className="flex items-center font-medium text-gray-700">
                <BadgeCheck
                  className="mr-2 h-5 w-5"
                  style={{ color: tierConfig.color }}
                />
                Loyalty Tier
              </label>
              <div
                className={`flex items-center rounded-lg border ${tierConfig.borderClass} bg-white px-4 py-3`}
              >
                <span
                  className="font-bold capitalize"
                  style={{ color: tierConfig.color }}
                >
                  {tierConfig.name}
                </span>
                <span className="ml-2 text-gray-600">Member</span>
              </div>
            </div>
          </div>

          {/* 密码更新部分 */}
          <div className="space-y-6 border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Password Settings
              </h3>
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Object.keys(loyaltyTiers).indexOf(userTier) + 1
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>

            {/* 当前密码 */}
            <div className="space-y-2">
              <label className="flex items-center font-medium text-gray-700">
                <Lock
                  className="mr-2 h-5 w-5"
                  style={{ color: tierConfig.color }}
                />
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
                  className={`w-full rounded-lg border border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-[${tierConfig.color}]`}
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

            {/* 新密码 */}
            <div className="space-y-2">
              <label className="flex items-center font-medium text-gray-700">
                <Lock
                  className="mr-2 h-5 w-5"
                  style={{ color: tierConfig.color }}
                />
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
                  className={`w-full rounded-lg border border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-[${tierConfig.color}]`}
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

            {/* 确认密码 */}
            <div className="space-y-2">
              <label className="flex items-center font-medium text-gray-700">
                <Lock
                  className="mr-2 h-5 w-5"
                  style={{ color: tierConfig.color }}
                />
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
                  className={`w-full rounded-lg border border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-[${tierConfig.color}]`}
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

          {/* 表单操作按钮 */}
          <div className="flex justify-end gap-4 border-t border-gray-200 pt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex cursor-pointer items-center rounded-lg bg-gray-100 px-6 py-2.5 text-gray-600 transition-colors hover:bg-gray-200"
            >
              <X className="mr-2 h-5 w-5 text-gray-500" />
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isLoading}
              className="flex cursor-pointer items-center rounded-lg px-6 py-2.5 text-white transition-all disabled:opacity-70"
              style={{ background: tierConfig.gradient }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
