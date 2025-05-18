import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LucideCuboid, LucideForklift, LucideMoveLeft } from "lucide-react";
import Footer from "@/components/Footer";
import { UseFormReturn } from "react-hook-form";

function ActivityPage({
  form,
  activityIndex,
  onBack,
  updateReport,
  onMaterials,
  onEquipment,
}: {
  form: UseFormReturn;
  activityIndex: number;
  onBack: () => void;
  updateReport: () => void;
  onMaterials: () => void;
  onEquipment: () => void;
}) {
  const { register } = form;

  return (
    <>
      <header className="font-bold text-xl flex items-center gap-4">
        <Button type="button" onClick={onBack} variant="secondary">
          <LucideMoveLeft /> Back
        </Button>
        Edit Activity {activityIndex + 1}
      </header>
      <div className="flex flex-col gap-4 grow">
        <label className="flex flex-col gap-1">
          Title
          <Input
            type="text"
            {...register(`activities.${activityIndex}.title`)}
            placeholder="Activity Title"
          />
        </label>
        <label className="flex flex-col gap-1">
          Description
          <Textarea
            {...register(`activities.${activityIndex}.description`)}
            placeholder="Activity Description"
            rows={3}
          />
        </label>
        <label className="flex flex-col gap-1">
          Number of Workers
          <Input
            type="number"
            min={0}
            {...register(`activities.${activityIndex}.numWorkers`, {
              valueAsNumber: true,
            })}
            placeholder="Number of Workers"
          />
        </label>
        <label className="flex flex-col gap-1">
          Hours Worked
          <Input
            type="number"
            min={0}
            step={0.1}
            {...register(`activities.${activityIndex}.hoursWorked`, {
              valueAsNumber: true,
            })}
            placeholder="Hours Worked"
          />
        </label>
        <label className="flex flex-col gap-1">
          Worker Cost
          <Input
            type="number"
            min={0}
            step={0.01}
            {...register(`activities.${activityIndex}.workerCost`, {
              valueAsNumber: true,
            })}
            placeholder="Total Worker Cost"
          />
        </label>
        <div className="flex gap-4">
          <Button type="button" variant="secondary" onClick={onMaterials}>
            Edit Materials <LucideCuboid />
          </Button>
          <Button type="button" variant="secondary" onClick={onEquipment}>
            Edit Equipment <LucideForklift />
          </Button>
        </div>
      </div>

      <Footer updateReport={updateReport} />
    </>
  );
}

export default ActivityPage;
