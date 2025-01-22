import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { createInsertSchema } from "drizzle-zod";
import { materials1 } from "@/db/schema";
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
import { LucideLoaderCircle, LucideX } from "lucide-react";
import { SiteDetails, SiteMaterial } from "@/lib/types";
import { getCountryCurrency } from "@/lib/constants";

function MaterialTableRow({
  field,
  index,
  form,
  remove,
}: {
  field: any;
  index: number;
  form: any;
  remove: (index: number) => void;
}) {
  const totalCost = useMemo(() => {
    return (field.quantity ?? 0) * parseFloat(field.unitCost ?? "0");
  }, [field]);

  const [totalCostCurrency, setTotalCostCurrency] = useState(
    field.unitCostCurrency,
  );
  const [quantity, setQuantity] = useState(field.quantity);
  const [unitCost, setUnitCost] = useState(field.unitCost);

  return (
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
                onChange={(event) => {
                  field.onChange(event);
                  setQuantity(event.target.value);
                }}
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
      <TableCell className="flex">
        <FormField
          name={`materials.${index}.unitCost`}
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-grow">
              <Input
                type="number"
                step="0.01"
                {...field}
                onChange={(event) => {
                  field.onChange(event);
                  setUnitCost(event.target.value);
                }}
                value={field.value ?? ""}
                className="rounded-r-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={`materials.${index}.unitCostCurrency`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={(v) => {
                  field.onChange(v);
                  setTotalCostCurrency(v);
                }}
                defaultValue={field.value ?? ""}
              >
                <SelectTrigger className="rounded-l-none border-l-0">
                  <SelectValue defaultValue="USD" />
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
        <div className="text-right whitespace-nowrap">
          {(quantity * unitCost).toLocaleString()} {totalCostCurrency}
        </div>
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
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => remove(index)}
        >
          <LucideX />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function EditMaterialsForm({
  site,
  reportId,
}: {
  site: SiteDetails;
  reportId: number; // might be nicer to pass in materialsListId instead
}) {
  const {
    data: materials,
    mutate,
    isLoading,
  } = useSWR(
    `/api/report/${reportId}/usedMaterialsList`, // api route doesn't really exist
    async () => Actions.listSiteReportUsedMaterials(reportId),
  );

  const schema = z.object({
    materials: z.array(
      createInsertSchema(materials1)
        .omit({ id: true, materialsListId: true })
        .extend({
          quantity: z.coerce.number().nullable(),
        }),
    ),
  });
  type SchemaType = z.infer<typeof schema>;
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: materials && { materials: materials },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "materials",
  });

  const wasLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      form.reset({ materials: materials }, {});
    }
    wasLoadingRef.current = isLoading;
  }, [materials, isLoading, form]);

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
        <ScrollArea className="grow h-1 border rounded-md relative">
          <Table>
            <TableHeader className="sticky top-0">
              <TableRow>
                <TableHead className="text-center w-3/12">Name</TableHead>
                <TableHead className="text-center w-1/12">Quantity</TableHead>
                <TableHead className="text-center w-2/12">Unit</TableHead>
                <TableHead className="text-center w-2/12">Unit Cost</TableHead>
                <TableHead className="text-center w-1/12">Total Cost</TableHead>
                <TableHead className="text-center w-2/12">Condition</TableHead>
                <TableHead className="text-center w-px"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <MaterialTableRow
                  key={field.id}
                  field={field}
                  index={index}
                  form={form}
                  remove={remove}
                />
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
                quantityUnit: null,
                unitCost: null,
                unitCostCurrency: defaultCurrency,
                totalCost: null,
                totalCostCurrency: defaultCurrency,
                condition: null,
              })
            }
          >
            Add Material
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
