const UpcommingLocalEvents = ({ title }: {title: string}) => {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-6 pb-3 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-center text-3xl font-semibold text-transparent">
          {title}
        </h2>
        <ul className="space-y-4">
          {[
            { name: "Penang Food Festival", date: "May 12, 2025" },
            { name: "Langkawi Jazz Nights", date: "June 8–10, 2025" },
            { name: "Cultural Lantern Parade", date: "August 15, 2025" },
          ].map((event, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-blue-300 shadow-md"
            >
              <span className="font-medium">{event.name}</span>
              <span className="text-sm text-gray-500">{event.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default UpcommingLocalEvents
