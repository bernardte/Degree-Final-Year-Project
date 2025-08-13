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
import {
  Loader2,
  Home,
  Star,
  Heart,
  ChevronRight,
  BedDouble,
} from "lucide-react";
import getImageSrc from "@/utils/getImageSrc";

interface FilterContentProps {
  filterRoom: Room[];
  mostPopularBookedRoom: Room[];
  isLoading: boolean;
  setSelectedRoom: React.Dispatch<React.SetStateAction<Room[]>>;
  selectedRoom: Room[];
}

const FilterContent = ({
  filterRoom,
  mostPopularBookedRoom,
  isLoading,
  setSelectedRoom,
  selectedRoom,
}: FilterContentProps) => {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setTimeout(() => {
      navigate("/");
      setLoading(false);
      localStorage.removeItem("searchParams");
    }, 1000);
  };

  const toggleSelectRoom = (room: Room): void => {
    setSelectedRoom((prevSelected) => {
      if (prevSelected.some((selectedRoom) => room._id === selectedRoom._id)) {
        return prevSelected.filter((select) => select._id !== room._id);
      }
      return [...prevSelected, room];
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
        <div className="flex flex-col items-center">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-500" />
          <p className="text-lg font-medium text-blue-700">
            Finding the perfect rooms for your stay...
          </p>
          <p className="mt-2 text-blue-500">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto bg-gradient-to-br from-sky-50 via-blue-50 to-white">
      <div className="mx-auto w-full max-w-7xl flex-shrink-0 p-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 pt-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  onClick={handleHomeClick}
                  className="flex items-center text-blue-600 transition-colors hover:text-blue-800"
                >
                  <Home className="mr-2 h-4 w-4" />
                  {loading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    "Home"
                  )}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 text-blue-400" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/filter-room?${new URLSearchParams(parse as any).toString()}`}
                  className="font-medium text-blue-800"
                >
                  Room Selection
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Results Header */}
        {filterRoom.length === 0 ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white py-20 shadow-lg">
            <div className="mb-6 rounded-full bg-blue-100 p-5">
              <BedDouble
                className="h-12 w-12 text-blue-600"
                strokeWidth={1.5}
              />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-blue-800">
              No Matching Rooms Found
            </h1>
            <p className="mb-8 max-w-md text-center text-blue-600">
              We couldn't find any rooms matching your criteria. Please adjust
              your filters or try different dates.
            </p>
            <Button
              className="transform rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 font-semibold text-white transition-all hover:scale-105 hover:from-blue-600 hover:to-blue-700"
              onClick={handleHomeClick}
            >
              Modify Search
            </Button>
          </div>
        ) : (
          <div className="mb-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-blue-900">
                  Available Luxury Rooms
                </h1>
                <p className="mt-2 text-blue-600">
                  Select the perfect room for your stay
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-5 shadow-lg">
                <div className="flex items-center text-white">
                  <div className="mr-3 rounded-lg bg-white/20 p-2">
                    <BedDouble className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-medium text-white">
                    We found{" "}
                    <span className="font-bold text-blue-100">
                      {filterRoom.length}
                    </span>{" "}
                    room{filterRoom.length > 1 ? "s" : ""} for you
                  </h2>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Grid */}
        <div className="">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(filterRoom) &&
                filterRoom.map((room) => {
                  const isSelected = selectedRoom.some(
                    (selected) => selected._id === room._id,
                  );
                  return (
                    <div
                      key={room._id}
                      className={`overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl transition-all duration-300 hover:border-blue-200 hover:shadow-2xl ${isSelected ? "ring-4 ring-blue-400" : ""}`}
                    >
                      {/* Image Section */}
                      <div className="relative h-64 w-full">
                        <div className="absolute inset-0 z-10 rounded-t-2xl bg-gradient-to-t from-blue-900/30 to-transparent" />
                        <img
                          src={getImageSrc(
                            Array.isArray(room.images)
                              ? room.images[0]
                              : room.images,
                          )}
                          alt={room.roomName}
                          className="h-full w-full rounded-t-2xl object-cover object-center"
                        />
                        <div className="absolute top-4 right-4 z-1">
                          <button
                            className={`rounded-full p-2 ${isSelected ? "bg-blue-600" : "bg-white/80"} shadow-md transition-colors`}
                            onClick={() => toggleSelectRoom(room)}
                          >
                            <Heart
                              className={`h-5 w-5 ${isSelected ? "fill-white text-white" : "text-blue-600"}`}
                              fill={isSelected ? "currentColor" : "none"}
                            />
                          </button>
                        </div>

                        {mostPopularBookedRoom.map((popularRoom) => {
                          if (popularRoom._id === room._id) {
                            return (
                              <div
                                key={popularRoom._id}
                                className="absolute top-4 left-4 z-20 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-bold text-white"
                              >
                                POPULAR
                              </div>
                            );
                          }
                        })}
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-blue-900">
                              {room.roomName}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-700">
                              RM {room.pricePerNight}
                            </p>
                            <p className="text-sm text-blue-500">per night</p>
                          </div>
                        </div>

                        <div className="mb-4 flex items-center">
                          <div className="mr-4 flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < (room.rating || 0) ? "fill-amber-400 text-amber-400" : "text-blue-200"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-blue-700">
                            {room.rating || 0} Rating
                          </span>
                        </div>

                        <p className="mb-5 line-clamp-2 text-sm text-blue-700">
                          {room.description ||
                            "Luxuriously appointed room with premium amenities and stunning views."}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center justify-center text-xs text-blue-600">
                            <BedDouble className="mr-1 h-4 w-4" />
                            <span>
                              {(room.capacity?.children || 0) +
                                (room.capacity?.adults || 0) || 2}{" "}
                              Guests
                            </span>
                            {room.breakfastIncluded && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="font-semibold text-emerald-500">
                                  Include Breakfast
                                </span>
                              </>
                            )}
                          </div>
                          <Button
                            className={`transform rounded-xl px-6 py-4 font-bold transition-all hover:scale-105 ${
                              isSelected
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            }`}
                            onClick={() => toggleSelectRoom(room)}
                          >
                            {isSelected ? "Selected ✓" : "Select Room"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="pointer-events-none fixed right-4 bottom-4 opacity-5">
        <div className="text-xl font-bold tracking-widest text-blue-800">
          LUXURY STAY
        </div>
      </div>
    </div>
  );
};

export default FilterContent;
