import { Button } from "@/components/ui/button";
import MaterialsList from "@/components/MaterialsList";
import { LucideMoveLeft } from "lucide-react";

function MaterialsPage({
  register,
  materialFields,
  removeMaterial,
  appendMaterial,
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
        Materials Storage List
      </header>
      <div className="p-4">
        <MaterialsList
          register={register}
          fields={materialFields}
          remove={removeMaterial}
          append={appendMaterial}
        />
      </div>
    </>
  );
}

export default MaterialsPage;
