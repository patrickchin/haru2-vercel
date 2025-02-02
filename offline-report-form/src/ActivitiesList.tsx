import React, { useState } from "react";
import {
  useFieldArray,
  Control,
  UseFormRegister,
  FieldArrayWithId,
} from "react-hook-form";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function Material({
  register,
  index,
  matIndex,
}: {
  register: UseFormRegister<any>;
  index: number;
  matIndex: number;
}) {
  return (
    <tr>
      <td className="border p-2">
        <Input
          type="text"
          {...register(
            `activities.${index}.materialsUsed.${matIndex}.usedMaterialName`,
          )}
        />
      </td>
      <td className="border p-2">
        <Input
          type="number"
          {...register(
            `activities.${index}.materialsUsed.${matIndex}.usedQuantity`,
          )}
        />
      </td>
      <td className="border p-2">
        <Input
          type="text"
          {...register(
            `activities.${index}.materialsUsed.${matIndex}.usedUnit`,
          )}
        />
      </td>
    </tr>
  );
}

function MaterialsUsedList({
  register,
  control,
  index,
}: {
  register: UseFormRegister<any>;
  control: Control<any>;
  index: number;
}) {
  const { fields: materialFields, append: appendMaterial } = useFieldArray({
    control,
    name: `activities.${index}.materialsUsed`,
  });

  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      <Button type="button" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "Show Materials Used" : "Hide Materials Used"}
      </Button>
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
          <Button
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
          </Button>
        </>
      )}
    </>
  );
}

function Activity({
  register,
  control,
  activity,
  index,
  remove,
}: {
  register: UseFormRegister<any>;
  control: Control<any>;
  activity: any;
  index: number;
  remove: (index: number) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="activity-box mb-4 p-4 border rounded">
      <div className="flex items-center mb-2">
        <label className="mr-2">Activity Name:</label>
        <Input
          type="text"
          {...register(`activities.${index}.activityName`)}
          readOnly={isCollapsed}
          className="flex-1 p-2 border rounded"
        />
        <Button type="button" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? "Show Details" : "Hide Details"}
        </Button>
        <Button type="button" onClick={() => remove(index)} className="ml-2">
          Remove Activity
        </Button>
      </div>
      {!isCollapsed && (
        <>
          <label className="block mb-2">Start Date:</label>
          <Input
            type="date"
            {...register(`activities.${index}.startDate`)}
            className="mb-2 p-2 border rounded w-full"
          />
          <label className="block mb-2">End Date:</label>
          <Input
            type="date"
            {...register(`activities.${index}.endDate`)}
            className="mb-2 p-2 border rounded w-full"
          />
          <label className="block mb-2">Number of Workers:</label>
          <Input
            type="number"
            {...register(`activities.${index}.numberOfWorkers`)}
            className="mb-2 p-2 border rounded w-full"
          />
          <label className="block mb-2">Cost of Workers:</label>
          <Input
            type="number"
            {...register(`activities.${index}.costOfWorkers`)}
            className="mb-2 p-2 border rounded w-full"
          />

          <MaterialsUsedList
            register={register}
            control={control}
            index={index}
          />
        </>
      )}
    </div>
  );
}

export default function ActivitiesList({
  register,
  control,
  fields,
  remove,
}: {
  register: UseFormRegister<any>;
  control: Control<any>;
  fields: FieldArrayWithId<any, "activities", "id">[];
  remove: (index: number) => void;
}) {
  return (
    <>
      {fields.map((field, index) => (
        <Activity
          key={field.id}
          register={register}
          control={control}
          activity={field}
          index={index}
          remove={remove}
        />
      ))}
    </>
  );
}
