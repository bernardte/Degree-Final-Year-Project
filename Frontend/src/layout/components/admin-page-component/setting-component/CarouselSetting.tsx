import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  Calendar,
  Building,
  Bed,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Carousel } from "@/types/interface.type";
import useSystemSettingStore from "@/stores/useSystemSettingStore";
import useToast from "@/hooks/useToast";
import AddNewCarousel from "../dialog-component/AddNewCarouselDialog";
import EditCarouselDialog from "../dialog-component/EditCarouselDialog";

type CarouselCategory = "event" | "facility" | "room" | "homepage";
type EditCarousel = Omit<Carousel, "imageUrl"> & {
  image?: File | null;
  imageUrl?: string;
};

type EditCarouselOptional = Partial<EditCarousel>;

const CarouselSetting = () => {
  const [activeCategory, setActiveCategory] =
    useState<CarouselCategory>("homepage");
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<EditCarouselOptional | null>(
    null,
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Carousel>>({
    title: "",
    description: "",
    imageUrl: "",
    image: null,
    link: "",
    category: "homepage",
    order: 0,
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const {
    fetchAllCarousel,
    createNewCarousel,
    updateCertainCarousel,
    deleteCertainCarousel,
    carousel,
    carouselError,
    carouselIsLoading,
    carouselErrorType,
  } = useSystemSettingStore((state) => state);
  const { showToast } = useToast();
  const lastErrorRef = useRef<string | null>(null);

  useEffect(() => {
    fetchAllCarousel(activeCategory);
  }, [fetchAllCarousel, activeCategory]);

  // Filter items by active category
  const categoryItems = carousel
    .filter((item) => item.category === activeCategory)
    .sort((a, b) => a.order - b.order);

  // Handle file selection for new item
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setNewItem({
        ...newItem,
        image: file,
        imageUrl,
      });
    }
  };

  // Handle file selection for editing item
  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/") && editingItem) {
      const imageUrl = URL.createObjectURL(file);
      setEditingItem({
        ...editingItem,
        image: file,
        imageUrl,
      });
    }
  };

  // Handle adding a new carousel item
  const handleAddItem = async () => {
    if (
      !newItem.title ||
      !newItem.image ||
      !newItem.description ||
      !newItem.category ||
      !newItem.order
    )
      return;
    const response = await createNewCarousel(
      newItem.title,
      newItem.description,
      newItem.image,
      newItem.category,
      newItem.order,
      newItem.link,
    );

    if (response) {
      showToast("success", "Successfully added new slide");

      setNewItem({
        title: "",
        description: "",
        image: null,
        category: "homepage",
        order: 1,
        link: "",
      });
    }

    return;
  };

  // Handle editing an existing carousel item
  const handleEditItem = async () => {
    if (!editingItem || !editingItem._id) return;

    const response = await updateCertainCarousel(editingItem._id, {
      title: editingItem.title,
      description: editingItem.description,
      link: editingItem.link,
      category: editingItem.category,
      order: editingItem.order,
      imageFile:
        editingItem.image instanceof File ? editingItem.image : undefined,
    });

    if (response) {
      showToast(
        "success",
        `Carousel ${response.category} updated successfully`,
      );
    }

    setIsEditing(false);
    setEditingItem(null);

    // Reset file input
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  //handle delete of existing carousel item
  const handleDeleteItem = async (carouselId: string) => {
    const response = await deleteCertainCarousel(carouselId);

    if (response) {
      showToast("success", "Carousel item delete successfully");
    }

    prevSlide();
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
    { id: "room", label: "Rooms & Suites", icon: <Bed size={18} /> },
    { id: "facility", label: "Facilities", icon: <Building size={18} /> },
    { id: "event", label: "Events", icon: <Calendar size={18} /> },
  ];

  useEffect(() => {
    if (!carouselError || lastErrorRef.current === carouselError) return;

    if (carouselErrorType === "accessDenied") {
      showToast("warn", carouselError);
    } else if (carouselErrorType === "serverError") {
      showToast("error", carouselError);
    }

    lastErrorRef.current = carouselError
  }, [carouselError, carouselErrorType, showToast]);

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
      <CarouselPreview
        categoryItems={categoryItems}
        currentSlide={currentSlide}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        setCurrentSlide={setCurrentSlide}
      />

      {/* Carousel Items List */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-900">Slides</h3>

        {categoryItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <ImageIcon className="mx-auto mb-3 text-gray-400" size={32} />
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
                key={item._id}
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
                    onClick={() => handleDeleteItem(item._id)}
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
        <AddNewCarousel
          setIsAdding={setIsAdding}
          newItem={newItem}
          setNewItem={setNewItem}
          categories={categories}
          handleFileSelect={handleFileSelect}
          handleAddItem={handleAddItem}
          carouselIsLoading={carouselIsLoading}
        />
      )}

      {/* Edit Modal */}
      {isEditing && editingItem && (
        <EditCarouselDialog
          setIsEditing={setIsEditing}
          setEditingItem={setEditingItem}
          editingItem={editingItem}
          categories={categories}
          handleEditFileSelect={handleEditFileSelect}
          handleEditItem={handleEditItem}
          carouselIsLoading={carouselIsLoading}
          editFileInputRef={editFileInputRef}
        />
      )}
    </div>
  );
};

export default CarouselSetting;

const CarouselPreview = ({
  categoryItems,
  currentSlide,
  prevSlide,
  nextSlide,
  setCurrentSlide,
}: {
  categoryItems: Carousel[];
  currentSlide: number;
  prevSlide: () => void;
  nextSlide: () => void;
  setCurrentSlide: Dispatch<SetStateAction<number>>;
}) => {
  const handleButtonClick = (link: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!link) return;

    if (link.startsWith("http://") || link.startsWith("https://")) {
      // External links
      window.open(link);
    } else {
      // Internal routing, automatically fill in "/"
      window.location.href = link.startsWith("/") ? link : `/${link}`;
    }
  };

  return (
    <div className="mb-8 rounded-xl border border-gray-200 p-4">
      <h3 className="mb-4 text-lg font-medium text-gray-900">Preview</h3>

      {categoryItems.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
          <div className="text-center">
            <ImageIcon size={32} className="mx-auto mb-2 text-gray-400" />
            <p>No slides available for this category</p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-lg bg-gray-100">
          <div className="relative h-80">
            {categoryItems.map((item, index) => (
              <div
                key={item._id}
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
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-blue-900/80 to-transparent">
                  <div className="relative left-10 mx-auto w-full max-w-7xl px-6 py-16 text-center md:text-left">
                    {/* header */}
                    <h1 className="mb-4 text-4xl font-extrabold text-white drop-shadow-lg md:text-5xl">
                      {item.title}
                    </h1>
                    {/* description */}
                    <p className="mb-6 max-w-3xl text-lg text-blue-100 drop-shadow-md md:text-xl">
                      {item.description}
                    </p>
                    {/* button */}
                    {item.link && (
                      <button
                        onClick={(e) => handleButtonClick(item.link, e)}
                        className="group hover:shadow-3xl relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:from-blue-700 hover:to-indigo-800"
                      >
                        <span className="relative">Explore More</span>
                        <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        <div className="absolute inset-0 h-full w-full -translate-x-full transform bg-white/10 transition-transform duration-1000 group-hover:translate-x-full"></div>
                      </button>
                    )}
                  </div>
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
  );
};
