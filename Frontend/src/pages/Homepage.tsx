import Carousel from "../layout/components/carousel-section/Carousel";
import SearchBar from "@/layout/components/search-bar/SearchBar";
import HomepageAboutUs from "@/layout/components/introduction/HomepageAboutUs";
import HoverCard from "@/layout/components/grid-section/HoverCard";
import GridList from "@/layout/components/grid-section/GridList";
import images from "@/constant/carouselImageList";
import service from "../constant/serviceList";
import breakfastList from "@/constant/breakfastList";
import LocationSection from "@/layout/components/map/LocationSection";
import { useState } from "react";
import RoutingDirection from "@/layout/components/map/RoutingDirection";

const Homepage = () => {
  const [direction, setDirection] = useState<string[]>([]);
  return (
    <div>
      <Carousel images={images} />
      <div className="h-50 bg-gradient-to-b from-cyan-500/20">
          <SearchBar />
      </div>
      <div className="mt-30 md:mt-5">
        <HomepageAboutUs />
      </div>
      <div className="flex items-center justify-center bg-gradient-to-b from-transparent to-cyan-500/20 px-5 py-10 text-center text-gray-800 md:flex md:flex-row md:items-center">
        <HoverCard list={service} title="Explore Our Elegant Amenities" />
      </div>
      <div className="flex items-center justify-center bg-gradient-to-b from-cyan-500/20 to-transparent px-5 py-10 text-center md:flex md:flex-row md:items-center">
        <GridList
          title="Breakfast, Included With Your Stay"
          list={breakfastList}
          getName={(item) => item.name} //loop inside the component in the map function to get the list name
          getImage={(item) => item.image} //loop inside the component in the map function to get the list image
        />
      </div>

      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-cyan-500/20 px-4 text-center">
        <LocationSection title="Our Location" setDirection={setDirection} />

        {direction.length > 0 && (
          <div className="mt-10 w-full max-w-6xl">
            <RoutingDirection direction={direction} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
