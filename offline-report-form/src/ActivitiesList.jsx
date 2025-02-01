import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";

function Material({ register, index, matIndex }) {
  return (
    <tr>
      <td className="border p-2">
        <input
          type="text"
          {...register(
            `activities.${index}.materialsUsed.${matIndex}.usedMaterialName`,
          )}
          className="p-2 border rounded w-full"
        />
      </td>
      <td className="border p-2">
        <input
          type="number"
          {...register(
            `activities.${index}.materialsUsed.${matIndex}.usedQuantity`,
          )}
          className="p-2 border rounded w-full"
        />
      </td>
      <td className="border p-2">
        <input
          type="text"
          {...register(
            `activities.${index}.materialsUsed.${matIndex}.usedUnit`,
          )}
          className="p-2 border rounded w-full"
        />
      </td>
    </tr>
  );
}

function MaterialsUsedList({ register, control, index }) {
  const { fields: materialFields, append: appendMaterial } = useFieldArray({
    control,
    name: `activities.${index}.materialsUsed`,
  });

  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      <button type="button" onClick={() => setIsCollapsed(!isCollapsed)} className="mb-2 p-2 bg-blue-500 text-white rounded">
        {isCollapsed ? "Show Materials Used" : "Hide Materials Used"}
      </button>
      <h4 className="text-lg mb-2">Materials Used</h4>
      {!isCollapsed && (
        <>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr>
                <th className="border p-2">Material Name</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Unit</th>
              </tr>
            </thead>
            <tbody>
              {materialFields.map((material, matIndex) => (
                <Material
                  key={material.id}
                  register={register}
                  index={index}
                  matIndex={matIndex}
                />
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() =>
              appendMaterial({
                usedMaterialName: "",
                usedQuantity: "",
                usedUnit: "",
              })
            }
            className="p-2 bg-green-500 text-white rounded"
          >
            Add Material
          </button>
        </>
      )}
    </>
  );
}

function Activity({ register, control, activity, index }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="activity-box mb-4 p-4 border rounded">
      <div className="flex items-center mb-2">
        <label className="mr-2">Activity Name:</label>
        <input
          type="text"
          {...register(`activities.${index}.activityName`)}
          readOnly={isCollapsed}
          className="flex-1 p-2 border rounded"
        />
        <button type="button" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-2 p-2 bg-blue-500 text-white rounded">
          {isCollapsed ? "Show Activity" : "Hide Activity"}
        </button>
      </div>
      {!isCollapsed && (
        <>
          <label className="block mb-2">Start Date:</label>
          <input type="date" {...register(`activities.${index}.startDate`)} className="mb-2 p-2 border rounded w-full" />
          <label className="block mb-2">End Date:</label>
          <input type="date" {...register(`activities.${index}.endDate`)} className="mb-2 p-2 border rounded w-full" />
          <label className="block mb-2">Number of Workers:</label>
          <input
            type="number"
            {...register(`activities.${index}.numberOfWorkers`)}
            className="mb-2 p-2 border rounded w-full"
          />
          <label className="block mb-2">Cost of Workers:</label>
          <input
            type="number"
            {...register(`activities.${index}.costOfWorkers`)}
            className="mb-2 p-2 border rounded w-full"
          />

          <MaterialsUsedList register={register} control={control} index={index} />
        </>
      )}
    </div>
  );
}

export default function ActivitiesList({ register, control, fields }) {
  return (
    <>
      {fields.map((field, index) => (
        <Activity
          key={field.id}
          register={register}
          control={control}
          activity={field}
          index={index}
        />
      ))}
    </>
  );
}
