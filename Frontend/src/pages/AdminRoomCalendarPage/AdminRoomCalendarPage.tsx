import { useEffect } from "react";
import RoomCalendarView from "@/layout/components/calendar/RoomCalendarView";
import useRoomStore from "@/stores/useRoomStore";

const AdminRoomCalendarPage = () => {
  const { rooms, fetchRoomCalendarView, isLoading, error } = useRoomStore(
    (state) => state,
  );

  useEffect(() => {
    fetchRoomCalendarView();
  }, [fetchRoomCalendarView]);

  // Only show deactivation events (since API returns only rooms with scheduled deactivations)
  const roomEvents = rooms.map((room) => ({
    id: `deactivation-${room._id}`,
    title: `${room.roomNumber} - Scheduled Maintenance`,
    start: room.scheduledDeactivationDate,
    allDay: true,
    backgroundColor: "#DC2626", // Red color
    textColor: "white",
    extendedProps: {
      roomNumber: room.roomNumber,
      roomName: room.roomName,
      roomType: room.roomType,
      status: "deactivated",
    },
  }));

  return (
    <div className="p-4">
      <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
        Room Deactivation Calendar
      </h1>
      <RoomCalendarView
        events={roomEvents}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default AdminRoomCalendarPage;
