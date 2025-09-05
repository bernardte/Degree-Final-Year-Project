import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRoomsStore from "@/stores/useRoomStore";
import { Slider } from "@/components/ui/slider";
import { Room } from "@/types/interface.type";
import { DateRange, DayPicker } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router-dom";
import BookingButton from "./BookingButton";
import ContactInformation from "../checkout-page-component/ContactInformation";
import useAuthStore from "@/stores/useAuthStore";

const LeftSidebar = ({
  onFilterChange,
  selectedRoom,
}: {
  onFilterChange: (filters: any) => void;
  selectedRoom: Room[];
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [roomType, setRoomType] = useState("all");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const { rooms } = useRoomsStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleDaySelect = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return;
    setDate(range);
    if (range?.from && range?.to) {
      if (range?.from.getDate() === range?.to.getDate()) {
        return;
      }
      setCheckInDate(formatDate(range.from));
      setCheckOutDate(formatDate(range.to));
    }
  };

  const formatAmenity = (amenity: string) => {
    return amenity
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const amenitiesList = Array.from(
    new Set(rooms.flatMap((room: Room) => room.amenities)),
  );

  //display to the UI if local storage have
  useEffect(() => {
    const storedParams = localStorage.getItem("searchParams");
    if (storedParams) {
      const filters = JSON.parse(storedParams);
      setCheckInDate(filters.checkInDate || "");
      setCheckOutDate(filters.checkOutDate || "");
      setChildren(Number(filters.children) || 0);
      setAdults(Number(filters.adults) || 1);
    }
  }, []);

  const handleFilter = (filters: any) => {
    const currentParams = new URLSearchParams(window.location.search);
    console.log("testing", window.location.search);
    console.log("checkInDate", filters.checkInDate);
    if (filters.roomType) {
      currentParams.set("roomType", filters.roomType);
    } else {
      currentParams.delete("roomType"); // Clear if "all"
    }
    if (filters.minPrice) {
      currentParams.set("minPrice", filters.minPrice.toString());
    }

    if (filters.maxPrice) {
      currentParams.set("maxPrice", filters.maxPrice.toString());
    }

    currentParams.delete("amenities");
    filters.amenities.forEach((a: string) =>
      currentParams.append("amenities", a),
    );

    if (filters.checkInDate)
      currentParams.set("checkInDate", filters.checkInDate);

    if (filters.checkOutDate)
      currentParams.set("checkOutDate", filters.checkOutDate);

    if (filters.adults) {
      currentParams.set("adults", filters.adults.toString());
    }

    currentParams.set("children", filters.children.toString());

    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    //! don't use native browser API, this will not trigger the React re-render components
    //! must use useNavigate(), this will re-render the components
    navigate(newUrl, {
      replace: true,
    });
  };

  useEffect(() => {
    const filters = {
      roomType: roomType === "all" ? "" : roomType,
      minPrice: priceRange[0], //first is minimum price
      maxPrice: priceRange[1], //last is maximum price
      amenities: selectedAmenities,
      checkInDate,
      checkOutDate,
      adults,
      children,
    };
    console.log(filters);
    onFilterChange(filters);
    handleFilter(filters);
  }, [
    roomType,
    priceRange,
    selectedAmenities,
    checkInDate,
    checkOutDate,
    adults,
    children,
  ]);

  const handleResetButton = () => {
    setRoomType("all");
    setPriceRange([0, 10000]);
    setSelectedAmenities([]);
    setDate(undefined);
    setCheckInDate("");
    setCheckOutDate("");
    setAdults(1);
    setChildren(0);
    window.history.replaceState(null, "", window.location.pathname);

    setTimeout(() => {
      const filters = {
        roomType: "",
        minPrice: 0,
        maxPrice: 10000,
        amenities: [],
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 0,
      };
      onFilterChange(filters);
      handleFilter(filters);
    }, 0);
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-blue-200 via-sky-200 to-transparent p-6 shadow-inner">
      <h2 className="mb-4 text-lg font-bold text-zinc-500">Filter Rooms</h2>
      <div className="flex flex-col space-y-6">
        {/* Date Range */}
        <div className="flex flex-col gap-4">
          <label className="mb-1 block text-sm font-semibold text-blue-900">
            Date Range
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex w-full cursor-pointer justify-between rounded-lg border border-blue-300 bg-white px-3 py-2 text-left text-sm text-blue-900 shadow-sm">
                {checkInDate && checkOutDate
                  ? `${checkInDate} - ${checkOutDate}`
                  : "Select date range"}
                <CalendarDays className="cursor-pointer text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <DayPicker
                mode="range"
                selected={date?.from ? (date as DateRange) : undefined}
                onSelect={handleDaySelect}
                numberOfMonths={1}
                disabled={(day) =>
                  day < new Date(new Date().setHours(0, 0, 0, 0))
                }
                defaultMonth={date?.from || new Date()}
                classNames={{
                  months: "sm:flex gap-6 px-1 py-1",
                  month: "w-full ml-1",
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
            </PopoverContent>
          </Popover>
        </div>

        {/* Adults & Children */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-900">
              Adults
            </label>
            <input
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm text-blue-900 shadow-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-blue-900">
              Children
            </label>
            <input
              type="number"
              min={0}
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="white w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm text-blue-900 shadow-sm"
            />
          </div>
        </div>

        {/* Room Type */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-blue-900">
            Room Type
          </label>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 shadow-sm">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="all"
                className="cursor-pointer"
                onClick={() => rooms.map((room) => room.roomType).sort()}
              >
                All
              </SelectItem>
              {[...new Set(rooms.map((room) => room.roomType))]
                .filter(Boolean)
                .sort()
                .map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="cursor-pointer capitalize"
                  >
                    <span className="capitalize">{type}</span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-blue-900">
            Price Range
          </label>
          <Slider
            value={priceRange}
            max={10000}
            min={0}
            step={1}
            onValueChange={(value) =>
              setPriceRange([value[0], value[1] ?? value[0]])
            }
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-sm font-medium text-blue-800">
            <span>RM {priceRange[0]}</span>
            <span>RM {priceRange[1]}</span>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-blue-900 border-b-2 border-blue-500">
            Amenities
          </label>
          <div className="flex flex-wrap gap-y-3 py-3">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity}
                className="flex min-w-[150px] gap-2 text-sm text-blue-800"
              >
                <input
                  type="checkbox"
                  value={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedAmenities((prev) =>
                      checked
                        ? [...prev, amenity]
                        : prev.filter((item) => item !== amenity),
                    );
                  }}
                  className="h-4 w-4 accent-sky-600"
                />
                {formatAmenity(amenity)}
              </label>
            ))}
          </div>
        </div>

        {user ? (
          <BookingButton selectedRoom={selectedRoom} />
        ) : (
          <ContactInformation selectedRoom={selectedRoom}/>
        )}

        {/* Reset Button */}
        <button
          className="cursor-pointer rounded bg-red-100 px-4 py-2 text-sm text-red-600 transition-all hover:scale-105 hover:bg-red-200"
          onClick={handleResetButton}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
