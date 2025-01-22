import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import { useEffect, useRef } from "react";
import { createInsertSchema } from "drizzle-zod";
import { equipment1 } from "@/db/schema";
import { LucideLoaderCircle, LucideX } from "lucide-react";
import { SiteDetails } from "@/lib/types";
import { getCountryCurrency } from "@/lib/constants";
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

export function EditEquipmentForm({
  site,
  reportId,
}: {
  site: SiteDetails;
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

  const wasLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      form.reset({ equipment: equipment }, {});
    }
    wasLoadingRef.current = isLoading;
  }, [equipment, isLoading, form]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center grow">
        <LucideLoaderCircle className="animate-spin" />
      </div>
    );
  }

  const defaultCurrency = getCountryCurrency(site.countryCode);

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
                <TableHead className="text-center w-4/12">Name</TableHead>
                <TableHead className="text-center w-2/12">Quantity</TableHead>
                <TableHead className="text-center w-2/12">Cost</TableHead>
                <TableHead className="text-center w-2/12">Ownership</TableHead>
                <TableHead className="text-center w-2/12">Operation Time (Hours)</TableHead>
                <TableHead className="text-center w-1/12"></TableHead>
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
                  <TableCell className="flex">
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
                            className="rounded-r-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`equipment.${index}.costUnits`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? ""}
                          >
                            <SelectTrigger className="rounded-l-none border-l-0">
                              <SelectValue />
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
                    <FormField
                      name={`equipment.${index}.ownership`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? ""}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rented">Rented</SelectItem>
                              <SelectItem value="purchased">Purchased</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      name={`equipment.${index}.operationTimeHours`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            type="number"
                            step={0.5}
                            {...field}
                            value={field.value ?? ""}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <LucideX />
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
                quantity: 1,
                cost: null,
                costUnits: defaultCurrency,
                ownership: null,
                operationTimeHours: null,
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
