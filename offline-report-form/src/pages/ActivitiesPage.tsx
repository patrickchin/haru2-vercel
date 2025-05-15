import { Button } from "@/components/ui/button";
import ActivitiesList from "@/components/ActivitiesList";
import { LucideMoveLeft } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import Footer from "@/components/Footer";

function ActivitiesPage({
  setCurrentPage,
  form,
  updateReport,
}: {
  setCurrentPage: (page: string) => void;
  form: any;
  updateReport: () => void;
}) {
  const { register, control, handleSubmit, setValue, getValues, reset } = form;

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
        <Button
          type="button"
          onClick={() => setCurrentPage("report")}
          variant={"secondary"}
        >
          <LucideMoveLeft /> Back
        </Button>
        Construction Activities
      </header>
      <div>
        <ActivitiesList
          register={register}
          control={control}
          fields={activityFields}
          remove={removeActivity}
        />
        <Button
          type="button"
          onClick={() => appendActivity({})}
          variant="default"
        >
          Add Activity
        </Button>
      </div>
      <Footer updateReport={updateReport} />
    </>
  );
}

export default ActivitiesPage;
