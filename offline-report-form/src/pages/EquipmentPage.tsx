import { Button } from "@/components/ui/button";

function EquipmentPage({
  activityIndex,
  onBack,
}: {
  activityIndex: number;
  onBack: () => void;
}) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <header className="font-bold text-xl flex items-center gap-4">
        <Button variant="secondary" type="button" onClick={onBack}>
          Back
        </Button>
        Edit Equipment for Activity {activityIndex + 1}
      </header>
      {/* TODO: Implement equipment list and editing UI */}
      <div>
        <p>Equipment list for activity {activityIndex} goes here.</p>
      </div>
    </div>
  );
}

export default EquipmentPage;
