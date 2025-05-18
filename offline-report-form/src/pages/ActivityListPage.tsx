import { Button } from "@/components/ui/button";
import { LucideMoveLeft, LucideX, LucidePlus } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import Footer from "@/components/Footer";

function ActivitiesPage({
  form,
  updateReport,
  onBack,
  onEditActivity,
}: {
  form: UseFormReturn;
  updateReport: () => void;
  onBack: () => void;
  onEditActivity: (idx: number) => void;
}) {
  const { control } = form;

  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
  } = useFieldArray({
    control,
    name: "activities",
  });

  return (
    <>
      <header className="font-bold text-xl flex items-center gap-4">
        <Button type="button" onClick={onBack} variant={"secondary"}>
          <LucideMoveLeft /> Back
        </Button>
        Construction Activities
      </header>
      <div className="flex flex-col gap-4">
        <ol className="flex flex-col rounded border">
          {activityFields.length === 0 && (
            <li className="text-muted-foreground text-center text-sm p-4 py-20">
              No activities added.
            </li>
          )}
          {activityFields.map((field, idx) => (
            <li
              key={field.id}
              onClick={() => onEditActivity(idx)}
              className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-blue-100 cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-mono underline">
                  {form.getValues(`activities.${idx}.title`) ||
                    `<Untitled Activity>`}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeActivity(idx);
                  }}
                  title="Delete"
                >
                  <LucideX className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex gap-2 justify-center">
          <Button
            type="button"
            onClick={() =>
              appendActivity({
                title: `Activity ${activityFields.length + 1}`,
                description: "",
                numWorkers: 0,
                hoursWorked: 0,
                workerCost: 0,
              })
            }
            variant="default"
          >
            Add Activity <LucidePlus />
          </Button>
        </div>
      </div>
      <Footer updateReport={updateReport} />
    </>
  );
}

export default ActivitiesPage;
