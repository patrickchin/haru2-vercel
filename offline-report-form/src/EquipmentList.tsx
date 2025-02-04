import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "./components/ui/table";
import { LucideX } from "lucide-react";

export default function EquipmentList({
  register,
  fields,
  remove,
  append,
}: {
  register: UseFormRegister<any>;
  fields: FieldArrayWithId<any, any, any>[];
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<any>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Ownership</TableHead>
          <TableHead>Operation Time</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((field, index) => (
          <TableRow key={field.id}>
            <TableCell>
              <Input
                type="text"
                {...register(`equipment.${index}.equipmentName`)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                {...register(`equipment.${index}.quantity`)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                {...register(`equipment.${index}.condition`)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                {...register(`equipment.${index}.ownership`)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                {...register(`equipment.${index}.operationTime`)}
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
              Add Equipment
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
