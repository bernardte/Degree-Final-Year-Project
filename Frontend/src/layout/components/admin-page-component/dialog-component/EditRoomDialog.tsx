import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SetStateAction, useEffect, useState } from "react";
import { Room } from "@/types/interface.type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Baby, Bed, DoorClosed, Hash, Loader, UploadCloud, User, Snowflake, Tv, Refrigerator, Bath, Bell, Key, Sofa, Lamp, Wifi, Ruler, Images, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import bedTypes from "@/constant/bedTypes";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import roomAmenities from "@/constant/roomAmenities";
import getImageSrc from "@/utils/getImageSrc";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import useRoomStore from "@/stores/useRoomStore";


interface editRoomDialogProps {
  isEditModalOpen: boolean;
  editLoading: boolean;
  selectedRoom: Room | null;
  setIsEditModalOpen: React.Dispatch<SetStateAction<boolean>>;
  setSelectedRoom: React.Dispatch<SetStateAction<Room | null>>;
  handleEdit: (e: React.FormEvent) => Promise<void>;
  handleEditChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  setGalleryImages: React.Dispatch<React.SetStateAction<File[]>>;
  galleryImages: File[];
}

const EditRoomDialog = ({
  handleEdit,
  editLoading,
  handleEditChange,
  selectedRoom,
  setSelectedRoom,
  isEditModalOpen,
  setIsEditModalOpen,
  setGalleryImages, 
  galleryImages,
}: editRoomDialogProps) => {
  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Wifi,
    Snowflake,
    Tv,
    Refrigerator,
    Bath,
    Bell,
    Key,
    Sofa,
    Lamp,
  };

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    selectedRoom?.amenities || [],
  );
  const [localBedCount, setLocalBedCount] = useState<string>(
    selectedRoom?.description
      .split(" | ")
      ?.find((item) => /(bed || beds)/i.test(item))
      ?.split(" ")?.[0] ?? "",
  );
  const [localRoomSize, setLocalRoomSize] = useState<string>(
    selectedRoom?.description
      .split(" | ")
      ?.find((item) => /m²/i.test(item))
      ?.split(" ")?.[0] ?? "",
  );
  const [localBedType, setLocalBedType] = useState<Room["bedType"] | undefined>(
    selectedRoom?.bedType,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (selectedRoom) {
      setSelectedAmenities(selectedRoom?.amenities || []);
      setLocalBedCount(
        selectedRoom?.description
          ?.split(" | ")
          ?.find((item) => /bed/i.test(item))
          ?.split(" ")?.[0] || "",
      );
      setLocalRoomSize(
        selectedRoom?.description
          ?.split(" | ")
          ?.find((item) => /m²/i.test(item))
          ?.split(" ")?.[0] || "",
      );
      setLocalBedType(selectedRoom?.bedType);
    }
  }, [selectedRoom]);
  

  const updateDescription = (
    newBedCount: string = localBedCount,
    newRoomSize: string = localRoomSize,
  ) => {
    const parts = selectedRoom?.description?.split(" | ") || [];
    const updatedParts = parts.map((part) => {
      if (/bed/i.test(part)) {
        return `${newBedCount} bed`; // Basic update, refine as needed
      }
      if (/m²/i.test(part)) {
        return `${newRoomSize} m²`;
      }
      return part;
    });
    const newDescription = updatedParts.join(" | ");
    setSelectedRoom((prev) =>
      prev ? { ...prev, description: newDescription } : prev,
    );
  };

  const handleLocalBedCountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLocalBedCount(e.target.value);
    updateDescription(e.target.value, localRoomSize);
  };

  const handleLocalRoomSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLocalRoomSize(e.target.value);
    updateDescription(localBedCount, e.target.value);
  };

  const handleBedTypeChange = (value: string) => {
    setLocalBedType(value as Room["bedType"]);
    setSelectedRoom((prev) =>
      prev ? { ...prev, bedType: value as Room["bedType"] } : prev,
    );
  };

  //drag and drop image gallery
  const handleOnDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleOnDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleOnDrop = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const items = e.dataTransfer.items;
    Array.from(items).forEach((item) => {
      //!get entry file item
      const entry = item.webkitGetAsEntry();
      //* get file directory
      if (entry?.isDirectory) {
        //* get within file directory file
        const reader = (entry as FileSystemDirectoryEntry).createReader();
        reader.readEntries((entries) => {
          entries.forEach((entry) => {
            //* get each file image
            if (entry.isFile) {
              //* get each file property and save in the setter setGalleryImages
              (entry as FileSystemFileEntry).file((f) => {
                setGalleryImages((prev) => [...prev, f as File]);
                console.log(typeof f);
              });
            }
          });
        });
      } else {
        // get file
        if (entry && entry.isFile) {
          (entry as FileSystemFileEntry).file((f) => {
            setGalleryImages((prev) => [...prev, f as File]);
            console.log(f);
          });
        }
      }
    });
  };


  // handle remove image gallery
  const handleRemoveImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImageGallery = async (roomId: string, index: number) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/api/admin/delete-room-image-gallery/${roomId}`,
        {
          data: { imageIndex: index },
        },
      );
      if (response?.data) {
        console.log("delete: ", response?.data);
        setSelectedRoom((prev) =>
          prev ? { ...prev, images: prev.images.filter((_, i) => i !== index) } : prev,
        );
        if(selectedRoom?._id){
          useRoomStore.getState().removeRoomImage(roomId, index);
        }
      }
    } catch (error: any) {
      const messages = error?.response?.data?.message || error?.response?.data?.error;
      if(messages.includes("Access denied")){
        showToast("warn", error?.response?.data?.message);
      }
      showToast("error", error?.response?.data?.error);
    }finally{
      setIsLoading(false);
    }
  }

  // const handleUploadImageGallery = async (roomId: string) => {
  //   setIsLoading(true);
  //   try{
  //     const formData = new FormData();
  //     galleryImages.forEach((file) => formData.append("galleryImages[]", file));
  //     const response = await axiosInstance.patch("/api/admin/updateImageGallery/" + roomId, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       }
  //     });
  //     if (response?.data) {
  //       setSelectedRoom((prev) => prev ? {...prev, images: response?.data.images} : prev);
  //     }
  //   }catch(error: any){
  //     showToast("error", error?.response?.data?.error);
  //   }finally{
  //     setIsLoading(false);
  //   }
  // }

  return (
    <>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0">
          <ScrollArea className="max-h-[95vh] w-full rounded-md border">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-br from-blue-50 to-blue-100"
              >
                {/* Decorative header */}
                <DialogHeader className="bg-blue-600 p-6">
                  <DialogTitle className="flex items-center justify-center gap-2 text-center text-2xl font-bold text-white">
                    <Bed className="h-6 w-6 text-blue-200" />
                    Edit Room
                  </DialogTitle>
                </DialogHeader>

                {/* Main form content */}
                <div className="space-y-6 p-6">
                  {/* Image upload section */}
                  <div className="group relative cursor-pointer rounded-xl border-2 border-dashed border-blue-200 bg-white p-8 text-center transition-colors hover:border-blue-400">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        setSelectedRoom((prev) =>
                          prev && file
                            ? {
                                ...prev,
                                images: [
                                  file,
                                  ...(Array.isArray(prev.images)
                                    ? prev.images.slice(1)
                                    : []),
                                ],
                              }
                            : prev,
                        );
                      }}
                    />

                    <p className="mt-2 text-sm text-blue-600">
                      {selectedRoom?.images ? (
                        <>
                          <img
                            src={getImageSrc(selectedRoom.images)}
                            alt="room preview"
                            className="object-cover"
                          />
                          <span className="font-medium">
                            {selectedRoom?.roomName}
                          </span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="mx-auto h-12 w-12 text-blue-400 transition-colors group-hover:text-blue-600" />
                          <span>Drag & drop or click to upload room photo</span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Grid layout for form fields */}
                  <div className="grid grid-cols-1 items-center justify-center gap-6 md:grid-cols-2">
                    {/* Left column */}
                    <div>
                      <FormField
                        icon={<DoorClosed className="h-4 w-4" />}
                        label="Room "
                        name="roomName"
                        value={selectedRoom?.roomName}
                        onChange={handleEditChange}
                        placeholder="E.g. Deluxe Room"
                      />
                      <FormField
                        icon={<Hash className="h-4 w-4" />}
                        label="Room Number"
                        name="roomNumber"
                        value={selectedRoom?.roomNumber}
                        onChange={handleEditChange}
                        placeholder="E.g. 301"
                      />

                      <FormField
                        icon={<Bed className="h-4 w-4" />}
                        label="Bed Configuration"
                        customInput={
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              name="bedCount"
                              value={localBedCount}
                              onChange={handleLocalBedCountChange}
                              placeholder="Bed count"
                              className="border-blue-200"
                            />
                            <Select
                              value={localBedType}
                              onValueChange={handleBedTypeChange}
                            >
                              <SelectTrigger className="border-blue-200">
                                <SelectValue placeholder="Bed type" />
                              </SelectTrigger>
                              <SelectContent className="border-blue-200">
                                {bedTypes.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                    className="hover:bg-blue-50"
                                  >
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        }
                      />
                    </div>

                    {/* Right column */}
                    <div>
                      <FormField
                        icon={<Bed className="h-4 w-4" />}
                        label="Room Type"
                        name="roomType"
                        value={selectedRoom?.roomType}
                        onChange={handleEditChange}
                        placeholder="E.g. Deluxe"
                      />
                      <FormField
                        icon={<span className="text-sm">💲</span>}
                        label="Price Per Night"
                        name="pricePerNight"
                        value={String(selectedRoom?.pricePerNight)}
                        onChange={handleEditChange}
                        placeholder="0.00"
                        type="number"
                        prefix="RM"
                      />
                      <CapacityInputs
                        capacity={{
                          adults: selectedRoom?.capacity?.adults ?? 1,
                          children: selectedRoom?.capacity?.children ?? 0,
                        }}
                        setSelectedRoom={setSelectedRoom}
                        handleEditChange={handleEditChange}
                      />
                    </div>

                    <div>
                      <FormField
                        icon={<Ruler className="h-4 w-4" />}
                        label="Room Size"
                        name="roomSize"
                        value={localRoomSize}
                        onChange={handleLocalRoomSizeChange}
                        placeholder="room size"
                        suffix="m²"
                        customInput={undefined}
                        type="text"
                        prefix={undefined}
                      />
                    </div>
                  </div>
                  {/* Image Gallery Section */}
                  <div>
                    <Label className="mb-2 flex font-medium text-blue-600">
                      <Images className="mr-2 h-4 w-4" />
                      Room Gallery Images
                    </Label>

                    {/* Dropzone / File Upload */}
                    <div
                      onDragEnter={handleOnDragEnter}
                      onDragOver={handleOnDragOver}
                      onDragLeave={handleOnDragLeave}
                      onDrop={handleOnDrop}
                      className={`group relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${isDragging ? "border-gray-500 bg-blue-50" : "border-blue-200 bg-white"} hover:border-blue-400`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={(e) => {
                          const files = e.target.files
                            ? Array.from(e.target.files)
                            : [];
                          if (files.length > 0) {
                            setGalleryImages((prev) => [...prev, ...files]);
                          }
                          e.target.value = ""; // ✅ 清空 input
                        }}
                      />
                      <p className="text-sm text-blue-600">
                        {Array.isArray(selectedRoom?.images)
                          ? galleryImages.length
                          : 0}{" "}
                        image
                        {(Array.isArray(galleryImages)
                          ? galleryImages.length - 1
                          : 0) !== 1
                          ? "s"
                          : ""}{" "}
                        selected
                      </p>
                    </div>

                    {/* Preview Image Gallery */}
                    {selectedRoom && (
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {/* Database gallery images (skip cover image at index 0) */}
                        {Array.isArray(selectedRoom?.images) &&
                          selectedRoom.images
                            .slice(1)
                            .filter(
                              (img): img is string => typeof img === "string",
                            ) // filter string
                            .map((image, idx) => (
                              <div
                                key={`db-gallery-${idx}`}
                                className="group relative"
                              >
                                <img
                                  src={image}
                                  alt={`Gallery DB ${idx + 1}`}
                                  className="h-40 w-full rounded object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveExistingImageGallery(
                                      selectedRoom._id,
                                      idx + 1,
                                    )
                                  }
                                  disabled={isLoading}
                                  className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}

                        {/* Local uploaded images */}
                        {galleryImages.map((file, idx) => {
                          const url = URL.createObjectURL(file);
                          return (
                            <div
                              key={`local-gallery-${idx}`}
                              className="group relative"
                            >
                              <img
                                src={url}
                                alt={`Gallery Local ${idx + 1}`}
                                className="h-40 w-full rounded object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                disabled={isLoading}
                                className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <FormField
                      icon={<Bell className="h-4 w-4" />}
                      label="Room Details"
                      customInput={
                        <Textarea
                          name="roomDetails"
                          value={selectedRoom?.roomDetails}
                          onChange={(e) =>
                            setSelectedRoom((prev) =>
                              prev
                                ? { ...prev, roomDetails: e.target.value }
                                : prev,
                            )
                          }
                          placeholder="Describe the room (e.g. Ocean view, spacious balcony...)"
                          className="border-blue-200"
                        />
                      }
                    />
                  </div>

                  {/* Amenities selector */}
                  <div>
                    <Label className="pb-3 font-medium text-blue-800">
                      Room Amenities
                    </Label>
                    <ToggleGroup
                      type="multiple"
                      value={selectedAmenities}
                      onValueChange={(value: string[]) => {
                        setSelectedAmenities(value);
                        setSelectedRoom((prev) =>
                          prev
                            ? {
                                ...prev,
                                amenities: value as Room["amenities"],
                              }
                            : prev,
                        );
                      }}
                      className="flex flex-wrap gap-3"
                    >
                      {roomAmenities.map((amenity) => {
                        const Icon = iconMap[amenity.icon];
                        return (
                          <div className="flex-wrap-word flex">
                            <ToggleGroupItem
                              key={amenity.value}
                              value={amenity.value}
                              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                                selectedAmenities.includes(amenity.value)
                                  ? "border-blue-500 bg-blue-100 text-blue-700"
                                  : "border-gray-300"
                              }`}
                            >
                              {Icon && <Icon className="h-4 w-4" />}
                              {amenity.label}
                            </ToggleGroupItem>
                          </div>
                        );
                      })}
                    </ToggleGroup>
                  </div>

                  {/* Save & Cancel buttons */}
                  <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditModalOpen(false);
                      }}
                      disabled={editLoading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleEdit} disabled={editLoading}>
                      {editLoading && (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Room
                    </Button>
                  </DialogFooter>
                </div>
              </motion.div>
            </motion.div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

const FormField = ({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  suffix,
  customInput,
}: {
  icon: React.ReactNode;
  label: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  suffix?: string;
  customInput?: React.ReactNode;
}) => (
  <motion.div
    className="space-y-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Label className="flex items-center gap-2 font-medium text-blue-600">
      {icon}
      {label}
    </Label>
    {customInput || (
      <div className="relative">
        {prefix && (
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-blue-400">
            {prefix}
          </span>
        )}
        <Input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className={`border-blue-200 focus:border-blue-400 ${prefix ? "pl-10" : ""} ${suffix ? "pr-10" : ""}`}
        />
        {suffix && (
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-blue-400">
            {suffix}
          </span>
        )}
      </div>
    )}
  </motion.div>
);

// Capacity inputs component
const CapacityInputs = ({
  capacity,
  setSelectedRoom,
}: {
  capacity: { adults: number; children: number };
  setSelectedRoom: React.Dispatch<SetStateAction<Room | null>>;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <motion.div
    className="space-y-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
  >
    <Label className="flex items-center gap-2 font-medium text-blue-600">
      <User className="h-4 w-4" />
      Occupancy
    </Label>
    <div className="grid grid-cols-2 gap-4">
      <div className="relative">
        <Input
          name="adults"
          value={capacity.adults}
          onChange={(e) =>
            setSelectedRoom((prev) =>
              prev
                ? {
                    ...prev,
                    capacity: {
                      ...prev.capacity,
                      adults:
                        e.target.name === "adults"
                          ? Number(e.target.value)
                          : prev.capacity.adults,
                    },
                  }
                : prev,
            )
          }
          type="number"
          max={4}
          min={1}
          placeholder="Adults"
          className="border-blue-200 pl-10"
        />
        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-400" />
      </div>
      <div className="relative">
        <Input
          name="children"
          value={capacity.children}
          onChange={(e) =>
            setSelectedRoom((prev) =>
              prev
                ? {
                    ...prev,
                    capacity: {
                      ...prev.capacity,
                      children:
                        e.target.name === "children"
                          ? Number(e.target.value)
                          : prev.capacity.children,
                    },
                  }
                : prev,
            )
          }
          type="number"
          placeholder="Children"
          min={0}
          className="border-blue-200 pl-10"
        />
        <Baby className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-blue-400" />
      </div>
    </div>
  </motion.div>
);

export default EditRoomDialog;
