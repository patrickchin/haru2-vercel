"use client";

import * as Actions from "@/lib/actions";
import { LucideBookOpenCheck, LucideLoader2 } from "lucide-react";
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

export function PublishButton({
  reportId,
  disabled,
}: {
  reportId: number;
  disabled: boolean;
}) {
  const form = useForm();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" disabled={disabled} className="flex gap-2">
          Publish Report
          <LucideBookOpenCheck className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Once published, the report cannot be edited.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async () => {
                await Actions.publishReport(reportId);
              })}
            >
              <AlertDialogAction type="submit">
                Yes, Publish Report
                {form.formState.isSubmitting && (
                  <LucideLoader2 className="animate-spin h-4" />
                )}
              </AlertDialogAction>
            </form>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
