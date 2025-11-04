import { Carousel } from "@/types/interface.type";
import { Upload, X, Loader2, Save } from "lucide-react";
import { Dispatch, SetStateAction, useRef } from "react";

type CarouselCategory = "event" | "facility" | "room" | "homepage";

type NewCarousel = Omit<Carousel, "_id" | "imageUrl"> & {
  image?: File | null;
  imageUrl?: string;
  link?: string;
};

type NewCarouselOptional = Partial<NewCarousel>;

interface CategoryOption {
  id: CarouselCategory;
  label: string;
}

interface AddNewCarouselProps {
  setIsAdding: Dispatch<SetStateAction<boolean>>;
  newItem: NewCarouselOptional;
  setNewItem: Dispatch<SetStateAction<NewCarouselOptional>>;
  categories: CategoryOption[];
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddItem: () => Promise<any | null>;
  carouselIsLoading: boolean;
}

const AddNewCarousel = ({
  setIsAdding,
  newItem,
  setNewItem,
  categories,
  handleFileSelect,
  handleAddItem,
  carouselIsLoading,
}: AddNewCarouselProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add New Slide</h3>
          <button
            onClick={() => setIsAdding(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="col-span-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    category: e.target.value as CarouselCategory,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-cols-1 items-center justify-center">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Carousel Display Order
              </label>
              <input
                type="number"
                min={1}
                max={7}
                className="h-[40px] w-full rounded-lg border border-gray-300 px-2 focus:border-blue-500 focus:ring-blue-500"
                value={newItem.order}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    order: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) =>
                setNewItem({ ...newItem, title: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Image
            </label>
            <div className="flex w-full items-center justify-center">
              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="mb-4 h-8 w-8 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (MAX. 5MB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
              </label>
            </div>
            {newItem.imageUrl && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-gray-600">Preview:</p>
                <img
                  src={newItem.imageUrl}
                  alt="Preview"
                  className="h-40 w-full rounded-md border border-gray-200 object-contain"
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Link URL (optional)
            </label>
            <input
              type="text"
              value={newItem.link}
              onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsAdding(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAddItem}
            disabled={!newItem.imageUrl || carouselIsLoading}
            className={`flex items-center rounded-lg px-4 py-2 text-white ${
              !newItem.imageUrl || carouselIsLoading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {carouselIsLoading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Adding New Slide...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Add Slide
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewCarousel
