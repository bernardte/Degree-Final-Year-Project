import { useEffect, useRef, useState } from "react";
import { Mail, ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setOpenLoginPopup } = useAuthStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();


  useEffect(() => {
   if (inputRef.current) {
    inputRef.current.focus();
   }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const response = await axiosInstance.post("/api/users/forget-password-request", { email });
        if(response?.data?.message){
            showToast("success", response?.data?.message);
            setIsSubmitted(true);
        }
    } catch (error: any) {
        console.log('Error in handleSubmit: ', error?.response?.data?.error);
        showToast("error", error?.response?.data?.error)
    }finally{
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-100 via-cyan-100 to-white p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Top decorative strip */}
        <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700" />

        <div className="p-8">
          {/* Back Button */}
          <button
            className="mb-6 flex items-center text-blue-600 transition-colors hover:text-blue-800"
            onClick={() => {
              navigate(-1);
              setOpenLoginPopup(true);
            }}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Login
          </button>

          {/* Icon and title */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Forget Password
            </h1>
            <p className="text-gray-600">
              {isSubmitted
                ? "We have sent a reset link to your email address"
                : "Enter your email address and we will send you a password reset link"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={inputRef}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 py-3 pr-3 pl-10 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Email..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full items-center justify-center rounded-lg px-4 py-3 font-medium text-white transition-colors ${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
