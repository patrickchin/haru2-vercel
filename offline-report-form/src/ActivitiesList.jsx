import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";

function Material({ register, index, matIndex }) {
  return (
    <tr>
      <td>
        <input
          type="text"
          {...register(
            `activities.${index}.materialsUsed.${matIndex}.usedMaterialName`,
          )}
        />
      </td>
      <td>
        <input
          type="number"
          {...register(
            `activities.${index}.materialsUsed.${matIndex}.usedQuantity`,
          )}
        />
      </td>
      <td>
        <input
          type="text"
          {...register(
            `activities.${index}.materialsUsed.${matIndex}.usedUnit`,
          )}
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
      <button type="button" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "Show Materials Used" : "Hide Materials Used"}
      </button>
      <h4>Materials Used</h4>
      {!isCollapsed && (
        <>
          <table>
            <thead>
              <tr>
                <th>Material Name</th>
                <th>Quantity</th>
                <th>Unit</th>
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
    <div className="activity-box">
      <div style={{ display: "flex", alignItems: "center" }}>
        <label>Activity Name:</label>
        <input
          type="text"
          {...register(`activities.${index}.activityName`)}
          readOnly={isCollapsed}
          style={{ flex: 1 }}
        />
        <button type="button" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? "Show Activity" : "Hide Activity"}
        </button>
      </div>
      {!isCollapsed && (
        <>
          <label>Start Date:</label>
          <input type="date" {...register(`activities.${index}.startDate`)} />
          <label>End Date:</label>
          <input type="date" {...register(`activities.${index}.endDate`)} />
          <label>Number of Workers:</label>
          <input
            type="number"
            {...register(`activities.${index}.numberOfWorkers`)}
          />
          <label>Cost of Workers:</label>
          <input
            type="number"
            {...register(`activities.${index}.costOfWorkers`)}
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
