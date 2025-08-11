const EventOverview = () => {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-8 shadow-md md:p-12">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-800 md:text-4xl">
            Your Vision, Our Expertise
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <p className="mb-4 text-lg text-gray-700">
                At our premier venue, we specialize in creating unforgettable
                experiences for every occasion. Our dedicated team works closely
                with you to bring your vision to life, ensuring every detail is
                perfected.
              </p>
              <p className="mb-6 text-lg text-gray-700">
                From elegant weddings and corporate conferences to intimate
                private parties, our versatile spaces and exceptional service
                ensure your event is flawless.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mt-1 mr-2 text-blue-600">✓</span>
                  <span>
                    Customizable event packages tailored to your needs
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mt-1 mr-2 text-blue-600">✓</span>
                  <span>Professional event planning and coordination</span>
                </li>
                <li className="flex items-start">
                  <span className="mt-1 mr-2 text-blue-600">✓</span>
                  <span>Premium catering with diverse menu options</span>
                </li>
                <li className="flex items-start">
                  <span className="mt-1 mr-2 text-blue-600">✓</span>
                  <span>State-of-the-art audiovisual equipment</span>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-xl">
                <div className="h-48 bg-gradient-to-br from-blue-300 to-cyan-300"></div>
              </div>
              <div className="overflow-hidden rounded-xl">
                <div className="h-48 bg-gradient-to-br from-cyan-300 to-blue-300"></div>
              </div>
              <div className="overflow-hidden rounded-xl">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-400"></div>
              </div>
              <div className="overflow-hidden rounded-xl">
                <div className="h-48 bg-gradient-to-br from-cyan-400 to-blue-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventOverview
