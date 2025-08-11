import { Hotel, MapPin, Wifi, Coffee, Utensils, Star } from "lucide-react";

const HomepageAboutUs = () => {
  return (
    <div className="relative overflow-hidden">
      {/* background decoration */}
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
      {/* main content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* text content */}
          <div className="order-2 lg:order-1">
            <div className="mb-6 flex items-center">
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
              <span className="mx-4 font-medium tracking-wider text-blue-600 uppercase">
                Welcome to
              </span>
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>
            </div>

            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                The Seraphine Hotel
              </span>
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              Where comfort meets elegance in the heart of{" "}
              <strong className="text-blue-600">Penang</strong>. Whether you're
              traveling for business or leisure, our hotel offers a warm and
              inviting atmosphere with exceptional service to make your stay
              unforgettable.
            </p>

            <div className="mb-8">
              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                Our modern rooms are designed with your comfort in mind,
                featuring{" "}
                <strong className="text-blue-600">
                  plush bedding, high-speed Wi-Fi, and all the amenities
                </strong>{" "}
                you need to relax and recharge.
              </p>

              <p className="text-lg leading-relaxed text-gray-600">
                Located just minutes from popular attractions, shopping areas,
                and transportation hubs,{" "}
                <strong className="text-blue-600">Seraphine Hotel</strong> is
                the perfect base for exploring everything{" "}
                <strong className="text-blue-600">George Town</strong> has to
                offer.
              </p>
            </div>

            {/* list item */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-blue-100 p-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-700">
                  Prime location in George Town
                </span>
              </div>

              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-blue-100 p-3">
                  <Wifi className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-700">High-speed Wi-Fi</span>
              </div>

              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-blue-100 p-3">
                  <Coffee className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-700">Premium in-room coffee</span>
              </div>

              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-blue-100 p-3">
                  <Utensils className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-700">Fine dining restaurant</span>
              </div>
            </div>

            {/* rate and review markup */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center">
                <div className="mr-2 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-600">
                  4.9/5 (284 reviews)
                </span>
              </div>
            </div>
          </div>

          {/* image area */}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/sea view room.png"
                className="absolute h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
              <div className="absolute right-0 bottom-0 p-6 text-white">
                <div className="flex items-center">
                  <Hotel className="mr-2" />
                  <h3 className="text-xl font-semibold">
                    Luxury Ocean View Suite
                  </h3>
                </div>
              </div>
            </div>

            {/* decoration card */}
            <div className="absolute -bottom-6 -left-6 z-20 w-48 rounded-xl bg-white p-4 shadow-lg">
              <div className="mb-1 text-sm text-gray-500">Since 2015</div>
              <div className="font-bold text-blue-600">
                Family Owned & Operated
              </div>
            </div>

            <div className="absolute -top-6 -right-6 z-20 w-48 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-white shadow-lg">
              <div className="mb-1 text-sm text-blue-100">Award Winning</div>
              <div className="font-bold">Best Luxury Hotel 2023</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageAboutUs;
