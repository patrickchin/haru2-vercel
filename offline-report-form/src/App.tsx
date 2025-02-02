import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import MaterialsList from "./MaterialsList";
import ActivitiesList from "./ActivitiesList";
import EquipmentList from "./EquipmentList";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";

export default function App() {
  const { register, control, handleSubmit, setValue, getValues, reset } =
    useForm();

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

  const { fields: activityFields, append: appendActivity, remove: removeActivity } = useFieldArray({
    control,
    name: "activities",
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const saveToLocalStorage = () => {
    const formData = getValues();
    localStorage.setItem("formData", JSON.stringify(formData));
  };

  const loadFromLocalStorage = React.useCallback(() => {
    const savedData = localStorage.getItem("formData")
      ? JSON.parse(localStorage.getItem("formData") as string)
      : null;
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

  const exportToFile = () => {
    const formData = getValues();
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "harpapro-report.txt";
    a.click();
    URL.revokeObjectURL(url);
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
        <input
          type="text"
          {...register("reportTitle")}
          className="mb-4 p-2 border rounded w-full"
        />

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
        <ActivitiesList
          register={register}
          control={control}
          fields={activityFields}
          remove={removeActivity}
        />
        <Button type="button" onClick={() => appendActivity({})} variant="default">
          Add Activity
        </Button>

        <h3 className="text-xl mb-4">Extra Details</h3>
        <Textarea
          {...register("extraDetails")}
          rows={5}
          cols={50}
          className="mb-4 p-2 border rounded w-full"
        />

        <div className="flex space-x-2">
          <Button type="button" onClick={saveToLocalStorage} variant="secondary">
            Save to Cache
          </Button>
          <Button type="button" onClick={loadFromLocalStorage} variant="secondary">
            Load from Cache
          </Button>
          <Button type="button" onClick={resetForm} variant="destructive">
            Reset Form
          </Button>
          <Button type="button" onClick={exportToFile} variant="default">
            Export to File
          </Button>
        </div>
      </form>
    </div>
  );
}
