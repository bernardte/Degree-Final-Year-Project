import featuresList from "@/constant/featuresList";

const RoomPageIntroduce = () => {
  return (
    <div className="flex flex-col items-center px-4 py-16">
      <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text py-2 text-center text-3xl font-extrabold text-transparent md:text-5xl">
        Welcome to Your Perfect Stay
      </h1>

      <p className="mt-6 max-w-2xl text-center text-lg leading-7 text-gray-600">
        Discover comfort and elegance in our thoughtfully designed rooms, where
        modern amenities meet cozy charm. Whether you're here to relax or
        recharge, each room offers a peaceful retreat.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {featuresList.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg"
          >
            <div className="text-blue-600">{feature.icon}</div>
            <span className="font-medium text-gray-700">{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomPageIntroduce;
