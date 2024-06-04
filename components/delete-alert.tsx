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
import { Button } from "@/components/ui/button";
import { LucideLoader2, LucideTrash2 } from "lucide-react";

interface DeleteAlertDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  isIcon?: boolean;
  isButton?: boolean;
}

const DeleteAlertDialog: React.FC<DeleteAlertDialogProps> = ({
  onConfirm,
  isLoading,
  disabled,
  isIcon,
  isButton,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isButton ? (
          <Button disabled={disabled} variant="destructive">
            Delete
          </Button>
        ) : isIcon ? (
          <Button size="icon" variant="outline" className="h-8 w-8">
            <LucideTrash2 className="w-3.5 h-3.5" />
          </Button>
        ) : (
          <span />
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Yes, Delete
            {isLoading && <LucideLoader2 className="animate-spin h-4" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlertDialog;
