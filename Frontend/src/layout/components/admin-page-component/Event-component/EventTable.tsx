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
import { Loader2 } from "lucide-react";

const EventTable = ({
  events,
  isLoading,
  error,
}: {
  events: Event[];
  isLoading: boolean;
  error: string | null;
}) => {
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

  return (
    <div className="overflow-x-auto">
      <Table className="w-full table-auto border border-zinc-200 text-sm text-zinc-700">
        <TableHeader className="sticky top-0 z-10 bg-blue-100 text-xs tracking-wider text-zinc-700 uppercase">
          <TableRow>
            <TableHead className="text-center">Index</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead className="pl-7">email</TableHead>
            <TableHead>phone number</TableHead>
            <TableHead>Event Date</TableHead>
            <TableHead>Additional Info</TableHead>
            <TableHead>Actions</TableHead>
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
                  {/* <User className="h-4 w-4 text-blue-400 opacity-60" /> */}
                  {event?.eventType}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 pl-2 text-zinc-700">
                  {event?.email}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-700">
                  {/* <Clock className="h-4 w-4 text-blue-500 opacity-60" /> */}
                  {formatMalaysianPhoneNumber(event?.phoneNumber)}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-700 capitalize">
                  {formatDateInBookingCheckOut(event?.eventDate)}
                </span>
              </TableCell>
              {event?.additionalInfo && (
                <TableCell>
                  <span className="inline-flex items-center gap-1 pl-10 text-zinc-700"></span>
                </TableCell>
              )}
              <TableCell className="text-right text-blue-500">
                {/* <ActionButton
                  // onEdit={() => handleEdit(room._id)}
                  // editLabel={
                  //   status[room._id] &&
                  //   status[room._id] !== room.status
                  //     ? "Save"
                  //     : "Edit"
                  // }

                  onDelete={() => handleDelete(room._id, room.roomName)}
                /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventTable;
