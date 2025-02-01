import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import MaterialsList from "./MaterialsList";
import ActivitiesList from "./ActivitiesList";
import EquipmentList from "./EquipmentList";

export default function App() {
  const { register, control, handleSubmit, setValue, getValues, reset } = useForm();

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({
    control,
    name: "materials",
  });

  const {
    fields: equipmentFields,
    append: appendEquipment,
    remove: removeEquipment,
  } = useFieldArray({
    control,
    name: "equipment",
  });

  const { fields: activityFields, append: appendActivity } = useFieldArray({
    control,
    name: "activities",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const saveToLocalStorage = () => {
    const formData = getValues();
    localStorage.setItem("formData", JSON.stringify(formData));
  };

  const loadFromLocalStorage = React.useCallback(() => {
    const savedData = JSON.parse(localStorage.getItem("formData"));
    if (savedData) {
      Object.keys(savedData).forEach((key) => {
        setValue(key, savedData[key]);
      });
    }
  }, [setValue]);

  const resetForm = () => {
    reset({
      reportTitle: "",
      materials: [],
      equipment: [],
      activities: [],
      extraDetails: "",
    });
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <div className="App">
      <header className="App-header bg-gray-800 text-white p-4 text-xl">
        Harpa Pro Construction Report Form
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <h2 className="text-2xl mb-4">Report Title</h2>
        <input type="text" {...register("reportTitle")} className="mb-4 p-2 border rounded w-full" />

        <h3 className="text-xl mb-4">Materials Storage List</h3>
        <MaterialsList
          register={register}
          fields={materialFields}
          remove={removeMaterial}
          append={appendMaterial}
        />

        <h3 className="text-xl mb-4">Equipment List</h3>
        <EquipmentList
          register={register}
          fields={equipmentFields}
          remove={removeEquipment}
          append={appendEquipment}
        />

        <h3 className="text-xl mb-4">Construction Activity List</h3>
        <ActivitiesList register={register} control={control} fields={activityFields} />
        <button type="button" onClick={() => appendActivity()} className="mb-4 p-2 bg-blue-500 text-white rounded">
          Add Activity
        </button>

        <h3 className="text-xl mb-4">Extra Details</h3>
        <textarea {...register("extraDetails")} rows="5" cols="50" className="mb-4 p-2 border rounded w-full" />

        <div className="flex space-x-2">
          <button type="button" onClick={saveToLocalStorage} className="p-2 bg-green-500 text-white rounded">
            Save to Cache
          </button>
          <button type="button" onClick={loadFromLocalStorage} className="p-2 bg-yellow-500 text-white rounded">
            Load from Cache
          </button>
          <button type="button" onClick={resetForm} className="p-2 bg-red-500 text-white rounded">
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}
