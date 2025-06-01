import { Reviews } from "@/types/interface.type";
import ReviewCard from "./ReviewCard";
import { useMemo } from "react";
import { CloudMoon, Star } from "lucide-react";

const ReviewList = ({ reviews }: { reviews: Reviews[] }) => {
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  }, [reviews]);

  return (
    <div className="w-full bg-gradient-to-b from-sky-50 to-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header section with improved styling */}
        <div className="mb-12 text-center">
          <div className="inline-block rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 shadow-sm">
            <h3 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Guest Reviews
              <span className="ml-4 text-3xl text-blue-600 sm:text-4xl">
                ({reviews.length})
              </span>
            </h3>
            
            <div className="mx-auto mt-4 h-1 w-32 rounded-full bg-gradient-to-r from-blue-300 to-indigo-400" />
            
            {reviews.length > 0 && (
              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center rounded-full bg-amber-500/10 px-6 py-2 text-amber-700">
                  <Star className="mr-2 h-5 w-5 fill-amber-500 stroke-amber-500" />
                  <span className="text-2xl font-bold">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="ml-1 text-lg font-medium">/5.0</span>
                </div>
                <span className="ml-4 text-lg text-gray-600">
                  Average Rating
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Reviews grid with beautiful cards */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        {/* Empty state with improved design */}
        {reviews.length === 0 && (
          <div className="py-12 text-center">
            <div className="inline-block rounded-2xl bg-white p-8 shadow-xl">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <CloudMoon className="h-12 w-12 animate-pulse" />
              </div>
              <p className="mt-6 text-xl font-medium text-gray-700">
                No reviews yet
              </p>
              <p className="mt-2 text-blue-600">
                Be the first to share your experience!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;