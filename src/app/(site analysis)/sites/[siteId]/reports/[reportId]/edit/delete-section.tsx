import * as Actions from "@/lib/actions";
import { LucideLoader2, LucideTrash2 } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

export function DeleteSectionButton({
  sectionId,
  disabled,
  onSubmit,
}: {
  sectionId: number;
  disabled: boolean;
  onSubmit: () => void;
}) {
  const form = useForm();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" disabled={disabled} className="flex gap-2">
          Delete
          {form.formState.isSubmitting ? (
            <LucideLoader2 className="animate-spin" />
          ) : (
            <LucideTrash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you would like to delete this section?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async () => {
                await Actions.deleteSiteReportSection(sectionId);
                onSubmit();
              })}
            >
              <Button variant="destructive" asChild>
                <AlertDialogAction type="submit">
                  Yes, Delete Section
                  {form.formState.isSubmitting && (
                    <LucideLoader2 className="animate-spin h-4" />
                  )}
                </AlertDialogAction>
              </Button>
            </form>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
