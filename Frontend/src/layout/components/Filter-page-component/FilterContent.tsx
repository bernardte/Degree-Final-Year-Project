import { useState } from "react";
import { Room } from "@/types/interface.type";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useQueryParams from "@/hooks/useQueryParams";
import { Loader2 } from "lucide-react";

interface FilterContentProps {
  filterRoom: Room[];
  isLoading: boolean;
  setSelectedRoom: React.Dispatch<React.SetStateAction<Room[]>>;
  selectedRoom: Room[];
}

const FilterContent = ({ filterRoom, isLoading, setSelectedRoom, selectedRoom }: FilterContentProps) => {
  const [loading, setLoading] = useState(false); // Loading state
  const localStorageSearchParams = localStorage.getItem("searchParams") || "{}";
  const parse = JSON.parse(localStorageSearchParams) || {};
  const location = useLocation();
  const navigate = useNavigate();
  const { allParams } = useQueryParams();

  const isActive = (url: string) => {
    const breadcrumbUrl = new URL(url, window.location.origin);
    return (
      breadcrumbUrl.pathname === location.pathname &&
      breadcrumbUrl.search === location.search
    );
  };

  const handleHomeClick = () => {
    setLoading(true); // Start loading
    // Simulate a delay before navigating
    setTimeout(() => {
      navigate("/"); // Navigate to home
      setLoading(false); // Stop loading
      localStorage.removeItem("searchParams");
    }, 1000); // You can adjust the time delay here
  };

  const toggleSelectRoom = (room: Room): void => {
    setSelectedRoom((prevSelected) => {
      if (prevSelected.some((selectedRoom) => room._id === selectedRoom._id)) {
        return prevSelected.filter((select) => select._id !== room._id);
      }
      return [...prevSelected, room];
    });
  }

  if(isLoading){
    return (
      <div className="flex h-1/2 flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-auto bg-gradient-to-br from-sky-100 via-blue-100 to-white p-6 shadow">
      {/* Back to Home Link */}
      <div className="absolute z-1">
        <Breadcrumb className="px-8 pt-1">
          <BreadcrumbList>
            {/* Home Breadcrumb */}
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                onClick={handleHomeClick}
                className={
                  isActive("/")
                    ? "font-bold text-gray-700"
                    : "text-blue-600 hover:underline"
                }
              >
                {loading ? (
                  <span className="animate-caret-blink">Loading...</span>
                ) : (
                  "Home"
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Filter Room Breadcrumb */}
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/filter-room?${new URLSearchParams(parse as any).toString()}`}
                className={
                  isActive(`/filter-room?${allParams.toString()}`)
                    ? "font-bold text-gray-700"
                    : "text-blue-600 hover:underline"
                }
              >
                Filter Room
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {filterRoom.length === 0 ? (
        <div className="my-auto flex h-1/2 flex-col items-center justify-center">
          <h1 className="my-auto mb-4 animate-pulse text-center text-2xl font-bold text-rose-600">
            No Room Match
          </h1>
          <p className="text-center font-semibold text-zinc-500">
            Sorry, we couldn't find any rooms matching your criteria.
          </p>
        </div>
      ) : (
        <div
          className="animate-fadeInDown mb-6 flex items-center justify-center"
          key={filterRoom.length}
        >
          <div className="animate-fade-in flex items-center gap-3 rounded-xl bg-blue-200 px-6 py-4 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m2 6H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z"
              />
            </svg>
            <h1 className="text-xl font-semibold text-blue-700">
              We found{" "}
              <span className="font-bold text-blue-900">
                {filterRoom.length}
              </span>{" "}
              awesome room{filterRoom.length > 1 ? "s" : ""} for you!
            </h1>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filterRoom.map((room) => {
            const isSelected = selectedRoom.some(
              (selected) => selected._id === room._id,
            );
          return (
            <div
              key={room._id}
              className="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
            >
              {/* Image Section */}
              <div className="relative h-64 w-full bg-gray-200">
          <img
            src={room.images[0]} // Assuming images array exists
            alt={room.roomName}
            className="h-full w-full object-cover object-center"
          />
              </div>

              {/* Content Section */}
              <div className="flex flex-col p-4">
          <h3 className="truncate text-xl font-semibold text-gray-800">
            {room.roomName}
          </h3>
          <p className="mt-1 truncate text-sm text-gray-500">
            {room.roomType}
          </p>
          <p className="mt-3 text-lg font-bold text-blue-600">
            RM {room.pricePerNight} <span className="text-sm">/ night</span>
          </p>

          <Button
            className={`my-3 cursor-pointer ${
              isSelected
                ? "bg-emerald-400 text-white hover:bg-emerald-500"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => toggleSelectRoom(room)}
          >
            {isSelected
              ? "Selected"
              : "Book Now"}
          </Button>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default FilterContent;
