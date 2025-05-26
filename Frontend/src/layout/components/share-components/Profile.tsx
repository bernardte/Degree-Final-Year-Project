import { useState, useEffect } from "react";
import { UserCircle, User, Lock, Camera, X, Check, EyeIcon, EyeClosedIcon, Mail, Loader2, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/useUserStore";
import { emailValidation } from "@/utils/emailValidation";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";


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
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const { currentLoginUser, fetchCurrentLoginUser } = useUserStore((state) => state);
  const [username, setUsername] = useState<string>(currentLoginUser?.username || "");
  const [email, setEmail] = useState<string>(currentLoginUser?.email || "");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>();
  const [preview, setPreview] = useState<string>(currentLoginUser?.profilePic || "");
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const { showToast } = useToast();
  const role = currentLoginUser?.role || "";
  const formattedRole = role.replace(/([a-z])([A-Z])/g, "$1 $2");


  useEffect(() => {
    fetchCurrentLoginUser();
  }, [fetchCurrentLoginUser]);
useEffect(() => {
    if (currentLoginUser) {
    setUsername(currentLoginUser.username);
    setEmail(currentLoginUser.email);
    setPreview(currentLoginUser?.profilePic);
    }
    setIsLoading(false);
}, [currentLoginUser]);
  console.log("Current Login User: ", email);
  const handleShowPassword = (field: string) => {
    setShowPassword((prev) => ({
        ...prev,
        [field]: !prev[field]
    }))
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!username) {
      errors.username = "Username is required";
    }

    if(!email){
        errors.email = "Email is required";
    }else if(emailValidation(email)){
        errors.email = "Invalid email format";
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (avatar && !avatar.type.startsWith("image/")) {
      errors.avatar = "Uploaded file must be an image";
    }
    return errors;
  }

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if(Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToast('error', Object.values(validationErrors).filter(Boolean).join('\n'));
        return;
    }
    setErrors({});
    setIsLoading(true);
    try {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("currentPassword", currentPassword);
        if (newPassword) {
          formData.append("newPassword", newPassword);
        }
        if (avatar) {
          formData.append("profilePic", avatar);
        }
        const response = await axiosInstance.put(`/api/users/updateProfile/${currentLoginUser?._id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        if(response?.data){
            showToast("success", `${username} updated successfully!`);
            setUsername(response.data.username);
            setEmail(response.data.email);
            setPreview(response.data.profilePic);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setAvatar(null);
        }
    } catch (error:any) {
      console.error("Error updating profile:", error);
      showToast("error", error?.response?.data?.error || "Failed to update profile.");
      return; 
    }finally{
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
        {/* Avatar Upload Section */}
        <div className="group relative mx-auto mb-6 h-32 w-32">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="Avatar"
                className="h-full w-full rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <UserCircle className="h-full w-full text-gray-400" />
            )}
            <div className="absolute right-0 bottom-0 rounded-full bg-white p-1 shadow-sm group-hover:bg-gray-100">
              <Camera className="h-6 w-6 text-gray-600" />
            </div>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
              <User className="mr-2 h-4 w-4" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
           />
          </div>
          <div>
            <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
              <User2 className="mr-2 h-4 w-4" />
              Role
            </label>
            <input
              type="text"
              value={formattedRole}
              className="capitalize w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              readOnly
           />
          </div>

          {/* Current Password Field */}
          <div>
            <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
              <Lock className="mr-2 h-4 w-4" />
              Current Password
            </label>
            <div className="relative">
              <input
                type={!showPassword.currentPassword ? "password" : "text"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {showPassword.currentPassword ? (
                <EyeIcon
                  className="absolute top-3 right-2 cursor-pointer"
                  onClick={() => handleShowPassword("currentPassword")}
                />
              ) : (
                <EyeClosedIcon
                  className="absolute top-3 right-2 cursor-pointer"
                  onClick={() => handleShowPassword("currentPassword")}
                />
              )}
            </div>
          </div>

          {/* New Password Field */}
          <div>
            <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
              <Lock className="mr-2 h-4 w-4" />
              New Password
            </label>
            <div className="relative">
              <input
                type={!showPassword.newPassword ? "password" : "text"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {showPassword.newPassword ? (
                <EyeIcon
                  className="absolute top-3 right-2 cursor-pointer"
                  onClick={() => handleShowPassword("newPassword")}
                />
              ) : (
                <EyeClosedIcon
                  className="absolute top-3 right-2 cursor-pointer"
                  onClick={() => handleShowPassword("newPassword")}
                />
              )}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
              <Lock className="mr-2 h-4 w-4" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={!showPassword.confirmPassword ? "password" : "text"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {showPassword.confirmPassword ? (
                <EyeIcon
                  className="absolute top-3 right-2 cursor-pointer"
                  onClick={() => handleShowPassword("confirmPassword")}
                />
              ) : (
                <EyeClosedIcon
                  className="absolute top-3 right-2 cursor-pointer"
                  onClick={() => handleShowPassword("confirmPassword")}
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="flex cursor-pointer items-center rounded-md px-4 py-2 text-red-600 hover:bg-red-50"
              onClick={() => navigate(-1)}
            >
              <X className="mr-1 h-5 w-5" />
              Cancel
            </button>
            {isLoading ? (
              <button
                type="submit"
                className="flex cursor-pointer items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                disabled
              >
                Save <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex cursor-pointer items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              >
                <Check className="mr-1 h-5 w-5" />
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
