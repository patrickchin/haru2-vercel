import React from "react";
import {
  UseFieldArrayRemove,
  UseFieldArrayAppend,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

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
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  return (
    <div className="mb-4">
      <Button type="button" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "Show Materials List" : "Hide Materials List"}
      </Button>
      {!isCollapsed && (
        <>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr>
                <th className="border p-2">Material Name</th>
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
                      {...register(`materials.${index}.materialName`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      {...register(`materials.${index}.quantity`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="text"
                      {...register(`materials.${index}.unit`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      {...register(`materials.${index}.unitCost`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="text"
                      {...register(`materials.${index}.currency`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="text"
                      {...register(`materials.${index}.condition`)}
                    />
                  </td>
                  <td className="border p-2">
                    <Button type="button" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button type="button" onClick={() => append({})}>
            Add Material
          </Button>
        </>
      )}
    </div>
  );
}
