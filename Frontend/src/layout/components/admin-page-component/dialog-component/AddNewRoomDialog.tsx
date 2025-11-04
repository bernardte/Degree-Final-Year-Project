import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import roomAmenities from "@/constant/roomAmenities";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import bedTypes from "@/constant/bedTypes";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import {
  UploadCloud,
  Bed,
  User,
  Baby,
  Hash,
  Wifi,
  Snowflake,
  Tv,
  Refrigerator,
  Key,
  Bath,
  Sofa,
  Lamp,
  Bell,
  DoorClosed,
  Ruler,
  Loader2,
  Images,
  X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import useRoomStore from "@/stores/useRoomStore";

interface AddNewRoomDialogProps {
  open: boolean;
  onClose: () => void;
}

// Type definitions
interface RoomData {
  roomNumber: string;
  roomName: string;
  roomType: string;
  roomSize: string;
  pricePerNight: string;
  bedCount: string;
  bedType: string;
  roomDetails: string;
  capacity: {
    Adults: number;
    Children: number;
  };
  breakfastIncluded: boolean;
}

const AddNewRoomDialog = ({ open, onClose }: AddNewRoomDialogProps) => {
  const [roomData, setRoomData] = useState<RoomData>({
    roomNumber: "",
    roomName: "",
    roomType: "",
    roomSize: "",
    pricePerNight: "",
    bedCount: "",
    roomDetails: "",
    bedType: "",
    breakfastIncluded: false,
    capacity: { Adults: 0, Children: 0 },
  });

  const [roomImage, setRoomImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const roomSummary = `${roomData.bedCount} ${roomData.bedType} ${Number(roomData.bedCount) > 1 ? "Beds" : "Bed"} | ${roomData.capacity.Adults} Adult${roomData.capacity.Adults > 1 ? "s" : ""}${roomData.capacity.Children > 0 ? ` & ${roomData.capacity.Children} Child${roomData.capacity.Children > 1 ? "ren" : ""}` : ""} | ${roomData.roomSize} m²`;

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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "adults" || name === "children") {
      setRoomData((prev) => ({
        ...prev,
        capacity: {
          ...prev.capacity,
          [name === "adults" ? "Adults" : "Children"]: Number(value),
        },
      }));
    } else {
      setRoomData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form data
  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!validateForm()) return;

      const formData = new FormData();
      if (roomImage) {
        formData.append("images", roomImage);
      }

      if(galleryImages && galleryImages.length > 0){
        galleryImages.forEach( image => {
          formData.append("galleryImage", image);
        });
      } 

      console.log(roomImage);
      Object.entries(roomData).forEach(([key, value]) => {
        if (key === "capacity") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      formData.append("description", roomSummary);
      formData.append("amenities", selectedAmenities.join(","));
      const response = await axiosInstance.post(
        "/api/admin/add-room",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      showToast("success", "Room added successfully");
      useRoomStore.getState().createNewRoom(response?.data);
      resetForm();
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      if(entry?.isDirectory){
        //* get within file directory file
        const reader = (entry as FileSystemDirectoryEntry).createReader();
        reader.readEntries((entries) => {
          entries.forEach((entry) => {
            //* get each file image
            if (entry.isFile) {
              //* get each file property and save in the setter setGalleryImages
              (entry as FileSystemFileEntry).file(f => {
                setGalleryImages((prev) => [...prev, f as File])
                console.log(typeof f);
              })
            }
          })
        })
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
  }

  // Validate form fields
  const validateForm = () => {
    if (!roomImage) {
      showToast("error", "Please upload a room image");
      return false;
    }

    const requiredFields: (keyof RoomData)[] = [
      "roomNumber",
      "roomName",
      "roomType",
      "pricePerNight",
      "bedCount",
      "bedType",
    ];

    for (const field of requiredFields) {
      if (!roomData[field]) {
        showToast(
          "error",
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
        );
        return false;
      }
    }

    if (roomData.capacity.Adults <= 0 && roomData.capacity.Children <= 0) {
      showToast("error", "Please set room capacity for adults or children");
      return false;
    }

    if (selectedAmenities.length === 0) {
      showToast("error", "Please select at least one room feature");
      return false;
    }

    return true;
  };

  // Reset form state
  const resetForm = () => {
    setRoomData({
      roomNumber: "",
      roomName: "",
      roomType: "",
      roomSize: "",
      pricePerNight: "",
      roomDetails: "",
      bedCount: "",
      bedType: "",
      breakfastIncluded: false,
      capacity: { Adults: 0, Children: 0 },
    });
    setRoomImage(null);
    setSelectedAmenities([]);
    setGalleryImages([]);
  };

  // Handle API errors
  const handleApiError = (error: any) => {
    const message =
      error.response?.data?.message || error.response?.data?.error;
      if(message.includes("Access denied")){
        showToast("warn", error?.response?.data?.message);
      }else{
        showToast("error", error?.response?.data?.error);
      }
  };

  // handle remove image gallery
  const handleRemoveImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0">
          <ScrollArea className="max-h-[95vh] w-full rounded-md border">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-br from-blue-50 to-blue-100"
              >
                {/* Decorative header */}
                <DialogHeader className="bg-blue-600 p-6">
                  <DialogTitle className="flex items-center justify-center gap-2 text-center text-2xl font-bold text-white">
                    <Bed className="h-6 w-6 text-blue-200" />
                    Create New Room
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
                      onChange={(e) => {
                        console.log("Selected file:", e.target.files?.[0]);
                        setRoomImage(e.target.files?.[0] || null);
                      }}
                    />

                    <p className="mt-2 text-sm text-blue-600">
                      {roomImage ? (
                        <>
                          <img
                            src={URL.createObjectURL(roomImage)}
                            alt="room preview"
                            className="object-cover"
                          />
                          <span className="font-medium">{roomImage.name}</span>
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
                        value={roomData.roomName}
                        onChange={handleChange}
                        placeholder="E.g. Deluxe Room"
                      />
                      <FormField
                        icon={<Hash className="h-4 w-4" />}
                        label="Room Number"
                        name="roomNumber"
                        value={roomData.roomNumber}
                        onChange={handleChange}
                        placeholder="E.g. 301"
                      />

                      <FormField
                        icon={<Bed className="h-4 w-4" />}
                        label="Bed Configuration"
                        customInput={
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              name="bedCount"
                              value={roomData.bedCount}
                              onChange={handleChange}
                              placeholder="Bed count"
                              className="border-blue-200"
                            />
                            <Select
                              value={roomData.bedType}
                              onValueChange={(value: string) =>
                                setRoomData((prev) => ({
                                  ...prev,
                                  bedType: value,
                                }))
                              }
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
                        value={roomData.roomType}
                        onChange={handleChange}
                        placeholder="E.g. Deluxe"
                      />
                      <FormField
                        icon={<span className="text-sm">💲</span>}
                        label="Price Per Night"
                        name="pricePerNight"
                        value={roomData.pricePerNight}
                        onChange={handleChange}
                        placeholder="0.00"
                        type="number"
                        min={0}
                        prefix="RM"
                      />
                      <CapacityInputs
                        capacity={roomData.capacity}
                        handleChange={handleChange}
                      />
                    </div>

                    <div>
                      <FormField
                        icon={<Ruler className="h-4 w-4" />}
                        label="Room Size"
                        name="roomSize"
                        value={roomData.roomSize}
                        onChange={handleChange}
                        placeholder="room size"
                        suffix="m²"
                        customInput={undefined}
                        type="text"
                        prefix={undefined}
                      />
                    </div>
                    <label
                      htmlFor="breakfastIncluded"
                      className="mt-5 flex cursor-pointer items-center gap-3 select-none"
                    >
                      <input
                        type="checkbox"
                        id="breakfastIncluded"
                        checked={roomData.breakfastIncluded}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          console.log("Checkbox value:", checked);
                          setRoomData((prev) => ({
                            ...prev,
                            breakfastIncluded: checked,
                          }))
                        }
                        }
                        className="peer sr-only"
                      />

                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${roomData.breakfastIncluded ? "border-blue-600 bg-blue-600" : "border-gray-400"} peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400`}
                      >
                        {roomData.breakfastIncluded && (
                          <svg
                            className="h-3 w-3 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>

                      <span className="text-[16px] font-medium text-blue-600 hover:underline">
                        Breakfast Included
                      </span>
                    </label>
                  </div>
                  {/* Image gallery */}
                  <div>
                    <Label className="mb-2 flex font-medium text-blue-600">
                      <Images className="h-4 w-4" />
                      Room Gallery Images
                    </Label>
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
                        // @ts-ignore
                        webkitdirectory
                        onChange={(e) => {
                          if (e.target.files) {
                            setGalleryImages(Array.from(e.target.files));
                          }
                        }}
                      />
                      <p className="text-sm text-blue-600">
                        {galleryImages.length > 0
                          ? `${galleryImages.length} image${galleryImages.length > 1 ? "s" : ""} selected`
                          : "Click or drag to upload multiple gallery images"}
                      </p>
                    </div>

                    {galleryImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {galleryImages.map((file, idx) => (
                          <div key={idx} className="group relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Gallery ${idx}`}
                              className="h-40 w-full rounded object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        ))}
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
                          value={roomData.roomDetails}
                          onChange={(e) =>
                            setRoomData((prev) => ({
                              ...prev,
                              roomDetails: e.target.value,
                            }))
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
                      onValueChange={setSelectedAmenities}
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
                        resetForm();
                        onClose();
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span>Saving</span>
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        </>
                      ) : (
                        <>
                          <span>Save Room</span>
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              </motion.div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Reusable form field component
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
  min,
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
  min?: number;
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
          min={min}
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
  handleChange,
}: {
  capacity: { Adults: number; Children: number };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
          value={capacity.Adults}
          onChange={handleChange}
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
          value={capacity.Children}
          onChange={handleChange}
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

export default AddNewRoomDialog;
