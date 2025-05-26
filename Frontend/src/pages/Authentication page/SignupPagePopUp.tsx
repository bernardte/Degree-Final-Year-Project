import axiosInstance from "@/lib/axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import useToast from "@/hooks/useToast";
import { Link } from "react-router";
import useAuthStore from "@/stores/useAuthStore";
import { emailValidation } from "@/utils/emailValidation";

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
}

type FormError = {
  [k in keyof FormData]?: string;
};

const SignupPagePopUp = () => {
  const [input, setInput] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FormError>({});
  const { showToast } = useToast();
  const { setOpenLoginPopup } = useAuthStore();

  const handleError = (): FormError => {
    const error: FormError = {};

    if (!input.name) {
      error.name = "Full name is required";
    }

    if (!input.email) {
      error.email = "Email is required";
    } else if (!emailValidation(input.email)) {
      error.email = "Invalid email format";
    }

    if (!input.username) {
      error.username = "Username is required";
    }

    if (!input.password) {
      error.password = "Password is required";
    }else if (input.password.length < 6) {
      error.password = "Password must be at least 6 characters long";
    }

    return error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formValidation = handleError();

    if (Object.keys(formValidation).length > 0) {
      setError(formValidation);
      return;
    }

    try {
      setIsLoading(true);

      await axiosInstance.post("/api/users/signup", input);

      showToast("success", "Signup successful!");
      setInput({ name: "", username: "", email: "", password: "" });
      setError({});
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "An unexpected error occurred during signup.";
      showToast("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed top-0 z-50 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]"
      onClick={() => setOpenLoginPopup(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl/30"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-blue-700">
          Create an Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className={`mt-1 w-full rounded-md border p-2 shadow-sm focus:ring ${
                error.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
            {error.name && (
              <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                {error.name}
              </span>
            )}
          </div>

          {/* Username */}
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              className={`mt-1 w-full rounded-md border p-2 shadow-sm focus:ring ${
                error.username
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              value={input.username}
              onChange={(e) => setInput({ ...input, username: e.target.value })}
            />
            {error.username && (
              <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                {error.username}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              placeholder="you@example.com"
              className={`mt-1 w-full rounded-md border p-2 shadow-sm focus:ring ${
                error.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
            />
            {error.email && (
              <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                {error.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={showPassword ? "abc1234" : "••••••••"}
                className={`mt-1 w-full rounded-md border p-2 shadow-sm focus:ring ${
                  error.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
                value={input.password}
                onChange={(e) =>
                  setInput({ ...input, password: e.target.value })
                }
              />
              {showPassword ? (
                <EyeOff
                  className="absolute top-2 right-0 mr-4 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <Eye
                  className="absolute top-2 right-0 mr-4 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
              {error.password && (
                <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                  {error.password}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-blue-600 py-2 font-semibold text-white transition duration-300 hover:bg-blue-700"
          >
            {isLoading ? <Loader2 className="m-auto animate-spin" /> : "Signup"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 hover:underline"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              setOpenLoginPopup(true);
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPagePopUp;
