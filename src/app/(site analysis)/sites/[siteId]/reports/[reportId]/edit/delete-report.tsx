"use client";

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
import { useRouter } from "next/navigation";

export function DeleteReportButton({
  siteId,
  reportId,
  disabled,
}: {
  siteId: number | null; // .. tbh it should never be null
  reportId: number;
  disabled: boolean;
}) {
  const form = useForm();
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={disabled}
          className="flex gap-2"
        >
          Delete Report
          <LucideTrash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you would like to delete this report?
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
                await Actions.deleteSiteReport(reportId);
                router.push(`/sites/${siteId}/reports`);
              })}
            >
              <Button variant="destructive" asChild>
                <AlertDialogAction type="submit">
                  Yes, Delete Report
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
