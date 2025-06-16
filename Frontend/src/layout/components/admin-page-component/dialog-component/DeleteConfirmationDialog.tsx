import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteConfirmationDialogProps = {
  title?: string;
  description?: React.ReactNode;
  trigger: React.ReactNode;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
};

const DeleteConfirmationDialog = ({
  title = "Are you sure you want to delete?",
  description = "This action cannot be undone.",
  trigger,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Delete",
}: DeleteConfirmationDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-rose-500 hover:bg-red-600 cursor-pointer">
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
