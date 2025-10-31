import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Home } from "lucide-react";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import useAuthStore from "@/stores/useAuthStore";


const HotelUnauthorized = () => {
  const navigate = useNavigate();
  const guestId = localStorage.getItem("guestId") || undefined;
  const sessionId = localStorage.getItem("sessionId") || undefined;
  const user = useAuthStore((state) => state.user);
  const showToastRef = useRef<boolean>(false);
  const statusCodeRef = useRef<HTMLDivElement>(null);

  // Activate status code pulse animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      statusCodeRef.current?.classList.add("animate-status-pulse");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const { showToast } = useToast();

  useEffect(() => {

    if (!showToastRef.current) {
      showToastRef.current = true;

      axiosInstance
        .post("/api/users/unauthorized", {
          guestId,
          userId: user?._id,
          userRole: user?.role,
          sessionId,
        })
        .then((response) => {
          console.log("response: ", response.data);
        })
        .catch((error) => {
          showToast("warn", error?.response?.data?.error);
        });
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-900">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl transition-all hover:shadow-2xl md:p-12 dark:bg-gray-800">
        {/* Floating Hotel Icon */}
        <div className="animate-float mx-auto mb-8 flex">
          <svg
            className="h-32 w-32 items-center text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
            />
          </svg>
          {/* Status Code Display with Pulse Animation */}
          <div className="animate-fadeInDown mb-8 pl-4 text-center">
            <div
              id="status-code"
              className="mx-auto inline-block font-mono text-8xl font-bold text-blue-600 dark:text-blue-400"
            >
              403
              <div className="mt-1 font-sans text-sm font-normal tracking-widest text-blue-400 dark:text-blue-300">
                FORBIDDEN
              </div>
            </div>
          </div>
        </div>

        {/* Animated Title */}
        <h1 className="animate-fadeInUp mb-4 text-3xl font-bold text-gray-800 md:text-4xl dark:text-white">
          Restricted Access
        </h1>

        {/* Animated Description */}
        <p className="animate-fadeInUp mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-600 delay-100 dark:text-gray-300">
          Authorization required to view this content. Possible reasons:
        </p>

        {/* Animated Reason Cards */}
        <div className="mx-auto mb-12 grid max-w-md gap-4 text-left md:grid-cols-2">
          {/* Unauthenticated Session Card */}
          <div className="animate-card-rise flex items-center space-x-3 rounded-lg bg-blue-50 p-3 delay-150 dark:bg-blue-900/20">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-200">
              Unauthenticated session
            </span>
          </div>

          {/* Insufficient Access Card */}
          <div className="animate-card-rise flex items-center space-x-3 rounded-lg bg-blue-50 p-3 delay-200 dark:bg-blue-900/20">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 dark:bg-blue-600">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-200">
              Insufficient access level
            </span>
          </div>
        </div>

        {/* Animated Action Buttons */}
        <div className="animate-fadeInUp flex flex-col justify-center gap-4 delay-300 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer rounded-lg bg-gray-100 px-8 py-3 font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            ← Back to Previous
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center rounded-lg bg-blue-600 px-8 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Home className="mr-2 h-4 w-4" />
            Back To Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelUnauthorized;
