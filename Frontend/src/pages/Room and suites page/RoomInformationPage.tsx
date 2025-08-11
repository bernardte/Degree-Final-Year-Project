import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Wifi,
  Tv,
  Snowflake,
  ArrowRight,
  Star,
  X,
  Refrigerator,
  Bath,
  ConciergeBell,
  ShieldCheck,
  Sofa,
  LampDesk,
  User,
  Users,
  Info,
  Croissant
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useToast from "@/hooks/useToast";
import ReviewList from "@/layout/components/review-component/ReviewList";
import RoomInformationSkeleton from "@/layout/components/skeletons/RoomInformationSkeleton";
import useRoomStore from "@/stores/useRoomStore";
import { Link, useParams } from "react-router-dom";
import getImageSrc from "@/utils/getImageSrc";

const RoomInformationPage = () => {
  const { fetchRoomById, isLoading, error, room } = useRoomStore();
  const { id } = useParams();
  const { showToast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Create a mapping of amenity names to icons
  const amenityIcons = {
    wifi: <Wifi size={18} className="mr-2" />,
    tv: <Tv size={18} className="mr-2" />,
    "air conditioning": <Snowflake size={18} className="mr-2" />,
    "mini fridge": <Refrigerator size={18} className="mr-2" />,
    "private bathroom": <Bath size={18} className="mr-2" />,
    "room service": <ConciergeBell size={18} className="mr-2" />,
    "in room safe": <ShieldCheck size={18} className="mr-2" />,
    sofa: <Sofa size={18} className="mr-2" />,
    "desk lamp": <LampDesk size={18} className="mr-2" />,
  };

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cyan-100 via-white to-sky-100">
        <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-xl">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Room Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            The room you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/filter-room"
            className="inline-block rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            Browse Available Rooms
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = room.images?.slice(1) || [];

  return (
    <div className="min-h-screen border-1 bg-gradient-to-b from-cyan-100 via-white to-sky-100">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-4xl">
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute top-4 right-0 z-10 rounded-full p-2 text-white backdrop-blur-2xl transition-colors hover:bg-black/80"
              >
                <X size={24} />
              </button>

              <div className="relative h-[80vh]">
                <motion.img
                  key={currentImageIndex}
                  src={getImageSrc(room.images?.[currentImageIndex])}
                  alt={`${room.roomName} - ${currentImageIndex + 1}`}
                  className="h-full w-full object-contain"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Navigation arrows */}
                {room.images && room.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? room.images.length - 1 : prev - 1,
                        )
                      }
                      className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/40"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === room.images.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/40"
                      aria-label="Next image"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </>
                )}
              </div>

              <div className="mt-4 text-center text-lg text-white">
                {currentImageIndex + 1} / {room.images?.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto my-10 px-4 py-8">
        <motion.div
          className="overflow-hidden rounded-2xl bg-white shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Gallery Section */}
            <div className="relative md:w-1/2">
              <div
                className="relative h-[350px] cursor-pointer overflow-hidden md:h-[450px]"
                onClick={() => setShowLightbox(true)}
              >
                <img
                  src={getImageSrc(room.images?.[currentImageIndex])}
                  alt={room.roomName}
                  className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
                />

                {/* Navigation arrows */}
                {room.images && room.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? room.images.length - 1 : prev - 1,
                        );
                      }}
                      className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex((prev) =>
                          prev === room.images.length - 1 ? 0 : prev + 1,
                        );
                      }}
                      className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Gallery thumbnails */}
              {galleryImages.length > 0 && (
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">Gallery</h3>
                    <div className="text-sm text-gray-500">
                      {currentImageIndex + 1} of {room.images?.length}
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {room.images?.map((image, index) => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all md:h-20 md:w-24 ${
                          currentImageIndex === index
                            ? "border-blue-500"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={getImageSrc(image)}
                          alt={`Gallery ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Room Information Section */}
            <motion.div
              className="p-6 md:w-1/2 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="mb-6">
                <div className="mb-4 flex items-start justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {room.roomName}
                  </h1>
                  <div className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                    <Star size={18} fill="currentColor" className="mr-1" />
                    <span className="font-semibold">
                      {room.rating?.toFixed(1) || "4.8"}
                    </span>
                  </div>
                </div>

                <div className="mb-6 flex items-center space-x-6">
                  <div className="flex max-w-lg items-center space-x-2 rounded-md bg-blue-50 px-4 py-2 text-blue-700 shadow-sm">
                    <Info size={20} />
                    <p className="text-sm font-medium italic">
                      {room.description || "No description available."}
                    </p>
                  </div>
                  <div className="flex max-w-xs items-center space-x-4 rounded-md bg-blue-50 px-4 py-2">
                    {/* Adults */}
                    <div className="flex items-center space-x-1">
                      <User size={20} className="text-blue-500" />
                      <span>
                        <span className="font-semibold text-blue-700">
                          {room?.capacity?.adults || 2}
                        </span>{" "}
                        Adult{(room?.capacity?.adults || 2) > 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Children */}
                    <div className="flex items-center space-x-1">
                      <Users size={20} className="text-teal-500" />
                      <span>
                        <span className="font-semibold text-teal-700">
                          {room?.capacity?.children || 2}
                        </span>{" "}
                        Children
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose mb-6 text-gray-600">
                  {room.roomDetails && <p>{room.roomDetails}</p>}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.amenities?.map((amenity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center rounded-lg bg-blue-50 px-4 py-3 text-blue-700 transition-all hover:bg-blue-100"
                      whileHover={{ scale: 1.02 }}
                    >
                      {amenityIcons[amenity] || (
                        <div className="mr-2 h-6 w-6 rounded-full bg-blue-200" />
                      )}
                      <span className="font-medium">{amenity}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-blue-700">
                        RM {(room.pricePerNight || 0).toFixed(2)}
                      </span>
                      <span className="ml-2 text-gray-500">/ night</span>
                    </div>
                    {room.breakfastIncluded ? (
                      <p className="mt-1 flex items-center font-medium text-green-600">
                        <Croissant size={18} className="mr-1.5" />
                        Breakfast included
                      </p>
                    ) : (
                      <p className="mt-1 text-gray-600">
                        Excluded complimentary breakfast
                      </p>
                    )}
                  </div>

                  <Link
                    to="/filter-room"
                    className="inline-flex transform items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Book Now
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          className="mt-10 rounded-2xl bg-white p-6 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-6">
            <div className="flex items-center justify-end">
              <div className="mr-3 rounded-lg bg-yellow-500 px-3 py-1 text-lg font-bold text-white">
                {room.rating?.toFixed(1) || "4.8"}
              </div>
              <span className="text-gray-600">out of 5</span>
            </div>
          </div>

          <ReviewList reviews={room.reviews ?? []} />
        </motion.div>
      </div>
    </div>
  );
};

export default RoomInformationPage;
