interface GridListProps<T> {
  title: string;
  getName: (item: T) => string;
  getImage: (item: T) => string;
  //! Using <T> makes this component reusable for any type of data—not just hotels or products, but anything.
  list: T[]; //* An array of items of type T.
}


const GridList = <T,>({ title, getName, getImage, list }: GridListProps<T>) => {
  return (
    <div>
      <h2 className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-center text-5xl font-bold text-transparent py-3">
        {title}
      </h2>
      <div className="grid grid-row-1 gap-6 px-4 py-6 sm:grid-cols-2 md:grid-cols-3">
        {list.map((item, index) => {
          const name = getName(item);
          const image = getImage(item);
          return (
            <div
              key={index}
              className="group relative flex items-center justify-center overflow-hidden rounded-lg bg-gray-200 shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <img
                src={image}
                className="h-[250px] w-full object-cover"
                alt={name}
              />

              <div className="absolute inset-0 flex translate-y-10 flex-col items-center justify-center bg-black/40 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <h2 className="mb-2 text-3xl font-bold text-white">
                  {name}
                </h2>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GridList; 
