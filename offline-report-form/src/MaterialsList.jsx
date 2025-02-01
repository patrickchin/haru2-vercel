import React, { useState } from "react";

export default function MaterialsList({ register, fields, remove, append }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div>
      <button type="button" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "Show Materials List" : "Hide Materials List"}
      </button>
      {!isCollapsed && (
        <>
          <table>
            <thead>
              <tr>
                <th>Material Name</th>
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
                      {...register(`materials.${index}.materialName`)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      {...register(`materials.${index}.quantity`)}
                    />
                  </td>
                  <td>
                    <input type="text" {...register(`materials.${index}.unit`)} />
                  </td>
                  <td>
                    <input
                      type="number"
                      {...register(`materials.${index}.unitCost`)}
                    />
                  </td>
                  <td>
                    <input type="text" {...register(`materials.${index}.currency`)} />
                  </td>
                  <td>
                    <input
                      type="text"
                      {...register(`materials.${index}.condition`)}
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
            Add Material
          </button>
        </>
      )}
    </div>
  );
}
