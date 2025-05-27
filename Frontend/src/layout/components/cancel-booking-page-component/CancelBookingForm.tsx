import useToast from '@/hooks/useToast';
import axiosInstance from '@/lib/axios';
import { emailValidation } from '@/utils/emailValidation';
import { Loader } from 'lucide-react';
import { useState } from 'react'

type FormData = {
    email: string;
    bookingReference: string;
}

type FormErrors = {
  [K in keyof FormData]?: string;
};

const CancelBookingForm = () => {
    const [email, setEmail] = useState<string>("");
    const [bookingReference, setBookingReference] = useState<string>("");
    const [errors, setErrors] = useState<{ email?: string; bookingReference?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { showToast } = useToast();

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!email) {
            newErrors.email = "Email is required";
        } else if (emailValidation(email)) {
            newErrors.email = "Email is invalid";
        }
        if (!bookingReference) {
            newErrors.bookingReference = "Booking reference is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }
        try {
            const response = await axiosInstance.post("/api/bookings/cancel-booking", {
                email,
                bookingReference,
            })
            if(response?.data){
                setEmail("");
                setBookingReference("");
                setIsSubmitting(false);
                showToast("success", response?.data?.message)
            }
        } catch (error: any) {
            showToast("error", error?.response?.data?.error || "An error occurred");
            setIsSubmitting(false);
        }finally{
          setIsSubmitting(false);
        }
    }

    return (
      <div className="rounded-lg border border-blue-200 bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-2xl font-semibold text-blue-900">
          Cancel Your Booking
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-blue-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-blue-300 px-4 py-2 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Booking Reference Input */}
          <div>
            <label
              htmlFor="bookingReference"
              className="mb-2 block text-sm font-medium text-blue-700"
            >
              Booking Reference Number
            </label>
            <input
              type="text"
              id="bookingReference"
              value={bookingReference}
              onChange={(e) => setBookingReference(e.target.value)}
              className="w-full rounded-lg border border-blue-300 px-4 py-2 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter booking reference"
            />
            {errors.bookingReference && (
              <p className="mt-1 text-sm text-red-500">
                {errors.bookingReference}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isSubmitting ? (
              <>
              {console.log(isSubmitting)}
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Cancel Booking"
            )}
          </button>
        </form>
      </div>
    );
}

export default CancelBookingForm;
