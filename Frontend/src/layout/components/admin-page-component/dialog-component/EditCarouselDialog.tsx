import { Carousel } from "@/types/interface.type";
import { Loader2, Save, Upload, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react"

type CarouselCategory = "event" | "facility" | "room" | "homepage";

type EditCarousel = Omit<Carousel, "_id" | "imageUrl"> & {
  image?: File | null;
  imageUrl?: string;
  link?: string;
};

type EditCarouselOptional = Partial<EditCarousel>;

interface CategoryOption {
  id: CarouselCategory;
  label: string;
}

interface EditCarouselDialog {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setEditingItem: Dispatch<SetStateAction<EditCarouselOptional | null>>;
  editingItem: EditCarouselOptional;
  categories: CategoryOption[];
  handleEditFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditItem: () => Promise<any | null>;
  carouselIsLoading: boolean;
  editFileInputRef: React.RefObject<HTMLInputElement | null>; 
}

const EditCarouselDialog = ({
  setIsEditing,
  setEditingItem,
  editingItem,
  categories,
  handleEditFileSelect,
  handleEditItem,
  carouselIsLoading,
  editFileInputRef,
}: EditCarouselDialog) => {


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Slide</h3>
          <button
            onClick={() => setIsEditing(false)}
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
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
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
                value={editingItem.order}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
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
              value={editingItem.title}
              onChange={(e) =>
                setEditingItem({ ...editingItem, title: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={editingItem.description}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  description: e.target.value,
                })
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
                  id="edit-dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={editFileInputRef}
                  onChange={handleEditFileSelect}
                />
              </label>
            </div>
            {editingItem.imageUrl && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-gray-600">Current Image:</p>
                <img
                  src={editingItem.imageUrl}
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
              value={editingItem.link || ""}
              onChange={(e) =>
                setEditingItem({ ...editingItem, link: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsEditing(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={carouselIsLoading}
            onClick={handleEditItem}
            className={`flex items-center rounded-lg px-4 py-2 ${!carouselIsLoading ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-500 text-white"}`}
          >
            {carouselIsLoading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCarouselDialog
