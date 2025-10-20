import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, Shield, Mail, RotateCcw } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";

const VerifyAdminOtpPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const { setIsAdminVerified } = useAuthStore();

  // Prevent multiple OTP requests
  const hasSentRef = useRef(false);

  // Send OTP to email on component mount
  useEffect(() => {
    const sendOTPToEmail = async () => {
      // Prevent duplicate OTP requests
      if (hasSentRef.current) {
        return;
      }
      hasSentRef.current = true;

      try {
        const response = await axiosInstance.post(
          "/api/users/send-otp-to-email",
        );

        if (response.data) {
          showToast("info", response.data.message);
          // Start cooldown timer after first OTP send (60 seconds)
          setResendCooldown(60);
        }
      } catch (error: any) {
        console.error(
          "Error sending OTP to email: ",
          error?.response?.data?.error,
        );
        showToast("error", "Failed to send OTP. Please try again.");
      }
    };

    sendOTPToEmail();
  }, [showToast]);

  // Handle resend OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  // Handle OTP verification
  const handleVerify = async () => {
    // Validate OTP length
    if (!otp || otp.length < 6) {
      showToast("error", "Please enter a valid 6-digit OTP code.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/users/verify-otp", {
        otp,
      });

      if (response.data?.error) {
        showToast("error", response.data.error.message);
        setIsAdminVerified(false);
        return;
      }

      // Successful verification
      showToast("success", "Admin verification successful!");
      setIsAdminVerified(true);
      navigate("/loading");
    } catch (err: any) {
      // Handle verification failure
      const remainingAttempts = err.response.data?.remainingAttempts;

      if (remainingAttempts !== undefined) {
        showToast(
          "error",
          `Invalid verification code. Remaining attempts: ${remainingAttempts}`,
        );
      } else {
        showToast("error", "Verification failed. Redirecting to login...");
        setTimeout(() => navigate("/"), 1000);
      }

      setIsAdminVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP request
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      const response = await axiosInstance.post("/api/users/send-otp-to-email");

      if (response.data) {
        showToast("success", "New verification code sent to your email");
        // Reset cooldown timer (60 seconds)
        setResendCooldown(60);
      }
    } catch (error: any) {
      console.error("Error resending OTP: ", error?.response?.data?.error);
      showToast("error", "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]" />

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md transform rounded-2xl bg-white/95 p-8 shadow-2xl shadow-blue-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-blue-300/60">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Admin Verification
            </h1>
            <p className="text-sm text-gray-600">
              Enter the 6-digit verification code sent to your registered email
            </p>
          </div>

          {/* OTP Input Section */}
          <div className="mb-6">
            <div className="flex justify-center">
              <InputOTP value={otp} onChange={setOtp} maxLength={6} autoFocus>
                <InputOTPGroup>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="m-1 h-14 w-14 rounded-xl border-2 border-gray-300 text-2xl font-semibold transition-all hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* OTP Instructions */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Mail className="h-4 w-4" />
              <span>Check your email for the verification code</span>
            </div>
          </div>

          {/* Resend OTP Section */}
          <div className="mb-6 text-center">
            <button
              onClick={handleResendOtp}
              disabled={isResending || resendCooldown > 0}
              className="inline-flex items-center gap-2 text-sm text-blue-600 transition-all hover:text-blue-800 hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending new code...
                </>
              ) : resendCooldown > 0 ? (
                `Resend code in ${resendCooldown}s`
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" />
                  Resend verification code
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleVerify}
              disabled={isLoading || otp.length !== 6}
              className="w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Identity"
              )}
            </button>

            {/* Alternative Action */}
            <button
              onClick={() => navigate("/")}
              className="w-full text-center text-sm text-blue-600 transition-colors hover:text-blue-800 hover:underline"
            >
              Return to User Login
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 rounded-lg bg-blue-50 p-3 text-center">
            <p className="text-xs text-blue-700">
              🔒 Secure admin access required. Unauthorized attempts are
              prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAdminOtpPage;
