import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useBookingStore from "@/stores/useBookingStore";
import formatCurrency from "@/utils/formatCurrency";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { Clock, Mail, User, UserRoundCog } from "lucide-react";
import ActionButton from "../../share-components/ActionButton";

const BookingTable = () => {
    const { bookings } = useBookingStore((state) => state);

    const handleEdit = async () => {
      throw new Error("Function not implemented.");
    };
  
    const handleDelete = async () => {
      throw new Error("Function not implemented.");
    };
  
    return (
      <div className="overflow-x-auto">
        <Table className="w-full table-auto border border-zinc-200 text-sm text-zinc-700">
          <TableHeader className="sticky top-0 z-10 bg-blue-100 text-xs tracking-wider text-zinc-700 uppercase">
            <TableRow>
              <TableHead className="min-w-[160px]">Fullname</TableHead>
              <TableHead className="min-w-[180px]">Booking Reference</TableHead>
              <TableHead className="min-w-[200px]">Email</TableHead>
              <TableHead className="min-w-[150px]">Check In</TableHead>
              <TableHead className="min-w-[150px]">Check Out</TableHead>
              <TableHead className="min-w-[120px]">User Type</TableHead>
              <TableHead className="min-w-[180px]">Room Type</TableHead>
              <TableHead className="min-w-[100px]">Total Price</TableHead>
              <TableHead className="min-w-[140px]">Payment Method</TableHead>
              <TableHead className="min-w-[120px]">Payment Status</TableHead>
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
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700">
                      <User className="h-4 w-4 text-blue-400 opacity-60" />
                      {booking?.bookingCreatedByUser?.name ||
                        booking?.contactName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700">
                      {booking?.bookingReference}
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
                    <span className="inline-flex items-center gap-2 truncate text-wrap text-zinc-700 capitalize">
                      {booking?.room?.map((room) => room.roomType).join(", ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-700 capitalize">
                      {formatCurrency(booking?.totalPrice)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-center text-zinc-700 uppercase">
                      {booking?.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-center text-zinc-700 capitalize">
                      {booking?.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-blue-500">
                   <ActionButton onEdit={() => handleEdit()} onDelete={() => handleDelete}/>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
}

export default BookingTable;
