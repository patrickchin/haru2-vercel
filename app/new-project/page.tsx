"use client"

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PhotoIcon, } from '@heroicons/react/24/solid';
import { submitProjectForm } from '@/lib/actions';

import { Label } from "@/components/ui/label"
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import SimpleLayout from '@/components/layout';

import { questions } from 'content/questions';

import HouseTypeSelection from './components/building-type-selector';
import CountrySelectorSimple from './components/country-selector-simple';

function Questions() {
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

function NewProjectForm() {
  
  async function submitForm(formData: FormData) {
    console.log(formData);
    const newPost = await submitProjectForm(formData);
    if (newPost && newPost.length == 1) {
      redirect(`/project/${newPost[0].id}`);
    } else {
      console.log("Failed to submit a new project post\n");
      redirect("/");
    }
  }

  return (
    <form action={submitForm} className="flex flex-col space-y-4">

      <div className="flex flex-row h-16 items-center space-x-4">
        <Label className="text-lg">Project Title:</Label>
        <div className="flex-grow">
          <Input name="title" className="text-lg"/>
        </div>
      </div>
      <Separator className="my-4" />

      <CountrySelectorSimple />
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

export default function Page() {
  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16">
        <h2>New Project</h2>
        <NewProjectForm />
      </section>
    </SimpleLayout>
  )
}