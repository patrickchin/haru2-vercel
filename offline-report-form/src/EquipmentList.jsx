import React, { useState } from "react";

export default function EquipmentList({ register, fields, remove, append }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div>
      <button type="button" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "Show Equipment List" : "Hide Equipment List"}
      </button>
      {!isCollapsed && (
        <>
          <table>
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Unit Cost</th>
                <th>Currency</th>
                <th>Condition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td>
                    <input
                      type="text"
                      {...register(`equipment.${index}.equipmentName`)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      {...register(`equipment.${index}.quantity`)}
                    />
                  </td>
                  <td>
                    <input type="text" {...register(`equipment.${index}.unit`)} />
                  </td>
                  <td>
                    <input
                      type="number"
                      {...register(`equipment.${index}.unitCost`)}
                    />
                  </td>
                  <td>
                    <input type="text" {...register(`equipment.${index}.currency`)} />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`equipment.${index}.condition`)}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => remove(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={() => append()}>
            Add Equipment
          </button>
        </>
      )}
    </div>
  );
}
