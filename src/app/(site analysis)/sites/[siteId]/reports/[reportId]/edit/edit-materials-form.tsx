import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import * as Actions from "@/lib/actions";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SaveRevertForm } from "@/components/save-revert-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createInsertSchema } from "drizzle-zod";
import { materials1 } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Name</TableHead>
              <TableHead className="w-1/12">Quantity</TableHead>
              <TableHead className="w-1/12">Quantity Unit</TableHead>
              <TableHead className="w-1/12">Cost</TableHead>
              <TableHead className="w-1/12">Cost Units</TableHead>
              <TableHead className="w-1/12">Condition</TableHead>
              <TableHead className="w-1/12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <FormField
                    name={`materials.${index}.name`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input {...field} value={field.value ?? ""} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`materials.${index}.quantity`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`materials.${index}.quantityUnit`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input {...field} value={field.value ?? ""} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`materials.${index}.cost`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
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
                </TableCell>
                <TableCell>
                  <FormField
                    name={`materials.${index}.costUnits`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input {...field} value={field.value ?? ""} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`materials.${index}.condition`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input {...field} value={field.value ?? ""} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Button type="button" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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