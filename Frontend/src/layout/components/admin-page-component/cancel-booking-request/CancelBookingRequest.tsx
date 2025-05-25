import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { ActionButtonWithAcceptDecline } from "../../share-components/ActionButton";
import useBookingStore from "@/stores/useBookingStore";
import { useState } from "react";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import useStatisticStore from "@/stores/useStatisticStore";
import { ClipboardList, Clock, Mail } from "lucide-react";
import { motion } from "framer-motion";

const CancelBookingRequest = () => {
    const { cancelledBookings, updateBookingStatus, updateCancelBookingRequest, isLoading: isTableLoading, error } = useBookingStore();
    const { updateRefundBooking } = useStatisticStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { showToast } = useToast();

    async function handleAccepted(
      requestId: string,
      status: string,
      checkInDate: string,
    ): Promise<void> {
      setIsLoading(true);
      console.log("status", status);
      try {
        const response = await axiosInstance.patch(
          "/api/admin/update-cancellation-request/" + requestId,
          { status },
        );

        if (response?.data) {
          showToast("success", response?.data?.message);

          const today = new Date();
          const checkIn = new Date(checkInDate);
          const isToday = today.toDateString() === checkIn.toDateString();

          // Override status/paymentStatus if check-in is today
          const finalStatus =
            status === "approved" && isToday ? "confirmed" : "cancelled";
          const finalPaymentStatus =
            status === "approved" && isToday ? "paid" : "refund";

          updateBookingStatus(
            response?.data?.bookingId,
            finalStatus,
            finalPaymentStatus,
          );

          updateCancelBookingRequest(response?.data?.bookingId);
          updateRefundBooking(response?.data?.refund);
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.error || error?.response?.data?.message;

        if (message.includes("Access denied")) {
          showToast("warn", error?.response?.data?.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    

    async function handleDeclined(_id: string): Promise<void> {
        setIsLoading(true);
        try {
            const response = await axiosInstance.delete(
                "/api/admin/delete-cancellation-request/" + _id
            );
            if (response?.data) {
                showToast("success", response?.data?.message);
            }
        } catch (error: any) {
            const message =
                error?.response?.data?.error || error?.response?.data?.message;
            if (message.includes("Access denied")) {
                showToast("warn", error?.response?.data?.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    if(error){
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (isTableLoading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-full items-center justify-center space-x-4"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-blue-400"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      );
    }
    return (
      <div className="overflow-x-auto">
        <Table className="w-full table-auto border border-zinc-200 text-sm text-zinc-700">
          <TableHeader className="sticky top-0 z-10 bg-blue-100 text-xs tracking-wider text-zinc-700 uppercase">
            <TableRow>
              <TableHead className="text-center">Index</TableHead>
              <TableHead className="min-w-[160px] pl-7 text-center">
                booking Reference
              </TableHead>
              <TableHead className="min-w-[160px] text-center">email</TableHead>
              <TableHead className="min-w-[160px] text-center">
                Request Date
              </TableHead>
              <TableHead className="min-w-[160px] text-center">
                Check-in Date
              </TableHead>
              <TableHead className="pl-5 text-center">Status</TableHead>
              <TableHead className="min-w-[140px] text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(cancelledBookings) &&
            cancelledBookings.length > 0 ? (
              cancelledBookings.map((booking, index) => (
                <TableRow
                  key={booking._id}
                  className={`transition-colors duration-200 hover:bg-blue-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50/50"
                  } border-b border-zinc-200`}
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm">
                      <ClipboardList className="h-4 w-4 text-blue-500" />
                      <span className="truncate">
                        {booking?.bookingReference}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-fulltext-sm inline-flex items-center gap-2 font-semibold">
                      <Mail className="h-4 w-4 text-rose-500" />
                      {booking?.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center justify-center gap-2 rounded-full text-sm font-semibold">
                      <Clock className="h-4 w-4 text-blue-500" />
                      {formatDateInBookingCheckOut(booking?.requestedAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center justify-center gap-2 rounded-full text-sm font-semibold">
                      {new Date(booking?.checkInDate).toDateString() !==
                      new Date().toDateString() ? (
                        <>
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-emerald-500">
                            {formatDateInBookingCheckOut(booking?.checkInDate)}
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-rose-500" />
                          <span className="text-rose-500 capitalize">
                            today
                          </span>
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`flex items-center gap-1 pl-8 text-center ${
                        booking?.status === "pending"
                          ? "text-amber-300"
                          : booking?.status === "approved"
                            ? "text-emerald-500"
                            : "text-rose-500"
                      }`}
                    >
                      {booking?.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-blue-500">
                    <ActionButtonWithAcceptDecline
                      loading={isLoading}
                      handleAccept={() =>
                        handleAccepted(
                          booking._id,
                          "approved",
                          formatDateInBookingCheckOut(booking?.checkInDate),
                        )
                      }
                      handleDecline={() => handleDeclined(booking._id)}
                      currentStatus={
                        (booking?.status === "approved"
                          ? "Accept"
                          : booking?.status === "decline"
                            ? "Decline"
                            : null) as "approved" | "decline" | null
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No cancelled bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="pointer-events-none absolute h-5 w-5 rounded-full bg-blue-400/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${7 + Math.random() * 3}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
    );
};

export default CancelBookingRequest;
