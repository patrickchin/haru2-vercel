import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import * as Actions from "@/lib/actions";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SaveRevertForm } from "@/components/save-revert-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createInsertSchema } from "drizzle-zod";
import { materials1 } from "@/db/schema";

export function EditMaterialsForm({
  reportId,
}: {
  reportId: number; // might be nicer to pass in materialsListId instead
}) {
  const { data: materials, mutate } = useSWR(
    `/api/report/${reportId}/usedMaterialsList`, // api route doesn't really exist
    async () => Actions.listSiteReportUsedMaterials(reportId),
  );

  const schema = z.object({
    materials: z.array(
      createInsertSchema(materials1)
        .omit({ id: true, materialsListId: true })
        .extend({
          name: z.string().min(1),
          quantity: z.coerce.number().nullable(),
        }),
    ),
  });
  type SchemaType = z.infer<typeof schema>;
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: { materials: materials || [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "materials",
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 grow"
        onSubmit={form.handleSubmit(
          async (data: SchemaType) => {
            console.log(data);
            const newMaterials = await mutate(
              Actions.updateSiteReportUsedMaterials(reportId, data.materials),
              { revalidate: false },
            );
            form.reset({ materials: newMaterials });
          },
          (errors) => {
            console.log(errors);
          },
        )}
      >
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-row gap-2 items-center">
            <FormField
              name={`materials.${index}.name`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label>Name</Label>
                  <Input {...field} value={field.value ?? ""} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`materials.${index}.quantity`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label>Quantity</Label>
                  <Input type="number" {...field} value={field.value ?? ""} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`materials.${index}.quantityUnit`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label>Quantity Unit</Label>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`materials.${index}.cost`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label>Cost</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    value={field.value ?? ""}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`materials.${index}.costUnits`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label>Cost Units</Label>
                  <Input {...field} value={field.value ?? ""} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`materials.${index}.condition`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label>Condition</Label>
                  <Input {...field} value={field.value ?? ""} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        ))}

        <Button
          type="button"
          onClick={() =>
            append({
              name: "",
              quantity: 0,
              quantityUnit: "",
              cost: null,
              costUnits: null,
              condition: null,
            })
          }
        >
          Add Material
        </Button>

        <FormMessage>{form.formState.errors.root?.message}</FormMessage>

        <div className="flex gap-2 justify-end">
          <Button type="submit">Submit</Button>
          <SaveRevertForm form={form} />
        </div>
      </form>
    </Form>
  );
}
