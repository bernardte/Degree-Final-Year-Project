import { useState, useRef, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import useToast from "@/hooks/useToast";
import { Link, useNavigate } from "react-router-dom";
import { emailValidation } from "@/utils/emailValidation";

interface FormData {
  email: string;
  password: string;
}

type FormError = {
  [k in keyof FormData ]?: string
}

const LoginPagePopUp = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setIsAuthenticated, login, setOpenSignupPopup, setIsAdmin } =
    useAuthStore();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [ error, setError ] = useState<FormError>({});

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleError = (): FormError => {
    const errror: FormError = {};
    if (!input.email) {
      errror.email = 'Email is required';
    } else if (emailValidation(input.email)) {
      errror.email = 'Invalid email format';
    }

    if (!input.password) {
      errror.password = 'Password is required';
    }

    return errror;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validateForm = handleError();
    if (Object.keys(validateForm).length > 0){
      setError(validateForm);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/users/login", {
        email: input.email,
        password: input.password,
      });

      const data = response.data;

      if (data.error) {
        showToast("error", data.error.message || "Login failed.");
        setIsLoading(false);
        return;
      }

      console.log(data.role);
      login(data, data.token, data.role); // Store user data
      setIsAuthenticated(true);
      setIsAdmin(data.role === "admin" || data.role === "superadmin");

      if (data.role === "admin" || data.role === "superadmin" && !data.isOTPVerified) {
        showToast("info", "Please verify OTP to continue as admin.");
        navigate("/verify-admin-otp", {
          state: { email: input.email }, // pass email for the OTP page
        });
      } else {
        showToast("success", "Login successful");
        setInput({ email: "", password: "" });
        navigate("/loading");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "An unexpected error occurred during login.";
      showToast("error", errorMessage);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]"
      onClick={() => setOpenSignupPopup(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl/30"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-blue-700">
          Welcome Back
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              ref={inputRef}
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

          <div className="relative mt-6">
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
              {!showPassword ? (
                <Eye
                  className="absolute top-2 right-0 mr-4 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <EyeOff
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

          <button
            type="submit"
            className="mt-3 w-full cursor-pointer rounded-xl bg-blue-600 py-2 font-semibold text-white transition duration-300 hover:bg-blue-700"
          >
            {isLoading ? <Loader2 className="m-auto animate-spin" /> : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <Link
            to="/"
            className="text-blue-600 hover:underline"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              setOpenSignupPopup(true);
            }}
          >
            &nbsp;Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPagePopUp;
