import RoomFilter from "./RoomFilter";
import { Room } from "@/types/interface.type";
import RoomCardSkeleton from "../skeletons/RoomCardSkeleton";
import useToast from "@/hooks/useToast";
import { useState } from "react";
import { Link } from "react-router-dom";
import getImageSrc from "@/utils/getImageSrc";

type RoomCardHorizontalProps = {
  rooms: Room[];
  title: string;
  isLoading: boolean;
  error: string | null
};

const RoomCardHorizontal = ({ rooms, title, isLoading, error }: RoomCardHorizontalProps) => {
  const { showToast } = useToast();
  const [value, setValue] = useState<string>("")
  if(isLoading){
    return <RoomCardSkeleton />
  }

  if(error){
    showToast("error", error);
  }

  const filteredRoom = value === "" || value === "All" 
  ? rooms
  : rooms.filter(room => room.roomType === value);
  

  return (
    <div className="mx-auto max-w-7xl px-10 md:px-0">
      <h2 className="mb-10 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-center text-5xl font-bold text-transparent">
        {title}
      </h2>
      {/* Room Filter Button */}
      <RoomFilter setValue={setValue} rooms={rooms} />
      {/* Room Card List */}
      {filteredRoom.map((roomType) => (
        <div
          className="mb-10 overflow-hidden rounded-lg bg-white shadow-lg"
          key={roomType._id}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="w-full md:w-1/2">
              <img
                src={Array.isArray(roomType.images) ? getImageSrc(roomType.images[0]) : getImageSrc(roomType.images)}
                alt={`${roomType.roomName}`}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="flex w-full flex-col justify-between p-6 md:w-1/2">
              <div>
                <h3 className="mb-2 text-2xl font-bold text-gray-800">
                  {roomType.roomName}
                </h3>
                <p className="mb-2 text-sm text-gray-600">
                  {roomType.description}
                </p>
                <p className="mb-6 text-gray-700">{roomType.roomDetails}</p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
                  <Link to="/filter-room" className="cursor-pointer rounded-md border border-blue-600 px-6 py-2 font-semibold text-blue-600 transition hover:bg-blue-200">
                    BOOK NOW
                  </Link>
                  <Link
                    to={`/room-suite/room/${roomType._id}`}
                    className="cursor-pointer text-sm text-gray-700 underline underline-offset-4 hover:text-blue-600"
                  >
                    READ MORE DETAILS
                  </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomCardHorizontal;

