import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LucideMoveLeft } from "lucide-react";

function ExtraDetailsPage({
  register,
  setCurrentPage,
}: {
  register: any;
  setCurrentPage: (page: string) => void;
}) {
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
        Extra Details
      </header>
      <div className="p-4">
        <Textarea
          {...register("extraDetails")}
          rows={5}
          cols={50}
          className="mb-4 p-2 border rounded w-full"
        />
      </div>
    </>
  );
}

export default ExtraDetailsPage;
