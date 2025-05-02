interface EventTypesProps {
    events: EventType[],
    title: string,
}

interface EventType {
    id: number;
    title: string; 
    img: string;
}

const EventTypes = ({ events, title: eventTitle }: EventTypesProps) => {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 pb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-center text-3xl font-semibold text-transparent">
          {eventTitle}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-2xl bg-gray-100 shadow-md shadow-blue-200 transition hover:shadow-xl"
            >
              <img
                src={event.img}
                alt={event.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 bg-gray-200">
                <h3 className="text-lg font-semibold">{event.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventTypes;
