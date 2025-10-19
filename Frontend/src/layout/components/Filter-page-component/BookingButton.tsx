import useQueryParams from "@/hooks/useQueryParams";
import useToast from "@/hooks/useToast";
import { Room } from "@/types/interface.type";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";

interface BookingButtonProps{
    selectedRoom: Room[]
}

const BookingButton = ({ selectedRoom }: BookingButtonProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { getParam } = useQueryParams();
    const checkInDate = getParam("checkInDate");
    const checkOutDate = getParam("checkOutDate");
    const adults = Number(getParam("adults") || 0);
    const children = Number(getParam("children") || 0);
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const userEmail = user?.email

    const totalGuest = { adults, children };

    const { showToast } = useToast();

    const handleBookingMultiple = async (): Promise<void> => {

      setLoading(true);
      try {
        const roomId = selectedRoom.map((room) => room._id);
        const totalPrice = selectedRoom.reduce(
          (total, room) => total + room.pricePerNight,
          0,
        );

        const response = await axiosInstance.post(
          "/api/bookings/create-booking-session",
          {
            userEmail,
            roomId,
            checkInDate,
            checkOutDate,
            totalGuest,
            totalPrice: Math.round(parseInt(totalPrice.toFixed(2))),
          },
        );

        const data = response.data;

        if (data.error) {
          showToast("error", data.error);
        }

        const { sessionId } = data;
        navigate(`/booking/confirm/${sessionId}`);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "An unexpected error occurred.";
        showToast("error", errorMessage);
      } finally {
        setLoading(false);
      }
    };

  return (
      <Button
        className="transform cursor-pointer rounded bg-blue-500 px-3 py-4 text-md  text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none"
        onClick={handleBookingMultiple}
        disabled={loading} // Disable button during loading
      >
        {/* Show a loading spinner if loading is true */}
        {loading ? (
          <span className="flex items-center">
            <Loader2 className="text-blue-500 animate-spin"/>
            Booking...
          </span>
        ) : (
          `Book ${selectedRoom.length} Room${selectedRoom.length > 1 ? "s" : ""}`
        )}
      </Button>
  );
}

export default BookingButton
