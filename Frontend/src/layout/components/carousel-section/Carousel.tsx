import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import useSystemSettingStore from "@/stores/useSystemSettingStore";

type CarouselProps = {
  category: string;
};

const Carousel = ({ category }: CarouselProps) => {
  const [current, setCurrent] = useState<number>(0);
  const { getAllCarousel, carousel } = useSystemSettingStore((state) => state);

  // Get the corresponding category carousel
  useEffect(() => {
    getAllCarousel(category);
  }, [getAllCarousel, category]);

  const previousSlide = () => {
    setCurrent(current === 0 ? carousel.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === carousel.length - 1 ? 0 : current + 1);
  };

  const handleButtonClick = (link: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!link) return;

    if (link.startsWith("http://") || link.startsWith("https://")) {
      // External links
      window.open(link);
    } else {
      // Internal routing, automatically fill in "/"
      window.location.href = link.startsWith("/") ? link : `/${link}`;
    }
  };

  // Automatic carousel
  useEffect(() => {
    if (carousel.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev === carousel.length - 1 ? 0 : prev + 1));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [carousel.length]);

  if (!carousel || carousel.length === 0) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white p-3 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">
            No content available
          </h3>
          <p className="mt-2 text-gray-600">
            Please check back later for updates
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="group relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {carousel.map((c) => (
          <div key={c._id} className="relative w-screen flex-shrink-0">
            {/* image */}
            <img
              src={c.imageUrl}
              alt={c.title}
              className="h-[400px] w-full object-cover"
            />
            {/* Change this parent div */}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-blue-900/80 to-transparent">
              {/* The wrapper for the text and button */}
              <div className="relative z-30 mx-auto w-full max-w-7xl px-6 py-16 text-center md:text-left">
                {/* title */}
                <h1 className="mb-4 text-4xl font-extrabold text-white drop-shadow-lg md:text-5xl">
                  {c.title || "No Title"}
                </h1>
                {/* description */}
                <p className="mb-6 max-w-3xl text-lg text-blue-100 drop-shadow-md md:text-xl">
                  {c.description || "No description available"}
                </p>
                {/* button */}
                {c.link && (
                  <button
                    onClick={(e) => handleButtonClick(c.link, e)}
                    className="relative z-50 inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 group-hover:pointer-events-auto hover:from-blue-700 hover:to-indigo-800"
                  >
                    <span className="relative">Explore More</span>
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    <div className="absolute inset-0 h-full w-full -translate-x-full transform bg-white/10 transition-transform duration-1000 group-hover:translate-x-full" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {carousel.length > 1 && (
        <div className="pointer-events-none absolute top-0 z-30 flex h-full w-full items-center justify-between text-white opacity-0 group-hover:opacity-100">
          <button onClick={previousSlide} className="pointer-events-auto">
            <ArrowLeft
              size={40}
              className="ml-10 cursor-pointer rounded-full bg-zinc-700/50 p-2"
            />
          </button>
          <button onClick={nextSlide} className="pointer-events-auto">
            <ArrowRight
              size={40}
              className="mr-10 cursor-pointer rounded-full bg-zinc-700/50 p-2"
            />
          </button>
        </div>
      )}

      {carousel.length > 1 && (
        <div className="absolute bottom-0 z-30 flex w-full justify-center gap-3 py-4">
          {carousel.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 w-3 cursor-pointer rounded-full ${
                index === current ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Carousel;
