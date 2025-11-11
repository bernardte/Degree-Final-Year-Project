import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Event } from "@/types/interface.type";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { formatMalaysianPhoneNumber } from "@/utils/formatPhoneNumber";
import { Clock, Loader2, Mail } from "lucide-react";
import { ActionButtonWithAcceptDecline } from "../../share-components/ActionButton";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import useEventsStore from "@/stores/useEventsStore";
import { useState } from "react";

const EventTable = ({
  events,
  isLoading,
  error,
}: {
  events: Event[];
  isLoading: boolean;
  error: string | null;
}) => {
  const { showToast } = useToast();
  const { updateEventsStatus } = useEventsStore();
  const [loading, setLoading] = useState<boolean>(false);
  if (isLoading) {
    return (
      <div>
        <Loader2 className="animate-spin text-center text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-rose-500">An unexcepted error occur</div>
    );
  }

  const handleAccept = async (eventId: string): Promise<void> => {
    setLoading(true)
    try {
      const response = await axiosInstance.patch(
        "/api/admin/update-event-status/" + eventId,
        {
          status: "Accept",
        },
      );
      if (response?.data) {
        showToast("success", response?.data?.message);
        updateEventsStatus(eventId, "Accept");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error || error?.response?.data?.message;

      if (message.includes("Access denied")) {
        showToast("warn", error?.response?.data?.message);
      }
      showToast("error", error?.response?.data?.error);
    }finally  {
      setLoading(false)
    }
  };

  const handleDecline = async (eventId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        "/api/admin/delete-event-status/" + eventId,
      );

      if (response?.data) {
        showToast("success", response?.data?.message);
        console.log("eventID: ", eventId);
        updateEventsStatus(eventId, "Decline");
      }

    } catch (error: any) {
      const message =
        error?.response?.data?.error || error?.response?.data?.message;

      if (message.includes("Access denied")) {
        showToast("warn", error?.response?.data?.message);
      }
      showToast("error", error?.response?.data?.error);
    }finally{
      setLoading(false)
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <Table className="w-full table-auto border border-zinc-200 text-sm text-zinc-700">
        <TableHeader className="sticky top-0 z-10 bg-blue-100 text-xs tracking-wider text-zinc-700 uppercase">
          <TableRow>
            <TableHead className="text-center">Index</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>full name</TableHead>
            <TableHead className="pl-7">email</TableHead>
            <TableHead>Total Guests</TableHead>
            <TableHead>phone number</TableHead>
            <TableHead>Event Date</TableHead>
            <TableHead>Additional Info</TableHead>
            <TableHead className="pl-9 text-center">Status</TableHead>
            <TableHead className="min-w-[140px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => (
            <TableRow
              key={event._id}
              className={`transition-colors duration-200 hover:bg-blue-50 ${
                index % 2 === 0 ? "bg-white" : "bg-blue-50/50"
              } border-b border-zinc-200`}
            >
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-700 capitalize">
                  {event?.eventType}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 pl-2 text-zinc-700">
                  {event?.fullname}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 pl-2 text-zinc-700">
                  <Mail className="h-4 w-4 text-rose-400"/>
                  {event?.email}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 pl-8 text-center text-zinc-700">
                  {event?.totalGuests}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-700">
                  {formatMalaysianPhoneNumber(event?.phoneNumber)}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-700 capitalize">
                  <Clock className="h-4 w-4 text-blue-500 opacity-60" />
                  {formatDateInBookingCheckOut(event?.eventDate)}
                </span>
              </TableCell>
              <TableCell>
                <span className="block pl-10 text-sm break-words text-zinc-700">
                  {typeof event?.additionalInfo === "string" &&
                  event.additionalInfo.trim()
                    ? event.additionalInfo
                    : "No additional info"}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1 pl-8 text-center ${
                    event?.status === "pending"
                      ? "text-amber-300"
                      : event?.status === "Accept"
                        ? "text-emerald-500"
                        : "text-rose-500"
                  }`}
                >
                  {event?.status}
                </span>
              </TableCell>

              <TableCell className="text-right text-blue-500 flex justify-center">
                {event?.status && (
                  <ActionButtonWithAcceptDecline
                    loading={loading}
                    handleAccept={() => handleAccept(event._id)}
                    handleDecline={() => handleDecline(event._id)}
                    currentStatus={
                      event?.status === "Accept" || event?.status === "Decline"
                        ? event.status
                        : null
                    }
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
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

export default EventTable;
