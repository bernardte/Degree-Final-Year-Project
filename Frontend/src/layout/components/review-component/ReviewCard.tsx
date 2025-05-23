import { Reviews } from "@/types/interface.type";

const ReviewCard = ({ review }: { review: Reviews }) => {
  const avatarGradients = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-amber-500",
    "from-red-500 to-rose-500",
  ];
  const randomGradient =
    avatarGradients[Math.floor(Math.random() * avatarGradients.length)];

  return (
    <div className="group relative">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 opacity-0 blur-md transition group-hover:opacity-100"></div>
      <div className="relative transform rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <div className="mb-4 flex items-start gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${randomGradient} text-lg font-bold text-white shadow-md`}
          >
            {review.username?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-semibold text-gray-800">
                {review.username}
              </p>
              <span className="text-sm text-gray-400">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <RenderStarHelper rating={review.rating} />
              <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                {review.rating}★
              </span>
            </div>
          </div>
        </div>

        <p className="relative mt-4 pl-6 text-lg text-gray-700 italic before:absolute before:top-0 before:left-0 before:text-4xl before:text-sky-400 before:content-['“'] after:text-4xl after:text-sky-400 after:content-['”']">
          {review.comment}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;

const RenderStarHelper = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`h-5 w-5 transition-colors ${
            index < rating ? "text-amber-400" : "text-gray-300"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 1.618l2.175 4.707 5.05.367-3.86 3.445 1.127 5.04L10 12.382 5.508 15.17l1.127-5.04-3.86-3.445 5.05-.367L10 1.618z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};
