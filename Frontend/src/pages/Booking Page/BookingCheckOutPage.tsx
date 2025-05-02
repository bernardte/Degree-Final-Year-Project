import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useBookingSessionStore from "@/stores/useBookingSessionStore";
import useRoomStore from "@/stores/useRoomStore";
import useToast from "@/hooks/useToast";
import BookingDetails from "@/layout/components/checkout-page-component/BookingDetails";
import PaymentSummary from "@/layout/components/checkout-page-component/PaymentSummary";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";

const BookingCheckOutPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { isLoading, error, fetchBookingSession, bookingSession } =
    useBookingSessionStore();
  const { rooms } = useRoomStore();
  const { showToast } = useToast();
  const [breakfastIncluded, setBreakfastIncluded] = useState<boolean>(false);
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) fetchBookingSession(sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (bookingSession?.isBreakfastIncluded) {
      setBreakfastIncluded(true);
    }
  }, [bookingSession]);

  if (error) {
    showToast("error", error);
  }

  const handleToggleBreakfast = () => {
    setBreakfastIncluded(!breakfastIncluded);
    showToast(
      "info",
      breakfastIncluded ? "Breakfast removed." : "Breakfast added!",
    );
  };

  // const calculateTotalPrice = () => {
  //   let total = bookingSession?.totalPrice || 0;
  //   if (breakfastIncluded) {
  //     total += 30;
  //   }
  //   return total;
  // };

  const handleBreadcrumbClick = (path: string) => {
    setLoadingTarget(path);
    setTimeout(() => {
      navigate(path);
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-tr from-blue-100 via-white to-blue-50">
      {/* Breadcrumb */}
      <Breadcrumb className="absolute z-1 px-8 pt-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleBreadcrumbClick("/");
              }}
              className={
                loadingTarget === "/"
                  ? "font-bold text-gray-700"
                  : "text-blue-600 hover:underline"
              }
            >
              {loadingTarget === "/" ? (
                <span className="animate-caret-blink">Loading...</span>
              ) : (
                "Home"
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleBreadcrumbClick("/filter-room");
              }}
              className={
                loadingTarget === "/filter-room"
                  ? "font-bold text-gray-700"
                  : "text-blue-600 hover:underline"
              }
            >
              {loadingTarget === "/filter-room" ? (
                <span className="animate-caret-blink">Loading...</span>
              ) : (
                "Filter Room"
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="font-bold text-gray-700">
              Checkout
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      ) : bookingSession ? (
        <div className="relative flex flex-1 flex-col md:flex-row">
          <BookingDetails
            bookingSession={bookingSession}
            rooms={rooms}
            breakfastIncluded={breakfastIncluded}
            onToggleBreakfast={handleToggleBreakfast}
          />
          <PaymentSummary
            checkInDate={formatDateInBookingCheckOut(
              bookingSession.checkInDate,
            )}
            checkOutDate={formatDateInBookingCheckOut(
              bookingSession.checkOutDate,
            )}
            roomId={bookingSession.roomId}
            breakfastIncluded={breakfastIncluded}
          />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-gray-600">No booking data found.</p>
        </div>
      )}
    </div>
  );
};

export default BookingCheckOutPage;
