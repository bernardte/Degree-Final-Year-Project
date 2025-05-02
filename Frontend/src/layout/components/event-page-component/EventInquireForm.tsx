import { DayPicker } from "react-day-picker";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { 
    Select, 
    SelectContent,  
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import "react-day-picker/dist/style.css";
import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import { formatDate } from "@/utils/formatDate";

  const  EventInquireForm = ({ title }: { title: string }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const isSmallScreen = useIsSmallScreen();

  return (
    <section className="flex py-12">
      <div className="mx-auto max-w-3xl px-4">
        <form className="space-y-6 rounded-3xl border border-blue-400 bg-gray-100/40 p-10 shadow-xl">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-600">
            {title}
          </h2>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border p-3"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border p-3"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full rounded-xl border p-3"
          />
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wedding">wedding</SelectItem>
              <SelectItem value="party">party</SelectItem>
              <SelectItem value="meeting">meeting</SelectItem>
            </SelectContent>
          </Select>
          <div
            className="relative flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 px-4 py-2 transition hover:border-blue-500"
            onClick={() => setOpenDatePicker(!openDatePicker)}
          >
            <span className="text-md text-gray-400">
              {selectedDate ? formatDate(selectedDate) : "Select Event Date"}
            </span>
            <CalendarDays className="text-gray-500" />
          </div>
          {openDatePicker && (
            <DayPicker
              selected={selectedDate}
              onSelect={setSelectedDate}
              mode="single"
              numberOfMonths={isSmallScreen ? 1 : 2}
              disabled={(day) =>
                day < new Date(new Date().setHours(0, 0, 0, 0))
              }
              defaultMonth={new Date()}
              classNames={{
                months:
                  "sm:flex gap-6 bg-zinc-100 p-4 rounded-xl transition-all duration-200 absolute",
                month: "w-full",
                caption: "text-center font-semibold mb-2",
                table: "w-full border-collapse",
                head_row: "text-gray-500",
                head_cell: "text-xs font-medium text-center py-1",
                row: "text-center",
                cell: "p-1",
                day: "w-10 h-10 rounded-full hover:bg-blue-100 transition",
                day_selected: "bg-blue-600 text-white",
                day_today: "border border-blue-500",
                day_range_middle: "bg-blue-100",
                day_range_start: "bg-blue-600 text-white",
                day_range_end: "bg-blue-600 text-white",
              }}
            />
          )}
          <textarea
            placeholder="Additional Info"
            className="w-full rounded-xl border p-3"
            rows={4}
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 text-white transition hover:bg-blue-700"
          >
            Book Now
          </button>
        </form>
      </div>
    </section>
  );
}

export default EventInquireForm;
