import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useFieldArray,
  useWatch,
  UseFormReturn,
  FieldArrayWithId,
  UseFieldArrayRemove,
} from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  LucideLoaderCircle,
  LucidePlus,
  LucideX,
  LucideCheck,
} from "lucide-react";
import { SiteMaterial, SiteMaterialNew } from "@/lib/types";
import { currencies, getCountryCurrency } from "@/lib/constants";
import { cn } from "@/lib/utils";

const schema = z.object({
  materials: z.array(
    createInsertSchema(materials1).omit({ id: true, uuid: true }).extend({
      quantity: z.coerce.number().nullable(),
    }),
  ),
});
type SchemaType = z.infer<typeof schema>;

function MaterialTableRow({
  index,
  form,
  remove,
}: {
  index: number;
  form: UseFormReturn<SchemaType>;
  remove: UseFieldArrayRemove;
}) {
  const defaultConditions = ["New", "Used", "Damaged", "Repaired"];
  const quantity = useWatch({
    control: form.control,
    name: `materials.${index}.quantity`,
  });
  const unitCost = useWatch({
    control: form.control,
    name: `materials.${index}.unitCost`,
  });
  const unitCostCurrency = useWatch({
    control: form.control,
    name: `materials.${index}.unitCostCurrency`,
  });

  const totalCost = (quantity ?? 0) * (unitCost ? parseFloat(unitCost) : 0);
  const dirtyMaterials = form.formState.dirtyFields.materials?.[index];
  console.log(dirtyMaterials);
  const isRowDirty = dirtyMaterials
    ? Object.values(dirtyMaterials).every((value) => value === true)
    : false;

  return (
    <TableRow className={isRowDirty ? "bg-yellow-50 dark:bg-stone-800" : ""}>
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
              <Input type="number" {...field} value={field.value ?? ""} />
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
                onValueChange={field.onChange}
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
          {totalCost.toLocaleString()} {unitCostCurrency}
        </div>
      </TableCell>
      <TableCell>
        <FormField
          name={`materials.${index}.condition`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex">
                <Input
                  {...field}
                  value={field.value ?? ""}
                  className="grow rounded-r-none min-w-28"
                />
                <Select onValueChange={field.onChange} defaultValue="">
                  <SelectTrigger className="border-l-0 rounded-l-none w-12" />
                  <SelectContent align="end">
                    {defaultConditions.map((cond) => (
                      <SelectItem key={cond} value={cond}>
                        {cond}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

export function EditUsedMaterialsForm({
  defaultCurrency,
  activityId,
}: {
  defaultCurrency: string | null;
  activityId: number;
}) {
  const {
    data: materials,
    mutate,
    isLoading,
  } = useSWR(`/api/activity/${activityId}/used-materials`, async () =>
    Actions.listSiteActivityUsedMaterials({ activityId }),
  );
  return (
    <EditMaterialsForm
      defaultCurrency={defaultCurrency}
      materials={materials}
      mutate={mutate}
      isLoading={isLoading}
      updateAction={(materials) =>
        Actions.updateSiteActivityUsedMaterials({ activityId, materials })
      }
    />
  );
}

function EditMaterialsForm({
  defaultCurrency,
  materials,
  mutate,
  isLoading,
  updateAction,
}: {
  defaultCurrency: string | null;
  materials?: SiteMaterial[];
  mutate: any;
  isLoading: boolean;
  updateAction: (materials: SiteMaterialNew[]) => Promise<any>;
}) {
  const initialCurrency = defaultCurrency || getCountryCurrency("US") || "USD";
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: materials && {
      materials: (materials || []).map((item: any) => ({
        ...item,
        unitCostCurrency: item?.unitCostCurrency || initialCurrency,
      })),
    },
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

  const [copied, setCopied] = useState(false);

  const materialsValues = form.watch("materials") || [];
  const currencySums = materialsValues.reduce(
    (acc: Record<string, number>, item: any) => {
      const quantity = item?.quantity ?? 0;
      const unitCost = item?.unitCost ? parseFloat(item.unitCost) : 0;
      const currency = item?.unitCostCurrency || selectedCurrency;
      if (!acc[currency]) acc[currency] = 0;
      acc[currency] += quantity * unitCost;
      return acc;
    },
    {} as Record<string, number>,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center grow">
        <LucideLoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="flex items-center justify-end gap-3">
        <div className="flex items-center gap-2">
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger>
              <span className="text-sm mr-2">Default Currency: </span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem value={currency} key={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grow"></div>
        <Input
          className="w-fit"
          placeholder="Paste to Import"
          readOnly
          onPaste={(e) => {
            e.preventDefault();
            const stringContent = e.clipboardData.getData("text");
            append(JSON.parse(stringContent).materials);
          }}
        />
        <Button
          type="button"
          variant="default"
          onClick={async () => {
            const jsonValues = JSON.stringify(form.getValues());
            if (!jsonValues) return;
            await navigator.clipboard.writeText(jsonValues);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className={cn(
            copied
              ? "hover:bg-green-900 bg-green-950 dark:hover:bg-green-200 dark:bg-green-100"
              : "",
          )}
        >
          Export to Clipboard {copied && <LucideCheck />}
        </Button>
      </div>
      <form
        className="flex flex-col gap-4 grow"
        onSubmit={form.handleSubmit(
          async (data: SchemaType) => {
            await updateAction(data.materials);
            const newMaterials = await mutate();
            form.reset({ materials: newMaterials });
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
                <TableHead className="text-center min-w-32 w-3/12">
                  Name
                </TableHead>
                <TableHead className="text-center min-w-32 w-1/12">
                  Quantity
                </TableHead>
                <TableHead className="text-center min-w-24 w-2/12">
                  Unit
                </TableHead>
                <TableHead className="text-center min-w-40 w-2/12">
                  Unit Cost
                </TableHead>
                <TableHead className="text-center min-w-24 w-1/12">
                  Total Cost
                </TableHead>
                <TableHead className="text-center min-w-24 w-2/12">
                  Condition
                </TableHead>
                <TableHead className="text-center min-w-8 w-px"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <MaterialTableRow
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
              {Object.entries(currencySums).map(([currency, sum]) => (
                <TableRow key={currency}>
                  <TableCell colSpan={4} />
                  <TableCell className="text-right font-bold whitespace-nowrap">
                    {sum.toLocaleString()} {currency}
                  </TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
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
                unitCostCurrency: selectedCurrency,
                totalCost: null,
                totalCostCurrency: selectedCurrency,
                condition: null,
              })
            }
          >
            Add Material <LucidePlus />
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
