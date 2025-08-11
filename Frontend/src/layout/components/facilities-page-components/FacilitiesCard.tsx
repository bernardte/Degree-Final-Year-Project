import { Facility } from "@/types/interface.type";
import * as LucideIcons from "lucide-react";
import { ComponentType } from "react";

interface facilityProps {
  facility: Facility;
}

const FacilitiesCard = ({ facility }: facilityProps) => {
  const iconName = facility.icon as unknown as keyof typeof LucideIcons;
  const Icon = LucideIcons[iconName] as unknown as ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Image Area */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={facility?.image as string}
          alt={facility?.facilitiesName}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
      </div>

      {/* icon label */}
      <div className="absolute top-2 right-4 z-10">
        <div className="flex items-center justify-center rounded-full bg-white p-3 shadow-lg">
          {Icon && (
            <Icon
              className={`w-7", h-7`}
              style={{ color: facility.iconColor || "blue" }}
            />
          )}
        </div>
      </div>

      {/* content area */}
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 transition-colors group-hover:text-blue-600">
            {facility?.facilitiesName}
          </h3>

          {/* open and close label */}
          <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            {facility?.openTime} - {facility?.closeTime}
          </div>
        </div>

        {/* description */}
        <p className="mb-4 line-clamp-3 text-sm text-gray-600">
          {facility?.description}
        </p>

        {/* learn more button */}
        <button className="mt-2 flex items-center text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-800">
          Learn more
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FacilitiesCard;
