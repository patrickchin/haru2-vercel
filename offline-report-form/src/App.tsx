import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import MaterialsList from "./MaterialsList";
import ActivitiesList from "./ActivitiesList";
import EquipmentList from "./EquipmentList";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card } from "./components/ui/card";
import {
  LucideCuboid,
  LucideEllipsis,
  LucideForklift,
  LucidePersonStanding,
} from "lucide-react";

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

  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
  } = useFieldArray({
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
      reportDate: new Date().toISOString().split("T")[0],
    });
  };

  const exportToFile = () => {
    const formData = getValues();
    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "harpapro-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  const [currentPage, setCurrentPage] = useState("form");

  const goToMaterialsList = () => setCurrentPage("materials");
  const goToEquipmentList = () => setCurrentPage("equipment");
  const goToActivitiesList = () => setCurrentPage("activities");
  const goToExtraDetails = () => setCurrentPage("extraDetails");
  const goBack = () => setCurrentPage("form");

  return (
    <div className="bg-gradient-to-t from-sky-100 to-indigo-200 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto min-h-96">
        {currentPage === "form" ? (
          <>
            <header className="font-bold p-4 text-xl">
              Harpa Pro Construction Report Form
            </header>
            <div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 p-4"
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="pr-4">
                        <label htmlFor="reportTitle">Report Title</label>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          id="reportTitle"
                          {...register("reportTitle")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pr-4">
                        <label htmlFor="reporterName">Reporter Name</label>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          id="reporterName"
                          {...register("reporterName")}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pr-4">
                        <label htmlFor="reportDate">Report Date</label>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          id="reportDate"
                          {...register("reportDate")}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Button
                  type="button"
                  onClick={goToMaterialsList}
                  variant="secondary"
                >
                  Materials Storage List <LucideCuboid />
                </Button>

                <Button
                  type="button"
                  onClick={goToEquipmentList}
                  variant="secondary"
                >
                  Equipment Storage List <LucideForklift />
                </Button>

                <Button
                  type="button"
                  onClick={goToActivitiesList}
                  variant="secondary"
                >
                  Construction Activities <LucidePersonStanding />
                </Button>

                <Button
                  type="button"
                  onClick={goToExtraDetails}
                  variant="secondary"
                >
                  Extra Details <LucideEllipsis />
                </Button>

                <div className="flex flex-col md:flex-row gap-2 p-4 border rounded bg-muted">
                  <Button
                    type="button"
                    onClick={saveToLocalStorage}
                    variant="outline"
                  >
                    Save to Cache
                  </Button>
                  <Button
                    type="button"
                    onClick={loadFromLocalStorage}
                    variant="outline"
                  >
                    Load from Cache
                  </Button>
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="destructive"
                  >
                    Reset Form
                  </Button>
                  <Button
                    type="button"
                    onClick={exportToFile}
                    variant="default"
                  >
                    Export to File
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : currentPage === "materials" ? (
          <>
            <header className="font-bold p-4 text-xl flex items-center">
              <Button type="button" onClick={goBack} className="mr-4">
                Back
              </Button>
              Materials Storage List
            </header>
            <div className="p-4">
              <MaterialsList
                register={register}
                fields={materialFields}
                remove={removeMaterial}
                append={appendMaterial}
              />
            </div>
          </>
        ) : currentPage === "equipment" ? (
          <>
            <header className="font-bold p-4 text-xl flex items-center">
              <Button type="button" onClick={goBack} className="mr-4">
                Back
              </Button>
              Equipment List
            </header>
            <div className="p-4">
              <EquipmentList
                register={register}
                fields={equipmentFields}
                remove={removeEquipment}
                append={appendEquipment}
              />
            </div>
          </>
        ) : currentPage === "activities" ? (
          <>
            <header className="font-bold p-4 text-xl flex items-center">
              <Button type="button" onClick={goBack} className="mr-4">
                Back
              </Button>
              Construction Activities
            </header>
            <div className="p-4">
              <ActivitiesList
                register={register}
                control={control}
                fields={activityFields}
                remove={removeActivity}
              />
              <Button
                type="button"
                onClick={() => appendActivity({})}
                variant="default"
              >
                Add Activity
              </Button>
            </div>
          </>
        ) : (
          <>
            <header className="font-bold p-4 text-xl flex items-center">
              <Button type="button" onClick={goBack} className="mr-4">
                Back
              </Button>
              Extra Details
            </header>
            <div className="p-4">
              <Textarea
                {...register("extraDetails")}
                rows={5}
                cols={50}
                className="mb-4 p-2 border rounded w-full"
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
