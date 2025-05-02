import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-300 via-white to-black/10 px-4">
      <div className="bg-opacity-70 w-full max-w-xl space-y-8 rounded-2xl border border-cyan-200 bg-zinc-100 p-30 text-center shadow-xl backdrop-blur-3xl">
        {/* Main Error Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="animate-pulse bg-gradient-to-br from-cyan-500 to-blue-600 bg-clip-text text-7xl font-extrabold text-transparent">
              404
            </h1>
            {/* Icon */}
            <div className="flex animate-pulse items-center justify-center pt-2">
              <Home size={50} className="text-sky-500" />
            </div>
          </div>
          <h2 className="bg-gradient-to-br from-cyan-500 to-blue-600 bg-clip-text text-2xl font-semibold text-transparent">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Looks like this page got lost in the shuffle. Let’s get you back to
            the homepage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full cursor-pointer border-sky-600 text-sky-700 hover:bg-sky-100 sm:w-auto"
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/home")}
            className="w-full cursor-pointer bg-blue-500 text-white hover:bg-blue-600 sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
