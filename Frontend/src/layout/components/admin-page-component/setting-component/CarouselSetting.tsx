import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Image,
  Save,
  X,
  Calendar,
  Building,
  Bed,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Type definitions
export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  category: CarouselCategory;
  order: number;
}

export type CarouselCategory = "event" | "facility" | "room" | "homepage";

interface CarouselSettingProps {
  carouselItems: CarouselItem[];
  onItemsUpdate: (items: CarouselItem[]) => void;
}

const CarouselSetting: React.FC<CarouselSettingProps> = ({
  carouselItems,
  onItemsUpdate,
}) => {
  const [activeCategory, setActiveCategory] =
    useState<CarouselCategory>("homepage");
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<CarouselItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<CarouselItem>>({
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    category: "homepage",
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter items by active category
  const categoryItems = carouselItems
    .filter((item) => item.category === activeCategory)
    .sort((a, b) => a.order - b.order);

  // Handle adding a new carousel item
  const handleAddItem = () => {
    if (!newItem.title || !newItem.imageUrl) return;

    const item: CarouselItem = {
      id: Date.now().toString(),
      title: newItem.title || "",
      description: newItem.description || "",
      imageUrl: newItem.imageUrl || "",
      link: newItem.link,
      category: newItem.category || "homepage",
      order: categoryItems.length,
    };

    onItemsUpdate([...carouselItems, item]);
    setIsAdding(false);
    setNewItem({
      title: "",
      description: "",
      imageUrl: "",
      link: "",
      category: "homepage",
    });
  };

  // Handle editing an existing carousel item
  const handleEditItem = () => {
    if (!editingItem) return;

    const updatedItems = carouselItems.map((item) =>
      item.id === editingItem.id ? editingItem : item,
    );

    onItemsUpdate(updatedItems);
    setIsEditing(false);
    setEditingItem(null);
  };

  // Handle deleting a carousel item
  const handleDeleteItem = (id: string) => {
    const updatedItems = carouselItems.filter((item) => item.id !== id);
    onItemsUpdate(updatedItems);
  };

  // Navigation between slides
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === categoryItems.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? categoryItems.length - 1 : prev - 1,
    );
  };

  // Category configuration
  const categories: {
    id: CarouselCategory;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: "homepage", label: "Homepage", icon: <Home size={18} /> },
    { id: "event", label: "Events", icon: <Calendar size={18} /> },
    { id: "facility", label: "Facilities", icon: <Building size={18} /> },
    { id: "room", label: "Rooms & Suites", icon: <Bed size={18} /> },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Carousel Management
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          Add New Slide
        </button>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setCurrentSlide(0);
              }}
              className={`flex items-center rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel Preview */}
      <div className="mb-8 rounded-xl border border-gray-200 p-4">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Preview</h3>

        {categoryItems.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
            <div className="text-center">
              <Image size={32} className="mx-auto mb-2 text-gray-400" />
              <p>No slides available for this category</p>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-lg bg-gray-100">
            <div className="relative h-60">
              {categoryItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-transform duration-500 ${
                    index === currentSlide
                      ? "translate-x-0"
                      : index < currentSlide
                        ? "-translate-x-full"
                        : "translate-x-full"
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {categoryItems.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Slide Indicators */}
            {categoryItems.length > 1 && (
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-2">
                {categoryItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 w-2 rounded-full ${
                      index === currentSlide ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Carousel Items List */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-900">Slides</h3>

        {categoryItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <Image className="mx-auto mb-3 text-gray-400" size={32} />
            <p className="text-gray-500">No slides in this category yet</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Add your first slide
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {categoryItems.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="mb-3 h-40 overflow-hidden rounded-md">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="mb-1 font-medium text-gray-900">{item.title}</h4>
                <p className="mb-3 text-sm text-gray-600">{item.description}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsEditing(true);
                    }}
                    className="flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="flex items-center rounded-md bg-red-100 px-3 py-1.5 text-sm text-red-700 hover:bg-red-200"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
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
              <div>
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
                  Image URL
                </label>
                <input
                  type="text"
                  value={newItem.imageUrl}
                  onChange={(e) =>
                    setNewItem({ ...newItem, imageUrl: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Link URL (optional)
                </label>
                <input
                  type="text"
                  value={newItem.link}
                  onChange={(e) =>
                    setNewItem({ ...newItem, link: e.target.value })
                  }
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
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Save size={18} className="mr-2" />
                Add Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
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
              <div>
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
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingItem.imageUrl}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, imageUrl: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
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
                onClick={handleEditItem}
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Save size={18} className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselSetting;
