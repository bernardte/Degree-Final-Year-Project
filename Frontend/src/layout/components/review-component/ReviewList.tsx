import { Reviews } from "@/types/interface.type"
import ReviewCard from "./ReviewCard";


const ReviewList = ({ reviews }: { reviews: Reviews[] }) => {
 return (
    <div className="w-full bg-gradient-to-b from-sky-100 via-blue-200 to-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
            <h3 className="text-4xl font-bold text-gray-800 sm:text-5xl">
            <span className="bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                Guest Reviews
            </span>
            <span className="ml-4 text-3xl text-sky-600 sm:text-4xl">
                ({reviews.length})
            </span>
            </h3>
            <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-sky-300 to-blue-400" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
            ))}
        </div>

        {reviews.length === 0 && (
            <div className="py-12 text-center">
            <div className="inline-block rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm">
                <div className="text-6xl animate-pulse">💭</div>
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