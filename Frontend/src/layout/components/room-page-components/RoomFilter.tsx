import { useState } from "react";
import { Room } from "@/types/interface.type";

interface RoomFilterProps{
  rooms: Room[]
  setValue: (value: string) => void;
}

const RoomFilter = ({ setValue, rooms }: RoomFilterProps) => {
  const mapEachRoom = rooms.map((room) => room.roomType);
  const uniqueRoomType = Array.from(new Set(mapEachRoom))
  const roomTypes = ["All", ...uniqueRoomType];
  const [activeType, setActiveType] = useState("All");

  return (
    <div className="mb-10 flex flex-wrap justify-center gap-4">
      {roomTypes.map((type) => {
        const isActive = activeType === type;

        return (
          <button
            key={type}
            onClick={() => {
              setActiveType(type)
              setValue(type)
            }}
            className={`rounded-full px-6 py-2 font-semibold transition-all duration-300 cursor-pointer ${
              isActive
                ? "scale-105 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                : "border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-gray-100"
            } `}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
};

export default RoomFilter;
