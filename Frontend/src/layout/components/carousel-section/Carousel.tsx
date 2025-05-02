import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

type carouselProps = {
  images: string[]
}

const Carousel = ({images}: carouselProps) => {
  const [current, setCurrent] = useState<number>(0);

  const previousSlide = () => {
    if(current === 0){
      setCurrent(images.length - 1)
    }else{
      setCurrent(current - 1)
    }
  }

  const nextSlide = () => {
    if(current === images.length - 1){
      setCurrent(0)
    }else{
      setCurrent(current + 1)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);

    return () => clearInterval(interval)
  }, [current]);

  return (
    <section className="group relative w-full overflow-hidden">
      <div
        className={`flex transition-transform duration-400 ease-in-out`}
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {images.map((s, index) => {
          return (
            <img
              key={index}
              src={s}
              className="h-[400px] w-screen flex-shrink-0 object-cover"
            />
          );
        })} 
      </div>
      <div className="absolute top-0 flex h-full w-full items-center justify-between text-white opacity-0 group-hover:opacity-100">
        <button onClick={previousSlide}>
          <ArrowLeft
            size={40}
            color="#ffffff"
            strokeWidth={2.5}
            className="ml-10 cursor-pointer rounded-full bg-zinc-500/50 p-2"
          />
        </button>
        <button onClick={nextSlide}>
          <ArrowRight
            size={40}
            color="#ffffff"
            strokeWidth={2.5}
            className="mr-10 cursor-pointer rounded-full bg-zinc-500/50 p-2"
          />
        </button>
      </div>
      <div className="absolute bottom-0 flex w-full justify-center gap-3 py-4">
        {images.map((_, index) => (
          <div
            onClick={() => {
              setCurrent(index);
            }}
            key={index}
            className={`bottom-0 size-3 rounded-full bg-gray-300 ${index === current ? "bg-white" : "bg-gray-400"} cursor-pointer`}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
