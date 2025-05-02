import { Facility } from "@/types/interface.type";
import * as LucideIcons from "lucide-react";
import { ComponentType } from "react";

interface facilityProps {
    facility: Facility;
}

const FacilitiesCard = ({ facility }: facilityProps) => {
    const iconName = facility.icon as unknown as keyof typeof LucideIcons;
    const Icon = LucideIcons[iconName] as unknown as ComponentType<{className?: string}>
    return (
      <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-transform hover:scale-105">
        <img
          src={facility?.image}
          alt={facility?.facilitiesName}
          className="h-48 w-full object-cover"
        />
        <div className="flex gap-2 p-2">
          <h3 className="align-center my-auto w-1/2 justify-center text-lg font-semibold text-gray-800">
            <div className="flex items-center justify-center">
              <span>{facility?.facilitiesName}</span>
              <div className="w-1" />
              {Icon && (
                <Icon
                  className={`h-7 w-7 ${facility?.iconColor || "text-gray-500"}`}
                />
              )}
            </div>
          </h3>
          <div className="items-between w-1/2 justify-center">
            <p className="mb-2 text-sm text-gray-500">{facility?.description}</p>
            <div className="flex flex-wrap">
              <strong className="">Open:&nbsp;</strong>
              <span className="text-sm text-emerald-700">
                {facility?.openTime} - {facility?.closeTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
}

export default FacilitiesCard;
