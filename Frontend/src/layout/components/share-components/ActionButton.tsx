import { Pencil, Save, Trash2 } from "lucide-react";
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

interface ActionButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

const ActionButton = ({
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
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
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

export default ActionButton;
