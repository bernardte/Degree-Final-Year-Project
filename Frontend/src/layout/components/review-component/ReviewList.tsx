import { Reviews } from "@/types/interface.type";
import ReviewCard from "./ReviewCard";
import { useMemo } from "react";

const ReviewList = ({ reviews }: { reviews: Reviews[] }) => {
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  }, [reviews]);

  return (
    <div className="w-full bg-gradient-to-b from-sky-100 via-blue-200 to-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h3 className="text-4xl font-bold text-gray-800 sm:text-5xl">
            <span className="bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              Guest Reviews
            </span>
            <span className="ml-4 text-3xl text-sky-600 sm:text-4xl">
              ({reviews.length})
            </span>
          </h3>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-sky-300 to-blue-400" />
          {reviews.length > 0 && (
            <div className="mt-4 text-lg text-gray-700">
              Average Rating:{" "}
              <span className="text-2xl font-semibold text-amber-500">
                {averageRating.toFixed(1)} ★
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="py-12 text-center">
            <div className="inline-block rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm">
              <div className="animate-pulse text-6xl">💭</div>
              <p className="mt-4 text-xl font-medium text-gray-600">
                No reviews yet.
                <br />
                <span className="text-sky-600">
                  Be the first to share your experience!
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
