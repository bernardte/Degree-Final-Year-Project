import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

const UnauthorizedMessage = () => {
  return (
    <div className="flex h-64 items-center justify-center">
      <Alert className="max-w-md border-red-400 bg-red-50 text-red-900 shadow-md dark:border-red-600 dark:bg-red-900/20 dark:text-red-200">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold capitalize">
          restricted access
        </AlertTitle>
        <AlertDescription>
          You do not have permission to view this content. If you need to access
          it, please log in with an account with higher permissions.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default UnauthorizedMessage;
