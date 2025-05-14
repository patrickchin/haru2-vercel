import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useFieldArray,
  UseFormReturn,
  UseFieldArrayRemove,
} from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { createInsertSchema } from "drizzle-zod";
import { equipment1 } from "@/db/schema";
import {
  LucideCheck,
  LucideLoaderCircle,
  LucidePlus,
  LucideX,
} from "lucide-react";
import { SiteDetails, SiteEquipmentNew } from "@/lib/types";
import { currencies, getCountryCurrency } from "@/lib/constants";
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
import { cn } from "@/lib/utils";

const schema = z.object({
  equipment: z.array(
    createInsertSchema(equipment1).omit({ id: true, uuid: true }).extend({
      quantity: z.coerce.number().nullable(),
    }),
  ),
});
type SchemaType = z.infer<typeof schema>;

function EquipmentTableRow({
  index,
  form,
  remove,
}: {
  index: number;
  form: UseFormReturn<SchemaType>;
  remove: UseFieldArrayRemove;
}) {
  const dirtyEquipment = form.formState.dirtyFields.equipment?.[index];
  const isRowDirty = dirtyEquipment
    ? Object.values(dirtyEquipment).every((value) => value === true)
    : false;

  const quantity = form.watch(`equipment.${index}.quantity`);
  const cost = form.watch(`equipment.${index}.cost`);
  const costUnits = form.watch(`equipment.${index}.costUnits`);
  const totalCost = (quantity ?? 0) * (cost ? parseFloat(cost) : 0);

  return (
    <TableRow className={isRowDirty ? "bg-yellow-50 dark:bg-stone-800" : ""}>
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
              <Input type="number" {...field} value={field.value ?? ""} />
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
                  {currencies.map((currency) => (
                    <SelectItem value={currency} key={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <div className="text-right whitespace-nowrap">
          {totalCost.toLocaleString()} {costUnits}
        </div>
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
  );
}

function EditEquipmentForm({
  site,
  equipment,
  mutate,
  isLoading,
  updateAction,
}: {
  site: SiteDetails;
  equipment: any;
  mutate: any;
  isLoading: boolean;
  updateAction: (equipment: SiteEquipmentNew[]) => Promise<any>;
}) {
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

  const [copied, setCopied] = useState(false);

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
            const newEquipment = await mutate(updateAction(data.equipment), {
              revalidate: false,
            });
            form.reset({ equipment: newEquipment });
          },
          (errors) => {
            console.log(errors);
          },
        )}
      >
        <div className="flex items-center justify-end gap-3">
          <Input
            className="w-fit"
            placeholder="Paste to Import"
            readOnly
            onPaste={(e) => {
              e.preventDefault();
              const stringContent = e.clipboardData.getData("text");
              append(JSON.parse(stringContent).equipment);
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

        <ScrollArea className="grow h-1 border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center min-w-32 w-3/12">
                  Name
                </TableHead>
                <TableHead className="text-center min-w-28 w-2/12">
                  Quantity
                </TableHead>
                <TableHead className="text-center min-w-32 w-3/12">
                  Cost
                </TableHead>
                <TableHead className="text-center min-w-20 w-1/12">
                  Total Cost
                </TableHead>
                <TableHead className="text-center min-w-28 w-2/12">
                  Ownership
                </TableHead>
                <TableHead className="text-center min-w-28 w-2/12">
                  Operation Time (Hours)
                </TableHead>
                <TableHead className="text-center w-1/12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <EquipmentTableRow
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
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
                quantity: 1,
                cost: null,
                costUnits: defaultCurrency,
                ownership: null,
                operationTimeHours: null,
              })
            }
          >
            Add Equipment <LucidePlus />
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

export function EditUsedEquipmentForm({
  site,
  activityId,
}: {
  site: SiteDetails;
  activityId: number;
}) {
  const {
    data: equipment,
    mutate,
    isLoading,
  } = useSWR(`/api/activity/${activityId}/used-equipment`, async () =>
    Actions.listSiteActivityUsedEquipment({ activityId }),
  );

  return (
    <EditEquipmentForm
      site={site}
      equipment={equipment}
      mutate={mutate}
      isLoading={isLoading}
      updateAction={(equipment) =>
        Actions.updateSiteActivityUsedEquipment(activityId, equipment)
      }
    />
  );
}
