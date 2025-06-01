import { ArrowBigLeftDash, ArrowBigRightDash, ArrowBigUpDash, MapPin, MapPinHouse, RefreshCcw } from "lucide-react";

const RoutingDirection = ({ direction }: { direction: string[] }) => {
  const getDirectionIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("left")) return <ArrowBigLeftDash className="text-white h-4 w-4 bg-blue-500 rounded-full"/>;
    if (lowerText.includes("right")) return (
      <ArrowBigRightDash className="h-4 w-4 rounded-full bg-blue-500 text-white" />
    );
    if (lowerText.includes("straight") || lowerText.includes("continue"))
      return (
        <ArrowBigUpDash className="h-4 w-4 rounded-full bg-blue-500 text-white" />
      );
    if (lowerText.includes("roundabout")) return (
      <RefreshCcw className="h-4 w-4 rounded-full bg-blue-500 text-white" />
    );
    if (lowerText.includes("destination")) return (
      <MapPinHouse className="h-4 w-4 text-rose-500" />
    );
    if (lowerText.includes("start")) return <MapPin className="text-blue-500 w-4 h-4"/>;
    return (
      <ArrowBigRightDash className="h-4 w-4 rounded-full bg-blue-500 text-white" />
    ); // default
  };

  return (
    <div className="w-full px-4 py-10 md:px-10 lg:px-20">
      <h3 className="mb-8 text-2xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
        Step-by-Step Directions
      </h3>
      <div className="relative space-y-8 border-l-4 border-emerald-400 pl-6">
        {direction.map((step, idx) => (
          <div key={idx} className="group relative">
            {/* Circle and icon */}
            <div className="absolute top-1.5 -left-7 flex h-6 w-6 items-center justify-center rounded-full border-4 border-emerald-500 bg-white text-base">
              {getDirectionIcon(step)}
            </div>

            {/* Text content */}
            <div className="rounded-md bg-white p-4 shadow-md transition hover:bg-blue-50">
              <p className="text-base text-gray-700">{step}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutingDirection;
