const Testimonial = () => {
  const testmonialList = [
    {
      _id: 1,
      username: "Sarah Johnson",
      event: "Wedding Reception",
      comment: ` "Our wedding day was absolutely perfect! The team went above and
          beyond to create the romantic atmosphere we dreamed of. Every detail
          was flawless."`,
      rate: 5,
    },
    {
      _id: 2,
      username: "Michael Chen",
      event: "Corporate Conference",
      comment: `"Our annual conference was a tremendous success thanks to the hotel's
          professional staff and state-of-the-art facilities. The attendees were
          thoroughly impressed."`,
      rate: 5,
    },
    {
      _id: 3,
      username: "Emily Davis",
      event: "Birthday Celebration",
      comment: ` "My 40th birthday party was beyond expectations! The venue was
          stunning, the food exquisite, and the staff made everyone feel
          special. Truly unforgettable!"`,
      rate: 5
    },
  ];

  return (
    <>
      {testmonialList.map((list) => (
        <div className="mx-5 rounded-2xl bg-white p-6 shadow-lg" key={list._id}>
          <div className="mb-4 flex items-center">
            <div className="mr-4 h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
            <div>
              <p className="font-semibold">{list.username}</p>
              <p className="text-blue-600">{list.event}</p>
            </div>
          </div>
          <div className="mb-4 text-4xl text-blue-300">❝</div>
          <blockquote className="mb-4 text-gray-600 italic">
           {list.comment}
          </blockquote>
          <div className="flex">
            {[...Array(list.rate)].map((_, i) => (
              <svg
                key={i}
                className="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      ))}
      {/* Testimonial 1 - Wedding */}
    </>
  );
}

export default Testimonial
