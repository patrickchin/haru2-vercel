import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LucideMoveLeft, LucidePlus, LucideX } from "lucide-react";
import { useFieldArray } from "react-hook-form";

function DetailsPage({
  form,
  updateReport,
  onBack,
}: {
  form: any;
  updateReport: () => void;
  onBack: () => void;
}) {
  const { control, register } = form;
  const {
    fields: detailFields,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({
    control,
    name: "detailsSections",
  });

  return (
    <>
      <header className="font-bold text-xl flex items-center gap-4">
        <Button
          type="button"
          onClick={onBack}
          variant={"secondary"}
        >
          <LucideMoveLeft /> Back
        </Button>
        Detailed Section
      </header>
      <div className="flex flex-col gap-4">
        <ol className="flex flex-col rounded border">
          {detailFields.length === 0 && (
            <li className="text-muted-foreground text-center text-sm p-4 py-20">
              No detail sections added.
            </li>
          )}
          {detailFields.map((field, idx) => (
            <li
              key={field.id}
              className="flex flex-col gap-2 p-4 border-b last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Section Title"
                  {...register(`detailsSections.${idx}.title`)}
                  className="font-bold"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeDetail(idx)}
                  title="Delete Section"
                >
                  <LucideX className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Section Description"
                {...register(`detailsSections.${idx}.description`)}
                rows={3}
                className="border rounded px-2 py-1"
              />
            </li>
          ))}
        </ol>
        <div className="flex gap-2 justify-center">
          <Button
            type="button"
            onClick={() => appendDetail({ title: "", description: "" })}
            variant="default"
          >
            <LucidePlus className="h-4 w-4 mr-1" /> Add Section
          </Button>
        </div>
      </div>
      <Footer updateReport={updateReport} />
    </>
  );
}

export default DetailsPage;
