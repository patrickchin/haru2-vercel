import { PhotoIcon, } from '@heroicons/react/24/solid';
import SimpleLayout from '@/components/layout';
import { submitProjectPost } from '@/lib/actions';

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CountrySelector from './country-selector-simple';
// import CountrySelector from './country-selector';

function HouseTypeSelection() {

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
        Building Type
      </h4>

      <RadioGroup name="type" defaultValue="single-family-home" className="grid gap-4 grid-cols-4 grid-rows-1">
        <div>
          <h2 className="py-4">Residential</h2>
          <div>
            {residentialTypes.map((n, i) => <RadioOption key={i} id={i} name={n} />)}
          </div>
        </div>
        <div>
          <h2 className="py-4">Commercial</h2>
          {commercialTypes.map((n, i) => <RadioOption key={i} id={i + 100} name={n} />)}
        </div>
        <div>
          <h2 className="py-4">Entertainment</h2>
          {entertainmentTypes.map((n, i) => <RadioOption key={i} id={i + 200} name={n} />)}
        </div>
        <div>
          <h2 className="py-4">Industrial</h2>
          {industrialTypes.map((n, i) => <RadioOption key={i} id={i + 300} name={n} />)}
        </div>
      </RadioGroup>
    </div>
  )
}



function Questions() {

  const questions = [
    {
      name: "lifestyle", title: "Lifestyle", hints: [
        "How many people will be living in the house?",
        "Are there any other specific lifestyle preferences or routines to consider?"
      ]
    },
    {
      name: "future", title: "Future Plans", hints: [
        "Are there any plans for future expansions or modifications to the house?",
        "Do you have any long-term considerations, such as aging in place?"
      ]
    },
    {
      name: "energy", title: "Energy Efficiency and Sustainability", hints: [
        "Are you interested in incorporating energy-efficient or sustainable design elements?",
        "Do you have any preferences for eco-friendly materials?"
      ]
    },
    {
      name: "outdoors", title: "Outdoor Spaces", hints: [
        "Do you have any preferences for outdoor spaces such as gardens, patios, or decks?",
        "Are there specific views or orientations you would like to take advantage of?"
      ]
    },
    {
      name: "security", title: "Privacy and Security", hints: [
        "How important is privacy to you?",
        "Are there specific security considerations we should address?"
      ]
    },
    {
      name: "maintenance", title: "Maintenance Preference", hints: [
        "Are there specific materials or finishes you prefer for ease of maintenance?",
        "What level of maintenance are you comfortable with for the long term?"
      ]
    },
    {
      name: "special", title: "Special Requirements", hints: [
        "Do you have any specific needs such as accessibility features or special accommodations?",
      ]
    },
  ];

  return (
    <>
      {questions.map(
        (qa, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex space-x-8">
              <div className="w-1/2 flex flex-col space-y-2">
                <label htmlFor={qa.name} className="text-sm font-medium text-gray-900">
                  {qa.title}
                </label>
                <ul className="list-disc text-sm text-gray-600">
                  {qa.hints.map((hint, i) => (<li key={i}>{hint}</li>))}
                </ul>
              </div>
              <div className="w-1/2 flex flex-col pt-3">
                <Textarea
                  name={qa.name}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
                  defaultValue={''}
                />
              </div>
            </div>
            <Separator className="my-4" />
          </div>
        )
      )}
    </>
  );
}

function ExtraFiles() {
  return (
    <div>
      <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
        Do you have any files to attach?
      </label>
      <p className="block text-sm text-gray-900">Archutectural docments, land survey documents, legal documents</p>

      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
          <div className="mt-4 flex text-sm text-gray-600">
            <label
              htmlFor="files"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              <input id="files" name="files" type="file" className="sr-only" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
}

function Form() {
  return (
    <form action={submitProjectPost} className="flex flex-col space-y-4">

      <CountrySelector />

      <div className="flex flex-row h-16 items-center space-x-4">
        <Label className="text-lg">Project Title:</Label>
        <div className="flex-grow">
          <Input name="title" className="text-lg"/>
        </div>
      </div>

      <Separator className="my-4" />

      <HouseTypeSelection />

      <Separator className="my-4" />

      <Questions />

      <ExtraFiles />

      <Separator className="my-4" />

      <div className="mt-6 flex items-center justify-end gap-x-3">
        <Button asChild type="button" variant="secondary" >
          <Link href="/">
            Cancel
          </Link>
        </Button>
        <Button type="submit" >
          Save
        </Button>
      </div>
    </form>
  )
}

export default async function Page() {

  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16">

        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-8">
          New Project
        </h2>

        <Form />
      </section>
    </SimpleLayout>
  )
}