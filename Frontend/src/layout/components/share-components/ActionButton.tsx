import { Pencil, Save, Trash2 } from "lucide-react";

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
      {onEdit && (
        <button
          onClick={onEdit}
          className={`inline-flex cursor-pointer items-center gap-1 rounded px-3 py-1 text-sm font-medium transition ${editLabel === "Save" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-green-100 text-green-800 hover:bg-green-200"}`}
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
      {onDelete && (
        <button
          onClick={onDelete}
          className={`inline-flex cursor-pointer items-center gap-1 rounded px-3 py-1 text-sm font-medium transition ${editLabel === "Save" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-rose-100 text-rose-800 hover:bg-rose-200"}`}
          title={deleteLabel}
        >
          {deleteLabel === "save" ? (
            <Save className="h-4 w-4" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {deleteLabel}
        </button>
      )}
    </div>
  );
};

export default ActionButton;
