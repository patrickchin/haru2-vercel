import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LucideMoveLeft } from "lucide-react";

function DetailsPage({
  setCurrentPage,
  form,
  updateReport,
}: {
  setCurrentPage: (page: string) => void;
  form: any;
  updateReport: () => void;
}) {
  const { register, control, handleSubmit, setValue, getValues, reset } = form;

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
        Extra Details
      </header>
      <div>
        <Textarea
          {...register("extraDetails")}
          rows={5}
          cols={50}
          className="mb-4 p-2 border rounded w-full"
        />
      </div>
      <Footer updateReport={updateReport} />
    </>
  );
}

export default DetailsPage;
