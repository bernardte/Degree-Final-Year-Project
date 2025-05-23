import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Facility } from "@/types/interface.type";
import { motion } from "framer-motion";
import { UploadCloud, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import getImageSrc from "@/utils/getImageSrc";

interface EditFacilityDialogProps {
  selectedFacility: Facility | null;
  isEditModalOpen: boolean;
  isLoading: boolean;
  handleEdit: (updatedFacility: Facility) => Promise<void>;
  setSelectedFacility: (
    facility: Facility | null | ((prev: Facility | null ) => Facility | null),
  ) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
}

const EditFacilityDialog = ({
  selectedFacility,
  isEditModalOpen,
  isLoading,
  handleEdit,
  setSelectedFacility,
  setIsEditModalOpen,
}: EditFacilityDialogProps) => {
  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="max-w-xl overflow-hidden rounded-2xl p-0">
        <ScrollArea className="max-h-[90vh] w-full rounded-md border">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <DialogHeader className="bg-blue-600 p-6">
              <DialogTitle className="flex items-center justify-center gap-2 text-center text-2xl font-bold text-white">
                <Building2 className="h-6 w-6 text-blue-200" />
                Edit Facility
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 p-6">
              {/* Facility Image Upload */}
              <div className="group relative cursor-pointer rounded-xl border-2 border-dashed border-blue-200 bg-white p-6 text-center hover:border-blue-400">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFacility((prev) =>
                        prev ? { ...prev, image: file } : prev,
                      );
                    }
                  }}
                />

                {selectedFacility?.image ? (
                  <img
                    src={getImageSrc(selectedFacility.image)}
                    alt="Facility preview"
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
                  value={selectedFacility?.facilitiesName || ""}
                  onChange={(e) =>
                    setSelectedFacility((prev) =>
                      prev ? { ...prev, facilitiesName: e.target.value } : prev,
                    )
                  }
                  placeholder="e.g., Swimming Pool"
                />
              </div>

              {/* Facility Description */}
              <div className="space-y-2">
                <Label htmlFor="facilityDescription">Description</Label>
                <Textarea
                  id="facilityDescription"
                  value={selectedFacility?.description || ""}
                  onChange={(e) =>
                    setSelectedFacility((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev,
                    )
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
                      className="w-[60px]"
                      value={selectedFacility?.openTime?.split(" ")[0] || ""}
                      onChange={(e) =>
                        setSelectedFacility((prev) =>
                          prev
                            ? {
                                ...prev,
                                openTime: `${e.target.value} ${prev.openTime?.split(" ")[1] || "AM"}`,
                              }
                            : prev,
                        )
                      }
                    />
                    <Select
                      value={selectedFacility?.openTime?.split(" ")[1] || ""}
                      onValueChange={(value) =>
                        setSelectedFacility((prev) =>
                          prev
                            ? {
                                ...prev,
                                openTime: `${prev.openTime?.split(" ")[0] || ""} ${value}`,
                              }
                            : prev,
                        )
                      }
                    >
                      <SelectTrigger className="w-[90px]">
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
                      value={selectedFacility?.closeTime?.split(" ")[0] || ""}
                      className="w-[60px]"
                      onChange={(e) =>
                        setSelectedFacility((prev) =>
                          prev
                            ? {
                                ...prev,
                                closeTime: `${e.target.value} ${prev.closeTime?.split(" ")[1] || "AM"}`,
                              }
                            : prev,
                        )
                      }
                    />
                    <Select
                      value={selectedFacility?.closeTime?.split(" ")[1] || ""}
                      onValueChange={(value) =>
                        setSelectedFacility((prev) =>
                          prev
                            ? {
                                ...prev,
                                closeTime: `${prev.closeTime?.split(" ")[0] || ""} ${value}`,
                              }
                            : prev,
                        )
                      }
                    >
                      <SelectTrigger className="w-[90px]">
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

              {/* Footer */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    selectedFacility && handleEdit(selectedFacility)
                  }
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span>Saving</span>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    </>
                  ) : (
                    "Save Facility"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditFacilityDialog;
