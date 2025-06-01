import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import useRoomStore from "@/stores/useRoomStore";
import { Calendar, CalendarCheck, CalendarX, X } from "lucide-react"; // Importing Lucide icons
import "react-day-picker/dist/style.css";

interface DeactivationDialogProps {
  roomId: string | null;
  disableDate: Date | null;
  open: boolean;
  onClose: () => void;
}

const ScheduleDeactivation = ({
  roomId,
  disableDate,
  open,
  onClose,
}: DeactivationDialogProps) => {
  // State for selected date and loading status
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hooks for state management and UI utilities
  const { updateRoomById } = useRoomStore();
  const { showToast } = useToast();

  // Set today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Disabled dates configuration:
  // 1. All dates before today
  // 2. Existing disable date (if any)
  const disabledDates = [
    (date: Date) => date < today,
    ...(disableDate
      ? [
          (date: Date) =>
            date.getTime() <= new Date(disableDate).setHours(0, 0, 0, 0),
        ]
      : []),
  ];

  // Handle scheduling room deactivation
  const scheduleDeactivation = async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.patch(
        `/api/admin/schedule-deactivation/${roomId}`,
        { date: format(selectedDate, "yyyy-MM-dd") },
      );
      showToast("success", "Deactivation scheduled successfully");
      updateRoomById(response.data);
      onClose();
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancellation of scheduled deactivation
  const cancelDeactivation = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.patch(
        `/api/admin/schedule-deactivation/${roomId}`,
        { cancel: true },
      );
      showToast("success", "Scheduled deactivation cancelled");
      updateRoomById(response.data);
      onClose();
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle API errors consistently
  const handleApiError = (error: any) => {
    const message =
      error?.response?.data?.error || error?.response?.data?.message;
    if (message?.includes("Access denied")) {
      showToast("warn", message);
    } else {
      showToast("error", message || "Something went wrong");
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-blue-600" /> {/* Calendar icon */}
        <span>Reschedule Room Availability</span>
      </DialogTitle>

      <DialogContent className="max-w-lg">
        <div className="mb-4">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-bold">
            <CalendarCheck className="h-5 w-5 text-orange-500" />{" "}
            {/* Schedule icon */}
            Schedule Room Deactivation
          </h2>
          <p className="text-muted-foreground text-sm">
            Pick a future date to temporarily disable this room from being
            booked.
          </p>
        </div>

        {/* Date Picker Component */}
        <div className="flex justify-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            numberOfMonths={1}
            disabled={disabledDates}
            defaultMonth={today}
            classNames={{
              months:
                "flex gap-6 bg-white/95 p-3 rounded-2xl shadow-xl border-2 border-blue-100 backdrop-blur-sm",
              caption: "flex justify-center items-center py-2 relative",
              caption_label: "text-center font-bold text-blue-600/90",
              table: "w-full border-collapse",
              head_row: "text-blue-500/80",
              head_cell: "text-sm font-semibold text-center py-2.5",
              row: "text-center",
              cell: "p-1",
              day: "mx-auto h-10 w-10 rounded-full font-medium transition-colors hover:bg-blue-100/60",
              day_selected: "!bg-blue-600/90 text-white font-semibold",
              day_today: "border-2 border-blue-400/50",
              day_disabled: "text-gray-300 hover:bg-transparent",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col justify-between gap-2 sm:flex-row">
          <Button
            onClick={scheduleDeactivation}
            disabled={!selectedDate || isLoading}
            className="w-full cursor-pointer sm:w-auto"
          >
            <CalendarCheck className="mr-2 h-4 w-4" /> {/* Confirm icon */}
            {isLoading ? "Scheduling..." : "Confirm Deactivation"}
          </Button>

          {disableDate && (
            <Button
              variant="destructive"
              onClick={cancelDeactivation}
              disabled={isLoading}
              className="w-full cursor-pointer sm:w-auto"
            >
              <CalendarX className="mr-2 h-4 w-4" /> {/* Cancel icon */}
              {isLoading ? "Cancelling..." : "Cancel Scheduled"}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full border-gray-300 sm:w-auto cursor-pointer"
          >
            <X className="mr-2 h-4 w-4" /> {/* Close icon */}
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDeactivation;
