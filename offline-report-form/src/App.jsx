import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import "./App.css";
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
      <header className="App-header">Harpa Pro Construction Report Form</header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Report Title</h2>
        <input type="text" {...register("reportTitle")} />

        <h3>Materials Storage List</h3>
        <MaterialsList
          register={register}
          fields={materialFields}
          remove={removeMaterial}
          append={appendMaterial}
        />

        <h3>Equipment List</h3>
        <EquipmentList
          register={register}
          fields={equipmentFields}
          remove={removeEquipment}
          append={appendEquipment}
        />

        <h3>Construction Activity List</h3>
        <ActivitiesList register={register} control={control} fields={activityFields} />
        <button type="button" onClick={() => appendActivity()}>
          Add Activity
        </button>

        <h3>Extra Details</h3>
        <textarea {...register("extraDetails")} rows="5" cols="50" />

        <div>
          <button type="button" onClick={saveToLocalStorage}>
            Save to Cache
          </button>
          <button type="button" onClick={loadFromLocalStorage}>
            Load from Cache
          </button>
          <button type="button" onClick={resetForm}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}
