import { Button } from "@/components/ui/button";
import ActivitiesList from "@/components/ActivitiesList";
import { LucideMoveLeft } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import Footer from "@/components/Footer";

// Helper to extract reportKey from search params
function getReportKeyFromSearch() {
  return new URLSearchParams(window.location.search).get("reportKey") || "";
}

function ActivitiesPage({
  form,
  updateReport,
}: {
  form: any;
  updateReport: () => void;
}) {
  const { register, control } = form;
  const reportKey = getReportKeyFromSearch();

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
          onClick={() => {
            window.history.pushState({}, "", `?reportKey=${reportKey}`);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          variant={"secondary"}
        >
          <LucideMoveLeft /> Back
        </Button>
        Construction Activities
      </header>
      <div className="grow">
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
