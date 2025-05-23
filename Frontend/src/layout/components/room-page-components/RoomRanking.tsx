import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import useRoomStore from "@/stores/useRoomStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import RoomCarouselSkeleton from "../skeletons/RoomCarouselSkeleton"; // adjust path as needed
import useToast from "@/hooks/useToast";
import getImageSrc from "@/utils/getImageSrc";

const RoomRanking = () => {
  const { fetchRoomRanking, mostBookingRoom, isLoading, error } = useRoomStore(
    (state) => state,
  );
  const { showToast } = useToast();

  useEffect(() => {
    fetchRoomRanking();
  }, [fetchRoomRanking]);

  if(error){
    showToast("error", error);
    return;
  }

  console.log(mostBookingRoom);
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-10 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text pb-2 text-center text-5xl font-bold text-transparent">
        Most Booking Hotel Room Type
      </h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 3500 }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="rounded-2xl pb-12"
      >
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <SwiperSlide key={i}>
                  <RoomCarouselSkeleton />
                </SwiperSlide>
              ))
          : mostBookingRoom.map((room, index) => (
              <SwiperSlide key={room._id} className="h-full rounded-2xl">
                <div className="flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
                  <div className="relative">
                    <img
                      src={getImageSrc(room.images)}
                      alt={room.roomName}
                      className="block h-60 w-full object-cover"
                    />
                    <div className="absolute top-4 left-4 rounded-full bg-gradient-to-r from-sky-600 to-blue-500 px-3 py-1 text-xs font-bold text-white shadow">
                      #{index + 1} Ranked
                    </div>
                  </div>
                  <div className="space-y-2 p-5">
                    <h3 className="text-xl font-bold text-gray-800 capitalize">
                      {room.roomType}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="font-semibold text-yellow-500">
                        ⭐{room.rating?.toFixed(1) || "No ratings yet"}
                      </span>
                      <span className="font-semibold text-gray-800">
                        RM {room.pricePerNight}/night
                      </span>
                    </div>
                    <div className="cusor-pointer">
                      <button className="mt-4 w-full rounded-xl bg-blue-600 py-2 text-white transition duration-200 hover:bg-blue-700">
                        <Link to={`/room-suite/room/${room._id}`}>
                          View Details
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  );
};

export default RoomRanking;
