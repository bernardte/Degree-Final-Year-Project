import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ActionButton from "../../share-components/ActionButton";
import { Loader2 } from "lucide-react";
import formatCurrency from "@/utils/formatCurrency";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import { Room } from "@/types/interface.type";
import useRoomStore from "@/stores/useRoomStore";

const RoomTable = ({ isLoading, error, rooms }: { isLoading: boolean, error: string | null, rooms: Room[]}) => {

    const { showToast } = useToast();

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
        try {
            const response = await axiosInstance.delete("/api/admin/delete-room/" + roomId);
            if (response?.data) {
                showToast("success", `${room} Delete Successfully`);
                useRoomStore.getState().removeRoomById(roomId);
            }
        } catch (error: any) {
            const message = error?.response?.data?.error || error?.response?.data?.message;
            if(message.includes("Access denied")){
                showToast("warn", error?.response?.data?.message);
            }
            showToast("error", error?.response?.data?.error);
        }
    }

    return (
        <div className="overflow-x-auto">
        <Table className="w-full table-auto border border-zinc-200 text-sm text-zinc-700">
            <TableHeader className="sticky top-0 z-10 bg-blue-100 text-xs tracking-wider text-zinc-700 uppercase">
            <TableRow>
                <TableHead className="text-center">Index</TableHead>
                <TableHead className="text-center min-w-[160px]">Room Image</TableHead>
                <TableHead className="min-w-[160px] pl-7">Room</TableHead>
                <TableHead className="min-w-[160px]">Room Type</TableHead>
                <TableHead className="text-center min-w-[160px]">Room Capacity</TableHead>
                <TableHead className="min-w-[160px] pl-10">Room Amenities</TableHead>
                <TableHead className="min-w-[160px] pl-10">Room Size</TableHead>
                <TableHead className="min-w-[160px]">Room Price</TableHead>
                <TableHead className="min-w-[160px]">Room Number</TableHead>
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
                    <img src={room?.images} alt={room?.roomType} />
                </TableCell>
                <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700">
                    {/* <User className="h-4 w-4 text-blue-400 opacity-60" /> */}
                    {room?.roomName}
                    </span>
                </TableCell>
                <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700 capitalize pl-2">
                    {room?.roomType}
                    </span>
                </TableCell>
                <TableCell>
                    <span className="inline-flex max-w-[200px] items-center gap-1 truncate text-zinc-700">
                    {/* <Mail className="h-4 w-4 shrink-0 text-rose-500 opacity-60" /> */}
                    {room?.capacity
                        ? `Adults: ${room.capacity.adults}${room.capacity.children !== undefined ? `, Children: ${room.capacity.children}` : ""}`
                        : ""}
                    </span>
                </TableCell>
                <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700 break-words">
                    {/* <Clock className="h-4 w-4 text-blue-500 opacity-60" /> */}
                    {Array.isArray(room?.amenities)
                        ? room.amenities.join(", ")
                        : ""}
                    </span>
                </TableCell>
                <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700">
                    {/* <Clock className="h-4 w-4 text-blue-500 opacity-60" /> */}
                    {room?.description}
                    </span>
                </TableCell>
                <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700 capitalize">
                    {formatCurrency(room?.pricePerNight)}
                    </span>
                </TableCell>
                <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700 pl-10">
                    {/* <Clock className="h-4 w-4 text-blue-500 opacity-60" /> */}
                    {room?.roomNumber}
                    </span>
                </TableCell>
                <TableCell className="text-right text-blue-500">
                    <ActionButton
                        // onEdit={() => handleEdit(room._id)}
                        // editLabel={
                        //   status[room._id] &&
                        //   status[room._id] !== room.status
                        //     ? "Save"
                        //     : "Edit"
                        // }

                        onDelete={() => handleDelete(room._id, room.roomName)}
                    />
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>
    );
};

export default RoomTable;
