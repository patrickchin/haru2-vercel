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
import CustomTooltip from "./ui/tooltip-custom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

function TextTrigger({ disabled }: { disabled?: boolean }) {
  return (
    <AlertDialogTrigger>
      <Button disabled={disabled} variant="destructive">
        Delete
      </Button>
    </AlertDialogTrigger>
  );
}

function IconTrigger({ disabled }: { disabled?: boolean }) {
  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              disabled={disabled}
              size="icon"
              variant="outline"
              className="h-8 w-8"
            >
              <LucideTrash2 className="w-3.5 h-3.5" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface DeleteAlertDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "text" | "icon";
  isIcon?: boolean;
  isButton?: boolean;
}

const DeleteAlertDialog: React.FC<DeleteAlertDialogProps> = ({
  onConfirm,
  isLoading,
  disabled,
  variant,
}) => {
  return (
    <AlertDialog>
      {variant == "icon" ? (
        <IconTrigger disabled={disabled} />
      ) : (
        <TextTrigger disabled={disabled} />
      )}

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
