import axiosInstance from "@/lib/axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import useToast from "@/hooks/useToast";
import { Link } from "react-router";
import useAuthStore from "@/stores/useAuthStore";

const SignupPagePopUp = () => {
  const [input, setInput] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();
  const { setOpenLoginPopup } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axiosInstance.post("/api/users/signup", {
        name: input.name,
        username: input.username,
        email: input.email,
        password: input.password,
      });


      showToast("success", "Signup successful!");
      setInput({
        name: "",
        username: "",
        email: "",
        password: "",
      });
      setIsLoading(false);
      
    } catch (error: any) {
     const errorMessage =
       error?.response?.data?.message ||
       error?.response?.data?.error ||
       error?.message ||
       "An unexpected error occurred during signup.";

     showToast("error", errorMessage);
     setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed z-50 top-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
      onClick={() => setOpenLoginPopup(false)} // close popup on background click
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl/30"
        onClick={(e) => e.stopPropagation()} // prevent popup closing on background click
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-blue-700">
          Create an Account
        </h2>
        <form className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={input.username}
              onChange={(e) => setInput({ ...input, username: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={showPassword ? "abc1234" : "••••••••"}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            </div>
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-blue-600 py-2 font-semibold text-white transition duration-300 hover:bg-blue-700"
            onClick={handleSubmit}
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
