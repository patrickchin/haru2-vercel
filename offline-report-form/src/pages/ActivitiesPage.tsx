import { Button } from "@/components/ui/button";
import ActivitiesList from "@/components/ActivitiesList";
import { LucideMoveLeft } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import Footer from "@/components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_PATH } from "../App";

function ActivitiesPage({
  form,
  updateReport,
}: {
  form: any;
  updateReport: () => void;
}) {
  const { register, control } = form;
  const { reportKey } = useParams<{ reportKey: string }>();
  const navigate = useNavigate();

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
          onClick={() => navigate(`/${BASE_PATH}/report/${reportKey}`)}
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
