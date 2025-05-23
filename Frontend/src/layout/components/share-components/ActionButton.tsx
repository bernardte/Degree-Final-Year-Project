import { Pencil, Save, Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ActionButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  loading: boolean;
}

export const ActionButton = ({
  loading,
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
}: ActionButtonProps) => {
  return (
    <div className="inline-flex items-center justify-end gap-2">
      {/* Edit Button */}
      {onEdit && (
        <button
          disabled={loading}
          onClick={onEdit}
          className={`inline-flex cursor-pointer items-center gap-1 rounded px-3 py-1 text-sm font-medium transition ${
            editLabel === "Save"
              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          }`}
          title={editLabel}
        >
          {editLabel === "Save" ? (
            <Save className="h-4 w-4" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
          {editLabel}
        </button>
      )}

      {/* Delete Button with AlertDialog */}
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className={`inline-flex cursor-pointer items-center gap-1 rounded px-3 py-1 text-sm font-medium transition ${
                deleteLabel === "Save"
                  ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  : "bg-rose-100 text-rose-800 hover:bg-rose-200"
              }`}
              title={deleteLabel}
            >
              {deleteLabel === "save" ? (
                <Save className="h-4 w-4" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {deleteLabel}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="cursor-pointer bg-rose-600 text-white hover:bg-rose-700"
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

interface ActionButtonWithAcceptDeclineProps {
  handleDecline: () => Promise<void>;
  handleAccept: () => Promise<void>;
  currentStatus: "Accept" | "Decline" | "approved" | "decline" | null ;
  loading: boolean
}

export const ActionButtonWithAcceptDecline = ({
  loading,
  handleDecline,
  handleAccept,
  currentStatus,
}: ActionButtonWithAcceptDeclineProps) => {
  const [status, setStatus] = useState<"Accept" | "Decline" | "approved" | "decline" | null>(
    currentStatus,
  );
  return (
    <div className="flex items-center gap-2">
      {status === null ? (
        <>
          <button
            disabled={loading}
            onClick={async () => {
              await handleAccept();
              setStatus("Accept");
            }}
            className="flex cursor-pointer items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 transition hover:bg-green-200"
          >
            <CheckCircle className="h-4 w-4" />
            Accept
          </button>
          <button
            disabled={loading}
            onClick={async () => {
              await handleDecline();
              setStatus("Decline");
            }}
            className="flex cursor-pointer items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-200"
          >
            <XCircle className="h-4 w-4" />
            Decline
          </button>
        </>
      ) : (
        <div
          className={`rounded-sm px-10 py-1 text-sm font-semibold items-center flex justify-center ${
            status === "Accept"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
};
