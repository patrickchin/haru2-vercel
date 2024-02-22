"use client"

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const residentialTypes = [
  "Single Family Home",
  "Multi Family Home",
  "Town House",
  "Apartment",
  "Condominuim",
  "Mobile Home",
  "Modular Home",
  "Student Housing",
  "Duplexe",
  "Mansion",
  "Others (specify)",
];

const commercialTypes = [
  "Office Building",
  "Convention Center",
  "Shopping Center/Mall",
  "Hotel",
  "Restaurant",
  "Bank",
  "Medical Facility",
  "Educational Building",
  "Retail Building",
  "Parking Structure",
  "Others (specify)",
];

const entertainmentTypes = [
  "Theater",
  "Museum/Art Gallery",
  "Sports Facility",
  "Amphitheater",
  "Cinema",
  "Night Club",
  "Casino",
  "Theme Park",
  "Concert Hall",
  "Library",
  "Others (specify)",
];

const industrialTypes = [
  "Factory",
  "Mills",
  "Processing Plant",
  "Cold Storage Facility",
  "Data Center",
  "Warehouse",
  "Others (specify)",
];

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
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        What is the purpose of the building?
      </h4>

      <RadioGroup name="type" defaultValue="single-family-home" className="grid gap-4 grid-cols-4 grid-rows-1">
        <div>
          <h4 className="py-4">Residential</h4>
          <div>
            {residentialTypes.map((n, i) => <RadioOption key={i} id={i} name={n} />)}
          </div>
        </div>
        <div>
          <h4 className="py-4">Commercial</h4>
          {commercialTypes.map((n, i) => <RadioOption key={i} id={i + 100} name={n} />)}
        </div>
        <div>
          <h4 className="py-4">Entertainment</h4>
          {entertainmentTypes.map((n, i) => <RadioOption key={i} id={i + 200} name={n} />)}
        </div>
        <div>
          <h4 className="py-4">Industrial</h4>
          {industrialTypes.map((n, i) => <RadioOption key={i} id={i + 300} name={n} />)}
        </div>
      </RadioGroup>
    </div>
  )
}


