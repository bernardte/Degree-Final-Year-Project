import useQueryParams from "@/hooks/useQueryParams";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import useAuthStore from "@/stores/useAuthStore";
import { Room } from "@/types/interface.type";
import { emailValidation } from "@/utils/emailValidation";
import { phoneNumberValidation } from "@/utils/phoneNumberValidation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface OneTimeBookingProps {
  selectedRoom: Room[];
}

interface FormData {
  contactName: string;
  contactEmail: string;
  contactNumber: string;
};

type FormErrors = {
  //Putting "?:" mean not always have errors
  [K in keyof FormData]?: string
};

const OneTimeBookingForm = ({ selectedRoom }: OneTimeBookingProps) => {
    const [contactName, setContactName] = useState<string>("");
    const [contactEmail, setContactEmail] = useState<string>("");
    const [contactNumber, setContactNumber] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const { getParam } = useQueryParams();
    const checkInDate = getParam("checkInDate");
    const checkOutDate = getParam("checkOutDate");
    const adults = Number(getParam("adults") || 0);
    const children = Number(getParam("children") || 0);
    const navigate = useNavigate();
    const totalGuest = { adults, children };
    const { showToast } = useToast();
    const { user } = useAuthStore();

    const handleError = (): FormErrors => {
      const newError: FormErrors = {};
      if(!contactName){
        newError.contactName = "Please enter your name";
      }

      if(!contactEmail){
        newError.contactEmail = "Please enter your email";
      }else if(emailValidation(contactEmail)){
        newError.contactEmail = "Invalid email format";
      }

      if(!contactNumber){
        newError.contactNumber = "Please enter your phone number";
      }else if(phoneNumberValidation(contactNumber)){
        newError.contactNumber = "Invalid phone number format";
      }

      return newError;
    }

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validateForm = handleError();
        if(Object.keys(validateForm).length > 0){
          setErrors(validateForm);
          return;
        }

        // Close the modal after submission
        setIsModalOpen(false);
        try {
                setLoading(true);
                const roomId = selectedRoom.map((room) => room._id);
                const totalPrice = selectedRoom.reduce(
                (total, room) => total + room.pricePerNight,
                0,
                );

                const response = await axiosInstance.post(
                  "/api/bookings/create-booking-session",
                  {
                    userId: null,
                    userType: user ? "User Booking" : "Guest Booking",
                    contactName,
                    contactEmail,
                    contactNumber,
                    checkInDate,
                    checkOutDate,
                    totalGuest,
                    roomId,
                    totalPrice: Math.round(parseInt(totalPrice.toFixed(2))),
                  },
                );

                const data = response.data;
                showToast("success", "Successfully Upload");
                const { sessionId } = data;
                navigate(`/booking/confirm/${sessionId}`);
                setContactEmail("");
                setContactName("");
                setContactNumber("");
        } catch (error: any) {
            console.log("Error in handleBookingSubmit: ", error.response.data.error);
            showToast("error", error.response.data.error)
        }finally{
            setLoading(false);
        }

    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
      <div className="relative">
        <button
          onClick={handleOpenModal}
          className="w-full cursor-pointer bg-blue-600 py-2 font-semibold text-white transition hover:scale-105 hover:bg-blue-700"
        >
          One Time Booking
        </button>

        {/* Modal Popup */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
          >
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-96 rounded-lg bg-white p-6 shadow-xl"
            >
              <h2 className="mb-4 text-2xl font-semibold text-blue-700">
                One-Time Booking - Guest Information
              </h2>
              <form onSubmit={handleBookingSubmit} className="grid gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                  />
                  {errors.contactName && (
                    <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                      {errors.contactName}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                  />
                  {errors.contactEmail && (
                    <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                      {errors.contactEmail}
                    </span>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                  />
                  {errors.contactNumber && (
                    <span className="absolute -bottom-5 left-0 text-sm text-red-500">
                      {errors.contactNumber}
                    </span>
                  )}
                </div>
                {/* Optional Account Creation
                <div className="mt-4 flex items-center gap-2">
                    <input type="checkbox" id="register" className="h-4 w-4" />
                    <label htmlFor="register" className="text-sm text-gray-600">
                    Create an account to manage future bookings
                    </label>
                </div> */}

                {/* Submit Button */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin text-blue-500" />
                        <span>Proceed Booking</span>
                      </div>
                    ) : (
                      "Proceed Booking"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
};

export default OneTimeBookingForm;
