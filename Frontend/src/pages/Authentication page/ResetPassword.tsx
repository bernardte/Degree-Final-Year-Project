import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import useAuthStore from "@/stores/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";

interface FormData {
    newPassword: string,
    confirmPassword: string,
}

type FormError = {
   [k in keyof FormData] ?: string;
}

const ResetPassword = () => {
  const [formData, setFormData] = useState<FormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormError>({});
  const { showToast } = useToast();
  const { setOpenLoginPopup } = useAuthStore();
  const navigate = useNavigate();
  const { token } = useParams()

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user types
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormError = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords does not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
     try {
        const response = await axiosInstance.post("/api/users/reset-password", { newPassword: formData.newPassword, token })
     
        if(response.data.message){
            showToast("success", response?.data?.message);
            setIsSubmitted(true);

            setTimeout(() => {
                navigate("/");
                setOpenLoginPopup(true);
            }, 3000)
        }
    } catch (error: any) {
        showToast("error", error?.response?.data?.error)
     }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-100 via-cyan-100 to-white p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Top decorative bar */}
        <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600" />

        <div className="p-8">
          {/* Back button */}
          <button
            className="mb-6 flex items-center text-blue-600 transition-colors hover:text-blue-800"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Login
          </button>

          {/* Icon and title */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Reset Password
            </h1>
            <p className="text-gray-600">
              {isSubmitted
                ? "Your password has been successfully reset!"
                : "Please enter your new password below"}
            </p>
          </div>

          {/* Success message or form */}
          {isSubmitted ? (
            <div className="py-6 text-center">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                Password Updated
              </h3>
              <p className="mb-6 text-gray-600">
                Your password has been successfully reset. You can now login
                with your new password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`block w-full border py-3 pr-10 pl-10 ${errors.newPassword ? "border-red-500" : "border-gray-300"} rounded-lg transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.newPassword}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Must be at least 8 characters long
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full border py-3 pr-10 pl-10 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-lg transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
