import { Button } from "@/components/ui/button";
import EquipmentList from "@/components/EquipmentList";
import { LucideMoveLeft } from "lucide-react";

function EquipmentPage({
  register,
  equipmentFields,
  removeEquipment,
  appendEquipment,
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
        Equipment List
      </header>
      <div className="p-4">
        <EquipmentList
          register={register}
          fields={equipmentFields}
          remove={removeEquipment}
          append={appendEquipment}
        />
      </div>
    </>
  );
}

export default EquipmentPage;
