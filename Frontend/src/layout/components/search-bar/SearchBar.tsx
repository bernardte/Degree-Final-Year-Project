import { useState, useEffect, useRef } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { DayPicker, SelectRangeEventHandler } from "react-day-picker";
import "react-day-picker/dist/style.css";
import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import useRoomStore from "@/stores/useRoomStore";

type DateRange = {
  from: Date;
  to?: Date;
};

const SearchBar = () => {
  const [date, setDate] = useState<{ from?: Date; to?: Date }>({});
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useIsSmallScreen();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setRooms, setSearchParams } = useRoomStore();

  useEffect(() => {
    if (date.from) setCheckIn(formatDate(date.from));
    if (date.to) setCheckOut(formatDate(date.to));
  }, [date]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setOpenDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDaySelect: SelectRangeEventHandler = (range) => {
    const selectedDate = range?.from;
    const checkInDate = date.from;
    const checkOutDate = date.to;

    if (!selectedDate) {
      setDate({});
      setIsSelectingCheckOut(false);
      setCheckIn("");
      setCheckOut("");
      return;
    }

    if (checkInDate && checkOutDate) {
      setDate({ from: undefined, to: undefined });
      setCheckIn("");
      setCheckOut("");
      setIsSelectingCheckOut(false);
      return;
    }

    if (!isSelectingCheckOut) {
      setDate({ from: selectedDate, to: undefined });
      setCheckIn(formatDate(selectedDate));
      setCheckOut("");
      setIsSelectingCheckOut(true);
      return;
    }

    if (range.from && range.to) {
      setDate({ from: range.from, to: range.to });
      setCheckIn(formatDate(range.from));
      setCheckOut(formatDate(range.to));
      setIsSelectingCheckOut(false);
      setTimeout(() => setOpenDatePicker(false), 200);
    }
  };

const handleSearch = async () => {
  if (!checkIn || !checkOut) {
    showToast("error", "Please select both check-in and check-out dates.");
    return;
  }

  setIsLoading(true);
  const payload = {
    checkInDate: checkIn,
    checkOutDate: checkOut,
    adults: adults,
    children: children,
  };

  const params = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    params.append(key, String(value));
  });


  try {
    // Store params globally
    setSearchParams(payload);
    localStorage.setItem("searchParams", JSON.stringify(payload));

    // Call initial search just to populate some rooms
    const response = await axiosInstance.get("/api/rooms/filter", {
      params: payload,
    });
    const data = response.data;
    if (data.error) {
      showToast("error", data.error);
    } else {
      console.log("params: ", params.toString());
      setRooms(data);
      navigate(`/filter-room?${params.toString()}`);
    }
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.error || "Something went wrong.";
    showToast("error", errorMessage);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-lg">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-5 md:items-end">
        {/* Date Picker */}
        <div className="relative col-span-2" ref={calendarRef}>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Check-in / Check-out
          </label>
          <div
            className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 px-4 py-2 shadow-md transition hover:border-blue-500"
            onClick={() => setOpenDatePicker(!openDatePicker)}
          >
            <span className="text-lg text-gray-600">
              {checkIn && checkOut
                ? `${checkIn} → ${checkOut}`
                : "Select dates"}
            </span>
            <CalendarDays className="text-gray-500" />
          </div>

          {openDatePicker && (
            <div className="absolute top-full left-0 z-20 mt-3 max-w-180 rounded-md border bg-white p-4 shadow-xl sm:w-[700px] md:w-[1000px]">
              <DayPicker
                mode="range"
                selected={date.from ? (date as DateRange) : undefined}
                onSelect={handleDaySelect}
                numberOfMonths={isSmallScreen ? 1 : 2}
                disabled={(day) =>
                  day < new Date(new Date().setHours(0, 0, 0, 0))
                }
                defaultMonth={date.from || new Date()}
                classNames={{
                  months: "sm:flex gap-6 ",
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
            </div>
          )}
        </div>

        {/* Adults */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Adults
          </label>
          <input
            type="number"
            min={1}
            max={4}
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-lg shadow-sm"
          />
        </div>

        {/* Children */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Children
          </label>
          <input
            type="number"
            min={0}
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-lg shadow-sm"
          />
        </div>

        {/* Search */}
        <div className="sm:col-span-2 md:col-span-1">
          <button
            onClick={handleSearch}
            className="w-full cursor-pointer rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-500"
          >
            {isLoading ? (
              <Loader2 className="mx-auto animate-spin text-white" />
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
