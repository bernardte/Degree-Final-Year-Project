import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";

type RateAndReviewDialog = {
  open: boolean;
  onClose: () => void;
  roomTypes: string[];
  roomIds: string[]; // parallel array of IDs
  bookingReference: string
};

export default function RateReviewDialog({
  open,
  onClose,
  roomTypes,
  roomIds,
  bookingReference,
}: RateAndReviewDialog) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [roomId, setRoomId] = useState<string>(roomIds[0]); // Initialize with the first roomId
  const { showToast } = useToast();
  console.log(bookingReference);

  // reset when opened
  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
      setRating(0);
      setHoverRating(0);
      setReview("");
      setRoomId(roomIds[0]); // Reset roomId when dialog opens
    }
  }, [open, roomIds]);

  const handleSubmit = async () => {
    try {
      await axiosInstance.post(`/api/rooms/room-review/${roomId}`, {
        rating,
        comment: review,
        bookingReference
      });
      showToast("success", "Review added");
      onClose();
    } catch (err: any) {
      showToast("error", err?.response?.data?.error || "Failed to submit");
    }
  };

  const handleRoomSelection = (value: string) => {
    const index = Number(value); // Get the index from the selected value
    setSelectedIndex(index);
    setRoomId(roomIds[index]); // Update the roomId based on selected index
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl bg-gradient-to-br from-white to-blue-50 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题部分美化 */}
        <div className="mb-6 flex items-center justify-between border-b border-blue-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 p-2">
              <Star className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <h2 className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-2xl font-bold text-transparent">
              Rate Your Stay
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 transition-colors hover:bg-red-50"
          >
            <X className="h-6 w-6 text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* 房间选择器美化 */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-blue-600">
            Select Room Type
          </label>
          <Select
            value={String(selectedIndex)}
            onValueChange={handleRoomSelection}
          >
            <SelectTrigger className="w-full rounded-xl border-2 border-blue-100 bg-white/95 py-5 pr-3 pl-4 shadow-sm hover:border-blue-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
              <SelectValue placeholder={roomTypes[selectedIndex]} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 border-blue-100 bg-white/95 backdrop-blur-sm">
              <SelectGroup>
                {roomTypes.map((type, i) => (
                  <SelectItem
                    key={i}
                    value={String(i)}
                    className="rounded-lg px-4 py-3 hover:bg-blue-50 focus:bg-blue-100 capitalize"
                  >
                    <span className="font-medium text-blue-800 capitalize">{type}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* 星级评分美化 */}
        <div className="mb-6 flex flex-col items-center">
          <p className="mb-4 text-sm font-medium text-blue-500">
            How would you rate this room?
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => {
              const active = hoverRating ? hoverRating >= s : rating >= s;
              return (
                <button
                  key={s}
                  className="transition-all duration-200 hover:scale-110 active:scale-95"
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                >
                  <Star
                    className={`h-10 w-10 ${
                      active
                        ? "text-yellow-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]"
                        : "text-gray-300"
                    }`}
                    fill={active ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm font-medium text-blue-600">
            {rating ? `${rating} Star${rating > 1 ? "s" : ""}` : " "}
          </p>
        </div>

        {/* 评论输入美化 */}
        <div className="group relative mb-8">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-100 to-sky-100 opacity-0 transition-opacity group-focus-within:opacity-50" />
          <textarea
            className="relative w-full rounded-xl border-2 border-blue-100 bg-white/95 p-4 text-sm text-blue-900 placeholder-gray-400 shadow-inner backdrop-blur-sm transition-all duration-200 focus:border-blue-200 focus:ring-2 focus:ring-blue-100"
            rows={4}
            placeholder="Share your experience... ✨"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <div className="absolute right-2 -bottom-5 text-xs text-blue-300">
            {review.length}/500
          </div>
        </div>

        {/* 按钮组美化 */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border-2 border-blue-100 bg-white px-6 py-3 font-medium text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || !review.trim()}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-sky-600 hover:shadow-xl disabled:opacity-50"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
