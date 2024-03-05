"use client"

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { buildingTypes } from "content/buildingTypes";

export default function HouseTypeSelection() {

  function RadioOption({ name, id }: { name: string, id: number }) {
    const value1 = name.toLowerCase().replace(' ', '-');
    return (
      <Label className="flex items-center space-x-2 p-2 hover:bg-gray-100" htmlFor={`r${id}`} >
        <RadioGroupItem value={value1} id={`r${id}`} />
        <span>{name}</span>
      </Label>
    )
  };

  return (
    <div>
      <h4>
        What is the purpose of the building?
      </h4>

      <RadioGroup name="type" defaultValue="single-family-home" className="grid gap-4 grid-cols-4 grid-rows-1">
        {Object.values(buildingTypes).map((v, i) => (
          <div key={i}>
            <h4 className="py-4">{v.type}</h4>
            <div>
              {v.subtypes.map((n, j) => <RadioOption key={j} id={i*100+j} name={n} />)}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}


