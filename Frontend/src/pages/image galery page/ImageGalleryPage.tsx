const ImageGalleryPage = () => {
  const images = [
    "/asian breakfast.png",
    "/chinese breakfast.png",
    "/deluxe room.png",
    "/double bedroom.png",
    "/meeting room.png",
    "/facilities2.png",
    "/facilities3.png",
    "/facilities4.png",
    "/facilities5.png",
    "/service2.png",
    "/service3.png",
    "/service4.png",
    "/service5.png",
    "/sea view room.png",
    "/wedding room2.png",
    "/wedding room.png",
    "/deluxe twin room.png",
    "/double standard room.png",
    "/standard room.png",
    "/twin room.png"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 px-5 py-10">
      <h1 className="mb-10 bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent text-center text-3xl font-bold drop-shadow">
        Our Beautiful Gallery
      </h1>

      {/* Waterfall layout */}
      <div className="gap-6 sm:columns-2 lg:columns-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="mb-6 break-inside-avoid overflow-hidden border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
          >
            <img
              src={image}
              alt={`image ${index + 1}`}
              className="h-auto w-full transform object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGalleryPage;
