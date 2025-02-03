import {
  UseFieldArrayRemove,
  UseFieldArrayAppend,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { LucidePlus, LucideX } from "lucide-react";

export default function MaterialsList({
  register,
  fields,
  remove,
  append,
}: {
  register: UseFormRegister<FieldValues>;
  fields: { id: string }[];
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<FieldValues>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Unit Cost</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((field, index) => (
          <TableRow key={field.id}>
            <TableCell>
              <Input
                type="text"
                {...register(`materials.${index}.materialName`)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                {...register(`materials.${index}.quantity`)}
              />
            </TableCell>
            <TableCell>
              <Input type="text" {...register(`materials.${index}.unit`)} />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                {...register(`materials.${index}.unitCost`)}
              />
            </TableCell>
            <TableCell>
              <Input type="text" {...register(`materials.${index}.currency`)} />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                {...register(`materials.${index}.condition`)}
              />
            </TableCell>
            <TableCell>
              <Button
                type="button"
                size="icon"
                onClick={() => remove(index)}
                variant="outline"
              >
                <LucideX />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="text-center h-16 bg-muted">
          <TableCell colSpan={7}>
            <Button type="button" onClick={() => append({})} variant="outline">
              Add Material <LucidePlus />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
