import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionButton } from "../../share-components/ActionButton";
import { DoorClosed, Loader2, Wallet } from "lucide-react";
import formatCurrency from "@/utils/formatCurrency";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import { Room } from "@/types/interface.type";
import useRoomStore from "@/stores/useRoomStore";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import EditRoomDialog from "../dialog-component/EditRoomDialog";
import getImageSrc from "@/utils/getImageSrc";
import { Switch } from "@/components/ui/switch";
import ScheduleDeactivation from "../dialog-component/ScheduleDeactivation";

const RoomTable = ({
  isLoading,
  error,
  rooms,
}: {
  isLoading: boolean;
  error: string | null;
  rooms: Room[];
}) => {
  const { showToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showResheduleDialog, setResheduleDialog] = useState<boolean>(false);
  const [rescheduleRoomId, setResheduleRoomId] = useState<string | null>(null);
  const [availableDateSchedule, setAvailableDateSchedule] = useState<Date | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  console.log(rooms);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load booking. Please try again later.
      </div>
    );
  }

  const handleDelete = async (roomId: string, room: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        "/api/admin/delete-room/" + roomId,
      );
      if (response?.data) {
        showToast("success", `${room} Delete Successfully`);
        useRoomStore.getState().removeRoomById(roomId);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error || error?.response?.data?.message;
      if (message.includes("Access denied")) {
        showToast("warn", error?.response?.data?.message);
      }
      showToast("error", error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handelEditClick = (roomId: string) => {
    const room = rooms.find((room) => room._id === roomId);
    console.log("selected room: ", room);
    if (room) {
      setIsEditModalOpen(true);
      setSelectedRoom(room);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    try {
      setEditLoading(true);
      const formData = new FormData();

      formData.append("roomNumber", selectedRoom.roomNumber);
      formData.append("roomType", selectedRoom.roomType);
      formData.append("description", selectedRoom.description);
      formData.append("pricePerNight", selectedRoom.pricePerNight.toString());
      formData.append("roomDetails", selectedRoom.roomDetails);

      selectedRoom.amenities.forEach((amenity: string) =>
        formData.append("amenities", amenity),
      );
      formData.append(
        "capacity[adults]",
        selectedRoom.capacity.adults.toString(),
      );
      formData.append(
        "capacity[children]",
        (selectedRoom.capacity.children ?? 0).toString(),
      );

      // ✅ Append only File-type cover image (usually first one)
      // Append images if it's a File or array of Files
      if (selectedRoom.images) {
        if (Array.isArray(selectedRoom.images)) {
          selectedRoom.images.forEach((file: string | File) => {
            formData.append("images", file);
          });
        }
      }

      // ✅ Append gallery images (File only)
      galleryImages.forEach((file: File) => {
        formData.append("galleryImages", file);
      });

      const response = await axiosInstance.put(
        `/api/admin/update-room/${selectedRoom._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data) {
        showToast("success", "Room updated successfully");
        // remove local state
        setGalleryImages([]);
        useRoomStore.getState().updateRoomById(selectedRoom._id, response.data);
        setSelectedRoom(response.data); // update modal view
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error.message;
      showToast("error", message);
    } finally {
      setIsEditModalOpen(false);
      setEditLoading(false);
    }
  };
      
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSelectedRoom((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleRoomStatus = async (roomId: string, roomStatus: boolean) => {
    try {
      const response = await axiosInstance.patch(
        `/api/admin/update-room-status/${roomId}`,
        { isActivate: !roomStatus },
      );
      if (response?.data) {
        showToast("success", `${response?.data?.roomName} status ${response?.data?.isActivate === true ? " activate " : " deactivate "} successfully`);
        useRoomStore
          .getState()
          .updateRoomById(roomId, response?.data);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error || error?.response?.data?.message;
      if (message.includes("Access denied")) {
        showToast("warn", error?.response?.data?.message);
        return;
      }else if(message.includes("deactivate")){
        showToast("info", error?.response?.data?.message);
        setResheduleDialog(true);
        setAvailableDateSchedule(error?.response?.data?.nextAvailableDeactivationDate);
        setResheduleRoomId(roomId);
        return;
      }
      showToast("error", error?.response?.data?.error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="w-full table-auto border border-zinc-200 text-sm text-zinc-700">
        <TableHeader className="sticky top-0 z-10 bg-blue-100 text-xs tracking-wider text-zinc-700 uppercase">
          <TableRow>
            <TableHead className="text-center">Index</TableHead>
            <TableHead className="min-w-[160px] text-center">
              Room Image
            </TableHead>
            <TableHead className="min-w-[160px] pl-7">Room</TableHead>
            <TableHead className="min-w-[160px]">Room Type</TableHead>
            <TableHead className="min-w-[160px]">Room Capacity</TableHead>
            <TableHead className="min-w-[160px]">Room Amenities</TableHead>
            <TableHead className="min-w-[160px]">Room Details</TableHead>
            <TableHead className="min-w-[120px] text-center">
              Room Price
            </TableHead>
            <TableHead className="min-w-[160px]">Room Number</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[120px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room, index) => (
            <TableRow
              key={room._id}
              className={`transition-colors duration-200 hover:bg-blue-50 ${
                index % 2 === 0 ? "bg-white" : "bg-blue-50/50"
              } border-b border-zinc-200`}
            >
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <img
                  src={getImageSrc(room?.images)}
                  alt={room?.roomType}
                  className="h-[120px] w-[150px] object-cover"
                />
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-700">
                  {/* <User className="h-4 w-4 text-blue-400 opacity-60" /> */}
                  {room?.roomName}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 pl-2 text-zinc-700 capitalize">
                  {room?.roomType}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex max-w-[200px] flex-wrap items-center gap-2 text-sm text-zinc-700">
                  {room?.capacity?.adults !== undefined && (
                    <span className="text-md inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-600">
                      Adults: {room.capacity.adults}
                    </span>
                  )}
                  {room?.capacity?.children !== undefined && (
                    <span className="text-md inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-600">
                      Children: {room.capacity.children}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(room?.amenities) &&
                    room.amenities.map((amenity: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600"
                      >
                        {amenity}
                      </span>
                    ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-700">
                  {room?.description?.split(" | ").map((item, index) => {
                    // Assign icon based on content
                    let icon = "";
                    if (/bed/i.test(item)) icon = "🛏️";
                    else if (/adult|child/i.test(item)) icon = "👨‍👩‍👧‍👦";
                    else if (/m²/i.test(item)) icon = "📐";

                    // Choose color based on index or keyword
                    const bgColor =
                      [
                        "bg-indigo-50 text-indigo-600",
                        "bg-blue-50 text-blue-600",
                        "bg-green-50 text-green-600",
                      ][index] || "bg-zinc-100 text-zinc-700";

                    return (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${bgColor}`}
                      >
                        {icon}
                        {item}
                      </span>
                    );
                  })}
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 shadow-sm">
                  <Wallet className="h-4 w-4 text-green-500" />
                  {formatCurrency(room?.pricePerNight)} / night
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="relative inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 shadow-sm">
                    <DoorClosed className="mr-2 h-4 w-4 text-blue-500" />
                    Room {room?.roomNumber}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Switch
                    checked={room?.isActivate}
                    onCheckedChange={() =>
                      handleRoomStatus(room._id, room?.isActivate)
                    }
                  />
                </div>
              </TableCell>
              <TableCell className="text-right text-blue-500">
                <ActionButton
                  loading={loading}
                  onDelete={() => handleDelete(room._id, room.roomName)}
                  onEdit={() => handelEditClick(room._id)}
                />
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
      <AnimatePresence>
        {isEditModalOpen && (
          <EditRoomDialog
            handleEdit={handleEdit}
            handleEditChange={handleEditChange}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            editLoading={editLoading}
            galleryImages={galleryImages}
            setGalleryImages={setGalleryImages}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showResheduleDialog && (
          <ScheduleDeactivation
            onClose={() => setResheduleDialog(!showResheduleDialog)}
            disableDate={availableDateSchedule}
            roomId={rescheduleRoomId}
            open={showResheduleDialog}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomTable;
