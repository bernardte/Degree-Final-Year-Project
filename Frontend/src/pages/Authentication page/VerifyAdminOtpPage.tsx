import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";

const VerifyAdminOtpPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setIsAdminVerified } = useAuthStore();
  // avoid multiple sent otp
  const hasSentRef = useRef(false);


  useEffect(() => {
    const sendOTPToEmail = async () => {
      if(hasSentRef.current){
        return
      }
        hasSentRef.current = true;

      try {
        const response = await axiosInstance.post("/api/users/send-otp-to-email");

        if(response.data){
          showToast("info", response.data.message)
        }
      } catch (error: any) {
        console.log("Error in send OTP to email: ", error?.response?.data?.error)
      }
    }

    sendOTPToEmail()
  }, [])

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      showToast("error", "Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/users/verify-otp", {
        otp,
      });

      if (response.data?.error) {
        showToast("error", response.data.error.message);
        setIsAdminVerified(false)
        return;
      }

      showToast("success", "Admin verified successfully.");
      setIsAdminVerified(true)
      navigate("/loading");
    } catch (err: any) {
      showToast(
        "error",
        `Invalid access code, your remain attempts ${err.response.data?.remainingAttempts || 0}`,
      );

      if (err.response.data.remainingAttempts === undefined){
        
        setTimeout(() => navigate("/"), 1000);
      } 
      setIsAdminVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-sky-100 via-cyan-100 to-white bg-cover bg-center">
      {/* Overlay */}
      <div className="bg-opacity-40 absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Centered Popup */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-blue-700">
            Admin Verification
          </h2>
          <p className="mb-4 text-center text-sm text-gray-600">
            Please enter the 6-digit OTP to verify your admin account.
          </p>

          <div className="align-center flex justify-center">
            <InputOTP value={otp} onChange={setOtp} maxLength={6} autoFocus>
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    autoFocus={index === 0}
                    className="m-1 h-12 w-12 rounded-md border border-gray-700 text-2xl"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="mt-3 flex flex-col">
            <button
              onClick={handleVerify}
              disabled={isLoading}
              className="mt-6 w-full cursor-pointer rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  Verify&nbsp;
                  <Loader2 className="animate-spin text-blue-500" />
                </span>
              ) : (
                "Verify OTP"
              )}
            </button>
            <span
              className="cursor-pointer pt-3 text-center text-sm text-blue-500 hover:underline hover:underline-offset-4"
              onClick={() => navigate("/")}
            >
              Login as a user?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAdminOtpPage;
