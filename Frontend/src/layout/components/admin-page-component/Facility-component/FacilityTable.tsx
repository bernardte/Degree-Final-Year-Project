import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ActionButton } from "../../share-components/ActionButton";
import { Loader2, Clock } from "lucide-react";
import getImageSrc from "@/utils/getImageSrc";
import { Facility } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import EditFacilityDialog from "../dialog-component/EditFacilityDialog";
import useFacilityStore from "@/stores/useFacilityStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FacilityTableProps {
    facilities: Facility[];
    isLoading: boolean;
    error: string | null;
}

const FacilityTable = ({ facilities, isLoading: isFacilityTable, error } : FacilityTableProps ) => {
    const { showToast } = useToast();
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [editLoading, setEditLoading] = useState<boolean>(false);
    async function handleDelete(facilityId: string): Promise<void> {
        setIsLoading(true);

        try {
            const response = await axiosInstance.delete(
              "/api/facilities/delete-facility/" + facilityId,
            );
            if(response?.data){
                showToast("success", response?.data?.message);
                useFacilityStore.getState().removeFacility(facilityId);
            }

        } catch (error: any) {
            const message = error?.response?.data?.message || error?.response?.data?.error;

            if(message.includes('Access denied')){
                showToast("warn", error?.response?.data?.message);
                return;
            }

            showToast("error", error?.response?.data?.error);
            return;
        
        }finally{
            setIsLoading(false);
        }
    }

    function handelEditClick(facilityId: string) {
        const facility = facilities.find((facility) => facility._id === facilityId);
        if(facility){
            setSelectedFacility(facility);
            setIsEditModalOpen(true);
        }
    }

    async function handleEdit(updatedFacility: Facility): Promise<void> {
      if (!selectedFacility) return;
      setEditLoading(true);
      try {
        const formData = new FormData();
        formData.append("facilitiesName", updatedFacility.facilitiesName);
        formData.append("description", updatedFacility.description);
        formData.append("openTime", updatedFacility.openTime);
        formData.append("closeTime", updatedFacility.closeTime);
        formData.append("image", updatedFacility.image);
        console.log("formData", updatedFacility.image);
        const response = await axiosInstance.put(
          `/api/facilities/update-facility/${selectedFacility._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        if (response?.data) {
          showToast(
            "success",
            response.data.message || "Facility updated successfully",
          );
            useFacilityStore.getState().updateFacility(
                selectedFacility._id,
                updatedFacility,
            );
          setIsEditModalOpen(false);
          setSelectedFacility(null);
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to update facility";
        showToast("error", message);
      } finally {
        setEditLoading(false);
      }
    }

    if(error){
        return (
            <div className="flex h-full w-full items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (isFacilityTable) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="animate-spin text-blue-500" />
        </div>
      );
    }

   

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-blue-100 text-xs tracking-wider text-zinc-700 uppercase">
          <TableRow>
            <TableHead className="text-center">Index</TableHead>
            <TableHead className="min-w-[160px] pl-7">Facility Image</TableHead>
            <TableHead className="min-w-[160px] text-center">
              Facility
            </TableHead>
            <TableHead className="min-w-[160px] text-center">
              Facility Details
            </TableHead>
            <TableHead className="min-w-[160px] text-center">Businnes Hours</TableHead>
            <TableHead className="min-w-[120px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.map((facility, index) => (
            <TableRow
              key={facility._id}
              className={`transition-colors duration-200 hover:bg-blue-50 ${
                index % 2 === 0 ? "bg-white" : "bg-blue-50/50"
              } border-b border-zinc-200`}
            >
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <img
                  src={getImageSrc(facility?.image)}
                  alt={facility?.facilitiesName}
                />
              </TableCell>
              <TableCell>
                <span className="flex items-center justify-center gap-1 text-zinc-700">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center justify-center gap-2 font-medium text-zinc-800">
                        {facility?.facilitiesName}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-md">
                        {facility.openTime} - {facility.closeTime}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </span>
              </TableCell>
              <TableCell>
                <span className="block gap-1 pl-2 wrap-break-word text-zinc-700 capitalize">
                  {facility?.description}
                </span>
              </TableCell>
              <TableCell>
                <div className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                  <Clock className="mr-2 h-4 w-4" />
                  {facility.openTime} - {facility.closeTime}
                </div>
              </TableCell>
              <TableCell className="text-right text-blue-500">
                <ActionButton
                  loading={isLoading}
                  onDelete={() => handleDelete(facility._id)}
                  onEdit={() => handelEditClick(facility._id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute h-5 w-5 rounded-full bg-blue-400/30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${7 + Math.random() * 3}s infinite ease-in-out`,
          }}
        />
      ))}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditFacilityDialog
            handleEdit={handleEdit}
            selectedFacility={selectedFacility}
            setSelectedFacility={setSelectedFacility}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            isLoading={editLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default FacilityTable;
