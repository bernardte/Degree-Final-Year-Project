type HoverCardProps = {
  list: listItem[];
  title: string;
};

type listItem = {
  image: string;
  title: string;
  description: string;
};

const HoverCard = ({ list, title }: HoverCardProps) => {
  const firstTwo = list.slice(0, 2);
  const remaining = list.slice(2);

  return (
    <div className="space-y-6 px-4 py-1">
      <h2 className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-center text-5xl font-bold text-transparent pb-3">
        {title}
      </h2>
      {/* First Row - Two large images */}
      <div className="grid grid-cols-2 gap-6">
        {firstTwo.map((items, index) => (
          <div
            key={index}
            className="group relative flex items-center -z-1 sm:z-1 justify-center overflow-hidden rounded-lg bg-gray-200 shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <img
              src={items.image}
              className="h-[350px] w-full object-cover"
              alt={items.title}
            />
        
            <div className="absolute inset-0 flex translate-y-10 flex-col items-center justify-center bg-black/40 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <h2 className="mb-2 text-3xl font-bold text-white">
                {items.title}
              </h2>
              <p className="px-4 text-center text-white">{items.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Second Row - Grid of smaller images */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {remaining.map((items, index) => (
          <div
            key={index + 2}
            className="group relative flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <img
              src={items.image}
              className="h-[250px] w-full object-cover"
              alt={items.title}
            />
            <div className="absolute inset-0 flex translate-y-10 flex-col items-center justify-center bg-black/40 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <h2 className="mb-2 text-3xl font-bold text-white">
                {items.title}
              </h2>
              <p className="px-4 text-center text-white">{items.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoverCard;
