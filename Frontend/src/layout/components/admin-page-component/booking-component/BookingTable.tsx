import { useState } from "react";
import useBookingStore from "@/stores/useBookingStore";
import formatCurrency from "@/utils/formatCurrency";
import { ActionButton } from "../../share-components/ActionButton";
import useToast from "@/hooks/useToast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { ClipboardList, Clock, Loader2, Mail, User, UserRoundCog } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/lib/axios";
import { Room } from "@/types/interface.type";
import { ROLE } from "@/constant/roleList";

const BookingTable = () => {
    const { bookings, isLoading, error, updateBookingStatus, removeBooking } = useBookingStore((state) => state);
    const [ status, setStatus ] = useState<{[key: string]: string}>({});
    const [ loading, setLoading ] = useState<boolean>(false);
    const { showToast } = useToast();
    const handleStatusChange = (bookingId: string, newStatus: string) => {
      setStatus((prev) => ({...prev, [bookingId]: newStatus}))
    }

    const handleEdit = async (bookingId: string) => {
      const updateStatus = status[bookingId];
      setLoading(true)
      try {

        const response = await axiosInstance.patch(
          "/api/admin/update-booking/" + bookingId, { status: updateStatus }
        );

        if(response?.data){
          showToast("success", response?.data?.message)
          updateBookingStatus(bookingId, updateStatus as "confirmed" | "pending" | "cancelled" | "completed")
        }
        
      } catch (error: any) {
        const message =
          error?.response?.data?.error || error?.response?.data?.message;
        if(message.includes("Access Denied")){
          showToast("warn", error?.response?.data?.message)
          return;
        }

        showToast("error", error?.response?.data?.error)
      }finally{
        setLoading(false)
      }
    };
  
    const handleDelete = async (bookingId: string) => {
       setLoading(true)
       try {
          const response = await axiosInstance.delete('/api/admin/delete-booking/' + bookingId);
          if(response?.data){
            showToast("success", response?.data?.message)
            removeBooking(bookingId);
          }

       } catch (error: any) {
        const message = error?.response?.data?.error || error?.response?.data?.message;
        if (message.includes("Access denied")) {
          showToast("warn", error?.response?.data?.message);
          return;
        }

        showToast("error", error?.response?.data?.error);
       }
    };

    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
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
  
    return (
      <div className="overflow-x-auto">
        <Table className="w-full table-auto overflow-hidden rounded-lg border border-zinc-200 text-sm text-zinc-700">
          <TableHeader className="sticky top-0 z-10 bg-blue-100 text-xs tracking-wider text-zinc-700 uppercase">
            <TableRow>
              <TableHead className="min-w-[80px] text-center">Index</TableHead>
              <TableHead className="min-w-[10px]">Fullname</TableHead>
              <TableHead className="min-w-[180px] text-center">
                Booking Reference
              </TableHead>
              <TableHead className="min-w-[200px] text-center">Email</TableHead>
              <TableHead className="min-w-[150px]">Check In Date</TableHead>
              <TableHead className="min-w-[150px]">Check Out Date</TableHead>
              <TableHead className="min-w-[120px]">User Type</TableHead>
              <TableHead className="min-w-[180px]">Room Type</TableHead>
              <TableHead className="min-w-[100px]">Total Price</TableHead>
              <TableHead className="min-w-[140px]">Payment Method</TableHead>
              <TableHead className="min-w-[120px]">Payment Status</TableHead>
              <TableHead className="min-w-[120px] text-center">
                Status
              </TableHead>
              <TableHead className="min-w-[120px] text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...bookings]
              .sort((a, b) => {
                // Sort by userType first
                const aIsUser = a.userType === "user" ? -1 : 1;
                const bIsUser = b.userType === "user" ? -1 : 1;
                if (aIsUser !== bIsUser) return aIsUser - bIsUser;

                // If userTypes are equal, sort by createdAt (newest first)
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              })

              .map((booking, index) => (
                <TableRow
                  key={booking._id}
                  className={`transition-colors duration-200 hover:bg-blue-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50/50"
                  } border-b border-zinc-200`}
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700">
                      <User className="h-4 w-4 text-blue-400 opacity-60" />
                      {booking?.bookingCreatedByUser?.name ||
                        booking?.contactName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm">
                      <ClipboardList className="h-4 w-4 text-blue-500" />
                      <span className="truncate">
                        {booking?.bookingReference}
                      </span>
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex max-w-[200px] items-center gap-1 truncate text-zinc-700">
                      <Mail className="h-4 w-4 shrink-0 text-rose-500 opacity-60" />
                      {booking?.bookingCreatedByUser?.email ||
                        booking?.contactEmail}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700">
                      <Clock className="h-4 w-4 text-blue-500 opacity-60" />
                      {formatDateInBookingCheckOut(booking?.startDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700">
                      <Clock className="h-4 w-4 text-blue-500 opacity-60" />
                      {formatDateInBookingCheckOut(booking?.endDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700 capitalize">
                      <UserRoundCog className="h-4 w-4 text-gray-800 opacity-60" />
                      {booking?.userType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      {Array.isArray(booking?.room) &&
                        booking.room.map((room: Room, index: number) => (
                          <span
                            key={index}
                            className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 capitalize"
                          >
                            {room.roomType}
                          </span>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700 capitalize">
                      {formatCurrency(booking?.totalPrice)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`flex items-center justify-center gap-1 text-center uppercase ${booking?.paymentMethod === "grabpay" ? "text-emerald-500" : booking?.paymentMethod === "fpx" ? "text-blue-700" : "text-zinc-700"}`}
                    >
                      {booking?.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`flex items-center justify-center gap-1 rounded-full px-2 py-1 text-center ${booking?.paymentStatus === "paid" ? "bg-green-300 text-emerald-700" : "bg-sky-200 text-sky-800"} capitalize`}
                    >
                      {booking?.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={status[booking._id] || booking?.status}
                      onValueChange={(value) =>
                        handleStatusChange(booking._id, value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending" className="capitalize">
                          <span className="text-amber-300 capitalize">
                            pending
                          </span>
                        </SelectItem>
                        <SelectItem value="confirmed" className="capitalize">
                          <span className="text-blue-500 capitalize">
                            confirmed
                          </span>
                        </SelectItem>
                        <SelectItem value="cancelled" className="capitalize">
                          <span className="text-rose-500 capitalize">
                            cancelled
                          </span>
                        </SelectItem>
                        <SelectItem value="completed" className="capitalize">
                          <span className="text-emerald-500 capitalize">
                            completed
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right text-blue-500">
                    <ActionButton
                      loading={loading}
                      onEdit={() => handleEdit(booking._id)}
                      editLabel={
                        status[booking._id] &&
                        status[booking._id] !== booking.status
                          ? "Save"
                          : "Edit"
                      }
                      allowedDeleteRoles={[ROLE.SuperAdmin]}
                      onDelete={() => handleDelete(booking._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
}

export default BookingTable;
