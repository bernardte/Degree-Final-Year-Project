import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, Building2, } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import getImageSrc from "@/utils/getImageSrc";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import useFacilityStore from "@/stores/useFacilityStore";

const AddNewFacilityDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [selectedFacility, setSelectedFacility] = useState({
    image: null as File | null,
    facilitiesName: "",
    description: "",
    openTime: "",
    closeTime: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!open) {
      setSelectedFacility({
        image: null,
        facilitiesName: "",
        description: "",
        openTime: "",
        closeTime: "",
      });
    }
  }, [open]);

  const handleCreateFacility = async () => {
    if (
      !selectedFacility.facilitiesName ||
      !selectedFacility.description ||
      !selectedFacility.openTime ||
      !selectedFacility.closeTime ||
      !selectedFacility.image
    ) {
     showToast("error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      if (selectedFacility.image) {
        formData.append("image", selectedFacility.image);
      }
      formData.append("facilitiesName", selectedFacility.facilitiesName);
      formData.append("description", selectedFacility.description);
      formData.append("openTime", selectedFacility.openTime);
      formData.append("closeTime", selectedFacility.closeTime);

      const response = await axiosInstance.post("/api/facilities/create-facility", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(response?.data){
        showToast("success", response?.data?.message);
        useFacilityStore.getState().createFacility(response?.data?.facility);
      }
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.response?.data?.error;
      if(message.includes("access denied")){
        showToast("error", error?.response?.data?.message);
      }
      showToast("error", error?.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0">
        <ScrollArea className="max-h-[95vh] w-full rounded-md border">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-br from-blue-50 to-blue-100"
            >
              <DialogHeader className="bg-blue-600 p-6">
                <DialogTitle className="flex items-center justify-center gap-2 text-center text-2xl font-bold text-white">
                  <Building2 className="h-6 w-6 text-blue-200" />
                  Create New Facility
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 p-6">
                {/* Image Upload */}
                <div className="group relative cursor-pointer rounded-xl border-2 border-dashed border-blue-200 bg-white p-6 text-center hover:border-blue-400">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFacility((prev) => ({
                          ...prev,
                          image: file,
                        }));
                      }
                    }}
                  />
                  {selectedFacility.image ? (
                    <img
                      src={getImageSrc(selectedFacility.image)}
                      alt="Preview"
                      className="mx-auto rounded-md object-cover"
                    />
                  ) : (
                    <>
                      <UploadCloud className="mx-auto h-12 w-12 text-blue-400 group-hover:text-blue-600" />
                      <p className="mt-2 text-sm text-blue-600">
                        Upload facility image
                      </p>
                    </>
                  )}
                </div>

                {/* Facility Name */}
                <div className="space-y-2">
                  <Label htmlFor="facilityName">Facility</Label>
                  <Input
                    id="facilityName"
                    value={selectedFacility.facilitiesName}
                    onChange={(e) =>
                      setSelectedFacility((prev) => ({
                        ...prev,
                        facilitiesName: e.target.value,
                      }))
                    }
                    placeholder="e.g., Swimming Pool"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="facilityDescription">Description</Label>
                  <Textarea
                    id="facilityDescription"
                    value={selectedFacility.description}
                    onChange={(e) =>
                      setSelectedFacility((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Open Time */}
                  <div className="space-y-2">
                    <Label htmlFor="openTime">Open Time</Label>
                    <div className="flex gap-2">
                      <Input
                        id="openTime"
                        type="text"
                        placeholder="e.g., 10:00"
                        className="w-[90px]"
                        value={selectedFacility.openTime.split(" ")[0] || ""}
                        onChange={(e) =>
                          setSelectedFacility((prev) => ({
                            ...prev,
                            openTime: `${e.target.value} ${
                              prev.openTime.split(" ")[1] || "AM"
                            }`,
                          }))
                        }
                      />
                      <Select
                        value={selectedFacility.openTime.split(" ")[1] || ""}
                        onValueChange={(value) =>
                          setSelectedFacility((prev) => ({
                            ...prev,
                            openTime: `${prev.openTime.split(" ")[0] || ""} ${value}`,
                          }))
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Close Time */}
                  <div className="space-y-2">
                    <Label htmlFor="closeTime">Close Time</Label>
                    <div className="flex gap-2">
                      <Input
                        id="closeTime"
                        type="text"
                        placeholder="e.g., 22:00"
                        className="w-[90px]"
                        value={selectedFacility.closeTime.split(" ")[0] || ""}
                        onChange={(e) =>
                          setSelectedFacility((prev) => ({
                            ...prev,
                            closeTime: `${e.target.value} ${
                              prev.closeTime.split(" ")[1] || "PM"
                            }`,
                          }))
                        }
                      />
                      <Select
                        value={selectedFacility.closeTime.split(" ")[1] || ""}
                        onValueChange={(value) =>
                          setSelectedFacility((prev) => ({
                            ...prev,
                            closeTime: `${prev.closeTime.split(" ")[0] || ""} ${value}`,
                          }))
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFacility} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span>Creating</span>
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      </>
                    ) : (
                      "Create Facility"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewFacilityDialog;
