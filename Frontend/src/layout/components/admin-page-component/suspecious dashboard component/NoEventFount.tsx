import { AlertCircle } from "lucide-react";

const NoEventFount = () => {
  return (
    <div className="p-8 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No events found
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter to find what you're looking for.
      </p>
    </div>
  );
}

export default NoEventFount
