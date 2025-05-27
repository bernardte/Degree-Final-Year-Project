import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useBookingStore from "@/stores/useBookingStore";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { motion } from "framer-motion";
import { ClipboardList, Clock, Mail, User2 } from "lucide-react";

const AcceptCancellationBookingTable = () => {
  const { isLoading, error, acceptCancelledBookingsRequest } = useBookingStore();
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
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
              Processed Date
            </TableHead>
            <TableHead className="min-w-[70px] text-center">Avatar</TableHead>
            <TableHead className="min-w-[80px]">Process By</TableHead>
            <TableHead className="min-w-[50px] text-center">Role</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(acceptCancelledBookingsRequest) &&
          acceptCancelledBookingsRequest.length > 0 ? (
            acceptCancelledBookingsRequest.map((booking, index) => (
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
                    <Clock className="h-4 w-4 text-blue-500" />
                    {formatDateInBookingCheckOut(booking?.processedAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <img
                    src={booking?.processedBy?.profilePic}
                    alt={booking?.processedBy?.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>
                  <span className="rounded-fulltext-sm inline-flex items-center gap-2 font-semibold">
                    <User2 className="h-4 w-4 text-blue-500" />
                    {booking?.processedBy?.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-fulltext-sm inline-flex items-center gap-2 font-semibold ${booking?.processedBy?.role === "superAdmin" ? "text-rose-500" : "text-blue-500"}`}
                  >
                    {booking?.processedBy?.role === "superAdmin"
                      ? "Super Admin"
                      : booking?.processedBy?.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`flex items-center justify-center rounded-sm px-3 py-1 text-sm font-semibold capitalize ${
                      booking?.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking?.status}
                  </span>
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

export default AcceptCancellationBookingTable;
