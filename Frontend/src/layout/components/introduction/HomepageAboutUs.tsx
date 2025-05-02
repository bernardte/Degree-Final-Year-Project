const HomepageAboutUs = () => {
  return (
    <div>
      <div className="flex items-center justify-around overflow-hidden bg-gradient-to-b from-cyan-400/10 to-transparent px-5 py-10 text-center text-gray-800 md:flex-row md:py-10">
        <div className="m-5 w-1/4 flex-col text-center">
          <span className="relative -z-1 m-auto flex bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-5xl font-bold text-transparent">
            The Seraphine Hotel
            <div className="animate-blink border-r-4 border-blue-300" />
          </span>
        </div>
        <p className="mt-4 w-2/4 text-justify text-lg leading-8 text-zinc-500 hidden md:block">
          Welcome to <span className="font-bold">The Seraphine Hotel</span>,
          where comfort meets elegance in the heart of <strong>Penang</strong>.
          Whether you're traveling for business or leisure, our hotel offers a
          warm and inviting atmosphere with exceptional service to make your
          stay unforgettable. Our modern rooms are designed with your comfort in
          mind, featuring{" "}
          <strong>
            plush bedding, high-speed Wi-Fi, and all the amenities
          </strong>{" "}
          you need to relax and recharge. Enjoy delicious local and
          international cuisine at our in-house restaurant, or unwind at our
          rooftop bar with stunning city views. Located just minutes from
          popular attractions, shopping areas, and transportation hubs,{" "}
          <strong>Seraphine Hotel</strong> is the perfect base for exploring
          everything <strong>George Town</strong> has to offer. We look forward
          to welcoming you soon!
        </p>
      </div>
    </div>
  );
}

export default HomepageAboutUs;
