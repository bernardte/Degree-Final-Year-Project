import { FileSearch2, Home, Loader2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import axiosInstance from "@/lib/axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const BookingCheckOutPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { isLoading, error, fetchBookingSession, bookingSession } =
    useBookingSessionStore();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { rooms, fetchRooms, updateSelectedRoomBreakfast } = useRoomStore();
  const { showToast } = useToast();
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);
  const localStorageSearchParams = localStorage.getItem("searchParams") || "{}";
  const parse = JSON.parse(localStorageSearchParams) || {};
  const [appliedReward, setAppliedReward] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const user = localStorage.getItem("user");
  const isLoggedIn = !!user;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionId) fetchBookingSession(sessionId);
    fetchRooms();
  }, [sessionId, fetchRooms]);

  useEffect(() => {
    if (sessionId) {
      fetchBookingSession(sessionId);
      console.log("reach on  added refresh");
    }

    fetchRooms();
  }, [bookingSession?.breakfastIncluded, sessionId]);

  if (error) {
    showToast("error", error);
  }

  const handleDeleteBookingSession = async (sessionId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/api/bookings/delete-booking-session/${sessionId}`,
      );
      if (response.data) {
        showToast("success", "Your Booking Session Has Been Deleted");
      }
    } catch (error: any) {
      console.log(
        "Error in handle Delete Booking Session: ",
        error?.response?.data?.error,
      );
      showToast("error", error?.response?.data?.error);
    }
  };

  const handleToggleBreakfast = (roomId: string) => {
    updateSelectedRoomBreakfast(roomId, bookingSession._id);

    const targetRoom = rooms.find((r) => r._id === roomId);
    showToast(
      "info",
      targetRoom?.breakfastIncluded ? "Breakfast removed." : "Breakfast added!",
    );
  };

  const handleBreadcrumbClick = (path: string) => {
    setLoadingTarget(path);
    setTimeout(() => {
      navigate(path);
    }, 800);
  };

  const handleApplyReward = async (code: string) => {
    const metadata = {
      page: "http://localhost:3000/booking/confirm/" + sessionId,
      actionId: "apply reward code",
      params: { code },
      extra: {},
    };

    try {
      const response = await axiosInstance.post(
        "/api/reward/reward-code-used",
        { code },
        {
          params: {
            type: "action",
            action: "user applying reward code",
            metadata: JSON.stringify(metadata),
          },
        },
      );
      if (response.data?.success) {
        setAppliedReward({ code, discount: response?.data?.discount });
        return {
          success: true,
          discount: response?.data?.discount,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.error,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.error ||
          "Something went wrong applying reward code",
      };
    }
  };

  const handleRemoveReward = async (code: string) => {
     const metadata = {
       page: "http://localhost:3000/checkout",
       actionId: "remove reward code",
       params: { code },
       extra: {},
     };

    try {
      const response = await axiosInstance.post(
        "/api/reward/remove-reward-code",
        { code },
        {
          params: {
            type: "action",
            action: "user removing reward code",
            metadata: JSON.stringify(metadata),
          },
        },
      );
      if (response.data?.success) {
        setAppliedReward(null);
        showToast("info", `Reward ${code} removed!`);
      }
    } catch (error: any) {
      showToast("error", error?.response?.data?.error);
    }
  };

  const handleHomeClick = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/");
      setLoading(false);
      localStorage.removeItem("searchParams");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-tr from-blue-100 via-white to-blue-50">
      {/* Breadcrumb */}
      <Breadcrumb className="absolute z-1 px-8 pt-2">
        <BreadcrumbList>
          {/* Home with Alert Dialog */}
          <BreadcrumbItem>
            {!isLoggedIn ? (
              <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogTrigger asChild>
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenDialog(true);
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
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      If you go back to Home, your current booking session will
                      be deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        setOpenDialog(false);
                        await handleDeleteBookingSession(
                          bookingSession.sessionId,
                        );
                        handleBreadcrumbClick("/");
                      }}
                    >
                      Yes, Back to Home
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <BreadcrumbLink
                href="#"
                onClick={handleHomeClick}
                className="flex items-center text-blue-600 transition-colors hover:text-blue-800"
              >
                <Home className="mr-2 h-4 w-4" />
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  "Home"
                )}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          {/* Filter Room */}
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/filter-room?${new URLSearchParams(parse as any).toString()}`}
              className="flex items-center text-blue-600 transition-colors hover:text-blue-800"
            >
              Room Selection
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          {/* Checkout (current) */}
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="font-medium text-blue-800">
              Checkout
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      ) : bookingSession &&
        rooms.some((room) =>
          Array.isArray(bookingSession.roomId)
            ? bookingSession.roomId.includes(room._id)
            : bookingSession.roomId === room._id,
        ) ? (
        <div className="relative flex flex-1 flex-col md:flex-row">
          <BookingDetails
            bookingSession={bookingSession}
            rooms={rooms}
            onToggleBreakfast={handleToggleBreakfast}
            onApplyReward={handleApplyReward}
            onRemoveReward={handleRemoveReward}
            appliedReward={appliedReward}
          />
          <PaymentSummary
            checkInDate={formatDateInBookingCheckOut(
              bookingSession.checkInDate,
            )}
            checkOutDate={formatDateInBookingCheckOut(
              bookingSession.checkOutDate,
            )}
            roomId={bookingSession.roomId}
            breakfastIncluded={bookingSession?.breakfastIncluded}
            appliedReward={appliedReward}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="my-auto flex flex-col items-center justify-center px-4 py-12 text-center"
        >
          <div className="relative w-full max-w-md">
            {/* Background effect */}
            <div className="absolute -inset-2 rounded-3xl bg-blue-50/40 blur-xl" />

            {/* Main card */}
            <div className="relative rounded-2xl border border-blue-100 bg-white/95 p-8 shadow-lg backdrop-blur-lg transition-shadow duration-300 hover:shadow-xl">
              {/* Animated icon */}
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="mb-6 inline-flex rounded-full bg-gradient-to-br from-blue-100 to-blue-50 p-4"
              >
                <FileSearch2 className="h-12 w-12 text-blue-400/90" />
              </motion.div>

              {/* Content */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-blue-600/90">
                  No Booking Room Found
                </h2>
                <p className="text-lg leading-relaxed text-blue-500/80">
                  We couldn't find any booking rooms.
                  <br />
                  Start by creating a new reservation parameters.
                </p>
              </div>

              {/* Animated decorative dots */}
              <div className="mt-6 flex justify-center space-x-2">
                <Button
                  onClick={() => navigate("/")}
                  className="cursor-pointer border-2 border-blue-500 bg-gray-50 text-black hover:bg-blue-100"
                >
                  Back to Home
                </Button>
                <Button onClick={() => navigate(-1)} className="cursor-pointer">
                  Back to Previous Page
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BookingCheckOutPage;
