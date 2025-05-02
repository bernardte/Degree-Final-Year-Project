import useToast from "@/hooks/useToast";
import RoomInformationSkeleton from "@/layout/components/skeletons/RoomInformationSkeleton";
import useRoomStore from "@/stores/useRoomStore";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const RoomInformationPage = () => {
  const { fetchRoomById, isLoading, error, room } = useRoomStore();
  const { id } = useParams();
  const { showToast } = useToast();

  useEffect(() => {
    if (id) fetchRoomById(id);
  }, [id, fetchRoomById]);

  if (isLoading) {
    return <RoomInformationSkeleton />;
  }

  if (error) {
    showToast("error", error);
    return null;
  }

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <div className="inset-0 flex min-h-screen items-center bg-gradient-to-b from-cyan-100 via-white to-sky-100">
      <div className="flex h-full w-full flex-col md:flex-row">
        {/* Image Section */}
        <div className="mx-10 h-[300px] w-full md:h-auto md:w-1/2">
          <img
            src={room.images?.[0] || "/placeholder.jpg"}
            alt={room.roomName}
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="flex w-full flex-col justify-between p-8 md:w-1/2">
          <div>
            <h2 className="mb-2 text-4xl font-bold">{room.roomName}</h2>
            <p className="mb-4 text-lg text-gray-500">{room.description}</p>
            <p className="mb-6 leading-relaxed text-gray-700">
              {room.roomDetails}
            </p>
            {/* Amenities Section */}
            <div className="mt-4 flex flex-wrap gap-3">
              {room.amenities?.map((amenity, index) => (
                <span
                  key={index}
                  className="text-md rounded-md bg-blue-500/10 px-5 py-2 text-blue-500 transition hover:bg-blue-500/20 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)]"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-green-600">
                RM {(room.pricePerNight || 0).toFixed(2)}/per night
              </p>
              <p className="text-sm text-gray-400">
                Includes complimentary breakfast
              </p>
            </div>

            <Link
              to="/filter-room"
              className="cursor-pointer rounded-md border border-blue-600 px-6 py-2 font-semibold text-blue-600 transition hover:bg-blue-200"
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomInformationPage;
