import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LucideMoveLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function DetailsPage({
  form,
  updateReport,
}: {
  form: any;
  updateReport: () => void;
}) {
  const { register } = form;
  const { reportKey } = useParams<{ reportKey: string }>();
  const navigate = useNavigate();

  return (
    <>
      <header className="font-bold text-xl flex items-center gap-4">
        <Button
          type="button"
          onClick={() => navigate(`/report/${reportKey}`)}
          variant={"secondary"}
        >
          <LucideMoveLeft /> Back
        </Button>
        Extra Details
      </header>
      <div className="grow">
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
