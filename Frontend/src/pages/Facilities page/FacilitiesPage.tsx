import Carousel from "@/layout/components/carousel-section/Carousel";
import GridList from "@/layout/components/grid-section/GridList";
import FacilitiesCard from "@/layout/components/facilities-page-components/FacilitiesCard";
import { useEffect } from "react";
import useFacilityStore from "@/stores/useFacilityStore";
import useToast from "@/hooks/useToast";
import FacilitiesCardSkeleton from "@/layout/components/skeletons/FacilitiesCardSkeleton";
import getImageSrc from "@/utils/getImageSrc";

const FacilitiesPage = () => {

  const { fetchFacility, isLoading, error, facilities } = useFacilityStore();
  const { showToast } = useToast();
  useEffect(() => {
    fetchFacility();
  }, []);

  if (error) {
    showToast("error", error);
    return null;
  }
  
  return (
    <div className="bg-gradient-to-b from-white via-sky-100 to-cyan-500/20">
      <Carousel images={facilities.map((facility) => getImageSrc(facility.image) ?? "").filter((src) => src)} />
      <div className="m-auto flex items-center justify-center">
        <GridList
          title="Facilities"
          list={facilities.slice(0, 3)}
          getName={(item) => item.facilitiesName}
          getImage={(item) => getImageSrc(item.image) ?? ""}
        />
      </div>
      <div className="mx-auto max-w-6xl p-6">
        <h2 className="mb-8 flex items-center justify-center gap-2 py-3 text-center text-5xl font-bold">
          <span className="text-black">🏨</span>
          <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Hotel Facilities
          </span>
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-4">
                  <FacilitiesCardSkeleton />
                </div>
              ))
            : facilities.map((facility) => (
                <FacilitiesCard key={facility._id} facility={facility} />
              ))}
        </div>
      </div>
    </div>
  );
}

export default FacilitiesPage;
