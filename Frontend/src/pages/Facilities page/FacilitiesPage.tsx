import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Wifi,
  Dumbbell,
  WavesLadder,
  Bath,
  Utensils,
  Gift,
  ChevronDown,
} from "lucide-react";
import Carousel from "@/layout/components/carousel-section/Carousel";
import GridList from "@/layout/components/grid-section/GridList";
import FacilitiesCard from "@/layout/components/facilities-page-components/FacilitiesCard";
import useFacilityStore from "@/stores/useFacilityStore";
import useToast from "@/hooks/useToast";
import FacilitiesCardSkeleton from "@/layout/components/skeletons/FacilitiesCardSkeleton";
import getImageSrc from "@/utils/getImageSrc";
import { useNavigate } from "react-router-dom";

const FacilitiesPage = () => {
  const { fetchFacility, isLoading, error, facilities } = useFacilityStore();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState("All Facilities");
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFacility();
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight ?? 0);
    }
  }, [expandedDescription]);

  if (error) {
    showToast("error", error);
    return null;
  }

  // facility classification
  const categories = [
    { id: "all", name: "All Facilities", icon: <Sparkles size={20} /> },
    { id: "wellness", name: "Wellness", icon: <Bath size={20} /> },
    { id: "fitness", name: "Fitness", icon: <Dumbbell size={20} /> },
    { id: "dining", name: "Dining", icon: <Utensils size={20} /> },
    { id: "recreation", name: "Recreation", icon: <WavesLadder size={20} /> },
    { id: "services", name: "Services", icon: <Gift size={20} /> },
    { id: "entertainment", name: "Entertainment", icon: <Gift size={20} /> },
  ];

  // filter
  const filteredFacilities =
    activeCategory === "All Facilities"
      ? facilities
      : facilities.filter((facility) => facility.category === activeCategory);

  // Selected facilities display
  const featuredFacilities = facilities.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-cyan-100">
      {/* carousel */}
      <div className="relative">
        <Carousel category="facility"/>
      </div>

      {/* Selected facilities display */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-blue-700">
              <Sparkles className="mr-2" size={18} />
              <span>Featured Facilities</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                Experience Premium Amenities
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-gray-600">
              Indulge in our carefully curated selection of premium facilities
              designed to elevate your stay
            </p>
          </div>

          <div className="m-auto flex items-center justify-center">
            <GridList
              title=""
              list={featuredFacilities}
              getName={(item) => item.facilitiesName}
              getImage={(item) => getImageSrc(item.image) ?? ""}
            />
          </div>
        </div>
      </div>

      {/* Facility classification and introduction */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                Explore Our Facilities
              </span>
            </h2>

            <div className="mx-auto mb-8 max-w-4xl">
              <motion.div
                ref={contentRef}
                initial={false}
                animate={{
                  height: expandedDescription ? contentHeight : "4.5rem",
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="text-gray-600">
                  At The Seraphine Hotel, we pride ourselves on offering an
                  unparalleled range of facilities designed to enhance every
                  aspect of your stay. From our state-of-the-art wellness center
                  to our gourmet dining experiences, each amenity has been
                  carefully curated to provide the ultimate luxury experience.
                  Our commitment to excellence ensures that every facility is
                  maintained to the highest standards, offering both
                  functionality and aesthetic appeal. Whether you're seeking
                  relaxation, recreation, or rejuvenation, our diverse amenities
                  cater to every need and preference.
                </p>
              </motion.div>
              <button
                onClick={() => setExpandedDescription(!expandedDescription)}
                className="mx-auto mt-2 flex items-center font-medium text-blue-600 transition-colors duration-300 hover:text-blue-800"
              >
                {expandedDescription ? "Show less" : "Read more"}
                <motion.div
                  animate={{ rotate: expandedDescription ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="ml-1" size={18} />
                </motion.div>
              </button>
            </div>

            {/* Classification filter */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center rounded-full px-4 py-2 transition-all ${
                    activeCategory === category.name
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Facility card grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <FacilitiesCardSkeleton key={index} />
                ))
              : filteredFacilities.map((facility) => (
                  <FacilitiesCard key={facility._id} facility={facility} />
                ))}
          </div>

          {/* No result found */}
          {!isLoading && filteredFacilities.length === 0 && (
            <div className="py-12 text-center">
              <div className="inline-block rounded-2xl bg-gray-100 p-6">
                <Wifi className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="mb-2 text-xl font-bold text-gray-700">
                  No Facilities Found
                </h3>
                <p className="max-w-md text-gray-600">
                  We couldn't find any facilities in this category. Try
                  selecting a different category.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Service Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="mb-3 text-2xl font-bold">
                Premium Services Included
              </h3>
              <p className="mb-4 text-blue-100">
                All guests enjoy complimentary access to our premium facilities
                and services throughout their stay.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-white/20 p-2">
                    <Wifi className="text-white" size={20} />
                  </div>
                  <span>High-speed WiFi</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-white/20 p-2">
                    <WavesLadder className="text-white" size={20} />
                  </div>
                  <span>Infinity Pool Access</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-white/20 p-2">
                    <Bath className="text-white" size={20} />
                  </div>
                  <span>Spa Facilities</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-white/20 p-2">
                    <Dumbbell className="text-white" size={20} />
                  </div>
                  <span>Fitness Center</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <motion.button
                onClick={() => navigate("/filter-room")}
                className="rounded-full bg-white px-8 py-3 font-bold text-blue-600 shadow-lg transition-all hover:bg-gray-100 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Your Stay
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitiesPage;
