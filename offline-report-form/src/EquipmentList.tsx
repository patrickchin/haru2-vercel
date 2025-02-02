import React from "react";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

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
      <Button type="button" onClick={() => setIsCollapsed(!isCollapsed)} variant="default">
        {isCollapsed ? "Show Equipment List" : "Hide Equipment List"}
      </Button>
      {!isCollapsed && (
        <>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr>
                <th className="border p-2">Equipment Name</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Unit</th>
                <th className="border p-2">Unit Cost</th>
                <th className="border p-2">Currency</th>
                <th className="border p-2">Condition</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="border p-2">
                    <Input
                      type="text"
                      {...register(`equipment.${index}.equipmentName`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      {...register(`equipment.${index}.quantity`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="text"
                      {...register(`equipment.${index}.unit`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      {...register(`equipment.${index}.unitCost`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="text"
                      {...register(`equipment.${index}.currency`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="text"
                      {...register(`equipment.${index}.condition`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Button type="button" onClick={() => remove(index)} variant="destructive">
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button type="button" onClick={() => append({})} variant="outline">
            Add Equipment
          </Button>
        </>
      )}
    </div>
  );
}
