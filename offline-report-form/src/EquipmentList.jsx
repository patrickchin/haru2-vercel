import React, { useState } from "react";

export default function EquipmentList({ register, fields, remove, append }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="mb-4">
      <button type="button" onClick={() => setIsCollapsed(!isCollapsed)} className="mb-2 p-2 bg-blue-500 text-white rounded">
        {isCollapsed ? "Show Equipment List" : "Hide Equipment List"}
      </button>
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
                    <input
                      type="text"
                      {...register(`equipment.${index}.equipmentName`)}
                      className="p-2 border rounded w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      {...register(`equipment.${index}.quantity`)}
                      className="p-2 border rounded w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input type="text" {...register(`equipment.${index}.unit`)} className="p-2 border rounded w-full" />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      {...register(`equipment.${index}.unitCost`)}
                      className="p-2 border rounded w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input type="text" {...register(`equipment.${index}.currency`)} className="p-2 border rounded w-full" />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      {...register(`equipment.${index}.condition`)}
                      className="p-2 border rounded w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <button type="button" onClick={() => remove(index)} className="p-2 bg-red-500 text-white rounded">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={() => append()} className="p-2 bg-green-500 text-white rounded">
            Add Equipment
          </button>
        </>
      )}
    </div>
  );
}
