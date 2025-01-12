import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import { useEffect } from "react";
import { createInsertSchema } from "drizzle-zod";
import { equipment1 } from "@/db/schema";
import * as Actions from "@/lib/actions";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SaveRevertForm } from "@/components/save-revert-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideLoaderCircle } from "lucide-react";

export function EditEquipmentForm({
  reportId,
}: {
  reportId: number; // might be nicer to pass in equipmentListId instead
}) {
  const {
    data: equipment,
    mutate,
    isLoading,
  } = useSWR(
    `/api/report/${reportId}/usedEquipmentList`, // api route doesn't really exist
    async () => Actions.listSiteReportUsedEquipment(reportId),
  );

  const schema = z.object({
    equipment: z.array(
      createInsertSchema(equipment1)
        .omit({ id: true, equipmentListId: true })
        .extend({
          quantity: z.coerce.number().nullable(),
        }),
    ),
  });
  type SchemaType = z.infer<typeof schema>;
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: equipment && { equipment: equipment },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "equipment",
  });

  useEffect(() => {
    form.reset({ equipment: equipment }, {});
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center grow">
        <LucideLoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 grow"
        onSubmit={form.handleSubmit(
          async (data: SchemaType) => {
            const newEquipment = await mutate(
              Actions.updateSiteReportUsedEquipment(reportId, data.equipment),
              { revalidate: false },
            );
            form.reset({ equipment: newEquipment });
          },
          (errors) => {
            console.log(errors);
          },
        )}
      >
        <ScrollArea className="grow h-1 border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Name</TableHead>
                <TableHead className="w-1/12">Quantity</TableHead>
                <TableHead className="w-1/12">Cost</TableHead>
                <TableHead className="w-1/12">Cost Units</TableHead>
                <TableHead className="w-1/12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <FormField
                      name={`equipment.${index}.name`}
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
                      name={`equipment.${index}.quantity`}
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
                      name={`equipment.${index}.cost`}
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
                      name={`equipment.${index}.costUnits`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="CNY">CNY</SelectItem>
                              <SelectItem value="SLL">SLL</SelectItem>
                              <SelectItem value="NGN">NGN</SelectItem>
                              <SelectItem value="KES">KES</SelectItem>
                            </SelectContent>
                          </Select>
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
        </ScrollArea>
        <div className="flex justify-center mt-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() =>
              append({
                name: null,
                quantity: null,
                cost: null,
                costUnits: null,
              })
            }
          >
            Add Equipment
          </Button>
        </div>
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>

        <div className="flex gap-2 justify-end">
          <SaveRevertForm form={form} />
        </div>
      </form>
    </Form>
  );
}
