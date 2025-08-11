interface EventTypesProps {
  events: EventType[];
  title: string;
}

interface EventType {
  id: number;
  title: string;
  img: string;
}

const EventTypes = ({ events, title: eventTitle }: EventTypesProps) => {
  // 设施标签数据
  const facilityTags = [
    { id: 1, name: "Audio Visual Equipment" },
    { id: 2, name: "Catering" },
    { id: 3, name: "Flexible Layout" },
    { id: 4, name: "Parking" },
    { id: 5, name: "WiFi" },
    { id: 6, name: "Accessibility" },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
              {eventTitle}
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Discover our versatile event spaces perfect for corporate meetings,
            weddings, and private celebrations
          </p>
          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"></div>
        </div>

        {/* Testimonial Section */}
        <div className="py-16">
          <div className="mx-auto flex max-w-4xl px-4 text-center">
            <div className="mb-4 text-5xl text-blue-400">❝</div>
            <blockquote className="mb-6 text-2xl text-gray-700 italic">
              Beneath soft lights and timeless décor, love takes center stage.
              From the elegant ceremony to the final toast, every moment unfolds
              seamlessly — surrounded by warmth, beauty, and the quiet charm of
              a space designed for celebration.
            </blockquote>
            <div className="mb-4 text-5xl text-blue-400">❞</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={event.img}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                  <div className="w-full p-5">
                    <h3 className="text-xl font-bold text-white">
                      {event.title}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <svg
                        className="mr-1 h-4 w-4 text-blue-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-blue-100">
                        Main Ballroom, 2nd Floor
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {facilityTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Capacity</p>
                      <p className="font-medium">Up to 150 guests</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Min. Booking</p>
                      <p className="font-medium">4 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventTypes;
