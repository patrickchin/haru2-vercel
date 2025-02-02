import React from "react";
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
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  return (
    <div className="mb-4">
      <Button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant="default"
      >
        {isCollapsed ? "Show Equipment List" : "Hide Equipment List"}
      </Button>
      {!isCollapsed && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Actions</TableHead>
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
                      {...register(`equipment.${index}.unit`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      {...register(`equipment.${index}.unitCost`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      {...register(`equipment.${index}.currency`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      {...register(`equipment.${index}.condition`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button type="button" onClick={() => append({})} variant="outline">
            Add Equipment
          </Button>
        </>
      )}
    </div>
  );
}
