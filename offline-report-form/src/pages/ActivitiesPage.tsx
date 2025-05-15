import { Button } from "@/components/ui/button";
import ActivitiesList from "@/components/ActivitiesList";
import { LucideMoveLeft } from "lucide-react";

function ActivitiesPage({
  register,
  control,
  activityFields,
  removeActivity,
  appendActivity,
  setCurrentPage,
}: any) {
  return (
    <>
      <header className="font-bold p-4 text-xl flex items-center gap-4">
        <Button
          type="button"
          onClick={() => setCurrentPage("report")}
          variant={"secondary"}
        >
          <LucideMoveLeft /> Back
        </Button>
        Construction Activities
      </header>
      <div className="p-4">
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
    </>
  );
}

export default ActivitiesPage;
