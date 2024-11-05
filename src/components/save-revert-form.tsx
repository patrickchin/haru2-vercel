import { UseFormReturn } from "react-hook-form";
import {
  LucideCheck,
  LucideLoader2,
  LucideSave,
  LucideUndo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MouseEventHandler } from "react";

export function SaveRevertForm({
  form,
  onSaveClick,
}: {
  form: UseFormReturn;
  onSaveClick?: MouseEventHandler;
}) {
  return (
    <>
      <Button
        type="reset"
        variant="secondary"
        disabled={!form.formState.isDirty || form.formState.isSubmitting}
        onClick={() => form.reset()}
      >
        Revert Changes
        <LucideUndo2 className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="submit"
        disabled={!form.formState.isDirty || form.formState.isSubmitting}
        className="flex items-center"
        onClick={onSaveClick}
      >
        {form.formState.isSubmitting ? (
          <>
            Save
            <LucideLoader2 className="animate-spin w-3.5 h-3.5" />
          </>
        ) : form.formState.submitCount > 0 && !form.formState.isDirty ? (
          <>
            Saved
            <LucideCheck className="w-3.5 h-3.5" />
          </>
        ) : (
          <>
            Save
            <LucideSave className="w-3.5 h-3.5" />
          </>
        )}
      </Button>
    </>
  );
}
